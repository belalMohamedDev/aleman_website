import { ShieldCheckIcon, PhoneIcon, PackageIcon, StoreIcon, UsersIcon, MapPinIcon, TruckIcon } from 'lucide-react';
import type { User } from '../../features/auth/types';

interface ProfileHeaderProps {
  user: User | null;
  stats: {
    ordersCount: number;
    merchantOrdersCount: number;
    customersCount: number;
    addressesCount: number;
    vehiclesCount: number;
  };
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  return (
    <div className="rounded-3xl border border-brand-100/80 bg-white p-6 md:p-8 shadow-card mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-ink">
              {user?.name || 'مستخدم الإيمان'}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              حساب معتمد
            </span>
          </div>
          {user?.phoneNumber && (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink-muted">
              <PhoneIcon className="h-3.5 w-3.5 text-slate-400" />
              <span dir="ltr">{user.phoneNumber}</span>
            </p>
          )}
          <p className="text-xs font-medium text-slate-400 mt-1">
            مرحباً بك في لوحة تحكم حسابك ومتابعة الطلبات والعمليات
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-brand-200 hover:bg-white">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <PackageIcon className="h-4 w-4 text-brand-600" />
            <span className="text-xs font-bold">طلباتي</span>
          </div>
          <p className="text-lg font-black text-ink">{stats.ordersCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-brand-200 hover:bg-white">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <StoreIcon className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold">طلبات العملاء</span>
          </div>
          <p className="text-lg font-black text-ink">{stats.merchantOrdersCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-brand-200 hover:bg-white">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <UsersIcon className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold">العملاء</span>
          </div>
          <p className="text-lg font-black text-ink">{stats.customersCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-brand-200 hover:bg-white">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <MapPinIcon className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold">العناوين</span>
          </div>
          <p className="text-lg font-black text-ink">{stats.addressesCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-brand-200 hover:bg-white col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <TruckIcon className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-bold">السيارات والسائقين</span>
          </div>
          <p className="text-lg font-black text-ink">{stats.vehiclesCount}</p>
        </div>
      </div>
    </div>
  );
}
