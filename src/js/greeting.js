import { prefersReducedMotion } from './motion.js';

/* The rotating greeting.
   "Every deal begins with hello." is the brand line, so the greeting itself
   cycles through the markets Sampath has actually sold into — the "12 markets"
   claim gets felt rather than read.

   The list comes from linkedin-profile.md, not invention: US, UK, Europe,
   Australia, New Zealand, Singapore, Malaysia, UAE, Kuwait, India, Canada,
   MENA. Latin transliteration throughout, so every greeting sets in Cormorant
   Garamond — one typeface, no fallback jumble, no extra font payload. */
export const GREETINGS = [
  { word: 'Vanakkam.', market: 'India' },
  { word: 'Hello.',    market: 'US & UK' },
  { word: "G'day.",    market: 'Australia' },
  { word: 'Kia ora.',  market: 'New Zealand' },
  { word: 'Nǐ hǎo.',   market: 'Singapore' },
  { word: 'Selamat.',  market: 'Malaysia' },
  { word: 'Marhaba.',  market: 'UAE & Kuwait' },
  { word: 'Bonjour.',  market: 'France & Canada' },
  { word: 'Hallo.',    market: 'Germany' },
  { word: 'Hola.',     market: 'Spain' },
  { word: 'Ciao.',     market: 'Italy' },
  { word: 'Hej.',      market: 'Nordics' },
];

export const GREETING_MS = 2600;

/* Pure: next index, wrapping. */
export function nextGreeting(index, total) {
  return (index + 1) % total;
}

/* Progressive enhancement: the markup already carries a real "hello.", so a
   visitor without JS reads the complete sentence. This only takes over the
   slot once it can actually animate it. */
export function initGreeting(root = document) {
  const slot = root.querySelector('.greet');
  if (!slot) return;

  // One stable accessible name for the headline — a screen reader hears the
  // sentence once, not twelve greetings cycling underneath it.
  const heading = slot.closest('h1');
  if (heading) heading.setAttribute('aria-label', 'Every deal begins with hello.');
  slot.setAttribute('aria-hidden', 'true');

  if (prefersReducedMotion()) return; // keep the markup's "hello.", no cycle

  const render = (i) => {
    const { word, market } = GREETINGS[i];
    const em = document.createElement('em');
    em.className = 'greet__word';
    em.textContent = word;
    const span = document.createElement('span');
    span.className = 'greet__market';
    span.textContent = market;
    slot.replaceChildren(em, span);
  };

  let i = 0;
  render(i);
  setInterval(() => {
    i = nextGreeting(i, GREETINGS.length);
    render(i);
  }, GREETING_MS);
}
