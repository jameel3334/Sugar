import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { featured, families, genders, type Product } from '@scentual/core';
import { img, useStore } from '../lib/store.tsx';
import { Catalog } from '../components/Catalog.tsx';
import { ProductVisual } from '../components/Bottle.tsx';
import { NavActions } from '../components/NavActions.tsx';
import { Marquee, Reveal, SplitText } from '../components/fx.tsx';

function Card({ p, i }: { p: Product; i: number }) {
  const { openQuick, add, locale, d, price } = useStore();
  return (
    <motion.article className="a-card" whileHover="hover" initial="rest" animate="rest">
      <button className="a-visual" onClick={() => openQuick(p.id)} aria-label={`${d.quickView} ${p.name}`}>
        <motion.div variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <ProductVisual product={p} />
        </motion.div>
        <motion.ul className="a-notes" variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}>
          {p.notes.map((n) => <li key={n}>{n}</li>)}
        </motion.ul>
      </button>
      <div className="a-meta">
        <span className="a-idx">{String(i + 1).padStart(3, '0')}</span>
        <h4>{p.name}</h4>
        <p>{families[p.family][locale]} — {genders[p.gender][locale]}</p>
        <div className="a-buy">
          <span>{price(p)}</span>
          <button onClick={() => add(p.id, p.defaultSize)} className="a-link">{d.addToBag} <motion.i variants={{ rest: { x: 0 }, hover: { x: 6 } }}>→</motion.i></button>
        </div>
      </div>
    </motion.article>
  );
}

function Editorial({ p, flip }: { p: Product; flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const clip = useTransform(scrollYProgress, [0, 0.35], ['inset(30% 30% 30% 30%)', 'inset(0% 0% 0% 0%)']);
  const { openQuick, d, locale } = useStore();
  return (
    <div ref={ref} className={`a-edit ${flip ? 'flip' : ''}`}>
      <motion.div className="a-edit-img" style={{ clipPath: clip }}>
        <motion.img src={img(p.image!)} alt={p.name} style={{ y, scale: 1.25 }} />
      </motion.div>
      <div className="a-edit-copy">
        <Reveal><p className="eyebrow">{families[p.family][locale]}</p></Reveal>
        <h3><SplitText text={p.name} /></h3>
        <Reveal delay={0.2}><p>{p.notes.join(' · ')}</p></Reveal>
        <Reveal delay={0.3}><button className="a-link big" onClick={() => openQuick(p.id)}>{d.quickView} →</button></Reveal>
      </div>
    </div>
  );
}

export function Atelier() {
  const { d, locale } = useStore();
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const heroClip = useTransform(scrollY, [0, 600], ['inset(18% 28% 18% 28% round 300px 300px 0 0)', 'inset(0% 0% 0% 0% round 0px)']);
  const titleY = useTransform(scrollY, [0, 600], [0, -160]);
  return (
    <div className="atelier">
      <motion.div className="a-progress" style={{ scaleX: progress }} />
      <header className="a-nav">
        <nav><a href="#shop">{d.shop}</a><a href="#edit">{d.collections}</a></nav>
        <a href="#" className="a-logo">Scentual</a>
        <NavActions />
      </header>

      <section className="a-hero">
        <motion.h1 style={{ y: titleY }}>
          <SplitText text="Scentual" by="char" stagger={0.07} />
        </motion.h1>
        <motion.div className="a-hero-img" style={{ clipPath: heroClip }}>
          <img src={img('ellora.jpg')} alt="Ellora" />
        </motion.div>
        <div className="a-hero-foot">
          <Reveal delay={0.8}><p>{d.heroSub}</p></Reveal>
          <Reveal delay={1}><a href="#shop" className="a-link big">{d.explore} ↓</a></Reveal>
        </div>
      </section>

      <Marquee className="a-marquee" speed={50}>
        {['Bergamot', 'Iris', 'Sandalwood', 'Rose de Taif', 'Saffron', 'Vetiver', 'Amber', 'White musk'].map((n) => <span key={n}>{n}</span>)}
      </Marquee>

      <section className="a-offer">
        <Reveal><p className="eyebrow">{d.offer}</p></Reveal>
        <h2><SplitText text={d.bundleTitle} /></h2>
        <Reveal delay={0.3}><p>{d.bundleSub}</p></Reveal>
      </section>

      <section id="edit" className="a-edits">
        {featured.slice(0, 4).map((p, i) => <Editorial key={p.id} p={p} flip={i % 2 === 1} />)}
      </section>

      <Catalog className="a-catalog" title={<h2 className="a-title"><SplitText text={locale === 'ar' ? 'الفهرس' : 'The Index'} /></h2>} renderCard={(p, i) => <Card p={p} i={i} />} />

      <footer className="a-footer">
        <h2><SplitText text="Scentual Perfumes" /></h2>
        <p>Kuwait · @scentual.perfumes</p>
      </footer>
    </div>
  );
}
