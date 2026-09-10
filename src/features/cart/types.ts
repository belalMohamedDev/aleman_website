export interface CartItem {
  id: string; // string or number id
  productId: number;
  productName: string;
  productImageUrl: string;
  productPackageId: number;
  packageWeightKg: number;
  unitPrice: number;
  pricePerTon: number;
  quantity: number; // number of bags (شكائر)
  subtotal: number;
  totalWeightKg: number;
  totalWeightTons: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItemsCount: number;
  totalWeightKg: number;
  totalWeightTons: number;
  totalPrice: number;
}
