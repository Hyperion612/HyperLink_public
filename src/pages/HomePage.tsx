import React from 'react';
import { useData } from '../context/DataContext';
import { ExternalLink, Music, Calendar, Newspaper, Instagram, Youtube, Twitter, Send } from 'lucide-react';

function getPlatformIcon(platform: string) {
  const icons: Record<string, string> = {
    'Instagram': '📸',
    'YouTube': '▶️',
    'TikTok': '🎵',
    'Telegram': '✈️',
    'VK': '💬',
    'Twitter / X': '🐦',
    'Spotify': '🎧',
    'Apple Music': '🍎',
    'Яндекс Музыка': '🎶',
    'VK Музыка': '🎼',
    'SoundCloud': '☁️',
    'Deezer': '🎵',
  };
  return icons[platform] || '🔗';
}

function getPlatformGradient(platform: string) {
  const gradients: Record<string, string> = {
    'Instagram': 'from-purple-500 via-pink-500 to-orange-400',
    'YouTube': 'from-red-600 to-red-500',
    'TikTok': 'from-gray-900 via-gray-800 to-gray-700',
    'Telegram': 'from-blue-400 to-blue-600',
    'VK': 'from-blue-500 to-blue-700',
    'Twitter / X': 'from-gray-800 to-black',
    'Spotify': 'from-green-500 to-green-700',
    'Apple Music': 'from-pink-500 to-red-500',
    'Яндекс Музыка': 'from-yellow-400 to-yellow-600',
    'VK Музыка': 'from-blue-400 to-blue-600',
    'SoundCloud': 'from-orange-400 to-orange-600',
    'Deezer': 'from-purple-500 to-purple-700',
  };
  return gradients[platform] || 'from-gray-500 to-gray-700';
}

export default function HomePage() {
  const { data } = useData();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
        <div className="relative max-w-2xl mx-auto px-4 pt-16 pb-8 text-center">
          {/* Avatar */}
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold shadow-2xl shadow-purple-500/30 ring-4 ring-white/10">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt={data.artistName} className="w-full h-full rounded-full object-cover" />
            ) : (
              data.artistName.charAt(0).toUpperCase()
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            {data.artistName}
          </h1>
          <p className="text-gray-300 text-lg">{data.bio}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
        {/* Upcoming Release */}
        {data.upcomingRelease && (
          <section className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-purple-300">Ближайший релиз</h2>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{data.upcomingRelease.title}</h3>
                  <p className="text-purple-300 text-sm mb-2">📅 {formatDate(data.upcomingRelease.date)}</p>
                  <p className="text-gray-300 text-sm">{data.upcomingRelease.description}</p>
                  {data.upcomingRelease.preSaveUrl && (
                    <a
                      href={data.upcomingRelease.preSaveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Предзаказ <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Social Links */}
        {data.socialLinks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-500 rounded"></span>
              Социальные сети
            </h2>
            <div className="space-y-3">
              {data.socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${getPlatformGradient(link.platform)} shadow-lg hover:scale-[1.02] transition-all duration-200 hover:shadow-xl`}
                >
                  <span className="text-2xl">{getPlatformIcon(link.platform)}</span>
                  <span className="font-medium text-white flex-1">{link.platform}</span>
                  <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Music Platforms */}
        {data.musicPlatforms.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-green-500 rounded"></span>
              Слушать музыку
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.musicPlatforms.map(platform => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/60 backdrop-blur border border-gray-700/50 hover:border-purple-500/50 hover:bg-gray-700/60 transition-all duration-200"
                >
                  <span className="text-2xl">{getPlatformIcon(platform.name)}</span>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors text-center">{platform.name}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* News */}
        {data.news.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-yellow-500 rounded"></span>
              Новости
            </h2>
            <div className="space-y-4">
              {data.news.map(item => (
                <article key={item.id} className="bg-gray-800/60 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-yellow-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Newspaper className="w-4 h-4 text-yellow-400" />
                    <time className="text-xs text-gray-400">{formatDate(item.date)}</time>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.content}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Powered by <span className="text-purple-400 font-semibold">HyperLink</span>
          </p>
          <a href="#/admin" className="inline-block mt-2 text-xs text-gray-600 hover:text-purple-400 transition-colors">
            Панель управления
          </a>
        </footer>
      </div>
    </div>
  );
}
