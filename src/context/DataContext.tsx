import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteData, SocialLink, MusicPlatform, UpcomingRelease, NewsItem } from '../types';
import { loadData, saveData } from '../data/store';

interface DataContextType {
  data: SiteData;
  updateData: (data: SiteData) => void;
  updateArtistInfo: (name: string, bio: string) => void;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (link: SocialLink) => void;
  deleteSocialLink: (id: string) => void;
  addMusicPlatform: (platform: Omit<MusicPlatform, 'id'>) => void;
  updateMusicPlatform: (platform: MusicPlatform) => void;
  deleteMusicPlatform: (id: string) => void;
  setUpcomingRelease: (release: UpcomingRelease | null) => void;
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = (newData: SiteData) => setData(newData);

  const updateArtistInfo = (name: string, bio: string) => {
    setData(prev => ({ ...prev, artistName: name, bio }));
  };

  const addSocialLink = (link: Omit<SocialLink, 'id'>) => {
    setData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { ...link, id: Date.now().toString() }],
    }));
  };

  const updateSocialLink = (link: SocialLink) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(l => l.id === link.id ? link : l),
    }));
  };

  const deleteSocialLink = (id: string) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(l => l.id !== id),
    }));
  };

  const addMusicPlatform = (platform: Omit<MusicPlatform, 'id'>) => {
    setData(prev => ({
      ...prev,
      musicPlatforms: [...prev.musicPlatforms, { ...platform, id: Date.now().toString() }],
    }));
  };

  const updateMusicPlatform = (platform: MusicPlatform) => {
    setData(prev => ({
      ...prev,
      musicPlatforms: prev.musicPlatforms.map(p => p.id === platform.id ? platform : p),
    }));
  };

  const deleteMusicPlatform = (id: string) => {
    setData(prev => ({
      ...prev,
      musicPlatforms: prev.musicPlatforms.filter(p => p.id !== id),
    }));
  };

  const setUpcomingRelease = (release: UpcomingRelease | null) => {
    setData(prev => ({ ...prev, upcomingRelease: release }));
  };

  const addNews = (news: Omit<NewsItem, 'id'>) => {
    setData(prev => ({
      ...prev,
      news: [{ ...news, id: Date.now().toString() }, ...prev.news],
    }));
  };

  const updateNews = (news: NewsItem) => {
    setData(prev => ({
      ...prev,
      news: prev.news.map(n => n.id === news.id ? news : n),
    }));
  };

  const deleteNews = (id: string) => {
    setData(prev => ({
      ...prev,
      news: prev.news.filter(n => n.id !== id),
    }));
  };

  return (
    <DataContext.Provider value={{
      data, updateData, updateArtistInfo,
      addSocialLink, updateSocialLink, deleteSocialLink,
      addMusicPlatform, updateMusicPlatform, deleteMusicPlatform,
      setUpcomingRelease, addNews, updateNews, deleteNews,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
