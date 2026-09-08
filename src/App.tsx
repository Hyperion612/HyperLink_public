import React, { useEffect, Component, ReactNode } from 'react';
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

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', background: '#0a0a0f', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ff4444' }}>❌ Ошибка загрузки приложения</h1>
          <p style={{ color: '#999', marginTop: '10px' }}>{this.state.error?.message}</p>
          <pre style={{ marginTop: '20px', padding: '10px', background: '#1a1a1a', borderRadius: '8px', overflow: 'auto', fontSize: '12px', color: '#ccc' }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Перезагрузить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    document.title = 'HyperLink — Умные ссылки для музыкантов';
    console.log('✅ App mounted successfully');
  }, []);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
