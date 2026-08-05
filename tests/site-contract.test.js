import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const pages = [
  'index.html',
  'story/index.html',
  'results/index.html',
  'schedule/index.html',
  '404.html',
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

describe('Editorial Orchid Home contracts', () => {
  it('loads its page stylesheet instead of the retired main stylesheet', async () => {
    const html = await readPage('index.html');

    expect(html).toContain('/src/styles/home.css');
    expect(html).not.toContain('/src/styles/main.css');
  });

  it('opens with the approved editorial greeting', async () => {
    const html = await readPage('index.html');
    const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';

    expect(heading).toContain('Every deal begins with');
    expect(heading).toMatch(/<em\b[^>]*>\s*hello\.\s*<\/em>/);
  });

  it('makes the priority portrait informative and ready for the hero', async () => {
    const html = await readPage('index.html');
    const portrait = html.match(/<img\b[^>]*hero_portrait\.jpg[^>]*>/)?.[0] ?? '';

    expect(portrait).toMatch(/alt="[^"]+"/);
    expect(portrait).toMatch(/width="\d+"/);
    expect(portrait).toMatch(/height="\d+"/);
    expect(portrait).toContain('fetchpriority="high"');
  });

  it('points the hero actions at proof-of-work sections and keeps an honest schedule path available', async () => {
    const html = await readPage('index.html');
    const hero = html.match(/<section\b[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? '';

    expect(hero).toMatch(/<a\b[^>]*class="[^"]*btn--primary[^"]*"[^>]*href="#companies"/);
    expect(hero).toMatch(/<a\b[^>]*class="[^"]*btn--secondary[^"]*"[^>]*href="#results"/);
    expect(html).toMatch(/href="\/schedule\/"/);
  });

  it('states the verified proof values literally without counter animation hooks', async () => {
    const html = await readPage('index.html');

    for (const value of ['+35%', '200M+', '24 major markets']) {
      expect(html).toContain(value);
    }
    expect(html).not.toMatch(/data-target|stat-number/);
  });

  it('does not present a contact form without a delivery endpoint', async () => {
    const html = await readPage('index.html');

    expect(html).not.toContain('contactForm');
  });
});

describe('Editorial Orchid Story contracts', () => {
  it('contains nine story chapters without TODO placeholder comments or photo slots', async () => {
    const html = await readPage('story/index.html');
    const matches = html.match(/<article\b[^>]*class="[^"]*story-chapter[^"]*"[^>]*>/g) ?? [];

    expect(matches.length).toBe(9);
    expect(html).not.toContain('TODO');
    expect(html).not.toContain('Photo — to be added');
  });

  it('uses accessible buttons for timeline navigation referencing chapter IDs', async () => {
    const html = await readPage('story/index.html');

    expect(html).toMatch(/<button\b[^>]*data-chapter="chapter-\d+"[^>]*>/);
  });

  it('keeps a gap-free heading hierarchy by titling chapters with h2, not h3', async () => {
    const html = await readPage('story/index.html');

    // Nine chapters + the closing "short version" section = ten h2 headings, no h3 skip after the single h1.
    expect((html.match(/<h2\b/g) ?? []).length).toBe(10);
    expect(html).not.toMatch(/<h3\b/);
  });
});

describe('Editorial Orchid Results contracts', () => {
  it('presents proof metrics before the primary case study and structures outcomes', async () => {
    const html = await readPage('results/index.html');
    const proofIndex = html.indexOf('+35%');
    const caseStudyIndex = html.indexOf('Client A');

    expect(proofIndex).toBeGreaterThan(-1);
    expect(caseStudyIndex).toBeGreaterThan(-1);
    expect(proofIndex).toBeLessThan(caseStudyIndex);

    const outcomes = html.match(/<div\b[^>]*class="[^"]*outcome-block[^"]*"[^>]*>/g) ?? [];
    expect(outcomes.length).toBe(4);
  });

  it('groups earlier roles and provides a conversation call to action', async () => {
    const html = await readPage('results/index.html');

    expect(html).toMatch(/<section\b[^>]*aria-labelledby="earlier-roles-heading"[^>]*>/);
    expect(html).toMatch(/<a\b[^>]*href="\/schedule\/"[^>]*>Start a conversation<\/a>/);
  });
});

describe('Editorial Orchid Schedule contracts', () => {
  it('defaults to an honest conversation fallback without misleading booking claims', async () => {
    const html = await readPage('schedule/index.html');
    /* The site-wide chatbot widget (identical markup on every page, see the
       "Chatbot widget" contracts below) truthfully answers "Can I see past
       results?" with the same follower count shown on the homepage. That's
       not a schedule-page claim, so it's excluded from this guard — the
       widget is always appended right before the page's entry script, after
       all of the page's own authored content. */
    const pageContent = html.split('<button id="chatbot-trigger"')[0];

    expect(pageContent).not.toContain('Pick a time');
    expect(pageContent).toContain('Start a conversation');
    expect(pageContent).toContain('linkedin.com/in/sampath-kumar-tn66sk9699');
    expect(pageContent).toMatch(/role="status"[^>]*aria-live="polite"/);
    expect(pageContent).not.toMatch(/@gmail|download CV|followers|instant booking/i);
  });
});




describe('Editorial Orchid shared-shell contracts', () => {
  it.each(pages)('%s provides the shared accessible header, navigation state, skip link, and footer', async (page) => {
    const html = await readPage(page);

    expect(html).toMatch(/<a class="skip-link" href="#main-content">Skip to content<\/a>/);
    expect(html).toMatch(/<header class="site-header">[\s\S]*?<div class="site-header__inner container">/);
    expect(html).toMatch(/<a class="site-brand" href="\/"[^>]*aria-label="Sampath Kumar, home">[\s\S]*?class="site-brand__signature">Sampath Kumar<\/span>/);
    expect(html).toMatch(/<button class="nav-toggle" type="button"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="site-navigation"[\s\S]*?aria-label="Open navigation">/);
    expect(html).toMatch(/<nav id="site-navigation" class="site-nav" aria-label="Primary">/);
    expect(html).toMatch(/<button class="nav-scrim" type="button" tabindex="-1"[\s\S]*?aria-label="Close navigation" hidden><\/button>/);
    expect(html).toMatch(/<main id="main-content">/);
    expect(html).toMatch(/<footer class="site-footer">[\s\S]*?class="site-footer__big-word-a">Sampath<\/span>[\s\S]*?class="site-footer__big-word-b">Kumar<\/span>[\s\S]*?Every deal begins with hello\.[\s\S]*?© 2026 Sampath Kumar · Coimbatore, Tamil Nadu, India/);
    expect(html).toMatch(/linkedin\.com\/in\/sampath-kumar-tn66sk9699/);
  });

  it.each([
    ['index.html', '/'],
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

describe('Page entry-script wiring', () => {
  /* Regression guard: a bulk redesign once swapped results/index.html's entry
     script from results.js to main.js, silently orphaning the follower-counter
     wiring. Each page must load its own dedicated entry, not another page's. */
  const entries = [
    ['index.html', '/src/js/home/main.js'],
    ['story/index.html', '/src/js/story/story.js'],
    ['results/index.html', '/src/js/results/results.js'],
    ['schedule/index.html', '/src/js/schedule/schedule-page.js'],
    ['404.html', '/src/js/notfound/notfound.js'],
  ];

  it.each(entries)('%s loads its own entry script (%s)', async (page, entry) => {
    const html = await readPage(page);

    expect(html).toContain(`<script type="module" src="${entry}"></script>`);
  });
});

describe('Chatbot widget', () => {
  const chatbotPages = [
    'index.html',
    'story/index.html',
    'results/index.html',
    'schedule/index.html',
    'policies/terms/index.html',
    'policies/privacy/index.html',
    'policies/refunds/index.html',
    '404.html',
  ];

  it.each(chatbotPages)('%s mounts the chatbot trigger and panel', async (page) => {
    const html = await readPage(page);

    expect(html).toContain('id="chatbot-trigger"');
    expect(html).toContain('id="chatbot-panel"');
    expect(html).toContain('id="chatbot-menu"');
  });

  it('states the real session rate on the pricing answer', async () => {
    const html = await readPage('index.html');
    const pricing = html.match(/<div id="chatbot-answer-pricing"[\s\S]*?<\/div>/)?.[0] ?? '';

    expect(pricing).toContain('USD 350');
  });

  it('lists all five FAQ chips in the menu', async () => {
    const html = await readPage('index.html');
    const menu = html.match(/<div id="chatbot-menu"[\s\S]*?<\/div>/)?.[0] ?? '';

    ['services', 'process', 'pricing', 'results', 'booking'].forEach((id) => {
      expect(menu).toContain(`data-chatbot-show="${id}"`);
    });
  });
});
