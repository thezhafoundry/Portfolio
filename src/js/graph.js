import { prefersReducedMotion, animateSpring } from './motion.js';

/* Overdamped on purpose. The default spring (damping 14) is underdamped and
   overshoots, which would flash a follower count higher than the real number
   before settling back. Damping 28 is just past critical for stiffness 170, so
   the value rises monotonically and stops. */
const COUNTER_SPRING = Object.freeze({ stiffness: 170, damping: 28, mass: 1 });

export function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

export function countUpValue(from, to, progress) {
  return Math.round(from + (to - from) * easeOutCubic(progress));
}

export function buildGraphPath(points, width, height, pad = 8) {
  if (!points || points.length < 2) throw new Error('buildGraphPath needs >= 2 points');
  const ts = points.map(p => p.t);
  const vs = points.map(p => p.v);
  const minT = Math.min(...ts), maxT = Math.max(...ts);
  const maxV = Math.max(...vs);
  const sx = t => pad + ((t - minT) / (maxT - minT)) * (width - 2 * pad);
  const sy = v => (height - pad) - (v / maxV) * (height - 2 * pad);
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.t).toFixed(1)} ${sy(p.v).toFixed(1)}`)
    .join(' ');
}

/* DOM renderer. Honest by construction (spec §8.3):
   - data-points present  -> draw the real curve, bubble riding the tip
   - data-points absent   -> count up the single real number, no curve   */
export function renderFollowerCard(el) {
  const target = Number(el.dataset.target); // 8331 — real number
  const numberEl = el.querySelector('[data-count]');
  const raw = el.dataset.points;

  const finish = () => { numberEl.textContent = target.toLocaleString('en-IN'); };
  if (prefersReducedMotion()) { finish(); drawStatic(); return; }

  /* The spring runs 0 -> 1 and that progress is mapped onto the number, rather
     than springing the raw value. Spring force scales with displacement, so
     targeting 8331 directly would be violently stiff; normalised progress keeps
     the physics identical no matter how large the real number is.

     Interpolate linearly here: the spring IS the easing curve. Routing this
     through countUpValue() would apply easeOutCubic on top of the spring and
     flatten the physics it exists to produce. */
  const renderProgress = (p) => {
    const clamped = Math.min(Math.max(p, 0), 1);
    numberEl.textContent = Math.round(target * clamped).toLocaleString('en-IN');
    if (raw) advanceLine(clamped);
  };

  let path, tip, totalLen;
  function drawStatic() {
    if (!raw) return;
    setupLine();
    path.style.strokeDashoffset = '0';
    const end = path.getPointAtLength(totalLen);
    tip.setAttribute('transform', `translate(${end.x} ${end.y})`);
  }
  function setupLine() {
    const points = JSON.parse(raw);
    const svg = el.querySelector('svg');
    const w = svg.viewBox.baseVal.width, h = svg.viewBox.baseVal.height;
    path = svg.querySelector('[data-line]');
    tip = svg.querySelector('[data-tip]');
    path.setAttribute('d', buildGraphPath(points, w, h));
    totalLen = path.getTotalLength();
    path.style.strokeDasharray = String(totalLen);
    path.style.strokeDashoffset = String(totalLen);
  }
  function advanceLine(p) {
    if (!path) setupLine();
    const eased = easeOutCubic(p);
    path.style.strokeDashoffset = String(totalLen * (1 - eased));
    const pt = path.getPointAtLength(totalLen * eased);
    tip.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  }

  /* The markup ships the real number as literal text so it is correct with JS
     disabled. Once we know we will animate, zero it immediately — otherwise the
     final value sits on screen and visibly resets when the card scrolls in. */
  renderProgress(0);

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    animateSpring({
      from: 0,
      to: 1,
      params: COUNTER_SPRING,
      onFrame: renderProgress,
      onDone: finish,
    });
  }, { threshold: 0.4 });
  io.observe(el);
}
