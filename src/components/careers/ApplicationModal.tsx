import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UploadIcon,
  XIcon,
  CheckCircle2Icon,
  CopyIcon,
  CheckIcon,
  AlertCircleIcon,
  FileTextIcon,
  ImageIcon,
  SendIcon,
} from 'lucide-react';
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
  const { t, lang, isRtl } = useLang();
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

  const cvInputRef = React.useRef<HTMLInputElement>(null);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  // Derive job title and details
  const jobTitle = job
    ? typeof job.title === 'object' && job.title !== null
      ? lang === 'en' ? (job.title as any).en : (job.title as any).ar
      : (lang === 'en' && job.title_en
          ? job.title_en
          : job.title_ar || job.title || '')
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
    if (cvInputRef.current) cvInputRef.current.value = '';
    if (photoInputRef.current) photoInputRef.current.value = '';
    onClose();
  }

  function validate(): boolean {
    const next: Errors = {};
    const trimmedName = name.trim();
    const words = trimmedName.split(/\s+/).filter(Boolean);
    if (!trimmedName) {
      next.applicant_name = t(ui.common.required);
    } else if (words.length < 3) {
      next.applicant_name = t(ui.recruitment.errNameParts);
    }

    const trimmedNid = nationalId.trim();
    if (!trimmedNid) {
      next.national_id = t(ui.common.required);
    } else if (!/^\d{14}$/.test(trimmedNid)) {
      next.national_id = t(ui.recruitment.errNationalId14);
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      next.phone = t(ui.common.required);
    } else if (!/^(01[0125]\d{8}|\+?[0-9\s-]{10,15})$/.test(trimmedPhone)) {
      next.phone = t(ui.recruitment.errValidPhone);
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = t(ui.recruitment.errValidEmail);
    }

    if (!address.trim()) {
      next.address = t(ui.common.required);
    }

    if (!cvFile) {
      next.cvFile = t(ui.recruitment.errCvRequired);
    } else {
      const allowedExts = ['pdf', 'doc', 'docx'];
      const ext = cvFile.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedExts.includes(ext)) {
        next.cvFile = t(ui.recruitment.errCvFormat);
      } else if (cvFile.size > 10 * 1024 * 1024) {
        next.cvFile = t(ui.recruitment.errCvSize);
      }
    }

    if (photoFile) {
      const allowedImgExts = ['jpg', 'jpeg', 'png', 'webp'];
      const ext = photoFile.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedImgExts.includes(ext)) {
        next.general = t(ui.recruitment.errPhotoFormat);
      } else if (photoFile.size > 5 * 1024 * 1024) {
        next.general = t(ui.recruitment.errPhotoSize);
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      const firstError = Object.values(errors)[0];
      if (firstError) toast.error(firstError);
      return;
    }

    try {
      const payload: JobApplicationPayload = {
        applicant_name: name.trim(),
        national_id: nationalId.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        governorate: governorate.trim(),
        address: address.trim(),
        marital_status: maritalStatus.trim(),
        military_status: militaryStatus.trim(),
        qualification: qualification.trim(),
        qualification_type: qualificationType.trim() || undefined,
        university: university.trim() || undefined,
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
        description: `${t(ui.recruitment.appNumberLabel)} ${res.application_number}`,
      });
    } catch (err: any) {
      const msg = err?.message || (lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'Submission failed');
      toast.error(msg);
    }
  }

  const copyApplicationNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedAppNo(true);
    toast.success(t(ui.recruitment.copiedShort));
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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/65 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal Card / Bottom Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-title"
            dir={isRtl ? 'rtl' : 'ltr'}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onScroll={(e) => {
              e.currentTarget.scrollTop = 0;
            }}
            className="relative flex h-[90vh] sm:h-auto sm:max-h-[88vh] w-full max-w-2xl flex-col rounded-t-[28px] sm:rounded-[28px] bg-white shadow-2xl overflow-hidden"
          >
            {/* Mobile Drag Indicator */}
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" />

            {/* Sticky Fixed Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 bg-white z-10 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-brand-50 border border-brand-100 px-2 py-0.5 text-[11px] font-black text-brand-700">
                    {t(ui.recruitment.officialApplicationBadge)}
                  </span>
                  {jobCode && (
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {jobCode}
                    </span>
                  )}
                </div>
                <h2 id="application-title" className="mt-1 text-lg sm:text-xl font-black text-ink">
                  {jobTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t(ui.nav.close)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body - Scrollable with NO ugly scrollbar */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 sm:px-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {result ? (
                /* Success State Screen */
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2Icon className="h-9 w-9" />
                  </div>
                  <h3 className="mt-4 text-2xl font-black text-ink">
                    {t(ui.careers.submitted)}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                    {t(ui.careers.submittedBody)}
                  </p>

                  <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {t(ui.recruitment.yourAppNoTitle)}
                    </span>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-2xl font-black font-mono tracking-wide text-brand-700">
                        {result.application_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyApplicationNumber(result.application_number)}
                        className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50 transition shadow-xs"
                      >
                        {copiedAppNo ? (
                          <>
                            <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{t(ui.recruitment.copiedShort)}</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon className="h-3.5 w-3.5" />
                            <span>{t(ui.recruitment.copyShort)}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="mt-2 text-[11px] text-slate-500 font-medium">
                      {t(ui.recruitment.saveAppNoHint)}
                    </span>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-full bg-brand-600 px-8 py-3 text-sm font-black text-white hover:bg-brand-700 transition shadow-sm"
                    >
                      {t(ui.recruitment.closeModal)}
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Fields */
                <form id="application-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {apiError && (
                    <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800">
                      <AlertCircleIcon className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Section 1: Basic Information */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-black text-white">
                        1
                      </span>
                      <h4 className="text-xs font-black text-ink">
                        {t(ui.recruitment.personalAndContactInfo)}
                      </h4>
                    </div>

                    <div className="grid gap-3">
                      <Field id="app-name" label={t(ui.careers.formName)} required error={errors.applicant_name}>
                        <input
                          id="app-name"
                          value={name}
                          placeholder={t(ui.recruitment.namePlaceholder)}
                          onChange={(e) => setName(e.target.value)}
                          className={`${controlClass} bg-white shadow-xs`}
                        />
                      </Field>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field
                          id="app-nid"
                          label={t(ui.recruitment.nationalIdLabel)}
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
                            className={`${controlClass} bg-white font-mono shadow-xs`}
                          />
                        </Field>

                        <Field id="app-phone" label={t(ui.careers.formPhone)} required error={errors.phone}>
                          <input
                            id="app-phone"
                            type="tel"
                            value={phone}
                            placeholder="01012345678"
                            onChange={(e) => setPhone(e.target.value)}
                            className={`${controlClass} bg-white font-mono shadow-xs`}
                          />
                        </Field>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field id="app-email" label={t(ui.careers.formEmail)} hint={t(ui.common.optional)} error={errors.email}>
                          <input
                            id="app-email"
                            type="email"
                            value={email}
                            placeholder="example@mail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
                          />
                        </Field>

                        <Field id="app-gov" label={t(ui.recruitment.governorateLabel)} required>
                          <select
                            id="app-gov"
                            value={governorate}
                            onChange={(e) => setGovernorate(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
                          >
                            {lookups.governorates.map((gov) => (
                              <option key={gov} value={gov}>
                                {gov}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <Field id="app-address" label={t(ui.recruitment.detailedAddress)} required error={errors.address}>
                        <input
                          id="app-address"
                          value={address}
                          placeholder={t(ui.recruitment.addressPlaceholder)}
                          onChange={(e) => setAddress(e.target.value)}
                          className={`${controlClass} bg-white shadow-xs`}
                        />
                      </Field>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field id="app-marital" label={t(ui.recruitment.maritalStatusLabel)} required>
                          <select
                            id="app-marital"
                            value={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
                          >
                            {lookups.marital_statuses.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field id="app-military" label={t(ui.recruitment.militaryStatusLabel)} required>
                          <select
                            id="app-military"
                            value={militaryStatus}
                            onChange={(e) => setMilitaryStatus(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
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

                  {/* Section 2: Qualifications & Experience */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-black text-white">
                        2
                      </span>
                      <h4 className="text-xs font-black text-ink">
                        {t(ui.recruitment.educationAndExperience)}
                      </h4>
                    </div>

                    <div className="grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field id="app-qual" label={t(ui.recruitment.qualificationLabel)} required>
                          <select
                            id="app-qual"
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
                          >
                            {lookups.qualifications.map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field id="app-qual-type" label={t(ui.recruitment.qualificationTypeLabel)} hint={t(ui.common.optional)}>
                          <input
                            id="app-qual-type"
                            value={qualificationType}
                            placeholder={t(ui.recruitment.specializationPlaceholder)}
                            onChange={(e) => setQualificationType(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
                          />
                        </Field>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field id="app-uni" label={t(ui.recruitment.universityLabel)} hint={t(ui.common.optional)}>
                          <input
                            id="app-uni"
                            value={university}
                            placeholder={t(ui.recruitment.universityPlaceholder)}
                            onChange={(e) => setUniversity(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
                          />
                        </Field>

                        <Field id="app-exp" label={t(ui.recruitment.yearsExperienceLabel)} hint={t(ui.common.optional)}>
                          <input
                            id="app-exp"
                            value={yearsExperience}
                            placeholder={t(ui.recruitment.yearsExpPlaceholder)}
                            onChange={(e) => setYearsExperience(e.target.value)}
                            className={`${controlClass} bg-white shadow-xs`}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Attachments & Notes */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-black text-white">
                        3
                      </span>
                      <h4 className="text-xs font-black text-ink">
                        {t(ui.recruitment.attachmentsAndResume)}
                      </h4>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* CV Upload */}
                      <Field id="app-cv" label={t(ui.careers.formCv)} hint={t(ui.careers.formCvHint)} required error={errors.cvFile}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => cvInputRef.current?.click()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              cvInputRef.current?.click();
                            }
                          }}
                          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center text-sm transition shadow-xs outline-none ${
                            cvFile
                              ? 'border-brand-300 bg-brand-50/50'
                              : 'border-brand-200 bg-white hover:border-brand-400 hover:bg-brand-50/40'
                          }`}
                        >
                          {cvFile ? (
                            <div className="flex w-full items-center justify-between gap-2">
                              <div className="flex items-center gap-2 truncate min-w-0 text-brand-700 font-bold">
                                <FileTextIcon className="h-5 w-5 shrink-0 text-brand-600" />
                                <span className="truncate text-xs">{cvFile.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCvFile(null);
                                  if (cvInputRef.current) cvInputRef.current.value = '';
                                }}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition"
                                title={t(ui.recruitment.removeFile)}
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <UploadIcon className="h-5 w-5 text-brand-600" />
                              <span className="text-xs font-bold text-brand-800">
                                {t(ui.recruitment.uploadCvBtn)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">PDF, DOCX (حتى 10MB)</span>
                            </>
                          )}
                          <input
                            ref={cvInputRef}
                            id="app-cv"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setCvFile(file);
                            }}
                          />
                        </div>
                      </Field>

                      {/* Photo Upload */}
                      <Field id="app-photo" label={t(ui.recruitment.photoOptional)} hint="JPG, PNG">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => photoInputRef.current?.click()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              photoInputRef.current?.click();
                            }
                          }}
                          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center text-sm transition shadow-xs outline-none ${
                            photoFile
                              ? 'border-emerald-300 bg-emerald-50/40'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {photoFile ? (
                            <div className="flex w-full items-center justify-between gap-2">
                              <div className="flex items-center gap-2 truncate min-w-0 text-slate-700 font-bold">
                                <ImageIcon className="h-5 w-5 shrink-0 text-emerald-600" />
                                <span className="truncate text-xs">{photoFile.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPhotoFile(null);
                                  if (photoInputRef.current) photoInputRef.current.value = '';
                                }}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition"
                                title={t(ui.recruitment.removePhoto)}
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="h-5 w-5 text-slate-400" />
                              <span className="text-xs font-bold text-slate-700">
                                {t(ui.recruitment.uploadPhotoBtn)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">JPG, PNG (حتى 5MB)</span>
                            </>
                          )}
                          <input
                            ref={photoInputRef}
                            id="app-photo"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setPhotoFile(file);
                            }}
                          />
                        </div>
                      </Field>
                    </div>

                    <Field id="app-message" label={t(ui.careers.formMessage)} hint={t(ui.common.optional)}>
                      <textarea
                        id="app-message"
                        rows={2}
                        value={notes}
                        placeholder={t(ui.recruitment.additionalNotesPlaceholder)}
                        onChange={(e) => setNotes(e.target.value)}
                        className={`${controlClass} bg-white resize-none shadow-xs text-xs`}
                      />
                    </Field>
                  </div>
                </form>
              )}
            </div>

            {/* Sticky Fixed Footer Action Bar */}
            {!result && (
              <div className="border-t border-slate-100 bg-white px-6 py-4 sm:px-8 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  {t(ui.recruitment.cancelBtn)}
                </button>
                <button
                  type="submit"
                  form="application-form"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 px-7 py-2.5 text-xs sm:text-sm font-black text-white transition disabled:opacity-60 shadow-sm hover:shadow"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>{t(ui.common.sending)}</span>
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-3.5 w-3.5 ltr:rotate-0 rtl:rotate-180" />
                      <span>{t(ui.recruitment.submitApplicationBtn)}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}