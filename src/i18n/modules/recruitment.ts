import { L } from '../utils';

export const recruitment = {
  portalTitle: L('بوابة التوظيف', 'Recruitment Portal'),
  careersHeading: L('الوظائف والفرص الشاغرة', 'Careers & Open Vacancies'),
  careersSubtitle: L(
    'استعرض الشواغر المتاحة في مصانعنا ومعاملنا ومكاتبنا وقدم طلبك مباشرة إلكترونياً.',
    'Explore open vacancies across our factories, laboratories, and offices and submit your application online.'
  ),
  searchPlaceholder: L('ابحث بالمسمى الوظيفي أو الكود…', 'Search by job title or code…'),
  searchPlaceholderCareers: L('ابحث بالمسمى أو القسم...', 'Search jobs or title...'),
  trackApplicationBtn: L('متابعة حالة طلب سابق', 'Track Application Status'),
  trackApplicationShort: L('متابعة حالة طلب', 'Track Application'),
  generalApplyPrompt: L('لم تجد الوظيفة المناسبة؟ انضم إلى قاعدة الكفاءات', 'Didn’t find the right role? Join our talent pool'),
  generalApplyBtn: L('تقديم طلب عام', 'Submit General Application'),
  allDepartments: L('جميع الأقسام', 'All Departments'),
  allTypes: L('كافة أنواع التوظيف', 'All Employment Types'),
  allTypesFilter: L('نوع الدوام: الكل', 'All Types'),
  clearFilters: L('إلغاء الفلاتر', 'Clear Filters'),
  retryBtn: L('إعادة المحاولة', 'Retry'),
  connErrorTitle: L('تعذر جلب الوظائف', 'Connection Error'),
  noJobsFound: L('لا توجد وظائف مطابقة للبحث حالياً', 'No vacancies match your criteria currently'),
  noJobsFoundDesc: L(
    'جرّب تعديل كلمات البحث أو تصفح قسم آخر، أو قدّم في قاعدة الكفاءات العامة.',
    'Try adjusting your search filters or submit your resume into our talent pool.'
  ),
  tryDifferentFilters: L('جرب تغيير معايير البحث أو تصفح كافة الإدارات', 'Try different search keywords or view all departments'),
  viewAllJobs: L('عرض جميع الوظائف', 'View All Jobs'),
  submitToTalentPool: L('تقديم في قاعدة الكفاءات', 'Submit to Talent Pool'),
  trackExistingTitle: L('متابعة طلب توظيف سابق', 'Track Existing Application'),
  trackExistingDesc: L(
    'هل قدمت على إحدى وظائفنا سابقاً؟ استعلم عن مرحلة طلبك برقم الطلب أو الرقم القومي.',
    'Already applied? Check your application stage anytime using your application number or National ID.'
  ),
  trackStatusBtn: L('الاستعلام عن حالة الطلب', 'Track Application Status'),
  applicationTipsTitle: L('إرشادات ونصائح للتقديم', 'Application Tips'),
  tip1: L('تأكد من كتابة الاسم ثلاثياً أو رباعياً والرقم القومي بدقة (14 رقماً).', 'Enter full name and exact 14-digit National ID.'),
  tip2: L('يُفضل إرفاق السيرة الذاتية بصيغة PDF لتسهيل المراجعة الفنية.', 'Attach your resume in PDF format.'),
  tip3: L('احفظ رقم الطلب (APP-XXXX) بعد الإرسال لمتابعة مراحله.', 'Save your Application ID to track its status.'),
  generalAppTitle: L('طلب توظيف عام (قاعدة الكفاءات)', 'General Application (Talent Pool)'),
  generalAppSummary: L(
    'التقديم المباشر في قاعدة كفاءات مجموعة شركات الإيمان للتواصل عند توفر شواغر مناسبة.',
    'Direct submission into Al-Eman talent pool for future suitable vacancies.'
  ),

  // JobCard
  openPosition: L('وظيفة شاغرة', 'Open Position'),
  alemanGroup: L('مجموعة شركات الإيمان', 'Al-Eman Group'),
  egyptLocation: L('جمهورية مصر العربية', 'Egypt'),
  fullTime: L('دوام كامل', 'Full-Time'),
  onSite: L('من المقر', 'On-site'),
  defaultJobSummary: L('فرصة مهنية مميزة ضمن كوادر مجموعة شركات الإيمان وفق أحدث المعايير المهنية.', 'An exceptional career opportunity within Al-Eman Group.'),
  linkCopied: L('تم نسخ رابط الوظيفة بنجاح', 'Job link copied to clipboard'),
  linkCopyFailed: L('فشل نسخ الرابط', 'Failed to copy link'),
  shareJob: L('مشاركة رابط الوظيفة', 'Share job link'),
  vacanciesAvailable: L('شواغر متاحة', 'openings'),
  keyResponsibilities: L('أبرز المهام والمسؤوليات:', 'Key Responsibilities:'),
  deadlineLabel: L('آخر موعد للتقديم:', 'Deadline:'),
  applicationsOpen: L('التقديم متاح حالياً', 'Applications Open'),
  applyNow: L('تقديم طلب الآن', 'Apply Now'),
  applyNowBtn: L('التقديم على هذه الوظيفة', 'Apply for this Role'),
  jobCodeLabel: L('كود الوظيفة:', 'Job Code:'),
  responsibilitiesHeading: L('المسؤوليات والمهام الوظيفية', 'Responsibilities & Key Duties'),

  // Application Modal
  officialApplicationBadge: L('طلب توظيف رسمي', 'Job Application'),
  modalHeading: L('نموذج التقديم للوظيفة', 'Job Application Form'),
  personalAndContactInfo: L('البيانات الشخصية والاتصال', 'Personal & Contact Information'),
  applicantNameLabel: L('الاسم بالكامل (ثلاثي أو رباعي)', 'Full Name (3 or 4 parts)'),
  namePlaceholder: L('مثال: أحمد محمد علي محمود', 'Full Name (3 or 4 parts)'),
  nationalIdLabel: L('الرقم القومي (14 رقماً)', 'National ID (14 digits)'),
  nationalIdPlaceholder: L('29801010101234', '14-digit National ID'),
  phoneLabel: L('رقم الهاتف المحمول', 'Mobile Phone Number'),
  emailLabel: L('البريد الإلكتروني', 'Email Address'),
  governorateLabel: L('المحافظة', 'Governorate'),
  addressLabel: L('العنوان بالتفصيل', 'Detailed Address'),
  detailedAddress: L('العنوان بالتفصيل', 'Detailed Address'),
  addressPlaceholder: L('الشارع / المنطقة / المدينة', 'Street / Area / City'),
  maritalStatusLabel: L('الحالة الاجتماعية', 'Marital Status'),
  militaryStatusLabel: L('الموقف من التجنيد', 'Military Service Status'),
  educationAndExperience: L('المؤهل الدراسي والخبرة', 'Education & Experience'),
  qualificationLabel: L('المؤهل الدراسي', 'Educational Qualification'),
  qualificationTypeLabel: L('التخصص الدراسي / الكلية', 'Major / Field of Study'),
  specializationPlaceholder: L('مثال: كيمياء، هندسة، تجارة', 'e.g. Chemistry, Engineering'),
  universityLabel: L('الجامعة / المعهد', 'University / Institute'),
  universityPlaceholder: L('اسم الجامعة أو المعهد', 'University name'),
  yearsExperienceLabel: L('سنوات الخبرة العملية', 'Years of Experience'),
  yearsExpPlaceholder: L('مثال: 3 سنوات', 'e.g. 3 years'),
  attachmentsAndResume: L('المرفقات والسيرة الذاتية', 'Attachments & Resume'),
  notesLabel: L('نبذة تعريفية أو ملاحظات إضافية', 'Cover Letter / Additional Notes'),
  uploadCvLabel: L('رفع السيرة الذاتية (PDF أو DOCX - حتى 10MB)', 'Upload CV (PDF or DOCX - up to 10MB)'),
  uploadCvBtn: L('رفع السيرة الذاتية', 'Upload CV File'),
  removeFile: L('حذف الملف', 'Remove file'),
  removePhoto: L('حذف الصورة', 'Remove photo'),
  uploadPhotoLabel: L('صورة شخصية حديثة (اختياري - JPG أو PNG)', 'Recent Photo (Optional - JPG or PNG)'),
  uploadPhotoBtn: L('إرفاق صورة شخصية', 'Upload Photo'),
  photoOptional: L('صورة شخصية (اختياري)', 'Personal Photo (Optional)'),
  additionalNotesPlaceholder: L('أي مهارات إضافية أو ملاحظات تود ذكرها...', 'Additional notes or skills...'),
  cancelBtn: L('إلغاء', 'Cancel'),
  submitApplicationBtn: L('إرسال طلب التقديم', 'Submit Application'),
  submittingApplication: L('جاري إرسال الطلب…', 'Submitting…'),

  // Application Success
  appSuccessHeading: L('تم استلام طلب التوظيف بنجاح!', 'Application Received Successfully!'),
  appSuccessBody: L(
    'تم تسجيل طلبك في نظام التوظيف لمجموعة شركات الإيمان. يرجى الاحتفاظ برقم الطلب لمتابعة حالته.',
    'Your application has been registered in Aleman recruitment system. Please retain your application number for tracking.'
  ),
  appNumberLabel: L('رقم طلبك:', 'Your Application Number:'),
  yourAppNoTitle: L('رقم طلب التوظيف الخاص بك', 'Your Application Number'),
  copyAppNumber: L('نسخ رقم الطلب', 'Copy Application Number'),
  copiedShort: L('تم النسخ', 'Copied'),
  copyShort: L('نسخ', 'Copy'),
  saveAppNoHint: L('احتفظ بهذا الرقم لتتمكن من متابعة وتتبع حالة طلبك لاحقاً', 'Save this number to track your application status anytime'),
  closeModal: L('إغلاق النافذة', 'Close'),

  // Tracking Modal
  trackModalTitle: L('متابعة حالة طلب التوظيف', 'Track Application Status'),
  trackQueryLabel: L('رقم الطلب أو الرقم القومي للمتقدم', 'Application Number or National ID'),
  trackQueryHeading: L('رقم الطلب أو الرقم القومي للمتقدم', 'Application Number or National ID'),
  trackQueryPlaceholder: L('مثال: APP-2026-0004 أو 2980101...', 'e.g. APP-2026-0004 or 14-digit National ID'),
  trackAppNoOrNidPlaceholder: L('مثال: APP-2026-0004 أو 2980101...', 'e.g. APP-2026-0004 or 14-digit National ID'),
  trackHint: L(
    'يمكنك الاستعلام باستخدام كود الطلب المستلم بعد التقديم، أو الرقم القومي للمتقدم.',
    'You can search using the application code received upon submission, or the applicant National ID.'
  ),
  trackSearchBtn: L('استعلام', 'Search'),
  trackBtn: L('بحث', 'Search'),
  searchingBtn: L('جاري البحث…', 'Searching…'),
  noResultsFound: L('لم يتم العثور على نتائج', 'No results found'),
  applicantDataHeading: L('بيانات المتقدم', 'Applicant Information'),
  appliedJobLabel: L('الوظيفة المتقدم لها:', 'Applied Role:'),
  submissionDateLabel: L('تاريخ تقديم الطلب:', 'Submission Date:'),
  statusLabel: L('حالة الطلب الحالية:', 'Current Status:'),
  appliedOn: L('تاريخ التقديم:', 'Applied on:'),
  currentStage: L('المرحلة الحالية:', 'Stage:'),
  hrNotes: L('ملاحظات مسؤولي التوظيف:', 'HR Notes:'),

  // Why Us
  whyUsHeading: L('لماذا تبدأ مسيرتك المهنية في الإيمان؟', 'Why Build Your Career at Al-Eman?'),
  whyUsSubtitle: L(
    'نوفر لك بيئة مثالية تجمع بين الخبرة الصناعية العميقة وفرص التطور والتميز المستمر',
    'We provide an ideal environment combining deep industrial expertise with continuous growth'
  ),
  adv1Title: L('صرح صناعي رائد ومستقر', 'Leading & Stable Industrial Pioneer'),
  adv1Desc: L(
    'العمل ضمن كيان صناعي عريق يضم مجمعات إنتاجية عملاقة وخبرة تتجاوز 33 عاماً في قيادة وتطوير صناعة الأعلاف بمصر.',
    'Working within an established industrial entity featuring massive production complexes and over 33 years of experience in feeds.'
  ),
  adv2Title: L('أحدث التقنيات والمعامل المتطورة', 'Cutting-Edge Technologies & Advanced Labs'),
  adv2Desc: L(
    'تجهيزات أوروبية وسويسرية متقدمة ومعامل مراقبة جودة معتمدة تمنحك خبرة تطبيقية دقيقة بمعايير دولية (ISO).',
    'Advanced European and Swiss equipment and accredited quality control laboratories providing practical expertise with ISO standards.'
  ),
  adv3Title: L('بيئة عمل آمنة ومزايا وظيفية عادلة', 'Safe Work Environment & Fair Benefits'),
  adv3Desc: L(
    'التزام مطلق باشتراطات السلامة والصحة المهنية، مع توفير منظومة أجور وتأمين صحي واجتماعي ومكافآت تقديرية للمتميزين.',
    'Absolute commitment to occupational safety and health standards, comprehensive healthcare, social insurance, and incentive systems.'
  ),

  // Process
  processHeading: L('مراحل الانضمام إلى فريقنا', 'Our Hiring Journey'),
  processSubtitle: L(
    'خطوات واضحة ومنظمة تضمن تقييم كل كفاءة بكل نزاهة واحترافية',
    'Structured milestones ensuring fair and professional evaluation'
  ),
  step1Title: L('التقديم الإلكتروني', 'Online Application'),
  step1Desc: L(
    'اختر الوظيفة المناسبة واملأ استمارة التقديم بدقة مع إرفاق السيرة الذاتية المحدثة بصيغة PDF.',
    'Select the suitable role, fill out the form accurately, and attach your updated CV in PDF.'
  ),
  step2Title: L('الفرز والتقييم الفني', 'Screening & Technical Review'),
  step2Desc: L(
    'يقوم فريق الموارد البشرية واللجنة الفنية بمراجعة المؤهلات والخبرات ومطابقتها للمتطلبات الوظيفية.',
    'Our HR team and technical committee review qualifications and experience against job requirements.'
  ),
  step3Title: L('المقابلة الشخصية', 'Interviews & Assessments'),
  step3Desc: L(
    'التواصل مع المرشحين المؤهلين لإجراء المقابلات الفنية والشخصية واختبارات الجدارات المعملية والميدانية.',
    'Qualified candidates are contacted for technical and behavioral interviews and field competency assessments.'
  ),
  step4Title: L('العرض وبدء الرحلة', 'Job Offer & Onboarding'),
  step4Desc: L(
    'تقديم العرض الوظيفي الرسمي، واستكمال مسوغات التعيين، والبدء في برنامج التهيئة والانضمام لأسرة الإيمان.',
    'Official job offer submission, completion of hiring documentation, and commencing the onboarding program.'
  ),

  // Validation errors
  errNameParts: L('يرجى كتابة الاسم ثلاثياً أو رباعياً', 'Please enter full name (3 or 4 parts)'),
  errNationalId14: L('الرقم القومي يجب أن يتكون من 14 رقماً', 'National ID must be exactly 14 digits'),
  errValidPhone: L('يرجى إدخال رقم هاتف محمول صالح', 'Please enter a valid mobile number'),
  errValidEmail: L('صيغة البريد الإلكتروني غير صحيحة', 'Invalid email address format'),
  errCvRequired: L('يرجى إرفاق السيرة الذاتية', 'Please attach your CV'),
  errCvFormat: L('ملف السيرة الذاتية يجب أن يكون PDF أو Word', 'CV file must be a PDF or Word document'),
  errCvSize: L('حجم ملف السيرة الذاتية يجب ألا يتجاوز 10 ميجابايت', 'CV file size must not exceed 10MB'),
  errPhotoFormat: L('صيغة الصورة يجب أن تكون JPG أو PNG', 'Photo format must be JPG or PNG'),
  errPhotoSize: L('حجم الصورة يجب ألا يتجاوز 5 ميجابايت', 'Photo size must not exceed 5MB'),
};
