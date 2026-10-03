import confetti from 'canvas-confetti';
import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class PremiumModal {
  constructor(container) {
    this.container = container;
    this.selectedMethod = 'mono';
    this.isProcessing = false;

    this.init();
    store.subscribe((event) => {
      if (event === 'premium_modal_opened') {
        this.open();
      } else if (event === 'premium_modal_closed') {
        this.close();
      } else if (event === 'premium_changed') {
        this.render();
      }
    });
  }

  init() {
    this.render();
  }

  open() {
    this.render();
    const overlay = this.container.querySelector('#premiumOverlay');
    if (overlay) {
      overlay.classList.add('active');
    }
  }

  close() {
    const overlay = this.container.querySelector('#premiumOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    store.closePremiumModal();
  }

  triggerConfetti() {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff9800', '#ff0000', '#ffffff']
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  }

  handlePayment() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.render();

    setTimeout(() => {
      this.isProcessing = false;
      store.setPremium(true);
      this.triggerConfetti();
      this.render();
      setTimeout(() => {
        alert('🎉 Вітаємо! Підписку Certube Premium за 100 грн успішно активовано!\n\nТепер уся реклама та банери повністю відключені.');
        this.close();
      }, 700);
    }, 1200);
  }

  render() {
    const isPremium = store.isPremium;

    this.container.innerHTML = `
      <div class="modal-overlay" id="premiumOverlay">
        <div class="modal-card premium-modal-card">
          <div class="modal-header" style="border:none; padding-bottom:0;">
            <div></div>
            <button class="modal-close-btn" id="closePremiumBtn">
              ${icons.close()}
            </button>
          </div>

          <div class="premium-hero">
            <div class="premium-crown-icon">
              ${icons.crown()}
            </div>
            <h2 class="premium-hero-title">
              Certube <span>Premium</span>
            </h2>
            <div class="premium-price-tag-big">100 ₴ <span style="font-size:16px; color:#aaa; font-weight:normal;">/ місяць</span></div>
            <p class="premium-price-sub">Дивіться усе, що любите на YouTube, без жодної перерви на рекламу</p>
          </div>

          <!-- Переваги підписки -->
          <div class="premium-features-list">
            <div class="premium-feature-item">
              <span class="premium-feature-check">✓</span>
              <div>
                <strong>Повна відсутність реклами</strong>
                <div style="font-size:12px; color:var(--yt-text-secondary);">Жодних 5-секундних преролів перед відео та банерів у стрічці.</div>
              </div>
            </div>

            <div class="premium-feature-item">
              <span class="premium-feature-check">✓</span>
              <div>
                <strong>YouTube та Shorts у високій якості</strong>
                <div style="font-size:12px; color:var(--yt-text-secondary);">Миттєве відтворення популярних відео без очікування.</div>
              </div>
            </div>

            <div class="premium-feature-item">
              <span class="premium-feature-check">✓</span>
              <div>
                <strong>Certube Studio: створення відео (+)</strong>
                <div style="font-size:12px; color:var(--yt-text-secondary);">Записуйте відео з камери або додавайте Shorts без обмежень.</div>
              </div>
            </div>

            <div class="premium-feature-item">
              <span class="premium-feature-check">✓</span>
              <div>
                <strong>Золотий бейдж Premium</strong>
                <div style="font-size:12px; color:var(--yt-text-secondary);">Ексклюзивний статус у профілі та біля логотипу.</div>
              </div>
            </div>
          </div>

          ${!isPremium ? `
            <div style="padding: 0 24px 8px;">
              <label class="studio-label" style="margin-bottom:8px;">Оберіть зручний спосіб оплати (100 грн):</label>
            </div>

            <div class="payment-methods-grid">
              <div class="payment-method-card ${this.selectedMethod === 'mono' ? 'active' : ''}" data-pay-method="mono">
                <span class="payment-method-icon">🐱</span>
                <span>Monobank</span>
              </div>
              <div class="payment-method-card ${this.selectedMethod === 'privat' ? 'active' : ''}" data-pay-method="privat">
                <span class="payment-method-icon">🟢</span>
                <span>Приват24</span>
              </div>
              <div class="payment-method-card ${this.selectedMethod === 'card' ? 'active' : ''}" data-pay-method="card">
                <span class="payment-method-icon">💳</span>
                <span>Банківська картка</span>
              </div>
              <div class="payment-method-card ${this.selectedMethod === 'apple' ? 'active' : ''}" data-pay-method="apple">
                <span class="payment-method-icon"></span>
                <span>Apple / GPay</span>
              </div>
            </div>

            <div class="premium-actions">
              <button class="btn-buy-premium" id="pay100Btn" ${this.isProcessing ? 'disabled' : ''}>
                ${this.isProcessing ? '⏳ Обробка платежу 100 ₴...' : 'Сплатити 100 ₴ за Certube Premium'}
              </button>
            </div>
          ` : `
            <div class="premium-actions" style="text-align:center;">
              <div style="background:rgba(255,215,0,0.1); border:1px solid var(--yt-premium-gold); padding:16px; border-radius:var(--radius-md); margin-bottom:12px;">
                <div style="color:var(--yt-premium-gold); font-weight:800; font-size:16px; margin-bottom:4px;">Ваша підписка активна! 👑</div>
                <div style="font-size:13px; color:#aaa;">Уся реклама на Certube вимкнена. Насолоджуйтесь переглядом!</div>
              </div>
              <button class="btn-cancel-premium" id="deactivatePremiumBtn">
                Вимкнути підписку (повернути рекламу для тестування)
              </button>
            </div>
          `}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#closePremiumBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Overlay click to close
    const overlay = this.container.querySelector('#premiumOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });
    }

    // Способи оплати
    this.container.querySelectorAll('[data-pay-method]').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedMethod = card.dataset.payMethod;
        this.container.querySelectorAll('[data-pay-method]').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Кнопка сплати 100 грн
    const payBtn = this.container.querySelector('#pay100Btn');
    if (payBtn) {
      payBtn.addEventListener('click', () => this.handlePayment());
    }

    // Деактивація для тестування
    const deactivateBtn = this.container.querySelector('#deactivatePremiumBtn');
    if (deactivateBtn) {
      deactivateBtn.addEventListener('click', () => {
        store.setPremium(false);
        alert('Підписку призупинено. Тепер у стрічці та відео знову відображатиметься реклама.');
      });
    }
  }
}
