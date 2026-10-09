import { config } from './config.ts';
import { getProduct } from './catalog.ts';
import type { CartLine, SizeMl, StockLevel, Totals } from './types.ts';

export function unitPrice(sku: string, size: SizeMl, stock?: Map<string, StockLevel>): number {
  return stock?.get(sku)?.prices?.[size] ?? config.prices[size];
}

export function addLine(lines: CartLine[], productId: string, size: SizeMl, qty = 1): CartLine[] {
  const i = lines.findIndex((l) => l.productId === productId && l.size === size);
  if (i === -1) return [...lines, { productId, size, qty }];
  return lines.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l));
}

export function setQty(lines: CartLine[], productId: string, size: SizeMl, qty: number): CartLine[] {
  if (qty <= 0) return lines.filter((l) => !(l.productId === productId && l.size === size));
  return lines.map((l) => (l.productId === productId && l.size === size ? { ...l, qty } : l));
}

/** Any N bottles of the bundle size are charged at the bundle price; delivery is free once a bundle applies. */
export function totals(lines: CartLine[], stock?: Map<string, StockLevel>): Totals {
  const { bundle, delivery } = config;
  let listSubtotal = 0;
  let itemCount = 0;
  const bundleUnits: number[] = [];
  for (const l of lines) {
    const p = getProduct(l.productId);
    if (!p) continue;
    const price = unitPrice(p.sku, l.size, stock);
    listSubtotal += price * l.qty;
    itemCount += l.qty;
    if (l.size === bundle.size) for (let i = 0; i < l.qty; i++) bundleUnits.push(price);
  }
  // Bundle the most expensive bottles first so the customer always gets the best deal.
  bundleUnits.sort((a, b) => b - a);
  const bundlesApplied = Math.floor(bundleUnits.length / bundle.count);
  let bundleDiscount = 0;
  for (let b = 0; b < bundlesApplied; b++) {
    const group = bundleUnits.slice(b * bundle.count, (b + 1) * bundle.count);
    bundleDiscount += Math.max(0, group.reduce((s, v) => s + v, 0) - bundle.price);
  }
  const afterDiscount = listSubtotal - bundleDiscount;
  const deliveryFee = itemCount === 0 || bundlesApplied > 0 || afterDiscount >= delivery.freeFrom ? 0 : delivery.fee;
  const rem = bundleUnits.length % bundle.count;
  return {
    itemCount,
    listSubtotal: round(listSubtotal),
    bundleDiscount: round(bundleDiscount),
    bundlesApplied,
    delivery: deliveryFee,
    total: round(afterDiscount + deliveryFee),
    toNextBundle: bundle.count - rem,
  };
}

const round = (n: number) => Math.round(n * 1000) / 1000;
