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
});
