import { Link } from 'react-router-dom';
import {
  TruckIcon,
  WarehouseIcon,
  CreditCardIcon,
  BanknoteIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
} from 'lucide-react';
import { useCheckout } from '../features/orders/useCheckout';
import { OrderType, PaymentMethod } from '../features/orders/types';
import { useAuth } from '../features/auth/AuthContext';

export function Checkout() {
  const {
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddingNewAddress,
    setIsAddingNewAddress,
    newAddress,
    setNewAddress,
    shippingFee,
    isCalculatingShipping,
    driverName,
    setDriverName,
    vehiclePlateNumber,
    setVehiclePlateNumber,
    driverLicenseNumber,
    setDriverLicenseNumber,
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

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center pt-32">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <TruckIcon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-ink">سلة المشتريات فارغة</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
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
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition mb-2"
          >
            <ArrowRightIcon className="h-4 w-4" />
            <span>الرجوع إلى المنتجات</span>
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
                  className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition ${
                    orderType === OrderType.Delivery
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
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                  </div>
                </label>

                {/* Pickup Option */}
                <label
                  className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition ${
                    orderType === OrderType.Pickup
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
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Step 2: Delivery Address or Pickup Details */}
            {orderType === OrderType.Delivery ? (
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
                <h2 className="text-base font-black text-ink mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>عنوان التوصيل ونوع الشاحنة</span>
                </h2>

                {/* Saved Addresses if any */}
                {addresses.length > 0 && !isAddingNewAddress && (
                  <div className="space-y-3 mb-4">
                    <label className="block text-xs font-bold text-slate-700">اختر من عناوينك المحفوظة:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`cursor-pointer rounded-2xl border p-4 transition ${
                            selectedAddressId === addr.id
                              ? 'border-brand-500 bg-brand-50/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-extrabold text-ink">
                              {addr.city} - {addr.district || addr.street}
                            </span>
                            {selectedAddressId === addr.id && (
                              <CheckCircle2Icon className="h-4 w-4 text-brand-600" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{addr.street}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(true)}
                      className="text-xs font-bold text-brand-600 hover:underline mt-2 inline-block"
                    >
                      + إضافة عنوان توصيل جديد
                    </button>
                  </div>
                )}

                {/* New Address Form */}
                {isAddingNewAddress && (
                  <div className="space-y-3 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-extrabold text-ink">بيانات عنوان التوصيل</h4>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="text-xs font-bold text-slate-500 hover:text-ink"
                        >
                          إلغاء واختيار عنوان محفوظ
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة / المدينة *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="مثال: الدقهلية - المنصورة"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">المركز / الحي</label>
                        <input
                          type="text"
                          value={newAddress.district}
                          onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                          placeholder="مثال: مركز ميت غمر"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">العنوان التفصيلي / المزرعة *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="اسم الطريق أو المزرعة أو أقرب علامة مميزة"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Truck Selection - Auto-calculated in background, hidden from client UI */}
                {/*
                <div className="pt-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
                    <label className="text-xs font-bold text-slate-700">
                      نوع الشاحنة (حمولة الطلب: <span className="text-brand-700 font-extrabold">{totalWeightTons} طن</span>):
                    </label>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 border border-emerald-200">
                      <SparklesIcon className="h-3 w-3 text-emerald-600" />
                      <span>تحديد تلقائي حسب وزن الحمولة</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      className={`relative rounded-2xl border p-3.5 text-center transition ${
                        totalWeightTons > 6
                          ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed'
                          : truckType === TruckType.MediumTruck
                          ? 'border-brand-600 bg-brand-50/40 shadow-sm cursor-pointer ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        name="truckType"
                        disabled={totalWeightTons > 6}
                        checked={truckType === TruckType.MediumTruck}
                        onChange={() => setTruckType(TruckType.MediumTruck)}
                        className="sr-only"
                      />
                      {getRecommendedTruckType(totalWeightTons) === TruckType.MediumTruck && (
                        <span className="inline-block rounded-full bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 mb-1.5 shadow-sm">
                          الأنسب لحمولتك تلقائياً
                        </span>
                      )}
                      <span className="block text-xs font-extrabold text-ink">شاحنة جامبو</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {totalWeightTons > 6 ? 'غير كافية (حد أقصى 6 طن)' : 'حمولة حتى 6 طن'}
                      </span>
                    </label>

                    <label
                      className={`relative rounded-2xl border p-3.5 text-center transition ${
                        totalWeightTons > 30
                          ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed'
                          : truckType === TruckType.HeavyTruck
                          ? 'border-brand-600 bg-brand-50/40 shadow-sm cursor-pointer ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        name="truckType"
                        disabled={totalWeightTons > 30}
                        checked={truckType === TruckType.HeavyTruck}
                        onChange={() => setTruckType(TruckType.HeavyTruck)}
                        className="sr-only"
                      />
                      {getRecommendedTruckType(totalWeightTons) === TruckType.HeavyTruck && (
                        <span className="inline-block rounded-full bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 mb-1.5 shadow-sm">
                          الأنسب لحمولتك تلقائياً
                        </span>
                      )}
                      <span className="block text-xs font-extrabold text-ink">تريلا نقل ثقيل</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {totalWeightTons > 30 ? 'غير كافية (حد أقصى 30 طن)' : 'حمولة حتى 30 طن'}
                      </span>
                    </label>

                    <label
                      className={`relative rounded-2xl border p-3.5 text-center transition ${
                        truckType === TruckType.LargeTrailer
                          ? 'border-brand-600 bg-brand-50/40 shadow-sm cursor-pointer ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        name="truckType"
                        checked={truckType === TruckType.LargeTrailer}
                        onChange={() => setTruckType(TruckType.LargeTrailer)}
                        className="sr-only"
                      />
                      {getRecommendedTruckType(totalWeightTons) === TruckType.LargeTrailer && (
                        <span className="inline-block rounded-full bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 mb-1.5 shadow-sm">
                          الأنسب لحمولتك تلقائياً
                        </span>
                      )}
                      <span className="block text-xs font-extrabold text-ink">مقطورة كاملة</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">حمولات كبرى (+30 طن)</span>
                    </label>
                  </div>
                </div>
                */}
              </div>
            ) : (
              /* Factory Pickup Details */
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
                <h2 className="text-base font-black text-ink mb-2 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>بيانات سيارة التحميل والسائق</span>
                </h2>

                <p className="text-xs text-slate-500">
                  يرجى إدخال بيانات السيارة لتجهيز إذن الدخول والتحميل من صوامع مؤسسة الإيمان.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">اسم السائق</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="اسم السائق المفوّض بالاستلام"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رقم لوحة السيارة</label>
                    <input
                      type="text"
                      value={vehiclePlateNumber}
                      onChange={(e) => setVehiclePlateNumber(e.target.value)}
                      placeholder="مثال: أ ب ج 1234"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رقم رخصة القيادة</label>
                    <input
                      type="text"
                      value={driverLicenseNumber}
                      onChange={(e) => setDriverLicenseNumber(e.target.value)}
                      placeholder="رقم رخصة السائق"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ وموعد الاستلام المتوقع</label>
                    <input
                      type="date"
                      value={expectedPickupDate}
                      onChange={(e) => setExpectedPickupDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <h2 className="text-base font-black text-ink mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span>طريقة السداد</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`cursor-pointer rounded-2xl border-2 p-4 flex items-center gap-3 transition ${
                    paymentMethod === PaymentMethod.CashOnDelivery
                      ? 'border-brand-500 bg-brand-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === PaymentMethod.CashOnDelivery}
                    onChange={() => setPaymentMethod(PaymentMethod.CashOnDelivery)}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="flex items-center gap-2.5">
                    <BanknoteIcon className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="block text-xs font-black text-ink">
                        {orderType === OrderType.Delivery ? 'دفع كاش عند الاستلام' : 'دفع نقدي عند التحميل'}
                      </span>
                      <span className="block text-[11px] text-slate-500">سداد الفاتورة نقداً مع السائق</span>
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border-2 p-4 flex items-center gap-3 transition ${
                    paymentMethod === PaymentMethod.BankTransferOrOnline
                      ? 'border-brand-500 bg-brand-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === PaymentMethod.BankTransferOrOnline}
                    onChange={() => setPaymentMethod(PaymentMethod.BankTransferOrOnline)}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="flex items-center gap-2.5">
                    <CreditCardIcon className="h-5 w-5 text-brand-600" />
                    <div>
                      <span className="block text-xs font-black text-ink">تحويل بنكي / إلكتروني</span>
                      <span className="block text-[11px] text-slate-500">سداد عبر حساب المؤسسة البنكي</span>
                    </div>
                  </div>
                </label>
              </div>

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
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 sticky top-28">
              <h3 className="text-base font-black text-ink mb-4 pb-3 border-b border-slate-100">
                ملخص الطلب والحمولة
              </h3>

              {/* Items Mini List */}
              <div className="space-y-3 mb-4 divide-y divide-slate-100/80">
                {items.map((item) => {
                  const itemWeightKg = item.quantity * item.packageWeightKg;
                  const itemWeightFormatted = itemWeightKg >= 1000
                    ? `${Number((itemWeightKg / 1000).toFixed(2))} طن (${itemWeightKg.toLocaleString()} كجم)`
                    : `${itemWeightKg.toLocaleString()} كجم`;

                  return (
                    <div key={item.id} className="flex justify-between items-center text-xs pt-2.5 first:pt-0">
                      <div>
                        <span className="font-bold text-ink line-clamp-1">{item.productName}</span>
                        <span className="text-slate-500 text-[11px] block">
                          {item.quantity} شكارة ({item.packageWeightKg} كجم) • إجمالي الوزن: {itemWeightFormatted}
                        </span>
                      </div>
                      <span className="font-extrabold text-ink">{item.subtotal.toLocaleString()} ج.م</span>
                    </div>
                  );
                })}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>إجمالي وزن الأعلاف:</span>
                  <span className="font-extrabold text-emerald-800">{totalWeightTons} طن</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>قيمة المنتجات:</span>
                  <span className="font-bold text-ink">{totalPrice.toLocaleString()} ج.م</span>
                </div>

                {orderType === OrderType.Delivery && (
                  <div className="flex justify-between text-slate-600">
                    <span>تكلفة الشحن التقديرية:</span>
                    <span className="font-bold text-ink">
                      {isCalculatingShipping ? 'جاري الحساب…' : `${shippingFee.toLocaleString()} ج.م`}
                    </span>
                  </div>
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

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                <span>طلبك محمي ومسجل رسمياً بنظام المؤسسة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
