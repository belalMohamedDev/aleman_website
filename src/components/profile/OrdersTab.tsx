import { useState, useMemo } from 'react';
import { PackageIcon, ClockIcon, SearchIcon, History } from 'lucide-react';
import type { OrderResponse } from '../../features/profile/types';
import { OrderStatus } from '../../features/profile/types';
import { OrderCard } from './OrderCard';
import { OrderDetailModal } from './OrderDetailModal';

interface OrdersTabProps {
  orders: OrderResponse[];
  isLoading: boolean;
  statusFilter?: OrderStatus | undefined;
  onSelectStatus?: (status: OrderStatus | undefined) => void;
  onCancelOrder: (id: number) => void;
}

type TabType = 'current' | 'previous';

export function OrdersTab({ orders, isLoading, onCancelOrder }: OrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [searchTerm, setSearchTerm] = useState('');

  // Sort orders descending so newest orders are always at top
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.id - a.id);
  }, [orders]);

  // Filter orders by search term first
  const searchedOrders = useMemo(() => {
    if (!searchTerm.trim()) return sortedOrders;
    const term = searchTerm.trim().toLowerCase();
    return sortedOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(term) ||
        (o.notes && o.notes.toLowerCase().includes(term))
    );
  }, [sortedOrders, searchTerm]);

  // Categorize orders using numeric comparison
  const currentOrders = useMemo(
    () =>
      searchedOrders.filter((o) => {
        const s = Number(o.status);
        return [
          OrderStatus.Pending, // 1
          OrderStatus.PendingMerchantApproval, // 8
          OrderStatus.PendingAdminApproval, // 9
          OrderStatus.PendingPaymentApproval, // 12
          OrderStatus.Confirmed, // 2
          OrderStatus.Preparing, // 3
          OrderStatus.OutForDelivery, // 4
          OrderStatus.ReadyForPickup, // 5
        ].includes(s);
      }),
    [searchedOrders]
  );

  const previousOrders = useMemo(
    () =>
      searchedOrders.filter((o) => {
        const s = Number(o.status);
        return ![
          OrderStatus.Pending, // 1
          OrderStatus.PendingMerchantApproval, // 8
          OrderStatus.PendingAdminApproval, // 9
          OrderStatus.PendingPaymentApproval, // 12
          OrderStatus.Confirmed, // 2
          OrderStatus.Preparing, // 3
          OrderStatus.OutForDelivery, // 4
          OrderStatus.ReadyForPickup, // 5
        ].includes(s);
      }),
    [searchedOrders]
  );

  // Filtered orders to display based on selected tab
  const displayedOrders = useMemo(() => {
    switch (activeTab) {
      case 'current':
        return currentOrders;
      case 'previous':
        return previousOrders;
      default:
        return currentOrders;
    }
  }, [activeTab, currentOrders, previousOrders]);

  const tabs: Array<{ id: TabType; label: string; count: number; icon: typeof ClockIcon }> = [
    {
      id: 'current',
      label: 'الطلبات الحالية',
      count: currentOrders.length,
      icon: ClockIcon,
    },
    {
      id: 'previous',
      label: 'الطلبات السابقة',
      count: previousOrders.length,
      icon: History,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Controls Bar: Search & Segmented Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الطلب..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-10 pl-4 text-xs font-semibold text-ink placeholder-slate-400 focus:border-[#234c2e] focus:bg-white focus:outline-none shadow-xs transition"
          />
        </div>

        {/* Unified Segmented Control Bar */}
        <div className="flex items-center rounded-2xl bg-slate-100/90 p-1.5 gap-1 border border-slate-200/70 shadow-xs flex-wrap sm:flex-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-black transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#234c2e] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-white/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-black shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/90 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="p-12 text-center text-sm font-bold text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-xs">
          جاري تحميل الطلبات...
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3 border border-slate-100">
            <PackageIcon className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-ink">
            {searchTerm
              ? 'لا توجد طلبات مطابقة للبحث'
              : activeTab === 'current'
              ? 'لا توجد طلبات جارية حالياً'
              : 'لا توجد طلبات سابقة'}
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'تأكد من كتابة رقم الطلب بشكل صحيح.'
              : activeTab === 'current'
              ? 'عند إرسال طلب جديد سيظهر هنا فوراً مع إمكانية متابعة خط سيره واعتماد الدفع.'
              : 'الطلبات المكتملة أو الملغاة ستظهر في هذا السجل.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedOrders.map((order) => (
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



