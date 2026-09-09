import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CategoryId } from '../../types/content';
import { categories, products } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { SectionHeading } from '../shared/SectionHeading';
import { ProductCard } from '../products/ProductCard';

export function FeaturedProducts() {
  const { t, lang } = useLang();
  const [active, setActive] = useState<CategoryId>('poultry');

  const visible = useMemo(() => products.filter((p) => p.category === active).slice(0, 3), [active]);

  return (
    <section className="mx-auto max-w-site px-4 py-16 md:px-6 md:py-20" aria-labelledby="featured-products-title">
      <SectionHeading
        eyebrow={t(ui.home.productsTitle)}
        title={t(ui.home.productsSubtitle)}
        action={
        <Link
          to="/products"
          className="focus-ring inline-flex rounded-pill border border-brand-200 px-5 py-2.5 text-sm font-bold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50">
          
            {t(ui.common.viewAll)}
          </Link>
        } />
      
      <h2 id="featured-products-title" className="sr-only">
        {t(ui.products.pageTitle)}
      </h2>

      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label={t(ui.products.category)}>
        {categories.map((category) => {
          const isActive = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(category.id)}
              className={`focus-ring relative shrink-0 rounded-pill px-5 py-2.5 text-sm font-bold transition ${
              isActive ? 'text-white' : 'border border-slate-200 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'}`
              }>
              
              {isActive ?
              <motion.span
                layoutId="featured-tab"
                className="absolute inset-0 rounded-pill bg-brand-600"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                aria-hidden="true" /> :

              null}
              <span className="relative z-10">{lang === 'ar' ? category.ar : category.en}</span>
            </button>);

        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, index) =>
        <ProductCard key={product.slug} product={product} index={index} />
        )}
      </div>
    </section>);

}