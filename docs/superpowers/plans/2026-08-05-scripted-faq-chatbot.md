# Scripted FAQ Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a site-wide, tap-to-ask FAQ chatbot (5 scripted questions, no free text, no backend) that mounts on all 8 pages.

**Architecture:** A shared `initChatbot()` module (`src/js/shared/chatbot.js`) wires behavior onto **static markup** that's duplicated identically in each of the 8 HTML pages — the same pattern the codebase already uses for `.nav-toggle`, `.scroll-top`, and the footer (all duplicated per-page, no templating layer exists in this Vite multi-page setup). The panel starts hidden; a chip click swaps which `.chatbot-view` is visible. Styling reuses the site's existing `.bubble`/`.bubble--reply`/`.btn--primary` classes from `identity.css` rather than inventing a new visual language.

**Tech Stack:** Vanilla JS (ES modules), plain CSS custom properties, Vitest (no jsdom — tests use hand-built element mocks, see `tests/nav.test.js` for the established pattern).

## Global Constraints

- No backend, no LLM call, no free-text input — 5 fixed Q&A pairs only (spec: Interaction/State, Out of scope).
- Pricing answer must state **USD 350 / 60-minute session (IST)** — the real number on `schedule/index.html:8,40` (spec: Content table).
- Motion: transform/opacity only, `--duration-surface` (260ms) / `--ease-out` — no new timing values (spec: Motion & Accessibility).
- Placement: fixed bottom-left, stacked above `.scroll-top` — do not use bottom-right (occupied by `#pip-wrap` on `index.html`/`story/index.html`) (spec: Placement).
- Every page must load `initChatbot()` from the shared module — do not hand-roll a second copy of the JS (spec: Architecture).

## Deviation from the approved spec

The spec (`docs/superpowers/specs/2026-08-05-scripted-faq-chatbot-design.md`) called for `chatbot.js` to **inject** the trigger/panel markup via JS, with content in a JS data array, to avoid touching 8 HTML files. Mapping that to the actual codebase during planning surfaced a conflict: every other floating control on this site (`.nav-toggle`, `.scroll-top`, `#pip-wrap`) ships as **static markup already present in each page's HTML**, with JS only wiring behavior — and the project's contract tests (`site-contract.test.js`) work by reading that static HTML as text. There's also no jsdom in this project's Vitest setup, so `chatbot.js` can't safely call `document.createElement`/`.innerHTML` and stay unit-testable the way `nav.js` is.

This plan uses static per-page markup instead (matching `.nav-toggle`/`.scroll-top`), with `chatbot.js` only toggling `hidden`/`aria-*`/classes — same shape as `initNav()`/`initScrollTop()`. Content duplication across 8 files is consistent with how the footer and nav links already work in this codebase (no templating layer exists). The spec's "unit test on the Q&A data array" becomes a `site-contract.test.js` assertion instead, since the content now lives in HTML, not a JS array. Everything else in the spec (placement, content, 5 questions, CTAs, motion, a11y) is unchanged.

---

### Task 1: `initChatbot()` shared module + unit tests

**Files:**
- Create: `src/js/shared/chatbot.js`
- Test: `tests/chatbot.test.js`

**Interfaces:**
- Produces: `initChatbot(root = document)` — exported function, same signature shape as `initNav(root = document)` in `src/js/shared/nav.js`. Called with no arguments from real pages; tests pass a mock `root`.
- Consumes: nothing from other tasks. Expects a DOM (or mock) with these elements, matching the IDs Task 3 will add to every page:
  - `#chatbot-trigger` (button, starts with `aria-expanded="false"`)
  - `#chatbot-panel` (div, starts `hidden` + `aria-hidden="true"`)
  - `#chatbot-close` (button inside the panel)
  - `#chatbot-menu` (div, one of the `.chatbot-view` elements)
  - `#chatbot-answer-services`, `#chatbot-answer-process`, `#chatbot-answer-pricing`, `#chatbot-answer-results`, `#chatbot-answer-booking` (divs, the other `.chatbot-view` elements, each `hidden` by default)
  - Elements carrying `data-chatbot-show="<id>"` (the 5 menu chips, plus one "Ask another question" chip inside each answer view, value `"menu"`)

- [ ] **Step 1: Write the failing tests**

