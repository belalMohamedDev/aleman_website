import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  PackageIcon,
  ClockIcon,
  CreditCardIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from 'lucide-react';
import { useNotifications } from '../../features/notifications/useNotifications';
import type { NotificationItem } from '../../features/notifications/types';

interface NotificationBellProps {
  isAuthenticated: boolean;
  isTransparent?: boolean;
}

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} د`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} س`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function getNotificationIcon(title: string, body: string) {
  const content = `${title} ${body}`.toLowerCase();
  if (content.includes('سداد') || content.includes('إيصال') || content.includes('تحويل') || content.includes('بنك')) {
    return {
      icon: CreditCardIcon,
      bg: 'bg-purple-50 text-purple-600 border border-purple-100',
    };
  }
  if (content.includes('تأكيد') || content.includes('اعتماد') || content.includes('موافقة') || content.includes('تم')) {
    return {
      icon: CheckCircle2Icon,
      bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    };
  }
  if (content.includes('رفض') || content.includes('إلغاء') || content.includes('تنبيه')) {
    return {
      icon: AlertTriangleIcon,
      bg: 'bg-rose-50 text-rose-600 border border-rose-100',
    };
  }
  return {
    icon: PackageIcon,
    bg: 'bg-blue-50 text-blue-600 border border-blue-100',
  };
}

export function NotificationBell({ isAuthenticated, isTransparent = false }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    loadNotifications,
  } = useNotifications(isAuthenticated);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated) return null;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'unread') return !item.isRead;
    return true;
  });

  const handleItemClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);

    // Navigate to profile orders
    navigate('/profile');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          const willOpen = !isOpen;
          setIsOpen(willOpen);
          if (willOpen) {
            loadNotifications(1);
          }
        }}
        className={`focus-ring relative flex h-10 w-10 items-center justify-center rounded-full border transition ${isTransparent
          ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
          : 'border-slate-200 bg-slate-50 text-ink-soft hover:border-brand-300 hover:text-brand-600 hover:bg-white'
          }`}
        aria-label="الإشعارات"
        aria-expanded={isOpen}
      >
        <BellIcon className="h-4 w-4" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-md ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full ltr:right-0 rtl:left-0 z-50 mt-2 w-[340px] sm:w-[380px] max-w-[calc(100vw-24px)] rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-ink">الإشعارات</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-black text-brand-700">
                  {unreadCount} جديد
                </span>
              )}
            </div>

            {/* <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-brand-600 transition px-2 py-1 rounded-lg hover:bg-slate-50"
                  title="تحديد الكل كمقروء"
                >
                  <CheckCheckIcon className="h-3.5 w-3.5" />
                  <span>تحديد الكل</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div> */}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 pt-2.5 pb-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`flex-1 rounded-xl py-1.5 text-xs font-bold transition ${activeFilter === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`flex-1 rounded-xl py-1.5 text-xs font-bold transition ${activeFilter === 'unread'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              غير المقروءة ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto no-scrollbar divide-y divide-slate-50 pr-0.5 mt-1 -mx-2 px-2">
            {isLoading && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-400">
                جاري تحميل الإشعارات...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <div className="mx-auto w-36 h-36 relative flex items-center justify-center mb-2">
                  <img
                    src="/aleman_parallax_assets/notification.webp"
                    alt="لا توجد إشعارات حالياً"
                    className="w-full h-full object-contain filter drop-shadow-md animate-in fade-in zoom-in-95 duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="text-xs font-black text-slate-800">لا توجد إشعارات حالياً</p>
                <p className="text-[11px] font-medium text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                  ستتلقى إشعارات فورية هنا فور حدوث أي تحديث على طلباتك
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const iconMeta = getNotificationIcon(item.title, item.body);
                const IconComponent = iconMeta.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`group relative flex items-start gap-3 rounded-2xl p-3 text-start transition cursor-pointer ${item.isRead ? 'hover:bg-slate-50/80' : 'bg-brand-50/20 hover:bg-brand-50/40'
                      }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${iconMeta.bg}`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs truncate ${item.isRead ? 'font-bold text-slate-700' : 'font-black text-ink'
                            }`}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-0.5">
                          <ClockIcon className="h-2.5 w-2.5" />
                          <span>{formatTimeAgo(item.createdAt)}</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.body}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-brand-600 shrink-0 mt-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>



        </div>
      )}
    </div>
  );
}
