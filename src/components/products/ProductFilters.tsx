import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import type { CategoryId } from '../../types/content';
import { categories } from '../../data/products';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

type ProductFiltersProps = {
  active: CategoryId | 'all';
  onChange: (value: CategoryId | 'all') => void;
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
};

export function ProductFilters({ active, onChange, query, onQueryChange, resultCount }: ProductFiltersProps) {
  const { t, lang } = useLang();

  const tabs: {id: CategoryId | 'all';label: string;}[] = [
  { id: 'all', label: t(ui.common.all) },
  ...categories.map((c) => ({ id: c.id, label: lang === 'ar' ? c.ar : c.en }))];


  return (
    <div className="flex flex-col gap-5">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label={t(ui.products.category)}>
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`focus-ring relative shrink-0 rounded-pill px-5 py-2.5 text-sm font-bold transition ${
              isActive ? 'text-white' : 'border border-slate-200 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'}`
              }>
              
              {isActive ?
              <motion.span
                layoutId="product-tab"
                className="absolute inset-0 rounded-pill bg-brand-600"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                aria-hidden="true" /> :

              null}
              <span className="relative z-10">{tab.label}</span>
            </button>);

        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-4 rtl:right-4" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t(ui.products.searchPlaceholder)}
            aria-label={t(ui.common.search)}
            className="focus-ring w-full rounded-pill border border-slate-200 bg-white py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-400 focus:outline-none ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4" />
          
        </div>
        <p className="text-sm font-semibold text-ink-muted">
          {resultCount} {t(ui.products.resultsCount)}
        </p>
      </div>
    </div>);

}