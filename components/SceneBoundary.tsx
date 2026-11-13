import React from 'react';

// If the 3D background can't start (no WebGL, a lighting/texture file fails to
// download, an old GPU driver...), show the page without it instead of letting
// the error take the whole site down to a blank orange screen.
export default class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('3D background disabled:', error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
