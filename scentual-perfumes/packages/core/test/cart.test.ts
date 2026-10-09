import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addLine, totals, products, normalizeKuwaitPhone, validateCheckout, buildOrder, orderSummary } from '../src/index.ts';

const ids = products.slice(10, 16).map((p) => p.id);

test('five 100ml bottles cost the bundle price with free delivery', () => {
  let lines = ids.slice(0, 5).reduce((acc, id) => addLine(acc, id, 100), [] as ReturnType<typeof addLine>);
  const t = totals(lines);
  assert.equal(t.bundlesApplied, 1);
  assert.equal(t.total, 20);
  assert.equal(t.delivery, 0);
  lines = addLine(lines, ids[5], 100);
  assert.equal(totals(lines).total, 26);
  assert.equal(totals(lines).toNextBundle, 4);
});

test('a single bottle pays delivery', () => {
  const t = totals(addLine([], ids[0], 100));
  assert.equal(t.delivery, 2);
  assert.equal(t.total, 8);
});

test('200ml bottles never count toward the bundle', () => {
  const t = totals(addLine([], ids[0], 200, 5));
  assert.equal(t.bundlesApplied, 0);
  assert.equal(t.total, 50);
});

test('kuwaiti phone normalisation', () => {
  assert.equal(normalizeKuwaitPhone('+965 9988 7766'), '+96599887766');
  assert.equal(normalizeKuwaitPhone('٥٥١٢٣٤٥٦'), '+96555123456');
  assert.equal(normalizeKuwaitPhone('12345678'), null);
});

test('checkout validation and order summary', () => {
  const customer = { name: 'Test', phone: '99887766', governorate: 'hawalli', area: 'Salmiya', block: '10', street: '5', house: '12', payment: 'cash' as const };
  assert.deepEqual(validateCheckout(customer), {});
  assert.equal(validateCheckout({ ...customer, phone: '123' }).phone, 'invalid');
  const order = buildOrder(addLine([], ids[0], 100, 5), customer);
  assert.match(orderSummary(order), /Total: 20 KWD/);
  assert.equal(order.customer.phone, '+96599887766');
});
