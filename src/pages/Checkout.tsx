import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TruckIcon,
  WarehouseIcon,
  BanknoteIcon,
  LandmarkIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SparklesIcon,
  PlusIcon,
  MinusIcon,
  CalendarIcon,
  PhoneIcon,
  CheckIcon,
  MapPinIcon,
  ShoppingBagIcon,
  Trash2Icon,
  PackageCheckIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import { useCheckout, getRecommendedTruckType } from '../features/orders/useCheckout';
import { OrderType, PaymentMethod, TruckType } from '../features/orders/types';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import { VehicleModal } from '../components/profile/VehicleModal';
import { AddressModal } from '../components/profile/AddressModal';

const TRUCK_TYPES_CONFIG = [
  {
    type: TruckType.Dababa,
    name: 'دبابة',
    capacityLabel: 'حتى 2 طن',
    maxCapacityTons: 2,
    description: 'شاحنة خفيفة (حمولة حتى 2 طن)',
  },
  {
    type: TruckType.Jumbo,
    name: 'جامبو',
    capacityLabel: 'حتى 7 طن',
    maxCapacityTons: 7,
    description: 'شاحنة متوسطة (حمولة حتى 7 طن)',
  },
  {
    type: TruckType.Trela,
    name: 'تريلا',
    capacityLabel: 'حتى 25 طن',
    maxCapacityTons: 25,
    description: 'شاحنة ثقيلة (حمولة حتى 25 طن)',
  },
];

