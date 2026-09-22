import { BriefcaseIcon, ClockIcon, MapPinIcon, CalendarIcon, AwardIcon } from 'lucide-react';
import type { Job } from '../../types/content';
import type { JobDto } from '../../features/recruitment/types';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Badge } from '../shared/Badge';
import { Reveal } from '../shared/Reveal';

export type JobItem = Job | JobDto;

type JobCardProps = {
  job: JobItem;
  index?: number;
  onApply: (job: JobItem) => void;
};

export function JobCard({ job, index = 0, onApply }: JobCardProps) {
  const { lang, t } = useLang();

  // Helper resolvers for localized or string fields
  const title =
    typeof job.title === 'object' && job.title !== null
      ? lang === 'en' ? job.title.en : job.title.ar
      : (lang === 'en' && 'title_en' in job && job.title_en
          ? job.title_en
          : 'title_ar' in job && job.title_ar
          ? job.title_ar
          : String(job.title));

  const department =
    typeof job.department === 'object' && job.department !== null
      ? lang === 'en' ? job.department.en : job.department.ar
      : String(job.department);

  const location =
    typeof job.location === 'object' && job.location !== null
      ? lang === 'en' ? job.location.en : job.location.ar
      : String(job.location);

  const jobType =
    'type' in job && typeof (job as any).type === 'object'
      ? lang === 'en' ? (job as any).type.en : (job as any).type.ar
      : ('employment_type_label' in job && job.employment_type_label
          ? job.employment_type_label
          : 'employment_type' in job && job.employment_type
          ? job.employment_type
          : 'دوام كامل');

  const workType = 'work_type_label' in job ? job.work_type_label : undefined;
  const experience = 'experience_label' in job ? job.experience_label : undefined;
  const deadline = 'deadline' in job ? job.deadline : undefined;
  const jobCode = 'job_code' in job ? job.job_code : undefined;
  const vacancies = 'vacancies' in job && job.vacancies && job.vacancies > 1 ? job.vacancies : undefined;

  const summary =
    typeof job.summary === 'object' && job.summary !== null
      ? lang === 'en' ? job.summary.en : job.summary.ar
      : String(job.summary || '');

  const rawResponsibilities = job.responsibilities;
  let responsibilities: string[] = [];
  if (Array.isArray(rawResponsibilities)) {
    responsibilities = rawResponsibilities.map((r: any) =>
      typeof r === 'object' && r !== null ? (lang === 'en' ? r.en : r.ar) : String(r)
    );
  } else if (typeof rawResponsibilities === 'string' && rawResponsibilities.trim()) {
    responsibilities = rawResponsibilities.split('\n').map((s) => s.trim()).filter(Boolean);
  }

  const isDemo = 'placeholder' in job && !!job.placeholder;

  return (
    <Reveal delay={index * 0.06} className="flex h-full flex-col rounded-card border border-slate-100 bg-white p-6 shadow-card hover:shadow-lift transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="green">{department}</Badge>
          {isDemo ? <Badge tone="gold">{t(ui.common.demoTag)}</Badge> : null}
          {workType ? (
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {workType}
            </span>
          ) : null}
        </div>
        {jobCode ? (
          <span className="text-[11px] font-mono font-bold text-slate-400">
            {jobCode}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-extrabold leading-snug text-ink">{title}</h3>
        {vacancies ? (
          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200/60">
            {vacancies} {lang === 'ar' ? 'شواغر' : 'openings'}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ink-muted line-clamp-3">{summary}</p>

      <dl className="mt-4 grid gap-2 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
          <dt className="sr-only">{t(ui.careers.department)}</dt>
          <dd className="truncate">{department}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
          <dt className="sr-only">{t(ui.careers.location)}</dt>
          <dd className="truncate">{location}</dd>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
          <dt className="sr-only">{t(ui.careers.type)}</dt>
          <dd className="truncate">{jobType}</dd>
        </div>
        {experience ? (
          <div className="flex items-center gap-2">
            <AwardIcon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
            <dt className="sr-only">{lang === 'ar' ? 'الخبرة' : 'Experience'}</dt>
            <dd className="truncate">{experience}</dd>
          </div>
        ) : null}
        {deadline ? (
          <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
            <CalendarIcon className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <dt className="sr-only">{lang === 'ar' ? 'آخر موعد' : 'Deadline'}</dt>
            <dd className="truncate">{lang === 'ar' ? `آخر موعد: ${deadline}` : `Deadline: ${deadline}`}</dd>
          </div>
        ) : null}
      </dl>

      {responsibilities.length > 0 ? (
        <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4 text-sm text-ink-soft">
          {responsibilities.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex gap-2 text-xs sm:text-sm">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
              <span className="line-clamp-2">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}

      <button
        type="button"
        onClick={() => onApply(job)}
        className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-pill bg-gold-500 px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-gold-600 hover:shadow active:scale-[0.99]">
        {t(ui.careers.apply)}
      </button>
    </Reveal>
  );
}