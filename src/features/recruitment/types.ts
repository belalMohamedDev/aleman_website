export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  data: T;
};

export type JobDto = {
  id: number | string;
  job_code?: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  department: string;
  section?: string;
  location: string;
  employment_type: string;
  employment_type_label?: string;
  work_type?: string;
  work_type_label?: string;
  vacancies?: number;
  summary: string;
  description?: string;
  responsibilities?: string | string[];
  requirements?: string | string[];
  qualifications?: string;
  min_experience_years?: number;
  max_experience_years?: number;
  experience_label?: string;
  required_skills?: string;
  preferred_skills?: string;
  salary?: {
    is_visible: boolean;
    from: number | null;
    to: number | null;
    currency: string;
  };
  publish_date?: string;
  deadline?: string;
  status?: string;
  is_featured?: boolean;
  is_open?: boolean;
  share_url?: string;
  web_apply_url?: string;
  created_at?: string;
  placeholder?: boolean;
};

export type JobFilterParams = {
  q?: string;
  dept?: string;
  loc?: string;
  type?: string;
  work?: string;
  exp?: string;
  featured?: number;
  page?: number;
  limit?: number;
  lang?: 'ar' | 'en';
};

export type LookupItem = {
  key: string;
  name_ar: string;
  name_en: string;
};

export type ExperienceLevelLookup = {
  key: string;
  label_ar: string;
  label_en: string;
};

export type RecruitmentLookups = {
  departments: string[];
  locations: string[];
  employment_types: LookupItem[];
  work_types: LookupItem[];
  qualifications: string[];
  marital_statuses: string[];
  military_statuses: string[];
  grades: string[];
  governorates: string[];
  experience_levels: ExperienceLevelLookup[];
};

export type JobApplicationPayload = {
  applicant_name: string;
  national_id: string;
  phone: string;
  email?: string;
  governorate: string;
  address: string;
  marital_status: string;
  military_status: string;
  qualification: string;
  qualification_type?: string;
  university?: string;
  graduation_year?: string;
  grade?: string;
  job_id?: number | string;
  job_code?: string;
  applied_position?: string;
  years_experience?: string;
  notes?: string;
  photoFile?: File | null;
  cvFile?: File | null;
};

export type JobApplicationResult = {
  application_id?: number;
  application_number: string;
  applicant_name: string;
  national_id: string;
  applied_position: string;
  job_id?: number | string;
  job_code?: string;
  status: string;
  workflow_step?: number;
  stage_name?: string;
  has_cv?: boolean;
  has_photo?: boolean;
  certs_count?: number;
  created_at?: string;
};

export type ApplicationTrackingResult = {
  application_number: string;
  applicant_name: string;
  applied_position: string;
  application_date: string;
  workflow_step: number;
  stage_name: string;
  status: string;
  status_label: string;
  notes?: string;
  job_code?: string;
};
