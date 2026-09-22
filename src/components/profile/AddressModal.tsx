import { useState } from 'react';
import { XIcon, MapPinIcon, HomeIcon, Building2Icon, FileTextIcon } from 'lucide-react';
import type { CreateAddressDto } from '../../features/profile/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressDto) => Promise<boolean>;
}

export function AddressModal({ isOpen, onClose, onSubmit }: AddressModalProps) {
  const { t, isRtl } = useLanguage();
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !street.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit({
      city: city.trim(),
      street: street.trim(),
      district: district.trim() || undefined,
      notes: notes.trim() || undefined,
      isDefault,
    });
    setIsSubmitting(false);

    if (success) {
      setCity('');
      setStreet('');
      setDistrict('');
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
            {t(ui.profile.addAddressModalTitle)}
          </h3>
          <div className="w-9" /> {/* Spacer to balance close button */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 1. المدينة / المحافظة */}
          <div className="relative">
            <input
              type="text"
              required
              dir={isRtl ? 'rtl' : 'ltr'}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t(ui.profile.governorateField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <MapPinIcon className="h-5 w-5" />
            </div>
          </div>

          {/* 2. المركز / الحي */}
          <div className="relative">
            <input
              type="text"
              dir={isRtl ? 'rtl' : 'ltr'}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder={t(ui.profile.districtOptionalField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <Building2Icon className="h-5 w-5" />
            </div>
          </div>

          {/* 3. الشارع أو العنوان بالتفصيل */}
          <div className="relative">
            <input
              type="text"
              required
              dir={isRtl ? 'rtl' : 'ltr'}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder={t(ui.profile.streetField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <HomeIcon className="h-5 w-5" />
            </div>
          </div>

          {/* 4. ملاحظات إضافية للتسليم */}
          <div className="relative">
            <input
              type="text"
              dir={isRtl ? 'rtl' : 'ltr'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(ui.profile.addressNotesField)}
              className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 ${isRtl ? 'pl-4 pr-11 text-right placeholder:text-right' : 'pr-4 pl-11 text-left placeholder:text-left'} text-xs sm:text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition`}
            />
            <div className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}>
              <FileTextIcon className="h-5 w-5" />
            </div>
          </div>

          {/* 5. تعيين كافتراضي */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 accent-brand-600"
            />
            <span className="text-xs sm:text-sm font-bold text-slate-600">
              {t(ui.profile.setDefaultAddress)}
            </span>
          </label>

          {/* 6. زر الحفظ */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 py-3.5 text-center text-sm font-black text-white shadow-md shadow-brand-600/20 transition hover:scale-[1.01] cursor-pointer"
            >
              {isSubmitting ? t(ui.profile.savingAddress) : t(ui.profile.saveAddressBtn)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

