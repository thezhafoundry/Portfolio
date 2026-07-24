import { initNav } from './nav.js';
import { initScheduler } from './scheduler.js';

initNav();

const container = document.getElementById('cal-embed');
const fallback = document.getElementById('cal-fallback');
const status = document.getElementById('cal-status');

if (container) {
  initScheduler({
    calLink: container.dataset.calLink || '',
    container,
    fallback,
    status,
  });
}
