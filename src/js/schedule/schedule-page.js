import { initNav } from '../shared/nav.js';
import { initScheduler } from './scheduler.js';
import { initReveals } from '../shared/bubbles.js';
import { initMagnetic } from '../shared/magnetic.js';
import { initCustomCursor } from '../shared/cursor.js';
import { initSimulator } from '../home/simulator.js';
import { initScrollTop } from '../shared/scroll-top.js';
import { initChatbot } from '../shared/chatbot.js';

initNav();
initReveals();
initMagnetic();
initCustomCursor();
initSimulator();
initScrollTop();
initChatbot();

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

