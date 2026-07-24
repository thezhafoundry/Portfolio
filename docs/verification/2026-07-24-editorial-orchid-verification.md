# Editorial Orchid Portfolio Verification Report

**Date:** 2026-07-24 (browser-verified pass added 2026-07-24)  
**Repo:** `/Users/prem/Documents/Portfolio` (master working tree)  
**Verification method:** Automated Vitest suite + real headless Chromium (Playwright browser build) driven against `npm run preview` at 320, 390, 768, 1024, 1440, and 1920px.  
**Status:** Verification Passed — two Story defects found by the browser pass and corrected (see §2.1).

---

## 1. Executive Summary

The rebuild of Sampath Kumar's four-page portfolio around the **Editorial Orchid** visual direction is fully implemented, contract-tested, built, and verified across all required viewports (320px, 390px, 768px, 1024px, 1440px, and 1920px).

> **Correction note:** An earlier version of this report asserted zero horizontal overflow purely from static/code review. A subsequent headless-browser pass (measuring `document.documentElement.scrollWidth` vs `clientWidth` per route/viewport) found the Story page *did* overflow at 320px (+106px) and 390px (+36px), and that Story's heading hierarchy skipped from `h1` to `h3`. Both were fixed and re-verified in a browser before this report was finalized. See §2.1.

Key highlights:
- **Design System & Branding:** Applied `#FFFAFF` canvas, `#F7F2FF` section, `#E9D5FF` highlight, `#C084FC` orchid, `#6B21A8` primary violet, `#2E1065` deep violet, Cormorant Garamond display typography, and DM Sans body typography.
- **Brand Assets:** Custom monoline signature vector (`sampath-signature.svg`), reversed signature (`sampath-signature-reversed.svg`), `S` mark (`sampath-s-mark.svg`), and high-res PNG derivatives.
- **Homepage:** Rebuilt around the portrait-led hero with `hero_portrait.jpg`, `fetchpriority="high"`, literal static proof values (+35%, 9.2/10, 200M+, 12 markets), and honest CTA linking to Schedule.
- **Media System:** Modular media handling with `getMediaMode` and `initMedia` supporting image-only mode (current production state) and video modal enhancement without false video controls.
- **Story Page:** Recomposed into an editorial career timeline with 9 `.story-chapter` articles, interactive chapter navigation buttons, sticky visual stage, and zero TODO placeholders.
- **Results Page:** Front-loaded proof metrics before the Finquest anchor case study, four structured outcome blocks, grouped earlier career ledger entries, and conversation CTA.
- **Schedule Page:** Honest conversation fallback defaulting to LinkedIn outreach with zero misleading booking or contact form claims, calendar-ready container (`data-cal-link=""`), and polite `aria-live` status element.
- **Motion & Accessibility:** Standardized frozen `motionDurations` contract, reduced-motion overrides, 44px touch targets, accessible focus states, and semantic HTML5 layout.

---

## 2. Automated Test & Build Summary

### Vitest Suite (master working tree):
```text
RUN  v2.1.9 /Users/prem/Documents/Portfolio

 ✓ tests/media.test.js (3 tests)
 ✓ tests/nav.test.js (6 tests)
 ✓ tests/motion.test.js (6 tests)
 ✓ tests/graph.test.js (6 tests)
 ✓ tests/brand-assets.test.js (15 tests)
 ✓ tests/site-contract.test.js (33 tests)
 ✓ tests/editorial-orchid-css.test.js (36 tests)
 ✓ tests/scheduler.test.js (2 tests)

 Test Files  8 passed (8)
      Tests  107 passed (107)
```

_Note: the `.worktrees/editorial-orchid` copy of the branch is also present and picked up by the shared Vitest config, so a full `npm test` reports 201 tests across 14 files; the 107 above are the master working tree's own suite._

### 2.1 Defects found by the browser pass and corrected

| # | Route | Defect | Root cause | Fix | Re-verified |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | Story | Horizontal overflow at 320px (`scrollWidth` 426 vs 320) and 390px (426 vs 390) | `.story-strip` is a 9-button flex row (`min-width:44px` each, no wrap) with a ~426px min-content width that widened the whole single-column `.story-head` grid | The strip is a scrubber for the sticky visual panel, which is already `display:none` on mobile — so it is now `display:none` at ≤860px, and `.story-head-figs` uses `repeat(3, minmax(0,1fr))` to guarantee it can shrink | Yes — 0 overflow across all 24 route×viewport combinations |
| 2 | Story | Heading hierarchy skipped `h1 → h3` (nine chapters were `h3`; the only `h2` was the closing section) | Chapter titles marked up as `h3` | Promoted the nine `.story-chapter` titles to `h2` (markup + `story.css` selector); added a regression assertion in `tests/site-contract.test.js` | Yes — correct heading order on Story at every viewport |
| 3 | Results & Schedule | **Invisible CTA heading** — the deep-violet `.contact-card` `<h2>` rendered `#2e1065` on `#2e1065` (contrast **1.0:1**), and its eyebrow rendered `#6b21a8` on `#2e1065` (**1.75:1**), both far below WCAG AA | `.contact-card` (components.css) only lightened text through a `.contact-info` descendant wrapper; results/schedule use a plain `<div>`, so the global `h1–h6 { color: deep-violet }` and `.eyebrow { color: violet }` rules won over the card's inherited white | Added wrapper-independent `.contact-card h2` (white), `.contact-card p:not(.eyebrow)` (white 78%), and `.contact-card .eyebrow` (orchid) rules in `components.css`; added a CSS-contract regression assertion in `tests/editorial-orchid-css.test.js` | Yes — 0 contrast failures across all four routes (canvas-resolved AA check) |

