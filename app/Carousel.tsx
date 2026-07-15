'use client';

import { useRef, useState } from 'react';
import Photo from './Photo';

/**
 * Carrousel de photos SANS lightbox : on glisse d'une photo à l'autre.
 * - tactile : swipe natif (défilement horizontal + accroche/snap)
 * - souris : glisser-déposer (drag) + flèches ‹ ›
 * `images` vide → placeholder « photo à venir ». 1 photo → image simple.
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
  const n = images.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const [active, setActive] = useState(0);

  if (n === 0) {
    return (
      <div className="w-full overflow-hidden rounded-2xl">
        <Photo src="" alt={alt} tone={tone} label={label} className="aspect-[4/3] w-full" />
      </div>
    );
  }
  if (n === 1) {
    return (
      <div className="w-full overflow-hidden rounded-2xl">
        <Photo src={images[0]} alt={alt} tone={tone} label={label} className="aspect-[4/3] w-full" />
      </div>
    );
  }

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / el.clientWidth))));
  };
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  // Glisser à la souris (desktop)
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const onPointerUp = () => {
    const el = trackRef.current;
    if (el && drag.current.down) el.scrollTo({ left: Math.round(el.scrollLeft / el.clientWidth) * el.clientWidth, behavior: 'smooth' });
    drag.current.down = false;
  };

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="cava-carousel flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-2xl"
      >
        {images.map((src, k) => (
          <div key={src} className="w-full shrink-0 snap-center">
            <Photo src={src} alt={`${alt} — ${k + 1}`} tone={tone} label={label} className="aspect-[4/3] w-full" />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(Math.max(0, active - 1))}
        aria-label="Photo précédente"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[18px] text-white ring-1 ring-white/30 transition hover:bg-black/40"
        style={{ background: 'rgba(24,23,23,0.5)' }}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => goTo(Math.min(n - 1, active + 1))}
        aria-label="Photo suivante"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[18px] text-white ring-1 ring-white/30 transition hover:bg-black/40"
        style={{ background: 'rgba(24,23,23,0.5)' }}
      >
        ›
      </button>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {images.map((src, k) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(k)}
            aria-label={`Aller à la photo ${k + 1}`}
            className="h-2 w-2 rounded-full transition"
            style={{ background: k === active ? '#fff' : 'rgba(255,255,255,0.55)' }}
          />
        ))}
      </div>
    </div>
  );
}
