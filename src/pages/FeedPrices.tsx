import { ClockIcon } from 'lucide-react';
import { feedPriceRows } from '../data/feedPrices';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';
import { PageHeader } from '../components/shared/PageHeader';
import { PlaceholderNotice } from '../components/shared/PlaceholderNotice';

export function FeedPrices() {
  const { t } = useLang();

  return (
    <>
      <PageHeader eyebrow={t(ui.nav.prices)} title={t(ui.prices.pageTitle)} subtitle={t(ui.prices.pageSubtitle)} />

      <section className="mx-auto max-w-site px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-slate-100 bg-white px-5 py-4 shadow-card">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ClockIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-bold text-ink">{t(ui.prices.lastUpdate)}</p>
          </div>

          <PlaceholderNotice title={t(ui.common.placeholderTag)}>{t(ui.prices.notice)}</PlaceholderNotice>

          <div className="overflow-x-auto rounded-card border border-slate-100 bg-white shadow-card">
            <table className="w-full min-w-[560px] text-start text-sm">
              <thead className="bg-brand-50">
                <tr>
                  <th scope="col" className="px-5 py-4 text-start font-extrabold text-ink">{t(ui.prices.product)}</th>
                  <th scope="col" className="px-5 py-4 text-start font-extrabold text-ink">{t(ui.prices.unit)}</th>
                  <th scope="col" className="px-5 py-4 text-start font-extrabold text-ink">{t(ui.prices.price)}</th>
                  <th scope="col" className="px-5 py-4 text-start font-extrabold text-ink">{t(ui.prices.change)}</th>
                </tr>
              </thead>
              <tbody>
                {feedPriceRows.map((row) =>
                <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-bold text-ink">{t(row.label)}</td>
                    <td className="px-5 py-4 text-ink-muted">{t(row.unit)}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex h-4 w-24 animate-pulse rounded-full bg-slate-200/80" aria-label={t(ui.common.dataSoon)} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex h-4 w-14 animate-pulse rounded-full bg-slate-200/80" aria-hidden="true" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>);

}