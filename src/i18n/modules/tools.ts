import { L } from '../utils';

export const tools = {
  pageTitle: L('أدوات المربي', 'Farmer tools'),
  pageSubtitle: L('أدوات حسابية تساعدك على متابعة أداء القطيع.', 'Practical calculators that help you track flock performance.'),
  fcrTitle: L('حاسبة معامل التحويل الغذائي (FCR)', 'Feed Conversion Ratio (FCR) calculator'),
  fcrIntro: L('FCR = كمية العلف المستهلكة ÷ الوزن المكتسب', 'FCR = feed intake ÷ weight gain'),
  flockSize: L('عدد القطيع', 'Flock size'),
  feedIntake: L('استهلاك العلف (كجم)', 'Feed intake (kg)'),
  weightGain: L('متوسط الوزن المكتسب للطائر (كجم)', 'Average weight gain per bird (kg)'),
  calculate: L('احسب', 'Calculate'),
  result: L('قيمة FCR', 'FCR value'),
  status: L('حالة الأداء', 'Performance status'),
  statusLow: L('منخفض القيمة (كفاءة تحويل مرتفعة)', 'Low ratio (high conversion efficiency)'),
  statusMid: L('ضمن المدى المتوسط الشائع', 'Within the commonly observed mid-range'),
  statusHigh: L('مرتفع القيمة (كفاءة تحويل أقل)', 'High ratio (lower conversion efficiency)'),
  disclaimer: L(
    'الحساب رياضي عام ولا يمثل توصية تغذية رسمية من مجموعة شركات الايمان. للحصول على إرشاد دقيق يرجى التواصل مع فريق المجموعة.',
    'This is a generic mathematical calculation and does not represent official nutrition guidance from Aleman Foundation. Contact the team for precise recommendations.'
  ),
  totalGain: L('إجمالي الوزن المكتسب للقطيع', 'Total flock weight gain'),
  invalid: L('يرجى إدخال أرقام أكبر من صفر', 'Please enter numbers greater than zero'),
};
