import { prefersReducedMotion } from './motion.js';

/* Reveal elements when they enter the viewport: single .reveal blocks, .reveal-group
   containers (children stagger via CSS delays), and the site footer (which triggers
   the signature underline draw). */
export function initReveals(root = document) {
  const els = [...root.querySelectorAll('.reveal, .reveal-group, .site-footer')];
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('on'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('on'), (i % 3) * 120); // gentle stagger
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
}
