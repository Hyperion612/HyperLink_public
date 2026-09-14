import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STREAMING_SERVICES } from '../types';
import { SmartLink } from '../types';
import Sidebar from '../components/Sidebar';
import { Save, ArrowLeft, Eye, Timer, Video, Music2, Palette, Type, Share2, Crown, Upload, X, Image as ImageIcon } from 'lucide-react';
import { handleCoverUpload, validateCoverFile } from '../lib/upload';
import { isSupabaseConfigured } from '../lib/supabase';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, links, createNewLink, saveLink } = useApp();
  const isNew = id === 'new';
  const existingLink = !isNew ? links.find(l => l.id === id) : null;

  const [form, setForm] = useState<Partial<SmartLink>>({
    title: '',
    artistName: '',
    coverUrl: '',
    backgroundUrl: '',
    buttonColor: '#3B82F6',
    textColor: '#FFFFFF',
    font: 'Inter',
    customDomain: '',
    countdownDate: '',
    youtubeUrl: '',
    audioPreviewUrl: '',
    presaveEnabled: false,
    presaveSpotifyUrl: '',
    presaveAppleUrl: '',
    fbPixelId: '',
    vkPixelId: '',
    services: [],
  });

  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'services' | 'design' | 'widgets' | 'presave' | 'pro'>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (existingLink) {
      setForm(existingLink);
    }
  }, [user, existingLink, navigate]);

  if (!user) return null;

  const updateService = (serviceName: string, url: string) => {
    const services = form.services || [];
    const existing = services.find(s => s.serviceName === serviceName);
    
    if (existing) {
      setForm({ 
        ...form, 
        services: services.map(s => s.serviceName === serviceName ? { ...s, url } : s) 
      });
    } else if (url) {
      setForm({ 
        ...form, 
        services: [...services, { 
          id: Date.now().toString() + serviceName, 
          serviceName, 
          url, 
          position: services.length 
        }] 
      });
    }
  };

  const getServiceUrl = (serviceName: string) => {
    return (form.services || []).find(s => s.serviceName === serviceName)?.url || '';
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // Валидация
    const validation = validateCoverFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Ошибка загрузки');
      return;
    }

    setUploading(true);

    try {
      const linkId = existingLink?.id || 'temp-' + Date.now();
      const coverUrl = await handleCoverUpload(file, user.id, linkId);
      setForm({ ...form, coverUrl });
    } catch (error) {
      setUploadError('Ошибка при загрузке файла');
      console.error(error);
    } finally {
      setUploading(false);
      // Сбрасываем input, чтобы можно было загрузить тот же файл снова
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeCover = () => {
    setForm({ ...form, coverUrl: '' });
  };

  const handleSave = () => {
    if (!form.title) {
      alert('Введите название');
      return;
    }
    
    if (isNew) {
      const link = createNewLink(form);
      navigate('/dashboard/editor/' + link.id);
    } else if (existingLink) {
      saveLink({ ...existingLink, ...form } as SmartLink);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'basic' as const, label: 'Основное', icon: Type },
    { id: 'services' as const, label: 'Стриминги', icon: Music2 },
    { id: 'design' as const, label: 'Внешний вид', icon: Palette },
    { id: 'widgets' as const, label: 'Виджеты', icon: Timer },
    { id: 'presave' as const, label: 'Pre-save', icon: Share2 },
    { id: 'pro' as const, label: 'Pro', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{isNew ? 'Новая ссылка' : 'Редактирование'}</h1>
                {!isNew && existingLink && (
                  <p className="text-sm text-zinc-400 mt-0.5">hyperlink.app/r/{existingLink.slug}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isNew && existingLink && (
                <button 
                  onClick={() => navigate('/r/' + existingLink.slug)} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" /> Предпросмотр
                </button>
              )}
              <button 
                onClick={handleSave} 
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" /> {saved ? 'Сохранено!' : 'Сохранить'}
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Tabs */}
            <div className="w-56 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                {activeTab === 'basic' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1.5">Название</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="Например: Мой новый сингл"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1.5">Имя артиста</label>
                      <input
                        type="text"
                        value={form.artistName}
                        onChange={e => setForm({ ...form, artistName: e.target.value })}
                        placeholder="Ваше имя"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Обложка трека/альбома */}
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1.5">
                        Обложка трека / альбома
                      </label>
                      <div className="flex items-start gap-4">
                        {/* Превью обложки */}
                        <div className="w-32 h-32 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {form.coverUrl ? (
                            <img 
                              src={form.coverUrl} 
                              alt="Обложка" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-zinc-600" />
                          )}
                        </div>

                        {/* Кнопки управления */}
                        <div className="flex-1 space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleCoverFileChange}
                            className="hidden"
                            id="cover-upload"
                          />
                          <label
                            htmlFor="cover-upload"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            {uploading ? 'Загрузка...' : 'Загрузить обложку'}
                          </label>
                          {form.coverUrl && (
                            <button
                              type="button"
                              onClick={removeCover}
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Удалить обложку
                            </button>
                          )}
                          <p className="text-xs text-zinc-500 mt-2">
                            JPG, PNG или WebP. Макс. 5MB.
                          </p>
                          {!isSupabaseConfigured && (
                            <p className="text-xs text-amber-500 mt-1">
                              ⚠️ Supabase не настроен. Изображение будет сохранено в base64 (локально).
                            </p>
                          )}
                        </div>
                      </div>
                      {uploadError && (
                        <p className="text-sm text-red-400 mt-2">{uploadError}</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-400 mb-4">Добавьте ссылки на ваши релизы в стриминговых сервисах</p>
                    {STREAMING_SERVICES.map(service => (
                      <div key={service.name} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: service.color + '20' }}>
                          {service.icon}
                        </div>
                        <input
                          type="url"
                          value={getServiceUrl(service.name)}
                          onChange={e => updateService(service.name, e.target.value)}
                          placeholder={`Ссылка на ${service.name}`}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1.5">URL фона</label>
                      <input
                        type="url"
                        value={form.backgroundUrl}
                        onChange={e => setForm({ ...form, backgroundUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Цвет кнопок</label>
                        <input
                          type="color"
                          value={form.buttonColor}
                          onChange={e => setForm({ ...form, buttonColor: e.target.value })}
                          className="w-full h-12 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Цвет текста</label>
                        <input
                          type="color"
                          value={form.textColor}
                          onChange={e => setForm({ ...form, textColor: e.target.value })}
                          className="w-full h-12 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'widgets' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1.5">Дата релиза (для таймера)</label>
                      <input
                        type="datetime-local"
                        value={form.countdownDate}
                        onChange={e => setForm({ ...form, countdownDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1.5">YouTube видео</label>
                      <input
                        type="url"
                        value={form.youtubeUrl}
                        onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1.5">Аудио превью</label>
                      <input
                        type="url"
                        value={form.audioPreviewUrl}
                        onChange={e => setForm({ ...form, audioPreviewUrl: e.target.value })}
                        placeholder="https://example.com/audio.mp3"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'presave' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="presave"
                        checked={form.presaveEnabled}
                        onChange={e => setForm({ ...form, presaveEnabled: e.target.checked })}
                        className="w-5 h-5 rounded bg-zinc-800 border-zinc-700"
                      />
                      <label htmlFor="presave" className="text-sm font-medium">Включить Pre-save</label>
                    </div>
                    {form.presaveEnabled && (
                      <>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1.5">Spotify Pre-save URL</label>
                          <input
                            type="url"
                            value={form.presaveSpotifyUrl}
                            onChange={e => setForm({ ...form, presaveSpotifyUrl: e.target.value })}
                            placeholder="https://spotify.com/presave/..."
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1.5">Apple Music Pre-save URL</label>
                          <input
                            type="url"
                            value={form.presaveAppleUrl}
                            onChange={e => setForm({ ...form, presaveAppleUrl: e.target.value })}
                            placeholder="https://music.apple.com/presave/..."
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'pro' && (
                  <div className="space-y-4">
                    {user.plan !== 'pro' ? (
                      <div className="text-center py-8">
                        <Crown className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Pro функции</h3>
                        <p className="text-zinc-400 text-sm mb-4">Доступно только для Pro пользователей</p>
                        <button 
                          onClick={() => navigate('/pricing')} 
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                        >
                          Обновить план
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1.5">Кастомный домен</label>
                          <input
                            type="text"
                            value={form.customDomain}
                            onChange={e => setForm({ ...form, customDomain: e.target.value })}
                            placeholder="go.yourdomain.com"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1.5">Facebook Pixel ID</label>
                          <input
                            type="text"
                            value={form.fbPixelId}
                            onChange={e => setForm({ ...form, fbPixelId: e.target.value })}
                            placeholder="123456789"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1.5">VK Pixel ID</label>
                          <input
                            type="text"
                            value={form.vkPixelId}
                            onChange={e => setForm({ ...form, vkPixelId: e.target.value })}
                            placeholder="VK-12345"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
