import { prefersReducedMotion } from './motion.js';

/* Spring .reveal elements in when they enter the viewport. */
export function initReveals(root = document) {
  const els = [...root.querySelectorAll('.reveal')];
  if (prefersReducedMotion()) { els.forEach(el => el.classList.add('on')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('on'), (i % 3) * 120); // gentle stagger
      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  els.forEach(el => io.observe(el));
}
