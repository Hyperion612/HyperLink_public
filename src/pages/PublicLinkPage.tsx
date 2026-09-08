import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLinkBySlug, addClick, addView } from '../store';
import { SmartLink, STREAMING_SERVICES } from '../types';
import { ExternalLink, Music, Link2, Timer } from 'lucide-react';

function detectDevice(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad/.test(ua)) return 'iPhone';
  if (/Android/.test(ua)) return 'Android';
  if (/Mac/.test(ua)) return 'Mac';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown';
}

function getCountry(): string {
  return 'RU'; // По умолчанию RU для демо
}

function getCity(): string {
  return 'Москва';
}

function getUtmSource(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || 'direct';
}

function sortServicesByRegion(services: SmartLink['services'], country: string, device: string) {
  const sorted = [...services];
  sorted.sort((a, b) => {
    const svcA = STREAMING_SERVICES.find(s => s.name === a.serviceName);
    const svcB = STREAMING_SERVICES.find(s => s.name === b.serviceName);
    let scoreA = 0, scoreB = 0;
    
    if (svcA?.regions.includes(country)) scoreA += 10;
    if (svcB?.regions.includes(country)) scoreB += 10;
    
    if (device === 'iPhone' || device === 'Mac') {
      if (a.serviceName === 'Apple Music') scoreA += 5;
      if (b.serviceName === 'Apple Music') scoreB += 5;
    }
    if (device === 'Android') {
      if (a.serviceName === 'YouTube Music') scoreA += 5;
      if (b.serviceName === 'YouTube Music') scoreB += 5;
    }
    
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
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
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
      <div className="text-center">
        <div className="text-3xl font-bold">{timeLeft.days}</div>
        <div className="text-xs text-zinc-400">дней</div>
      </div>
      <div className="text-2xl text-zinc-600">:</div>
      <div className="text-center">
        <div className="text-3xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs text-zinc-400">часов</div>
      </div>
      <div className="text-2xl text-zinc-600">:</div>
      <div className="text-center">
        <div className="text-3xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs text-zinc-400">минут</div>
      </div>
      <div className="text-2xl text-zinc-600">:</div>
      <div className="text-center">
        <div className="text-3xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs text-zinc-400">секунд</div>
      </div>
    </div>
  );
}

export default function PublicLinkPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState<SmartLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundLink = getLinkBySlug(slug);
      if (foundLink) {
        setLink(foundLink);
        
        // Track view
        const device = detectDevice();
        const country = getCountry();
        const city = getCity();
        const utmSource = getUtmSource();
        
        addView({
          linkId: foundLink.id,
          country,
          city,
          device,
          utmSource,
        });
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">HyperLink</div>
          <div className="text-zinc-400">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold mb-2">Ссылка не найдена</h1>
          <p className="text-zinc-400 mb-6">Эта ссылка не существует или была удалена</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const device = detectDevice();
  const country = getCountry();
  const sortedServices = sortServicesByRegion(link.services, country, device);

  const handleClick = (serviceName: string, url: string) => {
    const device = detectDevice();
    const country = getCountry();
    const city = getCity();
    const utmSource = getUtmSource();
    
    addClick({
      linkId: link.id,
      serviceName,
      country,
      city,
      device,
      utmSource,
    });
    
    window.open(url, '_blank');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: link.backgroundUrl 
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${link.backgroundUrl}) center/cover`
          : '#000'
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-4"
            style={{ background: link.buttonColor + '20' }}
          >
            🎵
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: link.textColor }}>
            {link.artistName}
          </h1>
          <p className="text-zinc-400">{link.title}</p>
        </div>

        {/* Countdown */}
        {link.countdownDate && new Date(link.countdownDate) > new Date() && (
          <div className="bg-zinc-900/80 backdrop-blur rounded-xl p-6 mb-6 border border-zinc-800">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Timer className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">До релиза осталось</span>
            </div>
            <CountdownTimer targetDate={link.countdownDate} />
          </div>
        )}

        {/* Pre-save */}
        {link.presaveEnabled && (
          <div className="space-y-3 mb-6">
            {link.presaveSpotifyUrl && (
              <button 
                onClick={() => handleClick('Spotify Pre-save', link.presaveSpotifyUrl)}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-green-600/10 border border-green-600/20 hover:bg-green-600/20 transition-colors"
              >
                <span className="text-2xl">🎧</span>
                <span className="flex-1 text-left font-medium">Pre-save на Spotify</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            {link.presaveAppleUrl && (
              <button 
                onClick={() => handleClick('Apple Music Pre-save', link.presaveAppleUrl)}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-600/10 border border-red-600/20 hover:bg-red-600/20 transition-colors"
              >
                <span className="text-2xl">🍎</span>
                <span className="flex-1 text-left font-medium">Pre-save на Apple Music</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>
        )}

        {/* Services */}
        <div className="space-y-3 mb-8">
          {sortedServices.map(service => (
            <button
              key={service.id}
              onClick={() => handleClick(service.serviceName, service.url)}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-900/80 backdrop-blur border border-zinc-800 hover:border-zinc-700 transition-colors"
              style={{ color: link.textColor }}
            >
              <span className="text-2xl">{getServiceIcon(service.serviceName)}</span>
              <span className="flex-1 text-left font-medium">{service.serviceName}</span>
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center text-zinc-500 text-sm">
            <Link2 className="w-4 h-4" />
            <span>Создано в HyperLink</span>
          </div>
        </div>
      </div>
    </div>
  );
}
