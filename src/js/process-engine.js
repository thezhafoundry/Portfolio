/**
 * Interactive 3-Step Process Engine ("01, 02, 03").
 * Enables interactive step activation with animated detail reveal cards.
 */
export function initProcessEngine() {
  const container = document.querySelector('.method__track');
  if (!container) return;

  const steps = container.querySelectorAll('li');
  if (!steps.length) return;

  steps.forEach((step, index) => {
    step.style.cursor = 'pointer';
    step.setAttribute('tabindex', '0');
    step.setAttribute('role', 'button');
    step.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');

    function activate() {
      steps.forEach((s) => {
        s.classList.remove('method-step--active');
        s.setAttribute('aria-expanded', 'false');
      });
      step.classList.add('method-step--active');
      step.setAttribute('aria-expanded', 'true');
    }

    step.addEventListener('click', activate);
    step.addEventListener('mouseenter', activate);
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  // Activate first step by default
  steps[0]?.classList.add('method-step--active');
}
