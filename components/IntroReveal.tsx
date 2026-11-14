import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MatricsLogo from './MatricsLogo';
import './intro-reveal.css';

// First visit, told as a trade (about 5 s, never blocks the page):
//  1. snake  – a glowing dotted path draws itself across the ground like a
//              snake, from the far horizon to the foreground, with the stops of
//              a trade on it: maker → distributor → wholesaler → kirana → customer;
//  2. ride   – the Matrics flag rides the path towards you; each stop lights up
//              as connected and the path behind it glows as a trade line;
//  3. rise   – from the customer it rises into the centre, growing, the path
//              trailing below it like a tail and light streaks sweeping past;
//              the flag cloth melts away to leave the logo, a burst of light,
//              then "Every trade, connected.";
//  4. dock   – it glides into the header and becomes the header logo while the
//              page appears.
// Shown once per browser; add ?intro to the address to replay it.
const SEEN_KEY = 'matrics-intro-seen';
const LOGO_SRC = '/brand/matrics-grid.webp';
const LOGO_RATIO = 1630 / 400;
const LOAD_TIMEOUT_MS = 1800; // logo not ready by then: skip the intro

// Timeline (ms from the start)
const DRAW_MS = 1400;
const RIDE_START = 450;
const RIDE_END = 2200;
const LIFT_END = 3000;
const STREAKS_AT = 2050;
const BURST_AT = 3000;  // the grid light starts here too (see intro-reveal.css)
const TAGLINE_AT = 3300;
const DOCK_AT = 4100;
const DOCK_MS = 750;
const FADE_MS = 300;
const TAIL_MS = 420;

// The path on the ground: X is sideways, Z is distance (bigger = further away).
const GROUND: [number, number][] = [
  [-9, 5.2], [-5, 5.0], [-2, 4.6], [-0.4, 4.0], [0.5, 3.3], [0.25, 2.6],
  [-0.6, 2.05], [-0.35, 1.6], [0.45, 1.33], [0.75, 1.08], [0.35, 0.9],
];
type Side = 'up' | 'right' | 'left';
const STOPS: { label: string; at: [number, number]; side: Side }[] = [
  { label: 'Maker', at: [-3.5, 4.85], side: 'up' },
  { label: 'Distributor', at: [-0.9, 4.2], side: 'up' },
  { label: 'Wholesaler', at: [0.4, 3.05], side: 'right' },
  { label: 'Kirana', at: [-0.55, 1.95], side: 'left' },
  { label: 'Customer', at: [0.45, 1.33], side: 'right' },
];
const NEAR_Z = 1.33; // the customer's distance: the flag is at its "near" size there

export const shouldShowIntro = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    if (/[?&]intro(=|&|$)/.test(window.location.search)) return true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return !window.localStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
};

type Stage = 'loading' | 'play' | 'dock' | 'landed';
type Pt = { x: number; y: number };
interface Sample { X: number; Z: number; x: number; y: number; s: number /* fraction of on-screen length */ }
interface StopGeo { i: number; x: number; y: number; rx: number; ry: number; font: number; lx: number; ly: number; anchor: 'start' | 'middle' | 'end' }
interface Geometry {
  narrow: boolean;
  centre: Pt;
  logoW: number;
  logoH: number;
  nearFlagW: number;
  horizon: number;
  samples: Sample[];
  path: string;
  dots: { x: number; y: number; r: number }[];
  stops: StopGeo[];
  streaks: string[];
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
  const m = 1 - t;
  return {
    x: m * m * m * a.x + 3 * m * m * t * b.x + 3 * m * t * t * c.x + t * t * t * d.x,
    y: m * m * m * a.y + 3 * m * m * t * b.y + 3 * m * t * t * c.y + t * t * t * d.y,
  };
};

