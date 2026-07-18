'use client';

import { useCallback, useEffect, useRef } from 'react';
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

  // Glissé tactile (mobile) : on suit le doigt et, au relâché, on change de
  // photo si le mouvement est franchement horizontal. Sans ça, sur téléphone il
  // n'y avait que les flèches ‹ › — le geste naturel (glisser) ne faisait rien.
  const touch = useRef({ x: 0, y: 0, active: false });
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, active: true };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current.active) return;
    touch.current.active = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    // Assez horizontal, et assez ample pour ne pas confondre avec un tapotement.
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

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
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="max-h-[86vh] max-w-[92vw] touch-pan-y rounded-lg object-contain shadow-2xl ring-1 ring-black/10"
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
