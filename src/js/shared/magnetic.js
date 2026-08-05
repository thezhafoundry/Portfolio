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

/* Primary CTAs & interactive pills drift toward the cursor and snap back with an elastic spring on leave. */
export function initMagnetic(root = document) {
  if (prefersReducedMotion()) return;
  if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  const targets = root.querySelectorAll('.btn, .cta, #pip-trigger, .sim-sector-btn, .pill, .site-nav > a');

  targets.forEach((btn) => {
    btn.addEventListener('pointermove', (event) => {
      const rect = btn.getBoundingClientRect();
      const pull = magneticPull(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
        { radius: 100, strength: 0.38 }
      );
      btn.style.transition = 'transform 0.08s ease-out';
      btn.style.transform = pull.active ? `translate3d(${pull.x}px, ${pull.y}px, 0)` : '';
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