```javascript
// tests/chatbot.test.js
import { describe, expect, it } from 'vitest';
import { initChatbot } from '../src/js/shared/chatbot.js';

function createElement() {
  const listeners = new Map();
  const classes = new Set();
  const attributes = new Map();

  return {
    hidden: false,
    focusCount: 0,
    classList: {
      contains: (name) => classes.has(name),
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
    },
    addEventListener: (event, handler) => listeners.set(event, handler),
    dispatch: (event, detail = {}) => listeners.get(event)?.(detail),
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, String(value)),
    removeAttribute: (name) => attributes.delete(name),
    focus() {
      this.focusCount += 1;
    },
  };
}

const FAQ_IDS = ['services', 'process', 'pricing', 'results', 'booking'];

function createChatbotFixture() {
  const trigger = createElement();
  const panel = createElement();
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  trigger.setAttribute('aria-expanded', 'false');

  const closeBtn = createElement();
  const menu = createElement();
  const answers = Object.fromEntries(FAQ_IDS.map((id) => [id, createElement()]));
  Object.values(answers).forEach((el) => { el.hidden = true; });

  const menuChips = FAQ_IDS.map((id) => {
    const chip = createElement();
    chip.getAttribute = (name) => (name === 'data-chatbot-show' ? id : null);
    return chip;
  });
  const backChip = createElement();
  backChip.getAttribute = (name) => (name === 'data-chatbot-show' ? 'menu' : null);
  const allChips = [...menuChips, backChip];

  const byId = {
    '#chatbot-trigger': trigger,
    '#chatbot-panel': panel,
    '#chatbot-close': closeBtn,
    '#chatbot-menu': menu,
    '#chatbot-answer-services': answers.services,
    '#chatbot-answer-process': answers.process,
    '#chatbot-answer-pricing': answers.pricing,
    '#chatbot-answer-results': answers.results,
    '#chatbot-answer-booking': answers.booking,
  };

  const documentListeners = new Map();
  const root = {
    nodeType: 9,
    addEventListener: (event, handler) => documentListeners.set(event, handler),
    dispatch: (event, detail = {}) => documentListeners.get(event)?.(detail),
    querySelector: (selector) => byId[selector] ?? null,
    querySelectorAll: (selector) => (selector === '[data-chatbot-show]' ? allChips : []),
  };

  return { answers, backChip, closeBtn, menu, menuChips, panel, root, trigger };
}

describe('initChatbot', () => {
  it('opens the panel and shows the menu view', () => {
    const { menu, panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    expect(menu.hidden).toBe(false);
  });

  it('closes the panel when the trigger is clicked again', () => {
    const { panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    trigger.dispatch('click');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  it('switches to the matching answer view when a chip is clicked', () => {
    const { answers, menu, menuChips, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    menuChips[2].dispatch('click'); // pricing

    expect(menu.hidden).toBe(true);
    expect(answers.pricing.hidden).toBe(false);
    expect(answers.services.hidden).toBe(true);
  });

  it('returns to the menu view from the "ask another question" chip', () => {
    const { answers, backChip, menu, menuChips, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    menuChips[0].dispatch('click'); // services
    backChip.dispatch('click');

    expect(menu.hidden).toBe(false);
    expect(answers.services.hidden).toBe(true);
  });

  it('closes the panel via the close button', () => {
    const { closeBtn, panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    closeBtn.dispatch('click');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  it('closes on Escape and restores focus to the trigger', () => {
    const { panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    root.dispatch('keydown', { key: 'Escape' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.focusCount).toBe(1);
  });

  it('exits safely when the chatbot markup is absent', () => {
    expect(() => initChatbot({ querySelector: () => null, querySelectorAll: () => [] })).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/chatbot.test.js`
