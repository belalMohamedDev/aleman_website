import type { Localized } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

export type TimelineStage = {
  id: string;
  /** Undefined until an official date is confirmed by the company. */
  year?: string;
  title: Localized;
  description: Localized;
};

/**
 * Sequence of development only. No founding year or milestone dates are
 * published officially, so the `year` field intentionally stays undefined.
 */
export const timeline: TimelineStage[] = [
  {
    id: 'foundation',
    title: L('تأسيس المجموعة', 'Company founding'),
    description: L(
      'انطلاق مجموعة شركات الايمان كمجموعة مصرية متخصصة في تصنيع الأعلاف.',
      'Aleman Foundation begins as an Egyptian company specialized in feed manufacturing.'
    )
  },
  {
    id: 'growth',
    title: L('التوسع', 'Growth'),
    description: L(
      'اتساع نشاط المجموعة ليغطي قطاعات الدواجن والمواشي والأرانب والبط.',
      'Activity expands to cover the poultry, livestock, rabbit and duck segments.'
    )
  },
  {
    id: 'manufacturing',
    title: L('التصنيع', 'Manufacturing'),
    description: L(
      'تطوير عمليات التصنيع لتشمل ضوابط جودة في كل مرحلة من مراحل الإنتاج.',
      'Manufacturing operations develop to include quality controls at every production stage.'
    )
  },
  {
    id: 'quality',
    title: L('منظومة الجودة', 'Quality system'),
    description: L(
      'إنشاء مختبر لتحليل العينات بأحدث معدات المختبرات لاختبار المكونات والمنتجات النهائية.',
      'A sample analysis laboratory with modern instruments is established to test ingredients and finished products.'
    )
  },
  {
    id: 'today',
    title: L('الإنتاج الحديث', 'Modern production'),
    description: L(
      'استمرار الإنتاج بمنظومة جودة شاملة من المادة الخام حتى التعبئة النهائية.',
      'Production continues under a total-quality system from raw material through final packaging.'
    )
  }];