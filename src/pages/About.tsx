import { motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { AboutMissionMap } from '../components/about/AboutMissionMap';
import { AboutValuesMap } from '../components/about/AboutValuesMap';
import { AboutMissionValuesBridge } from '../components/about/AboutMissionValuesBridge';
import { AboutWhyUs } from '../components/about/AboutWhyUs';
import { AboutStats } from '../components/about/AboutStats';

export function About() {
  const { isRtl, t } = useLang();

  return (
    <div className="min-h-screen bg-canvas pb-24 overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Header Section with Factory Background & Dynamic Glow */}
      <section className="relative overflow-hidden bg-[#031b10] text-white pt-28 pb-24 sm:pt-36 sm:pb-28 md:pt-40 md:pb-36">
        {/* Background Image of Factory with High Visibility & Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_farm_bg.webp"
            alt={t(ui.brand.name)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[center_right] lg:object-center opacity-90 filter brightness-105 contrast-105 scale-100 transition-transform duration-1000"
          />
          {/* Top Vignette behind Transparent Navbar */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/75 via-[#02180d]/40 to-transparent pointer-events-none" />

          {/* Bottom Blend to Stats Section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#031b10] via-[#031b10]/80 to-transparent pointer-events-none" />

          {/* Directional Mask for Text Side (RTL & LTR) */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#02180d]/90 via-[#02180d]/65 via-45% to-transparent hidden rtl:block pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02180d]/90 via-[#02180d]/65 via-45% to-transparent hidden ltr:block pointer-events-none" />

          {/* Mobile Tint for Small Screens */}
          <div className="absolute inset-0 bg-[#02180d]/45 md:hidden pointer-events-none" />
        </div>

        {/* Ambient Animated Glows */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 right-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
          {/* Breadcrumb */}


          <div className="max-w-3xl">
            {/* Animated Floating Eyebrow Badge */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-white mb-6 tracking-tight drop-shadow-md"
            >
              {t(ui.about.heroHeading)}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-emerald-100/95 leading-relaxed font-medium mb-8 max-w-2xl drop-shadow"
            >
              {t(ui.about.heroLead)}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Facts & Figures Bar (حقائق وأرقام مع أنيميشن وتأثيرات بصرية) */}
      <AboutStats />

      {/* Company History & Journey (تاريخ شركة الإيمان مع صورة المجمع عند الغروب) */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-8 sm:pt-10 md:pt-14 pb-8 md:pb-12">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink leading-snug">
              {t(ui.about.historyTitle)}
            </h2>

            <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              <p>
                {t(ui.about.historyP1)}
              </p>
              <p>
                {t(ui.about.historyP2)}
              </p>
              <p>
                {t(ui.about.historyP3)}
              </p>
            </div>
          </motion.div>

          {/* Logo Only: Balanced Floating Brand Logo */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            {/* Soft Ambient Glow behind logo */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.32, 0.18] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-60 w-60 sm:h-72 sm:w-72 rounded-full bg-gradient-to-tr from-brand-500/20 via-emerald-400/15 to-amber-400/15 blur-2xl pointer-events-none"
            />

            {/* Floating Brand Logo */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
                rotate: [-1, 1, -1],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.04 }}
              className="relative z-10 cursor-pointer"
            >
              <img
                src="/image.webp"
                alt={t(ui.brand.name)}
                loading="lazy"
                decoding="async"
                className="h-52 sm:h-64 md:h-72 lg:h-80 w-auto max-w-full object-contain filter drop-shadow-[0_20px_28px_rgba(0,0,0,0.1)] select-none transition-transform duration-300"
              />
            </motion.div>
          </div>
        </div>
      </section>



      {/* Connected Mission & Core Values Journey Map (خريطة المسار الحلزوني المتصلة لمهمتنا وقيمنا) */}
      <div className="about-journey-wrapper relative">
        <AboutMissionMap />
        <AboutValuesMap />
        <AboutMissionValuesBridge />
      </div>

      {/* Why Choose Us (لماذا تختار أعلاف الإيمان) */}
      <AboutWhyUs />

      {/* CTA Footer Section */}
      {/* <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-brand-900 text-white p-8 sm:p-12 lg:p-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lift"
        >
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">
              جاهزون لتلبية احتياجات مزرعتك بأعلى جودة
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium">
              اطلب طلبيتك الآن مباشرة بالأطنان أو تواصل مع فريق الاستشارات الفنية والتغذوية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] px-6 py-4 text-xs sm:text-sm font-black text-white shadow-lift transition-all hover:scale-105 active:scale-95"
            >
              <span>تصفح قائمة الأعلاف</span>
              <Back className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-xs sm:text-sm font-black text-white backdrop-blur-md transition-all active:scale-95"
            >
              <PhoneCallIcon className="h-4 w-4" />
              <span>تواصل مع الإدارة</span>
            </Link>
          </div>
        </motion.div>
      </section> */}
    </div>
  );
}