import { motion, useScroll, useTransform } from 'framer-motion';
import { featured, families, genders, type Product } from '@scentual/core';
import { img, useStore } from '../lib/store.tsx';
import { Catalog } from '../components/Catalog.tsx';
import { ProductVisual } from '../components/Bottle.tsx';
import { NavActions } from '../components/NavActions.tsx';
import { Reveal, Smoke, SplitText } from '../components/fx.tsx';

/** 8-point star frame from the SP logo, drawn stroke by stroke. */
function Star({ size = 220, className }: { size?: number; className?: string }) {
  const sq = 'M30 30 H170 V170 H30 Z';
  return (
    <motion.svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden
      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}>
      {[0, 45].map((r, i) => (
        <motion.path key={r} d={sq} fill="none" stroke="currentColor" strokeWidth="1.2" transform={`rotate(${r} 100 100)`}
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, delay: i * 0.4, ease: 'easeInOut' }} />
      ))}
      <motion.circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3 }} />
    </motion.svg>
  );
}

function Ornament() {
  return (
    <svg className="m-ornament" viewBox="0 0 300 20" aria-hidden>
      <motion.path d="M0 10 H130 M170 10 H300" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
      <motion.path d="M150 2 L158 10 L150 18 L142 10 Z" fill="currentColor" initial={{ scale: 0, rotate: 0 }} whileInView={{ scale: 1, rotate: 180 }} viewport={{ once: true }} transition={{ delay: 1, type: 'spring' }} style={{ originX: '150px', originY: '10px' }} />
    </svg>
  );
}

function Arch({ p }: { p: Product }) {
  const { openQuick, add, locale, d, price } = useStore();
  return (
    <motion.article className="m-arch" whileHover="hover" initial="rest" animate="rest">
      <button className="m-arch-frame" onClick={() => openQuick(p.id)} aria-label={`${d.quickView} ${p.name}`}>
        <motion.div className="m-lattice" variants={{ rest: { opacity: 0.15 }, hover: { opacity: 0.4 } }} />
        <motion.div className="m-arch-visual" variants={{ rest: { y: 0 }, hover: { y: -10 } }} transition={{ type: 'spring', stiffness: 200 }}>
          <ProductVisual product={p} />
        </motion.div>
        <motion.div className="m-arch-smoke" variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}><Smoke /></motion.div>
      </button>
      <h4>{p.name}</h4>
      <p>{families[p.family][locale]} · {genders[p.gender][locale]}</p>
      <div className="m-arch-buy">
        <span>{price(p)}</span>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => add(p.id, p.defaultSize)}>{d.addToBag}</motion.button>
      </div>
    </motion.article>
  );
}

export function Majlis() {
  const { d, locale, openQuick } = useStore();
  const { scrollY } = useScroll();
  const bgScale = useTransform(scrollY, [0, 900], [1.08, 1.3]);
  const bgY = useTransform(scrollY, [0, 900], [0, 200]);
  return (
    <div className="majlis">
      <header className="m-nav">
        <a href="#" className="m-logo"><span>SP</span> Scentual</a>
        <nav><a href="#shop">{d.shop}</a><a href="#signatures">{d.signatures}</a></nav>
        <NavActions />
      </header>

      <section className="m-hero">
        <motion.div className="m-hero-bg" style={{ scale: bgScale, y: bgY }}>
          <img src={img('offer-banner.jpg')} alt="" />
        </motion.div>
        <div className="m-hero-veil" />
        <div className="m-hero-copy">
          <div className="m-star-wrap">
            <Star size={260} className="m-star" />
            <motion.span className="m-mono" initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ delay: 0.5, duration: 1.4 }}>SP</motion.span>
          </div>
          <h1 className="m-ar" dir="rtl" lang="ar"><SplitText text="عطورنا الفاخرة — عروض خاصة" delay={0.8} /></h1>
          <Ornament />
          <Reveal delay={1.2}>
            <p className="m-offer">{d.bundleTitle}</p>
            <p className="m-offer-sub">{d.bundleSub}</p>
          </Reveal>
          <Reveal delay={1.5}><a className="btn primary" href="#shop">{d.explore}</a></Reveal>
        </div>
        <Smoke className="m-hero-smoke" />
      </section>

      <section id="signatures" className="m-sigs">
        <Reveal><h2>{d.signatures}</h2></Reveal>
        <Ornament />
        <div className="m-sig-row">
          {featured.slice(0, 6).map((p, i) => (
            <motion.button key={p.id} className="m-sig" onClick={() => openQuick(p.id)}
              initial={{ opacity: 0, y: 80, rotateX: 40 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -12 }}>
              <img src={img(p.image!)} alt={p.name} />
              <span>{p.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <Catalog className="m-catalog" title={<><h2 className="m-title">{locale === 'ar' ? 'خزانة العطور' : 'The Perfume Cabinet'}</h2><Ornament /></>} renderCard={(p) => <Arch p={p} />} />

      <footer className="m-footer">
        <Star size={120} />
        <p>Scentual Perfumes · الكويت</p>
      </footer>
    </div>
  );
}
