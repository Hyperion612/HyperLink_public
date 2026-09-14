import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Check, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { syncToSupabase } from '../lib/sync';

export default function ConnectPage() {
  const navigate = useNavigate();
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setStatus('error');
      setErrorMessage('Заполните все поля');
      return;
    }

    setTesting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // Создаём тестовый клиент
      const testClient = createClient(supabaseUrl, supabaseKey);
      
      // Проверяем подключение
      const { error } = await testClient.from('users').select('count', { count: 'exact', head: true });
      
      if (error) {
        throw error;
      }

      // Сохраняем конфигурацию в localStorage
      localStorage.setItem('supabase_url', supabaseUrl);
      localStorage.setItem('supabase_key', supabaseKey);
      localStorage.setItem('supabase_configured', 'true');

      // Синхронизируем данные из localStorage в Supabase
      const syncResult = await syncToSupabase();
      
      if (syncResult.success) {
        setStatus('success');
        // Перенаправляем через 3 секунды
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('error');
        setErrorMessage(`Подключение успешно, но ошибка синхронизации: ${syncResult.error}`);
      }

    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Ошибка подключения к Supabase');
      console.error('Connection error:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Подключение к Supabase</h1>
            <p className="text-zinc-400 mt-1">Настройте облачную базу данных для вашего проекта</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-2">Что такое Supabase?</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Supabase — это облачная база данных PostgreSQL с аутентификацией и хранилищем файлов. 
                После подключения все ваши данные (ссылки, обложки, аналитика) будут синхронизироваться 
                с облаком и доступны с любого устройства.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2 font-medium">
              Supabase URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={e => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={testing}
            />
            <p className="text-xs text-zinc-500 mt-1.5">
              Найдите в Supabase Dashboard → Settings → API → Project URL
            </p>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2 font-medium">
              Supabase Anon Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={e => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
              disabled={testing}
            />
            <p className="text-xs text-zinc-500 mt-1.5">
              Найдите в Supabase Dashboard → Settings → API → anon public key
            </p>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-300">Подключение успешно!</p>
                <p className="text-sm text-green-400/80 mt-0.5">Перенаправление на дашборд...</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-300">Ошибка подключения</p>
                <p className="text-sm text-red-400/80 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleTestConnection}
            disabled={testing || !supabaseUrl || !supabaseKey}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Проверка подключения...
              </>
            ) : (
              <>
                <Database className="w-5 h-5" />
                Подключить Supabase
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h3 className="font-semibold text-white mb-4">Инструкция по настройке</h3>
          <ol className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
              <span>Создайте проект на <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">supabase.com</a></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
              <span>Выполните SQL схему из файла <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">supabase/schema.sql</code> в SQL Editor</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>Создайте бакет <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">covers</code> в Storage (публичный)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">4</span>
              <span>Скопируйте URL и Anon Key из Settings → API</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">5</span>
              <span>Вставьте их в поля выше и нажмите "Подключить"</span>
            </li>
          </ol>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-amber-600/10 border border-amber-600/20 rounded-lg">
          <p className="text-sm text-amber-300">
            <strong>Важно:</strong> Убедитесь, что вы выполнили SQL схему и создали бакет для обложек перед подключением.
          </p>
        </div>
      </div>
    </div>
  );
}
