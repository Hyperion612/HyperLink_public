-- HyperLink Database Schema for Supabase
-- Выполните этот SQL в Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- ============================================
-- ТАБЛИЦЫ
-- ============================================

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица ссылок
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  cover_url TEXT,
  background_url TEXT,
  button_color TEXT DEFAULT '#3B82F6',
  text_color TEXT DEFAULT '#FFFFFF',
  font TEXT DEFAULT 'Inter',
  custom_domain TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  countdown_date TIMESTAMP WITH TIME ZONE,
  youtube_url TEXT,
  audio_preview_url TEXT,
  presave_enabled BOOLEAN DEFAULT false,
  presave_spotify_url TEXT,
  presave_apple_url TEXT,
  fb_pixel_id TEXT,
  vk_pixel_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица сервисов (стриминговых платформ)
CREATE TABLE IF NOT EXISTS public.link_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица кликов
CREATE TABLE IF NOT EXISTS public.clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  country TEXT,
  city TEXT,
  device TEXT,
  utm_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица просмотров
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  country TEXT,
  city TEXT,
  device TEXT,
  utm_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ИНДЕКСЫ для производительности
-- ============================================

CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_slug ON public.links(slug);
CREATE INDEX IF NOT EXISTS idx_link_services_link_id ON public.link_services(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON public.clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON public.clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_link_id ON public.page_views(link_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);

-- ============================================
-- RLS (Row Level Security) ПОЛИТИКИ
-- ============================================

-- Включаем RLS для всех таблиц
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои данные
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Ссылки: пользователи видят только свои, публичные ссылки видны всем
CREATE POLICY "Users can view own links" ON public.links
  FOR SELECT USING (
    auth.uid()::text = user_id::text 
    OR is_active = true
  );

CREATE POLICY "Users can insert own links" ON public.links
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own links" ON public.links
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own links" ON public.links
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Сервисы ссылок: видны если видна родительская ссылка
CREATE POLICY "Services visible if link is visible" ON public.link_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.links 
      WHERE links.id = link_services.link_id 
      AND (links.user_id::text = auth.uid()::text OR links.is_active = true)
    )
  );

CREATE POLICY "Users can manage own link services" ON public.link_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.links 
      WHERE links.id = link_services.link_id 
      AND links.user_id::text = auth.uid()::text
    )
  );

-- Клики и просмотры: публичные для чтения, вставка для всех
CREATE POLICY "Clicks are publicly readable" ON public.clicks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert clicks" ON public.clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Page views are publicly readable" ON public.page_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- ============================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- ============================================

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Триггеры для links
CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET для обложек
-- ============================================

-- Создание бакета для обложек (выполняется автоматически через Storage UI)
-- Или через SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Политика для загрузки обложек
CREATE POLICY "Authenticated users can upload covers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'covers' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Users can update own covers" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'covers' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own covers" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'covers' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- ГОТОВО!
-- ============================================
-- После выполнения этого SQL:
-- 1. Создайте пользователя в Authentication -> Users
-- 2. Скопируйте его UUID
-- 3. Вставьте его в таблицу users вручную или через функцию регистрации
-- 4. Настройте переменные окружения в .env файле
