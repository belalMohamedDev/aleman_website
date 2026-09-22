# توثيق واجهة برمجة التطبيقات للوظائف والتقديم (Recruitment & Careers API Documentation)
## مجموعة شركات الإيمان — Al-Eman Group

واجهة برمجة تطبيقات (RESTful API) مخصصة لتطبيقات الهاتف المحمول (Mobile Applications: Flutter / React Native / iOS / Android) وتطبيقات الويب، تتيح استعراض الوظائف الشاغرة، وتفاصيلها، وتصفيتها، بالإضافة إلى التقديم الكامل عليها مع رفع الملفات ومتابعة حالة الطلبات.

---

## 1. الروابط الأساسية (Base URLs)

| البيئة (Environment) | المسار (Base URL) |
| :--- | :--- |
| **محلي (Localhost / XAMPP)** | `http://localhost/aleman/modules/recruitment/api_jobs.php` |
| **محاكي الأندرويد (Android Emulator)** | `http://10.0.2.2/aleman/modules/recruitment/api_jobs.php` |
| **محاكي iOS (iOS Simulator)** | `http://127.0.0.1/aleman/modules/recruitment/api_jobs.php` |
| **شبكة محلية (Local Wi-Fi Network)** | `http://192.168.1.X/aleman/modules/recruitment/api_jobs.php` |
| **السيرفر المباشر (Production Server)** | `https://your-domain.com/aleman/modules/recruitment/api_jobs.php` |

---

## 2. الترويسات العامة (General Headers)

- `Accept: application/json`
- `Content-Type: application/json` (في طلبات GET أو POST عبر JSON) أو `multipart/form-data` (عند رفع الملفات بالـ POST).
- **CORS Support:** الـ API مزوّد بترويسات الـ Cross-Origin Resource Sharing تلقائياً (`Access-Control-Allow-Origin: *`) ويدعم طلبات الـ Preflight (`OPTIONS`).

---

## 3. نقاط النهاية (API Endpoints)

---

### 1) قائمة الوظائف الشاغرة (List Jobs)
استرجاع قائمة الوظائف المنشورة المتاحة التي لم ينتهِ تاريخ التقديم عليها، مع دعم البحث، والفلترة، والترقيم.

- **Method:** `GET`
- **Endpoint:** `/modules/recruitment/api_jobs.php`

#### معلمات الاستعلام (Query Parameters):
| المعلمة (Parameter) | النوع | إلزامي؟ | القيمة الافتراضية | الوصف |
| :--- | :--- | :--- | :--- | :--- |
| `q` | String | لا | - | نص بحث في العنوان، الإدارة، الوصف، والمهارات. |
| `dept` أو `department` | String | لا | - | الفلترة حسب الإدارة (مثال: `إدارة الموارد البشرية`). |
| `loc` أو `location` | String | لا | - | الفلترة حسب الموقع / المحافظة (مثال: `اسيوط`, `الإسكندرية`). |
| `type` أو `employment_type` | String | لا | - | نوع الدوام (`Full-Time`, `Part-Time`, `Temporary`, `Contract`, `Internship`). |
| `work` أو `work_type` | String | لا | - | نمط العمل (`On-site`, `Remote`, `Hybrid`). |
| `exp` أو `experience` | String | لا | - | سنوات الخبرة (`0-2`, `3-5`, `6-10`, `10+`). |
| `featured` | Integer | لا | - | أرسل `1` لعرض الوظائف المميزة فقط. |
| `page` | Integer | لا | `1` | رقم الصفحة. |
| `limit` | Integer | لا | `20` | عدد العناصر في الصفحة الواحدة (الحد الأقصى 100). |
| `lang` | String | لا | `ar` | لغة العرض: `ar` (العربية) أو `en` (الإنجليزية). |

#### مثال على الطلب (cURL):
```bash
curl -X GET "http://localhost/aleman/modules/recruitment/api_jobs.php?q=موارد&page=1&limit=10" \
     -H "Accept: application/json"
```

