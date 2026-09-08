import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import PublicLinkPage from './pages/PublicLinkPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';

export default function App() {
  useEffect(() => {
    document.title = 'HyperLink — Умные ссылки для музыкантов';
  }, []);

  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/editor/:id" element={<EditorPage />} />
          <Route path="/dashboard/stats/:id" element={<StatsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/r/:slug" element={<PublicLinkPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
