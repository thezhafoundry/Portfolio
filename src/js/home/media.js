export function getMediaMode({ videoSrc = '', posterSrc = '' } = {}) {
  if (videoSrc && videoSrc.trim()) return 'video';
  if (posterSrc && posterSrc.trim()) return 'image';
  return 'empty';
}

export function initMedia(root = document) {
  const mediaElements = root.querySelectorAll('[data-media]');

  mediaElements.forEach((el) => {
    const videoSrc = el.dataset.videoSrc || '';
    const posterSrc = el.dataset.posterSrc || el.querySelector('img')?.getAttribute('src') || '';
    const mode = getMediaMode({ videoSrc, posterSrc });

    if (mode === 'empty') {
      el.hidden = true;
      return;
    }

    const img = el.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        el.classList.add('media--fallback');
      });
    }

    if (mode === 'image') {
      const playBtn = el.querySelector('.media__play-btn');
      if (playBtn) playBtn.hidden = true;
      return;
    }

    if (mode === 'video') {
      let playBtn = el.querySelector('.media__play-btn');
      if (!playBtn) {
        playBtn = document.createElement('button');
        playBtn.className = 'media__play-btn btn btn--primary';
        playBtn.type = 'button';
        playBtn.setAttribute('aria-label', 'Watch introduction');
        playBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          <span>Watch introduction</span>
        `;
        el.appendChild(playBtn);
      } else {
        playBtn.hidden = false;
      }

      let dialog = el.querySelector('dialog.media__dialog');
      if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.className = 'media__dialog';
        dialog.innerHTML = `
          <div class="media__dialog-content">
            <button type="button" class="media__close-btn" aria-label="Close video">×</button>
            <video controls preload="metadata">
              <source src="${videoSrc}" type="video/mp4">
              <track kind="captions" src="${el.dataset.captionsSrc || ''}" srclang="en" label="English">
              Your browser does not support HTML video.
            </video>
            ${el.dataset.transcriptUrl ? `<a href="${el.dataset.transcriptUrl}" class="media__transcript-link">Read transcript</a>` : ''}
          </div>
        `;
        document.body.appendChild(dialog);
      }

      const video = dialog.querySelector('video');
      const closeBtn = dialog.querySelector('.media__close-btn');

      const closeDialog = () => {
        if (video) video.pause();
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
        playBtn.focus();
      };

      playBtn.addEventListener('click', () => {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', 'true');
        }
      });

      closeBtn?.addEventListener('click', closeDialog);

      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
          closeDialog();
        }
      });

      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeDialog();
      });
    }
  });
}
