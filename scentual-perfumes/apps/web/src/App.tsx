import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Lenis from 'lenis';
import { useEffect, useState, type ComponentType } from 'react';
import { StoreProvider, useStore, VARIANTS, type VariantId } from './lib/store.tsx';
import { Overlays } from './components/Overlays.tsx';
import { Noir } from './variants/Noir.tsx';
import { Majlis } from './variants/Majlis.tsx';
import { Atelier } from './variants/Atelier.tsx';
import { Prism } from './variants/Prism.tsx';
import { Dunes } from './variants/Dunes.tsx';

const VIEWS: Record<VariantId, ComponentType> = { noir: Noir, majlis: Majlis, atelier: Atelier, prism: Prism, dunes: Dunes };

function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, prevent: (node: HTMLElement) => !!node.closest?.('.panel') });
    let raf = 0;
    const loop = (t: number) => {
      if (document.body.classList.contains('locked')) lenis.stop(); else lenis.start();
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    (window as unknown as { lenis: Lenis }).lenis = lenis;
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
}

function Switcher() {
  const { variant, setVariant, d } = useStore();
  const [open, setOpen] = useState(true);
  return (
    <motion.div className="switcher" initial={{ y: 120 }} animate={{ y: 0 }} transition={{ delay: 1.2, type: 'spring', stiffness: 120, damping: 16 }}>
      <button className="switcher-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{d.design} {VARIANTS.findIndex((v) => v.id === variant) + 1}/5</button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="switcher-list" initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}>
            {VARIANTS.map((v, i) => (
              <button key={v.id} className={variant === v.id ? 'on' : ''} onClick={() => setVariant(v.id)} title={v.tagline}>
                {variant === v.id && <motion.span layoutId="sw-bg" className="sw-bg" />}
                <span className="sw-label"><b>{i + 1}</b> {v.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Shell() {
  const { variant } = useStore();
  const View = VIEWS[variant];
  useEffect(() => {
    document.documentElement.dataset.variant = variant;
    (window as unknown as { lenis?: Lenis }).lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [variant]);
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={variant} className={`variant v-${variant}`} data-variant={variant}>
          <View />
          <motion.div className="curtain" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} exit={{ scaleY: 1 }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} style={{ originY: 0 }} />
        </motion.div>
      </AnimatePresence>
      <div className={`overlays v-${variant}`}><Overlays /></div>
      <Switcher />
    </>
  );
}

export function App() {
  useSmoothScroll();
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider><Shell /></StoreProvider>
    </MotionConfig>
  );
}
