import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class UserProfileView {
  constructor(container) {
    this.container = container;
    this.activeTab = 'videos'; // 'videos' | 'shorts' | 'subscribers' | 'awards'
    this.init();
    store.subscribe((event) => {
      if (['video_added', 'premium_changed', 'profile_updated', 'tab_changed'].includes(event)) {
        if (store.activeTab === 'profile') {
          this.render();
        }
      }
    });
  }

  init() {
    this.render();
  }

  render() {
    const profile = store.userProfile;
    const isPremium = store.isPremium;
    const userCustomVideos = store.videos.filter(v => v.isCustom);
    const userCustomShorts = store.shorts.filter(s => s.isCustom);

    // Додаткові топові відео каналу-рекордсмена з 900 млн підписників
    const featuredChannelVideos = [
      ...userCustomVideos,
      {
        id: 'user-feat-1',
        youtubeId: 'ScMzIvxBSi4',
        title: 'ДЯКУЮ ЗА 900 МІЛЬЙОНІВ ПІДПИСНИКІВ! Велике святкове відео (4K)',
        channel: profile.name,
        channelAvatar: profile.avatar,
        verified: true,
        views: '240 млн переглядів',
        timestamp: '3 дні тому',
        duration: '18:50',
        likes: '19 млн',
        subscribers: profile.subscribersFormatted,
        isChannelSpecial: true
      },
      {
        id: 'user-feat-2',
        youtubeId: 'OPf0YbXqDm0',
        title: 'Як ми зібрали найбільшу спільноту у світі: Історія каналу Certube King',
        channel: profile.name,
        channelAvatar: profile.avatar,
        verified: true,
        views: '118 млн переглядів',
        timestamp: '2 тижні тому',
        duration: '22:15',
        likes: '8.4 млн',
        subscribers: profile.subscribersFormatted,
        isChannelSpecial: true
      },
      {
        id: 'user-feat-3',
        youtubeId: '3JZ_D3ELwOQ',
        title: 'Святковий мега-концерт для 900 000 000 фанатів наживо',
        channel: profile.name,
        channelAvatar: profile.avatar,
        verified: true,
        views: '350 млн переглядів',
        timestamp: '1 місяць тому',
        duration: '45:00',
        likes: '28 млн',
        subscribers: profile.subscribersFormatted,
        isChannelSpecial: true
      }
    ];

    this.container.innerHTML = `
      <div class="channel-container">
        <!-- Шапка каналу (Channel Banner) -->
        <div class="channel-banner">
          <img src="${profile.banner}" alt="Channel Banner" />
          <div class="channel-banner-overlay">
            <div class="banner-play-award">
              <span>💎 ОФІЦІЙНИЙ КАНАЛ №1 У СВІТІ • 900 000 000 ПІДПИСНИКІВ 👑</span>
            </div>
          </div>
        </div>

        <!-- Інформація про канал -->
        <div class="channel-header-row">
          <div class="channel-big-avatar-wrap">
            <img src="${profile.avatar}" alt="${profile.name}" />
            <div class="channel-crown-badge" title="ТОП-1 Кріейтор 900M">👑</div>
          </div>

          <div class="channel-meta-content">
            <div class="channel-title-row">
              <h1 class="channel-display-name">${profile.name}</h1>
              <span class="channel-verified-icon" title="Офіційно верифіковано Certube">✓</span>
              <span class="subscribers-highlight-pill">
                💎 ${profile.subscribersFormatted}
              </span>
              ${isPremium ? `<span class="badge-premium">${icons.crown()} Premium Creator</span>` : ''}
            </div>

            <div class="channel-stats-subtext">
              <span>${profile.handle}</span> • 
              <strong>${profile.subscribersFormatted}</strong> • 
              <span>${featuredChannelVideos.length} відео</span> • 
              <span>${profile.viewsFormatted}</span>
            </div>

            <p class="channel-description-text">${profile.description}</p>

            <div class="channel-action-buttons">
              <button class="btn-channel-action btn-channel-create" id="channelCreateBtn">
                ${icons.plus()}
                <span>Створити нове відео</span>
              </button>
              <button class="btn-channel-action btn-channel-edit" id="editChannelBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                <span>Налаштувати канал</span>
              </button>
              <button class="btn-channel-action btn-channel-edit" id="installAppBtn" title="Встановити Certube на екран iPhone або Android">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
                <span>📲 Встановити на iPhone / екран</span>
              </button>
              <button class="btn-header-premium" id="channelPremiumBtn">
                ${icons.crown()} ${isPremium ? 'Premium активний' : 'Certube Premium (100 грн)'}
              </button>
            </div>
          </div>
        </div>

        <!-- Навігаційні вкладки каналу -->
        <div class="channel-nav-tabs">
          <div class="channel-tab-item ${this.activeTab === 'videos' ? 'active' : ''}" data-ch-tab="videos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>
            <span>Всі відео (${featuredChannelVideos.length})</span>
          </div>

          <div class="channel-tab-item ${this.activeTab === 'shorts' ? 'active' : ''}" data-ch-tab="shorts">
            ${icons.shorts()}
            <span>Shorts (${userCustomShorts.length + 6})</span>
          </div>

          <div class="channel-tab-item ${this.activeTab === 'subscribers' ? 'active' : ''}" data-ch-tab="subscribers">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            <span>Підписники (900 млн)</span>
          </div>

          <div class="channel-tab-item ${this.activeTab === 'awards' ? 'active' : ''}" data-ch-tab="awards">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>Нагороди та Кнопки</span>
          </div>
        </div>

        <!-- Контент вкладки -->
        <div class="channel-content-area">
          ${this.renderTabContent(featuredChannelVideos, userCustomShorts, profile)}
        </div>
      </div>
    `;

    this.bindEvents(featuredChannelVideos);
  }

  renderTabContent(videos, shorts, profile) {
    if (this.activeTab === 'videos') {
      return `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 style="font-size:18px; font-weight:700;">Всі опубліковані відео каналу</h2>
            <button class="ad-cta-btn" id="tabCreateBtn" style="padding:6px 14px; font-size:12px;">
              ${icons.plus()} Додати відео
            </button>
          </div>

          <div class="videos-grid">
            ${videos.map(video => {
              const thumb = video.youtubeId 
                ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop';
              return `
                <article class="video-card" data-video-id="${video.id}">
                  <div class="video-thumbnail-wrap">
                    <img src="${thumb}" alt="${video.title}" />
                    <span class="video-duration">${video.duration}</span>
                    <span class="video-custom-badge">${video.isChannelSpecial ? '👑 900M Special' : 'Моє відео'}</span>
                  </div>
                  <div class="video-info-row">
                    <div class="channel-avatar">
                      <img src="${profile.avatar}" alt="${profile.name}" />
                    </div>
                    <div class="video-text-meta">
                      <h3 class="video-title">${video.title}</h3>
                      <div class="channel-name">
                        <span>${profile.name}</span>
                        ${icons.check()}
                      </div>
                      <div class="video-stats">${video.views} • ${video.timestamp}</div>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'shorts') {
      return `
        <div>
          <h2 style="font-size:18px; font-weight:700; margin-bottom:16px;">Короткі відео (Shorts) каналу</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:16px;">
            ${[
              { id: 'sh-1', title: 'Дякую всім 900 мільйонам! 🎉 #shorts', views: '84 млн', yt: '7nK_S46y-f8' },
              { id: 'sh-2', title: 'Розпаковка Смарагдової кнопки 900M! 💎', views: '115 млн', yt: 'pS62GZ7Yy3s' },
              { id: 'sh-3', title: 'Святковий феєрверк у прямому ефірі 🎆', views: '65 млн', yt: 'wB2iJ36t-Hw' },
              { id: 'sh-4', title: 'Секрет успіху на Certube за 15 секунд ⚡', views: '92 млн', yt: 'h_S3p6v0Z8o' }
            ].map(item => `
              <div class="video-card" style="cursor:pointer;" onclick="window.store.setActiveTab('shorts')">
                <div style="position:relative; aspect-ratio: 9/16; border-radius:var(--radius-md); overflow:hidden; background:#222;">
                  <img src="https://img.youtube.com/vi/${item.yt}/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;" />
                  <span style="position:absolute; bottom:8px; left:8px; font-size:11px; font-weight:700; background:rgba(0,0,0,0.8); padding:2px 6px; border-radius:4px; color:#fff;">
                    ▶ ${item.views}
                  </span>
                </div>
                <div style="font-size:13px; font-weight:600; margin-top:6px; color:#fff;">${item.title}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'subscribers') {
      return `
        <div>
          <!-- Головний лічильник підписників -->
          <div class="sub-counter-hero-card">
            <span style="font-size:14px; font-weight:800; color:var(--yt-premium-gold); text-transform:uppercase; letter-spacing:1px;">
              ЖИВИЙ ЛІЧИЛЬНИК АУДИТОРІЇ В РЕАЛЬНОМУ ЧАСІ
            </span>
            <div class="sub-counter-number" id="liveTickerSub">900,000,000</div>
            <p style="font-size:15px; color:#aaa;">підписників на каналі <strong>${profile.name}</strong></p>
          </div>

          <!-- Статистика аудиторії -->
          <div class="awards-grid">
            <div class="award-card">
              <div class="award-card-icon">🇺🇦</div>
              <div class="award-card-title">420 Мільйонів</div>
              <div class="award-card-desc">Українська та європейська аудиторія</div>
            </div>
            <div class="award-card">
              <div class="award-card-icon">🌍</div>
              <div class="award-card-title">480 Мільйонів</div>
              <div class="award-card-desc">Глобальні підписники з усього світу</div>
            </div>
            <div class="award-card">
              <div class="award-card-icon">📈</div>
              <div class="award-card-title">+500,000 щодня</div>
              <div class="award-card-desc">Середній щоденний приріст нових глядачів</div>
            </div>
            <div class="award-card">
              <div class="award-card-icon">💬</div>
              <div class="award-card-title">1.4 Мільярда</div>
              <div class="award-card-desc">Коментарів та взаємодій під вашими відео</div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'awards') {
      return `
        <div>
          <h2 style="font-size:18px; font-weight:700; margin-bottom:16px;">Офіційні нагороди та кнопки творця</h2>
          <div class="awards-grid">
            <div class="award-card" style="border-color:#00ffaa; background:radial-gradient(circle at top, #022416 0%, #161616 100%);">
              <div class="award-card-icon">👑💎</div>
              <div class="award-card-title" style="color:#00ffaa;">Смарагдова Кнопка (900 МЛН)</div>
              <div class="award-card-desc">Найвища нагорода в історії платформи Certube. Присуджена за досягнення абсолютно рекордних 900 000 000 підписників!</div>
            </div>

            <div class="award-card" style="border-color:#ff3366; background:radial-gradient(circle at top, #2e0513 0%, #161616 100%);">
              <div class="award-card-icon">💎🔴</div>
              <div class="award-card-title" style="color:#ff3366;">Червона Діамантова Кнопка (100 МЛН)</div>
              <div class="award-card-desc">Ексклюзивна нагорода за подолання позначки у 100 000 000 підписників.</div>
            </div>

            <div class="award-card">
              <div class="award-card-icon">💎</div>
              <div class="award-card-title">Діамантова кнопка (10 МЛН)</div>
              <div class="award-card-desc">Нагорода за 10 мільйонів підписників.</div>
            </div>

            <div class="award-card">
              <div class="award-card-icon">🥇</div>
              <div class="award-card-title">Золота кнопка (1 МЛН)</div>
              <div class="award-card-desc">Перший мільйон глядачів каналу.</div>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  bindEvents(videos) {
    // Перемикання вкладок каналу
    this.container.querySelectorAll('[data-ch-tab]').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        this.activeTab = tabBtn.dataset.chTab;
        this.render();
      });
    });

    // Кнопка створення нового відео
    const createBtn = this.container.querySelector('#channelCreateBtn');
    const tabCreateBtn = this.container.querySelector('#tabCreateBtn');
    [createBtn, tabCreateBtn].forEach(b => {
      if (b) b.addEventListener('click', () => store.openStudio());
    });

    // Кнопка налаштувань каналу (редагування імені)
    const editBtn = this.container.querySelector('#editChannelBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const currentName = store.userProfile.name;
        const newName = prompt('Введіть нову назву для вашого каналу:', currentName);
        if (newName && newName.trim()) {
          store.updateUserProfile({ name: newName.trim() });
          alert(`Назву каналу змінено на «${newName.trim()}»!`);
        }
      });
    }

    // Кнопка Premium
    const premBtn = this.container.querySelector('#channelPremiumBtn');
    if (premBtn) {
      premBtn.addEventListener('click', () => store.openPremiumModal());
    }

    // Кнопка встановлення на iPhone / головний екран
    const installBtn = this.container.querySelector('#installAppBtn');
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        if (typeof window.openInstallAppGuide === 'function') {
          window.openInstallAppGuide();
        }
      });
    }

    // Клік по відеокартках для відкриття у плеєрі
    this.container.querySelectorAll('.video-card[data-video-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.videoId;
        const target = videos.find(v => v.id === id);
        if (target) {
          store.openPlayer(target);
        }
      });
    });
  }
}
