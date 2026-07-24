# Editorial Orchid Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Sampath Kumar's four-page portfolio around the approved Editorial Orchid direction, including the custom Modern Monoline signature, a portrait-led homepage hero, consistent navigation and footer, honest media and booking fallbacks, and accessible responsive behavior.

**Architecture:** Keep the current Vite multi-page application and progressively replace its two competing visual systems with one shared foundation. `identity.css` owns tokens, reset, typography, layout primitives, and global states; `components.css` owns reusable navigation, footer, buttons, media, proof, and CTA components; each route stylesheet owns only page composition. The HTML remains static and content-forward, while small ES modules progressively enhance navigation, optional video, Story chapters, and the optional Cal.com embed. Vitest contract tests inspect the static pages and SVG assets without introducing a DOM test dependency.

**Tech Stack:** Vite 5, semantic HTML, modern CSS, vanilla ES modules, Vitest 2, SVG brand assets, optional Cal.com embed

## Global Constraints

- Preserve the approved palette exactly:
  - Canvas `#FFFAFF`
  - Section `#F7F2FF`
  - Highlight `#E9D5FF`
  - Light orchid `#C084FC`
  - Primary violet `#6B21A8`
  - Deep violet `#2E1065`
- Use Cormorant Garamond for editorial display type and DM Sans for body and interface type.
- Keep white or near-white dominant; use violet for hierarchy and controlled emphasis.
- Use the approved Modern Monoline full-signature direction. Production SVGs must contain outlined paths, not `<text>` elements or a stock font reference.
- Use the existing `public/assets/hero_portrait.jpg` as the real hero image until the client supplies a replacement. Do not show “coming soon,” “photo to be added,” or another visible placeholder.
- Do not expose a video play control until a real video source exists. The portrait remains a valid poster/image when no video is configured.
- Do not claim that a booking calendar is available until a real Cal.com link exists. The default production experience is the honest LinkedIn conversation fallback.
- Do not simulate a successful contact submission. A form may be enabled only when it has a confirmed delivery destination.
- Preserve current verified biography, roles, metrics, and LinkedIn URL unless the client supplies corrected content.
- Avoid a framework migration, CMS, autoplay, scroll hijacking, parallax, dark-mode expansion, and new runtime dependencies.
- All pages must pass the same responsive, accessibility, and visual acceptance checks at 320, 390, 768, 1024, 1440, and 1920px.

---

## Task 1: Add Static Site Contracts and Brand Asset Tests

**Files:**

- Create: `tests/site-contract.test.js`
- Create: `tests/brand-assets.test.js`
- Reference: `index.html`
- Reference: `story/index.html`
- Reference: `results/index.html`
- Reference: `schedule/index.html`
- Reference: `public/favicon.svg`

**Interfaces:**

```js
const pages = [
  'index.html',
  'story/index.html',
  'results/index.html',
  'schedule/index.html',
];
```

- [ ] Add a failing `tests/site-contract.test.js` that reads every production HTML file with `node:fs/promises` and asserts:
  - Cormorant Garamond and DM Sans are requested;
  - `/src/styles/identity.css` and `/src/styles/components.css` are loaded;
  - the page contains a `<header class="site-header">` and `<footer class="site-footer">`;
  - the page contains no `TODO`, `Photo — to be added`, `data-cal-link="TODO"`, Fraunces, Inter, Font Awesome, or inline legacy `brand-node` SVG;
  - every navigation toggle has `aria-controls`, `aria-expanded="false"`, and an accessible label;
  - the current route exposes one `aria-current="page"` navigation link, except Home where the logo uses it;
  - every page has a skip link targeting `#main-content`;
  - external links opened in a new tab include `rel="noopener"`.
- [ ] Add a failing `tests/brand-assets.test.js` that loads the planned brand SVGs and asserts:
  - each asset begins with an `<svg>` root and has a `viewBox`;
  - signature masters contain at least one `<path>`;
  - none contains `<text>`, `font-family`, script tags, or external URLs;
  - the reversed signature uses a white fill or stroke;
  - the favicon and `S` mark are square-viewBox SVGs.
- [ ] Run `npm test -- --run tests/site-contract.test.js tests/brand-assets.test.js`.
- [ ] Confirm the test run fails because the Editorial Orchid shell and brand assets do not exist yet, not because the tests have syntax or file-resolution errors.
- [ ] Commit the red tests:

