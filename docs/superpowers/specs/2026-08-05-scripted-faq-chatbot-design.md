# Scripted FAQ Chatbot — Design

Date: 2026-08-05
Status: Approved

## Purpose

Give visitors a fast, self-serve way to get answers to the most common questions
(services, process, pricing, results, booking) without leaving the page or
waiting on a real reply. This is a **scripted** widget — tap-to-ask chips with
pre-written answers, no free text input, no LLM, no backend. The site has no
backend today (`.agents/context/stack-and-rules.md`) and this design keeps it
that way.

## Scope

Site-wide: all 8 build entries (`index.html`, `story/index.html`,
`results/index.html`, `schedule/index.html`, `policies/terms/index.html`,
`policies/privacy/index.html`, `policies/refunds/index.html`, `404.html`).

## Architecture

**New module**: `src/js/shared/chatbot.js`, exporting `initChatbot()` — same
shape as `initNav()` and `initScrollTop()`. It:
- Injects the trigger button and panel markup into the DOM at init time
  (not hand-copied into 8 HTML files — one source of truth for markup).
- Holds the Q&A content as an inline array of 5 entries (small enough that a
  separate data file would be premature).
- Wires click/keyboard handling and the open/closed state.

**Wiring**: `initChatbot()` is called from every page's entry point, following
the existing per-page pattern documented in `CLAUDE.md`'s File Map:
- `src/js/home/main.js`
- `src/js/story/story.js`
- `src/js/results/results.js`
- `src/js/schedule/schedule-page.js`
- `src/js/notfound/notfound.js`
- The inline `<script type="module">` blocks in the 3 `policies/*/index.html`
  pages (these already import `initNav`/`initScrollTop` directly — chatbot
  follows the same pattern rather than gaining a dedicated entry file).

**CSS**: added to `src/styles/components.css` (already loaded on every page,
alongside `identity.css` and the page stylesheet). Reuses the existing
`.bubble` / `.typing-dots` chat-bubble motif from the schedule page's Cal.com
fallback — the site already has a conversational visual language
(`#schedule.conversation` section), so this is an extension of an existing
pattern, not a new one.

## Placement

Fixed **bottom-left**, stacked directly above `.scroll-top` (also bottom-left,
`components.css:403`). This is deliberate: `#pip-wrap` (the picture-in-picture
video trigger) already owns bottom-right on `index.html` and `story/index.html`
(`components.css:843`), so bottom-right isn't free everywhere. Stacking on the
left, above `.scroll-top`, needs one CSS rule that works unmodified on all 8
pages — no per-page position overrides.

```css
.chatbot-trigger {
  position: fixed;
  left: clamp(1rem, 3vw, 2rem);
  bottom: calc(clamp(1rem, 3vw, 2rem) + 4.5rem); /* stacked above .scroll-top */
  z-index: 160; /* above .scroll-top's 150 */
}
```

## Interaction / State

Three states, no persistence (resets on reload — deliberate, avoids
localStorage complexity for a first version):

1. **Closed** — only the round trigger button is visible.
2. **Menu** — tap trigger opens panel showing 5 question chips (real
   `<button>` elements).
3. **Answered** — tap a chip shows that question + its scripted answer as chat
   bubbles (`.bubble--me` for the question, `.bubble--reply` for the answer),
   plus a CTA link relevant to that answer. An "Ask another question" chip
   returns to Menu state.

Escape key or a close button (`✕`, matching `#pip-close`'s pattern) returns to
Closed from any state.

## Content

All content is grounded in text that already exists on the site — nothing
invented, per the project's "real numbers only" invariant.

| Question | Answer source | CTA |
|---|---|---|
| What services do you offer? | `index.html` `#about-lead-gen` — outbound lead-gen, prospect enrichment, pre-sales deal architecture, MQL delivery | `/#about-lead-gen` |
| What's your process? | Same section — cadences → enterprise demos → MQL delivery → commercial handoff | `/#tools` |
| How much does it cost? | `schedule/index.html` line 40 — USD 350, 60-minute remote session, IST | `/schedule/` |
| Can I see past results? | `index.html` `#results` — 10,000+ followers, 2.1M+ impressions, case studies (Finquest, The Sales Group, Uplers & Mavlers, Ecosmob, Zinnov & Draup) | `/results/` |
| How do I book a call? | Direct CTA, no scripted answer needed | `/schedule/` |

If the USD 350 rate on `schedule/index.html` changes, this data array must be
updated in the same PR — there is no shared source of truth for that number
today, so the contract test (below) only checks the chip/data structure, not
that the number matches the schedule page live.

## Motion & Accessibility

- Transform/opacity only, `--duration-surface` (260ms) / `--ease-out` —
  matches the site's §13 motion contract, no new timing values invented.
- Gated by `prefersReducedMotion()` from `shared/motion.js`, same as every
  other animated element on the site.
- Trigger button: `aria-expanded`, `aria-controls` pointing at the panel.
- Panel: `role="dialog"`, `aria-label="Chat with Sampath Kumar's assistant"`.
- Chips and the close button are real `<button>` elements — no div-as-button.
- Escape closes the panel and returns focus to the trigger.

## Testing

- Extend `tests/site-contract.test.js` with a block asserting every one of
  the 8 pages' HTML contains the chatbot's mount point — the same pattern
  that caught the orphaned entry-script bug (`.agents/context/subsystem-notes.md`),
  so a future redesign can't silently drop the widget from a page.
- New unit test file (or block in an existing shared-module test) asserting
  the Q&A data array: exactly 5 entries, each with a non-empty `question` and
  `answer`, and that the pricing entry's answer contains "350".
- No E2E/Playwright in this repo (`package.json` — Vitest only); interaction
  behavior (open/close/chip-select) is verified manually in a browser per
  the project's UI-testing rule, not automated.

## Out of scope (explicitly not building)

- Free-text input or keyword matching.
- Any backend, API route, or LLM call.
- Cross-session memory of what the user asked.
- Analytics/tracking on chip taps.
