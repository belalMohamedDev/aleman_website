import React from 'react';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { DistributorLocator } from '../components/contact/DistributorLocator';

export function Distributors() {
  const { t } = useLang();

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.distributors)} title={t(ui.distributors.pageTitle)} subtitle={t(ui.distributors.pageSubtitle)} />
      <section className="mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <DistributorLocator />
      </section>
    </>);

}