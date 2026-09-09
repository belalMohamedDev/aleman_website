import React from 'react';
import { BeakerIcon, FactoryIcon, HeartHandshakeIcon, PackageIcon, ShieldCheckIcon, SproutIcon } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { Reveal } from '../components/shared/Reveal';
import { SectionHeading } from '../components/shared/SectionHeading';
import { PlaceholderNotice } from '../components/shared/PlaceholderNotice';
import { Timeline } from '../components/company/Timeline';
import { QualityStepsFlow } from '../components/company/QualitySteps';

const FACTORY_IMAGE = "/3e951125-4919-4762-a40a-229dd36ecc10.jpg";
const RAW_IMAGE = "/cfe458d9-a06e-424e-9089-dbe2d0612755.jpg";

const PILLARS = [
{ icon: SproutIcon, title: ui.about.identityTitle, body: ui.about.identityBody },
{ icon: ShieldCheckIcon, title: ui.about.philosophyTitle, body: ui.about.philosophyBody },
{ icon: FactoryIcon, title: ui.about.manufacturingTitle, body: ui.about.manufacturingBody },
{ icon: BeakerIcon, title: ui.about.labTitle, body: ui.about.labBody },
{ icon: PackageIcon, title: ui.about.packagingTitle, body: ui.about.packagingBody },
{ icon: HeartHandshakeIcon, title: ui.about.valueTitle, body: ui.about.valueBody }];


export function About() {
  const { t } = useLang();

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.about)} title={t(ui.about.pageTitle)} subtitle={t(ui.about.intro)} />

      <section className="mx-auto max-w-site px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title.en} delay={index * 0.05} className="rounded-card border border-slate-100 bg-white p-6 shadow-card">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-lg font-extrabold text-ink">{t(pillar.title)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(pillar.body)}</p>
              </Reveal>);

          })}
        </div>
      </section>

      <section className="border-y border-brand-100 bg-brand-50/40 py-14 md:py-16">
        <div className="mx-auto max-w-site px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="grid gap-4 sm:grid-cols-2">
              <img src={FACTORY_IMAGE} alt={t(ui.about.manufacturingTitle)} loading="lazy" className="h-60 w-full rounded-card border border-brand-100 object-cover shadow-card" />
              <img src={RAW_IMAGE} alt={t(ui.about.philosophyTitle)} loading="lazy" className="h-60 w-full rounded-card border border-brand-100 object-cover shadow-card" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl font-extrabold leading-[1.3] text-ink md:text-4xl">{t(ui.about.timelineTitle)}</h2>
              <p className="mt-3 text-base leading-loose text-ink-muted">{t(ui.about.valueBody)}</p>
              <div className="mt-5">
                <PlaceholderNotice title={t(ui.common.placeholderTag)}>{t(ui.about.timelineNote)}</PlaceholderNotice>
              </div>
            </Reveal>
          </div>

          <div className="mt-10">
            <Timeline />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 py-14 md:px-6 md:py-16">
        <SectionHeading eyebrow={t(ui.quality.pageTitle)} title={t(ui.quality.pageSubtitle)} />
        <QualityStepsFlow />
      </section>
    </>);

}