import { DemoInventory, buildOrder, type CartLine, type CheckoutDetails, type OrderResult, type StockLevel } from '@scentual/core';

const BASE = import.meta.env.VITE_API_URL ?? './api';
const demo = new DemoInventory();

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { 'content-type': 'application/json' }, signal: AbortSignal.timeout(8000) });
  if (!res.ok && res.status !== 202) throw Object.assign(new Error(`api ${res.status}`), { status: res.status, body: await res.json().catch(() => null) });
  return res.json() as Promise<T>;
}

export async function fetchStock(): Promise<StockLevel[]> {
  try {
    return (await call<{ items: StockLevel[] }>('/stock')).items;
  } catch {
    return demo.fetchStock();
  }
}

/** Falls back to preview mode when no API is reachable (static preview / offline dev). */
export async function placeOrder(lines: CartLine[], customer: CheckoutDetails): Promise<OrderResult & { summaryOrder: ReturnType<typeof buildOrder> }> {
  const local = buildOrder(lines, customer, 'web');
  try {
    const r = await call<OrderResult>('/orders', { method: 'POST', body: JSON.stringify({ lines, customer, channel: 'web' }) });
    return { ...r, summaryOrder: { ...local, reference: r.reference } };
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (status && status < 500 && status !== 404) throw err;
    return { ...(await demo.submitOrder(local)), summaryOrder: local };
  }
}
