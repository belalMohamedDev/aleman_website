import type { Distributor, Localized } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

/**
 * The official distributor network is not published. Records below are clearly
 * marked interface samples: names are generic labels (not real businesses) and
 * phone numbers are masked placeholders.
 */
export const distributors: Distributor[] = [
{
  id: 'sample-1',
  placeholder: true,
  verified: false,
  name: L('نقطة توزيع — سجل تجريبي ١', 'Distribution point — sample record 1'),
  governorate: L('القاهرة', 'Cairo'),
  city: L('القاهرة', 'Cairo'),
  address: L('العنوان قيد الاعتماد', 'Address pending confirmation'),
  phone: '—',
  whatsapp: '—',
  coords: [30.0444, 31.2357]
},
{
  id: 'sample-2',
  placeholder: true,
  verified: false,
  name: L('نقطة توزيع — سجل تجريبي ٢', 'Distribution point — sample record 2'),
  governorate: L('الشرقية', 'Sharqia'),
  city: L('الزقازيق', 'Zagazig'),
  address: L('العنوان قيد الاعتماد', 'Address pending confirmation'),
  phone: '—',
  whatsapp: '—',
  coords: [30.5877, 31.502]
},
{
  id: 'sample-3',
  placeholder: true,
  verified: false,
  name: L('نقطة توزيع — سجل تجريبي ٣', 'Distribution point — sample record 3'),
  governorate: L('البحيرة', 'Beheira'),
  city: L('دمنهور', 'Damanhour'),
  address: L('العنوان قيد الاعتماد', 'Address pending confirmation'),
  phone: '—',
  whatsapp: '—',
  coords: [31.0341, 30.4682]
},
{
  id: 'sample-4',
  placeholder: true,
  verified: false,
  name: L('نقطة توزيع — سجل تجريبي ٤', 'Distribution point — sample record 4'),
  governorate: L('المنيا', 'Minya'),
  city: L('المنيا', 'Minya'),
  address: L('العنوان قيد الاعتماد', 'Address pending confirmation'),
  phone: '—',
  whatsapp: '—',
  coords: [28.1099, 30.7503]
}];


export const governorates: Localized[] = [
L('القاهرة', 'Cairo'),
L('الجيزة', 'Giza'),
L('الشرقية', 'Sharqia'),
L('البحيرة', 'Beheira'),
L('الدقهلية', 'Dakahlia'),
L('المنوفية', 'Menoufia'),
L('الغربية', 'Gharbia'),
L('كفر الشيخ', 'Kafr El Sheikh'),
L('الفيوم', 'Fayoum'),
L('بني سويف', 'Beni Suef'),
L('المنيا', 'Minya'),
L('أسيوط', 'Assiut'),
L('سوهاج', 'Sohag'),
L('قنا', 'Qena'),
L('الإسكندرية', 'Alexandria')];