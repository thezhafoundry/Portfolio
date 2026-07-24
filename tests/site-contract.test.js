import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const pages = [
  'index.html',
  'story/index.html',
  'results/index.html',
  'schedule/index.html',
];

const readPage = (page) => readFile(new URL(`../${page}`, import.meta.url), 'utf8');

describe('Editorial Orchid foundation contracts', () => {
  it.each(pages)('%s requests the approved typefaces and shared foundation styles', async (page) => {
    const html = await readPage(page);

    expect(html).toContain('Cormorant+Garamond');
    expect(html).toContain('DM+Sans');
    expect(html).toContain('/src/styles/identity.css');
    expect(html).toContain('/src/styles/components.css');
    expect(html).not.toMatch(/Fraunces|Inter|Font Awesome|font-awesome/i);
  });
});

describe.todo('Editorial Orchid shared-shell contracts', () => {
  it('provides an accessible shared header, navigation state, skip link, and footer on every route');
  it('contains no legacy placeholders or inline brand-node SVGs');
  it('protects external new-tab links with rel=noopener');
});
