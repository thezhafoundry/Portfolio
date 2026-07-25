import { prefersReducedMotion } from './motion.js';

/* Pure helper: pointer position expressed relative to an element's box, in px.
   Kept separate from the DOM wiring so the math stays unit-testable. */
export function glowOffset(pointer, rect) {
  return {
    x: Math.round(pointer.x - rect.left),
    y: Math.round(pointer.y - rect.top),
  };
}

/* Elements marked [data-glow] carry a soft orchid wash that follows the cursor.
   Desktop pointers only — there is no hover state to reveal it on touch — and
   silenced entirely under reduced motion. */
export function initPointerGlow(root = document) {
  if (prefersReducedMotion()) return;
  if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  root.querySelectorAll('[data-glow]').forEach((el) => {
    let frame = 0;
    el.addEventListener('pointermove', (event) => {
      if (frame) return;
      const pointer = { x: event.clientX, y: event.clientY };
      frame = requestAnimationFrame(() => {
        frame = 0;
        const { x, y } = glowOffset(pointer, el.getBoundingClientRect());
        el.style.setProperty('--glow-x', `${x}px`);
        el.style.setProperty('--glow-y', `${y}px`);
      });
    });
  });
}
