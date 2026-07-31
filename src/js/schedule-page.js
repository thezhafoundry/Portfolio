import { initNav } from './nav.js';
import { initScheduler } from './scheduler.js';
import { initReveals } from './bubbles.js';
import { initMagnetic } from './magnetic.js';
import { initCustomCursor } from './cursor.js';

initNav();
initReveals();
initMagnetic();
initCustomCursor();

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