```bash
git add tests/site-contract.test.js tests/brand-assets.test.js
git commit -m "test: define Editorial Orchid site contracts"
```

---

## Task 2: Build the Custom Signature and Orchid Design Foundation

**Files:**

- Create: `public/brand/sampath-signature.svg`
- Create: `public/brand/sampath-signature-reversed.svg`
- Create: `public/brand/sampath-s-mark.svg`
- Create: `public/brand/png/sampath-signature-720.png`
- Create: `public/brand/png/sampath-signature-1440.png`
- Create: `public/brand/png/sampath-signature-reversed-1440.png`
- Create: `public/brand/png/sampath-s-mark-512.png`
- Modify: `public/favicon.svg`
- Rewrite: `src/styles/identity.css`
- Modify: `index.html`
- Modify: `story/index.html`
- Modify: `results/index.html`
- Modify: `schedule/index.html`

**CSS token contract:**

```css
:root {
  --color-canvas: #fffaff;
  --color-section: #f7f2ff;
  --color-highlight: #e9d5ff;
  --color-orchid: #c084fc;
  --color-violet: #6b21a8;
  --color-deep-violet: #2e1065;
  --color-white: #fff;
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  --content-max: 76rem;
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --section-space: clamp(3.5rem, 8vw, 8rem);
  --radius-media: clamp(0.75rem, 1.5vw, 1.25rem);
  --focus-ring: 0 0 0 3px #fffaff, 0 0 0 6px #6b21a8;
}
```

- [ ] Draw the primary `Sampath Kumar` signature as custom monoline Bézier paths based on the approved B variation:
  - make the capital `S` and `K` the distinctive anchors;
  - join the given name naturally;
  - use a controlled terminal flourish after `Kumar`;
  - preserve legibility at a 30–36px rendered height;
  - use `currentColor` or deep violet in the primary file;
  - include a descriptive `<title>` in the full-signature masters.
- [ ] Derive the reversed signature from the exact same path geometry and set it to white.
- [ ] Derive a simplified calligraphic `S` mark from the same capital form, with no hairline details that disappear at 16px.
- [ ] Export transparent PNG derivatives from the approved SVG masters at 720px and 1440px signature widths, plus a 512px-square `S` social-avatar mark. Preserve the SVG aspect ratio and do not redraw or rasterize from a screenshot.
- [ ] Extend the brand asset test to verify each PNG exists, begins with the PNG file signature, and is non-empty.
- [ ] Replace `public/favicon.svg` with the simplified `S` mark on a pale-orchid or deep-violet protected field.
- [ ] Rewrite `identity.css` around the approved tokens and add:
  - `box-sizing: border-box` reset;
  - canvas, text, and link defaults;
  - responsive Cormorant heading scale;
  - 16–18px DM Sans body scale;
  - `.container`, `.section`, `.surface`, `.eyebrow`, `.editorial-emphasis`, and `.skip-link` primitives;
  - `min-width: 0` for direct grid and flex children;
  - image defaults that preserve aspect ratio;
  - long-link wrapping with `overflow-wrap: anywhere`;
  - a visible `:focus-visible` ring;
  - reduced-motion defaults;
  - no legacy honey, cream, ink, glass, gradient-text, or floating-loop tokens.
- [ ] Replace every Google Fonts request with one request for:

```text
Cormorant Garamond: 400, 500, 600, 700, 400 italic, 600 italic
DM Sans: 400, 500, 600, 700
```

- [ ] Add `identity.css` to the Home page before `components.css`. Keep each route stylesheet last.
- [ ] Remove Font Awesome from Home and use text plus inline, decorative SVG only where an icon materially improves comprehension.
- [ ] Run `npm test -- --run tests/brand-assets.test.js`.
- [ ] Run `npm run build`.
- [ ] Confirm both commands pass.
- [ ] Commit the foundation:

```bash
git add public/brand public/favicon.svg src/styles/identity.css index.html story/index.html results/index.html schedule/index.html
git commit -m "feat: establish Editorial Orchid brand foundation"
```

---

## Task 3: Unify the Header, Footer, and Responsive Navigation

**Files:**

- Rewrite shared portions of: `src/styles/components.css`
- Modify: `src/js/nav.js`
- Create: `tests/nav.test.js`
- Modify: `src/js/main.js`
- Modify: `index.html`
- Modify: `story/index.html`
- Modify: `results/index.html`
- Modify: `schedule/index.html`

