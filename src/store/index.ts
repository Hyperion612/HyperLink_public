import { User, SmartLink, Click, PageView } from '../types';

const KEYS = {
  users: 'hl_users',
  links: 'hl_links',
  clicks: 'hl_clicks',
  views: 'hl_views',
  currentUser: 'hl_current_user',
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// --- Users ---
export function getUsers(): User[] {
  const data = localStorage.getItem(KEYS.users);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(KEYS.currentUser);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  else localStorage.removeItem(KEYS.currentUser);
}

export function authenticateUser(email: string, password: string): User | null {
  const users = getUsers();
  const stored = localStorage.getItem('hl_password_' + email);
  if (stored === password) {
    const user = users.find(u => u.email === email);
    if (user) { setCurrentUser(user); return user; }
  }
  return null;
}

export function registerUser(email: string, password: string, name: string): User {
  const users = getUsers();
  const user: User = {
    id: generateId(),
    email,
    name,
    avatarUrl: '',
    plan: 'free',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  localStorage.setItem('hl_password_' + email, password);
  setCurrentUser(user);
  return user;
}

export function updateUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) { users[idx] = user; saveUsers(users); setCurrentUser(user); }
}

// --- Links ---
export function getLinks(): SmartLink[] {
  const data = localStorage.getItem(KEYS.links);
  return data ? JSON.parse(data) : [];
}

export function saveLinks(links: SmartLink[]): void {
  localStorage.setItem(KEYS.links, JSON.stringify(links));
}

export function getUserLinks(userId: string): SmartLink[] {
  return getLinks().filter(l => l.userId === userId);
}

export function getLinkBySlug(slug: string): SmartLink | undefined {
  return getLinks().find(l => l.slug === slug);
}

export function getLinkById(id: string): SmartLink | undefined {
  return getLinks().find(l => l.id === id);
}

export function createLink(userId: string, partial: Partial<SmartLink>): SmartLink {
  const links = getLinks();
  const link: SmartLink = {
    id: generateId(),
    userId,
    slug: generateSlug(),
    title: partial.title || 'Новая ссылка',
    artistName: partial.artistName || '',
    backgroundUrl: partial.backgroundUrl || '',
    buttonColor: partial.buttonColor || '#3B82F6',
    textColor: partial.textColor || '#FFFFFF',
    font: partial.font || 'Inter',
    customDomain: '',
    isActive: true,
    expiresAt: '',
    countdownDate: '',
    youtubeUrl: '',
    audioPreviewUrl: '',
    presaveEnabled: false,
    presaveSpotifyUrl: '',
    presaveAppleUrl: '',
    fbPixelId: '',
    vkPixelId: '',
    services: [],
    createdAt: new Date().toISOString(),
    ...partial,
  };
  links.push(link);
  saveLinks(links);
  return link;
}

export function updateLink(link: SmartLink): void {
  const links = getLinks();
  const idx = links.findIndex(l => l.id === link.id);
  if (idx >= 0) { links[idx] = link; saveLinks(links); }
}

export function deleteLink(id: string): void {
  const links = getLinks().filter(l => l.id !== id);
  saveLinks(links);
}

// --- Clicks ---
export function getClicks(): Click[] {
  const data = localStorage.getItem(KEYS.clicks);
  return data ? JSON.parse(data) : [];
}

export function addClick(click: Omit<Click, 'id' | 'createdAt'>): Click {
  const clicks = getClicks();
  const newClick: Click = { ...click, id: generateId(), createdAt: new Date().toISOString() };
  clicks.push(newClick);
  localStorage.setItem(KEYS.clicks, JSON.stringify(clicks));
  return newClick;
}

export function getLinkClicks(linkId: string): Click[] {
  return getClicks().filter(c => c.linkId === linkId);
}

// --- Page Views ---
export function getViews(): PageView[] {
  const data = localStorage.getItem(KEYS.views);
  return data ? JSON.parse(data) : [];
}

export function addView(view: Omit<PageView, 'id' | 'createdAt'>): PageView {
  const views = getViews();
  const newView: PageView = { ...view, id: generateId(), createdAt: new Date().toISOString() };
  views.push(newView);
  localStorage.setItem(KEYS.views, JSON.stringify(views));
  return newView;
}

export function getLinkViews(linkId: string): PageView[] {
  return getViews().filter(v => v.linkId === linkId);
}

