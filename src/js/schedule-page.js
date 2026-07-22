import { initNav } from './nav.js';
import { initReveals } from './bubbles.js';
import { initScheduler } from './scheduler.js';

initNav();
initReveals();

const container = document.getElementById('cal-embed');
initScheduler({
  calLink: container.dataset.calLink,
  container,
  fallback: document.getElementById('cal-fallback'),
});
