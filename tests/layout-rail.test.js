import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readIdentity = () => readFile(new URL('../src/styles/identity.css', import.meta.url), 'utf8');

const ruleBody = (css, selector) =>
  css.match(new RegExp(`${selector.replace(/[.\-]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1] ?? '';

/* The header, footer and every content band must start their text on one left
   edge. `.container` caps at --content-max with no padding, so a padded band
   only lines up with it when the band's own width is --content-max plus both
   gutters — that is what --band-measure encodes. */
describe('Single site rail', () => {
  it('sizes --band-measure so a padded band lands on the .container edge', async () => {
    const root = ruleBody(await readIdentity(), ':root');

    expect(root).toMatch(/--band-measure:\s*calc\(var\(--content-max\)\s*\+\s*var\(--gutter\)\s*\*\s*2\)/);
  });

  it('keeps .container capped at the content measure without padding', async () => {
    const container = ruleBody(await readIdentity(), '.container');

    expect(container).toContain('var(--content-max)');
    expect(container).toContain('margin-inline: auto');
    expect(container).not.toMatch(/padding/);
  });

  it('gives both band variants the same measure and gutter padding', async () => {
    const css = await readIdentity();
    const band = ruleBody(css, '.band-inner');
    const wide = ruleBody(css, '.band-inner--wide');

    expect(band).toContain('var(--band-measure)');
    expect(band).toContain('var(--gutter)');
    // .band-inner--wide no longer breaks out to its own width.
    expect(wide).toContain('var(--band-measure)');
    expect(wide).not.toMatch(/\d+rem/);
  });
});
