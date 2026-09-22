import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadIcon, XIcon, CheckCircle2Icon, CopyIcon, CheckIcon, AlertCircleIcon, FileTextIcon, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { JobItem } from './JobCard';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Field, controlClass } from '../shared/Field';
import { useJobApplication, useRecruitmentLookups } from '../../features/recruitment/useRecruitment';
import type { JobApplicationPayload } from '../../features/recruitment/types';

type ApplicationModalProps = {
  job: JobItem | null;
  onClose: () => void;
};

type Errors = Partial<Record<keyof JobApplicationPayload | 'general', string>>;

export function ApplicationModal({ job, onClose }: ApplicationModalProps) {
  const { t, lang } = useLang();
  const { lookups } = useRecruitmentLookups();
  const { submitting, result, error: apiError, submit, reset } = useJobApplication();

  // Form state
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('الإسكندرية');
  const [address, setAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('أعزب');
  const [militaryStatus, setMilitaryStatus] = useState('أدى الخدمة العسكرية');
  const [qualification, setQualification] = useState('بكالوريوس');
  const [qualificationType, setQualificationType] = useState('');
  const [university, setUniversity] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [notes, setNotes] = useState('');

  // Files state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [copiedAppNo, setCopiedAppNo] = useState(false);

  // Derive job title and details
  const jobTitle = job
    ? typeof job.title === 'object' && job.title !== null
      ? lang === 'en' ? job.title.en : job.title.ar
      : (lang === 'en' && 'title_en' in job && job.title_en
          ? job.title_en
          : 'title_ar' in job && job.title_ar
          ? job.title_ar
          : String(job.title))
    : '';

  const jobId = job && 'id' in job ? job.id : undefined;
  const jobCode = job && 'job_code' in job ? job.job_code : undefined;

  // Keybindings and scroll locking
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (job) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [job]);

  function handleClose() {
    reset();
    setErrors({});
    onClose();
  }

  function validate(): boolean {
    const next: Errors = {};
    const trimmedName = name.trim();
    const words = trimmedName.split(/\s+/).filter(Boolean);
    if (!trimmedName) {
      next.applicant_name = t(ui.common.required);
    } else if (words.length < 3) {
      next.applicant_name = lang === 'ar' ? 'يرجى كتابة الاسم ثلاثياً أو رباعياً' : 'Please enter full name (3 or 4 parts)';
    }

    const trimmedNid = nationalId.trim();
    if (!trimmedNid) {
      next.national_id = t(ui.common.required);
    } else if (!/^\d{14}$/.test(trimmedNid)) {
      next.national_id = lang === 'ar' ? 'الرقم القومي يجب أن يتكون من 14 رقماً' : 'National ID must be exactly 14 digits';
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      next.phone = t(ui.common.required);
    } else if (!/^(01[0125]\d{8}|\+?[0-9\s-]{10,15})$/.test(trimmedPhone)) {
      next.phone = t(ui.common.invalidPhone);
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = t(ui.common.invalidEmail);
    }

    if (!address.trim()) {
      next.address = t(ui.common.required);
    }

    if (!cvFile) {
      next.cvFile = lang === 'ar' ? 'يرجى إرفاق ملف السيرة الذاتية (CV)' : 'Please attach your CV';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      toast.error(lang === 'ar' ? 'يرجى مراجعة الحقول المطلوبة' : 'Please check required fields');
      return;
    }

    try {
      const payload: JobApplicationPayload = {
        applicant_name: name,
        national_id: nationalId,
        phone,
        email: email || undefined,
        governorate,
        address,
        marital_status: maritalStatus,
        military_status: militaryStatus,
        qualification,
        qualification_type: qualificationType || undefined,
        university: university || undefined,
        years_experience: yearsExperience || undefined,
        notes: notes || undefined,
        job_id: jobId,
        job_code: jobCode,
        applied_position: jobTitle,
        cvFile,
        photoFile,
      };

      const res = await submit(payload);
      toast.success(t(ui.careers.submitted), {
        description: `${lang === 'ar' ? 'رقم طلبك هو: ' : 'Your application number is: '} ${res.application_number}`,
      });
    } catch (err: any) {
      const msg = err?.message || (lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'Submission failed');
      toast.error(msg);
    }
  }

  const copyApplicationNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedAppNo(true);
    toast.success(lang === 'ar' ? 'تم نسخ رقم الطلب' : 'Application number copied');
    setTimeout(() => setCopiedAppNo(false), 2500);
  };

  return (
    <AnimatePresence>
      {job ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-card bg-white p-6 shadow-lift sm:rounded-card md:p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                    {lang === 'ar' ? 'طلب توظيف' : 'Job Application'}
                  </span>
                  {jobCode && (
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {jobCode}
                    </span>
                  )}
                </div>
                <h2 id="application-title" className="mt-1 text-xl font-extrabold text-ink">
                  {jobTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t(ui.nav.close)}
                className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Success State */}
            {result ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2Icon className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-2xl font-black text-ink">
                  {t(ui.careers.submitted)}
                </h3>
                <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">
                  {t(ui.careers.submittedBody)}
                </p>

                <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {lang === 'ar' ? 'رقم طلب التوظيف الخاص بك' : 'Your Application Number'}
                  </span>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-2xl font-black font-mono tracking-wide text-brand-700">
                      {result.application_number}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyApplicationNumber(result.application_number)}
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-white px-2.5 py-1 text-xs font-bold text-brand-700 hover:bg-brand-50 transition shadow-xs"
                      title={lang === 'ar' ? 'نسخ رقم الطلب' : 'Copy'}
                    >
                      {copiedAppNo ? (
                        <>
                          <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-3.5 w-3.5" />
                          <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <span className="mt-2 text-[11px] text-slate-500">
                    {lang === 'ar'
                      ? 'احتفظ بهذا الرقم لتتمكن من متابعة وتتبع حالة طلبك لاحقاً'
                      : 'Save this number to track your application status anytime'}
                  </span>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="focus-ring rounded-pill bg-brand-600 px-8 py-3 text-sm font-extrabold text-white hover:bg-brand-700 transition"
                  >
                    {lang === 'ar' ? 'تم، إغلاق النافذة' : 'Done, Close'}
                  </button>
                </div>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={onSubmit} className="mt-6 space-y-6" noValidate>
                {apiError && (
                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircleIcon className="h-5 w-5 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* Section 1: Basic Information */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    {lang === 'ar' ? '1. البيانات الأساسية' : '1. Personal Information'}
                  </h4>
                  <div className="grid gap-4">
                    <Field id="app-name" label={t(ui.careers.formName)} required error={errors.applicant_name}>
                      <input
                        id="app-name"
                        value={name}
                        placeholder={lang === 'ar' ? 'مثال: أحمد محمد علي محمود' : 'Full Name'}
                        onChange={(e) => setName(e.target.value)}
                        className={controlClass}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id="app-nid"
                        label={lang === 'ar' ? 'الرقم القومي (14 رقم)' : 'National ID'}
                        required
                        error={errors.national_id}
                      >
                        <input
                          id="app-nid"
                          type="text"
                          maxLength={14}
                          value={nationalId}
                          placeholder="29801010101234"
                          onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                          className={controlClass}
                        />
                      </Field>
                      <Field id="app-phone" label={t(ui.careers.formPhone)} required error={errors.phone}>
                        <input
                          id="app-phone"
                          type="tel"
                          value={phone}
                          placeholder="01012345678"
                          onChange={(e) => setPhone(e.target.value)}
                          className={controlClass}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="app-email" label={t(ui.careers.formEmail)} hint={t(ui.common.optional)} error={errors.email}>
                        <input
                          id="app-email"
                          type="email"
                          value={email}
                          placeholder="example@mail.com"
                          onChange={(e) => setEmail(e.target.value)}
                          className={controlClass}
                        />
                      </Field>
                      <Field id="app-gov" label={lang === 'ar' ? 'المحافظة' : 'Governorate'} required>
                        <select
                          id="app-gov"
                          value={governorate}
                          onChange={(e) => setGovernorate(e.target.value)}
                          className={controlClass}
                        >
                          {lookups.governorates.map((gov) => (
                            <option key={gov} value={gov}>
                              {gov}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field id="app-address" label={lang === 'ar' ? 'العنوان بالتفصيل' : 'Address'} required error={errors.address}>
                      <input
                        id="app-address"
                        value={address}
                        placeholder={lang === 'ar' ? 'الشارع / المنطقة / المدينة' : 'Street / Area / City'}
                        onChange={(e) => setAddress(e.target.value)}
                        className={controlClass}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="app-marital" label={lang === 'ar' ? 'الحالة الاجتماعية' : 'Marital Status'} required>
                        <select
                          id="app-marital"
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          className={controlClass}
                        >
                          {lookups.marital_statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field id="app-military" label={lang === 'ar' ? 'الموقف التجنيدي' : 'Military Status'} required>
                        <select
                          id="app-military"
                          value={militaryStatus}
                          onChange={(e) => setMilitaryStatus(e.target.value)}
                          className={controlClass}
                        >
                          {lookups.military_statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section 2: Education & Experience */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    {lang === 'ar' ? '2. المؤهل الدراسي والخبرة' : '2. Qualifications & Experience'}
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="app-qual" label={lang === 'ar' ? 'المؤهل الدراسي' : 'Qualification'} required>
                        <select
                          id="app-qual"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className={controlClass}
                        >
                          {lookups.qualifications.map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field id="app-qual-type" label={lang === 'ar' ? 'التخصص' : 'Major / Specialization'} hint={t(ui.common.optional)}>
                        <input
                          id="app-qual-type"
                          value={qualificationType}
                          placeholder={lang === 'ar' ? 'مثال: هندسة زراعية، تجارة، إلخ' : 'e.g. Agriculture, Commerce'}
                          onChange={(e) => setQualificationType(e.target.value)}
                          className={controlClass}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="app-uni" label={lang === 'ar' ? 'الجامعة / المعهد' : 'University / Institute'} hint={t(ui.common.optional)}>
                        <input
                          id="app-uni"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          className={controlClass}
                        />
                      </Field>
                      <Field id="app-exp" label={lang === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'} hint={t(ui.common.optional)}>
                        <input
                          id="app-exp"
                          value={yearsExperience}
                          placeholder={lang === 'ar' ? 'مثال: 3 سنوات' : 'e.g. 3 years'}
                          onChange={(e) => setYearsExperience(e.target.value)}
                          className={controlClass}
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section 3: Attachments */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    {lang === 'ar' ? '3. المرفقات' : '3. Attachments'}
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* CV Upload */}
                    <Field id="app-cv" label={t(ui.careers.formCv)} hint={t(ui.careers.formCvHint)} required error={errors.cvFile}>
                      <label className="focus-ring flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4 text-sm text-ink-muted transition hover:border-brand-400 hover:bg-brand-50/70">
                        {cvFile ? (
                          <div className="flex items-center gap-2 text-brand-700 font-bold truncate max-w-full">
                            <FileTextIcon className="h-5 w-5 shrink-0 text-brand-600" />
                            <span className="truncate">{cvFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <UploadIcon className="h-5 w-5 text-brand-500" aria-hidden="true" />
                            <span className="font-semibold text-brand-700">
                              {lang === 'ar' ? 'اختر ملف السيرة الذاتية' : 'Upload CV Document'}
                            </span>
                            <span className="text-[11px] text-slate-400">PDF, DOC, DOCX (حتى 10MB)</span>
                          </>
                        )}
                        <input
                          id="app-cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="sr-only"
                          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </Field>

                    {/* Photo Upload */}
                    <Field id="app-photo" label={lang === 'ar' ? 'صورة شخصية (اختياري)' : 'Personal Photo'} hint="JPG, PNG (حتى 5MB)">
                      <label className="focus-ring flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-ink-muted transition hover:border-slate-300">
                        {photoFile ? (
                          <div className="flex items-center gap-2 text-slate-700 font-bold truncate max-w-full">
                            <ImageIcon className="h-5 w-5 shrink-0 text-emerald-600" />
                            <span className="truncate">{photoFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                            <span className="font-semibold text-slate-600">
                              {lang === 'ar' ? 'إرفاق صورة شخصية' : 'Upload Photo'}
                            </span>
                            <span className="text-[11px] text-slate-400">JPG, PNG</span>
                          </>
                        )}
                        <input
                          id="app-photo"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field id="app-message" label={t(ui.careers.formMessage)} hint={t(ui.common.optional)}>
                      <textarea
                        id="app-message"
                        rows={3}
                        value={notes}
                        placeholder={lang === 'ar' ? 'أي معلومات إضافية أو مهارات تفضل إضافتها...' : 'Additional notes...'}
                        onChange={(e) => setNotes(e.target.value)}
                        className={`${controlClass} resize-none`}
                      />
                    </Field>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="focus-ring rounded-pill border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="focus-ring inline-flex items-center justify-center rounded-pill bg-brand-600 px-8 py-3 text-sm font-extrabold text-white transition hover:bg-brand-700 disabled:opacity-60 shadow-sm hover:shadow"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>{t(ui.common.sending)}</span>
                      </span>
                    ) : (
                      t(ui.careers.apply)
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}