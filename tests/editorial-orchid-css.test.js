import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const stylesheets = [
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

/* The louver hero's ground is graded by design, not decorated: pale where the
   headline sits so deep-violet type stays legible when the shutter opens beneath
   it, saturating to ink where the portrait sits; and a feathered mask so the
   portrait emerges from that ink instead of sitting on it as a pasted rectangle.
   Both are load-bearing, so these two rules are exempt from the blanket ban —
   which still applies to every other declaration in every stylesheet.
   The site-header__inner gradient is also exempt: it is a deliberate brand
   decision — lighter on the brand/signature side, richer toward the nav links. */
const gradientExemptRules = ['.louver-hero__ground img', '.louver-hero__ground', '.site-header'];

/* Global — the ground is restated inside the narrow-screen media query, where the
   grade turns through ninety degrees. Every occurrence is exempt, not just the first. */
const withoutExemptRules = (css) =>
  gradientExemptRules.reduce(
    (acc, selector) => acc.replace(new RegExp(`${escapeRegExp(selector)}\\s*\\{[^}]*\\}`, 'g'), ''),
    css,
  );

describe('Editorial Orchid live style contracts', () => {
  it.each(stylesheets)('%s uses current tokens and no gradients', async (path) => {
    const css = await readProjectFile(path);

    expect(css).not.toMatch(/var\(--(?:space|r-|honey|cream|ink|white|hairline|fs-)/);
    // Blob gradients stay banned; the Editorial Orchid column grid uses repeating-linear-gradient, which is allowed.
    expect(withoutExemptRules(css)).not.toMatch(/(?<!repeating-)(?:linear|radial)-gradient/);
    expect(css).not.toMatch(/rgba?\(/);

    for (const hex of css.match(/#[0-9a-f]{3,8}\b/gi) ?? []) {
      expect(approvedHex).toContain(hex.toLowerCase());
    }
  });

  it('grades the louver ground from pale to ink using approved tokens only', async () => {
    const css = await readProjectFile('src/styles/home.css');
    const ground = ruleBody(css, '.louver-hero__ground');

    expect(ground).toMatch(/linear-gradient/);
    // Pale where the headline sits, ink where the portrait sits.
    expect(ground).toContain('var(--color-highlight)');
    expect(ground).toContain('var(--color-deep-violet)');
    expect(ground).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it('confines the saturated end of the grade to the portrait side', async () => {
    const css = await readProjectFile('src/styles/home.css');

    // This is what keeps the shutter calm: the slats swing wide, but under the
    // headline there is only pale paper to reveal. Saturation creeping leftward
    // is what put a violet band across the copy once before.
    for (const ground of [ruleBody(css, '.louver-hero__ground')]) {
      const violetStop = Number(ground.match(/var\(--color-violet\)\s+(\d+)%/)?.[1]);

      expect(violetStop).toBeGreaterThanOrEqual(80);
    }
  });
});

describe('Home contact contract', () => {
  it('offers honest Schedule and LinkedIn actions instead of a simulated contact form', async () => {
    const [home, script] = await Promise.all([
      readProjectFile('index.html'),
      readProjectFile('src/js/home/main.js'),
    ]);

    expect(home).toContain('href="/schedule/"');
    expect(home).toContain('linkedin.com/in/sampath-kumar-tn66sk9699');
    expect(home).not.toContain('<form class="contact-form"');
    expect(script).not.toMatch(/contactForm|Consultation Requested|Scheduling\.\.\./);
  });

  it('keeps deep-violet contact-card text legible regardless of inner wrapper', async () => {
    // Regression: results/schedule use .contact-card without a .contact-info wrapper,
    // so the card must force light heading/eyebrow colors or the global dark heading
    // color renders deep-violet-on-deep-violet (invisible) and a 1.75:1 eyebrow.
    const css = await readProjectFile('src/styles/components.css');

    expect(ruleBody(css, '.contact-card h2')).toContain('var(--color-white)');
    expect(ruleBody(css, '.contact-card .eyebrow')).toContain('var(--color-orchid)');
  });

  it('contains no dead Font Awesome toggle branch or obsolete form selectors', async () => {
    const [css, script] = await Promise.all([
      readProjectFile('src/styles/components.css'),
      readProjectFile('src/js/home/main.js'),
    ]);

    expect(script).not.toMatch(/querySelector\(['"]i['"]\)|fa-bars|fa-xmark/);
    expect(css).not.toMatch(/\.contact-form\b|\.form-group\b|\.form-control\b/);
  });

  it('uses the reversed light button for LinkedIn inside the deep contact panel', async () => {
    const home = await readProjectFile('index.html');
    // `[^>]*` so the panel can carry other attributes (data-glow) — the contract
    // is which button styles the LinkedIn action, not the order of the div's
    // attributes.
    const contactPanel = home.match(/<div class="contact-card[^"]*"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
    const linkedInAction = contactPanel.match(/<a[^>]+linkedin\.com[^>]*>/)?.[0] ?? '';

    expect(linkedInAction).toContain('class="btn btn--ghost-cream"');
    expect(linkedInAction).not.toContain('btn-outline-dark');
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