#### الاستجابة الناجحة (200 OK):
```json
{
    "success": true,
    "message": "تم جلب قائمة الوظائف بنجاح",
    "meta": {
        "total": 2,
        "page": 1,
        "limit": 10,
        "total_pages": 1
    },
    "data": [
        {
            "id": 4,
            "job_code": "JOB-2026-0004",
            "title": "استيورد",
            "title_ar": "استيورد",
            "title_en": "Steward",
            "department": "إدارة الموارد البشرية",
            "section": "الخدمات",
            "location": "اسيوط",
            "employment_type": "Full-Time",
            "employment_type_label": "دوام كامل",
            "work_type": "On-site",
            "work_type_label": "من المقر",
            "vacancies": 3,
            "summary": "نبذة موجزة عن متطلبات الوظيفة...",
            "description": "الوصف الوظيفي المفصل...",
            "responsibilities": "المسؤوليات اليومية...",
            "requirements": "الشروط والمواصفات المطلوبة...",
            "qualifications": "دبلوم فني",
            "min_experience_years": 3,
            "max_experience_years": 5,
            "experience_label": "3 - 5 سنوات",
            "required_skills": "مهارات الضيافة والنظافة والسلامة المهنية",
            "preferred_skills": "شهادة صحية سارية",
            "salary": {
                "is_visible": false,
                "from": null,
                "to": null,
                "currency": "EGP"
            },
            "publish_date": "2026-07-14",
            "deadline": "2026-10-31",
            "status": "Published",
            "is_featured": true,
            "is_open": true,
            "share_url": "http://localhost/aleman/modules/recruitment/job.php?code=JOB-2026-0004",
            "web_apply_url": "http://localhost/aleman/modules/recruitment/public_apply.php?job=JOB-2026-0004",
            "created_at": "2026-07-14 17:34:10"
        }
    ]
}
```

---

### 2) تفاصيل وظيفة معينة (Job Details)
جلب كامل التفاصيل الخاصة بوظيفة محددة بواسطة معرّفها الرقمي (`id`) أو كود الوظيفة (`code`).

- **Method:** `GET`
- **Endpoint:** `/modules/recruitment/api_jobs.php?id={ID}` أو `?code={JOB_CODE}`

#### مثال على الطلب:
```bash
curl -X GET "http://localhost/aleman/modules/recruitment/api_jobs.php?id=4"
```

#### الاستجابة الناجحة (200 OK):
```json
{
    "success": true,
    "message": "تم جلب تفاصيل الوظيفة بنجاح",
    "data": {
        "id": 4,
        "job_code": "JOB-2026-0004",
        "title": "استيورد",
        "title_ar": "استيورد",
        "title_en": "Steward",
        "department": "إدارة الموارد البشرية",
        "section": "الخدمات",
        "location": "اسيوط",
        "employment_type": "Full-Time",
        "employment_type_label": "دوام كامل",
        "work_type": "On-site",
        "work_type_label": "من المقر",
        "vacancies": 3,
        "summary": "نبذة موجزة...",
        "description": "الوصف الكامل...",
        "responsibilities": "المسؤوليات...",
        "requirements": "المتطلبات...",
        "qualifications": "دبلوم فني",
        "min_experience_years": 3,
        "max_experience_years": 5,
        "experience_label": "3 - 5 سنوات",
        "required_skills": "مهارات الضيافة",
        "preferred_skills": "",
        "salary": {
            "is_visible": false,
            "from": null,
            "to": null,
            "currency": "EGP"
        },
        "publish_date": "2026-07-14",
        "deadline": "2026-10-31",
        "status": "Published",
        "is_featured": true,
        "is_open": true,
        "share_url": "http://localhost/aleman/modules/recruitment/job.php?code=JOB-2026-0004",
        "web_apply_url": "http://localhost/aleman/modules/recruitment/public_apply.php?job=JOB-2026-0004",
        "created_at": "2026-07-14 17:34:10"
    }
}
```

---

### 3) القوائم المرجعية للفلاتر والتقديم (Lookups / Filters)
توفر خيارات القوائم المنسدلة في التطبيق (المحافظات، المؤهلات، الموقف التجنيدي، الإدارات النشطة...) لتجنب كتابتها يدوياً في كود الموبايل.

- **Method:** `GET`
- **Endpoint:** `/modules/recruitment/api_jobs.php?action=lookups`

