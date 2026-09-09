import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Lang, Localized } from '../types/content';

type LanguageValue = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Resolves a localized value for the active language. */
  t: (value: Localized) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: {children: React.ReactNode;}) {
  const [lang, setLang] = useState<Lang>('ar');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', dir);
  }, [lang, dir]);

  const t = useCallback((value: Localized) => value[lang], [lang]);
  const toggle = useCallback(() => setLang((prev) => prev === 'ar' ? 'en' : 'ar'), []);

  const value = useMemo<LanguageValue>(() => ({ lang, dir, setLang, toggle, t }), [lang, dir, toggle, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}