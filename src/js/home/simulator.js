/**
 * Interactive Deal Sourcing & Pipeline ROI Simulator.
 * Allows prospects to select their sector and target account scale to see real-time estimated outcomes.
 */
export function initSimulator() {
  const containers = document.querySelectorAll('#deal-simulator, .sim-card');
  if (!containers.length) return;

  containers.forEach((container) => {
    const slider = container.querySelector('#sim-accounts, .sim-slider');
    const accountValueEl = container.querySelector('#sim-accounts-val, .sim-badge');
    const sectorBtns = container.querySelectorAll('[data-sector]');
    const meetingsEl = container.querySelector('#sim-meetings, [data-sim-meetings]');
    // Research cycle display — always constant 30 days
    const timeframeEl = container.querySelector('#sim-hours, #sim-timeframe, [data-sim-timeframe]');
    // Dynamic MQL lead timeline
    const mqlTimeEl = container.querySelector('#sim-mql-time, [data-sim-mql-time]');
    const toolsCostEl = container.querySelector('#sim-velocity, #sim-tools-cost, [data-sim-tools-cost]');

    if (!slider) return;

    let activeSector = 'saas';

    const sectorConfigs = {
      saas:      { meetingRate: 0.15, baseToolCost: 450, costPerClient: 5 },
      services:  { meetingRate: 0.12, baseToolCost: 350, costPerClient: 4 },
      midmarket: { meetingRate: 0.14, baseToolCost: 500, costPerClient: 6 },
    };

    function pulse(el) {
      if (!el) return;
      el.classList.remove('is-updated');
      // eslint-disable-next-line no-void
      void el.offsetWidth;
      el.classList.add('is-updated');
    }

    function setText(el, text) {
      if (!el || el.textContent === text) return;
      el.textContent = text;
      pulse(el);
    }

    /**
     * Returns a human-readable MQL lead timeline string based on client volume.
     * The research cycle itself is always 30 days (constant).
     * The MQL lead timeline grows with volume.
     */
    function getMqlTimeline(clients) {
      if (clients <= 30)  return '45–90 Days to MQL Lead';
      if (clients <= 70)  return '75–100 Days to MQL Lead';
      if (clients <= 120) return '90–120 Days to MQL Lead';
      if (clients <= 180) return '110–140 Days to MQL Lead';
      if (clients <= 250) return '130–160 Days to MQL Lead';
      return '150–180 Days to MQL Lead';
    }

    function update() {
      const clients = parseInt(slider.value, 10);
      setText(accountValueEl, `${clients} Clients / Leads per mo`);

      const config = sectorConfigs[activeSector] || sectorConfigs.saas;

      const estMeetings = Math.max(1, Math.round(clients * config.meetingRate));

      // Research cycle is always constant — always 30 days
      setText(timeframeEl, '30 Days Research Cycle');

      // MQL lead timeline grows dynamically with volume
      setText(mqlTimeEl, getMqlTimeline(clients));

      const estToolsCost = config.baseToolCost + clients * config.costPerClient;

      setText(meetingsEl, `~${estMeetings} MQL Leads & Meetings`);
      setText(toolsCostEl, `$${estToolsCost.toLocaleString()}/mo Tools Cost Stack`);
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
  });
}
