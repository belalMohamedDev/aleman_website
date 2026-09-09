import type { FeedPriceRow, Localized } from '../types/content';

const L = (ar: string, en: string): Localized => ({ ar, en });

/**
 * Price rows describe the shape of the future data feed only. No values are
 * included, because live pricing is not connected to any official source yet.
 */
export const feedPriceRows: FeedPriceRow[] = [
{ id: 'poultry-starter', label: L('علف دواجن — بادئ', 'Poultry feed — starter'), unit: L('طن', 'Ton') },
{ id: 'poultry-grower', label: L('علف دواجن — نامي', 'Poultry feed — grower'), unit: L('طن', 'Ton') },
{ id: 'poultry-finisher', label: L('علف دواجن — ناهي', 'Poultry feed — finisher'), unit: L('طن', 'Ton') },
{ id: 'livestock-dairy', label: L('علف مواشي — ألبان', 'Livestock feed — dairy'), unit: L('طن', 'Ton') },
{ id: 'livestock-fattening', label: L('علف مواشي — تسمين', 'Livestock feed — fattening'), unit: L('طن', 'Ton') },
{ id: 'rabbit', label: L('علف أرانب', 'Rabbit feed'), unit: L('طن', 'Ton') },
{ id: 'duck', label: L('علف بط', 'Duck feed'), unit: L('طن', 'Ton') }];


export type FeedPriceApiResponse = {
  updatedAt: string;
  rows: {id: string;price: number;currency: string;changePercent: number;}[];
};

/** Placeholder integration point for a future official pricing endpoint. */
export async function fetchFeedPrices(): Promise<FeedPriceApiResponse | null> {
  return null;
}