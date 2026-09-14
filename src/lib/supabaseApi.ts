import { supabase, isSupabaseConfigured } from './supabase';
import { User, SmartLink, Click, PageView, LinkService } from '../types';

// ============================================
// ПОЛЬЗОВАТЕЛИ
// ============================================

export async function supabaseGetUser(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatarUrl: data.avatar_url || '',
    plan: data.plan,
    createdAt: data.created_at,
  };
}

export async function supabaseCreateUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: user.email,
      name: user.name,
      avatar_url: user.avatarUrl,
      plan: user.plan,
    })
    .select()
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatarUrl: data.avatar_url || '',
    plan: data.plan,
    createdAt: data.created_at,
  };
}

export async function supabaseUpdateUser(user: User): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  
  const { error } = await supabase
    .from('users')
    .update({
      name: user.name,
      email: user.email,
      avatar_url: user.avatarUrl,
      plan: user.plan,
    })
    .eq('id', user.id);
  
  return !error;
}

// ============================================
// ССЫЛКИ
// ============================================

export async function supabaseGetUserLinks(userId: string): Promise<SmartLink[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  
  const { data, error } = await supabase
    .from('links')
    .select(`
      *,
      link_services (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  
  return data.map((link: any) => ({
    id: link.id,
    userId: link.user_id,
    slug: link.slug,
    title: link.title,
    artistName: link.artist_name,
    coverUrl: link.cover_url || '',
    backgroundUrl: link.background_url || '',
    buttonColor: link.button_color,
    textColor: link.text_color,
    font: link.font,
    customDomain: link.custom_domain || '',
    isActive: link.is_active,
    expiresAt: link.expires_at || '',
    countdownDate: link.countdown_date || '',
    youtubeUrl: link.youtube_url || '',
    audioPreviewUrl: link.audio_preview_url || '',
    presaveEnabled: link.presave_enabled,
    presaveSpotifyUrl: link.presave_spotify_url || '',
    presaveAppleUrl: link.presave_apple_url || '',
    fbPixelId: link.fb_pixel_id || '',
    vkPixelId: link.vk_pixel_id || '',
    services: (link.link_services || []).map((s: any) => ({
      id: s.id,
      serviceName: s.service_name,
      url: s.url,
      position: s.position,
    })),
    createdAt: link.created_at,
  }));
}

export async function supabaseGetLinkBySlug(slug: string): Promise<SmartLink | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  
  const { data, error } = await supabase
    .from('links')
    .select(`
      *,
      link_services (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    userId: data.user_id,
    slug: data.slug,
    title: data.title,
    artistName: data.artist_name,
    coverUrl: data.cover_url || '',
    backgroundUrl: data.background_url || '',
    buttonColor: data.button_color,
    textColor: data.text_color,
    font: data.font,
    customDomain: data.custom_domain || '',
    isActive: data.is_active,
    expiresAt: data.expires_at || '',
    countdownDate: data.countdown_date || '',
    youtubeUrl: data.youtube_url || '',
    audioPreviewUrl: data.audio_preview_url || '',
    presaveEnabled: data.presave_enabled,
    presaveSpotifyUrl: data.presave_spotify_url || '',
    presaveAppleUrl: data.presave_apple_url || '',
    fbPixelId: data.fb_pixel_id || '',
    vkPixelId: data.vk_pixel_id || '',
    services: (data.link_services || []).map((s: any) => ({
      id: s.id,
      serviceName: s.service_name,
      url: s.url,
      position: s.position,
    })),
    createdAt: data.created_at,
  };
}

export async function supabaseCreateLink(link: Omit<SmartLink, 'id' | 'createdAt'>): Promise<SmartLink | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  
  const { data, error } = await supabase
    .from('links')
    .insert({
      user_id: link.userId,
      slug: link.slug,
      title: link.title,
      artist_name: link.artistName,
      cover_url: link.coverUrl,
      background_url: link.backgroundUrl,
      button_color: link.buttonColor,
      text_color: link.textColor,
      font: link.font,
      custom_domain: link.customDomain,
      is_active: link.isActive,
      expires_at: link.expiresAt || null,
      countdown_date: link.countdownDate || null,
      youtube_url: link.youtubeUrl,
      audio_preview_url: link.audioPreviewUrl,
      presave_enabled: link.presaveEnabled,
      presave_spotify_url: link.presaveSpotifyUrl,
      presave_apple_url: link.presaveAppleUrl,
      fb_pixel_id: link.fbPixelId,
      vk_pixel_id: link.vkPixelId,
    })
    .select()
    .single();
  
  if (error || !data) {
    console.error('Ошибка создания ссылки:', error);
    return null;
  }
  
  // Создаём сервисы
  if (link.services.length > 0) {
    const servicesToInsert = link.services.map(s => ({
      link_id: data.id,
      service_name: s.serviceName,
      url: s.url,
      position: s.position,
    }));
    
    await supabase.from('link_services').insert(servicesToInsert);
  }
  
  return {
    ...link,
    id: data.id,
    createdAt: data.created_at,
  };
}

