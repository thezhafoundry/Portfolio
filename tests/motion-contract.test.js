import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const stylesheets = [
  'src/styles/identity.css',
  'src/styles/components.css',
  'src/styles/home.css',
  'src/styles/story.css',
  'src/styles/results.css',
  'src/styles/schedule.css',
];

const ruleBody = (css, selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
};

describe('Motion tokens', () => {
  it('defines the shared easing and duration tokens in identity.css :root', async () => {
    const css = await readProjectFile('src/styles/identity.css');

    for (const token of ['--ease-out', '--ease-in-out', '--duration-press', '--duration-hover', '--duration-surface']) {
      expect(css).toContain(`${token}:`);
    }
  });

  it('uses a custom cubic-bezier rather than a built-in easing keyword', async () => {
    const css = await readProjectFile('src/styles/identity.css');

    expect(css).toMatch(/--ease-out:\s*cubic-bezier\(/);
  });
});

describe('Transition hygiene (spec §4: transform/opacity, bounded properties)', () => {
  it.each(stylesheets)('%s never uses unbounded `transition: all`', async (path) => {
    const css = await readProjectFile(path);

    expect(css).not.toMatch(/transition:\s*all\b/);
  });
});

describe('Button feedback', () => {
  it('gives .btn a transform transition on its base rule, not only on state rules', async () => {
    const css = await readProjectFile('src/styles/components.css');
    // The transition must live where the element rests, or :hover/:active snap.
    const base = ruleBody(css, '.btn,\n.btn--secondary,\n.btn--text,\n.btn--reversed');

    expect(base).toMatch(/transition:\s*transform/);
  });

  it('squashes on press instead of merely cancelling the hover lift', async () => {
    const css = await readProjectFile('src/styles/components.css');
    const press = ruleBody(css, '.btn:active,\n.btn--secondary:active,\n.btn--reversed:active');

    expect(press).toMatch(/transform:\s*scale\(0\.9[0-8]\)/);
  });

  it('gates hover motion behind a fine-pointer query so taps do not stick', async () => {
    const css = await readProjectFile('src/styles/components.css');

    expect(css).toMatch(/@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/);
  });
});

describe('Typing-dots wait state', () => {
  it('implements .typing-dots as the shared motif in identity.css', async () => {
    const css = await readProjectFile('src/styles/identity.css');

    expect(css).toMatch(/\.typing-dots\s*\{/);
    expect(css).toMatch(/@keyframes typing-dot/);
  });

  it('rests at the spec §3.3 opacities so reduced motion still reads as the motif', async () => {
    const css = await readProjectFile('src/styles/identity.css');

    expect(ruleBody(css, '.typing-dots span:nth-child(1)')).toMatch(/opacity:\s*1/);
    expect(ruleBody(css, '.typing-dots span:nth-child(2)')).toMatch(/opacity:\s*0\.55/);
    expect(ruleBody(css, '.typing-dots span:nth-child(3)')).toMatch(/opacity:\s*0\.25/);
  });

  it('animates opacity only — no layout-bound or transform properties', async () => {
    const css = await readProjectFile('src/styles/identity.css');
    const frames = css.match(/@keyframes typing-dot\s*\{[\s\S]*?\n\}/)?.[0] ?? '';

    expect(frames).toMatch(/opacity/);
    expect(frames).not.toMatch(/width|height|margin|padding|top|left|transform/);
  });

  it('uses the typing bubble as the schedule page wait state, with an accessible label', async () => {
    const html = await readProjectFile('schedule/index.html');

    expect(html).toMatch(/class="typing-dots"/);
    expect(html).toMatch(/aria-hidden="true"/);
    expect(html).toContain('Loading booking calendar');
  });

  it('clears the wait state once the calendar reports ready', async () => {
    const js = await readProjectFile('src/js/scheduler.js');

    expect(js).toMatch(/\.cal-loading'\)\?\.remove\(\)/);
  });
});

describe('Origin-aware bubble entrances', () => {
  it('enters .bubble--me from the right and .bubble--reply from the left', async () => {
    const css = await readProjectFile('src/styles/components.css');

    expect(css).toMatch(/\.bubble--me[\s\S]{0,200}?transform:\s*translateX\(1\.5rem\)/);
    expect(css).toMatch(/\.bubble--reply[\s\S]{0,200}?transform:\s*translateX\(-1\.5rem\)/);
  });

  it('anchors each bubble transform-origin to the side its tail points to', async () => {
    const css = await readProjectFile('src/styles/components.css');

    expect(css).toMatch(/\.bubble--me[\s\S]{0,200}?transform-origin:\s*bottom right/);
    expect(css).toMatch(/\.bubble--reply[\s\S]{0,200}?transform-origin:\s*bottom left/);
  });

  it('staggers grouped reveals within the 30-80ms band', async () => {
    const css = await readProjectFile('src/styles/components.css');
    const delays = [...css.matchAll(/\.reveal-group\.on > \*:nth-child\(\d+\)\s*\{\s*transition-delay:\s*([\d.]+)s/g)]
      .map((m) => Number(m[1]));

    expect(delays.length).toBeGreaterThan(1);
    const steps = delays.slice(1).map((d, i) => Math.round((d - delays[i]) * 1000));
    steps.forEach((step) => expect(step).toBeLessThanOrEqual(80));
  });
});
