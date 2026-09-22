import { Reveal } from '../shared/Reveal';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import './about-journey.css';

export function AboutWhyUs() {
  const { isRtl, t } = useLang();

  const advantages = [
    {
      id: 'quality',
      title: t(ui.about.whyUs.qualityTitle),
      desc: t(ui.about.whyUs.qualityDesc),
    },
    {
      id: 'fcr',
      title: t(ui.about.whyUs.fcrTitle),
      desc: t(ui.about.whyUs.fcrDesc),
    },
    {
      id: 'capacity',
      title: t(ui.about.whyUs.capacityTitle),
      desc: t(ui.about.whyUs.capacityDesc),
    },
  ];

  return (
    <section className="about-why-section" aria-labelledby="about-why-title" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Ambient background glow */}
      <div className="about-why-ambient-glow" aria-hidden="true" />

      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="about-why-header">
          <Reveal>
            <h2 id="about-why-title" className="about-why-title">
              {t(ui.about.whyUs.heading)}
            </h2>

            <p className="about-why-desc">
              {t(ui.about.whyUs.lead)}
            </p>
          </Reveal>
        </div>

        {/* Editorial Columns Layout - Open & Clean */}
        <div className="about-why-editorial-grid">
          {advantages.map((adv, idx) => (
            <Reveal key={adv.id} delay={idx * 0.12}>
              <div className="about-why-editorial-col group">
                <h3 className="about-why-editorial-title">
                  {adv.title}
                </h3>

                <p className="about-why-editorial-desc">
                  {adv.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
