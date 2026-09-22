import { useState } from 'react';
import { SearchIcon, ClipboardCheckIcon, BriefcaseIcon, RefreshCwIcon } from 'lucide-react';
import type { JobItem } from '../components/careers/JobCard';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { JobCard } from '../components/careers/JobCard';
import { ApplicationModal } from '../components/careers/ApplicationModal';
import { ApplicationTrackingModal } from '../components/careers/ApplicationTrackingModal';
import { useJobs, useRecruitmentLookups } from '../features/recruitment/useRecruitment';
import { controlClass } from '../components/shared/Field';

export function Careers() {
  const { t, lang } = useLang();
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

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, dept: val || undefined }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, type: val || undefined }));
  };

  const handleResetFilters = () => {
    setFilters({ lang: lang === 'en' ? 'en' : 'ar' });
  };

  return (
    <>
      <PageHeader
        eyebrow={t(ui.nav.careers)}
        title={t(ui.careers.pageTitle)}
        subtitle={t(ui.careers.pageSubtitle)}
      />

      <section className="mx-auto max-w-site px-4 py-10 md:px-6 md:py-14">
        {/* Controls & Tracking Bar */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search & Filters */}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1">
              <SearchIcon className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.q || ''}
                onChange={handleSearchChange}
                placeholder={lang === 'ar' ? 'ابحث في الوظائف أو الأقسام...' : 'Search jobs or departments...'}
                className={`${controlClass} ltr:pl-10 rtl:pr-10 bg-white shadow-xs`}
              />
            </div>

            {/* Department Filter */}
            <div className="w-full sm:w-auto min-w-[160px]">
              <select
                value={filters.dept || ''}
                onChange={handleDeptChange}
                className={`${controlClass} bg-white shadow-xs`}
              >
                <option value="">{lang === 'ar' ? 'جميع الأقسام' : 'All Departments'}</option>
                {lookups.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Type Filter */}
            <div className="w-full sm:w-auto min-w-[140px]">
              <select
                value={filters.type || ''}
                onChange={handleTypeChange}
                className={`${controlClass} bg-white shadow-xs`}
              >
                <option value="">{lang === 'ar' ? 'نوع الدوام' : 'All Types'}</option>
                {lookups.employment_types.map((type) => (
                  <option key={type.key} value={type.key}>
                    {lang === 'en' ? type.name_en : type.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button if active */}
            {(filters.q || filters.dept || filters.type) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 underline px-2 py-1"
              >
                {lang === 'ar' ? 'إعادة التعيين' : 'Reset'}
              </button>
            )}
          </div>

          {/* Application Tracking CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTrackingOpen(true)}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-brand-800 transition hover:bg-brand-100/70 hover:border-brand-300 shadow-xs"
            >
              <ClipboardCheckIcon className="h-4 w-4 text-brand-600" />
              <span>{lang === 'ar' ? 'متابعة حالة طلب توظيف' : 'Track Application Status'}</span>
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-card border border-slate-100 bg-slate-50 p-6"
              >
                <div className="h-6 w-24 rounded bg-slate-200 mb-4" />
                <div className="h-7 w-3/4 rounded bg-slate-200 mb-2" />
                <div className="h-4 w-full rounded bg-slate-200 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Notification */}
        {error && !loading && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => refresh()}
              className="inline-flex items-center gap-1 font-bold text-amber-900 underline"
            >
              <RefreshCwIcon className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="my-12 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <BriefcaseIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-black text-ink">
              {lang === 'ar' ? 'لا توجد وظائف مطابقة للبحث حالياً' : 'No matching vacancies found'}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              {lang === 'ar'
                ? 'جرب البحث بكلمات مختلفة أو قم بإلغاء الفلاتر المحددة.'
                : 'Try adjusting your search terms or clearing the filters.'}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="focus-ring mt-6 inline-flex items-center justify-center rounded-pill bg-brand-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700"
            >
              {lang === 'ar' ? 'عرض جميع الوظائف' : 'View All Jobs'}
            </button>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
      </section>

      {/* Application Submission Modal */}
      <ApplicationModal job={activeJob} onClose={() => setActiveJob(null)} />

      {/* Application Status Tracking Modal */}
      <ApplicationTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </>
  );
}