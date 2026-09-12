import React from 'react';
import { useProducts } from '../features/products/useProducts';
import { LiveProductCard } from '../components/products/LiveProductCard';
import { CardSkeletonGrid } from '../components/shared/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { PageHeader } from '../components/shared/PageHeader';
import { SearchIcon } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';

export function Products() {
  const { t } = useLang();
  const {
    categories,
    products,
    allProducts,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isLoading,
  } = useProducts();

  const categoryMap = React.useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  return (
    <>
      <PageHeader
        eyebrow={t(ui.nav.products)}
        title="منتجات أعلاف الإيمان"
        subtitle="تشكيلة متكاملة من أجود أنواع الأعلاف الحيوانية والداجنة المصنعة بأحدث المعايير العالمية مع إمكانية الشراء المباشر بالأطنان والشكائر."
      />

      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        {/* Filter and Search Bar */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <SearchIcon className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو المكونات أو مرحلة التغذية..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 text-sm font-semibold text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none shadow-sm"
              />
            </div>

            {/* Results Count */}
            <div className="text-xs font-bold text-slate-500">
              <span>{products.length} من أصل {allProducts.length} منتج</span>
            </div>
          </div>

          {/* Categories Filter Tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCategoryId('all')}
                className={`rounded-full px-5 py-2 text-xs font-extrabold transition ${
                  selectedCategoryId === 'all'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                جميع الأقسام ({allProducts.length})
              </button>

              {categories.map((cat) => {
                const count = allProducts.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`rounded-full px-4 py-2 text-xs font-extrabold transition flex items-center gap-1.5 ${
                      selectedCategoryId === cat.id
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-70 text-[11px]">({count})</span>
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
            title="لا توجد منتجات مطابقة"
            body="جرّب تعديل كلمات البحث أو تصفح قسم آخر من أقسام الأعلاف."
            actionLabel="عرض جميع المنتجات"
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
    </>
  );
}