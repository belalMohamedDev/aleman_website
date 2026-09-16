export enum OrderType {
  Delivery = 1,
  Pickup = 2,
}

export enum PaymentMethod {
  CashOnDelivery = 1,
  Card = 2,
  BankTransfer = 3,
}

export enum TruckType {
  Dababa = 1,
  Jumbo = 2,
  Trela = 3,
  MediumTruck = 1,
  HeavyTruck = 2,
  LargeTrailer = 3,
}

export type { UserAddress, CreateAddressDto } from '../profile/types';

export interface CalculateShippingRequestDto {
  addressId: string; // uuid
  truckType: number;
}

export interface ShippingPromotionInfoDto {
  id?: string | null;
  title?: string | null;
  discountPercentage?: number | null;
  discountValue?: number | null;
  endDateUtc?: string | null;
}

export interface ShippingRecommendationDto {
  suggestedTruckType: number;
  suggestedTruckName?: string | null;
  suggestedTruckCount?: number;
  suggestedTotalFee?: number;
  potentialSavings?: number;
  message?: string | null;
}

export interface CalculateShippingResponseDto {
  shippingFee: number;
  estimatedDelivery?: string | null;
  truckName?: string | null;
  maxCapacityTons?: number;
  isWeightExceeded?: boolean;
  warningMessage?: string | null;
  requiredTrucksCount?: number;
  singleTruckBaseFee?: number;
  singleTruckFeeAfterDiscount?: number;
  totalOriginalShippingFee?: number;
  totalDiscountAmount?: number;
  promotion?: ShippingPromotionInfoDto | null;
  recommendation?: ShippingRecommendationDto | null;
}

export interface CreateOrderRequestDto {
  orderType: number; // 1: Delivery, 2: Pickup
  addressId?: string | null; // uuid
  truckType?: number | null;
  truckCount?: number | null;
  vehicleId?: string | null; // uuid of saved vehicle
  driverName?: string | null;
  vehiclePlateNumber?: string | null;
  driverLicenseNumber?: string | null;
  driverPhone?: string | null;
  vehicleType?: string | null;
  expectedPickupDate?: string | null;
  saveVehicle?: boolean;
  paymentMethod: number; // 1: Cash, 2: Online
  paymentReceiptUrl?: string | null;
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
