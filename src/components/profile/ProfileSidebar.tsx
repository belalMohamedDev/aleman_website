import { PackageIcon, StoreIcon, UsersIcon, MapPinIcon, TruckIcon, ShieldCheckIcon, UserCheckIcon } from 'lucide-react';
import type { User } from '../../features/auth/types';
import type { ProfileTabType } from '../../features/profile/types';
import { getUserTypeInfo } from '../../features/auth/userUtils';
import { useLanguage } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface ProfileSidebarProps {
  user: User | null;
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

export function ProfileSidebar({
  user,
  activeTab,
  onChangeTab,
  counts,
  isSubCustomer,
}: ProfileSidebarProps) {
  const { t, isRtl } = useLanguage();
  const userType = getUserTypeInfo(user);

  // Generate 2 initials or 1 initial
  const getInitials = (name?: string | null) => {
    if (!name) return 'م';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);
  const displayName = user?.name ? user.name.split(' ')[0] : t(ui.profile.dearCustomer);

  const orderTabs: Array<{ id: ProfileTabType; label: string; icon: any; count: number; forMerchantOnly?: boolean }> = [
    { id: 'orders', label: t(ui.profile.tabOrders), icon: PackageIcon, count: counts.orders },
    { id: 'merchant-orders', label: t(ui.profile.tabMerchantOrders), icon: StoreIcon, count: counts.merchantOrders, forMerchantOnly: true },
    { id: 'customers', label: t(ui.profile.tabCustomers), icon: UsersIcon, count: counts.customers, forMerchantOnly: true },
  ];

  const accountTabs: Array<{ id: ProfileTabType; label: string; icon: any; count: number }> = [
    { id: 'addresses', label: t(ui.profile.tabAddresses), icon: MapPinIcon, count: counts.addresses },
    { id: 'vehicles', label: t(ui.profile.tabVehicles), icon: TruckIcon, count: counts.vehicles },
  ];

  const visibleOrderTabs = isSubCustomer
    ? orderTabs.filter((t) => !t.forMerchantOnly)
    : orderTabs;

  return (
    <div className="space-y-4">
      {/* 1. Noon-Style User Identity Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          {/* Avatar circle */}
          <div className="h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm sm:text-base font-black shadow-xs shrink-0 tracking-wider">
            {initials}
          </div>

          <div className={`min-w-0 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h2 className="text-base sm:text-lg font-black text-ink truncate">
              {t(ui.profile.welcome)} {displayName}
            </h2>
            {user?.email && (
              <p className={`text-xs text-slate-500 font-medium truncate mt-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                <span dir="ltr">{user.email}</span>
              </p>
            )}
            {user?.phoneNumber && (
              <p className={`text-[11px] text-slate-400 font-medium truncate mt-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                <span dir="ltr">{user.phoneNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* User Role Tag */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold text-xs">{t(ui.profile.accountType)}</span>
          {userType.isSub ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50/90 border border-blue-200/60 px-2.5 py-1 rounded-lg text-xs">
              <UserCheckIcon className="h-3.5 w-3.5 text-blue-600" />
              <span>{t(ui.profile.subCustomerTitle)}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/60 px-2.5 py-1 rounded-lg text-xs">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t(ui.profile.mainMerchantTitle)}</span>
            </span>
          )}
        </div>

        {/* SAP Customer ID if present */}
        {user?.sapCustomerId && (
          <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium text-[11px]">{t(ui.profile.sapClientCode)}</span>
            <span className="font-mono font-bold text-slate-700 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {user.sapCustomerId}
            </span>
          </div>
        )}
      </div>

      {/* 2. Noon-Style Sidebar Navigation Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xs">
        {/* Section 1: Orders & Commerce */}
        <div className="space-y-1">
          {visibleOrderTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${isRtl ? 'text-right' : 'text-left'} cursor-pointer ${
                  isActive
                    ? 'bg-[#eef5ee] text-[#234c2e] font-black'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#234c2e]' : 'text-slate-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-black shrink-0 ${
                    isActive
                      ? 'bg-[#234c2e] text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-slate-100" />

        {/* Section 2: Account & Logistics */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 mb-1.5">{t(ui.profile.accountManagement)}</p>
          {accountTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${isRtl ? 'text-right' : 'text-left'} cursor-pointer ${
                  isActive
                    ? 'bg-[#eef5ee] text-[#234c2e] font-black'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#234c2e]' : 'text-slate-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-black shrink-0 ${
                    isActive
                      ? 'bg-[#234c2e] text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

