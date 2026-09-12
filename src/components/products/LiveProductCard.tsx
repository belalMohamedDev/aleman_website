import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, CheckIcon, ArrowLeftIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product, ProductPackage } from '../../features/products/types';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/AuthContext';

interface LiveProductCardProps {
  product: Product;
  categoryName?: string;
  index?: number;
}

export function LiveProductCard({ product, categoryName, index = 0 }: LiveProductCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const activePackages = product.packages?.filter((p) => p.isActive) || [];
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | null>(
    activePackages.length > 0 ? activePackages[0] : null
  );
  const [unitMode, setUnitMode] = useState<'bag' | 'ton'>('bag');
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [isAdded, setIsAdded] = useState(false);

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
    if (!selectedPackage) return;
    addItem(product, selectedPackage, totalBags);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card hover:shadow-lift transition-all hover:-translate-y-1"
    >
      {/* Product Image & Badges */}
      <div className="relative bg-gradient-to-b from-brand-50/70 to-slate-50 p-6 flex items-center justify-center min-h-[200px]">
        <img
          src={product.imageUrl || '/hero_farm_bg.png'}
          alt={product.name}
          loading="lazy"
          className="h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/image.png';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 ltr:left-3.5 rtl:right-3.5 flex flex-col gap-1.5 items-start">
          {categoryName && (
            <span className="rounded-full bg-brand-500/15 border border-brand-500/20 px-3 py-1 text-[11px] font-extrabold text-brand-700 backdrop-blur-sm">
              {categoryName}
            </span>
          )}
          {product.proteinPercentage ? (
            <span className="rounded-full bg-amber-500/15 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-black text-amber-800 backdrop-blur-sm">
              بروتين {product.proteinPercentage}%
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-base sm:text-lg font-black leading-snug text-ink hover:text-brand-600 transition">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 font-medium">
            {product.description || 'علف عالي الجودة متوازن غذائياً لضمان أعلى معدلات تحويل غذائي.'}
          </p>

          {/* Package Selector */}
          {activePackages.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="block text-[11px] font-bold text-slate-500 mb-1.5">اختر حجم العبوة:</span>
              <div className="flex flex-wrap gap-2">
                {activePackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-extrabold transition ${
                      selectedPackage?.id === pkg.id
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    شكارة {pkg.weightKg} كجم
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Unit & Quantity Selector */}
          {selectedPackage && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">وحدة الطلب:</span>
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setUnitMode('bag');
                      setInputValue(totalBags);
                    }}
                    className={`px-2 py-0.5 text-[11px] font-black rounded-md transition-all ${
                      unitMode === 'bag'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    بالشكارة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnitMode('ton');
                      const calculatedTons = Math.max(1, Math.round(totalBags / bagsPerTon));
                      setInputValue(calculatedTons);
                    }}
                    className={`px-2 py-0.5 text-[11px] font-black rounded-md transition-all ${
                      unitMode === 'ton'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    بالطن
                  </button>
                </div>
              </div>

              {/* Quantity Input with typing & +/- buttons */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">الكمية:</span>
                <div className="flex items-center border border-slate-200 focus-within:border-brand-500 rounded-full bg-slate-50 px-1 py-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setInputValue((v) => Math.max(1, (Number(v) || 1) - 1))}
                    className="h-6 w-6 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition active:scale-95"
                    aria-label="تقليل الكمية"
                  >
                    <MinusIcon className="h-3 w-3" />
                  </button>

                  <div className="flex items-center justify-center px-1">
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
                      className="w-10 text-center text-xs font-black text-ink bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">
                      {unitMode === 'ton' ? 'طن' : 'شكارة'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInputValue((v) => (Number(v) || 0) + 1)}
                    className="h-6 w-6 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition active:scale-95"
                    aria-label="زيادة الكمية"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Equivalent calculation helper note */}
              <div className="text-[10px] font-bold text-slate-500 bg-slate-50 rounded-lg px-2 py-1 text-center border border-slate-100">
                {unitMode === 'ton' ? (
                  <span>
                    {inputValue || 1} طن = <strong className="text-brand-700">{totalBags} شكارة</strong> ({selectedPackage.weightKg} كجم)
                  </span>
                ) : (
                  <span>
                    {totalBags} شكارة = <strong className="text-brand-700">{totalTons.toFixed(2)} طن</strong> ({(totalBags * selectedPackage.weightKg).toLocaleString()} كجم)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base sm:text-lg font-black text-brand-600">
                {selectedPackage ? `${totalPrice.toLocaleString()} ج.م` : 'تواصل للسعر'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mr-1">
                ({selectedPackage?.price.toLocaleString()} ج.م للشكارة)
              </span>
            </div>

            {selectedPackage?.pricePerTon ? (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {selectedPackage.pricePerTon.toLocaleString()} ج.م/طن
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedPackage}
                className={`flex-[2] flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-black transition-all ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#f97316] hover:bg-[#ea580c] text-white shadow-sm hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckIcon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">تمت الإضافة للسلة!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">أضف للسلة ({totalBags} شكارة)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl py-3 px-3 text-xs sm:text-sm font-black transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBagIcon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">تسجيل الدخول للطلب</span>
              </button>
            )}

            <Link
              to={`/products/${product.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-3 px-3 text-xs sm:text-sm font-bold transition whitespace-nowrap"
            >
              <span>التفاصيل</span>
              <ArrowLeftIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