Expected: FAIL — `Cannot find module '../src/js/shared/chatbot.js'` (the module doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```javascript
// src/js/shared/chatbot.js
const FAQ_IDS = ['services', 'process', 'pricing', 'results', 'booking'];

export function initChatbot(root = document) {
  const trigger = root.querySelector('#chatbot-trigger');
  const panel = root.querySelector('#chatbot-panel');
  const closeBtn = root.querySelector('#chatbot-close');
  const menu = root.querySelector('#chatbot-menu');
  const ownerDocument = root.nodeType === 9 ? root : root.ownerDocument;

  if (!trigger || !panel || !closeBtn || !menu || !ownerDocument) return;

  const answers = FAQ_IDS
    .map((id) => root.querySelector(`#chatbot-answer-${id}`))
    .filter(Boolean);
  const views = [menu, ...answers];

  const showView = (target) => {
    views.forEach((view) => {
      view.hidden = view !== target;
    });
  };

  const open = () => {
    showView(menu);
    panel.removeAttribute('hidden');
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => panel.classList.add('chatbot-panel--open'));
    } else {
      panel.classList.add('chatbot-panel--open');
    }
  };

  const close = () => {
    panel.classList.remove('chatbot-panel--open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    panel.addEventListener('transitionend', () => {
      if (!panel.classList.contains('chatbot-panel--open')) {
        panel.setAttribute('hidden', '');
        panel.hidden = true;
      }
    }, { once: true });
  };

  trigger.addEventListener('click', () => {
    trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  closeBtn.addEventListener('click', () => close());

  root.querySelectorAll('[data-chatbot-show]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const targetId = chip.getAttribute('data-chatbot-show');
      const target = targetId === 'menu'
        ? menu
        : root.querySelector(`#chatbot-answer-${targetId}`);
      if (target) showView(target);
    });
  });

  ownerDocument.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      close();
      trigger.focus();
    }
  });
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/chatbot.test.js`
Expected: PASS — all 7 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/js/shared/chatbot.js tests/chatbot.test.js
git commit -m "feat: add scripted FAQ chatbot behavior module"
```

---

### Task 2: Chatbot styling

**Files:**
- Modify: `src/styles/components.css` (insert new section immediately after the `.scroll-top:focus-visible` rule, currently ending around line 453, and before the `/* Shared action states. */` comment)

**Interfaces:**
- Consumes: class names from Task 1's markup contract (`.chatbot-trigger`, `.chatbot-panel`, `.chatbot-panel--open`, `.chatbot-panel__head`, `.chatbot-panel__title`, `.chatbot-panel__close`, `.chatbot-view`, `.chatbot-chip`, `.chatbot-answer`, `.chatbot-answer__cta`) and Task 1's behavior contract (`aria-expanded="true"` on `#chatbot-trigger` toggles `.chatbot-panel--open` via JS).
- Consumes: existing tokens from `src/styles/identity.css` (`--color-*`, `--duration-*`, `--ease-out`, `--radius-media`, `--focus-ring`) and existing classes `.bubble`, `.bubble--me`, `.bubble--reply`, `.btn`, `.btn--primary` (already defined there — this task does not touch `identity.css`).
- Produces: nothing consumed by later tasks (Task 3 only needs these class names to exist in markup, which it writes itself).

- [ ] **Step 1: Insert the CSS**

Insert this block into `src/styles/components.css`, directly after the existing `.scroll-top:focus-visible { ... }` rule and before the `/* Shared action states. */` comment:

