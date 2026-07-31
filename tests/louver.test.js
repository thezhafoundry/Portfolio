import { describe, it, expect } from 'vitest';
import { restAngles, louverAngles, initLouver } from '../src/js/louver.js';

describe('restAngles (the shutter at rest)', () => {
  it('keeps the page shut everywhere left of the portrait zone', () => {
    const rest = restAngles(50);
    const leftHalf = rest.slice(0, 25);

    expect(leftHalf.every((a) => a === 0)).toBe(true);
  });

  it('opens the slats over the portrait so the photo always reads', () => {
    const rest = restAngles(50);
    const overPortrait = rest.slice(38, 46);

    expect(Math.max(...overPortrait)).toBeGreaterThan(30);
  });

  it('feathers the zone edge instead of cutting a hard seam', () => {
    const rest = restAngles(80);
    const open = Math.max(...rest);
    const rising = rest.filter((a) => a > 0 && a < open);

    // A hard edge would jump 0 → fully open with nothing in between.
    expect(rising.length).toBeGreaterThan(2);
  });

  it('rests the portrait zone near edge-on so the photo is not veiled', () => {
    const rest = restAngles(60);
    // A slat turned `a` degrees still covers cos(a) of its rule. Anything under
    // ~70° leaves enough face over the picture to read as a shutter.
    expect(Math.max(...rest)).toBeGreaterThan(70);
    expect(Math.cos((Math.max(...rest) * Math.PI) / 180)).toBeLessThan(0.35);
  });

  it('returns one angle per slat and never exceeds the requested angle', () => {
    const rest = restAngles(37, { angle: 44 });

    expect(rest).toHaveLength(37);
    expect(Math.max(...rest)).toBeLessThanOrEqual(44);
    expect(Math.min(...rest)).toBeGreaterThanOrEqual(0);
  });
});

describe('louverAngles (the pointer ripple)', () => {
  const rest = restAngles(40);

  it('returns the resting state when there is no pointer', () => {
    expect(louverAngles(null, rest)).toEqual(rest);
  });

  // The portrait rests near edge-on, so the widest slat overall is not the one
  // under the pointer. What the ripple actually controls is the lift above rest.
  const lift = (angles) => angles.map((a, i) => +(a - rest[i]).toFixed(2));

  it('lifts widest at the pointer and falls away either side', () => {
    const lifted = lift(louverAngles(0.5, rest));
    const peak = lifted.indexOf(Math.max(...lifted));

    expect(peak).toBeGreaterThan(15);
    expect(peak).toBeLessThan(25);
    expect(lifted[peak]).toBeGreaterThan(lifted[peak - 5]);
    expect(lifted[peak]).toBeGreaterThan(lifted[peak + 5]);
  });

  it('never shuts a slat that is already resting open', () => {
    // Pointer at the far left, away from the portrait zone.
    const angles = louverAngles(0.05, rest);

    angles.forEach((a, i) => expect(a).toBeGreaterThanOrEqual(rest[i]));
  });

  it('still opens the portrait further even when the ripple is gentler than its rest angle', () => {
    // Regression guard: easing toward a target below the portrait's rest angle
    // used to swing those slats shut as the pointer arrived — the reveal ran
    // backwards. Opening BY an amount cannot do that.
    const overPortrait = louverAngles(0.8, rest, { open: 10 });

    rest.forEach((r, i) => {
      if (r > 0) expect(overPortrait[i]).toBeGreaterThanOrEqual(r);
    });
    expect(Math.max(...overPortrait)).toBeGreaterThan(Math.max(...rest));
  });

  it('never opens a slat past the ceiling', () => {
    const angles = louverAngles(0.8, rest, { open: 200, ceiling: 78 });

    expect(Math.max(...angles)).toBeLessThanOrEqual(78);
  });

  it('keeps the swing wide — the ripple is the effect, not a hint of one', () => {
    // Calm comes from the ground being pale beneath the copy, never from the
    // slats moving less. Damping this is what flattened the effect once before.
    const overCopy = louverAngles(0.2, rest).filter((_, i) => rest[i] === 0);

    expect(Math.max(...overCopy)).toBeGreaterThan(60);
  });

  it('tracks the pointer across the field', () => {
    const peakOf = (px) => {
      const lifted = lift(louverAngles(px, rest));
      return lifted.indexOf(Math.max(...lifted));
    };

    expect(peakOf(0.15)).toBeLessThan(peakOf(0.85));
  });
});

describe('initLouver photo entrance transition', () => {
  it('applies hero-photo-animate on initial open and hero-photo-settled once session storage flag is set', () => {
    const createMockRoot = () => {
      const classes = new Set();
      const hero = {
        classList: {
          add: (c) => classes.add(c),
          remove: (c) => classes.delete(c),
          contains: (c) => classes.has(c),
        },
        querySelector: (sel) => sel === '.louver-hero__ground img' ? {} : null,
      };
      return {
        querySelector: (sel) => sel === '.louver-hero' ? hero : null,
        hero,
      };
    };

    const mockSessionStorage = new Map();
    const globalSessionStorage = globalThis.sessionStorage;
    globalThis.sessionStorage = {
      getItem: (k) => mockSessionStorage.get(k) || null,
      setItem: (k, v) => mockSessionStorage.set(k, String(v)),
      removeItem: (k) => mockSessionStorage.delete(k),
    };

    const root1 = createMockRoot();
    initLouver(root1);
    expect(root1.hero.classList.contains('hero-photo-animate')).toBe(true);

    mockSessionStorage.set('hero_photo_animated', 'true');
    const root2 = createMockRoot();
    initLouver(root2);
    expect(root2.hero.classList.contains('hero-photo-settled')).toBe(true);

    globalThis.sessionStorage = globalSessionStorage;
  });
});


