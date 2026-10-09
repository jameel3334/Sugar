import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { families, filterProducts, genders, products, seed, type Family, type Gender, type Product } from '@scentual/core';
import { img, useStore } from '../lib/store.tsx';
import { Catalog } from '../components/Catalog.tsx';
import { Bottle, ProductVisual } from '../components/Bottle.tsx';
import { NavActions } from '../components/NavActions.tsx';
import { Marquee, Reveal, SplitText, Tilt } from '../components/fx.tsx';

function Card({ p }: { p: Product }) {
  const { openQuick, add, locale, d, price } = useStore();
  const fam = families[p.family];
  return (
    <Tilt className="p-card">
      <div className="p-card-bg" style={{ background: `linear-gradient(135deg, ${fam.glow}, ${fam.color})` }} />
      <button className="p-visual" onClick={() => openQuick(p.id)} aria-label={`${d.quickView} ${p.name}`}>
        <motion.div whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.6 } }}><ProductVisual product={p} /></motion.div>
      </button>
      <span className="p-sticker" style={{ rotate: `${(seed(p.id) - 0.5) * 20}deg` }}>{fam[locale]}</span>
      <div className="p-meta">
        <h4>{p.name}</h4>
        <p>{genders[p.gender][locale]} · {price(p)}</p>
      </div>
      <motion.button className="p-add" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85, rotate: 90 }} onClick={() => add(p.id, p.defaultSize)} aria-label={d.addToBag}>+</motion.button>
    </Tilt>
  );
}

const QUIZ: Array<{ q: { en: string; ar: string }; options: Array<{ en: string; ar: string; value: string }> }> = [
  { q: { en: 'Who is it for?', ar: 'لمن العطر؟' }, options: [
    { en: 'Him', ar: 'له', value: 'men' }, { en: 'Her', ar: 'لها', value: 'women' }, { en: 'Anyone', ar: 'للجميع', value: 'unisex' }] },
  { q: { en: 'Pick a vibe', ar: 'اختر الأجواء' }, options: [
    { en: '🌊 Fresh & clean', ar: '🌊 منعش ونظيف', value: 'fresh' }, { en: '🍬 Sweet & cosy', ar: '🍬 حلو ودافئ', value: 'sweet' },
    { en: '🔥 Dark & smoky', ar: '🔥 داكن ودخاني', value: 'oud' }, { en: '🌸 Soft floral', ar: '🌸 زهري ناعم', value: 'floral' }] },
  { q: { en: 'When will you wear it?', ar: 'متى ستستخدمه؟' }, options: [
    { en: '☀️ Day', ar: '☀️ النهار', value: 'day' }, { en: '🌙 Night', ar: '🌙 الليل', value: 'night' }] },
];

const RELATED: Record<string, Family[]> = { fresh: ['fresh', 'classic'], sweet: ['sweet', 'musk', 'amber'], oud: ['oud', 'leather', 'amber'], floral: ['floral', 'musk'] };

