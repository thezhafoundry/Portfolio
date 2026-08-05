import { initReveals } from '../shared/bubbles.js';
import { initNav } from '../shared/nav.js';
import { initMagnetic } from '../shared/magnetic.js';
import { renderFollowerCard } from './graph.js';
import { initCustomCursor } from '../shared/cursor.js';
import { initScrollTop } from '../shared/scroll-top.js';
import { initChatbot } from '../shared/chatbot.js';

initNav();
initReveals();
initMagnetic();
initCustomCursor();
initScrollTop();
initChatbot();

const followerCard = document.getElementById('follower-card');
if (followerCard) renderFollowerCard(followerCard);
