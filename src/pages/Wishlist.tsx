import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  Trash2Icon,
  SearchIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  AlertTriangleIcon,
  LogInIcon,
  RotateCwIcon,
} from 'lucide-react';
import { useWishlistPage } from '../features/wishlist/useWishlistPage';
import { useAuth } from '../features/auth/AuthContext';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { LiveProductCard } from '../components/products/LiveProductCard';
import { CardSkeletonGrid } from '../components/shared/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';

export function Wishlist() {
  const navigate = useNavigate();
  const {
    wishlistProducts,
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    reload,
    handleClear,
  } = useWishlistPage();

  const { isAuthenticated, openAuthModal } = useAuth();
  const { dir, t, isRtl } = useLang();
  const BackArrow = dir === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const getCategoryDisplayName = (rawName: string) => {
    const lower = rawName.toLowerCase();
    if (lower.includes('بياض') || lower.includes('laying')) return t(ui.categories.poultryLaying);
    if (lower.includes('تسمين') || lower.includes('broiler')) return t(ui.categories.poultryBroiler);
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

  const onConfirmClear = async () => {
    await handleClear();
    setShowClearConfirm(false);
  };

  // 1. Not Authenticated State
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-5 shadow-sm border border-rose-100 animate-in zoom-in-75">
          <HeartIcon className="h-10 w-10 fill-rose-500/20 stroke-rose-500 stroke-[1.75]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t(ui.wishlist.loginRequired)}
        </h2>
        <p className="text-sm font-semibold text-slate-500 mt-2 max-w-md leading-relaxed">
          {t(ui.wishlist.loginPrompt)}
        </p>
        <button
          type="button"
          onClick={openAuthModal}
          className="mt-7 inline-flex items-center gap-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 px-7 py-3.5 text-sm font-black text-white shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <LogInIcon className="h-4 w-4" />
          <span>{t(ui.wishlist.loginBtn)}</span>
        </button>
      </div>
    );
  }

  // 2. Error State
  if (error && !isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="h-16 w-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangleIcon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">{error}</h2>
        <button
          type="button"
          onClick={reload}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-brand-600 transition"
        >
          <RotateCwIcon className="h-3.5 w-3.5" />
          <span>{isRtl ? 'إعادة المحاولة' : 'Retry'}</span>
        </button>
      </div>
    );
  }

  // 3. Wishlist Content matching Products page
  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="mx-auto max-w-[1440px] px-4 pt-24 pb-12 md:px-8 md:pt-28 md:pb-16">
      {/* Header & Search Bar */}
      <div className="mb-6 space-y-4">
        {/* Navigation Breadcrumb / Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition"
        >
          <BackArrow className="h-4 w-4" />
          <span>{t(ui.wishlist.continueShopping)}</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-ink">{t(ui.wishlist.title)}</h1>
              <span className="inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-0.5">
                {wishlistProducts.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {t(ui.wishlist.subtitle)}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
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

            {/* Clear Wishlist Button */}
            {wishlistProducts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white shadow-xs transition flex-shrink-0"
                title={t(ui.wishlist.clearWishlist)}
              >
                <Trash2Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t(ui.wishlist.clearWishlist)}</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories Filter Tabs (Visible when there are multiple categories in wishlist) */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('all')}
              className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                selectedCategoryId === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t(ui.products.allCategoriesTab)}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-black transition flex items-center gap-1.5 ${
                  selectedCategoryId === cat.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{getCategoryDisplayName(cat.name)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Confirmation Banner */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 sm:p-5 rounded-3xl bg-red-50/95 border border-red-200/90 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                  <AlertTriangleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-red-950">{t(ui.wishlist.clearWishlistConfirmTitle)}</h3>
                  <p className="text-xs font-semibold text-red-700 mt-1 leading-relaxed">
                    {t(ui.wishlist.clearWishlistConfirmBody)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                >
                  {t(ui.common.cancel)}
                </button>
                <button
                  type="button"
                  onClick={onConfirmClear}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black text-white shadow-xs transition active:scale-95"
                >
                  {t(ui.wishlist.confirmClear)}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid or Loading or Empty State */}
      {isLoading ? (
        <CardSkeletonGrid count={6} />
      ) : wishlistProducts.length === 0 ? (
        <EmptyState
          title={t(ui.wishlist.emptyTitle)}
          body={t(ui.wishlist.emptyBody)}
          actionLabel={t(ui.wishlist.startShopping)}
          imageSrc="/aleman_parallax_assets/emptyCart.webp"
          onAction={() => navigate('/products')}
        />
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
