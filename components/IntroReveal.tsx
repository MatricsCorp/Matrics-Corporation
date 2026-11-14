import React, { useEffect, useMemo, useRef, useState } from 'react';
import MatricsLogo from './MatricsLogo';
import './intro-reveal.css';

// First visit, told as a trade:
//  1. travel  – the logo flies in from the far corner like a flag or a sheet of
//               paper, small and fluttering, growing as it nears the centre,
//               along a dotted trade route with hubs that light up as it passes;
//  2. connect – it settles and the light runs through its network grid;
//  3. dock    – it glides into the header and becomes the header logo.
// It never blocks the page. Once per browser; add ?intro to the address to replay.
const SEEN_KEY = 'matrics-intro-seen';
const LOGO_SRC = '/brand/matrics-grid.webp';
const LOGO_RATIO = 1630 / 400;
const TRAVEL_MS = 1500;
const CONNECT_MS = 1550; // light runs through the grid, then dock
const DOCK_MS = 750;
const FADE_MS = 300;
const LOAD_TIMEOUT_MS = 1800; // logo not ready by then: skip the intro
const HUBS = [0.34, 0.68]; // where along the route the hub dots sit

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

type Stage = 'loading' | 'travel' | 'connect' | 'dock' | 'landed';
type Pt = { x: number; y: number };

const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface Route { start: Pt; ctrl: Pt; end: Pt; d: string; lengthAt: (t: number) => number; hubs: Pt[] }

