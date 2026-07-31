import { prefersReducedMotion } from './motion.js';

/* The louver hero.
   The hero is a white paper page with fine vertical rules. Behind it sit the
   graded violet ground and the portrait. A field of slats — each hinged on its
   own rule — opens under the pointer, so the colour and the person come through
   the page. "Every deal begins with hello": you open up, and there is someone
   behind it.

   Replaces the older flap field, which rippled the same way but revealed
   nothing behind it. */

const smoothstep = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/* Pure: the angle each slat rests at with no pointer near it. Slats over the
   portrait rest nearly edge-on, so the person reads clearly rather than through
   a veil; everywhere else the page stays shut and white. Feathered at both edges
   so the zone has no hard seam.

   The rest angle is what governs how much of the photo is covered: a slat turned
   `a` degrees still shows cos(a) of its face. At 44° that left ~72% of every rule
   sitting over the portrait — the photo read as shuttered. Near 78° it is ~21%,
   so what remains over the picture is a set of fine hinge lines. */
export function restAngles(count, { start = 0.6, end = 0.99, angle = 78, feather = 0.075 } = {}) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const centre = (i + 0.5) / count;
    const open = smoothstep((centre - start) / feather) * (1 - smoothstep((centre - end) / feather));
    out.push(+(angle * open).toFixed(2));
  }
  return out;
}

/* Pure: slat angles for a pointer at `px` (0..1). Each slat opens BY up to
   `open` degrees beyond its own rest angle, on a Gaussian falloff, capped at
   `ceiling`. Pass px = null for the resting state.

   Opening by an amount rather than easing toward a target matters: the slats
   over the portrait already rest near 78°, so a target below that would swing
   them shut as the pointer arrived — the reveal would run backwards.

   The ceiling clears the portrait's rest angle with room to spare, so passing
   the pointer over the photo still turns those slats the last of the way
   edge-on. A ceiling at or near rest would leave that half of the hero inert.

   The swing is deliberately wide. What keeps the effect calm is the ground
   being pale beneath the copy, not the slats moving less. */
export function louverAngles(px, rest, { open = 76, ceiling = 88, sigma = 0.085 } = {}) {
  const count = rest.length;
  return rest.map((r, i) => {
    if (px === null) return r;
    const d = (i + 0.5) / count - px;
    const pull = Math.exp(-(d * d) / (2 * sigma * sigma));
    return +Math.min(ceiling, r + open * pull).toFixed(2);
  });
}

const SLAT_WIDTH = 30;
const DEG = Math.PI / 180;
const SWEEP_DELAY_MS = 620;
const SWEEP_MS = 1700;

/* Shading rides on a child overlay's opacity rather than filter: brightness().
   Four dozen filtered elements repainting every frame is a real cost on weaker
   machines; opacity on a static child is not. */
function paint(slats, shades, angles) {
  angles.forEach((a, i) => {
    slats[i].style.transform = `rotateY(${a}deg)`;
    // Light falls off as a slat turns edge-on, the way a real blind shades.
    shades[i].style.opacity = (0.34 * Math.sin(a * DEG)).toFixed(3);
  });
}

function buildSlats(n) {
  return Array.from({ length: n }, () => {
    const slat = document.createElement('i');
    slat.appendChild(document.createElement('b')); // the shading overlay
    return slat;
  });
}

export function initLouver(root = document) {
  const hero = root.querySelector('.louver-hero');
  if (!hero) return;

  const photoImg = hero.querySelector('.louver-hero__ground img');
  let hasAnimatedPhoto = false;
  try {
    hasAnimatedPhoto = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hero_photo_animated');
  } catch (e) {
    // ignore storage access errors
  }

  if (photoImg) {
    if (!hasAnimatedPhoto && !prefersReducedMotion()) {
      hero.classList.add('hero-photo-animate');
      const triggerActive = () => hero.classList.add('hero-photo-active');
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(triggerActive);
          } else {
            triggerActive();
          }
        });
      } else {
        triggerActive();
      }
      setTimeout(() => {
        hero.classList.remove('hero-photo-animate', 'hero-photo-active');
        hero.classList.add('hero-photo-settled');
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('hero_photo_animated', 'true');
          }
        } catch (e) {}
      }, 2000);
    } else {
      hero.classList.add('hero-photo-settled');
    }
  }

  // No JS, no fine pointer, or reduced motion: the shutter is never built, so
  // the ground layer — portrait and ink — simply shows as designed.
  if (prefersReducedMotion()) return;
  if (typeof window === 'undefined' || !window.matchMedia) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;


  const field = document.createElement('div');
  field.className = 'louver-field';
  field.setAttribute('aria-hidden', 'true');

  let count = Math.max(12, Math.round(hero.clientWidth / SLAT_WIDTH));
  field.append(...buildSlats(count));
  hero.prepend(field);
  hero.classList.add('has-louvers');

  let slats = [...field.children];
  let shades = slats.map((slat) => slat.firstChild);
  let rest = restAngles(count);
  let raf = 0;

  paint(slats, shades, louverAngles(null, rest));

  /* The page opens itself once on load. Without this the shutter only ever
     reacts to a pointer move — and the first impression is formed before
     anyone thinks to move the mouse. */
  const sweep = () => {
    let t0 = 0;
    const step = (now) => {
      if (!t0) t0 = now;
      const t = Math.min(1, (now - t0) / SWEEP_MS);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      // The load sweep reaches a touch wider than the pointer does — it is the
      // one moment that has to announce the page opens at all.
      paint(slats, shades, louverAngles(-0.1 + eased * 1.2, rest, { open: 82, sigma: 0.11 }));
      if (t < 1) requestAnimationFrame(step);
      else paint(slats, shades, louverAngles(null, rest));
    };
    requestAnimationFrame(step);
  };
  setTimeout(sweep, SWEEP_DELAY_MS);

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    if (!rect.width) return;
    const px = (event.clientX - rect.left) / rect.width;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => paint(slats, shades, louverAngles(px, rest)));
  });

  hero.addEventListener('pointerleave', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    paint(slats, shades, louverAngles(null, rest));
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const next = Math.max(12, Math.round(hero.clientWidth / SLAT_WIDTH));
      if (next === count) return;
      count = next;
      field.replaceChildren(...buildSlats(count));
      slats = [...field.children];
      shades = slats.map((slat) => slat.firstChild);
      rest = restAngles(count);
      paint(slats, shades, louverAngles(null, rest));
    }, 200);
  });
}
