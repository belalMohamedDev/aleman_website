import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { CategoryId } from '../../types/content';
import { categories } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';
import './product-categories.css';

interface CategoryCardMeta {
  image: string;
  desc: { ar: string; en: string };
  barColor: string;
  badgeTextColor: string;
  count: number;
}

const CATEGORY_CARDS: Record<CategoryId, CategoryCardMeta> = {
  poultry: {
    image: '/categories/card_faded_poultry.webp',
    desc: { ar: 'أعلاف تسمين وبياض متوازنة بأعلى معايير الجودة', en: 'Balanced Broiler & Layer Feeds' },
    barColor: 'bg-amber-500',
    badgeTextColor: 'text-amber-700',
    count: 16,
  },
  livestock: {
    image: '/categories/card_faded_livestock.webp',
    desc: { ar: 'أعلاف تسمين وحلاب لإنتاجية قصوى وجودة عالية', en: 'Beef & Dairy High Yield Feed' },
    barColor: 'bg-emerald-600',
    badgeTextColor: 'text-emerald-700',
    count: 20,
  },
  rabbit: {
    image: '/categories/card_faded_rabbit.webp',
    desc: { ar: 'تركيبات متخصصة ومناعية لتربية أرانب نموذجية', en: 'Specialized Rabbit Nutrition' },
    barColor: 'bg-[#8c6239]',
    badgeTextColor: 'text-[#8c6239]',
    count: 8,
  },
  duck: {
    image: '/categories/card_faded_duck.webp',
    desc: { ar: 'أعلاف تسمين وبياض بط بنسب بروتين دقيقة', en: 'Precision Protein Duck Feed' },
    barColor: 'bg-sky-600',
    badgeTextColor: 'text-sky-700',
    count: 12,
  },
};

export function ProductCategories() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll Tracking for interactive scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth scroll animations
  const headerY = useTransform(scrollYProgress, [0, 0.35], reduced ? [0, 0] : [35, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.22], reduced ? [1, 1] : [0.2, 1]);

  // Subtle staggered vertical parallax between columns
  const parallaxYEven = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [24, -24]);
  const parallaxYOdd = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -10]);

  // Subtle internal photo parallax depth
  const photoParallaxY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-12, 12]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-site px-4 pt-4 sm:pt-8 pb-16 md:px-6 overflow-hidden"
      aria-label={lang === 'ar' ? 'تصنيفات الأعلاف والمنتجات' : 'Product categories'}
    >
      {/* Section Header with smooth scroll animation */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2.5"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight flex items-center justify-center gap-2.5 flex-wrap">
          <span className="text-emerald-700 font-black">
            {lang === 'ar' ? 'تغذية متخصصة' : 'Specialized Nutrition'}
          </span>
          <span className="text-ink font-black">
            {lang === 'ar' ? 'لكل نوع' : 'for Every Need'}
          </span>
          <img
            src="/categories/icon_two_leaves.webp"
            alt=""
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain inline-block select-none"
          />
        </h2>

        <p className="text-sm sm:text-base font-bold text-slate-500 leading-relaxed max-w-xl mx-auto">
          {lang === 'ar'
            ? 'حلول غذائية متكاملة مصممة حسب احتياجات كل نوع من الحيوانات'
            : 'Integrated nutritional solutions tailored to the specific needs of each animal'}
        </p>

        <div className="pt-1.5 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/70 text-slate-700 text-xs font-black shadow-xs">
            <img
              src="/categories/icon_single_leaf.webp"
              alt=""
              className="w-4 h-4 object-contain inline-block"
            />
            <span>{lang === 'ar' ? 'جودة.. لنمو أفضل' : 'Quality.. for Better Growth'}</span>
          </span>
        </div>
      </motion.div>

      {/* Cards Grid with Scroll Parallax and Smooth In-View Transitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {categories.map((category, index) => {
          const meta = CATEGORY_CARDS[category.id];
          const colParallax = index % 2 === 0 ? parallaxYEven : parallaxYOdd;

          return (
            <motion.div
              key={category.id}
              style={{ y: colParallax }}
              initial={reduced ? false : { opacity: 0, y: 50, scale: 0.95 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: 0.65,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full"
            >
              <Link
                to={`/products?category=${category.id}`}
                className="group relative flex flex-col justify-between h-full rounded-3xl border border-slate-200/60 bg-white overflow-hidden shadow-card hover:shadow-lift transition-all duration-400 hover:-translate-y-2.5 cursor-pointer focus-ring"
              >
                {/* Realistic Image with Animal Ground & Background + Parallax Depth */}
                <div className="relative w-full aspect-[1.25/1] overflow-hidden">
                  <motion.img
                    src={meta.image}
                    alt={lang === 'ar' ? category.ar : category.en}
                    loading="lazy"
                    decoding="async"
                    style={{ y: photoParallaxY }}
                    className="w-full h-[115%] object-cover select-none transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                {/* Info & Typography Section */}
                <div className="p-4 sm:p-5 pt-1 pb-6 text-center flex flex-col items-center w-full mt-auto">
                  <h3 className="text-xl sm:text-2xl font-black text-ink leading-tight transition-colors group-hover:text-brand-700">
                    {lang === 'ar' ? category.ar : category.en}
                  </h3>

                  {/* Subtle Colored Accent Bar */}
                  <div
                    className={`w-9 h-1 rounded-full my-2.5 transition-all duration-300 group-hover:w-16 ${meta.barColor}`}
                  />

                  <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed max-w-[240px]">
                    {lang === 'ar' ? meta.desc.ar : meta.desc.en}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}