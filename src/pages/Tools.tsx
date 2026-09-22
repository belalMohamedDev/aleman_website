import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { FCRCalculator } from '../components/tools/FCRCalculator';

export function Tools() {
  const { t } = useLang();

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.tools)} title={t(ui.tools.pageTitle)} subtitle={t(ui.tools.pageSubtitle)} />
      <section className="mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <FCRCalculator />
      </section>
    </>);

}