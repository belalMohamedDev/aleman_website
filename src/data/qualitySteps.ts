import type { Localized } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

export type QualityStepIcon = 'wheat' | 'flask' | 'factory' | 'shield' | 'package' | 'truck';

export type QualityStep = {
  id: string;
  icon: QualityStepIcon;
  title: Localized;
  description: Localized;
};

/**
 * The six stages mirror the quality narrative published on the official site:
 * raw material selection → laboratory analysis → manufacturing → quality
 * control → packaging → finished product.
 */
export const qualitySteps: QualityStep[] = [
{
  id: 'raw',
  icon: 'wheat',
  title: L('المواد الخام', 'Raw materials'),
  description: L(
    'تبدأ الجودة الشاملة من اختيار المواد الخام الداخلة في تصنيع العلف.',
    'Total quality begins with the selection of raw materials entering feed production.'
  )
},
{
  id: 'lab',
  icon: 'flask',
  title: L('التحليل المعملي', 'Laboratory analysis'),
  description: L(
    'مختبر لتحليل العينات بأحدث معدات المختبرات لضمان جودة مكونات العلف.',
    'A sample analysis laboratory with modern instruments verifies feed ingredient quality.'
  )
},
{
  id: 'manufacturing',
  icon: 'factory',
  title: L('التصنيع', 'Manufacturing'),
  description: L(
    'تستمر ضوابط الجودة خلال عملية التصنيع بأكملها وليس في مرحلة واحدة.',
    'Quality controls continue throughout the entire manufacturing process, not at a single stage.'
  )
},
{
  id: 'control',
  icon: 'shield',
  title: L('مراقبة الجودة', 'Quality control'),
  description: L(
    'اختبار المنتجات النهائية وفقًا لمعايير الجودة المعتمدة داخل المجموعة.',
    'Finished products are tested against the quality standards adopted by the company.'
  )
},
{
  id: 'packaging',
  icon: 'package',
  title: L('التعبئة', 'Packaging'),
  description: L(
    'تنتهي دورة التصنيع بعملية تعبئة عالية الجودة تحافظ على خصائص المنتج.',
    'The production cycle ends with a high-quality packaging process that preserves product properties.'
  )
},
{
  id: 'final',
  icon: 'truck',
  title: L('المنتج النهائي', 'Finished product'),
  description: L(
    'منتج جاهز للتسليم بهدف تقديم قيمة أعلى لعملاء الإيمان الكرام.',
    'A product ready for delivery, aimed at providing greater value to Aleman customers.'
  )
}];