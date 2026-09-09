import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Product } from '../../types/content';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { PlaceholderNotice } from '../shared/PlaceholderNotice';

type TabId = 'overview' | 'specs' | 'ingredients' | 'feeding';

export function ProductTabs({ product }: {product: Product;}) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<TabId>('overview');

  const tabs: {id: TabId;label: string;}[] = [
  { id: 'overview', label: t(ui.products.tabOverview) },
  { id: 'specs', label: t(ui.products.tabSpecs) },
  { id: 'ingredients', label: t(ui.products.tabIngredients) },
  { id: 'feeding', label: t(ui.products.tabFeeding) }];


  return (
    <div className="rounded-card border border-slate-100 bg-white shadow-card">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-slate-100 p-2" role="tablist" aria-label={t(ui.products.tabSpecs)}>
        {tabs.map((item) => {
          const isActive = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              onClick={() => setTab(item.id)}
              className={`focus-ring relative shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              isActive ? 'text-brand-600' : 'text-ink-muted hover:text-brand-600'}`
              }>
              
              {isActive ?
              <motion.span layoutId="product-detail-tab" className="absolute inset-0 rounded-xl bg-brand-50" aria-hidden="true" /> :
              null}
              <span className="relative z-10">{item.label}</span>
            </button>);

        })}
      </div>

      <div className="p-5 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}>
            
            {tab === 'overview' ?
            <div className="space-y-4">
                <p className="text-sm leading-loose text-ink-soft">{t(product.description)}</p>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Row label={t(ui.products.category)} value={t(ui.categories[product.category])} />
                  <Row label={t(ui.products.stage)} value={product.stage ? t(product.stage) : t(ui.common.dataSoon)} />
                  <Row label={t(ui.products.protein)} value={product.protein ?? t(ui.common.dataSoon)} />
                  <Row label={t(ui.products.packaging)} value={product.packaging ? t(product.packaging) : t(ui.common.dataSoon)} />
                </dl>
              </div> :
            null}

            {tab === 'specs' ?
            <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-start text-sm">
                  <tbody>
                    {product.specs.map((spec, i) =>
                  <tr key={t(spec.label)} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-50/40'}>
                        <th scope="row" className="w-1/2 px-4 py-3 text-start font-bold text-ink">
                          {t(spec.label)}
                        </th>
                        <td className={`px-4 py-3 ${spec.value ? 'font-bold text-gold-600' : 'text-ink-muted'}`}>
                          {spec.value ? t(spec.value) : t(ui.common.dataSoon)}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div> :
            null}

            {tab === 'ingredients' ?
            product.ingredients.length > 0 ?
            <ul className="grid gap-2 sm:grid-cols-2">
                  {product.ingredients.map((item) =>
              <li key={t(item)} className="rounded-xl bg-brand-50/50 px-4 py-3 text-sm font-semibold text-ink-soft">
                      {t(item)}
                    </li>
              )}
                </ul> :

            <PlaceholderNotice title={t(ui.common.dataSoon)}>{t(ui.products.ingredientsNote)}</PlaceholderNotice> :

            null}

            {tab === 'feeding' ?
            product.feeding.length > 0 ?
            <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-start text-sm">
                    <thead className="bg-brand-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-start font-extrabold text-ink">{t(ui.products.stage)}</th>
                        <th scope="col" className="px-4 py-3 text-start font-extrabold text-ink">{t(ui.products.amount)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.feeding.map((row) =>
                  <tr key={t(row.stage)} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-semibold text-ink-soft">{t(row.stage)}</td>
                          <td className="px-4 py-3 text-ink-muted">{row.amount ? t(row.amount) : t(ui.common.dataSoon)}</td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div> :

            <PlaceholderNotice title={t(ui.common.dataSoon)}>{t(ui.products.feedingNote)}</PlaceholderNotice> :

            null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>);

}

function Row({ label, value }: {label: string;value: string;}) {
  return (
    <div className="rounded-xl border border-slate-100 px-4 py-3">
      <dt className="text-xs font-bold text-ink-muted">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-ink">{value}</dd>
    </div>);

}