```css
/* -----------------------------------------------------------------------
   Scripted FAQ chatbot
   Fixed trigger stacked above .scroll-top (both bottom-left, all pages) —
   #pip-wrap already owns bottom-right on index.html/story/index.html.
   Expands into a panel of tap-to-ask chips; no free text, no backend.
   -------------------------------------------------------------------------- */

.chatbot-trigger {
  position: fixed;
  left: clamp(1rem, 3vw, 2rem);
  bottom: calc(clamp(1rem, 3vw, 2rem) + 4.5rem);
  z-index: 160;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid color-mix(in srgb, var(--color-deep-violet) 22%, transparent);
  border-radius: 999px;
  background: var(--color-deep-violet);
  color: var(--color-white);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-deep-violet) 30%, transparent);
  cursor: pointer;
  transition: transform var(--duration-hover) var(--ease-out),
    background var(--duration-hover) var(--ease-out);
}

.chatbot-trigger__icon {
  width: 1.3rem;
  height: 1.3rem;
  fill: currentColor;
}

@media (hover: hover) and (pointer: fine) {
  .chatbot-trigger:hover {
    background: var(--color-violet);
    transform: translateY(-2px);
  }
}

.chatbot-trigger:active {
  transform: scale(0.94);
}

.chatbot-trigger:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.chatbot-trigger[aria-expanded="true"] {
  background: var(--color-violet);
}

.chatbot-panel {
  position: fixed;
  left: clamp(1rem, 3vw, 2rem);
  bottom: calc(clamp(1rem, 3vw, 2rem) + 8.5rem);
  z-index: 160;
  width: min(21rem, calc(100vw - 2 * clamp(1rem, 3vw, 2rem)));
  max-height: min(28rem, calc(100vh - 10rem));
  display: flex;
  flex-direction: column;
  background: var(--color-canvas);
  border: 1px solid var(--color-highlight);
  border-radius: var(--radius-media);
  box-shadow:
    0 4px 16px color-mix(in srgb, var(--color-deep-violet) 14%, transparent),
    0 16px 48px color-mix(in srgb, var(--color-deep-violet) 20%, transparent);
  opacity: 0;
  transform: translateY(0.75rem) scale(0.96);
  transform-origin: bottom left;
  transition: opacity var(--duration-surface) var(--ease-out),
    transform var(--duration-surface) var(--ease-out);
}

.chatbot-panel[hidden] {
  display: none;
}

.chatbot-panel.chatbot-panel--open {
  opacity: 1;
  transform: none;
}

.chatbot-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--color-highlight);
}

.chatbot-panel__title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--color-deep-violet);
}

.chatbot-panel__close {
  border: none;
  background: none;
  color: var(--color-deep-violet);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem;
}

.chatbot-panel__close:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.chatbot-view {
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.chatbot-view[hidden] {
  display: none;
}

.chatbot-chip {
  text-align: left;
  border: 1px solid color-mix(in srgb, var(--color-deep-violet) 20%, transparent);
  border-radius: 999px;
  padding: 0.6rem 1rem;
  background: var(--color-section);
  color: var(--color-deep-violet);
  font-family: var(--font-body);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background var(--duration-hover) var(--ease-out),
    border-color var(--duration-hover) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .chatbot-chip:hover {
    background: var(--color-highlight);
    border-color: var(--color-violet);
  }
}

.chatbot-chip:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.chatbot-answer .bubble {
  font-size: 0.9rem;
}

.chatbot-answer__cta {
  align-self: flex-start;
}
```

- [ ] **Step 2: Visually spot-check in isolation**

There's no automated CSS test in this repo for new component styles (`editorial-orchid-css.test.js` covers only existing tokens/classes). Run `npm run dev`, open `http://localhost:5173`, and confirm in devtools that `.chatbot-trigger` and `.chatbot-panel` compute the expected fixed position and colors — full interactive verification happens in Task 4 once markup exists.

- [ ] **Step 3: Commit**

```bash
git add src/styles/components.css
git commit -m "style: add scripted FAQ chatbot styles"
```

---

### Task 3: Wire markup + `initChatbot()` into all 8 pages, extend contract tests

**Files:**
- Modify: `index.html`, `story/index.html`, `results/index.html`, `schedule/index.html`, `policies/terms/index.html`, `policies/privacy/index.html`, `policies/refunds/index.html`, `404.html`
- Modify: `src/js/home/main.js`, `src/js/story/story.js`, `src/js/results/results.js`, `src/js/schedule/schedule-page.js`, `src/js/notfound/notfound.js`
- Modify: `tests/site-contract.test.js`

**Interfaces:**
- Consumes: `initChatbot` from `src/js/shared/chatbot.js` (Task 1); `.chatbot-*` class names (Task 2, for styling only — no interface dependency).
- Produces: nothing consumed by later tasks (this is the last code task).

- [ ] **Step 1: Add the markup block to every page**

Insert this HTML immediately before the closing `</body>` tag in all 8 files (`index.html`, `story/index.html`, `results/index.html`, `schedule/index.html`, `policies/terms/index.html`, `policies/privacy/index.html`, `policies/refunds/index.html`, `404.html`) — after the existing `<button class="scroll-top">...</button>` block where one is present:

