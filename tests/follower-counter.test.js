import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { springStep, isSettled } from '../src/js/shared/motion.js';

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

/* The counter drives a spring from 0 -> 1 and maps that progress onto the real
   number, so the spring stays well-conditioned regardless of how large the
   target is. These tests pin the properties that make it read as a count-up
   rather than a bounce. */
const COUNTER_SPRING = { stiffness: 600, damping: 52, mass: 1 };

const runSpring = (params) => {
  let state = { value: 0, velocity: 0, target: 1 };
  const samples = [];
  for (let i = 0; i < 600 && !isSettled(state, 0.01); i += 1) {
    state = springStep(state, 1 / 60, params);
    samples.push(state.value);
  }
  return samples;
};

describe('Follower counter spring', () => {
  it('never overshoots the target, so the count never displays more than the real number', () => {
    const samples = runSpring(COUNTER_SPRING);

    expect(samples.length).toBeGreaterThan(0);
    expect(Math.max(...samples)).toBeLessThanOrEqual(1);
  });

  it('rises monotonically rather than bouncing back down', () => {
    const samples = runSpring(COUNTER_SPRING);

    samples.slice(1).forEach((value, i) => {
      expect(value).toBeGreaterThanOrEqual(samples[i]);
    });
  });

  it('settles inside the spec §13 entrance band rather than reading as a long counter', () => {
    let state = { value: 0, velocity: 0, target: 1 };
    let frames = 0;
    while (!isSettled(state, 0.01) && frames < 600) {
      state = springStep(state, 1 / 60, COUNTER_SPRING);
      frames += 1;
    }
    const ms = (frames / 60) * 1000;

    // Editorial Orchid §13 warns off "long counter animations"; hero entrances
    // are 350-550ms, so that is the closest sanctioned band for this motion.
    expect(ms).toBeGreaterThan(300);
    expect(ms).toBeLessThan(600);
  });

  it('would overshoot with the underdamped default, which is why damping is raised', () => {
    const samples = runSpring({ stiffness: 170, damping: 14, mass: 1 });

    // Guards the reason for the custom config: the default bounces past target.
    expect(Math.max(...samples)).toBeGreaterThan(1);
  });
});

describe('Follower counter wiring', () => {
  it('drives the count with animateSpring instead of a hand-rolled rAF loop', async () => {
    const js = await readProjectFile('src/js/results/graph.js');

    expect(js).toMatch(/import\s*\{[^}]*animateSpring[^}]*\}\s*from\s*'\.\.\/shared\/motion\.js'/);
    expect(js).toMatch(/animateSpring\(/);
  });

  it('clamps the rendered value so rounding cannot exceed the real number', async () => {
    const js = await readProjectFile('src/js/results/graph.js');

    expect(js).toMatch(/Math\.min/);
  });

  it('is mounted on the results page, not the homepage', async () => {
    const results = await readProjectFile('results/index.html');
    const home = await readProjectFile('index.html');

    expect(results).toMatch(/data-target="8331"/);
    // The homepage contract (site-contract.test.js) still forbids counters.
    expect(home).not.toMatch(/data-target/);
  });

  it('renders the real verified follower number', async () => {
    const html = await readProjectFile('results/index.html');

    expect(html).toMatch(/data-target="8331"/);
    expect(html).toMatch(/8,331/);
  });

  it('sets tabular figures so the digits do not jitter while counting', async () => {
    const css = await readProjectFile('src/styles/results.css');

    expect(css).toMatch(/font-variant-numeric:\s*tabular-nums/);
  });

  it('is initialised by the results page entry script', async () => {
    const js = await readProjectFile('src/js/results/results.js');

    expect(js).toMatch(/renderFollowerCard/);
  });
});
