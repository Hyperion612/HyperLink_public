import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateUser } from '../store';
import Sidebar from '../components/Sidebar';
import { Save, Crown } from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name);
    setEmail(user.email);
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = () => {
    updateUser({ ...user, name, email });
    refreshUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Настройки профиля</h1>

          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-zinc-400">{user.email}</p>
                {user.plan === 'pro' && (
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400 font-medium">Pro план</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Имя артиста</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Тариф</label>
                <div className="flex items-center gap-3">
                  <span 
                    className="px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{ 
                      background: user.plan === 'pro' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)',
                      color: user.plan === 'pro' ? '#60A5FA' : '#9CA3AF',
                      border: `1px solid ${user.plan === 'pro' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.1)'}`
                    }}
                  >
                    {user.plan === 'pro' ? 'Pro' : 'Free'}
                  </span>
                  {user.plan !== 'pro' && (
                    <button 
                      onClick={() => navigate('/pricing')} 
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Обновить →
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave} 
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" /> {saved ? 'Сохранено!' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
