import type { Localized } from './types';

export const L = (ar: string, en: string, others?: Record<string, string>): Localized => ({
  ar,
  en,
  ...(others || {}),
});
