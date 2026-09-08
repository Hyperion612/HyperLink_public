import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateUser } from '../store';
import { Check, ArrowLeft, Crown, Zap, Shield, Music, Globe, BarChart3, Link2 } from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useApp();

  const handleSelect = (plan: 'free' | 'pro') => {
    if (!user) { navigate('/login'); return; }
    if (plan === 'pro') {
      updateUser({ ...user, plan: 'pro' });
      alert('Pro план активирован! (демо)');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate(user ? '/dashboard' : '/')} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Тарифы</h1>
            <p className="text-gray-400 mt-1">Выберите план, который подходит именно вам</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="glass rounded-2xl p-8 relative">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold">Free</h2>
              </div>
              <p className="text-4xl font-black">$0<span className="text-lg text-gray-400 font-normal">/мес</span></p>
              <p className="text-sm text-gray-400 mt-2">Для начинающих артистов</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                { text: 'До 5 активных ссылок', included: true },
                { text: 'Базовая аналитика', included: true },
                { text: 'Все стриминговые площадки', included: true },
                { text: 'Бейдж "Создано в HyperLink"', included: true },
                { text: 'Кастомный домен', included: false },
                { text: 'Ретаргетинг пиксели', included: false },
                { text: 'Расширенная аналитика', included: false },
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  {f.included ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center"><Check className="w-3 h-3 text-blue-400" /></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center"><span className="text-gray-600 text-xs">✕</span></div>
                  )}
                  <span className={`text-sm ${f.included ? 'text-gray-300' : 'text-gray-600'}`}>{f.text}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleSelect('free')} className="w-full py-3 rounded-xl glass hover:bg-white/5 font-medium transition-all">
              {user?.plan === 'free' ? 'Текущий план' : 'Начать бесплатно'}
            </button>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 neon-glow">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-blue-600 rounded-full text-xs font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" /> PRO
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Pro</h2>
              </div>
              <p className="text-4xl font-black">$9<span className="text-lg text-gray-400 font-normal">/мес</span></p>
              <p className="text-sm text-gray-400 mt-2">Для профессиональных артистов</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                { text: 'Безлимит ссылок', included: true },
                { text: 'Расширенная аналитика', included: true },
                { text: 'Все стриминговые площадки', included: true },
                { text: 'Без бейджа HyperLink', included: true },
                { text: 'Кастомный домен', included: true },
                { text: 'Ретаргетинг пиксели (FB, VK)', included: true },
                { text: 'Pre-save кампании', included: true },
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center"><Check className="w-3 h-3 text-blue-400" /></div>
                  <span className="text-sm text-gray-300">{f.text}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleSelect('pro')} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25">
              {user?.plan === 'pro' ? 'Текущий план' : 'Выбрать Pro'}
            </button>
          </div>
        </div>

        {/* Features comparison */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Сравнение функций</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-sm text-gray-400 font-medium">Функция</th>
                  <th className="p-4 text-sm text-gray-400 font-medium">Free</th>
                  <th className="p-4 text-sm text-blue-400 font-medium">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Активные ссылки', '5', '∞'],
                  ['Просмотры/месяц', '1,000', '∞'],
                  ['Аналитика', 'Базовая', 'Расширенная'],
                  ['Кастомный домен', '—', '✓'],
                  ['Ретаргетинг', '—', '✓'],
                  ['Pre-save', '—', '✓'],
                  ['Приоритет поддержки', '—', '✓'],
                ].map(([feature, free, pro], i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-sm text-gray-300">{feature}</td>
                    <td className="p-4 text-sm text-center text-gray-400">{free}</td>
                    <td className="p-4 text-sm text-center text-blue-300 font-medium">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
