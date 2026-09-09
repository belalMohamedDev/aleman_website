import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Job } from '../../types/content';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Field, controlClass } from '../shared/Field';

type ApplicationModalProps = {
  job: Job | null;
  onClose: () => void;
};

type Errors = Partial<Record<'name' | 'phone' | 'email', string>>;

export function ApplicationModal({ job, onClose }: ApplicationModalProps) {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (job) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [job, onClose]);

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = t(ui.common.required);
    if (!/^[0-9+\s-]{8,}$/.test(phone.trim())) next.phone = t(ui.common.invalidPhone);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = t(ui.common.invalidEmail);
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast.success(t(ui.careers.submitted), { description: t(ui.careers.submittedBody) });
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setFileName('');
      setErrors({});
      onClose();
    }, 900);
  }

  return (
    <AnimatePresence>
      {job ?
      <motion.div
        className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-title"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-card bg-white p-6 shadow-lift sm:rounded-card md:p-8">
          
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gold-600">{t(ui.careers.apply)}</p>
                <h2 id="application-title" className="mt-1 text-xl font-extrabold text-ink">
                  {t(job.title)}
                </h2>
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label={t(ui.nav.close)}
              className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-ink">
              
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4" noValidate>
              <Field id="app-name" label={t(ui.careers.formName)} required error={errors.name}>
                <input id="app-name" value={name} onChange={(e) => setName(e.target.value)} className={controlClass} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="app-phone" label={t(ui.careers.formPhone)} required error={errors.phone}>
                  <input id="app-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={controlClass} />
                </Field>
                <Field id="app-email" label={t(ui.careers.formEmail)} required error={errors.email}>
                  <input id="app-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={controlClass} />
                </Field>
              </div>
              <Field id="app-role" label={t(ui.careers.formRole)}>
                <input id="app-role" value={t(job.title)} readOnly className={`${controlClass} bg-slate-50 text-ink-muted`} />
              </Field>

              <Field id="app-cv" label={t(ui.careers.formCv)} hint={t(ui.careers.formCvHint)}>
                <label className="focus-ring flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-brand-200 bg-brand-50/40 px-4 py-3 text-sm text-ink-muted transition hover:border-brand-400">
                  <span className="truncate">{fileName || t(ui.careers.formCv)}</span>
                  <UploadIcon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  <input
                  id="app-cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
                
                </label>
              </Field>

              <Field id="app-message" label={t(ui.careers.formMessage)} hint={t(ui.common.optional)}>
                <textarea
                id="app-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${controlClass} resize-none`} />
              
              </Field>

              <button
              type="submit"
              disabled={submitting}
              className="focus-ring mt-2 inline-flex items-center justify-center rounded-pill bg-brand-600 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-brand-700 disabled:opacity-60">
              
                {submitting ? t(ui.common.sending) : t(ui.careers.apply)}
              </button>
            </form>
          </motion.div>
        </motion.div> :
      null}
    </AnimatePresence>);

}