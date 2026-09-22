import { L } from '../utils';

export const orders = {
  statuses: {
    pending: L('قيد الانتظار والمراجعة', 'Pending Review'),
    pendingMerchant: L('قيد موافقة التاجر الرئيسي', 'Pending Merchant Approval'),
    pendingAdmin: L('قيد موافقة إدارة المصنع', 'Pending Factory Admin Approval'),
    pendingPayment: L('تم رفع الإيصال - قيد تدقيق المالية', 'Receipt Uploaded - Pending Finance Audit'),
    confirmed: L('تم التأكيد والاعتماد', 'Confirmed & Approved'),
    preparing: L('قيد التجهيز والتعبئة بالمصنع', 'Preparing & Packaging at Factory'),
    outForDelivery: L('خرج للتوصيل مع الشاحنة', 'Out for Delivery'),
    readyForPickup: L('جاهز للتحميل من المصنع', 'Ready for Factory Pickup'),
    completed: L('تم الاستلام والانتهاء بنجاح', 'Completed & Delivered'),
    cancelled: L('ملغي', 'Cancelled'),
    rejectedByMerchant: L('مرفوض من التاجر الرئيسي', 'Rejected by Merchant'),
    rejectedByAdmin: L('مرفوض من الإدارة', 'Rejected by Admin'),
    refunded: L('مسترجع', 'Refunded'),
  },

  successTitle: L('تم استلام طلبك بنجاح!', 'Your Order Was Received Successfully!'),
  successSubtitle: L('شكراً لثقتكم بمجموعة شركات الإيمان للأعلاف.', 'Thank you for your trust in Aleman Feed Group.'),
  orderNumberLabel: L('رقم الطلب', 'Order Number'),
  orderDateLabel: L('تاريخ الطلب', 'Order Date'),
  paymentStatusLabel: L('حالة السداد', 'Payment Status'),
  fulfillmentTypeLabel: L('طريقة الاستلام', 'Fulfillment Method'),
  viewOrderDetails: L('عرض تفاصيل الطلب والمتابعة', 'View Order Details & Follow Up'),
  backToHome: L('الرجوع إلى الرئيسية', 'Back to Home'),
  continueShopping: L('تصفح المزيد من المنتجات', 'Browse More Products'),

  // Detail Modal
  modalTitle: L('تفاصيل الطلب', 'Order Details'),
  orderInfoTab: L('بيانات الشحنة', 'Shipment Info'),
  invoiceTab: L('الفاتورة والحسابات', 'Invoice & Breakdown'),
  timelineTab: L('سجل التتبع والمراحل', 'Order Timeline'),
  uploadReceiptHeading: L('إيصال التحويل البنكي', 'Bank Transfer Receipt'),
  uploadReceiptPrompt: L('يرجى رفع صورة أو مستند إيصال السداد البنكي لتسريع اعتماد الطلب', 'Please upload bank transfer receipt to expedite order approval'),
  selectReceiptFile: L('اختيار صورة الإيصال (JPG / PNG / PDF)', 'Choose receipt file (JPG / PNG / PDF)'),
  receiptUploadedSuccess: L('تم رفع الإيصال بنجاح وجاري مراجعته من المالية', 'Receipt uploaded successfully and is under finance review'),
  cancelOrderBtn: L('إلغاء الطلب', 'Cancel Order'),
  cancelConfirm: L('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟', 'Are you sure you want to cancel this order?'),
  orderCancelledSuccess: L('تم إلغاء الطلب بنجاح', 'Order was cancelled successfully'),
  driverAndTruckInfo: L('بيانات السائق والشاحنة', 'Driver & Truck Information'),
  shippingAddressHeading: L('عنوان التوصيل', 'Delivery Address'),
  printInvoice: L('طباعة الفاتورة', 'Print Invoice'),
  readyForPickup: L('جاهز للتحميل', 'Ready for Pickup'),
};

