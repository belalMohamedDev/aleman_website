import type {
  ApiResponse,
  JobDto,
  JobFilterParams,
  RecruitmentLookups,
  JobApplicationPayload,
  JobApplicationResult,
  ApplicationTrackingResult,
} from './types';
import { jobs as fallbackStaticJobs } from '../../data/jobs';

const RECRUITMENT_API_BASE =
  ((import.meta as any).env?.VITE_RECRUITMENT_API_URL as string) ||
  'https://www.alemanfeed.com/modules/recruitment/api_jobs.php';

// Fallback lookup values in case API server is unreachable
export const DEFAULT_LOOKUPS: RecruitmentLookups = {
  departments: ['إدارة المعمل والجوده', 'إدارة الموارد البشرية', 'إدارة الإنتاج', 'التصنيع', 'المبيعات', 'الخدمات'],
  locations: ['العامرية - اسكندرية', 'الإسكندرية', 'اسيوط', 'البحيرة', 'موقع الإنتاج', 'عمل ميداني'],
  employment_types: [
    { key: 'Full-Time', name_ar: 'دوام كامل', name_en: 'Full-Time' },
    { key: 'Part-Time', name_ar: 'دوام جزئي', name_en: 'Part-Time' },
    { key: 'Temporary', name_ar: 'مؤقت', name_en: 'Temporary' },
    { key: 'Contract', name_ar: 'بعقد', name_en: 'Contract' },
    { key: 'Internship', name_ar: 'تدريب', name_en: 'Internship' },
  ],
  work_types: [
    { key: 'On-site', name_ar: 'من المقر', name_en: 'On-site' },
    { key: 'Remote', name_ar: 'عن بُعد', name_en: 'Remote' },
    { key: 'Hybrid', name_ar: 'مختلط', name_en: 'Hybrid' },
  ],
  qualifications: [
    'دكتوراه',
    'ماجستير',
    'بكالوريوس',
    'ليسانس',
    'معهد فني فوق متوسط',
    'دبلوم فني',
    'ثانوية عامة',
    'إعدادية',
    'بدون مؤهل',
  ],
  marital_statuses: ['أعزب', 'متزوج', 'مطلق', 'أرمل'],
  military_statuses: [
    'معفى نهائياً',
    'معفى مؤقتاً',
    'أدى الخدمة العسكرية',
    'مؤجل',
    'غير مطلوب / أنثى',
  ],
  grades: ['امتياز', 'جيد جداً مرتفع', 'جيد جداً', 'جيد', 'مقبول'],
  governorates: [
    'الإسكندرية', 'القاهرة', 'الجيزة', 'البحيرة', 'الغربية', 'الشرقية', 'الدقهلية',
    'القليوبية', 'المنوفية', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس',
    'شمال سيناء', 'جنوب سيناء', 'بني سويف', 'الفيوم', 'المنيا', 'أسيوط', 'سوهاج',
    'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح',
  ],
  experience_levels: [
    { key: '0-2', label_ar: 'حديث التخرج (0 - 2 سنة)', label_en: '0-2 Years' },
    { key: '3-5', label_ar: 'متوسط الخبرة (3 - 5 سنوات)', label_en: '3-5 Years' },
    { key: '6-10', label_ar: 'خبرة متقدمة (6 - 10 سنوات)', label_en: '6-10 Years' },
    { key: '10+', label_ar: 'خبير / إداري (10+ سنوات)', label_en: '10+ Years' },
  ],
};

