import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, BarChart3, Globe, Zap, Music, Shield, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative">
        {/* Nav */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HyperLink</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/pricing')} 
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Тарифы
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Войти
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
            >
              Начать бесплатно
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-zinc-300">Умные ссылки для музыкантов нового поколения</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Одна ссылка.<br />
            <span className="gradient-text">Все площадки мира.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            HyperLink анализирует устройство и геолокацию слушателя, чтобы показать ему именно те стриминги, которые он использует. Больше конверсий — больше прослушиваний.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2"
            >
              Создать ссылку бесплатно <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/r/rassvet-single')} 
              className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-lg font-medium transition-colors"
            >
              Смотреть демо
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Всё, что нужно артисту</h2>
        <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
          Мощные инструменты для продвижения вашей музыки на всех платформах
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: 'Умный роутинг', desc: 'Автоматически определяет страну и устройство слушателя, показывая релевантные стриминги первым' },
            { icon: BarChart3, title: 'Детальная аналитика', desc: 'Отслеживайте клики, просмотры, конверсии по каждой платформе, стране и источнику' },
            { icon: Zap, title: 'Pre-save кампании', desc: 'Собирайте предзаказы на Spotify и Apple Music прямо с вашей страницы' },
            { icon: Music, title: 'Все площадки', desc: 'Spotify, Apple Music, YouTube Music, VK, Яндекс, Zvuk, Deezer, Tidal, SoundCloud, Boom' },
            { icon: Shield, title: 'Кастомный домен', desc: 'Используйте свой домен (go.artist.com) для профессионального вида' },
            { icon: Sparkles, title: 'Ретаргетинг', desc: 'Интеграция с Facebook Pixel и VK Pixel для рекламных кампаний' },
          ].map((f, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Простые тарифы</h2>
        <p className="text-zinc-400 text-center mb-16">Начните бесплатно. Обновите когда будете готовы.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-3xl font-black mb-6">
              $0<span className="text-lg text-zinc-400 font-normal">/мес</span>
            </p>
            <ul className="space-y-3 mb-8">
              {['До 5 активных ссылок', 'Базовая аналитика', 'Все стриминги', 'Бейдж HyperLink'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-blue-400" />{f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/login')} 
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
            >
              Начать
            </button>
          </div>
          <div className="bg-zinc-900 rounded-xl p-8 border border-blue-600/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">Pro</h3>
              <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold">PRO</span>
            </div>
            <p className="text-3xl font-black mb-6">
              $9<span className="text-lg text-zinc-400 font-normal">/мес</span>
            </p>
            <ul className="space-y-3 mb-8">
              {['Безлимит ссылок', 'Расширенная аналитика', 'Без бейджа', 'Кастомный домен', 'Ретаргетинг пиксели', 'Pre-save кампании'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-blue-400" />{f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/login')} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              Выбрать Pro
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">HyperLink</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 HyperLink. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
