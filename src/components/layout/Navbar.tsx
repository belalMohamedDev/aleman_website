import { useEffect, useState, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDownIcon,
  Globe,
  MenuIcon,
  PhoneCallIcon,
  ShoppingBagIcon,
  UserIcon,
  LogOutIcon,
} from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';
import { ui } from '../../i18n/ui';
import { MobileMenu } from './MobileMenu';
import { LOGO_URL, primaryNav, secondaryNav } from '../../data/navigation';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';

export function Navbar() {
  const { t, lang, toggle } = useLang();
  const { totalItemsCount } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const isTransparentPage = location.pathname === '/' || location.pathname === '/about';
  const isTransparent = isTransparentPage && !scrolled;
  const headerClass = isTransparentPage ? 'fixed' : 'sticky';

  // Exclude /contact from desktop navbar links since there is a prominent CTA button
  const desktopNav = useMemo(
    () => primaryNav.filter((item) => item.to !== '/contact'),
    []
  );

  // Format user display name (clean first name or fallback)
  const userFirstName = useMemo(() => {
    if (!user?.name) return lang === 'ar' ? 'حسابي' : 'Account';
    const first = user.name.trim().split(' ')[0];
    return first.length > 12 ? first.substring(0, 10) + '..' : first;
  }, [user?.name, lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const moreActive = secondaryNav.some((item) => item.to === location.pathname);

  return (
    <header
      className={`${headerClass} top-0 z-50 w-full transition-all duration-300 ${isTransparent
        ? 'border-b border-transparent bg-transparent'
        : 'border-b border-brand-100/70 bg-white/95 shadow-card backdrop-blur-xl'
        }`}
    >
      <div className="w-full max-w-[1700px] mx-auto flex h-[72px] items-center justify-between gap-3 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Brand Logo & Name */}
        <Link to="/" className="focus-ring flex shrink-0 items-center gap-2.5" aria-label={t(ui.brand.name)}>
          <img
            src={LOGO_URL}
            alt=""
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-contain bg-white p-1 shadow-sm transition-transform hover:scale-105"
          />
          <span className="hidden flex-col gap-1 sm:flex">
            <span
              className={`text-sm sm:text-base font-black leading-none transition-colors ${isTransparent ? 'text-white' : 'text-ink'
                }`}
            >
              {t(ui.brand.name)}
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-semibold leading-none transition-colors ${isTransparent ? 'text-white/80' : 'text-ink-muted'
                }`}
            >
              {t(ui.brand.tagline)}
            </span>
          </span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex" aria-label={t(ui.nav.menu)}>
          {desktopNav.map((item) =>
            item.isExternal || item.to.startsWith('http') ? (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className={`focus-ring relative rounded-pill px-3.5 py-2 text-sm font-bold transition ${
                  isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-ink-soft hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                {t(item.label)}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `focus-ring relative rounded-pill px-3.5 py-2 text-sm font-bold transition ${
                    isActive
                      ? isTransparent
                        ? 'text-white'
                        : 'text-brand-600'
                      : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-ink-soft hover:text-brand-600 hover:bg-brand-50/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {t(item.label)}
                    {isActive && (
                      <span
                        className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full transition-colors ${
                          isTransparent ? 'bg-gold-400' : 'bg-gold-500'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            )
          )}

          {/* More Dropdown (only rendered if secondaryNav has items) */}
          {secondaryNav.length > 0 && (
            <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                onMouseEnter={() => setMoreOpen(true)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={`focus-ring flex items-center gap-1 rounded-pill px-3.5 py-2 text-sm font-bold transition ${moreActive
                  ? isTransparent
                    ? 'text-white'
                    : 'text-brand-600'
                  : isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-ink-soft hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
              >
                <span>{lang === 'ar' ? 'المزيد' : 'More'}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {moreOpen && (
                <div className="absolute top-full z-50 pt-2 ltr:left-0 rtl:right-0">
                  <div className="w-56 overflow-hidden rounded-2xl border border-brand-100 bg-white p-2 shadow-lift">
                    {secondaryNav.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `focus-ring block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive
                            ? 'bg-brand-50 text-brand-600'
                            : 'text-ink-soft hover:bg-brand-50/60 hover:text-brand-600'
                          }`
                        }
                      >
                        {t(item.label)}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Action Controls (Language, Auth, Cart, Contact CTA) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggle}
            className={`focus-ring hidden h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition sm:flex ${isTransparent
              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
              : 'border-slate-200 bg-slate-50 text-ink-soft hover:border-brand-300 hover:text-brand-600'
              }`}
            aria-label={t(ui.nav.language)}
          >
            <Globe className="h-3.5 w-3.5 opacity-80" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Notifications Bell */}
          <NotificationBell
            isAuthenticated={isAuthenticated}
            isTransparent={isTransparent}
          />

          {/* User Account / Auth Button */}
          {isAuthenticated ? (
            <div
              className="relative"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                onMouseEnter={() => setUserMenuOpen(true)}
                className={`focus-ring flex h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition ${isTransparent
                  ? 'border-white/25 bg-white/15 text-white hover:bg-white/25 backdrop-blur-md'
                  : 'border-brand-200 bg-brand-50/60 text-brand-800 hover:bg-brand-100/60'
                  }`}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <UserIcon className="h-3 w-3" />
                </div>
                <span className="font-extrabold max-w-[90px] truncate" dir="auto">
                  {userFirstName}
                </span>
                <ChevronDownIcon
                  className={`h-3 w-3 opacity-60 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute top-full ltr:right-0 rtl:left-0 z-50 pt-2">
                  <div className="w-52 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-2xl">
                    <div className="border-b border-slate-100 pb-2 mb-2 px-2">
                      <p className="text-xs font-black text-slate-800 truncate">{user?.name}</p>
                      {user?.phoneNumber && (
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{user.phoneNumber}</p>
                      )}
                      {/* <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircleIcon className="h-3 w-3" />
                        حساب معتمد
                      </span> */}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-brand-600" />
                      <span>الملف الشخصي والبيانات</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition mt-1"
                    >
                      <LogOutIcon className="h-3.5 w-3.5" />
                      <span>تسجيل خروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className={`focus-ring flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-xs font-extrabold transition ${isTransparent
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                : 'border-brand-200 bg-brand-50/50 text-brand-700 hover:border-brand-300'
                }`}
            >
              <UserIcon className="h-3.5 w-3.5 opacity-80" />
              <span>دخول / تسجيل</span>
            </button>
          )}

          {/* Shopping Cart Link -> Direct to Checkout */}
          {isAuthenticated && (
            <Link
              to="/checkout"
              className={`focus-ring relative flex h-10 w-10 items-center justify-center rounded-full border transition ${isTransparent
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300 hover:text-brand-600'
                }`}
              aria-label="إتمام الطلب"
            >
              <ShoppingBagIcon className="h-4 w-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f97316] px-1 text-[11px] font-black text-white shadow-md animate-in zoom-in-75">
                  {totalItemsCount}
                </span>
              )}
            </Link>
          )}

          {/* Contact CTA Button */}
          <Link
            to="/contact"
            className="focus-ring hidden h-10 items-center gap-1.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] px-4 sm:px-5 text-xs sm:text-sm font-extrabold text-white shadow-md transition-all hover:scale-105 active:scale-95 md:inline-flex"
          >
            <PhoneCallIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t(ui.nav.contact)}</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden ${isTransparent
              ? 'border-white/30 text-white hover:border-white bg-white/10 backdrop-blur-sm'
              : 'border-slate-200 text-ink hover:border-brand-300'
              }`}
            aria-label={t(ui.nav.menu)}
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}