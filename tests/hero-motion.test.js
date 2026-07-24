import { describe, expect, it } from 'vitest';
import { heroTransform, flapAngles } from '../src/js/heroMotion.js';

describe('heroTransform', () => {
  it('returns no tilt or shift at the centre', () => {
    expect(heroTransform(0, 0)).toEqual({ rotateY: 0, rotateX: 0, shiftX: 0, shiftY: 0 });
  });

  it('tilts toward the pointer and inverts rotateX against vertical movement', () => {
    const t = heroTransform(0.5, 0.5);
    expect(t.rotateY).toBeCloseTo(4.5, 5); // 0.5 * 9
    expect(t.rotateX).toBeCloseTo(-4.5, 5); // -0.5 * 9
    expect(t.shiftX).toBeCloseTo(11, 5); // 0.5 * 22
    expect(t.shiftY).toBeCloseTo(11, 5);
  });

  it('clamps out-of-range pointer values to the ±0.5 envelope', () => {
    expect(heroTransform(5, -5)).toEqual(heroTransform(0.5, -0.5));
  });

  it('honours custom tilt and shift magnitudes', () => {
    const t = heroTransform(0.5, 0, { tilt: 10, shift: 40 });
    expect(t.rotateY).toBeCloseTo(5, 5);
    expect(t.shiftX).toBeCloseTo(20, 5);
  });
});

describe('flapAngles (bionic flap ripple)', () => {
  it('opens the flap under the pointer the widest', () => {
    const angles = flapAngles(0.5, 21);
    const maxIndex = angles.indexOf(Math.max(...angles));
    expect(maxIndex).toBe(10); // middle flap for a centred pointer
    expect(angles[maxIndex]).toBeGreaterThan(75); // near the 80deg max
  });

  it('falls off with distance so far flaps stay flat', () => {
    const angles = flapAngles(0.5, 21);
    expect(angles[10]).toBeGreaterThan(angles[13]);
    expect(angles[13]).toBeGreaterThan(angles[16]);
    expect(angles[0]).toBeLessThan(0.5); // far edge: essentially closed
    expect(angles[20]).toBeLessThan(0.5);
  });

  it('moves the ripple crest with the pointer', () => {
    const left = flapAngles(0.1, 20);
    const right = flapAngles(0.9, 20);
    expect(left.indexOf(Math.max(...left))).toBeLessThan(4);
    expect(right.indexOf(Math.max(...right))).toBeGreaterThan(15);
  });

  it('clamps the pointer into 0..1 and returns one angle per flap', () => {
    expect(flapAngles(7, 12)).toEqual(flapAngles(1, 12));
    expect(flapAngles(-3, 12)).toEqual(flapAngles(0, 12));
    expect(flapAngles(0.5, 12)).toHaveLength(12);
  });

  it('honours custom max and falloff width', () => {
    const angles = flapAngles(0.5, 11, { max: 90, sigma: 0.05 });
    expect(Math.max(...angles)).toBeGreaterThan(80);
    expect(angles[0]).toBeLessThan(0.01); // tighter sigma → sharper ripple
  });
});
