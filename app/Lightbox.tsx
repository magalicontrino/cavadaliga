'use client';

import { useCallback, useEffect } from 'react';
import { withBase } from './data';

/**
 * Lightbox partagée : superposition plein écran avec navigation ‹ › (et flèches
 * clavier), fermeture par ✕, Échap ou clic sur le fond. L'index ouvert est géré
 * par le parent (null = fermée).
 */
export default function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: string[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onIndex((index + dir + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index, go, onClose]);

  if (index === null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(255,255,255,0.96)' }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        style={{ color: 'var(--cava-ink)' }}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-[18px] ring-1 ring-black/15 transition hover:bg-black/5"
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
        style={{ color: 'var(--cava-ink)' }}
        className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-2xl ring-1 ring-black/15 transition hover:bg-black/5 md:left-6"
      >
        ‹
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBase(images[index])}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[86vh] max-w-[92vw] rounded-lg object-contain shadow-2xl ring-1 ring-black/10"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        aria-label="Photo suivante"
        style={{ color: 'var(--cava-ink)' }}
        className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-2xl ring-1 ring-black/15 transition hover:bg-black/5 md:right-6"
      >
        ›
      </button>
    </div>
  );
}
