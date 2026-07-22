export function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.site-nav .links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (!e.target.closest('.site-nav')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
