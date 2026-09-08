import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, ExternalLink, BarChart3, Trash2, Copy, Check, TrendingUp, Link2, Eye } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getLinkClicks, getLinkViews } from '../store';

export default function DashboardPage() {
  const { user, links, removeLink } = useApp();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const totalClicks = links.reduce((acc, l) => acc + getLinkClicks(l.id).length, 0);
  const totalViews = links.reduce((acc, l) => acc + getLinkViews(l.id).length, 0);

  const copyLink = (slug: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + '/#/r/' + slug);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Дашборд</h1>
              <p className="text-zinc-400 mt-1">Добро пожаловать, {user.name}!</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/editor/new')} 
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" /> Создать ссылку
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{links.length}</p>
                  <p className="text-sm text-zinc-400">Активных ссылок</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-600/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalViews}</p>
                  <p className="text-sm text-zinc-400">Всего просмотров</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalClicks}</p>
                  <p className="text-sm text-zinc-400">Всего кликов</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Мои ссылки</h2>
            {links.length === 0 ? (
              <div className="bg-zinc-900 rounded-xl p-12 text-center border border-zinc-800">
                <p className="text-zinc-400 mb-4">У вас пока нет ссылок</p>
                <button 
                  onClick={() => navigate('/dashboard/editor/new')} 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                >
                  Создать первую ссылку
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map(link => {
                  const clicks = getLinkClicks(link.id).length;
                  const views = getLinkViews(link.id).length;
                  return (
                    <div key={link.id} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl" style={{ background: link.buttonColor + '20' }}>
                          🎵
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{link.title}</h3>
                          <p className="text-sm text-zinc-400 truncate">{link.artistName} • {link.services.length} площадок</p>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold">{views}</p>
                            <p className="text-xs text-zinc-500">просмотров</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{clicks}</p>
                            <p className="text-xs text-zinc-500">кликов</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => copyLink(link.slug, link.id)} 
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="Копировать ссылку"
                          >
                            {copiedId === link.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => navigate('/r/' + link.slug)} 
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="Открыть"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate('/dashboard/stats/' + link.id)} 
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="Статистика"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate('/dashboard/editor/' + link.id)} 
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition-colors"
                            title="Редактировать"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { if (confirm('Удалить ссылку?')) removeLink(link.id); }} 
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
