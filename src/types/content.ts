export type Lang = 'ar' | 'en';

export type Localized = {
  ar: string;
  en: string;
};

export type CategoryId = 'poultry' | 'livestock' | 'rabbit' | 'duck';

export type SpecRow = {
  label: Localized;
  /** Undefined means the official value is not published yet. */
  value?: Localized;
};

export type Product = {
  slug: string;
  name: Localized;
  category: CategoryId;
  /** Only set when the figure is printed on the official packaging. */
  protein?: string;
  stage?: Localized;
  packaging?: Localized;
  description: Localized;
  image: string;
  /** True when the product record is a clearly-marked placeholder. */
  placeholder: boolean;
  specs: SpecRow[];
  ingredients: Localized[];
  feeding: {stage: Localized;amount?: Localized;}[];
};

export type ArticleCategoryId =
'poultry-nutrition' |
'livestock-nutrition' |
'rabbit-nutrition' |
'duck-nutrition' |
'farmer-tips' |
'company-news';

export type Article = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  body: Localized[];
  category: ArticleCategoryId;
  date: string;
  image: string;
  readingMinutes: number;
};

export type Job = {
  id: string;
  title: Localized;
  department: Localized;
  location: Localized;
  type: Localized;
  summary: Localized;
  responsibilities: Localized[];
  placeholder: boolean;
};

export type Distributor = {
  id: string;
  name: Localized;
  governorate: Localized;
  city: Localized;
  address: Localized;
  phone: string;
  whatsapp: string;
  verified: boolean;
  placeholder: boolean;
  coords: [number, number];
};

export type FeedPriceRow = {
  id: string;
  label: Localized;
  unit: Localized;
};