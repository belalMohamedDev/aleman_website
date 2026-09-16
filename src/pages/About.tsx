import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2Icon,
  UsersIcon,
  FactoryIcon,
  ClockIcon,
  ShieldCheckIcon,
  HeartHandshakeIcon,
  ScaleIcon,
  SparklesIcon,
  AwardIcon,
  CheckCircle2Icon,
  QuoteIcon,
  TargetIcon,
  CompassIcon,
  LayersIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  FlaskConicalIcon,
  TruckIcon,
  PhoneCallIcon,
  MicroscopeIcon,
  ZapIcon,
  EyeIcon,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export function About() {
  const { dir } = useLang();
  const Back = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;

  const stats = [
    {
      value: '33+',
      label: 'سنة من الخبرة والريادة',
      subtext: 'تأسست عام 1990',
      icon: ClockIcon,
    },
    {
      value: '3',
      label: 'مجمعات صناعية عملاقة',
      subtext: 'طاقة إنتاجية وفورية ضخمة',
      icon: FactoryIcon,
    },
    {
      value: '3200+',
      label: 'مهندس وفني واستشاري',
      subtext: 'كوادر علمية بأعلى المستويات',
      icon: UsersIcon,
    },
    {
      value: '1000+',
      label: 'طن طاقة إنتاجية يومياً',
      subtext: 'تغطي كبرى مزارع الجمهورية',
      icon: Building2Icon,
    },
  ];

  const gallery = [
    {
      title: 'معامل الفحص ومراقبة الجودة المتطورة',
      subtitle: 'فحص فوري وتحليل كيميائي لكافة الخامات قبل دخول التصنيع',
      image: '/e89e15e1-9e1a-4084-9beb-18bbd3298ea5.jpg',
      badge: 'رقابة معملية صارمة (ISO)',
      tagColor: 'bg-emerald-600',
    },
    {
      title: 'خطوط الإنتاج المؤتمتة والتحبيب بالبخار',
      subtitle: 'أحدث التجهيزات الصناعية السويسرية لإنتاج أعلاف محببة بأعلى نقاء',
      image: '/3e951125-4919-4762-a40a-229dd36ecc10.jpg',
      badge: 'أعلى تكنولوجيا تصنيع',
      tagColor: 'bg-brand-600',
    },
    {
      title: 'أجود المواد الخام النباتية الطبيعية',
      subtitle: 'ذرة صفراء وكسب صويا نقي 100% مدعمة بالفيتامينات والمعادن',
      image: '/cfe458d9-a06e-424e-9089-dbe2d0612755.jpg',
      badge: 'خامات نباتية نقية 100%',
      tagColor: 'bg-amber-600',
    },
    {
      title: 'أعلى معدلات نمو وأوزان قياسية في المزارع',
      subtitle: 'نتائج حقلية موثقة في مزارع التسمين والبياض بمختلف المحافظات',
      image: '/dd2a3da5-18fc-4b1f-8baf-a9936255e9be.jpg',
      badge: 'أعلى معدل تحويل غذائي',
      tagColor: 'bg-blue-600',
    },
  ];

  const values = [
    {
      title: 'الالتزام',
      desc: 'نستهدف التميز في كل التفاصيل من خلال جميع عملياتنا، وملتزمون بالحفاظ على هذا التميز الصارم في كل مرحلة إنتاجية.',
      icon: AwardIcon,
    },
    {
      title: 'النزاهة',
      desc: 'نحترم التزاماتنا ونحافظ على وعودنا، ونتعامل بأمانة وشفافية مطلقة في كافة المواقف مع جميع شركائنا وعملائنا.',
      icon: ShieldCheckIcon,
    },
    {
      title: 'المسؤولية',
      desc: 'مستعدون دائماً لتحمل مسؤولياتنا الكاملة تجاه رضا عملائنا الكرام جنباً إلى جنب مع مسؤوليتنا المجتمعية والبيئية.',
      icon: HeartHandshakeIcon,
    },
    {
      title: 'التنوع والانفتاح',
      desc: 'نقدر الاختلافات الإيجابية ونتبنى أحدث المعارف والابتكارات التغذوية العالمية لتحقيق أفضل الفوائد لعملائنا.',
      icon: LayersIcon,
    },
    {
      title: 'الاحترام المتبادل',
      desc: 'نحترم موظفينا، موردينا، وشركاء نجاحنا، ونبني علاقات عمل راسخة ومستدامة قائمة على التقدير المتبادل.',
      icon: UsersIcon,
    },
    {
      title: 'الاحترافية',
      desc: 'تطبيق أعلى درجات الاحترافية في إدارة سلاسل التوريد والإنتاج التي تنعكس في جودة كل شكارة علف ننتجها.',
      icon: BriefcaseIcon,
    },
  ];

  const advantages = [
    {
      num: '01',
      title: 'أعلى مستوى من الفحص ومراقبة الجودة',
      desc: 'تخضع جميع المواد الخام والمنتجات النهائية لفحوصات معملية دقيقة بأحدث التقنيات لضمان خلوها من السموم الفطرية ومطابقتها للمواصفات القياسية.',
      icon: FlaskConicalIcon,
    },
    {
      num: '02',
      title: 'أعلى معدل تحويل غذائي مدروس',
      desc: 'تركيبات علفية متوازنة أعدها كبار خبراء التغذية في مصر لتوفير أقصى إنتاجية للمربي، وأفضل نمو للقطيع بأقل استهلاك ممكن.',
      icon: ScaleIcon,
    },
    {
      num: '03',
      title: 'طاقات إنتاجية ضخمة وشحن فوري بالأطنان',
      desc: 'من خلال مجمعاتنا الصناعية الثلاثة، نلبي كافة احتياجات السوق المحلي وكبرى مزارع التسمين والبياض بشحن مباشر لكافة المحافظات.',
      icon: TruckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-canvas pb-24 overflow-x-hidden">
      {/* Hero Header Section with Factory Background & Dynamic Glow */}
      <section className="relative overflow-hidden bg-[#031b10] text-white pt-28 pb-24 sm:pt-36 sm:pb-28 md:pt-40 md:pb-36">
        {/* Background Image of Factory with High Visibility & Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_farm_bg.png"
            alt="صروح ومصانع مؤسسة الإيمان للأعلاف"
            className="h-full w-full object-cover object-[center_right] lg:object-center opacity-90 filter brightness-105 contrast-105 scale-100 transition-transform duration-1000"
          />
          {/* Top Vignette behind Transparent Navbar */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/75 via-[#02180d]/40 to-transparent pointer-events-none" />

          {/* Bottom Blend to Stats Section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#031b10] via-[#031b10]/80 to-transparent pointer-events-none" />

          {/* Directional Mask for Text Side (RTL & LTR) */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#02180d]/90 via-[#02180d]/65 via-45% to-transparent hidden rtl:block pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02180d]/90 via-[#02180d]/65 via-45% to-transparent hidden ltr:block pointer-events-none" />

          {/* Mobile Tint for Small Screens */}
          <div className="absolute inset-0 bg-[#02180d]/45 md:hidden pointer-events-none" />
        </div>

        {/* Ambient Animated Glows */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 right-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
          {/* Breadcrumb */}


          <div className="max-w-3xl">
            {/* Animated Floating Eyebrow Badge */}


            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-white mb-6 tracking-tight drop-shadow-md"
            >
              أكثر من ثلاثة عقود في صدارة صناعة الأعلاف في مصر
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-emerald-100/95 leading-relaxed font-medium mb-8 max-w-2xl drop-shadow"
            >
              بدأت رحلتنا عام 1990 بشغف عميق والتزام مطلق بأعلى معايير الجودة الشاملة، لنبني صروحاً صناعية تمد المربي المصري بأجود الأعلاف المتطورة لضمان أعلى إنتاجية وأفضل ربح.
            </motion.p>

            {/* Quick Hero CTA Buttons */}

          </div>
        </div>
      </section>

      {/* Facts & Figures Bar (حقائق وأرقام مع أنيميشن وتأثيرات بصرية) */}
      <section className="relative -mt-12 mx-auto max-w-[1400px] px-4 md:px-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white border border-slate-200/90 p-6 md:p-8 shadow-lift grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 hover:bg-brand-50/50 hover:-translate-y-1"
              >
                <div className="h-14 w-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-3 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-700 tracking-tight transition-colors group-hover:text-brand-800">
                  {item.value}
                </span>
                <span className="text-sm sm:text-base font-black text-ink mt-1.5">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-slate-400 mt-0.5">
                  {item.subtext}
                </span>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Visual Facility Showcase Gallery (معرض صور الصروح الصناعية والمعامل) */}


      {/* Company History & Journey (تاريخ شركة الإيمان مع صورة المجمع عند الغروب) */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-24 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >


            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink leading-snug">
              تاريخ شركة الإيمان للأعلاف
            </h2>

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              <p>
                تأسست شركة الإيمان عام <strong className="text-brand-700 font-black">1990</strong>، بشغف كبير وشعور شديد بالمسؤولية تجاه الجودة الشاملة لتأسيس قواعد الثقة الراسخة مع العملاء ودعم وتنمية أصحاب المصلحة في السوق المصري.
              </p>
              <p>
                لأكثر من <strong className="text-ink font-black">30 عاماً</strong> من الإشادة بقيم الصدق والنزاهة والعمل الدؤوب، نجحت شركة الإيمان في تلبية احتياجات السوق المصري، بقدرة إنتاجية كبيرة وفورية بمصانع الأعلاف الثلاثة، والتي وضعت مجموعة شركات الإيمان كواحدة من أكبر قلاع تصنيع الأعلاف الموثوقة في جمهورية مصر العربية.
              </p>
              <p>
                نعتمد على نخبة من أمهر الخبراء والمهندسين وأحدث خطوط الإنتاج المؤتمتة بالكامل لضمان التوافق مع أعلى معايير الجودة العالمية ومعدلات التحويل القياسية.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <CheckCircle2Icon className="h-5 w-5 text-brand-600 flex-shrink-0" />
                <span className="text-xs font-black text-slate-700">تأسست عام 1990 بخبرة 33+ عاماً</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <CheckCircle2Icon className="h-5 w-5 text-brand-600 flex-shrink-0" />
                <span className="text-xs font-black text-slate-700">3 مصانع كبرى ومجمعات إنتاجية</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <CheckCircle2Icon className="h-5 w-5 text-brand-600 flex-shrink-0" />
                <span className="text-xs font-black text-slate-700">معامل فحص متطورة لمراقبة السموم</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <CheckCircle2Icon className="h-5 w-5 text-brand-600 flex-shrink-0" />
                <span className="text-xs font-black text-slate-700">أسطول شحن وتوزيع لكافة المحافظات</span>
              </div>
            </div>
          </motion.div>

          {/* Logo Only: Pure Animated Floating Brand Logo */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            {/* Soft Ambient Glow behind logo */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-72 w-72 sm:h-84 sm:w-84 rounded-full bg-gradient-to-tr from-brand-500/20 via-emerald-400/15 to-amber-400/15 blur-3xl pointer-events-none"
            />

            {/* Floating Brand Logo */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
                rotate: [-1.5, 1.5, -1.5],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.06 }}
              className="relative z-10 cursor-pointer"
            >
              <img
                src="/image.png"
                alt="شعار مؤسسة الإيمان للأعلاف"
                className="h-64 sm:h-80 md:h-96 w-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)] select-none transition-transform duration-300"
              />
            </motion.div>
          </div>
        </div>
      </section>



      {/* Mission & Flock Immunity Mascot Showcase (مهمتنا: الدجاجة المحاربة مع أنيميشن عائم) */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-24 md:pt-32">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-brand-50/40 p-8 sm:p-12 lg:p-16 shadow-card">
          {/* Subtle background blur circle */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-black">
                <TargetIcon className="w-3.5 h-3.5" />
                <span>مهمتنا وهدفنا الأسمى</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink leading-tight">
                قوة ومناعة تحمي قطيعك.. وأعلى معدل تحويل غذائي
              </h2>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                <p>
                  نوفر في <strong className="text-brand-700 font-black">مجموعة شركات الإيمان</strong> أعلافاً استثنائية عالية الجودة لجميع شركات الدواجن والمواشي، وللمستثمرين الصغار والمتوسطين والكبار في جمهورية مصر العربية.
                </p>
                <p>
                  نقدم للسوق المصري كافة احتياجاته من أعلاف الدواجن والمواشي المتطورة، المصممة خصيصاً لتكون بمثابة <strong className="text-ink font-black">درع حصين يمنح القطيع مناعة قوية</strong> ضد الأمراض، ويضمن تحقيق أسرع معدلات نمو بأقل معامل استهلاك للعلف.
                </p>
                <p>
                  بقيادة فريق من كبار الخبراء والاستشاريين المؤهلين تأهيلاً عالمياً، نضمن تطبيق أحدث معايير الجودة الدولية في كل طن يخرج من مصانع شركة الإيمان الثلاثة.
                </p>
              </div>

              {/* Three Value Pillars with Icons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-200 transition">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-700">
                    مناعة وحصانة فائقة للقطيع طوال دورة التربية
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-200 transition">
                  <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <ScaleIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-700">
                    أعلى معامل تحويل غذائي يقلل التكلفة ويعظم ربح المربي
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-200 transition">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <FlaskConicalIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-700">
                    تركيبات نباتية نقية 100% مدعمة بأفضل الفيتامينات والمعادن
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Visual Column (The Chicken Archer - Animated Floating Mascot) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative flex flex-col items-center">
                {/* Glowing Aura Ring backdrop (Scaled up for larger chicken) */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.5, 0.25] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 m-auto h-96 w-96 sm:h-[30rem] sm:w-[30rem] rounded-full bg-gradient-to-tr from-brand-500/30 via-amber-500/20 to-emerald-500/30 blur-3xl pointer-events-none"
                />

                {/* Chicken Archer Hero Graphic - Enlarged & Wiggling Tail Animation */}
                <motion.div
                  animate={{
                    y: [0, -8, 0, -5, 0],
                    rotate: [0, -4.5, 5, -5.5, 4, 0],
                    skewX: [0, 3, -3.5, 4, -2.5, 0],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '50% 82%' }}
                  className="relative z-10 cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src="/chicken_archer.png"
                    alt="رمز مناعة وقوة أعلاف الإيمان"
                    className="h-[24rem] sm:h-[30rem] md:h-[34rem] lg:h-[38rem] w-auto max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)] select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero_farm_bg.png';
                    }}
                  />
                </motion.div>

                {/* Floating Feature Tag Bottom */}
                {/* <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="-mt-3 z-10 inline-flex items-center gap-2 rounded-full bg-brand-700 text-white px-4 py-2 shadow-md text-xs font-black"
                >
                  <AwardIcon className="h-4 w-4 text-amber-300" />
                  <span>جدارة وجودة قياسية منذ 1990</span>
                </motion.div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Vision Banner (رؤيتنا المستقبلية) */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-black">
              <CompassIcon className="w-3.5 h-3.5" />
              <span>رؤيتنا المستقبلية</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-ink">
              ريادة قطاع الأعلاف في مصر والشرق الأوسط
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
              أن نظل الخيار الأول والأكثر ثقة لجميع المربين والمستثمرين، وأن نقود مسيرة التطوير التقني والتغذوي المستدام للمساهمة الفاعلة في تحقيق الأمن الغذائي القومي لمصر.
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-inner">
              <AwardIcon className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </motion.div> */}
      </section>

      {/* Core Values (قيمنا الست الراسخة مع أنيميشن وتأثيرات تفاعلية) */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-24 md:pt-32">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          {/* <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-black">
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            <span>المبادئ الحاكمة لعملنا</span>
          </div> */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink">
            قيمنا الراسخة
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            الركائز الأخلاقية والمهنية التي توجه مسيرتنا اليومية منذ عام 1990
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lift hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:scale-110 shadow-2xs">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-black text-ink group-hover:text-brand-700 transition">
                    {v.title}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us (لماذا تختار أعلاف الإيمان) */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-b from-slate-50 to-brand-50/40 border border-slate-200/80 p-8 sm:p-12 lg:p-16"
        >
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            {/* <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-black">
              <AwardIcon className="w-3.5 h-3.5" />
              <span>مزايا مجموعة شركات الإيمان</span>
            </div> */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink">
              لماذا تختار أعلاف الإيمان؟
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              معايير قياسية ومزايا متكاملة تجعلنا شريك النجاح الأفضل لمزرعتك
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="group p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-card transition-all duration-300 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-brand-600 opacity-40 group-hover:opacity-100 transition">
                        {adv.num}
                      </span>
                      <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-ink leading-snug">
                      {adv.title}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {adv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Footer Section */}
      {/* <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-brand-900 text-white p-8 sm:p-12 lg:p-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lift"
        >
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">
              جاهزون لتلبية احتياجات مزرعتك بأعلى جودة
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium">
              اطلب طلبيتك الآن مباشرة بالأطنان أو تواصل مع فريق الاستشارات الفنية والتغذوية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] px-6 py-4 text-xs sm:text-sm font-black text-white shadow-lift transition-all hover:scale-105 active:scale-95"
            >
              <span>تصفح قائمة الأعلاف</span>
              <Back className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-xs sm:text-sm font-black text-white backdrop-blur-md transition-all active:scale-95"
            >
              <PhoneCallIcon className="h-4 w-4" />
              <span>تواصل مع الإدارة</span>
            </Link>
          </div>
        </motion.div>
      </section> */}
    </div>
  );
}