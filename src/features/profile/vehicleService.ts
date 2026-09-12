import { apiClient } from '../../infrastructure/api/apiClient';
import type { UserVehicle, CreateVehicleDto, UpdateVehicleDto } from './types';

export const vehicleService = {
  async getVehicles(): Promise<UserVehicle[]> {
    const res = await apiClient<UserVehicle[]>('/api/user-vehicles');
    return Array.isArray(res) ? res : [];
  },

  async createVehicle(data: CreateVehicleDto): Promise<UserVehicle> {
    return apiClient<UserVehicle>('/api/user-vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateVehicle(id: string, data: UpdateVehicleDto): Promise<UserVehicle> {
    return apiClient<UserVehicle>(`/api/user-vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteVehicle(id: string): Promise<void> {
    return apiClient<void>(`/api/user-vehicles/${id}`, {
      method: 'DELETE',
    });
  },

  async setDefaultVehicle(id: string): Promise<void> {
    return apiClient<void>(`/api/user-vehicles/${id}/set-default`, {
      method: 'PATCH',
    });
  },
};
