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
  CheckCircle2Icon,
} from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { useLang } from '../i18n/LanguageContext';

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
  const { dir } = useLang();
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

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 relative flex items-center justify-center mb-4">
          <img
            src="/aleman_parallax_assets/emptyCart.webp"
            alt="سلة المشتريات فارغة"
            className="w-full h-full object-contain filter drop-shadow-lg animate-in fade-in zoom-in-95 duration-300"
            loading="eager"
            decoding="async"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          سلة المشتريات فارغة حالياً
        </h2>
        <p className="text-sm font-semibold text-slate-500 mt-2 max-w-md leading-relaxed">
          لم تقم بإضافة أي أصناف من أعلاف الإيمان بعد. تصفح تشكيلتنا المتطورة عالية الجودة وأضف الكميات المناسبة لمزرعتك.
        </p>
        <Link
          to="/products"
          className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-950/20 transition-all hover:scale-105 active:scale-95"
        >

          <span>تصفح الأعلاف</span>
          <Arrow className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]/70 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Breadcrumb & Header */}
        <div className="mb-8">


          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">



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
                    <h3 className="text-sm font-black text-red-950">هل أنت متأكد من تفريغ سلة المشتريات بالكامل؟</h3>
                    <p className="text-xs font-semibold text-red-700 mt-1 leading-relaxed">
                      سيتم حذف جميع الأصناف المضافة ({totalItemsCount} شكارة بإجمالي وزن {totalWeightTons} طن) والرجوع لحالة السلة الفارغة.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                  >
                    تراجع
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black text-white shadow-xs transition active:scale-95"
                  >
                    نعم، تفريغ السلة
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2-Column Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Items Table / Cards (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">


              {/* Items List */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const itemWeightKg = item.quantity * item.packageWeightKg;
                    const itemWeightTons = itemWeightKg / 1000;
                    const itemWeightFormatted =
                      itemWeightKg >= 1000
                        ? `${Number(itemWeightTons.toFixed(2))} طن (${itemWeightKg.toLocaleString()} كجم)`
                        : `${itemWeightKg.toLocaleString()} كجم`;
                    const isItemDeleting = deletingItemId === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30, scale: 0.95 }}
                        transition={{ duration: 0.22 }}
                        className={`group relative bg-[#fbfcfb] hover:bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300 space-y-3 sm:space-y-0 ${isItemDeleting ? 'opacity-40 pointer-events-none' : ''
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Product Image & Details */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-white border border-slate-200/80 flex-shrink-0 overflow-hidden flex items-center justify-center p-2 shadow-2xs group-hover:border-brand-200 transition">
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

                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors">
                                {item.productName}
                              </h3>

                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 shadow-2xs">
                                  <PackageCheckIcon className="h-3 w-3 text-emerald-600" />
                                  <span>شكارة {item.packageWeightKg} كجم</span>
                                </span>

                                <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-2.5 py-0.5 rounded-lg">
                                  {item.unitPrice.toLocaleString()} ج.م / شكارة
                                </span>
                              </div>

                              <div className="mt-2 text-xs font-bold text-slate-500">
                                وزن الصنف: <span className="text-brand-900 font-black">{itemWeightFormatted}</span>
                              </div>
                            </div>
                          </div>

                          {/* Stepper + Subtotal + Delete Button */}
                          <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {/* Stepper */}
                            <div className="flex items-center border border-slate-200 bg-white rounded-2xl p-1 shadow-2xs gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantity(item.id, item.quantity - 1);
                                  } else {
                                    handleRemoveItem(item.id);
                                  }
                                }}
                                className={`h-8 w-8 rounded-xl flex items-center justify-center transition active:scale-90 ${item.quantity === 1
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                  }`}
                                aria-label={item.quantity === 1 ? 'إزالة الصنف' : 'تقليل الكمية'}
                                title={item.quantity === 1 ? 'إزالة الصنف' : 'تقليل الكمية'}
                              >
                                {item.quantity === 1 ? (
                                  <Trash2Icon className="h-4 w-4 text-red-500" />
                                ) : (
                                  <MinusIcon className="h-4 w-4" />
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
                                className="w-12 text-center text-sm font-black text-slate-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />

                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition active:scale-90"
                                aria-label="زيادة الكمية"
                                title="زيادة الكمية"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-end min-w-[90px]">
                              <span className="text-[11px] font-bold text-slate-400 block -mb-0.5">الإجمالي</span>
                              <span className="text-lg font-black text-brand-700">
                                {item.subtotal.toLocaleString()}{' '}
                                <span className="text-xs font-bold text-brand-600/80">ج.م</span>
                              </span>
                            </div>

                            {/* Remove Item Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center flex-shrink-0"
                              title="حذف هذا الصنف من السلة"
                              aria-label={`حذف ${item.productName}`}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>



            </div>
          </div>

          {/* Sidebar Column: Payload & Order Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200/80 sticky top-28 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">
                  ملخص الطلب والحمولة
                </h3>
                <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded-full">
                  جاهز للطلب
                </span>
              </div>



              {/* Financial Calculation Breakdown */}
              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>إجمالي عدد الشكائر:</span>
                  <span className="font-black text-slate-900">{totalItemsCount} شكارة</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>إجمالي وزن الأعلاف:</span>
                  <span className="font-black text-emerald-800">
                    {totalWeightTons} طن ({totalWeightKg.toLocaleString()} كجم)
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>قيمة المنتجات:</span>
                  <span className="font-black text-slate-900">{totalPrice.toLocaleString()} ج.م</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-base font-black text-slate-900 block">الإجمالي المبدئي:</span>
                    <span className="text-[11px] text-slate-400 font-bold">بدون مصاريف الشحن (تُحسب بالخطوة التالية)</span>
                  </div>
                  <div className="text-end">
                    <span className="text-2xl font-black text-brand-700">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-500 mr-1">ج.م</span>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] py-4 px-6 text-base font-extrabold text-white shadow-lg shadow-orange-950/20 transition-all hover:scale-[1.02] active:scale-95 text-center"
              >
                <span>التقدم لإتمام الطلب والشحن</span>
                <Arrow className="h-5 w-5" />
              </button>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>أعلاف معتمدة ومطابقة لأعلى معايير الجودة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>خيارات شحن سريعة لجميع المحافظات أو استلام مصنعي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
