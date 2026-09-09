import React, { useEffect, useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ArticleCategoryId } from '../types/content';
import { articleCategories, articles } from '../data/articles';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { ArticleCard } from '../components/articles/ArticleCard';
import { CardSkeletonGrid } from '../components/shared/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { PlaceholderNotice } from '../components/shared/PlaceholderNotice';

export function Articles() {
  const { t } = useLang();
  const [active, setActive] = useState<ArticleCategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = active === 'all' || article.category === active;
      const matchesQuery = !q || t(article.title).toLowerCase().includes(q) || t(article.excerpt).toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [active, query, t]);

  function reset() {
    setActive('all');
    setQuery('');
  }

  const tabs: {id: ArticleCategoryId | 'all';label: string;}[] = [
  { id: 'all', label: t(ui.common.all) },
  ...articleCategories.map((id) => ({ id, label: t(ui.articleCategories[id]) }))];


  return (
    <>
      <PageHeader eyebrow={t(ui.nav.articles)} title={t(ui.articles.pageTitle)} subtitle={t(ui.articles.pageSubtitle)} />

      <section className="mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8">
          <PlaceholderNotice compact>{t(ui.articles.editorialNote)}</PlaceholderNotice>
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label={t(ui.articles.pageTitle)}>
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.id)}
                className={`focus-ring relative shrink-0 rounded-pill px-5 py-2.5 text-sm font-bold transition ${
                isActive ? 'text-white' : 'border border-slate-200 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'}`
                }>
                
                {isActive ?
                <motion.span
                  layoutId="article-tab"
                  className="absolute inset-0 rounded-pill bg-brand-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  aria-hidden="true" /> :

                null}
                <span className="relative z-10">{tab.label}</span>
              </button>);

          })}
        </div>

        <div className="relative mt-5 w-full sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-4 rtl:right-4" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(ui.articles.searchPlaceholder)}
            aria-label={t(ui.common.search)}
            className="focus-ring w-full rounded-pill border border-slate-200 bg-white py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-400 focus:outline-none ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4" />
          
        </div>

        <div className="mt-8">
          {loading ?
          <CardSkeletonGrid count={6} /> :
          filtered.length === 0 ?
          <EmptyState
            title={t(ui.common.noResultsTitle)}
            body={t(ui.common.noResultsBody)}
            actionLabel={t(ui.common.reset)}
            onAction={reset} /> :


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, index) =>
            <ArticleCard key={article.slug} article={article} index={index} />
            )}
            </div>
          }
        </div>
      </section>
    </>);

}