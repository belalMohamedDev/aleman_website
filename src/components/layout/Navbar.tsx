import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDownIcon, Globe, MenuIcon, PhoneCallIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { MobileMenu } from './MobileMenu';
import { LOGO_URL, primaryNav, secondaryNav } from '../../data/navigation';

export function Navbar() {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;
  const headerClass = isHome ? 'fixed' : 'sticky';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const moreActive = secondaryNav.some((item) => item.to === location.pathname);

  return (
    <header
      className={`${headerClass} top-0 z-50 w-full transition-all duration-300 ${isTransparent ? 'border-b border-transparent bg-transparent' : 'border-b border-brand-100/70 bg-white/95 shadow-card backdrop-blur-xl'}`
      }>

      <div className="mx-auto flex h-[72px] max-w-site items-center gap-4 px-4 md:px-6">
        <Link to="/" className="focus-ring flex items-center gap-3" aria-label={t(ui.brand.name)}>
          <img src={LOGO_URL} alt="" className="h-11 w-11 rounded-xl object-contain transition-colors bg-white p-1 shadow-sm" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className={`text-base font-extrabold transition-colors ${isTransparent ? 'text-white' : 'text-ink'}`}>{t(ui.brand.name)}</span>
            <span className={`text-[11px] font-semibold transition-colors ${isTransparent ? 'text-white/80' : 'text-ink-muted'}`}>{t(ui.brand.tagline)}</span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label={t(ui.nav.menu)}>
          {primaryNav.map((item) =>
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `focus-ring relative rounded-pill px-4 py-2 text-sm font-bold transition ${isActive
                  ? (isTransparent ? 'text-white' : 'text-brand-600')
                  : (isTransparent ? 'text-white/80 hover:text-white' : 'text-ink-soft hover:text-brand-600')}`
              }>

              {({ isActive }) =>
                <>
                  {t(item.label)}
                  {isActive ?
                    <span className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full transition-colors ${isTransparent ? 'bg-gold-400' : 'bg-gold-500'}`} aria-hidden="true" /> :
                    null}
                </>
              }
            </NavLink>
          )}

          <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              onMouseEnter={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={`focus-ring flex items-center gap-1 rounded-pill px-4 py-2 text-sm font-bold transition ${moreActive
                  ? (isTransparent ? 'text-white' : 'text-brand-600')
                  : (isTransparent ? 'text-white/80 hover:text-white' : 'text-ink-soft hover:text-brand-600')}`
              }>

              {lang === 'ar' ? 'المزيد' : 'More'}
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {moreOpen ?
              <div className="absolute top-full z-50 pt-2 ltr:left-0 rtl:right-0">
                <div className="w-56 overflow-hidden rounded-card border border-brand-100 bg-white p-2 shadow-lift">
                  {secondaryNav.map((item) =>
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `focus-ring block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-soft hover:bg-brand-50/60 hover:text-brand-600'}`

                      }>

                      {t(item.label)}
                    </NavLink>
                  )}
                </div>
              </div> :
              null}
          </div>
        </nav>

        <div className="ms-auto flex items-center gap-2.5 lg:ms-0">
          <button
            type="button"
            onClick={toggle}
            className={`focus-ring hidden items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition sm:flex ${isTransparent
                ? 'border-white/25 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                : 'border-brand-200 bg-brand-50/50 text-ink hover:border-brand-300'
              }`}
            aria-label={t(ui.nav.language)}>

            <Globe className="h-4 w-4 opacity-80" />
            <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
            <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
          </button>

          <Link
            to="/contact"
            className="focus-ring hidden items-center gap-2 rounded-full bg-[#f97316] hover:bg-[#ea580c] px-5 py-2 text-sm font-extrabold text-white shadow-md transition-all hover:scale-105 active:scale-95 md:inline-flex">

            <PhoneCallIcon className="h-4 w-4" aria-hidden="true" />
            {t(ui.nav.contact)}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border transition lg:hidden ${isTransparent
                ? 'border-white/30 text-white hover:border-white bg-white/5 backdrop-blur-sm'
                : 'border-brand-100 text-ink hover:border-brand-300'
              }`}
            aria-label={t(ui.nav.menu)}>

            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>);

}