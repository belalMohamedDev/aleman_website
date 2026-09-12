import { useState } from 'react';
import { TruckIcon, PlusIcon, Trash2Icon, StarIcon, PhoneIcon, UserIcon, ShieldCheckIcon } from 'lucide-react';
import type { UserVehicle, CreateVehicleDto } from '../../features/profile/types';
import { VehicleModal } from './VehicleModal';

interface VehiclesTabProps {
  vehicles: UserVehicle[];
  isLoading: boolean;
  onAddVehicle: (data: CreateVehicleDto) => Promise<boolean>;
  onRemoveVehicle: (id: string) => Promise<boolean>;
  onMakeDefault: (id: string) => Promise<boolean>;
}

export function VehiclesTab({
  vehicles,
  isLoading,
  onAddVehicle,
  onRemoveVehicle,
  onMakeDefault,
}: VehiclesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-sm font-black text-ink">أسطول السيارات والسائقين المعتمدين ({vehicles.length})</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            بيانات الشاحنات والسائقين المصرح لهم باستلام طلبيات الأعلاف من بوابات مصانع المؤسسة
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:scale-105 active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          <span>إضافة سيارة وسائق</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm font-bold text-slate-400 bg-white rounded-3xl border border-slate-100">
          جاري تحميل بيانات الأسطول والسائقين...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-3">
            <TruckIcon className="h-8 w-8" />
          </div>
          <h3 className="text-base font-black text-ink">لا توجد سيارات أو سائقين مسجلين</h3>
          <p className="mt-1 text-xs text-slate-400">
            أضف بيانات سياراتك وسائقيك لتفادي إدخالها يدوياً عند كل طلب استلام ذاتي من المصنع.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-bold text-white transition"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>إضافة أول سائق وسيارة</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 transition ${
                vehicle.isDefault
                  ? 'border-purple-500/80 bg-purple-50/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-brand-200 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <TruckIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-ink">{vehicle.vehiclePlateNumber}</span>
                      {vehicle.vehicleType && (
                        <span className="text-xs text-slate-400 mr-2">({vehicle.vehicleType})</span>
                      )}
                    </div>
                  </div>

                  {vehicle.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-black text-purple-800">
                      <StarIcon className="h-3 w-3 fill-purple-700 text-purple-700" />
                      الافتراضي للاستلام
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-700 font-medium">
                  <p className="flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold">السائق:</span>
                    <span>{vehicle.driverName}</span>
                  </p>

                  {vehicle.driverPhone && (
                    <p className="flex items-center gap-1.5">
                      <PhoneIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-bold">الهاتف:</span>
                      <span dir="ltr">{vehicle.driverPhone}</span>
                    </p>
                  )}

                  {vehicle.driverLicenseNumber && (
                    <p className="flex items-center gap-1.5">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-bold">الرخصة:</span>
                      <span>{vehicle.driverLicenseNumber}</span>
                    </p>
                  )}

                  {vehicle.notes && (
                    <p className="text-slate-400 text-[11px] pt-1">
                      <span className="font-bold text-slate-500">ملاحظات:</span> {vehicle.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
                {!vehicle.isDefault ? (
                  <button
                    type="button"
                    onClick={() => onMakeDefault(vehicle.id)}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 transition underline"
                  >
                    تعيين كافتراضي للاستلام
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">معتمد للاستلام</span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل تريد بالتأكيد حذف هذه السيارة؟')) {
                      onRemoveVehicle(vehicle.id);
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition"
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddVehicle}
      />
    </div>
  );
}
