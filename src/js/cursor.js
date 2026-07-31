/**
 * Custom Editorial Orchid cursor system.
 * Creates an inner dot and smooth-following outer ring that responds dynamically
 * to interactive elements (buttons, links, cards, triggers).
 */
export function initCustomCursor() {
  // Respect touch devices and reduced motion
  if (
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  // Avoid duplicate injection
  if (document.getElementById('custom-cursor')) return;

  const wrap = document.createElement('div');
  wrap.id = 'custom-cursor';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = `
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  `;
  document.body.appendChild(wrap);

  const dot = wrap.querySelector('.cursor-dot');
  const ring = wrap.querySelector('.cursor-ring');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovered = false;
  let isPressed = false;
  let animId = null;

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }

    if (wrap.classList.contains('cursor-hidden')) {
      wrap.classList.remove('cursor-hidden');
    }
  }

  function render() {
    // Smooth lerp for outer ring
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    if (ring) {
      const scale = isPressed ? 0.75 : isHovered ? 1.75 : 1;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
    }

    animId = requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  document.addEventListener('pointerdown', () => {
    isPressed = true;
    wrap.classList.add('cursor-active');
  });

  document.addEventListener('pointerup', () => {
    isPressed = false;
    wrap.classList.remove('cursor-active');
  });

  document.addEventListener('mouseleave', () => {
    wrap.classList.add('cursor-hidden');
  });

  // Delegate hover detection for links, buttons, and interactive cards
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, input, textarea, select, .btn, [role="button"], .clarity-card, .outcome, .pip-trigger');
    if (target) {
      isHovered = true;
      wrap.classList.add('cursor-hovering');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, input, textarea, select, .btn, [role="button"], .clarity-card, .outcome, .pip-trigger');
    if (target) {
      isHovered = false;
      wrap.classList.remove('cursor-hovering');
    }
  }, { passive: true });

  render();
}
