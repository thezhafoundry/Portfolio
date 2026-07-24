# Editorial Orchid Portfolio Design

**Date:** 2026-07-24  
**Status:** Approved visual direction  
**Project:** Sampath Kumar professional portfolio

## 1. Purpose

The portfolio must present Sampath Kumar as a credible, personable global
lead-generation and pre-sales leader. The experience should feel editorial and
human while still communicating measurable commercial outcomes quickly.

The design must satisfy the client's fixed requirements:

- remain within a white and violet color family;
- include a prominent photograph in the hero;
- support additional photographs and videos throughout the portfolio;
- include a custom personal logo;
- remain professional enough for B2B, consulting, and international audiences.

## 2. Approved Creative Direction

The approved direction is **Editorial Orchid**.

It combines warm white and restrained violet surfaces with editorial typography,
authentic portraiture, and a conversational tone. The system should feel:

- personal;
- refined;
- credible;
- warm;
- globally relevant;
- commercially sharp;
- memorable without becoming decorative.

The design should avoid generic purple-gradient SaaS styling, excessive glass
effects, interchangeable card grids, and ornamental motion.

## 3. Approved Color System

| Token | Value | Use |
|---|---:|---|
| Canvas | `#FFFAFF` | Primary page background |
| Section | `#F7F2FF` | Alternating sections and quiet surfaces |
| Highlight | `#E9D5FF` | Highlighted words, tags, subtle selected states |
| Light orchid | `#C084FC` | Flourishes, underlines, decorative accents |
| Primary violet | `#6B21A8` | Primary buttons, active states, important links |
| Deep violet | `#2E1065` | Main text, navigation, dark panels, logo |

White or near-white must dominate the page. Violet should establish hierarchy,
not fill every surface. Deep violet replaces black in most branded contexts.

Text and controls must retain WCAG AA contrast against their actual background.

## 4. Logo System

### 4.1 Primary logo

The approved base is the **Modern Monoline full-signature wordmark**:

> Sampath Kumar

The final production logo must not remain an unchanged stock script font. The
`S`, `K`, joining strokes, spacing, and terminal flourish should be customized
and converted to vector outlines so the result is ownable and consistent.

### 4.2 Logo variants

The final asset set must include:

1. Deep-violet primary signature on white or pale orchid.
2. White reversed signature for photographs, videos, and deep-violet surfaces.
3. A simplified calligraphic `S` icon for favicon and social avatar.
4. Horizontal header lockup.
5. SVG master assets and PNG exports at practical sizes.

### 4.3 Usage

- Desktop header height: approximately 30–36px for the signature.
- Hero or closing-signature placement: approximately 52–64px.
- Preserve clear space equal to the height of the capital `S`.
- Do not attach a tagline permanently to the logo.
- Do not place the signature directly over visually busy image areas without a
  controlled overlay or protected clear space.

## 5. Typography

### Display

Use **Cormorant Garamond** for major editorial headings, quotations, and
storytelling moments.

### Interface and body

Use **DM Sans** for navigation, body copy, buttons, labels, metrics, forms, and
supporting information.

### Logo

Use the approved custom Modern Monoline signature as a vector asset, independent
from page typography.

### Suggested responsive scale

| Element | Desktop | Tablet | Mobile |
|---|---:|---:|---:|
| Hero H1 | 68–76px | 48–58px | 38–44px |
| Section H2 | 46–56px | 38–44px | 30–36px |
| Card/role H3 | 26–34px | 24–30px | 22–26px |
| Body | 17–18px | 16–17px | 16px |
| Small labels | 12–13px | 12px | 12px |

Body text should generally remain between 55 and 72 characters per line.

## 6. Global Layout

### Header

All four pages must share one responsive header.

- Desktop: signature at left, Story/Results/Schedule links, one contact CTA.
- Mobile: signature or simplified `S`, one menu control, and no competing
  full-size CTA in the closed state.
- The active page must be visibly indicated.
- Navigation targets must be at least 44px high.
- The menu must be closed by default and provide a clear scrim when open.

### Grid

- Maximum content width: 1180–1240px.
- Desktop gutters: 48–64px.
- Tablet gutters: 32px.
- Mobile gutters: 20–24px.
- All flex and grid children must allow shrinking with `min-width: 0`.

### Spacing

Use an 8px base rhythm.

- Desktop section padding: 96–128px.
- Tablet section padding: 72–88px.
- Mobile section padding: 56–72px.

### Footer

All pages must share a styled closing footer with:

- the signature logo;
- Story, Results, Schedule, and LinkedIn links;
- one clear conversation CTA;
- copyright and location;
- no browser-default links or controls.

## 7. Homepage

### Hero

The required portrait is a first-class content element, not a background
decoration.

Desktop layout:

- approximately 52% copy and 48% media;
- hero copy at left and portrait at right;
- prominent editorial headline with one orchid-highlighted italic word;
- one primary CTA and one quiet secondary link;
- one compact proof metric attached to the media.

Mobile layout:

- copy first;
- portrait immediately after the primary actions;
- portrait visible within the first 650–720px of the experience where practical;
- no horizontal overflow.

The initial headline direction is:

> Every deal begins with *hello.*

Final content may evolve, but the highlighted-word structure should remain.

### Supporting sections

