import type { LanguageDefinition } from './types';

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },
];

export const RTL_LANGUAGES = ['ar', 'fa', 'ur', 'he'];

export const DEFAULT_LANGUAGE = 'ar';

export function getLanguageDirection(lang: string): 'rtl' | 'ltr' {
  return RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
}
