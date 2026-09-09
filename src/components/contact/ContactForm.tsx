import React, { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { governorates } from '../../data/distributors';
import { Field, controlClass } from '../shared/Field';

type Errors = Partial<Record<'name' | 'phone' | 'message' | 'type', string>>;

const REQUEST_TYPES = [
ui.requestTypes.products,
ui.requestTypes.inquiry,
ui.requestTypes.business,
ui.requestTypes.support,
ui.requestTypes.other];


export function ContactForm() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [requestType, setRequestType] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = t(ui.common.required);
    if (!/^[0-9+\s-]{8,}$/.test(phone.trim())) next.phone = t(ui.common.invalidPhone);
    if (!requestType) next.type = t(ui.common.required);
    if (message.trim().length < 10) next.message = t(ui.common.required);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast.success(t(ui.contact.sent), { description: t(ui.contact.sentBody) });
      setName('');
      setPhone('');
      setGovernorate('');
      setRequestType('');
      setMessage('');
    }, 900);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-slate-100 bg-white p-6 shadow-card md:p-8" noValidate>
      <div className="grid gap-4">
        <Field id="contact-name" label={t(ui.contact.name)} required error={errors.name}>
          <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} className={controlClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="contact-phone" label={t(ui.contact.phone)} required error={errors.phone}>
            <input id="contact-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={controlClass} />
          </Field>
          <Field id="contact-gov" label={t(ui.contact.governorate)}>
            <select
              id="contact-gov"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className={controlClass}>
              
              <option value="">{t(ui.contact.selectPlaceholder)}</option>
              {governorates.map((gov) =>
              <option key={gov.en} value={gov.en}>
                  {t(gov)}
                </option>
              )}
            </select>
          </Field>
        </div>

        <Field id="contact-type" label={t(ui.contact.requestType)} required error={errors.type}>
          <select
            id="contact-type"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className={controlClass}>
            
            <option value="">{t(ui.contact.selectPlaceholder)}</option>
            {REQUEST_TYPES.map((type) =>
            <option key={type.en} value={type.en}>
                {t(type)}
              </option>
            )}
          </select>
        </Field>

        <Field id="contact-message" label={t(ui.contact.message)} required error={errors.message}>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${controlClass} resize-none`} />
          
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-pill bg-gold-500 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-gold-600 disabled:opacity-60 sm:w-auto">
        
        <SendIcon className="h-4 w-4" aria-hidden="true" />
        {submitting ? t(ui.common.sending) : t(ui.contact.send)}
      </button>
    </form>);

}