function Quiz() {
  const { locale, openQuick, d } = useStore();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const results = useMemo(() => {
    if (answers.length < QUIZ.length) return [];
    const [gender, vibe, time] = answers;
    const fams = [...RELATED[vibe]];
    if (time === 'night' && !fams.includes('amber')) fams.push('amber');
    const pool = products.filter((p) => fams.includes(p.family));
    return filterProducts(pool, { gender: gender as Gender }).sort((a, b) => Number(!!b.image) - Number(!!a.image) || seed(a.id) - seed(b.id)).slice(0, 6);
  }, [answers]);
  const choose = (v: string) => { setAnswers((a) => [...a.slice(0, step), v]); setStep((s) => s + 1); };
  return (
    <section className="p-quiz" id="quiz">
      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div key="intro" className="p-quiz-intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
            <h2>{d.quizTitle} ✨</h2>
            <motion.button className="btn primary" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={() => { setAnswers([]); setStep(0); }}>{d.quizStart}</motion.button>
          </motion.div>
        )}
        {step >= 0 && step < QUIZ.length && (
          <motion.div key={step} className="p-quiz-step" initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -120, opacity: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
            <div className="p-quiz-bar"><motion.span animate={{ width: `${((step + 1) / QUIZ.length) * 100}%` }} /></div>
            <h3>{QUIZ[step].q[locale]}</h3>
            <div className="p-quiz-opts">
              {QUIZ[step].options.map((o, i) => (
                <motion.button key={o.value} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => choose(o.value)}>{o[locale]}</motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {step >= QUIZ.length && (
          <motion.div key="res" className="p-quiz-res" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>{locale === 'ar' ? 'نرشح لك' : 'Your matches'} 💫</h3>
            <div className="p-quiz-grid">
              {results.map((p, i) => (
                <motion.button key={p.id} onClick={() => openQuick(p.id)} initial={{ opacity: 0, scale: 0.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: i * 0.08, type: 'spring' }} whileHover={{ y: -8 }}>
                  <ProductVisual product={p} /><span>{p.name}</span>
                </motion.button>
              ))}
            </div>
            <button className="btn ghost" onClick={() => setStep(-1)}>↺</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Prism() {
  const { d, locale, openQuick } = useStore();
  const floaters = useMemo(() => products.filter((p) => !p.image).filter((_, i) => i % 97 === 3).slice(0, 5), []);
  return (
    <div className="prism">
      <div className="p-blobs" aria-hidden><span /><span /><span /></div>
      <header className="p-nav">
        <a href="#" className="p-logo">scentual<span>.</span></a>
        <nav><a href="#shop">{d.shop}</a><a href="#quiz">{d.quizTitle}</a></nav>
        <NavActions />
      </header>

      <section className="p-bento">
        <motion.div className="p-tile p-tile-hero" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1><SplitText text={locale === 'ar' ? 'عطرك. مزاجك.' : 'Smell like a main character.'} stagger={0.08} /></h1>
          <p>{d.heroSub}</p>
          <a className="btn primary" href="#shop">{d.explore}</a>
          <div className="p-floaters">
            {floaters.map((p, i) => (
              <motion.div key={p.id} className="p-floater" animate={{ y: [0, -18, 0], rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 3 + i * 0.6, delay: i * 0.3, ease: 'easeInOut' }}>
                <Bottle product={p} />
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.button className="p-tile p-tile-img" onClick={() => openQuick('ruby-prestige')} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} whileHover={{ scale: 1.02 }}>
          <img src={img('ruby-prestige.jpg')} alt="Ruby Prestige" />
          <span className="p-tag">🔥 Ruby Prestige</span>
        </motion.button>
        <motion.div className="p-tile p-tile-offer" initial={{ opacity: 0, rotate: -6, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.35, type: 'spring' }}>
          <motion.span className="p-big" animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2 }}>5 = 20</motion.span>
          <p>{d.bundleTitle}</p>
          <small>{d.bundleSub}</small>
        </motion.div>
        <motion.button className="p-tile p-tile-img2" onClick={() => openQuick('jazz-club-maison')} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} whileHover={{ scale: 1.02 }}>
          <img src={img('jazz-club.jpg')} alt="Jazz Club" />
          <span className="p-tag">🎷 Jazz Club</span>
        </motion.button>
      </section>

      <Marquee className="p-marquee" speed={18}>
        {['✦ 650+ scents', '✦ free delivery', '✦ 5 for 20 KWD', '✦ long lasting', '✦ made in Kuwait'].map((t) => <span key={t}>{t}</span>)}
      </Marquee>

      <Quiz />

      <Catalog className="p-catalog" title={<Reveal><h2 className="p-title">{locale === 'ar' ? 'كل العطور' : 'Browse the drop'}</h2></Reveal>} renderCard={(p) => <Card p={p} />} />

      <footer className="p-footer"><p>scentual<span>.</span>perfumes — Kuwait 🇰🇼</p></footer>
    </div>
  );
}
