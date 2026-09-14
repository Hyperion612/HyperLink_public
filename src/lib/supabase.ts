import { createClient } from '@supabase/supabase-js';

// Supabase конфигурация
// Замените эти значения на свои из Settings -> API в Supabase Dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Проверка наличия конфигурации
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Создание клиента Supabase
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Экспорт для использования в компонентах
export { supabaseUrl, supabaseAnonKey };
