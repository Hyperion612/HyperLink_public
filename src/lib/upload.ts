import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Конвертация файла в base64 (для localStorage fallback)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Загрузка обложки в Supabase Storage
 * Возвращает публичный URL загруженного изображения
 */
export async function uploadCoverToSupabase(
  file: File,
  userId: string,
  linkId: string
): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase не настроен, используется base64');
    return null;
  }

  try {
    // Создаём уникальное имя файла
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${linkId}/${Date.now()}.${fileExt}`;

    // Загружаем файл в бакет 'covers'
    const { data, error } = await supabase.storage
      .from('covers')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Ошибка загрузки обложки:', error);
      return null;
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from('covers')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Ошибка загрузки обложки:', error);
    return null;
  }
}

/**
 * Удаление обложки из Supabase Storage
 */
export async function deleteCoverFromSupabase(
  coverUrl: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !coverUrl) {
    return false;
  }

  try {
    // Извлекаем путь из URL
    const urlParts = coverUrl.split('/covers/');
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('covers')
      .remove([filePath]);

    if (error) {
      console.error('Ошибка удаления обложки:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Ошибка удаления обложки:', error);
    return false;
  }
}

/**
 * Главная функция для обработки загрузки обложки
 * Автоматически выбирает между Supabase и base64
 */
export async function handleCoverUpload(
  file: File,
  userId: string,
  linkId: string
): Promise<string> {
  // Если Supabase настроен, загружаем туда
  if (isSupabaseConfigured) {
    const supabaseUrl = await uploadCoverToSupabase(file, userId, linkId);
    if (supabaseUrl) return supabaseUrl;
  }

  // Fallback: конвертируем в base64
  return await fileToBase64(file);
}

/**
 * Валидация файла обложки
 */
export function validateCoverFile(file: File): { valid: boolean; error?: string } {
  // Проверка типа
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Допустимые форматы: JPG, PNG, WebP',
    };
  }

  // Проверка размера (максимум 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Максимальный размер файла: 5MB',
    };
  }

  return { valid: true };
}
