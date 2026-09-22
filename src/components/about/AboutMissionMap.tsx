import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Reveal } from '../shared/Reveal';
import './about-journey.css';

export function AboutMissionMap() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isRtl, t } = useLang();

  const missionPillars = [
    {
      number: '01',
      title: t(ui.about.mission.p1Title),
      desc: t(ui.about.mission.p1Desc),
    },
    {
      number: '02',
      title: t(ui.about.mission.p2Title),
      desc: t(ui.about.mission.p2Desc),
    },
    {
      number: '03',
      title: t(ui.about.mission.p3Title),
      desc: t(ui.about.mission.p3Desc),
    },
    {
      number: '04',
      title: t(ui.about.mission.p4Title),
      desc: t(ui.about.mission.p4Desc),
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const mascotY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [25, -25]);
  const mascotRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-1.5, 1.5]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.06, 0.92]);

  return (
    <section ref={containerRef} className="about-mission-section" aria-labelledby="about-mission-title" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <div className="about-mission-grid">
          {/* Right Column in RTL: Mission Editorial & Spiral Track */}
          <div className="about-mission-text-col">
            <Reveal>
              <h2 id="about-mission-title" className="about-mission-title">
                {t(ui.about.mission.heading)}
              </h2>

              <p className="about-mission-lead">
                {t(ui.about.mission.lead)}
              </p>
            </Reveal>

            {/* Alternating Split Track */}
            <div className="about-mission-split">
              {/* Right Column in RTL: Pillars 01 & 03 */}
              <div className="about-mission-col-right">
                <Reveal delay={0.06}>
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-mobile-point">01</span>
                      <h3 className="about-editorial-title">{missionPillars[0].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{missionPillars[0].desc}</p>
                  </div>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-mobile-point">03</span>
                      <h3 className="about-editorial-title">{missionPillars[2].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{missionPillars[2].desc}</p>
                  </div>
                </Reveal>
              </div>

              {/* Center Spiral Track & Numbered Points */}
              <div id="about-mission-track" className="about-mission-track" aria-hidden="true">
                <svg className="about-mission-svg" viewBox="0 0 90 560" fill="none" preserveAspectRatio="none">
                  {/* Soft ambient background curve */}
                  <path
                    d="M 45,0 C 68,0 85,15 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,510 45,520 45,560"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                  />

                  {/* Main solid gray curve flowing through the points */}
                  <path
                    d="M 45,0 C 68,0 85,15 82,40 C 78,95 18,135 10,180 C 2,225 72,275 80,325 C 88,375 18,425 10,470 C 2,510 45,520 45,560"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="about-mission-main-strand"
                  />
                </svg>

                {/* Point Node 01 */}
                <div className="about-mission-point-node about-point-1" title="01">
                  01
                </div>

                {/* Point Node 02 */}
                <div className="about-mission-point-node about-point-2" title="02">
                  02
                </div>

                {/* Point Node 03 */}
                <div className="about-mission-point-node about-point-3" title="03">
                  03
                </div>

                {/* Point Node 04 */}
                <div className="about-mission-point-node about-point-4" title="04">
                  04
                </div>
              </div>

              {/* Left Column in RTL: Pillars 02 & 04 */}
              <div className="about-mission-col-left">
                <Reveal delay={0.12}>
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-mobile-point">02</span>
                      <h3 className="about-editorial-title">{missionPillars[1].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{missionPillars[1].desc}</p>
                  </div>
                </Reveal>

                <Reveal delay={0.24}>
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-mobile-point">04</span>
                      <h3 className="about-editorial-title">{missionPillars[3].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{missionPillars[3].desc}</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Left Column in RTL: Chicken Archer Mascot Stage */}
          <div className="about-mission-visual-col">
            <Reveal delay={0.08}>
              <div className="about-mascot-stage">
                {/* Glowing Aura Ring */}
                <div className="about-mascot-aura" aria-hidden="true" />

                {/* Animated Floating Chicken Mascot */}
                <motion.div
                  className="about-mascot-img-wrap"
                  style={{
                    y: mascotY,
                    rotate: mascotRotate
                  }}
                >
                  <img
                    src="/chicken_archer.webp"
                    alt="رمز مناعة وقوة أعلاف الإيمان"
                    loading="lazy"
                    decoding="async"
                    className="about-mascot-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero_farm_bg.webp';
                    }}
                  />
                </motion.div>

                {/* Dynamic Contact Ground Shadow */}
                <motion.div
                  className="about-mascot-shadow"
                  style={{ scale: shadowScale }}
                  aria-hidden="true"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
