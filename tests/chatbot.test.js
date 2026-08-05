import { describe, expect, it } from 'vitest';
import { initChatbot } from '../src/js/shared/chatbot.js';

function createElement() {
  const listeners = new Map();
  const classes = new Set();
  const attributes = new Map();

  return {
    hidden: false,
    focusCount: 0,
    classList: {
      contains: (name) => classes.has(name),
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
    },
    addEventListener: (event, handler) => listeners.set(event, handler),
    dispatch: (event, detail = {}) => listeners.get(event)?.(detail),
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, String(value)),
    removeAttribute: (name) => attributes.delete(name),
    focus() {
      this.focusCount += 1;
    },
  };
}

const FAQ_IDS = ['services', 'process', 'pricing', 'results', 'booking'];

function createChatbotFixture() {
  const trigger = createElement();
  const panel = createElement();
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  trigger.setAttribute('aria-expanded', 'false');

  const closeBtn = createElement();
  const menu = createElement();
  const answers = Object.fromEntries(FAQ_IDS.map((id) => [id, createElement()]));
  Object.values(answers).forEach((el) => { el.hidden = true; });

  const menuChips = FAQ_IDS.map((id) => {
    const chip = createElement();
    chip.getAttribute = (name) => (name === 'data-chatbot-show' ? id : null);
    return chip;
  });
  const backChip = createElement();
  backChip.getAttribute = (name) => (name === 'data-chatbot-show' ? 'menu' : null);
  const allChips = [...menuChips, backChip];

  const byId = {
    '#chatbot-trigger': trigger,
    '#chatbot-panel': panel,
    '#chatbot-close': closeBtn,
    '#chatbot-menu': menu,
    '#chatbot-answer-services': answers.services,
    '#chatbot-answer-process': answers.process,
    '#chatbot-answer-pricing': answers.pricing,
    '#chatbot-answer-results': answers.results,
    '#chatbot-answer-booking': answers.booking,
  };

  const documentListeners = new Map();
  const root = {
    nodeType: 9,
    addEventListener: (event, handler) => documentListeners.set(event, handler),
    dispatch: (event, detail = {}) => documentListeners.get(event)?.(detail),
    querySelector: (selector) => byId[selector] ?? null,
    querySelectorAll: (selector) => (selector === '[data-chatbot-show]' ? allChips : []),
  };

  return { answers, backChip, closeBtn, menu, menuChips, panel, root, trigger };
}

describe('initChatbot', () => {
  it('opens the panel and shows the menu view', () => {
    const { menu, panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    expect(menu.hidden).toBe(false);
  });

  it('closes the panel when the trigger is clicked again', () => {
    const { panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    trigger.dispatch('click');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  it('switches to the matching answer view when a chip is clicked', () => {
    const { answers, menu, menuChips, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    menuChips[2].dispatch('click'); // pricing

    expect(menu.hidden).toBe(true);
    expect(answers.pricing.hidden).toBe(false);
    expect(answers.services.hidden).toBe(true);
  });

  it('returns to the menu view from the "ask another question" chip', () => {
    const { answers, backChip, menu, menuChips, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    menuChips[0].dispatch('click'); // services
    backChip.dispatch('click');

    expect(menu.hidden).toBe(false);
    expect(answers.services.hidden).toBe(true);
  });

  it('closes the panel via the close button', () => {
    const { closeBtn, panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    closeBtn.dispatch('click');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  it('closes on Escape and restores focus to the trigger', () => {
    const { panel, root, trigger } = createChatbotFixture();

    initChatbot(root);
    trigger.dispatch('click');
    root.dispatch('keydown', { key: 'Escape' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.focusCount).toBe(1);
  });

  it('exits safely when the chatbot markup is absent', () => {
    expect(() => initChatbot({ querySelector: () => null, querySelectorAll: () => [] })).not.toThrow();
  });
});
