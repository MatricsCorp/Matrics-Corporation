import React, { useEffect, useRef, useState } from 'react';
import MatricsLogo from './MatricsLogo';
import './intro-reveal.css';

// First visit: the logo floats over the site, lights up, then glides into the
// header and becomes the header logo. It never blocks the page (clicks and
// scrolling go straight through). Shown once per browser; add ?intro to the
// address to watch it again.
const SEEN_KEY = 'matrics-intro-seen';
const LOGO_SRC = '/brand/matrics-grid.webp';
const FLY_AT_MS = 1900; // after the light has run through the grid
const FLY_MS = 750;
const FADE_MS = 300;
const LOAD_TIMEOUT_MS = 1800; // logo not ready by then: skip the intro

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

type Stage = 'loading' | 'float' | 'fly' | 'landed';

const IntroReveal: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [stage, setStage] = useState<Stage>('loading');
  const flyRef = useRef<HTMLDivElement>(null);
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
      .then(() => { if (active) { window.clearTimeout(giveUp); setStage('float'); } })
      .catch(() => { if (active) { window.clearTimeout(giveUp); doneRef.current(); } });
    return () => { active = false; window.clearTimeout(giveUp); };
  }, []);

  useEffect(() => {
    if (stage !== 'float') return;
    const t = window.setTimeout(() => setStage('fly'), FLY_AT_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  // Glide onto the header logo: measure both and move/scale this one onto it.
  useEffect(() => {
    if (stage !== 'fly') return;
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
      { duration: FLY_MS, easing: 'cubic-bezier(0.6, 0, 0.2, 1)', fill: 'forwards' }
    );
    anim.onfinish = () => setStage('landed');
    return () => { anim.onfinish = null; };
  }, [stage]);

  // Hand over to the header logo, then fade this one out.
  useEffect(() => {
    if (stage !== 'landed') return;
    document.documentElement.classList.remove('intro-pending');
    const t = window.setTimeout(() => doneRef.current(), FADE_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  if (stage === 'loading') return null;

  return (
    <div className={`intro-float is-${stage}`} aria-hidden="true">
      <div className="intro-shade" />
      <div ref={flyRef} className="intro-fly">
        <div className="intro-bob">
          <MatricsLogo variant="intro" className="intro-logo" />
        </div>
      </div>
    </div>
  );
};

export default IntroReveal;
