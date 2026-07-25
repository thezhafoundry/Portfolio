# Active Roadmap & Technical Debt

## Backlog
Real-content placeholders, each marked `TODO(spec §N.M)` inline — search the
codebase for `TODO(spec` before assuming a section is launch-ready:

| task | location | priority |
|---|---|---|
| Portrait cutout + casual photo | `public/assets/`, wired into `index.html` `.hero-silhouette` and `story/index.html` `.story-photo-slot` | blocks launch |
| Testimonials (named, permitted) | uncomment blocks in `index.html` and `results/index.html` | blocks launch |
| ~~Follower history data points~~ | **Built 2026-07-25** as a spring-driven count-up on `/results/` (`#follower-card`, `data-target="8331"`). The optional `data-points` SVG curve path in `renderFollowerCard` is still unused — adding real history data would light it up. | nice-to-have |
| Cal.com link | `data-cal-link` in `schedule/index.html` (e.g. `sampath-kumar/30min`) — fallback shows until set | blocks launch |
| CV PDF + public email | drop `cv.pdf` in `public/assets/`, uncomment CV/email links in `schedule/index.html` | blocks launch |
| Pivot pull-quote (Sampath's own words) | replace placeholder in `story/index.html` `.pivot` | blocks launch |

## Known Tech Debt
- ~~Homepage design-system divergence~~ — **resolved 2026-07-25**, all four
  pages are on Editorial Orchid. See [[subsystem-notes]].
- ~~`src/js/home.js` orphaned~~ — deleted 2026-07-25 (`8b8bf44`).
  `src/styles/home.css` is **live** (loaded by `index.html`); the old note
  claiming it was orphaned was wrong.
- ~~`src/js/graph.js` is dead code~~ — **resolved 2026-07-25**; it has a live
  caller again in `results.js`. `countUpValue`/`easeOutCubic` are now used only
  by their own tests (the counter interpolates linearly, because the spring is
  already the easing curve) — keep them or prune deliberately, don't assume
  they are load-bearing.
- ~~Stale worktree~~ — **removed 2026-07-25.** `.worktrees/editorial-orchid`
  is gone from disk. Its work was snapshotted to commit `a94a950` on branch
  `codex/editorial-orchid`, which is **not merged to master** (master is well
  ahead of it — the branch lacks ~2,910 lines master has). Delete the branch
  with `git branch -D codex/editorial-orchid` if it is confirmed unwanted.
  The `.worktrees/**` vitest exclude in `vite.config.js` stays as a guard.
- The README still describes the pre-Editorial-Orchid design (item 3 references
  a follower count-up that no longer exists). Needs a pass.
- No lint or typecheck tooling configured (no ESLint config, no TS) — style
  consistency is currently manual-review-only.
