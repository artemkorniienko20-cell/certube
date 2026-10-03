import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class StudioModal {
  constructor(container) {
    this.container = container;
    this.activeTab = 'camera'; // 'camera' | 'upload' | 'youtube'
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordedBlobUrl = null;
    this.isRecording = false;
    this.recordingSeconds = 0;
    this.timerInterval = null;

    this.init();
    store.subscribe((event) => {
      if (event === 'studio_opened') {
        this.open();
      } else if (event === 'studio_closed') {
        this.close();
      }
    });
  }

  init() {
    this.render();
  }

  open() {
    const overlay = this.container.querySelector('#studioOverlay');
    if (overlay) {
      overlay.classList.add('active');
      if (this.activeTab === 'camera') {
        this.startCameraStream();
      }
    }
  }

  close() {
    const overlay = this.container.querySelector('#studioOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    this.stopCameraStream();
    this.resetRecording();
    store.closeStudio();
  }

  async startCameraStream() {
    const videoEl = this.container.querySelector('#cameraPreview');
    if (!videoEl) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      videoEl.srcObject = this.mediaStream;
      videoEl.play();
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      // Fallback message in preview
      const previewBox = this.container.querySelector('#cameraPreviewBox');
      if (previewBox) {
        previewBox.innerHTML = `
          <div style="text-align:center; padding:20px; color:#aaa;">
            <p style="margin-bottom:8px; color:#fff; font-weight:600;">Камера недоступна або доступ відхилено</p>
            <p style="font-size:12px;">Ви можете завантажити готовий файл або додати відео з YouTube у сусідніх вкладках.</p>
          </div>
        `;
      }
    }
  }

  stopCameraStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  startRecording() {
    if (!this.mediaStream) {
      alert('Будь ласка, увімкніть доступ до камери для запису.');
      return;
    }

    this.recordedChunks = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
    }

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      this.recordedBlobUrl = URL.createObjectURL(blob);

      const videoEl = this.container.querySelector('#cameraPreview');
      if (videoEl) {
        videoEl.srcObject = null;
        videoEl.src = this.recordedBlobUrl;
        videoEl.controls = true;
        videoEl.play();
      }

      this.updateRecorderUI(false);
    };

    this.mediaRecorder.start(100);
    this.isRecording = true;
    this.recordingSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.recordingSeconds++;
      const timerEl = this.container.querySelector('#timerCounter');
      if (timerEl) {
        const mins = Math.floor(this.recordingSeconds / 60).toString().padStart(2, '0');
        const secs = (this.recordingSeconds % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);

    this.updateRecorderUI(true);
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      clearInterval(this.timerInterval);
    }
  }

  resetRecording() {
    this.stopRecording();
    this.recordedChunks = [];
    this.recordedBlobUrl = null;
    this.recordingSeconds = 0;
    clearInterval(this.timerInterval);
  }

  updateRecorderUI(recording) {
    const startBtn = this.container.querySelector('#startRecBtn');
    const stopBtn = this.container.querySelector('#stopRecBtn');
    const timerBox = this.container.querySelector('#recordingTimer');

    if (startBtn && stopBtn && timerBox) {
      if (recording) {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'flex';
        timerBox.style.display = 'flex';
      } else {
        startBtn.style.display = 'flex';
        startBtn.textContent = 'Записати знову';
        stopBtn.style.display = 'none';
        timerBox.style.display = 'none';
      }
    }
  }

  extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url.trim();
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-overlay" id="studioOverlay">
        <div class="modal-card" style="max-width: 650px;">
          <div class="modal-header">
            <h2 class="modal-title" style="display:flex; align-items:center; gap:8px;">
              <span style="color:var(--yt-red);">${icons.plus()}</span>
              Certube Studio: Створити відео
            </h2>
            <button class="modal-close-btn" id="closeStudioBtn">
              ${icons.close()}
            </button>
          </div>

          <!-- Вкладки створення -->
          <div class="studio-tabs">
            <button class="studio-tab-btn ${this.activeTab === 'camera' ? 'active' : ''}" data-studio-tab="camera">
              ${icons.camera()}
              Записати з камери
            </button>
            <button class="studio-tab-btn ${this.activeTab === 'upload' ? 'active' : ''}" data-studio-tab="upload">
              ${icons.upload()}
              Завантажити файл
            </button>
            <button class="studio-tab-btn ${this.activeTab === 'youtube' ? 'active' : ''}" data-studio-tab="youtube">
              ${icons.link()}
              Додати з YouTube
            </button>
          </div>

          <div class="studio-body">
            <!-- TAB 1: Камера -->
            <div id="tabContentCamera" style="display: ${this.activeTab === 'camera' ? 'block' : 'none'};">
              <div class="camera-preview-box" id="cameraPreviewBox">
                <video id="cameraPreview" autoplay muted playsinline></video>
                <div class="recording-timer" id="recordingTimer" style="display:none;">
                  <span class="record-dot"></span>
                  <span id="timerCounter">00:00</span>
                </div>
              </div>

              <div class="camera-controls-bar">
                <button class="record-action-btn start-rec" id="startRecBtn">
                  <span class="record-dot" style="background:#fff;"></span>
                  Почати запис
                </button>
                <button class="record-action-btn stop-rec" id="stopRecBtn" style="display:none;">
                  ⏹ Зупинити запис
                </button>
              </div>
            </div>

            <!-- TAB 2: Завантаження файлу -->
            <div id="tabContentUpload" style="display: ${this.activeTab === 'upload' ? 'block' : 'none'};">
              <label class="file-dropzone" for="videoFileInput">
                <div style="color:var(--yt-text-secondary); margin-bottom:10px;">${icons.upload()}</div>
                <h4 style="font-size:15px; margin-bottom:6px;">Виберіть відеофайл для завантаження</h4>
                <p style="font-size:12px; color:var(--yt-text-muted);">Підтримуються MP4, WebM, MOV</p>
                <input type="file" id="videoFileInput" accept="video/*" style="display:none;" />
              </label>
              <div id="uploadPreviewBox" style="display:none; margin-bottom:16px;">
                <video id="uploadVideoPreview" style="width:100%; border-radius:var(--radius-md);" controls></video>
              </div>
            </div>

            <!-- TAB 3: Додати з YouTube -->
            <div id="tabContentYoutube" style="display: ${this.activeTab === 'youtube' ? 'block' : 'none'};">
              <div class="studio-form-group">
                <label class="studio-label">Посилання або ID відео з YouTube</label>
                <input 
                  type="text" 
                  class="studio-input" 
                  id="ytUrlInput" 
                  placeholder="https://www.youtube.com/watch?v=... або ID" 
                />
              </div>
              <div id="ytThumbPreview" style="display:none; margin-bottom:16px; border-radius:var(--radius-md); overflow:hidden;">
                <img id="ytThumbImg" src="" alt="Thumbnail" style="width:100%; height:auto;" />
              </div>
            </div>

            <!-- Загальні метадані відео -->
            <div class="studio-form-group">
              <label class="studio-label">Назва відео *</label>
              <input type="text" class="studio-input" id="videoTitleInput" placeholder="Введіть цікаву назву вашого відео..." />
            </div>

            <div class="studio-form-group">
              <label class="studio-label">Опис</label>
              <textarea class="studio-textarea" id="videoDescInput" placeholder="Розкажіть про що це відео..."></textarea>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div class="studio-form-group">
                <label class="studio-label">Категорія</label>
                <select class="studio-select" id="videoCategorySelect">
                  <option value="Україна">Україна</option>
                  <option value="Музика">Музика</option>
                  <option value="Технології">Технології</option>
                  <option value="Ігри">Ігри</option>
                  <option value="Подкасти">Подкасти</option>
                  <option value="Новини">Новини</option>
                </select>
              </div>

              <div class="studio-form-group" style="display:flex; align-items:flex-end;">
                <label class="studio-checkbox-row">
                  <input type="checkbox" id="isShortsCheckbox" style="accent-color: var(--yt-red); width:18px; height:18px;" />
                  <span>Опублікувати як <strong>Shorts</strong></span>
                </label>
              </div>
            </div>

            <button class="studio-submit-btn" id="publishVideoBtn">
              Опублікувати відео на Certube
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#closeStudioBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Перемикання вкладок
    this.container.querySelectorAll('[data-studio-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.studioTab;
        this.container.querySelectorAll('.studio-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.container.querySelector('#tabContentCamera').style.display = this.activeTab === 'camera' ? 'block' : 'none';
        this.container.querySelector('#tabContentUpload').style.display = this.activeTab === 'upload' ? 'block' : 'none';
        this.container.querySelector('#tabContentYoutube').style.display = this.activeTab === 'youtube' ? 'block' : 'none';

        if (this.activeTab === 'camera') {
          this.startCameraStream();
        } else {
          this.stopCameraStream();
        }
      });
    });

    // Запис з камери
    const startRecBtn = this.container.querySelector('#startRecBtn');
    const stopRecBtn = this.container.querySelector('#stopRecBtn');

    if (startRecBtn) {
      startRecBtn.addEventListener('click', () => this.startRecording());
    }
    if (stopRecBtn) {
      stopRecBtn.addEventListener('click', () => this.stopRecording());
    }

    // Завантаження файлу
    const fileInput = this.container.querySelector('#videoFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.recordedBlobUrl = URL.createObjectURL(file);
          const previewEl = this.container.querySelector('#uploadVideoPreview');
          const previewBox = this.container.querySelector('#uploadPreviewBox');
          if (previewEl && previewBox) {
            previewEl.src = this.recordedBlobUrl;
            previewBox.style.display = 'block';
          }
          // Автоматично підставити назву з файлу
          const titleInput = this.container.querySelector('#videoTitleInput');
          if (titleInput && !titleInput.value) {
            titleInput.value = file.name.replace(/\.[^/.]+$/, "");
          }
        }
      });
    }

    // YouTube URL preview
    const ytUrlInput = this.container.querySelector('#ytUrlInput');
    if (ytUrlInput) {
      ytUrlInput.addEventListener('input', () => {
        const id = this.extractYouTubeId(ytUrlInput.value);
        const thumbBox = this.container.querySelector('#ytThumbPreview');
        const thumbImg = this.container.querySelector('#ytThumbImg');
        if (id && id.length === 11) {
          thumbImg.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
          thumbBox.style.display = 'block';
        } else {
          thumbBox.style.display = 'none';
        }
      });
    }

    // Публікація відео
    const publishBtn = this.container.querySelector('#publishVideoBtn');
    if (publishBtn) {
      publishBtn.addEventListener('click', () => {
        const title = this.container.querySelector('#videoTitleInput').value.trim();
        const desc = this.container.querySelector('#videoDescInput').value.trim();
        const category = this.container.querySelector('#videoCategorySelect').value;
        const isShorts = this.container.querySelector('#isShortsCheckbox').checked;

        if (!title) {
          alert('Будь ласка, введіть назву відео.');
          return;
        }

        let ytId = null;
        let blobUrl = null;

        if (this.activeTab === 'youtube') {
          const rawUrl = this.container.querySelector('#ytUrlInput').value;
          ytId = this.extractYouTubeId(rawUrl);
          if (!ytId) {
            alert('Будь ласка, вкажіть коректне посилання або ID відео з YouTube.');
            return;
          }
        } else {
          blobUrl = this.recordedBlobUrl;
          if (!blobUrl) {
            // Для демо, якщо користувач не записав і не обрав файл
            ytId = 'ScMzIvxBSi4'; // Default scenic video
          }
        }

        store.addCreatedVideo({
          title,
          description: desc,
          category,
          isShorts,
          youtubeId: ytId,
          videoBlobUrl: blobUrl,
          duration: isShorts ? '0:30' : '02:15'
        });

        alert(`Відео «${title}» успішно опубліковано на Certube!`);
        this.close();
      });
    }
  }
}
