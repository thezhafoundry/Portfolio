import { describe, expect, it } from 'vitest';
import { resolveScheduleMode } from '../src/js/scheduler.js';

describe('Schedule mode resolver', () => {
  it('returns calendar when a valid Cal link is provided', () => {
    expect(resolveScheduleMode('sampath-kumar/30min')).toBe('calendar');
    expect(resolveScheduleMode('  sampath-kumar/30min  ')).toBe('calendar');
  });

  it('returns fallback when Cal link is missing or empty', () => {
    expect(resolveScheduleMode('')).toBe('fallback');
    expect(resolveScheduleMode('   ')).toBe('fallback');
    expect(resolveScheduleMode(undefined)).toBe('fallback');
    expect(resolveScheduleMode(null)).toBe('fallback');
  });
});
