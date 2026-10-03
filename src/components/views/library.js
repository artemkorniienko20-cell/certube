import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class LibraryView {
  constructor(container) {
    this.container = container;
    this.init();
    store.subscribe((event) => {
      if (['video_added', 'premium_changed', 'tab_changed', 'like_toggled'].includes(event)) {
        if (store.activeTab === 'library') {
          this.render();
        }
      }
    });
  }

  init() {
    this.render();
  }

  render() {
    const isPremium = store.isPremium;
    const myVideos = store.videos.filter(v => v.isCustom);
    const liked = store.videos.filter(v => store.likedVideos.has(v.id));

    this.container.innerHTML = `
      <div class="feed-container">
        <!-- Блок статусу Certube Premium -->
        <div style="background: radial-gradient(circle at top left, #29200a 0%, #161616 100%); border: 1px solid rgba(255,215,0,0.3); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span style="color:var(--yt-premium-gold);">${icons.crown()}</span>
              <h3 style="font-size:17px; font-weight:800; color:#fff;">
                Certube Premium ${isPremium ? '<span class="badge-premium" style="margin-left:8px;">АКТИВНИЙ</span>' : ''}
              </h3>
            </div>
            <p style="font-size:13px; color:var(--yt-text-secondary); max-width:550px;">
              ${isPremium 
                ? 'Ваша підписка активна (100 грн/місяць). Уся реклама та банери на платформі повністю вимкнені.' 
                : 'Підписка не активна. Отримайте Certube Premium лише за 100 грн/місяць та забудьте про будь-яку рекламу!'}
            </p>
          </div>
          <button class="btn-header-premium" id="libraryPremiumBtn">
            ${isPremium ? 'Керувати підпискою' : 'Оформити за 100 ₴'}
          </button>
        </div>

        <!-- Секція: Мої створені відео (+) -->
        <div style="margin-bottom: 30px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h2 style="font-size:18px; font-weight:700;">Ваші створені відео (${myVideos.length})</h2>
            <button class="ad-cta-btn" id="libraryCreateBtn" style="padding:6px 14px; font-size:12px;">
              ${icons.plus()} Створити нове
            </button>
          </div>

          ${myVideos.length === 0 ? `
            <div style="background:#181818; border:1px dashed var(--yt-border); border-radius:var(--radius-md); padding:30px; text-align:center; color:#aaa;">
              <p style="margin-bottom:10px;">Ви ще не створювали відео на Certube.</p>
              <button class="record-action-btn start-rec" id="emptyCreateBtn" style="margin:0 auto; font-size:12px; padding:8px 16px;">
                Натисніть кнопку «+» щоб записати перше відео
              </button>
            </div>
          ` : `
            <div class="videos-grid">
              ${myVideos.map(video => `
                <article class="video-card" data-video-id="${video.id}">
                  <div class="video-thumbnail-wrap">
                    <img 
                      src="${video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop'}" 
                      alt="${video.title}" 
                    />
                    <span class="video-duration">${video.duration || '01:30'}</span>
                    <span class="video-custom-badge">Моє відео</span>
                  </div>
                  <div class="video-info-row">
                    <div class="video-text-meta">
                      <h3 class="video-title">${video.title}</h3>
                      <div class="channel-name">Мій Канал</div>
                      <div class="video-stats">${video.timestamp} • Опубліковано</div>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Секція: Вподобані відео -->
        <div>
          <h2 style="font-size:18px; font-weight:700; margin-bottom:14px;">Вподобані відео (${liked.length})</h2>
          ${liked.length === 0 ? `
            <div style="color:var(--yt-text-secondary); font-size:13px;">Тут з'являтимуться відео, які ви відзначите лайком.</div>
          ` : `
            <div class="videos-grid">
              ${liked.map(video => `
                <article class="video-card" data-video-id="${video.id}">
                  <div class="video-thumbnail-wrap">
                    <img src="${video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop'}" alt="${video.title}" />
                    <span class="video-duration">${video.duration}</span>
                  </div>
                  <div class="video-info-row">
                    <div class="video-text-meta">
                      <h3 class="video-title">${video.title}</h3>
                      <div class="channel-name">${video.channel}</div>
                      <div class="video-stats">${video.views}</div>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const premBtn = this.container.querySelector('#libraryPremiumBtn');
    if (premBtn) {
      premBtn.addEventListener('click', () => store.openPremiumModal());
    }

    const createBtn = this.container.querySelector('#libraryCreateBtn');
    const emptyBtn = this.container.querySelector('#emptyCreateBtn');
    [createBtn, emptyBtn].forEach(b => {
      if (b) b.addEventListener('click', () => store.openStudio());
    });

    this.container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.videoId;
        const v = store.videos.find(item => item.id === id);
        if (v) store.openPlayer(v);
      });
    });
  }
}
