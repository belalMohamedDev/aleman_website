import { useState } from 'react';
import {
  Briefcase,
  Clock,
  MapPin,
  Calendar,
  Award,
  Users,
  FlaskConical,
  Factory,
  Share2,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import type { JobDto } from '../../features/recruitment/types';
import { useLang } from '../../i18n/LanguageContext';
import { Reveal } from '../shared/Reveal';

export type JobItem = JobDto;

type JobCardProps = {
  job: JobItem;
  index?: number;
  onApply: (job: JobItem) => void;
  isWide?: boolean;
};

export function JobCard({ job, index = 0, onApply, isWide = false }: JobCardProps) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  // Department icon resolver
  const getDeptIcon = (dept: string) => {
    const d = dept.toLowerCase();
    if (d.includes('معمل') || d.includes('جود') || d.includes('lab') || d.includes('quality')) {
      return FlaskConical;
    }
    if (d.includes('إنتاج') || d.includes('تصنيع') || d.includes('production') || d.includes('factory')) {
      return Factory;
    }
    if (d.includes('موارد') || d.includes('hr') || d.includes('human')) {
      return Users;
    }
    return Briefcase;
  };

  const title =
    lang === 'en' && job.title_en
      ? job.title_en
      : job.title_ar || job.title || (lang === 'ar' ? 'وظيفة شاغرة' : 'Open Position');

  const department = job.department || (lang === 'ar' ? 'مجموعة شركات الإيمان' : 'Al-Eman Group');
  const DeptIcon = getDeptIcon(department);
  const location = job.location || (lang === 'ar' ? 'جمهورية مصر العربية' : 'Egypt');
  const jobType = job.employment_type_label || job.employment_type || (lang === 'ar' ? 'دوام كامل' : 'Full-Time');
  const workType = job.work_type_label || job.work_type || (lang === 'ar' ? 'من المقر' : 'On-site');
  const experience = job.experience_label;
  const deadline = job.deadline;
  const jobCode = job.job_code;
  const vacancies = job.vacancies && job.vacancies > 0 ? job.vacancies : 1;

  const summary =
    job.summary ||
    job.description ||
    (lang === 'ar'
      ? 'فرصة مهنية مميزة ضمن كوادر مجموعة شركات الإيمان وفق أحدث المعايير المهنية.'
      : 'An exceptional career opportunity within Al-Eman Group.');

  // Responsibilities parsing
  const rawResponsibilities = job.responsibilities;
  let responsibilities: string[] = [];
  if (Array.isArray(rawResponsibilities)) {
    responsibilities = rawResponsibilities.map((r: any) =>
      typeof r === 'object' && r !== null ? (lang === 'en' ? r.en : r.ar) : String(r)
    );
  } else if (typeof rawResponsibilities === 'string' && rawResponsibilities.trim()) {
    responsibilities = rawResponsibilities
      .split(/\r?\n/)
      .map((s) => s.replace(/^[*•-]\s*/, '').trim())
      .filter(Boolean);
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = job.share_url || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(lang === 'ar' ? 'تم نسخ رابط الوظيفة بنجاح' : 'Job link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(lang === 'ar' ? 'فشل نسخ الرابط' : 'Failed to copy link');
    }
  };

  return (
    <Reveal
      delay={index * 0.08}
      className={`group relative flex flex-col rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-card hover:shadow-lift transition-all duration-300 hover:border-brand-200 ${
        isWide ? 'h-full' : 'h-full'
      }`}
    >
      {/* Top Bar: Department + Job Code + Share */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 border border-brand-100/80">
            <DeptIcon className="h-4 w-4" />
          </div>
          <span className="text-xs font-black text-brand-800">
            {department}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {jobCode && (
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-black text-slate-600">
              {jobCode}
            </span>
          )}
          <button
            type="button"
            onClick={handleShare}
            aria-label={lang === 'ar' ? 'مشاركة رابط الوظيفة' : 'Share job link'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brand-600 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Job Title & Vacancy Badge */}
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-xl sm:text-2xl font-black text-ink group-hover:text-brand-700 transition">
          {title}
        </h3>
        {vacancies > 0 && (
          <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 border border-amber-200/70">
            {vacancies} {lang === 'ar' ? 'شواغر متاحة' : 'openings'}
          </span>
        )}
      </div>

      {/* Pills / Key Meta Attributes */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 font-bold text-slate-700">
          <MapPin className="h-3.5 w-3.5 text-brand-600" />
          <span>{location}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 font-bold text-slate-700">
          <Clock className="h-3.5 w-3.5 text-brand-600" />
          <span>{jobType}</span>
        </span>
        {workType && (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 font-bold text-slate-700">
            <span>{workType}</span>
          </span>
        )}
        {experience && (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 font-bold text-slate-700">
            <Award className="h-3.5 w-3.5 text-brand-600" />
            <span>{experience}</span>
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="mt-4 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
        {summary}
      </p>

      {/* Key Responsibilities Checklist */}
      {responsibilities.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4 flex-1">
          <span className="text-xs font-black text-slate-700 mb-2 block">
            {lang === 'ar' ? 'أبرز المهام والمسؤوليات:' : 'Key Responsibilities:'}
          </span>
          <ul className="space-y-2">
            {responsibilities.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                <span className="line-clamp-2 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Footer: Deadline + Apply Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {deadline ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <Calendar className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{lang === 'ar' ? `آخر موعد للتقديم: ${deadline}` : `Deadline: ${deadline}`}</span>
          </div>
        ) : (
          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'ar' ? 'التقديم متاح حالياً' : 'Applications Open'}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onApply(job)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 px-6 py-3 text-xs sm:text-sm font-black text-white shadow-sm transition hover:shadow active:scale-[0.98]"
        >
          <span>{lang === 'ar' ? 'تقديم طلب الآن' : 'Apply Now'}</span>
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </Reveal>
  );
}