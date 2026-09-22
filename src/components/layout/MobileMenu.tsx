import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneCallIcon, XIcon, LanguagesIcon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { LOGO_URL, primaryNav, secondaryNav } from '../../data/navigation';
import { useAuth } from '../../features/auth/AuthContext';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t, lang, setLang, dir } = useLang();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const offset = dir === 'rtl' ? '100%' : '-100%';

  const content = (
    <AnimatePresence>
      {open ?
        <motion.div
          className="fixed inset-0 z-[100] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>

          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t(ui.nav.menu)}
            initial={{ x: offset }}
            animate={{ x: 0 }}
            exit={{ x: offset }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 flex w-[86%] max-w-sm flex-col bg-white shadow-lift ltr:left-0 rtl:right-0">

            <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={LOGO_URL} alt="" loading="lazy" decoding="async" className="h-10 w-10 rounded-lg object-contain" />
                {/* <span className="text-sm font-extrabold text-ink">{t(ui.brand.name)}</span> */}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t(ui.nav.close)}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 text-ink">

                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label={t(ui.nav.menu)}>
              <ul className="space-y-1">
                {primaryNav.map((item) =>
                  <li key={item.to}>
                    {item.isExternal || item.to.startsWith('http') ? (
                      <a
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="focus-ring block rounded-xl px-4 py-3 text-base font-bold text-ink-soft hover:bg-brand-50/60 transition"
                      >
                        {t(item.label)}
                      </a>
                    ) : (
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `focus-ring block rounded-xl px-4 py-3 text-base font-bold transition ${
                            isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-soft hover:bg-brand-50/60'
                          }`
                        }
                      >
                        {t(item.label)}
                      </NavLink>
                    )}
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <NavLink
                      to="/profile"
                      onClick={onClose}
                      className={({ isActive }) =>
                        `focus-ring block rounded-xl px-4 py-3 text-base font-bold transition ${isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-soft hover:bg-brand-50/60'
                        }`
                      }
                    >
                      {t(ui.profile.profileAndOrders)}
                    </NavLink>
                  </li>
                )}
              </ul>

              {secondaryNav.length > 0 && (
                <>
                  <p className="mt-6 px-4 text-xs font-bold uppercase tracking-wide text-ink-muted">
                    {t(ui.nav.more)}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {secondaryNav.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `focus-ring block rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-soft hover:bg-brand-50/60'
                            }`
                          }
                        >
                          {t(item.label)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </nav>

            <div className="space-y-3 border-t border-brand-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="focus-ring flex w-full items-center justify-between rounded-xl border border-brand-100 bg-canvas px-4 py-3 text-sm font-bold text-ink transition hover:border-brand-300">

                <div className="flex items-center gap-2">
                  <LanguagesIcon className="h-5 w-5 text-brand-500" aria-hidden="true" />
                  <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
                </div>
                <span className="text-xs text-ink-muted">{lang === 'ar' ? 'EN' : 'AR'}</span>
              </button>

              <Link
                to="/contact"
                onClick={onClose}
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-gold-600">

                <PhoneCallIcon className="h-4 w-4" aria-hidden="true" />
                {t(ui.nav.contact)}
              </Link>
            </div>
          </motion.aside>
        </motion.div> :
        null}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}