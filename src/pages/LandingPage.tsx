import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, BarChart3, Globe, Zap, Music, Shield, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/8 rounded-full blur-[150px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Nav */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HyperLink</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/pricing')} className="text-sm text-gray-400 hover:text-white transition-colors">Тарифы</button>
            <button onClick={() => navigate('/login')} className="text-sm text-gray-300 hover:text-white transition-colors">Войти</button>
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25">
              Начать бесплатно
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Умные ссылки для музыкантов нового поколения</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Одна ссылка.<br />
            <span className="gradient-text">Все площадки мира.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            HyperLink анализирует устройство и геолокацию слушателя, чтобы показать ему именно те стриминги, которые он использует. Больше конверсий — больше прослушиваний.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-lg font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2">
              Создать ссылку бесплатно <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/r/rassvet-single')} className="px-8 py-4 glass rounded-full text-lg font-medium hover:bg-white/5 transition-all">
              Смотреть демо
            </button>
          </div>

          {/* Preview mockup */}
          <div className="mt-20 relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative glass-strong rounded-2xl p-6 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 flex items-center justify-center text-2xl font-bold">D</div>
              <h3 className="text-lg font-bold text-center mb-1">Demo Artist</h3>
              <p className="text-sm text-gray-400 text-center mb-6">Рассвет — новый сингл</p>
              <div className="space-y-2">
                {['Spotify', 'Apple Music', 'VK Музыка', 'Яндекс Музыка'].map((s, i) => (
                  <div key={s} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                    <span className="text-lg">{['🎧', '🍎', '🎵', '🎶'][i]}</span>
                    <span className="text-sm font-medium flex-1">{s}</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Всё, что нужно артисту</h2>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">Мощные инструменты для продвижения вашей музыки на всех платформах</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: 'Умный роутинг', desc: 'Автоматически определяет страну и устройство слушателя, показывая релевантные стриминги первым' },
            { icon: BarChart3, title: 'Детальная аналитика', desc: 'Отслеживайте клики, просмотры, конверсии по каждой платформе, стране и источнику' },
            { icon: Zap, title: 'Pre-save кампании', desc: 'Собирайте предзаказы на Spotify и Apple Music прямо с вашей страницы' },
            { icon: Music, title: 'Все площадки', desc: 'Spotify, Apple Music, YouTube Music, VK, Яндекс, Zvuk, Deezer, Tidal, SoundCloud, Boom' },
            { icon: Shield, title: 'Кастомный домен', desc: 'Используйте свой домен (go.artist.com) для профессионального вида' },
            { icon: Sparkles, title: 'Ретаргетинг', desc: 'Интеграция с Facebook Pixel и VK Pixel для рекламных кампаний' },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                <f.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Простые тарифы</h2>
        <p className="text-gray-400 text-center mb-16">Начните бесплатно. Обновите когда будете готовы.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-3xl font-black mb-6">$0<span className="text-lg text-gray-400 font-normal">/мес</span></p>
            <ul className="space-y-3 mb-8">
              {['До 5 активных ссылок', 'Базовая аналитика', 'Все стриминги', 'Бейдж HyperLink'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-blue-400" />{f}</li>
              ))}
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-3 rounded-xl glass hover:bg-white/5 font-medium transition-all">Начать</button>
          </div>
          <div className="relative rounded-2xl p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-blue-600 rounded-full text-xs font-bold">PRO</div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-3xl font-black mb-6">$9<span className="text-lg text-gray-400 font-normal">/мес</span></p>
            <ul className="space-y-3 mb-8">
              {['Безлимит ссылок', 'Расширенная аналитика', 'Без бейджа', 'Кастомный домен', 'Ретаргетинг пиксели', 'Pre-save кампании'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-blue-400" />{f}</li>
              ))}
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium transition-all">Выбрать Pro</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">HyperLink</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 HyperLink. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
