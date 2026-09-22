import { useMemo } from 'react';
import { useProducts } from '../features/products/useProducts';
import { LiveProductCard } from '../components/products/LiveProductCard';
import { CardSkeletonGrid } from '../components/shared/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { SearchIcon } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';

export function Products() {
  const { t, isRtl } = useLang();
  const {
    categories,
    products,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isLoading,
  } = useProducts();

  const getCategoryDisplayName = (rawName: string) => {
    const lower = rawName.toLowerCase();
    if (lower.includes('دواجن') || lower.includes('poultry')) return t(ui.categories.poultry);
    if (lower.includes('مواشي') || lower.includes('ماشية') || lower.includes('livestock') || lower.includes('cattle')) {
      return t(ui.categories.livestock);
    }
    if (lower.includes('أرانب') || lower.includes('ارانب') || lower.includes('rabbit')) return t(ui.categories.rabbit);
    if (lower.includes('بط') || lower.includes('duck')) return t(ui.categories.duck);
    return rawName;
  };

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, getCategoryDisplayName(c.name)));
    return map;
  }, [categories, t]);

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="mx-auto max-w-[1440px] px-4 pt-24 pb-12 md:px-8 md:pt-28 md:pb-16">
      {/* Compact Header & Search Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-ink">{t(ui.products.catalogHeading)}</h1>
              {/* <span className="rounded-full bg-brand-50 border border-brand-100 px-2.5 py-0.5 text-xs font-black text-brand-700">
                {allProducts.length} منتج
              </span> */}
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {t(ui.products.catalogSubheading)}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(ui.products.searchFeedPlaceholder)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 text-xs font-bold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Categories Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('all')}
              className={`rounded-xl px-4 py-2 text-xs font-black transition ${selectedCategoryId === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
            >
              {t(ui.products.allCategoriesTab)}
            </button>

            {categories.map((cat) => {
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-black transition flex items-center gap-1.5 ${selectedCategoryId === cat.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <span>{getCategoryDisplayName(cat.name)}</span>
                  {/* <span className="opacity-70 text-[11px]">({count})</span> */}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Grid or Loading or Empty State */}
      {isLoading ? (
        <CardSkeletonGrid count={6} />
      ) : products.length === 0 ? (
        <EmptyState
          title={t(ui.products.noMatchingProductsTitle)}
          body={t(ui.products.noMatchingProductsBody)}
          actionLabel={t(ui.products.showAllProducts)}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategoryId('all');
          }}
        />
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <LiveProductCard
              key={product.id}
              product={product}
              categoryName={categoryMap.get(product.categoryId)}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}