#### الاستجابة (200 OK):
```json
{
    "success": true,
    "message": "تم جلب القوائم المرجعية بنجاح",
    "data": {
        "departments": ["إدارة الموارد البشرية", "إدارة المعمل والجودة", "إدارة الإنتاج"],
        "locations": ["الإسكندرية", "اسيوط", "البحيرة"],
        "employment_types": [
            { "key": "Full-Time", "name_ar": "دوام كامل", "name_en": "Full-Time" },
            { "key": "Part-Time", "name_ar": "دوام جزئي", "name_en": "Part-Time" },
            { "key": "Temporary", "name_ar": "مؤقت", "name_en": "Temporary" },
            { "key": "Contract", "name_ar": "بعقد", "name_en": "Contract" },
            { "key": "Internship", "name_ar": "تدريب", "name_en": "Internship" }
        ],
        "work_types": [
            { "key": "On-site", "name_ar": "من المقر", "name_en": "On-site" },
            { "key": "Remote", "name_ar": "عن بُعد", "name_en": "Remote" },
            { "key": "Hybrid", "name_ar": "مختلط", "name_en": "Hybrid" }
        ],
        "qualifications": [
            "دكتوراه", "ماجستير", "بكالوريوس", "ليسانس", "معهد فني فوق متوسط", "دبلوم فني", "ثانوية عامة", "إعدادية", "بدون مؤهل"
        ],
        "marital_statuses": ["أعزب", "متزوج", "مطلق", "أرمل"],
        "military_statuses": ["معفى نهائياً", "معفى مؤقتاً", "أدى الخدمة العسكرية", "مؤجل", "غير مطلوب / أنثى"],
        "grades": ["امتياز", "جيد جداً مرتفع", "جيد جداً", "جيد", "مقبول"],
        "governorates": [
            "الإسكندرية", "القاهرة", "الجيزة", "البحيرة", "الغربية", "الشرقية", "الدقهلية", "القليوبية",
            "المنوفية", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "شمال سيناء", "جنوب سيناء",
            "بني سويف", "الفيوم", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح"
        ],
        "experience_levels": [
            { "key": "0-2", "label_ar": "حديث التخرج (0 - 2 سنة)", "label_en": "0-2 Years" },
            { "key": "3-5", "label_ar": "متوسط الخبرة (3 - 5 سنوات)", "label_en": "3-5 Years" },
            { "key": "6-10", "label_ar": "خبرة متقدمة (6 - 10 سنوات)", "label_en": "6-10 Years" },
            { "key": "10+", "label_ar": "خبير / إداري (10+ سنوات)", "label_en": "10+ Years" }
        ]
    }
}
```

---

### 4) تتبّع حالة الطلب (Track Application Status)
لتمكين المتقدمين من متابعة طلباتهم عبر التطبيق باستخدام رقم الطلب أو الرقم القومي.

- **Method:** `GET`
- **Endpoint:** `/modules/recruitment/api_jobs.php?action=track&app_number=APP-2026-0004`
- **أو:** `/modules/recruitment/api_jobs.php?action=track&national_id=29505151234567`

#### الاستجابة (200 OK):
```json
{
    "success": true,
    "message": "تم جلب بيانات الطلب بنجاح",
    "data": {
        "application_number": "APP-2026-0004",
        "applicant_name": "محمد أحمد محمود حسن",
        "applied_position": "استيورد",
        "application_date": "2026-09-21",
        "workflow_step": 1,
        "stage_name": "إنشاء الطلب",
        "status": "progress",
        "status_label": "قيد المراجعة والدراسة",
        "notes": "",
        "job_code": "JOB-2026-0004"
    }
}
```

---

### 5) التقديم على وظيفة (Apply for Job)
تسجيل طلب توظيف جديد وحفظ المرفقات وإرسال بريد تأكيد للمتقدم.

- **Method:** `POST`
- **Endpoint:** `/modules/recruitment/api_jobs.php`
- **Content-Type:** `multipart/form-data` (مفضل لرفع الملفات) أو `application/json`

#### جدول حقول التقديم (Parameters):

