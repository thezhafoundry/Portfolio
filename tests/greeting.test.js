import { describe, it, expect } from 'vitest';
import { GREETINGS, nextGreeting } from '../src/js/greeting.js';

describe('nextGreeting', () => {
  it('advances through the list', () => {
    expect(nextGreeting(0, 12)).toBe(1);
    expect(nextGreeting(5, 12)).toBe(6);
  });

  it('wraps at the end so the cycle never runs off the list', () => {
    expect(nextGreeting(11, 12)).toBe(0);
  });
});

describe('GREETINGS', () => {
  it('backs the "12 markets" claim with twelve entries', () => {
    expect(GREETINGS).toHaveLength(12);
  });

  it('names a market for every greeting', () => {
    GREETINGS.forEach(({ word, market }) => {
      expect(word.trim().length).toBeGreaterThan(0);
      expect(market.trim().length).toBeGreaterThan(0);
    });
  });

  it('opens on Vanakkam — Sampath is based in Coimbatore', () => {
    expect(GREETINGS[0]).toEqual({ word: 'Vanakkam.', market: 'India' });
  });

  it('covers the markets the profile actually claims', () => {
    const markets = GREETINGS.map((g) => g.market).join(' ');

    for (const market of ['India', 'US & UK', 'Australia', 'New Zealand', 'Singapore', 'Malaysia', 'UAE & Kuwait']) {
      expect(markets).toContain(market);
    }
  });

  it('stays in Latin script so every greeting sets in the display serif', () => {
    // Non-Latin scripts would fall back to a system font mid-headline.
    GREETINGS.forEach(({ word }) => {
      expect(word).toMatch(/^[\p{Script=Latin}\p{M}\s'.]+$/u);
    });
  });
});
