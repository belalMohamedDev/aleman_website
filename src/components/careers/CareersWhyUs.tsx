import { Reveal } from '../shared/Reveal';
import { useLang } from '../../i18n/LanguageContext';
import './careers-journey.css';

const ADVANTAGES = [
  {
    id: 'stability',
    title: 'صرح صناعي رائد ومستقر',
    desc: 'العمل ضمن كيان صناعي عريق يضم مجمعات إنتاجية عملاقة وخبرة تتجاوز 33 عاماً في قيادة وتطوير صناعة الأعلاف بمصر.',
  },
  {
    id: 'tech',
    title: 'أحدث التقنيات والمعامل المتطورة',
    desc: 'تجهيزات أوروبية وسويسرية متقدمة ومعامل مراقبة جودة معتمدة تمنحك خبرة تطبيقية دقيقة بمعايير دولية (ISO).',
  },
  {
    id: 'culture',
    title: 'بيئة عمل آمنة ومزايا وظيفية عادلة',
    desc: 'التزام مطلق باشتراطات السلامة والصحة المهنية، مع توفير منظومة أجور وتأمين صحي واجتماعي ومكافآت تقديرية للمتميزين.',
  },
];

export function CareersWhyUs() {
  const { lang } = useLang();

  return (
    <section className="careers-why-section" aria-labelledby="careers-why-title" dir="rtl">
      {/* Ambient background glow */}
      <div className="careers-why-ambient-glow" aria-hidden="true" />

      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="careers-why-header">
          <Reveal>


            <h2 id="careers-why-title" className="careers-why-title">
              {lang === 'ar' ? 'لماذا تبدأ مسيرتك المهنية في الإيمان؟' : 'Why Build Your Career at Al-Eman?'}
            </h2>

            <p className="careers-why-desc">
              {lang === 'ar'
                ? 'نوفر لك بيئة مثالية تجمع بين الخبرة الصناعية العميقة وفرص التطور والتميز المستمر'
                : 'We provide an ideal environment combining deep industrial expertise with continuous growth'}
            </p>
          </Reveal>
        </div>

        {/* Editorial Columns Layout - Open & Card-Free (Matching Image 3) */}
        <div className="careers-why-editorial-grid">
          {ADVANTAGES.map((adv, idx) => (
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
