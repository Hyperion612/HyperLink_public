import { supabase, isSupabaseConfigured } from './supabase';
import * as localStore from '../store';

/**
 * Синхронизация всех данных из localStorage в Supabase
 */
export async function syncToSupabase(): Promise<{
  success: boolean;
  usersSynced: number;
  linksSynced: number;
  clicksSynced: number;
  viewsSynced: number;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      usersSynced: 0,
      linksSynced: 0,
      clicksSynced: 0,
      viewsSynced: 0,
      error: 'Supabase не настроен',
    };
  }

  try {
    // Синхронизация пользователей
    const users = localStore.getUsers();
    let usersSynced = 0;
    
    for (const user of users) {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatarUrl,
          plan: user.plan,
          created_at: user.createdAt,
        });
      
      if (!error) usersSynced++;
    }

    // Синхронизация ссылок
    const links = localStore.getLinks();
    let linksSynced = 0;
    
    for (const link of links) {
      // Сначала создаём ссылку
      const { error: linkError } = await supabase
        .from('links')
        .upsert({
          id: link.id,
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
          created_at: link.createdAt,
        });
      
      if (!linkError) {
        linksSynced++;
        
        // Синхронизация сервисов
        for (const service of link.services) {
          await supabase
            .from('link_services')
            .upsert({
              id: service.id,
              link_id: link.id,
              service_name: service.serviceName,
              url: service.url,
              position: service.position,
            });
        }
      }
    }

    // Синхронизация кликов
    const clicks = localStore.getClicks();
    let clicksSynced = 0;
    
    for (const click of clicks) {
      const { error } = await supabase
        .from('clicks')
        .upsert({
          id: click.id,
          link_id: click.linkId,
          service_name: click.serviceName,
          country: click.country,
          city: click.city,
          device: click.device,
          utm_source: click.utmSource,
          created_at: click.createdAt,
        });
      
      if (!error) clicksSynced++;
    }

    // Синхронизация просмотров
    const views = localStore.getViews();
    let viewsSynced = 0;
    
    for (const view of views) {
      const { error } = await supabase
        .from('page_views')
        .upsert({
          id: view.id,
          link_id: view.linkId,
          country: view.country,
          city: view.city,
          device: view.device,
          utm_source: view.utmSource,
          created_at: view.createdAt,
        });
      
      if (!error) viewsSynced++;
    }

    return {
      success: true,
      usersSynced,
      linksSynced,
      clicksSynced,
      viewsSynced,
    };
  } catch (error: any) {
    return {
      success: false,
      usersSynced: 0,
      linksSynced: 0,
      clicksSynced: 0,
      viewsSynced: 0,
      error: error.message || 'Ошибка синхронизации',
    };
  }
}

/**
 * Загрузка всех данных из Supabase в localStorage
 */
export async function syncFromSupabase(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Supabase не настроен',
    };
  }

  try {
    // Загрузка пользователей
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (!usersError && users) {
      const formattedUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatar_url || '',
        plan: u.plan,
        createdAt: u.created_at,
      }));
      localStore.saveUsers(formattedUsers);
    }

    // Загрузка ссылок с сервисами
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select(`
        *,
        link_services (*)
      `);
    
    if (!linksError && links) {
      const formattedLinks = links.map((link: any) => ({
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
      localStore.saveLinks(formattedLinks);
    }

    // Загрузка кликов
    const { data: clicks, error: clicksError } = await supabase
      .from('clicks')
      .select('*');
    
    if (!clicksError && clicks) {
      const formattedClicks = clicks.map((c: any) => ({
        id: c.id,
        linkId: c.link_id,
        serviceName: c.service_name,
        country: c.country || '',
        city: c.city || '',
        device: c.device || '',
        utmSource: c.utm_source || '',
        createdAt: c.created_at,
      }));
      localStorage.setItem('hl_clicks', JSON.stringify(formattedClicks));
    }

    // Загрузка просмотров
    const { data: views, error: viewsError } = await supabase
      .from('page_views')
      .select('*');
    
    if (!viewsError && views) {
      const formattedViews = views.map((v: any) => ({
        id: v.id,
        linkId: v.link_id,
        country: v.country || '',
        city: v.city || '',
        device: v.device || '',
        utmSource: v.utm_source || '',
        createdAt: v.created_at,
      }));
      localStorage.setItem('hl_views', JSON.stringify(formattedViews));
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Ошибка загрузки данных',
    };
  }
}
