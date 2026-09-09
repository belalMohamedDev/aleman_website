import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CategoryId } from '../types/content';
import { products } from '../data/products';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { PlaceholderNotice } from '../components/shared/PlaceholderNotice';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';

const VALID: CategoryId[] = ['poultry', 'livestock', 'rabbit', 'duck'];

export function Products() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('category');
  const [active, setActive] = useState<CategoryId | 'all'>(
    initial && VALID.includes(initial as CategoryId) ? initial as CategoryId : 'all'
  );
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const param = searchParams.get('category');
    if (param && VALID.includes(param as CategoryId)) setActive(param as CategoryId);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = active === 'all' || product.category === active;
      const matchesQuery = !q || t(product.name).toLowerCase().includes(q) || t(product.description).toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [active, query, t]);

  function changeCategory(value: CategoryId | 'all') {
    setActive(value);
    if (value === 'all') setSearchParams({});else
    setSearchParams({ category: value });
  }

  function reset() {
    setQuery('');
    changeCategory('all');
  }

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.products)} title={t(ui.products.pageTitle)} subtitle={t(ui.products.pageSubtitle)} />

      <section className="mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8">
          <PlaceholderNotice title={t(ui.common.placeholderTag)}>
            {t({
              ar: 'تصنيفات المنتجات مطابقة للموقع الرسمي، بينما الأسماء التجارية التفصيلية والمواصفات لكل منتج غير منشورة رسميًا وتظهر كبيانات نائبة.',
              en: 'Product categories follow the official website, while detailed commercial names and per-product specifications are not officially published and appear as placeholder data.'
            })}
          </PlaceholderNotice>
        </div>

        <ProductFilters
          active={active}
          onChange={changeCategory}
          query={query}
          onQueryChange={setQuery}
          resultCount={filtered.length} />
        

        <div className="mt-8">
          <ProductGrid products={filtered} loading={loading} onReset={reset} />
        </div>
      </section>
    </>);

}