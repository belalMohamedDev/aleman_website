import { useState } from 'react';
import { MapPinIcon, PlusIcon, Trash2Icon, StarIcon } from 'lucide-react';
import type { UserAddress, CreateAddressDto } from '../../features/profile/types';
import { AddressModal } from './AddressModal';

interface AddressesTabProps {
  addresses: UserAddress[];
  isLoading: boolean;
  onAddAddress: (data: CreateAddressDto) => Promise<boolean>;
  onRemoveAddress: (id: string) => Promise<boolean>;
  onMakeDefault: (id: string) => Promise<boolean>;
}

export function AddressesTab({
  addresses,
  isLoading,
  onAddAddress,
  onRemoveAddress,
  onMakeDefault,
}: AddressesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-sm font-black text-ink">دفتر العناوين المحفوظة ({addresses.length})</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            العناوين المسجلة التي يتم استخدامها لحساب تكلفة الشحن وتوصيل الطلبات
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#234c2e] hover:bg-[#1b3b24] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          <span>إضافة عنوان جديد</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm font-bold text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-xs">
          جاري تحميل العناوين...
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-3">
            <MapPinIcon className="h-8 w-8" />
          </div>
          <h3 className="text-base font-black text-ink">لا توجد عناوين مسجلة</h3>
          <p className="mt-1 text-xs text-slate-400">
            أضف عناوين مزارعك أو مخازنك لتسهيل وتوفير وقت حساب الشحن عند إنشاء الطلبات.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#234c2e] hover:bg-[#1b3b24] px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>إضافة أول عنوان</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 transition ${
                address.isDefault
                  ? 'border-emerald-500/80 bg-emerald-50/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-brand-200 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <MapPinIcon className="h-4 w-4 text-brand-600" />
                    </div>
                    <span className="text-sm font-black text-ink">
                      {address.city}
                      {address.district ? ` - ${address.district}` : ''}
                    </span>
                  </div>

                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-800">
                      <StarIcon className="h-3 w-3 fill-emerald-700 text-emerald-700" />
                      العنوان الافتراضي
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600 font-medium">
                  <p>
                    <span className="font-bold text-slate-700">العنوان:</span> {address.street}
                  </p>
                  {address.notes && (
                    <p className="text-slate-400 text-[11px]">
                      <span className="font-bold text-slate-500">ملاحظات:</span> {address.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() => onMakeDefault(address.id)}
                    className="text-xs font-bold text-brand-700 hover:text-brand-900 transition underline"
                  >
                    تعيين كافتراضي
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">مُعتمد للشحن</span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل تريد بالتأكيد حذف هذا العنوان؟')) {
                      onRemoveAddress(address.id);
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition"
                  title="حذف العنوان"
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddAddress}
      />
    </div>
  );
}
