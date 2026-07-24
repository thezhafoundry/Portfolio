import { initNav } from './nav.js';
import { prefersReducedMotion } from './motion.js';
import { initReveals } from './bubbles.js';
import { initMagnetic } from './magnetic.js';

initNav();
initReveals();
initMagnetic();

const chapters = [...document.querySelectorAll('.story-chapter')];
const panel = document.querySelector('.chapter-panel');
const stripButtons = [...document.querySelectorAll('.story-strip [data-chapter]')];

if (chapters.length && panel) {
  const pts = [[20, 170], [52, 156], [84, 141], [116, 124], [148, 112], [180, 100], [212, 80], [244, 55], [280, 30]];
  const idxEl = panel.querySelector('.cp-idx');
  const yearsEl = panel.querySelector('.cp-years');
  const orgEl = panel.querySelector('.cp-org');
  const node = panel.querySelector('.cp-node');
  const halo = panel.querySelector('.cp-halo');
  const total = String(chapters.length).padStart(2, '0');

  const setActive = (i) => {
    if (i < 0 || i >= chapters.length) return;
    const nn = String(i + 1).padStart(2, '0');
    chapters.forEach((c, j) => {
      c.classList.toggle('is-active', i === j);
    });
    stripButtons.forEach((btn, j) => {
      if (i === j) {
        btn.setAttribute('aria-current', 'step');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    if (idxEl) idxEl.textContent = `${nn} / ${total}`;
    if (yearsEl) yearsEl.textContent = chapters[i].dataset.years || '';
    if (orgEl) orgEl.textContent = chapters[i].dataset.org || '';
    if (node && halo && pts[i]) {
      const [x, y] = pts[i];
      node.setAttribute('cx', x);
      node.setAttribute('cy', y);
      halo.setAttribute('cx', x);
      halo.setAttribute('cy', y);
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setActive(chapters.indexOf(e.target));
        }
      });
    }, { rootMargin: '-40% 0px -45% 0px' });

    chapters.forEach((c) => io.observe(c));
  }
  setActive(0);
}

stripButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.chapter;
    const targetEl = targetId ? document.getElementById(targetId) : null;
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  });
});
