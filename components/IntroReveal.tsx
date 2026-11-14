import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Factory, Warehouse, Boxes, Store, User } from 'lucide-react';
import MatricsLogo from './MatricsLogo';
import './intro-reveal.css';

// First visit, told as a trade (about 4.5 s, never blocks the page):
//  1. road     – a dotted road draws across the lower screen and the stops of a
//                trade appear along it: maker → distributor → wholesaler → kirana → customer;
//  2. ride     – a small Matrics logo rides the road; each stop it reaches
//                lights up as connected and the road behind it becomes a solid
//                trade line;
//  3. lift     – after the customer it lifts off and grows into the centre,
//                trailing the trade line, with "Every trade, connected." below;
//                the light runs through its grid;
//  4. dock     – it glides into the header and becomes the header logo while
//                the page appears.
// Shown once per browser; add ?intro to the address to replay it.
const SEEN_KEY = 'matrics-intro-seen';
const LOGO_SRC = '/brand/matrics-grid.webp';
const LOGO_RATIO = 1630 / 400;
const LOAD_TIMEOUT_MS = 1800; // logo not ready by then: skip the intro

// Timeline (ms from the start)
const ROAD_DRAW = 600;
const STOP_IN = 100;        // first stop pops in; the rest follow
const STOP_GAP = 110;
const TOKEN_IN = 450;
const RIDE_START = 600;
const RIDE_MS = 1500;
const LIFT_MS = 900;
const CENTRE_AT = RIDE_START + RIDE_MS + 200; // shade pool begins as it nears the centre
const TAGLINE_AT = 2650;
const DOCK_AT = 3700;       // the grid light starts at 2.4 s (see intro-reveal.css)
const DOCK_MS = 750;
const FADE_MS = 300;

const STOPS = [
  { label: 'Maker', Icon: Factory },
  { label: 'Distributor', Icon: Warehouse },
  { label: 'Wholesaler', Icon: Boxes },
  { label: 'Kirana', Icon: Store },
  { label: 'Customer', Icon: User },
];
const STOP_AT = [0.04, 0.27, 0.5, 0.73, 0.96]; // along the road's width
const STOP_WAVE = [0.3, -0.5, 0.4, -0.35, 0.2]; // gentle ups and downs

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

interface Geometry {
  centre: Pt;          // the logo's resting place
  logoH: number;
  tokenScale: number;  // how small it rides
  tokenLift: number;   // how far above the road it rides
  stops: Pt[];
  road: string;
  narrow: boolean;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});

// The lift-off curve: rises from the customer and bends in towards the centre early.
const liftControl = (from: Pt, centre: Pt): Pt => ({
  x: from.x + (centre.x - from.x) * 0.35,
  y: centre.y + (from.y - centre.y) * 0.15,
});

