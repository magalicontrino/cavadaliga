'use client';

import { useEffect, useState } from 'react';
import { useI18n } from './i18n';

// Météo temps réel via Open-Meteo (gratuit, sans clé, CORS OK).
// Coordonnées de Cava d'Aliga (Scicli, province de Raguse).
const LAT = 36.735;
const LON = 14.716;

type Cat = 'clear' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';
function category(code: number): Cat {
  if ([0, 1].includes(code)) return 'clear';
  if ([2, 3].includes(code)) return 'cloud';
  if ([45, 48].includes(code)) return 'fog';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'rain';
}

const LABELS: Record<Cat, Record<'fr' | 'it' | 'en', string>> = {
  clear: { fr: 'Ensoleillé', it: 'Soleggiato', en: 'Sunny' },
  cloud: { fr: 'Nuageux', it: 'Nuvoloso', en: 'Cloudy' },
  fog: { fr: 'Brume', it: 'Nebbia', en: 'Fog' },
  rain: { fr: 'Pluie', it: 'Pioggia', en: 'Rain' },
  snow: { fr: 'Neige', it: 'Neve', en: 'Snow' },
  storm: { fr: 'Orage', it: 'Temporale', en: 'Storm' },
};
const WORD: Record<'fr' | 'it' | 'en', string> = { fr: 'Météo', it: 'Meteo', en: 'Weather' };

export default function Weather() {
  const { lang } = useI18n();
  const [data, setData] = useState<{ temp: number; cat: Cat } | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        const cur = j?.current;
        if (typeof cur?.temperature_2m === 'number') {
          setData({ temp: Math.round(cur.temperature_2m), cat: category(cur.weather_code) });
        } else setErr(true);
      })
      .catch(() => setErr(true));
  }, []);

  const condition = data ? LABELS[data.cat][lang] : '';

  return (
    <div className="select-none">
      <span className="block text-[clamp(2rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
        {WORD[lang]}
      </span>
      <div className="mt-1 flex items-baseline gap-3">
        <span aria-hidden className="text-[clamp(2rem,7vw,4.5rem)] leading-none" style={{ fontWeight: 900 }}>
          →
        </span>
        <span className="text-[clamp(2.4rem,8vw,5.5rem)] leading-none" style={{ fontWeight: 900 }}>
          {data ? `${data.temp}°` : err ? '—' : '··'}
        </span>
        <span className="text-[clamp(0.9rem,2vw,1.3rem)]" style={{ color: 'var(--cava-muted)' }}>
          {condition ? `/ ${condition}` : err ? '/ indispo.' : ''}
        </span>
      </div>
    </div>
  );
}
