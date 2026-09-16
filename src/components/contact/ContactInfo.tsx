import React from 'react';
import { FacebookIcon, MailIcon, MapPinIcon, PhoneIcon, YoutubeIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';

const WHATSAPP_NUMBER = '201110767100';
const PHONE_HOTLINE = '16197';
const EMAIL = 'info@alemanfoundation.com';

const PHONES = [
  '01061832000',
  '01064444483',
  '01116983000',
];

export function ContactInfo() {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="text-lg font-extrabold text-ink">{t(ui.contact.channels)}</h2>
        <ul className="mt-4 space-y-3">

          {/* Hotline */}
          <li className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <PhoneIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-ink">الخط الساخن</span>
              <a href={`tel:${PHONE_HOTLINE}`} className="text-sm font-extrabold text-brand-600 hover:underline dir-ltr">
                {PHONE_HOTLINE}
              </a>
            </span>
          </li>

          {/* Phones */}
          <li className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <PhoneIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-ink">تليفون</span>
              {PHONES.map((p) => (
                <a key={p} href={`tel:${p}`} className="text-xs font-semibold text-brand-600 hover:underline dir-ltr">
                  {p}
                </a>
              ))}
            </span>
          </li>

          {/* WhatsApp */}
          <li className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50"
            >
              <img src="/whatsapp.png" alt="واتساب" className="h-6 w-6" />
            </a>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-ink">واتساب</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-brand-600 hover:underline"
                style={{ direction: 'ltr', textAlign: 'right' }}
              >
                +20 111 0767100
              </a>
            </span>
          </li>

          {/* Email */}
          <li className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <MailIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-ink">البريد الإلكتروني</span>
              <a href={`mailto:${EMAIL}`} className="text-xs font-semibold text-brand-600 hover:underline dir-ltr">
                {EMAIL}
              </a>
            </span>
          </li>

          {/* Locations */}
          <li className="flex items-start gap-3 rounded-xl border border-slate-100 px-4 py-3">
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <MapPinIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-bold text-ink">المواقع</span>
              <span className="text-xs text-ink-muted">
                <strong>مصنع العباسة:</strong> محافظة الشرقية – طريق بلبيس أبوحماد – العباسة
              </span>
              <span className="text-xs text-ink-muted">
                <strong>مصنع أبو كبير:</strong> محافظة الشرقية – مركز أبو كبير – السواقي
              </span>
              <span className="text-xs text-ink-muted">
                <strong>مصنع العامرية:</strong> محافظة الإسكندرية – العامرية الناصرية – الكانك 35 طريق الإسكندرية / القاهرة الصحراوي
              </span>
            </span>
          </li>

        </ul>

        <h3 className="mt-6 text-sm font-extrabold text-ink">{t(ui.footer.social)}</h3>
        <div className="mt-3 flex items-center gap-2">
          <a
            href="https://www.facebook.com/alemangroups/?locale=ar_AR"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition"
          >
            <FacebookIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Facebook</span>
          </a>
          <a
            href="https://www.youtube.com/channel/UCLz2menJ10Pi7OKYZqz2ehQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition"
          >
            <YoutubeIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">YouTube</span>
          </a>
        </div>
      </div>
    </div>
  );
}