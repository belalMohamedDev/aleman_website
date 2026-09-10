export enum OrderType {
  Delivery = 1,
  Pickup = 2,
}

export enum PaymentMethod {
  CashOnDelivery = 1,
  BankTransferOrOnline = 2,
}

export enum TruckType {
  MediumTruck = 1, // نص نقل / جامبو
  HeavyTruck = 2,  // نقل ثقيل / تريلا
  LargeTrailer = 3, // شاحنة مقطورة
}

export interface UserAddress {
  id: string; // uuid from backend
  label?: string;
  city: string;
  street: string;
  district?: string;
  notes?: string;
  isDefault?: boolean;
}

export interface CreateAddressDto {
  label?: string;
  city: string;
  street: string;
  district?: string;
  notes?: string;
  isDefault?: boolean;
}

export interface CalculateShippingRequestDto {
  addressId: string; // uuid
  truckType: number;
}

export interface CalculateShippingResponseDto {
  shippingFee: number;
  estimatedDelivery?: string;
  truckName?: string;
  maxCapacityTons?: number;
  isWeightExceeded?: boolean;
  warningMessage?: string | null;
}

export interface CreateOrderRequestDto {
  orderType: number; // 1: Delivery, 2: Pickup
  addressId?: string | null; // uuid
  truckType?: number | null;
  driverName?: string | null;
  vehiclePlateNumber?: string | null;
  driverLicenseNumber?: string | null;
  expectedPickupDate?: string | null;
  paymentMethod: number; // 1: Cash, 2: Online
  couponCode?: string | null;
  notes?: string | null;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  productPackageId: number;
  packageWeightKg: number;
  packageSize?: string;
  unitPrice: number;
  pricePerTon: number;
  quantity: number;
  subtotal: number;
  totalWeightKg: number;
}

export interface OrderResponseDto {
  id: number;
  orderNumber: string;
  userId?: string;
  customerName?: string;
  orderType: number;
  orderTypeName?: string;
  status: number;
  statusName?: string;
  paymentMethod: number;
  paymentMethodName?: string;
  isPaid?: boolean;
  paidAt?: string | null;
  deliveryAddress?: string | null;
  truckName?: string | null;
  driverName?: string | null;
  vehiclePlateNumber?: string | null;
  driverLicenseNumber?: string | null;
  expectedPickupDate?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  totalAmount: number;
  totalWeightKg: number;
  totalWeightTons: number;
  totalItemsCount: number;
  notes?: string | null;
  createdAt: string;
  items: OrderItemResponse[];
}
