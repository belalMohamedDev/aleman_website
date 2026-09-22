import { L } from '../utils';

export const profile = {
  pageTitle: L('حسابي والملف الشخصي', 'My Profile & Account'),
  profileAndOrders: L('الملف الشخصي والطلبات', 'Profile & Orders'),
  verifyingAccount: L('جاري التحقق من بيانات الحساب...', 'Verifying account information...'),
  dashboardTitle: L('لوحة التحكم', 'Dashboard'),

  // Identity Card & Sidebar
  welcome: L('أهلاً', 'Hello'),
  dearCustomer: L('عزيزي العميل', 'Valued Customer'),
  accountType: L('نوع الحساب:', 'Account Type:'),
  accountManagement: L('إدارة الحساب', 'Account Management'),
  sapClientCode: L('كود العميل SAP:', 'SAP Client Code:'),
  subCustomerTitle: L('عميل فرعي', 'Sub-Customer'),
  subCustomerSubtitle: L('تابع للتاجر:', 'Affiliated with Merchant:'),
  subCustomerAccount: L('حساب عميل فرعي', 'Sub-Customer Account'),
  mainMerchantTitle: L('تاجر رئيسي معتمد', 'Certified Main Merchant'),
  mainMerchantSubtitle: L('كود SAP:', 'SAP Code:'),
  mainMerchantAccount: L('حساب تاجر رئيسي', 'Main Merchant Account'),
  logoutConfirm: L('هل أنت متأكد من رغبتك في تسجيل الخروج؟', 'Are you sure you want to log out?'),

  // Tabs
  tabOrders: L('الطلبات', 'My Orders'),
  tabMerchantOrders: L('طلبات عملائي', 'Merchant Orders'),
  tabCustomers: L('قاعدة عملائي', 'My Customer Base'),
  tabAddresses: L('العناوين المحفوظة', 'Saved Addresses'),
  tabVehicles: L('أسطول السيارات والسائقين', 'Fleet & Drivers'),

  // Orders Tab
  currentOrdersTab: L('الطلبات الحالية', 'Current Orders'),
  previousOrdersTab: L('الطلبات السابقة', 'Previous Orders'),
  searchOrdersPlaceholder: L('بحث برقم الطلب...', 'Search by order number...'),
  noOrdersFound: L('لا توجد طلبات تطابق بحثك', 'No orders matching your search'),
  noCurrentOrders: L('لا توجد لديك أي طلبات جارية حالياً', 'You currently have no active orders'),
  noPreviousOrders: L('لا توجد طلبات سابقة', 'No previous orders'),
  currentOrdersEmptyDesc: L('عند إرسال طلب جديد سيظهر هنا فوراً مع إمكانية متابعة خط سيره واعتماد الدفع.', 'When a new order is placed, it will appear here immediately to track and approve.'),
  previousOrdersEmptyDesc: L('الطلبات المكتملة أو الملغاة ستظهر في هذا السجل.', 'Completed or cancelled orders will appear in this history.'),
  searchOrdersEmptyDesc: L('تأكد من كتابة رقم الطلب بشكل صحيح.', 'Please verify that the order number is typed correctly.'),
  startShoppingPrompt: L('ابدأ التسوق واستكشف منتجات الإيمان الآن', 'Start shopping and explore Aleman products now'),
  loadingOrders: L('جاري تحميل الطلبات...', 'Loading orders...'),

  // Addresses Tab & Modal
  addNewAddressBtn: L('إضافة عنوان جديد', 'Add New Address'),
  addAddressModalTitle: L('إضافة عنوان توصيل جديد', 'Add New Delivery Address'),
  addFirstAddress: L('إضافة أول عنوان', 'Add First Address'),
  addressLabelField: L('اسم العنوان (مثال: مزرعة النوبارية، المخزن الرئيسي)', 'Address Label (e.g. Farm 1, Main Warehouse)'),
  governorateField: L('المدينة / المحافظة *', 'City / Governorate *'),
  cityField: L('المدينة / المحافظة', 'City / Governorate'),
  districtField: L('المركز / الحي', 'District / Neighborhood'),
  districtOptionalField: L('المركز / الحي (اختياري)', 'District / Neighborhood (Optional)'),
  streetField: L('العنوان التفصيلي / الشارع *', 'Detailed Address / Street *'),
  addressNotesField: L('علامة مميزة أو إرشادات للسائق (اختياري)', 'Landmark or Driver Notes (Optional)'),
  setDefaultAddress: L('تعيين كعنوان افتراضي رئيسي', 'Set as default address'),
  noAddressesTitle: L('لا توجد عناوين مسجلة', 'No saved addresses'),
  noAddressesDesc: L('أضف عناوين مزارعك أو مخازنك لتسهيل وتوفير وقت حساب الشحن عند إنشاء الطلبات.', 'Save your farm or warehouse addresses to save time during checkout.'),
  saveAddressBtn: L('حفظ العنوان', 'Save Address'),
  savingAddress: L('جاري حفظ العنوان...', 'Saving address...'),
  loadingAddresses: L('جاري تحميل العناوين...', 'Loading addresses...'),

  // Vehicles Tab & Modal
  addNewVehicleBtn: L('إضافة سيارة وسائق', 'Add Vehicle & Driver'),
  addVehicleModalTitle: L('إضافة سيارة وسائق جديد', 'Add New Vehicle & Driver'),
  addFirstVehicle: L('إضافة أول سيارة وسائق', 'Add First Vehicle & Driver'),
  driverNameField: L('اسم السائق ثلاثي *', 'Driver Full Name *'),
  driverPhoneField: L('رقم هاتف السائق *', 'Driver Phone Number *'),
  plateNumberField: L('رقم لوحة السيارة (مثال: س ج ر 1234) *', 'Vehicle Plate (e.g. ABC 1234) *'),
  licenseNumberField: L('رقم رخصة القيادة (اختياري)', 'Driver License Number (Optional)'),
  vehicleTypeField: L('نوع الشاحنة', 'Truck Type'),
  setDefaultVehicle: L('تعيين كسيارة افتراضية رئيسية', 'Set as default vehicle'),
  noVehiclesTitle: L('لا توجد سيارات مسجلة', 'No registered vehicles'),
  noVehiclesDesc: L('أضف بيانات شاحناتك وسائقي النقل المعتمدين لربطها بطلبات الاستلام من المصنع.', 'Add your trucks and drivers to link them directly to factory pickup orders.'),
  saveVehicleBtn: L('حفظ بيانات السيارة', 'Save Vehicle Details'),
  savingVehicle: L('جاري الحفظ...', 'Saving...'),
  loadingVehicles: L('جاري تحميل بيانات السيارات...', 'Loading vehicles...'),

  // Common Card Actions & Badges
  defaultBadge: L('افتراضي', 'Default'),
  setAsDefault: L('تعيين كافتراضي', 'Set as default'),
  delete: L('حذف', 'Delete'),
  deleteConfirm: L('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?'),
  closeModal: L('إغلاق', 'Close'),
  viewDetails: L('عرض التفاصيل', 'View Details'),

  // Customers Tab
  customersSearchPlaceholder: L('بحث باسم العميل أو رقم الهاتف…', 'Search by customer name or phone…'),
  customerNameCol: L('اسم العميل', 'Customer Name'),
  customerPhoneCol: L('رقم الهاتف', 'Phone'),
  totalOrdersCol: L('إجمالي الطلبات', 'Total Orders'),
  lastOrderCol: L('آخر طلب', 'Last Order'),
  totalSpentCol: L('إجمالي المسحوبات', 'Total Volume'),
  noCustomersTitle: L('لا يوجد عملاء مسجلون تحت حسابك بعد', 'No sub-customers registered under your account yet'),
  totalCustomers: L('إجمالي العملاء', 'Total Customers'),
  totalVolume: L('إجمالي الكميات المسحوبة', 'Total Volume Withdrawn'),
  totalSalesValue: L('إجمالي قيمة المبيعات', 'Total Sales Value'),

  // Merchant Orders Tab
  merchantOrdersTitle: L('طلبات العملاء التابعين', 'Affiliated Customer Orders'),
  approveOrderBtn: L('اعتماد الطلب', 'Approve Order'),
  rejectOrderBtn: L('رفض الطلب', 'Reject Order'),
  approveConfirm: L('هل أنت متأكد من رغبتك في اعتماد هذا الطلب وإرساله للإدارة؟', 'Are you sure you want to approve this order and forward to admin?'),
  rejectConfirm: L('هل أنت متأكد من رغبتك في رفض هذا الطلب؟', 'Are you sure you want to reject this order?'),
  clientName: L('العميل:', 'Customer:'),
};

