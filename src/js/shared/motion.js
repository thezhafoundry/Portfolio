export const motionDurations = Object.freeze({
  control: 160,
  menuOpen: 220,
  menuClose: 180,
  accordion: 260,
  story: 320,
  hero: 480,
});

/* Spring physics core — pure and testable. */
export function springStep(state, dt, { stiffness = 170, damping = 14, mass = 1 } = {}) {
  const displacement = state.value - state.target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * state.velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const velocity = state.velocity + acceleration * dt;
  const value = state.value + velocity * dt;
  return { value, velocity, target: state.target };
}

export function isSettled(state, epsilon = 0.001) {
  return Math.abs(state.value - state.target) < epsilon && Math.abs(state.velocity) < epsilon;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* rAF driver. Returns a cancel function. */
export function animateSpring({ from, to, params, onFrame, onDone }) {
  if (prefersReducedMotion()) { onFrame(to); onDone?.(); return () => {}; }
  let state = { value: from, velocity: 0, target: to };
  let raf = 0;
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30); // clamp long frames
    last = now;
    state = springStep(state, dt, params);
    if (isSettled(state, 0.01)) { onFrame(to); onDone?.(); return; }
    onFrame(state.value);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function typeHeading(el, { unitDelay = 90 } = {}) {
  const fullText = el.textContent.replace(/\s+/g, ' ').trim();
  el.setAttribute('aria-label', fullText);
  if (prefersReducedMotion()) return;

  const units = [];
  [...el.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = 'type-unit';
        s.textContent = part;
        frag.appendChild(s);
        units.push(s);
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.classList.add('type-unit');
      units.push(node);
    }
  });

  units.forEach((u, i) => setTimeout(() => u.classList.add('on'), 350 + i * unitDelay));
}
