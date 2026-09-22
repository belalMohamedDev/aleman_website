import { Link } from 'react-router-dom';
import { MessageCircleIcon, PackageSearchIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Reveal } from '../shared/Reveal';

export function ContactCTA() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-site px-4 py-16 md:px-6 md:py-24" aria-labelledby="contact-cta-title">
      <Reveal className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 px-6 py-12 text-white shadow-lift md:px-12 md:py-16">
        {/* Background Decorative Pattern & Animal Graphic */}
        <div className="pattern-field pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="absolute top-1/2 ltr:-right-10 rtl:-left-10 -translate-y-1/2 w-80 h-80 opacity-15 pointer-events-none hidden md:block">
          <img src="/animal_cow.webp" alt="" loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-overlay filter brightness-200" />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-4 py-1 text-xs font-bold text-gold-300 backdrop-blur-md mb-3 border border-white/10">
              تواصل مبسط وسريع
            </span>
            <h2 id="contact-cta-title" className="text-3xl font-black leading-[1.28] md:text-4xl text-white">
              {t(ui.home.ctaSectionTitle)}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-100 font-medium">{t(ui.home.ctaSectionBody)}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
            <Link
              to="/products"
              className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-pill bg-gold-500 px-8 py-4 text-sm font-extrabold text-white shadow-card transition-all hover:bg-gold-600 hover:scale-105 active:scale-95"
            >
              <PackageSearchIcon className="h-4.5 w-4.5" aria-hidden="true" />
              <span>{t(ui.home.ctaPrimary)}</span>
            </Link>
            <Link
              to="/contact"
              className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-pill border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-extrabold text-white backdrop-blur-md transition-all hover:border-white hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <MessageCircleIcon className="h-4.5 w-4.5 text-gold-300" aria-hidden="true" />
              <span>{t(ui.home.ctaSecondary)}</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}