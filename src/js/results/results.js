import { initReveals } from '../shared/bubbles.js';
import { initNav } from '../shared/nav.js';
import { initMagnetic } from '../shared/magnetic.js';
import { renderFollowerCard } from './graph.js';
import { initCustomCursor } from '../shared/cursor.js';
import { initScrollTop } from '../shared/scroll-top.js';

initNav();
initReveals();
initMagnetic();
initCustomCursor();
initScrollTop();

const followerCard = document.getElementById('follower-card');
if (followerCard) renderFollowerCard(followerCard);
