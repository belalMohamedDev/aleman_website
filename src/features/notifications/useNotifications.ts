import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from './notificationService';
import { requestFcmToken, onForegroundMessage } from './firebaseConfig';
import type { NotificationItem } from './types';
import { toast } from 'sonner';

export function useNotifications(isAuthenticated: boolean) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const tokenRegisteredRef = useRef<boolean>(false);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Ignore polling errors
    }
  }, [isAuthenticated]);

  // Load notifications list
  const loadNotifications = useCallback(async (pageNum = 1) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications(pageNum, 20);
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load and periodic polling every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      tokenRegisteredRef.current = false;
      return;
    }

    loadUnreadCount();
    loadNotifications(1);

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, loadUnreadCount, loadNotifications]);

  // Register Firebase Token with backend on login
  useEffect(() => {
    if (!isAuthenticated || tokenRegisteredRef.current) return;

    const setupFcm = async () => {
      try {
        const token = await requestFcmToken();
        if (token) {
          await notificationService.registerDeviceToken({
            fcmToken: token,
            deviceType: 'web',
            appVersion: '1.0.0',
          });
          tokenRegisteredRef.current = true;
          // Store token in sessionStorage for logout cleanup
          sessionStorage.setItem('fcm_web_token', token);
        }
      } catch (e) {
        console.warn('FCM token registration skipped/failed:', e);
      }
    };

    setupFcm();
  }, [isAuthenticated]);

  // Foreground notification listener (when user is using the app)
  useEffect(() => {
    if (!isAuthenticated) return;

    let cleanupListener: (() => void) | null = null;

    onForegroundMessage((payload) => {
      const title = payload.notification?.title || 'إشعار جديد من الإيمان';
      const body = payload.notification?.body || '';

      // Play soft toast
      toast.info(title, {
        description: body,
        duration: 6000,
      });

      // Refresh notifications & unread count
      loadUnreadCount();
      loadNotifications(1);
    }).then((unsub) => {
      if (unsub) cleanupListener = unsub;
    });

    return () => {
      if (cleanupListener) cleanupListener();
    };
  }, [isAuthenticated, loadUnreadCount, loadNotifications]);

  // Mark single as read
  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
    } catch {
      toast.error('تعذر تحديث الإشعارات');
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    page,
    totalPages,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
  };
}
