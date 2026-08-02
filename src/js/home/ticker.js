/* Continuous rolling ticker for LinkedIn featured posts & Case Studies.
   Clones ticker items for seamless looping, pauses on mouse enter or focus,
   and handles responsive resize without jumps. */

export function initTicker(root = document) {
  const tracks = root.querySelectorAll('.ticker-track');
  if (!tracks.length) return;

  tracks.forEach((container) => {
    // Avoid duplicating multiple times on re-init
    if (container.dataset.tickerInitialized) return;
    container.dataset.tickerInitialized = 'true';

    const items = Array.from(container.children);
    if (items.length === 0) return;

    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      const links = clone.querySelectorAll('a');
      links.forEach((l) => l.setAttribute('tabindex', '-1'));
      container.appendChild(clone);
    });
  });
}
