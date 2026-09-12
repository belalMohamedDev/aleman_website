import { XIcon, PackageIcon, MapPinIcon, TruckIcon, CalendarIcon, CreditCardIcon, ScaleIcon } from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { ORDER_STATUS_META, OrderStatus, OrderType } from '../../features/profile/types';

interface OrderDetailModalProps {
  order: OrderResponse | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const statusMeta = ORDER_STATUS_META[order.status as OrderStatus] || {
    labelAr: order.statusName || 'غير محدد',
    color: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200',
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-ink">طلب رقم #{order.orderNumber}</h3>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusMeta.bg} ${statusMeta.color}`}>
                {statusMeta.labelAr}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="إغلاق"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-6">
          {/* Customer info if merchant order */}
          {order.customerName && (
            <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-4">
              <p className="text-xs font-bold text-blue-600">صاحب الطلب (العميل / التاجر):</p>
              <p className="text-sm font-black text-ink mt-0.5">{order.customerName}</p>
            </div>
          )}

          {/* Delivery or Pickup Details */}
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-wider mb-3">
              {order.orderType === OrderType.Delivery ? (
                <>
                  <MapPinIcon className="h-4 w-4 text-brand-600" />
                  <span>تفاصيل التوصيل والشحن</span>
                </>
              ) : (
                <>
                  <TruckIcon className="h-4 w-4 text-amber-600" />
                  <span>تفاصيل الاستلام من المصنع</span>
                </>
              )}
            </h4>

            {order.orderType === OrderType.Delivery ? (
              <div className="text-xs space-y-1 text-slate-700">
                <p>
                  <span className="font-bold">العنوان:</span>{' '}
                  {order.deliveryAddress
                    ? `${order.deliveryAddress.city} - ${order.deliveryAddress.street} ${order.deliveryAddress.district ? `(${order.deliveryAddress.district})` : ''}`
                    : 'تم التسجيل في تفاصيل الطلب'}
                </p>
                {order.truckName && (
                  <p>
                    <span className="font-bold">نوع الشاحنة:</span> {order.truckName}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xs space-y-1.5 text-slate-700">
                <p>
                  <span className="font-bold">اسم السائق:</span> {order.driverName || 'غير محدد'}
                </p>
                <p>
                  <span className="font-bold">رقم لوحة السيارة:</span> {order.vehiclePlateNumber || 'غير محدد'}
                </p>
                {order.driverLicenseNumber && (
                  <p>
                    <span className="font-bold">رقم الرخصة:</span> {order.driverLicenseNumber}
                  </p>
                )}
                {order.expectedPickupDate && (
                  <p>
                    <span className="font-bold">موعد الاستلام المتوقع:</span>{' '}
                    {new Date(order.expectedPickupDate).toLocaleDateString('ar-EG')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Products List */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-wider mb-3">
              <PackageIcon className="h-4 w-4 text-brand-600" />
              <span>أصناف الطلب ({order.items?.length || 0})</span>
            </h4>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 text-xs">
                    <div className="flex items-center gap-3">
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover bg-slate-50"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold">
                          علف
                        </div>
                      )}
                      <div>
                        <p className="font-black text-ink">{item.productName || 'منتج علف'}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          العبوة: {item.packageWeightKg} كجم • الكمية: {item.quantity} شيكارة
                        </p>
                      </div>
                    </div>
                    <div className="text-start font-bold">
                      <p className="text-brand-700 font-black">{item.subtotal.toLocaleString()} ج.م</p>
                      <p className="text-[10px] text-slate-400">{item.unitPrice.toLocaleString()} ج.م للعبوة</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">لا توجد تفاصيل أصناف متاحة</div>
              )}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <ScaleIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>إجمالي وزن الشحنة:</span>
              </span>
              <span className="font-bold text-ink">
                {order.totalWeightTons ? `${order.totalWeightTons} طن` : `${order.totalWeightKg || 0} كجم`}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-ink">{order.subtotal.toLocaleString()} ج.م</span>
            </div>

            {order.shippingFee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>تكلفة الشحن والتوصيل:</span>
                <span className="font-bold text-ink">{order.shippingFee.toLocaleString()} ج.م</span>
              </div>
            )}

            {order.discountAmount ? (
              <div className="flex justify-between text-emerald-600">
                <span>الخصم:</span>
                <span className="font-bold">-{order.discountAmount.toLocaleString()} ج.م</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-black text-brand-700">
              <span className="flex items-center gap-1.5">
                <CreditCardIcon className="h-4 w-4" />
                <span>الإجمالي النهائي:</span>
              </span>
              <span>{order.totalAmount.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
