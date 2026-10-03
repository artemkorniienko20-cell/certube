import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class CertubeHeader {
  constructor(container) {
    this.container = container;
    this.init();
    store.subscribe((event) => {
      if (event === 'premium_changed') {
        this.render();
      }
    });
  }

  init() {
    this.render();
  }

  render() {
    const isPremium = store.isPremium;

    this.container.innerHTML = `
      <header class="yt-header">
        <div class="header-left">
          <button class="header-menu-btn" aria-label="Меню" id="headerMenuBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          
          <div id="headerLogo" class="logo-trigger" title="На головну Certube">
            ${icons.logo(90, 24)}
          </div>
          
          ${isPremium ? `<span class="badge-premium"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/></svg> Premium</span>` : ''}
        </div>

        <div class="header-center">
          <form class="search-box-container" id="searchForm">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Пошук у Certube..." 
              value="${store.searchQuery}"
              id="searchInput"
            />
            <button type="submit" class="search-submit-btn" title="Шукати">
              ${icons.search()}
            </button>
          </form>
          <button class="voice-search-btn" id="voiceSearchBtn" title="Голосовий пошук">
            ${icons.mic()}
          </button>
        </div>

        <div class="header-right">
          <button class="btn-header-premium ${isPremium ? 'is-active' : ''}" id="premiumBtn" title="Certube Premium за 100 грн">
            ${icons.crown()}
            <span>${isPremium ? 'Premium активний' : 'Certube Premium'}</span>
            ${!isPremium ? '<span class="premium-price-tag" style="opacity:0.9; margin-left:2px;">100 ₴</span>' : ''}
          </button>

          <button class="header-icon-btn install-app-header-btn" id="headerInstallBtn" title="Встановити Certube на iPhone або головний екран">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
          </button>

          <button class="header-icon-btn" id="headerCreateBtn" title="Створити відео">
            ${icons.plus()}
          </button>

          <button class="header-icon-btn" id="notificationBtn" title="Сповіщення">
            ${icons.bell()}
          </button>

          <button class="user-avatar-btn ${isPremium ? 'premium-user' : ''}" id="profileBtn" title="Мій профіль та канал (900 млн підписників)">
            <img src="${store.userProfile.avatar}" alt="User Avatar" />
          </button>
        </div>
      </header>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const logoEl = this.container.querySelector('#headerLogo');
    if (logoEl) {
      logoEl.addEventListener('click', () => {
        store.setSearchQuery('');
        store.setActiveCategory('Усі');
        store.setActiveTab('home');
      });
    }

    const premiumBtn = this.container.querySelector('#premiumBtn');
    if (premiumBtn) {
      premiumBtn.addEventListener('click', () => {
        store.openPremiumModal();
      });
    }

    const searchForm = this.container.querySelector('#searchForm');
    const searchInput = this.container.querySelector('#searchInput');
    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        store.setSearchQuery(searchInput.value);
        store.setActiveTab('home');
      });
    }

    const headerCreateBtn = this.container.querySelector('#headerCreateBtn');
    if (headerCreateBtn) {
      headerCreateBtn.addEventListener('click', () => {
        store.openStudio();
      });
    }

    const voiceSearchBtn = this.container.querySelector('#voiceSearchBtn');
    if (voiceSearchBtn) {
      voiceSearchBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'uk-UA';
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (searchInput) searchInput.value = transcript;
            store.setSearchQuery(transcript);
            store.setActiveTab('home');
          };
          recognition.start();
        } else {
          alert('Голосовий пошук підтримується у сумісних браузерах (Google Chrome тощо). Введіть запит вручну.');
        }
      });
    }

    const headerInstallBtn = this.container.querySelector('#headerInstallBtn');
    if (headerInstallBtn) {
      headerInstallBtn.addEventListener('click', () => {
        if (typeof window.openInstallAppGuide === 'function') {
          window.openInstallAppGuide();
        }
      });
    }

    const profileBtn = this.container.querySelector('#profileBtn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        store.setActiveTab('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}