**JavaScript interfaces:**

```js
export function nextNavState(isOpen) {
  return { isOpen: !isOpen, expanded: String(!isOpen) };
}

export function initNav(root = document) {}
```

**Markup contract:**

```html
<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header">
  <div class="site-header__inner container">
    <a class="site-brand" href="/" aria-label="Sampath Kumar, home">
      <img src="/brand/sampath-signature.svg" alt="Sampath Kumar">
    </a>
    <button class="nav-toggle" type="button"
      aria-expanded="false" aria-controls="site-navigation"
      aria-label="Open navigation">
      <span aria-hidden="true"></span>
    </button>
    <nav id="site-navigation" class="site-nav" aria-label="Primary">…</nav>
  </div>
  <button class="nav-scrim" type="button" tabindex="-1"
    aria-label="Close navigation" hidden></button>
</header>
```

- [ ] Add failing tests for `nextNavState(false)` and `nextNavState(true)`, including the string form of `aria-expanded`.
- [ ] Run `npm test -- --run tests/nav.test.js` and confirm the new test fails because the pure helper is absent.
- [ ] Implement `nextNavState` and refactor `initNav` so all four pages share one behavior:
  - closed by default;
  - toggle click opens and closes;
  - scrim click closes;
  - Escape closes and returns focus to the toggle;
  - selecting a navigation link closes;
  - `aria-expanded`, `aria-label`, `hidden`, and the document scroll lock stay synchronized;
  - behavior exits safely when markup is absent.
- [ ] Replace the four existing header variants with the same structure and route-correct `aria-current`.
- [ ] Use the full signature on desktop and allow the `S` mark through CSS at narrow widths.
- [ ] Replace every existing footer with the same `site-footer` structure containing:
  - reversed signature;
  - “Every deal begins with hello.”;
  - Story, Results, Schedule, and LinkedIn links;
  - a “Start a conversation” action;
  - `© 2026 Sampath Kumar · Greater Coimbatore, India`.
- [ ] Rebuild only the shared component layer in `components.css`:
  - 44px minimum navigation and button targets;
  - active-page underline or pill;
  - non-floating desktop header;
  - mobile drawer plus violet-tinted scrim;
  - white/deep-violet footer;
  - primary, secondary, text-link, and reversed button variants;
  - hover, focus, active, disabled, loading, error, and success state primitives.
- [ ] Import and call `initNav()` from the Home entry module so Home uses the shared controller rather than its separate glass-menu logic.
- [ ] Run:

```bash
npm test -- --run tests/nav.test.js
npm run build
```

- [ ] Verify the menu with keyboard only at 390px: open, tab through links, Escape, focus restoration.
- [ ] Commit:

```bash
git add src/styles/components.css src/js/nav.js src/js/main.js tests/nav.test.js index.html story/index.html results/index.html schedule/index.html
git commit -m "feat: unify portfolio navigation and footer"
```

---

## Task 4: Rebuild the Homepage Around the Portrait-Led Editorial Hero

**Files:**

- Rewrite: `index.html`
- Rewrite: `src/styles/home.css`
- Modify: `src/js/main.js`
- Delete after import removal: `src/styles/main.css`
- Reference: `public/assets/hero_portrait.jpg`
- Reference: `public/assets/strategy_session.jpg`
- Reference: `public/assets/about_portrait.jpg`

**Homepage section order:**

1. Hero
2. Proof rail
3. Selected partners
4. Personal introduction
5. Core services
6. Working process
7. Selected results
8. Conversation CTA
9. Shared footer

- [ ] Extend `site-contract.test.js` with failing Home assertions:
  - `index.html` loads `/src/styles/home.css` and not `/src/styles/main.css`;
  - the H1 contains “Every deal begins with” and an emphasized “hello.”;
  - the hero image is `hero_portrait.jpg`, has non-empty alt text, explicit width/height, and `fetchpriority="high"`;
  - the primary hero action links to `/schedule/`;
  - all final proof values appear as literal HTML, with no `data-target` counter animation;
  - the page has no `contactForm` while no delivery endpoint exists.
