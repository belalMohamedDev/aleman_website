import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  TruckIcon,
  WarehouseIcon,
  PackageIcon,
  XCircleIcon,
  FileCheckIcon,
  MapPinIcon,
  CreditCardIcon,
} from 'lucide-react';

import { orderService } from '../features/orders/orderService';
import type { OrderResponseDto } from '../features/orders/types';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';

interface StatusDisplay {
  label: string;
  description: string;
  badgeClass: string;
  icon: typeof ClockIcon;
  stepIndex: number;
  isNegative?: boolean;
}

function getOrderStatusInfo(status: number, orderType: number, t: (v: any) => string): StatusDisplay {
  const isPickup = orderType === 2;

  switch (status) {
    case 1: // Pending
      return {
        label: t(ui.orders.statuses.pending),
        description: t({
          ar: 'تم استلام طلبك بنجاح وهو الآن بانتظار مراجعة وتأكيد المبيعات.',
          en: 'Your order was received successfully and is pending sales confirmation.',
        }),
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };

    case 8: // PendingMerchantApproval
      return {
        label: t(ui.orders.statuses.pendingMerchant),
        description: t({
          ar: 'طلبك بانتظار موافقة واعتماد التاجر الرئيسي التابع له حسابك.',
          en: 'Your order is awaiting approval from your primary merchant.',
        }),
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };

    case 9: // PendingAdminApproval
      return {
        label: t(ui.orders.statuses.pendingAdmin),
        description: t({
          ar: 'تمت موافقة التاجر وبانتظار اعتماد إدارة مبيعات المصنع.',
          en: 'Approved by merchant and awaiting factory sales confirmation.',
        }),
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };

    case 12: // PendingPaymentApproval
      return {
        label: t(ui.orders.statuses.pendingPayment),
        description: t({
          ar: 'تم إرفاق إيصال السداد البنكي وهو الآن قيد التدقيق من الإدارة المالية.',
          en: 'Bank transfer receipt attached and is being audited by finance.',
        }),
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200/80',
        icon: FileCheckIcon,
        stepIndex: 1,
      };

    case 2: // Confirmed
      return {
        label: t(ui.orders.statuses.confirmed),
        description: t({
          ar: 'تم اعتماد وتأكيد الطلب رسمياً وجاري إدراجه في خطة التجهيز.',
          en: 'Order officially confirmed and scheduled for packaging.',
        }),
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
        icon: CheckCircle2Icon,
        stepIndex: 1,
      };

    case 3: // Preparing
      return {
        label: t(ui.orders.statuses.preparing),
        description: isPickup
          ? t({
              ar: 'جاري تجهيز وتعبئة الشكائر بصوامع المصنع لتكون جاهزة للتحميل.',
              en: 'Preparing and packing sacks at mill silos for immediate loading.',
            })
          : t({
              ar: 'جاري تجهيز وتعبئة الشحنة وتحميلها على شاحنات أسطول النقل.',
              en: 'Preparing shipment and loading onto distribution transport trucks.',
            }),
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
        icon: PackageIcon,
        stepIndex: 2,
      };

    case 4: // OutForDelivery
      return {
        label: t(ui.orders.statuses.outForDelivery),
        description: t({
          ar: 'شاحنة أسطول النقل في طريقها الآن إلى موقع التوصيل المعتمد.',
          en: 'Transport fleet truck is currently en route to your delivery location.',
        }),
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200/80',
        icon: TruckIcon,
        stepIndex: 3,
      };

    case 5: // ReadyForPickup
      return {
        label: t(ui.orders.statuses.readyForPickup),
        description: t({
          ar: 'طلبك جاهز تماماً الآن للتحميل والاستلام من مستودعات وصوامع مصنع الإيمان.',
          en: 'Your order is ready for loading and pickup at Aleman mill warehouses.',
        }),
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        icon: WarehouseIcon,
        stepIndex: 3,
      };

    case 6: // Completed
      return {
        label: t(ui.orders.statuses.completed),
        description: isPickup
          ? t({
              ar: 'تم استلام وتوريد الشحنة من المصنع بنجاح. شكراً لتعاملكم معنا!',
              en: 'Shipment picked up from factory successfully. Thank you for choosing us!',
            })
          : t({
              ar: 'تم توصيل وتسليم الشحنة لموقعكم بنجاح. شكراً لتعاملكم معنا!',
              en: 'Shipment delivered to your location successfully. Thank you for choosing us!',
            }),
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        icon: CheckCircle2Icon,
        stepIndex: 4,
      };

    case 7: // Cancelled
      return {
        label: t(ui.orders.statuses.cancelled),
        description: t({
          ar: 'تم إلغاء هذا الطلب بناءً على طلبكم أو لعدم استيفاء الشروط.',
          en: 'This order was cancelled upon request or due to unmet conditions.',
        }),
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        icon: XCircleIcon,
        stepIndex: -1,
        isNegative: true,
      };

    default:
      return {
        label: t(ui.orders.statuses.pending),
        description: t({
          ar: 'طلبك قيد المتابعة وسيقوم فريق العمل بتنفيذه.',
          en: 'Your order is being processed by our team.',
        }),
        badgeClass: 'bg-slate-50 text-slate-800 border-slate-200/80',
        icon: ClockIcon,
        stepIndex: 0,
      };
  }
}

