import { describe, expect, it } from 'vitest';
import { getMediaMode } from '../src/js/home/media.js';

describe('Media mode resolver', () => {
  it('returns video when a video source is provided', () => {
    expect(getMediaMode({ videoSrc: '/assets/intro.mp4', posterSrc: '/assets/hero_portrait.jpg' })).toBe('video');
    expect(getMediaMode({ videoSrc: '/assets/intro.mp4' })).toBe('video');
  });

  it('returns image when only a poster source is provided', () => {
    expect(getMediaMode({ videoSrc: '', posterSrc: '/assets/hero_portrait.jpg' })).toBe('image');
    expect(getMediaMode({ videoSrc: '   ', posterSrc: '/assets/hero_portrait.jpg' })).toBe('image');
  });

  it('returns empty when neither video nor poster source is provided', () => {
    expect(getMediaMode({})).toBe('empty');
    expect(getMediaMode({ videoSrc: '', posterSrc: '' })).toBe('empty');
    expect(getMediaMode({ videoSrc: '  ', posterSrc: '  ' })).toBe('empty');
  });
});
