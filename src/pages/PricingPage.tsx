import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateUser } from '../store';
import { Check, ArrowLeft, Crown, Link2 } from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useApp();

  const handleSelect = (plan: 'free' | 'pro') => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (plan === 'pro') {
      updateUser({ ...user, plan: 'pro' });
      alert('Pro план активирован! (демо)');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/')} 
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Тарифы</h1>
            <p className="text-zinc-400 mt-1">Выберите план, который подходит именно вам</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold">Free</h2>
              </div>
              <p className="text-4xl font-black">
                $0<span className="text-lg text-zinc-400 font-normal">/мес</span>
              </p>
              <p className="text-sm text-zinc-400 mt-2">Для начинающих артистов</p>
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
                    <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-zinc-600 text-xs">✕</span>
                    </div>
                  )}
                  <span className={`text-sm ${f.included ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelect('free')} 
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
            >
              {user?.plan === 'free' ? 'Текущий план' : 'Начать бесплатно'}
            </button>
          </div>

          {/* Pro */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-blue-600/30">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold">Pro</h2>
                </div>
                <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold">PRO</span>
              </div>
              <p className="text-4xl font-black">
                $9<span className="text-lg text-zinc-400 font-normal">/мес</span>
              </p>
              <p className="text-sm text-zinc-400 mt-2">Для профессиональных артистов</p>
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
                  <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-sm text-zinc-300">{f.text}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelect('pro')} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              {user?.plan === 'pro' ? 'Текущий план' : 'Выбрать Pro'}
            </button>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Сравнение функций</h2>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm text-zinc-400 font-medium">Функция</th>
                  <th className="p-4 text-sm text-zinc-400 font-medium">Free</th>
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
                  <tr key={i} className="border-b border-zinc-800 last:border-0">
                    <td className="p-4 text-sm text-zinc-300">{feature}</td>
                    <td className="p-4 text-sm text-center text-zinc-400">{free}</td>
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