- [ ] Run the Home contract test and confirm it fails against the current markup.
- [ ] Rewrite the Home HTML using semantic sections and one H1:
  - left column: eyebrow, “Every deal begins with *hello.*”, concise positioning statement, primary Schedule CTA, quiet Results link;
  - right column: prominent 4:5 portrait in a `<figure>`, caption if useful, and one attached proof badge;
  - literal proof rail with the verified `+35%`, `9.2/10`, `200M+`, and `12 markets` values;
  - partner names as restrained typography, not fake company logos;
  - short first-person introduction beside `strategy_session.jpg` or `about_portrait.jpg`;
  - three or four outcome-oriented services;
  - three-step working process;
  - selected career outcomes linking to Results rather than a full résumé;
  - one final CTA linking to Schedule and LinkedIn.
- [ ] Use meaningful image alternative text. When two crops repeat the same portrait for decoration, give the decorative instance `alt=""`.
- [ ] Rewrite `home.css` with:
  - desktop 52/48 hero grid;
  - a controlled orchid word highlight;
  - a photo frame with 12–20px radius and no glow;
  - attached proof badge that does not cover the face;
  - mobile copy-first order with the portrait inside the first 720px where normal content length permits;
  - fixed aspect ratios and explicit `object-position` values;
  - responsive service/process/result layouts;
  - `minmax(0, 1fr)` tracks and no viewport-width sizing that can cause overflow.
- [ ] Remove the counter animation and the fake form success simulation from `main.js`. Keep only progressive enhancement still used by the rebuilt Home.
- [ ] Remove the `main.css` import, add the `home.css` import, then delete the unused `src/styles/main.css`.
- [ ] Run:

```bash
npm test -- --run tests/site-contract.test.js
npm run build
```

- [ ] At 320px and 390px, verify `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- [ ] At 1440px, verify the portrait is a first-class right column and the copy line length stays below roughly 18 words per line.
- [ ] Commit:

```bash
git add index.html src/styles/home.css src/js/main.js src/styles/main.css tests/site-contract.test.js
git commit -m "feat: rebuild portrait-led Editorial Orchid homepage"
```

---

## Task 5: Add Honest, Replaceable Photo and Optional Video Behavior

**Files:**

- Create: `src/js/media.js`
- Create: `tests/media.test.js`
- Modify: `src/js/main.js`
- Modify: `index.html`
- Modify: `src/styles/components.css`

**JavaScript interfaces:**

```js
export function getMediaMode({ videoSrc = '', posterSrc = '' } = {}) {
  if (videoSrc.trim()) return 'video';
  if (posterSrc.trim()) return 'image';
  return 'empty';
}

