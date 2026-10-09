import type { Order, OrderResult, StockLevel } from './types.ts';

/**
 * TradeMax integration.
 *
 * Every storefront (web, iOS, Android) talks to our own API (apps/api), never
 * to TradeMax directly: the API key stays on the server, and if TradeMax is
 * down orders are queued instead of lost. Only this file and
 * `apps/api/src/trademax-mapping.ts` need to change once the real TradeMax
 * endpoint and field names are confirmed.
 */
export interface InventoryProvider {
  fetchStock(): Promise<StockLevel[]>;
  submitOrder(order: Order): Promise<OrderResult>;
}

export interface TradeMaxConfig {
  baseUrl: string;
  apiKey: string;
  branchId?: string;
  itemsPath?: string;
  ordersPath?: string;
  fetch?: typeof fetch;
}

/** Field mapping between TradeMax payloads and ours. Adjust to the real schema. */
export interface TradeMaxMapping {
  toStock(item: Record<string, unknown>): StockLevel | null;
  fromOrder(order: Order, branchId?: string): Record<string, unknown>;
  externalId(response: Record<string, unknown>): string | undefined;
}

export class TradeMaxClient implements InventoryProvider {
  private cfg: TradeMaxConfig;
  private map: TradeMaxMapping;

  constructor(cfg: TradeMaxConfig, map: TradeMaxMapping) {
    this.cfg = cfg;
    this.map = map;
  }

  private async request(path: string, init: RequestInit = {}) {
    const f = this.cfg.fetch ?? fetch;
    const res = await f(new URL(path, this.cfg.baseUrl), {
      ...init,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.cfg.apiKey}`, ...init.headers },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`TradeMax ${init.method ?? 'GET'} ${path} → ${res.status}`);
    return res.json() as Promise<unknown>;
  }

  async fetchStock(): Promise<StockLevel[]> {
    const body = await this.request(this.cfg.itemsPath ?? '/api/items');
    const items = Array.isArray(body) ? body : ((body as { items?: unknown[]; data?: unknown[] }).items ?? (body as { data?: unknown[] }).data ?? []);
    return items.flatMap((it) => this.map.toStock(it as Record<string, unknown>) ?? []);
  }

  async submitOrder(order: Order): Promise<OrderResult> {
    const body = (await this.request(this.cfg.ordersPath ?? '/api/sales-orders', {
      method: 'POST',
      body: JSON.stringify(this.map.fromOrder(order, this.cfg.branchId)),
    })) as Record<string, unknown>;
    return { ok: true, reference: order.reference, externalId: this.map.externalId(body), mode: 'trademax' };
  }
}

/** Used until TradeMax credentials exist, and by the static preview build. */
export class DemoInventory implements InventoryProvider {
  async fetchStock(): Promise<StockLevel[]> {
    return [];
  }
  async submitOrder(order: Order): Promise<OrderResult> {
    return { ok: true, reference: order.reference, mode: 'demo' };
  }
}
