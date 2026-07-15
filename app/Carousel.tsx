'use client';

import { useState } from 'react';
import Photo from './Photo';

/**
 * Carrousel de photos (sans lightbox). Une photo à la fois, flèches ‹ › + points.
 * `images` vide → placeholder dégradé + libellé (« photo à venir »).
 * Prévu pour accueillir plusieurs photos par lieu au fil du temps.
 */
export default function Carousel({
  images,
  alt,
  tone = 'sand',
  label,
}: {
  images: readonly string[];
  alt: string;
  tone?: string;
  label?: string;
}) {
  const [i, setI] = useState(0);
  const n = images.length;

  // Aucune photo encore : placeholder de marque.
  if (n === 0) {
    return (
      <div className="w-full overflow-hidden rounded-2xl">
        <Photo src="" alt={alt} tone={tone} label={label} className="aspect-[4/3] w-full" />
      </div>
    );
  }

  const cur = Math.min(i, n - 1);
  const go = (dir: number) => setI((c) => (Math.min(c, n - 1) + dir + n) % n);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Piste : translation horizontale selon l'index courant */}
      <div
        className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {images.map((src, k) => (
          <div key={src} className="w-full shrink-0">
            <Photo src={src} alt={`${alt} — ${k + 1}`} tone={tone} label={label} className="aspect-[4/3] w-full" />
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Photo précédente"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[18px] text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-black/40"
            style={{ background: 'rgba(24,23,23,0.5)' }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Photo suivante"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[18px] text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-black/40"
            style={{ background: 'rgba(24,23,23,0.5)' }}
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {images.map((src, k) => (
              <button
                key={src}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Aller à la photo ${k + 1}`}
                className="h-2 w-2 rounded-full transition"
                style={{ background: k === cur ? '#fff' : 'rgba(255,255,255,0.55)' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