export async function supabaseUpdateLink(link: SmartLink): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  
  // Обновляем ссылку
  const { error } = await supabase
    .from('links')
    .update({
      title: link.title,
      artist_name: link.artistName,
      cover_url: link.coverUrl,
      background_url: link.backgroundUrl,
      button_color: link.buttonColor,
      text_color: link.textColor,
      font: link.font,
      custom_domain: link.customDomain,
      is_active: link.isActive,
      expires_at: link.expiresAt || null,
      countdown_date: link.countdownDate || null,
      youtube_url: link.youtubeUrl,
      audio_preview_url: link.audioPreviewUrl,
      presave_enabled: link.presaveEnabled,
      presave_spotify_url: link.presaveSpotifyUrl,
      presave_apple_url: link.presaveAppleUrl,
      fb_pixel_id: link.fbPixelId,
      vk_pixel_id: link.vkPixelId,
    })
    .eq('id', link.id);
  
  if (error) return false;
  
  // Пересоздаём сервисы
  await supabase.from('link_services').delete().eq('link_id', link.id);
  
  if (link.services.length > 0) {
    const servicesToInsert = link.services.map(s => ({
      link_id: link.id,
      service_name: s.serviceName,
      url: s.url,
      position: s.position,
    }));
    
    await supabase.from('link_services').insert(servicesToInsert);
  }
  
  return true;
}

export async function supabaseDeleteLink(linkId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId);
  
  return !error;
}

// ============================================
// КЛИКИ И ПРОСМОТРЫ
// ============================================

export async function supabaseAddClick(click: Omit<Click, 'id' | 'createdAt'>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  
  const { error } = await supabase
    .from('clicks')
    .insert({
      link_id: click.linkId,
      service_name: click.serviceName,
      country: click.country,
      city: click.city,
      device: click.device,
      utm_source: click.utmSource,
    });
  
  return !error;
}

export async function supabaseAddView(view: Omit<PageView, 'id' | 'createdAt'>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  
  const { error } = await supabase
    .from('page_views')
    .insert({
      link_id: view.linkId,
      country: view.country,
      city: view.city,
      device: view.device,
      utm_source: view.utmSource,
    });
  
  return !error;
}

export async function supabaseGetLinkClicks(linkId: string): Promise<Click[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  
  const { data, error } = await supabase
    .from('clicks')
    .select('*')
    .eq('link_id', linkId)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  
  return data.map((c: any) => ({
    id: c.id,
    linkId: c.link_id,
    serviceName: c.service_name,
    country: c.country || '',
    city: c.city || '',
    device: c.device || '',
    utmSource: c.utm_source || '',
    createdAt: c.created_at,
  }));
}

export async function supabaseGetLinkViews(linkId: string): Promise<PageView[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  
  const { data, error } = await supabase
    .from('page_views')
    .select('*')
    .eq('link_id', linkId)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  
  return data.map((v: any) => ({
    id: v.id,
    linkId: v.link_id,
    country: v.country || '',
    city: v.city || '',
    device: v.device || '',
    utmSource: v.utm_source || '',
    createdAt: v.created_at,
  }));
}
