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
    const timeframeEl = container.querySelector('#sim-hours, #sim-timeframe, [data-sim-timeframe]');
    const toolsCostEl = container.querySelector('#sim-velocity, #sim-tools-cost, [data-sim-tools-cost]');

    if (!slider) return;

    let activeSector = 'saas';

    const sectorConfigs = {
      saas: { meetingRate: 0.15, baseToolCost: 450, costPerClient: 5 },
      services: { meetingRate: 0.12, baseToolCost: 350, costPerClient: 4 },
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

    function update() {
      const clients = parseInt(slider.value, 10);
      setText(accountValueEl, `${clients} Clients / Leads per mo`);

      const config = sectorConfigs[activeSector] || sectorConfigs.saas;

      const estMeetings = Math.max(1, Math.round(clients * config.meetingRate));

      let researchTimeframe = '30 Days Research Cycle';
      if (clients > 150) {
        researchTimeframe = '90 Days Research Cycle';
      } else if (clients > 60) {
        researchTimeframe = '60 Days Research Cycle';
      }

      const estToolsCost = config.baseToolCost + clients * config.costPerClient;

      setText(meetingsEl, `~${estMeetings} MQL Leads & Meetings`);
      setText(timeframeEl, researchTimeframe);
      setText(toolsCostEl, `$${estToolsCost}/mo Tools Cost Stack`);
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

