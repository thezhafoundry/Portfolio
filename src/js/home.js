import { typeHeading, animateSpring, prefersReducedMotion } from './motion.js';
import { initReveals } from './bubbles.js';
import { initNav } from './nav.js';
import { renderFollowerCard, easeOutCubic } from './graph.js';

initNav();
initReveals();
typeHeading(document.querySelector('[data-type]'));
renderFollowerCard(document.getElementById('follower-card'));

/* Stat row count-up (v5 move 6). Markup already holds the real final values,
   so no-JS and reduced-motion readers see the truth untouched. */
function initStatCounts(root = document) {
  const els = [...root.querySelectorAll('[data-count-to]')];
  if (!els.length || prefersReducedMotion()) return;
  const DURATION = 1400;
  const run = (el) => {
    const to = Number(el.dataset.countTo);
    const decimals = Number(el.dataset.decimals ?? 0);
    const prefix = el.dataset.prefix ?? '';
    let start;
    const tick = (now) => {
      start ??= now;
      const p = Math.min((now - start) / DURATION, 1);
      el.textContent = prefix + (to * easeOutCubic(p)).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      run(entry.target);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}
initStatCounts();

/* Hero entrance (spec §4): portrait bubble springs in, photo rises a beat later. */
const shape = document.querySelector('.hero-shape');
const photo = document.querySelector('.hero-silhouette');
if (shape && photo && !prefersReducedMotion()) {
  shape.style.transform = 'scale(0.6)';
  shape.style.transformOrigin = 'top right';
  photo.style.transform = 'translateY(30%)';
  photo.style.opacity = '0';
  animateSpring({
    from: 0.6, to: 1, params: { stiffness: 170, damping: 12 },
    onFrame: v => { shape.style.transform = `scale(${v})`; },
  });
  setTimeout(() => {
    photo.style.opacity = '1';
    animateSpring({
      from: 30, to: 0, params: { stiffness: 150, damping: 16 },
      onFrame: v => { photo.style.transform = `translateY(${v}%)`; },
    });
  }, 260);
}
