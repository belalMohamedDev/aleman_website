import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Lang } from '../types/content';
import type { Localized, LanguageDefinition } from './types';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguageDirection } from './config';

export type LanguageValue = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  supportedLanguages: LanguageDefinition[];
  /** Resolves a localized value for the active language with safe fallback. */
  t: (value: Localized | { [key: string]: string } | string | undefined | null) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

const STORAGE_KEY = 'aleman_preferred_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
          return stored as Lang;
        }
      } catch {
        // Ignore localStorage access errors
      }
    }
    return DEFAULT_LANGUAGE as Lang;
  });

  const dir = getLanguageDirection(lang);
  const isRtl = dir === 'rtl';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', dir);
    document.title = lang === 'ar' ? 'مجموعة شركات الإيمان للأعلاف' : 'Aleman Feed Group';

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore localStorage access errors
    }
  }, [lang, dir]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  /**
   * Safe resolution with graceful fallback:
   * 1. Exact active language
   * 2. Arabic primary fallback
   * 3. English secondary fallback
   * 4. First available string
   */
  const t = useCallback(
    (value: Localized | { [key: string]: string } | string | undefined | null): string => {
      if (!value) return '';
      if (typeof value === 'string') return value;

      const record = value as Record<string, string>;
      if (record[lang]) return record[lang];
      if (record['ar']) return record['ar'];
      if (record['en']) return record['en'];

      const firstKey = Object.keys(record)[0];
      return firstKey ? record[firstKey] : '';
    },
    [lang]
  );

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      dir,
      isRtl,
      setLang,
      toggle,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t,
    }),
    [lang, dir, isRtl, setLang, toggle, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}

export const useLanguage = useLang;