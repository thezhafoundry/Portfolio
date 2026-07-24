import { prefersReducedMotion } from './motion.js';

/* Pure helper: map a pointer position within the hero to a photo tilt + parallax offset.
   px/py are normalized to roughly -0.5..0.5 (0,0 = centre). */
export function heroTransform(px, py, { tilt = 9, shift = 22 } = {}) {
  const clamp = (n) => Math.max(-0.5, Math.min(0.5, n));
  const x = clamp(px);
  const y = clamp(py);
  return {
    rotateY: +(x * tilt).toFixed(2),
    rotateX: +(-y * tilt).toFixed(2),
    shiftX: +(x * shift).toFixed(1),
    shiftY: +(y * shift).toFixed(1),
  };
}

/* Pure helper: AVTR-style bionic flap ripple. Given the pointer position across the hero
   (px normalized 0..1) and the flap count, each flap opens by a Gaussian falloff of its
   distance to the pointer — flaps near the cursor swing wide, neighbours less, the rest
   stay flat. Returns one hinge angle (deg) per flap. */
export function flapAngles(px, count, { max = 80, sigma = 0.12 } = {}) {
  const p = Math.max(0, Math.min(1, px));
  const angles = [];
  for (let i = 0; i < count; i += 1) {
    const centre = (i + 0.5) / count;
    const d = centre - p;
    angles.push(+(max * Math.exp(-(d * d) / (2 * sigma * sigma))).toFixed(2));
  }
  return angles;
}

const FLAP_WIDTH = 42; // matches the static grid's 42px column rhythm

function buildFlaps(hero) {
  const field = document.createElement('div');
  field.className = 'hero-flaps';
  field.setAttribute('aria-hidden', 'true');
  const count = Math.max(8, Math.round(hero.clientWidth / FLAP_WIDTH));
  for (let i = 0; i < count; i += 1) field.appendChild(document.createElement('i'));
  hero.prepend(field);
  hero.classList.add('has-flaps');
  return field;
}

/* "Flap like the AVTR": a field of vertical flaps, each hinged on its grid line; a ripple
   of open flaps follows the cursor, while the photo tilts and the orchid block drifts.
   Desktop pointers only; disabled for reduced motion. */
export function initHeroMotion(root = document) {
  const hero = root.querySelector('.home-hero');
  if (!hero || prefersReducedMotion()) return;
  if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  const frame = hero.querySelector('.home-hero__photo-frame');
  let field = buildFlaps(hero);
  let flaps = [...field.children];
  let raf = 0;
  let resizeTimer = 0;

  const onMove = (event) => {
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (event.clientX - rect.left) / rect.width; // 0..1 for the flap ripple
    const px = nx - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const t = heroTransform(px, py);
      hero.style.setProperty('--par-x', `${t.shiftX}px`);
      hero.style.setProperty('--par-y', `${t.shiftY}px`);
      if (frame) frame.style.transform = `perspective(1100px) rotateY(${t.rotateY}deg) rotateX(${t.rotateX}deg)`;
      const angles = flapAngles(nx, flaps.length);
      flaps.forEach((flap, i) => {
        flap.style.transform = `rotateY(${angles[i]}deg)`;
      });
    });
  };

  const reset = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    hero.style.setProperty('--par-x', '0px');
    hero.style.setProperty('--par-y', '0px');
    if (frame) frame.style.transform = 'perspective(1100px)';
    flaps.forEach((flap) => {
      flap.style.transform = 'rotateY(0deg)';
    });
  };

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      field.remove();
      field = buildFlaps(hero);
      flaps = [...field.children];
    }, 200);
  };

  hero.addEventListener('pointermove', onMove);
  hero.addEventListener('pointerleave', reset);
  window.addEventListener('resize', onResize);
}
