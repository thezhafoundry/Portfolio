/* YouTube Video Pop-up Modal lightbox controller.
   Opens an embedded YouTube video in an accessible modal window,
   handles autoplay, backdrop click, and Escape key close. */

export function initYouTubeModal(root = document) {
  const modal = root.querySelector('#youtube-modal');
  const openBtns = root.querySelectorAll('[data-youtube-open]');
  const closeBtn = root.querySelector('#youtube-modal-close');
  const iframe = root.querySelector('#youtube-iframe');

  if (!modal || !iframe) return;

  const defaultVideoId = 'dQw4w9WgXcQ'; // Lead gen strategy video fallback

  const openModal = (videoId = defaultVideoId) => {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('is-open');
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    iframe.src = '';
    modal.classList.remove('is-open');
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = btn.dataset.youtubeOpen || defaultVideoId;
      openModal(videoId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-scrim')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}
