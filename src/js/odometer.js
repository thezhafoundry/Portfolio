/**
 * Rolling Number Odometer / Counter Animation for Proof Points.
 * Automatically detects figures and counts up smoothly when scrolled into view.
 */
export function initOdometer() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const elements = document.querySelectorAll('.figure dd, [data-count]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const originalText = el.textContent.trim();
  el.dataset.original = originalText;

  // Extract number, prefix, and suffix
  // e.g. "+35%" -> prefix: "+", num: 35, suffix: "%", decimals: 0
  // "9.2/10" -> prefix: "", num: 9.2, suffix: "/10", decimals: 1
  // "200M+" -> prefix: "", num: 200, suffix: "M+", decimals: 0
  // "12 markets" -> prefix: "", num: 12, suffix: " markets", decimals: 0
  const match = originalText.match(/^([^\d.]*)([\d.]+)(.*)$/);
  if (!match) return;

  const prefix = match[1];
  const targetNum = parseFloat(match[2]);
  const suffix = match[3];
  const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;

  const duration = 1800; // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic formula
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentNum = targetNum * easeProgress;

    el.textContent = `${prefix}${currentNum.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = originalText;
    }
  }

  requestAnimationFrame(step);
}
