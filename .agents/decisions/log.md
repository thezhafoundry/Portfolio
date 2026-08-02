# Historical Decisions & Migrations

## Migration Index
No DB/schema migrations — this is a static site. Instead, track design-system
iterations (all 2026-07-22 unless noted), oldest first:

| date | commit | what changed |
|---|---|---|
| 07-22 | `d65814c` | Design spec added: "The Conversation" — locked identity, spec §3 |
| 07-22 | `26d78a0` | Vite scaffold with locked identity tokens + bubble favicon |
| 07-22 | `a22d199`…`27a1836` | Core build-out: spring physics, follower graph, bubble/nav components, home/story/results/schedule pages |
| 07-22 | `47f26ff`, `fa26066`, `9c5ab65` | "Night Window" redesign — identity v3 light world, dark Signal Path panel |
| 07-22 | `0366ba4`, `3fd48c9`, `9a8b05b` | North Node logo, proof band, dark panel replaces home thread |
| 07-22 | `431a42c`…`1926443` | v4 editorial apparatus → v5 warm paper world → v6 full-screen treatment → v7 band world |
| 07-23 | `a79e8ce` | Nav sizing bump (32px logo, larger type) |
| 07-23 | `5a3081e` | **"Redesign from scratch — glassmorphic edge-to-edge layout."** Rewrote `index.html`/`main.js` onto Font Awesome + Inter/Plus Jakarta Sans, diverging from the spec-locked identity system that `story/`/`results/`/`schedule/` still use. See [[subsystem-notes]]. |

## Decisions
| date | decision | why | what was rejected |
|---|---|---|---|
| 2026-07-22 | Vanilla JS/Vite, no framework | small marketing site, framework overhead unjustified | React/Next (implied by scale, not recorded as an explicit rejection) |
| 2026-07-22 | Identity system locked at spec §3 (Honey/Ink/Cream, Fraunces+Inter, bubble motif) | consistency across a multi-page site, one designer's editorial voice | — |
| 2026-07-23 | ~~*Open question*: commit `5a3081e` swapped the homepage to a different system.~~ **Closed 2026-07-25** — resolved in favour of Editorial Orchid; all four pages converged. | — | — |
| 2026-07-25 | **Editorial Orchid is the live direction.** Spec §3.1–3.2 (Honey/Ink/Cream, Fraunces+Inter) is historical; live tokens are violet/orchid + Cormorant Garamond/DM Sans/Great Vibes. **Spec §4 motion remains binding.** | the whole site converged on it; keeping a superseded palette in the router was actively misleading agents | reverting the homepage back to spec §3 |
| 2026-07-25 | **Shared motion tokens** in `identity.css` `:root` — `--ease-out`/`--ease-in-out` + `--duration-press/hover/surface` (160/200/260ms). No `transition: all` anywhere; hover motion gated behind `(hover: hover) and (pointer: fine)`. | six rules used unbounded `transition: all`, and `.btn` had hover/active transforms with no transition at all, so every button snapped | built-in CSS easing keywords (too weak to read as intentional) |
| 2026-07-25 | **Follower counter reinstated — on `/results/`, not the homepage.** Reverses the 07-24 "no counter animation" call, at the user's explicit request. `index.html` and its guard test (`site-contract.test.js:77`, asserts no `data-target`) are untouched. | user asked for it directly after being shown the conflicting decision; results is where proof metrics live | (a) leaving it dropped; (b) adding it to `index.html` and rewriting the guard test — rejected to avoid weakening a deliberate contract |
| 2026-07-25 | Counter uses `animateSpring()` with an **overdamped** config (`damping: 28`, not the default 14) and springs `0 → 1` mapped onto the number, interpolated linearly. | default spring overshoots and would flash a count above the real 8,331; springing 8331 directly is violently stiff; `countUpValue()` would double-ease on top of the spring | fixed-duration rAF loop (the previous implementation) |
| 2026-08-02 | Added `/policies/terms/`, `/policies/privacy/`, `/policies/refunds/` and rewrote `/schedule/`'s offer copy to a single paid USD 350 / 60-min consultation. | payment-readiness for Razorpay review before a live payment link exists — see `docs/superpowers/specs/2026-08-02-payment-readiness-pages-design.md` | adding a Razorpay checkout script now (explicitly out of scope until the client's account is approved) |
| 2026-08-02 | Restored `results/index.html`'s script tag to `results.js` (was silently pointing at `main.js` since `301e204`, orphaning the follower-counter). Added a page-entry-script contract test so this class of bug can't land silently again. | `graph.js`'s spring counter is the documented, tested, motion-contract-compliant implementation; the accidental substitute (`odometer.js`) violated the site's own "no long counter animations" rule | leaving `results/index.html` on `main.js` and calling the odometer behavior the new intended design — rejected because it wasn't a deliberate choice, just an unnoticed copy-paste |
| 2026-08-02 | Split `src/js/` from 19 flat files into feature folders (`shared/`, `home/`, `results/`, `schedule/`, `story/`, `notfound/`); left `src/styles/` flat (already page-scoped by filename, lower file count, folder split judged not worth the extra churn). | flat `src/js/` had grown hard to scan — files like `cursor.js` or `odometer.js` gave no signal about which page(s) actually used them | full parity split of `src/styles/` too — rejected, CSS was already self-evidently organized |
| 2026-08-02 | Deleted 6 superseded pre-Editorial-Orchid design docs (`band-world`, `fullscreen`, `signal-path-redesign`, `visual-upgrade`, `night-window-redesign`, `hero-violet-redesign`), the 2026-07-24 verification report, and a one-off `.superpowers/sdd/task-1-2-report.md`. | matches the precedent already set by the 2026-07-25 "Conversation spec" deletion — superseded docs left in place read as current and mislead agents; git history is the recovery path | archiving them under a `docs/archive/` folder instead — rejected, still discoverable-but-wrong is the failure mode being avoided |
