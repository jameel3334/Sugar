import type { TradeMaxMapping } from '@scentual/core';

/**
 * PLACEHOLDER field names — confirm against the TradeMax API docs/export and
 * edit only this file. `sku` in our catalog must equal the TradeMax item code
 * (or add a lookup table here).
 */
export const mapping: TradeMaxMapping = {
  toStock(item) {
    const sku = String(item.ItemCode ?? item.itemCode ?? item.sku ?? '');
    if (!sku) return null;
    const qty = Number(item.QtyOnHand ?? item.quantity ?? item.stock ?? 0);
    const p100 = Number(item.Price100 ?? item.price ?? NaN);
    const p200 = Number(item.Price200 ?? NaN);
    return {
      sku,
      quantity: qty,
      inStock: qty > 0,
      prices: { ...(Number.isFinite(p100) && { 100: p100 }), ...(Number.isFinite(p200) && { 200: p200 }) },
    };
  },
  fromOrder(order, branchId) {
    const c = order.customer;
    return {
      ExternalRef: order.reference,
      BranchId: branchId,
      Channel: order.channel,
      OrderDate: order.createdAt,
      Customer: { Name: c.name, Mobile: c.phone },
      DeliveryAddress: { Governorate: c.governorate, Area: c.area, Block: c.block, Street: c.street, Avenue: c.avenue, House: c.house, Floor: c.floor, Notes: c.notes },
      PaymentMethod: c.payment,
      Lines: order.lines.map((l) => ({ ItemCode: l.sku, Description: `${l.name} ${l.size}ml`, Size: l.size, Qty: l.qty, UnitPrice: l.unitPrice })),
      Discount: order.totals.bundleDiscount,
      DeliveryFee: order.totals.delivery,
      Total: order.totals.total,
    };
  },
  externalId: (res) => (res.OrderNo ?? res.id ?? res.orderId) as string | undefined,
};