```html
  <button id="chatbot-trigger" type="button" class="chatbot-trigger" aria-expanded="false" aria-controls="chatbot-panel" aria-label="Chat with Sampath Kumar's assistant">
    <svg class="chatbot-trigger__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
  </button>

  <div id="chatbot-panel" class="chatbot-panel" role="dialog" aria-label="Chat with Sampath Kumar's assistant" aria-hidden="true" hidden>
    <div class="chatbot-panel__head">
      <p class="chatbot-panel__title">Ask a quick question</p>
      <button id="chatbot-close" type="button" class="chatbot-panel__close" aria-label="Close chat">&#10005;</button>
    </div>

    <div id="chatbot-menu" class="chatbot-view">
      <button type="button" class="chatbot-chip" data-chatbot-show="services">What services do you offer?</button>
      <button type="button" class="chatbot-chip" data-chatbot-show="process">What's your process?</button>
      <button type="button" class="chatbot-chip" data-chatbot-show="pricing">How much does it cost?</button>
      <button type="button" class="chatbot-chip" data-chatbot-show="results">Can I see past results?</button>
      <button type="button" class="chatbot-chip" data-chatbot-show="booking">How do I book a call?</button>
    </div>

    <div id="chatbot-answer-services" class="chatbot-view chatbot-answer" hidden>
      <p class="bubble bubble--me">What services do you offer?</p>
      <p class="bubble bubble--reply">I run outbound B2B &amp; B2C lead generation, automated prospect enrichment, and pre-sales deal architecture &mdash; from cold email and LinkedIn cadences through enterprise solution demos to MQL delivery and commercial proposal handoff.</p>
      <a class="btn btn--primary chatbot-answer__cta" href="/#about-lead-gen">Read more</a>
      <button type="button" class="chatbot-chip chatbot-chip--back" data-chatbot-show="menu">Ask another question</button>
    </div>

    <div id="chatbot-answer-process" class="chatbot-view chatbot-answer" hidden>
      <p class="bubble bubble--me">What's your process?</p>
      <p class="bubble bubble--reply">Multi-channel outbound cadences open qualified conversations, which move into enterprise solution demos, then MQL delivery and a commercial proposal handoff.</p>
      <a class="btn btn--primary chatbot-answer__cta" href="/#tools">See the tools</a>
      <button type="button" class="chatbot-chip chatbot-chip--back" data-chatbot-show="menu">Ask another question</button>
    </div>

    <div id="chatbot-answer-pricing" class="chatbot-view chatbot-answer" hidden>
      <p class="bubble bubble--me">How much does it cost?</p>
      <p class="bubble bubble--reply">USD 350 for a single 60-minute remote consulting session, scheduled on Indian Standard Time (IST).</p>
      <a class="btn btn--primary chatbot-answer__cta" href="/schedule/">Book a session</a>
      <button type="button" class="chatbot-chip chatbot-chip--back" data-chatbot-show="menu">Ask another question</button>
    </div>

    <div id="chatbot-answer-results" class="chatbot-view chatbot-answer" hidden>
      <p class="bubble bubble--me">Can I see past results?</p>
      <p class="bubble bubble--reply">10,000+ followers and 2.1M+ impressions, plus case studies like a 200M+ record M&amp;A sourcing engine built for Finquest.</p>
      <a class="btn btn--primary chatbot-answer__cta" href="/results/">View case studies</a>
      <button type="button" class="chatbot-chip chatbot-chip--back" data-chatbot-show="menu">Ask another question</button>
    </div>

    <div id="chatbot-answer-booking" class="chatbot-view chatbot-answer" hidden>
      <p class="bubble bubble--me">How do I book a call?</p>
      <p class="bubble bubble--reply">Head to the schedule page to pick a time &mdash; sessions run on Indian Standard Time (IST).</p>
      <a class="btn btn--primary chatbot-answer__cta" href="/schedule/">Go to the schedule page</a>
      <button type="button" class="chatbot-chip chatbot-chip--back" data-chatbot-show="menu">Ask another question</button>
    </div>
  </div>
```

Exact insertion point per file (the line immediately after this line is where the block above goes):

| File | Insert immediately after |
|---|---|
| `index.html` | the closing `</div>` of `#pip-wrap` — i.e. directly before `<script type="module">import { initPip } from '/src/js/shared/pip-video.js'; initPip({ revealAfter: '.louver-hero' });</script>` |
| `story/index.html` | the closing `</div>` of `#pip-wrap` — directly before `<script type="module" src="/src/js/story/story.js"></script>` |
| `results/index.html` | the `<button type="button" class="scroll-top">...</button>` block — directly before `<script type="module" src="/src/js/results/results.js"></script>` |
| `schedule/index.html` | the `<button type="button" class="scroll-top">...</button>` block — directly before `<script type="module" src="/src/js/schedule/schedule-page.js"></script>` |
| `policies/terms/index.html` | the `<button type="button" class="scroll-top">...</button>` block — directly before the inline `<script type="module">` |
| `policies/privacy/index.html` | same as `policies/terms/index.html` |
| `policies/refunds/index.html` | same as `policies/terms/index.html` |
| `404.html` | the `<button type="button" class="scroll-top">...</button>` block — directly before `<script type="module" src="/src/js/notfound/notfound.js"></script>` |

