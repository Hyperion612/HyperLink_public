import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLinkClicks, getLinkViews } from '../store';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, BarChart3, Globe, MousePointer, PieChart, TrendingUp } from 'lucide-react';
import { Click, PageView } from '../types';

export default function StatsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, links } = useApp();
  const [clicks, setClicks] = useState<Click[]>([]);
  const [views, setViews] = useState<PageView[]>([]);

  const link = links.find(l => l.id === id);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (id) {
      setClicks(getLinkClicks(id));
      setViews(getLinkViews(id));
    }
  }, [user, id, navigate]);

  if (!user || !link) return null;

  // Chart data - last 14 days
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.now() - (13 - i) * 86400000);
    const dayStr = date.toISOString().split('T')[0];
    const dayClicks = clicks.filter(c => c.createdAt.startsWith(dayStr)).length;
    const dayViews = views.filter(v => v.createdAt.startsWith(dayStr)).length;
    return { date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }), clicks: dayClicks, views: dayViews };
  });
  const maxVal = Math.max(...chartData.map(d => Math.max(d.clicks, d.views)), 1);

  // Country stats
  const countryStats: Record<string, number> = {};
  views.forEach(v => { countryStats[v.country] = (countryStats[v.country] || 0) + 1; });
  const totalViews = views.length;
  const countryData = Object.entries(countryStats).sort((a, b) => b[1] - a[1]);

  // Service conversion
  const serviceClicks: Record<string, number> = {};
  clicks.forEach(c => { serviceClicks[c.serviceName] = (serviceClicks[c.serviceName] || 0) + 1; });
  const serviceData = Object.entries(serviceClicks).sort((a, b) => b[1] - a[1]);

  // UTM sources
  const utmStats: Record<string, number> = {};
  views.forEach(v => { utmStats[v.utmSource] = (utmStats[v.utmSource] || 0) + 1; });
  const utmData = Object.entries(utmStats).sort((a, b) => b[1] - a[1]);

  // Device stats
  const deviceStats: Record<string, number> = {};
  views.forEach(v => { deviceStats[v.device] = (deviceStats[v.device] || 0) + 1; });
  const deviceData = Object.entries(deviceStats).sort((a, b) => b[1] - a[1]);

  const countryColors: Record<string, string> = {
    RU: '#3B82F6', US: '#10B981', GB: '#8B5CF6', DE: '#F59E0B', FR: '#EC4899', KZ: '#06B6D4', BY: '#EF4444',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Sidebar active="dashboard" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start sm:items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex-shrink-0 mt-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">Статистика: {link.title}</h1>
              <p className="text-sm text-gray-400 mt-0.5 truncate">hyperlink.app/r/{link.slug}</p>
            </div>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Просмотров', value: totalViews, icon: BarChart3, color: 'blue' },
              { label: 'Кликов', value: clicks.length, icon: MousePointer, color: 'green' },
              { label: 'Конверсия', value: totalViews > 0 ? ((clicks.length / totalViews) * 100).toFixed(1) + '%' : '0%', icon: TrendingUp, color: 'purple' },
              { label: 'Площадок', value: serviceData.length, icon: PieChart, color: 'yellow' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <stat.icon className={`w-5 h-5 mb-2 ${stat.color === 'blue' ? 'text-blue-400' : stat.color === 'green' ? 'text-green-400' : stat.color === 'purple' ? 'text-purple-400' : 'text-yellow-400'}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Активность за 14 дней
            </h2>
            <div className="h-48 flex items-end gap-1.5">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex items-end gap-0.5 group">
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div className="w-full bg-blue-600/60 rounded-t-sm transition-all group-hover:bg-blue-500" style={{ height: `${(d.views / maxVal) * 100}%`, minHeight: d.views > 0 ? '2px' : '0' }}></div>
                    <div className="w-full bg-green-600/60 rounded-t-sm transition-all group-hover:bg-green-500" style={{ height: `${(d.clicks / maxVal) * 100}%`, minHeight: d.clicks > 0 ? '2px' : '0' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-600/60"></div><span className="text-xs text-gray-400">Просмотры</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-600/60"></div><span className="text-xs text-gray-400">Клики</span></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Countries */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" /> Топ стран
              </h2>
              <div className="space-y-3">
                {countryData.map(([country, count]) => (
                  <div key={country} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{country}</span>
                    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(count / totalViews) * 100}%`, background: countryColors[country] || '#3B82F6' }}></div>
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                    <span className="text-xs text-gray-500 w-10 text-right">{((count / totalViews) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* UTM Sources */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" /> Источники
              </h2>
              <div className="space-y-3">
                {utmData.map(([source, count]) => (
                  <div key={source} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20 truncate">{source}</span>
                    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600/60 rounded-full transition-all" style={{ width: `${(count / totalViews) * 100}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Conversion */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-purple-400" /> Конверсия по платформам
              </h2>
              <div className="space-y-3">
                {serviceData.map(([service, count]) => (
                  <div key={service} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-32 truncate">{service}</span>
                    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600/60 rounded-full transition-all" style={{ width: `${(count / clicks.length) * 100}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                    <span className="text-xs text-gray-500 w-10 text-right">{((count / clicks.length) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-yellow-400" /> Устройства
              </h2>
              <div className="space-y-3">
                {deviceData.map(([dev, count]) => (
                  <div key={dev} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20 truncate">{dev}</span>
                    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-600/60 rounded-full transition-all" style={{ width: `${(count / totalViews) * 100}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                    <span className="text-xs text-gray-500 w-10 text-right">{((count / totalViews) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
