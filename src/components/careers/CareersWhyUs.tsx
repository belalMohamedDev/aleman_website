import { Reveal } from '../shared/Reveal';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import './careers-journey.css';

export function CareersWhyUs() {
  const { isRtl, t } = useLang();

  const advantages = [
    {
      id: 'stability',
      title: t(ui.recruitment.adv1Title),
      desc: t(ui.recruitment.adv1Desc),
    },
    {
      id: 'tech',
      title: t(ui.recruitment.adv2Title),
      desc: t(ui.recruitment.adv2Desc),
    },
    {
      id: 'culture',
      title: t(ui.recruitment.adv3Title),
      desc: t(ui.recruitment.adv3Desc),
    },
  ];

  return (
    <section className="careers-why-section" aria-labelledby="careers-why-title" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Ambient background glow */}
      <div className="careers-why-ambient-glow" aria-hidden="true" />

      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="careers-why-header">
          <Reveal>
            <h2 id="careers-why-title" className="careers-why-title">
              {t(ui.recruitment.whyUsHeading)}
            </h2>

            <p className="careers-why-desc">
              {t(ui.recruitment.whyUsSubtitle)}
            </p>
          </Reveal>
        </div>

        {/* Editorial Columns Layout - Open & Card-Free (Matching Image 3) */}
        <div className="careers-why-editorial-grid">
          {advantages.map((adv, idx) => (
            <Reveal key={adv.id} delay={idx * 0.12}>
              <div className="careers-why-editorial-col group">
                <h3 className="careers-why-editorial-title">
                  {adv.title}
                </h3>

                <p className="careers-why-editorial-desc">
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

