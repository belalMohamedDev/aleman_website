import React from 'react';
import { FacebookIcon, MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon, YoutubeIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { PlaceholderNotice } from '../shared/PlaceholderNotice';

const CHANNELS = [
{ icon: PhoneIcon, label: ui.contact.phone },
{ icon: MessageCircleIcon, label: ui.floating.whatsapp },
{ icon: MailIcon, label: { ar: 'البريد الإلكتروني', en: 'Email' } },
{ icon: MapPinIcon, label: ui.contact.locations }];


export function ContactInfo() {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="text-lg font-extrabold text-ink">{t(ui.contact.channels)}</h2>
        <ul className="mt-4 space-y-3">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <li key={channel.label.en} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold text-ink">{t(channel.label)}</span>
                  <span className="text-xs text-ink-muted">{t(ui.common.dataSoon)}</span>
                </span>
              </li>);

          })}
        </ul>

        <h3 className="mt-6 text-sm font-extrabold text-ink">{t(ui.footer.social)}</h3>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FacebookIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Facebook</span>
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <YoutubeIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">YouTube</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-ink-muted">{t(ui.footer.socialNotice)}</p>
      </div>

      <PlaceholderNotice title={t(ui.common.placeholderTag)}>{t(ui.contact.contactNotice)}</PlaceholderNotice>
    </div>);

}