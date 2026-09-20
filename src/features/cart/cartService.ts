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

    // Deduplicate items by ID and ProductPackageId to prevent transient duplicate renders
    const rawItems: any[] = data.items || [];
    const itemMap = new Map<string, any>();

    for (const raw of rawItems) {
      const key = raw.productPackageId ? `pkg-${raw.productPackageId}` : `item-${raw.id}`;
      if (itemMap.has(key)) {
        const existing = itemMap.get(key);
        // If identical item ID was duplicated in-memory, ignore the duplicate
        if (String(existing.id) === String(raw.id)) {
          continue;
        }
        // If same package was added separately, merge quantity
        existing.quantity = (existing.quantity || 1) + (raw.quantity || 1);
        existing.subtotal = (existing.subtotal ?? 0) + (raw.subtotal ?? ((raw.quantity || 1) * (raw.unitPrice || 0)));
        existing.totalWeightKg = (existing.totalWeightKg ?? 0) + (raw.totalWeightKg ?? ((raw.quantity || 1) * (raw.packageWeightKg || 0)));
      } else {
        itemMap.set(key, { ...raw });
      }
    }

    const uniqueRawItems = Array.from(itemMap.values());

    const items: CartItem[] = uniqueRawItems.map((item: any) => ({
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

    const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalWeightKg = items.reduce((sum, i) => sum + i.totalWeightKg, 0);
    const totalWeightTons = Number((totalWeightKg / 1000).toFixed(2));
    const totalPrice = items.reduce((sum, i) => sum + i.subtotal, 0);

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
