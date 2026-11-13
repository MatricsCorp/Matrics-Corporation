// Normalised pointer position (-1..1) shared with the 3D scene.
//
// Kept outside React state on purpose: the scene reads it every frame inside
// useFrame, so mouse and touch moves no longer re-render the whole page.

export const pointer = { x: 0, y: 0 };

let listening = false;

export function trackPointer(): void {
  if (listening || typeof window === 'undefined') return;
  listening = true;

  const set = (clientX: number, clientY: number) => {
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  };

  window.addEventListener('mousemove', (e) => set(e.clientX, e.clientY), { passive: true });
  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches[0]) set(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true },
  );
}
