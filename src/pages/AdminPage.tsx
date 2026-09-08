import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, Edit3, Lock, LogOut,
  User, Music, Calendar, Newspaper, Link2, X, Check
} from 'lucide-react';
import { SocialLink, MusicPlatform, UpcomingRelease, NewsItem } from '../types';

const ADMIN_PASSWORD = 'hyperlink2026';

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('hyperlink_admin', 'true');
      onLogin();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Панель администратора</h1>
            <p className="text-gray-400 mt-2">Введите пароль для доступа</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Пароль"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {error && <p className="text-blue-300 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-500 hover:to-blue-400 transition-all"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'music' | 'release' | 'news'>('profile');
  const {
    data, updateArtistInfo,
    addSocialLink, updateSocialLink, deleteSocialLink,
    addMusicPlatform, updateMusicPlatform, deleteMusicPlatform,
    setUpcomingRelease, addNews, updateNews, deleteNews
  } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('hyperlink_admin') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('hyperlink_admin');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const tabs = [
    { id: 'profile' as const, label: 'Профиль', icon: User },
    { id: 'social' as const, label: 'Соцсети', icon: Link2 },
    { id: 'music' as const, label: 'Музыка', icon: Music },
    { id: 'release' as const, label: 'Релиз', icon: Calendar },
    { id: 'news' as const, label: 'Новости', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
              HyperLink Admin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="px-3 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              Просмотр сайта
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 bg-gray-900/50 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pb-16">
          {activeTab === 'profile' && <ProfileSection data={data} updateArtistInfo={updateArtistInfo} />}
          {activeTab === 'social' && (
            <SocialSection
              links={data.socialLinks}
              addLink={addSocialLink}
              updateLink={updateSocialLink}
              deleteLink={deleteSocialLink}
            />
          )}
          {activeTab === 'music' && (
            <MusicSection
              platforms={data.musicPlatforms}
              addPlatform={addMusicPlatform}
              updatePlatform={updateMusicPlatform}
              deletePlatform={deleteMusicPlatform}
            />
          )}
          {activeTab === 'release' && (
            <ReleaseSection release={data.upcomingRelease} setRelease={setUpcomingRelease} />
          )}
          {activeTab === 'news' && (
            <NewsSection news={data.news} addNews={addNews} updateNews={updateNews} deleteNews={deleteNews} />
          )}
        </div>
      </div>
    </div>
  );
}

