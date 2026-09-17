import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { Reveal } from '../components/shared/Reveal';
import { QualityStepsFlow } from '../components/company/QualitySteps';

const LAB_IMAGE = "/e89e15e1-9e1a-4084-9beb-18bbd3298ea5.webp";

export function Quality() {
  const { t } = useLang();

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.quality)} title={t(ui.quality.pageTitle)} subtitle={t(ui.quality.pageSubtitle)} />

      <section className="mx-auto max-w-site px-4 py-14 md:px-6 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <img
              src={LAB_IMAGE}
              alt={t(ui.about.labTitle)}
              loading="lazy"
              decoding="async"
              className="h-64 w-full rounded-card border border-brand-100 object-cover shadow-card md:h-80" />
            
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-extrabold leading-[1.35] text-ink md:text-3xl">{t(ui.about.philosophyTitle)}</h2>
            <p className="mt-4 text-base leading-loose text-ink-muted">{t(ui.about.philosophyBody)}</p>
            <p className="mt-3 text-base leading-loose text-ink-muted">{t(ui.about.labBody)}</p>
            <Link
              to="/products"
              className="focus-ring mt-6 inline-flex rounded-pill bg-brand-600 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-brand-700">
              
              {t(ui.home.ctaPrimary)}
            </Link>
          </Reveal>
        </div>

        <div className="mt-14">
          <QualityStepsFlow detailed />
        </div>
      </section>
    </>);

}