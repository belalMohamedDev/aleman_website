import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2Icon, HomeIcon, ArrowLeftIcon, ClockIcon } from 'lucide-react';
import { orderService } from '../features/orders/orderService';
import type { OrderResponseDto } from '../features/orders/types';

export function OrderSuccess() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderResponseDto | null>(null);

  useEffect(() => {
    if (orderNumber) {
      orderService.getOrderByNumber(orderNumber)
        .then((data) => setOrder(data))
        .catch((e) => console.warn('Order lookup error:', e));
    }
  }, [orderNumber]);

  return (
    <div className="min-h-[80vh] w-full pt-32 pb-20 px-4 flex items-center justify-center bg-slate-50/50">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-100 text-center">
        <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2Icon className="h-10 w-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-ink mb-2">
          تم استلام طلبك بنجاح!
        </h1>
        <p className="text-sm font-semibold text-slate-500 mb-6">
          شكراً لثقتكم في أعلاف مؤسسة الإيمان. تم تسجيل طلبكم وسيقوم فريق المبيعات بتجهيز الشحنة.
        </p>

        {/* Order Info Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-start space-y-3 mb-8">
          <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">رقم الطلب:</span>
            <span className="font-black text-brand-600 text-base">#{orderNumber}</span>
          </div>

          {order && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">نوع الطلب:</span>
                <span className="font-extrabold text-ink">
                  {order.orderType === 1 ? 'توصيل إلى الموقع' : 'استلام من المصنع'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">إجمالي الحمولة:</span>
                <span className="font-extrabold text-ink">
                  {order.totalWeightTons} طن ({order.totalItemsCount} شكارة)
                </span>
              </div>

              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-500">إجمالي المبلغ المطلوب:</span>
                <span className="font-black text-emerald-600 text-base">
                  {order.totalAmount.toLocaleString()} ج.م
                </span>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200/50">
            <ClockIcon className="h-4 w-4 flex-shrink-0" />
            <span>حالة الطلب الحالية: قيد المراجعة والتجهيز</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3 text-sm font-bold text-ink transition shadow-sm"
          >
            <HomeIcon className="h-4 w-4" />
            <span>الصفحة الرئيسية</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 px-6 py-3 text-sm font-bold text-white transition shadow-sm"
          >
            <span>متابعة التسوق</span>
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
