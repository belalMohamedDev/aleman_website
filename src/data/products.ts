import type { CategoryId, Localized, Product } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

const IMAGES: Record<CategoryId, string> = {
  poultry: "/ec19b15b-d33a-417e-9df0-27351dda81e3.webp",
  livestock: "/469182bf-bcbc-425b-b977-2c1639d97ad0.webp",
  rabbit: "/d7c7b761-3c29-4810-b3ae-0073c520ff28.webp",
  duck: "/1ada25e8-7e5e-45f1-9155-e3b351204b22.webp"
};

export const categories: {id: CategoryId;ar: string;en: string;}[] = [
{ id: 'poultry', ar: 'أعلاف الدواجن', en: 'Poultry feed' },
{ id: 'livestock', ar: 'أعلاف المواشي', en: 'Livestock feed' },
{ id: 'rabbit', ar: 'أعلاف الأرانب', en: 'Rabbit feed' },
{ id: 'duck', ar: 'أعلاف البط', en: 'Duck feed' }];


/**
 * Category structure follows the official Aleman Foundation catalogue.
 * Individual commercial names, protein levels and specifications are NOT
 * officially published, so every record below is flagged as a placeholder
 * and shows "data coming soon" instead of invented figures.
 */
const emptySpecs = [
{ label: L('نسبة البروتين', 'Protein content') },
{ label: L('الطاقة الممثلة', 'Metabolizable energy') },
{ label: L('نسبة الرطوبة', 'Moisture') },
{ label: L('الشكل', 'Physical form') },
{ label: L('حجم العبوة', 'Package size') }];


function product(
slug: string,
category: CategoryId,
name: Localized,
stage: Localized,
description: Localized)
: Product {
  return {
    slug,
    category,
    name,
    stage,
    description,
    image: IMAGES[category],
    placeholder: true,
    specs: emptySpecs,
    ingredients: [],
    feeding: []
  };
}

export const products: Product[] = [
product(
  'poultry-starter',
  'poultry',
  L('علف دواجن — مرحلة البادئ', 'Poultry feed — starter stage'),
  L('البادئ', 'Starter'),
  L(
    'علف مخصص لمرحلة البادئ في تربية الدواجن، يُصنَّع ضمن منظومة الجودة الشاملة للمجموعة من اختيار المواد الخام حتى التعبئة.',
    'Feed formulated for the poultry starter stage, produced within the company total-quality system from raw material selection through packaging.'
  )
),
product(
  'poultry-grower',
  'poultry',
  L('علف دواجن — مرحلة النامي', 'Poultry feed — grower stage'),
  L('النامي', 'Grower'),
  L(
    'علف مرحلة النمو للدواجن، يخضع لفحص مكونات العلف واختبار المنتج النهائي داخل معمل التحليل.',
    'Grower-stage poultry feed, with ingredient verification and finished product testing in the analysis laboratory.'
  )
),
product(
  'poultry-finisher',
  'poultry',
  L('علف دواجن — مرحلة الناهي', 'Poultry feed — finisher stage'),
  L('الناهي', 'Finisher'),
  L(
    'علف مرحلة التسمين النهائية، معبأ في أكياس تحافظ على خصائص المنتج حتى وصوله إلى المزرعة.',
    'Final fattening-stage feed, packed in sacks that preserve product properties until arrival at the farm.'
  )
),
product(
  'livestock-dairy',
  'livestock',
  L('علف مواشي — إنتاج الألبان', 'Livestock feed — dairy production'),
  L('أبقار حلاب', 'Dairy cattle'),
  L(
    'علف موجّه لقطعان إنتاج الألبان، ضمن خط إنتاج أعلاف المواشي بالمجموعة.',
    'Feed directed at dairy herds within the company livestock feed production line.'
  )
),
product(
  'livestock-fattening',
  'livestock',
  L('علف مواشي — التسمين', 'Livestock feed — fattening'),
  L('تسمين', 'Fattening'),
  L(
    'علف مخصص لمراحل التسمين في المواشي، يُصنَّع وفق ضوابط الجودة المتبعة في جميع مراحل التصنيع.',
    'Feed for livestock fattening stages, manufactured under the quality controls applied across all production stages.'
  )
),
product(
  'livestock-sheep',
  'livestock',
  L('علف أغنام وماعز', 'Sheep and goat feed'),
  L('أغنام وماعز', 'Sheep & goats'),
  L(
    'علف للأغنام والماعز ضمن قطاع أعلاف المواشي، مع اختبار المنتج النهائي قبل التعبئة.',
    'Feed for sheep and goats within the livestock segment, with finished product testing before packaging.'
  )
),
product(
  'rabbit-growth',
  'rabbit',
  L('علف أرانب — مرحلة النمو', 'Rabbit feed — growth stage'),
  L('نمو', 'Growth'),
  L(
    'علف مكعبات للأرانب في مرحلة النمو، ضمن قطاع أعلاف الأرانب بالمجموعة.',
    'Pelleted feed for rabbits in the growth stage, part of the company rabbit feed segment.'
  )
),
product(
  'rabbit-breeding',
  'rabbit',
  L('علف أرانب — أمهات', 'Rabbit feed — breeding does'),
  L('أمهات', 'Breeding does'),
  L(
    'علف موجّه لقطعان الأمهات في مزارع الأرانب، يخضع لمنظومة الجودة نفسها المطبقة على باقي المنتجات.',
    'Feed directed at breeding herds on rabbit farms, subject to the same quality system as other products.'
  )
),
product(
  'duck-starter',
  'duck',
  L('علف بط — مرحلة البادئ', 'Duck feed — starter stage'),
  L('البادئ', 'Starter'),
  L(
    'علف بادئ للبط ضمن قطاع أعلاف البط، من اختيار المواد الخام حتى التعبئة عالية الجودة.',
    'Duck starter feed within the duck segment, from raw material selection to high-quality packaging.'
  )
),
product(
  'duck-finisher',
  'duck',
  L('علف بط — مرحلة التسمين', 'Duck feed — fattening stage'),
  L('تسمين', 'Fattening'),
  L(
    'علف مرحلة التسمين للبط، يُنتج ضمن خطوط الإنتاج الخاصة بقطاع البط.',
    'Fattening-stage duck feed produced on the duck segment production lines.'
  )
)];


export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}