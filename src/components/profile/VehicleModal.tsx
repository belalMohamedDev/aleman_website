import { useState } from 'react';
import { XIcon, TruckIcon, UserIcon, PhoneIcon, CreditCardIcon } from 'lucide-react';
import type { CreateVehicleDto } from '../../features/profile/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehicleDto) => Promise<boolean>;
}

const VEHICLE_TYPE_CHIPS = [
  'دبابة',
  'جامبو',
  'تريلا',
  'نص نقل',
  'أخرى',
];

export function VehicleModal({ isOpen, onClose, onSubmit }: VehicleModalProps) {
  const { t, isRtl } = useLanguage();
  const [driverName, setDriverName] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('دبابة');
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
      setVehicleType('دبابة');
      setNotes('');
      setIsDefault(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center sm:items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={`relative w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isRtl ? 'text-right' : 'text-left'}`}>
        {/* Top Drag Indicator */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            aria-label={t(ui.profile.closeModal)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <h3 className="text-base sm:text-lg font-black text-ink">
            {t(ui.profile.addVehicleModalTitle)}
          </h3>
          <div className="w-9" /> {/* Spacer to balance close button */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <input
              type="text"
              required
              dir={isRtl ? 'rtl' : 'ltr'}
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder={t(ui.profile.driverNameField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <UserIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              required
              dir={isRtl ? 'rtl' : 'ltr'}
              value={vehiclePlateNumber}
              onChange={(e) => setVehiclePlateNumber(e.target.value)}
              placeholder={t(ui.profile.plateNumberField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <TruckIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              dir={isRtl ? 'rtl' : 'ltr'}
              value={driverLicenseNumber}
              onChange={(e) => setDriverLicenseNumber(e.target.value)}
              placeholder={t(ui.profile.licenseNumberField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <CreditCardIcon className="h-5 w-5" />
            </div>
          </div>

          {/* 4. رقم هاتف السائق */}
          <div className="relative">
            <input
              type="tel"
              dir="ltr"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              placeholder={t(ui.profile.driverPhoneField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <PhoneIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="pt-1">
            <label className={`block text-xs sm:text-sm font-bold text-slate-700 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t(ui.profile.vehicleTypeField)}
            </label>
            <div className="flex flex-wrap gap-2 justify-start">
              {VEHICLE_TYPE_CHIPS.map((type) => {
                const isSelected = vehicleType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVehicleType(type)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${isSelected
                        ? 'border-2 border-brand-600 bg-brand-50 text-brand-700 shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. ملاحظات إضافية */}
          <div>
            <input
              type="text"
              dir={isRtl ? 'rtl' : 'ltr'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(ui.checkout.orderNotes)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 ${isRtl ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
          </div>

          {/* 7. تعيين كافتراضي */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 accent-brand-600"
            />
            <span className="text-xs sm:text-sm font-bold text-slate-600">
              {t(ui.profile.setDefaultVehicle)}
            </span>
          </label>

          {/* 8. زر الإضافة */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 py-3.5 text-center text-sm font-black text-white shadow-md shadow-brand-600/20 transition hover:scale-[1.01] cursor-pointer"
            >
              {isSubmitting ? t(ui.profile.savingVehicle) : t(ui.profile.saveVehicleBtn)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

