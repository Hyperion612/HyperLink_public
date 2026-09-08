export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
}

export interface MusicPlatform {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface UpcomingRelease {
  id: string;
  title: string;
  date: string;
  description: string;
  coverUrl?: string;
  preSaveUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export interface SiteData {
  artistName: string;
  bio: string;
  avatarUrl?: string;
  socialLinks: SocialLink[];
  musicPlatforms: MusicPlatform[];
  upcomingRelease: UpcomingRelease | null;
  news: NewsItem[];
}