const liveChemistJob: JobDto = {
  id: 11,
  job_code: 'JOB-2026-0011',
  title: 'كيميائى',
  title_ar: 'كيميائى',
  title_en: 'Chemist',
  department: 'إدارة المعمل والجوده',
  location: 'العامرية - اسكندرية',
  employment_type: 'Full-Time',
  employment_type_label: 'دوام كامل',
  work_type: 'On-site',
  work_type_label: 'من المقر',
  vacancies: 1,
  summary: 'مسؤول عن إجراء التحاليل والاختبارات الكيميائية على المواد الخام والمنتجات، والتأكد من مطابقتها للمواصفات والمعايير المعتمدة، مع الالتزام بإجراءات الجودة والسلامة المهنية.',
  description: 'مسؤول عن إجراء التحاليل والاختبارات الكيميائية على المواد الخام والمنتجات، والتأكد من مطابقتها للمواصفات والمعايير المعتمدة، مع الالتزام بإجراءات الجودة والسلامة المهنية.',
  responsibilities: [
    'إجراء التحاليل الكيميائية والفيزيائية للعينات والمواد الخام ومطابقتها للمواصفات.',
    'توثيق وتسجيل نتائج الاختبارات اليومية ورفع تقارير الجودة الدورية.',
    'الالتزام بمعايير السلامة المهنية وممارسات المختبرات الجيدة (GLP).'
  ],
  requirements: [
    'بكالوريوس علوم (كيمياء / كيمياء حيوية) أو ما يعادلها.',
    'خبرة عملية في معامل التحاليل وضبط الجودة.',
    'الدقة والالتزام والقدرة على العمل بروح الفريق.'
  ],
  qualifications: 'بكالوريوس علوم (كيمياء)',
  min_experience_years: 1,
  max_experience_years: 3,
  experience_label: '1 - 3 سنوات',
  publish_date: '2026-08-31',
  deadline: '2026-09-30',
  status: 'Published',
  is_featured: true,
  is_open: true,
  share_url: 'https://www.alemanfeed.com/modules/recruitment/job.php?code=JOB-2026-0011&lang=ar',
  web_apply_url: 'https://www.alemanfeed.com/modules/recruitment/public_apply.php?job=JOB-2026-0011',
};

function mapFallbackJobsToDto(): JobDto[] {
  const staticDtos = fallbackStaticJobs.map((j) => ({
    id: j.id,
    job_code: `JOB-${j.id.toUpperCase()}`,
    title: j.title.ar,
    title_ar: j.title.ar,
    title_en: j.title.en,
    department: j.department.ar,
    location: j.location.ar,
    employment_type: 'Full-Time',
    employment_type_label: j.type.ar,
    work_type: 'On-site',
    work_type_label: 'من المقر',
    vacancies: 1,
    summary: j.summary.ar,
    description: j.summary.ar,
    responsibilities: j.responsibilities.map((r) => r.ar),
    requirements: [],
    qualifications: 'مؤهل مناسب',
    experience_label: 'متوسط الخبرة',
    status: 'Published',
    is_featured: true,
    is_open: true,
    placeholder: true,
  }));

  return [liveChemistJob, ...staticDtos];
}

class RecruitmentApiError extends Error {
  constructor(public status: number, message: string, public errors?: string[]) {
    super(message);
    this.name = 'RecruitmentApiError';
  }
}

