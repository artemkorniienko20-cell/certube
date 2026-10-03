import { store } from './state/store.js';
import { CertubeHeader } from './components/header/header.js';
import { BottomNav } from './components/navigation/bottom-nav.js';
import { VideoFeed } from './components/feed/feed.js';
import { ShortsFeed } from './components/shorts/shorts.js';
import { SubscriptionsView } from './components/views/subscriptions.js';
import { LibraryView } from './components/views/library.js';
import { StudioModal } from './components/studio/studio-modal.js';
import { PremiumModal } from './components/premium/premium-modal.js';
import { VideoPlayerModal } from './components/player/video-modal.js';
import { UserProfileView } from './components/profile/profile.js';
import { IosInstallPrompt } from './components/ios/ios-prompt.js';

class CertubeApp {
  constructor() {
    this.headerRoot = document.getElementById('header-root');
    this.navRoot = document.getElementById('nav-root');
    this.mainRoot = document.getElementById('main-content-root');
    this.playerRoot = document.getElementById('player-modal-root');
    this.studioRoot = document.getElementById('studio-modal-root');
    this.premiumRoot = document.getElementById('premium-modal-root');

    this.currentViewInstance = null;
    this.init();
  }

  init() {
    console.log('🚀 Certube App starting...');

    // Ініціалізація статичних компонентів
    new CertubeHeader(this.headerRoot);
    new BottomNav(this.navRoot);
    new StudioModal(this.studioRoot);
    new PremiumModal(this.premiumRoot);
    new VideoPlayerModal(this.playerRoot);
    new IosInstallPrompt();

    // Перший рендер активної вкладки
    this.renderCurrentTab();

    // Підписка на зміну вкладок
    store.subscribe((event) => {
      if (event === 'tab_changed') {
        this.renderCurrentTab();
      }
    });

    // Підтримка Back/History для відкритих плеєрів або модалок
    window.addEventListener('popstate', () => {
      if (store.currentVideo) {
        store.closePlayer();
      }
      if (store.isStudioOpen) {
        store.closeStudio();
      }
      if (store.isPremiumModalOpen) {
        store.closePremiumModal();
      }
    });
  }

  renderCurrentTab() {
    const tab = store.activeTab;
    this.mainRoot.innerHTML = '';

    switch (tab) {
      case 'home':
        this.currentViewInstance = new VideoFeed(this.mainRoot);
        break;
      case 'shorts':
        this.currentViewInstance = new ShortsFeed(this.mainRoot);
        break;
      case 'subscriptions':
        this.currentViewInstance = new SubscriptionsView(this.mainRoot);
        break;
      case 'library':
        this.currentViewInstance = new LibraryView(this.mainRoot);
        break;
      case 'profile':
        this.currentViewInstance = new UserProfileView(this.mainRoot);
        break;
      default:
        this.currentViewInstance = new VideoFeed(this.mainRoot);
    }
  }
}

// Запуск додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  new CertubeApp();
});
