import { useId } from 'react';
import { families, seed, type Product } from '@scentual/core';
import { img } from '../lib/store.tsx';

// Glass silhouettes: [body path, cap element builder]. 120×200 viewBox.
const BODIES = [
  'M22 66 h76 a8 8 0 0 1 8 8 v110 a8 8 0 0 1 -8 8 h-76 a8 8 0 0 1 -8 -8 v-110 a8 8 0 0 1 8 -8z',
  'M46 62 h28 v12 c26 8 38 28 38 56 c0 36 -24 62 -52 62 s-52 -26 -52 -62 c0 -28 12 -48 38 -56z',
  'M34 64 h52 a14 14 0 0 1 14 14 v100 a14 14 0 0 1 -14 14 h-52 a14 14 0 0 1 -14 -14 v-100 a14 14 0 0 1 14 -14z',
  'M40 64 h40 l18 24 v92 a12 12 0 0 1 -12 12 h-52 a12 12 0 0 1 -12 -12 v-92z',
  'M30 66 h60 c8 0 12 6 12 14 v26 c0 4 -4 6 -4 10 v62 c0 8 -6 14 -14 14 h-48 c-8 0 -14 -6 -14 -14 v-62 c0 -4 -4 -6 -4 -10 v-26 c0 -8 4 -14 12 -14z',
];

const CLASSIC_TINTS = [
  { color: '#d9831f', glow: '#ffc56b' },
  { color: '#e0457b', glow: '#ff9cc0' },
  { color: '#69b7d6', glow: '#c4f0ff' },
  { color: '#2f6fd1', glow: '#8fc0ff' },
  { color: '#c9a45c', glow: '#ffe2a0' },
];

function Cap({ kind }: { kind: number }) {
  const fill = 'url(#capGrad)';
  switch (kind) {
    case 1: return <circle cx="60" cy="40" r="20" fill={fill} />;
    case 2: return <path d="M44 62 v-14 c0 -10 -6 -16 -6 -26 c0 -8 10 -14 22 -14 s22 6 22 14 c0 10 -6 16 -6 26 v14z" fill={fill} />;
    case 3: return <g fill={fill}><rect x="46" y="48" width="28" height="16" rx="2" /><path d="M38 48 l6 -26 l8 12 l8 -18 l8 18 l8 -12 l6 26z" /></g>;
    default: return <rect x="38" y="22" width="44" height="42" rx="4" fill={fill} />;
  }
}

export function Bottle({ product, className, wave = true }: { product: Product; className?: string; wave?: boolean }) {
  const id = useId().replace(/:/g, '');
  const s = seed(product.id);
  const shape = Math.floor(s * BODIES.length);
  const cap = Math.floor(((s * 7919) % 1) * 4);
  // "Classic" covers most of the list; vary it with the campaign bottle colours so the grid isn't uniform.
  const fam = product.family === 'classic' ? CLASSIC_TINTS[Math.floor(((s * 104729) % 1) * CLASSIC_TINTS.length)] : families[product.family];
  const level = 0.55 + ((s * 31) % 1) * 0.3; // how full the bottle looks
  const top = 192 - (192 - 66) * level;
  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-label={product.name}>
      <defs>
        <clipPath id={`b${id}`}><path d={BODIES[shape]} /></clipPath>
        <linearGradient id={`l${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={fam.glow} stopOpacity="0.95" />
          <stop offset="1" stopColor={fam.color} />
        </linearGradient>
        <linearGradient id="capGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#2a2622" /><stop offset="0.45" stopColor="#57504a" /><stop offset="1" stopColor="#111" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#b${id})`}>
        <rect x="0" y="0" width="120" height="200" fill="rgba(255,255,255,0.12)" />
        <g className={wave ? 'liquid-wave' : undefined} style={{ animationDelay: `${-s * 4}s` }}>
          <path d={`M-120 ${top} q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V200 H-120z`} fill={`url(#l${id})`} />
        </g>
        <rect x="24" y="70" width="8" height="112" rx="4" fill="rgba(255,255,255,0.35)" />
      </g>
      <path d={BODIES[shape]} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      <Cap kind={cap} />
      <text x="60" y="140" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="30" fill="rgba(20,14,10,0.78)" fontStyle="italic">SP</text>
    </svg>
  );
}

/** Real campaign photo when we have one, generated bottle otherwise. */
export function ProductVisual({ product, className }: { product: Product; className?: string }) {
  if (product.image) return <img src={img(product.image)} alt={product.name} className={`pv-img ${className ?? ''}`} loading="lazy" />;
  return <Bottle product={product} className={`pv-svg ${className ?? ''}`} />;
}