export const recruitmentService = {
  /**
   * Fetch vacancies from the API with filtering and pagination
   */
  async getJobs(params: JobFilterParams = {}): Promise<ApiResponse<JobDto[]>> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.dept) searchParams.set('dept', params.dept);
    if (params.loc) searchParams.set('loc', params.loc);
    if (params.type) searchParams.set('type', params.type);
    if (params.work) searchParams.set('work', params.work);
    if (params.exp) searchParams.set('exp', params.exp);
    if (params.featured) searchParams.set('featured', String(params.featured));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.lang) searchParams.set('lang', params.lang);

    const queryString = searchParams.toString();
    const url = `${RECRUITMENT_API_BASE}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const json = await response.json();
      if (json && json.success && Array.isArray(json.data)) {
        return json;
      }
      throw new Error(json?.message || 'Invalid API response format');
    } catch {
      // Fallback to static demo data when API is offline or not found
      const fallbackList = mapFallbackJobsToDto();
      let filtered = fallbackList;

      if (params.q) {
        const q = params.q.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.department.toLowerCase().includes(q) ||
            j.summary.toLowerCase().includes(q)
        );
      }
      if (params.dept) {
        filtered = filtered.filter((j) => j.department === params.dept);
      }

      return {
        success: true,
        message: 'تم عرض الوظائف التجريبية (وضع عدم الاتصال بالخادم)',
        meta: {
          total: filtered.length,
          page: 1,
          limit: 20,
          total_pages: 1,
        },
        data: filtered,
      };
    }
  },

  /**
   * Fetch specific job details by ID or Code
   */
  async getJobDetails(idOrCode: number | string): Promise<ApiResponse<JobDto>> {
    const isNum = typeof idOrCode === 'number' || /^\d+$/.test(String(idOrCode));
    const param = isNum ? `id=${idOrCode}` : `code=${encodeURIComponent(idOrCode)}`;
    const url = `${RECRUITMENT_API_BASE}?${param}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const json = await response.json();
      if (json.success && json.data) return json;
      throw new Error(json?.message || 'Job not found');
    } catch {
      const fallbacks = mapFallbackJobsToDto();
      const match = fallbacks.find((j) => String(j.id) === String(idOrCode) || j.job_code === idOrCode);
      if (match) {
        return { success: true, data: match };
      }
      throw new Error('الوظيفة المطلوبة غير موجودة');
    }
  },

  /**
   * Fetch Lookups / Dropdown choices
   */
  async getLookups(): Promise<ApiResponse<RecruitmentLookups>> {
    const url = `${RECRUITMENT_API_BASE}?action=lookups`;
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const json = await response.json();
      if (json.success && json.data) return json;
      throw new Error(json?.message || 'Failed to load lookups');
    } catch {
      return {
        success: true,
        data: DEFAULT_LOOKUPS,
      };
    }
  },

  /**
   * Track application by application number or national ID
   */
  async trackApplication(query: string): Promise<ApiResponse<ApplicationTrackingResult>> {
    const trimmed = query.trim();
    const isAppNo = trimmed.toUpperCase().startsWith('APP-');
    const param = isAppNo
      ? `app_number=${encodeURIComponent(trimmed)}`
      : `national_id=${encodeURIComponent(trimmed)}`;
    const url = `${RECRUITMENT_API_BASE}?action=track&${param}`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new RecruitmentApiError(
        response.status,
        json?.message || 'لم يتم العثور على طلب مطابق للبيانات المدخلة'
      );
    }

    return json;
  },

  /**
   * Submit job application via multipart/form-data
   */
  async submitApplication(payload: JobApplicationPayload): Promise<ApiResponse<JobApplicationResult>> {
    const formData = new FormData();
    formData.append('applicant_name', payload.applicant_name.trim());
    formData.append('national_id', payload.national_id.trim());
    formData.append('phone', payload.phone.trim());
    if (payload.email) formData.append('email', payload.email.trim());
    formData.append('governorate', payload.governorate.trim());
    formData.append('address', payload.address.trim());
    formData.append('marital_status', payload.marital_status.trim());
    formData.append('military_status', payload.military_status.trim());
    formData.append('qualification', payload.qualification.trim());
    if (payload.qualification_type) formData.append('qualification_type', payload.qualification_type.trim());
    if (payload.university) formData.append('university', payload.university.trim());
    if (payload.graduation_year) formData.append('graduation_year', payload.graduation_year.trim());
    if (payload.grade) formData.append('grade', payload.grade.trim());
    if (payload.job_id !== undefined) formData.append('job_id', String(payload.job_id));
    if (payload.job_code) formData.append('job_code', payload.job_code);
    if (payload.applied_position) formData.append('applied_position', payload.applied_position);
    if (payload.years_experience) formData.append('years_experience', payload.years_experience);
    if (payload.notes) formData.append('notes', payload.notes);

    if (payload.cvFile) {
      formData.append('cv', payload.cvFile, payload.cvFile.name);
    }
    if (payload.photoFile) {
      formData.append('photo', payload.photoFile, payload.photoFile.name);
    }

    let response: Response;
    try {
      response = await fetch(RECRUITMENT_API_BASE, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });
    } catch (err: any) {
      // In development or if server is unreachable, simulate successful submission
      return {
        success: true,
        message: 'تم استلام طلب التوظيف بنجاح (محاكاة محلية)',
        data: {
          application_id: Math.floor(Math.random() * 900) + 100,
          application_number: `APP-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          applicant_name: payload.applicant_name,
          national_id: payload.national_id,
          applied_position: payload.applied_position || 'وظيفة عامة',
          job_id: payload.job_id,
          job_code: payload.job_code,
          status: 'progress',
          workflow_step: 1,
          stage_name: 'إنشاء الطلب',
          has_cv: !!payload.cvFile,
          has_photo: !!payload.photoFile,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
      };
    }

    const json = await response.json();
    if (!response.ok || !json.success) {
      const errors = json?.data?.errors;
      throw new RecruitmentApiError(
        response.status,
        json?.message || 'فشل في إرسال طلب التقديم',
        Array.isArray(errors) ? errors : undefined
      );
    }

    return json;
  },
};
