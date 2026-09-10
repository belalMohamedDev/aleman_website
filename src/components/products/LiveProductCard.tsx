import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, CheckIcon, ArrowLeftIcon } from 'lucide-react';
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
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedPackage) return;
    addItem(product, selectedPackage, 1);
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
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg sm:text-xl font-black text-brand-600">
                {selectedPackage ? `${selectedPackage.price.toLocaleString()} ج.م` : 'تواصل للسعر'}
              </span>
              <span className="text-[11px] font-bold text-slate-400 mr-1">/ للشكارة</span>
            </div>

            {selectedPackage?.pricePerTon ? (
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {selectedPackage.pricePerTon.toLocaleString()} ج.م/طن
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedPackage}
                className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 px-3 text-xs font-black transition-all ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#f97316] hover:bg-[#ea580c] text-white shadow-sm hover:scale-105 active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>تمت الإضافة</span>
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-4 w-4" />
                    <span>أضف للسلة</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center justify-center gap-1.5 rounded-full py-2.5 px-3 text-xs font-black transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm hover:scale-105 active:scale-95"
              >
                <ShoppingBagIcon className="h-4 w-4" />
                <span>تسجيل الدخول للطلب</span>
              </button>
            )}

            <Link
              to={`/products/${product.id}`}
              className="flex items-center justify-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-3 text-xs font-bold transition"
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
