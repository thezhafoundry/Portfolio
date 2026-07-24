import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const stylesheets = [
  'src/styles/main.css',
  'src/styles/components.css',
  'src/styles/home.css',
  'src/styles/story.css',
  'src/styles/results.css',
  'src/styles/schedule.css',
];

const approvedHex = new Set(['#fffaff', '#f7f2ff', '#e9d5ff', '#c084fc', '#6b21a8', '#2e1065', '#fff']);
const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ruleBody = (css, selector) => {
  const match = css.match(new RegExp(`${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`));
  return match?.[1] ?? '';
};

describe('Editorial Orchid live style contracts', () => {
  it.each(stylesheets)('%s uses current tokens and no gradients', async (path) => {
    const css = await readProjectFile(path);

    expect(css).not.toMatch(/var\(--(?:space|r-|honey|cream|ink|white|hairline|fs-)/);
    expect(css).not.toMatch(/(?:linear|radial)-gradient/);
    expect(css).not.toMatch(/rgba?\(/);

    for (const hex of css.match(/#[0-9a-f]{3,8}\b/gi) ?? []) {
      expect(approvedHex).toContain(hex.toLowerCase());
    }
  });
});

describe('Home contact contract', () => {
  it('offers honest Schedule and LinkedIn actions instead of a simulated contact form', async () => {
    const [home, script] = await Promise.all([
      readProjectFile('index.html'),
      readProjectFile('src/js/main.js'),
    ]);

    expect(home).toContain('href="/schedule/"');
    expect(home).toContain('linkedin.com/in/sampath-kumar-tn66sk9699');
    expect(home).not.toContain('<form class="contact-form"');
    expect(script).not.toMatch(/contactForm|Consultation Requested|Scheduling\.\.\./);
  });

  it('contains no dead Font Awesome toggle branch or obsolete form selectors', async () => {
    const [css, script] = await Promise.all([
      readProjectFile('src/styles/components.css'),
      readProjectFile('src/js/main.js'),
    ]);

    expect(script).not.toMatch(/querySelector\(['"]i['"]\)|fa-bars|fa-xmark/);
    expect(css).not.toMatch(/\.contact-form\b|\.form-group\b|\.form-control\b/);
  });
});

describe('Shared content primitives', () => {
  const requiredClasses = [
    'band', 'band--white', 'band--cream', 'band-inner', 'band-inner--wide',
    'label', 'label--pill', 'sweep', 'bubble', 'bubble--honey',
    'bubble--cream', 'bubble--ink', 'bubble--white', 'bubble--me',
    'bubble--reply', 'btn', 'btn--primary', 'btn--ghost', 'btn--honey',
    'btn--ghost-cream',
  ];

  it.each(requiredClasses)('.%s has a shared Editorial Orchid CSS implementation', async (className) => {
    const css = await readProjectFile('src/styles/identity.css');
    expect(css).toMatch(new RegExp(`\\.${escapeRegExp(className)}(?:[\\s,{.:]|$)`));
  });
});

describe('Interface typography', () => {
  const interfaceSelectors = [
    '.hero-brand',
    '.hero-nav-links a',
    '.btn-nav-glass',
    '.nav-toggle-glass',
    '.hero-eyebrow',
    '.hero-floating-badge-value',
    '.partner-badge',
    '.filter-chip',
  ];

  it.each(interfaceSelectors)('%s uses DM Sans rather than the display face', async (selector) => {
    const css = await readProjectFile('src/styles/components.css');
    const body = ruleBody(css, selector);

    expect(body).not.toBe('');
    expect(body).toContain('font-family: var(--font-body)');
    expect(body).not.toContain('font-family: var(--font-display)');
  });
});
