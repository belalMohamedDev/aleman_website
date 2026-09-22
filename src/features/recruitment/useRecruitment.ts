import { useState, useEffect, useCallback } from 'react';
import type {
  JobDto,
  JobFilterParams,
  RecruitmentLookups,
  JobApplicationPayload,
  JobApplicationResult,
  ApplicationTrackingResult,
} from './types';
import { recruitmentService, DEFAULT_LOOKUPS } from './recruitmentService';

export function useJobs(initialParams: JobFilterParams = {}) {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilterParams>(initialParams);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await recruitmentService.getJobs(filters);
      setJobs(res.data);
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء جلب الوظائف');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchJobs,
  };
}

export function useRecruitmentLookups() {
  const [lookups, setLookups] = useState<RecruitmentLookups>(DEFAULT_LOOKUPS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await recruitmentService.getLookups();
        if (mounted && res.data) {
          setLookups(res.data);
        }
      } catch {
        // Fallback already returned in service
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { lookups, loading };
}

export function useJobApplication() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<JobApplicationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: JobApplicationPayload): Promise<JobApplicationResult> => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await recruitmentService.submitApplication(payload);
      setResult(res.data);
      return res.data;
    } catch (err: any) {
      const msg = err?.message || 'حدث خطأ أثناء تقديم الطلب';
      setError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setSubmitting(false);
  };

  return {
    submitting,
    result,
    error,
    submit,
    reset,
  };
}

export function useJobTracking() {
  const [tracking, setTracking] = useState(false);
  const [result, setResult] = useState<ApplicationTrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const track = async (query: string): Promise<ApplicationTrackingResult | null> => {
    if (!query.trim()) return null;
    setTracking(true);
    setError(null);
    try {
      const res = await recruitmentService.trackApplication(query);
      setResult(res.data);
      return res.data;
    } catch (err: any) {
      const msg = err?.message || 'لم نتمكن من العثور على طلب مطابق';
      setError(msg);
      setResult(null);
      return null;
    } finally {
      setTracking(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setTracking(false);
  };

  return {
    tracking,
    result,
    error,
    track,
    reset,
  };
}
