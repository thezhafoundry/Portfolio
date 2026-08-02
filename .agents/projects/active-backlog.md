# Active Roadmap & Technical Debt

## Backlog
Verified 2026-08-02 against the live HTML — no `TODO(spec` markers remain
anywhere in the codebase (confirm with a repo-wide grep before trusting this
list; it decays).

| task | location | priority |
|---|---|---|
| Cal.com link | `data-cal-link` in `schedule/index.html` — empty today, so `/schedule/` renders the LinkedIn/phone fallback instead of a live calendar | **blocks launch — the only remaining blocker** |
| Live Razorpay payment link | `/schedule/` currently states "payment link will be added after approval" by design — see `docs/superpowers/specs/2026-08-02-payment-readiness-pages-design.md` §Out of scope | blocked on client completing Razorpay KYC + international-payments approval, not on this repo |
| ~~Follower history data points~~ | Spring-driven count-up on `/results/` (`#follower-card`, `data-target="8331"`) has shipped since 2026-07-25 and was **re-verified working 2026-08-02** after a wiring regression was fixed (see [[subsystem-notes]]). The optional `data-points` SVG curve path in `renderFollowerCard` is still unused — adding real history data would light it up. | nice-to-have |
| No Playwright / visual-regression tooling | `rules/web/testing.md` wants breakpoint screenshots; this repo has none configured | nice-to-have |
| No lint/typecheck tooling | no ESLint config, no TS — style consistency is manual-review-only | nice-to-have |

## Known Tech Debt
- ~~`components.css` carried ~900 lines of dead "Violet Gradient Hero" CSS~~ —
  **removed 2026-07-26** (redesign audit). That era's markup (`.hero-grid`,
  `.service-card`, `.accordion-item`, `.timeline-card`, `.partners-section`,
  `.about-grid`, `.footer-display-title`, etc. — 69 selectors) had zero live
  callers in any of the four pages' HTML or in `src/js/*.js`; only
  `.contact-card` and `.contact-actions` from that block were still live and
  were kept. File dropped from 1615 → 722 lines. A stale
  `describe('Interface typography', ...)` block in
  `tests/editorial-orchid-css.test.js` that asserted font rules on those same
  dead selectors was removed too — it was passing only because the dead CSS
  still existed to satisfy it. Before assuming any class in `components.css`
  is live, grep the four HTML pages for the exact token — several other
  historical redesigns (see `docs/superpowers/plans/`) may have left similar
  debris.
- Added a custom `404.html` (root, registered in `vite.config.js`
  `rollupOptions.input.notFound`, styled by `src/styles/notfound.css`) — the
  site previously had no branded not-found page. Netlify/Vercel both
  auto-serve a root-level `404.html` for unmatched routes with zero extra
  config. Added to the `pages` array in `tests/site-contract.test.js` so it
  stays covered by the shared header/nav/footer/typography contract.
- ~~Homepage design-system divergence~~ — **resolved 2026-07-25**, all four
  pages are on Editorial Orchid. See [[subsystem-notes]].
- ~~`src/js/home.js` orphaned~~ — deleted 2026-07-25 (`8b8bf44`).
  `src/styles/home.css` is **live** (loaded by `index.html`); the old note
  claiming it was orphaned was wrong.
- ~~`src/js/graph.js` is dead code~~ — flagged resolved 2026-07-25 because it
  had a live caller in `results.js`, but that was only half the picture:
  `results.js` itself stopped being loaded by any page on 2026-07-31 (a bulk
  redesign swapped `results/index.html`'s script tag to `main.js`) and nobody
  noticed for a week. **Actually fixed 2026-08-02** — see [[subsystem-notes]]
  for the full story and the new contract test that guards against a repeat.
  `countUpValue`/`easeOutCubic` in `results/graph.js` are still used only by
  their own tests (the counter interpolates linearly, because the spring is
  already the easing curve) — keep them or prune deliberately, don't assume
  they are load-bearing.
- ~~Stale worktree~~ — **removed 2026-07-25.** `.worktrees/editorial-orchid`
  is gone from disk. Its work was snapshotted to commit `a94a950` on branch
  `codex/editorial-orchid`, which is **not merged to master** (master is well
  ahead of it — the branch lacks ~2,910 lines master has). Delete the branch
  with `git branch -D codex/editorial-orchid` if it is confirmed unwanted.
  The `.worktrees/**` vitest exclude in `vite.config.js` stays as a guard.
- ~~README described the pre-Editorial-Orchid design~~ — **rewritten
  2026-08-02** to match current pages, structure, and the Cal.com blocker.
