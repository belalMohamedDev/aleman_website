import { PackageIcon, TruckIcon, WarehouseIcon, ChevronLeftIcon, BanIcon } from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { OrderStatus, OrderType, PaymentMethod } from '../../features/profile/types';

interface OrderCardProps {
  order: OrderResponse;
  onViewDetails: (order: OrderResponse) => void;
  onCancelOrder?: (id: number) => void;
  showCustomerName?: boolean;
}

export function OrderCard({ order, onViewDetails, onCancelOrder, showCustomerName }: OrderCardProps) {
  const isPending = order.status === OrderStatus.Pending;
  const isBankTransfer = order.paymentMethod === PaymentMethod.BankTransferOrOnline;
  const isSubCustomerOrder = Boolean(order.parentMerchantId);

  // Status Badge Label & Colors (matching mobile screenshot)
  const getStatusDisplay = () => {
    if (order.status === OrderStatus.Pending) {
      if (isBankTransfer) {
        if (isSubCustomerOrder && !order.merchantApprovedAt) {
          return {
            text: 'قيد موافقة التاجر',
            bg: 'bg-blue-50 text-blue-700 border-blue-200',
          };
        }
        return {
          text: 'قيد موافقة الإدارة',
          bg: 'bg-[#eaf4fe] text-[#1976d2] border-[#bbdefb]',
        };
      }
      return {
        text: 'قيد الانتظار',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    if (order.status === OrderStatus.Confirmed) {
      return { text: 'تم التأكيد', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
    if (order.status === OrderStatus.Processing) {
      return { text: 'قيد التجهيز', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
    if (order.status === OrderStatus.Shipped) {
      return { text: 'جاري التوصيل', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
    if (order.status === OrderStatus.Delivered) {
      return { text: 'تم التسليم بنجاح', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (order.status === OrderStatus.Cancelled) {
      return { text: 'ملغي', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (order.status === OrderStatus.Refunded) {
      return { text: 'مسترجع', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
    return {
      text: order.statusName || 'قيد المعالجة',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  };

  const statusDisplay = getStatusDisplay();

  // Date formatted as YYYY/M/D (matching mobile screenshot e.g. 2026/9/16)
  const formatOrderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    } catch {
      return dateStr;
    }
  };

  // Weight display (e.g. 0.025 طن)
  const getWeightDisplay = () => {
    if (order.totalWeightTons !== undefined && order.totalWeightTons !== null && order.totalWeightTons > 0) {
      return `${order.totalWeightTons} طن`;
    }
    if (order.totalWeightKg !== undefined && order.totalWeightKg !== null && order.totalWeightKg > 0) {
      const tons = order.totalWeightKg / 1000;
      return tons >= 0.001 ? `${tons} طن` : `${order.totalWeightKg} كجم`;
    }
    return '0 طن';
  };

  const formattedTotal = `${Number(order.totalAmount || 0).toFixed(1)} ج.م`;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md hover:border-slate-300">
      {/* Top Row: Package Icon + Order Number & Order Type Badge (وصال / استلام) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <PackageIcon className="h-5 w-5" />
          </div>
          <span className="text-sm sm:text-base font-black text-ink truncate">
            الطلب #{order.orderNumber}
          </span>
        </div>

        {/* Order Type Pill (وصال / استلام من المصنع) */}
        <div className="shrink-0">
          {order.orderType === OrderType.Delivery ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200/80 px-3 py-1 text-xs font-black">
              <span>وصال</span>
              <TruckIcon className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 px-3 py-1 text-xs font-black">
              <span>استلام من المصنع</span>
              <WarehouseIcon className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Sub-customer info if merchant is viewing */}
      {showCustomerName && order.customerName && (
        <div className="mt-2 text-xs font-bold text-slate-500 flex items-center gap-1">
          <span>العميل:</span>
          <span className="text-ink font-black">{order.customerName}</span>
        </div>
      )}

      {/* Middle Row: Total Weight & Date on Right; Total Price on Left */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-slate-700">
            إجمالي الكمية: {getWeightDisplay()}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-0.5" dir="ltr">
            {formatOrderDate(order.createdAt)}
          </p>
        </div>

        <div className="text-left">
          <p className="text-[11px] sm:text-xs text-slate-400 font-bold">الإجمالي</p>
          <p className="text-base sm:text-lg font-black text-ink font-mono mt-0.5" dir="ltr">
            {formattedTotal}
          </p>
        </div>
      </div>

      {/* Bottom Row: Status Badge on Right; Details Link (< التفاصيل) on Left */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        {/* Status Badge */}
        <div>
          <span
            className={`inline-flex items-center justify-center rounded-xl border px-3.5 py-1.5 text-xs font-black shadow-2xs ${statusDisplay.bg}`}
          >
            {statusDisplay.text}
          </span>
        </div>

        {/* Actions: View Details & Optional Cancel */}
        <div className="flex items-center gap-3">
          {isPending && onCancelOrder && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) {
                  onCancelOrder(order.id);
                }
              }}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition"
            >
              <BanIcon className="h-3 w-3" />
              <span>إلغاء</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 transition group"
          >
            <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>التفاصيل</span>
          </button>
        </div>
      </div>
    </div>
  );
}


