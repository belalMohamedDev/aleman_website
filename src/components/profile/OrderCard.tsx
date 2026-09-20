import { PackageIcon, TruckIcon, WarehouseIcon, BanIcon, LandmarkIcon, BanknoteIcon } from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { OrderStatus, OrderType, PaymentMethod } from '../../features/profile/types';
import { useAuth } from '../../features/auth/AuthContext';
import { isSubCustomer as checkIsSubCustomer } from '../../features/auth/userUtils';

interface OrderCardProps {
  order: OrderResponse;
  onViewDetails: (order: OrderResponse) => void;
  onCancelOrder?: (id: number) => void;
  showCustomerName?: boolean;
}

export function OrderCard({ order, onViewDetails, onCancelOrder, showCustomerName }: OrderCardProps) {
  const { user } = useAuth();
  const isPending = order.status === OrderStatus.Pending;
  const isSubCustomerOrder = Boolean(
    order.parentMerchantId ||
    (order.parentMerchantName && order.parentMerchantName.trim() !== '') ||
    (user && checkIsSubCustomer(user))
  );

  // Status Badge Label & Colors (matching mobile screenshots)
  const getStatusDisplay = () => {
    const s = Number(order.status);
    if (s === OrderStatus.PendingMerchantApproval || s === 8) {
      return {
        text: 'قيد موافقة التاجر الرئيسي',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    if (s === OrderStatus.PendingAdminApproval || s === 9) {
      return {
        text: 'قيد موافقة الإدارة',
        bg: 'bg-[#eef8f1] text-[#234c2e] border-[#cce7d5]',
      };
    }
    if (s === OrderStatus.PendingPaymentApproval || s === 12) {
      return {
        text: 'تم رفع الإيصال - قيد تدقيق المالية',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    }
    if (s === OrderStatus.Pending || s === 1) {
      if (isSubCustomerOrder) {
        if (!order.merchantApprovedAt) {
          return {
            text: 'قيد موافقة التاجر الرئيسي',
            bg: 'bg-amber-50 text-amber-800 border-amber-200',
          };
        }
        return {
          text: 'قيد موافقة الإدارة',
          bg: 'bg-[#eef8f1] text-[#234c2e] border-[#cce7d5]',
        };
      }
      return {
        text: 'قيد موافقة الإدارة',
        bg: 'bg-[#eef8f1] text-[#234c2e] border-[#cce7d5]',
      };
    }
    if (s === OrderStatus.Confirmed || s === 2) {
      return { text: 'تم التأكيد', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
    if (s === OrderStatus.Preparing || s === 3) {
      return { text: 'قيد التجهيز', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
    if (s === OrderStatus.OutForDelivery || s === 4) {
      return { text: 'خرج للتوصيل', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
    if (s === OrderStatus.ReadyForPickup || s === 5) {
      return { text: 'جاهز للتحميل', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
    if (s === OrderStatus.Completed || s === OrderStatus.Delivered || s === 6) {
      return { text: 'تم التسليم بنجاح', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (s === OrderStatus.Cancelled || s === 7) {
      return { text: 'ملغي', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (s === OrderStatus.RejectedByMerchant || s === 10) {
      return { text: 'مرفوض من التاجر الرئيسي', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (s === OrderStatus.RejectedByAdmin || s === 11) {
      return { text: 'مرفوض من الإدارة', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (s === OrderStatus.Refunded || s === 13) {
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

  const isBankTransfer =
    order.paymentMethod === PaymentMethod.BankTransfer ||
    order.paymentMethod === 3 ||
    order.paymentMethod === 2 ||
    Boolean(order.paymentMethodName?.includes('تحويل'));

  const formattedTotal = `${Number(order.totalAmount || 0).toFixed(1)} ج.م`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(order)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(order);
        }
      }}
      className="group relative rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/40 active:scale-[0.99] flex flex-col justify-between h-full cursor-pointer text-right select-none"
    >
      <div className="space-y-3">
        {/* Header: Order Info & Status Badge */}
        <div className="flex items-start justify-between gap-2">
          {/* Right: Order ID & Date */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#234c2e] border border-emerald-100/80 group-hover:bg-[#234c2e] group-hover:text-white transition-colors duration-200">
              <PackageIcon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-black text-ink group-hover:text-[#234c2e] transition-colors truncate">
                #{order.orderNumber}
              </span>
              <span className="block text-[11px] text-slate-400 font-medium" dir="ltr">
                {formatOrderDate(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Left: Status Badge */}
          <span
            className={`inline-flex items-center justify-center rounded-xl border px-2.5 py-1 text-[11px] font-black shrink-0 whitespace-nowrap shadow-2xs ${statusDisplay.bg}`}
          >
            {statusDisplay.text}
          </span>
        </div>

        {/* Method Badges (Payment & Delivery) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {isBankTransfer ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/70 px-2 py-0.5 text-[11px] font-bold">
              <LandmarkIcon className="h-3 w-3" />
              <span>تحويل بنكي</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[11px] font-bold">
              <BanknoteIcon className="h-3 w-3" />
              <span>عند الاستلام</span>
            </span>
          )}

          {order.orderType === OrderType.Delivery ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200/70 px-2 py-0.5 text-[11px] font-bold">
              <span>وصال</span>
              <TruckIcon className="h-3 w-3" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/70 px-2 py-0.5 text-[11px] font-bold">
              <span>استلام من المصنع</span>
              <WarehouseIcon className="h-3 w-3" />
            </span>
          )}

          {/* Customer Name if applicable */}
          {showCustomerName && order.customerName && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50/80 text-[#234c2e] border border-emerald-200/60 px-2 py-0.5 text-[11px] font-bold truncate max-w-full">
              <span>العميل:</span>
              <span className="font-black truncate">{order.customerName}</span>
            </span>
          )}
        </div>

        {/* Middle Stats Box (Weight & Total Price) */}
        <div className="rounded-xl bg-slate-50/90 p-2.5 sm:p-3 border border-slate-100/90 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="block text-[11px] font-bold text-slate-400">إجمالي الكمية</span>
            <span className="block text-xs sm:text-sm font-black text-slate-800 whitespace-nowrap mt-0.5">
              {getWeightDisplay()}
            </span>
          </div>

          <div className="text-left shrink-0">
            <span className="block text-[11px] font-bold text-slate-400">المبلغ الإجمالي</span>
            <span className="block text-xs sm:text-sm font-black text-[#234c2e] font-mono whitespace-nowrap mt-0.5" dir="ltr">
              {formattedTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: View Details Link & Optional Cancel */}


      {isPending && onCancelOrder && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) {
              onCancelOrder(order.id);
            }
          }}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 transition"
        >
          <BanIcon className="h-3 w-3" />
          <span>إلغاء</span>
        </button>
      )}
    </div>

  );
}


