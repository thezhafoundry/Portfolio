/* ==========================================================================
   Main Interactivity Script for Sampath Kumar Portfolio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  // Accordion Interactivity for Process Section
  const accordionItems = document.querySelectorAll('#processAccordion .accordion-item');
  accordionItems.forEach(item => {
    item.addEventListener('click', () => {
      accordionItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Timeline Category Filtering
  const filterChips = document.querySelectorAll('.timeline-filters .filter-chip');
  const timelineCards = document.querySelectorAll('.timeline-list .timeline-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterValue = chip.getAttribute('data-filter');

      timelineCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'block';
        } else {
          const categories = card.getAttribute('data-category') || '';
          if (categories.includes(filterValue)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // Number Counter Animation on Scroll
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const targetVal = parseFloat(stat.getAttribute('data-target'));
      const textVal = stat.innerText;
      let count = 0;
      const speed = 40;

      const updateCount = () => {
        const increment = targetVal / speed;
        if (count < targetVal) {
          count += increment;
          if (targetVal % 1 !== 0) {
            stat.innerText = count.toFixed(1) + '/10';
          } else if (textVal.includes('%')) {
            stat.innerText = '+' + Math.ceil(count) + '%';
          } else if (textVal.includes('M+')) {
            stat.innerText = Math.ceil(count) + 'M+';
          } else if (textVal.includes('+')) {
            stat.innerText = Math.ceil(count) + '+';
          } else {
            stat.innerText = Math.ceil(count);
          }
          setTimeout(updateCount, 30);
        } else {
          stat.innerText = textVal;
        }
      };

      updateCount();
    });
  }

  // Intersection Observer for Counter Trigger
  const heroStats = document.querySelector('.hero-stats-bar');
  if (heroStats) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(heroStats);
  }

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scheduling...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Consultation Requested!';
        btn.style.backgroundColor = '#10B981';
        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 4000);
      }, 1200);
    });
  }
});
