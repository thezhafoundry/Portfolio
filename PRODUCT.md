# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences the same site must serve at once:
1. **Paid consulting prospects** — B2B SaaS founders and sales leaders evaluating whether to book Sampath Kumar's paid remote consulting session (outbound strategy, lead generation, pre-sales planning).
2. **Employers/recruiters** — hiring managers evaluating Sampath for a full-time pre-sales or lead-generation leadership role.

Both audiences land on the same pages (home, story, results, schedule) and read the same proof; the site is not segmented by audience today.

## Product Purpose

A personal portfolio/lead-gen site for Sampath Kumar, an engineer-turned-sales leader with 7+ years in B2B SaaS growth, deal origination, outbound systems, and pipeline generation across 24 major markets. It exists to (a) sell a paid consulting session and (b) double as a credibility asset for full-time hiring conversations. Success = booked consulting calls via `/schedule/` and/or recruiter/founder outreach following from the case-study evidence on `/results/`.

## Positioning

Not a generic "hire a salesperson" pitch — the differentiator is the engineer-turned-sales-leader framing paired with named, verifiable case studies (Finquest, The Sales Group, Uplers & Mavlers, Ecosmob Technologies, Zinnov & Draup) and a real, sourced metric (8,331 LinkedIn followers, rendered as a live count-up on `/results/`). A generic sales-consultant site could not truthfully copy the specific employer history or the market-count claim.

## Operating Context

- `/` (home) — hero positioning, tools/stack ticker (Apollo, Clay, Gong, HubSpot, Salesforce, Cognism, Lusha, Pitchbook, Crunchbase, Instantly, Smartlead), simulator/process sections.
- `/story/` — narrative background.
- `/results/` — case studies and the LinkedIn follower proof card.
- `/schedule/` — the paid offer: USD 350, 60-minute remote consulting session. `data-cal-link` is currently empty, so this renders a LinkedIn/phone fallback instead of a live Cal.com calendar (see `.agents/projects/active-backlog.md` — the only remaining launch blocker).
- `/policies/terms/`, `/policies/privacy/`, `/policies/refunds/` — govern the paid session; refunds policy is dated 2 August 2026.
- LinkedIn profile: `linkedin.com/in/sampath-kumar-tn66sk9699`.
- Resume on file at `public/assets/sampath-kumar-resume.pdf`.

## Capabilities and Constraints

- Static Vite-built multi-page site, vanilla JS/CSS, no framework, no backend (see root `CLAUDE.md`).
- Live Cal.com booking link not yet set (launch blocker, not a design blocker).
- Live Razorpay payment link intentionally not wired up yet — pending the client's Razorpay KYC/international-payments approval. `/schedule/` states payment instructions are "shared after the payment setup is approved."
- No dedicated recruiter-facing page or full-time-role-specific content exists yet — the full-time audience is currently served by the same consulting-oriented pages, not a separate track.

## Brand Commitments

- Name: Sampath Kumar. LinkedIn handle above is the canonical profile link used site-wide.
- Visual system: Editorial Orchid (governing spec: `docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`) — out of scope for this record; owned by DESIGN.md/new-work.
- No additional tagline, tone commitment, or claim beyond current site copy and the LinkedIn profile/resume was confirmed as of this writing — the client's source material is limited to the LinkedIn profile, the resume PDF, and unspecified supporting docs not yet shared into this repo.

## Evidence on Hand

- Named case studies with role titles: Finquest (Senior Lead Generation Manager), The Sales Group (Lead Generation Manager), Uplers & Mavlers (Business Development Manager), Ecosmob Technologies (Lead Generation Manager), Zinnov & Draup (Pre-Sales Lead) — all live on `/results/`.
- Real, sourced metric: 8,331 LinkedIn followers (`data-target="8331"` on `/results/`, spring count-up animation).
- Resume PDF at `public/assets/sampath-kumar-resume.pdf` — not yet parsed into this record; future work needing resume-sourced facts (dates, employers, education) should read it directly rather than assume it matches site copy.
- No testimonials, client logos-as-endorsements, press mentions, or pricing beyond the single USD 350/60-min offer exist on the site — do not fabricate any.

## Product Principles

1. Every claim must trace to a named, verifiable source (real employer, real metric, real document) — never a fabricated testimonial, logo, or number.
2. The site must work for both a consulting-session buyer and a full-time-hiring evaluator without forking into two separate experiences, until the client asks for that split.
3. The paid offer (`/schedule/`) is the primary conversion goal; case studies and proof exist to make that booking decision easier, not as a standalone portfolio flex.
4. Payment/scheduling infrastructure gaps (Cal.com link, Razorpay) are business/compliance blockers, not reasons to soften or fake the offer's presentation.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond the general web a11y bar in `rules/web/testing.md`.
