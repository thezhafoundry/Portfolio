import { initReveals } from './bubbles.js';
import { initNav } from './nav.js';
import { initMagnetic } from './magnetic.js';
import { renderFollowerCard } from './graph.js';
import { initCustomCursor } from './cursor.js';

initNav();
initReveals();
initMagnetic();
initCustomCursor();

const followerCard = document.getElementById('follower-card');
if (followerCard) renderFollowerCard(followerCard);
