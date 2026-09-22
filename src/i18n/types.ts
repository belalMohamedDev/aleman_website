export type SupportedLang = 'ar' | 'en' | string;

export type Localized = Record<string, string> & {
  ar: string;
  en: string;
};

export type LanguageDefinition = {
  code: string;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
};
