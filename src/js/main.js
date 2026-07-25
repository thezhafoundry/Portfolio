import { initNav } from './nav.js';
import { initMedia } from './media.js';
import { initReveals } from './bubbles.js';
import { initGreeting } from './greeting.js';
import { initLouver } from './louver.js';
import { initMagnetic } from './magnetic.js';
import { initPointerGlow } from './glow.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMedia();
  initReveals();
  initGreeting();
  initLouver();
  initMagnetic();
  initPointerGlow();
});

