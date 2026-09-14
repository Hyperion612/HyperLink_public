import React, { createContext, useContext, useState, ReactNode } from 'react';
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

// Инициализируем демо-данные ОДИН РАЗ при загрузке модуля
let isInitialized = false;
function initializeApp() {
  if (isInitialized) return;
  try {
    store.seedDemoData();
    isInitialized = true;
    console.log('✅ App initialized successfully');
  } catch (e) {
    console.error('❌ Error initializing app:', e);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Вызываем инициализацию при первом рендере
  initializeApp();

  const [user, setUser] = useState<User | null>(() => {
    try {
      const currentUser = store.getCurrentUser();
      console.log('✅ Current user loaded:', currentUser?.email || 'null');
      return currentUser;
    } catch (e) {
      console.error('❌ Error getting current user:', e);
      return null;
    }
  });
  
  const [links, setLinks] = useState<SmartLink[]>(() => {
    try {
      const currentUser = store.getCurrentUser();
      const userLinks = currentUser ? store.getUserLinks(currentUser.id) : [];
      console.log('✅ User links loaded:', userLinks.length);
      return userLinks;
    } catch (e) {
      console.error('❌ Error getting user links:', e);
      return [];
    }
  });

  const refreshUser = () => {
    const currentUser = store.getCurrentUser();
    setUser(currentUser);
    console.log('🔄 User refreshed:', currentUser?.email || 'null');
  };

  const refreshLinks = () => { 
    if (user) {
      const userLinks = store.getUserLinks(user.id);
      setLinks(userLinks);
      console.log('🔄 Links refreshed:', userLinks.length);
    }
  };

  const login = (email: string, password: string): boolean => {
    try {
      const u = store.authenticateUser(email, password);
      if (u) { 
        setUser(u); 
        setLinks(store.getUserLinks(u.id));
        console.log('✅ Login successful:', u.email);
        return true; 
      }
      console.log('❌ Login failed: invalid credentials');
      return false;
    } catch (e) {
      console.error('❌ Login error:', e);
      return false;
    }
  };

  const register = (email: string, password: string, name: string) => {
    try {
      const u = store.registerUser(email, password, name);
      setUser(u);
      setLinks([]);
      console.log('✅ Registration successful:', u.email);
    } catch (e) {
      console.error('❌ Registration error:', e);
    }
  };

  const logout = () => {
    store.setCurrentUser(null);
    setUser(null);
    setLinks([]);
    console.log('✅ Logout successful');
  };

  const createNewLink = (partial: Partial<SmartLink>): SmartLink => {
    if (!user) throw new Error('Not authenticated');
    const link = store.createLink(user.id, partial);
    setLinks(prev => [...prev, link]);
    console.log('✅ Link created:', link.slug);
    return link;
  };

  const saveLink = (link: SmartLink) => {
    store.updateLink(link);
    setLinks(prev => prev.map(l => l.id === link.id ? link : l));
    console.log('✅ Link saved:', link.slug);
  };

  const removeLink = (id: string) => {
    store.deleteLink(id);
    setLinks(prev => prev.filter(l => l.id !== id));
    console.log('✅ Link removed:', id);
  };

  const value: AppContextType = {
    user,
    links,
    login,
    register,
    logout,
    refreshUser,
    refreshLinks,
    createNewLink,
    saveLink,
    removeLink,
    getLinkClicks: store.getLinkClicks,
    getLinkViews: store.getLinkViews,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
