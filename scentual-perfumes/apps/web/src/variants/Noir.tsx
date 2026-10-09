import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { featured, families, genders, type Product } from '@scentual/core';
import { img, useStore } from '../lib/store.tsx';
import { Catalog } from '../components/Catalog.tsx';
import { ProductVisual } from '../components/Bottle.tsx';
import { NavActions } from '../components/NavActions.tsx';
import { Counter, Magnetic, Marquee, Particles, Reveal, SplitText } from '../components/fx.tsx';

function Card({ p }: { p: Product }) {
  const { openQuick, add, locale, d, price } = useStore();
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, ${families[p.family].glow}33, transparent 70%)`;
  return (
    <motion.article className="n-card" whileHover="hover"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
      onPointerLeave={() => { mx.set(-200); my.set(-200); }}>
      <motion.div className="n-glow" style={{ background: glow }} />
      <button className="n-visual" onClick={() => openQuick(p.id)} aria-label={`${d.quickView} ${p.name}`}>
        <motion.div variants={{ hover: { y: -14, rotate: -3, scale: 1.06 } }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
          <ProductVisual product={p} />
        </motion.div>
      </button>
      <div className="n-meta">
        <span>{genders[p.gender][locale]} · {families[p.family][locale]}</span>
        <h4>{p.name}</h4>
        <div className="n-buy">
          <b>{price(p)}</b>
          <motion.button whileTap={{ scale: 0.9 }} className="n-plus" onClick={() => add(p.id, p.defaultSize)} aria-label={d.addToBag}>+</motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function HorizontalShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-72%']);
  const { openQuick, locale } = useStore();
  return (
    <section ref={ref} className="n-hscroll">
      <div className="n-sticky">
        <h2 className="n-hs-title"><SplitText text={locale === 'ar' ? 'مجموعة التوقيع' : 'The signature edit'} /></h2>
        <motion.div className="n-track" style={{ x }}>
          {featured.map((p, i) => (
            <motion.button key={p.id} className="n-slide" onClick={() => openQuick(p.id)} whileHover={{ scale: 0.98 }}>
              <img src={img(p.image!)} alt={p.name} />
              <div className="n-slide-cap"><span>0{i + 1}</span><h3>{p.name}</h3></div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function Noir() {
  const { d, locale } = useStore();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 220]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  return (
    <div className="noir">
      <header className="n-nav">
        <motion.a href="#" className="n-logo" initial={{ opacity: 0, letterSpacing: '1em' }} animate={{ opacity: 1, letterSpacing: '0.3em' }} transition={{ duration: 1.6 }}>SCENTUAL</motion.a>
        <nav><a href="#shop">{d.shop}</a><a href="#offer">{d.offer}</a></nav>
        <NavActions />
      </header>

      <section className="n-hero">
        <motion.div className="n-hero-img" style={{ y: heroY, scale: heroScale }}>
          <img src={img('nero.jpg')} alt="Sedra Nero" />
        </motion.div>
        <Particles />
        <motion.div className="n-hero-copy" style={{ opacity: fade }}>
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Scentual Perfumes — Kuwait</motion.p>
          <h1><SplitText text={locale === 'ar' ? 'عطرك لا يُنسى' : 'Unforgettable,'} by={locale === 'ar' ? 'word' : 'char'} stagger={0.04} delay={0.3} /><br />
            <em><SplitText text={locale === 'ar' ? 'بسعر عادل' : 'honestly priced.'} delay={0.8} /></em></h1>
          <Reveal delay={1.2}><p className="n-sub">{d.heroSub}</p></Reveal>
          <Reveal delay={1.4}>
            <Magnetic><a href="#shop" className="btn primary">{d.explore}</a></Magnetic>
          </Reveal>
        </motion.div>
        <motion.div className="n-scroll-cue" animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
      </section>

      <Marquee className="n-marquee" speed={40}>
        {['Oud', 'Amber', 'Saffron', 'Leather', 'Rose', 'Musk', 'Vanilla', 'Bakhoor'].map((w) => <span key={w}>{w} <i>✦</i></span>)}
      </Marquee>

      <HorizontalShowcase />

      <section id="offer" className="n-offer">
        <Particles color="212,175,106" count={40} />
        <Reveal><p className="eyebrow">{d.offer}</p></Reveal>
        <h2><Counter to={5} /> × <Counter to={100} />ml</h2>
        <Reveal delay={0.2}><p className="n-offer-price"><Counter to={20} /> KWD</p></Reveal>
        <Reveal delay={0.3}><p>{d.bundleSub}</p></Reveal>
      </section>

      <Catalog className="n-catalog" title={<h2 className="n-section-title"><SplitText text={locale === 'ar' ? 'كل العطور' : 'All fragrances'} /></h2>} renderCard={(p) => <Card p={p} />} />

      <footer className="n-footer">
        <motion.h2 initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>SCENTUAL</motion.h2>
        <p>@scentual.perfumes · Kuwait</p>
      </footer>
    </div>
  );
}
