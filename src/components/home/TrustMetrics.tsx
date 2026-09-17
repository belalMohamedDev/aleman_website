import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Reveal } from '../shared/Reveal';
import './trust-section.css';

const TRUST_EDITORIAL_POINTS = [
  {
    id: 'quality',
    number: '01',
    title: 'فحص معملي صارم بنسبة 100%',
    desc: 'معامل تحليل متطورة لفحص كل دفعة بدقة متناهية والتأكد من نسب البروتين وخلوها من السموم الفطرية.'
  },
  {
    id: 'experience',
    number: '02',
    title: 'خبرة صناعية تتجاوز 33 عاماً',
    desc: 'إرث عريق وفريق تغذية متخصص في ابتكار تركيبات غذائية علمية تخدم كبرى مزارع مصر.'
  },
  {
    id: 'packaging',
    number: '03',
    title: 'تعبئة آلية فائقة الحماية',
    desc: 'خطوط تعبئة روبوتية محكمة تمنع وصول الرطوبة وتحافظ على حيوية وتجانس الحبيبات حتى المزرعة.'
  },
  {
    id: 'sectors',
    number: '04',
    title: 'تغطية متكاملة لـ 4 قطاعات إنتاجية',
    desc: 'أعلاف متخصصة للدواجن، الماشية، الأرانب، والبط تحقق أعلى معدل تحويل غذائي وأعلى ربحية للمربي.'
  }
];

