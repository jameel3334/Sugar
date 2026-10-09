import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {
  buildOrder, DemoInventory, TradeMaxClient, validateCheckout,
  type CartLine, type CheckoutDetails, type InventoryProvider, type Order, type StockLevel,
} from '@scentual/core';
import { mapping } from './trademax-mapping.ts';

const env = process.env;
const provider: InventoryProvider = env.TRADEMAX_BASE_URL && env.TRADEMAX_API_KEY
  ? new TradeMaxClient({
      baseUrl: env.TRADEMAX_BASE_URL, apiKey: env.TRADEMAX_API_KEY, branchId: env.TRADEMAX_BRANCH_ID,
      itemsPath: env.TRADEMAX_ITEMS_PATH, ordersPath: env.TRADEMAX_ORDERS_PATH,
    }, mapping)
  : new DemoInventory();
const live = provider instanceof TradeMaxClient;

// ---- stock cache -----------------------------------------------------------
let stock = new Map<string, StockLevel>();
let stockAt = 0;
async function refreshStock() {
  try {
    stock = new Map((await provider.fetchStock()).map((s) => [s.sku, s]));
    stockAt = Date.now();
  } catch (err) {
    console.error('stock refresh failed', err);
  }
}

// ---- durable queue for orders TradeMax couldn't accept -----------------------
const QUEUE = new URL('../data/orders.json', import.meta.url);
async function readQueue(): Promise<Order[]> {
  try { return JSON.parse(await readFile(QUEUE, 'utf8')); } catch { return []; }
}
async function writeQueue(q: Order[]) {
  await mkdir(new URL('.', QUEUE), { recursive: true });
  await writeFile(QUEUE, JSON.stringify(q, null, 2));
}
async function flushQueue() {
  const q = await readQueue();
  if (!q.length || !live) return;
  const left: Order[] = [];
  for (const o of q) {
    try { await provider.submitOrder(o); } catch { left.push(o); }
  }
  await writeQueue(left);
}

// ---- http --------------------------------------------------------------------
const ALLOWED_ORIGINS = (env.ALLOWED_ORIGINS ?? '*').split(',');

function send(req: IncomingMessage, res: ServerResponse, status: number, body: unknown) {
  const origin = req.headers.origin ?? '';
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': ALLOWED_ORIGINS.includes('*') ? '*' : ALLOWED_ORIGINS.includes(origin) ? origin : '',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage, limit = 64 * 1024): Promise<unknown> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw new Error('payload too large');
    chunks.push(c);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  try {
    if (req.method === 'OPTIONS') return send(req, res, 204, null);
    if (url.pathname === '/api/health') return send(req, res, 200, { ok: true, mode: live ? 'trademax' : 'demo', stockAt });
    if (url.pathname === '/api/stock' && req.method === 'GET') {
      if (Date.now() - stockAt > 5 * 60_000) await refreshStock();
      return send(req, res, 200, { updatedAt: stockAt, items: [...stock.values()] });
    }
    if (url.pathname === '/api/orders' && req.method === 'POST') {
      const body = (await readJson(req)) as { lines?: CartLine[]; customer?: CheckoutDetails; channel?: Order['channel'] };
      const lines = (body.lines ?? []).filter((l) => l && typeof l.productId === 'string' && [100, 200].includes(l.size) && Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 50);
      if (!lines.length || !body.customer) return send(req, res, 400, { ok: false, message: 'empty order' });
      const errors = validateCheckout(body.customer);
      if (Object.keys(errors).length) return send(req, res, 422, { ok: false, errors });
      // Totals are recomputed here; client-side prices are never trusted.
      const order = buildOrder(lines, body.customer, body.channel ?? 'web', stock);
      try {
        return send(req, res, 200, await provider.submitOrder(order));
      } catch (err) {
        console.error('TradeMax submit failed, queued', order.reference, err);
        await writeQueue([...(await readQueue()), order]);
        return send(req, res, 202, { ok: true, reference: order.reference, mode: 'queued' });
      }
    }
    send(req, res, 404, { ok: false });
  } catch (err) {
    console.error(err);
    send(req, res, 500, { ok: false, message: 'server error' });
  }
});

const port = Number(env.PORT ?? 8787);
server.listen(port, () => console.log(`api on :${port} (${live ? 'TradeMax' : 'demo'} mode)`));
refreshStock();
setInterval(() => { refreshStock(); flushQueue(); }, 5 * 60_000).unref();
