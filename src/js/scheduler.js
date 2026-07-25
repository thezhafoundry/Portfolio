const CAL_ORIGIN = 'https://cal.com';
const EMBED_SRC = 'https://app.cal.com/embed/embed.js';

export function resolveScheduleMode(calLink = '') {
  if (typeof calLink !== 'string') return 'fallback';
  const trimmed = calLink.trim();
  if (!trimmed || trimmed.startsWith('TODO')) return 'fallback';
  return 'calendar';
}

export function initScheduler({
  calLink = '',
  container,
  fallback,
  status,
  timeoutMs = 8000,
} = {}) {
  const mode = resolveScheduleMode(calLink);

  if (mode === 'fallback') {
    if (container) container.hidden = true;
    if (fallback) fallback.hidden = false;
    if (status) {
      status.textContent = 'Direct online booking is being set up. Please connect via LinkedIn.';
    }
    return;
  }

  let settled = false;

  function showFallback(message = 'Unable to load interactive calendar. Please connect via LinkedIn.') {
    if (settled) return;
    settled = true;
    if (container) container.hidden = true;
    if (fallback) fallback.hidden = false;
    if (status) status.textContent = message;
  }

  function markReady() {
    if (settled) return;
    settled = true;
    // The typing bubble is the wait state; once Cal answers it has to go, or it
    // sits above the live embed still claiming to be loading.
    container?.querySelector('.cal-loading')?.remove();
    if (status) status.textContent = 'Calendar loaded successfully.';
  }

  if (status) status.textContent = 'Loading booking calendar...';
  const timer = setTimeout(() => showFallback('Calendar load timed out. Please connect via LinkedIn.'), timeoutMs);

  try {
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, EMBED_SRC, 'init');

    window.Cal('init', { origin: CAL_ORIGIN });
    if (container) {
      window.Cal('inline', {
        elementOrSelector: container,
        calLink: calLink.trim(),
        config: { theme: 'light' },
      });
    }
    window.Cal('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#6B21A8' } },
      hideEventTypeDetails: false,
    });
    window.Cal('on', { action: 'linkReady', callback: () => { clearTimeout(timer); markReady(); } });
    window.Cal('on', { action: 'linkFailed', callback: () => { clearTimeout(timer); showFallback(); } });
  } catch {
    clearTimeout(timer);
    showFallback();
  }
}
