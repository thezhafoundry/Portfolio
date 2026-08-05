const FAQ_IDS = ['services', 'process', 'pricing', 'results', 'booking'];

/* Every page's first viewport runs content close to the bottom-left corner
   (the homepage hero's CTA row, the story page's opening paragraph) — the
   trigger would sit on top of it at rest. Stay hidden until the user has
   scrolled a little, same intent as #pip-wrap fading out during the hero,
   but keyed off scroll position instead of a per-page hero selector so it
   works identically on all 8 pages. */
const REVEAL_SCROLL_THRESHOLD = 220;

function initScrollReveal(trigger) {
  if (typeof window === 'undefined' || !window.addEventListener) return;

  let ticking = false;
  const update = () => {
    trigger.classList.toggle('chatbot-trigger--hidden', window.scrollY < REVEAL_SCROLL_THRESHOLD);
    ticking = false;
  };

  update();
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
}

export function initChatbot(root = document) {
  const trigger = root.querySelector('#chatbot-trigger');
  const panel = root.querySelector('#chatbot-panel');
  const closeBtn = root.querySelector('#chatbot-close');
  const menu = root.querySelector('#chatbot-menu');
  const ownerDocument = root.nodeType === 9 ? root : root.ownerDocument;

  if (!trigger || !panel || !closeBtn || !menu || !ownerDocument) return;

  initScrollReveal(trigger);

  const answers = FAQ_IDS
    .map((id) => root.querySelector(`#chatbot-answer-${id}`))
    .filter(Boolean);
  const views = [menu, ...answers];

  const showView = (target) => {
    views.forEach((view) => {
      view.hidden = view !== target;
    });
  };

  const open = () => {
    showView(menu);
    panel.removeAttribute('hidden');
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => panel.classList.add('chatbot-panel--open'));
    } else {
      panel.classList.add('chatbot-panel--open');
    }
  };

  const close = () => {
    panel.classList.remove('chatbot-panel--open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    panel.addEventListener('transitionend', () => {
      if (!panel.classList.contains('chatbot-panel--open')) {
        panel.setAttribute('hidden', '');
        panel.hidden = true;
      }
    }, { once: true });
  };

  trigger.addEventListener('click', () => {
    trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  closeBtn.addEventListener('click', () => close());

  root.querySelectorAll('[data-chatbot-show]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const targetId = chip.getAttribute('data-chatbot-show');
      const target = targetId === 'menu'
        ? menu
        : root.querySelector(`#chatbot-answer-${targetId}`);
      if (target) showView(target);
    });
  });

  ownerDocument.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      close();
      trigger.focus();
    }
  });
}
