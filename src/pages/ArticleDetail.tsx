import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { articles, getArticle } from '../data/articles';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { Badge } from '../components/shared/Badge';
import { EmptyState } from '../components/shared/EmptyState';
import { PlaceholderNotice } from '../components/shared/PlaceholderNotice';
import { ArticleCard } from '../components/articles/ArticleCard';

export function ArticleDetail() {
  const { slug = '' } = useParams();
  const { t, lang, dir } = useLang();
  const article = getArticle(slug);
  const Back = dir === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;

  if (!article) {
    return (
      <section className="mx-auto max-w-site px-4 py-20 md:px-6">
        <EmptyState title={t(ui.articles.notFound)} body={t(ui.common.noResultsBody)} />
        <div className="mt-6 text-center">
          <Link to="/articles" className="focus-ring rounded-pill bg-brand-600 px-6 py-3 text-sm font-bold text-white">
            {t(ui.articles.backToArticles)}
          </Link>
        </div>
      </section>);

  }

  const formattedDate = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(article.date));

  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <div className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-site px-4 py-5 md:px-6">
          <Link to="/articles" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition hover:text-brand-600">
            <Back className="h-4 w-4" aria-hidden="true" />
            {t(ui.articles.backToArticles)}
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <Badge tone="green">{t(ui.articleCategories[article.category])}</Badge>
        <h1 className="mt-4 text-3xl font-extrabold leading-[1.3] text-ink md:text-4xl">{t(article.title)}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" aria-hidden="true" />
            {article.readingMinutes} {t(ui.articles.minutes)}
          </span>
        </div>

        <img
          src={article.image}
          alt=""
          className="mt-7 h-64 w-full rounded-card border border-brand-100 object-cover shadow-card md:h-96" />
        

        <div className="mt-8 space-y-5">
          <p className="text-lg font-bold leading-loose text-ink">{t(article.excerpt)}</p>
          {article.body.map((paragraph) =>
          <p key={paragraph.en} className="text-base leading-loose text-ink-muted">
              {t(paragraph)}
            </p>
          )}
        </div>

        <div className="mt-8">
          <PlaceholderNotice compact>{t(ui.articles.editorialNote)}</PlaceholderNotice>
        </div>
      </article>

      <section className="mx-auto max-w-site px-4 pb-16 md:px-6">
        <h2 className="mb-6 text-2xl font-extrabold text-ink">{t(ui.articles.pageTitle)}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item, index) =>
          <ArticleCard key={item.slug} article={item} index={index} />
          )}
        </div>
      </section>
    </>);

}