import { apiClient } from '../../infrastructure/api/apiClient';
import type { CartItem, CartSummary } from './types';
import type { Product, ProductPackage } from '../products/types';

export const cartService = {
  mapBackendCart(data: any): CartSummary {
    if (!data) {
      return {
        items: [],
        totalItemsCount: 0,
        totalWeightKg: 0,
        totalWeightTons: 0,
        totalPrice: 0,
      };
    }

    const items: CartItem[] = (data.items || []).map((item: any) => ({
      id: String(item.id),
      productId: item.productId,
      productName: item.productName || '',
      productImageUrl: item.productImageUrl || item.imageUrl || (item.images && item.images[0]?.imageUrl) || '',
      productPackageId: item.productPackageId,
      packageWeightKg: item.packageWeightKg || 0,
      unitPrice: item.unitPrice || 0,
      pricePerTon: item.pricePerTon || 0,
      quantity: item.quantity || 1,
      subtotal: item.subtotal ?? (item.quantity * item.unitPrice),
      totalWeightKg: item.totalWeightKg ?? (item.quantity * (item.packageWeightKg || 0)),
      totalWeightTons: Number(((item.totalWeightKg ?? (item.quantity * (item.packageWeightKg || 0))) / 1000).toFixed(2)),
    }));

    const totalItemsCount = data.totalItemsCount ?? items.reduce((sum, i) => sum + i.quantity, 0);
    const totalWeightKg = data.totalWeightKg ?? items.reduce((sum, i) => sum + i.totalWeightKg, 0);
    const totalWeightTons = data.totalWeightTons ?? Number((totalWeightKg / 1000).toFixed(2));
    const totalPrice = data.totalPrice ?? items.reduce((sum, i) => sum + i.subtotal, 0);

    return {
      items,
      totalItemsCount,
      totalWeightKg,
      totalWeightTons,
      totalPrice,
    };
  },

  async getBackendCart(): Promise<CartSummary> {
    const data = await apiClient<any>('/api/Cart');
    return this.mapBackendCart(data);
  },

  async addItemToBackend(product: Product, pkg: ProductPackage, quantity: number): Promise<CartSummary> {
    const data = await apiClient<any>('/api/Cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        productPackageId: pkg.id,
        packageWeightKg: pkg.weightKg,
        quantity,
      }),
    });
    return this.mapBackendCart(data);
  },

  async updateQuantityInBackend(itemId: string, quantity: number): Promise<CartSummary> {
    const data = await apiClient<any>(`/api/Cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        quantity,
      }),
    });
    return this.mapBackendCart(data);
  },

  async removeItemFromBackend(itemId: string): Promise<void> {
    await apiClient(`/api/Cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  async clearBackendCart(): Promise<void> {
    await apiClient('/api/Cart', {
      method: 'DELETE',
    });
  },

  calculateSummary(items: CartItem[]): CartSummary {
    let totalItemsCount = 0;
    let totalWeightKg = 0;
    let totalPrice = 0;

    for (const item of items) {
      totalItemsCount += item.quantity;
      totalWeightKg += item.quantity * item.packageWeightKg;
      totalPrice += item.quantity * item.unitPrice;
    }

    const totalWeightTons = Number((totalWeightKg / 1000).toFixed(2));

    return {
      items,
      totalItemsCount,
      totalWeightKg,
      totalWeightTons,
      totalPrice,
    };
  },
};
