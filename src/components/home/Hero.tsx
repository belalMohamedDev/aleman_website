import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, LeafIcon, PhoneCallIcon, ShieldCheckIcon, AwardIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
// import { HeroLeafShadows } from './HeroLeafShadows';

const HERO_BG = "/hero_farm_bg.png";

export function Hero() {
  const { t, dir, lang } = useLang();
  const reduced = useReducedMotion();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full overflow-hidden flex items-center text-white" aria-labelledby="hero-title">
      {/* Background Image with Cinematic Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt={t(ui.home.heroImageAlt)}
          className="h-full w-full object-cover object-[center_right] lg:object-center"
          loading="eager"
        />

        {/* Top & Bottom Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02150d]/50 via-transparent to-black/40 pointer-events-none" />

        {/* Mobile Backdrop Mask for full readability */}
        <div className="absolute inset-0 bg-[#031a10]/70 md:hidden pointer-events-none" />

        {/* Directional Mask for Text Side: Luminous rich forest green with smooth fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#042013]/90 via-[#042013]/65 via-45% to-transparent ltr:block hidden pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#042013]/90 via-[#042013]/65 via-45% to-transparent rtl:block hidden pointer-events-none" />
      </div>

      {/* Decorative Botanical Leaf Shadows (Gobo / Bokeh Foliage Frame) */}
      {/* <HeroLeafShadows /> */}

      {/* Hero Content positioned towards the right in RTL */}
      <div className="relative z-20 w-full max-w-[1700px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-36 lg:pb-28 flex flex-col items-start">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl lg:max-w-2xl text-start"
        >


          {/* Main Title with Gold Accent Line */}
          {lang === 'ar' ? (
            <h1 id="hero-title" className="text-3xl font-black leading-[1.35] text-white sm:text-4xl sm:leading-[1.32] md:text-5xl md:leading-[1.28] lg:text-[3.25rem] lg:leading-[1.26] drop-shadow-md">
              <span>خبرة صناعية راسخة في</span>
              <br />
              <span className="text-[#f59e0b] drop-shadow">تصنيع الأعلاف وتغذية</span>
              <br />
              <span>الحيوان</span>
            </h1>
          ) : (
            <h1 id="hero-title" className="text-3xl font-black leading-[1.25] text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.22] drop-shadow-md">
              <span>Industrial Expertise in</span>
              <br />
              <span className="text-[#f59e0b] drop-shadow">Feed Manufacturing &</span>
              <br />
              <span>Animal Nutrition</span>
            </h1>
          )}

          {/* Body Text */}
          <p className="mt-7 sm:mt-8 lg:mt-9 max-w-xl text-sm sm:text-base lg:text-[1.05rem] leading-relaxed text-slate-100/90 font-medium drop-shadow">
            {t(ui.home.heroBody)}
          </p>

          {/* Call to Actions */}
          <div className="mt-9 sm:mt-11 lg:mt-12 flex flex-wrap items-center gap-4 sm:gap-5">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#f97316] hover:bg-[#ea580c] px-8 py-3.5 text-base font-extrabold text-white shadow-lg shadow-orange-950/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>{t(ui.home.ctaPrimary)}</span>
              <Arrow className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/40 bg-white/5 hover:bg-white/15 px-7 py-3.5 text-base font-extrabold text-white backdrop-blur-md transition-all hover:border-white hover:scale-105 active:scale-95"
            >
              <PhoneCallIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
              <span>{t(ui.home.ctaSecondary)}</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        type="button"
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
        aria-label="Scroll down"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/70 transition hover:text-white"
      >
        <ChevronDownIcon className="h-5 w-5 text-amber-400" />
      </motion.button>
    </section>
  );
}