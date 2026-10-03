import { icons } from '../../icons.js';
import { store } from '../../state/store.js';

export class SubscriptionsView {
  constructor(container) {
    this.container = container;
    this.init();
    store.subscribe((event) => {
      if (['subscribe_toggled', 'tab_changed'].includes(event) && store.activeTab === 'subscriptions') {
        this.render();
      }
    });
  }

  init() {
    this.render();
  }

  render() {
    const subscribedChannels = [...store.subscribedChannels];
    const subVideos = store.videos.filter(v => store.subscribedChannels.has(v.channel));

    this.container.innerHTML = `
      <div class="feed-container">
        <!-- Горизонтальний список підписок -->
        <div style="margin-bottom: 24px;">
          <h2 style="font-size:18px; font-weight:700; margin-bottom:14px;">Ваші підписки (${subscribedChannels.length})</h2>
          <div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:10px;">
            ${subscribedChannels.map(chName => {
              const chVideo = store.videos.find(v => v.channel === chName);
              const avatar = chVideo ? chVideo.channelAvatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face';
              return `
                <div style="display:flex; flex-direction:column; align-items:center; gap:6px; min-width:76px; cursor:pointer;" class="sub-channel-chip" data-channel="${chName}">
                  <div style="width:52px; height:52px; border-radius:50%; overflow:hidden; border:2px solid var(--yt-red);">
                    <img src="${avatar}" style="width:100%; height:100%; object-fit:cover;" alt="${chName}" />
                  </div>
                  <span style="font-size:11px; text-align:center; color:#fff; max-width:76px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${chName}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Відео з підписок -->
        <div>
          <h2 style="font-size:18px; font-weight:700; margin-bottom:14px;">Нові відео від підписок</h2>
          ${subVideos.length === 0 ? `
            <div style="color:var(--yt-text-secondary); font-size:14px;">Немає нових відео від ваших каналів. Підпишіться на нові канали під час перегляду відео!</div>
          ` : `
            <div class="videos-grid">
              ${subVideos.map(video => `
                <article class="video-card" data-video-id="${video.id}">
                  <div class="video-thumbnail-wrap">
                    <img src="${video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop'}" alt="${video.title}" />
                    <span class="video-duration">${video.duration}</span>
                  </div>
                  <div class="video-info-row">
                    <div class="channel-avatar">
                      <img src="${video.channelAvatar}" alt="${video.channel}" />
                    </div>
                    <div class="video-text-meta">
                      <h3 class="video-title">${video.title}</h3>
                      <div class="channel-name">
                        <span>${video.channel}</span>
                        ${video.verified ? icons.check() : ''}
                      </div>
                      <div class="video-stats">${video.views} • ${video.timestamp}</div>
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
    this.container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.videoId;
        const v = store.videos.find(item => item.id === id);
        if (v) store.openPlayer(v);
      });
    });

    this.container.querySelectorAll('.sub-channel-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const ch = chip.dataset.channel;
        store.setSearchQuery(ch);
        store.setActiveTab('home');
      });
    });
  }
}
