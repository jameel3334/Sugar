import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  collections, config, families, formatKWD, genders, getProduct, governorates, unitPrice, validateCheckout, whatsappLink,
  type CheckoutDetails, type CheckoutErrors, type Order, type OrderResult, type SizeMl,
} from '@scentual/core';
import { useStore } from '../lib/store.tsx';
import { placeOrder } from '../lib/api.ts';
import { ProductVisual } from './Bottle.tsx';
import { BundleMeter } from './NavActions.tsx';

const ease = [0.16, 1, 0.3, 1] as const;

function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    addEventListener('keydown', k);
    document.body.classList.add('locked');
    return () => { removeEventListener('keydown', k); document.body.classList.remove('locked'); };
  }, [open, close]);
}

function Backdrop({ onClick }: { onClick: () => void }) {
  return <motion.div className="backdrop" onClick={onClick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />;
}

// ---------- Quick view -------------------------------------------------------
function QuickView() {
  const { quick: p, closeQuick, add, d, locale, isSoldOut } = useStore();
  const [size, setSize] = useState<SizeMl>(100);
  const [burst, setBurst] = useState(0);
  useEscape(!!p, closeQuick);
  useEffect(() => { if (p) setSize(p.defaultSize ?? 100); }, [p]);
  return (
    <AnimatePresence>
      {p && (
        <div className="overlay-root">
          <Backdrop onClick={closeQuick} />
          <motion.div className="quick panel" role="dialog" aria-modal aria-label={p.name}
            initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ duration: 0.6, ease }}>
            <button className="close" onClick={closeQuick} aria-label="Close">×</button>
            <motion.div className="quick-visual" style={{ ['--glow' as string]: families[p.family].glow }}
              initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 0.9, ease, delay: 0.1 }}>
              <motion.div initial={{ scale: 1.2, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease }} className="quick-visual-inner">
                <ProductVisual product={p} />
              </motion.div>
            </motion.div>
            <div className="quick-info">
              <motion.p className="eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                {collections[p.collection][locale]} · {genders[p.gender][locale]}
              </motion.p>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease }}>{p.name}</motion.h2>
              <motion.span className="fam-pill" style={{ background: families[p.family].color }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.45, type: 'spring' }}>
                {families[p.family][locale]}
              </motion.span>
              <p className="label">{d.notes}</p>
              <ul className="notes">
                {p.notes.map((n, i) => (
                  <motion.li key={n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>{n}</motion.li>
                ))}
              </ul>
              <p className="label">{d.size}</p>
              <div className="sizes">
                {config.sizes.map((s) => (
                  <button key={s} className={`size ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>
                    {size === s && <motion.span layoutId="size-bg" className="chip-bg" />}
                    <span className="chip-label">{s}ml · {formatKWD(unitPrice(p.sku, s), locale)}</span>
                  </button>
                ))}
              </div>
              <div className="add-wrap">
                <motion.button whileTap={{ scale: 0.94 }} className="btn primary add" disabled={isSoldOut(p)}
                  onClick={() => { add(p.id, size); setBurst((b) => b + 1); }}>
                  {isSoldOut(p) ? d.soldOut : d.addToBag}
                </motion.button>
                <Burst trigger={burst} />
              </div>
              <BundleMeter />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Particle burst from the add-to-bag button. */
export function Burst({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div key={trigger} className="burst" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return <motion.span key={i} initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: Math.cos(a) * 90, y: Math.sin(a) * 60, scale: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} />;
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Bag drawer -------------------------------------------------------
function Bag() {
  const { bagOpen, setBagOpen, lines, setQty, totals, d, locale, setCheckoutOpen } = useStore();
  const close = () => setBagOpen(false);
  useEscape(bagOpen, close);
  const side = locale === 'ar' ? '-100%' : '100%';
  return (
    <AnimatePresence>
      {bagOpen && (
        <div className="overlay-root">
          <Backdrop onClick={close} />
          <motion.aside className="bag panel" role="dialog" aria-modal aria-label={d.bag}
            initial={{ x: side }} animate={{ x: 0 }} exit={{ x: side }} transition={{ duration: 0.55, ease }}>
            <header><h3>{d.bag}</h3><button className="close" onClick={close} aria-label="Close">×</button></header>
            <BundleMeter />
            <div className="bag-lines">
              <AnimatePresence initial={false}>
                {lines.length === 0 && <motion.p key="empty" className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{d.emptyBag}</motion.p>}
                {lines.map((l) => {
                  const p = getProduct(l.productId)!;
                  return (
                    <motion.div key={`${l.productId}-${l.size}`} layout className="bag-line"
                      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }} transition={{ duration: 0.4, ease }}>
                      <div className="bag-thumb"><ProductVisual product={p} /></div>
                      <div className="bag-meta">
                        <strong>{p.name}</strong>
                        <span>{l.size}ml · {formatKWD(unitPrice(p.sku, l.size) * l.qty, locale)}</span>
                        <div className="qty">
                          <button onClick={() => setQty(l.productId, l.size, l.qty - 1)} aria-label="-">−</button>
                          <motion.span key={l.qty} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{l.qty}</motion.span>
                          <button onClick={() => setQty(l.productId, l.size, l.qty + 1)} aria-label="+">+</button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {lines.length > 0 && (
              <footer>
                <Row label={d.subtotal} value={formatKWD(totals.listSubtotal, locale)} />
                {totals.bundleDiscount > 0 && <Row label={d.bundleDiscount} value={`−${formatKWD(totals.bundleDiscount, locale)}`} accent />}
                <Row label={d.delivery} value={totals.delivery ? formatKWD(totals.delivery, locale) : d.free} />
                <Row label={d.total} value={formatKWD(totals.total, locale)} big />
                <motion.button whileTap={{ scale: 0.97 }} className="btn primary wide" onClick={() => { setBagOpen(false); setCheckoutOpen(true); }}>{d.checkout}</motion.button>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, accent, big }: { label: string; value: string; accent?: boolean; big?: boolean }) {
  return (
    <div className={`row ${accent ? 'accent' : ''} ${big ? 'big' : ''}`}>
      <span>{label}</span>
      <motion.span key={value} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{value}</motion.span>
    </div>
  );
}

// ---------- Checkout -------------------------------------------------------------
const EMPTY: CheckoutDetails = { name: '', phone: '', governorate: '', area: '', block: '', street: '', avenue: '', house: '', floor: '', notes: '', payment: 'cash' };

function Field({ label, error, children, wide }: { label: string; error?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`field ${error ? 'err' : ''} ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      {children}
      <AnimatePresence>{error && <motion.em initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>{error}</motion.em>}</AnimatePresence>
    </label>
  );
}

function Checkout() {
  const { checkoutOpen, setCheckoutOpen, lines, totals, d, locale, clear } = useStore();
  const [form, setForm] = useState<CheckoutDetails>(() => {
    try { return { ...EMPTY, ...JSON.parse(localStorage.getItem('sp.address') ?? '{}') }; } catch { return EMPTY; }
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<(OrderResult & { summaryOrder: Order }) | null>(null);
  const close = () => { setCheckoutOpen(false); setDone(null); };
  useEscape(checkoutOpen, close);

  const set = (k: keyof CheckoutDetails) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value, ...(k === 'governorate' && { area: '' }) }));
  const msg = (k: keyof CheckoutDetails) => (errors[k] === 'invalid' ? d.invalidPhone : errors[k] ? d.required : undefined);
  const gov = governorates.find((g) => g.id === form.governorate);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validateCheckout(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const r = await placeOrder(lines, form);
      try { const { notes: _n, payment: _p, ...addr } = form; localStorage.setItem('sp.address', JSON.stringify(addr)); } catch { /* ignore */ }
      setDone(r);
      clear();
    } catch (err) {
      setErrors((err as { body?: { errors?: CheckoutErrors } }).body?.errors ?? {});
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <div className="overlay-root">
          <Backdrop onClick={close} />
          <motion.div className="checkout panel" role="dialog" aria-modal aria-label={d.checkout}
            initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }} transition={{ duration: 0.6, ease }}>
            <button className="close" onClick={close} aria-label="Close">×</button>
            <AnimatePresence mode="wait">
              {done ? (
                <Success key="ok" result={done} onClose={close} />
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, scale: 0.96 }}>
                  <h3>{d.checkout}</h3>
                  <div className="form-grid">
                    <Field label={d.name} error={msg('name')} wide><input value={form.name} onChange={set('name')} autoComplete="name" /></Field>
                    <Field label={d.phone} error={msg('phone')} wide><input value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="9XXX XXXX" /></Field>
                    <Field label={d.governorate} error={msg('governorate')}>
                      <select value={form.governorate} onChange={set('governorate')}>
                        <option value="" />
                        {governorates.map((g) => <option key={g.id} value={g.id}>{g[locale]}</option>)}
                      </select>
                    </Field>
                    <Field label={d.area} error={msg('area')}>
                      <select value={form.area} onChange={set('area')} disabled={!gov}>
                        <option value="" />
                        {gov?.areas.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </Field>
                    <Field label={d.block} error={msg('block')}><input value={form.block} onChange={set('block')} inputMode="numeric" /></Field>
                    <Field label={d.street} error={msg('street')}><input value={form.street} onChange={set('street')} /></Field>
                    <Field label={d.avenue}><input value={form.avenue} onChange={set('avenue')} /></Field>
                    <Field label={d.house} error={msg('house')}><input value={form.house} onChange={set('house')} /></Field>
                    <Field label={d.floor}><input value={form.floor} onChange={set('floor')} /></Field>
                    <Field label={d.orderNotes} wide><textarea rows={2} value={form.notes} onChange={set('notes')} /></Field>
                  </div>
                  <p className="label">{d.payment}</p>
                  <div className="sizes">
                    {(['cash', 'knet_on_delivery'] as const).map((m) => (
                      <button type="button" key={m} className={`size ${form.payment === m ? 'on' : ''}`} onClick={() => setForm((f) => ({ ...f, payment: m }))}>
                        {form.payment === m && <motion.span layoutId="pay-bg" className="chip-bg" />}
                        <span className="chip-label">{m === 'cash' ? d.cash : d.knet}</span>
                      </button>
                    ))}
                  </div>
                  <div className="row big"><span>{d.total}</span><span>{formatKWD(totals.total, locale)}</span></div>
                  <motion.button whileTap={{ scale: 0.97 }} className="btn primary wide" disabled={busy || !lines.length}>
                    {busy ? <span className="spinner" /> : d.placeOrder}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Success({ result, onClose }: { result: OrderResult & { summaryOrder: Order }; onClose: () => void }) {
  const { d } = useStore();
  return (
    <motion.div className="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }}>
      <svg viewBox="0 0 100 100" width="110" height="110" aria-hidden>
        <motion.circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease }} />
        <motion.path d="M30 52 l14 14 l26 -30" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7, ease }} />
      </svg>
      <h3>{d.thanks}</h3>
      <p>{d.orderPlaced}</p>
      <p className="ref">{d.reference}: <strong>{result.reference}</strong></p>
      {result.mode === 'demo' && <p className="demo-note">{d.demoNote}</p>}
      <a className="btn primary wide" href={whatsappLink(result.summaryOrder)} target="_blank" rel="noreferrer">{d.sendWhatsapp}</a>
      <button className="btn ghost wide" onClick={onClose}>{d.continueShopping}</button>
    </motion.div>
  );
}

export function Overlays() {
  return (<><QuickView /><Bag /><Checkout /></>);
}