// --- Seed Data ---
export function seedDemoData(): void {
  let existing: User[] = [];
  try {
    existing = getUsers();
    if (existing.find(u => u.email === 'demo@hyperlink.app')) return;
  } catch (e) {
    console.error('Error checking existing users:', e);
    return;
  }

  const demoUser: User = {
    id: 'demo-user-1',
    email: 'demo@hyperlink.app',
    name: 'Demo Artist',
    avatarUrl: '',
    plan: 'pro',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  };
  const users = [...existing, demoUser];
  saveUsers(users);
  localStorage.setItem('hl_password_demo@hyperlink.app', 'demo');

  const links: SmartLink[] = [
    {
      id: 'link-1', userId: 'demo-user-1', slug: 'rassvet-single',
      title: 'Рассвет', artistName: 'Demo Artist',
      backgroundUrl: '', buttonColor: '#3B82F6', textColor: '#FFFFFF', font: 'Inter',
      customDomain: '', isActive: true, expiresAt: '', countdownDate: '2026-03-01T00:00:00',
      youtubeUrl: '', audioPreviewUrl: '',
      presaveEnabled: true, presaveSpotifyUrl: 'https://spotify.com/presave/demo', presaveAppleUrl: '',
      fbPixelId: '', vkPixelId: '',
      services: [
        { id: 's1', serviceName: 'Spotify', url: 'https://open.spotify.com/track/demo1', position: 0 },
        { id: 's2', serviceName: 'Apple Music', url: 'https://music.apple.com/demo1', position: 1 },
        { id: 's3', serviceName: 'VK Музыка', url: 'https://vk.com/music/demo1', position: 2 },
        { id: 's4', serviceName: 'Яндекс Музыка', url: 'https://music.yandex.ru/demo1', position: 3 },
        { id: 's5', serviceName: 'YouTube Music', url: 'https://music.youtube.com/demo1', position: 4 },
      ],
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'link-2', userId: 'demo-user-1', slug: 'midnight-album',
      title: 'Midnight EP', artistName: 'Demo Artist',
      backgroundUrl: '', buttonColor: '#8B5CF6', textColor: '#FFFFFF', font: 'Inter',
      customDomain: '', isActive: true, expiresAt: '', countdownDate: '',
      youtubeUrl: '', audioPreviewUrl: '',
      presaveEnabled: false, presaveSpotifyUrl: '', presaveAppleUrl: '',
      fbPixelId: '', vkPixelId: '',
      services: [
        { id: 's6', serviceName: 'Spotify', url: 'https://open.spotify.com/album/demo2', position: 0 },
        { id: 's7', serviceName: 'Apple Music', url: 'https://music.apple.com/demo2', position: 1 },
        { id: 's8', serviceName: 'Deezer', url: 'https://deezer.com/demo2', position: 2 },
        { id: 's9', serviceName: 'Tidal', url: 'https://tidal.com/demo2', position: 3 },
        { id: 's10', serviceName: 'SoundCloud', url: 'https://soundcloud.com/demo2', position: 4 },
      ],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'link-3', userId: 'demo-user-1', slug: 'podcast-ep12',
      title: 'Подкаст #12: Интервью', artistName: 'Demo Artist',
      backgroundUrl: '', buttonColor: '#10B981', textColor: '#FFFFFF', font: 'Inter',
      customDomain: '', isActive: true, expiresAt: '', countdownDate: '',
      youtubeUrl: '', audioPreviewUrl: '',
      presaveEnabled: false, presaveSpotifyUrl: '', presaveAppleUrl: '',
      fbPixelId: '', vkPixelId: '',
      services: [
        { id: 's11', serviceName: 'Spotify', url: 'https://open.spotify.com/show/demo3', position: 0 },
        { id: 's12', serviceName: 'Apple Music', url: 'https://music.apple.com/demo3', position: 1 },
        { id: 's13', serviceName: 'YouTube Music', url: 'https://music.youtube.com/demo3', position: 2 },
      ],
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ];
  saveLinks(links);

  // Seed clicks - оптимизировано для быстрой загрузки
  const clicks: Click[] = [];
  const countries = ['RU', 'US', 'GB'];
  const devices = ['iPhone', 'Android', 'Mac'];
  const services = ['Spotify', 'Apple Music', 'VK Музыка'];

  for (const link of links) {
    const numClicks = link.id === 'link-1' ? 15 : link.id === 'link-2' ? 10 : 5;
    for (let i = 0; i < numClicks; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const country = countries[Math.floor(Math.random() * countries.length)];
      clicks.push({
        id: generateId(),
        linkId: link.id,
        serviceName: services[Math.floor(Math.random() * services.length)],
        country,
        city: 'Москва',
        device: devices[Math.floor(Math.random() * devices.length)],
        utmSource: 'direct',
        createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      });
    }
  }
  localStorage.setItem(KEYS.clicks, JSON.stringify(clicks));

  // Seed views - оптимизировано для быстрой загрузки
  const views: PageView[] = [];
  for (const link of links) {
    const numViews = link.id === 'link-1' ? 25 : link.id === 'link-2' ? 15 : 8;
    for (let i = 0; i < numViews; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const country = countries[Math.floor(Math.random() * countries.length)];
      views.push({
        id: generateId(),
        linkId: link.id,
        country,
        city: 'Москва',
        device: devices[Math.floor(Math.random() * devices.length)],
        utmSource: 'direct',
        createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      });
    }
  }
  localStorage.setItem(KEYS.views, JSON.stringify(views));
}