export function initMedia(root = document) {}
```

- [ ] Give each live `[data-media]` figure explicit source, alt text, aspect ratio, focal position, and optional caption metadata. Keep poster, captions, transcript, and video source fields in the same component so client media can be replaced without changing section markup.
- [ ] Add failing pure tests covering `video`, `image`, and `empty` modes, including whitespace-only inputs.
- [ ] Run `npm test -- --run tests/media.test.js` and confirm failure because the module is absent.
- [ ] Implement `getMediaMode`.
- [ ] Implement `initMedia` for optional `[data-media]` regions:
  - image mode leaves the accessible portrait intact and keeps the play control hidden;
  - video mode reveals the labelled “Watch introduction” control;
  - activating it creates or reveals a dialog with a lazy-loaded `<video controls preload="metadata">`;
  - never set `autoplay`;
  - include a close button, caption-track slot, and transcript link slot;
  - Escape and backdrop click close the dialog;
  - closing pauses video and restores focus;
  - image load errors apply a bounded fallback surface and preserve the figure's aspect ratio;
  - empty mode hides the whole media region without collapsing adjacent layout.
- [ ] Mark the current hero media as image mode with `hero_portrait.jpg`; do not configure a video source or show a play button.
- [ ] Add reusable media-frame, play-control, dialog, poster, caption, and transcript styles to `components.css`.
- [ ] In reduced-motion mode, remove modal entrance transforms and preserve immediate visibility changes.
- [ ] Import and initialize the media module from `main.js`.
- [ ] Run:

```bash
npm test -- --run tests/media.test.js
npm run build
```

- [ ] Inspect the Home accessibility tree and confirm no video/play control is announced in the current image-only state.
- [ ] Commit:

```bash
git add src/js/media.js tests/media.test.js src/js/main.js index.html src/styles/components.css
git commit -m "feat: add optional accessible portfolio media"
```

---

## Task 6: Recompose the Story Page as an Editorial Timeline

**Files:**

- Rewrite: `story/index.html`
- Rewrite: `src/styles/story.css`
- Modify: `src/js/story.js`
- Reference: `public/assets/about_portrait.jpg`
- Reference: `public/assets/strategy_session.jpg`

**Story behavior contract:**

- Desktop and capable tablet: sticky visual stage plus readable chapter list.
- Mobile: chronological year cards with all content in normal document flow.
- Enhancement failure: every chapter remains visible and understandable.

- [ ] Extend `site-contract.test.js` with failing Story assertions:
  - exactly nine `.story-chapter` articles exist;
  - no placeholder copy or production TODO comments remain;
  - timeline controls are buttons and reference real chapter IDs;
  - the closing section contains a real existing image or omits the image region;
  - the page ends with the shared footer.
- [ ] Run the Story contract and confirm failure against the old markup.
- [ ] Rewrite the Story hero to use the shared shell, Editorial Orchid label, Cormorant heading, and its current verified metrics.
- [ ] Preserve the nine verified career/education chapters, give each a stable ID, year range, organization, heading, and concise narrative.
- [ ] Replace the decorative legacy SVG node system with an orchid line-and-node stage that derives its labels from the active chapter.
- [ ] Use `about_portrait.jpg` or `strategy_session.jpg` in the close only if the image is contextually accurate; otherwise omit the region and let the copy use the full column. Never expose a photo placeholder.
- [ ] Update `story.js` so:
  - chapter buttons call `scrollIntoView` only when activated;
  - IntersectionObserver updates `aria-current` and the visual stage without hiding inactive chapters;
  - reduced-motion users get no animated travel;
  - missing IntersectionObserver leaves a complete static page;
  - the old presentation-only ghost numbering is removed from the accessibility tree.
- [ ] Rewrite `story.css`:
  - 560–640px desktop chapter stages;
  - 44px timeline targets;
  - readable inactive chapters;
  - sticky stage disabled below the tablet breakpoint;
  - compact mobile year cards;
  - no full-viewport chapter sizing.
- [ ] Run:

```bash
npm test -- --run tests/site-contract.test.js
npm run build
```

- [ ] Manually traverse all nine chapters with keyboard and at 390px.
- [ ] Commit:

```bash
git add story/index.html src/styles/story.css src/js/story.js tests/site-contract.test.js
git commit -m "feat: redesign Story as an orchid editorial timeline"
```

---

## Task 7: Turn Results Into a Scannable Commercial Proof Page

**Files:**

- Rewrite: `results/index.html`
- Rewrite: `src/styles/results.css`
- Modify if required: `src/js/results.js`

- [ ] Extend `site-contract.test.js` with failing Results assertions:
  - `+35%`, `9.2/10`, and `200M+` appear before the primary case-study article;
  - the Finquest case study has exactly four `.outcome-block` elements;
  - earlier roles are grouped under one labelled section;
  - the page has a styled Schedule CTA before the shared footer.
- [ ] Run the Results contract and confirm it fails against the current conversation-bubble layout.
- [ ] Rewrite the hero as a concise result statement followed immediately by a three-value proof rail.
- [ ] Recompose Finquest into:
  - context;
  - challenge;
  - approach;
  - four concise outcome blocks;
  - short connecting narrative that keeps related evidence together.
- [ ] Use these four verified outcome themes:
  - `200M+` company universe mapped;
  - `+35%` lead-to-meeting conversion improvement;
  - `9.2/10` average client satisfaction;
  - sourcing time reduced from months to weeks.
- [ ] Reformat earlier roles as compact editorial ledger entries so they support, rather than compete with, the anchor case study.
- [ ] Remove hidden testimonial markup until named, approved testimonial content exists.
- [ ] Add a pale-orchid closing CTA with “Start a conversation” and a secondary LinkedIn action, followed by the shared footer.
- [ ] Rewrite `results.css` for:
  - immediate proof hierarchy;
  - desktop editorial asymmetry with grouped facts;
  - one-column mobile reading order;
  - consistent rules, spacing, and accessible contrast;
  - no speech-bubble visual language.
- [ ] Run:

```bash
npm test -- --run tests/site-contract.test.js
npm run build
```

- [ ] At 390px, verify the three headline metrics remain visible before the case study without clipping or horizontal scrolling.
- [ ] Commit:

```bash
git add results/index.html src/styles/results.css src/js/results.js tests/site-contract.test.js
git commit -m "feat: make portfolio results immediately scannable"
```

---

## Task 8: Make Schedule Honest Now and Calendar-Ready Later

**Files:**

- Rewrite: `schedule/index.html`
- Rewrite: `src/styles/schedule.css`
- Modify: `src/js/scheduler.js`
- Modify: `src/js/schedule-page.js`
- Create: `tests/scheduler.test.js`

**JavaScript interfaces:**

```js
export function resolveScheduleMode(calLink = '') {
  return calLink.trim() ? 'calendar' : 'fallback';
}

