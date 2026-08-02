import { describe, expect, it } from 'vitest';
import { initNav, nextNavState } from '../src/js/shared/nav.js';

function createElement() {
  const listeners = new Map();
  const classes = new Set();

  return {
    attributes: new Map(),
    classList: {
      contains: (name) => classes.has(name),
      toggle: (name, force) => {
        if (force) classes.add(name);
        else classes.delete(name);
      },
    },
    focusCount: 0,
    hidden: false,
    addEventListener: (event, handler) => listeners.set(event, handler),
    dispatch: (event, detail = {}) => listeners.get(event)?.(detail),
    focus() {
      this.focusCount += 1;
    },
    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
  };
}

function createNavFixture() {
  const toggle = createElement();
  const nav = createElement();
  const scrim = createElement();
  const link = createElement();
  const documentElement = createElement();
  const body = createElement();
  const documentListeners = new Map();

  nav.querySelectorAll = () => [link];

  const root = {
    nodeType: 9,
    body,
    documentElement,
    addEventListener: (event, handler) => documentListeners.set(event, handler),
    dispatch: (event, detail = {}) => documentListeners.get(event)?.(detail),
    querySelector: (selector) => ({
      '.nav-toggle': toggle,
      '.site-nav': nav,
      '.nav-scrim': scrim,
    })[selector] ?? null,
  };

  return { body, documentElement, link, nav, root, scrim, toggle };
}

describe('nextNavState', () => {
  it('opens a closed navigation with a string aria-expanded value', () => {
    expect(nextNavState(false)).toEqual({ isOpen: true, expanded: 'true' });
  });

  it('closes an open navigation with a string aria-expanded value', () => {
    expect(nextNavState(true)).toEqual({ isOpen: false, expanded: 'false' });
  });
});

describe('initNav', () => {
  it('synchronizes the toggle, scrim, labels, and scroll lock', () => {
    const { body, documentElement, nav, root, scrim, toggle } = createNavFixture();

    initNav(root);
    toggle.dispatch('click');

    expect(nav.classList.contains('is-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Close navigation');
    expect(scrim.hidden).toBe(false);
    expect(documentElement.classList.contains('nav-is-open')).toBe(true);
    expect(body.classList.contains('nav-is-open')).toBe(true);
  });

  it('closes when the scrim or a navigation link is selected', () => {
    const { link, nav, root, scrim, toggle } = createNavFixture();

    initNav(root);
    toggle.dispatch('click');
    scrim.dispatch('click');
    expect(nav.classList.contains('is-open')).toBe(false);

    toggle.dispatch('click');
    link.dispatch('click');
    expect(nav.classList.contains('is-open')).toBe(false);
    expect(scrim.hidden).toBe(true);
  });

  it('closes on Escape and restores focus to the toggle', () => {
    const { nav, root, toggle } = createNavFixture();

    initNav(root);
    toggle.dispatch('click');
    root.dispatch('keydown', { key: 'Escape' });

    expect(nav.classList.contains('is-open')).toBe(false);
    expect(toggle.focusCount).toBe(1);
  });

  it('exits safely when shared navigation markup is absent', () => {
    expect(() => initNav({ querySelector: () => null })).not.toThrow();
  });
});
