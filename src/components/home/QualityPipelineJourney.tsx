import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { qualitySteps } from '../../data/qualitySteps';
import { Reveal } from '../shared/Reveal';
import './quality-pipeline.css';

export function QualityPipelineJourney() {
  const { t, isRtl } = useLang();
  const journeyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-linked parallax across the 6 quality pipeline stages
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start end', 'end start']
  });

  const showcaseParallaxY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [20, -20]);
  const showcaseParallaxRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-1, 1]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.94]);

  // Steps mapped to odd (Right Column) and even (Left Column) in RTL
  const step01 = qualitySteps[0];
  const step02 = qualitySteps[1];
  const step03 = qualitySteps[2];
  const step04 = qualitySteps[3];
  const step05 = qualitySteps[4];
  const step06 = qualitySteps[5];

  return (
    <div ref={journeyRef} className="quality-spiral-section" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Ambient subtle glow */}
      <div className="quality-spiral-ambient-glow" aria-hidden="true" />

      {/* Main 2-Column Responsive Layout: Right: Visual Showcase | Left: 6-Step Spiral Pipeline */}
      <div className="quality-journey-grid">
        {/* Right Column in RTL: Quality Visual Stage (كادر صورة الجودة والمعمل الحديث) */}
        <div className="quality-visual-col">
          <Reveal delay={0.05}>
            <div className="quality-visual-stage">
              {/* Radiant Backlight Aura behind the 3D Shield */}
              <div className="quality-shield-aura" aria-hidden="true" />

              {/* Dynamic Floating Visual Wrapper with Scroll Parallax */}
              <motion.div
                className="quality-showcase-motion-wrap"
                style={{
                  y: showcaseParallaxY,
                  rotate: showcaseParallaxRotate
                }}
              >
                <img
                  src="/quality_lab_showcase.webp"
                  alt={t(ui.home.qualityLabImageAlt)}
                  loading="lazy"
                  decoding="async"
                  className="quality-visual-standalone-img"
                />
              </motion.div>

              {/* Dynamic Contact Ground Shadow for the 3D Pedestal */}
              <motion.div
                className="quality-pedestal-shadow"
                style={{ scale: shadowScale }}
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>

        {/* Left Column in RTL: 6-Step Alternating Pipeline Journey */}
        <div className="quality-pipeline-col">
          <div className="quality-spiral-split">
            {/* Right sub-column in RTL: Steps 01, 03, 05 */}
            <div className="quality-spiral-col-right">
              {/* Step 01 */}
              <Reveal delay={0.06} className="quality-step-1">
                <div className="quality-editorial-item">
                  <div className="quality-editorial-header">
                    <span className="quality-mobile-point">01</span>
                    <h3 className="quality-editorial-title">{t(step01.title)}</h3>
                  </div>
                  <p className="quality-editorial-desc">{t(step01.description)}</p>
                </div>
              </Reveal>

              {/* Step 03 */}
              <Reveal delay={0.18} className="quality-step-3">
                <div className="quality-editorial-item">
                  <div className="quality-editorial-header">
                    <span className="quality-mobile-point">03</span>
                    <h3 className="quality-editorial-title">{t(step03.title)}</h3>
                  </div>
                  <p className="quality-editorial-desc">{t(step03.description)}</p>
                </div>
              </Reveal>

              {/* Step 05 */}
              <Reveal delay={0.3} className="quality-step-5">
                <div className="quality-editorial-item">
                  <div className="quality-editorial-header">
                    <span className="quality-mobile-point">05</span>
                    <h3 className="quality-editorial-title">{t(step05.title)}</h3>
                  </div>
                  <p className="quality-editorial-desc">{t(step05.description)}</p>
                </div>
              </Reveal>
            </div>

            {/* Center Spiral Track & 6 Minimalist Point Nodes */}
            <div id="quality-spiral-track" className="quality-spiral-track" aria-hidden="true">
              <svg className="quality-spiral-svg" viewBox="0 0 90 850" fill="none" preserveAspectRatio="none">
                {/* Ambient Background Track Curve */}
                <path
                  d="M 45,0 C 45,18 80,18 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,515 72,565 80,615 C 88,665 18,715 10,760 C 2,805 25,850 45,850"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                />

                {/* Main Sleek Solid Gray Curve */}
                <path
                  d="M 45,0 C 45,18 80,18 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,515 72,565 80,615 C 88,665 18,715 10,760 C 2,805 25,850 45,850"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="quality-spiral-main-strand"
                />
              </svg>

              {/* 6 Point Nodes (Alternating Right & Left) */}
              <div className="quality-point-node quality-point-1" title="مرحلة 01">
                <span>01</span>
              </div>

              <div className="quality-point-node quality-point-2" title="مرحلة 02">
                <span>02</span>
              </div>

              <div className="quality-point-node quality-point-3" title="مرحلة 03">
                <span>03</span>
              </div>

              <div className="quality-point-node quality-point-4" title="مرحلة 04">
                <span>04</span>
              </div>

              <div className="quality-point-node quality-point-5" title="مرحلة 05">
                <span>05</span>
              </div>

              <div className="quality-point-node quality-point-6" title="مرحلة 06">
                <span>06</span>
              </div>
            </div>

            {/* Left Column in RTL: Steps 02, 04, 06 (Staggered to match nodes) */}
            <div className="quality-spiral-col-left">
              {/* Step 02 */}
              <Reveal delay={0.12} className="quality-step-2">
                <div className="quality-editorial-item">
                  <div className="quality-editorial-header">
                    <span className="quality-mobile-point">02</span>
                    <h3 className="quality-editorial-title">{t(step02.title)}</h3>
                  </div>
                  <p className="quality-editorial-desc">{t(step02.description)}</p>
                </div>
              </Reveal>

              {/* Step 04 */}
              <Reveal delay={0.24} className="quality-step-4">
                <div className="quality-editorial-item">
                  <div className="quality-editorial-header">
                    <span className="quality-mobile-point">04</span>
                    <h3 className="quality-editorial-title">{t(step04.title)}</h3>
                  </div>
                  <p className="quality-editorial-desc">{t(step04.description)}</p>
                </div>
              </Reveal>

              {/* Step 06 */}
              <Reveal delay={0.36} className="quality-step-6">
                <div className="quality-editorial-item">
                  <div className="quality-editorial-header">
                    <span className="quality-mobile-point">06</span>
                    <h3 className="quality-editorial-title">{t(step06.title)}</h3>
                  </div>
                  <p className="quality-editorial-desc">{t(step06.description)}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
