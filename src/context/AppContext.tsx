import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SmartLink, Click, PageView } from '../types';
import * as store from '../store';

interface AppContextType {
  user: User | null;
  links: SmartLink[];
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
  refreshUser: () => void;
  refreshLinks: () => void;
  createNewLink: (partial: Partial<SmartLink>) => SmartLink;
  saveLink: (link: SmartLink) => void;
  removeLink: (id: string) => void;
  getLinkClicks: (linkId: string) => Click[];
  getLinkViews: (linkId: string) => PageView[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(store.getCurrentUser());
  const [links, setLinks] = useState<SmartLink[]>([]);

  useEffect(() => {
    store.seedDemoData();
    if (user) {
      setLinks(store.getUserLinks(user.id));
    }
  }, []);

  const refreshUser = () => setUser(store.getCurrentUser());
  const refreshLinks = () => { if (user) setLinks(store.getUserLinks(user.id)); };

  const login = (email: string, password: string): boolean => {
    const u = store.authenticateUser(email, password);
    if (u) { setUser(u); setLinks(store.getUserLinks(u.id)); return true; }
    return false;
  };

  const register = (email: string, password: string, name: string) => {
    const u = store.registerUser(email, password, name);
    setUser(u);
    setLinks([]);
  };

  const logout = () => {
    store.setCurrentUser(null);
    setUser(null);
    setLinks([]);
  };

  const createNewLink = (partial: Partial<SmartLink>): SmartLink => {
    if (!user) throw new Error('Not authenticated');
    const link = store.createLink(user.id, partial);
    setLinks(prev => [...prev, link]);
    return link;
  };

  const saveLink = (link: SmartLink) => {
    store.updateLink(link);
    setLinks(prev => prev.map(l => l.id === link.id ? link : l));
  };

  const removeLink = (id: string) => {
    store.deleteLink(id);
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, links, login, register, logout, refreshUser, refreshLinks,
      createNewLink, saveLink, removeLink,
      getLinkClicks: store.getLinkClicks,
      getLinkViews: store.getLinkViews,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
