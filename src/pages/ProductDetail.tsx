import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, PhoneCallIcon } from 'lucide-react';
import { getProduct, products } from '../data/products';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { Badge } from '../components/shared/Badge';
import { Reveal } from '../components/shared/Reveal';
import { EmptyState } from '../components/shared/EmptyState';
import { ProductTabs } from '../components/products/ProductTabs';
import { ProductCard } from '../components/products/ProductCard';

export function ProductDetail() {
  const { slug = '' } = useParams();
  const { t, dir } = useLang();
  const product = getProduct(slug);
  const Back = dir === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;

  if (!product) {
    return (
      <section className="mx-auto max-w-site px-4 py-20 md:px-6">
        <EmptyState title={t(ui.products.notFound)} body={t(ui.common.noResultsBody)} />
        <div className="mt-6 text-center">
          <Link to="/products" className="focus-ring rounded-pill bg-brand-600 px-6 py-3 text-sm font-bold text-white">
            {t(ui.products.backToProducts)}
          </Link>
        </div>
      </section>);

  }

  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);

  return (
    <>
      <div className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-site px-4 py-5 md:px-6">
          <Link to="/products" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition hover:text-brand-600">
            <Back className="h-4 w-4" aria-hidden="true" />
            {t(ui.products.backToProducts)}
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-site px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <Reveal delay={0.05} className="order-2 lg:order-1">
            <Badge tone="green">{t(ui.categories[product.category])}</Badge>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink md:text-4xl">{t(product.name)}</h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.protein ?
              <Badge tone="gold">{t(ui.products.protein)}: {product.protein}</Badge> :

              <Badge tone="outline">{t(ui.products.protein)}: {t(ui.common.dataSoon)}</Badge>
              }
              {product.stage ? <Badge tone="neutral">{t(ui.products.stage)}: {t(product.stage)}</Badge> : null}
              {product.placeholder ? <Badge tone="gold">{t(ui.common.placeholderTag)}</Badge> : null}
            </div>

            <p className="mt-5 text-base leading-loose text-ink-muted">{t(product.description)}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-pill bg-gold-500 px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-gold-600">
                
                <PhoneCallIcon className="h-4 w-4" aria-hidden="true" />
                {t(ui.products.detailCta)}
              </Link>
              <Link
                to="/distributors"
                className="focus-ring inline-flex items-center justify-center rounded-pill border border-brand-200 px-7 py-3.5 text-sm font-extrabold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50">
                
                {t(ui.distributors.pageTitle)}
              </Link>
            </div>

            <div className="mt-8">
              <ProductTabs product={product} />
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="sticky top-24 overflow-hidden rounded-card border border-brand-100 bg-brand-50/50 p-6 shadow-card">
              <img src={product.image} alt={t(product.name)} className="mx-auto h-72 w-auto object-contain md:h-96" />
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 ?
      <section className="mx-auto max-w-site px-4 pb-16 md:px-6">
          <h2 className="mb-6 text-2xl font-extrabold text-ink">{t(ui.categories[product.category])}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) =>
          <ProductCard key={item.slug} product={item} index={index} />
          )}
          </div>
        </section> :
      null}
    </>);

}