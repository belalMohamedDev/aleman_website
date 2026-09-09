import React from 'react';
import { BeakerIcon, BoxesIcon, FactoryIcon, HandshakeIcon, LayersIcon, ShieldCheckIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';

const CARDS = [
  { id: 'experience', icon: FactoryIcon, title: ui.trust.experienceTitle, body: ui.trust.experienceBody, stat: '+25 عاماً', span: 'lg:col-span-2', tone: 'dark' as const },
  { id: 'quality', icon: BeakerIcon, title: ui.trust.qualityTitle, body: ui.trust.qualityBody, stat: '100% فحص', span: 'lg:col-span-2', tone: 'light' as const },
  { id: 'manufacturing', icon: LayersIcon, title: ui.trust.manufacturingTitle, body: ui.trust.manufacturingBody, stat: 'طاقة قصوى', span: '', tone: 'light' as const },
  { id: 'range', icon: BoxesIcon, title: ui.trust.rangeTitle, body: ui.trust.rangeBody, stat: '+4 قطاعات', span: '', tone: 'gold' as const },
  { id: 'packaging', icon: ShieldCheckIcon, title: ui.trust.packagingTitle, body: ui.trust.packagingBody, stat: 'حماية كاملة', span: '', tone: 'light' as const },
  { id: 'customers', icon: HandshakeIcon, title: ui.trust.customersTitle, body: ui.trust.customersBody, stat: 'شراكة دائمية', span: '', tone: 'light' as const }
];

export function TrustMetrics() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-site px-4 py-16 md:px-6 md:py-20" aria-labelledby="trust-title">
      <SectionHeading eyebrow={t(ui.home.trustTitle)} title={t(ui.home.trustSubtitle)} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, index) => {
          const Icon = card.icon;
          const isDark = card.tone === 'dark';
          const isGold = card.tone === 'gold';
          return (
            <Reveal
              key={card.id}
              delay={index * 0.06}
              className={`${card.span} relative overflow-hidden rounded-card border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                isDark
                  ? 'border-brand-700 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white shadow-lift'
                  : isGold
                  ? 'border-gold-300/80 bg-gradient-to-br from-gold-50 via-white to-gold-100/50 shadow-card'
                  : 'border-brand-100/80 bg-white/95 backdrop-blur-sm shadow-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-13 w-13 items-center justify-center rounded-2xl ${
                    isDark
                      ? 'bg-white/15 text-gold-300 shadow-inner'
                      : isGold
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'bg-brand-50 text-brand-600'
                  }`}
                >
                  <Icon className="h-6.5 w-6.5" aria-hidden="true" />
                </span>

                <span
                  className={`text-xs font-black px-3 py-1 rounded-pill ${
                    isDark
                      ? 'bg-white/15 text-gold-300 border border-white/10'
                      : isGold
                      ? 'bg-gold-200/60 text-gold-800'
                      : 'bg-brand-50 text-brand-700'
                  }`}
                >
                  {card.stat}
                </span>
              </div>

              <h3 id={card.id === 'experience' ? 'trust-title' : undefined} className={`mt-5 text-xl font-black ${isDark ? 'text-white' : 'text-ink'}`}>
                {t(card.title)}
              </h3>
              <p className={`mt-2.5 text-sm leading-relaxed ${isDark ? 'text-white/85 font-normal' : 'text-ink-muted font-medium'}`}>
                {t(card.body)}
              </p>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-ink-muted font-semibold text-center sm:text-start">{t(ui.trust.metricNote)}</p>
    </section>
  );
}