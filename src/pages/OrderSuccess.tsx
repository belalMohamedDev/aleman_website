import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2Icon,
  ArrowLeftIcon,
  ClockIcon,
  TruckIcon,
  WarehouseIcon,
  PackageIcon,
  XCircleIcon,
  FileCheckIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
} from 'lucide-react';
import { orderService } from '../features/orders/orderService';
import type { OrderResponseDto } from '../features/orders/types';

interface StatusDisplay {
  label: string;
  description: string;
  badgeClass: string;
  icon: typeof ClockIcon;
  stepIndex: number; // 0: Placed, 1: Approved, 2: Preparing, 3: In Transit/Ready, 4: Completed
  isNegative?: boolean;
}

function getOrderStatusInfo(status: number, orderType: number): StatusDisplay {
  const isPickup = orderType === 2;

  switch (status) {
    case 1: // Pending
      return {
        label: 'قيد المراجعة والاعتماد',
        description: 'تم استلام طلبك بنجاح وهو الآن بانتظار مراجعة وتأكيد المبيعات.',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };

    case 8: // PendingMerchantApproval
      return {
        label: 'قيد موافقة التاجر الرئيسي',
        description: 'طلبك بانتظار موافقة واعتماد التاجر الرئيسي التابع له حسابك.',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };

    case 9: // PendingAdminApproval
      return {
        label: 'قيد موافقة إدارة المصنع',
        description: 'تمت موافقة التاجر وبانتظار اعتماد إدارة مبيعات المصنع.',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };

    case 12: // PendingPaymentApproval
      return {
        label: 'تم رفع الإيصال - قيد تدقيق المالية',
        description: 'تم إرفاق إيصال السداد البنكي وهو الآن قيد التدقيق من الإدارة المالية.',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200/80',
        icon: FileCheckIcon,
        stepIndex: 1,
      };

    case 2: // Confirmed
      return {
        label: 'تم التأكيد والاعتماد',
        description: 'تم اعتماد وتأكيد الطلب رسمياً وجاري إدراجه في خطة التجهيز.',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
        icon: CheckCircle2Icon,
        stepIndex: 1,
      };

    case 3: // Preparing
      return {
        label: 'قيد التجهيز والتعبئة',
        description: isPickup
          ? 'جاري تجهيز وتعبئة الشكائر بصوامع المصنع لتكون جاهزة للتحميل.'
          : 'جاري تجهيز وتعبئة الشحنة وتحميلها على شاحنات أسطول النقل.',
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
        icon: PackageIcon,
        stepIndex: 2,
      };

    case 4: // OutForDelivery (Delivery only)
      return {
        label: 'خرجت الشحنة للتوصيل',
        description: 'شاحنة أسطول النقل في طريقها الآن إلى موقع التوصيل المعتمد.',
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200/80',
        icon: TruckIcon,
        stepIndex: 3,
      };

    case 5: // ReadyForPickup (Pickup only)
      return {
        label: 'جاهز للتحميل من المصنع',
        description: 'طلبك جاهز تماماً الآن للتحميل والاستلام من مستودعات وصوامع مصنع الإيمان.',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        icon: WarehouseIcon,
        stepIndex: 3,
      };

    case 6: // Completed / Delivered
      return {
        label: isPickup ? 'تم الاستلام والتحميل بنجاح' : 'تم تسليم الشحنة بنجاح',
        description: isPickup
          ? 'تم استلام وتوريد الشحنة من المصنع بنجاح. شكراً لتعاملكم معنا!'
          : 'تم توصيل وتسليم الشحنة لموقعكم بنجاح. شكراً لتعاملكم معنا!',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        icon: CheckCircle2Icon,
        stepIndex: 4,
      };

    case 7: // Cancelled
      return {
        label: 'تم إلغاء الطلب',
        description: 'تم إلغاء هذا الطلب بناءً على طلبكم أو لعدم استيفاء الشروط.',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        icon: XCircleIcon,
        stepIndex: -1,
        isNegative: true,
      };

    case 10: // RejectedByMerchant
      return {
        label: 'مرفوض من التاجر الرئيسي',
        description: 'تم رفض هذا الطلب من قِبل التاجر الرئيسي التابع له الحساب.',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        icon: XCircleIcon,
        stepIndex: -1,
        isNegative: true,
      };

    case 11: // RejectedByAdmin
      return {
        label: 'مرفوض من إدارة المصنع',
        description: 'تم رفض هذا الطلب من قِبل إدارة مصنع الإيمان.',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        icon: XCircleIcon,
        stepIndex: -1,
        isNegative: true,
      };

    default:
      return {
        label: 'قيد المتابعة والتجهيز',
        description: 'طلبك قيد المتابعة وسيقوم فريق العمل بتنفيذه.',
        badgeClass: 'bg-slate-50 text-slate-800 border-slate-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };
  }
}

export function OrderSuccess() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderResponseDto | null>(null);

  useEffect(() => {
    if (orderNumber) {
      orderService.getOrderByNumber(orderNumber)
        .then((data) => setOrder(data))
        .catch((e) => console.warn('Order lookup error:', e));
    }
  }, [orderNumber]);

  const isPickup = order?.orderType === 2;
  const statusInfo = getOrderStatusInfo(order?.status ?? 1, order?.orderType ?? 1);

  return (
    <div className="min-h-[80vh] w-full pt-32 pb-20 px-4 flex items-center justify-center bg-slate-50/50" dir="rtl">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-100 text-center">
        {/* Header Icon */}
        <div
          className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-5 ${statusInfo.isNegative
            ? 'bg-rose-100 text-rose-600'
            : 'bg-emerald-100 text-emerald-600'
            }`}
        >
          {statusInfo.isNegative ? (
            <XCircleIcon className="h-10 w-10" />
          ) : (
            <CheckCircle2Icon className="h-10 w-10" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-ink mb-2">
          {statusInfo.isNegative ? statusInfo.label : 'تم استلام طلبك بنجاح!'}
        </h1>

        {/* Subtitle - Customized by Order Type */}
        <p className="text-sm font-semibold text-slate-500 mb-6 max-w-lg mx-auto leading-relaxed">
          {isPickup
            ? 'شكراً لثقتكم في أعلاف مجموعة شركات الايمان. تم تسجيل طلب الاستلام الذاتي من المصنع، وسيكون جاهزاً للتحميل فور اكتمال التجهيز.'
            : 'شكراً لثقتكم في أعلاف مجموعة شركات الايمان. تم تسجيل طلبكم وسيقوم أسطول النقل بتجهيز الشحنة وتوصيلها إلى موقعكم المعتمد.'}
        </p>



        {/* Order Info Card */}
        <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 text-start space-y-3.5 mb-8">
          {/* Order Number */}
          <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">رقم الطلب:</span>
            <span className="font-black text-brand-700 text-base dir-ltr">#{orderNumber}</span>
          </div>

          {order && (
            <>
              {/* Order Type */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">نوع الطلب:</span>
                <span className="inline-flex items-center gap-1.5 font-extrabold text-ink">
                  {isPickup ? (
                    <>
                      <WarehouseIcon className="h-4 w-4 text-amber-600" />
                      <span>استلام من المصنع (ذاتي)</span>
                    </>
                  ) : (
                    <>
                      <TruckIcon className="h-4 w-4 text-brand-600" />
                      <span>توصيل إلى الموقع</span>
                    </>
                  )}
                </span>
              </div>

              {/* Delivery Specific: Address & Truck */}
              {!isPickup && Boolean(order.deliveryAddress) && (
                <div className="flex justify-between items-start text-sm gap-2">
                  <span className="font-bold text-slate-500 shrink-0">عنوان التوصيل:</span>
                  <span className="font-semibold text-slate-700 text-left flex items-center gap-1">
                    <MapPinIcon className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span>
                      {typeof order.deliveryAddress === 'string'
                        ? order.deliveryAddress
                        : typeof order.deliveryAddress === 'object' && order.deliveryAddress !== null
                          ? [
                            (order.deliveryAddress as any).city,
                            (order.deliveryAddress as any).district,
                            (order.deliveryAddress as any).street,
                            (order.deliveryAddress as any).notes,
                          ]
                            .filter(Boolean)
                            .join(' - ') || (order.deliveryAddress as any).label || 'عنوان التوصيل المعتمد'
                          : 'عنوان التوصيل المعتمد'}
                    </span>
                  </span>
                </div>
              )}

              {!isPickup && order.truckName && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">فئة الشاحنة:</span>
                  <span className="font-semibold text-slate-700">{order.truckName}</span>
                </div>
              )}

              {/* Pickup Specific: Driver & Expected Date */}
              {isPickup && (order.driverName || (order as any).vehicle?.driverName) && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">بيانات السائق:</span>
                  <span className="font-semibold text-slate-700">
                    {order.driverName || (order as any).vehicle?.driverName}
                    {(order.vehiclePlateNumber || (order as any).vehicle?.vehiclePlateNumber)
                      ? ` (لوحة: ${order.vehiclePlateNumber || (order as any).vehicle?.vehiclePlateNumber})`
                      : ''}
                  </span>
                </div>
              )}

              {isPickup && order.expectedPickupDate && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">موعد الاستلام المتوقع:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5 text-amber-600" />
                    <span>
                      {(() => {
                        try {
                          const d = new Date(order.expectedPickupDate);
                          return isNaN(d.getTime()) ? String(order.expectedPickupDate) : d.toLocaleDateString('ar-EG');
                        } catch {
                          return String(order.expectedPickupDate);
                        }
                      })()}
                    </span>
                  </span>
                </div>
              )}

              {/* Total Weight & Bags */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">إجمالي الحمولة:</span>
                <span className="font-extrabold text-ink">
                  {order.totalWeightTons} طن ({order.totalItemsCount} شكارة)
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">طريقة الدفع:</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <CreditCardIcon className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    {order.paymentMethod === 1
                      ? 'دفع نقدي عند الاستلام'
                      : order.paymentMethodName || 'تحويل بنكي'}
                  </span>
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center text-sm pt-2.5 border-t border-slate-200">
                <span className="font-bold text-slate-500">إجمالي المبلغ المطلوب:</span>
                <span className="font-black text-emerald-600 text-base sm:text-lg">
                  {order.totalAmount.toLocaleString()} ج.م
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons - Clean Symmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white py-3.5 px-6 text-sm font-black transition-all shadow-md shadow-brand-900/15 active:scale-[0.99] whitespace-nowrap"
          >
            <span>متابعة التسوق</span>
            <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          </Link>

          <Link
            to="/profile?tab=orders"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-3.5 px-6 text-sm font-bold transition-all shadow-xs active:scale-[0.99] whitespace-nowrap"
          >
            <PackageIcon className="h-4 w-4 shrink-0" />
            <span>طلباتي</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