In every case the block lands right before `</body>`, after whatever fixed-position controls the page already has.

- [ ] **Step 2: Wire `initChatbot()` into each entry script**

In `src/js/home/main.js`, add the import and call:

```javascript
import { initChatbot } from '../shared/chatbot.js';
```

Add near the top with the other imports, and add `initChatbot();` inside the existing `DOMContentLoaded` handler, alongside `initNav();`.

In `src/js/story/story.js`, `src/js/results/results.js`, and `src/js/schedule/schedule-page.js` (all three call `initNav()` directly at module top level, no `DOMContentLoaded` wrapper), add:

```javascript
import { initChatbot } from '../shared/chatbot.js';
```

and add `initChatbot();` directly after the existing `initNav();` call.

In `src/js/notfound/notfound.js`:

```javascript
import { initNav } from '../shared/nav.js';
import { initScrollTop } from '../shared/scroll-top.js';
import { initChatbot } from '../shared/chatbot.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollTop();
  initChatbot();
});
```

For the 3 policy pages (`policies/terms/index.html`, `policies/privacy/index.html`, `policies/refunds/index.html`), find their inline `<script type="module">` block (it currently imports `initNav` and `initScrollTop` directly, per `policies/terms/index.html:97-99`) and add:

```html
    import { initChatbot } from '/src/js/shared/chatbot.js';
```

next to the existing imports, and call `initChatbot();` alongside the existing `initNav();`/`initScrollTop();` calls in that same script block.

- [ ] **Step 3: Extend `tests/site-contract.test.js`**

Add this new `describe` block at the end of the file:

```javascript
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
```

- [ ] **Step 4: Run the full suite**

Run: `npm test`
Expected: all suites PASS, including the new `Chatbot widget` block (8 + 2 = 10 new passing assertions) and the existing `chatbot.test.js` from Task 1.

- [ ] **Step 5: Commit**

```bash
git add index.html story/index.html results/index.html schedule/index.html \
  policies/terms/index.html policies/privacy/index.html policies/refunds/index.html 404.html \
  src/js/home/main.js src/js/story/story.js src/js/results/results.js \
  src/js/schedule/schedule-page.js src/js/notfound/notfound.js \
  tests/site-contract.test.js
git commit -m "feat: wire scripted FAQ chatbot into every page"
```

---

### Task 4: Manual verification

No new step here is automatable — this project has no Playwright/E2E layer (`package.json` lists only `vite`/`vitest`), so interaction, motion, and responsive behavior must be checked by hand per the project's UI-testing rule (render it and look, don't just claim it works).

**Files:** none (verification only).

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`

- [ ] **Step 2: Check the widget on the homepage**

Open `http://localhost:5173`. Confirm:
- The chat trigger sits bottom-left, stacked above (not overlapping) the scroll-to-top button once you scroll to the footer.
- Clicking the trigger opens the panel showing all 5 chips.
- Clicking each of the 5 chips shows the matching question/answer bubbles and a working CTA link.
- "Ask another question" returns to the chip menu.
- The close button and the Escape key both close the panel.
- Tab order reaches the trigger, then (once open) the close button and chips, in a sane order; each has a visible focus ring.

- [ ] **Step 3: Check breakpoints**

Resize (or use devtools device toolbar) to 320px, 768px, 1024px, and 1440px widths. Confirm the panel never overflows the viewport horizontally and stays scrollable if content exceeds `max-height`.

- [ ] **Step 4: Check reduced motion**

Enable "prefers reduced motion" (macOS: System Settings > Accessibility > Display; or devtools > Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce`). Confirm the panel still opens/closes (content and state preserved) without the slide/scale transition — this is handled by `identity.css`'s existing global reduced-motion kill-switch, not new code, but must be visually confirmed.

- [ ] **Step 5: Check the other 7 pages**

Repeat a quick trigger-open-close check on `/story/`, `/results/`, `/schedule/`, `/policies/terms/`, `/policies/privacy/`, `/policies/refunds/`, and a 404 URL (e.g. `/does-not-exist`). Confirm the widget mounts identically on each and doesn't collide with `#pip-wrap` on `/` and `/story/`.

- [ ] **Step 6: Production build sanity check**

Run: `npm run build`
Expected: build succeeds with no errors (this also validates the `vite.config.js` `rollupOptions.input` entries are all still wired correctly).
