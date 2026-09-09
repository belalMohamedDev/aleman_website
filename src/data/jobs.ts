import type { Job, Localized } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

/**
 * No official vacancy list is published. Every record is demo content used to
 * demonstrate the recruitment and application experience.
 */
export const jobs: Job[] = [
{
  id: 'quality-analyst',
  placeholder: true,
  title: L('أخصائي جودة — معمل التحليل', 'Quality Specialist — Analysis Laboratory'),
  department: L('الجودة', 'Quality'),
  location: L('موقع الإنتاج', 'Production site'),
  type: L('دوام كامل', 'Full time'),
  summary: L(
    'العمل ضمن فريق الجودة على تحليل عينات مكونات العلف واختبار المنتجات النهائية.',
    'Work with the quality team on analysing feed ingredient samples and testing finished products.'
  ),
  responsibilities: [
  L('تجهيز وتحليل عينات المواد الخام والمنتج النهائي.', 'Prepare and analyse raw material and finished product samples.'),
  L('توثيق نتائج الفحص ورفع التقارير الدورية.', 'Document test results and submit periodic reports.'),
  L('متابعة مطابقة المنتج لمعايير الجودة المعتمدة.', 'Verify product conformity with the adopted quality standards.')]

},
{
  id: 'production-supervisor',
  placeholder: true,
  title: L('مشرف إنتاج', 'Production Supervisor'),
  department: L('التصنيع', 'Manufacturing'),
  location: L('موقع الإنتاج', 'Production site'),
  type: L('دوام كامل', 'Full time'),
  summary: L(
    'الإشراف على خطوط الإنتاج ومتابعة الالتزام بضوابط التصنيع والتعبئة.',
    'Supervise production lines and monitor compliance with manufacturing and packaging controls.'
  ),
  responsibilities: [
  L('متابعة خطوات التصنيع اليومية وضبط الأداء.', 'Monitor daily manufacturing steps and control performance.'),
  L('التنسيق مع فريق الجودة بشأن العينات والاختبارات.', 'Coordinate with the quality team on samples and testing.')]

},
{
  id: 'technical-sales',
  placeholder: true,
  title: L('مندوب مبيعات فني', 'Technical Sales Representative'),
  department: L('المبيعات', 'Sales'),
  location: L('عمل ميداني', 'Field based'),
  type: L('دوام كامل', 'Full time'),
  summary: L(
    'تقديم الدعم الفني للمربين ومتابعة احتياجات العملاء من منتجات الأعلاف.',
    'Provide technical support to farmers and follow up on customer feed requirements.'
  ),
  responsibilities: [
  L('زيارة المزارع وشرح خصائص المنتجات المناسبة.', 'Visit farms and explain the characteristics of suitable products.'),
  L('متابعة الطلبات والتنسيق مع فريق التوزيع.', 'Follow up on orders and coordinate with the distribution team.')]

}];