import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { addLine, dir, formatKWD, unitPrice, filterProducts, getProduct, products, setQty, t, totals, type CartLine, type Filter, type Locale, type Product, type SizeMl, type StockLevel } from '@scentual/core';
import { fetchStock } from './api.ts';

export type VariantId = 'noir' | 'majlis' | 'atelier' | 'prism' | 'dunes';
export const VARIANTS: Array<{ id: VariantId; name: string; tagline: string }> = [
  { id: 'noir', name: 'Noir Ember', tagline: 'Cinematic dark luxury' },
  { id: 'majlis', name: 'Majlis', tagline: 'Arabian heritage, gold & smoke' },
  { id: 'atelier', name: 'Atelier', tagline: 'Light editorial minimal' },
  { id: 'prism', name: 'Prism', tagline: 'Fresh, playful, gen‑Z' },
  { id: 'dunes', name: 'Moods', tagline: 'Immersive scroll story' },
];

const read = <T,>(k: string, fallback: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

function initialVariant(): VariantId {
  const q = new URLSearchParams(location.search).get('v') as VariantId | null;
  if (q && VARIANTS.some((v) => v.id === q)) return q;
  return read<VariantId>('sp.variant', 'noir');
}

function useStoreState() {
  const [variant, setVariantState] = useState<VariantId>(initialVariant);
  const [locale, setLocale] = useState<Locale>(() => read<Locale>('sp.locale', 'en'));
  const [lines, setLines] = useState<CartLine[]>(() => read<CartLine[]>('sp.cart', []).filter((l) => getProduct(l.productId)));
  const [stock, setStock] = useState(new Map<string, StockLevel>());
  const [quickId, setQuickId] = useState<string | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => write('sp.cart', lines), [lines]);
  useEffect(() => {
    write('sp.locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir(locale);
  }, [locale]);
  useEffect(() => { fetchStock().then((s) => setStock(new Map(s.map((x) => [x.sku, x])))); }, []);

  const setVariant = useCallback((v: VariantId) => {
    setVariantState(v);
    write('sp.variant', v);
    const url = new URL(location.href);
    url.searchParams.set('v', v);
    history.replaceState(null, '', url);
  }, []);

  const add = useCallback((id: string, size: SizeMl = 100, qty = 1) => {
    setLines((l) => addLine(l, id, size, qty));
    setPulse((p) => p + 1);
  }, []);

  return {
    variant, setVariant, locale, setLocale, d: t(locale), lines, stock,
    add,
    setQty: (id: string, size: SizeMl, qty: number) => setLines((l) => setQty(l, id, size, qty)),
    clear: () => setLines([]),
    totals: useMemo(() => totals(lines, stock), [lines, stock]),
    quick: quickId ? getProduct(quickId) ?? null : null,
    openQuick: setQuickId,
    closeQuick: () => setQuickId(null),
    bagOpen, setBagOpen, checkoutOpen, setCheckoutOpen, pulse,
    isSoldOut: (p: Product) => stock.get(p.sku)?.inStock === false,
    price: (p: Product) => formatKWD(unitPrice(p.sku, p.defaultSize ?? 100, stock), locale),
  };
}

type Store = ReturnType<typeof useStoreState>;
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useStoreState()}>{children}</Ctx.Provider>;
}
export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider missing');
  return s;
}

/** Filtered + paginated catalog for the grid sections. */
export function useCatalog(initial: Filter = {}, pageSize = 24) {
  const { stock } = useStore();
  const [filter, setFilter] = useState<Filter>(initial);
  const [limit, setLimit] = useState(pageSize);
  const all = useMemo(() => filterProducts(products, filter, stock), [filter, stock]);
  useEffect(() => setLimit(pageSize), [filter, pageSize]);
  return {
    filter,
    setFilter: (f: Partial<Filter>) => setFilter((prev) => ({ ...prev, ...f })),
    items: all.slice(0, limit),
    total: all.length,
    hasMore: limit < all.length,
    more: () => setLimit((l) => l + pageSize),
  };
}

export const img = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;
