import type { Localized } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

export const ui = {
  brand: {
    name: L('مؤسسة الإيمان للأعلاف', 'Aleman Foundation for Feed'),
    short: L('الإيمان', 'Aleman'),
    tagline: L('صناعة أعلاف مصرية بجودة شاملة', 'Egyptian feed manufacturing built on total quality')
  },
  nav: {
    home: L('الرئيسية', 'Home'),
    about: L('من نحن', 'About'),
    products: L('منتجاتنا', 'Products'),
    quality: L('الجودة', 'Quality'),
    articles: L('المقالات', 'Articles'),
    tools: L('أدوات المربي', 'Farmer Tools'),
    prices: L('أسعار الأعلاف', 'Feed Prices'),
    distributors: L('الموزعون', 'Distributors'),
    careers: L('الوظائف', 'Careers'),
    contact: L('تواصل معنا', 'Contact'),
    menu: L('القائمة', 'Menu'),
    close: L('إغلاق', 'Close'),
    language: L('اللغة', 'Language')
  },
  common: {
    readMore: L('اقرأ المزيد', 'Read more'),
    viewDetails: L('عرض التفاصيل', 'View details'),
    viewAll: L('عرض الكل', 'View all'),
    back: L('رجوع', 'Back'),
    search: L('بحث', 'Search'),
    all: L('الكل', 'All'),
    loading: L('جاري التحميل…', 'Loading…'),
    dataSoon: L('سيتم إضافة البيانات قريبًا', 'Data will be added soon'),
    placeholderTag: L('بيانات نائبة', 'Placeholder data'),
    demoTag: L('محتوى تجريبي', 'Demo content'),
    placeholderNote: L(
      'هذا السجل نموذج توضيحي للواجهة، وسيتم استبداله بالبيانات الرسمية للمؤسسة.',
      'This record is an interface placeholder and will be replaced with official company data.'
    ),
    noResultsTitle: L('لا توجد نتائج مطابقة', 'No matching results'),
    noResultsBody: L('جرّب تعديل كلمات البحث أو إعادة ضبط عوامل التصفية.', 'Try different keywords or reset the filters.'),
    reset: L('إعادة الضبط', 'Reset'),
    errorTitle: L('تعذّر عرض المحتوى', 'Content could not be displayed'),
    errorBody: L('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', 'Something went wrong. Please try again.'),
    retry: L('إعادة المحاولة', 'Retry'),
    required: L('هذا الحقل مطلوب', 'This field is required'),
    invalidEmail: L('يرجى إدخال بريد إلكتروني صحيح', 'Please enter a valid email address'),
    invalidPhone: L('يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number'),
    optional: L('اختياري', 'Optional'),
    sending: L('جاري الإرسال…', 'Sending…'),
    notPublished: L('غير منشور رسميًا', 'Not officially published')
  },
  home: {
    heroEyebrow: L('مؤسسة الإيمان للأعلاف', 'Aleman Foundation for Feed'),
    heroTitle: L('خبرة صناعية راسخة في تصنيع الأعلاف وتغذية الحيوان', 'Established industrial expertise in feed manufacturing and animal nutrition'),
    heroBody: L(
      'تُصر مؤسسة الإيمان على الجودة الشاملة في جميع مراحل عمليات التصنيع، بدءًا من اختيار المواد الخام، خلال عملية التصنيع بأكملها، وحتى نهاية عملية التعبئة عالية الجودة — من أجل تقديم قيمة أعلى لعملاء الإيمان الكرام.',
      'Aleman Foundation insists on total quality across every stage of manufacturing — from raw material selection, throughout the entire production process, to the end of high-quality packaging — in order to deliver greater value to its customers.'
    ),
    ctaPrimary: L('استكشف منتجاتنا', 'Explore our products'),
    ctaSecondary: L('تواصل معنا', 'Contact us'),
    heroImageAlt: L('مصنع أعلاف حديث ومزرعة دواجن ومواشي مع أكياس علف', 'Modern feed mill with poultry, cattle and stacked feed sacks'),
    trustTitle: L('لماذا الإيمان', 'Why Aleman'),
    trustSubtitle: L('مؤسسة صناعية زراعية مصرية تبني ثقتها على الجودة في كل مرحلة.', 'An Egyptian agro-industrial company that builds trust through quality at every stage.'),
    aboutTitle: L('من نحن', 'About us'),
    productsTitle: L('منتجاتنا', 'Our products'),
    productsSubtitle: L('تشكيلة أعلاف تغطي الدواجن والمواشي والأرانب والبط.', 'A feed range covering poultry, livestock, rabbits and ducks.'),
    qualityTitle: L('الجودة أولًا', 'Quality first'),
    qualitySubtitle: L('رحلة الجودة الشاملة من المادة الخام حتى المنتج النهائي.', 'The total-quality journey from raw material to finished product.'),
    articlesTitle: L('مركز المعرفة', 'Knowledge center'),
    articlesSubtitle: L('مقالات ونصائح لمربّي الدواجن والمواشي.', 'Articles and guidance for poultry and livestock farmers.'),
    ctaSectionTitle: L('هل تبحث عن علف يناسب قطيعك؟', 'Looking for the right feed for your flock?'),
    ctaSectionBody: L('فريق الإيمان جاهز لمساعدتك في اختيار المنتج المناسب لمرحلة التربية.', 'The Aleman team is ready to help you choose the right product for your production stage.')
  },
  trust: {
    experienceTitle: L('خبرة صناعية', 'Industrial experience'),
    experienceBody: L('خبرة طويلة في تصنيع الأعلاف وتغذية الحيوان داخل السوق المصري.', 'Long-standing experience in feed manufacturing and animal nutrition in the Egyptian market.'),
    qualityTitle: L('معمل تحليل العينات', 'Sample analysis laboratory'),
    qualityBody: L('معمل مجهّز بمعدات حديثة لضمان جودة مكونات العلف واختبار المنتجات النهائية.', 'A laboratory equipped with modern instruments to verify feed ingredients and test finished products.'),
    manufacturingTitle: L('تصنيع متكامل', 'Integrated manufacturing'),
    manufacturingBody: L('عمليات تصنيع منضبطة من الاستلام والخلط حتى التعبئة.', 'Controlled manufacturing operations from intake and mixing through to packaging.'),
    rangeTitle: L('أربعة قطاعات إنتاج', 'Four production segments'),
    rangeBody: L('أعلاف الدواجن، المواشي، الأرانب، والبط.', 'Poultry, livestock, rabbit and duck feed.'),
    packagingTitle: L('تعبئة عالية الجودة', 'High-quality packaging'),
    packagingBody: L('تعبئة تحافظ على خصائص العلف حتى وصوله إلى المزرعة.', 'Packaging that preserves feed properties until it reaches the farm.'),
    customersTitle: L('قيمة أعلى للعملاء', 'Greater customer value'),
    customersBody: L('هدف الجودة الشاملة هو تقديم قيمة أعلى لعملاء الإيمان الكرام.', 'The goal of total quality is to deliver greater value to Aleman customers.'),
    metricNote: L('الأرقام التفصيلية غير منشورة رسميًا حتى الآن.', 'Detailed figures are not officially published yet.')
  },
  products: {
    pageTitle: L('منتجاتنا', 'Our products'),
    pageSubtitle: L('اختر التصنيف المناسب لمزرعتك واستعرض تفاصيل كل منتج.', 'Choose the category that fits your farm and review each product in detail.'),
    searchPlaceholder: L('ابحث باسم المنتج…', 'Search by product name…'),
    resultsCount: L('منتج', 'products'),
    protein: L('نسبة البروتين', 'Protein'),
    stage: L('مرحلة التربية', 'Production stage'),
    packaging: L('التعبئة', 'Packaging'),
    category: L('التصنيف', 'Category'),
    tabOverview: L('نظرة عامة', 'Overview'),
    tabSpecs: L('المواصفات', 'Specifications'),
    tabIngredients: L('المكونات', 'Ingredients'),
    tabFeeding: L('جدول التغذية', 'Feeding guide'),
    detailCta: L('اطلب هذا المنتج', 'Request this product'),
    notFound: L('المنتج غير موجود', 'Product not found'),
    backToProducts: L('العودة إلى المنتجات', 'Back to products'),
    ingredientsNote: L('قائمة المكونات التفصيلية غير منشورة رسميًا لهذا المنتج.', 'A detailed ingredient list is not officially published for this product.'),
    feedingNote: L('جدول التغذية الرسمي غير متاح حاليًا لهذا المنتج.', 'The official feeding guide is not currently available for this product.'),
    amount: L('المعدل', 'Amount')
  },
  categories: {
    poultry: L('أعلاف الدواجن', 'Poultry feed'),
    livestock: L('أعلاف المواشي', 'Livestock feed'),
    rabbit: L('أعلاف الأرانب', 'Rabbit feed'),
    duck: L('أعلاف البط', 'Duck feed')
  },
  about: {
    pageTitle: L('من نحن', 'About us'),
    intro: L(
      'مؤسسة الإيمان للأعلاف مؤسسة مصرية متخصصة في تصنيع الأعلاف، تقوم فلسفتها على الجودة الشاملة في كل مرحلة من مراحل الإنتاج.',
      'Aleman Foundation is an Egyptian company specialized in feed manufacturing, built on a philosophy of total quality at every production stage.'
    ),
    identityTitle: L('هوية المؤسسة', 'Company identity'),
    identityBody: L(
      'نعمل على تصنيع أعلاف تغطي احتياجات الدواجن والمواشي والأرانب والبط، مع التزام ثابت بمعايير الجودة التي تتبناها المؤسسة في جميع خطوط الإنتاج.',
      'We manufacture feed covering the needs of poultry, livestock, rabbits and ducks, with a consistent commitment to the quality standards adopted across all production lines.'
    ),
    philosophyTitle: L('فلسفة الجودة', 'Quality philosophy'),
    philosophyBody: L(
      'تُصر شركة الإيمان على الجودة الشاملة في جميع مراحل عمليات التصنيع بدءًا من اختيار المواد الخام خلال عملية التصنيع بأكملها وحتى نهاية عملية التعبئة عالية الجودة.',
      'Aleman insists on total quality across all manufacturing stages, from raw material selection, throughout the entire production process, to the end of high-quality packaging.'
    ),
    labTitle: L('الفحص المعملي', 'Laboratory testing'),
    labBody: L(
      'تبدأ عملية الجودة الشاملة بإنشاء مختبر لتحليل العينات بأحدث معدات المختبرات لضمان جودة مكونات العلف واختبار المنتجات النهائية وفقًا لأعلى معايير الجودة.',
      'The total-quality process begins with a sample analysis laboratory equipped with modern instruments to verify feed ingredient quality and test finished products against the highest quality standards.'
    ),
    manufacturingTitle: L('التصنيع', 'Manufacturing'),
    manufacturingBody: L(
      'تمر المواد الخام بعمليات تصنيع منضبطة وصولًا إلى منتج نهائي متجانس يلائم مرحلة التربية المستهدفة.',
      'Raw materials pass through controlled manufacturing operations to produce a homogeneous final product suited to the targeted production stage.'
    ),
    packagingTitle: L('التعبئة', 'Packaging'),
    packagingBody: L(
      'تنتهي دورة الجودة بعملية تعبئة عالية الجودة تحافظ على خصائص المنتج حتى وصوله إلى المربّي.',
      'The quality cycle ends with a high-quality packaging process that preserves product properties until it reaches the farmer.'
    ),
    valueTitle: L('قيمة العميل', 'Customer value'),
    valueBody: L(
      'الهدف من هذه المنظومة هو تقديم قيمة أعلى لعملاء الإيمان الكرام.',
      'The purpose of this system is to deliver greater value to Aleman customers.'
    ),
    timelineTitle: L('مسيرة المؤسسة', 'Our journey'),
    timelineNote: L(
      'التواريخ التفصيلية لمسيرة المؤسسة غير منشورة رسميًا؛ المراحل التالية تصف تسلسل التطور دون سنوات مؤكدة.',
      'Detailed dates are not officially published; the stages below describe the sequence of development without confirmed years.'
    )
  },
  quality: {
    pageTitle: L('الجودة أولًا', 'Quality first'),
    pageSubtitle: L('ست مراحل متصلة تضمن ثبات جودة المنتج النهائي.', 'Six connected stages that keep final product quality consistent.'),
    stepLabel: L('المرحلة', 'Stage')
  },
  tools: {
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
      'الحساب رياضي عام ولا يمثل توصية تغذية رسمية من مؤسسة الإيمان. للحصول على إرشاد دقيق يرجى التواصل مع فريق المؤسسة.',
      'This is a generic mathematical calculation and does not represent official nutrition guidance from Aleman Foundation. Contact the team for precise recommendations.'
    ),
    totalGain: L('إجمالي الوزن المكتسب للقطيع', 'Total flock weight gain'),
    invalid: L('يرجى إدخال أرقام أكبر من صفر', 'Please enter numbers greater than zero')
  },
  prices: {
    pageTitle: L('أسعار الأعلاف', 'Feed prices'),
    pageSubtitle: L('لوحة أسعار جاهزة للربط بمصدر بيانات رسمي.', 'A price board prepared for connection to an official data source.'),
    lastUpdate: L('آخر تحديث: سيتم ربط البيانات قريبًا', 'Last updated: data connection coming soon'),
    notice: L(
      'لا تُعرض أي أسعار في هذه النسخة لتفادي عرض بيانات غير رسمية. الواجهة جاهزة لاستقبال الأسعار فور ربط مصدر البيانات.',
      'No prices are displayed in this version to avoid showing unofficial data. The interface is ready to receive prices once a data source is connected.'
    ),
    product: L('المنتج', 'Product'),
    unit: L('الوحدة', 'Unit'),
    price: L('السعر', 'Price'),
    change: L('التغير', 'Change')
  },
  distributors: {
    pageTitle: L('الموزعون', 'Distributors'),
    pageSubtitle: L('ابحث عن أقرب نقطة توزيع حسب المحافظة والمدينة.', 'Find the nearest distribution point by governorate and city.'),
    searchPlaceholder: L('ابحث باسم الموزع أو العنوان…', 'Search by distributor name or address…'),
    governorate: L('المحافظة', 'Governorate'),
    city: L('المدينة', 'City'),
    verified: L('موثّق', 'Verified'),
    call: L('اتصال', 'Call'),
    whatsapp: L('واتساب', 'WhatsApp'),
    mapTitle: L('خريطة نقاط التوزيع', 'Distribution map'),
    notice: L(
      'شبكة الموزعين الرسمية غير منشورة بعد؛ السجلات الظاهرة نماذج واجهة موسومة بوضوح.',
      'The official distributor network is not published yet; the records shown are clearly marked interface samples.'
    )
  },
  careers: {
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
    submittedBody: L('سيتواصل معك فريق الموارد البشرية عند توفر وظيفة مناسبة.', 'The HR team will contact you when a suitable role opens.')
  },
  articles: {
    pageTitle: L('مركز المعرفة', 'Knowledge center'),
    pageSubtitle: L('مقالات إرشادية عامة في تغذية الحيوان وإدارة المزرعة.', 'General guidance on animal nutrition and farm management.'),
    searchPlaceholder: L('ابحث في المقالات…', 'Search articles…'),
    minutes: L('دقائق قراءة', 'min read'),
    notFound: L('المقال غير موجود', 'Article not found'),
    backToArticles: L('العودة إلى المقالات', 'Back to articles'),
    editorialNote: L(
      'محتوى إرشادي عام لا يمثل بيانًا فنيًا رسميًا من المؤسسة.',
      'General guidance content; not an official technical statement from the company.'
    )
  },
  articleCategories: {
    'poultry-nutrition': L('تغذية الدواجن', 'Poultry nutrition'),
    'livestock-nutrition': L('تغذية المواشي', 'Livestock nutrition'),
    'rabbit-nutrition': L('تغذية الأرانب', 'Rabbit nutrition'),
    'duck-nutrition': L('تغذية البط', 'Duck nutrition'),
    'farmer-tips': L('نصائح للمربين', 'Farmer tips'),
    'company-news': L('أخبار الشركة', 'Company news')
  },
  contact: {
    pageTitle: L('تواصل معنا', 'Contact us'),
    pageSubtitle: L('اترك بياناتك وسيعاود فريق الإيمان التواصل معك.', 'Leave your details and the Aleman team will get back to you.'),
    name: L('الاسم', 'Full name'),
    phone: L('رقم الهاتف', 'Phone number'),
    governorate: L('المحافظة', 'Governorate'),
    requestType: L('نوع الطلب', 'Request type'),
    message: L('الرسالة', 'Message'),
    send: L('إرسال الرسالة', 'Send message'),
    sent: L('تم إرسال رسالتك', 'Your message was sent'),
    sentBody: L('شكرًا لتواصلك مع مؤسسة الإيمان للأعلاف.', 'Thank you for contacting Aleman Foundation.'),
    channels: L('قنوات التواصل', 'Contact channels'),
    locations: L('المواقع', 'Locations'),
    contactNotice: L(
      'أرقام الهاتف والبريد الرسمي وعناوين المواقع غير مؤكدة في هذه النسخة، وتظهر كحقول نائبة إلى حين اعتمادها.',
      'Official phone numbers, email and site addresses are not confirmed in this version and appear as placeholders until approved.'
    ),
    selectPlaceholder: L('اختر…', 'Select…')
  },
  requestTypes: {
    products: L('طلب منتجات', 'Product request'),
    inquiry: L('استفسار', 'General inquiry'),
    business: L('تواصل تجاري', 'Business partnership'),
    support: L('دعم فني', 'Technical support'),
    other: L('أخرى', 'Other')
  },
  footer: {
    about: L(
      'مؤسسة الإيمان للأعلاف — تصنيع أعلاف الدواجن والمواشي والأرانب والبط بمنظومة جودة شاملة.',
      'Aleman Foundation for Feed — manufacturing poultry, livestock, rabbit and duck feed under a total-quality system.'
    ),
    company: L('الشركة', 'Company'),
    products: L('المنتجات', 'Products'),
    resources: L('الموارد', 'Resources'),
    contact: L('تواصل معنا', 'Contact'),
    rights: L('جميع الحقوق محفوظة', 'All rights reserved'),
    social: L('تابعنا', 'Follow us'),
    socialNotice: L('روابط الحسابات الرسمية قيد الاعتماد.', 'Official account links are pending confirmation.')
  },
  floating: {
    whatsapp: L('محادثة واتساب', 'WhatsApp chat'),
    call: L('اتصل بنا', 'Call us'),
    top: L('العودة إلى الأعلى', 'Back to top')
  }
};