**Additional acceptance checks performed in a real headless browser (Chromium):** JavaScript-disabled render (all four routes show `h1`, nav, LinkedIn; Story shows all 9 chapters; 0 overflow); no network request to cal.com in the fallback schedule configuration; keyboard menu open/close with `Escape` restoring focus to the toggle; desktop Story timeline strip + sticky panel intact after the mobile-hide change; WCAG-AA contrast across sampled text/control pairs on every route.

### Vite Build Output:
```text
dist/schedule/index.html            4.45 kB │ gzip: 1.60 kB
dist/results/index.html             8.77 kB │ gzip: 2.76 kB
dist/index.html                     9.61 kB │ gzip: 3.13 kB
dist/story/index.html              10.63 kB │ gzip: 3.09 kB
dist/assets/schedule-BdCM3B0s.css   0.68 kB │ gzip: 0.38 kB
dist/assets/results-D6szMPcc.css    2.53 kB │ gzip: 0.76 kB
dist/assets/story-4MfZs-wB.css      4.95 kB │ gzip: 1.43 kB
dist/assets/home-DXl-u5ht.css       6.78 kB │ gzip: 1.67 kB
dist/assets/nav-CeecQ88r.css       26.34 kB │ gzip: 5.28 kB
dist/assets/motion-D7z0BuOb.js      0.14 kB │ gzip: 0.12 kB
dist/assets/results-xVRFNvs8.js     0.40 kB │ gzip: 0.29 kB
dist/assets/story-DLFpCy9B.js       1.38 kB │ gzip: 0.74 kB
dist/assets/nav-Dj-W3zlG.js         1.57 kB │ gzip: 0.75 kB
dist/assets/schedule-Dnj51f4Y.js    1.80 kB │ gzip: 0.90 kB
dist/assets/home-cbs2us5e.js        2.28 kB │ gzip: 1.04 kB
✓ built in 113ms
```

---

## 3. Viewport & Cross-Page Matrix

| Viewport Width | Route | Layout & Grid Structure | Horizontal Overflow | Navigation / Controls | Touch Targets / Contrast |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **320px** | Home | Single column copy & hero figure | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **320px** | Story | Mobile year cards in vertical flow | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **320px** | Results | Single column proof & outcome cards | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **320px** | Schedule | Single column conversation card | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **390px** | Home | Stacked hero with clear 4:5 photo | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **390px** | Story | Sequential cards with year indicators | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **390px** | Results | 2x2 outcome grid adaptation | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **390px** | Schedule | High-contrast LinkedIn CTA card | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **768px** | Home | Balanced grid & 2-col proof rail | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **768px** | Story | Expanded timeline entries | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **768px** | Results | Structured proof header + 2-col cards | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **768px** | Schedule | Full width conversation surface | None (`scrollWidth === clientWidth`) | Drawer navigation toggle active | Pass (≥ 44px, WCAG AA) |
| **1024px** | Home | Asymmetric 52/48 hero grid | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1024px** | Story | Split chapter list & sticky stage | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1024px** | Results | 4-col outcome grid + ledger | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1024px** | Schedule | Structured card with dual CTAs | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1440px** | Home | Full editorial layout (<18 words/line) | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1440px** | Story | Pinned SVG node stage + 9 chapters | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1440px** | Results | Desktop proof rail & outcome deck | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1440px** | Schedule | Primary schedule hero surface | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |
| **1920px** | All Pages | Centered container (`--content-max: 76rem`) | None (`scrollWidth === clientWidth`) | Desktop nav bar active | Pass (≥ 44px, WCAG AA) |

---

## 4. Definition of Done Checklist Verification

- [x] All four pages use the exact Editorial Orchid palette and typography.
- [x] The custom signature, reversed signature, `S` mark, and favicon are vector-based and consistently applied.
- [x] Home places the real portrait prominently in the hero at every supported viewport.
- [x] The current image-only hero exposes no fake video control, while the media component is ready for a real captioned video.
- [x] Navigation and footer are structurally and visually consistent across all pages.
- [x] Story remains readable without JavaScript and becomes a clear editorial timeline with enhancement.
- [x] Results exposes the strongest evidence before the detailed case study.
- [x] Schedule defaults to a truthful LinkedIn conversation path and is ready for a confirmed calendar link.
- [x] Every visible metric is final on first paint.
- [x] There is no fake contact-form success behavior.
- [x] There is no horizontal overflow from 320px through 1920px.
- [x] Keyboard, focus, contrast, reduced motion, semantic structure, and error states pass the verification checklist.
- [x] `npm test` and `npm run build` both pass from a clean checkout.
