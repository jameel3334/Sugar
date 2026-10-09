import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { families, genders, type Family, type Filter, type Product } from '@scentual/core';
import { img, useStore } from '../lib/store.tsx';
import { Catalog } from '../components/Catalog.tsx';
import { ProductVisual } from '../components/Bottle.tsx';
import { NavActions } from '../components/NavActions.tsx';
import { SplitText } from '../components/fx.tsx';

const MOODS: Array<{ id: string; image: string; family: Family; bg: string; en: [string, string]; ar: [string, string] }> = [
  { id: 'desert', image: 'amber-oud.jpg', family: 'amber', bg: '#3b2418', en: ['Desert dusk', 'Warm amber and oud for golden-hour evenings.'], ar: ['غروب الصحراء', 'عنبر وعود دافئ لأمسيات الغروب.'] },
  { id: 'forest', image: 'nishane.jpg', family: 'woody', bg: '#17251a', en: ['Forest floor', 'Moss, cedar and vetiver after the rain.'], ar: ['أرض الغابة', 'طحلب وأرز ونجيل بعد المطر.'] },
  { id: 'ocean', image: 'ellora.jpg', family: 'fresh', bg: '#0f3140', en: ['Salt & sun', 'Bright citrus, sea spray and skin.'], ar: ['ملح وشمس', 'حمضيات مشرقة ورذاذ البحر.'] },
  { id: 'garden', image: 'green-mist.jpg', family: 'floral', bg: '#22301c', en: ['Morning garden', 'Petals, green tea and soft musk.'], ar: ['حديقة الصباح', 'بتلات وشاي أخضر ومسك ناعم.'] },
  { id: 'jazz', image: 'jazz-club.jpg', family: 'sweet', bg: '#141a3a', en: ['Late-night jazz', 'Tobacco, vanilla and rum in low light.'], ar: ['جاز منتصف الليل', 'تبغ وفانيلا في إضاءة خافتة.'] },
  { id: 'ember', image: 'nero.jpg', family: 'oud', bg: '#1d0b08', en: ['Ember & smoke', 'Charred woods, oud and incense.'], ar: ['جمر ودخان', 'أخشاب محترقة وعود وبخور.'] },
];

function Mood({ m, i, onActive, onShop }: { m: (typeof MOODS)[number]; i: number; onActive: (i: number) => void; onShop: (f: Family) => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const { locale } = useStore();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.35, 1.05, 1.2]);
  const rot = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const textX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [i % 2 ? 140 : -140, 0, i % 2 ? -80 : 80]);
  useEffect(() => { if (inView) onActive(i); }, [inView, i, onActive]);
  const [title, body] = m[locale];
  return (
    <section ref={ref} className="d-mood" id={`mood-${m.id}`}>
      <motion.div className="d-mood-img" style={{ scale, rotate: rot }}>
        <img src={img(m.image)} alt="" />
      </motion.div>
      <div className="d-mood-veil" style={{ background: `linear-gradient(180deg, transparent 20%, ${m.bg} 95%)` }} />
      <motion.div className="d-mood-copy" style={{ x: textX }}>
        <span className="d-num">0{i + 1}</span>
        <h2><SplitText text={title} stagger={0.08} /></h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}>{body}</motion.p>
        <motion.button className="btn primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onShop(m.family)}>
          {locale === 'ar' ? 'تسوق هذا المزاج' : 'Shop this mood'} — {families[m.family][locale]}
        </motion.button>
      </motion.div>
    </section>
  );
}

function FlipCard({ p }: { p: Product }) {
  const { add, openQuick, locale, d, price } = useStore();
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="d-flip" onPointerEnter={() => setFlipped(true)} onPointerLeave={() => setFlipped(false)}>
      <motion.div className="d-flip-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
        <button className="d-face d-front" onClick={() => (matchMedia('(hover: none)').matches ? setFlipped((f) => !f) : openQuick(p.id))} aria-label={p.name}>
          <ProductVisual product={p} />
          <h4>{p.name}</h4>
          <span>{price(p)}</span>
        </button>
        <div className="d-face d-back" style={{ background: `linear-gradient(160deg, ${families[p.family].color}, #0d0a08)` }}>
          <p className="eyebrow">{families[p.family][locale]} · {genders[p.gender][locale]}</p>
          <h4>{p.name}</h4>
          <ul>{p.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          <button className="btn primary" onClick={() => add(p.id, p.defaultSize)}>{d.addToBag}</button>
          <button className="btn ghost" onClick={() => openQuick(p.id)}>{d.quickView}</button>
        </div>
      </motion.div>
    </div>
  );
}

export function Dunes() {
  const { d, locale } = useStore();
  const [active, setActive] = useState(0);
  const controls = useRef<((f: Partial<Filter>) => void) | null>(null);
  const moodsRef = useRef<HTMLDivElement>(null);
  const inMoods = useInView(moodsRef, { amount: 0.05 });
  const shop = (family: Family) => {
    controls.current?.({ family });
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <motion.div className="dunes" animate={{ backgroundColor: MOODS[active].bg }} transition={{ duration: 1 }}>
      <header className="d-nav">
        <a href="#" className="d-logo">Scentual <i>moods</i></a>
        <NavActions />
      </header>

      <section className="d-intro">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>{d.mood}</motion.p>
        <h1><SplitText text={locale === 'ar' ? 'أين يأخذك عطرك اليوم؟' : 'Where will your scent take you today?'} stagger={0.07} delay={0.2} /></h1>
        <motion.div className="d-scroll" animate={{ height: [0, 80, 0], y: [0, 0, 80] }} transition={{ repeat: Infinity, duration: 2.2 }} />
      </section>

      <motion.nav className="d-dots" aria-label="Moods" animate={{ opacity: inMoods ? 1 : 0, x: inMoods ? 0 : 30 }} style={{ pointerEvents: inMoods ? 'auto' : 'none' }}>
        {MOODS.map((m, i) => (
          <a key={m.id} href={`#mood-${m.id}`} className={active === i ? 'on' : ''} aria-label={m[locale][0]}>
            <motion.span animate={{ scale: active === i ? 1.6 : 1 }} />
            <em>{m[locale][0]}</em>
          </a>
        ))}
      </motion.nav>

      <div ref={moodsRef}>
        {MOODS.map((m, i) => <Mood key={m.id} m={m} i={i} onActive={setActive} onShop={shop} />)}
      </div>

      <section className="d-offer">
        <motion.h2 initial={{ letterSpacing: '0.6em', opacity: 0 }} whileInView={{ letterSpacing: '0.05em', opacity: 1 }} transition={{ duration: 1.4 }}>{d.bundleTitle}</motion.h2>
        <p>{d.bundleSub}</p>
      </section>

      <Catalog className="d-catalog" controlsRef={controls} title={<h2 className="d-title">{locale === 'ar' ? 'كل المزاجات' : 'Every mood'}</h2>} renderCard={(p) => <FlipCard p={p} />} />

      <footer className="d-footer"><p>Scentual Perfumes · Kuwait</p></footer>
    </motion.div>
  );
}
