export interface ProductPackage {
  id: number;
  productId: number;
  weightKg: number;
  price: number;
  pricePerTon: number;
  isActive: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  sapProductId?: string;
  name: string;
  description: string;
  imageUrl: string;
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
