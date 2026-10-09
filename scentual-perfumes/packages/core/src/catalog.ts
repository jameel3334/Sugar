import data from './data/catalog.json' with { type: 'json' };
import type { CollectionId, Family, Gender, Product, StockLevel } from './types.ts';

export const products: Product[] = data as Product[];
const byId = new Map(products.map((p) => [p.id, p]));

export const getProduct = (id: string) => byId.get(id);

export const families: Record<Family, { en: string; ar: string; color: string; glow: string }> = {
  oud: { en: 'Oud', ar: 'عود', color: '#6b3f1d', glow: '#c98b4a' },
  amber: { en: 'Amber', ar: 'عنبر', color: '#c7781a', glow: '#ffb547' },
  musk: { en: 'Musk', ar: 'مسك', color: '#d9c7d2', glow: '#fff1f8' },
  sweet: { en: 'Sweet', ar: 'حلو', color: '#e0457b', glow: '#ff8fb5' },
  fresh: { en: 'Fresh', ar: 'منعش', color: '#4aa8d8', glow: '#9be3ff' },
  floral: { en: 'Floral', ar: 'زهري', color: '#e46aa4', glow: '#ffc2e0' },
  woody: { en: 'Woody', ar: 'خشبي', color: '#7a5a3a', glow: '#c9a074' },
  leather: { en: 'Smoky', ar: 'دخاني', color: '#3a1e1a', glow: '#ff5a2a' },
  classic: { en: 'Designer classic', ar: 'كلاسيكي', color: '#c9a45c', glow: '#ffe2a0' },
};

export const collections: Record<CollectionId, { en: string; ar: string }> = {
  signature: { en: 'SP Signatures', ar: 'توقيع SP' },
  argeville: { en: 'Argeville', ar: 'أرجفيل' },
  luzi: { en: 'Luzi', ar: 'لوزي' },
  seluz: { en: 'Seluz', ar: 'سيلوز' },
};

export const genders: Record<Gender, { en: string; ar: string }> = {
  men: { en: 'Men', ar: 'رجالي' },
  women: { en: 'Women', ar: 'نسائي' },
  unisex: { en: 'Unisex', ar: 'للجنسين' },
};

export interface Filter {
  query?: string;
  gender?: Gender | 'all';
  family?: Family | 'all';
  collection?: CollectionId | 'all';
  inStockOnly?: boolean;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, ' ').trim();

export function filterProducts(list: Product[], f: Filter, stock?: Map<string, StockLevel>): Product[] {
  const terms = f.query ? norm(f.query).split(' ').filter(Boolean) : [];
  return list.filter((p) => {
    if (f.gender && f.gender !== 'all' && p.gender !== f.gender && p.gender !== 'unisex') return false;
    if (f.family && f.family !== 'all' && p.family !== f.family) return false;
    if (f.collection && f.collection !== 'all' && p.collection !== f.collection) return false;
    if (f.inStockOnly && stock && stock.get(p.sku)?.inStock === false) return false;
    if (terms.length) {
      const hay = norm(`${p.name} ${p.rawName} ${p.family} ${p.notes.join(' ')}`);
      return terms.every((t) => hay.includes(t));
    }
    return true;
  });
}

/** Stable pseudo-random per product, so generated visuals don't flicker between renders. */
export function seed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

export const featured = products.filter((p) => p.image);
