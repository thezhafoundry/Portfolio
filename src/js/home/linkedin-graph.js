export function initFollowerTraveler() {
  const container = document.getElementById('linkedin-follower-traveler');
  if (!container) return;

  const path = container.querySelector('.growth-curve-path');
  const dot = container.querySelector('[data-traveler-dot]');
  const badge = container.querySelector('[data-traveler-badge]');

  if (!path || !dot || !badge) return;

  const totalLen = path.getTotalLength();
  path.style.strokeDasharray = String(totalLen);
  path.style.strokeDashoffset = String(totalLen);

  const BASELINE_COUNT = 0;
  const TARGET_COUNT = 10000;
  const DURATION = 5000; // 5 seconds travel time
  const PAUSE = 5000; // 5 seconds hold at peak

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (elapsed < DURATION) {
      const rawProgress = elapsed / DURATION;
      // Smooth ease-out
      const progress = 1 - Math.pow(1 - rawProgress, 2.5);

      const pt = path.getPointAtLength(totalLen * progress);
      path.style.strokeDashoffset = String(totalLen * (1 - progress));

      dot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      badge.style.transform = `translate(${pt.x}px, ${pt.y - 28}px)`;

      const currentCount = Math.min(TARGET_COUNT, Math.round(BASELINE_COUNT + (TARGET_COUNT - BASELINE_COUNT) * progress));
      badge.textContent = `${currentCount.toLocaleString('en-US')}+ Followers`;

      requestAnimationFrame(step);
    } else if (elapsed < DURATION + PAUSE) {
      // Hold at peak point (10,000+ Followers) for 5 seconds
      const pt = path.getPointAtLength(totalLen);
      path.style.strokeDashoffset = '0';
      dot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      badge.style.transform = `translate(${pt.x}px, ${pt.y - 28}px)`;
      badge.textContent = '10,000+ Followers';

      requestAnimationFrame(step);
    } else {
      // Reset & Loop
      startTime = timestamp;
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function initLinkedinGraph() {
  initFollowerTraveler();
}