// Profile Section
function ProfileSection({ data, updateArtistInfo }: { data: any; updateArtistInfo: (name: string, bio: string) => void }) {
  const [name, setName] = useState(data.artistName);
  const [bio, setBio] = useState(data.bio);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateArtistInfo(name, bio);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-400" />
        Информация о профиле
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Имя артиста / Название</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Описание / Био</label>
          <input
            type="text"
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-500 hover:to-blue-400 transition-all"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Сохранено!' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

// Social Links Section
function SocialSection({ links, addLink, updateLink, deleteLink }: {
  links: SocialLink[];
  addLink: (link: Omit<SocialLink, 'id'>) => void;
  updateLink: (link: SocialLink) => void;
  deleteLink: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: '', url: '', icon: '', color: '' });

  const handleSave = () => {
    if (!form.platform || !form.url) return;
    if (editingId) {
      updateLink({ ...form, id: editingId });
      setEditingId(null);
    } else {
      addLink(form);
    }
    setForm({ platform: '', url: '', icon: '', color: '' });
    setShowForm(false);
  };

  const handleEdit = (link: SocialLink) => {
    setForm({ platform: link.platform, url: link.url, icon: link.icon, color: link.color });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ platform: '', url: '', icon: '', color: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            Социальные сети
          </h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Добавить
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-blue-500/30 space-y-3">
            <input
              type="text"
              placeholder="Название платформы (напр. Instagram)"
              value={form.platform}
              onChange={e => setForm({ ...form, platform: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="url"
              placeholder="URL ссылки"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm transition-colors">
                <Check className="w-4 h-4" /> Сохранить
              </button>
              <button onClick={handleCancel} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors">
                <X className="w-4 h-4" /> Отмена
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{link.platform}</p>
                <p className="text-xs text-gray-400 truncate">{link.url}</p>
              </div>
              <button onClick={() => handleEdit(link)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => deleteLink(link.id)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {links.length === 0 && <p className="text-gray-500 text-center py-4">Нет ссылок. Добавьте первую!</p>}
        </div>
      </div>
    </div>
  );
}

// Music Platforms Section
function MusicSection({ platforms, addPlatform, updatePlatform, deletePlatform }: {
  platforms: MusicPlatform[];
  addPlatform: (platform: Omit<MusicPlatform, 'id'>) => void;
  updatePlatform: (platform: MusicPlatform) => void;
  deletePlatform: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', url: '', icon: '' });

  const handleSave = () => {
    if (!form.name || !form.url) return;
    if (editingId) {
      updatePlatform({ ...form, id: editingId });
      setEditingId(null);
    } else {
      addPlatform(form);
    }
    setForm({ name: '', url: '', icon: '' });
    setShowForm(false);
  };

  const handleEdit = (platform: MusicPlatform) => {
    setForm({ name: platform.name, url: platform.url, icon: platform.icon });
    setEditingId(platform.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ name: '', url: '', icon: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Music className="w-5 h-5 text-blue-400" />
          Музыкальные площадки
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-blue-500/30 space-y-3">
          <input
            type="text"
            placeholder="Название площадки (напр. Spotify)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="url"
            placeholder="URL ссылки"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm transition-colors">
              <Check className="w-4 h-4" /> Сохранить
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors">
              <X className="w-4 h-4" /> Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {platforms.map(platform => (
          <div key={platform.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{platform.name}</p>
              <p className="text-xs text-gray-400 truncate">{platform.url}</p>
            </div>
            <button onClick={() => handleEdit(platform)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={() => deletePlatform(platform.id)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {platforms.length === 0 && <p className="text-gray-500 text-center py-4">Нет площадок. Добавьте первую!</p>}
      </div>
    </div>
  );
}

// Release Section
function ReleaseSection({ release, setRelease }: {
  release: UpcomingRelease | null;
  setRelease: (release: UpcomingRelease | null) => void;
}) {
  const [form, setForm] = useState<UpcomingRelease>(
    release || { id: '1', title: '', date: '', description: '', preSaveUrl: '' }
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (release) setForm(release);
  }, [release]);

  const handleSave = () => {
    if (!form.title) return;
    setRelease({ ...form, id: form.id || Date.now().toString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    setRelease(null);
    setForm({ id: '1', title: '', date: '', description: '', preSaveUrl: '' });
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-400" />
        Ближайший релиз
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Название релиза</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Напр. Новый Сингл «Рассвет»"
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Дата релиза</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Описание</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Описание релиза..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ссылка на предзаказ (Pre-save)</label>
          <input
            type="url"
            value={form.preSaveUrl || ''}
            onChange={e => setForm({ ...form, preSaveUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-500 hover:to-blue-400 transition-all"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Сохранено!' : 'Сохранить'}
          </button>
          {release && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// News Section
function NewsSection({ news, addNews, updateNews, deleteNews }: {
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0] });

  const handleSave = () => {
    if (!form.title || !form.content) return;
    if (editingId) {
      updateNews({ ...form, id: editingId });
      setEditingId(null);
    } else {
      addNews(form);
    }
    setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const handleEdit = (item: NewsItem) => {
    setForm({ title: item.title, content: item.content, date: item.date });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0] });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-400" />
            Новости
          </h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Добавить
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-blue-500/30 space-y-3">
            <input
              type="text"
              placeholder="Заголовок новости"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Текст новости..."
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm transition-colors">
                <Check className="w-4 h-4" /> {editingId ? 'Обновить' : 'Опубликовать'}
              </button>
              <button onClick={handleCancel} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors">
                <X className="w-4 h-4" /> Отмена
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {news.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-gray-800/30 border border-gray-800">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(item.date).toLocaleDateString('ru-RU')}</p>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">{item.content}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteNews(item.id)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {news.length === 0 && <p className="text-gray-500 text-center py-4">Нет новостей. Добавьте первую!</p>}
        </div>
      </div>
    </div>
  );
}
