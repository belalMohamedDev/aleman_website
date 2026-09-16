export enum OrderStatus {
  Pending = 1,
  Confirmed = 2,
  Processing = 3,
  Shipped = 4,
  Delivered = 5,
  Cancelled = 6,
  Refunded = 7,
}

export const ORDER_STATUS_META: Record<OrderStatus, { labelAr: string; labelEn: string; color: string; bg: string }> = {
  [OrderStatus.Pending]: { labelAr: 'قيد الانتظار', labelEn: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  [OrderStatus.Confirmed]: { labelAr: 'تم التأكيد', labelEn: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  [OrderStatus.Processing]: { labelAr: 'قيد التجهيز', labelEn: 'Processing', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  [OrderStatus.Shipped]: { labelAr: 'جاري التوصيل / الشحن', labelEn: 'Shipped', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  [OrderStatus.Delivered]: { labelAr: 'تم التسليم بنجاح', labelEn: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  [OrderStatus.Cancelled]: { labelAr: 'ملغي', labelEn: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  [OrderStatus.Refunded]: { labelAr: 'مسترجع', labelEn: 'Refunded', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
};

export enum OrderType {
  Delivery = 1,
  Pickup = 2,
}

export enum PaymentMethod {
  CashOnDelivery = 1,
  BankTransferOrOnline = 2,
}

export interface UserAddress {
  id: string;
  label?: string | null;
  city: string;
  street: string;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  isDefault: boolean;
  createdAt?: string;
}

export interface CreateAddressDto {
  label?: string | null;
  city: string;
  street: string;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  label?: string | null;
  city?: string | null;
  street?: string | null;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
}

export interface UserVehicle {
  id: string;
  driverName: string;
  vehiclePlateNumber: string;
  driverLicenseNumber?: string | null;
  driverPhone?: string | null;
  vehicleType?: string | null;
  notes?: string | null;
  isDefault: boolean;
  createdAt?: string;
}

export interface CreateVehicleDto {
  driverName: string;
  vehiclePlateNumber: string;
  driverLicenseNumber?: string | null;
  driverPhone?: string | null;
  vehicleType?: string | null;
  notes?: string | null;
  isDefault?: boolean;
}

export interface UpdateVehicleDto {
  driverName: string;
  vehiclePlateNumber: string;
  driverLicenseNumber?: string | null;
  driverPhone?: string | null;
  vehicleType?: string | null;
  notes?: string | null;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName?: string | null;
  productImageUrl?: string | null;
  productPackageId: number;
  packageWeightKg: number;
  packageSize?: string | null;
  unitPrice: number;
  pricePerTon: number;
  quantity: number;
  subtotal: number;
  totalWeightKg: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  userId?: string;
  customerName?: string | null;
  orderType: number;
  orderTypeName?: string | null;
  status: number;
  statusName?: string | null;
  paymentMethod: number;
  paymentMethodName?: string | null;
  isPaid?: boolean;
  paidAt?: string | null;
  addressId?: string | null;
  deliveryAddress?: UserAddress | null;
  truckType?: number | null;
  truckName?: string | null;
  vehicleId?: string | null;
  vehicle?: UserVehicle | null;
  driverName?: string | null;
  vehiclePlateNumber?: string | null;
  driverLicenseNumber?: string | null;
  driverPhone?: string | null;
  expectedPickupDate?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  couponCode?: string | null;
  totalAmount: number;
  totalWeightKg: number;
  totalWeightTons: number;
  totalItemsCount?: number;
  notes?: string | null;
  parentMerchantId?: string | null;
  parentMerchantName?: string | null;
  merchantApprovedAt?: string | null;
  merchantRejectionReason?: string | null;
  adminApprovedAt?: string | null;
  adminRejectionReason?: string | null;
  paymentReceiptUrl?: string | null;
  createdAt: string;
  items?: OrderItem[] | null;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

export interface CustomerSummary {
  name: string;
  ordersCount: number;
  totalTons: number;
  totalAmount: number;
  lastOrderDate: string;
  lastOrderNumber: string;
  orders: OrderResponse[];
}

export type ProfileTabType = 'orders' | 'merchant-orders' | 'customers' | 'addresses' | 'vehicles';
