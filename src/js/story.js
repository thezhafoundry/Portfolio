import { initReveals } from './bubbles.js';
import { initNav } from './nav.js';
import { prefersReducedMotion } from './motion.js';
initNav();
initReveals();

/* Chapters scroll-spy: light the chapter in the reading band and walk the
   node along the career path in the pinned panel. */
const chapters = [...document.querySelectorAll('.chapter')];
const panel = document.querySelector('.chapter-panel');
if (chapters.length && panel) {
  // points along the panel path, one per chapter (machine shop → MBA)
  const pts = [[20, 170], [52, 156], [84, 141], [116, 124], [148, 112], [180, 100], [212, 80], [244, 55], [280, 30]];
  const idxEl = panel.querySelector('.cp-idx');
  const ghostEl = panel.querySelector('.cp-ghost');
  const yearsEl = panel.querySelector('.cp-years');
  const orgEl = panel.querySelector('.cp-org');
  const node = panel.querySelector('.cp-node');
  const halo = panel.querySelector('.cp-halo');
  const total = String(chapters.length).padStart(2, '0');

  const setActive = (i) => {
    const nn = String(i + 1).padStart(2, '0');
    chapters.forEach((c, j) => c.classList.toggle('on', i === j));
    idxEl.textContent = `${nn} / ${total}`;
    if (ghostEl) ghostEl.textContent = nn;
    yearsEl.textContent = chapters[i].dataset.years;
    orgEl.textContent = chapters[i].dataset.org;
    const [x, y] = pts[Math.min(i, pts.length - 1)];
    [node, halo].forEach((el) => { el.setAttribute('cx', x); el.setAttribute('cy', y); });
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(chapters.indexOf(e.target)); });
  }, { rootMargin: '-40% 0px -45% 0px' });
  chapters.forEach((c) => io.observe(c));
  setActive(0);
}

/* Journey strip (v6): each node jumps to its chapter. */
document.querySelectorAll('.story-strip [data-ch]').forEach((btn) => {
  btn.addEventListener('click', () => {
    chapters[Number(btn.dataset.ch)]?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    });
  });
});
