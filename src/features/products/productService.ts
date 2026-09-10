import { apiClient } from '../../infrastructure/api/apiClient';
import type { Category, Product } from './types';

export const productService = {
  async getCategories(): Promise<Category[]> {
    return apiClient<Category[]>('/api/Categories');
  },

  async getProducts(categoryId?: number): Promise<Product[]> {
    const endpoint = categoryId ? `/api/Products?categoryId=${categoryId}` : '/api/Products';
    return apiClient<Product[]>(endpoint);
  },

  async getProductById(id: number): Promise<Product> {
    return apiClient<Product>(`/api/Products/${id}`);
  },
};
