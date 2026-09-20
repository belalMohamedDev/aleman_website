import { useState } from 'react';
import { MapPinIcon, PlusIcon, Trash2Icon, StarIcon, CheckCircle2 } from 'lucide-react';
import type { UserAddress, CreateAddressDto } from '../../features/profile/types';
import { AddressModal } from './AddressModal';

interface AddressesTabProps {
  addresses: UserAddress[];
  isLoading: boolean;
  onAddAddress: (data: CreateAddressDto) => Promise<boolean>;
  onRemoveAddress: (id: string) => Promise<boolean>;
  onMakeDefault: (id: string) => Promise<boolean>;
  isModalOpen?: boolean;
  onOpenModal?: () => void;
  onCloseModal?: () => void;
}

export function AddressesTab({
  addresses,
  isLoading,
  onAddAddress,
  onRemoveAddress,
  onMakeDefault,
  isModalOpen,
  onOpenModal,
  onCloseModal,
}: AddressesTabProps) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const showModal = isModalOpen !== undefined ? isModalOpen : internalModalOpen;
  const handleOpen = onOpenModal || (() => setInternalModalOpen(true));
  const handleClose = onCloseModal || (() => setInternalModalOpen(false));

  return (
    <div className="space-y-6">
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
            onClick={handleOpen}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#234c2e] hover:bg-[#1b3b24] px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>إضافة أول عنوان</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`group relative rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                address.isDefault
                  ? 'border-emerald-500/60 shadow-emerald-500/5'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header: City, District & Default Badge */}
                <div className="flex items-start justify-between gap-2 pb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#234c2e] border border-emerald-100/80">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-ink truncate">
                          {address.city}
                        </span>
                        {address.district && (
                          <span className="inline-flex items-center rounded-lg bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-semibold">
                            {address.district}
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        عنوان شحن وتوصيل
                      </span>
                    </div>
                  </div>

                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-bold shrink-0">
                      <StarIcon className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                      <span>الافتراضي</span>
                    </span>
                  )}
                </div>

                {/* Body: Street Address & Notes (Clean List) */}
                <div className="my-3 py-3 border-y border-slate-100 space-y-2 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <span className="text-slate-400 shrink-0 font-medium">العنوان:</span>
                    <span className="font-bold text-ink leading-relaxed">{address.street}</span>
                  </div>

                  {address.notes && (
                    <div className="pt-1.5 border-t border-slate-50 flex items-start gap-1 text-[11px] text-slate-500">
                      <span className="text-slate-400 shrink-0 font-medium">ملاحظات:</span>
                      <span className="line-clamp-2 leading-relaxed">{address.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Make Default & Delete Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {address.isDefault ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>معتمد كافتراضي للشحن</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onMakeDefault(address.id)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-semibold transition cursor-pointer"
                  >
                    <StarIcon className="h-3.5 w-3.5 text-slate-400" />
                    <span>تعيين كافتراضي</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل تريد بالتأكيد حذف هذا العنوان؟')) {
                      onRemoveAddress(address.id);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 font-semibold transition cursor-pointer"
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
        isOpen={showModal}
        onClose={handleClose}
        onSubmit={onAddAddress}
      />
    </div>
  );
}