export function initScheduler({
  calLink,
  container,
  fallback,
  status,
  timeoutMs = 8000,
}) {}
```

- [ ] Add failing tests showing that absent/whitespace links resolve to `fallback` and a real path such as `sampath-kumar/30min` resolves to `calendar`.
- [ ] Run `npm test -- --run tests/scheduler.test.js` and confirm failure because `resolveScheduleMode` is absent.
- [ ] Add Schedule contracts asserting:
  - no page copy says “Pick a time” while `data-cal-link` is empty;
  - the fallback heading says “Start a conversation”;
  - LinkedIn is visible without JavaScript;
  - calendar status uses `role="status"` and `aria-live="polite"`;
  - no unavailable email, CV, follower count, or direct-booking claim is rendered.
- [ ] Rewrite the default Schedule page around the honest fallback:
  - heading: “Start a conversation. I’ll say *hello* first.”;
  - short explanation that booking will be added once confirmed;
  - primary LinkedIn action;
  - secondary links to Results and Story;
  - no empty 480px calendar shell in fallback mode.
- [ ] Refactor `scheduler.js` to:
  - select fallback synchronously when the link is absent;
  - render a bounded loading state only in calendar mode;
  - use the approved primary violet as the Cal brand color;
  - expose ready, failure, and timeout status text;
  - retain the visible LinkedIn fallback after failure;
  - avoid loading the third-party script in fallback mode.
- [ ] Keep calendar-ready markup in the page with an empty `data-cal-link=""`; the fallback remains visible by default, and enhancement may switch to the embed only after a real link is configured.
- [ ] Rewrite `schedule.css` with a 5/7 copy-to-calendar grid for real calendar mode and an intentionally composed single fallback panel for the current mode.
- [ ] Run:

```bash
npm test -- --run tests/scheduler.test.js tests/site-contract.test.js
npm run build
```

- [ ] Confirm the browser makes no request to Cal.com in the current fallback configuration.
- [ ] Commit:

```bash
git add schedule/index.html src/styles/schedule.css src/js/scheduler.js src/js/schedule-page.js tests/scheduler.test.js tests/site-contract.test.js
git commit -m "feat: provide honest schedule fallback"
```

---

## Task 9: Normalize Motion and Interaction States

**Files:**

- Modify: `src/js/motion.js`
- Modify: `tests/motion.test.js`
- Modify: `src/styles/identity.css`
- Modify: `src/styles/components.css`
- Modify: `src/styles/home.css`
- Modify: `src/styles/story.css`
- Modify: `src/styles/results.css`
- Modify: `src/styles/schedule.css`

**Motion timing contract:**

```js
export const motionDurations = Object.freeze({
  control: 160,
  menuOpen: 220,
  menuClose: 180,
  accordion: 260,
  story: 320,
  hero: 480,
});
```

- [ ] Add failing tests for the exported duration values and for reduced-motion behavior returning zero-duration transition options.
- [ ] Run `npm test -- --run tests/motion.test.js` and confirm the new assertions fail for the expected missing contract.
- [ ] Keep the existing spring math only where it creates restrained feedback; remove any looping ticker, floating, or counter motion still referenced by live markup.
- [ ] Export the shared timing values and use them consistently in JS-driven interactions.
- [ ] Add a restrained Home hero entrance using opacity and a small translate only. Content must be fully visible without JavaScript.
- [ ] Normalize control states across the CSS:
  - hover at 140–180ms;
  - clear active/pressed response;
  - visible keyboard focus;
  - disabled cursor and opacity without reducing text below readable contrast;
  - bounded loading indication;
  - error and success states that do not rely on color alone.
- [ ] Add one authoritative `@media (prefers-reduced-motion: reduce)` block that:
  - sets decorative transition/animation duration effectively to zero;
  - removes smooth scrolling;
  - prevents Story stage travel;
  - preserves all visible content and state changes.
- [ ] Run:

```bash
npm test
npm run build
```

- [ ] Repeat one menu, one Story chapter, and one optional media interaction with reduced motion enabled.
- [ ] Commit:

```bash
git add src/js/motion.js tests/motion.test.js src/styles/identity.css src/styles/components.css src/styles/home.css src/styles/story.css src/styles/results.css src/styles/schedule.css
git commit -m "feat: normalize accessible portfolio motion"
```

---

## Task 10: Complete Cross-Page Accessibility and Responsive Verification

**Files:**

- Modify as findings require: `index.html`
- Modify as findings require: `story/index.html`
- Modify as findings require: `results/index.html`
- Modify as findings require: `schedule/index.html`
- Modify as findings require: `src/styles/identity.css`
- Modify as findings require: `src/styles/components.css`
- Modify as findings require: `src/styles/home.css`
- Modify as findings require: `src/styles/story.css`
- Modify as findings require: `src/styles/results.css`
- Modify as findings require: `src/styles/schedule.css`
- Modify as findings require: `tests/site-contract.test.js`
- Create: `docs/verification/2026-07-24-editorial-orchid-verification.md`

- [ ] Run the complete automated baseline:

```bash
npm test
npm run build
```

- [ ] Start the production-like preview with `npm run preview -- --host 127.0.0.1`.
- [ ] Verify all four routes at 320, 390, 768, 1024, 1440, and 1920px.
- [ ] For every route and viewport record:
  - screenshot path;
  - horizontal overflow result;
  - heading order;
  - navigation state;
  - image crop and alt-text result;
  - 44px target result;
  - keyboard focus result;
  - reduced-motion result;
  - any issue and its correction.
- [ ] Exercise edge cases:
  - 200% text zoom at 1280px;
  - a long LinkedIn/profile URL;
  - image request failure;
  - JavaScript disabled;
  - empty calendar configuration;
  - Cal.com failure path using a temporary local test value;
  - narrow 320px mobile menu;
  - keyboard-only traversal.
- [ ] Check actual color pairs with a contrast tool; require WCAG AA for normal text and controls.
- [ ] Confirm no page contains:
  - browser-default unstyled navigation/footer controls;
  - visible placeholder labels;
  - false success states;
  - inaccurate animated metric values;
  - horizontal scrolling;
  - hidden essential content;
  - an announced but unavailable video or calendar.
- [ ] Add or tighten a regression assertion for every issue found, then make the smallest corrective code/style change.
- [ ] Re-run `npm test` and `npm run build` after all corrections.
- [ ] Write the verification report with a route-by-viewport table and the exact final test/build results.
- [ ] Review the implementation against all 19 sections of `docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`.
- [ ] Confirm the final diff contains no generated build output, local screenshots, temporary test links, or unrelated user files.
- [ ] Commit the verified finish:

```bash
git add index.html story/index.html results/index.html schedule/index.html src public tests docs/verification/2026-07-24-editorial-orchid-verification.md
git commit -m "test: verify Editorial Orchid portfolio experience"
```

---

## Definition of Done

- [ ] All four pages use the exact Editorial Orchid palette and typography.
- [ ] The custom signature, reversed signature, `S` mark, and favicon are vector-based and consistently applied.
- [ ] Home places the real portrait prominently in the hero at every supported viewport.
- [ ] The current image-only hero exposes no fake video control, while the media component is ready for a real captioned video.
- [ ] Navigation and footer are structurally and visually consistent across all pages.
- [ ] Story remains readable without JavaScript and becomes a clear editorial timeline with enhancement.
- [ ] Results exposes the strongest evidence before the detailed case study.
- [ ] Schedule defaults to a truthful LinkedIn conversation path and is ready for a confirmed calendar link.
- [ ] Every visible metric is final on first paint.
- [ ] There is no fake contact-form success behavior.
- [ ] There is no horizontal overflow from 320px through 1920px.
- [ ] Keyboard, focus, contrast, reduced motion, semantic structure, and error states pass the verification checklist.
- [ ] `npm test` and `npm run build` both pass from a clean checkout.
