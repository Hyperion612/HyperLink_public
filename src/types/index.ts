export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  plan: 'free' | 'pro';
  createdAt: string;
}

export interface LinkService {
  id: string;
  serviceName: string;
  url: string;
  position: number;
}

export interface SmartLink {
  id: string;
  userId: string;
  slug: string;
  title: string;
  artistName: string;
  backgroundUrl: string;
  buttonColor: string;
  textColor: string;
  font: string;
  customDomain: string;
  isActive: boolean;
  expiresAt: string;
  countdownDate: string;
  youtubeUrl: string;
  audioPreviewUrl: string;
  presaveEnabled: boolean;
  presaveSpotifyUrl: string;
  presaveAppleUrl: string;
  fbPixelId: string;
  vkPixelId: string;
  services: LinkService[];
  createdAt: string;
}

export interface Click {
  id: string;
  linkId: string;
  serviceName: string;
  country: string;
  city: string;
  device: string;
  utmSource: string;
  createdAt: string;
}

export interface PageView {
  id: string;
  linkId: string;
  country: string;
  city: string;
  device: string;
  utmSource: string;
  createdAt: string;
}

export const STREAMING_SERVICES = [
  { name: 'Spotify', icon: '🎧', color: '#1DB954', regions: ['US', 'EU', 'UK'] },
  { name: 'Apple Music', icon: '🍎', color: '#FC3C44', regions: ['US', 'EU', 'UK'] },
  { name: 'YouTube Music', icon: '▶️', color: '#FF0000', regions: ['US', 'EU', 'UK', 'ASIA'] },
  { name: 'VK Музыка', icon: '🎵', color: '#0077FF', regions: ['RU', 'BY', 'KZ'] },
  { name: 'Яндекс Музыка', icon: '🎶', color: '#FFCC00', regions: ['RU', 'BY', 'KZ'] },
  { name: 'Zvuk', icon: '🔊', color: '#8B5CF6', regions: ['RU'] },
  { name: 'Deezer', icon: '🎼', color: '#A238FF', regions: ['EU', 'BR'] },
  { name: 'Tidal', icon: '🌊', color: '#000000', regions: ['US', 'EU', 'UK'] },
  { name: 'SoundCloud', icon: '☁️', color: '#FF5500', regions: ['US', 'EU', 'UK'] },
  { name: 'Boom', icon: '💥', color: '#FF3355', regions: ['RU'] },
];

export const COUNTRIES = ['RU', 'US', 'GB', 'DE', 'FR', 'BR', 'JP', 'KR', 'KZ', 'BY', 'UA'];
export const CITIES: Record<string, string[]> = {
  RU: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Казань'],
  US: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  GB: ['London', 'Manchester', 'Birmingham'],
  DE: ['Berlin', 'Munich', 'Hamburg'],
  FR: ['Paris', 'Lyon', 'Marseille'],
  BR: ['São Paulo', 'Rio de Janeiro'],
  JP: ['Tokyo', 'Osaka'],
  KR: ['Seoul', 'Busan'],
  KZ: ['Алматы', 'Астана'],
  BY: ['Минск'],
  UA: ['Киев', 'Одесса'],
};

export const DEVICES = ['iPhone', 'Android', 'iPad', 'Mac', 'Windows', 'Linux'];
