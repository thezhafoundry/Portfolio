/* Cal.com inline embed with a designed fallback (spec §6.4).
   Cal.com sends confirmation emails to BOTH parties and calendar invites —
   this satisfies the "schedule a meeting which sends a mail" requirement. */

const CAL_ORIGIN = 'https://cal.com';
const EMBED_SRC = 'https://app.cal.com/embed/embed.js';

export function initScheduler({ calLink, container, fallback, timeoutMs = 8000 }) {
  let settled = false;

  function showFallback() {
    if (settled) return;
    settled = true;
    container.hidden = true;
    fallback.hidden = false;
  }

  // No real link yet (spec §8.4) -> show the designed fallback immediately.
  if (!calLink || calLink.startsWith('TODO')) { showFallback(); return; }

  const timer = setTimeout(showFallback, timeoutMs);
  function markReady() {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
  }

  try {
    /* Official Cal.com embed snippet (loader) */
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
    window.Cal('inline', {
      elementOrSelector: container,
      calLink,
      config: { theme: 'light' },
    });
    window.Cal('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#1E1B12' } },
      hideEventTypeDetails: false,
    });
    window.Cal('on', { action: 'linkReady', callback: markReady });
    window.Cal('on', { action: 'linkFailed', callback: showFallback });
  } catch {
    showFallback();
  }
}
