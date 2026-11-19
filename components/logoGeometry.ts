// Geometry of the Matrics grid logo, traced from the artwork and measured in
// the logo's own coordinates (1895 x 465). `at` is when the light reaches that
// spot, in seconds after it starts running along the arc.

export const LOGO_W = 1895;
export const LOGO_H = 465;

/** The big arc, left end to right end; the light takes ARC_RUN seconds to cross it. */
export const ARC_PATH =
  'M13 443 C22 419 48 336 68 297 C88 258 112 234 135 210 C158 186 186 166 206 152 C226 138 234 134 255 123 C276 112 294 100 335 87 C376 74 439 54 503 44 C567 34 640 26 719 29 C798 32 918 55 974 64 C1030 73 1028 75 1055 83 C1082 91 1102 96 1135 110 C1168 124 1224 151 1255 168 C1286 185 1311 205 1322 212';

export const ARC_RUN = 1.3;
export const LINE_RUN = 0.4;

/** Short grid lines, drawn from the end the light reaches first. */
export const GRID_LINES: { x1: number; y1: number; x2: number; y2: number; at: number }[] = [
  { x1: 68, y1: 297, x2: 177, y2: 283, at: 0.13 },
  { x1: 68, y1: 297, x2: 127, y2: 407, at: 0.13 },
  { x1: 206, y1: 152, x2: 177, y2: 283, at: 0.3 },
  { x1: 206, y1: 152, x2: 429, y2: 148, at: 0.3 },
  { x1: 177, y1: 283, x2: 222, y2: 277, at: 0.53 },
  { x1: 177, y1: 283, x2: 170, y2: 350, at: 0.53 },
  { x1: 503, y1: 44, x2: 429, y2: 148, at: 0.57 },
  { x1: 503, y1: 44, x2: 633, y2: 103, at: 0.57 },
  { x1: 429, y1: 148, x2: 633, y2: 103, at: 0.7 },
  { x1: 429, y1: 148, x2: 390, y2: 210, at: 0.7 },
  { x1: 719, y1: 29, x2: 633, y2: 103, at: 0.76 },
  { x1: 633, y1: 103, x2: 974, y2: 64, at: 0.97 },
  { x1: 633, y1: 103, x2: 598, y2: 155, at: 0.97 },
  { x1: 633, y1: 103, x2: 650, y2: 145, at: 0.97 },
];

/** Connection dots, with the moment each one flashes. */
export const GRID_NODES: { x: number; y: number; at: number }[] = [
  { x: 68, y: 297, at: 0.13 },
  { x: 206, y: 152, at: 0.3 },
  { x: 177, y: 283, at: 0.53 },
  { x: 503, y: 44, at: 0.57 },
  { x: 429, y: 148, at: 0.7 },
  { x: 719, y: 29, at: 0.76 },
  { x: 633, y: 103, at: 0.97 },
  { x: 974, y: 64, at: 0.98 },
];

/** The orange dot of the "i", where the arc's light lands. */
export const I_DOT = { x: 1419, y: 169, r: 44, at: ARC_RUN };

// Deterministic "random" so the sparks are the same on every render.
const rand = (() => {
  let s = 0x9e3779b9;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

/** Sparks thrown off each dot (and the i-dot) when the light reaches it. */
export const SPARKS = [...GRID_NODES, { x: I_DOT.x, y: I_DOT.y, at: I_DOT.at }].flatMap(({ x, y, at }, n) =>
  Array.from({ length: n === GRID_NODES.length ? 9 : 4 }, () => {
    const angle = rand() * Math.PI * 2;
    const dist = 40 + rand() * (n === GRID_NODES.length ? 120 : 70);
    return {
      x, y,
      dx: Math.round(Math.cos(angle) * dist),
      dy: Math.round(Math.sin(angle) * dist - 20),
      r: +(2 + rand() * 3).toFixed(1),
      at: +(at + rand() * 0.12).toFixed(2),
    };
  })
);

/** Slow embers drifting over the logo during the intro. */
export const EMBERS = Array.from({ length: 30 }, () => ({
  x: Math.round(rand() * LOGO_W),
  y: Math.round(40 + rand() * (LOGO_H + 60)),
  r: +(1.5 + rand() * 3).toFixed(1),
  dx: Math.round((rand() - 0.5) * 80),
  dy: -Math.round(40 + rand() * 90),
  at: +(0.5 + rand() * 1.6).toFixed(2),
}));
