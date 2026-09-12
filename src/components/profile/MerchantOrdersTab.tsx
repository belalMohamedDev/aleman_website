import { useState } from 'react';
import { StoreIcon, SearchIcon, FilterIcon } from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { OrderStatus, ORDER_STATUS_META } from '../../features/profile/types';
import { OrderCard } from './OrderCard';
import { OrderDetailModal } from './OrderDetailModal';

interface MerchantOrdersTabProps {
  orders: OrderResponse[];
  isLoading: boolean;
  statusFilter: OrderStatus | undefined;
  onSelectStatus: (status: OrderStatus | undefined) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function MerchantOrdersTab({
  orders,
  isLoading,
  statusFilter,
  onSelectStatus,
  searchTerm,
  onSearchChange,
}: MerchantOrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  const statusOptions: Array<{ value: OrderStatus | undefined; label: string }> = [
    { value: undefined, label: 'جميع طلبات العملاء' },
    { value: OrderStatus.Pending, label: ORDER_STATUS_META[OrderStatus.Pending].labelAr },
    { value: OrderStatus.Processing, label: ORDER_STATUS_META[OrderStatus.Processing].labelAr },
    { value: OrderStatus.Shipped, label: ORDER_STATUS_META[OrderStatus.Shipped].labelAr },
    { value: OrderStatus.Delivered, label: ORDER_STATUS_META[OrderStatus.Delivered].labelAr },
    { value: OrderStatus.Cancelled, label: ORDER_STATUS_META[OrderStatus.Cancelled].labelAr },
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث باسم العميل أو رقم الطلب..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-4 text-xs font-semibold text-ink placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 ml-2">
            <FilterIcon className="h-3.5 w-3.5" />
            <span>الحالة:</span>
          </div>
          {statusOptions.map((opt) => (
            <button
              key={opt.value ?? 'all'}
              type="button"
              onClick={() => onSelectStatus(opt.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === opt.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="p-12 text-center text-sm font-bold text-slate-400 bg-white rounded-3xl border border-slate-100">
          جاري تحميل طلبات صغار التجار والعملاء...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <StoreIcon className="h-8 w-8" />
          </div>
          <h3 className="text-base font-black text-ink">لا توجد طلبات عملاء مطابقة</h3>
          <p className="mt-1 text-xs text-slate-400">
            طلبات صغار التجار والموزعين التابعين لك ستظهر هنا بمجرد تسجيلها.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              showCustomerName
              onViewDetails={setSelectedOrder}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
