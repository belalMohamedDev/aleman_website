import { useState } from 'react';
import { UsersIcon, SearchIcon, ScaleIcon, CalendarIcon, PackageIcon } from 'lucide-react';
import type { CustomerSummary, OrderResponse } from '../../features/profile/types';
import { OrderDetailModal } from './OrderDetailModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface CustomersTabProps {
  customers: CustomerSummary[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalRevenue: number;
  totalTons: number;
  customersCount: number;
}

export function CustomersTab({
  customers,
  searchQuery,
  onSearchChange,
  totalRevenue,
  totalTons,
  customersCount,
}: CustomersTabProps) {
  const { t, isRtl } = useLanguage();
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<CustomerSummary | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Aggregated Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-1">
            <span>{t(ui.profile.totalCustomers)}</span>
          </div>
          <p className="text-xl font-black text-ink">{customersCount} {t(ui.profile.customerNameCol)}</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-center gap-2 text-blue-800 text-xs font-bold mb-1">
            <span>{t(ui.profile.totalVolume)}</span>
          </div>
          <p className="text-xl font-black text-ink">{totalTons.toFixed(2)} {t(ui.cart.tonUnit)}</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1">
            <span>{t(ui.profile.totalSalesValue)}</span>
          </div>
          <p className="text-xl font-black text-brand-700">{totalRevenue.toLocaleString()} {t(ui.common.currency)}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        <div className="relative max-w-md">
          <SearchIcon className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'} h-4 w-4 text-slate-400`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t(ui.profile.customersSearchPlaceholder)}
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-xs font-semibold text-ink placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition`}
          />
        </div>
      </div>

      {/* Customers Cards */}
      {customers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <UsersIcon className="h-8 w-8" />
          </div>
          <h3 className="text-base font-black text-ink">{t(ui.profile.noCustomersTitle)}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <div
              key={c.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-card hover:border-emerald-200"
            >
              <div>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm">
                    {c.name.slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-black text-ink text-sm truncate">{c.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {t(ui.profile.totalOrdersCol)}: {c.ordersCount}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <ScaleIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t(ui.profile.totalVolume)}:</span>
                    </span>
                    <span className="font-bold text-ink">{c.totalTons.toFixed(2)} {t(ui.cart.tonUnit)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>{t(ui.profile.totalSalesValue)}:</span>
                    <span className="font-black text-brand-700">{c.totalAmount.toLocaleString()} {t(ui.common.currency)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{t(ui.profile.lastOrderCol)}:</span>
                    </span>
                    <span>
                      {new Date(c.lastOrderDate).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCustomerOrders(c)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-2 text-xs font-bold transition cursor-pointer"
                >
                  <PackageIcon className="h-3.5 w-3.5" />
                  <span>{t(ui.profile.viewDetails)} ({c.ordersCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Orders History Modal */}
      {selectedCustomerOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black text-ink">
                  {t(ui.profile.tabOrders)}: {selectedCustomerOrders.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedCustomerOrders.totalAmount.toLocaleString()} {t(ui.common.currency)} ({selectedCustomerOrders.totalTons.toFixed(2)} {t(ui.cart.tonUnit)})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomerOrders(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                aria-label={t(ui.profile.closeModal)}
              >
                ✕
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {selectedCustomerOrders.orders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-ink">#{o.orderNumber}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')} • {o.totalWeightTons || 0} {t(ui.cart.tonUnit)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-brand-700">{o.totalAmount.toLocaleString()} {t(ui.common.currency)}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(o)}
                      className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 cursor-pointer"
                    >
                      {t(ui.profile.viewDetails)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Individual Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
