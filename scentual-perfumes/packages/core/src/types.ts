export type Gender = 'men' | 'women' | 'unisex';
export type Family = 'oud' | 'amber' | 'musk' | 'sweet' | 'fresh' | 'floral' | 'woody' | 'leather' | 'classic';
export type CollectionId = 'signature' | 'argeville' | 'luzi' | 'seluz';
export type SizeMl = 100 | 200;

export interface Product {
  id: string;
  /** Join key with TradeMax item codes (see trademax.ts mapping). */
  sku: string;
  name: string;
  rawName: string;
  collection: CollectionId;
  gender: Gender;
  family: Family;
  notes: string[];
  image?: string | null;
  signature: boolean;
  defaultSize?: SizeMl;
}

/** Live values from the inventory system; overlay on the static catalog. */
export interface StockLevel {
  sku: string;
  inStock: boolean;
  quantity?: number;
  /** Optional price overrides in KWD per size. */
  prices?: Partial<Record<SizeMl, number>>;
}

export interface CartLine {
  productId: string;
  size: SizeMl;
  qty: number;
}

export interface Totals {
  itemCount: number;
  listSubtotal: number;
  bundleDiscount: number;
  bundlesApplied: number;
  delivery: number;
  total: number;
  /** 100ml bottles still needed to unlock the next bundle. */
  toNextBundle: number;
}

export type PaymentMethod = 'cash' | 'knet_on_delivery' | 'online';

export interface CheckoutDetails {
  name: string;
  phone: string;
  governorate: string;
  area: string;
  block: string;
  street: string;
  avenue?: string;
  house: string;
  floor?: string;
  notes?: string;
  payment: PaymentMethod;
}

export interface Order {
  reference: string;
  createdAt: string;
  lines: Array<CartLine & { sku: string; name: string; unitPrice: number }>;
  totals: Totals;
  customer: CheckoutDetails;
  channel: 'web' | 'ios' | 'android';
}

export interface OrderResult {
  ok: boolean;
  reference: string;
  /** Id assigned by TradeMax once accepted. */
  externalId?: string;
  mode: 'trademax' | 'queued' | 'demo';
  message?: string;
}