// Smooth curve through ground points (Catmull-Rom), sampled finely.
const groundCurve = (pts: [number, number][], perSegment = 50): [number, number][] => {
  const ext = [pts[0], ...pts, pts[pts.length - 1]];
  const out: [number, number][] = [];
  for (let i = 1; i < ext.length - 2; i++) {
    const [p0, p1, p2, p3] = [ext[i - 1], ext[i], ext[i + 1], ext[i + 2]];
    for (let k = 0; k < perSegment; k++) {
      const t = k / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)) as [number, number]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

const IntroReveal: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [stage, setStage] = useState<Stage>('loading');
  const [geo, setGeo] = useState<Geometry | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const flagRef = useRef<HTMLDivElement>(null);
  const poleRef = useRef<HTMLSpanElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const tradeRefs = useRef<(SVGPathElement | null)[]>([]);
  const stopRefs = useRef<(SVGGElement | null)[]>([]);
  const tailRefs = useRef<(SVGLineElement | null)[]>([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const narrowNow = typeof window !== 'undefined' && window.innerWidth < 640;
  const STRIPS = narrowNow ? 22 : 36;
  const TAIL_SEGMENTS = 14;

  // Wait for the logo image, so it never appears half-loaded.
  useEffect(() => {
    try { window.localStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode */ }
    let active = true;
    const giveUp = window.setTimeout(() => active && doneRef.current(), LOAD_TIMEOUT_MS);
    const img = new Image();
    img.src = LOGO_SRC;
    img.decode()
      .then(() => { if (active) { window.clearTimeout(giveUp); setStage('play'); } })
      .catch(() => { if (active) { window.clearTimeout(giveUp); doneRef.current(); } });
    return () => { active = false; window.clearTimeout(giveUp); };
  }, []);

  // Lay out the scene for this screen: project the ground path into perspective.
  useLayoutEffect(() => {
    if (stage !== 'play' || geo) return;
    const box = flyRef.current?.getBoundingClientRect();
    if (!box) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const narrow = vw < 640;
    const cx = vw / 2;
    const f = vw * (narrow ? 0.46 : 0.3);
    const hy = vh * (narrow ? 0.4 : 0.38);
    const depth = vh * (narrow ? 0.46 : 0.5);
    const project = (X: number, Z: number): Pt => ({ x: cx + (X * f) / Z, y: hy + depth / Z });

    const ground = groundCurve(GROUND);
    const pts = ground.map(([X, Z]) => ({ X, Z, ...project(X, Z) }));
    let screenLen = 0;
    const screenCum = [0];
    const groundCum = [0];
    for (let i = 1; i < pts.length; i++) {
      screenLen += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      screenCum.push(screenLen);
      groundCum.push(groundCum[i - 1] + Math.hypot(pts[i].X - pts[i - 1].X, pts[i].Z - pts[i - 1].Z));
    }
    const samples: Sample[] = pts.map((p, i) => ({ ...p, s: screenCum[i] / screenLen }));

    // Dots spaced evenly on the ground, so they bunch up towards the horizon.
    const dots: Geometry['dots'] = [];
    const groundLen = groundCum[groundCum.length - 1];
    const dotCount = narrow ? 110 : 150;
    for (let k = 0, j = 0; k <= dotCount; k++) {
      const target = (groundLen * k) / dotCount;
      while (j < groundCum.length - 1 && groundCum[j] < target) j++;
      const p = samples[j];
      dots.push({ x: p.x, y: p.y, r: Math.max(0.7, ((narrow ? 2.4 : 3.2) * 1.2) / p.Z) });
    }

    const stops: StopGeo[] = STOPS.map(({ at, side }) => {
      let i = 0;
      let best = Infinity;
      samples.forEach((p, k) => {
        const d = Math.hypot(p.X - at[0], p.Z - at[1]);
        if (d < best) { best = d; i = k; }
      });
      const p = samples[i];
      const rx = ((narrow ? 22 : 30) * 1.2) / p.Z;
      const ry = rx * 0.38;
      const font = Math.max(narrow ? 7.5 : 9, Math.min(narrow ? 10.5 : 12.5, (narrow ? 13 : 16) / p.Z));
      const gap = 5;
      const label =
        side === 'up' ? { lx: p.x, ly: p.y - ry - gap - 2, anchor: 'middle' as const }
        : side === 'right' ? { lx: p.x + rx + gap, ly: p.y + font * 0.35, anchor: 'start' as const }
        : { lx: p.x - rx - gap, ly: p.y + font * 0.35, anchor: 'end' as const };
      return { i, x: p.x, y: p.y, rx, ry, font, ...label };
    });

    // Long light streaks that sweep across behind the rising logo.
    const centre = { x: box.left + box.width / 2, y: box.top + box.width / LOGO_RATIO / 2 };
    const streaks = [-0.24, -0.1, 0.06, 0.2, 0.32].map((o, k) => {
      const y0 = centre.y + vh * o + vh * 0.12;
      const y1 = centre.y + vh * o * 0.6 - vh * 0.06;
      const bend = vh * (k % 2 ? 0.14 : -0.12);
      return `M${-vw * 0.1} ${y0} C${vw * 0.3} ${y0 + bend} ${vw * 0.65} ${y1 - bend} ${vw * 1.1} ${y1}`;
    });

    setGeo({
      narrow,
      centre,
      logoW: box.width,
      logoH: box.width / LOGO_RATIO,
      nearFlagW: narrow ? vw * 0.3 : Math.min(vw * 0.22, 300), // keeps the flag on screen at the customer
      horizon: hy,
      samples,
      path: `M${samples.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')}`,
      dots,
      stops,
      streaks,
    });
  }, [stage, geo]);

  // Play the story frame by frame.
  useEffect(() => {
    if (stage !== 'play' || !geo) return;
    const travel = travelRef.current;
    const flag = flagRef.current;
    const root = rootRef.current;
    if (!travel || !flag || !root) return;
    const strips = Array.from(flag.children) as HTMLElement[];
    const { samples, stops, centre, logoW, logoH } = geo;
    const last = samples.length - 1;
    const sampleAt = (fi: number) => {
      const i = Math.max(0, Math.min(last - 1, Math.floor(fi)));
      const k = Math.min(1, fi - i);
      const a = samples[i];
      const b = samples[i + 1];
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, Z: a.Z + (b.Z - a.Z) * k, s: a.s + (b.s - a.s) * k };
    };
    const flagScale = (Z: number) => (geo.nearFlagW * NEAR_Z) / Z / logoW;
    // the flag's centre sits up and to the right of where its pole meets the ground
    const flagCentre = (g: { x: number; y: number }, scale: number) => ({ x: g.x + scale * logoW * 0.515, y: g.y - scale * logoH * 1.16 });
    const rideFrom = stops[0].i;
    const rideTo = stops[stops.length - 1].i;
    const endGround = sampleAt(rideTo);
    const s0 = flagScale(endGround.Z);
    const liftFrom = flagCentre(endGround, s0);
    const c1 = { x: liftFrom.x, y: liftFrom.y - (liftFrom.y - centre.y) * 0.85 };
    const c2 = { x: centre.x + (liftFrom.x - centre.x) * 0.55, y: centre.y - logoH * 0.15 };
    const tail: { t: number; x: number; y: number }[] = [];

    const setTrade = (value: string) => tradeRefs.current.forEach((el) => { if (el) el.style.strokeDasharray = value; });
    const wave = (scaleAmp: number, s: number, cloth: number) => {
      const n = strips.length;
      const amp = logoH * scaleAmp;
      const y = (x: number) => amp * (0.25 + 0.75 * x) * Math.sin(2 * Math.PI * (1.2 * x - 2.1 * s));
      strips.forEach((el, i) => {
        const x = (i + 0.5) / n;
        const slope = (y(x + 0.5 / n) - y(x - 0.5 / n)) / (logoW / n);
        el.style.transform = `translate3d(0, ${y(x).toFixed(2)}px, 0) skewY(${Math.atan(slope).toFixed(4)}rad)`;
        const shade = Math.max(-1, Math.min(1, slope * 3));
        // folds shade the cloth (and fade with it)
        el.style.setProperty('--dark', (Math.max(0, shade) * 0.32 * cloth).toFixed(3));
        el.style.setProperty('--light', (Math.max(0, -shade) * 0.2 * cloth).toFixed(3));
      });
    };

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = now - t0;
      const sec = t / 1000;

      // 1. the snake draws itself, bright head first
      const head = sampleAt(last * easeInOut(clamp01(t / DRAW_MS)));
      if (maskRef.current) maskRef.current.style.strokeDashoffset = String(1 - head.s);
      if (cometRef.current) cometRef.current.style.strokeDasharray = `0 ${Math.max(0, head.s - 0.06)} ${Math.min(0.06, head.s)} 2`;
      if (headRef.current) {
        headRef.current.setAttribute('cx', head.x.toFixed(1));
        headRef.current.setAttribute('cy', head.y.toFixed(1));
        headRef.current.setAttribute('r', Math.max(3, (geo.narrow ? 10 : 14) / head.Z).toFixed(1));
        headRef.current.style.opacity = String(t < 80 ? t / 80 : 1 - clamp01((t - DRAW_MS) / 300));
      }

      // 2. the flag rides the path; stops connect as it passes
      const ride = easeInOut(clamp01((t - RIDE_START) / (RIDE_END - RIDE_START)));
      const at = sampleAt(rideFrom + (rideTo - rideFrom) * ride);
      stopRefs.current.forEach((el, k) => {
        el?.classList.toggle('is-in', head.s >= samples[stops[k].i].s - 0.005);
        el?.classList.toggle('is-on', t >= RIDE_START && rideFrom + (rideTo - rideFrom) * ride >= stops[k].i - 0.5);
      });
      setTrade(t >= RIDE_START ? `0 ${samples[rideFrom].s} ${Math.max(0, at.s - samples[rideFrom].s)} 2` : '0 2');

      let pos: Pt;
      let scale: number;
      let rotY: number;
      let rotZ: number;
      let cloth: number;
      let pole: number;
      let flutter: number;
      if (t < RIDE_END) {
        scale = flagScale(at.Z);
        pos = flagCentre(at, scale);
        rotY = -14;
        rotZ = 0;
        cloth = 0.85;
        pole = 1;
        flutter = 0.09;
        travel.style.opacity = String(clamp01((t - RIDE_START) / 220));
      } else {
        // 3. rise to the centre: grows, cloth melts away, a tail of light follows
        const q = clamp01((t - RIDE_END) / (LIFT_END - RIDE_END));
        const e = easeInOut(q);
        pos = cubic(liftFrom, c1, c2, centre, e);
        scale = s0 + (1 - s0) * Math.pow(e, 1.2);
        rotY = -14 * (1 - e) + 12 * Math.sin(Math.PI * q);
        rotZ = -5 * Math.sin(Math.PI * q);
        cloth = 0.85 * (1 - clamp01(q / 0.75));
        pole = 1 - clamp01(q / 0.35);
        flutter = 0.09 * Math.pow(1 - q, 1.4);
        travel.style.opacity = '1';
        if (q < 1) tail.push({ t, x: pos.x, y: pos.y });
      }
      flag.style.setProperty('--cloth', cloth.toFixed(3));
      if (poleRef.current) poleRef.current.style.opacity = pole.toFixed(3);
      wave(flutter, sec, cloth);
      travel.style.transform =
        `translate(${(pos.x - centre.x).toFixed(2)}px, ${(pos.y - centre.y).toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

      // the logo's tail: a braided ribbon of light along where it just flew
      while (tail.length && tail[0].t < t - TAIL_MS) tail.shift();
      const ribbons = 3;
      for (let r = 0; r < ribbons; r++) {
        for (let k = 0; k < TAIL_SEGMENTS; k++) {
          const el = tailRefs.current[r * TAIL_SEGMENTS + k];
          if (!el) continue;
          if (tail.length < 2) { el.style.opacity = '0'; continue; }
          const pick = (age: number) => {
            const tt = t - age * TAIL_MS;
            let j = tail.length - 1;
            while (j > 0 && tail[j - 1].t > tt) j--;
            const a = tail[Math.max(0, j - 1)];
            const b = tail[j];
            const k2 = b.t === a.t ? 0 : clamp01((tt - a.t) / (b.t - a.t));
            return { x: a.x + (b.x - a.x) * k2, y: a.y + (b.y - a.y) * k2 };
          };
          const a0 = k / TAIL_SEGMENTS;
          const a1 = (k + 1) / TAIL_SEGMENTS;
          const p = pick(a0);
          const p2 = pick(a1);
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          const spread = (geo.narrow ? 7 : 12) * (r - 1);
          const off = (age: number) => spread * (1 - age) + 4 * Math.sin(age * 10 + r * 2.1) * (r === 1 ? 0 : 1);
          el.setAttribute('x1', (p.x + nx * off(a0)).toFixed(1));
          el.setAttribute('y1', (p.y + ny * off(a0)).toFixed(1));
          el.setAttribute('x2', (p2.x + nx * off(a1)).toFixed(1));
          el.setAttribute('y2', (p2.y + ny * off(a1)).toFixed(1));
          el.style.strokeWidth = (((r === 1 ? 7 : 3) * (1 - a0)) * (geo.narrow ? 0.7 : 1)).toFixed(2);
          el.style.opacity = (Math.pow(1 - a0, 1.3) * (r === 1 ? 0.95 : 0.5)).toFixed(3);
        }
      }

      root.classList.toggle('is-streaks', t >= STREAKS_AT);
      root.classList.toggle('is-centre', t >= LIFT_END - 300);
      root.classList.toggle('is-real', t >= LIFT_END);
      root.classList.toggle('is-burst', t >= BURST_AT);
      root.classList.toggle('is-tagline', t >= TAGLINE_AT);

      if (t >= DOCK_AT) { setStage('dock'); return; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [stage, geo]);

  // 4. Dock: glide onto the header logo, measuring both so it lands exactly.
  useEffect(() => {
    if (stage !== 'dock') return;
    document.documentElement.classList.remove('intro-hold'); // page text fades in now
    const el = flyRef.current;
    if (travelRef.current) travelRef.current.style.transform = 'none';
    const logo = el?.querySelector('.mlogo');
    const target = document.querySelector('.mlogo-header');
    const box = el?.getBoundingClientRect();
    const from = logo?.getBoundingClientRect(); // includes the float offset
    const to = target?.getBoundingClientRect();
    if (!el || !box || !from || !to || !to.width || !from.width) { setStage('landed'); return; }
    const s = to.width / from.width;
    const dx = to.left - box.left - (from.left - box.left) * s;
    const dy = to.top - box.top - (from.top - box.top) * s;
    const anim = el.animate(
      [
        { transform: 'translate(0, 0) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      ],
      { duration: DOCK_MS, easing: 'cubic-bezier(0.6, 0, 0.2, 1)', fill: 'forwards' }
    );
    anim.onfinish = () => setStage('landed');
    return () => { anim.onfinish = null; };
  }, [stage]);

  // Hand over to the header logo, then fade this one out.
  useEffect(() => {
    if (stage !== 'landed') return;
    document.documentElement.classList.remove('intro-pending', 'intro-hold');
    const t = window.setTimeout(() => doneRef.current(), FADE_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  if (stage === 'loading') return null;
  const logoW = geo?.logoW ?? 0;
  const logoH = geo?.logoH ?? 0;

  return (
    <div
      ref={rootRef}
      className={`intro-float is-${stage} ${geo?.narrow ? 'is-narrow' : ''} ${stage === 'dock' || stage === 'landed' ? 'is-real is-centre' : ''}`}
      aria-hidden="true"
    >
      <div className="intro-scene" style={geo ? ({ '--horizon': `${geo.horizon}px` } as React.CSSProperties) : undefined} />
      {geo && (
        <svg className="intro-ground" width="100%" height="100%">
          <defs>
            <mask id="intro-snake-mask" maskUnits="userSpaceOnUse">
              <path ref={maskRef} d={geo.path} pathLength={1} fill="none" stroke="#fff" strokeWidth={44} strokeDasharray="1 1" style={{ strokeDashoffset: 1 }} />
            </mask>
            <radialGradient id="intro-head-glow">
              <stop offset="0" stopColor="#fffbea" />
              <stop offset="0.35" stopColor="#ffd98a" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffb547" stopOpacity="0" />
            </radialGradient>
          </defs>
          {geo.streaks.map((d, k) => (
            <path key={k} d={d} pathLength={1} className="intro-streak" style={{ '--k': k } as React.CSSProperties} />
          ))}
          <g className="intro-route">
          <g mask="url(#intro-snake-mask)">
            <path d={geo.path} className="intro-snake-line" />
            {geo.dots.map((p, k) => <circle key={k} cx={p.x} cy={p.y} r={p.r} className="intro-snake-dot" />)}
          </g>
          {['halo', 'core'].map((k, i) => (
            <path key={k} ref={(el) => { tradeRefs.current[i] = el; }} d={geo.path} pathLength={1} className={`intro-trade intro-trade-${k}`} style={{ strokeDasharray: '0 2' }} />
          ))}
          <path ref={cometRef} d={geo.path} pathLength={1} className="intro-comet" style={{ strokeDasharray: '0 2' }} />
          {geo.stops.map((s, k) => (
            <g key={k} ref={(el) => { stopRefs.current[k] = el; }} className="intro-stop">
              <ellipse cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} className="intro-stop-ring" />
              <ellipse cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} className="intro-stop-ripple" />
              <ellipse cx={s.x} cy={s.y} rx={s.rx * 0.42} ry={s.ry * 0.42} className="intro-stop-core" />
              <text x={s.lx} y={s.ly} textAnchor={s.anchor} className="intro-stop-label" style={{ fontSize: s.font }}>{STOPS[k].label}</text>
            </g>
          ))}
          <circle ref={headRef} r={0} fill="url(#intro-head-glow)" className="intro-head" />
          </g>
          <g className="intro-tail">
            {Array.from({ length: 3 * TAIL_SEGMENTS }, (_, k) => (
              <line key={k} ref={(el) => { tailRefs.current[k] = el; }} className={k >= TAIL_SEGMENTS && k < 2 * TAIL_SEGMENTS ? 'intro-tail-core' : 'intro-tail-side'} style={{ opacity: 0 }} />
            ))}
          </g>
        </svg>
      )}
      {geo && (
        <div className="intro-burst" style={{ left: geo.centre.x - logoW * 0.14, top: geo.centre.y - logoH * 0.2 }}>
          {Array.from({ length: 18 }, (_, k) => (
            <span key={k} style={{ '--a': `${k * 20 + (k % 3) * 6}deg`, '--l': `${(geo.narrow ? 0.34 : 0.3) * logoW * (0.7 + ((k * 37) % 10) / 20)}px` } as React.CSSProperties} />
          ))}
        </div>
      )}
      {geo && (
        <div className="intro-tagline" style={{ top: geo.centre.y + geo.logoH / 2 + (geo.narrow ? 16 : 26) }}>
          Every trade, connected.
        </div>
      )}
      <div className="intro-shade" />
      <div ref={flyRef} className="intro-fly">
        <div ref={travelRef} className="intro-travel" style={{ opacity: 0 }}>
          <span ref={poleRef} className="intro-pole" />
          <div ref={flagRef} className="intro-flag">
            {logoW > 0 && Array.from({ length: STRIPS }, (_, i) => (
              <span
                key={i}
                className="intro-flag-strip"
                style={{
                  left: (i * logoW) / STRIPS,
                  width: logoW / STRIPS + 1,
                  backgroundPosition: `0 0, 0 0, ${(-i * logoW) / STRIPS}px 0, 0 0`,
                  backgroundSize: `100% 100%, 100% 100%, ${logoW}px ${logoH}px, 100% 100%`,
                }}
              />
            ))}
          </div>
          <div className="intro-bob">
            <MatricsLogo variant="intro" className="intro-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroReveal;
