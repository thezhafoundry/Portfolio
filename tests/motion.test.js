import { describe, it, expect } from 'vitest';
import { springStep, isSettled } from '../src/js/motion.js';

const run = (params, steps = 600) => {
  let s = { value: 0, velocity: 0, target: 100 };
  const trace = [];
  for (let i = 0; i < steps; i++) { s = springStep(s, 1 / 60, params); trace.push(s.value); }
  return { s, trace };
};

describe('springStep', () => {
  it('converges to the target', () => {
    const { s } = run({ stiffness: 170, damping: 26 });
    expect(s.value).toBeCloseTo(100, 1);
    expect(isSettled(s, 0.01)).toBe(true);
  });

  it('overshoots the target when underdamped (the brand spring)', () => {
    const { trace } = run({ stiffness: 170, damping: 10 });
    expect(Math.max(...trace)).toBeGreaterThan(100.5);
  });

  it('is pure — does not mutate the input state', () => {
    const input = { value: 0, velocity: 0, target: 100 };
    springStep(input, 1 / 60);
    expect(input).toEqual({ value: 0, velocity: 0, target: 100 });
  });

  it('stays put when already at rest on target', () => {
    const s = springStep({ value: 100, velocity: 0, target: 100 }, 1 / 60);
    expect(s.value).toBeCloseTo(100, 5);
    expect(s.velocity).toBeCloseTo(0, 5);
  });
});
