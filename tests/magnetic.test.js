import { describe, expect, it } from 'vitest';
import { magneticPull } from '../src/js/shared/magnetic.js';

describe('magneticPull', () => {
  it('pulls hardest at the button centre', () => {
    const centre = magneticPull(0, 0);
    expect(centre).toEqual({ x: 0, y: 0, active: true }); // no offset to pull along, but active
  });

  it('drifts toward the pointer inside the radius', () => {
    const pull = magneticPull(45, 0); // halfway out of a 90px radius
    expect(pull.active).toBe(true);
    expect(pull.x).toBeCloseTo(45 * 0.5 * 0.32, 1); // (1 - 0.5) * strength
    expect(pull.y).toBe(0);
  });

  it('is inert outside the radius', () => {
    expect(magneticPull(120, 0)).toEqual({ x: 0, y: 0, active: false });
    expect(magneticPull(64, 64)).toEqual({ x: 0, y: 0, active: false }); // hypot ≈ 90.5
  });

  it('honours custom radius and strength', () => {
    const pull = magneticPull(30, 0, { radius: 60, strength: 0.5 });
    expect(pull.x).toBeCloseTo(30 * 0.5 * 0.5, 1);
  });
});
