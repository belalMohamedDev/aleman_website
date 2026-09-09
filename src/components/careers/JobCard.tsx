import React from 'react';
import { BriefcaseIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import type { Job } from '../../types/content';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Badge } from '../shared/Badge';
import { Reveal } from '../shared/Reveal';

type JobCardProps = {
  job: Job;
  index?: number;
  onApply: (job: Job) => void;
};

export function JobCard({ job, index = 0, onApply }: JobCardProps) {
  const { t } = useLang();

  return (
    <Reveal delay={index * 0.06} className="flex h-full flex-col rounded-card border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="green">{t(job.department)}</Badge>
        {job.placeholder ? <Badge tone="gold">{t(ui.common.demoTag)}</Badge> : null}
      </div>

      <h3 className="mt-3 text-lg font-extrabold leading-snug text-ink">{t(job.title)}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(job.summary)}</p>

      <dl className="mt-4 grid gap-2 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
          <dt className="sr-only">{t(ui.careers.department)}</dt>
          <dd>{t(job.department)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
          <dt className="sr-only">{t(ui.careers.location)}</dt>
          <dd>{t(job.location)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
          <dt className="sr-only">{t(ui.careers.type)}</dt>
          <dd>{t(job.type)}</dd>
        </div>
      </dl>

      <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4 text-sm text-ink-soft">
        {job.responsibilities.map((item) =>
        <li key={t(item)} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
            {t(item)}
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => onApply(job)}
        className="focus-ring mt-5 inline-flex items-center justify-center rounded-pill bg-gold-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-gold-600">
        
        {t(ui.careers.apply)}
      </button>
    </Reveal>);

}