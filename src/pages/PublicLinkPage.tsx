import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLinkBySlug, addClick, addView } from '../store';
import { SmartLink, STREAMING_SERVICES, COUNTRIES, CITIES, DEVICES } from '../types';
import { ExternalLink, Music, Link2, Timer } from 'lucide-react';

function detectDevice(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad/.test(ua)) return 'iPhone';
  if (/Android/.test(ua)) return 'Android';
  if (/Mac/.test(ua)) return 'Mac';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Linux/.test(ua)) return 'Linux';
  return DEVICES[Math.floor(Math.random() * DEVICES.length)];
}

function getCountry(): string {
  return COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
}

function getCity(country: string): string {
  const cities = CITIES[country] || ['Unknown'];
  return cities[Math.floor(Math.random() * cities.length)];
}

function getUtmSource(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || ['direct', 'instagram', 'telegram', 'twitter'][Math.floor(Math.random() * 4)];
}

function sortServicesByRegion(services: SmartLink['services'], country: string, device: string) {
  const sorted = [...services];
  sorted.sort((a, b) => {
    const svcA = STREAMING_SERVICES.find(s => s.name === a.serviceName);
    const svcB = STREAMING_SERVICES.find(s => s.name === b.serviceName);
    let scoreA = 0, scoreB = 0;
    if (svcA?.regions.includes(country)) scoreA += 10;
    if (svcB?.regions.includes(country)) scoreB += 10;
    // Device preference
    if (device === 'iPhone' || device === 'Mac') {
      if (a.serviceName === 'Apple Music') scoreA += 5;
      if (b.serviceName === 'Apple Music') scoreB += 5;
    }
    if (device === 'Android') {
      if (a.serviceName === 'YouTube Music') scoreA += 5;
      if (b.serviceName === 'YouTube Music') scoreB += 5;
    }
    // RU region preference
    if (country === 'RU' || country === 'BY' || country === 'KZ') {
      if (a.serviceName === 'VK Музыка' || a.serviceName === 'Яндекс Музыка') scoreA += 8;
      if (b.serviceName === 'VK Музыка' || b.serviceName === 'Яндекс Музыка') scoreB += 8;
    }
    return scoreB - scoreA;
  });
  return sorted;
}

function getServiceIcon(name: string) {
  return STREAMING_SERVICES.find(s => s.name === name)?.icon || '🎵';
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3 justify-center">
      {[
        { val: timeLeft.days, label: 'дней' },
        { val: timeLeft.hours, label: 'часов' },
        { val: timeLeft.minutes, label: 'минут' },
        { val: timeLeft.seconds, label: 'секунд' },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl font-bold">
            {String(item.val).padStart(2, '0')}
          </div>
          <p className="text-xs text-gray-400 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function PublicLinkPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState<SmartLink | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [country, setCountry] = useState('');
  const [device, setDevice] = useState('');

  useEffect(() => {
    if (!slug) { setNotFound(true); return; }
    const found = getLinkBySlug(slug);
    if (!found || !found.isActive) { setNotFound(true); return; }
    setLink(found);

    const detectedCountry = getCountry();
    const detectedDevice = detectDevice();
    const detectedCity = getCity(detectedCountry);
    const utm = getUtmSource();
    setCountry(detectedCountry);
    setDevice(detectedDevice);

    // Track view
    addView({ linkId: found.id, country: detectedCountry, city: detectedCity, device: detectedDevice, utmSource: utm });
  }, [slug]);

  const handleServiceClick = (serviceName: string, url: string) => {
    if (!link) return;
    addClick({ linkId: link.id, serviceName, country, city: getCity(country), device, utmSource: getUtmSource() });
    window.open(url, '_blank');
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Link2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ссылка не найдена</h1>
          <p className="text-gray-400 mb-6">Возможно, она была удалена или ещё не создана</p>
          <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-all">
            На главную
          </button>
        </div>
      </div>
    );
  }

  if (!link) return null;

  const sortedServices = sortServicesByRegion(link.services, country, device);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Background */}
      {link.backgroundUrl && (
        <div className="absolute inset-0">
          <img src={link.backgroundUrl} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        </div>
      )}
      {!link.backgroundUrl && (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: link.buttonColor + '15' }}></div>
        </div>
      )}

      <div className="relative max-w-md mx-auto px-4 py-12">
        {/* Countdown */}
        {link.countdownDate && (
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Timer className="w-4 h-4" style={{ color: link.buttonColor }} />
              <span className="text-sm font-medium" style={{ color: link.buttonColor }}>До релиза</span>
            </div>
            <CountdownTimer targetDate={link.countdownDate} />
          </div>
        )}

        {/* Artist Info */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl" style={{ background: `linear-gradient(135deg, ${link.buttonColor}, ${link.buttonColor}88)` }}>
            {link.artistName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: link.textColor }}>{link.artistName}</h1>
          <p className="text-gray-400">{link.title}</p>
        </div>

        {/* Pre-save */}
        {link.presaveEnabled && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass rounded-2xl p-4 neon-border">
              <p className="text-sm font-medium text-center mb-3" style={{ color: link.buttonColor }}>🔥 Предзаказ уже доступен!</p>
              <div className="flex gap-2">
                {link.presaveSpotifyUrl && (
                  <button onClick={() => handleServiceClick('Spotify Pre-save', link.presaveSpotifyUrl)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{ background: '#1DB954' }}>
                    🎧 Pre-save Spotify
                  </button>
                )}
                {link.presaveAppleUrl && (
                  <button onClick={() => handleServiceClick('Apple Music Pre-save', link.presaveAppleUrl)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{ background: '#FC3C44' }}>
                    🍎 Pre-save Apple
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* YouTube */}
        {link.youtubeUrl && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="rounded-2xl overflow-hidden glass">
              <iframe
                src={link.youtubeUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full aspect-video"
                allowFullScreen
                title="YouTube video"
              />
            </div>
          </div>
        )}

        {/* Audio Preview */}
        {link.audioPreviewUrl && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Music className="w-4 h-4" style={{ color: link.buttonColor }} />
                <span className="text-sm font-medium">Аудио-превью</span>
              </div>
              <audio controls className="w-full" style={{ filter: `drop-shadow(0 0 4px ${link.buttonColor}40)` }}>
                <source src={link.audioPreviewUrl} />
              </audio>
            </div>
          </div>
        )}

        {/* Streaming Services */}
        <div className="space-y-2.5">
          {sortedServices.map((service, i) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.serviceName, service.url)}
              className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] animate-fade-in-up group"
              style={{
                background: link.buttonColor + '15',
                border: `1px solid ${link.buttonColor}30`,
                animationDelay: `${0.25 + i * 0.05}s`,
              }}
            >
              <span className="text-2xl">{getServiceIcon(service.serviceName)}</span>
              <span className="font-medium flex-1 text-left" style={{ color: link.textColor }}>{service.serviceName}</span>
              <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: link.textColor }} />
            </button>
          ))}
        </div>

        {/* Badge */}
        <div className="text-center mt-12 pt-6 border-t border-white/5">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors">
            <Link2 className="w-3 h-3" /> Создано в HyperLink
          </a>
        </div>
      </div>
    </div>
  );
}
