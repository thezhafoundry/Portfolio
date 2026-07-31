import { initNav } from './nav.js';
import { initMedia } from './media.js';
import { initReveals } from './bubbles.js';
import { initGreeting } from './greeting.js';
import { initLouver } from './louver.js';
import { initMagnetic } from './magnetic.js';
import { initPointerGlow } from './glow.js';
import { initOdometer } from './odometer.js';
import { initSimulator } from './simulator.js';
import { initProcessEngine } from './process-engine.js';
import { initTicker } from './ticker.js';
import { initYouTubeModal } from './youtube-modal.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMedia();
  initReveals();
  initGreeting();
  initLouver();
  initMagnetic();
  initPointerGlow();
  initOdometer();
  initSimulator();
  initProcessEngine();
  initTicker();
  initYouTubeModal();
});


