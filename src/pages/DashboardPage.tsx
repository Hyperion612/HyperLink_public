import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, ExternalLink, BarChart3, Trash2, Copy, Check, TrendingUp, Link2, Music, Eye } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getLinkClicks, getLinkViews } from '../store';

export default function DashboardPage() {
  const { user, links, removeLink } = useApp();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [user, navigate]);

  if (!user) return null;

  const totalClicks = links.reduce((acc, l) => acc + getLinkClicks(l.id).length, 0);
  const totalViews = links.reduce((acc, l) => acc + getLinkViews(l.id).length, 0);

  // Last 14 days chart data
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.now() - (13 - i) * 86400000);
    const dayStr = date.toISOString().split('T')[0];
    let count = 0;
    links.forEach(l => {
      getLinkViews(l.id).forEach(v => {
        if (v.createdAt.startsWith(dayStr)) count++;
      });
    });
    return { date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }), views: count };
  });
  const maxViews = Math.max(...chartData.map(d => d.views), 1);

  const copyLink = (slug: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + '/r/' + slug);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Sidebar active="dashboard" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Дашборд</h1>
              <p className="text-gray-400 mt-1">Добро пожаловать, {user.name}!</p>
            </div>
            <button onClick={() => navigate('/dashboard/editor/new')} className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25">
              <Plus className="w-5 h-5" /> Создать ссылку
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Активных ссылок', value: links.length, icon: Link2, color: 'blue' },
              { label: 'Всего просмотров', value: totalViews, icon: Eye, color: 'purple' },
              { label: 'Всего кликов', value: totalClicks, icon: TrendingUp, color: 'green' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-600/10' : stat.color === 'purple' ? 'bg-purple-600/10' : 'bg-green-600/10'}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color === 'blue' ? 'text-blue-400' : stat.color === 'purple' ? 'text-purple-400' : 'text-green-400'}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '—' : stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Просмотры за 14 дней
            </h2>
            {loading ? (
              <div className="h-48 flex items-end gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex-1 skeleton" style={{ height: `${30 + Math.random() * 70}%` }}></div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-end gap-1.5">
                {chartData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                      <div
                        className="w-full max-w-[30px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all group-hover:from-blue-500 group-hover:to-blue-300 cursor-pointer relative"
                        style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: d.views > 0 ? '4px' : '0' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.views}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500">{d.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Мои ссылки</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-14 h-14 skeleton rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 skeleton"></div>
                      <div className="h-3 w-24 skeleton"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : links.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">У вас пока нет ссылок</p>
                <button onClick={() => navigate('/dashboard/editor/new')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-all">
                  Создать первую ссылку
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map(link => {
                  const clicks = getLinkClicks(link.id).length;
                  const views = getLinkViews(link.id).length;
                  return (
                    <div key={link.id} className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-blue-500/20 transition-all group">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: link.buttonColor + '20' }}>
                        🎵
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{link.title}</h3>
                        <p className="text-sm text-gray-400 truncate">{link.artistName} • {link.services.length} площадок</p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold">{views}</p>
                          <p className="text-xs text-gray-500">просмотров</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{clicks}</p>
                          <p className="text-xs text-gray-500">кликов</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => copyLink(link.slug, link.id)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors" title="Копировать ссылку">
                          {copiedId === link.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button onClick={() => navigate('/r/' + link.slug)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors" title="Открыть">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate('/dashboard/stats/' + link.id)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors" title="Статистика">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate('/dashboard/editor/' + link.id)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-blue-400 transition-colors" title="Редактировать">
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm('Удалить ссылку?')) removeLink(link.id); }} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors" title="Удалить">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
