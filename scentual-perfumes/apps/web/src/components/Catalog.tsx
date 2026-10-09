import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { collections, families, type CollectionId, type Family, type Filter, type Gender, type Product } from '@scentual/core';
import { useCatalog, useStore } from '../lib/store.tsx';

const FAMILY_KEYS = Object.keys(families) as Family[];
const GENDERS: Array<Gender | 'all'> = ['all', 'men', 'women', 'unisex'];
const COLLECTIONS = ['all', ...Object.keys(collections)] as Array<CollectionId | 'all'>;

function Chips<T extends string>({ value, options, label, onChange, name }: { value: T; options: T[]; label: (v: T) => string; onChange: (v: T) => void; name: string }) {
  return (
    <div className="chips" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button key={o} role="radio" aria-checked={value === o} className={`chip ${value === o ? 'on' : ''}`} onClick={() => onChange(o)}>
          {value === o && <motion.span layoutId={`chip-${name}`} className="chip-bg" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
          <span className="chip-label">{label(o)}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Shared, themeable catalog: search, filters, animated grid and infinite load.
 * Each design supplies its own card.
 */
export function Catalog({ renderCard, initial, title, id = 'shop', className, controlsRef }: {
  renderCard: (p: Product, i: number) => ReactNode;
  initial?: Filter;
  title?: ReactNode;
  id?: string;
  className?: string;
  controlsRef?: React.MutableRefObject<((f: Partial<Filter>) => void) | null>;
}) {
  const { d, locale } = useStore();
  const cat = useCatalog(initial);
  const sentinel = useRef<HTMLDivElement>(null);
  if (controlsRef) controlsRef.current = cat.setFilter;

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && cat.hasMore && cat.more(), { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [cat.hasMore, cat.items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id={id} className={`catalog ${className ?? ''}`}>
      {title}
      <div className="catalog-controls">
        <label className="search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input value={cat.filter.query ?? ''} onChange={(e) => cat.setFilter({ query: e.target.value })} placeholder={d.search} aria-label={d.search} />
        </label>
        <Chips name="gender" value={cat.filter.gender ?? 'all'} options={GENDERS} label={(g) => (g === 'all' ? d.all : d[g])} onChange={(gender) => cat.setFilter({ gender })} />
        <Chips name="family" value={cat.filter.family ?? 'all'} options={['all', ...FAMILY_KEYS] as Array<Family | 'all'>} label={(f) => (f === 'all' ? d.all : families[f][locale])} onChange={(family) => cat.setFilter({ family })} />
        <Chips name="collection" value={cat.filter.collection ?? 'all'} options={COLLECTIONS} label={(c) => (c === 'all' ? d.all : collections[c][locale])} onChange={(collection) => cat.setFilter({ collection })} />
        <motion.p key={cat.total} className="result-count" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          {cat.total} {d.results}
        </motion.p>
      </div>
      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout">
          {cat.items.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              className="grid-cell"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 24) * 0.025 }}
            >
              {renderCard(p, i)}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div ref={sentinel} className="sentinel" />
      {cat.hasMore && <button className="btn ghost load-more" onClick={cat.more}>{d.loadMore}</button>}
    </section>
  );
}
