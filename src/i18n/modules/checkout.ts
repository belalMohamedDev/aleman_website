import { L } from '../utils';

export const checkout = {
  pageTitle: L('إتمام الطلب', 'Checkout'),
  orderTypeTitle: L('طريقة استلام الطلب', 'Fulfillment Method'),
  deliveryOption: L('التوصيل إلى موقعي', 'Delivery to My Location'),
  deliveryOptionDesc: L('شحن مباشر بأسطول الإيمان إلى موقع مزرعتك أو مخزنك', 'Direct shipment via Aleman fleet to your farm or warehouse'),
  pickupOption: L('الاستلام من المصنع', 'Factory Pickup'),
  pickupOptionDesc: L('تحميل مباشر بسياراتك الخاصة من مجمع مصانع الإيمان', 'Direct loading onto your own trucks from Aleman mill complex'),

  truckSelectionTitle: L('شاحنة النقل المناسبة للشحنة', 'Suitable Transport Truck'),
  truckDababaName: L('دبابة', 'Dababa'),
  truckDababaCap: L('حتى 2 طن', 'Up to 2 tons'),
  truckDababaDesc: L('شاحنة خفيفة (حمولة حتى 2 طن)', 'Light truck (payload up to 2 tons)'),

  truckJumboName: L('جامبو', 'Jumbo'),
  truckJumboCap: L('حتى 7 طن', 'Up to 7 tons'),
  truckJumboDesc: L('شاحنة متوسطة (حمولة حتى 7 طن)', 'Medium truck (payload up to 7 tons)'),

  truckTrelaName: L('تريلا', 'Trela'),
  truckTrelaCap: L('حتى 25 طن', 'Up to 25 tons'),
  truckTrelaDesc: L('شاحنة ثقيلة (حمولة حتى 25 طن)', 'Heavy articulated truck (payload up to 25 tons)'),

  recommendedBadge: L('المقترحة لحجم شحنتك', 'Recommended for your weight'),
  freeShippingPromo: L('عرض شحن مجاني متاح!', 'Free shipping offer available!'),

  shippingAddressTitle: L('عنوان التوصيل', 'Delivery Address'),
  selectSavedAddress: L('اختر من العناوين المحفوظة', 'Select from saved addresses'),
  addNewAddress: L('إضافة عنوان توصيل جديد', 'Add new delivery address'),
  noSavedAddresses: L('لا توجد عناوين محفوظة حالياً', 'No saved addresses yet'),

  pickupDetailsTitle: L('بيانات الاستلام وتحميل المصنع', 'Pickup & Factory Loading Details'),
  selectSavedVehicle: L('اختر من أسطول السيارات المحفوظة', 'Select from saved vehicles'),
  addNewVehicle: L('إضافة سيارة وسائق جديد', 'Add new vehicle & driver'),
  driverNameLabel: L('اسم السائق', 'Driver Full Name'),
  driverPhoneLabel: L('رقم هاتف السائق', 'Driver Phone Number'),
  vehiclePlateLabel: L('رقم لوحة السيارة', 'Vehicle Plate Number'),
  driverLicenseLabel: L('رقم رخصة القيادة (اختياري)', 'Driver License Number (Optional)'),
  saveVehicleForFuture: L('حفظ بيانات السائق والسيارة للطلبات القادمة', 'Save driver and vehicle for future orders'),
  expectedPickupDateLabel: L('تاريخ وتوقيت الاستلام المتوقع', 'Expected Pickup Date & Time'),

  paymentMethodTitle: L('طريقة السداد', 'Payment Method'),
  cashOnDelivery: L('نقداً عند الاستلام', 'Cash on Delivery'),
  cashOnDeliveryDesc: L('سداد قيمة الطلب لمندوب الشحن عند وصول الشاحنة لموقعك', 'Pay the total amount to the delivery agent upon truck arrival'),
  bankTransfer: L('تحويل بنكي معتمد', 'Certified Bank Transfer'),
  bankTransferDesc: L('تحويل رسمي لحساب شركة الإيمان البنكي ورفع صورة الإيصال بعد الطلب', 'Official transfer to Aleman corporate bank account, uploading receipt after placement'),
  cardPayment: L('بطاقة بنكية / فيزا', 'Credit / Debit Card'),

  bankDetailsHeading: L('بيانات الحساب البنكي لمجموعة الإيمان', 'Aleman Corporate Bank Account Details'),
  bankName: L('البنك الأهلي المصري', 'National Bank of Egypt (NBE)'),
  accountNumber: L('رقم الحساب', 'Account Number'),
  iban: L('رقم الآيبان (IBAN)', 'IBAN Number'),
  accountHolder: L('اسم الحساب: مجموعة شركات الإيمان للأعلاف', 'Account Name: Aleman Foundation for Feed'),

  additionalNotesTitle: L('ملاحظات إضافية على الطلب (اختياري)', 'Additional Order Notes (Optional)'),
  notesPlaceholder: L('أي تعليمات خاصة بالتفريغ، مسار الشاحنة، أو مواعيد التواجد…', 'Any instructions for unloading, route directions, or timing preferences…'),

  orderSummary: L('ملخص الشحنة والتكاليف', 'Shipment & Cost Summary'),
  productsSubtotal: L('قيمة المنتجات', 'Products Subtotal'),
  shippingFee: L('تكلفة الشحن والتوصيل', 'Shipping & Delivery Fee'),
  freeShipping: L('شحن مجاني', 'Free Shipping'),
  calculatingShipping: L('جاري حساب تكلفة الشحن…', 'Calculating shipping fee…'),
  taxVat: L('ضريبة القيمة المضافة (14%)', 'VAT (14%)'),
  finalTotal: L('المبلغ الإجمالي المطلوب', 'Total Amount Due'),
  submitOrder: L('تأكيد وإرسال الطلب', 'Place & Confirm Order'),
  submittingOrder: L('جاري تأكيد الطلب…', 'Placing order…'),

  // Validation toasts
  validationSelectAddress: L('يرجى اختيار أو إضافة عنوان التوصيل', 'Please select or add a delivery address'),
  validationDriverName: L('يرجى إدخال اسم السائق للاستلام', 'Please enter the driver full name for pickup'),
  validationDriverPhone: L('يرجى إدخال رقم هاتف السائق بشكل صحيح', 'Please enter a valid driver phone number'),
  validationPlateNumber: L('يرجى إدخال رقم لوحة السيارة', 'Please enter the vehicle plate number'),
  validationPickupDate: L('يرجى تحديد موعد الاستلام المتوقع', 'Please specify the expected pickup date'),
  orderSuccessToast: L('تم إرسال طلبك بنجاح!', 'Your order was placed successfully!'),
  orderFailedToast: L('تعذر إرسال الطلب، يرجى المحاولة مرة أخرى', 'Could not place order, please try again'),
  deliveryToFarm: L('وصال (توصيل للمزرعة)', 'Delivery to Farm'),
  pickupFromFactory: L('استلام من المصنع', 'Pickup from Factory'),
  driverName: L('اسم السائق', 'Driver Name'),
  driverPhone: L('رقم هاتف السائق', 'Driver Phone'),
  orderNotes: L('ملاحظات الطلب', 'Order Notes'),
  shippingAddress: L('عنوان التوصيل', 'Shipping Address'),
};

