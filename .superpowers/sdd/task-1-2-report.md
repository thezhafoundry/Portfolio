# Editorial Orchid Tasks 1–2 Report

## Status

Completed on 2026-07-24. The red contract commit is `a21b7cf`; the completed
foundation commit is `9465e66`.

## Implementation

- Added page-foundation contracts for the approved Google Fonts request and the
  shared identity/components styles. Shared-shell assertions remain explicitly
  pending until the next implementation unit supplies that shell.
- Added self-contained asset contracts for SVG structure, outlined signature
  geometry, reversed white linework, square marks, and valid PNG derivatives.
- Drew original, outlined monoline SVG signature masters, a simplified S mark,
  and a matching protected-field favicon. PNGs are transparent raster exports
  of those SVG masters at 720px, 1440px, and 512px as required.
- Replaced the old identity system with Editorial Orchid tokens, type, reset,
  responsive editorial scale, accessibility primitives, and motion safeguards.
- Updated every route to load the single Cormorant Garamond + DM Sans request;
  Home now loads identity before components and keeps its route stylesheet last.
  Its final local overrides protect the approved type pair from the retained
  route stylesheet. Removed Home's Font Awesome dependency and substituted
  clear text arrows and a visible Menu label.

## Files

- `tests/site-contract.test.js`, `tests/brand-assets.test.js`
- `public/brand/sampath-signature.svg`
- `public/brand/sampath-signature-reversed.svg`
- `public/brand/sampath-s-mark.svg`
- `public/brand/png/sampath-signature-720.png`
- `public/brand/png/sampath-signature-1440.png`
- `public/brand/png/sampath-signature-reversed-1440.png`
- `public/brand/png/sampath-s-mark-512.png`
- `public/favicon.svg`, `src/styles/identity.css`
- `index.html`, `story/index.html`, `results/index.html`, `schedule/index.html`

## RED evidence

After creating the tests, `npm test -- --run tests/site-contract.test.js
tests/brand-assets.test.js` failed as expected: all routes lacked the approved
font request, and the planned signature and PNG files were absent (`ENOENT`).
The initial test parser issue was corrected before recording this result; the
verified RED run had 16 expected failures and no test syntax or resolution
error.

## GREEN and verification evidence

- Focused contracts: 2 files passed; 17 tests passed, 3 deferred shell tests.
- Full `npm test`: 4 files passed; 27 tests passed, 3 deferred shell tests.
- `npm run build`: passed with Vite 5.4.21.
- `git diff --check`: passed.
- Visual inspection: the 1440px primary signature and 512px S PNG render with
  coherent monoline paths, legible anchors, and correct aspect ratios.

## Self-review

- Confirmed master signatures share identical path data; only their stroke
  color differs.
- Confirmed no text/font elements, scripts, or remote asset references exist
  in brand SVGs.
- Confirmed the exact approved color and type token contract, focus ring,
  image sizing, long-link wrapping, and reduced-motion defaults are present.
- Confirmed no legacy identity token names remain in `identity.css`, and no
  Font Awesome/Fraunces/Inter imports remain in production HTML.
- Independent review was requested after the foundation commit. It confirmed
  the test/build results and identified deferred shared-shell migration work;
  Home's visible toggle, controls relationship, safer new-tab link, and font
  cascade were addressed before this final verification run.

## Concerns

None. The shared-shell work remains intentionally deferred, but all currently
loaded styles now resolve against the Editorial Orchid token system.

## Review remediation (2026-07-24)

### RED evidence

Added `tests/editorial-orchid-css.test.js` and expanded
`tests/site-contract.test.js`, then ran:

```text
npm test -- --run tests/site-contract.test.js tests/editorial-orchid-css.test.js
```

The result was 7 expected failures: every live stylesheet still had legacy
token references, gradients, raw color values, or the Home contact form still
claimed a Schedule destination while no Schedule link existed. The site-contract
assertion already passed, so the RED evidence isolated the styling/contact
regressions rather than a test harness problem.

### Fixes

- Migrated all six live stylesheets to current Editorial Orchid tokens or exact
  approved colors, using `color-mix()` only for transparent tints and shadows.
  No legacy compatibility tokens, raw RGB/RGBA colors, or gradients remain.
- Replaced the simulated Home form with honest Schedule and LinkedIn actions,
  and removed its false success JavaScript.
- Added a visible mobile Menu label and static control relationship assertion;
  the shared-shell unit will provide the final reusable navigation behavior.

### GREEN evidence and exact verification

```text
npm test -- --run tests/site-contract.test.js tests/editorial-orchid-css.test.js
```

Passed: 2 files, 12 tests passed, 3 deferred shared-shell tests.

```text
npm test
```

Passed: 5 files, 35 tests passed, 3 deferred shared-shell tests.

```text
npm run build
```

Passed with Vite 5.4.21.

```text
git diff --check
```

Passed with no whitespace errors.

### Re-review

Independent re-review of the remediation reported no critical, high, medium, or
low findings. It confirmed all route-loaded CSS uses current tokens and the
approved palette, no gradients remain, and Home provides only real Schedule and
LinkedIn actions.

## Shared-selector remediation (2026-07-24)

### RED evidence

Extended `tests/editorial-orchid-css.test.js` with live shared-class,
interface-font, and dead-code contracts, then ran:

```text
npm test -- --run tests/editorial-orchid-css.test.js tests/site-contract.test.js
```

The focused RED run failed 29 assertions for the intended reasons: 20 shared
content classes had no identity rule, eight interface selectors did not
explicitly use DM Sans, and the unreachable Font Awesome branch/obsolete form
selectors remained.

### Fixes

- Restored Editorial Orchid implementations for every live `.band*`,
  `.band-inner*`, `.label*`, `.sweep`, `.bubble*`, and `.btn*` class used by
  Story, Results, and Schedule.
- Assigned DM Sans explicitly to Home navigation, menu control, CTA, eyebrow,
  badge, partner chip, and timeline filter selectors; Cormorant Garamond remains
  reserved for headings and editorial values.
- Removed the unreachable Font Awesome toggle branch and made the existing
  toggle update `aria-expanded`.
- Removed obsolete contact-form CSS and added a compact `.contact-actions`
  layout for the real Schedule/LinkedIn actions.

### GREEN and verification evidence

```text
npm test -- --run tests/editorial-orchid-css.test.js tests/site-contract.test.js
```

Passed: 2 files, 41 tests passed, 3 deferred shared-shell tests.

```text
npm test
```

Passed: 5 files, 64 tests passed, 3 deferred shared-shell tests.

```text
npm run build
```

Passed with Vite 5.4.21.

```text
git diff --check
```

Passed with no whitespace errors.
