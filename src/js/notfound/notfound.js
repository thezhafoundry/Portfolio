import { initNav } from '../shared/nav.js';
import { initScrollTop } from '../shared/scroll-top.js';
import { initChatbot } from '../shared/chatbot.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollTop();
  initChatbot();
});
