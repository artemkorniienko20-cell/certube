import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class VideoPlayerModal {
  constructor(container) {
    this.container = container;
    this.video = null;
    this.showPreroll = false;
    this.adSecondsLeft = 5;
    this.adInterval = null;
    this.comments = [
      { id: 'c1', author: 'Андрій К.', text: 'Дуже якісне відео! Радий, що знайшов Certube 👍', time: '2 години тому' },
      { id: 'c2', author: 'Олена Мельник', text: 'Зручний інтерфейс, як у ютубі, та й Shorts круто працюють!', time: '5 годин тому' }
    ];

    this.init();
    store.subscribe((event, payload) => {
      if (event === 'player_opened') {
        this.open(payload);
      } else if (event === 'player_closed') {
        this.close();
      } else if (event === 'premium_changed') {
        if (store.isPremium && this.showPreroll) {
          this.skipAd();
        }
      }
    });
  }

  init() {
    this.render();
  }

  open(video) {
    this.video = video;
    // Якщо немає Premium, запускаємо прерол реклами на 5 секунд
    if (!store.isPremium) {
      this.showPreroll = true;
      this.adSecondsLeft = 5;
    } else {
      this.showPreroll = false;
    }

    const overlay = this.container.querySelector('#playerOverlay');
    if (overlay) {
      overlay.classList.add('active');
    }
    this.render();

    if (this.showPreroll) {
      this.startAdTimer();
    }
  }

  close() {
    const overlay = this.container.querySelector('#playerOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    this.clearAdTimer();
    this.video = null;
    this.showPreroll = false;
    store.closePlayer();
  }

  startAdTimer() {
    this.clearAdTimer();
    this.adInterval = setInterval(() => {
      this.adSecondsLeft--;
      const timerLabel = this.container.querySelector('#adCountdownText');
      const skipBtn = this.container.querySelector('#adSkipBtn');

      if (this.adSecondsLeft > 0) {
        if (timerLabel) timerLabel.textContent = `Рекламу можна пропустити через ${this.adSecondsLeft} с...`;
      } else {
        if (timerLabel) timerLabel.textContent = 'Реклама готова до пропуску';
        if (skipBtn) {
          skipBtn.classList.add('ready');
          skipBtn.innerHTML = 'Пропустити рекламу ⏭';
        }
        clearInterval(this.adInterval);
      }
    }, 1000);
  }

  clearAdTimer() {
    if (this.adInterval) {
      clearInterval(this.adInterval);
      this.adInterval = null;
    }
  }

  skipAd() {
    this.clearAdTimer();
    this.showPreroll = false;
    this.render();
  }

  render() {
    if (!this.video) {
      this.container.innerHTML = `<div class="player-modal-overlay" id="playerOverlay"></div>`;
      return;
    }

    const video = this.video;
    const isPremium = store.isPremium;
    const isLiked = store.likedVideos.has(video.id);
    const isSubscribed = store.subscribedChannels.has(video.channel);
    const recommendations = store.videos.filter(v => v.id !== video.id).slice(0, 8);

    this.container.innerHTML = `
      <div class="player-modal-overlay active" id="playerOverlay">
        <div class="player-layout">
          <!-- Головна колонка: плеєр та опис -->
          <div class="player-main-col">
            <div class="player-top-bar">
              <button class="player-close-btn" id="closePlayerBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Назад до Certube</span>
              </button>
              ${isPremium ? `
                <span class="badge-premium">
                  ${icons.crown()} Certube Premium • Реклама вимкнена
                </span>
              ` : `
                <button class="btn-header-premium" id="playerGetPremiumBtn" style="font-size:12px; padding:4px 12px;">
                  ${icons.crown()} Вимкнути рекламу за 100 ₴
                </button>
              `}
            </div>

            <!-- Сцена відеоплеєра -->
            <div class="video-stage-container">
              ${this.showPreroll ? `
                <!-- 5-секундна відеореклама для користувачів без Premium -->
                <div class="preroll-ad-overlay" id="prerollAdBox">
                  <div class="ad-top-indicator">
                    <span class="ad-pill-tag">Реклама • 1 з 1</span>
                    <span class="ad-sponsor-info">Certube Ads Спонсор: Смарт-Шкарпетки UA</span>
                  </div>

                  <div class="ad-video-mock-center">
                    <div style="font-size:40px; margin-bottom:10px;">⚡🛍️</div>
                    <h2>Супер-розпродаж до -70%!</h2>
                    <p>Замовляйте найкращі товари з безкоштовною доставкою по Україні.</p>
                  </div>

                  <div class="ad-bottom-bar">
                    <button class="ad-get-premium-btn" id="adGoPremiumBtn">
                      ${icons.crown()} Дивитися без реклами (100 грн)
                    </button>

                    <div class="ad-skip-container">
                      <span id="adCountdownText" style="font-size:13px; color:#aaa;">Рекламу можна пропустити через ${this.adSecondsLeft} с...</span>
                      <button class="ad-skip-btn ${this.adSecondsLeft <= 0 ? 'ready' : ''}" id="adSkipBtn">
                        ${this.adSecondsLeft <= 0 ? 'Пропустити рекламу ⏭' : 'Зачекайте...'}
                      </button>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Вбудований YouTube плеєр або локальне відео -->
              ${video.youtubeId ? `
                <iframe 
                  src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1" 
                  title="${video.title}" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                ></iframe>
              ` : video.videoBlobUrl ? `
                <video src="${video.videoBlobUrl}" controls autoplay playsinline></video>
              ` : `
                <div style="display:flex; align-items:center; justify-content:center; height:100%; color:#fff;">
                  Помилка завантаження джерела відео
                </div>
              `}
            </div>

            <!-- Метадані відео -->
            <div class="video-meta-section">
              <h1 class="player-video-title">${video.title}</h1>

              <div class="player-channel-and-actions">
                <div class="player-channel-col">
                  <div class="player-channel-avatar">
                    <img src="${video.channelAvatar}" alt="${video.channel}" />
                  </div>
                  <div class="player-channel-text">
                    <div class="player-channel-name">
                      <span>${video.channel}</span>
                      ${video.verified ? icons.check() : ''}
                    </div>
                    <span class="player-channel-subs">${video.subscribers || '120 тис. підписників'}</span>
                  </div>
                  <button class="btn-player-sub ${isSubscribed ? 'subscribed' : ''}" id="subChannelBtn">
                    ${isSubscribed ? 'Ви підписані' : 'Підписатися'}
                  </button>
                </div>

                <!-- Кнопки взаємодії: Лайк, Дизлайк, Поділитись -->
                <div class="player-actions-row">
                  <div class="player-action-pill">
                    <button class="player-action-pill-btn ${isLiked ? 'active' : ''}" id="likeVideoBtn">
                      ${icons.like()}
                      <span>${video.likes}</span>
                    </button>
                    <div class="pill-divider"></div>
                    <button class="player-action-pill-btn" id="dislikeVideoBtn" title="Не подобається">
                      ${icons.dislike()}
                    </button>
                  </div>

                  <button class="player-action-pill-btn" id="shareVideoBtn" style="background:var(--yt-bg-elevated); border-radius:var(--radius-full);">
                    ${icons.share()}
                    <span>Поділитися</span>
                  </button>
                </div>
              </div>

              <!-- Опис відео -->
              <div class="player-description-box">
                <div class="player-desc-stats">
                  <span>${video.views}</span> • <span>${video.timestamp}</span> • <span style="color:var(--yt-blue);">#certube #youtube</span>
                </div>
                <p>${video.description || 'Опис відсутній.'}</p>
              </div>

              <!-- Секція коментарів -->
              <div class="comments-section">
                <div class="comments-header">Коментарі (${this.comments.length})</div>

                <div class="comment-input-row">
                  <div class="channel-avatar" style="width:34px; height:34px;">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" alt="You" />
                  </div>
                  <div style="flex:1;">
                    <input type="text" class="comment-input-field" id="newCommentInput" placeholder="Залиште коментар..." />
                    <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                      <button class="btn-player-sub" id="postCommentBtn" style="font-size:12px; padding:6px 14px;">Коментувати</button>
                    </div>
                  </div>
                </div>

                <div class="comments-list">
                  ${this.comments.map(c => `
                    <div class="comment-item">
                      <div class="channel-avatar" style="width:32px; height:32px;">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="User" />
                      </div>
                      <div>
                        <div class="comment-author-name">${c.author} <span style="font-size:11px; font-weight:normal; color:#888;">${c.time}</span></div>
                        <div class="comment-text-body">${c.text}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Бокова колонка рекомендацій -->
          <div class="player-sidebar-col">
            <h3 style="font-size:15px; margin-bottom:12px;">Схожі відео YouTube</h3>
            <div class="recommendations-list">
              ${recommendations.map(rec => {
                const thumb = rec.youtubeId 
                  ? `https://img.youtube.com/vi/${rec.youtubeId}/hqdefault.jpg`
                  : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=280&h=160&fit=crop';
                return `
                  <div class="rec-video-card" data-rec-id="${rec.id}">
                    <div class="rec-thumb-wrap">
                      <img src="${thumb}" alt="${rec.title}" />
                    </div>
                    <div class="rec-meta">
                      <div class="rec-title">${rec.title}</div>
                      <div class="rec-channel">${rec.channel}</div>
                      <div class="rec-stats">${rec.views}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#closePlayerBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Skip Ad button
    const skipBtn = this.container.querySelector('#adSkipBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (this.adSecondsLeft <= 0) {
          this.skipAd();
        }
      });
    }

    // Buy Premium from Ad
    const adGoPremBtn = this.container.querySelector('#adGoPremiumBtn');
    const playerGetPremBtn = this.container.querySelector('#playerGetPremiumBtn');
    [adGoPremBtn, playerGetPremBtn].forEach(b => {
      if (b) {
        b.addEventListener('click', () => {
          store.openPremiumModal();
        });
      }
    });

    // Subscriptions
    const subBtn = this.container.querySelector('#subChannelBtn');
    if (subBtn && this.video) {
      subBtn.addEventListener('click', () => {
        store.toggleSubscribe(this.video.channel);
        this.render();
      });
    }

    // Likes
    const likeBtn = this.container.querySelector('#likeVideoBtn');
    if (likeBtn && this.video) {
      likeBtn.addEventListener('click', () => {
        store.toggleLike(this.video.id);
        this.render();
      });
    }

    // Share
    const shareBtn = this.container.querySelector('#shareVideoBtn');
    if (shareBtn && this.video) {
      shareBtn.addEventListener('click', () => {
        const url = this.video.youtubeId 
          ? `https://www.youtube.com/watch?v=$$${this.video.youtubeId}` 
          : window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          alert('Посилання скопійовано в буфер обміну!');
        }).catch(() => {
          alert(`Посилання: ${url}`);
        });
      });
    }

    // Posting comments
    const postBtn = this.container.querySelector('#postCommentBtn');
    const commentInput = this.container.querySelector('#newCommentInput');
    if (postBtn && commentInput) {
      postBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
          this.comments.unshift({
            id: `c-${Date.now()}`,
            author: 'Ви (Certube Користувач)',
            text,
            time: 'Щойно'
          });
          commentInput.value = '';
          this.render();
        }
      });
    }

    // Switching recommendation video
    this.container.querySelectorAll('[data-rec-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.recId;
        const targetVideo = store.videos.find(v => v.id === id);
        if (targetVideo) {
          this.open(targetVideo);
        }
      });
    });
  }
}
