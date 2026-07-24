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
    expect(html).not.toMatch(/family=(?:Fraunces|Inter)(?:[+:&]|$)|Font Awesome|font-awesome/i);
  });

  it('keeps Home new-tab links safe and gives its navigation an accessible name', async () => {
    const html = await readPage('index.html');

    expect(html).toMatch(/target="_blank"[^>]*rel="noopener"/);
    const toggle = html.match(/<button class="nav-toggle"[^>]*>/)?.[0] ?? '';
    expect(toggle).toContain('aria-controls="site-navigation"');
    expect(toggle).toContain('aria-expanded="false"');
    expect(toggle).toContain('aria-label="Open navigation"');
  });
});

describe('Editorial Orchid shared-shell contracts', () => {
  it.each(pages)('%s provides the shared accessible header, navigation state, skip link, and footer', async (page) => {
    const html = await readPage(page);

    expect(html).toMatch(/<a class="skip-link" href="#main-content">Skip to content<\/a>/);
    expect(html).toMatch(/<header class="site-header">[\s\S]*?<div class="site-header__inner container">/);
    expect(html).toMatch(/<a class="site-brand" href="\/" aria-label="Sampath Kumar, home">[\s\S]*?sampath-signature\.svg/);
    expect(html).toMatch(/<button class="nav-toggle" type="button"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="site-navigation"[\s\S]*?aria-label="Open navigation">/);
    expect(html).toMatch(/<nav id="site-navigation" class="site-nav" aria-label="Primary">/);
    expect(html).toMatch(/<button class="nav-scrim" type="button" tabindex="-1"[\s\S]*?aria-label="Close navigation" hidden><\/button>/);
    expect(html).toMatch(/<main id="main-content">/);
    expect(html).toMatch(/<footer class="site-footer">[\s\S]*?sampath-signature-reversed\.svg[\s\S]*?Every deal begins with hello\.[\s\S]*?© 2026 Sampath Kumar · Greater Coimbatore, India/);
    expect(html).toMatch(/href="\/story\/"[^>]*>Story<\/a>[\s\S]*?href="\/results\/"[^>]*>Results<\/a>[\s\S]*?href="\/schedule\/"[^>]*>Schedule<\/a>[\s\S]*?linkedin\.com\/in\/sampath-kumar-tn66sk9699/);
    expect(html).toMatch(/href="\/schedule\/"[^>]*>Start a conversation<\/a>/);
  });

  it.each([
    ['index.html', '/'],
    ['story/index.html', '/story/'],
    ['results/index.html', '/results/'],
    ['schedule/index.html', '/schedule/'],
  ])('%s marks its active route (%s)', async (page, route) => {
    const html = await readPage(page);

    expect(html).toMatch(new RegExp(`href="${route.replaceAll('/', '\\/')}" aria-current="page"`));
  });

  it.each(pages)('%s contains no legacy shell placeholders or inline brand-node SVGs', async (page) => {
    const html = await readPage(page);

    expect(html).not.toMatch(/hero-glass-nav|nav-toggle-glass|site-links|brand-node/i);
  });

  it.each(pages)('%s protects external new-tab links with rel=noopener', async (page) => {
    const html = await readPage(page);
    const newTabLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];

    expect(newTabLinks.length).toBeGreaterThan(0);
    expect(newTabLinks.every((link) => /rel="[^"]*\bnoopener\b[^"]*"/.test(link))).toBe(true);
  });
});
