import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ShoppingBagIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ScaleIcon,
  PackageIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../features/products/productService';
import type { Product, ProductPackage, Category } from '../features/products/types';
import { getProductImages } from '../features/products/types';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { getProduct } from '../data/products';
import { CardSkeleton } from '../components/shared/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { LiveProductCard } from '../components/products/LiveProductCard';

export function ProductDetail() {
  const { slug = '' } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [liveProduct, setLiveProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | null>(null);
  const [unitMode, setUnitMode] = useState<'bag' | 'ton'>('bag');
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const isNumericId = !isNaN(Number(slug));
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = Math.abs(el.scrollLeft);
    setCanScrollRight(current > 15);
    setCanScrollLeft(current < maxScroll - 15);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 385;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(updateScrollButtons, 350);
  };

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let mounted = true;
    setIsLoading(true);

    if (isNumericId) {
      Promise.all([
        productService.getProductById(Number(slug)),
        productService.getCategories(),
        productService.getProducts(),
      ])
        .then(([prod, cats, allProds]) => {
          if (!mounted) return;
          setLiveProduct(prod);
          setCategories(cats);
          const activePkgs = prod.packages?.filter((p) => p.isActive) || [];
          if (activePkgs.length > 0) {
            setSelectedPackage(activePkgs[0]);
          }
          const cat = cats.find((c) => c.id === prod.categoryId);
          if (cat) setCategoryName(cat.name);

          // Related products: prioritize same category, fill with other products if needed
          const sameCategory = allProds.filter((p) => p.categoryId === prod.categoryId && p.id !== prod.id);
          const otherCategory = allProds.filter((p) => p.categoryId !== prod.categoryId && p.id !== prod.id);
          setRelatedProducts([...sameCategory, ...otherCategory].slice(0, 12));
        })
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    } else {
      // Legacy slug lookup
      Promise.all([productService.getCategories(), productService.getProducts()]).then(([cats, allProds]) => {
        if (!mounted) return;
        setCategories(cats);
        setRelatedProducts(allProds.slice(0, 12));
      });
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [slug, isNumericId]);

  const legacyProduct = useMemo(
    () => (!isNumericId ? getProduct(slug) : null),
    [isNumericId, slug]
  );

  const productImages = useMemo(() => {
    if (liveProduct) {
      return getProductImages(liveProduct);
    }
    if (legacyProduct?.image) {
      return [legacyProduct.image];
    }
    return [];
  }, [liveProduct, legacyProduct]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setDirection(0);
  }, [slug]);

  // Auto-play animation through images automatically if multiple exist
  useEffect(() => {
    if (productImages.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [productImages.length]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-20 md:px-8 md:pt-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <CardSkeleton />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="h-8 w-1/2 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-4 w-3/4 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-48 w-full rounded-2xl bg-slate-200 animate-pulse mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!liveProduct && !legacyProduct) {
    return (
      <section className="mx-auto max-w-site px-4 py-24 md:px-6 text-center">
        <EmptyState title="المنتج غير موجود" body="تعذر العثور على المنتج المطلوب." />
        <div className="mt-6">
          <Link
            to="/products"
            className="rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-600 transition"
          >
            الرجوع إلى قائمة المنتجات
          </Link>
        </div>
      </section>
    );
  }

  // Use live product if available
  const name = liveProduct ? liveProduct.name : legacyProduct ? legacyProduct.name.ar : '';
  const description = liveProduct
    ? liveProduct.description
    : legacyProduct
      ? legacyProduct.description.ar
      : '';
  const packages = liveProduct ? liveProduct.packages?.filter((p) => p.isActive) || [] : [];

  const activeImageUrl = productImages[currentImageIndex] || (productImages[0] ?? '/hero_farm_bg.webp');

  const handleSelectImage = (idx: number) => {
    setDirection(idx > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(idx);
  };




  const bagsPerTon = selectedPackage?.weightKg ? Math.round(1000 / selectedPackage.weightKg) : 40;

  const totalBags = Math.max(
    1,
    unitMode === 'ton'
      ? Math.round((Number(inputValue) || 1) * bagsPerTon)
      : Math.round(Number(inputValue) || 1)
  );

  const handleAddToCart = () => {
    if (!liveProduct || !selectedPackage) return;
    addItem(liveProduct, selectedPackage, totalBags);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24">
      {/* Breadcrumbs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <nav className="flex items-center flex-wrap gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-brand-600 transition">
            الرئيسية
          </Link>
          <span className="text-slate-300">/</span>
          <Link to="/products" className="hover:text-brand-600 transition">
            المنتجات
          </Link>
          {categoryName && (
            <>
              <span className="text-slate-300">/</span>
              <span className="rounded-lg bg-brand-50 border border-brand-100 px-2.5 py-0.5 text-xs font-black text-brand-700">
                {categoryName}
              </span>
            </>
          )}
          <span className="text-slate-300">/</span>
          <span className="text-ink font-black truncate max-w-[200px] sm:max-w-none">{name}</span>
        </nav>
      </div>

      {/* Main Product View: 2 columns matching height */}
      <section className="grid gap-8 lg:gap-12 lg:grid-cols-12 lg:items-stretch">
        {/* Product Image Column - Noon Style */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-4">
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start w-full">
            {/* Vertical Thumbnails (positioned on the right in RTL) */}
            {productImages.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[500px] w-full sm:w-20 flex-shrink-0 p-0.5 scrollbar-none">
                {productImages.map((imgUrl, idx) => {
                  const isSelected = currentImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectImage(idx)}
                      onMouseEnter={() => handleSelectImage(idx)}
                      className={`relative h-15 w-15 sm:h-17 sm:w-17 rounded-2xl border transition-all duration-300 flex items-center justify-center flex-shrink-0 cursor-pointer ${isSelected
                        ? 'border-brand-400/80 bg-brand-50/20 shadow-xs'
                        : 'border-slate-200/70 hover:border-slate-300 opacity-65 hover:opacity-100'
                        }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${name} ${idx + 1}`}
                        className="h-full w-full object-contain pointer-events-none"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/image.webp';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Preview Container */}
            <div className="relative flex-1 w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-canvas p-6 sm:p-8 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">




              {/* Big Product Image with smooth auto-animation */}
              <div className="relative w-full flex-1 flex items-center justify-center py-2 min-h-[300px] sm:min-h-[380px] overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={activeImageUrl}
                    src={activeImageUrl}
                    alt={name}
                    custom={direction}
                    initial={{ opacity: 0, scale: 0.93, x: direction >= 0 ? 30 : -30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.93, x: direction >= 0 ? -30 : 30 }}
                    transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
                    loading="eager"
                    decoding="async"
                    className="max-h-76 sm:max-h-96 w-auto object-contain filter drop-shadow-md select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/image.webp';
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Dynamic Carousel Pagination Dots (Loading / Step Indicator) */}
              {productImages.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-3 pb-1 z-10">
                  {productImages.map((_, idx) => {
                    const diff = Math.abs(currentImageIndex - idx);
                    const isCurrent = diff === 0;
                    const isNeighbor = diff === 1;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectImage(idx)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${isCurrent
                          ? 'h-2.5 w-2.5 bg-brand-700 scale-110 shadow-xs ring-2 ring-brand-600/20'
                          : isNeighbor
                            ? 'h-2 w-2 bg-brand-400'
                            : 'h-1.5 w-1.5 bg-brand-200 hover:bg-brand-300'
                          }`}
                        aria-label={`الانتقال للصورة ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Guarantees & Trust Features: 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold text-slate-700">
            {/* <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span className="leading-tight">مطابق للمواصفات القياسية</span>
            </div> */}
            {/* <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <TruckIcon className="h-4 w-4 text-brand-600 flex-shrink-0" />
              <span className="leading-tight">شحن ونقل مباشر لجميع المحافظات</span>
            </div> */}
            {/* <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs sm:col-span-1 col-span-2">
              <AwardIcon className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span className="leading-tight">أعلى معدل تحويل غذائي</span>
            </div> */}
          </div>
        </div>

        {/* Details & Purchase Column */}
        <div className="lg:col-span-7 flex flex-col justify-start space-y-5">
          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink leading-tight">
              {name}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              {description || 'علف عالي الجودة بمواصفات قياسية لضمان أعلى معدلات التحويل الغذائي وحماية صحة القطيع.'}
            </p>
          </div>

          {/* Packages Selection (Bags) Card */}
          {packages.length > 0 && (
            <div className="p-6 sm:p-7 rounded-3xl bg-canvas border border-slate-200/70 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-ink">
                    الأحجام والعبوات المتاحة:
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    اختر حجم الشكارة المناسب
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative text-start p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${isSelected
                          ? 'border-brand-400/80 bg-brand-50/20 shadow-xs'
                          : 'border-slate-200/70 hover:border-slate-300 bg-canvas'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm sm:text-base font-black text-ink">
                              شكارة {pkg.weightKg} كجم
                            </span>
                            {isSelected && (
                              <CheckCircle2Icon className="h-4 w-4 text-brand-500 flex-shrink-0" />
                            )}
                          </div>
                          <span className={`text-base sm:text-lg font-black ${isSelected ? 'text-brand-600' : 'text-slate-700'}`}>
                            {pkg.price.toLocaleString()} ج.م
                          </span>
                        </div>
                        {pkg.pricePerTon ? (
                          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1.5 border-t border-slate-200/60">
                            <span>سعر الطن:</span>
                            <span className="font-bold text-slate-700">
                              {pkg.pricePerTon.toLocaleString()} ج.م/طن
                            </span>
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity, Unit Mode (Bag/Ton), and Direct Add to Cart */}
              {selectedPackage && (
                <div className="pt-5 border-t border-slate-200/60 space-y-4">
                  {/* Compact Unified Toolbar: Unit Mode + Quantity Stepper */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-canvas p-2.5 sm:p-3 rounded-2xl border border-slate-200/70">
                    {/* Unit Mode Selector */}
                    <div className="flex items-center justify-between sm:justify-start gap-2.5">
                      <span className="text-xs font-black text-slate-700">وحدة الشراء:</span>
                      <div className="inline-flex rounded-xl bg-canvas p-1 border border-slate-200/90 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            setUnitMode('bag');
                            setInputValue(totalBags);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${unitMode === 'bag'
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-ink'
                            }`}
                        >
                          <PackageIcon className="h-3.5 w-3.5" />
                          <span>بالشكارة</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUnitMode('ton');
                            const calculatedTons = Math.max(1, Math.round(totalBags / bagsPerTon));
                            setInputValue(calculatedTons);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${unitMode === 'ton'
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-ink'
                            }`}
                        >
                          <ScaleIcon className="h-3.5 w-3.5" />
                          <span>بالطن</span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between sm:justify-end gap-2.5">
                      <span className="text-xs font-black text-slate-700">الكمية:</span>
                      <div className="flex items-center border border-slate-200/90 focus-within:border-brand-500 rounded-xl bg-canvas p-0.5 transition shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setInputValue((v) => Math.max(1, (Number(v) || 1) - 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200/60 hover:text-ink transition active:scale-95"
                          aria-label="تقليل الكمية"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>

                        <div className="w-20 flex items-center justify-center px-1">
                          <input
                            type="number"
                            min="1"
                            value={inputValue}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                setInputValue('' as any);
                              } else {
                                const num = Number(val);
                                if (!isNaN(num) && num >= 0) {
                                  setInputValue(num);
                                }
                              }
                            }}
                            onBlur={() => {
                              if (!inputValue || Number(inputValue) < 1) {
                                setInputValue(1);
                              }
                            }}
                            className="w-10 text-center text-sm font-black text-ink bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-[11px] text-slate-400 font-bold">
                            {unitMode === 'ton' ? 'طن' : 'شكارة'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setInputValue((v) => (Number(v) || 0) + 1)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200/60 hover:text-ink transition active:scale-95"
                          aria-label="زيادة الكمية"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      onClick={openAuthModal}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 text-sm font-black text-white shadow-md bg-brand-500 hover:bg-brand-600 transition-all hover:scale-[1.005] active:scale-95"
                    >
                      <ShoppingBagIcon className="h-5 w-5" />
                      <span>تسجيل الدخول للشراء</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 px-6 text-base font-black text-white shadow-md transition-all ${isAdded
                        ? 'bg-brand-700'
                        : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/20 hover:scale-[1.005] active:scale-95'
                        }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckIcon className="h-5 w-5" />
                          <span>تمت الإضافة إلى السلة!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBagIcon className="h-5 w-5" />
                          <span>
                            {unitMode === 'ton'
                              ? `إضافة ${inputValue || 1} طن (${totalBags} شكارة) للسلة`
                              : `إضافة ${totalBags} شكارة للسلة`}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section (المنتجات ذات الصلة) */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-24 border-t border-slate-200/80 pt-12">
          {/* Centered Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-ink">
              منتجات ذات صلة
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              تشكيلة مختارة من أفضل الأعلاف المناسبة لنفس الفئة والمصنعة بأعلى معايير الجودة
            </p>
          </div>

          {/* Carousel Wrapper with Floating Right and Left Buttons */}
          <div className="relative group/carousel">
            {/* Right Arrow Button (vertically centered in the middle) */}
            <button
              type="button"
              disabled={!canScrollRight}
              onClick={() => handleScroll('right')}
              className={`absolute -right-3 md:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border transition-all flex items-center justify-center ${canScrollRight
                ? 'bg-white text-ink border-slate-200/90 shadow-lift hover:scale-110 hover:text-brand-600 hover:border-brand-300 active:scale-95 cursor-pointer'
                : 'bg-white/80 text-slate-300 border-slate-100 shadow-xs cursor-not-allowed opacity-40'
                }`}
              aria-label="السابق"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Left Arrow Button (vertically centered in the middle) */}
            <button
              type="button"
              disabled={!canScrollLeft}
              onClick={() => handleScroll('left')}
              className={`absolute -left-3 md:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border transition-all flex items-center justify-center ${canScrollLeft
                ? 'bg-white text-ink border-slate-200/90 shadow-lift hover:scale-110 hover:text-brand-600 hover:border-brand-300 active:scale-95 cursor-pointer'
                : 'bg-white/80 text-slate-300 border-slate-100 shadow-xs cursor-not-allowed opacity-40'
                }`}
              aria-label="التالي"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={carouselRef}
              onScroll={updateScrollButtons}
              className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-4 px-2 -mx-2"
            >
              {relatedProducts.map((relProduct, index) => (
                <div
                  key={relProduct.id}
                  className="w-[290px] sm:w-[320px] md:w-[340px] lg:w-[360px] xl:w-[365px] flex-shrink-0"
                >
                  <LiveProductCard
                    product={relProduct}
                    categoryName={categoryMap.get(relProduct.categoryId)}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}