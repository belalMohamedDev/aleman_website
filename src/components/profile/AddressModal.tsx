import { useState } from 'react';
import { XIcon, MapPinIcon } from 'lucide-react';
import type { CreateAddressDto } from '../../features/profile/types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressDto) => Promise<boolean>;
}

export function AddressModal({ isOpen, onClose, onSubmit }: AddressModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <MapPinIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-ink">إضافة عنوان جديد</h3>
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
              المدينة / المحافظة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="مثال: الشرقية، الدقهلية، القليوبية..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">
              الشارع / العنوان بالتفصيل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="مثال: شارع المحطة، بجوار الموقف الرئيسي..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">المركز / الحي (اختياري)</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="مثال: مركز الزقازيق، المنصورة..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">ملاحظات إضافية للتسليم (اختياري)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="علامة مميزة، وقت التسليم المفضل..."
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
            <span className="text-slate-700">تعيين كعنوان افتراضي للشحن</span>
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
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ العنوان'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