const IntroReveal: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [stage, setStage] = useState<Stage>('loading');
  const [route, setRoute] = useState<Route | null>(null);
  const [width, setWidth] = useState(0);
  const flyRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const stripsRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const hubRefs = useRef<(SVGGElement | null)[]>([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  // More strips on wide screens keep the wave smooth.
  const strips = typeof window !== 'undefined' && window.innerWidth < 640 ? 22 : 36;

  // Wait for the logo image, so it never appears half-loaded.
  useEffect(() => {
    try { window.localStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode */ }
    let active = true;
    const giveUp = window.setTimeout(() => active && doneRef.current(), LOAD_TIMEOUT_MS);
    const img = new Image();
    img.src = LOGO_SRC;
    img.decode()
      .then(() => { if (active) { window.clearTimeout(giveUp); setStage('travel'); } })
      .catch(() => { if (active) { window.clearTimeout(giveUp); doneRef.current(); } });
    return () => { active = false; window.clearTimeout(giveUp); };
  }, []);

  // Plan the route once the logo's resting place (screen centre) is known.
  useEffect(() => {
    if (stage !== 'travel' || route) return;
    const box = flyRef.current?.getBoundingClientRect();
    if (!box) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const end = { x: box.left + box.width / 2, y: box.top + box.width / LOGO_RATIO / 2 };
    const start = { x: vw * 0.9, y: vh * 0.97 };
    const ctrl = { x: vw * 0.86, y: vh * 0.42 };
    // arc-length table, so the drawn route keeps pace with the logo
    const samples = 60;
    const lengths = [0];
    let prev = start;
    for (let i = 1; i <= samples; i++) {
      const p = quad(start, ctrl, end, i / samples);
      lengths.push(lengths[i - 1] + Math.hypot(p.x - prev.x, p.y - prev.y));
      prev = p;
    }
    const total = lengths[samples];
    const lengthAt = (t: number) => {
      const f = Math.min(samples, Math.max(0, t * samples));
      const i = Math.floor(f);
      const l = i >= samples ? lengths[samples] : lengths[i] + (lengths[i + 1] - lengths[i]) * (f - i);
      return l / total;
    };
    setWidth(box.width);
    setRoute({
      start, ctrl, end, lengthAt,
      d: `M${start.x} ${start.y} Q${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`,
      hubs: HUBS.map((t) => quad(start, ctrl, end, t)),
    });
  }, [stage, route]);

  // 1. Travel: frame-by-frame flight with a flag wave across the strips.
  useEffect(() => {
    if (stage !== 'travel' || !route || !width) return;
    const travel = travelRef.current;
    const stripEls = Array.from(stripsRef.current?.children ?? []) as HTMLElement[];
    if (!travel) return;
    const height = width / LOGO_RATIO;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / TRAVEL_MS);
      const s = (now - t0) / 1000;
      const e = easeOutCubic(p);
      const at = quad(route.start, route.ctrl, route.end, e);
      const calm = Math.pow(1 - p, 1.6); // flutter dies down as it arrives
      const scale = 0.12 + 0.88 * (1 - Math.pow(1 - p, 2.2));
      const tilt = -14 * calm + 5 * calm * Math.sin(2 * Math.PI * 1.3 * s);
      const swing = 32 * calm * Math.sin(2 * Math.PI * 0.9 * s + 0.6);
      const pitch = 10 * calm * Math.sin(2 * Math.PI * 1.1 * s);
      travel.style.opacity = String(Math.min(1, p / 0.12));
      travel.style.transform =
        `translate(${at.x - route.end.x}px, ${at.y - route.end.y}px) rotateZ(${tilt}deg) rotateY(${swing}deg) rotateX(${pitch}deg) scale(${scale})`;
      // Flag wave: runs from the left edge (held) to the right edge (free).
      // Each strip is also slanted to the wave's slope so the strips join
      // into one smooth curve.
      const amp = 0.22 * height * Math.pow(1 - p, 1.2);
      const wave = (x: number) => amp * (0.3 + 0.7 * x) * Math.sin(2 * Math.PI * (1.15 * x - 2.4 * s));
      const n = stripEls.length;
      stripEls.forEach((el, i) => {
        const x = (i + 0.5) / n;
        const slope = (wave(x + 0.5 / n) - wave(x - 0.5 / n)) / (width / n);
        el.style.transform = `translate3d(0, ${wave(x).toFixed(2)}px, 0) skewY(${Math.atan(slope).toFixed(4)}rad)`;
      });
      const drawn = route.lengthAt(e);
      if (maskRef.current) maskRef.current.style.strokeDashoffset = String(1 - drawn);
      HUBS.forEach((h, i) => hubRefs.current[i]?.classList.toggle('is-lit', drawn >= route.lengthAt(h)));
      if (p < 1) raf = requestAnimationFrame(frame);
      else setStage('connect');
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [stage, route, width]);

  // 2. Connect: the light runs through the grid (MatricsLogo's own animation).
  useEffect(() => {
    if (stage !== 'connect') return;
    const t = window.setTimeout(() => setStage('dock'), CONNECT_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  // 3. Dock: glide onto the header logo, measuring both so it lands exactly.
  useEffect(() => {
    if (stage !== 'dock') return;
    document.documentElement.classList.remove('intro-hold'); // page text fades in now
    const el = flyRef.current;
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
  const height = width / LOGO_RATIO;
  const traveling = stage === 'travel';

  return (
    <div className={`intro-float is-${stage}`} aria-hidden="true">
      {route && (
        <svg className="intro-route" width="100%" height="100%">
          <defs>
            <mask id={`route-${uid}`} maskUnits="userSpaceOnUse">
              <path
                ref={maskRef}
                d={route.d}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={14}
                strokeDasharray="1 1"
                style={{ strokeDashoffset: 1 }}
              />
            </mask>
          </defs>
          <path d={route.d} className="intro-route-line" mask={`url(#route-${uid})`} />
          <circle cx={route.start.x} cy={route.start.y} r={5} className="intro-route-origin" />
          {route.hubs.map((h, i) => (
            <g key={i} ref={(el) => { hubRefs.current[i] = el; }} className="intro-route-hub">
              <circle cx={h.x} cy={h.y} r={11} className="intro-route-hub-ring" />
              <circle cx={h.x} cy={h.y} r={4.5} className="intro-route-hub-dot" />
            </g>
          ))}
        </svg>
      )}
      <div className="intro-shade" />
      <div ref={flyRef} className="intro-fly">
        <div ref={travelRef} className="intro-travel" style={traveling ? { opacity: 0 } : undefined}>
          {traveling && width > 0 && (
            <div ref={stripsRef} className="intro-flag">
              {Array.from({ length: strips }, (_, i) => (
                <span
                  key={i}
                  className="intro-flag-strip"
                  style={{
                    left: (i * width) / strips,
                    width: width / strips + 1,
                    backgroundImage: `url(${LOGO_SRC})`,
                    backgroundSize: `${width}px ${height}px`,
                    backgroundPosition: `${(-i * width) / strips}px 0`,
                  }}
                />
              ))}
            </div>
          )}
          {!traveling && (
            <div className="intro-bob">
              <MatricsLogo variant="intro" className="intro-logo" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroReveal;
