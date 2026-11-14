
import React, { Suspense, useState, useEffect, useCallback, lazy } from 'react';
import UI from './components/UI';
import SceneBoundary from './components/SceneBoundary';
import IntroReveal, { shouldShowIntro } from './components/IntroReveal';
import { trackPointer } from './lib/pointer';

// The 3D globe (three.js, ~1 MB of code) loads in its own file after the page
// text is already on screen, instead of holding back the whole site.
const Scene = lazy(() => import('./components/Scene'));

export type AppTheme = 'orange' | 'light' | 'dark';
export type AppView = 'landing' | 'ecosystem' | 'network' | 'partners' | 'investors' | 'app';

const getInitialView = (): AppView => {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  
  if (path.includes('partners') || path.includes('tarang-solar') || hash.includes('partners') || hash.includes('tarang-solar')) {
    return 'partners';
  }
  if (path.includes('ecosystem') || hash.includes('ecosystem')) {
    return 'ecosystem';
  }
  if (path.includes('network') || path.includes('quantum') || hash.includes('network') || hash.includes('quantum')) {
    return 'network';
  }
  if (path.includes('investors') || hash.includes('investors')) {
    return 'investors';
  }
  if (path === '/app' || path.startsWith('/app/') || hash === '#app') {
    return 'app';
  }
  return 'landing';
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [theme, setTheme] = useState<AppTheme>('orange');
  // First-visit logo reveal (see components/IntroReveal.tsx).
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const endIntro = useCallback(() => setShowIntro(false), []);
  useEffect(() => {
    if (!showIntro) document.documentElement.classList.remove('intro-pending', 'intro-hold');
  }, [showIntro]);

  // Sync route with browser history
  const handleViewChange = (newView: AppView) => {
    setCurrentView(newView);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (newView === 'partners') targetPath = '/partners/tarang-solar';
      else if (newView === 'ecosystem') targetPath = '/ecosystem';
      else if (newView === 'network') targetPath = '/network';
      else if (newView === 'investors') targetPath = '/investors';
      else if (newView === 'app') targetPath = '/app';

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view: newView }, '', targetPath);
      }
      // A new page opens at its top, not at the scroll position of the last one.
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Mouse / touch position for the globe tilt (read by the scene each frame,
  // so moving the pointer doesn't re-render the page).
  useEffect(() => {
    trackPointer();
  }, []);

  const getBackgroundStyle = () => {
    switch (theme) {
      case 'orange':
        return {
          background: 'radial-gradient(circle at 48% 44%, #ffa63d 0%, #f6720e 32%, #e05303 68%, #b83a00 100%)',
        };
      case 'light':
        return {
          background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f3f4f6 60%, #e2e8f0 100%)',
        };
      case 'dark':
        return {
          background: 'radial-gradient(circle at 50% 50%, #170d04 0%, #0a0500 70%, #030200 100%)',
        };
    }
  };

  return (
    <div 
      style={getBackgroundStyle()}
      className={`relative w-screen min-h-screen ${
        theme === 'light' 
          ? 'text-slate-900 selection:bg-[#db5319]/25' 
          : 'text-white selection:bg-white/30'
      } overflow-clip transition-all duration-700`}
    >
      {/* Fixed 3D Canvas with alpha transparency so the studio radial backdrop shines through */}
      {/* intro-content: waits during the first-visit intro, so the intro plays on a clean stage */}
      <div className="intro-content fixed inset-0 z-0 pointer-events-none">
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene currentView={currentView} theme={theme} />
          </Suspense>
        </SceneBoundary>
      </div>

      {/* UI Layer */}
      <UI 
        view={currentView}
        setView={handleViewChange}
        theme={theme}
        setTheme={setTheme}
      />

      {showIntro && <IntroReveal onDone={endIntro} />}
    </div>
  );
};

export default App;
