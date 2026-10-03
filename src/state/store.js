import { initialVideos } from '../data/videos.js';
import { initialShorts } from '../data/shorts.js';
import { youtubeService } from '../services/youtube-api.js';

class CertubeStore {
  constructor() {
    this.listeners = new Set();

    // Завантаження збережених даних із localStorage
    const savedPremium = localStorage.getItem('certube_premium');
    this.isPremium = savedPremium === 'true';

    const userVideosRaw = localStorage.getItem('certube_user_videos');
    const userVideos = userVideosRaw ? JSON.parse(userVideosRaw) : [];
    this.userVideos = userVideos;

    const userShortsRaw = localStorage.getItem('certube_user_shorts');
    const userShorts = userShortsRaw ? JSON.parse(userShortsRaw) : [];
    this.userShorts = userShorts;

    // Всі відео YouTube + власні відео
    this.videos = [...userVideos, ...initialVideos];
    this.shorts = [...userShorts, ...initialShorts];

    const savedLikes = localStorage.getItem('certube_likes');
    this.likedVideos = new Set(savedLikes ? JSON.parse(savedLikes) : []);

    const savedSubs = localStorage.getItem('certube_subs');
    this.subscribedChannels = new Set(savedSubs ? JSON.parse(savedSubs) : ['Queen Official', 'Discover Ukraine 4K']);

    // Профіль користувача з 900 МІЛЬЙОНАМИ підписників! 👑
    const savedUserName = localStorage.getItem('certube_user_name') || 'Мій Канал';
    this.userProfile = {
      name: savedUserName,
      handle: '@certube_legend',
      subscribersCount: 900000000,
      subscribersFormatted: '900 млн підписників',
      videosCount: this.userVideos.length + 38,
      viewsFormatted: '48.9 млрд переглядів',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=400&fit=crop',
      description: 'Офіційний канал ТОП-1 кріейтора Certube та YouTube! 900 МІЛЬЙОНІВ найвідданіших підписників. Дякую кожному з вас! 🏆💎✨'
    };

    // Стан інтерфейсу
    this.activeTab = 'home'; // 'home' | 'shorts' | 'subscriptions' | 'library' | 'profile'
    this.activeCategory = 'Усі';
    this.searchQuery = '';
    this.currentVideo = null;
    this.isStudioOpen = false;
    this.isPremiumModalOpen = false;
    this.isLoadingVideos = false;

    // Автоматичне підвантаження реальних відео з YouTube при старті
    this.loadLiveYouTubeVideos();
    this.loadLiveShorts();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventType, payload) {
    for (const listener of this.listeners) {
      try {
        listener(eventType, payload, this);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    }
  }

  // Завантаження реальних трендових відео YouTube
  async loadLiveYouTubeVideos() {
    this.isLoadingVideos = true;
    this.notify('loading_changed', true);

    try {
      const liveVideos = await youtubeService.getTrending('UA');
      if (liveVideos && liveVideos.length > 0) {
        // Унікалізація за youtubeId
        const existingIds = new Set(this.videos.map(v => v.youtubeId).filter(Boolean));
        const newOnes = liveVideos.filter(v => !existingIds.has(v.youtubeId));
        this.videos = [...this.userVideos, ...newOnes, ...this.videos.filter(v => !v.isCustom)];
        this.notify('videos_loaded', this.videos);
      }
    } catch (e) {
      console.warn('Live YouTube loading error:', e);
    } finally {
      this.isLoadingVideos = false;
      this.notify('loading_changed', false);
    }
  }

  // Завантаження реальних YouTube Shorts
  async loadLiveShorts() {
    try {
      const liveShorts = await youtubeService.getShorts();
      if (liveShorts && liveShorts.length > 0) {
        const existingIds = new Set(this.shorts.map(s => s.youtubeId).filter(Boolean));
        const newShorts = liveShorts.filter(s => !existingIds.has(s.youtubeId));
        this.shorts = [...this.userShorts, ...newShorts, ...this.shorts.filter(s => !s.isCustom)];
        this.notify('shorts_loaded', this.shorts);
      }
    } catch (e) {
      console.warn('Live Shorts loading error:', e);
    }
  }

  // Управління Certube Premium (100 грн)
  setPremium(status) {
    this.isPremium = Boolean(status);
    localStorage.setItem('certube_premium', this.isPremium ? 'true' : 'false');
    this.notify('premium_changed', this.isPremium);
  }

  togglePremium() {
    this.setPremium(!this.isPremium);
  }

  // Навігація
  setActiveTab(tab) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.notify('tab_changed', tab);
      if (tab === 'shorts' && this.shorts.length <= 4) {
        this.loadLiveShorts();
      }
    }
  }

  // Зміна категорії з живим пошуком у YouTube
  async setActiveCategory(category) {
    this.activeCategory = category;
    this.notify('category_changed', category);

    if (category === 'Мої відео') return;

    // Якщо це реальна тема - шукаємо свіжі відео на YouTube
    const searchQuery = category === 'Усі' ? 'Україна тренди' : `${category} Україна тренди`;
    this.isLoadingVideos = true;
    this.notify('loading_changed', true);

    try {
      const liveCatVideos = await youtubeService.search(searchQuery);
      if (liveCatVideos && liveCatVideos.length > 0) {
        const existingIds = new Set(this.userVideos.map(v => v.youtubeId).filter(Boolean));
        const filtered = liveCatVideos.filter(v => !existingIds.has(v.youtubeId));
        this.videos = [...this.userVideos, ...filtered];
        this.notify('videos_loaded', this.videos);
      }
    } catch (e) {
      console.warn('Category fetch error:', e);
    } finally {
      this.isLoadingVideos = false;
      this.notify('loading_changed', false);
    }
  }

  // Пошук абсолютно БУДЬ-ЯКОГО відео на YouTube
  async setSearchQuery(query) {
    this.searchQuery = query.trim();
    this.notify('search_changed', this.searchQuery);

    if (!this.searchQuery) {
      this.loadLiveYouTubeVideos();
      return;
    }

    this.isLoadingVideos = true;
    this.notify('loading_changed', true);

    try {
      const searchResults = await youtubeService.search(this.searchQuery);
      if (searchResults && searchResults.length > 0) {
        this.videos = [...this.userVideos.filter(v => v.title.toLowerCase().includes(this.searchQuery.toLowerCase())), ...searchResults];
        this.notify('videos_loaded', this.videos);
      }
    } catch (e) {
      console.warn('Live search error:', e);
    } finally {
      this.isLoadingVideos = false;
      this.notify('loading_changed', false);
    }
  }

  // Плеєр відео
  openPlayer(video) {
    this.currentVideo = video;
    this.notify('player_opened', video);
  }

  closePlayer() {
    this.currentVideo = null;
    this.notify('player_closed', null);
  }

  // Студія запису та створення відео [+]
  openStudio() {
    this.isStudioOpen = true;
    this.notify('studio_opened', true);
  }

  closeStudio() {
    this.isStudioOpen = false;
    this.notify('studio_closed', false);
  }

  // Модальне вікно Certube Premium
  openPremiumModal() {
    this.isPremiumModalOpen = true;
    this.notify('premium_modal_opened', true);
  }

  closePremiumModal() {
    this.isPremiumModalOpen = false;
    this.notify('premium_modal_closed', false);
  }

  // Додавання створеного відео
  addCreatedVideo(videoData) {
    const newVideo = {
      id: `custom-${Date.now()}`,
      youtubeId: videoData.youtubeId || null,
      videoBlobUrl: videoData.videoBlobUrl || null,
      isBlob: Boolean(videoData.videoBlobUrl),
      title: videoData.title || 'Нове відео Certube',
      channel: 'Мій Канал',
      channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      verified: this.isPremium,
      views: '1 перегляд',
      timestamp: 'Щойно',
      duration: videoData.duration || '0:45',
      category: videoData.category || 'Мої відео',
      likes: '1.4 тис.',
      subscribers: this.userProfile.subscribersFormatted,
      description: videoData.description || 'Відео створено за допомогою студії Certube',
      isCustom: true
    };

    if (videoData.isShorts) {
      const newShort = {
        id: `short-${Date.now()}`,
        youtubeId: videoData.youtubeId || null,
        videoBlobUrl: videoData.videoBlobUrl || null,
        isBlob: Boolean(videoData.videoBlobUrl),
        title: videoData.title,
        channel: 'Мій Канал',
        channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        likes: 1,
        dislikes: 0,
        comments: 0,
        shares: 0,
        songTitle: 'Оригінальний звук - Мій Канал',
        isLiked: true,
        isSubscribed: false,
        isCustom: true
      };
      this.userShorts.unshift(newShort);
      this.shorts.unshift(newShort);

      try {
        const toSave = this.userShorts.filter(s => s.isCustom && !s.isBlob);
        localStorage.setItem('certube_user_shorts', JSON.stringify(toSave));
      } catch (e) {
        console.warn('Storage quota limit:', e);
      }
      this.setActiveTab('shorts');
    } else {
      this.userVideos.unshift(newVideo);
      this.videos.unshift(newVideo);
      try {
        const toSave = this.userVideos.filter(v => v.isCustom && !v.isBlob);
        localStorage.setItem('certube_user_videos', JSON.stringify(toSave));
      } catch (e) {
        console.warn('Storage quota limit:', e);
      }
      this.setActiveTab('home');
      this.setActiveCategory('Усі');
    }

    this.notify('video_added', newVideo);
    return newVideo;
  }

  toggleLike(videoId) {
    if (this.likedVideos.has(videoId)) {
      this.likedVideos.delete(videoId);
    } else {
      this.likedVideos.add(videoId);
    }
    localStorage.setItem('certube_likes', JSON.stringify([...this.likedVideos]));
    this.notify('like_toggled', videoId);
  }

  toggleSubscribe(channelName) {
    if (this.subscribedChannels.has(channelName)) {
      this.subscribedChannels.delete(channelName);
    } else {
      this.subscribedChannels.add(channelName);
    }
    localStorage.setItem('certube_subs', JSON.stringify([...this.subscribedChannels]));
    this.notify('subscribe_toggled', channelName);
  }

  updateUserProfile(updatedData) {
    this.userProfile = { ...this.userProfile, ...updatedData };
    if (updatedData.name) {
      localStorage.setItem('certube_user_name', updatedData.name);
    }
    this.notify('profile_updated', this.userProfile);
  }
}

export const store = new CertubeStore();
