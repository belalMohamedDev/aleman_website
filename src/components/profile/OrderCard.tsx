import { CalendarIcon, EyeIcon, BanIcon, ScaleIcon } from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { ORDER_STATUS_META, OrderStatus, OrderType } from '../../features/profile/types';

interface OrderCardProps {
  order: OrderResponse;
  onViewDetails: (order: OrderResponse) => void;
  onCancelOrder?: (id: number) => void;
  showCustomerName?: boolean;
}

export function OrderCard({ order, onViewDetails, onCancelOrder, showCustomerName }: OrderCardProps) {
  const statusMeta = ORDER_STATUS_META[order.status as OrderStatus] || {
    labelAr: order.statusName || 'غير محدد',
    color: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200',
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isPending = order.status === OrderStatus.Pending;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-card hover:border-brand-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">طلب رقم</span>
            <span className="text-sm font-black text-ink">#{order.orderNumber}</span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${statusMeta.bg} ${statusMeta.color}`}>
              {statusMeta.labelAr}
            </span>
          </div>

          {showCustomerName && order.customerName && (
            <p className="text-xs font-black text-blue-700 mt-1">
              العميل / التاجر: {order.customerName}
            </p>
          )}

          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{order.orderType === OrderType.Delivery ? 'توصيل شحن' : 'استلام من المصنع'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition"
          >
            <EyeIcon className="h-3.5 w-3.5 text-slate-500" />
            <span>التفاصيل</span>
          </button>

          {isPending && onCancelOrder && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) {
                  onCancelOrder(order.id);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition"
            >
              <BanIcon className="h-3.5 w-3.5 text-red-500" />
              <span>إلغاء</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-600 font-semibold">
          <span className="flex items-center gap-1">
            <ScaleIcon className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {order.totalWeightTons ? `${order.totalWeightTons} طن` : `${order.totalWeightKg || 0} كجم`}
            </span>
          </span>
          <span>•</span>
          <span>{order.items?.length || 0} أصناف</span>
        </div>

        <div className="text-start sm:text-end">
          <span className="text-[11px] text-slate-400 ml-1">القيمة الإجمالية:</span>
          <span className="text-base font-black text-brand-700">
            {order.totalAmount.toLocaleString()} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}
