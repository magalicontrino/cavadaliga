'use client';

import { useState } from 'react';
import Photo from './Photo';
import Lightbox from './Lightbox';

/**
 * Galerie : bandeau d'images défilant (pause au survol) + lightbox au clic.
 */
export default function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const strip = [...images, ...images];

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

      <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}
