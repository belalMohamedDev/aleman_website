export interface ProductPackage {
  id: number;
  productId: number;
  weightKg: number;
  price: number;
  pricePerTon: number;
  isActive: boolean;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface Product {
  id: number;
  categoryId: number;
  sapProductId?: string;
  name: string;
  description: string;
  imageUrl?: string;
  images?: ProductImage[];
  isActive: boolean;
  createdAt?: string;
  lastPriceSyncDate?: string | null;
  proteinPercentage?: number;
  growthStage?: number;
  feedForm?: number;
  ingredients?: string;
  additives?: string;
  packages: ProductPackage[];
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
}

import { resolveMediaUrl } from '../../infrastructure/api/apiClient';

/**
 * Returns the primary image URL for a product, with safe fallbacks
 */
export function getProductPrimaryImage(
  product?: { imageUrl?: string | null; images?: ProductImage[] | null } | null
): string {
  if (!product) return '/hero_farm_bg.webp';
  if (product.images && product.images.length > 0) {
    const sorted = [...product.images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const primary = sorted.find((img) => img.isPrimary && img.imageUrl);
    if (primary?.imageUrl) return resolveMediaUrl(primary.imageUrl);
    const first = sorted.find((img) => Boolean(img.imageUrl));
    if (first?.imageUrl) return resolveMediaUrl(first.imageUrl);
  }
  return resolveMediaUrl(product.imageUrl) || '/hero_farm_bg.webp';
}

/**
 * Returns all image URLs for a product sorted by primary and displayOrder
 */
export function getProductImages(
  product?: { imageUrl?: string | null; images?: ProductImage[] | null } | null
): string[] {
  if (!product) return [];
  if (product.images && product.images.length > 0) {
    const sorted = [...product.images]
      .filter((img) => Boolean(img.imageUrl))
      .sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      });
    const urls = sorted.map((img) => resolveMediaUrl(img.imageUrl));
    if (urls.length > 0) return urls;
  }
  return product.imageUrl ? [resolveMediaUrl(product.imageUrl)] : [];
}