| الحقل (Key) | النوع | إلزامي؟ | الشروط والتفاصيل |
| :--- | :--- | :--- | :--- |
| `applicant_name` | String | **نعم** | الاسم كاملاً (ثلاثي أو رباعي مطابق للبطاقة). |
| `national_id` | String | **نعم** | الرقم القومي المصري (14 رقماً). يُفحص تاريخ الميلاد وعدم التكرار. |
| `phone` | String | **نعم** | رقم الهاتف (11 رقماً يبدأ بـ 01 أو رقم دولي صالح). |
| `email` | String | لا | البريد الإلكتروني لتأكيد استلام الطلب. |
| `governorate` | String | **نعم** | المحافظة (مثل: الإسكندرية). |
| `address` | String | **نعم** | العنوان التفصيلي. |
| `marital_status` | String | **نعم** | الحالة الاجتماعية (`أعزب`, `متزوج`, `مطلق`, `أرمل`). |
| `military_status` | String | **نعم** | الموقف التجنيدي (`أدى الخدمة العسكرية`, `معفى نهائياً`...). |
| `qualification` | String | **نعم** | المؤهل الدراسي (`بكالوريوس`, `دبلوم فني`...). |
| `qualification_type` | String | لا | التخصص (مطلوب للمؤهلات العليا). |
| `university` | String | لا | الجامعة / المعهد. |
| `graduation_year` | String | لا | سنة التخرج (مثل: `2022`). |
| `grade` | String | لا | التقدير (`امتياز`, `جيد جداً`...). |
| `job_id` | Integer | لا | معرّف الوظيفة المتقدم إليها. |
| `job_code` | String | لا | كود الوظيفة مثل `JOB-2026-0004` (بديل لـ `job_id`). |
| `applied_position` | String | لا | المسمى الوظيفي (يُحدد تلقائياً لو تم اختيار وظيفة). |
| `years_experience` | String | لا | سنوات الخبرة. |
| `is_driver` | Integer (0/1)| لا | هل يحمل رخصة قيادة؟ |
| `license_type` | String | لا | درجة الرخصة (`خاصة`, `مهنية ثالثة`...). |
| `is_smoker` | Integer (0/1)| لا | مدخن؟ (0 أو 1). |
| `has_surgeries` | Integer (0/1)| لا | خضع لعمليات جراحية؟ |
| `surgery_types` | String | لا | تفاصيل العمليات إن وجدت. |
| `has_relatives` | Integer (0/1)| لا | هل لديه أقارب بالشركة؟ |
| `relatives_info` | String | لا | أسماء الأقارب وصلة القرابة. |
| `experiences` | JSON String | لا | مصفوفة الخبرات: `[{"company":"شركة النيل","job":"محاسب","from":"2020","to":"2023"}]`. |
| `courses` | JSON String | لا | مصفوفة الدورات: `[{"name":"دورة PMP","date":"2022","duration":"شهر"}]`. |
| **`photo`** | File | لا | ملف الصورة الشخصية (JPG/PNG/WEBP بحد أقصى 5MB) أو `photo_base64`. |
| **`cv`** | File | لا | ملف السيرة الذاتية (PDF/DOC/DOCX بحد أقصى 10MB) أو `cv_base64`. |
| **`certs[]`** | Files Multi | لا | شهادات إضافية (PDF/JPG بحد أقصى 8MB للملف - حتى 6 ملفات). |

#### مثال على استجابة النجاح (201 Created):
```json
{
    "success": true,
    "message": "تم تقديم طلب التوظيف بنجاح",
    "data": {
        "application_id": 35,
        "application_number": "APP-2026-0035",
        "applicant_name": "محمد أحمد محمود حسن",
        "national_id": "29505151234567",
        "applied_position": "استيورد",
        "job_id": 4,
        "job_code": "JOB-2026-0004",
        "status": "progress",
        "workflow_step": 1,
        "stage_name": "إنشاء الطلب",
        "has_cv": true,
        "has_photo": true,
        "certs_count": 1,
        "created_at": "2026-09-21 10:23:40"
    }
}
```

#### أمثلة على استجابات الأخطاء (Error Responses):