// Smooth curve through points (Catmull-Rom as cubic Béziers)
const smoothPath = (pts: Pt[]) => {
  const ext = [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < ext.length - 2; i++) {
    const [p0, p1, p2, p3] = [ext[i - 1], ext[i], ext[i + 1], ext[i + 2]];
    d += ` C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}`
      + ` ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}`
      + ` ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
};

const IntroReveal: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [stage, setStage] = useState<Stage>('loading');
  const [geo, setGeo] = useState<Geometry | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const roadMaskRef = useRef<SVGPathElement>(null);
  const tradeRefs = useRef<(SVGPathElement | null)[]>([]);
  const liftRefs = useRef<(SVGPathElement | null)[]>([]);
  const stopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

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

  // Lay out the road and stops for this screen.
  useLayoutEffect(() => {
    if (stage !== 'play' || geo) return;
    const box = flyRef.current?.getBoundingClientRect();
    if (!box) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const narrow = vw < 640;
    const logoH = box.width / LOGO_RATIO;
    const span = Math.min(vw * 0.84, 1100);
    const left = (vw - span) / 2;
    const baseY = Math.min(vh * 0.8, vh - (narrow ? 84 : 70));
    const wave = narrow ? 16 : Math.min(40, vh * 0.05); // gentler on phones, where stops sit close
    const stops = STOP_AT.map((f, i) => ({ x: left + span * f, y: baseY + wave * STOP_WAVE[i] }));
    const tokenW = Math.max(84, Math.min(vw * 0.11, 140));
    const tokenScale = tokenW / box.width;
    setGeo({
      centre: { x: box.left + box.width / 2, y: box.top + logoH / 2 },
      logoH,
      tokenScale,
      tokenLift: (logoH * tokenScale) / 2 + (narrow ? 18 : 22),
      stops,
      road: smoothPath([{ x: left - 24, y: stops[0].y }, ...stops, { x: left + span + 24, y: stops[4].y }]),
      narrow,
    });
  }, [stage, geo]);

  // Play the story frame by frame.
  useEffect(() => {
    if (stage !== 'play' || !geo) return;
    const road = roadRef.current;
    const travel = travelRef.current;
    const root = rootRef.current;
    if (!road || !travel || !root) return;
    const total = road.getTotalLength();
    // where each stop sits along the road (fraction of its length)
    const at = geo.stops.map((s) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i <= 400; i++) {
        const p = road.getPointAtLength((i / 400) * total);
        const d = Math.hypot(p.x - s.x, p.y - s.y);
        if (d < bestD) { bestD = d; best = i / 400; }
      }
      return best;
    });
    const tokenAt = (f: number) => {
      const p = road.getPointAtLength(f * total);
      const q = road.getPointAtLength(Math.min(total, f * total + 2));
      return { x: p.x, y: p.y - geo.tokenLift, angle: Math.atan2(q.y - p.y, q.x - p.x) };
    };
    const liftFrom = tokenAt(at[4]);
    const liftCtrl = liftControl(liftFrom, geo.centre);
    const setDash = (els: (SVGPathElement | null)[], value: string) =>
      els.forEach((el) => { if (el) el.style.strokeDasharray = value; });

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = now - t0;

      // 1. road draws in, stops pop up
      if (roadMaskRef.current) roadMaskRef.current.style.strokeDashoffset = String(1 - clamp01(t / ROAD_DRAW));
      stopRefs.current.forEach((el, i) => el?.classList.toggle('is-in', t >= STOP_IN + i * STOP_GAP));

      // 2. ride along the road
      const ride = easeInOut(clamp01((t - RIDE_START) / RIDE_MS));
      const f = at[0] + (at[4] - at[0]) * ride;
      stopRefs.current.forEach((el, i) => el?.classList.toggle('is-on', t >= RIDE_START && f >= at[i] - 0.002));
      // trade line: solid from the maker up to the logo (pathLength = 1)
      setDash(tradeRefs.current, t >= RIDE_START ? `0 ${at[0]} ${Math.max(0, f - at[0])} 2` : '0 2');

      // 3. lift off to the centre
      const liftT = clamp01((t - RIDE_START - RIDE_MS) / LIFT_MS);
      const lift = easeInOut(liftT);
      setDash(liftRefs.current, `${lift} 2`);
      root.classList.toggle('is-centre', t >= CENTRE_AT);
      root.classList.toggle('is-tagline', t >= TAGLINE_AT);

      let x: number, y: number, scale: number, rotZ: number, rotY = 0;
      if (t < RIDE_START + RIDE_MS) {
        const p = tokenAt(f);
        x = p.x; y = p.y; scale = geo.tokenScale;
        rotZ = (p.angle * 180) / Math.PI * 0.6; // leans with the road
        const appear = clamp01((t - TOKEN_IN) / 150);
        travel.style.opacity = String(appear);
        scale *= 0.6 + 0.4 * appear;
      } else {
        const p = quad(liftFrom, liftCtrl, geo.centre, lift);
        x = p.x; y = p.y;
        scale = geo.tokenScale + (1 - geo.tokenScale) * Math.pow(lift, 1.5); // grows as it travels in, so it never spills off the edge
        rotZ = -6 * Math.sin(Math.PI * liftT);                 // floats like paper
        rotY = 16 * Math.sin(Math.PI * liftT) * Math.cos(5 * liftT);
        travel.style.opacity = '1';
      }
      travel.style.transform =
        `translate(${(x - geo.centre.x).toFixed(2)}px, ${(y - geo.centre.y).toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

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
    const travel = travelRef.current;
    if (travel) travel.style.transform = 'none';
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

  // The trade line runs from the customer up into the logo's right end (clear of the tagline below it).
  const liftPath = geo
    ? (() => {
        const from = { x: geo.stops[4].x, y: geo.stops[4].y };
        const to = { x: geo.centre.x + geo.logoH * LOGO_RATIO * 0.44, y: geo.centre.y + geo.logoH * 0.12 };
        const ctrl = liftControl(from, to);
        return `M${from.x} ${from.y} Q${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`;
      })()
    : '';

  return (
    <div ref={rootRef} className={`intro-float is-${stage} ${geo?.narrow ? 'is-narrow' : ''}`} aria-hidden="true">
      {geo && (
        <>
          <svg className="intro-road" width="100%" height="100%">
            <defs>
              <mask id="intro-road-mask" maskUnits="userSpaceOnUse">
                <path ref={roadMaskRef} d={geo.road} pathLength={1} fill="none" stroke="#fff" strokeWidth={16} strokeDasharray="1 1" style={{ strokeDashoffset: 1 }} />
              </mask>
            </defs>
            <path ref={roadRef} d={geo.road} className="intro-road-dots" mask="url(#intro-road-mask)" />
            {/* trade line: halo + core, revealed behind the riding logo */}
            {['halo', 'core'].map((k, i) => (
              <path key={k} ref={(el) => { tradeRefs.current[i] = el; }} d={geo.road} pathLength={1} className={`intro-trade intro-trade-${k}`} style={{ strokeDasharray: '0 2' }} />
            ))}
            {['halo', 'core'].map((k, i) => (
              <path key={`l${k}`} ref={(el) => { liftRefs.current[i] = el; }} d={liftPath} pathLength={1} className={`intro-trade intro-lift intro-trade-${k}`} style={{ strokeDasharray: '0 2' }} />
            ))}
          </svg>
          <div className="intro-stops">
            {STOPS.map(({ label, Icon }, i) => (
              <div
                key={label}
                ref={(el) => { stopRefs.current[i] = el; }}
                className={`intro-stop ${geo.narrow && i % 2 === 1 ? 'is-low' : ''}`}
                style={{ left: geo.stops[i].x, top: geo.stops[i].y }}
              >
                <Icon size={geo.narrow ? 12 : 15} strokeWidth={2.25} />
                <span className="intro-stop-label">{label}</span>
              </div>
            ))}
          </div>
          <div className="intro-tagline" style={{ top: geo.centre.y + geo.logoH / 2 + (geo.narrow ? 16 : 26) }}>
            Every trade, connected.
          </div>
        </>
      )}
      <div className="intro-shade" />
      <div ref={flyRef} className="intro-fly">
        <div ref={travelRef} className="intro-travel" style={{ opacity: 0 }}>
          <div className="intro-bob">
            <MatricsLogo variant="intro" className="intro-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroReveal;
