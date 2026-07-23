# Hero Violet Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's full-bleed dark-photo hero with a light violet-gradient, two-column hero (photo card + floating stat badge + flat stats row), matching the approved reference mockup.

**Architecture:** Pure HTML/CSS change to `index.html` and the two homepage stylesheets (`src/styles/main.css`, `src/styles/components.css`). No new JS — the existing `main.js` nav-toggle and stat-counter logic keep working unmodified because we preserve `#navToggle`/`#navLinks` and `.stat-number`/`data-target`, and we add the `.hero-stats-bar` class the counter's `IntersectionObserver` already looks for (currently a no-op bug).

**Tech Stack:** Vanilla CSS custom properties, vanilla JS (unmodified), Vite dev server for verification.

## Global Constraints

- New primary color: `#5b21b6` (was `#6C5CE7`), hover `#4c1d95`, dark gradient stop `#2e1065` — from spec `docs/superpowers/specs/2026-07-24-hero-violet-redesign-design.md`.
- Reuse existing `.btn-pill`/`.btn-purple`/`.btn-outline-dark`/`.highlight-purple`/`.arrow-circle` utility classes instead of inventing new button/highlight styles (DRY — confirmed present in `src/styles/main.css`).
- Keep `#navToggle`, `#navLinks`, `.hero-glass-nav`, `.hero-nav-links`, `.nav-toggle-glass` markup/IDs unchanged — `src/js/main.js` binds to these.
- Keep `.stat-number` class and `data-target` attributes with unchanged static text — `src/js/main.js`'s counter animation parses these.
- Photo asset: `/assets/hero_portrait.jpg` (already in `public/assets/`, 1200×896).
- No changes to `story/`, `results/`, `schedule/` pages or their stylesheets.

---

### Task 1: Update color tokens to the new violet palette

**Files:**
- Modify: `src/styles/main.css:6-49` (root token block), `src/styles/main.css:172` (hardcoded hover shadow)
- Modify: `src/styles/components.css` (all remaining hardcoded old-purple hex/rgba occurrences)

**Interfaces:**
- Produces: `--primary: #5b21b6`, `--primary-hover: #4c1d95`, `--primary-dark: #2e1065` (new token), `--primary-light`, `--primary-glow`, `--border-purple`, `--shadow-md`, `--shadow-purple` all recalculated to the new hue. Task 2 and Task 3 consume `var(--primary)` and `var(--primary-dark)`.

- [ ] **Step 1: Replace the `:root` token block in `main.css`**

Replace `src/styles/main.css:6-49` with:

```css
:root {
  /* Color Palette */
  --bg-main: #F3EFFE;
  --bg-subtle: #FAF8FE;
  --bg-card: #FFFFFF;
  --bg-dark: #111117;
  --bg-dark-card: #191924;
  --bg-purple-card: #5b21b6;

  --primary: #5b21b6;
  --primary-hover: #4c1d95;
  --primary-dark: #2e1065;
  --primary-light: #EDE4FB;
  --primary-glow: rgba(91, 33, 182, 0.35);

  --text-dark: #111827;
  --text-muted: #6B7280;
  --text-subtle: #9CA3AF;
  --text-light: #FFFFFF;
  --text-light-muted: #94A3B8;

  --border-light: rgba(0, 0, 0, 0.07);
  --border-dark: rgba(255, 255, 255, 0.12);
  --border-purple: rgba(91, 33, 182, 0.3);

  /* Typography */
  --font-display: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  /* Radius */
  --radius-hero: 32px;
  --radius-card: 24px;
  --radius-pill: 9999px;
  --radius-sm: 12px;

  /* Transitions */
  --tr-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --tr-smooth: 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  /* Shadows */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.03);
  --shadow-md: 0 10px 30px rgba(91, 33, 182, 0.08);
  --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.12);
  --shadow-purple: 0 14px 30px rgba(91, 33, 182, 0.28);
}
```

- [ ] **Step 2: Fix the hardcoded hover shadow in `.btn-purple:hover`**

