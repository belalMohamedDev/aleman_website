import { apiClient } from '../../infrastructure/api/apiClient';
import type {
  UserAddress,
  CreateAddressDto,
  CalculateShippingRequestDto,
  CalculateShippingResponseDto,
  CreateOrderRequestDto,
  OrderResponseDto,
} from './types';

export const orderService = {
  async getAddresses(): Promise<UserAddress[]> {
    return apiClient<UserAddress[]>('/api/user-addresses');
  },

  async createAddress(data: CreateAddressDto): Promise<UserAddress> {
    return apiClient<UserAddress>('/api/user-addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async calculateShipping(data: CalculateShippingRequestDto): Promise<CalculateShippingResponseDto> {
    return apiClient<CalculateShippingResponseDto>('/api/Orders/calculate-shipping', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createOrder(data: CreateOrderRequestDto): Promise<OrderResponseDto> {
    return apiClient<OrderResponseDto>('/api/Orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getOrderById(id: number): Promise<OrderResponseDto> {
    return apiClient<OrderResponseDto>(`/api/Orders/${id}`);
  },

  async getOrderByNumber(orderNumber: string): Promise<OrderResponseDto> {
    return apiClient<OrderResponseDto>(`/api/Orders/by-number/${orderNumber}`);
  },

  async getMyOrders(): Promise<OrderResponseDto[]> {
    const res = await apiClient<any>('/api/Orders');
    return res.orders || (Array.isArray(res) ? res : []);
  },
};
