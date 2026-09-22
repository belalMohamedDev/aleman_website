import { Link } from 'react-router-dom';
import { motion, MotionValue } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  PhoneCallIcon,
} from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface HeroContentLayerProps {
  y: MotionValue<string>;
  opacity: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  onScrollClick: () => void;
  reduced: boolean;
}

export function HeroContentLayer({
  y,
  opacity,
  pointerX,
  pointerY,
  onScrollClick,
  reduced,
}: HeroContentLayerProps) {
  const { t, dir, lang } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;
  const initialHeadlineX = dir === 'rtl' ? 45 : -45;

  return (
    <div className="hero-layer-content px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
      <motion.div
        style={
          reduced
            ? undefined
            : {
                y,
                opacity,
                x: pointerX,
                translateY: pointerY,
              }
        }
        className="hero-content-box"
      >
        {/* Main Title with Gold Accent Line */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: initialHeadlineX }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 1.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {lang === 'ar' ? (
            <h1
              id="hero-title"
              className="text-3xl font-black leading-[1.3] text-white sm:text-4xl sm:leading-[1.28] md:text-5xl md:leading-[1.24] lg:text-[3.25rem] lg:leading-[1.22] drop-shadow-md"
            >
              <span>خبرة صناعية راسخة في</span>
              <br />
              <span className="text-[#f59e0b] drop-shadow">
                تصنيع الأعلاف وتغذية
              </span>
              <br />
              <span>الحيوان</span>
            </h1>
          ) : (
            <h1
              id="hero-title"
              className="text-3xl font-black leading-[1.2] text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.18] drop-shadow-md"
            >
              <span>Industrial Expertise in</span>
              <br />
              <span className="text-[#f59e0b] drop-shadow">
                Feed Manufacturing &
              </span>
              <br />
              <span>Animal Nutrition</span>
            </h1>
          )}
        </motion.div>

        {/* Body Description */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.75,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-5 sm:mt-6 lg:mt-7 text-sm sm:text-base lg:text-[1.02rem] leading-relaxed text-slate-100/90 font-medium drop-shadow"
        >
          {t(ui.home.heroBody)}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.95,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-7 sm:mt-8 lg:mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#f97316] hover:bg-[#ea580c] px-7 py-3 sm:px-8 sm:py-3.5 text-base font-extrabold text-white shadow-lg shadow-orange-950/40 transition-all hover:scale-105 active:scale-95"
          >
            <span>{t(ui.home.ctaPrimary)}</span>
            <Arrow
              className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 px-6 py-3 sm:px-7 sm:py-3.5 text-base font-extrabold text-white backdrop-blur-md transition-all hover:border-white hover:scale-105 active:scale-95"
          >
            <PhoneCallIcon
              className="h-5 w-5 text-amber-400"
              aria-hidden="true"
            />
            <span>{t(ui.home.ctaSecondary)}</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.button
        type="button"
        onClick={onScrollClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 0.9 },
          y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }}
        aria-label={t(ui.home.scrollDownLabel)}
        className="hero-scroll-btn text-white/80 hover:text-white"
      >
        <span className="text-[11px] font-bold text-amber-400/90 tracking-wider">
          {t(ui.home.discoverMore)}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-amber-400" />
      </motion.button>
    </div>
  );
}
