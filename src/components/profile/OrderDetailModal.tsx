import { useState } from 'react';
import {
  XIcon,
  PackageIcon,
  TruckIcon,
  CreditCardIcon,
  ScaleIcon,
  CheckIcon,
  CopyIcon,
  Building2Icon,
  UploadCloudIcon,
  FileCheckIcon,
  ShoppingBagIcon,
  ClockIcon,
} from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { ORDER_STATUS_META, OrderStatus, OrderType, PaymentMethod } from '../../features/profile/types';
import { useAuth } from '../../features/auth/AuthContext';
import { isSubCustomer as checkIsSubCustomer } from '../../features/auth/userUtils';
import { toast } from 'sonner';
import { resolveMediaUrl } from '../../infrastructure/api/apiClient';
import { useLanguage } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface OrderDetailModalProps {
  order: OrderResponse | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [isReceiptUploaded, setIsReceiptUploaded] = useState(false);

  if (!order) return null;

  const { user } = useAuth();
  const { t, isRtl, lang } = useLanguage();
  const isBankTransfer =
    order.paymentMethod === PaymentMethod.BankTransfer ||
    order.paymentMethod === 3 ||
    order.paymentMethod === 2 ||
    Boolean(order.paymentMethodName?.includes('تحويل'));

  // Distinguish Sub-Customer vs Main Merchant
  const isSub = Boolean(
    order.parentMerchantId ||
    (order.parentMerchantName && order.parentMerchantName.trim() !== '') ||
    (user && checkIsSubCustomer(user))
  );
  const driverPhone = order.driverPhone || order.vehicle?.driverPhone;

  const rawMeta = ORDER_STATUS_META[order.status as OrderStatus];
  const statusMeta = rawMeta ? {
    text: lang === 'ar' ? rawMeta.labelAr : rawMeta.labelEn,
    color: rawMeta.color,
    bg: rawMeta.bg,
  } : {
    text: order.statusName || t(ui.orders.statuses.pending),
    color: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200',
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const formattedTime = new Date(order.createdAt).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} ${t(ui.common.copiedSuccess)}`);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      setIsUploadingReceipt(true);
      setTimeout(() => {
        setIsUploadingReceipt(false);
        setIsReceiptUploaded(true);
        toast.success(t(ui.orders.receiptUploadedSuccess));
      }, 1000);
    }
  };

  // Status flags matching all backend status codes
  const isPendingApproval =
    order.status === OrderStatus.Pending ||
    order.status === OrderStatus.PendingMerchantApproval ||
    order.status === OrderStatus.PendingAdminApproval ||
    order.status === 1 || order.status === 8 || order.status === 9;

  const isApproved =
    order.status === OrderStatus.Confirmed ||
    order.status === OrderStatus.PendingPaymentApproval ||
    order.status === 2 || order.status === 12;

  const isProcessing = order.status === OrderStatus.Preparing || order.status === 3;
  const isShipped = order.status === OrderStatus.OutForDelivery || order.status === OrderStatus.ReadyForPickup || order.status === 4 || order.status === 5;
  const isDelivered = order.status === OrderStatus.Completed || order.status === 6;

  // Sub-customer specific approvals
  const isMerchantApproved =
    Boolean(order.merchantApprovedAt) ||
    order.status === OrderStatus.PendingAdminApproval ||
    order.status === 9 ||
    [2, 3, 4, 5, 6, 9, 12].includes(Number(order.status));

  const isFactoryApproved =
    Boolean(order.adminApprovedAt) ||
    [2, 3, 4, 5, 6, 12].includes(Number(order.status));

  // Custom status banner text and colors
  const getTimelineBadge = () => {
    const s = Number(order.status);
    if (s === OrderStatus.PendingMerchantApproval || s === 8) {
      return {
        text: t(ui.orders.statuses.pendingMerchant),
        className: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    if (s === OrderStatus.PendingAdminApproval || s === 9) {
      return {
        text: t(ui.orders.statuses.pendingAdmin),
        className: 'bg-[#eef8f1] text-[#234c2e] border-[#cce7d5]',
      };
    }
    if (s === OrderStatus.PendingPaymentApproval || s === 12) {
      return {
        text: t(ui.orders.statuses.pendingPayment),
        className: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    }
    if (s === OrderStatus.Pending || s === 1) {
      if (isSub) {
        if (!order.merchantApprovedAt) {
          return {
            text: t(ui.orders.statuses.pendingMerchant),
            className: 'bg-amber-50 text-amber-800 border-amber-200',
          };
        }
        return {
          text: t(ui.orders.statuses.pendingAdmin),
          className: 'bg-[#eef8f1] text-[#234c2e] border-[#cce7d5]',
        };
      }
      return {
        text: t(ui.orders.statuses.pendingAdmin),
        className: 'bg-[#eef8f1] text-[#234c2e] border-[#cce7d5]',
      };
    }
    return {
      text: statusMeta.text,
      className: `${statusMeta.bg} ${statusMeta.color}`,
    };
  };

  const timelineBadge = getTimelineBadge();

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200 overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-slate-50 shadow-2xl border border-slate-200/80 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Fixed Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-white border-b border-slate-200/80 shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-black text-ink">{t(ui.orders.modalTitle)}</h2>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg" dir="ltr">
              #{order.orderNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            aria-label={t(ui.common.close)}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Card 1: Order Number & Date */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 block">رقم الطلب</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm sm:text-base font-black text-ink tracking-wide font-mono" dir="ltr">
                  #{order.orderNumber}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(order.orderNumber, 'رقم الطلب')}
                  className="text-slate-400 hover:text-[#234c2e] hover:bg-emerald-50 rounded-lg p-1 transition cursor-pointer"
                  title="نسخ رقم الطلب"
                >
                  <CopyIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>
                  {formattedDate} - {formattedTime}
                </span>
              </div>
            </div>

            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-emerald-50 text-[#234c2e] border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
              <ShoppingBagIcon className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 2: Order Path and Status Tracker */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-black text-ink">حالة ومسار الطلب</h3>
              <span className={`rounded-xl border px-3 py-1 text-xs font-black ${timelineBadge.className}`}>
                {timelineBadge.text}
              </span>
            </div>

            {/* Vertical Timeline Workflow */}
            <div className="relative space-y-6">
              {/* Connecting line perfectly centered with 32px circles */}
              <div className="absolute top-4 bottom-4 right-[15px] w-[2px] bg-slate-200 pointer-events-none" />

              {isBankTransfer ? (
                isSub ? (
                  /* مسار التحويل البنكي للعميل الفرعي: 6 خطوات */
                  <>
                    {/* Step 1: تقديم طلب العميل الفرعي */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div className="h-8 w-8 rounded-full bg-[#00875a] text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-white">
                        <CheckIcon className="h-4 w-4 stroke-[3]" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-ink">تقديم طلب العميل الفرعي</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">تم استلام طلبك بنجاح وتسجيله في النظام</p>
                      </div>
                    </div>

                    {/* Step 2: موافقة واعتماد التاجر الرئيسي */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isMerchantApproved
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isPendingApproval
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isMerchantApproved ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isPendingApproval ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-ink">موافقة واعتماد التاجر الرئيسي</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isMerchantApproved ? 'تم الاعتماد بنجاح' : 'بانتظار موافقة التاجر الرئيسي'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: مراجعة واعتماد إدارة المصنع */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isFactoryApproved || isApproved || isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isMerchantApproved && isPendingApproval
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isFactoryApproved || isApproved || isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isMerchantApproved && isPendingApproval ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-ink">مراجعة واعتماد إدارة المصنع</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isFactoryApproved || isApproved || isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'تم الاعتماد والتأكيد بنجاح'
                            : 'بانتظار تأكيد الإدارة'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: سداد ورفع إيصال التحويل البنكي */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isApproved
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isApproved ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs sm:text-sm ${isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered || isApproved
                              ? 'font-black text-ink'
                              : 'font-bold text-slate-400'
                            }`}
                        >
                          سداد ورفع إيصال التحويل البنكي
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'تم رفع إيصال التحويل بنجاح'
                            : isApproved
                              ? 'متاح الآن للسداد ورفع الإيصال'
                              : 'بعد اعتماد المصنع'}
                        </p>
                      </div>
                    </div>

                    {/* Step 5: مراجعة وتأكيد السداد من المالية */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isProcessing || isShipped || isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isReceiptUploaded || Number(order.status) === 12
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isProcessing || isShipped || isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isReceiptUploaded || Number(order.status) === 12 ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs sm:text-sm ${isProcessing || isShipped || isDelivered || isReceiptUploaded || Number(order.status) === 12
                              ? 'font-black text-ink'
                              : 'font-bold text-slate-400'
                            }`}
                        >
                          مراجعة وتأكيد السداد من المالية
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isProcessing || isShipped || isDelivered
                            ? 'تم تأكيد واعتماد السداد بنجاح'
                            : isReceiptUploaded || Number(order.status) === 12
                              ? 'جاري تدقيق الإيصال من الإدارة المالية'
                              : 'بعد رفع إيصال السداد'}
                        </p>
                      </div>
                    </div>

                    {/* Step 6: خرج للتوصيل أو جاهز للتحميل */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isShipped
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isShipped ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs sm:text-sm ${isDelivered || isShipped ? 'font-black text-ink' : 'font-bold text-slate-400'
                            }`}
                        >
                          {order.orderType === OrderType.Delivery
                            ? 'خرج للتوصيل بشاحنة المصنع'
                            : 'جاهز للتحميل من صوامع المصنع'}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isDelivered
                            ? 'تم التسليم بنجاح'
                            : isShipped
                              ? order.orderType === OrderType.Delivery
                                ? 'الشحنة في الطريق للعنوان'
                                : 'جاهز للتحميل من الصوامع'
                              : 'بعد تأكيد السداد'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* مسار التحويل البنكي للتاجر الرئيسي المباشر: 5 خطوات تماماً كما في التصميم */
                  <>
                    {/* Step 1: تقديم الطلب للمصنع */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div className="h-8 w-8 rounded-full bg-[#00875a] text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-white">
                        <CheckIcon className="h-4 w-4 stroke-[3]" />
                      </div>
                      <div className="pt-1">
                        <h4 className="text-xs sm:text-sm font-black text-ink">تقديم الطلب للمصنع</h4>
                      </div>
                    </div>

                    {/* Step 2: مراجعة واعتماد إدارة المصنع */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isApproved || isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : 'bg-[#f1f5f9] border border-[#cbd5e1]'
                          }`}
                      >
                        {isApproved || isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs sm:text-sm ${isApproved || isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                              ? 'font-black text-ink'
                              : 'font-bold text-slate-500'
                            }`}
                        >
                          مراجعة واعتماد إدارة المصنع
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isApproved || isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'تم اعتماد وتأكيد المصنع بنجاح'
                            : 'بانتظار تأكيد الإدارة'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: سداد ورفع إيصال التحويل البنكي */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isApproved
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isApproved ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs sm:text-sm ${isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered || isApproved
                              ? 'font-black text-ink'
                              : 'font-bold text-slate-400'
                            }`}
                        >
                          سداد ورفع إيصال التحويل البنكي
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isReceiptUploaded || Number(order.status) === 12 || isProcessing || isShipped || isDelivered
                            ? 'تم رفع إيصال التحويل بنجاح'
                            : isApproved
                              ? 'متاح الآن للسداد ورفع الإيصال'
                              : 'بعد اعتماد المصنع'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: مراجعة وتأكيد السداد من المالية */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isProcessing || isShipped || isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isReceiptUploaded || Number(order.status) === 12
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isProcessing || isShipped || isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isReceiptUploaded || Number(order.status) === 12 ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs sm:text-sm ${isProcessing || isShipped || isDelivered || isReceiptUploaded || Number(order.status) === 12
                              ? 'font-black text-ink'
                              : 'font-bold text-slate-400'
                            }`}
                        >
                          مراجعة وتأكيد السداد من المالية
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isProcessing || isShipped || isDelivered
                            ? 'تم تأكيد واعتماد السداد بنجاح'
                            : isReceiptUploaded || Number(order.status) === 12
                              ? 'جاري تدقيق الإيصال من الإدارة المالية'
                              : 'بعد رفع إيصال السداد'}
                        </p>
                      </div>
                    </div>

                    {/* Step 5: خرج للتوصيل بشاحنة المصنع أو الاستلام من المصنع */}
                    <div className="relative flex items-start gap-4 z-10">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isDelivered
                            ? 'bg-[#00875a] text-white shadow-xs'
                            : isShipped
                              ? 'bg-[#f1f5f9] border border-[#cbd5e1]'
                              : 'bg-[#f8fafc] border border-[#e2e8f0]'
                          }`}
                      >
                        {isDelivered ? (
                          <CheckIcon className="h-4 w-4 stroke-[3]" />
                        ) : isShipped ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#64748b]" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs sm:text-sm ${isDelivered || isShipped ? 'font-black text-ink' : 'font-bold text-slate-400'
                            }`}
                        >
                          {order.orderType === OrderType.Delivery
                            ? 'خرج للتوصيل بشاحنة المصنع'
                            : 'جاهز للتحميل من صوامع المصنع'}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isDelivered
                            ? 'تم التسليم بنجاح'
                            : isShipped
                              ? order.orderType === OrderType.Delivery
                                ? 'الشحنة في الطريق للعنوان'
                                : 'جاهز للتحميل من صوامع المصنع'
                              : 'بعد تأكيد السداد'}
                        </p>
                      </div>
                    </div>
                  </>
                )
              ) : isSub ? (
                /* مسار التاجر الفرعي الدفع عند الاستلام: 4 خطوات */
                <>
                  {/* Step 1: تقديم طلب العميل الفرعي */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-white">
                      <CheckIcon className="h-4 w-4 stroke-[3]" />
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-ink">تقديم طلب العميل الفرعي</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">تم استلام طلبك بنجاح وتسجيله في النظام</p>
                    </div>
                  </div>

                  {/* Step 2: موافقة واعتماد التاجر الرئيسي */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isMerchantApproved
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isPendingApproval
                            ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 ring-emerald-100 animate-pulse'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                    >
                      {isMerchantApproved ? (
                        <CheckIcon className="h-4 w-4 stroke-[3]" />
                      ) : isPendingApproval ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-ink">موافقة واعتماد التاجر الرئيسي</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isMerchantApproved ? 'تم الاعتماد بنجاح' : 'بانتظار موافقة التاجر الرئيسي'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: اعتماد وتأكيد إدارة المصنع */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isFactoryApproved
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isMerchantApproved && isPendingApproval
                            ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 ring-emerald-100 animate-pulse'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                    >
                      {isFactoryApproved ? (
                        <CheckIcon className="h-4 w-4 stroke-[3]" />
                      ) : isMerchantApproved && isPendingApproval ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-ink">اعتماد وتأكيد إدارة المصنع</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isFactoryApproved ? 'تم الاعتماد والتأكيد بنجاح' : 'بانتظار تأكيد الإدارة'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: خروج الشحنة أو الاستلام من المصنع */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isDelivered
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isShipped
                            ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 animate-pulse ring-emerald-100'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                    >
                      {isDelivered ? (
                        <CheckIcon className="h-4 w-4 stroke-[3]" />
                      ) : isShipped ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-ink">
                        {order.orderType === OrderType.Delivery
                          ? 'خرج للتوصيل بشاحنة المصنع'
                          : 'جاهز للتحميل من صوامع المصنع'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {order.orderType === OrderType.Delivery
                          ? 'تسليم وتحصيل الفاتورة نقداً'
                          : 'تسليم واستلام البضاعة من المصنع'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* مسار التاجر الرئيسي الدفع عند الاستلام: 3 خطوات */
                <>
                  {/* Step 1: تقديم الطلب للمصنع */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-white">
                      <CheckIcon className="h-4 w-4 stroke-[3]" />
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-ink">تقديم الطلب للمصنع</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">تم استلام طلبك وتسجيله في النظام</p>
                    </div>
                  </div>

                  {/* Step 2: تم تأكيد واعتماد الطلب (موافقة المصنع فقط) */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isApproved || isProcessing || isShipped || isDelivered
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isPendingApproval
                            ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 ring-emerald-100 animate-pulse'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                    >
                      {isApproved || isProcessing || isShipped || isDelivered ? (
                        <CheckIcon className="h-4 w-4 stroke-[3]" />
                      ) : isPendingApproval ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-ink">تم تأكيد واعتماد الطلب</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isApproved || isProcessing || isShipped || isDelivered
                          ? 'تم اعتماد الطلب وتأكيد توفر الكميات من المصنع'
                          : 'بانتظار تأكيد الإدارة وتدقيق الكميات'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: خروج الشحنة أو الاستلام من المصنع */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${isDelivered
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isShipped
                            ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 animate-pulse ring-emerald-100'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                    >
                      {isDelivered ? (
                        <CheckIcon className="h-4 w-4 stroke-[3]" />
                      ) : isShipped ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-ink">
                        {order.orderType === OrderType.Delivery
                          ? 'خرج للتوصيل بشاحنة المصنع'
                          : 'جاهز للتحميل من صوامع المصنع'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {order.orderType === OrderType.Delivery
                          ? 'تسليم وتحصيل الفاتورة نقداً'
                          : 'تسليم واستلام البضاعة من المصنع'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Current Step Action Card (matching Screenshot 3 & 4) */}
          {isPendingApproval && (
            <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-lg bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-black mb-2">
                    قيد التدقيق
                  </span>
                  <h4 className="text-sm font-black text-blue-950">
                    {isSub
                      ? isMerchantApproved
                        ? 'الخطوة 2: قيد مراجعة واعتماد إدارة المصنع'
                        : 'الخطوة 1: قيد مراجعة واعتماد التاجر الرئيسي'
                      : 'الخطوة 1: قيد مراجعة واعتماد إدارة المصنع'}
                  </h4>
                </div>

                <div className="h-10 w-10 rounded-2xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0">
                  <Building2Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="text-xs text-blue-900 leading-relaxed font-medium">
                {isSub
                  ? isMerchantApproved
                    ? isBankTransfer
                      ? 'تم اعتماد طلبك من التاجر الرئيسي بنجاح، والطلب حالياً بانتظار مراجعة وتأكيد إدارة المصنع لتجهيز الكميات. بمجرد الاعتماد، ستظهر لك بيانات التحويل البنكي ورفع الإيصال.'
                      : 'تم اعتماد طلبك من التاجر الرئيسي بنجاح، والطلب حالياً بانتظار مراجعة وتأكيد إدارة المصنع لتجهيز الكميات.'
                    : 'طلبك قيد مراجعة واعتماد التاجر الرئيسي التابع له حسابك. بمجرد موافقته، سيتم تحويل الطلب لإدارة المصنع للاعتماد النهائي وتوفير بيانات التحويل.'
                  : isBankTransfer
                    ? 'طلبك قيد المراجعة وتأكيد توفر الكميات لدى إدارة المصنع. بمجرد الاعتماد، ستظهر لك بيانات التحويل البنكي ورفع الإيصال لتجهيز الشحن.'
                    : 'طلبك قيد المراجعة وتأكيد توفر الكميات لدى إدارة المصنع. بمجرد الاعتماد، ستتم متابعة التجهيز والتحميل.'}
              </p>
            </div>
          )}

          {/* Card 3 (Alternate): Bank Accounts & Receipt Upload when Approved for Payment */}
          {isBankTransfer && (isApproved || isReceiptUploaded) && (
            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-4 sm:p-5 space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-emerald-200/60 pb-3">
                <div>
                  <span className="inline-block rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[11px] font-black mb-1.5">
                    {isReceiptUploaded ? 'تم رفع الإيصال' : 'معتمد للسداد'}
                  </span>
                  <h4 className="text-sm font-black text-emerald-950">
                    {isReceiptUploaded
                      ? 'جاري تدقيق الإيصال من الإدارة المالية'
                      : 'الخطوة 2: سداد المبلغ ورفع إيصال التحويل'}
                  </h4>
                </div>

                <div className="h-10 w-10 rounded-2xl bg-emerald-600/15 text-emerald-700 flex items-center justify-center shrink-0">
                  <CreditCardIcon className="h-5 w-5" />
                </div>
              </div>

              {/* Bank Accounts Info */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-emerald-900">حسابات مجموعة شركات الايمان المعتمدة للتحويل:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="rounded-2xl bg-white p-3 border border-emerald-200/70 space-y-1">
                    <span className="font-extrabold text-slate-700 block">البنك الأهلي المصري</span>
                    <div className="flex items-center justify-between font-mono font-bold text-ink">
                      <span>19800012345678</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('19800012345678', 'رقم الحساب')}
                        className="text-slate-400 hover:text-brand-600"
                      >
                        <CopyIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-3 border border-emerald-200/70 space-y-1">
                    <span className="font-extrabold text-slate-700 block">بنك مصر</span>
                    <div className="flex items-center justify-between font-mono font-bold text-ink">
                      <span>20100098765432</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('20100098765432', 'رقم الحساب')}
                        className="text-slate-400 hover:text-brand-600"
                      >
                        <CopyIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-3 border border-emerald-200/70 space-y-1 sm:col-span-2">
                    <span className="font-extrabold text-slate-700 block">فودافون كاش / إنستاباي (InstaPay)</span>
                    <div className="flex items-center justify-between font-mono font-bold text-ink">
                      <span>01020304050</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('01020304050', 'رقم إنستاباي')}
                        className="text-slate-400 hover:text-brand-600"
                      >
                        <CopyIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Receipt Zone */}
              <div className="pt-2">
                <label className="block text-xs font-black text-slate-700 mb-2">
                  رفع صورة أو ملف إيصال التحويل البنكي:
                </label>
                {isReceiptUploaded ? (
                  <div className="rounded-2xl bg-white border border-emerald-300 p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                      <FileCheckIcon className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>
                        تم استلام إيصال التحويل بنجاح {receiptFileName ? `(${receiptFileName})` : ''} وجاري مراجعته
                      </span>
                    </div>
                    <label className="cursor-pointer text-xs text-brand-700 font-bold hover:underline shrink-0">
                      تغيير الملف
                      <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-4 bg-white flex flex-col items-center justify-center gap-1.5 transition text-center">
                    <UploadCloudIcon className="h-6 w-6 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-950">
                      {isUploadingReceipt ? 'جاري رفع الإيصال…' : 'اضغط لاختيار أو تصوير إيصال التحويل البنكي'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">يدعم الصور بصيغة JPG, PNG أو ملف PDF</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Card 4: Delivery or Factory Pickup Details (matching Screenshot 3 & 4) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-black text-ink">
                {order.orderType === OrderType.Delivery ? 'تفاصيل توصيل وصال' : 'تفاصيل الاستلام من المصنع'}
              </h3>
              <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                {order.orderType === OrderType.Delivery ? (
                  <TruckIcon className="h-5 w-5 stroke-[1.8]" />
                ) : (
                  <Building2Icon className="h-5 w-5 stroke-[1.8]" />
                )}
              </div>
            </div>

            {order.orderType === OrderType.Delivery ? (
              <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-50">
                <div className="flex items-center justify-between py-1">
                  <span className="font-bold text-slate-400">طريقة الاستلام</span>
                  <span className="font-black text-ink">وصال (المصنع يتولى الشحن والتوصيل)</span>
                </div>
                {order.truckName && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-slate-400">نوع الشاحنة المعينة</span>
                    <span className="font-black text-ink">{order.truckName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-slate-400">عنوان التسليم</span>
                  <span className="font-black text-ink text-left">
                    {order.deliveryAddress
                      ? `${order.deliveryAddress.city} - ${order.deliveryAddress.street}${order.deliveryAddress.district ? ` - ${order.deliveryAddress.district}` : ''
                      }`
                      : 'العنوان المسجل في حسابك'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-50">
                <div className="flex items-center justify-between py-1">
                  <span className="font-bold text-slate-400">طريقة الاستلام</span>
                  <span className="font-black text-ink">استلام مباشر من صوامع المصنع</span>
                </div>
                {order.driverName && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-slate-400">اسم السائق</span>
                    <span className="font-black text-ink">{order.driverName}</span>
                  </div>
                )}
                {order.vehiclePlateNumber && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-slate-400">رقم لوحة الشاحنة</span>
                    <span className="font-black text-ink font-mono">{order.vehiclePlateNumber}</span>
                  </div>
                )}
                {driverPhone && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-slate-400">هاتف السائق</span>
                    <span className="font-bold text-ink" dir="ltr">{driverPhone}</span>
                  </div>
                )}
                {order.expectedPickupDate && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-slate-400">موعد الاستلام المتوقع</span>
                    <span className="font-black text-ink">
                      {new Date(order.expectedPickupDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 5: Products List */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="flex items-center gap-2 text-sm sm:text-base font-black text-ink border-b border-slate-100 pb-3">
              <PackageIcon className="h-5 w-5 text-brand-600" />
              <span>أصناف الطلب ({order.items?.length || 0})</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 text-xs">
                    <div className="flex items-center gap-3">
                      {item.productImageUrl ? (
                        <img
                          src={resolveMediaUrl(item.productImageUrl)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-11 w-11 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-black">
                          علف
                        </div>
                      )}
                      <div>
                        <p className="font-black text-ink text-sm">{item.productName || 'منتج علف مجموعة شركات الايمان'}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          العبوة: {item.packageWeightKg} كجم • الكمية: {item.quantity} شيكارة • إجمالي الوزن:{' '}
                          <strong className="text-slate-700">
                            {item.quantity * item.packageWeightKg >= 1000
                              ? `${Number(((item.quantity * item.packageWeightKg) / 1000).toFixed(2))} طن`
                              : `${(item.quantity * item.packageWeightKg).toLocaleString()} كجم`}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-start font-bold shrink-0">
                      <p className="text-brand-700 font-black text-sm">{item.subtotal.toLocaleString()} ج.م</p>
                      <p className="text-[10px] text-slate-400">{item.unitPrice.toLocaleString()} ج.م للعبوة</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">لا توجد تفاصيل أصناف متاحة</div>
              )}
            </div>
          </div>

          {/* Card 6: Invoice & Weights Summary (matching Screenshot 3 & 4) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-black text-ink">ملخص الفاتورة والأوزان</h3>
              <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <ScaleIcon className="h-5 w-5 stroke-[1.8]" />
              </div>
            </div>

            <div className="space-y-2.5 divide-y divide-slate-50">
              <div className="flex justify-between text-slate-600 font-bold py-1">
                <span className="text-slate-400">إجمالي وزن الطلب</span>
                <span className="font-black text-ink">
                  {order.totalWeightTons ? `${order.totalWeightTons} طن` : `${order.totalWeightKg || 0} كجم`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 font-bold pt-2">
                <span className="text-slate-400">إجمالي سعر المنتجات</span>
                <span className="font-black text-ink">{order.subtotal.toFixed(1)} ج.م</span>
              </div>

              <div className="flex justify-between text-slate-600 font-bold pt-2">
                <span className="text-slate-400">تكلفة الشحن والتوصيل</span>
                <span className="font-black text-ink">{order.shippingFee.toFixed(1)} ج.م</span>
              </div>

              <div className="flex justify-between text-slate-600 font-bold pt-2">
                <span className="text-slate-400">طريقة السداد</span>
                <span className="font-black text-ink">
                  {isBankTransfer
                    ? 'تحويل بنكي / إلكتروني'
                    : 'الدفع عند الاستلام / التحميل'}
                </span>
              </div>

              {order.discountAmount ? (
                <div className="flex justify-between text-emerald-600 font-bold pt-2">
                  <span>الخصم المطبق:</span>
                  <span className="font-black">-{order.discountAmount.toFixed(1)} ج.م</span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-black text-brand-700">
              <span>الإجمالي النهائي للطلب</span>
              <span className="text-xl">{order.totalAmount.toFixed(1)} ج.م</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl bg-slate-200/90 hover:bg-slate-300 px-6 py-2.5 text-xs font-black text-slate-700 transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

