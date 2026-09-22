import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Reveal } from '../shared/Reveal';
import './about-journey.css';

export function AboutValuesMap() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isRtl, t } = useLang();

  const coreValues = [
    {
      number: '01',
      title: t(ui.about.values.v1Title),
      desc: t(ui.about.values.v1Desc),
    },
    {
      number: '02',
      title: t(ui.about.values.v2Title),
      desc: t(ui.about.values.v2Desc),
    },
    {
      number: '03',
      title: t(ui.about.values.v3Title),
      desc: t(ui.about.values.v3Desc),
    },
    {
      number: '04',
      title: t(ui.about.values.v4Title),
      desc: t(ui.about.values.v4Desc),
    },
    {
      number: '05',
      title: t(ui.about.values.v5Title),
      desc: t(ui.about.values.v5Desc),
    },
    {
      number: '06',
      title: t(ui.about.values.v6Title),
      desc: t(ui.about.values.v6Desc),
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const emblemY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [20, -20]);
  const emblemRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-1, 1]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.94]);

  return (
    <section ref={containerRef} className="about-values-section" aria-labelledby="about-values-title" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div id="about-values-heading" className="about-values-header">
          <Reveal>
            <h2 id="about-values-title" className="about-values-title">
              {t(ui.about.values.heading)}
            </h2>

            <p className="about-values-desc">
              {t(ui.about.values.lead)}
            </p>
          </Reveal>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="about-values-grid">
          {/* Right Column in RTL: Sticky 3D Brand Emblem Showcase */}
          <div className="about-values-visual-col">
            <Reveal delay={0.06}>
              <div className="about-values-visual-stage">
                {/* Radiant Glow */}
                <div className="about-values-emblem-aura" aria-hidden="true" />

                {/* Floating Brand Logo Emblem */}
                <motion.div
                  style={{
                    y: emblemY,
                    rotate: emblemRotate
                  }}
                  className="relative z-10"
                >
                  <img
                    src="/image.webp"
                    alt={t(ui.brand.name)}
                    loading="lazy"
                    decoding="async"
                    className="about-values-emblem-img"
                  />
                </motion.div>

                {/* Dynamic Contact Ground Shadow */}
                <motion.div
                  className="about-values-pedestal-shadow"
                  style={{ scale: shadowScale }}
                  aria-hidden="true"
                />
              </div>
            </Reveal>
          </div>

          {/* Left Column in RTL: 6-Step Alternating Values Pipeline */}
          <div className="about-values-pipeline-col">
            <div className="about-values-spiral-split">
              {/* Right Column in RTL: Odd Steps 01, 03, 05 */}
              <div className="about-values-col-right">
                {/* Step 01 */}
                <Reveal delay={0.06} className="about-val-step-1">
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-values-mobile-point">01</span>
                      <h3 className="about-editorial-title">{coreValues[0].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{coreValues[0].desc}</p>
                  </div>
                </Reveal>

                {/* Step 03 */}
                <Reveal delay={0.18} className="about-val-step-3">
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-values-mobile-point">03</span>
                      <h3 className="about-editorial-title">{coreValues[2].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{coreValues[2].desc}</p>
                  </div>
                </Reveal>

                {/* Step 05 */}
                <Reveal delay={0.30} className="about-val-step-5">
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-values-mobile-point">05</span>
                      <h3 className="about-editorial-title">{coreValues[4].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{coreValues[4].desc}</p>
                  </div>
                </Reveal>
              </div>

              {/* Center Spiral Track & Numbered Points */}
              <div id="about-values-track" className="about-values-track" aria-hidden="true">
                <svg className="about-values-svg" viewBox="0 0 90 870" fill="none" preserveAspectRatio="none">
                  {/* Ambient Soft Guide Curve */}
                  <path
                    d="M 45,0 C 68,0 85,15 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,515 72,565 80,615 C 88,665 18,715 10,760 C 2,805 72,845 45,870"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                  />

                  {/* Main solid curve passing through all 6 points */}
                  <path
                    d="M 45,0 C 68,0 85,15 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,515 72,565 80,615 C 88,665 18,715 10,760 C 2,805 72,845 45,870"
                    stroke="#94a3b8"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    className="about-values-main-strand"
                  />
                </svg>

                {/* Point Node 01 */}
                <div className="about-values-point-node about-val-point-1" title="نقطة 1">
                  01
                </div>

                {/* Point Node 02 */}
                <div className="about-values-point-node about-val-point-2" title="نقطة 2">
                  02
                </div>

                {/* Point Node 03 */}
                <div className="about-values-point-node about-val-point-3" title="نقطة 3">
                  03
                </div>

                {/* Point Node 04 */}
                <div className="about-values-point-node about-val-point-4" title="نقطة 4">
                  04
                </div>

                {/* Point Node 05 */}
                <div className="about-values-point-node about-val-point-5" title="نقطة 5">
                  05
                </div>

                {/* Point Node 06 */}
                <div className="about-values-point-node about-val-point-6" title="نقطة 6">
                  06
                </div>
              </div>

              {/* Left Column in RTL: Even Steps 02, 04, 06 */}
              <div className="about-values-col-left">
                {/* Step 02 */}
                <Reveal delay={0.12} className="about-val-step-2">
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-values-mobile-point">02</span>
                      <h3 className="about-editorial-title">{coreValues[1].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{coreValues[1].desc}</p>
                  </div>
                </Reveal>

                {/* Step 04 */}
                <Reveal delay={0.24} className="about-val-step-4">
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-values-mobile-point">04</span>
                      <h3 className="about-editorial-title">{coreValues[3].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{coreValues[3].desc}</p>
                  </div>
                </Reveal>

                {/* Step 06 */}
                <Reveal delay={0.36} className="about-val-step-6">
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-values-mobile-point">06</span>
                      <h3 className="about-editorial-title">{coreValues[5].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{coreValues[5].desc}</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
