import { useState } from 'react';
import { PackageIcon, FilterIcon } from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { OrderStatus, ORDER_STATUS_META } from '../../features/profile/types';
import { OrderCard } from './OrderCard';
import { OrderDetailModal } from './OrderDetailModal';

interface OrdersTabProps {
  orders: OrderResponse[];
  isLoading: boolean;
  statusFilter: OrderStatus | undefined;
  onSelectStatus: (status: OrderStatus | undefined) => void;
  onCancelOrder: (id: number) => void;
}

export function OrdersTab({ orders, isLoading, statusFilter, onSelectStatus, onCancelOrder }: OrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  const statusOptions: Array<{ value: OrderStatus | undefined; label: string }> = [
    { value: undefined, label: 'جميع الطلبات' },
    { value: OrderStatus.Pending, label: ORDER_STATUS_META[OrderStatus.Pending].labelAr },
    { value: OrderStatus.Processing, label: ORDER_STATUS_META[OrderStatus.Processing].labelAr },
    { value: OrderStatus.Shipped, label: ORDER_STATUS_META[OrderStatus.Shipped].labelAr },
    { value: OrderStatus.Delivered, label: ORDER_STATUS_META[OrderStatus.Delivered].labelAr },
    { value: OrderStatus.Cancelled, label: ORDER_STATUS_META[OrderStatus.Cancelled].labelAr },
  ];

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black text-slate-600">
          <FilterIcon className="h-4 w-4 text-brand-600" />
          <span>تصفية حسب الحالة:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value ?? 'all'}
              type="button"
              onClick={() => onSelectStatus(opt.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === opt.value
                  ? 'bg-brand-600 text-white shadow-sm'
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
          جاري تحميل الطلبات...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-3">
            <PackageIcon className="h-8 w-8" />
          </div>
          <h3 className="text-base font-black text-ink">لا توجد طلبات مسجلة حالياً</h3>
          <p className="mt-1 text-xs text-slate-400">
            عند إنشاء طلبات أعلاف جديدة ستظهر هنا مع إمكانية تتبع مسارها خطوة بخطوة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={setSelectedOrder}
              onCancelOrder={onCancelOrder}
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
