import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STREAMING_SERVICES } from '../types';
import { SmartLink, LinkService } from '../types';
import Sidebar from '../components/Sidebar';
import { Save, ArrowLeft, Eye, Plus, Trash2, Timer, Video, Music2, Globe, Palette, Type, Share2, Crown } from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, links, createNewLink, saveLink } = useApp();
  const isNew = id === 'new';

  const existingLink = !isNew ? links.find(l => l.id === id) : null;

  const [form, setForm] = useState<Partial<SmartLink>>({
    title: '', artistName: '', backgroundUrl: '', buttonColor: '#3B82F6',
    textColor: '#FFFFFF', font: 'Inter', customDomain: '', countdownDate: '',
    youtubeUrl: '', audioPreviewUrl: '', presaveEnabled: false,
    presaveSpotifyUrl: '', presaveAppleUrl: '', fbPixelId: '', vkPixelId: '',
    services: [],
  });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'services' | 'design' | 'widgets' | 'presave' | 'pro'>('basic');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (existingLink) setForm(existingLink);
  }, [user, existingLink]);

  if (!user) return null;

  const updateService = (serviceName: string, url: string) => {
    const services = form.services || [];
    const existing = services.find(s => s.serviceName === serviceName);
    if (existing) {
      setForm({ ...form, services: services.map(s => s.serviceName === serviceName ? { ...s, url } : s) });
    } else if (url) {
      setForm({ ...form, services: [...services, { id: Date.now().toString() + serviceName, serviceName, url, position: services.length }] });
    }
  };

  const getServiceUrl = (serviceName: string) => {
    return (form.services || []).find(s => s.serviceName === serviceName)?.url || '';
  };

  const handleSave = () => {
    if (!form.title) return;
    if (isNew) {
      const link = createNewLink(form);
      navigate('/dashboard/editor/' + link.id);
    } else if (existingLink) {
      saveLink({ ...existingLink, ...form } as SmartLink);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'basic' as const, label: 'Основное', icon: Type },
    { id: 'services' as const, label: 'Стриминги', icon: Music2 },
    { id: 'design' as const, label: 'Внешний вид', icon: Palette },
    { id: 'widgets' as const, label: 'Виджеты', icon: Timer },
    { id: 'presave' as const, label: 'Pre-save', icon: Share2 },
    { id: 'pro' as const, label: 'Pro функции', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Sidebar active="editor" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{isNew ? 'Новая ссылка' : 'Редактирование'}</h1>
                {!isNew && existingLink && (
                  <p className="text-sm text-gray-400 mt-0.5">hyperlink.app/r/{existingLink.slug}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {!isNew && existingLink && (
                <button onClick={() => navigate('/r/' + existingLink.slug)} className="inline-flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm hover:bg-white/5 transition-colors whitespace-nowrap">
                  <Eye className="w-4 h-4 flex-shrink-0" /> Предпросмотр
                </button>
              )}
              <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-all whitespace-nowrap">
                <Save className="w-4 h-4 flex-shrink-0" /> {saved ? 'Сохранено!' : 'Сохранить'}
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sections Nav */}
            <div className="w-48 flex-shrink-0">
              <div className="space-y-1 sticky top-8">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === s.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <s.icon className="w-4 h-4" /> {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeSection === 'basic' && (
                <div className="glass rounded-2xl p-6 space-y-5">
                  <h2 className="text-lg font-semibold">Основная информация</h2>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Название трека / альбома / подкаста</label>
                    <input type="text" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="Напр. Рассвет" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Имя артиста</label>
                    <input type="text" value={form.artistName || ''} onChange={e => setForm({ ...form, artistName: e.target.value })}
                      placeholder="Напр. Demo Artist" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              )}

              {activeSection === 'services' && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Стриминговые площадки</h2>
                  <div className="space-y-3">
                    {STREAMING_SERVICES.map(service => (
                      <div key={service.name} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                        <span className="text-2xl w-10 text-center">{service.icon}</span>
                        <span className="w-36 text-sm font-medium">{service.name}</span>
                        <input
                          type="url"
                          value={getServiceUrl(service.name)}
                          onChange={e => updateService(service.name, e.target.value)}
                          placeholder={`https://${service.name.toLowerCase().replace(/\s/g, '')}.com/...`}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'design' && (
                <div className="glass rounded-2xl p-6 space-y-5">
                  <h2 className="text-lg font-semibold">Внешний вид</h2>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">URL фоновой картинки</label>
                    <input type="url" value={form.backgroundUrl || ''} onChange={e => setForm({ ...form, backgroundUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Цвет кнопок</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={form.buttonColor || '#3B82F6'} onChange={e => setForm({ ...form, buttonColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                        <input type="text" value={form.buttonColor || '#3B82F6'} onChange={e => setForm({ ...form, buttonColor: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Цвет текста</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={form.textColor || '#FFFFFF'} onChange={e => setForm({ ...form, textColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                        <input type="text" value={form.textColor || '#FFFFFF'} onChange={e => setForm({ ...form, textColor: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Шрифт</label>
                    <select value={form.font || 'Inter'} onChange={e => setForm({ ...form, font: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500">
                      <option value="Inter" style={{ background: '#1a1a2e' }}>Inter</option>
                      <option value="Arial" style={{ background: '#1a1a2e' }}>Arial</option>
                      <option value="Georgia" style={{ background: '#1a1a2e' }}>Georgia</option>
                      <option value="monospace" style={{ background: '#1a1a2e' }}>Monospace</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'widgets' && (
                <div className="glass rounded-2xl p-6 space-y-5">
                  <h2 className="text-lg font-semibold">Виджеты</h2>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <Timer className="w-4 h-4" /> Таймер обратного отсчёта
                    </label>
                    <input type="datetime-local" value={form.countdownDate || ''} onChange={e => setForm({ ...form, countdownDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <Video className="w-4 h-4" /> YouTube видео (URL)
                    </label>
                    <input type="url" value={form.youtubeUrl || ''} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <Music2 className="w-4 h-4" /> Аудио-превью (URL)
                    </label>
                    <input type="url" value={form.audioPreviewUrl || ''} onChange={e => setForm({ ...form, audioPreviewUrl: e.target.value })}
                      placeholder="https://example.com/preview.mp3" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              )}

              {activeSection === 'presave' && (
                <div className="glass rounded-2xl p-6 space-y-5">
                  <h2 className="text-lg font-semibold">Pre-save</h2>
                  <p className="text-sm text-gray-400">Настройте предзаказ вашего релиза на стриминговых платформах</p>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={form.presaveEnabled || false} onChange={e => setForm({ ...form, presaveEnabled: e.target.checked })}
                      className="w-5 h-5 rounded bg-white/5 border-white/20 text-blue-600 focus:ring-blue-500" />
                    <label className="text-sm font-medium">Включить Pre-save</label>
                  </div>
                  {form.presaveEnabled && (
                    <div className="space-y-4 pl-8">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Spotify Pre-save URL</label>
                        <input type="url" value={form.presaveSpotifyUrl || ''} onChange={e => setForm({ ...form, presaveSpotifyUrl: e.target.value })}
                          placeholder="https://spotify.com/presave/..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Apple Music Pre-save URL</label>
                        <input type="url" value={form.presaveAppleUrl || ''} onChange={e => setForm({ ...form, presaveAppleUrl: e.target.value })}
                          placeholder="https://music.apple.com/presave/..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'pro' && (
                <div className="space-y-4">
                  {user.plan !== 'pro' && (
                    <div className="glass rounded-2xl p-6 border border-blue-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold">Pro функции</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">Эти функции доступны только на тарифе Pro ($9/мес)</p>
                      <button onClick={() => navigate('/pricing')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-all">
                        Обновить до Pro
                      </button>
                    </div>
                  )}
                  <div className="glass rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /> Кастомный домен</h2>
                    <input type="text" value={form.customDomain || ''} onChange={e => setForm({ ...form, customDomain: e.target.value })}
                      placeholder="go.artist.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="glass rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold">Ретаргетинг пиксели</h2>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Facebook Pixel ID</label>
                      <input type="text" value={form.fbPixelId || ''} onChange={e => setForm({ ...form, fbPixelId: e.target.value })}
                        placeholder="123456789" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">VK Pixel ID</label>
                      <input type="text" value={form.vkPixelId || ''} onChange={e => setForm({ ...form, vkPixelId: e.target.value })}
                        placeholder="VK-RET-12345" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