The homepage should contain:

1. concise proof metrics;
2. selected partners or client names;
3. a short personal introduction;
4. three or four core services;
5. a clear working process;
6. selected career results rather than a full résumé dump;
7. one strong contact path.

Final metric values must be visible immediately. Animated counters must never
display inaccurate intermediate values.

## 8. Story Page

The Story page should retain the editorial timeline concept while adopting the
approved global header, footer, typography, and palette.

- Desktop chapters may use a sticky visual stage.
- Individual stages should be approximately 560–640px rather than full-screen.
- Timeline controls require 44px interactive areas.
- Inactive chapters must remain readable.
- Mobile should use compact year cards rather than losing the visual narrative.
- No placeholder text such as “Photo to be added” may remain in production.

## 9. Results Page

The Results page must make the strongest commercial proof immediately scannable.

- Place the major proof values near the hero.
- Present the primary case study as four concise outcome blocks plus narrative.
- Preserve editorial asymmetry without scattering related facts.
- Reduce the visual weight of older roles.
- Finish with a styled Schedule CTA rather than raw footer links.

## 10. Schedule Page

The Schedule page must fulfill its promise.

- Display the real booking calendar when available.
- If the calendar is unavailable, replace “Pick a time” with an honest
  conversation CTA rather than an empty booking area.
- Desktop should use an approximately 5/7 copy-to-calendar split.
- Mobile should place the calendar directly below the introduction.
- LinkedIn should remain a visible fallback action.
- Include loading, failure, and success states for the calendar.

## 11. Photography

Photography should feel authentic, warm, and documentary rather than synthetic.

### Required image types

1. Hero portrait, preferably 4:5 or a crop-safe high-resolution landscape.
2. Working-session or presentation image.
3. One personal or career-story image.
4. Optional supporting environmental images.

### Treatment

- Natural color with restrained violet grading only where necessary.
- Consistent 12–20px radius.
- No heavy filters or artificial glow.
- Maintain explicit focal-position metadata for responsive crops.
- Provide descriptive alternative text.
- Avoid text over faces or high-detail areas.

## 12. Video

Video is optional content and must not dominate the initial load.

- Never autoplay with sound.
- Use a designed poster frame based on portfolio photography.
- Show a labelled play control such as “Watch introduction.”
- Open short videos in an accessible modal or dedicated inline region.
- Preserve captions and a transcript.
- Use the white logo variant as a restrained watermark.
- Lazy-load the player until requested.
- Respect `prefers-reduced-motion`.

## 13. Motion

Motion should reinforce hierarchy and feedback.

- Hero entrance: 350–550ms with restrained opacity/transform staging.
- Buttons and links: 140–180ms hover and press feedback.
- Mobile menu: approximately 220ms open and 180ms close.
- Accordions: 240–300ms.
- Story chapter changes: 280–360ms.
- Page transition, if used: 180–240ms.

Use transform and opacity for most effects. Avoid scroll hijacking, looping
floating elements, long counter animations, and large parallax movement.

Reduced-motion mode must remove movement while preserving content and state.

## 14. Forms and Interaction States

All controls must define:

- default;
- hover;
- visible keyboard focus;
- pressed or active;
- disabled;
- loading;
- error;
- success.

Contact fields require persistent inline validation messages rather than relying
only on native browser bubbles. Touch targets must be at least 44px.

Long email addresses and profile URLs must wrap without increasing page width.

## 15. Media and Content Architecture

Images and videos should be replaceable without restructuring page markup.

Each media item should define:

- source;
- poster or fallback;
- alternative text;
- preferred aspect ratio;
- focal position;
- caption where applicable.

When client assets are not yet available, use clearly identified temporary
assets during development but do not expose placeholder labels in production.

## 16. Error Handling

- Broken or missing images must not collapse the layout.
- Missing video must hide its play control and retain the poster as an image.
- Calendar loading must show a bounded skeleton or status message.
- Calendar failure must expose LinkedIn or email fallback actions.
- Form failures must retain entered values and present actionable feedback.

## 17. Responsive and Accessibility Requirements

Test at minimum:

- 1440px;
- 1024px;
- 768px;
- 390px;
- 320px;
- an unusually wide viewport such as 1920px.

Acceptance requirements:

- no horizontal overflow;
- readable line lengths;
- 44px minimum interactive targets;
- visible keyboard focus;
- AA text contrast;
- correctly labelled menu and modal states;
- captions and transcript for video;
- reduced-motion behavior;
- semantic heading order;
- no content hidden solely for animation.

## 18. Out of Scope

The initial implementation does not require:

- a CMS;
- autoplaying background video;
- a second unrelated color theme;
- elaborate 3D effects;
- scroll hijacking;
- a dark-mode version of every page.

## 19. Design Acceptance Criteria

The design is complete when:

1. all four pages use the Editorial Orchid system;
2. the Modern Monoline signature and favicon are consistently applied;
3. the hero contains a prominent responsive photograph;
4. photo and video placements support future client assets;
5. global navigation and footer are consistent and fully styled;
6. Schedule provides a working booking or honest fallback experience;
7. mobile layouts have no overflow;
8. all key states are accessible;
9. motion is purposeful and reduced-motion safe;
10. the finished portfolio feels personal, refined, credible, and commercially
    focused.
