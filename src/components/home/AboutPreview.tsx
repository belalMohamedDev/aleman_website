import { Link } from 'react-router-dom';
import { CheckCircle2Icon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Reveal } from '../shared/Reveal';

const LAB_IMAGE = "/e89e15e1-9e1a-4084-9beb-18bbd3298ea5.webp";
const FACTORY_IMAGE = "/3e951125-4919-4762-a40a-229dd36ecc10.webp";

export function AboutPreview() {
  const { t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;

  const points = [ui.about.philosophyTitle, ui.about.labTitle, ui.about.manufacturingTitle, ui.about.packagingTitle];

  return (
    <section className="relative mx-auto max-w-site px-4 py-16 md:px-6 md:py-24 overflow-hidden" aria-labelledby="about-preview-title">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative grid grid-cols-2 gap-4 sm:gap-6">
          <div className="group overflow-hidden rounded-card border border-brand-100/80 bg-white p-2 shadow-card transition-all duration-500 hover:shadow-lift">
            <img
              src={LAB_IMAGE}
              alt={t(ui.about.labTitle)}
              loading="lazy"
              decoding="async"
              className="h-56 w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105 sm:h-72"
            />
          </div>

          <div className="group mt-8 overflow-hidden rounded-card border border-brand-100/80 bg-white p-2 shadow-card transition-all duration-500 hover:shadow-lift">
            <img
              src={FACTORY_IMAGE}
              alt={t(ui.about.manufacturingTitle)}
              loading="lazy"
              decoding="async"
              className="h-56 w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105 sm:h-72"
            />
          </div>

          {/* Decorative Experience Badge Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/80 bg-brand-600 p-4 text-white shadow-lift text-center backdrop-blur-md">
            <span className="block text-2xl md:text-3xl font-black text-gold-400">+33</span>
            <span className="block text-xs font-bold text-white/90">عاماً من الخبرة</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="inline-flex items-center gap-2 rounded-pill border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 text-xs font-bold text-brand-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse" aria-hidden="true" />
            {t(ui.home.aboutTitle)}
          </span>

          <h2 id="about-preview-title" className="mt-4 text-3xl font-black leading-[1.28] text-ink md:text-4xl">
            {t(ui.about.identityTitle)}
          </h2>

          <p className="mt-5 text-base leading-relaxed text-ink-muted font-medium">{t(ui.about.intro)}</p>
          <p className="mt-3 text-base leading-relaxed text-ink-muted font-medium">{t(ui.about.philosophyBody)}</p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li key={t(point)} className="flex items-center gap-3 rounded-2xl border border-brand-100/60 bg-white/80 p-3.5 text-sm font-bold text-ink shadow-sm transition-all hover:bg-brand-50/50">
                <CheckCircle2Icon className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                <span>{t(point)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              to="/about"
              className="focus-ring group inline-flex items-center gap-2.5 rounded-pill bg-brand-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-card transition-all hover:bg-brand-700 hover:shadow-lift"
            >
              <span>{t(ui.common.readMore)}</span>
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}