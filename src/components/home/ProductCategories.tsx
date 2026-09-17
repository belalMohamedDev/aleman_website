import React from 'react';
import { Link } from 'react-router-dom';
import { BirdIcon, EggIcon, MilkIcon, RabbitIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import type { CategoryId } from '../../types/content';
import { categories } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';
import { Reveal } from '../shared/Reveal';

const ICONS: Record<CategoryId, React.ElementType> = {
  poultry: EggIcon,
  livestock: MilkIcon,
  rabbit: RabbitIcon,
  duck: BirdIcon
};

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

  return (
    <section className="mx-auto max-w-site px-4 pt-6 md:px-6" aria-label={lang === 'ar' ? 'تصنيفات المنتجات' : 'Product categories'}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => {
          const Icon = ICONS[category.id];
          const animalImg = ANIMAL_IMAGES[category.id];
          const desc = CATEGORY_DESCS[category.id];

          return (
            <Reveal key={category.id} delay={index * 0.08}>
              <Link
                to={`/products?category=${category.id}`}
                className="focus-ring group relative flex flex-col justify-between overflow-hidden rounded-card border border-brand-100/80 bg-white/90 backdrop-blur-sm p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-lift"
              >
                {/* Background Subtle Gradient & Animal Illustration */}
                <div className="absolute top-0 ltr:right-0 rtl:left-0 -mt-2 -me-2 h-28 w-28 opacity-15 transition-all duration-300 group-hover:scale-110 group-hover:opacity-30 pointer-events-none">
                  <img src={animalImg} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain mix-blend-multiply" />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-sm transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:scale-105">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Arrow className="h-4 w-4" />
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black text-ink group-hover:text-brand-600 transition-colors">
                    {lang === 'ar' ? category.ar : category.en}
                  </h3>
                  <p className="mt-1.5 text-xs text-ink-muted leading-relaxed font-medium">
                    {lang === 'ar' ? desc.ar : desc.en}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-extrabold text-gold-600 group-hover:text-gold-700">
                  <span>{lang === 'ar' ? 'تصفح الأنواع' : 'Browse Feed Types'}</span>
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}