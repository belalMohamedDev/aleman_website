import { Link } from 'react-router-dom';
import { FacebookIcon, YoutubeIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { LOGO_URL } from '../../data/navigation';
import { categories } from '../../data/products';

export function Footer() {
  const { t, lang } = useLang();

  const columns = [
    {
      title: t(ui.footer.company),
      links: [
        { to: '/', label: t(ui.nav.home) },
        { to: '/about', label: t(ui.nav.about) },
        // { to: '/quality', label: t(ui.nav.quality) },
        { to: 'https://www.alemanfeed.com/modules/recruitment/careers.php?lang=ar', label: t(ui.nav.careers) }
      ]
    },
    {
      title: t(ui.footer.products),
      links: categories.map((c) => ({ to: `/products?category=${c.id}`, label: lang === 'ar' ? c.ar : c.en }))
    },

  ];

  return (
    <footer className="relative mt-20 bg-[#111827] text-white overflow-hidden border-t border-slate-800">
      {/* Natural Animal Watermark Showcase */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Cow - Bottom Left in RTL, raised higher */}
        <img
          src="/animal_cow.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute bottom-14 lg:bottom-18 ltr:-right-6 rtl:-left-6 w-80 lg:w-96 object-contain opacity-25 lg:opacity-30"
        />

        {/* Rooster & Hen - Top Right in RTL */}
        <img
          src="/animal_chicken.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute top-4 ltr:left-8 rtl:right-8 w-60 lg:w-72 object-contain opacity-25 lg:opacity-30"
        />

        {/* Ducks - Lowered below navigation links, above bottom border line */}
        <img
          src="/animal_duck.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute bottom-28 lg:bottom-32 ltr:left-[30%] rtl:right-[30%] w-44 lg:w-52 object-contain opacity-20 lg:opacity-25 hidden md:block"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-site px-4 py-16 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="" loading="lazy" decoding="async" className="h-12 w-12 rounded-xl bg-white p-1 object-contain shadow-md" />
              <div className="space-y-1.5">
                <span className="text-xl font-black block text-white leading-snug">{t(ui.brand.name)}</span>
                <span className="text-xs text-gold-400 font-bold block">{t(ui.brand.tagline)}</span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300 font-medium">{t(ui.footer.about)}</p>
          </div>

          {/* Nav Columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-base font-black text-gold-300 tracking-wide">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.to + link.label}>
                    {link.to.startsWith('http') ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring inline-block text-sm text-slate-300 transition-colors duration-200 hover:text-gold-400 hover:translate-x-1 rtl:hover:-translate-x-1"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="focus-ring inline-block text-sm text-slate-300 transition-colors duration-200 hover:text-gold-400 hover:translate-x-1 rtl:hover:-translate-x-1"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact & Social */}
          <div>
            <h2 className="text-base font-black text-gold-300 tracking-wide">{t(ui.footer.contact)}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300 font-medium">
              <li><a href="tel:16197" className="hover:text-gold-400 transition">الخط الساخن: 16197</a></li>
              <li><a href="tel:01061832000" className="hover:text-gold-400 transition dir-ltr">01061832000</a></li>
              <li><a href="mailto:info@alemanfoundation.com" className="hover:text-gold-400 transition dir-ltr">info@alemanfoundation.com</a></li>
              <li>
                {/* <Link to="/contact" className="focus-ring text-gold-400 underline underline-offset-4 transition hover:text-gold-300">
                  {t(ui.nav.contact)}
                </Link> */}
              </li>
            </ul>

            <h3 className="mt-6 text-sm font-extrabold text-gold-300">{t(ui.footer.social)}</h3>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://www.facebook.com/alemangroups/?locale=ar_AR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-gold-500 hover:text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCLz2menJ10Pi7OKYZqz2ehQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-gold-500 hover:text-white"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            {/* <div className="mt-6 flex items-center gap-2" role="group" aria-label={t(ui.nav.language)}>
              {(['ar', 'en'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`focus-ring rounded-pill px-3.5 py-1.5 text-xs font-bold transition ${lang === code ? 'bg-gold-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                >
                  {code === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div> */}
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 font-medium sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {t(ui.brand.name)}. جميع الحقوق محفوظة.</p>
          <p className="text-slate-500">{t(ui.footer.rights)}</p>
        </div>
      </div>
    </footer>
  );
}