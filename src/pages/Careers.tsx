import React, { useEffect, useState } from 'react';
import type { Job } from '../types/content';
import { jobs } from '../data/jobs';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { PlaceholderNotice } from '../components/shared/PlaceholderNotice';
import { JobCard } from '../components/careers/JobCard';
import { ApplicationModal } from '../components/careers/ApplicationModal';

const OFFICIAL_CAREERS_URL = 'https://www.alemanfeed.com/modules/recruitment/careers.php?lang=ar';

export function Careers() {
  const { t } = useLang();
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  useEffect(() => {
    // Automatically redirect to official careers portal
    window.location.href = OFFICIAL_CAREERS_URL;
  }, []);

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.careers)} title={t(ui.careers.pageTitle)} subtitle={t(ui.careers.pageSubtitle)} />

      <section className="mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8">
          <PlaceholderNotice title={t(ui.common.demoTag)}>{t(ui.careers.notice)}</PlaceholderNotice>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job, index) =>
            <JobCard key={job.id} job={job} index={index} onApply={setActiveJob} />
          )}
        </div>
      </section>

      <ApplicationModal job={activeJob} onClose={() => setActiveJob(null)} />
    </>);

}