import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class BottomNav {
  constructor(container) {
    this.container = container;
    this.init();
    store.subscribe((event) => {
      if (event === 'tab_changed') {
        this.render();
      }
    });
  }

  init() {
    this.render();
  }

  render() {
    const activeTab = store.activeTab;

    this.container.innerHTML = `
      <!-- Нижня панель навігації (як у додатку YouTube) -->
      <nav class="bottom-nav-bar" aria-label="Головна навігація">
        <!-- 1. Головна -->
        <button class="bottom-nav-item ${activeTab === 'home' ? 'active' : ''}" data-tab="home" title="Головна">
          ${icons.home()}
          <span>Головна</span>
        </button>

        <!-- 2. Shorts (біля плюса!) -->
        <button class="bottom-nav-item ${activeTab === 'shorts' ? 'active' : ''}" data-tab="shorts" title="YouTube Shorts">
          <div class="shorts-nav-icon-wrap">
            ${icons.shorts()}
            <span class="shorts-nav-badge">NEW</span>
          </div>
          <span>Shorts</span>
        </button>

        <!-- 3. Кнопка знизу посередині: ПЛЮС [+] (Зробити відео) -->
        <div class="nav-plus-item">
          <button class="nav-plus-btn" id="bottomPlusBtn" title="Зробити відео (+) - Certube Studio">
            ${icons.plus()}
          </button>
        </div>

        <!-- 4. Підписки -->
        <button class="bottom-nav-item ${activeTab === 'subscriptions' ? 'active' : ''}" data-tab="subscriptions" title="Підписки">
          ${icons.subscriptions()}
          <span>Підписки</span>
        </button>

        <!-- 5. Ви (Профіль / 900 млн підписників) -->
        <button class="bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile" title="Мій профіль та канал (900 млн підписників)">
          <div style="width:24px; height:24px; border-radius:50%; overflow:hidden; border: 1.5px solid ${activeTab === 'profile' ? '#fff' : 'var(--yt-border)'}; display:flex; align-items:center; justify-content:center;">
            <img src="${store.userProfile.avatar}" style="width:100%; height:100%; object-fit:cover;" alt="Профіль" />
          </div>
          <span>Ви (900M)</span>
        </button>
      </nav>

      <!-- Бічний бар для десктопу (для синхронізації взаємодії) -->
      <aside class="desktop-sidebar" aria-label="Десктопне меню">
        <button class="desktop-sidebar-item ${activeTab === 'home' ? 'active' : ''}" data-tab="home" title="Головна">
          ${icons.home()}
          <span>Головна</span>
        </button>

        <button class="desktop-sidebar-item ${activeTab === 'shorts' ? 'active' : ''}" data-tab="shorts" title="Shorts">
          ${icons.shorts()}
          <span>Shorts</span>
        </button>

        <button class="desktop-sidebar-item ${activeTab === 'subscriptions' ? 'active' : ''}" data-tab="subscriptions" title="Підписки">
          ${icons.subscriptions()}
          <span>Підписки</span>
        </button>

        <button class="desktop-sidebar-item ${activeTab === 'library' ? 'active' : ''}" data-tab="library" title="Бібліотека">
          ${icons.library()}
          <span>Бібліотека</span>
        </button>

        <button class="desktop-sidebar-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile" title="Мій канал (900 млн)">
          <div style="width:26px; height:26px; border-radius:50%; overflow:hidden; border: 2px solid ${activeTab === 'profile' ? '#ffd700' : 'transparent'};">
            <img src="${store.userProfile.avatar}" style="width:100%; height:100%; object-fit:cover;" />
          </div>
          <span>Мій канал</span>
        </button>
      </aside>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Обробка кліку по вкладках
    this.container.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        store.setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Обробка кліку по центральній кнопці [+] (Зробити відео)
    const plusBtn = this.container.querySelector('#bottomPlusBtn');
    if (plusBtn) {
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.openStudio();
      });
    }
  }
}
