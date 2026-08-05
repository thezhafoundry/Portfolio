/**
 * Floating Picture-in-Picture video widget.
 *
 * Place `/assets/sampath-intro.mp4` (portrait/vertical, 9:16) to activate.
 * The trigger sits fixed in the bottom-right corner. Clicking it reveals a
 * compact video card; clicking × or clicking outside collapses it.
 *
 * @param {object}  opts
 * @param {string}  [opts.revealAfter]  CSS selector — trigger stays hidden
 *   while this element is intersecting the viewport (e.g. the hero section).
 *   Once it scrolls out, the trigger fades in.
 */
export function initPip({ revealAfter = null } = {}) {
  const wrap     = document.getElementById('pip-wrap');
  const trigger  = document.getElementById('pip-trigger');
  const card     = document.getElementById('pip-card');
  const closeBtn = document.getElementById('pip-close');
  const video    = document.getElementById('pip-video');

  if (!wrap || !trigger || !card || !video) return;

  /* The trigger shows unconditionally — it is part of the page's furniture, not
     something that appears only once an asset lands. The card still opens; if
     the file is missing the <video> element's own error state is what shows,
     rather than the widget silently not existing. */
  wrap.hidden = false;
  wireUp();

  /* A missing or unplayable source gets labelled in the card instead of
     failing silently behind native controls that do nothing. */
  video.addEventListener('error', () => {
    card.classList.add('pip-card--unavailable');
  });

  function wireUp() {
    /* --- Scroll-based reveal ----------------------------------------------- */
    if (revealAfter) {
      const sentinel = document.querySelector(revealAfter);
      if (sentinel) {
        wrap.classList.add('pip-wrap--hidden');
        new IntersectionObserver(
          ([entry]) => {
            wrap.classList.toggle('pip-wrap--hidden', entry.isIntersecting);
          },
          { threshold: 0.15 }
        ).observe(sentinel);
      }
    }

    /* --- Open / close -------------------------------------------------------- */
    function open() {
      wrap.classList.add('pip-wrap--active');
      card.removeAttribute('hidden');
      card.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.classList.add('pip-trigger--active');
      requestAnimationFrame(() => card.classList.add('pip-card--open'));
      video.play().catch(() => {});
    }

    function close() {
      wrap.classList.remove('pip-wrap--active');
      card.classList.remove('pip-card--open');
      card.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.classList.remove('pip-trigger--active');
      video.pause();
      card.addEventListener('transitionend', () => {
        if (!card.classList.contains('pip-card--open')) card.setAttribute('hidden', '');
      }, { once: true });
    }

    trigger.addEventListener('click', () => {
      trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });

    closeBtn?.addEventListener('click', (e) => { e.stopPropagation(); close(); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') close();
    });

    document.addEventListener('pointerdown', (e) => {
      if (trigger.getAttribute('aria-expanded') === 'true' && !wrap.contains(e.target)) close();
    });
  }
}
