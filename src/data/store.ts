import { SiteData } from '../types';

export const defaultData: SiteData = {
  artistName: 'HyperLink Artist',
  bio: 'Музыкант • Продюсер • Артист',
  avatarUrl: '',
  socialLinks: [
    { id: '1', platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram', color: '#E1306C' },
    { id: '2', platform: 'YouTube', url: 'https://youtube.com', icon: 'youtube', color: '#FF0000' },
    { id: '3', platform: 'TikTok', url: 'https://tiktok.com', icon: 'tiktok', color: '#000000' },
    { id: '4', platform: 'Telegram', url: 'https://telegram.org', icon: 'telegram', color: '#0088CC' },
    { id: '5', platform: 'VK', url: 'https://vk.com', icon: 'vk', color: '#4C75A3' },
    { id: '6', platform: 'Twitter / X', url: 'https://x.com', icon: 'twitter', color: '#1DA1F2' },
  ],
  musicPlatforms: [
    { id: '1', name: 'Spotify', url: 'https://spotify.com', icon: 'spotify' },
    { id: '2', name: 'Apple Music', url: 'https://music.apple.com', icon: 'apple-music' },
    { id: '3', name: 'Яндекс Музыка', url: 'https://music.yandex.ru', icon: 'yandex' },
    { id: '4', name: 'VK Музыка', url: 'https://music.vk.com', icon: 'vk-music' },
    { id: '5', name: 'SoundCloud', url: 'https://soundcloud.com', icon: 'soundcloud' },
    { id: '6', name: 'Deezer', url: 'https://deezer.com', icon: 'deezer' },
  ],
  upcomingRelease: {
    id: '1',
    title: 'Новый Сингл "Рассвет"',
    date: '2026-02-15',
    description: 'Скоро выходит новый трек! Предзаказ уже доступен на всех площадках.',
    preSaveUrl: 'https://example.com/presave',
  },
  news: [
    {
      id: '1',
      title: 'Новый клип уже доступен!',
      content: 'Смотрите премьеру клипа на наш новый трек. Режиссёр - известный видеомейкер.',
      date: '2026-01-10',
    },
    {
      id: '2',
      title: 'Тур по городам 2026',
      content: 'Объявляем даты концертов! Билеты уже в продаже на нашем сайте.',
      date: '2026-01-05',
    },
  ],
};

export function loadData(): SiteData {
  try {
    const stored = localStorage.getItem('hyperlink_data');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return defaultData;
}

export function saveData(data: SiteData): void {
  localStorage.setItem('hyperlink_data', JSON.stringify(data));
}
