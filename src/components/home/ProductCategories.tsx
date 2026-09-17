import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import type { CategoryId } from '../../types/content';
import { categories } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';

const ANIMAL_IMAGES: Record<CategoryId, string> = {
  poultry: '/animal_chicken.webp',
  livestock: '/animal_cow.webp',
  rabbit: '/animal_rabbit.webp',
  duck: '/animal_duck.webp'
};

const CATEGORY_DESCS: Record<CategoryId, { ar: string; en: string }> = {
  poultry: { ar: 'أعلاف تسمين وبياض متوازنة', en: 'Balanced Broiler & Layer Feeds' },
  livestock: { ar: 'أعلاف تسمين وحلاب عالية القيمة', en: 'Beef & Dairy High Yield Feed' },
  rabbit: { ar: 'تركيبات متخصصة لمكافحة الأجسام', en: 'Specialized Rabbit Nutrition' },
  duck: { ar: 'أعلاف تسمين بط بنسب بروتين دقيقة', en: 'Precision Protein Duck Feed' }
};

export function ProductCategories() {
  const { lang, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;
  const reduced = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-site px-4 pt-4 pb-8 md:px-6" aria-label={lang === 'ar' ? 'تصنيفات المنتجات' : 'Product categories'}>
      {/* Subtle Ambient Glow Behind Cards */}
      <div className="absolute inset-x-0 -top-12 h-32 bg-gradient-to-b from-brand-900/5 via-transparent to-transparent pointer-events-none blur-xl" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        {categories.map((category, index) => {
          const animalImg = ANIMAL_IMAGES[category.id];
          const desc = CATEGORY_DESCS[category.id];

          return (
            <motion.div
              key={category.id}
              initial={reduced ? false : { opacity: 0, y: 35, scale: 0.95 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full"
            >
              <Link
                to={`/products?category=${category.id}`}
                className="focus-ring group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-100/90 bg-white/95 backdrop-blur-md p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.1)] h-full"
              >
                {/* Content: Text on the Right, Animal Illustration on the Left (in RTL) */}
                <div className="relative z-10 flex items-center justify-between gap-3 min-h-[96px]">
                  {/* Category Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-black text-ink group-hover:text-brand-700 transition-colors leading-tight">
                      {lang === 'ar' ? category.ar : category.en}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                      {lang === 'ar' ? desc.ar : desc.en}
                    </p>
                  </div>

                  {/* Animal Illustration with Gentle Floating Idle Motion */}
                  <div className="shrink-0 w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    <motion.img
                      animate={reduced ? undefined : { y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.2 + index * 0.4,
                        ease: "easeInOut",
                        delay: index * 0.15
                      }}
                      src={animalImg}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-brand-700 transition-colors">
                  <span className="font-black">{lang === 'ar' ? 'تصفح الأنواع' : 'Browse Feed Types'}</span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-50 text-brand-700 border border-brand-100/60 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-xs group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <Arrow className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}