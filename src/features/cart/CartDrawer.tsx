import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, Trash2Icon, PlusIcon, MinusIcon, ShoppingBagIcon, TruckIcon, ArrowLeftIcon, ArrowRightIcon, PackageCheckIcon } from 'lucide-react';
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
  } = useCart();

  const { lang, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with dark blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 ltr:right-0 rtl:left-0 flex max-w-full ltr:pl-8 rtl:pr-8">
            <motion.div
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-screen max-w-[490px] bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-2xs">
                    <ShoppingBagIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-ink">سلة المشتريات</h2>

                    </div>

                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCart}
                  className="h-9 w-9 rounded-xl border border-slate-200/80 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition flex items-center justify-center"
                  aria-label="إغلاق السلة"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-3.5 bg-[#fbfcfb]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
                    <div className="h-24 w-24 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-300 mb-5">
                      <ShoppingBagIcon className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-black text-ink">سلة المشتريات فارغة</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                      لم تقم بإضافة أي أعلاف بعد. تصفح منتجات الإيمان عالية الجودة وأضف ما يناسبك.
                    </p>
                    <Link
                      to="/products"
                      onClick={closeCart}
                      className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-brand-500 hover:bg-brand-600 px-7 py-3 text-sm font-black text-white shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <span>تصفح المنتجات الآن</span>
                      <Arrow className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  items.map((item) => {
                    const itemWeightKg = item.quantity * item.packageWeightKg;
                    const itemWeightTons = itemWeightKg / 1000;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-brand-200/80 p-3.5 sm:p-4 shadow-xs transition-all space-y-3"
                      >
                        {/* Top: Image + Info + Trash */}
                        <div className="flex gap-3.5">
                          {/* Product Image */}
                          <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                            <img
                              src={item.productImageUrl || '/hero_farm_bg.png'}
                              alt={item.productName}
                              className="h-full w-full object-contain filter drop-shadow-xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/image.png';
                              }}
                            />
                          </div>

                          {/* Details Column */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-black text-ink line-clamp-1">
                                  {item.productName}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition flex items-center justify-center flex-shrink-0 -mt-1 -mr-1"
                                  title="حذف هذا المنتج"
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 border border-brand-200/60 px-2 py-0.5 text-[11px] font-black text-brand-800">
                                  <PackageCheckIcon className="h-3 w-3 text-brand-600" />
                                  <span>شكارة {item.packageWeightKg} كجم</span>
                                </span>
                                <span className="text-xs font-bold text-slate-500">
                                  {item.unitPrice.toLocaleString()} ج.م / شكارة
                                </span>
                              </div>
                            </div>

                            {/* Weight badge line */}
                            <div className="mt-2 text-[11px] font-bold text-slate-500 flex items-center gap-1">
                              <span>الوزن:</span>
                              <span className="text-slate-800 font-extrabold">
                                {itemWeightKg >= 1000
                                  ? `${Number(itemWeightTons.toFixed(2))} طن (${itemWeightKg.toLocaleString()} كجم)`
                                  : `${itemWeightKg.toLocaleString()} كجم`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Bar: Stepper on side, Subtotal on opposite side */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                          {/* Stepper */}
                          <div className="flex items-center border border-slate-200 focus-within:border-brand-500 rounded-xl bg-slate-50 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-ink transition active:scale-95"
                              aria-label="تقليل الكمية"
                            >
                              <MinusIcon className="h-3.5 w-3.5" />
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
                              className="w-12 text-center text-xs font-black text-ink bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-ink transition active:scale-95"
                              aria-label="زيادة الكمية"
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-end">
                            <span className="text-xs font-bold text-slate-400 block -mb-0.5">
                              الإجمالي
                            </span>
                            <span className="text-base font-black text-brand-700">
                              {item.subtotal.toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer Summary */}
              {items.length > 0 && (
                <div className="border-t border-slate-200/90 p-5 sm:p-6 bg-white space-y-4 shadow-lift">
                  {/* Weight Calculation Summary with Brand Harmony */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-50 border border-brand-200/80 text-xs font-black text-brand-900">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-brand-600/10 flex items-center justify-center text-brand-600">
                        <TruckIcon className="h-3.5 w-3.5" />
                      </div>
                      <span>إجمالي وزن الشحنة:</span>
                    </div>
                    <span className="text-sm font-black text-brand-800">
                      {totalWeightTons} طن ({totalWeightKg.toLocaleString()} كجم)
                    </span>
                  </div>

                  {/* Price & Bags Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>إجمالي عدد الشكائر</span>
                      <span className="text-ink font-black">{totalItemsCount} شكارة</span>
                    </div>
                    <div className="flex justify-between items-center text-base font-black text-ink pt-2.5 border-t border-slate-100">
                      <span className="text-slate-800">إجمالي الطلب:</span>
                      <span className="text-2xl font-black text-brand-700">
                        {totalPrice.toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] py-4 px-6 text-base font-black text-white shadow-lg shadow-orange-600/25 transition-all hover:scale-[1.01] active:scale-98 text-center"
                  >
                    <span>متابعة إتمام الطلب</span>
                    <Arrow className="h-5 w-5" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
