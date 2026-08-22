import { api } from '@/lib/apiClient';

export interface VendorNotification {
  id: string;
  category: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string | null;
  jobId: string | null;
}

export interface NotificationListResult {
  data: VendorNotification[];
  total: number;
  unreadCount: number;
}

interface ApiNotification {
  id: number | string;
  category: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string | null;
  jobId?: number | string | null; // present once the backend ships the AW2 worker; absent until then
}

interface ApiNotificationListResponse {
  data: ApiNotification[];
  total: number;
  unreadCount: number;
}

function toVendorNotification(raw: ApiNotification): VendorNotification {
  return {
    id: String(raw.id),
    category: raw.category,
    title: raw.title,
    body: raw.body,
    read: raw.read,
    createdAt: raw.createdAt,
    jobId: raw.jobId != null ? String(raw.jobId) : null,
  };
}

export async function getNotifications(role?: 'vendor' | 'technician'): Promise<NotificationListResult> {
  const query = role ? `?role=${role}` : '';
  const res = await api.get<ApiNotificationListResponse>(`/mobile/notifications${query}`);
  return {
    data: res.data.map(toVendorNotification),
    total: res.total,
    unreadCount: res.unreadCount,
  };
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.post<void>(`/mobile/notifications/${id}/read`, {});
}
