import { prefersReducedMotion } from './motion.js';

export function initScrollTop(root = document) {
  const button = root.querySelector('.scroll-top');
  const footer = root.querySelector('.site-footer');
  if (!button || !footer) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      button.classList.toggle('is-visible', entry.isIntersecting);
    });
    observer.observe(footer);
  } else {
    button.classList.add('is-visible');
  }

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}
