import { typeHeading, animateSpring, prefersReducedMotion } from './motion.js';
import { initReveals } from './bubbles.js';
import { initNav } from './nav.js';
import { renderFollowerCard } from './graph.js';

initNav();
initReveals();
typeHeading(document.querySelector('[data-type]'));
renderFollowerCard(document.getElementById('follower-card'));

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
