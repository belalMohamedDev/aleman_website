import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ShieldCheckIcon,
  TruckIcon,
  FlaskConicalIcon,
  ScaleIcon,
  PackageIcon,
} from 'lucide-react';
import { productService } from '../features/products/productService';
import type { Product, ProductPackage } from '../features/products/types';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { getProduct } from '../data/products';
import { useLang } from '../i18n/LanguageContext';
import { CardSkeleton } from '../components/shared/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';

export function ProductDetail() {
  const { slug = '' } = useParams();
  const { dir } = useLang();
  const { addItem } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const Back = dir === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;

  const [liveProduct, setLiveProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | null>(null);
  const [unitMode, setUnitMode] = useState<'bag' | 'ton'>('bag');
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [isAdded, setIsAdded] = useState(false);

  const isNumericId = !isNaN(Number(slug));

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    if (isNumericId) {
      Promise.all([
        productService.getProductById(Number(slug)),
        productService.getCategories(),
      ])
        .then(([prod, cats]) => {
          if (!mounted) return;
          setLiveProduct(prod);
          const activePkgs = prod.packages?.filter((p) => p.isActive) || [];
          if (activePkgs.length > 0) {
            setSelectedPackage(activePkgs[0]);
          }
          const cat = cats.find((c) => c.id === prod.categoryId);
          if (cat) setCategoryName(cat.name);
        })
        .catch((e) => console.warn('Live product error:', e))
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    } else {
      // Legacy slug lookup
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [slug, isNumericId]);

  const legacyProduct = !isNumericId ? getProduct(slug) : null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-28 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!liveProduct && !legacyProduct) {
    return (
      <section className="mx-auto max-w-site px-4 py-32 md:px-6 text-center">
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
  const imageUrl = liveProduct ? liveProduct.imageUrl : legacyProduct ? legacyProduct.image : '';
  const protein = liveProduct ? liveProduct.proteinPercentage : legacyProduct ? legacyProduct.protein : null;
  const packages = liveProduct ? liveProduct.packages?.filter((p) => p.isActive) || [] : [];

  const bagsPerTon = selectedPackage?.weightKg ? Math.round(1000 / selectedPackage.weightKg) : 40;

  const totalBags = Math.max(
    1,
    unitMode === 'ton'
      ? Math.round((Number(inputValue) || 1) * bagsPerTon)
      : Math.round(Number(inputValue) || 1)
  );

  const totalTons =
    unitMode === 'ton'
      ? Number(inputValue) || 1
      : (totalBags * (selectedPackage?.weightKg || 25)) / 1000;

  const totalPrice = totalBags * (selectedPackage?.price || 0);

  const handleAddToCart = () => {
    if (!liveProduct || !selectedPackage) return;
    addItem(liveProduct, selectedPackage, totalBags);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <>
      {/* Top Breadcrumb Nav */}
      <div className="border-b border-slate-200 bg-white pt-24 pb-4">
        <div className="mx-auto max-w-site px-4 md:px-6 flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition"
          >
            <Back className="h-4 w-4" />
            <span>الرجوع إلى جميع المنتجات</span>
          </Link>

          {categoryName && (
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              {categoryName}
            </span>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-site px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Image Column */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-b from-brand-50/60 to-slate-50 p-8 shadow-card flex items-center justify-center min-h-[380px]">
              <img
                src={imageUrl || '/hero_farm_bg.png'}
                alt={name}
                className="max-h-80 w-auto object-contain filter drop-shadow-xl transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/image.png';
                }}
              />
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>مطابق للمواصفات القياسية</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <TruckIcon className="h-5 w-5 text-brand-600 flex-shrink-0" />
                <span>شحن ونقل مباشر بالأطنان</span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink leading-tight">
                {name}
              </h1>

              {/* Specification Chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {protein ? (
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/20 px-3 py-1 text-xs font-black text-amber-800">
                    نسبة البروتين: {protein}%
                  </span>
                ) : null}

                {liveProduct?.sapProductId && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    كود المنتج: {liveProduct.sapProductId}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              {description}
            </p>

            {/* Packages Selection (Bags) */}
            {packages.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <span className="block text-xs font-extrabold text-ink">
                  الأحجام والعبوات المتاحة:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`text-start p-3.5 rounded-xl border-2 transition ${
                        selectedPackage?.id === pkg.id
                          ? 'border-brand-500 bg-brand-50/30 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-black text-ink">شكارة {pkg.weightKg} كجم</span>
                        <span className="text-base font-black text-brand-600">
                          {pkg.price.toLocaleString()} ج.م
                        </span>
                      </div>
                      {pkg.pricePerTon ? (
                        <span className="text-xs text-slate-500 font-semibold">
                          سعر الطن: {pkg.pricePerTon.toLocaleString()} ج.م/طن
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>

                {/* Quantity, Unit Mode (Bag/Ton), and Direct Add to Cart */}
                {selectedPackage && (
                  <div className="pt-5 border-t border-slate-200/80 space-y-4">
                    {/* Unit Mode Selector: شكارة / طن */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-500">وحدة الشراء:</span>
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => {
                            setUnitMode('bag');
                            setInputValue(totalBags);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                            unitMode === 'bag'
                              ? 'bg-brand-600 text-white shadow-sm'
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
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                            unitMode === 'ton'
                              ? 'bg-brand-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-ink'
                          }`}
                        >
                          <ScaleIcon className="h-3.5 w-3.5" />
                          <span>بالطن (شحنات الجملة)</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      {/* Quantity Input with typing & +/- buttons */}
                      <div className="flex items-center border-2 border-slate-200 focus-within:border-brand-500 rounded-full bg-slate-50 p-1 transition sm:w-48 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setInputValue((v) => Math.max(1, (Number(v) || 1) - 1))}
                          className="h-9 w-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition active:scale-95"
                          aria-label="تقليل الكمية"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        
                        <div className="flex-1 flex flex-col items-center justify-center px-1">
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
                            className="w-full text-center text-base font-black text-ink bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-[10px] text-slate-500 font-bold -mt-0.5">
                            {unitMode === 'ton' ? 'طن' : 'شكارة'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setInputValue((v) => (Number(v) || 0) + 1)}
                          className="h-9 w-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition active:scale-95"
                          aria-label="زيادة الكمية"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      {!isAuthenticated ? (
                        <button
                          type="button"
                          onClick={openAuthModal}
                          className="flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-extrabold text-white shadow-md bg-brand-500 hover:bg-brand-600 transition-all hover:scale-[1.02] active:scale-95"
                        >
                          <ShoppingBagIcon className="h-5 w-5" />
                          <span>تسجيل الدخول للشراء</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-extrabold text-white shadow-md transition-all ${
                            isAdded
                              ? 'bg-emerald-600'
                              : 'bg-[#f97316] hover:bg-[#ea580c] hover:scale-[1.02] active:scale-95'
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
                                  ? `إضافة ${inputValue || 1} طن (${totalBags} شكارة) للسلة (${totalPrice.toLocaleString()} ج.م)`
                                  : `إضافة ${totalBags} شكارة للسلة (${totalPrice.toLocaleString()} ج.م)`}
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Equivalent Bags / Tons Conversion helper */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                      <span className="text-slate-400">ملخص الكمية:</span>
                      {unitMode === 'ton' ? (
                        <span className="text-brand-700 font-extrabold">
                          {inputValue || 1} طن = {totalBags} شكارة ({selectedPackage.weightKg} كجم للشكارة) ستُضاف للسلة
                        </span>
                      ) : (
                        <span className="text-brand-700 font-extrabold">
                          {totalBags} شكارة = {totalTons.toFixed(2)} طن ({(totalBags * selectedPackage.weightKg).toLocaleString()} كجم)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nutritional Components / Ingredients & Additives */}
            {(liveProduct?.ingredients || liveProduct?.additives) && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-extrabold text-ink flex items-center gap-2">
                  <FlaskConicalIcon className="h-4 w-4 text-brand-600" />
                  <span>التركيب والمكونات المعتمدة:</span>
                </h3>

                {liveProduct.ingredients && (
                  <div>
                    <span className="block text-xs font-bold text-slate-500 mb-1">المواد الخام الأساسية:</span>
                    <p className="text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                      {liveProduct.ingredients}
                    </p>
                  </div>
                )}

                {liveProduct.additives && (
                  <div>
                    <span className="block text-xs font-bold text-slate-500 mb-1">الإضافات الغذائية والفيتامينات:</span>
                    <p className="text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                      {liveProduct.additives}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}