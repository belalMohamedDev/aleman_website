import { useState } from 'react';
import {
  Search,
  ClipboardCheck,
  Briefcase,
  RefreshCw,
  FileCheck2,
  HelpCircle,
  X,
} from 'lucide-react';
import type { JobItem } from '../components/careers/JobCard';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { JobCard } from '../components/careers/JobCard';
import { ApplicationModal } from '../components/careers/ApplicationModal';
import { ApplicationTrackingModal } from '../components/careers/ApplicationTrackingModal';
import { CareersWhyUs } from '../components/careers/CareersWhyUs';
import { CareersProcess } from '../components/careers/CareersProcess';
import { useJobs, useRecruitmentLookups } from '../features/recruitment/useRecruitment';
import type { JobDto } from '../features/recruitment/types';

export function Careers() {
  const { lang, isRtl, t } = useLang();
  const [activeJob, setActiveJob] = useState<JobItem | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Use the recruitment hooks for fetching and filtering
  const { jobs, loading, error, filters, setFilters, refresh } = useJobs({
    lang: lang === 'en' ? 'en' : 'ar',
  });
  const { lookups } = useRecruitmentLookups();

  // Search and filter handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, q: val || undefined }));
  };

  const handleDeptSelect = (dept: string) => {
    setFilters((prev) => ({
      ...prev,
      dept: dept === 'all' ? undefined : dept,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, type: val || undefined }));
  };

  const handleResetFilters = () => {
    setFilters({ lang: lang === 'en' ? 'en' : 'ar' });
  };

  // Trigger general application
  const handleOpenGeneralApply = () => {
    const generalJob: JobDto = {
      id: 0,
      job_code: 'GENERAL-APP',
      title: t(ui.recruitment.generalAppTitle),
      title_ar: 'طلب توظيف عام (قاعدة الكفاءات)',
      title_en: 'General Application (Talent Pool)',
      department: t(ui.recruitment.allDepartments),
      location: t(ui.recruitment.egyptLocation),
      employment_type: 'Full-Time',
      summary: t(ui.recruitment.generalAppSummary),
    };
    setActiveJob(generalJob);
  };

  const activeDept = filters.dept || 'all';

  return (
    <div className="min-h-screen bg-canvas" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Main Section - Matching Products.tsx Compact Layout */}
      <section className="mx-auto max-w-[1440px] px-4 pt-24 pb-12 md:px-8 md:pt-28 md:pb-16">
        {/* Compact Header & Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-ink">
                  {t(ui.recruitment.careersHeading)}
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {t(ui.recruitment.careersSubtitle)}
              </p>
            </div>

            {/* Search Input & Tracking Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64 md:w-72">
                <Search className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filters.q || ''}
                  onChange={handleSearchChange}
                  placeholder={t(ui.recruitment.searchPlaceholderCareers)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 ltr:pl-10 rtl:pr-10 ltr:pr-8 rtl:pl-8 text-xs font-bold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none shadow-xs"
                />
                {filters.q && (
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, q: undefined }))}
                    className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsTrackingOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 text-xs font-black text-brand-800 transition shadow-xs"
              >
                <ClipboardCheck className="h-4 w-4 text-brand-600" />
                <span>{t(ui.recruitment.trackApplicationShort)}</span>
              </button>
            </div>
          </div>

          {/* Department Filter Tabs (Directly underneath, matching Products.tsx) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDeptSelect('all')}
                className={`rounded-xl px-4 py-2 text-xs font-black transition ${activeDept === 'all'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {t(ui.recruitment.allDepartments)}
              </button>

              {lookups.departments.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDeptSelect(d)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-black transition ${activeDept === d
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filters.type || ''}
                onChange={handleTypeChange}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-500 shadow-xs"
              >
                <option value="">{t(ui.recruitment.allTypesFilter)}</option>
                {lookups.employment_types.map((type) => (
                  <option key={type.key} value={type.key}>
                    {lang === 'en' ? type.name_en : type.name_ar}
                  </option>
                ))}
              </select>

              {(filters.q || filters.dept || filters.type) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-100 transition"
                >
                  {t(ui.recruitment.clearFilters)}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-card"
              >
                <div className="h-6 w-28 rounded-lg bg-slate-200 mb-4" />
                <div className="h-7 w-3/4 rounded-lg bg-slate-200 mb-3" />
                <div className="h-4 w-full rounded bg-slate-100 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
                <div className="mt-8 h-10 w-full rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error Notification */}
        {error && !loading && (
          <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="font-black text-base block">{t(ui.recruitment.connErrorTitle)}</span>
              <span className="text-xs text-amber-800 mt-1 block">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => refresh()}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-200/80 px-4 py-2 font-black text-amber-900 hover:bg-amber-300 transition text-xs shadow-xs shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t(ui.recruitment.retryBtn)}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-black text-ink">
              {t(ui.recruitment.noJobsFound)}
            </h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {t(ui.recruitment.noJobsFoundDesc)}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-full bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-xs font-black text-slate-800 transition"
              >
                {t(ui.recruitment.viewAllJobs)}
              </button>
              <button
                type="button"
                onClick={handleOpenGeneralApply}
                className="rounded-full bg-gold-500 hover:bg-gold-600 px-5 py-2.5 text-xs font-black text-white transition shadow-sm"
              >
                {t(ui.recruitment.submitToTalentPool)}
              </button>
            </div>
          </div>
        )}

        {/* Smart Job Layout */}
        {!loading && jobs.length > 0 && (
          <>
            {jobs.length <= 2 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Jobs Column (2 cols wide) */}
                <div className="lg:col-span-2 space-y-6">
                  {jobs.map((job, index) => (
                    <JobCard
                      key={String(job.id)}
                      job={job}
                      index={index}
                      onApply={(selected) => setActiveJob(selected)}
                      isWide={true}
                    />
                  ))}
                </div>

                {/* Side Panel: Quick Tracking & Tips */}
                <div className="space-y-6">
                  {/* Quick Tracking Card */}
                  <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-card hover:shadow-lift transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2 text-brand-700">
                      <ClipboardCheck className="h-4 w-4" />
                      <span className="text-xs font-black">
                        {t(ui.recruitment.trackExistingTitle)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {t(ui.recruitment.trackExistingDesc)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsTrackingOpen(true)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 hover:bg-brand-100 py-3 text-xs font-black text-brand-800 transition shadow-xs"
                    >
                      <ClipboardCheck className="h-4 w-4 text-brand-600" />
                      <span>{t(ui.recruitment.trackStatusBtn)}</span>
                    </button>
                  </div>

                  {/* Application Tips Card */}
                  <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-card hover:shadow-lift transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3 text-brand-700">
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-xs font-black">
                        {t(ui.recruitment.applicationTipsTitle)}
                      </span>
                    </div>
                    <ul className="space-y-3 text-xs text-slate-600 font-medium leading-relaxed">
                      <li className="flex items-start gap-2">
                        <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t(ui.recruitment.tip1)}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t(ui.recruitment.tip2)}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t(ui.recruitment.tip3)}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, index) => (
                  <JobCard
                    key={String(job.id)}
                    job={job}
                    index={index}
                    onApply={(selected) => setActiveJob(selected)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Why Join Al-Eman Section (Matching Image 3 Editorial Style) */}
      <CareersWhyUs />

      {/* Hiring Journey Process (Matching Image 4 Winding Roadmap) */}
      <CareersProcess />

      {/* Application Submission Modal */}
      <ApplicationModal job={activeJob} onClose={() => setActiveJob(null)} />

      {/* Application Status Tracking Modal */}
      <ApplicationTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </div>
  );
}