import { apiClient } from '../../infrastructure/api/apiClient';

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  categoryId: number;
  categoryName: string;
  minPrice: number;
  maxPrice: number;
  isActive: boolean;
  addedAt: string;
}

export const wishlistService = {
  /** Toggle a product in/out of the wishlist — primary action */
  async toggle(productId: number): Promise<{ added: boolean }> {
    return apiClient<{ added: boolean }>(`/api/wishlist/toggle/${productId}`, {
      method: 'POST',
    });
  },

  /** Get full wishlist with product details */
  async getWishlist(): Promise<WishlistItem[]> {
    return apiClient<WishlistItem[]>('/api/wishlist');
  },

  /** Get only product IDs — lightweight call for initializing state */
  async getIds(): Promise<number[]> {
    return apiClient<number[]>('/api/wishlist/ids');
  },

  /** Check if a single product is in the wishlist */
  async check(productId: number): Promise<boolean> {
    return apiClient<boolean>(`/api/wishlist/check/${productId}`);
  },

  /** Count of items in the wishlist */
  async getCount(): Promise<number> {
    return apiClient<number>('/api/wishlist/count');
  },

  /** Remove a specific product */
  async remove(productId: number): Promise<void> {
    await apiClient(`/api/wishlist/${productId}`, { method: 'DELETE' });
  },

  /** Clear the entire wishlist */
  async clear(): Promise<void> {
    await apiClient('/api/wishlist', { method: 'DELETE' });
  },
};
