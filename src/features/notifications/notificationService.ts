import { apiClient } from '../../infrastructure/api/apiClient';
import type {
  NotificationListResponse,
  RegisterDeviceTokenRequest,
  RemoveDeviceTokenRequest,
  SendTestNotificationRequest,
} from './types';

export const notificationService = {
  /**
   * Get paginated notifications for current logged in user
   */
  async getNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
    return apiClient<NotificationListResponse>(`/api/notifications?page=${page}&limit=${limit}`);
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    const res = await apiClient<{ unread_count: number }>('/api/notifications/unread-count');
    return res.unread_count ?? 0;
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(id: number): Promise<boolean> {
    const res = await apiClient<{ message: string }>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return Boolean(res);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<number> {
    const res = await apiClient<{ message: string; updated_count?: number }>('/api/notifications/mark-all-read', {
      method: 'POST',
    });
    return res.updated_count ?? 0;
  },

  /**
   * Register device FCM token with backend
   */
  async registerDeviceToken(dto: RegisterDeviceTokenRequest): Promise<boolean> {
    const res = await apiClient<{ message: string }>('/api/notifications/register-token', {
      method: 'POST',
      body: JSON.stringify({
        fcmToken: dto.fcmToken,
        deviceType: dto.deviceType || 'web',
        deviceId: dto.deviceId || undefined,
        appVersion: dto.appVersion || '1.0.0',
      }),
    });
    return Boolean(res);
  },

  /**
   * Remove device FCM token (on logout)
   */
  async removeDeviceToken(dto: RemoveDeviceTokenRequest): Promise<boolean> {
    const res = await apiClient<{ message: string }>('/api/notifications/remove-token', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return Boolean(res);
  },

  /**
   * Send test notification (for verification)
   */
  async sendTestNotification(dto: SendTestNotificationRequest): Promise<boolean> {
    const res = await apiClient<{ success: boolean; message: string }>('/api/notifications/send-test', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.success;
  },
};