export function Checkout() {
  const {
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddressModalOpen,
    setIsAddressModalOpen,
    handleAddAddress,
    newAddress,
    setNewAddress,
    truckType,
    setTruckType,
    shippingFee,
    shippingCalculation,
    truckPromotions,
    isCalculatingShipping,
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    isLoadingVehicles,
    isVehicleModalOpen,
    setIsVehicleModalOpen,
    handleAddVehicle,
    driverName,
    setDriverName,
    vehiclePlateNumber,
    setVehiclePlateNumber,
    driverLicenseNumber,
    setDriverLicenseNumber,
    driverPhone,
    setDriverPhone,
    saveVehicle,
    setSaveVehicle,
    expectedPickupDate,
    setExpectedPickupDate,
    notes,
    setNotes,
    isSubmitting,
    submitOrder,
    totalPrice,
    finalTotal,
    totalWeightTons,
    items,
  } = useCheckout();

  const { isAuthenticated, openAuthModal } = useAuth();
  const { openCart, removeItem, updateQuantity, clearCart, totalItemsCount } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleRemoveItem = async (itemId: string) => {
    setDeletingItemId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearConfirm(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center pt-28">
        <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 relative flex items-center justify-center mb-4">
          <img
            src="/aleman_parallax_assets/emptyCart.webp"
            alt="سلة المشتريات فارغة"
            className="w-full h-full object-contain filter drop-shadow-lg animate-in fade-in zoom-in-95 duration-300"
            loading="eager"
            decoding="async"
          />
        </div>
        <h2 className="text-2xl font-black text-ink">سلة المشتريات فارغة</h2>
        <p className="text-sm font-semibold text-slate-500 mt-1.5 max-w-sm">
          يرجى إضافة أعلاف إلى سلة المشتريات قبل التوجه إلى صفحة إتمام الطلب.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-600 transition"
        >
          <span>تصفح المنتجات</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition mb-2"
          >
            <ArrowRightIcon className="h-4 w-4" />
            <span>الرجوع للسلة</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">إتمام طلب الشراء</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            اختر طريقة الاستلام وأدخل بيانات الشحن لتأكيد الطلب
          </p>
        </div>

        {/* Auth Notice if not logged in */}
        {!isAuthenticated && (
          <div className="mb-8 flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="flex items-center gap-3">
              <AlertCircleIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-extrabold">لإتمام الطلب يرجى تسجيل الدخول أو إنشاء حساب</p>
                <p className="text-xs text-amber-700">لتتمكن من تتبع شحنتك وحفظ فواتير الشراء</p>
              </div>
            </div>
            <button
              type="button"
              onClick={openAuthModal}
              className="rounded-full bg-amber-600 hover:bg-amber-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              تسجيل الدخول / حساب جديد
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Left/Center in RTL) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Order Type Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <h2 className="text-base font-black text-ink mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>طريقة استلام الأعلاف</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Option */}
                <label
                  className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition ${orderType === OrderType.Delivery
                    ? 'border-brand-500 bg-brand-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-ink">توصيل بشاحنة إلى الموقع</h3>
                        <p className="text-xs text-slate-500 mt-0.5">شحن مباشر للمزرعة أو المستودع</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === OrderType.Delivery}
                      onChange={() => setOrderType(OrderType.Delivery)}
                      className="h-4 w-4 accent-brand-600"
                    />
                  </div>
                </label>

                {/* Pickup Option */}
                <label
                  className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition ${orderType === OrderType.Pickup
                    ? 'border-brand-500 bg-brand-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <WarehouseIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-ink">استلام مباشر من المصنع</h3>
                        <p className="text-xs text-slate-500 mt-0.5">تحميل بسيارة العميل من الصوامع</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === OrderType.Pickup}
                      onChange={() => setOrderType(OrderType.Pickup)}
                      className="h-4 w-4 accent-brand-600"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Step 2: Delivery Address or Pickup Details */}
            {orderType === OrderType.Delivery ? (
              <>
                {/* Step 2: Delivery Address Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                  {/* Header matching user design */}
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                        2
                      </span>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5 text-brand-600" />
                        <h2 className="text-base font-black text-ink">عنوان التوصيل</h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-brand-600/30 bg-brand-50/70 hover:bg-brand-100/70 px-3.5 py-1.5 text-xs font-black text-brand-700 transition hover:scale-105 active:scale-95"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      <span>إضافة عنوان</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    يرجى تحديد عنوان التوصيل لحساب أقرب مسار وتكلفة الشحن المناسبة لحجم حمولتك بدقة.
                  </p>

                  {/* Saved Addresses Cards */}
                  {addresses.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        {addresses.map((addr, index) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={`addr-${addr.id}-${index}`}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`cursor-pointer rounded-2xl border-2 p-4 transition ${isSelected
                                ? 'border-brand-600 bg-brand-50/25 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                {/* Address Info + Custom Checkmark */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <div
                                    className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition ${isSelected
                                      ? 'bg-brand-600 text-white shadow-xs'
                                      : 'border-2 border-slate-300 bg-white'
                                      }`}
                                  >
                                    {isSelected && <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    {/* Row 1: Label / City + Default Badge */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-black text-ink">
                                        {addr.label || `${addr.city}${addr.district ? ` - ${addr.district}` : ''}`}
                                      </span>
                                      {addr.isDefault && (
                                        <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold">
                                          الافتراضي
                                        </span>
                                      )}
                                    </div>

                                    {/* Row 2: Location details */}
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600 font-bold">
                                      <MapPinIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                      <span>
                                        {addr.city}
                                        {addr.district ? ` • ${addr.district}` : ''}
                                        {` • ${addr.street}`}
                                      </span>
                                    </div>

                                    {/* Row 3: Notes if any */}
                                    {addr.notes && (
                                      <p className="text-xs text-slate-400 font-medium mt-1.5">
                                        ملاحظات: {addr.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* City Badge */}
                                <div className="shrink-0">
                                  <span className="rounded-lg bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-bold">
                                    {addr.city}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Empty state if user has no saved addresses yet */
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/20 p-5 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100/70 text-brand-700 mb-2">
                          <MapPinIcon className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">لم تقم بإضافة عنوان توصيل بعد</p>
                        <p className="text-[11px] text-slate-400 mt-1 mb-3">
                          أضف عنوان مزرعتك أو مستودعك لحساب المسافة وسعر الشاحنة بدقة
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAddressModalOpen(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:scale-105 active:scale-95"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                          <span>إضافة عنوان جديد</span>
                        </button>
                      </div>

                      <div className="relative flex items-center justify-center">
                        <div className="border-t border-slate-200 w-full" />
                        <span className="bg-white px-3 text-[11px] font-bold text-slate-400 shrink-0">أو الإدخال السريع</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            المدينة / المحافظة <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="مثال: الشرقية، الدقهلية..."
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink text-right placeholder:text-right focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">المركز / الحي (اختياري)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={newAddress.district || ''}
                            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                            placeholder="مثال: بلبيس، الزقازيق..."
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink text-right placeholder:text-right focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            الشارع / العنوان بالتفصيل <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            placeholder="اسم الطريق، القرية، المزرعة أو أقرب علامة مميزة"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink text-right placeholder:text-right focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية للتوصيل (اختياري)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={newAddress.notes || ''}
                            onChange={(e) => setNewAddress({ ...newAddress, notes: e.target.value })}
                            placeholder="أي تعليمات أو ملاحظات إضافية للتوصيل…"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink text-right placeholder:text-right focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Truck Selection Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                        3
                      </span>
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-brand-600" />
                        <h2 className="text-base font-black text-ink">نوع سيارة الشحن</h2>
                      </div>
                    </div>

                    {/* <span className="text-xs font-bold text-slate-500">
                      حمولة الطلب: <span className="text-brand-700 font-black">{totalWeightTons} طن</span>
                    </span> */}
                  </div>

                  <p className="text-xs text-slate-500">
                    اختر سيارة النقل المناسبة لحجم حمولتك لتحديد تكلفة الشحن المناسبة:
                  </p>

                  <div className="space-y-3">
                    {TRUCK_TYPES_CONFIG.map((truck) => {
                      const isSelected = truckType === truck.type;
                      const isRecommended = getRecommendedTruckType(totalWeightTons) === truck.type;
                      const exceedsCapacity = totalWeightTons > truck.maxCapacityTons;
                      const neededTrucksCount =
                        isSelected && shippingCalculation?.requiredTrucksCount
                          ? shippingCalculation.requiredTrucksCount
                          : Math.ceil(totalWeightTons / truck.maxCapacityTons);
                      const truckPromo = truckPromotions[truck.type] || (isSelected ? shippingCalculation?.promotion : null);

                      return (
                        <label
                          key={truck.type}
                          onClick={() => setTruckType(truck.type)}
                          className={`relative block rounded-2xl border p-4 transition cursor-pointer ${isSelected
                            ? 'border-brand-600 bg-brand-50/25 ring-1 ring-brand-500/80 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                          <input
                            type="radio"
                            name="truckType"
                            checked={isSelected}
                            onChange={() => setTruckType(truck.type)}
                            className="sr-only"
                          />

                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {/* Custom Radio Button */}
                              <div
                                className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${isSelected ? 'border-brand-600 bg-white' : 'border-slate-300 bg-white'
                                  }`}
                              >
                                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Title + Badges */}
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="text-sm font-black text-ink">{truck.name}</span>
                                  {/* <span className="rounded-md bg-slate-100 text-slate-600 px-2 py-0.5 text-[11px] font-bold">
                                    {truck.capacityLabel}
                                  </span> */}
                                  {isRecommended && (
                                    <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[11px] font-extrabold">
                                      الموصى بها
                                    </span>
                                  )}
                                  {truckPromo && (truckPromo.discountPercentage || truckPromo.discountValue) ? (
                                    <span className="rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 text-[11px] font-black shadow-xs flex items-center gap-0.5">
                                      خصم {truckPromo.discountPercentage ? `${truckPromo.discountPercentage}%` : `${truckPromo.discountValue} ج.م`}
                                    </span>
                                  ) : null}
                                </div>

                                {/* Description */}
                                <p className="text-xs text-slate-500 mt-1">{truck.description}</p>

                                {/* Status: exceeds capacity or fits */}
                                {exceedsCapacity ? (
                                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-orange-50/90 border border-orange-200/90 px-3 py-1.5 text-xs font-bold text-orange-900">
                                    <AlertCircleIcon className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                                    <span>
                                      حمولة طلبك ({totalWeightTons} طن) تحتاج {neededTrucksCount} سيارات
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                                    <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    <span>مناسبة لحمولة سلتك ({totalWeightTons} طن)</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Truck Icon Box */}
                            <div
                              className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition ${isSelected ? 'bg-brand-100/70 text-brand-700' : 'bg-slate-100 text-slate-500'
                                }`}
                            >
                              <TruckIcon className="h-5 w-5" />
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Smart Notifications: Multiple Trucks, Promotion & Recommendation */}
                  <div className="mt-3 space-y-2.5">
                    {/* Notice when multiple trucks are needed */}
                    {shippingCalculation?.requiredTrucksCount && shippingCalculation.requiredTrucksCount > 1 && (
                      <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-3 flex items-start gap-2.5 text-xs text-amber-950">
                        <AlertCircleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold">تنبيه حجم الشحنة:</p>
                          <p className="text-amber-800 mt-0.5">
                            نظراً لأن إجمالي وزن الطلب ({totalWeightTons} طن) يتجاوز حمولة سيارة{' '}
                            {TRUCK_TYPES_CONFIG.find((t) => t.type === truckType)?.name} الواحدة، سيتم احتساب الشحن
                            على أساس {shippingCalculation.requiredTrucksCount} سيارات نقل لنفس العنوان.
                          </p>
                        </div>
                      </div>
                    )}



                    {/* Recommendation suggestion to switch truck and save money/trucks */}
                    {shippingCalculation?.recommendation &&
                      shippingCalculation.recommendation.suggestedTruckType !== truckType &&
                      (shippingCalculation.recommendation.potentialSavings ?? 0) > 0 && (
                        <div className="rounded-2xl bg-blue-50/90 border border-blue-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2.5">
                            <SparklesIcon className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-extrabold text-blue-950">
                                💡 وفر {(shippingCalculation.recommendation.potentialSavings ?? 0).toLocaleString()} ج.م باختيار {shippingCalculation.recommendation.suggestedTruckName || 'شاحنة أكبر'}!
                              </p>
                              <p className="text-[11px] text-blue-700 mt-0.5">
                                {shippingCalculation.recommendation.message ||
                                  `تحتاج ${shippingCalculation.recommendation.suggestedTruckCount || 1} سيارة فقط بدلاً من ${shippingCalculation.requiredTrucksCount || 1}، بتكلفة إجمالية ${shippingCalculation.recommendation.suggestedTotalFee?.toLocaleString()} ج.م.`}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTruckType(shippingCalculation.recommendation!.suggestedTruckType as TruckType)}
                            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
                          >
                            تبديل إلى {shippingCalculation.recommendation.suggestedTruckName}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </>
            ) : (
              /* Factory Pickup Details */
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                {/* Header matching user design */}
                <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-brand-600" />
                      <h2 className="text-base font-black text-ink">سيارة وسائق التحميل</h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-600/30 bg-brand-50/70 hover:bg-brand-100/70 px-3.5 py-1.5 text-xs font-black text-brand-700 transition hover:scale-105 active:scale-95"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>إضافة سيارة</span>
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  يرجى تحديد أو إدخال بيانات الشاحنة والسائق لتجهيز إذن الدخول والتحميل من صوامع مؤسسة الإيمان.
                </p>

                {/* Saved Vehicles Cards */}
                {isLoadingVehicles ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-400 bg-slate-50/50 rounded-2xl">
                    جاري تحميل بيانات الشاحنات والسائقين...
                  </div>
                ) : vehicles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {vehicles.map((v, index) => {
                        const isSelected = selectedVehicleId === v.id;
                        return (
                          <div
                            key={`veh-${v.id}-${index}`}
                            onClick={() => setSelectedVehicleId(v.id)}
                            className={`cursor-pointer rounded-2xl border-2 p-4 transition ${isSelected
                              ? 'border-brand-600 bg-brand-50/25 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              {/* Driver Info + Custom Checkmark */}
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div
                                  className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition ${isSelected
                                    ? 'bg-brand-600 text-white shadow-xs'
                                    : 'border-2 border-slate-300 bg-white'
                                    }`}
                                >
                                  {isSelected && <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  {/* Row 1: Name + Default Badge */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-black text-ink">{v.driverName}</span>
                                    {v.isDefault && (
                                      <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold">
                                        الافتراضي
                                      </span>
                                    )}
                                  </div>

                                  {/* Row 2: Plate Number + Phone */}
                                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-700 px-2.5 py-1 font-extrabold">
                                      <span>{v.vehiclePlateNumber}</span>
                                      <span className="text-[10px] bg-white px-1 py-0.2 rounded text-slate-500 border border-slate-200">123</span>
                                    </span>

                                    {v.driverPhone && (
                                      <span className="inline-flex items-center gap-1 text-slate-600 font-bold" dir="ltr">
                                        <span>{v.driverPhone}</span>
                                        <PhoneIcon className="h-3.5 w-3.5 text-slate-400" />
                                      </span>
                                    )}
                                  </div>

                                  {/* Row 3: National ID / License */}
                                  {v.driverLicenseNumber && (
                                    <p className="text-xs text-slate-400 font-medium mt-1.5">
                                      الرقم القومي / الرخصة: {v.driverLicenseNumber}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Vehicle Type Badge */}
                              {v.vehicleType && (
                                <div className="shrink-0">
                                  <span className="rounded-lg bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-bold">
                                    {v.vehicleType}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Manual input when user has no saved vehicles */
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/20 p-5 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100/70 text-brand-700 mb-2">
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">لم تقم بإضافة مركبة أو سائق بعد</p>
                      <p className="text-[11px] text-slate-400 mt-1 mb-3">
                        يمكنك إضافة سيارة وسائق بنقرة واحدة وحفظها لحسابك
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsVehicleModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:scale-105 active:scale-95"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                        <span>إضافة سيارة وسائق جديد</span>
                      </button>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-slate-200 w-full" />
                      <span className="bg-white px-3 text-[11px] font-bold text-slate-400 shrink-0">أو الإدخال السريع</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اسم السائق <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={driverName}
                          onChange={(e) => setDriverName(e.target.value)}
                          placeholder="اسم السائق المفوض"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          رقم لوحة السيارة <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={vehiclePlateNumber}
                          onChange={(e) => setVehiclePlateNumber(e.target.value)}
                          placeholder="مثال: أ ب ج 1234"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رقم رخصة القيادة أو القومي</label>
                        <input
                          type="text"
                          value={driverLicenseNumber}
                          onChange={(e) => setDriverLicenseNumber(e.target.value)}
                          placeholder="رقم الرخصة أو القومي"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رقم هاتف السائق</label>
                        <input
                          type="tel"
                          value={driverPhone}
                          onChange={(e) => setDriverPhone(e.target.value)}
                          placeholder="01xxxxxxxxx"
                          dir="rtl"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink text-right placeholder:text-right focus:border-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveVehicle}
                        onChange={(e) => setSaveVehicle(e.target.checked)}
                        className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 accent-brand-600"
                      />
                      <span className="text-xs font-bold text-slate-600">
                        حفظ بيانات السيارة والسائق في حسابي للاستخدام المستقبلي
                      </span>
                    </label>
                  </div>
                )}

                {/* Expected Pickup Date Picker matching user design */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs sm:text-sm font-black text-ink mb-2">
                    موعد التحميل المتوقع
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={expectedPickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setExpectedPickupDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 pl-4 pr-11 text-xs sm:text-sm font-bold text-ink focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition cursor-pointer"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-brand-700" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    اختر الموعد المفضل للتحميل لتجهيز إذن الدخول من الصوامع مسبقاً.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <h2 className="text-base font-black text-ink mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                  {orderType === OrderType.Delivery ? 4 : 3}
                </span>
                <span>طريقة السداد</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setPaymentMethod(PaymentMethod.CashOnDelivery)}
                  className={`cursor-pointer rounded-2xl border-2 p-4 flex items-center gap-3 transition ${paymentMethod === PaymentMethod.CashOnDelivery
                    ? 'border-brand-500 bg-brand-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === PaymentMethod.CashOnDelivery}
                    onChange={() => setPaymentMethod(PaymentMethod.CashOnDelivery)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <BanknoteIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-ink">
                        الدفع عند الاستلام / التحميل
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        الدفع نقداً عند استلام الطلب أو التحميل من المصنع
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod(PaymentMethod.BankTransfer)}
                  className={`cursor-pointer rounded-2xl border-2 p-4 flex items-center gap-3 transition ${paymentMethod === PaymentMethod.BankTransfer
                    ? 'border-brand-600 bg-brand-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === PaymentMethod.BankTransfer}
                    onChange={() => setPaymentMethod(PaymentMethod.BankTransfer)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-700 flex items-center justify-center shrink-0">
                      <LandmarkIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-ink">
                        تحويل بنكي / إيداع مباشر
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        سداد المبلغ بالتحويل البنكي بعد اعتماد وموافقة إدارة المصنع
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Bank Transfer Approval Workflow Notice matching Screenshot 1 */}
              {paymentMethod === PaymentMethod.BankTransfer && (
                <div className="mt-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                      <AlertCircleIcon className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                      آلية التحويل البنكي والاعتماد
                    </h4>
                  </div>

                  <div className="space-y-2.5 text-xs text-emerald-900 font-medium pr-1">
                    <div className="flex items-start gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-200/80 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <p className="leading-relaxed">
                        يتم تقديم الطلب أولاً دون الحاجة لرفع إيصال تحويل الآن.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-200/80 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <p className="leading-relaxed">
                        يتم مراجعة الطلب واعتماده (من التاجر الرئيسي إن كنت عميلاً فرعياً، ثم من إدارة المصنع).
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-200/80 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <p className="leading-relaxed">
                        بمجرد اعتماد الطلب، ستظهر لك بيانات حسابات المصنع البنكية في صفحة تفاصيل الطلب لتقوم بالتحويل ورفع الإيصال لتأكيد شحنته.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية على الطلب</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تعليمات خاصة بالتفريغ أو مواعيد التحميل..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Summary (Right in RTL) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 sticky top-28">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-2xs">
                    <ShoppingBagIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-ink">
                      سلة المشتريات والطلب
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 block -mt-0.5">
                      {totalItemsCount} شكارة • {items.length} أصناف
                    </span>
                  </div>
                </div>

              </div>

              {/* Clear Cart Confirmation Banner */}
              <AnimatePresence>
                {showClearConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4 p-3.5 rounded-2xl bg-red-50/95 border border-red-200/80 shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangleIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-red-950">تفريغ سلة المشتريات بالكامل؟</h4>
                        <p className="text-[11px] font-semibold text-red-700 mt-0.5 leading-relaxed">
                          سيتم حذف كافة الأصناف ({totalItemsCount} شكارة) من الطلب.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                      >
                        تراجع
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCart}
                        className="px-3.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-black text-white shadow-2xs transition active:scale-95"
                      >
                        نعم، تفريغ السلة
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items List with custom scrolling if long */}
              <div className="space-y-3 mb-4 max-h-[380px] overflow-y-auto no-scrollbar pr-0.5">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const itemWeightKg = item.quantity * item.packageWeightKg;
                    const itemWeightFormatted =
                      itemWeightKg >= 1000
                        ? `${Number((itemWeightKg / 1000).toFixed(2))} طن (${itemWeightKg.toLocaleString()} كجم)`
                        : `${itemWeightKg.toLocaleString()} كجم`;
                    const isItemDeleting = deletingItemId === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`group relative bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300/80 p-3 shadow-2xs hover:shadow-xs transition-all duration-200 space-y-2.5 ${isItemDeleting ? 'opacity-40 pointer-events-none' : ''
                          }`}
                      >
                        {/* Top: Product thumbnail + Info + Remove */}
                        <div className="flex items-start gap-3">
                          <div className="h-14 w-14 rounded-xl bg-white border border-slate-200/80 flex-shrink-0 overflow-hidden flex items-center justify-center p-1 shadow-2xs">
                            <img
                              src={item.productImageUrl || '/hero_farm_bg.webp'}
                              alt={item.productName}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/image.webp';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className="font-black text-xs text-ink line-clamp-1 leading-snug">
                                {item.productName}
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition flex-shrink-0 -mt-0.5 -mr-0.5"
                                title="إزالة هذا المنتج"
                                aria-label={`حذف ${item.productName}`}
                              >
                                <Trash2Icon className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="inline-flex items-center gap-0.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 text-[10px] font-black text-emerald-800">
                                <PackageCheckIcon className="h-2.5 w-2.5 text-emerald-600" />
                                <span>شكارة {item.packageWeightKg} كجم</span>
                              </span>
                              <span className="text-[11px] font-bold text-slate-500">
                                {item.unitPrice.toLocaleString()} ج.م
                              </span>
                            </div>

                            <div className="mt-1 text-[10px] font-bold text-slate-400">
                              الوزن: <span className="text-slate-700 font-extrabold">{itemWeightFormatted}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Stepper + Subtotal */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          {/* Stepper */}
                          <div className="flex items-center border border-slate-200 bg-white rounded-xl p-0.5 shadow-2xs gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                } else {
                                  handleRemoveItem(item.id);
                                }
                              }}
                              className={`h-6 w-6 rounded-lg flex items-center justify-center transition active:scale-90 ${item.quantity === 1
                                ? 'text-red-500 hover:bg-red-50'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              aria-label={item.quantity === 1 ? 'إزالة الصنف' : 'تقليل الكمية'}
                              title={item.quantity === 1 ? 'إزالة الصنف' : 'تقليل الكمية'}
                            >
                              {item.quantity === 1 ? (
                                <Trash2Icon className="h-3 w-3 text-red-500" />
                              ) : (
                                <MinusIcon className="h-3 w-3" />
                              )}
                            </button>
                            <span className="w-8 text-center text-xs font-black text-ink select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition active:scale-90"
                              aria-label="زيادة الكمية"
                              title="زيادة الكمية"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-end">
                            <span className="text-xs font-black text-brand-700">
                              {item.subtotal.toLocaleString()} <span className="text-[10px] text-brand-600 font-bold">ج.م</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Payload Weight Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 mb-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                    <TruckIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-emerald-950">إجمالي وزن الأعلاف:</span>
                </div>
                <span className="font-black text-emerald-900">
                  {totalWeightTons} طن ({items.reduce((s, i) => s + i.quantity * i.packageWeightKg, 0).toLocaleString()} كجم)
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">


                <div className="flex justify-between text-slate-600">
                  <span>قيمة المنتجات:</span>
                  <span className="font-bold text-ink">{totalPrice.toLocaleString()} ج.م</span>
                </div>

                {orderType === OrderType.Delivery && (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>الشاحنة المختارة:</span>
                      <span className="font-bold text-ink">
                        {truckType === TruckType.Dababa
                          ? 'دبابة'
                          : truckType === TruckType.Jumbo
                            ? 'جامبو'
                            : 'تريلا'}
                        {shippingCalculation?.requiredTrucksCount && shippingCalculation.requiredTrucksCount > 1
                          ? ` (${shippingCalculation.requiredTrucksCount} سيارات)`
                          : ''}
                      </span>
                    </div>

                    {shippingCalculation?.totalDiscountAmount && shippingCalculation.totalDiscountAmount > 0 ? (
                      <>
                        <div className="flex justify-between text-slate-500">
                          <span>الشحن قبل الخصم:</span>
                          <span className="line-through text-slate-400">
                            {(shippingCalculation.totalOriginalShippingFee ?? (shippingFee + shippingCalculation.totalDiscountAmount)).toLocaleString()} ج.م
                          </span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>خصم عرض الشاحنة:</span>
                          <span>-{shippingCalculation.totalDiscountAmount.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : null}

                    <div className="flex justify-between text-slate-600">
                      <span>
                        تكلفة الشحن {shippingCalculation?.requiredTrucksCount && shippingCalculation.requiredTrucksCount > 1 ? `(${shippingCalculation.requiredTrucksCount} سيارات)` : ''}:
                      </span>
                      <span className="font-bold text-ink">
                        {isCalculatingShipping ? 'جاري الحساب…' : `${shippingFee.toLocaleString()} ج.م`}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-base font-black text-ink pt-3 border-t border-slate-200">
                  <span>المبلغ الإجمالي:</span>
                  <span className="text-xl text-brand-600">{finalTotal.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={submitOrder}
                disabled={isSubmitting}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-full bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 py-4 px-6 text-base font-extrabold text-white shadow-lg shadow-orange-950/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="h-5 w-5 animate-spin" />
                    <span>جاري تأكيد الطلب…</span>
                  </>
                ) : (
                  <>
                    <span>تأكيد الطلب الآن</span>
                    <CheckCircle2Icon className="h-5 w-5" />
                  </>
                )}
              </button>



            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle & Driver Modal */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSubmit={handleAddVehicle}
      />

      {/* Add Delivery Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddAddress}
      />
    </div>
  );
}
