import { useState, useEffect, useCallback } from 'react';
import { profileOrderService } from './orderService';
import type { OrderResponse, OrderStatus } from './types';
import { toast } from 'sonner';

export function useMerchantOrders(isAuthenticated: boolean) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await profileOrderService.getSmallMerchantOrders({
        status: statusFilter,
        page,
        pageSize: 20,
      });
      setOrders(res.orders);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || res.orders.length);
    } catch (err: any) {
      toast.error(err?.message || 'تعذر تحميل طلبات صغار التجار');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, statusFilter, page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchesCustomer = o.customerName?.toLowerCase().includes(term);
    const matchesNumber = o.orderNumber.toLowerCase().includes(term);
    return matchesCustomer || matchesNumber;
  });

  return {
    orders: filteredOrders,
    rawOrders: orders,
    isLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    totalCount,
    loadOrders,
  };
}
