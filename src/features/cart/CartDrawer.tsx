import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PackageCheckIcon,
  AlertTriangleIcon,
  SparklesIcon,
} from 'lucide-react';
import { useCart } from './CartContext';
import { useLang } from '../../i18n/LanguageContext';

export function CartDrawer() {
  const {
    items,
    totalItemsCount,
    totalWeightKg,
    totalWeightTons,
    totalPrice,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { lang, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleRemoveItem = async (itemId: string) => {
    setDeletingItemId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearConfirm(false);
  };

  // Determine recommended truck type based on weight
  const truckBadge =
    totalWeightTons <= 2
      ? 'شاحنة دبابة'
      : totalWeightTons <= 7
        ? 'شاحنة جامبو'
        : 'شاحنة تريلا';

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Glassmorphic Dark Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
          />

          {/* Floating Drawer Container */}
          <div className="fixed inset-y-0 ltr:right-0 rtl:left-0 flex max-w-full sm:p-3 md:p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ x: lang === 'ar' ? '-100%' : '100%', opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="w-screen max-w-[500px] pointer-events-auto bg-gradient-to-b from-white via-white/98 to-[#f7faf7] backdrop-blur-2xl border border-white/80 sm:border-slate-200/80 shadow-[0_20px_70px_-15px_rgba(15,23,42,0.35)] sm:rounded-[2rem] flex flex-col h-full overflow-hidden"
            >
              {/* Drawer Header with Glass & Glow effect */}
              <div className="relative flex items-center justify-between border-b border-slate-100/90 px-5 py-4 bg-white/90 backdrop-blur-xl sticky top-0 z-10 sm:rounded-t-[2rem]">
                {/* Subtle decorative glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-b from-brand-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="relative flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-2xs flex-shrink-0">
                    <ShoppingBagIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">سلة المشتريات</h2>
                      {items.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-50 text-brand-800 border border-brand-200/70 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                          {totalItemsCount} {totalItemsCount === 1 ? 'شكارة' : 'شكائر'}
                        </span>
                      )}
                    </div>
                    {items.length > 0 && (
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {items.length} {items.length === 1 ? 'صنف أعلاف مضاف' : 'أصناف أعلاف مضافة'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-red-600 hover:text-red-700 hover:bg-red-50/80 border border-transparent hover:border-red-100 transition active:scale-95 shadow-2xs"
                      title="تفريغ سلة المشتريات بالكامل"
                    >
                      <Trash2Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">تفريغ السلة</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeCart}
                    className="h-10 w-10 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition flex items-center justify-center active:scale-95 shadow-2xs"
                    aria-label="إغلاق السلة"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Clear Cart Confirmation Banner */}
              <AnimatePresence>
                {showClearConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden bg-red-50/95 backdrop-blur-md border-b border-red-200/80 px-5 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                          <AlertTriangleIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-red-950">هل أنت متأكد من تفريغ السلة بالكامل؟</h4>
                          <p className="text-[11px] font-semibold text-red-700 mt-0.5 leading-relaxed">
                            سيتم حذف جميع الأصناف المضافة ({totalItemsCount} شكارة / {totalWeightTons} طن).
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2.5 mt-3.5">
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                      >
                        تراجع
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCart}
                        className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black text-white shadow-xs transition active:scale-95"
                      >
                        نعم، تفريغ السلة
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-3.5 bg-[#fafbfa]/60">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
                    <div className="w-64 h-64 sm:w-72 sm:h-72 max-w-[300px] max-h-[300px] relative flex items-center justify-center mb-4">
                      <img
                        src="/aleman_parallax_assets/emptyCart.webp"
                        alt="سلة المشتريات فارغة"
                        className="w-full h-full object-contain filter drop-shadow-lg animate-in fade-in zoom-in-95 duration-300"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">سلة المشتريات فارغة</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-2 max-w-xs leading-relaxed">
                      لم تقم بإضافة أي أعلاف بعد. تصفح تشكيلة منتجات الإيمان عالية الجودة وأضف حمولتك المفضلة.
                    </p>
                    <Link
                      to="/products"
                      onClick={closeCart}
                      className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                      <SparklesIcon className="h-4 w-4" />
                      <span>تصفح المنتجات الآن</span>
                      <Arrow className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const itemWeightKg = item.quantity * item.packageWeightKg;
                      const itemWeightTons = itemWeightKg / 1000;
                      const isItemDeleting = deletingItemId === item.id;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -40, scale: 0.92 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className={`group relative bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 hover:border-brand-300/80 p-3.5 sm:p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.08)] transition-all duration-300 space-y-3 ${
                            isItemDeleting ? 'opacity-40 pointer-events-none scale-95' : ''
                          }`}
                        >
                          {/* Top: Image + Info + Remove button */}
                          <div className="flex gap-3.5">
                            {/* Product Image in a framed pedestal container */}
                            <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/90 border border-slate-200/70 flex-shrink-0 overflow-hidden flex items-center justify-center p-2 group-hover:border-brand-200 transition">
                              <img
                                src={item.productImageUrl || '/hero_farm_bg.webp'}
                                alt={item.productName}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/image.webp';
                                }}
                              />
                            </div>

                            {/* Details Column */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-sm font-black text-slate-900 line-clamp-1 leading-snug group-hover:text-brand-700 transition-colors">
                                    {item.productName}
                                  </h4>
                                  {/* Item Removal Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-600 hover:bg-red-50/80 px-2 py-1 rounded-xl border border-transparent hover:border-red-100 transition flex-shrink-0 -mt-1 -mr-1"
                                    title="إزالة هذا المنتج من السلة"
                                    aria-label={`إزالة ${item.productName}`}
                                  >
                                    <Trash2Icon className="h-3.5 w-3.5" />
                                    <span>حذف</span>
                                  </button>
                                </div>

                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 shadow-2xs">
                                    <PackageCheckIcon className="h-3 w-3 text-emerald-600" />
                                    <span>شكارة {item.packageWeightKg} كجم</span>
                                  </span>
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100/70 px-2 py-0.5 rounded-lg">
                                    {item.unitPrice.toLocaleString()} ج.م / شكارة
                                  </span>
                                </div>
                              </div>

                              {/* Weight badge line */}
                              <div className="mt-2 text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                                <span className="text-slate-400">إجمالي وزن الصنف:</span>
                                <span className="text-brand-900 font-extrabold">
                                  {itemWeightKg >= 1000
                                    ? `${Number(itemWeightTons.toFixed(2))} طن (${itemWeightKg.toLocaleString()} كجم)`
                                    : `${itemWeightKg.toLocaleString()} كجم`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Bar: Stepper on side, Subtotal on opposite side */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                            {/* Stepper with sunken pill design */}
                            <div className="flex items-center border border-slate-200/90 bg-slate-50 rounded-xl p-0.5 shadow-inner gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantity(item.id, item.quantity - 1);
                                  } else {
                                    handleRemoveItem(item.id);
                                  }
                                }}
                                className={`h-7 w-7 rounded-lg flex items-center justify-center transition active:scale-90 ${
                                  item.quantity === 1
                                    ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
                                    : 'text-slate-600 hover:bg-white hover:shadow-xs'
                                }`}
                                aria-label={item.quantity === 1 ? 'إزالة المنتج من السلة' : 'تقليل الكمية'}
                                title={item.quantity === 1 ? 'إزالة المنتج من السلة' : 'تقليل الكمية'}
                              >
                                {item.quantity === 1 ? (
                                  <Trash2Icon className="h-3.5 w-3.5 text-red-500" />
                                ) : (
                                  <MinusIcon className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val > 0) {
                                    updateQuantity(item.id, val);
                                  }
                                }}
                                className="w-11 text-center text-xs font-black text-slate-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition active:scale-90"
                                aria-label="زيادة الكمية"
                                title="زيادة الكمية"
                              >
                                <PlusIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Item Subtotal with vibrant style */}
                            <div className="text-end">
                              <span className="text-[11px] font-bold text-slate-400 block -mb-0.5">
                                الإجمالي
                              </span>
                              <span className="text-base font-black text-brand-700">
                                {item.subtotal.toLocaleString()}{' '}
                                <span className="text-xs font-extrabold text-brand-600/80">ج.م</span>
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Redesigned Floating Footer Summary */}
              {items.length > 0 && (
                <div className="border-t border-slate-200/80 p-5 sm:p-6 bg-white/95 backdrop-blur-xl space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] sm:rounded-b-[2rem]">
                  {/* Truck / Payload badge */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50/90 via-brand-50/60 to-emerald-50/90 border border-emerald-200/80 p-3.5 text-xs font-black text-emerald-950">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                          <TruckIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[11px] text-emerald-700 font-bold">إجمالي حمولة الأعلاف:</span>
                          <span className="text-sm font-black text-emerald-950">
                            {totalWeightTons} طن ({totalWeightKg.toLocaleString()} كجم)
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-600/10 text-emerald-800 border border-emerald-600/20 shadow-2xs">
                        {truckBadge}
                      </span>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-bold text-slate-500 text-xs">
                      <span>عدد الشكائر الإجمالي</span>
                      <span className="text-slate-900 font-black">{totalItemsCount} شكارة</span>
                    </div>
                    <div className="flex justify-between items-center text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                      <span className="text-slate-800">إجمالي الطلب:</span>
                      <div className="text-end">
                        <span className="text-2xl font-black text-brand-700">
                          {totalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-500 mr-1.5">ج.م</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-1">
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 py-3.5 px-5 text-sm font-black text-white shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01] active:scale-95 text-center"
                    >
                      <ShoppingBagIcon className="h-4 w-4" />
                      <span>عرض سلة المشتريات ومراجعة الطلب</span>
                      <Arrow className="h-4 w-4" />
                    </Link>

                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 px-4 text-xs font-bold transition active:scale-95 text-center"
                    >
                      <span>الذهاب لإتمام الطلب والشحن مباشرة</span>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
