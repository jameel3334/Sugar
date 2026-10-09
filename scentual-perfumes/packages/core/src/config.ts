import type { SizeMl } from './types.ts';

/**
 * Business rules. Prices are placeholders until TradeMax supplies real ones;
 * the bundle mirrors the current campaign: 5 × 100ml for 20 KWD + free delivery.
 */
export const config = {
  currency: 'KWD',
  sizes: [100, 200] as SizeMl[],
  prices: { 100: 6, 200: 10 } as Record<SizeMl, number>,
  bundle: { size: 100 as SizeMl, count: 5, price: 20 },
  delivery: { fee: 2, freeFrom: 20 },
  whatsapp: '96500000000', // TODO: replace with the shop's WhatsApp number
  instagram: 'scentual.perfumes',
  brand: 'Scentual Perfumes',
};

export function formatKWD(value: number, locale: 'en' | 'ar' = 'en'): string {
  const n = value.toFixed(3).replace(/\.?0+$/, '');
  return locale === 'ar' ? `${n} د.ك` : `${n} KWD`;
}
