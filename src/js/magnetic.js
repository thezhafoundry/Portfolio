import { prefersReducedMotion } from './motion.js';

/* Pure helper: how far a magnetic button drifts toward the pointer.
   dx/dy are the pointer's offset from the button centre in px. Inside `radius`
   the pull grows as the pointer nears the centre; outside it there is none. */
export function magneticPull(dx, dy, { radius = 90, strength = 0.32 } = {}) {
  const distance = Math.hypot(dx, dy);
  if (distance >= radius) return { x: 0, y: 0, active: false };
  const force = (1 - distance / radius) * strength;
  return { x: +(dx * force).toFixed(1), y: +(dy * force).toFixed(1), active: true };
}

/* Primary CTAs drift a few px toward the cursor and ease back on leave.
   Desktop pointers only; disabled for reduced motion. */
export function initMagnetic(root = document) {
  if (prefersReducedMotion()) return;
  if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  root.querySelectorAll('.btn--primary').forEach((btn) => {
    btn.addEventListener('pointermove', (event) => {
      const rect = btn.getBoundingClientRect();
      const pull = magneticPull(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );
      btn.style.transform = pull.active ? `translate(${pull.x}px, ${pull.y}px)` : '';
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
}