export function TrustMetrics() {
  const { t } = useLang();
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll Parallax Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Balanced Parallax Transform values for the 3-sack product showcase
  const leftBagY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [24, -22]);
  const leftBagRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [-5, -5] : [-7, -3]);

  const rightBagY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [24, -22]);
  const rightBagRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [5, 5] : [3, 7]);

  const centerBagY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [14, -14]);
  const centerBagRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [1, -1]);

  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.92]);


  return (
    <section ref={containerRef} className="trust-section" aria-labelledby="trust-section-title">
      {/* Ambient background glows */}
      <div className="trust-ambient-glow" aria-hidden="true" />
      <div className="trust-ambient-glow-left" aria-hidden="true" />

      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <div className="trust-grid">
          {/* =========================================================================
              Right Column: Text Content & Trust Pillars (RTL Primary)
              ========================================================================= */}
          <div className="trust-text-col">
            <Reveal>
              {/* Eyebrow Pill */}
              {/* <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/90 px-4 py-1.5 text-xs font-black text-brand-700 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse" aria-hidden="true" />
                {t(ui.home.trustTitle)}
              </span> */}

              {/* Main Heading with generous Arabic line-height to prevent letter collision */}
              <h2
                id="trust-section-title"
                className="mt-5 text-3xl font-black leading-[1.5] text-ink sm:text-4xl sm:leading-[1.48] lg:text-[2.65rem] lg:leading-[1.45]"
              >
                {t(ui.home.trustSubtitle)}
              </h2>

              {/* Explanatory Lead */}
              <p className="mt-6 text-base font-medium leading-[1.85] text-ink-muted sm:text-lg sm:leading-[1.9]">
                نلتزم بتقديم أعلاف متوازنة وعالية النقاء ترتكز على أسس علمية دقيقة، وتخضع لمراقبة صارمة في جميع مراحل التصنيع لضمان أقصى إنتاجية وحماية لمزارعكم.
              </p>
            </Reveal>

            {/* Editorial Pillars with Central Spiral Track & Points (الخط الحلزوني ونقاط البوينت) */}
            <div className="trust-editorial-split">
              {/* Right Column in RTL: Items 01 & 03 */}
              <div className="trust-editorial-col-right">
                <Reveal delay={0.07}>
                  <div className="trust-editorial-item">
                    <div className="trust-editorial-header">
                      <span className="trust-mobile-point">01</span>
                      <h3 className="trust-editorial-title">{TRUST_EDITORIAL_POINTS[0].title}</h3>
                    </div>
                    <p className="trust-editorial-desc">{TRUST_EDITORIAL_POINTS[0].desc}</p>
                  </div>
                </Reveal>

                <Reveal delay={0.21}>
                  <div className="trust-editorial-item">
                    <div className="trust-editorial-header">
                      <span className="trust-mobile-point">03</span>
                      <h3 className="trust-editorial-title">{TRUST_EDITORIAL_POINTS[2].title}</h3>
                    </div>
                    <p className="trust-editorial-desc">{TRUST_EDITORIAL_POINTS[2].desc}</p>
                  </div>
                </Reveal>
              </div>

              {/* Center Spiral Track & Minimalist Point Nodes (الخط الحلزوني الرمادي ونقاط الترقيم) */}
              <div id="trust-spiral-track" className="trust-spiral-track" aria-hidden="true">
                <svg className="trust-spiral-svg" viewBox="0 0 90 560" fill="none" preserveAspectRatio="none">
                  {/* Soft ambient background curve */}
                  <path
                    d="M 45,0 C 68,0 85,15 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,510 45,520 45,560"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                  />

                  {/* Main sleek solid gray curve flowing through the points */}
                  <path
                    d="M 45,0 C 68,0 85,15 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,510 45,520 45,560"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="trust-spiral-main-strand"
                  />
                </svg>

                {/* Point Node 01 (loops toward Item 01 on right) */}
                <div className="trust-point-node trust-point-1" title="نقطة 1">
                  <span>01</span>
                </div>

                {/* Point Node 02 (loops toward Item 02 on left) */}
                <div className="trust-point-node trust-point-2" title="نقطة 2">
                  <span>02</span>
                </div>

                {/* Point Node 03 (loops toward Item 03 on right) */}
                <div className="trust-point-node trust-point-3" title="نقطة 3">
                  <span>03</span>
                </div>

                {/* Point Node 04 (loops toward Item 04 on left) */}
                <div className="trust-point-node trust-point-4" title="نقطة 4">
                  <span>04</span>
                </div>
              </div>

              {/* Left Column in RTL: Items 02 & 04 */}
              <div className="trust-editorial-col-left">
                <Reveal delay={0.14}>
                  <div className="trust-editorial-item">
                    <div className="trust-editorial-header">
                      <span className="trust-mobile-point">02</span>
                      <h3 className="trust-editorial-title">{TRUST_EDITORIAL_POINTS[1].title}</h3>
                    </div>
                    <p className="trust-editorial-desc">{TRUST_EDITORIAL_POINTS[1].desc}</p>
                  </div>
                </Reveal>

                <Reveal delay={0.28}>
                  <div className="trust-editorial-item">
                    <div className="trust-editorial-header">
                      <span className="trust-mobile-point">04</span>
                      <h3 className="trust-editorial-title">{TRUST_EDITORIAL_POINTS[3].title}</h3>
                    </div>
                    <p className="trust-editorial-desc">{TRUST_EDITORIAL_POINTS[3].desc}</p>
                  </div>
                </Reveal>
              </div>
            </div>


          </div>

          {/* =========================================================================
              Left Column: 3-Sack Product Trio Showcase with Dynamic Parallax
              ========================================================================= */}
          <div className="trust-visual-col">
            <div className="trust-stage">
              {/* Soft radial backdrop illumination */}
              <div className="trust-stage-backdrop" aria-hidden="true" />

              {/* Dynamic Ground Shadow */}
              <motion.div
                className="trust-ground-shadow"
                style={{ scale: shadowScale }}
                aria-hidden="true"
              />

              {/* Sack 1: Left Back - Cattle Feed (علف مواشي تسمين) */}
              <motion.div
                className="trust-layer-left"
                style={{
                  y: leftBagY,
                  rotate: leftBagRotate
                }}
              >
                <img
                  src="/aleman_parallax_assets/bag-02-cattle.webp"
                  alt="شيكارة علف مواشي الإيمان"
                  loading="lazy"
                  decoding="async"
                  className="trust-float-left"
                />
              </motion.div>

              {/* Sack 2: Right Back - Duck / Poultry Feed (علف بط الإيمان) */}
              <motion.div
                className="trust-layer-right"
                style={{
                  y: rightBagY,
                  rotate: rightBagRotate
                }}
              >
                <img
                  src="/aleman_parallax_assets/bag-01-ducks.webp"
                  alt="شيكارة علف بط الإيمان"
                  loading="lazy"
                  decoding="async"
                  className="trust-float-right"
                />
              </motion.div>

              {/* Sack 3: Center Hero Foreground - Broiler Poultry Feed (علف دواجن تسمين الإيمان) */}
              <motion.div
                className="trust-layer-center"
                style={{
                  x: '-50%',
                  y: centerBagY,
                  rotate: centerBagRotate
                }}
              >
                <img
                  src="/aleman_parallax_assets/bag-05-broiler.webp"
                  alt="شيكارة علف دواجن تسمين الإيمان"
                  loading="lazy"
                  decoding="async"
                  className="trust-float-center"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}