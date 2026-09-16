import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../../data/articles';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { SectionHeading } from '../shared/SectionHeading';
import { ArticleCard } from '../articles/ArticleCard';

export function ArticlesPreview() {
  const { t } = useLang();
  const latest = articles.slice(0, 3);

  return (
    <section className="border-t border-brand-100 bg-white py-16 md:py-20" aria-labelledby="articles-preview-title">
      <div className="mx-auto max-w-site px-4 md:px-6">
        <SectionHeading
          eyebrow={t(ui.home.articlesTitle)}
          title={t(ui.home.articlesSubtitle)}
          action={
            <Link
              to="/articles"
              className="focus-ring inline-flex rounded-pill border border-brand-200 px-5 py-2.5 text-sm font-bold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50">

              {t(ui.common.viewAll)}
            </Link>
          } />

        <h2 id="articles-preview-title" className="sr-only">
          {t(ui.articles.pageTitle)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article, index) =>
            <ArticleCard key={article.slug} article={article} index={index} />
          )}
        </div>
      </div>
    </section>
  );

}