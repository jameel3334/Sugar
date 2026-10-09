import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from '../lib/store.tsx';

export function NavActions() {
  const { locale, setLocale, totals, setBagOpen, pulse, d } = useStore();
  const ctl = useAnimationControls();
  useEffect(() => { if (pulse) ctl.start({ scale: [1, 1.35, 0.9, 1], rotate: [0, -12, 8, 0], transition: { duration: 0.6 } }); }, [pulse, ctl]);
  return (
    <div className="nav-actions">
      <button className="lang" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} aria-label="Language">
        {locale === 'en' ? 'ع' : 'EN'}
      </button>
      <motion.button animate={ctl} className="bag-btn" onClick={() => setBagOpen(true)} aria-label={d.bag}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M6 8h12l-1 12H7L6 8z M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        {totals.itemCount > 0 && (
          <motion.span key={totals.itemCount} className="bag-count" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
            {totals.itemCount}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}

/** 5-dot meter for the 5-for-20 offer. */
export function BundleMeter({ compact }: { compact?: boolean }) {
  const { totals, d } = useStore();
  const filled = totals.toNextBundle === 5 ? (totals.bundlesApplied ? 5 : 0) : 5 - totals.toNextBundle;
  return (
    <div className={`bundle-meter ${compact ? 'compact' : ''}`}>
      <div className="dots">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.span key={i} className="dot" animate={{ scale: i < filled ? [1, 1.4, 1] : 1, opacity: i < filled ? 1 : 0.3 }} transition={{ duration: 0.4, delay: i * 0.05 }} />
        ))}
      </div>
      {!compact && <p>{totals.bundlesApplied && totals.toNextBundle === 5 ? d.bundleUnlocked : d.toNextBundle(totals.toNextBundle)}</p>}
    </div>
  );
}
