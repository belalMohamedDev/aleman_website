import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { TargetIcon } from 'lucide-react';
import { Reveal } from '../shared/Reveal';
import './about-journey.css';

const MISSION_PILLARS = [
  {
    number: '01',
    title: 'مناعة وحصانة فائقة للقطيع',
    desc: 'درع حصين يمنح القطيع مناعة قوية طوال دورة التربية ضد الأمراض، ويضمن نمواً متوازناً وصحياً.'
  },
  {
    number: '02',
    title: 'أعلى معامل تحويل غذائي',
    desc: 'تركيبات علمية متطورة تحقق أسرع معدلات نمو بأقل معامل استهلاك للعلف وأعلى عائد ربحي للمربي.'
  },
  {
    number: '03',
    title: 'تركيبات نباتية نقية 100%',
    desc: 'أعلاف نقية مدعمة بأفضل الفيتامينات والمعادن ومضادات السموم الطبيعية لحماية استثمارك ومزرعتك.'
  },
  {
    number: '04',
    title: 'إشراف علمي ومعايير دولية',
    desc: 'نخبة من كبار الخبراء والاستشاريين تطبق أحدث معايير الجودة الدولية في كل طن يخرج من مصانعنا الثلاثة.'
  }
];

export function AboutMissionMap() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const mascotY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [25, -25]);
  const mascotRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-1.5, 1.5]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.06, 0.92]);

  return (
    <section ref={containerRef} className="about-mission-section" aria-labelledby="about-mission-title" dir="rtl">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <div className="about-mission-grid">
          {/* Right Column in RTL: Mission Editorial & Spiral Track */}
          <div className="about-mission-text-col">
            <Reveal>


              <h2 id="about-mission-title" className="about-mission-title">
                مهمتنا وهدفنا الأسمى    قوة ومناعة تحمي قطيعك.. وأعلى معدل تحويل غذائي
              </h2>

              <p className="about-mission-lead">
                نوفر أعلافاً استثنائية عالية الجودة لجميع مزارع الدواجن والمواشي في جمهورية مصر العربية، معتمدة على أعلى المعايير التغذوية لضمان حماية القطيع وتحقيق أقصى ربحية.
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
                      <h3 className="about-editorial-title">{MISSION_PILLARS[0].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{MISSION_PILLARS[0].desc}</p>
                  </div>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-mobile-point">03</span>
                      <h3 className="about-editorial-title">{MISSION_PILLARS[2].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{MISSION_PILLARS[2].desc}</p>
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
                <div className="about-mission-point-node about-point-1" title="نقطة 1">
                  01
                </div>

                {/* Point Node 02 */}
                <div className="about-mission-point-node about-point-2" title="نقطة 2">
                  02
                </div>

                {/* Point Node 03 */}
                <div className="about-mission-point-node about-point-3" title="نقطة 3">
                  03
                </div>

                {/* Point Node 04 */}
                <div className="about-mission-point-node about-point-4" title="نقطة 4">
                  04
                </div>
              </div>

              {/* Left Column in RTL: Pillars 02 & 04 */}
              <div className="about-mission-col-left">
                <Reveal delay={0.12}>
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-mobile-point">02</span>
                      <h3 className="about-editorial-title">{MISSION_PILLARS[1].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{MISSION_PILLARS[1].desc}</p>
                  </div>
                </Reveal>

                <Reveal delay={0.24}>
                  <div className="about-editorial-item">
                    <div className="about-editorial-header">
                      <span className="about-mobile-point">04</span>
                      <h3 className="about-editorial-title">{MISSION_PILLARS[3].title}</h3>
                    </div>
                    <p className="about-editorial-desc">{MISSION_PILLARS[3].desc}</p>
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
