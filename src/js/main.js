import { initNav } from './nav.js';
import { initMedia } from './media.js';
import { initReveals } from './bubbles.js';
import { initHeroMotion } from './heroMotion.js';
import { initMagnetic } from './magnetic.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMedia();
  initReveals();
  initHeroMotion();
  initMagnetic();
});

