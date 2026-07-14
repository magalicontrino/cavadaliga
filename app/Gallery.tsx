'use client';

import { useCallback, useEffect, useState } from 'react';
import Photo from './Photo';
import { withBase } from './data';

/**
 * Galerie : bandeau d'images défilant (pause au survol) + lightbox au clic.
 * Navigation ‹ › (et flèches clavier), fermeture par ✕, Échap ou clic sur le fond.
 */
export default function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const strip = [...images, ...images];

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) => setOpen((cur) => (cur === null ? cur : (cur + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, go]);

  return (
    <>
      <div className="cava-gallery overflow-hidden">
        <div className="cava-marquee-track" style={{ ['--cava-marquee-duration' as string]: '55s' }}>
          {strip.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i % images.length)}
              aria-label="Agrandir la photo"
              className="mx-2 aspect-[3/4] h-[clamp(200px,26vh,320px)] shrink-0 cursor-zoom-in overflow-hidden rounded-xl"
            >
              <Photo
                src={src}
                alt=""
                tone={i % 2 === 0 ? 'terra' : 'pink'}
                className="h-full w-full"
                imgClassName="transition-transform duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(24,23,23,0.94)' }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-[18px] text-white ring-1 ring-white/30 transition hover:bg-white/10"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Photo précédente"
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-2xl text-white ring-1 ring-white/30 transition hover:bg-white/10 md:left-6"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase(images[open])}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Photo suivante"
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-2xl text-white ring-1 ring-white/30 transition hover:bg-white/10 md:right-6"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
