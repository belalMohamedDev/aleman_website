import { Reveal } from '../shared/Reveal';
import { useLang } from '../../i18n/LanguageContext';
import './careers-journey.css';

const STEPS = [
  {
    number: '01',
    title: 'التقديم الإلكتروني',
    desc: 'اختر الوظيفة المناسبة واملأ استمارة التقديم بدقة مع إرفاق السيرة الذاتية المحدثة بصيغة PDF.',
  },
  {
    number: '02',
    title: 'الفرز والتقييم الفني',
    desc: 'يقوم فريق الموارد البشرية واللجنة الفنية بمراجعة المؤهلات والخبرات ومطابقتها للمتطلبات الوظيفية.',
  },
  {
    number: '03',
    title: 'المقابلة الشخصية',
    desc: 'التواصل مع المرشحين المؤهلين لإجراء المقابلات الفنية والشخصية واختبارات الجدارات المعملية والميدانية.',
  },
  {
    number: '04',
    title: 'العرض وبدء الرحلة',
    desc: 'تقديم العرض الوظيفي الرسمي، واستكمال مسوغات التعيين، والبدء في برنامج التهيئة والانضمام لأسرة الإيمان.',
  },
];

export function CareersProcess() {
  const { lang } = useLang();

  return (
    <section className="careers-process-section" aria-labelledby="careers-process-title" dir="rtl">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="careers-process-header">
          <Reveal>


            <h2 id="careers-process-title" className="careers-process-title">
              {lang === 'ar' ? 'مراحل الانضمام إلى فريقنا' : 'Our Hiring Journey'}
            </h2>

            <p className="careers-process-desc">
              {lang === 'ar'
                ? 'خطوات واضحة ومنظمة تضمن تقييم كل كفاءة بكل نزاهة واحترافية'
                : 'Structured milestones ensuring fair and professional evaluation'}
            </p>
          </Reveal>
        </div>

        {/* Winding Pipeline Container (Matching Image 4) */}
        <div className="careers-pipeline-container">
          {/* Mobile View: Vertical Clean Connected Line */}
          <div className="sm:hidden careers-pipeline-mobile-list">
            {STEPS.map((step, idx) => (
              <Reveal key={step.number} delay={idx * 0.1}>
                <div className="careers-pipeline-mobile-item">
                  <div className="careers-pipeline-mobile-node">
                    {step.number}
                  </div>
                  <h3 className="careers-editorial-title">
                    {step.title}
                  </h3>
                  <p className="careers-editorial-desc">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Desktop View: Curved Winding Track Matching AboutValuesMap */}
          <div className="hidden sm:grid careers-pipeline-desktop">
            {/* Right Column: Steps 01 & 03 */}
            <div className="careers-col-right">
              {/* Step 01 */}
              <Reveal delay={0.06} className="careers-step-1">
                <div className="careers-editorial-item">
                  <h3 className="careers-editorial-title">{STEPS[0].title}</h3>
                  <p className="careers-editorial-desc">{STEPS[0].desc}</p>
                </div>
              </Reveal>

              {/* Step 03 */}
              <Reveal delay={0.2} className="careers-step-3">
                <div className="careers-editorial-item">
                  <h3 className="careers-editorial-title">{STEPS[2].title}</h3>
                  <p className="careers-editorial-desc">{STEPS[2].desc}</p>
                </div>
              </Reveal>
            </div>

            {/* Center Spiral Track & Numbered Points */}
            <div className="careers-track" aria-hidden="true">
              <svg
                className="careers-track-svg"
                viewBox="0 0 90 600"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* Ambient Soft Guide Curve */}
                <path
                  d="M 45,0 C 68,0 85,20 80,45 C 75,100 18,140 10,195 C 2,250 72,300 80,350 C 88,400 18,450 10,495 C 2,545 72,580 45,600"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                />

                {/* Main solid curve passing through points */}
                <path
                  d="M 45,0 C 68,0 85,20 80,45 C 75,100 18,140 10,195 C 2,250 72,300 80,350 C 88,400 18,450 10,495 C 2,545 72,580 45,600"
                  stroke="#94a3b8"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Point Node 01 */}
              <div className="careers-point-node careers-point-1">01</div>

              {/* Point Node 02 */}
              <div className="careers-point-node careers-point-2">02</div>

              {/* Point Node 03 */}
              <div className="careers-point-node careers-point-3">03</div>

              {/* Point Node 04 */}
              <div className="careers-point-node careers-point-4">04</div>
            </div>

            {/* Left Column: Steps 02 & 04 */}
            <div className="careers-col-left">
              {/* Step 02 */}
              <Reveal delay={0.12} className="careers-step-2">
                <div className="careers-editorial-item">
                  <h3 className="careers-editorial-title">{STEPS[1].title}</h3>
                  <p className="careers-editorial-desc">{STEPS[1].desc}</p>
                </div>
              </Reveal>

              {/* Step 04 */}
              <Reveal delay={0.28} className="careers-step-4">
                <div className="careers-editorial-item">
                  <h3 className="careers-editorial-title">{STEPS[3].title}</h3>
                  <p className="careers-editorial-desc">{STEPS[3].desc}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
