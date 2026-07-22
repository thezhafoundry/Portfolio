import { describe, it, expect } from 'vitest';
import { easeOutCubic, countUpValue, buildGraphPath } from '../src/js/graph.js';

describe('countUpValue', () => {
  it('returns endpoints at progress 0 and 1', () => {
    expect(countUpValue(0, 8331, 0)).toBe(0);
    expect(countUpValue(0, 8331, 1)).toBe(8331);
  });
  it('is monotonic for the real follower count', () => {
    let prev = -1;
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const v = countUpValue(0, 8331, Math.min(p, 1));
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe('easeOutCubic', () => {
  it('maps 0→0 and 1→1 and decelerates', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe('buildGraphPath', () => {
  const pts = [{ t: 2020, v: 0 }, { t: 2023, v: 4000 }, { t: 2026, v: 8331 }];
  it('starts with M at the left pad and ends at the right pad', () => {
    const d = buildGraphPath(pts, 400, 160, 8);
    expect(d.startsWith('M8')).toBe(true);
    const last = d.split(' L').at(-1);
    expect(Number(last.split(' ')[0])).toBeCloseTo(392, 0);
  });
  it('puts the max value at the top pad', () => {
    const d = buildGraphPath(pts, 400, 160, 8);
    const lastY = Number(d.split(' L').at(-1).split(' ')[1]);
    expect(lastY).toBeCloseTo(8, 0);
  });
  it('throws on fewer than 2 points', () => {
    expect(() => buildGraphPath([{ t: 1, v: 1 }], 400, 160)).toThrow();
  });
});
