import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class ShortsFeed {
  constructor(container) {
    this.container = container;
    this.currentIndex = 0;
    this.isMuted = false;
    this.init();
    store.subscribe((event) => {
      if (['shorts_loaded', 'video_added', 'tab_changed'].includes(event) && store.activeTab === 'shorts') {
        this.render();
      }
    });
  }

  init() {
    this.render();
  }

  formatCount(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  }

  render() {
    const shorts = store.shorts;
    if (shorts.length === 0) {
      this.container.innerHTML = `
        <div class="shorts-page-container">
          <div class="empty-feed">
            <h3>Завантаження YouTube Shorts...</h3>
            <p>Отримуємо найсвіжіші короткі відео прямо з YouTube!</p>
          </div>
        </div>
      `;
      return;
    }

    const currentShort = shorts[this.currentIndex] || shorts[0];
    const isLiked = currentShort.isLiked;
    const isSubscribed = store.subscribedChannels.has(currentShort.channel) || currentShort.isSubscribed;

    this.container.innerHTML = `
      <div class="shorts-page-container">
        <!-- Кнопки гортання для десктопу -->
        <div class="shorts-nav-arrows">
          <button class="shorts-arrow-btn" id="prevShortBtn" title="Попереднє відео (Вгору)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </button>
          <button class="shorts-arrow-btn" id="nextShortBtn" title="Наступне відео (Вниз)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
            </svg>
          </button>
        </div>

        <div class="shorts-feed-viewport" id="shortsViewport">
          <div class="short-video-wrapper">
            ${currentShort.youtubeId ? `
              <iframe 
                src="https://www.youtube.com/embed/${currentShort.youtubeId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${currentShort.youtubeId}&modestbranding=1&rel=0" 
                title="${currentShort.title}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            ` : currentShort.videoBlobUrl ? `
              <video src="${currentShort.videoBlobUrl}" autoplay loop playsinline></video>
            ` : `
              <div style="display:flex; align-items:center; justify-content:center; height:100%; color:#fff;">
                Відео недоступне
              </div>
            `}

            <!-- Нижня панель інформації про відео -->
            <div class="short-overlay-bottom">
              <div class="short-channel-row">
                <div class="short-channel-avatar">
                  <img src="${currentShort.channelAvatar}" alt="${currentShort.channel}" />
                </div>
                <span class="short-channel-name">@${currentShort.channel.replace(/\s+/g, '').toLowerCase()}</span>
                <button class="short-sub-btn ${isSubscribed ? 'subscribed' : ''}" id="shortSubBtn">
                  ${isSubscribed ? 'Ви підписані' : 'Підписатися'}
                </button>
              </div>

              <div class="short-title-text">${currentShort.title}</div>

              <div class="short-sound-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span>${currentShort.songTitle || 'Оригінальний звук'}</span>
              </div>
            </div>

            <!-- Права колонка дій (Лайк, Дизлайк, Коментарі, Поділитись) -->
            <div class="short-actions-column">
              <div class="short-action-item">
                <button class="short-action-btn ${isLiked ? 'active' : ''}" id="shortLikeBtn" title="Подобається">
                  ${icons.like()}
                </button>
                <span class="short-action-label">${this.formatCount(currentShort.likes || 0)}</span>
              </div>

              <div class="short-action-item">
                <button class="short-action-btn" id="shortDislikeBtn" title="Не подобається">
                  ${icons.dislike()}
                </button>
                <span class="short-action-label">Не подобається</span>
              </div>

              <div class="short-action-item">
                <button class="short-action-btn" id="shortCommentBtn" title="Коментарі">
                  ${icons.comment()}
                </button>
                <span class="short-action-label">${this.formatCount(currentShort.comments || 0)}</span>
              </div>

              <div class="short-action-item">
                <button class="short-action-btn" id="shortShareBtn" title="Поділитися">
                  ${icons.share()}
                </button>
                <span class="short-action-label">Поділитися</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(currentShort);
  }

  bindEvents(currentShort) {
    const nextBtn = this.container.querySelector('#nextShortBtn');
    const prevBtn = this.container.querySelector('#prevShortBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextShort());
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevShort());
    }

    // Like button
    const likeBtn = this.container.querySelector('#shortLikeBtn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        currentShort.isLiked = !currentShort.isLiked;
        currentShort.likes += currentShort.isLiked ? 1 : -1;
        this.render();
      });
    }

    // Subscribe button
    const subBtn = this.container.querySelector('#shortSubBtn');
    if (subBtn) {
      subBtn.addEventListener('click', () => {
        store.toggleSubscribe(currentShort.channel);
        this.render();
      });
    }

    // Share button
    const shareBtn = this.container.querySelector('#shortShareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = currentShort.youtubeId 
          ? `https://youtube.com/shorts/${currentShort.youtubeId}` 
          : window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          alert('Посилання на Short скопійовано в буфер обміну!');
        }).catch(() => {
          alert(`Посилання: ${url}`);
        });
      });
    }

    // Comment button
    const commentBtn = this.container.querySelector('#shortCommentBtn');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        const text = prompt('Напишіть коментар до цього Short:');
        if (text) {
          currentShort.comments = (currentShort.comments || 0) + 1;
          alert('Коментар опубліковано!');
          this.render();
        }
      });
    }

    // Keyboard navigation
    const handleKeydown = (e) => {
      if (store.activeTab !== 'shorts') return;
      if (e.key === 'ArrowDown') {
        this.nextShort();
      } else if (e.key === 'ArrowUp') {
        this.prevShort();
      }
    };
    window.removeEventListener('keydown', this._keyListener);
    this._keyListener = handleKeydown;
    window.addEventListener('keydown', handleKeydown);

    // Wheel navigation
    const viewport = this.container.querySelector('#shortsViewport');
    if (viewport) {
      let isScrolling = false;
      viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;
        isScrolling = true;
        if (e.deltaY > 30) {
          this.nextShort();
        } else if (e.deltaY < -30) {
          this.prevShort();
        }
        setTimeout(() => { isScrolling = false; }, 600);
      }, { passive: false });
    }
  }

  nextShort() {
    const shorts = store.shorts;
    if (this.currentIndex >= shorts.length - 2) {
      store.loadLiveShorts();
    }
    this.currentIndex = (this.currentIndex + 1) % shorts.length;
    this.render();
  }

  prevShort() {
    const shorts = store.shorts;
    this.currentIndex = (this.currentIndex - 1 + shorts.length) % shorts.length;
    this.render();
  }
}
