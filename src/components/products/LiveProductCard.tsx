import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, CheckIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product, ProductPackage } from '../../features/products/types';
import { getProductPrimaryImage } from '../../features/products/types';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/AuthContext';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

interface LiveProductCardProps {
  product: Product;
  categoryName?: string;
  index?: number;
}

export function LiveProductCard({ product, index = 0 }: LiveProductCardProps) {
  const navigate = useNavigate();
  const { t } = useLang();
  const { addItem } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const activePackages = product.packages?.filter((p) => p.isActive) || [];
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | null>(
    activePackages.length > 0 ? activePackages[0] : null
  );
  const [unitMode, setUnitMode] = useState<'bag' | 'ton'>('bag');
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const bagsPerTon = selectedPackage?.weightKg ? Math.round(1000 / selectedPackage.weightKg) : 40;

  const totalBags = Math.max(
    1,
    unitMode === 'ton'
      ? Math.round((Number(inputValue) || 1) * bagsPerTon)
      : Math.round(Number(inputValue) || 1)
  );

  const totalPrice = totalBags * (selectedPackage?.price || 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedPackage || isAdding) return;
    setIsAdding(true);
    try {
      await addItem(product, selectedPackage, totalBags);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('label') || target.closest('a')) {
      return;
    }
    navigate(`/products/${product.id}`);
  };

  const primaryImage = getProductPrimaryImage(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      onClick={handleCardClick}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card hover:shadow-lift transition-all hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image & Badges */}
      <Link
        to={`/products/${product.id}`}
        className="relative bg-gradient-to-b from-brand-50/60 via-brand-50/30 to-slate-50/80 p-4 pt-6 pb-5 flex items-center justify-center h-64 sm:h-72 overflow-hidden"
      >
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-auto max-h-[230px] sm:max-h-[255px] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/image.webp';
          }}
        />
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-base sm:text-lg font-black leading-snug text-ink hover:text-brand-600 transition">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 font-medium">
            {product.description || t(ui.products.defaultDescription)}
          </p>

          {/* Package Selector */}
          {activePackages.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <span className="block text-[11px] font-bold text-slate-500 mb-2">{t(ui.products.choosePackageSize)}</span>
              <div className="flex flex-wrap gap-2">
                {activePackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
                      selectedPackage?.id === pkg.id
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t(ui.common.bag)} {pkg.weightKg} {t(ui.common.kg)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Unit & Quantity Selector */}
          {selectedPackage && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
              {/* Unit Mode */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{t(ui.products.orderUnit)}</span>
                <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200/80 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setUnitMode('bag');
                      setInputValue(totalBags);
                    }}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                      unitMode === 'bag'
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    {t(ui.products.byBag)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnitMode('ton');
                      const calculatedTons = Math.max(1, Math.round(totalBags / bagsPerTon));
                      setInputValue(calculatedTons);
                    }}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                      unitMode === 'ton'
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    {t(ui.products.byTon)}
                  </button>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{t(ui.products.quantity)}</span>
                <div className="flex items-center border border-slate-200 focus-within:border-brand-500 rounded-xl bg-slate-50 p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setInputValue((v) => Math.max(1, (Number(v) || 1) - 1))}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-ink transition active:scale-95"
                    aria-label={t(ui.products.decreaseQuantity)}
                  >
                    <MinusIcon className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center justify-center px-2">
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
                    <span className="text-[11px] text-slate-400 font-bold mr-1">
                      {unitMode === 'ton' ? t(ui.common.ton) : t(ui.common.bag)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInputValue((v) => (Number(v) || 0) + 1)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-ink transition active:scale-95"
                    aria-label={t(ui.products.increaseQuantity)}
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base sm:text-lg font-black text-brand-600">
                {selectedPackage ? `${totalPrice.toLocaleString()} ${t(ui.common.currencyEg)}` : t(ui.products.priceOnDemand)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mr-1">
                ({selectedPackage?.price.toLocaleString()} {t(ui.common.currencyEg)} / {t(ui.common.bag)})
              </span>
            </div>

            {selectedPackage?.pricePerTon ? (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {selectedPackage.pricePerTon.toLocaleString()} {t(ui.common.currencyEg)}/{t(ui.common.ton)}
              </span>
            ) : null}
          </div>

          <div className="w-full">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedPackage || isAdding || isAdded}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 px-4 text-xs sm:text-sm font-black transition-all ${
                  isAdded
                    ? 'bg-brand-700 text-white'
                    : 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/20 hover:scale-[1.01] active:scale-95 disabled:opacity-60'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckIcon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">{t(ui.products.addedToCart)}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">
                      {t(ui.products.addToCart)} ({totalBags} {t(ui.common.bag)})
                    </span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 px-4 text-xs sm:text-sm font-black transition-all bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/20 hover:scale-[1.01] active:scale-95"
              >
                <ShoppingBagIcon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{t(ui.auth.loginBtn)}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
