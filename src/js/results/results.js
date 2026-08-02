import { initReveals } from '../shared/bubbles.js';
import { initNav } from '../shared/nav.js';
import { initMagnetic } from '../shared/magnetic.js';
import { renderFollowerCard } from './graph.js';
import { initCustomCursor } from '../shared/cursor.js';

initNav();
initReveals();
initMagnetic();
initCustomCursor();

const followerCard = document.getElementById('follower-card');
if (followerCard) renderFollowerCard(followerCard);
