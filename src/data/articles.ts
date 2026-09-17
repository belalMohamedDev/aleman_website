import type { Article, ArticleCategoryId, Localized } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

export const articleCategories: ArticleCategoryId[] = [
'poultry-nutrition',
'livestock-nutrition',
'rabbit-nutrition',
'duck-nutrition',
'farmer-tips',
'company-news'];


const POULTRY_IMG = "/dd2a3da5-18fc-4b1f-8baf-a9936255e9be.webp";
const CATTLE_IMG = "/d7c5c45b-0184-4140-8538-27140639e15c.webp";
const RAW_IMG = "/cfe458d9-a06e-424e-9089-dbe2d0612755.webp";
const LAB_IMG = "/e89e15e1-9e1a-4084-9beb-18bbd3298ea5.webp";
const FACTORY_IMG = "/3e951125-4919-4762-a40a-229dd36ecc10.webp";

/**
 * General agricultural guidance content. It is editorial in nature and is not
 * presented as an official technical statement by the company.
 */
export const articles: Article[] = [
{
  slug: 'broiler-starter-basics',
  category: 'poultry-nutrition',
  date: '2026-06-18',
  readingMinutes: 5,
  image: POULTRY_IMG,
  title: L('أساسيات تغذية الدواجن في مرحلة البادئ', 'The basics of poultry nutrition in the starter stage'),
  excerpt: L(
    'مرحلة البادئ تحدد إلى حد كبير أداء القطيع لاحقًا؛ إليك أهم النقاط العملية في إدارة العلف والمياه خلال الأيام الأولى.',
    'The starter stage largely determines later flock performance. Here are the practical essentials of feed and water management in the first days.'
  ),
  body: [
  L(
    'تعتمد مرحلة البادئ على توفير علف متجانس سهل التناول مع إتاحة المياه النظيفة بشكل دائم، لأن استهلاك العلف في الأيام الأولى يرتبط مباشرة بنمو الجهاز الهضمي.',
    'The starter stage relies on a homogeneous, easy-to-consume feed alongside constant access to clean water, because early feed intake is directly linked to digestive system development.'
  ),
  L(
    'يفضّل توزيع العلف على وجبات متقاربة ومراقبة المعالف لتفادي الفقد، مع متابعة درجة حرارة العنبر لأنها تؤثر على معدل الاستهلاك.',
    'Distribute feed across frequent meals and monitor feeders to avoid waste, while tracking house temperature since it affects intake rate.'
  ),
  L(
    'تسجيل استهلاك العلف والوزن أسبوعيًا يساعد على حساب معامل التحويل الغذائي ومقارنته عبر الدورات المختلفة.',
    'Recording feed intake and weight weekly helps you calculate the feed conversion ratio and compare it across cycles.'
  )]

},
{
  slug: 'dairy-ration-management',
  category: 'livestock-nutrition',
  date: '2026-05-30',
  readingMinutes: 6,
  image: CATTLE_IMG,
  title: L('إدارة عليقة الأبقار الحلابة', 'Managing rations for dairy cattle'),
  excerpt: L(
    'ثبات العليقة وتوقيت التقديم من أهم العوامل المؤثرة على إنتاج اللبن واستقرار الحالة الصحية للقطيع.',
    'Ration consistency and feeding timing are among the strongest factors affecting milk output and herd health stability.'
  ),
  body: [
  L(
    'التغيير المفاجئ في مكونات العليقة قد يؤثر على كفاءة الكرش، لذلك يُنصح بالانتقال التدريجي على مدى عدة أيام.',
    'Sudden changes in ration composition can disturb rumen efficiency, so a gradual transition over several days is recommended.'
  ),
  L(
    'توفير مساحة كافية على مصطبة العلف يقلل التزاحم ويمنح الحيوانات الأقل سيطرة فرصة متساوية في التغذية.',
    'Adequate feed-bunk space reduces crowding and gives less dominant animals an equal chance to feed.'
  )]

},
{
  slug: 'rabbit-farm-feeding',
  category: 'rabbit-nutrition',
  date: '2026-05-12',
  readingMinutes: 4,
  image: RAW_IMG,
  title: L('تغذية الأرانب: نقاط عملية في المزرعة', 'Rabbit feeding: practical points on the farm'),
  excerpt: L(
    'الأرانب حساسة لتغير العلف وجودة التخزين؛ متابعة بسيطة يوميًا تقلل المشكلات الهضمية.',
    'Rabbits are sensitive to feed changes and storage quality; simple daily monitoring reduces digestive problems.'
  ),
  body: [
  L(
    'يجب تخزين العلف في مكان جاف وجيد التهوية بعيدًا عن الرطوبة المباشرة للحفاظ على تماسك المكعبات.',
    'Store feed in a dry, well-ventilated place away from direct moisture to keep pellets intact.'
  ),
  L(
    'مراقبة كمية المتبقي في المعالف يوميًا تعطي مؤشرًا مبكرًا على أي تغير في حالة القطيع.',
    'Checking leftover feed daily provides an early indicator of any change in herd condition.'
  )]

},
{
  slug: 'duck-house-management',
  category: 'duck-nutrition',
  date: '2026-04-27',
  readingMinutes: 4,
  image: POULTRY_IMG,
  title: L('إدارة تغذية البط في العنابر', 'Managing duck feeding in production houses'),
  excerpt: L(
    'البط يستهلك كميات أكبر من المياه مقارنة بالدواجن؛ إدارة المعالف والمساقي تؤثر مباشرة على كفاءة العلف.',
    'Ducks consume more water than chickens; feeder and drinker management directly affects feed efficiency.'
  ),
  body: [
  L(
    'الفصل بين منطقة الشرب ومنطقة العلف يقلل بلل العلف وفقده، ويحافظ على نظافة الفرشة.',
    'Separating drinking and feeding areas reduces feed wetting and waste, and keeps litter cleaner.'
  )]

},
{
  slug: 'feed-storage-tips',
  category: 'farmer-tips',
  date: '2026-04-08',
  readingMinutes: 3,
  image: FACTORY_IMG,
  title: L('نصائح لتخزين الأعلاف في المزرعة', 'Tips for storing feed on the farm'),
  excerpt: L(
    'التخزين السليم يحافظ على قيمة العلف الغذائية ويمنع الفقد؛ خطوات بسيطة تصنع فرقًا واضحًا.',
    'Proper storage preserves nutritional value and prevents loss; simple steps make a clear difference.'
  ),
  body: [
  L(
    'ارفع الأكياس عن الأرض على منصات خشبية، واترك مسافة عن الجدران للسماح بالتهوية.',
    'Raise sacks off the floor on wooden pallets and leave a gap from the walls to allow ventilation.'
  ),
  L(
    'اتبع مبدأ الوارد أولًا يصرف أولًا لتفادي بقاء كميات قديمة في المخزن.',
    'Follow a first-in first-out approach to avoid old stock sitting in the store.'
  )]

},
{
  slug: 'quality-in-every-stage',
  category: 'company-news',
  date: '2026-03-19',
  readingMinutes: 3,
  image: LAB_IMG,
  title: L('الجودة الشاملة في كل مرحلة من مراحل التصنيع', 'Total quality at every manufacturing stage'),
  excerpt: L(
    'منظومة الجودة في مؤسسة الإيمان تبدأ من اختيار المواد الخام وتستمر حتى نهاية عملية التعبئة.',
    'The quality system at Aleman Foundation starts with raw material selection and continues to the end of packaging.'
  ),
  body: [
  L(
    'تُصر مؤسسة الإيمان على الجودة الشاملة في جميع مراحل عمليات التصنيع بدءًا من اختيار المواد الخام خلال عملية التصنيع بأكملها وحتى نهاية عملية التعبئة عالية الجودة.',
    'Aleman Foundation insists on total quality across all manufacturing stages, from raw material selection, throughout the entire production process, to the end of high-quality packaging.'
  ),
  L(
    'تبدأ عملية الجودة الشاملة بإنشاء مختبر لتحليل العينات بأحدث معدات المختبرات لضمان جودة مكونات العلف واختبار المنتجات النهائية.',
    'The total-quality process begins with a sample analysis laboratory equipped with modern instruments to verify feed ingredient quality and test finished products.'
  )]

}];


export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}