/**
 * Interactive Deal Sourcing & Pipeline ROI Simulator.
 * Allows prospects to select their sector and target account scale to see real-time estimated outcomes.
 */
export function initSimulator() {
  const container = document.getElementById('deal-simulator');
  if (!container) return;

  const slider = container.querySelector('#sim-accounts');
  const accountValueEl = container.querySelector('#sim-accounts-val');
  const sectorBtns = container.querySelectorAll('[data-sector]');
  const meetingsEl = container.querySelector('#sim-meetings');
  const hoursEl = container.querySelector('#sim-hours');
  const velocityEl = container.querySelector('#sim-velocity');

  if (!slider) return;

  let activeSector = 'saas'; // default

  const sectorMultipliers = {
    saas: { meetingRate: 0.14, hrsPerAccount: 0.45, speedMultiplier: 3.2 },
    pe: { meetingRate: 0.18, hrsPerAccount: 0.65, speedMultiplier: 4.5 },
    midmarket: { meetingRate: 0.12, hrsPerAccount: 0.50, speedMultiplier: 2.8 },
  };

  function update() {
    const accounts = parseInt(slider.value, 10);
    if (accountValueEl) accountValueEl.textContent = `${accounts} accounts / mo`;

    const config = sectorMultipliers[activeSector] || sectorMultipliers.saas;

    const estMeetings = Math.round(accounts * config.meetingRate);
    const estHours = Math.round(accounts * config.hrsPerAccount);
    const speed = config.speedMultiplier;

    if (meetingsEl) meetingsEl.textContent = `~${estMeetings} qualified meetings`;
    if (hoursEl) hoursEl.textContent = `${estHours} hrs saved / mo`;
    if (velocityEl) velocityEl.textContent = `${speed}x pipeline velocity`;
  }

  slider.addEventListener('input', update);

  sectorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sectorBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      activeSector = btn.dataset.sector;
      update();
    });
  });

  update();
}
