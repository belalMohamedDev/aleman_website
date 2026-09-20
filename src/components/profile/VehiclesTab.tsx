import { useState } from 'react';
import { TruckIcon, PlusIcon, Trash2Icon, StarIcon, PhoneIcon, UserIcon, ShieldCheckIcon, CheckCircle2 } from 'lucide-react';
import type { UserVehicle, CreateVehicleDto } from '../../features/profile/types';
import { VehicleModal } from './VehicleModal';

interface VehiclesTabProps {
  vehicles: UserVehicle[];
  isLoading: boolean;
  onAddVehicle: (data: CreateVehicleDto) => Promise<boolean>;
  onRemoveVehicle: (id: string) => Promise<boolean>;
  onMakeDefault: (id: string) => Promise<boolean>;
  isModalOpen?: boolean;
  onOpenModal?: () => void;
  onCloseModal?: () => void;
}

export function VehiclesTab({
  vehicles,
  isLoading,
  onAddVehicle,
  onRemoveVehicle,
  onMakeDefault,
  isModalOpen,
  onOpenModal,
  onCloseModal,
}: VehiclesTabProps) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const showModal = isModalOpen !== undefined ? isModalOpen : internalModalOpen;
  const handleOpen = onOpenModal || (() => setInternalModalOpen(true));
  const handleClose = onCloseModal || (() => setInternalModalOpen(false));

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="p-12 text-center text-sm font-bold text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-xs">
          جاري تحميل بيانات الأسطول والسائقين...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-3">
            <TruckIcon className="h-8 w-8" />
          </div>
          <h3 className="text-base font-black text-ink">لا توجد سيارات أو سائقين مسجلين</h3>
          <p className="mt-1 text-xs text-slate-400">
            أضف بيانات سياراتك وسائقيك لتفادي إدخالها يدوياً عند كل طلب استلام ذاتي من المصنع.
          </p>
          <button
            type="button"
            onClick={handleOpen}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#234c2e] hover:bg-[#1b3b24] px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>إضافة أول سائق وسيارة</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`group relative rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                vehicle.isDefault
                  ? 'border-emerald-500/60 shadow-emerald-500/5'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header: Plate Number, Type & Default Status */}
                <div className="flex items-start justify-between gap-2 pb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#234c2e] border border-emerald-100/80">
                      <TruckIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-ink font-mono tracking-wide truncate">
                          {vehicle.vehiclePlateNumber}
                        </span>
                        {vehicle.vehicleType && (
                          <span className="inline-flex items-center rounded-lg bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-semibold">
                            {vehicle.vehicleType}
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        مركبة معتمدة للاستلام
                      </span>
                    </div>
                  </div>

                  {vehicle.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-bold shrink-0">
                      <StarIcon className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                      <span>الافتراضي</span>
                    </span>
                  )}
                </div>

                {/* Body: Driver & Vehicle Details (Clean Row-Based List) */}
                <div className="my-3 py-3 border-y border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>السائق:</span>
                    </span>
                    <span className="font-bold text-ink truncate">{vehicle.driverName}</span>
                  </div>

                  {vehicle.driverPhone && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <PhoneIcon className="h-3.5 w-3.5" />
                        <span>الهاتف:</span>
                      </span>
                      <span className="font-bold text-ink font-mono" dir="ltr">
                        {vehicle.driverPhone}
                      </span>
                    </div>
                  )}

                  {vehicle.driverLicenseNumber && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                        <span>رقم الرخصة:</span>
                      </span>
                      <span className="font-bold text-ink font-mono">
                        {vehicle.driverLicenseNumber}
                      </span>
                    </div>
                  )}

                  {vehicle.notes && (
                    <div className="pt-1.5 border-t border-slate-50 flex items-start gap-1 text-[11px] text-slate-500">
                      <span className="text-slate-400 shrink-0 font-medium">ملاحظات:</span>
                      <span className="line-clamp-2 leading-relaxed">{vehicle.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Make Default & Delete Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {vehicle.isDefault ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>معتمد كافتراضي للاستلام</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onMakeDefault(vehicle.id)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-semibold transition cursor-pointer"
                  >
                    <StarIcon className="h-3.5 w-3.5 text-slate-400" />
                    <span>تعيين كافتراضي</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل تريد بالتأكيد حذف هذه السيارة؟')) {
                      onRemoveVehicle(vehicle.id);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 font-semibold transition cursor-pointer"
                  title="حذف السيارة"
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <VehicleModal
        isOpen={showModal}
        onClose={handleClose}
        onSubmit={onAddVehicle}
      />
    </div>
  );
}
