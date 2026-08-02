import { describe, expect, it } from 'vitest';
import { glowOffset } from '../src/js/home/glow.js';

describe('glowOffset', () => {
  it('reports the pointer relative to the element box, not the viewport', () => {
    const offset = glowOffset({ x: 340, y: 220 }, { left: 100, top: 180 });
    expect(offset).toEqual({ x: 240, y: 40 });
  });

  it('is zero at the element origin', () => {
    expect(glowOffset({ x: 100, y: 180 }, { left: 100, top: 180 })).toEqual({ x: 0, y: 0 });
  });

  it('goes negative when the pointer sits above or left of the element', () => {
    expect(glowOffset({ x: 40, y: 90 }, { left: 100, top: 180 })).toEqual({ x: -60, y: -90 });
  });

  it('rounds to whole pixels so the custom property does not churn on subpixel moves', () => {
    expect(glowOffset({ x: 120.6, y: 180.4 }, { left: 100, top: 180 })).toEqual({ x: 21, y: 0 });
  });
});
