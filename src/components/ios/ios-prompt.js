/**
 * iOS "Add to Home Screen" & Standalone Web Clip Controller
 * Guides iPhone & iPad users through the Safari "Add to Home Screen" workflow.
 */

export class IosInstallPrompt {
  constructor() {
    this.storageKey = 'certube_ios_prompt_dismissed_time';
    this.deferredPrompt = null;
    this.container = null;
    this.init();
  }

  isIosDevice() {
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return isApple;
  }

  isStandalone() {
    return (
      ('standalone' in window.navigator && window.navigator.standalone) ||
      window.matchMedia('(display-mode: standalone)').matches
    );
  }

  isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('safari') && !ua.includes('crios') && !ua.includes('fxios') && !ua.includes('opios');
  }

  init() {
    // Android / Desktop standard PWA install support
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      window.__pwaInstallPrompt = e;
    });

    this.createDom();

    // Auto-prompt on iOS Safari after initial delay if not dismissed recently
    if (this.isIosDevice() && !this.isStandalone()) {
      const lastDismissed = localStorage.getItem(this.storageKey);
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      const shouldPrompt = !lastDismissed || (Date.now() - parseInt(lastDismissed, 10)) > threeDaysMs;

      if (shouldPrompt) {
        setTimeout(() => {
          this.show();
        }, 3000);
      }
    }

    // Expose global opener
    window.openInstallAppGuide = () => this.show(true);
  }

  createDom() {
    this.container = document.createElement('div');
    this.container.className = 'ios-prompt-backdrop';
    this.container.id = 'ios-install-backdrop';

    this.container.innerHTML = `
      <div class="ios-prompt-card" role="dialog" aria-modal="true" aria-label="Встановити Certube на iPhone">
        <div class="ios-prompt-header">
          <img src="/icons/apple-touch-icon.png" alt="Certube" class="ios-app-icon" />
          <div class="ios-header-text">
            <h2 class="ios-app-name">Certube для iPhone</h2>
            <p class="ios-app-desc">Встановіть на екран "Початковий" для повноекранного перегляду без панелей Safari</p>
          </div>
          <button class="ios-close-btn" id="ios-prompt-close" title="Закрити">✕</button>
        </div>

        <div class="ios-steps-list">
          <div class="ios-step-item">
            <div class="ios-step-badge">1</div>
            <div class="ios-step-content">
              Натисніть кнопку <strong>«Поділитися»</strong> <span class="ios-inline-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </span> на панелі Safari внизу екрана
            </div>
          </div>

          <div class="ios-step-item">
            <div class="ios-step-badge">2</div>
            <div class="ios-step-content">
              Прокрутіть меню та виберіть <strong>«На екран "Початковий"»</strong> <span class="ios-inline-icon">➕</span>
            </div>
          </div>

          <div class="ios-step-item">
            <div class="ios-step-badge">3</div>
            <div class="ios-step-content">
              У правому верхньому кутку натисніть <strong>«Додати»</strong>
            </div>
          </div>
        </div>

        <div class="ios-prompt-actions">
          <button class="ios-btn-confirm" id="ios-prompt-confirm">Зрозуміло</button>
        </div>

        <div class="ios-pointer-arrow">
          <svg viewBox="0 0 24 24">
            <path d="M12 2v16m0 0l-6-6m6 6l6-6"/>
          </svg>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Event listeners
    const closeBtn = this.container.querySelector('#ios-prompt-close');
    const confirmBtn = this.container.querySelector('#ios-prompt-confirm');

    closeBtn.addEventListener('click', () => this.hide(true));
    confirmBtn.addEventListener('click', () => this.hide(true));

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.hide(true);
      }
    });
  }

  show(force = false) {
    if (this.deferredPrompt && !this.isIosDevice()) {
      // If Android/Desktop Chrome, trigger native prompt directly
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(() => {
        this.deferredPrompt = null;
      });
      return;
    }

    if (this.container) {
      this.container.classList.add('active');
    }
  }

  hide(remember = true) {
    if (this.container) {
      this.container.classList.remove('active');
    }
    if (remember) {
      localStorage.setItem(this.storageKey, Date.now().toString());
    }
  }
}
