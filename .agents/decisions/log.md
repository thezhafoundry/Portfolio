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
| 2026-07-23 | *Open question, not a confirmed decision*: commit `5a3081e` swapped the homepage to a visually different system without an accompanying spec update or README change. Not yet clear whether this is an intended new direction or a regression. Flagged for the user rather than assumed either way. | — | — |
