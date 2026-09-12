import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, Trash2Icon, PlusIcon, MinusIcon, ShoppingBagIcon, TruckIcon, ArrowLeftIcon } from 'lucide-react';
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

  const { lang } = useLang();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 ltr:right-0 rtl:left-0 flex max-w-full ltr:pl-10 rtl:pr-10">
            <motion.div
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-brand-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600">
                    <ShoppingBagIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-ink">سلة المشتريات</h2>
                    <p className="text-xs font-semibold text-slate-500">
                      {totalItemsCount > 0 ? `${totalItemsCount} شكارة في السلة` : 'السلة فارغة'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCart}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  aria-label="إغلاق السلة"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                      <ShoppingBagIcon className="h-10 w-10" />
                    </div>
                    <h3 className="text-base font-bold text-ink">سلة المشتريات فارغة</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">
                      تصفح تشكيلة أعلاف الإيمان واختر الأنسب لقطيعك لإضافته للسلة.
                    </p>
                    <Link
                      to="/products"
                      onClick={closeCart}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition"
                    >
                      <span>تصفح المنتجات</span>
                      <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                    >
                      {/* Product Image */}
                      <div className="h-20 w-20 rounded-xl bg-white p-1 border border-slate-200/80 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={item.productImageUrl || '/hero_farm_bg.png'}
                          alt={item.productName}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/image.png';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-ink line-clamp-1">
                              {item.productName}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition p-1"
                              title="حذف"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-extrabold text-amber-700">
                              شكارة {item.packageWeightKg} كجم
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {item.unitPrice} ج.م للشكارة
                            </span>
                          </div>
                        </div>

                        {/* Quantity and Subtotal */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
                            >
                              <MinusIcon className="h-3 w-3" />
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
                              className="h-6 w-6 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-end">
                            <span className="text-sm font-black text-brand-600">
                              {item.subtotal.toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              {items.length > 0 && (
                <div className="border-t border-slate-200 p-6 bg-slate-50 space-y-4">
                  {/* Weight Calculation Summary */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800">
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-4 w-4 text-emerald-600" />
                      <span>إجمالي وزن الشحنة:</span>
                    </div>
                    <span className="text-sm font-black text-emerald-900">
                      {totalWeightTons} طن ({totalWeightKg.toLocaleString()} كجم)
                    </span>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>عدد الشكائر الإجمالي</span>
                      <span>{totalItemsCount} شكارة</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-ink pt-2 border-t border-slate-200">
                      <span>إجمالي الطلب:</span>
                      <span className="text-xl text-brand-600">{totalPrice.toLocaleString()} ج.م</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#f97316] hover:bg-[#ea580c] py-3.5 px-6 text-base font-extrabold text-white shadow-lg shadow-orange-900/20 transition-all hover:scale-[1.02] active:scale-95 text-center"
                  >
                    <span>متابعة إتمام الطلب</span>
                    <ArrowLeftIcon className="h-5 w-5" />
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
