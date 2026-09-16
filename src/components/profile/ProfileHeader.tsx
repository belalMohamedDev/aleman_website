import { PhoneIcon, PackageIcon, StoreIcon, UsersIcon, MapPinIcon, TruckIcon } from 'lucide-react';
import type { User } from '../../features/auth/types';
import { getUserTypeInfo } from '../../features/auth/userUtils';

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
  const userType = getUserTypeInfo(user);

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs mb-8">
      {/* Top Section: User Avatar & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-4">
          {/* Avatar with Gradient */}
          {/* <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-gradient-to-br from-brand-600 via-emerald-700 to-teal-800 text-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-md shrink-0">
            {initial}
          </div> */}

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-ink">
                {user?.name || 'مستخدم مؤسسة الإيمان'}
              </h1>



              {/* Additional Merchant / SAP badges */}
              {user?.sapCustomerId && (
                <span className="rounded-full bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 text-[11px] font-bold font-mono">
                  كود SAP: {user.sapCustomerId}
                </span>
              )}

              {userType.isSub && userType.parentMerchantName && (
                <span className="rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 px-2.5 py-0.5 text-[11px] font-black">
                  تابع للتاجر: {userType.parentMerchantName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
              {user?.phoneNumber && (
                <span className="flex items-center gap-1">
                  <PhoneIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span dir="ltr">{user.phoneNumber}</span>
                </span>
              )}

              {user?.email && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{user.email}</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-400 font-medium">
              {userType.isSub
                ? 'لوحة تحكم العميل الفرعي لمتابعة طلبات الشحن والتحميل المسجلة'
                : 'مرحباً بك في لوحة تحكم حسابك ومتابعة الطلبات المباشرة وطلبات العملاء التابعين'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid — Dynamically Adapted for Main vs Sub Customer */}
      {userType.isSub ? (
        /* Sub-Customer View: 3 clean cards focused on their own operations */
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500">إجمالي طلباتي</span>
              <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <PackageIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-ink">{stats.ordersCount}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">طلب مسجل بحسابك</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500">عناوين التوصيل</span>
              <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <MapPinIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-ink">{stats.addressesCount}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">عنوان مزرعة أو مستودع</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500">السيارات والسائقين</span>
              <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <TruckIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-ink">{stats.vehiclesCount}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">شاحنة وسائق للاستلام</span>
          </div>
        </div>
      ) : (
        /* Main Merchant View: All 5 business dimensions */
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">طلباتي</span>
              <PackageIcon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xl font-black text-ink">{stats.ordersCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">مباشرة من المصنع</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">طلبات عملائي</span>
              <StoreIcon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xl font-black text-ink">{stats.merchantOrdersCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">صغار التجار</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">قاعدة عملائي</span>
              <UsersIcon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xl font-black text-ink">{stats.customersCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">عميل مسجل</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">العناوين</span>
              <MapPinIcon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xl font-black text-ink">{stats.addressesCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">موقع توصيل</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">أسطول السيارات</span>
              <TruckIcon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xl font-black text-ink">{stats.vehiclesCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">شاحنة وسائق</span>
          </div>
        </div>
      )}
    </div>
  );
}