export function OrderSuccess() {
  const { t, dir } = useLang();
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderResponseDto | null>(null);
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;

  useEffect(() => {
    if (orderNumber) {
      orderService
        .getOrderByNumber(orderNumber)
        .then((data) => setOrder(data))
        .catch((e) => console.warn('Order lookup error:', e));
    }
  }, [orderNumber]);

  const isPickup = order?.orderType === 2;
  const statusInfo = getOrderStatusInfo(order?.status ?? 1, order?.orderType ?? 1, t);

  return (
    <div className="min-h-[80vh] w-full pt-32 pb-20 px-4 flex items-center justify-center bg-slate-50/50">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-100 text-center">
        {/* Header Icon */}
        <div
          className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
            statusInfo.isNegative ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
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
          {statusInfo.isNegative ? statusInfo.label : t(ui.orders.successTitle)}
        </h1>

        {/* Subtitle */}
        <p className="text-sm font-semibold text-slate-500 mb-6 max-w-lg mx-auto leading-relaxed">
          {isPickup
            ? t({
                ar: 'شكراً لثقتكم في أعلاف مجموعة شركات الايمان. تم تسجيل طلب الاستلام الذاتي من المصنع، وسيكون جاهزاً للتحميل فور اكتمال التجهيز.',
                en: 'Thank you for choosing Aleman Feed Group. Your factory pickup order is registered and will be ready for loading once prepared.',
              })
            : t({
                ar: 'شكراً لثقتكم في أعلاف مجموعة شركات الايمان. تم تسجيل طلبكم وسيقوم أسطول النقل بتجهيز الشحنة وتوصيلها إلى موقعكم المعتمد.',
                en: 'Thank you for choosing Aleman Feed Group. Your order is registered and our transport fleet will prepare and deliver your shipment.',
              })}
        </p>

        {/* Order Info Card */}
        <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 text-start space-y-3.5 mb-8">
          <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">{t(ui.orders.orderNumberLabel)}:</span>
            <span className="font-black text-brand-700 text-base" dir="ltr">#{orderNumber}</span>
          </div>

          {order && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">{t(ui.orders.fulfillmentTypeLabel)}:</span>
                <span className="inline-flex items-center gap-1.5 font-extrabold text-ink">
                  {isPickup ? (
                    <>
                      <WarehouseIcon className="h-4 w-4 text-amber-600" />
                      <span>{t(ui.checkout.pickupOption)}</span>
                    </>
                  ) : (
                    <>
                      <TruckIcon className="h-4 w-4 text-brand-600" />
                      <span>{t(ui.checkout.deliveryOption)}</span>
                    </>
                  )}
                </span>
              </div>

              {!isPickup && Boolean(order.deliveryAddress) && (
                <div className="flex justify-between items-start text-sm gap-2">
                  <span className="font-bold text-slate-500 shrink-0">{t(ui.checkout.shippingAddressTitle)}:</span>
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
                              .join(' - ') || (order.deliveryAddress as any).label || t(ui.checkout.shippingAddressTitle)
                          : t(ui.checkout.shippingAddressTitle)}
                    </span>
                  </span>
                </div>
              )}

              {/* Total Weight & Bags */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">{t(ui.cart.totalWeight)}:</span>
                <span className="font-extrabold text-ink">
                  {order.totalWeightTons} {t(ui.common.ton)} ({order.totalItemsCount} {t(ui.common.bag)})
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">{t(ui.checkout.paymentMethodTitle)}:</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <CreditCardIcon className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    {order.paymentMethod === 1
                      ? t(ui.checkout.cashOnDelivery)
                      : order.paymentMethodName || t(ui.checkout.bankTransfer)}
                  </span>
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center text-sm pt-2.5 border-t border-slate-200">
                <span className="font-bold text-slate-500">{t(ui.checkout.finalTotal)}:</span>
                <span className="font-black text-emerald-600 text-base sm:text-lg">
                  {order.totalAmount.toLocaleString()} {t(ui.common.currencyEg)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white py-3.5 px-6 text-sm font-black transition-all shadow-md shadow-brand-900/15 active:scale-[0.99] whitespace-nowrap"
          >
            <span>{t(ui.cart.continueShopping)}</span>
            <Arrow className="h-4 w-4 shrink-0" />
          </Link>

          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-3.5 px-6 text-sm font-bold transition-all shadow-xs active:scale-[0.99] whitespace-nowrap"
          >
            <PackageIcon className="h-4 w-4 shrink-0" />
            <span>{t(ui.profile.tabOrders)}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
