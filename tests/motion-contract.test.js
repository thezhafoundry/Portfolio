import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readProjectFile = async (path) => {
  const content = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  return content.replace(/\r\n/g, '\n');
};

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

describe("Transition hygiene (Editorial Orchid §13: transform/opacity, bounded properties)", () => {
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

  it('rests at the retired-spec §3.3 opacities so reduced motion still reads as the motif', async () => {
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

  it('restates the settled state at matching specificity so bubbles come to rest', async () => {
    const css = await readProjectFile('src/styles/components.css');
    // `.js .reveal-group > .bubble--me` is (0,3,0) and outranks the generic
    // `.reveal-group.on > *` (0,2,0). Without an equally specific .on rule the
    // bubbles enter translated and never settle.
    const settled = ruleBody(css, '.reveal-group.on > .bubble--me,\n.reveal-group.on > .bubble--reply');

    expect(settled).toMatch(/transform:\s*none/);
    expect(settled).toMatch(/opacity:\s*1/);
  });

  it('actually mounts bubbles on the story page, so the entrance is not dead CSS', async () => {
    const html = await readProjectFile('story/index.html');
    const group = html.match(/<div class="story-exchange reveal-group">([\s\S]*?)<\/div>/)?.[1] ?? '';

    // Direct children of the reveal-group, or the entrance selectors miss them.
    expect(group).toMatch(/class="bubble bubble--cream bubble--reply"/);
    expect(group).toMatch(/class="bubble bubble--ink bubble--me"/);
    expect((group.match(/class="bubble\b/g) ?? []).length).toBeGreaterThanOrEqual(3);
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
