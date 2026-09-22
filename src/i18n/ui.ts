import { brand } from './modules/brand';
import { nav } from './modules/nav';
import { common } from './modules/common';
import { home, trust } from './modules/home';
import { about } from './modules/about';
import { products, categories } from './modules/products';
import { cart } from './modules/cart';
import { checkout } from './modules/checkout';
import { orders } from './modules/orders';
import { profile } from './modules/profile';
import { recruitment } from './modules/recruitment';
import { auth } from './modules/auth';
import { notifications } from './modules/notifications';
import { tools } from './modules/tools';
import { prices } from './modules/prices';
import { distributors } from './modules/distributors';
import { articles, articleCategories } from './modules/articles';
import { contact, requestTypes } from './modules/contact';
import { quality, footer, floating } from './modules/layout';
import { L } from './utils';

// Backward compatible legacy careers block combined with new recruitment definitions
const legacyCareers = {
  pageTitle: L('انضم إلى فريق الإيمان', 'Join the Aleman team'),
  pageSubtitle: L('فرص عمل في التصنيع والجودة والمبيعات والدعم الفني.', 'Opportunities across manufacturing, quality, sales and technical support.'),
  notice: L(
    'لا توجد قائمة وظائف شاغرة منشورة رسميًا حاليًا؛ البطاقات التالية محتوى تجريبي لعرض تجربة التقديم.',
    'No officially published vacancy list is available right now; the cards below are demo content showing the application experience.'
  ),
  department: L('القسم', 'Department'),
  location: L('الموقع', 'Location'),
  type: L('نوع التوظيف', 'Employment type'),
  details: L('تفاصيل الوظيفة', 'Job details'),
  apply: L('التقديم على الوظيفة', 'Apply for this job'),
  formName: L('الاسم', 'Full name'),
  formPhone: L('رقم الهاتف', 'Phone number'),
  formEmail: L('البريد الإلكتروني', 'Email address'),
  formRole: L('الوظيفة', 'Position'),
  formCv: L('رفع السيرة الذاتية', 'Upload CV'),
  formCvHint: L('PDF أو DOC حتى 5 ميجابايت', 'PDF or DOC up to 5MB'),
  formMessage: L('رسالة', 'Message'),
  submitted: L('تم استلام طلبك بنجاح', 'Your application was received'),
  submittedBody: L('سيتواصل معك فريق الموارد البشرية عند توفر وظيفة مناسبة.', 'The HR team will contact you when a suitable role opens.'),
  ...recruitment,
};

export const ui = {
  brand,
  nav,
  common,
  home,
  trust,
  about,
  products,
  categories,
  cart,
  checkout,
  orders,
  profile,
  recruitment,
  careers: legacyCareers,
  auth,
  notifications,
  tools,
  prices,
  distributors,
  articles,
  articleCategories,
  contact,
  requestTypes,
  quality,
  footer,
  floating,
};

export type UI = typeof ui;