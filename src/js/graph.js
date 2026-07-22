import { prefersReducedMotion } from './motion.js';

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

  const DURATION = 1800;
  let start;
  const tickCount = (now) => {
    start ??= now;
    const p = Math.min((now - start) / DURATION, 1);
    numberEl.textContent = countUpValue(0, target, p).toLocaleString('en-IN');
    if (raw) advanceLine(p);
    if (p < 1) requestAnimationFrame(tickCount);
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

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { io.disconnect(); requestAnimationFrame(tickCount); }
  }, { threshold: 0.4 });
  io.observe(el);
}
