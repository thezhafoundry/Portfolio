export function initFollowerTraveler() {
  const container = document.getElementById('linkedin-follower-traveler');
  if (!container) return;

  const path = container.querySelector('.growth-curve-path');
  const dot = container.querySelector('[data-traveler-dot]');
  const badge = container.querySelector('[data-traveler-badge]');

  if (!path || !dot || !badge) return;

  const totalLen = path.getTotalLength();
  const BASELINE_MILLIONS = 0;
  const TARGET_MILLIONS = 2.1;
  const DURATION = 2400; // ms — a single authored reveal, not a loop

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function settleAtEnd() {
    const pt = path.getPointAtLength(totalLen);
    path.style.strokeDasharray = String(totalLen);
    path.style.strokeDashoffset = '0';
    dot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
    badge.style.transform = `translate(${pt.x}px, ${pt.y - 28}px)`;
    badge.textContent = `${TARGET_MILLIONS.toFixed(1)}M+ Impressions`;
  }

  if (reduceMotion) {
    settleAtEnd();
    return;
  }

  path.style.strokeDasharray = String(totalLen);
  path.style.strokeDashoffset = String(totalLen);

  let startTime = null;
  let playing = false;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = Math.min(elapsed / DURATION, 1);
    // Smooth ease-out
    const progress = 1 - Math.pow(1 - rawProgress, 2.5);

    const pt = path.getPointAtLength(totalLen * progress);
    path.style.strokeDashoffset = String(totalLen * (1 - progress));
    dot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
    badge.style.transform = `translate(${pt.x}px, ${pt.y - 28}px)`;

    const currentMillions = BASELINE_MILLIONS + (TARGET_MILLIONS - BASELINE_MILLIONS) * progress;
    badge.textContent = `${currentMillions.toFixed(1)}M+ Impressions`;

    if (rawProgress < 1) {
      requestAnimationFrame(step);
    } else {
      settleAtEnd();
    }
  }

  function play() {
    if (playing) return;
    playing = true;
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(container);
}

export function initLinkedinGraph() {
  initFollowerTraveler();
}
