import { Reveal } from '../shared/Reveal';
import './about-journey.css';

const ADVANTAGES = [
  {
    id: 'quality',
    title: 'أعلى مستوى من الفحص ومراقبة الجودة',
    desc: 'تخضع جميع المواد الخام والمنتجات النهائية لفحوصات معملية دقيقة بأحدث التقنيات لضمان خلوها من السموم الفطرية ومطابقتها للمواصفات القياسية.',
  },
  {
    id: 'fcr',
    title: 'أعلى معدل تحويل غذائي مدروس',
    desc: 'تركيبات علفية متوازنة أعدها كبار خبراء التغذية في مصر لتوفير أقصى إنتاجية للمربي، وأفضل نمو للقطيع بأقل استهلاك ممكن.',
  },
  {
    id: 'capacity',
    title: 'طاقات إنتاجية ضخمة وشحن فوري بالأطنان',
    desc: 'من خلال مجمعاتنا الصناعية الثلاثة، نلبي كافة احتياجات السوق المحلي وكبرى مزارع التسمين والبياض بشحن مباشر لكافة المحافظات.',
  },
];

export function AboutWhyUs() {
  return (
    <section className="about-why-section" aria-labelledby="about-why-title" dir="rtl">
      {/* Ambient background glow */}
      <div className="about-why-ambient-glow" aria-hidden="true" />

      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="about-why-header">
          <Reveal>
            <h2 id="about-why-title" className="about-why-title">
              لماذا تختار أعلاف الإيمان؟
            </h2>

            <p className="about-why-desc">
              معايير قياسية ومزايا متكاملة تجعلنا شريك النجاح الأفضل لمزرعتك
            </p>
          </Reveal>
        </div>

        {/* Editorial Columns Layout - Open & Clean */}
        <div className="about-why-editorial-grid">
          {ADVANTAGES.map((adv, idx) => (
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
