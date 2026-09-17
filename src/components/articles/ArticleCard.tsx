import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import type { Article } from '../../types/content';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Badge } from '../shared/Badge';

export function ArticleCard({ article, index = 0 }: {article: Article;index?: number;}) {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();

  const formattedDate = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(article.date));

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-card border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      
      <Link to={`/articles/${article.slug}`} className="focus-ring block overflow-hidden">
        <img
          src={article.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Badge tone="green">{t(ui.articleCategories[article.category])}</Badge>
        <h3 className="mt-3 text-lg font-extrabold leading-snug text-ink">
          <Link to={`/articles/${article.slug}`} className="focus-ring transition hover:text-brand-600">
            {t(article.title)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">{t(article.excerpt)}</p>
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" aria-hidden="true" />
            {article.readingMinutes} {t(ui.articles.minutes)}
          </span>
        </div>
      </div>
    </motion.article>);

}