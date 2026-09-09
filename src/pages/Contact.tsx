import React from 'react';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactInfo } from '../components/contact/ContactInfo';

export function Contact() {
  const { t } = useLang();

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.contact)} title={t(ui.contact.pageTitle)} subtitle={t(ui.contact.pageSubtitle)} />

      <section className="mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </>);

}