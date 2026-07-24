export function nextNavState(isOpen) {
  return { isOpen: !isOpen, expanded: String(!isOpen) };
}

export function initNav(root = document) {
  const toggle = root.querySelector('.nav-toggle');
  const nav = root.querySelector('.site-nav');
  const scrim = root.querySelector('.nav-scrim');
  const ownerDocument = root.nodeType === 9 ? root : root.ownerDocument;

  if (!toggle || !nav || !scrim || !ownerDocument) return;

  const setOpen = (isOpen, shouldRestoreFocus = false) => {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    scrim.hidden = !isOpen;
    ownerDocument.documentElement.classList.toggle('nav-is-open', isOpen);
    ownerDocument.body?.classList.toggle('nav-is-open', isOpen);

    if (shouldRestoreFocus) toggle.focus();
  };

  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(nextNavState(toggle.getAttribute('aria-expanded') === 'true').isOpen);
  });

  scrim.addEventListener('click', () => setOpen(false));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  ownerDocument.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });
}
