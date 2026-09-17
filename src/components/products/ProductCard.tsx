import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Product } from '../../types/content';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { Badge } from '../shared/Badge';

export function ProductCard({ product, index = 0 }: {product: Product;index?: number;}) {
  const { t, dir } = useLang();
  const reduced = useReducedMotion();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-card border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      
      <div className="relative bg-brand-50/50 p-4">
        <img
          src={product.image}
          alt={t(product.name)}
          loading="lazy"
          decoding="async"
          className="mx-auto h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]" />
        
        <div className="absolute top-3 flex flex-col gap-1.5 ltr:left-3 rtl:right-3">
          <Badge tone="green">{t(ui.categories[product.category])}</Badge>
          {product.placeholder ? <Badge tone="gold">{t(ui.common.placeholderTag)}</Badge> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold leading-snug text-ink">{t(product.name)}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {product.protein ?
          <Badge tone="gold">{t(ui.products.protein)}: {product.protein}</Badge> :

          <Badge tone="outline">{t(ui.products.protein)}: {t(ui.common.dataSoon)}</Badge>
          }
          {product.stage ? <Badge tone="neutral">{t(product.stage)}</Badge> : null}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">{t(product.description)}</p>

        <Link
          to={`/products/${product.slug}`}
          className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-pill border border-brand-200 px-5 py-2.5 text-sm font-bold text-brand-600 transition group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
          
          {t(ui.common.viewDetails)}
          <Arrow className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>);

}