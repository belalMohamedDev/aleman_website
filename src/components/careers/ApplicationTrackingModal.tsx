import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, XIcon, CheckCircle2Icon, ClockIcon, AlertCircleIcon, UserIcon, BriefcaseIcon, CalendarIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { controlClass } from '../shared/Field';
import { useJobTracking } from '../../features/recruitment/useRecruitment';

type ApplicationTrackingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ApplicationTrackingModal({ isOpen, onClose }: ApplicationTrackingModalProps) {
  const { isRtl, t } = useLang();
  const [query, setQuery] = useState('');
  const { tracking, result, error, track, reset } = useJobTracking();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function handleClose() {
    reset();
    setQuery('');
    onClose();
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    await track(query);
  }

  return (
    <AnimatePresence>
      {isOpen ? (
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
            aria-labelledby="tracking-title"
            dir={isRtl ? 'rtl' : 'ltr'}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white p-6 shadow-lift md:p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="rounded bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                  {t(ui.recruitment.portalTitle)}
                </span>
                <h2 id="tracking-title" className="mt-1 text-xl font-extrabold text-ink">
                  {t(ui.recruitment.trackModalTitle)}
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

            {/* Search Input */}
            <form onSubmit={handleSearch} className="mt-6">
              <label htmlFor="track-query" className="block text-sm font-bold text-ink mb-1.5">
                {t(ui.recruitment.trackQueryHeading)}
              </label>
              <div className="relative flex items-center">
                <input
                  id="track-query"
                  type="text"
                  value={query}
                  placeholder={t(ui.recruitment.trackAppNoOrNidPlaceholder)}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`${controlClass} ltr:pr-24 rtl:pl-24`}
                />
                <button
                  type="submit"
                  disabled={tracking || !query.trim()}
                  className="focus-ring absolute ltr:right-1.5 rtl:left-1.5 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
                >
                  {tracking ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <SearchIcon className="h-3.5 w-3.5" />
                  )}
                  <span>{t(ui.recruitment.trackBtn)}</span>
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                {t(ui.recruitment.trackHint)}
              </p>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{t(ui.recruitment.noResultsFound)}</p>
                  <p className="mt-0.5 text-xs text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
                <div className="flex items-center justify-between border-b border-brand-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {t(ui.recruitment.appNumberLabel)}
                    </span>
                    <p className="text-lg font-mono font-black text-brand-700">
                      {result.application_number}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2Icon className="h-4 w-4" />
                    {result.status_label || result.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center gap-2.5 text-ink">
                    <UserIcon className="h-4 w-4 text-brand-500 shrink-0" />
                    <span className="font-bold">{result.applicant_name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-muted">
                    <BriefcaseIcon className="h-4 w-4 text-brand-500 shrink-0" />
                    <span>{result.applied_position}</span>
                    {result.job_code && (
                      <span className="rounded bg-white px-2 py-0.5 font-mono text-xs text-slate-500 border border-slate-200">
                        {result.job_code}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-muted">
                    <CalendarIcon className="h-4 w-4 text-brand-500 shrink-0" />
                    <span>{`${t(ui.recruitment.appliedOn)} ${result.application_date}`}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-muted">
                    <ClockIcon className="h-4 w-4 text-brand-500 shrink-0" />
                    <span>{`${t(ui.recruitment.currentStage)} ${result.stage_name}`}</span>
                  </div>
                </div>

                {result.notes && (
                  <div className="mt-4 rounded-xl bg-white p-3.5 border border-slate-100 text-xs text-ink-muted">
                    <span className="font-bold text-slate-700 block mb-1">
                      {t(ui.recruitment.hrNotes)}
                    </span>
                    {result.notes}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
