import React, { useCallback, useEffect, useState } from 'react';
import MatricsLogo from './MatricsLogo';
import './intro-reveal.css';

// Shown once per browser. Add ?intro to the address to watch it again.
const SEEN_KEY = 'matrics-intro-seen';
const HOLD_MS = 2550; // reveal plays, then the screen fades
const FADE_MS = 500;

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

const IntroReveal: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [leaving, setLeaving] = useState(false);
  const skip = useCallback(() => setLeaving(true), []);

  useEffect(() => {
    try { window.localStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode */ }
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const timer = window.setTimeout(skip, HOLD_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      root.style.overflow = previous;
    };
  }, [skip]);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onDone, FADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, onDone]);

  return (
    <div className={`intro ${leaving ? 'intro-leaving' : ''}`} onClick={skip}>
      <div className="intro-glow" aria-hidden="true" />
      <MatricsLogo variant="intro" className="intro-logo" />
      <button
        type="button"
        className="intro-skip"
        onClick={(e) => { e.stopPropagation(); skip(); }}
      >
        Skip
      </button>
    </div>
  );
};

export default IntroReveal;
