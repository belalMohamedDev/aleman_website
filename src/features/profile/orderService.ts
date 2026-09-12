import { apiClient } from '../../infrastructure/api/apiClient';
import type { OrderResponse, OrderListResponse, OrderStatus } from './types';

export const profileOrderService = {
  async getMyOrders(params?: { status?: OrderStatus; page?: number; pageSize?: number }): Promise<OrderListResponse> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/api/Orders?${queryString}` : '/api/Orders';
    
    const res = await apiClient<any>(endpoint);
    if (Array.isArray(res)) {
      return {
        orders: res,
        totalCount: res.length,
        page: 1,
        pageSize: res.length,
        totalPages: 1,
      };
    }
    return {
      orders: res.orders || [],
      totalCount: res.totalCount || 0,
      page: res.page || 1,
      pageSize: res.pageSize || 10,
      totalPages: res.totalPages || 1,
    };
  },

  async getSmallMerchantOrders(params?: { status?: OrderStatus; page?: number; pageSize?: number }): Promise<OrderListResponse> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/api/Orders/small-merchants?${queryString}` : '/api/Orders/small-merchants';

    const res = await apiClient<any>(endpoint);
    if (Array.isArray(res)) {
      return {
        orders: res,
        totalCount: res.length,
        page: 1,
        pageSize: res.length,
        totalPages: 1,
      };
    }
    return {
      orders: res.orders || [],
      totalCount: res.totalCount || 0,
      page: res.page || 1,
      pageSize: res.pageSize || 10,
      totalPages: res.totalPages || 1,
    };
  },

  async getOrderById(id: number): Promise<OrderResponse> {
    return apiClient<OrderResponse>(`/api/Orders/${id}`);
  },

  async cancelOrder(id: number): Promise<void> {
    return apiClient<void>(`/api/Orders/${id}/cancel`, {
      method: 'POST',
    });
  },
};
