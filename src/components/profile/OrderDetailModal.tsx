import { useState } from 'react';
import {
  XIcon,
  PackageIcon,
  MapPinIcon,
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
import { toast } from 'sonner';

interface OrderDetailModalProps {
  order: OrderResponse | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [isReceiptUploaded, setIsReceiptUploaded] = useState(false);

  if (!order) return null;

  const isBankTransfer = order.paymentMethod === PaymentMethod.BankTransferOrOnline;
  
  // Heuristic: check if this is a sub-customer order (e.g. from merchant orders tab or marked as sub-customer)
  const isSubCustomer = Boolean(order.customerName && order.customerName.length > 0);
  const driverPhone = order.driverPhone || order.vehicle?.driverPhone;

  const statusMeta = ORDER_STATUS_META[order.status as OrderStatus] || {
    labelAr: order.statusName || 'غير محدد',
    color: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200',
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const formattedTime = new Date(order.createdAt).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label} بنجاح`);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      setIsUploadingReceipt(true);
      setTimeout(() => {
        setIsUploadingReceipt(false);
        setIsReceiptUploaded(true);
        toast.success('تم رفع إيصال السداد البنكي بنجاح وسيتم تدقيقه من المالية');
      }, 1000);
    }
  };

  // Determine current timeline step
  // Step 1: تقديم الطلب (Done)
  // Step 2: مراجعة واعتماد إدارة المصنع (أو التاجر الرئيسي)
  // Step 3: سداد ورفع إيصال التحويل
  // Step 4: مراجعة وتأكيد السداد من المالية
  // Step 5: خرج للتوصيل / جاهز للتحميل
  const isPendingApproval = order.status === OrderStatus.Pending;
  const isApproved = order.status === OrderStatus.Confirmed;
  const isProcessing = order.status === OrderStatus.Processing;
  const isShipped = order.status === OrderStatus.Shipped;
  const isDelivered = order.status === OrderStatus.Delivered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-50 p-4 sm:p-6 shadow-2xl border border-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header with Close */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60">
          <h2 className="text-base sm:text-lg font-black text-ink">تفاصيل الطلب</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
            aria-label="إغلاق"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Card 1: Order Number & Date matching Screenshot 3 */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-400 block">رقم الطلب</span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => copyToClipboard(order.orderNumber, 'رقم الطلب')}
                  className="text-slate-400 hover:text-brand-600 transition p-1"
                  title="نسخ رقم الطلب"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
                <span className="text-sm sm:text-base font-black text-ink tracking-wide font-mono" dir="ltr">
                  #{order.orderNumber}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                <ClockIcon className="h-3 w-3 text-slate-400" />
                <span>{formattedDate} - {formattedTime}</span>
              </p>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
              <ShoppingBagIcon className="h-7 w-7 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 2: Order Path and Status Tracker matching Screenshot 3 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-black text-ink">حالة ومسار الطلب</h3>
              <span className="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 text-xs font-black">
                {isSubCustomer
                  ? 'قيد موافقة التاجر الرئيسي'
                  : isPendingApproval
                    ? 'قيد موافقة الإدارة'
                    : statusMeta.labelAr}
              </span>
            </div>

            {/* Vertical Timeline Workflow */}
            <div className="relative pr-2 space-y-6">
              {/* Connecting line */}
              <div className="absolute top-3 bottom-3 right-[15px] w-0.5 bg-slate-200" />

              {/* Step 1: تقديم الطلب للمصنع */}
              <div className="relative flex items-start gap-4 z-10">
                <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-white">
                  <CheckIcon className="h-4 w-4 stroke-[3]" />
                </div>
                <div className="pt-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-ink">تقديم الطلب للمصنع</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">تم استلام طلبك بنجاح وتسجيله في النظام</p>
                </div>
              </div>

              {/* Step 2: مراجعة واعتماد إدارة المصنع أو التاجر الرئيسي */}
              <div className="relative flex items-start gap-4 z-10">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${
                    isApproved || isProcessing || isShipped || isDelivered
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isPendingApproval
                        ? 'border-2 border-brand-600 bg-brand-50/50 text-brand-600 ring-brand-100 animate-pulse'
                        : 'bg-slate-100 border border-slate-300 text-slate-400'
                  }`}
                >
                  {isApproved || isProcessing || isShipped || isDelivered ? (
                    <CheckIcon className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                  )}
                </div>
                <div className="pt-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-ink">
                    {isSubCustomer
                      ? 'مراجعة واعتماد التاجر الرئيسي وإدارة المصنع'
                      : 'مراجعة واعتماد إدارة المصنع'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isSubCustomer
                      ? 'بانتظار موافقة التاجر الرئيسي ثم تأكيد إدارة المصنع'
                      : 'بانتظار تأكيد الإدارة وتدقيق الكميات'}
                  </p>
                </div>
              </div>

              {/* Step 3: سداد ورفع إيصال التحويل البنكي */}
              {isBankTransfer ? (
                <div className="relative flex items-start gap-4 z-10">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${
                      isReceiptUploaded || order.isPaid || isProcessing || isShipped || isDelivered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isApproved
                          ? 'border-2 border-brand-600 bg-brand-50/50 text-brand-600 animate-pulse'
                          : 'bg-slate-100 border border-slate-200 text-slate-400'
                    }`}
                  >
                    {isReceiptUploaded || order.isPaid || isProcessing || isShipped || isDelivered ? (
                      <CheckIcon className="h-4 w-4 stroke-[3]" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-xs sm:text-sm font-black text-ink">سداد ورفع إيصال التحويل البنكي</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">بعد اعتماد المصنع للطلب</p>
                  </div>
                </div>
              ) : null}

              {/* Step 4: مراجعة وتأكيد السداد من المالية */}
              {isBankTransfer ? (
                <div className="relative flex items-start gap-4 z-10">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${
                      order.isPaid || isProcessing || isShipped || isDelivered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 border border-slate-200 text-slate-400'
                    }`}
                  >
                    {order.isPaid || isProcessing || isShipped || isDelivered ? (
                      <CheckIcon className="h-4 w-4 stroke-[3]" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-xs sm:text-sm font-black text-ink">مراجعة وتأكيد السداد من المالية</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">بعد رفع إيصال السداد</p>
                  </div>
                </div>
              ) : null}

              {/* Step 5: خروج الشحنة أو الاستلام من المصنع */}
              <div className="relative flex items-start gap-4 z-10">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition ${
                    isDelivered
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isShipped
                        ? 'border-2 border-brand-600 bg-brand-50 text-brand-600 animate-pulse'
                        : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                >
                  {isDelivered ? (
                    <CheckIcon className="h-4 w-4 stroke-[3]" />
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
                    {isBankTransfer ? 'بعد تأكيد السداد واعتماد الشحن' : 'تسليم وتحصيل الفاتورة نقداً'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Current Step Action Card (Azure Box matching Screenshot 3) */}
          {isPendingApproval && (
            <div className="rounded-3xl bg-blue-50/70 border border-blue-200/80 p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-lg bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-black mb-2">
                    قيد التدقيق
                  </span>
                  <h4 className="text-sm font-black text-blue-950">
                    {isSubCustomer
                      ? 'الخطوة 1: قيد مراجعة واعتماد التاجر الرئيسي'
                      : 'الخطوة 1: قيد مراجعة واعتماد إدارة المصنع'}
                  </h4>
                </div>

                <div className="h-10 w-10 rounded-2xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0">
                  <Building2Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="text-xs text-blue-900 leading-relaxed font-medium">
                {isSubCustomer
                  ? 'طلبك قيد مراجعة واعتماد التاجر الرئيسي التابع له حسابك. بمجرد موافقته، سيتم تحويل الطلب لإدارة المصنع للاعتماد النهائي وتوفير بيانات التحويل.'
                  : 'طلبك قيد المراجعة وتأكيد توفر الكميات لدى إدارة المصنع. بمجرد الاعتماد، ستظهر لك بيانات التحويل البنكي ورفع الإيصال لتجهيز الشحن.'}
              </p>
            </div>
          )}

          {/* Card 3 (Alternate): Bank Accounts & Receipt Upload when Approved for Payment */}
          {isBankTransfer && (isApproved || isReceiptUploaded) && (
            <div className="rounded-3xl bg-emerald-50/80 border border-emerald-200/80 p-5 space-y-4">
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
                <p className="text-xs font-bold text-emerald-900">حسابات مؤسسة الإيمان المعتمدة للتحويل:</p>
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

          {/* Card 4: Delivery or Factory Pickup Details */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="flex items-center gap-2 text-sm sm:text-base font-black text-ink border-b border-slate-100 pb-3">
              {order.orderType === OrderType.Delivery ? (
                <>
                  <MapPinIcon className="h-5 w-5 text-brand-600" />
                  <span>تفاصيل التوصيل والشحن</span>
                </>
              ) : (
                <>
                  <TruckIcon className="h-5 w-5 text-brand-600" />
                  <span>تفاصيل الاستلام من المصنع</span>
                </>
              )}
            </h3>

            {order.orderType === OrderType.Delivery ? (
              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="font-extrabold text-slate-400 shrink-0">العنوان:</span>
                  <span className="font-bold text-ink">
                    {order.deliveryAddress
                      ? `${order.deliveryAddress.city} - ${order.deliveryAddress.street} ${
                          order.deliveryAddress.district ? `(${order.deliveryAddress.district})` : ''
                        }`
                      : 'تم التسجيل في تفاصيل الطلب'}
                  </span>
                </div>
                {order.truckName && (
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-400 shrink-0">نوع الشاحنة:</span>
                    <span className="font-black text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-100">
                      {order.truckName}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-1">اسم السائق:</span>
                  <span className="font-black text-ink">{order.driverName || 'سائق مفوض'}</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-1">رقم لوحة السيارة:</span>
                  <span className="font-black text-ink font-mono">{order.vehiclePlateNumber || 'غير محدد'}</span>
                </div>
                {driverPhone && (
                  <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-slate-400 font-bold block mb-1">هاتف السائق:</span>
                    <span className="font-bold text-ink" dir="ltr">{driverPhone}</span>
                  </div>
                )}
                {order.expectedPickupDate && (
                  <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-slate-400 font-bold block mb-1">موعد الاستلام المتوقع:</span>
                    <span className="font-black text-ink">
                      {new Date(order.expectedPickupDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 5: Products List */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
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
                          src={item.productImageUrl}
                          alt=""
                          className="h-11 w-11 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-black">
                          علف
                        </div>
                      )}
                      <div>
                        <p className="font-black text-ink text-sm">{item.productName || 'منتج علف مؤسسة الإيمان'}</p>
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

          {/* Card 6: Totals Summary */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between text-slate-600 font-bold">
              <span className="flex items-center gap-1.5">
                <ScaleIcon className="h-4 w-4 text-slate-400" />
                <span>إجمالي وزن الشحنة:</span>
              </span>
              <span className="font-black text-ink">
                {order.totalWeightTons ? `${order.totalWeightTons} طن` : `${order.totalWeightKg || 0} كجم`}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-bold">
              <span>سعر الطلبات (المجموع الفرعي):</span>
              <span className="font-black text-ink">{order.subtotal.toLocaleString()} ج.م</span>
            </div>

            {order.shippingFee > 0 && (
              <div className="flex justify-between text-slate-600 font-bold">
                <span>سعر الشحن والتوصيل:</span>
                <span className="font-black text-ink">{order.shippingFee.toLocaleString()} ج.م</span>
              </div>
            )}

            {order.discountAmount ? (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>الخصم المطبق:</span>
                <span className="font-black">-{order.discountAmount.toLocaleString()} ج.م</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-black text-brand-700">
              <span className="flex items-center gap-1.5">
                <CreditCardIcon className="h-5 w-5" />
                <span>الإجمالي النهائي:</span>
              </span>
              <span className="text-xl">{order.totalAmount.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-2xl bg-slate-200 hover:bg-slate-300 px-6 py-3 text-xs font-black text-slate-700 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

