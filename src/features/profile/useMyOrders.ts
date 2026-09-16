import { useState, useEffect, useCallback } from 'react';
import { profileOrderService } from './orderService';
import type { OrderResponse, OrderStatus } from './types';
import { toast } from 'sonner';

export function useMyOrders(isAuthenticated: boolean) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await profileOrderService.getMyOrders({
        status: statusFilter,
        page,
        pageSize: 100,
      });
      setOrders(res.orders);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || res.orders.length);
    } catch (err: any) {
      toast.error(err?.message || 'تعذر تحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, statusFilter, page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const cancelOrder = async (id: number): Promise<boolean> => {
    try {
      await profileOrderService.cancelOrder(id);
      toast.success('تم إلغاء الطلب بنجاح');
      loadOrders();
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'تعذر إلغاء الطلب');
      return false;
    }
  };

  return {
    orders,
    isLoading,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    totalCount,
    loadOrders,
    cancelOrder,
  };
}
