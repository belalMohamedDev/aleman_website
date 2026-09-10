import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { SectionHeading } from '../shared/SectionHeading';
import { LiveProductCard } from '../products/LiveProductCard';
import { useProducts } from '../../features/products/useProducts';

export function FeaturedProducts() {
  const { t } = useLang();
  const { categories, products, isLoading } = useProducts();
  const [selectedCatId, setSelectedCatId] = useState<number | 'all'>('all');

  const visibleProducts = useMemo(() => {
    if (selectedCatId === 'all') {
      return products.slice(0, 6);
    }
    return products.filter((p) => p.categoryId === selectedCatId).slice(0, 6);
  }, [products, selectedCatId]);

  return (
    <section className="mx-auto max-w-site px-4 py-16 md:px-6 md:py-20" aria-labelledby="featured-products-title">
      <SectionHeading
        eyebrow={t(ui.home.productsTitle)}
        title={t(ui.home.productsSubtitle)}
        action={
          <Link
            to="/products"
            className="focus-ring inline-flex rounded-pill border border-brand-200 px-5 py-2.5 text-sm font-bold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50"
          >
            {t(ui.common.viewAll)}
          </Link>
        }
      />

      <h2 id="featured-products-title" className="sr-only">
        {t(ui.products.pageTitle)}
      </h2>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div
          className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0"
          role="tablist"
          aria-label={t(ui.products.category)}
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCatId === 'all'}
            onClick={() => setSelectedCatId('all')}
            className={`focus-ring relative shrink-0 rounded-pill px-5 py-2.5 text-sm font-bold transition ${
              selectedCatId === 'all'
                ? 'text-white'
                : 'border border-slate-200 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {selectedCatId === 'all' && (
              <motion.span
                layoutId="featured-tab"
                className="absolute inset-0 rounded-pill bg-brand-600"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">الكل</span>
          </button>

          {categories.map((category) => {
            const isActive = category.id === selectedCatId;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCatId(category.id)}
                className={`focus-ring relative shrink-0 rounded-pill px-5 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? 'text-white'
                    : 'border border-slate-200 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="featured-tab"
                    className="absolute inset-0 rounded-pill bg-brand-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{category.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : visibleProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product, index) => {
            const cat = categories.find((c) => c.id === product.categoryId);
            return (
              <LiveProductCard
                key={product.id}
                product={product}
                categoryName={cat?.name}
                index={index}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
          لا توجد منتجات متوفرة حالياً في هذا القسم.
        </div>
      )}
    </section>
  );
}