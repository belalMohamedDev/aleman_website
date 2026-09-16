export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  data?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RegisterDeviceTokenRequest {
  fcmToken: string;
  deviceType?: string;
  deviceId?: string;
  appVersion?: string;
}

export interface RemoveDeviceTokenRequest {
  fcmToken: string;
}

export interface SendTestNotificationRequest {
  userId?: string;
  fcmToken?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sendToAll?: boolean;
}
