import { categories } from '../../data/videos.js';
import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class VideoFeed {
  constructor(container) {
    this.container = container;
    this.init();
    store.subscribe((event) => {
      if (['videos_loaded', 'loading_changed', 'video_added', 'premium_changed', 'category_changed', 'search_changed', 'tab_changed'].includes(event)) {
        if (store.activeTab === 'home') {
          this.render();
        }
      }
    });
  }

  init() {
    this.render();
  }

  getFilteredVideos() {
    let list = store.videos;

    if (store.activeCategory === 'Мої відео') {
      list = list.filter(v => v.isCustom);
    }

    return list;
  }

  render() {
    const isPremium = store.isPremium;
    const isLoading = store.isLoadingVideos;
    const filteredVideos = this.getFilteredVideos();

    this.container.innerHTML = `
      <div class="feed-container">
        <!-- Чіпси категорій -->
        <div class="chips-bar" role="tablist">
          ${categories.map(cat => `
            <button 
              class="chip-btn ${store.activeCategory === cat ? 'active' : ''}" 
              data-category="${cat}"
            >
              ${cat}
            </button>
          `).join('')}
        </div>

        ${isLoading ? `
          <div class="feed-live-loader">
            <span class="spinner-dot"></span>
            <span>Завантаження свіжих відео напряму з YouTube...</span>
          </div>
        ` : ''}

        <!-- Сітка всіх відео з YouTube та рекламними блоками -->
        <div class="videos-grid">
          ${filteredVideos.length === 0 && !isLoading ? `
            <div class="empty-feed" style="grid-column: 1 / -1;">
              <h3>Відео не знайдено</h3>
              <p>Спробуйте інший пошуковий запит або створіть власне відео через кнопку «+»!</p>
            </div>
          ` : ''}

          ${filteredVideos.map((video, index) => {
            const isUserVideo = video.isCustom;
            const thumbUrl = video.youtubeId 
              ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
              : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop';

            // Рекламний банер після 3-го відео, якщо НЕМАЄ підписки Certube Premium
            const showAd = !isPremium && index === 2;

            return `
              ${showAd ? `
                <div class="ad-feed-card">
                  <div>
                    <span class="ad-badge">Спонсоровано • Certube Ads</span>
                    <h3 class="ad-title">Переглядайте ВСІ відео YouTube без реклами!</h3>
                    <p class="ad-desc">Підписка <strong>Certube Premium за 100 грн/місяць</strong> вимикає всі рекламні паузи та банери для будь-якого відео на платформі.</p>
                  </div>
                  <button class="ad-cta-btn" id="feedAdBuyBtn">
                    Придбати за 100 ₴
                  </button>
                </div>
              ` : ''}

              <article class="video-card" data-video-id="${video.id}">
                <div class="video-thumbnail-wrap">
                  <img 
                    src="${thumbUrl}" 
                    alt="${video.title}" 
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop'"
                  />
                  <span class="video-duration">${video.duration || '03:45'}</span>
                  ${isUserVideo ? `<span class="video-custom-badge">Створено в Certube</span>` : ''}
                </div>

                <div class="video-info-row">
                  <div class="channel-avatar">
                    <img src="${video.channelAvatar}" alt="${video.channel}" />
                  </div>
                  <div class="video-text-meta">
                    <h3 class="video-title" title="${video.title}">${video.title}</h3>
                    <div class="channel-name">
                      <span>${video.channel}</span>
                      ${video.verified ? icons.check() : ''}
                    </div>
                    <div class="video-stats">
                      <span>${video.views}</span> • <span>${video.timestamp}</span>
                    </div>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.bindEvents(filteredVideos);
  }

  bindEvents(videos) {
    // Клік по категоріях
    this.container.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.setActiveCategory(btn.dataset.category);
      });
    });

    // Клік по рекламній кнопці
    const adBtn = this.container.querySelector('#feedAdBuyBtn');
    if (adBtn) {
      adBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.openPremiumModal();
      });
    }

    // Клік по відеокартці
    this.container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.videoId;
        const video = videos.find(v => v.id === id);
        if (video) {
          store.openPlayer(video);
        }
      });
    });
  }
}
