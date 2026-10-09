import { animate, motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, type ReactNode, type PointerEvent } from 'react';

/** Word-by-word (or char) rise-in reveal. The visible mask is observed, not the clipped inner span. */
export function SplitText({ text, className, by = 'word', delay = 0, stagger = 0.06 }: { text: string; className?: string; by?: 'word' | 'char'; delay?: number; stagger?: number }) {
  const parts = by === 'word' ? text.split(' ') : [...text];
  return (
    <motion.span className={`split ${by === 'char' ? 'split-char' : ''} ${className ?? ''}`} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {parts.map((p, i) => (
        <span key={i} className="split-mask" aria-hidden>
          <motion.span
            className="split-part"
            variants={{ hidden: { y: '110%', rotate: 6 }, show: { y: '0%', rotate: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
          >
            {p === ' ' ? '\u00a0' : p}{by === 'word' && i < parts.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Element drifts toward the pointer. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  return (
    <motion.div className={className} style={{ x, y, display: 'inline-block' }} onPointerMove={onMove} onPointerLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

/** 3D tilt toward the pointer with a moving sheen. */
export function Tilt({ children, className, max = 12 }: { children: ReactNode; className?: string; max?: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 150, damping: 14 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 150, damping: 14 });
  const sheen = useTransform([mx, my] as MotionValue<number>[], ([a, b]: number[]) => `radial-gradient(circle at ${a * 100}% ${b * 100}%, rgba(255,255,255,0.35), transparent 55%)`);
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
    >
      {children}
      <motion.div className="tilt-sheen" style={{ background: sheen }} />
    </motion.div>
  );
}

export function Marquee({ children, speed = 30, className, reverse }: { children: ReactNode; speed?: number; className?: string; reverse?: boolean }) {
  return (
    <div className={`marquee ${className ?? ''}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

/** Number that counts up when scrolled into view. */
export function Counter({ to, className, decimals = 0 }: { to: number; className?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => { if (ref.current) ref.current.textContent = v.toFixed(decimals); } });
    return () => c.stop();
  }, [inView, to, decimals]);
  return <span ref={ref} className={className}>0</span>;
}

/** Simple fade-up on scroll. */
export function Reveal({ children, className, delay = 0, y = 40 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}>
      {children}
    </motion.div>
  );
}

/** Rising ember / dust particles on a canvas. */
export function Particles({ color = '255,140,60', count = 70, className }: { color?: string; count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d')!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(devicePixelRatio, 2);
    const resize = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ps = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + 0.4, v: Math.random() * 0.6 + 0.2, d: Math.random() * Math.PI * 2, a: Math.random() }));
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.v; p.d += 0.02; p.x += Math.sin(p.d) * 0.4; p.a += 0.01;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const alpha = 0.35 + Math.sin(p.a) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.shadowColor = `rgba(${color},1)`;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, [color, count]);
  return <canvas ref={ref} className={`particles ${className ?? ''}`} aria-hidden />;
}

/** Wisps of smoke (SVG, CSS-animated). */
export function Smoke({ className }: { className?: string }) {
  return (
    <svg className={`smoke ${className ?? ''}`} viewBox="0 0 200 300" aria-hidden>
      <defs><filter id="smokeBlur"><feGaussianBlur stdDeviation="4" /></filter></defs>
      {[0, 1, 2].map((i) => (
        <path key={i} className={`smoke-wisp w${i}`} d="M100 300 C 80 240, 130 210, 100 160 S 70 80, 110 20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={10 - i * 2} strokeLinecap="round" filter="url(#smokeBlur)" />
      ))}
    </svg>
  );
}
