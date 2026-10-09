import { config, formatKWD } from './config.ts';
import { getProduct } from './catalog.ts';
import { totals, unitPrice } from './cart.ts';
import { normalizeKuwaitPhone } from './kuwait.ts';
import type { CartLine, CheckoutDetails, Order, StockLevel } from './types.ts';

export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, 'required' | 'invalid'>>;

export function validateCheckout(d: CheckoutDetails): CheckoutErrors {
  const e: CheckoutErrors = {};
  for (const k of ['name', 'phone', 'governorate', 'area', 'block', 'street', 'house'] as const) {
    if (!d[k]?.trim()) e[k] = 'required';
  }
  if (d.phone && !normalizeKuwaitPhone(d.phone)) e.phone = 'invalid';
  return e;
}

export function makeReference(now = new Date()): string {
  const day = now.toISOString().slice(2, 10).replace(/-/g, '');
  return `SP-${day}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function buildOrder(lines: CartLine[], customer: CheckoutDetails, channel: Order['channel'] = 'web', stock?: Map<string, StockLevel>): Order {
  return {
    reference: makeReference(),
    createdAt: new Date().toISOString(),
    channel,
    customer: { ...customer, phone: normalizeKuwaitPhone(customer.phone) ?? customer.phone },
    totals: totals(lines, stock),
    lines: lines.flatMap((l) => {
      const p = getProduct(l.productId);
      return p ? [{ ...l, sku: p.sku, name: p.name, unitPrice: unitPrice(p.sku, l.size, stock) }] : [];
    }),
  };
}

/** Plain-text summary used for the WhatsApp fallback and staff notifications. */
export function orderSummary(o: Order): string {
  const c = o.customer;
  const addr = [c.area, `Block ${c.block}`, `St ${c.street}`, c.avenue && `Ave ${c.avenue}`, `House ${c.house}`, c.floor && `Floor ${c.floor}`].filter(Boolean).join(', ');
  return [
    `New order ${o.reference}`,
    ...o.lines.map((l) => `• ${l.qty} × ${l.name} (${l.size}ml) [${l.sku}]`),
    o.totals.bundleDiscount ? `Bundle discount: -${formatKWD(o.totals.bundleDiscount)}` : '',
    `Delivery: ${o.totals.delivery ? formatKWD(o.totals.delivery) : 'Free'}`,
    `Total: ${formatKWD(o.totals.total)} (${c.payment.replace(/_/g, ' ')})`,
    `${c.name} — ${c.phone}`,
    addr,
    c.notes ? `Notes: ${c.notes}` : '',
  ].filter(Boolean).join('\n');
}

export const whatsappLink = (o: Order) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(orderSummary(o))}`;
