import { PackageIcon, StoreIcon, UsersIcon, MapPinIcon, TruckIcon } from 'lucide-react';
import type { ProfileTabType } from '../../features/profile/types';

interface ProfileTabsProps {
  activeTab: ProfileTabType;
  onChangeTab: (tab: ProfileTabType) => void;
  counts: {
    orders: number;
    merchantOrders: number;
    customers: number;
    addresses: number;
    vehicles: number;
  };
  isSubCustomer?: boolean;
}

export function ProfileTabs({ activeTab, onChangeTab, counts, isSubCustomer }: ProfileTabsProps) {
  const allTabs: Array<{ id: ProfileTabType; label: string; icon: any; count: number; forMerchantOnly?: boolean }> = [
    { id: 'orders', label: 'طلباتي', icon: PackageIcon, count: counts.orders },
    { id: 'merchant-orders', label: 'طلبات عملائى', icon: StoreIcon, count: counts.merchantOrders, forMerchantOnly: true },
    { id: 'customers', label: 'عملائي', icon: UsersIcon, count: counts.customers, forMerchantOnly: true },
    { id: 'addresses', label: 'العناوين المحفوظة', icon: MapPinIcon, count: counts.addresses },
    { id: 'vehicles', label: 'أسطول السيارات والسائقين', icon: TruckIcon, count: counts.vehicles },
  ];

  const tabs = isSubCustomer ? allTabs.filter((t) => !t.forMerchantOnly) : allTabs;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-extrabold transition-all ${isActive
              ? 'bg-brand-600 text-white shadow-lift'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-ink border border-slate-200/80'
              }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