In `src/styles/main.css:169-173`, change:

```css
.btn-purple:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(108, 92, 231, 0.4);
}
```

to:

```css
.btn-purple:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(91, 33, 182, 0.4);
}
```

- [ ] **Step 3: Sweep remaining hardcoded old-purple literals in `components.css`**

Run:

```bash
sed -i '' \
  -e 's/#6C5CE7/#5b21b6/g' \
  -e 's/108, *92, *231/91, 33, 182/g' \
  src/styles/components.css
```

(The hero-specific lines this touches get fully rewritten by Task 2 anyway — this sweep is for the partners/about/services/etc. sections further down the file that stay structurally unchanged.)

- [ ] **Step 4: Verify no old-purple literals remain**

Run: `grep -rn "6C5CE7\|108, *92, *231\|108,92,231" src/styles/`
Expected: no output (empty result, exit code 1)

- [ ] **Step 5: Commit**

```bash
git add src/styles/main.css src/styles/components.css
git commit -m "feat: update primary palette to deep violet (#5b21b6)"
```

---

### Task 2: Rewrite hero CSS for the light gradient, two-column layout

**Files:**
- Modify: `src/styles/components.css:1-282` (entire current hero/nav/stats CSS block, replaced in full)

**Interfaces:**
- Consumes: `var(--primary)`, `var(--primary-dark)`, `var(--primary-hover)`, `var(--text-dark)`, `var(--text-muted)`, `var(--font-display)`, `var(--tr-fast)`, `var(--tr-smooth)` from Task 1.
- Produces (consumed by Task 3's markup): `.hero`, `.hero-glass-nav`, `.hero-brand`, `.hero-brand-dot`, `.hero-nav-links`, `.btn-nav-glass`, `.nav-toggle-glass`, `.hero-grid`, `.hero-copy`, `.hero-eyebrow`, `.hero-main-title`, `.hero-subtext`, `.hero-actions`, `.hero-visual`, `.hero-photo-frame`, `.hero-floating-badge`, `.hero-floating-badge-value`, `.hero-floating-badge-label`, `.hero-stats-bar`, `.hero-stat-card`, `.hero-stat-label`.

- [ ] **Step 1: Replace `src/styles/components.css:1-282` in full**

Replace everything from the file's start (`/* === Component Specific Styles ... */`) through the closing `}` of the `@media (max-width: 992px) { .hero-four-stats-row { ... } }` block (line 282) — i.e. everything before the blank line that precedes the `/* Partners & Clients Section */` comment — with:

```css
/* ==========================================================================
   Component Specific Styles — Violet Gradient Hero
   ========================================================================== */

/* --------------------------------------------------------------------------
   Hero Section: Light Violet Gradient Background, Two-Column Layout
   -------------------------------------------------------------------------- */
.hero {
  width: 100%;
  position: relative;
  background:
    radial-gradient(ellipse 60% 50% at 100% 100%, rgba(251, 191, 172, 0.35) 0%, rgba(251, 191, 172, 0) 60%),
    radial-gradient(ellipse 55% 45% at 0% 0%, rgba(199, 210, 254, 0.55) 0%, rgba(199, 210, 254, 0) 60%),
    linear-gradient(135deg, #f5f3ff 0%, #ede9fe 45%, #f3e8ff 100%);
  min-height: 88vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  padding: 24px 0 48px;
  margin: 0;
}

/* Floating Glassmorphic Navbar — light variant */
.hero-glass-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 9999px;
  box-shadow: 0 10px 25px rgba(91, 33, 182, 0.08);
}

.hero-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-dark);
  text-decoration: none;
}

.hero-brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 12px var(--primary);
}

.hero-nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
}

.hero-nav-links a {
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 500;
  color: rgba(17, 24, 39, 0.65);
  text-decoration: none;
  transition: color var(--tr-fast);
}

.hero-nav-links a:hover,
.hero-nav-links a.active {
  color: var(--text-dark);
}

.btn-nav-glass {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  color: #FFFFFF;
  border: none;
  padding: 9px 22px;
  border-radius: 9999px;
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--tr-fast);
}

.btn-nav-glass:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(91, 33, 182, 0.35);
}

.nav-toggle-glass {
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--text-dark);
  cursor: pointer;
}

@media (max-width: 992px) {
  .hero-nav-links {
    display: none;
  }
  .hero-nav-links.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 75px;
    left: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(24px);
    padding: 24px;
    border-radius: 24px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 20px 40px rgba(91, 33, 182, 0.15);
    gap: 16px;
    z-index: 100;
  }
  .hero-nav-links.active a {
    color: var(--text-dark);
  }
  .nav-toggle-glass {
    display: block;
  }
}

/* Two-Column Hero Grid: Copy Left, Photo Right */
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
  align-items: center;
  gap: 56px;
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.hero-copy {
  max-width: 600px;
}

.hero-eyebrow {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 20px;
}

.hero-main-title {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: var(--text-dark);
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .hero-main-title {
    font-size: 2.6rem;
  }
  .hero {
    min-height: auto;
  }
}

.hero-subtext {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 480px;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Photo Card + Floating Stat Badge */
.hero-visual {
  position: relative;
}

.hero-photo-frame {
  background: #FFFFFF;
  padding: 12px;
  border-radius: 28px;
  box-shadow: 0 30px 60px rgba(91, 33, 182, 0.18);
}

.hero-photo-frame img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
  aspect-ratio: 4 / 3.6;
  object-fit: cover;
}

.hero-floating-badge {
  position: absolute;
  bottom: -20px;
  left: -20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 14px 22px;
  box-shadow: 0 16px 32px rgba(91, 33, 182, 0.2);
}

.hero-floating-badge-value {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.hero-floating-badge-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 4px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .hero-floating-badge {
    bottom: -14px;
    left: 14px;
    padding: 10px 16px;
  }
}

/* Flat Stats Row */
.hero-stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.hero-stat-card {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 20px 24px;
}

.hero-stat-card .stat-number {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 6px;
}

@media (max-width: 992px) {
  .hero-stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-stats-bar {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Verify the stylesheet still parses / dev server still boots**

Run: `npm run dev -- --port 5183 &` then `sleep 1 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5183/` then stop the server (`kill %1`).
Expected: `200`

- [ ] **Step 3: Commit**

```bash
git add src/styles/components.css
git commit -m "feat: rebuild hero CSS as light violet two-column layout"
```

---

### Task 3: Rewrite hero markup in `index.html`

**Files:**
- Modify: `index.html:24-108` (the entire `<section id="home" class="hero-full-edge">...</section>`, replaced in full)

**Interfaces:**
- Consumes: all classes produced by Task 2, plus pre-existing global utility classes `.btn-pill`, `.btn-purple`, `.btn-outline-dark`, `.arrow-circle`, `.highlight-purple` (defined in `src/styles/main.css`, unmodified).
- Produces: `#navToggle`, `#navLinks` (consumed by `src/js/main.js`, unmodified), `.stat-number[data-target]` × 4 (consumed by `src/js/main.js`'s counter animation, unmodified).

- [ ] **Step 1: Replace the hero `<section>` in full**

Replace `index.html:24-108` (from `<section id="home" class="hero-full-edge">` through its matching `</section>`) with:

```html
  <section id="home" class="hero">

    <div class="container">
      <nav class="hero-glass-nav">
        <a href="#" class="hero-brand">
          <span class="hero-brand-dot"></span>
          Sampath Kumar
        </a>

        <ul class="hero-nav-links" id="navLinks">
          <li><a href="#home" class="active">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <a href="#contact" class="btn-nav-glass">
          Book a Consultation
        </a>

        <button class="nav-toggle-glass" id="navToggle" aria-label="Toggle navigation">
          <i class="fa-solid fa-bars"></i>
        </button>
      </nav>
    </div>

    <div class="container">
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="hero-eyebrow">Lead Generation &middot; Pre-Sales &middot; B2B Growth</p>
          <h1 class="hero-main-title">
            Driving B2B Revenue.<br>
            Scaling <span class="highlight-purple">Global Pipeline</span>.
          </h1>
          <p class="hero-subtext">
            7+ years driving B2B SaaS growth, M&A target sourcing, and global market expansion across US, UK, Europe, APAC & India.
          </p>
          <div class="hero-actions">
            <a href="#contact" class="btn-pill btn-purple">
              Request a Call
              <span class="arrow-circle"><i class="fa-solid fa-arrow-right"></i></span>
            </a>
            <a href="/results/" class="btn-pill btn-outline-dark">See Results</a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-photo-frame">
            <img src="/assets/hero_portrait.jpg" alt="Sampath Kumar working at his desk" width="1200" height="896" loading="eager" fetchpriority="high">
          </div>
          <div class="hero-floating-badge">
            <div class="hero-floating-badge-value">9.2/10</div>
            <div class="hero-floating-badge-label">Avg. client satisfaction</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="hero-stats-bar">
        <div class="hero-stat-card">
          <div class="stat-number" data-target="7">7+</div>
          <div class="hero-stat-label">Years B2B Experience</div>
        </div>
        <div class="hero-stat-card">
          <div class="stat-number" data-target="35">+35%</div>
          <div class="hero-stat-label">Lead-to-Meeting Boost</div>
        </div>
        <div class="hero-stat-card">
          <div class="stat-number" data-target="200">200M+</div>
          <div class="hero-stat-label">Private Co. Database</div>
        </div>
        <div class="hero-stat-card">
          <div class="stat-number" data-target="9.2">9.2/10</div>
          <div class="hero-stat-label">Avg. Client Satisfaction</div>
        </div>
      </div>
    </div>

  </section>
```

- [ ] **Step 2: Verify markup integrity**

Run: `grep -c "navToggle\|navLinks" index.html` (expect `4` — one `id="navToggle"`, one `id="navLinks"`, plus the two references remain distinct ids) and `grep -c "stat-number" index.html` (expect `4`).
Expected: both greps return non-zero counts matching the numbers above; `npx vitest run` still passes (this task touches no code under test, so it's a regression check, not new coverage).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rebuild hero markup as two-column photo-card layout"
```

---

### Task 4: Visual verification across breakpoints

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev -- --port 5183 &`
Expected: server logs `Local: http://localhost:5183/`

- [ ] **Step 2: Capture screenshots at each required breakpoint**

Run:

```bash
npx --yes playwright screenshot --viewport-size=320,800 http://localhost:5183/ /tmp/hero-320.png
npx --yes playwright screenshot --viewport-size=768,1000 http://localhost:5183/ /tmp/hero-768.png
npx --yes playwright screenshot --viewport-size=1024,1000 http://localhost:5183/ /tmp/hero-1024.png
npx --yes playwright screenshot --viewport-size=1440,1000 http://localhost:5183/ /tmp/hero-1440.png
```

Expected: 4 PNG files written with no console errors printed by the command.

- [ ] **Step 3: Review each screenshot**

Read each of the 4 PNGs and confirm: no horizontal overflow, photo card + floating badge don't collide with text at 320/768, nav collapses to the hamburger toggle under 992px, stats row wraps 2×2 then 1-column as designed.

- [ ] **Step 4: Confirm the stat-counter animation fires**

In one of the Playwright screenshots (or a quick manual load), confirm the numbers under `.hero-stats-bar` are not stuck at `0` — this confirms the `.hero-stats-bar` class fix from the spec made `main.js`'s `IntersectionObserver` find its target.

- [ ] **Step 5: Stop the dev server**

Run: `kill %1`

- [ ] **Step 6: Run the existing unit test suite as a final regression check**

Run: `npm test`
Expected: all existing tests in `tests/*.test.js` still pass (this change touches no pure logic under test, so this is a no-op safety check).
