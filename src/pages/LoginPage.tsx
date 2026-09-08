import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Link2, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      if (!name || !email || !password) { setError('Заполните все поля'); return; }
      try {
        register(email, password, name);
        navigate('/dashboard');
      } catch { setError('Ошибка регистрации'); }
    } else {
      const success = login(email, password);
      if (success) navigate('/dashboard');
      else setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">HyperLink</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{isRegister ? 'Создать аккаунт' : 'Войти в аккаунт'}</h1>
          <p className="text-gray-400 text-sm">
            {isRegister ? 'Начните создавать умные ссылки' : 'Демо: demo@hyperlink.app / demo'}
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Имя артиста"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2">
              {isRegister ? 'Создать аккаунт' : 'Войти'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
