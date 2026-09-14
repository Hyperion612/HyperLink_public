import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Получаем конфигурацию из localStorage
const supabaseUrl = typeof window !== 'undefined' 
  ? localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''
  : '';

const supabaseAnonKey = typeof window !== 'undefined'
  ? localStorage.getItem('supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  : '';

// Проверка наличия конфигурации
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

// Создание клиента Supabase
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Функция для получения статуса конфигурации
export function getSupabaseStatus() {
  return {
    configured: isSupabaseConfigured,
    url: supabaseUrl,
    hasKey: Boolean(supabaseAnonKey),
  };
}

// Функция для сброса конфигурации
export function resetSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_key');
    localStorage.removeItem('supabase_configured');
  }
}

// Экспорт для использования в компонентах
export { supabaseUrl, supabaseAnonKey };
