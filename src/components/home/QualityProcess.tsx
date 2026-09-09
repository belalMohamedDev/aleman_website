import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { SectionHeading } from '../shared/SectionHeading';
import { QualityStepsFlow } from '../company/QualitySteps';

export function QualityProcess() {
  const { t } = useLang();

  return (
    <section className="border-y border-brand-100 bg-brand-50/40 py-16 md:py-20" aria-labelledby="quality-title">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <SectionHeading
          eyebrow={t(ui.home.qualityTitle)}
          title={t(ui.home.qualitySubtitle)}
          action={
          <Link
            to="/quality"
            className="focus-ring inline-flex rounded-pill border border-brand-200 bg-white px-5 py-2.5 text-sm font-bold text-brand-600 transition hover:border-brand-400">
            
              {t(ui.common.readMore)}
            </Link>
          } />
        
        <div id="quality-title" className="sr-only">
          {t(ui.quality.pageTitle)}
        </div>
        <QualityStepsFlow />
      </div>
    </section>);

}