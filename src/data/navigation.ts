import { ui } from '../i18n/ui';
import type { Localized } from '../types/content';

export type NavItem = {
  to: string;
  label: Localized;
  isExternal?: boolean;
};

export const LOGO_URL = "/image.webp";

export const primaryNav: NavItem[] = [
  { to: '/', label: ui.nav.home },
  { to: '/about', label: ui.nav.about },
  { to: '/products', label: ui.nav.products },
  // { to: '/distributors', label: ui.nav.distributors },
  {
    to: 'https://www.alemanfeed.com/modules/recruitment/careers.php?lang=ar',
    label: ui.nav.careers,
    isExternal: true,
  },
  // { to: '/articles', label: ui.nav.articles },
  { to: '/contact', label: ui.nav.contact }
];

export const secondaryNav: NavItem[] = [
  // { to: '/quality', label: ui.nav.quality },
];