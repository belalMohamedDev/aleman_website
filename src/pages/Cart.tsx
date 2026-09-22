import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PackageCheckIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
} from 'lucide-react';

import { useCart } from '../features/cart/CartContext';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';

export function Cart() {
  const {
    items,
    totalItemsCount,
    totalWeightKg,
    totalWeightTons,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const { dir, t } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;
  const BackArrow = dir === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;

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

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 relative flex items-center justify-center mb-4">
          <img
            src="/aleman_parallax_assets/emptyCart.webp"
            alt={t(ui.cart.emptyTitle)}
            className="w-full h-full object-contain filter drop-shadow-lg animate-in fade-in zoom-in-95 duration-300"
            loading="eager"
            decoding="async"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t(ui.cart.emptyTitle)}
        </h2>
        <p className="text-sm font-semibold text-slate-500 mt-2 max-w-md leading-relaxed">
          {t(ui.cart.emptyBody)}
        </p>
        <Link
          to="/products"
          className="mt-7 inline-flex items-center gap-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 px-7 py-3.5 text-sm font-black text-white shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <ShoppingBagIcon className="h-4 w-4" />
          <span>{t(ui.cart.startShopping)}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]/70 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition mb-2"
          >
            <BackArrow className="h-4 w-4" />
            <span>{t(ui.cart.continueShopping)}</span>
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink">{t(ui.cart.title)}</h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {t(ui.cart.orderSummary)}
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
              >
                <Trash2Icon className="h-3.5 w-3.5" />
                <span>{t(ui.cart.clearCart)}</span>
              </button>
            )}
          </div>
        </div>

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
                    <h3 className="text-sm font-black text-red-950">{t(ui.cart.clearCartConfirmTitle)}</h3>
                    <p className="text-xs font-semibold text-red-700 mt-1 leading-relaxed">
                      {t(ui.cart.clearCartConfirmBody)}
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
                    onClick={handleClearCart}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black text-white shadow-xs transition active:scale-95"
                  >
                    {t(ui.cart.confirmClear)}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2-Column Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Items Cards Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const itemWeightKg = item.quantity * item.packageWeightKg;
                  const itemWeightTons = itemWeightKg / 1000;
                  const itemWeightFormatted =
                    itemWeightKg >= 1000
                      ? `${Number(itemWeightTons.toFixed(2))} ${t(ui.common.ton)}`
                      : `${itemWeightKg.toLocaleString()} ${t(ui.common.kg)}`;
                  const isItemDeleting = deletingItemId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.22 }}
                      className={`group relative bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                        isItemDeleting ? 'opacity-40 pointer-events-none' : ''
                      }`}
                    >
                      {/* Image Section */}
                      <div className="relative bg-gradient-to-b from-brand-50/25 via-slate-50/40 to-white p-3 flex items-center justify-center h-36 sm:h-40 w-full overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-2 left-2 z-10 h-7 w-7 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition flex items-center justify-center shadow-xs active:scale-95"
                          title={t(ui.cart.removeItem)}
                          aria-label={t(ui.cart.removeItem)}
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </button>

                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs border border-brand-500/20 px-2 py-0.5 text-[10px] font-black text-brand-700 shadow-2xs">
                            <PackageCheckIcon className="h-3 w-3 text-brand-600" />
                            <span>{item.packageWeightKg} {t(ui.common.kg)}</span>
                          </span>
                        </div>

                        <img
                          src={item.productImageUrl || '/hero_farm_bg.webp'}
                          alt={item.productName}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-auto object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/image.webp';
                          }}
                        />
                      </div>

                      {/* Card Body */}
                      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                        <div className="space-y-1.5">
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors" title={item.productName}>
                            {item.productName}
                          </h3>

                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-1 flex-wrap">
                            <span className="font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px]">
                              {item.unitPrice.toLocaleString()} {t(ui.common.currencyEg)} / {t(ui.common.bag)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {t(ui.cart.totalWeight)}: <span className="text-brand-900 font-black">{itemWeightFormatted}</span>
                            </span>
                          </div>
                        </div>

                        {/* Stepper + Subtotal Footer */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                          <div className="flex items-center border border-slate-200 bg-canvas rounded-lg p-0.5 shadow-2xs gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                } else {
                                  handleRemoveItem(item.id);
                                }
                              }}
                              className={`h-6 w-6 rounded-md flex items-center justify-center transition active:scale-90 ${
                                item.quantity === 1
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
                              }`}
                              aria-label={item.quantity === 1 ? t(ui.cart.removeItem) : t(ui.products.decreaseQuantity)}
                            >
                              {item.quantity === 1 ? (
                                <Trash2Icon className="h-3 w-3 text-red-500" />
                              ) : (
                                <MinusIcon className="h-3 w-3" />
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
                              className="w-7 text-center text-[11px] font-black text-slate-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition active:scale-90"
                              aria-label={t(ui.products.increaseQuantity)}
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-end">
                            <span className="text-[9px] font-bold text-slate-400 block -mb-0.5">{t(ui.cart.subtotal)}</span>
                            <span className="text-sm sm:text-base font-black text-brand-700">
                              {item.subtotal.toLocaleString()}{' '}
                              <span className="text-[10px] font-bold text-brand-600/80">{t(ui.common.currencyEg)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Column: Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200/80 sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">
                  {t(ui.cart.orderSummary)}
                </h3>
                <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded-full">
                  {totalItemsCount} {t(ui.common.bag)}
                </span>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t(ui.cart.totalItems)}:</span>
                  <span className="font-black text-slate-900">{totalItemsCount} {t(ui.common.bag)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{t(ui.cart.totalWeight)}:</span>
                  <span className="font-black text-emerald-800">
                    {totalWeightTons} {t(ui.common.ton)} ({totalWeightKg.toLocaleString()} {t(ui.common.kg)})
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{t(ui.checkout.productsSubtotal)}:</span>
                  <span className="font-black text-slate-900">{totalPrice.toLocaleString()} {t(ui.common.currencyEg)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-base font-black text-slate-900 block mb-1.5">{t(ui.cart.subtotal)}:</span>
                    <span className="text-[11px] text-slate-400 font-bold block leading-relaxed">{t(ui.checkout.calculatingShipping)}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-2xl font-black text-brand-700">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-500 mr-1">{t(ui.common.currencyEg)}</span>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 py-4 px-6 text-base font-black text-white shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01] active:scale-95 text-center"
              >
                <span>{t(ui.cart.proceedToCheckout)}</span>
                <Arrow className="h-5 w-5" />
              </button>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>{t(ui.cart.secureTransactions)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
