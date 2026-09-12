import { useState } from 'react';
import { XIcon, TruckIcon } from 'lucide-react';
import type { CreateVehicleDto } from '../../features/profile/types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehicleDto) => Promise<boolean>;
}

export function VehicleModal({ isOpen, onClose, onSubmit }: VehicleModalProps) {
  const [driverName, setDriverName] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !vehiclePlateNumber.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit({
      driverName: driverName.trim(),
      vehiclePlateNumber: vehiclePlateNumber.trim(),
      driverLicenseNumber: driverLicenseNumber.trim() || undefined,
      driverPhone: driverPhone.trim() || undefined,
      vehicleType: vehicleType.trim() || undefined,
      notes: notes.trim() || undefined,
      isDefault,
    });
    setIsSubmitting(false);

    if (success) {
      setDriverName('');
      setVehiclePlateNumber('');
      setDriverLicenseNumber('');
      setDriverPhone('');
      setVehicleType('');
      setNotes('');
      setIsDefault(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <TruckIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-ink">إضافة سيارة وسائق</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs font-bold">
          <div>
            <label className="block text-slate-700 mb-1">
              اسم السائق بالكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="مثال: محمود أحمد حسن..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">
                رقم لوحة السيارة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={vehiclePlateNumber}
                onChange={(e) => setVehiclePlateNumber(e.target.value)}
                placeholder="مثال: أ ب ج 1234"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">نوع السيارة</label>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                placeholder="جامبو، تريلا، دبابة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">رقم هاتف السائق</label>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                dir="ltr"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink text-right focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">رقم رخصة القيادة</label>
              <input
                type="text"
                value={driverLicenseNumber}
                onChange={(e) => setDriverLicenseNumber(e.target.value)}
                placeholder="رقم الرخصة أو القومي"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">ملاحظات (اختياري)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="حمولة السيارة، إمكانيات خاصة..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
            />
            <span className="text-slate-700">تعيين كسيارة وسائق افتراضي للاستلام من المصنع</span>
          </label>

          <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-slate-600 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 px-5 py-2.5 text-white shadow-sm transition"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ البيانات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
