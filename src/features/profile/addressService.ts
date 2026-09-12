import { apiClient } from '../../infrastructure/api/apiClient';
import type { UserAddress, CreateAddressDto, UpdateAddressDto } from './types';

export const addressService = {
  async getAddresses(): Promise<UserAddress[]> {
    const res = await apiClient<UserAddress[]>('/api/user-addresses');
    return Array.isArray(res) ? res : [];
  },

  async createAddress(data: CreateAddressDto): Promise<UserAddress> {
    return apiClient<UserAddress>('/api/user-addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAddress(id: string, data: UpdateAddressDto): Promise<UserAddress> {
    return apiClient<UserAddress>(`/api/user-addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAddress(id: string): Promise<void> {
    return apiClient<void>(`/api/user-addresses/${id}`, {
      method: 'DELETE',
    });
  },

  async setDefaultAddress(id: string): Promise<void> {
    return apiClient<void>(`/api/user-addresses/${id}/set-default`, {
      method: 'PATCH',
    });
  },
};