1. **خطأ في التحقق من الحقول (422 Unprocessable Entity):**
```json
{
    "success": false,
    "message": "يرجى كتابة الاسم ثلاثياً أو رباعياً كما في بطاقة الرقم القومي. | الرقم القومي يجب أن يتكون من 14 رقماً.",
    "data": {
        "errors": [
            "يرجى كتابة الاسم ثلاثياً أو رباعياً كما في بطاقة الرقم القومي.",
            "الرقم القومي يجب أن يتكون من 14 رقماً."
        ]
    }
}
```

2. **الرقم القومي مسجل مسبقاً (409 Conflict):**
```json
{
    "success": false,
    "message": "هذا الرقم القومي مسجّل من قبل برقم طلب: APP-2026-0034",
    "data": {
        "application_number": "APP-2026-0034",
        "application_date": "2026-09-21"
    }
}
```

---

## 4. أمثلة برمجية لتطبيقات الموبايل (Code Examples)

### مثال Flutter / Dart (باستخدام مكتبة `dio`):

```dart
import 'dart:io';
import 'package:dio/dio.dart';

class RecruitmentService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://10.0.2.2/aleman/modules/recruitment/api_jobs.php', // للـ Emulator
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
  ));

  /// 1. جلب قائمة الوظائف
  Future<List<dynamic>> getJobs({String? search, String? department, int page = 1}) async {
    final response = await _dio.get('', queryParameters: {
      if (search != null && search.isNotEmpty) 'q': search,
      if (department != null && department.isNotEmpty) 'dept': department,
      'page': page,
    });
    if (response.data['success'] == true) {
      return response.data['data'];
    }
    throw Exception(response.data['message']);
  }

  /// 2. جلب تفاصيل وظيفة
  Future<Map<String, dynamic>> getJobDetails(int jobId) async {
    final response = await _dio.get('', queryParameters: {'id': jobId});
    return response.data['data'];
  }

  /// 3. جلب القوائم المرجعية
  Future<Map<String, dynamic>> getLookups() async {
    final response = await _dio.get('', queryParameters: {'action': 'lookups'});
    return response.data['data'];
  }

  /// 4. تتبع حالة الطلب
  Future<Map<String, dynamic>> trackApplication(String appNumberOrNid) async {
    final response = await _dio.get('', queryParameters: {
      'action': 'track',
      'track': appNumberOrNid,
    });
    return response.data['data'];
  }

  /// 5. التقديم على وظيفة مع رفع الملفات
  Future<Map<String, dynamic>> submitApplication({
    required String name,
    required String nationalId,
    required String phone,
    String? email,
    required String governorate,
    required String address,
    required String maritalStatus,
    required String militaryStatus,
    required String qualification,
    String? qualificationType,
    String? university,
    int? jobId,
    File? photoFile,
    File? cvFile,
  }) async {
    final formData = FormData.fromMap({
      'applicant_name': name,
      'national_id': nationalId,
      'phone': phone,
      'email': email ?? '',
      'governorate': governorate,
      'address': address,
      'marital_status': maritalStatus,
      'military_status': militaryStatus,
      'qualification': qualification,
      'qualification_type': qualificationType ?? '',
      'university': university ?? '',
      if (jobId != null) 'job_id': jobId,
      if (photoFile != null)
        'photo': await MultipartFile.fromFile(photoFile.path, filename: 'photo.jpg'),
      if (cvFile != null)
        'cv': await MultipartFile.fromFile(cvFile.path, filename: 'cv.pdf'),
    });

    final response = await _dio.post('', data: formData);
    return response.data;
  }
}
```

---

### مثال React Native / JavaScript (باستخدام `fetch`):

```javascript
const API_URL = 'http://10.0.2.2/aleman/modules/recruitment/api_jobs.php';

// جلب الوظائف
export async function fetchJobs(query = '', page = 1) {
  const url = `${API_URL}?q=${encodeURIComponent(query)}&page=${page}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  return await response.json();
}

// التقديم
export async function applyJob(applicationData, cvUri, photoUri) {
  const formData = new FormData();
  
  Object.keys(applicationData).forEach(key => {
    formData.append(key, applicationData[key]);
  });

  if (cvUri) {
    formData.append('cv', {
      uri: cvUri,
      type: 'application/pdf',
      name: 'resume.pdf',
    });
  }

  if (photoUri) {
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'personal_photo.jpg',
    });
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });

  return await response.json();
}
```
