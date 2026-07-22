/* Spring physics core — pure and testable (spec §4). */
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
