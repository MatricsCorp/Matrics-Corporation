import React, { useId } from 'react';
import {
  LOGO_W, LOGO_H, ARC_PATH, GRID_LINES, GRID_NODES, I_DOT, SPARKS, EMBERS,
} from './logoGeometry';
import './matrics-logo.css';

type Variant = 'header' | 'intro';

interface MatricsLogoProps {
  /** header: plays once on load, then a soft light runs every few seconds. intro: the full reveal, once. */
  variant: Variant;
  /** Sits on a light background (Light theme): dark lettering, orange light. */
  onLight?: boolean;
  className?: string;
}

const SRC: Record<Variant, { base: string; baseOnLight?: string; w: number; h: number }> = {
  header: { base: '/brand/matrics-grid-sm.webp', baseOnLight: '/brand/matrics-grid-sm-dark.webp', w: 538, h: 132 },
  intro: { base: '/brand/matrics-grid.webp', w: 1630, h: 400 },
};
const LETTERS = '/brand/matrics-grid-letters.webp';

const maskStyle = (url: string): React.CSSProperties => ({
  WebkitMaskImage: `url(${url})`,
  maskImage: `url(${url})`,
});

const at = (seconds: number) => ({ '--at': `${seconds}s` } as React.CSSProperties);

const MatricsLogo: React.FC<MatricsLogoProps> = ({ variant, onLight = false, className = '' }) => {
  const id = useId().replace(/:/g, '');
  const src = SRC[variant];
  const base = onLight && src.baseOnLight ? src.baseOnLight : src.base;
  const intro = variant === 'intro';

  return (
    <span
      role="img"
      aria-label="Matrics"
      className={`mlogo mlogo-${variant} ${onLight ? 'mlogo-on-light' : ''} ${className}`}
    >
      <img src={base} alt="" width={src.w} height={src.h} draggable={false} className="mlogo-base" />

      {intro && (
        <>
          {/* Letters fill with orange from left to right, led by a bright edge */}
          <span aria-hidden="true" className="mlogo-layer mlogo-mask mlogo-fill" style={maskStyle(LETTERS)} />
          <span aria-hidden="true" className="mlogo-layer mlogo-mask mlogo-edge" style={maskStyle(LETTERS)} />
        </>
      )}

      {/* Sheen that sweeps across the logo */}
      <span aria-hidden="true" className="mlogo-layer mlogo-mask mlogo-glint" style={maskStyle(base)} />

      <svg aria-hidden="true" className="mlogo-layer mlogo-fx" viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} preserveAspectRatio="none">
        <defs>
          <radialGradient id={`dot-${id}`}>
            <stop offset="0" style={{ stopColor: 'var(--mlogo-core)' }} />
            <stop offset="0.45" style={{ stopColor: 'var(--mlogo-glow)', stopOpacity: 0.85 }} />
            <stop offset="1" style={{ stopColor: 'var(--mlogo-glow)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Each streak is drawn three times: two wide faint halos and a bright core */}
        {(['halo2', 'halo1', 'core'] as const).map((layer) => (
          <g key={layer} className={`mlogo-streak-${layer}`}>
            <path d={ARC_PATH} pathLength={1} className="mlogo-run mlogo-run-arc" style={at(0)} />
            {GRID_LINES.map((l, i) => (
              <path
                key={i}
                d={`M${l.x1} ${l.y1} L${l.x2} ${l.y2}`}
                pathLength={1}
                className="mlogo-run mlogo-run-line"
                style={at(l.at)}
              />
            ))}
          </g>
        ))}

        {GRID_NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={intro ? 38 : 60} fill={`url(#dot-${id})`} className="mlogo-node" style={at(n.at)} />
        ))}
        <circle cx={I_DOT.x} cy={I_DOT.y} r={I_DOT.r} strokeWidth={intro ? 5 : 14} className="mlogo-ring" style={at(I_DOT.at)} />

        {intro && (
          <g className="mlogo-particles">
            {SPARKS.map((s, i) => (
              <circle
                key={`s${i}`}
                cx={s.x}
                cy={s.y}
                r={s.r}
                className="mlogo-spark"
                style={{ ...at(s.at), '--dx': s.dx, '--dy': s.dy } as React.CSSProperties}
              />
            ))}
            {EMBERS.map((e, i) => (
              <circle
                key={`e${i}`}
                cx={e.x}
                cy={e.y}
                r={e.r}
                className="mlogo-ember"
                style={{ ...at(e.at), '--dx': e.dx, '--dy': e.dy } as React.CSSProperties}
              />
            ))}
          </g>
        )}
      </svg>
    </span>
  );
};

export default MatricsLogo;
