'use client';

import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import Lightbox from './Lightbox';

// Vitesse de défilement, en pixels par seconde. On calcule la durée à partir
// de la largeur réelle : sans ça, plus il y a d'images, plus ça va vite.
const SPEED = 23;

/**
 * Galerie : bandeau d'images défilant (pause au survol) + lightbox au clic.
 *
 * Le ruban défile d'exactement une série, puis reprend au début — l'illusion
 * ne tient que si les séries restantes couvrent toute la largeur de l'écran.
 * Dupliquer les images deux fois ne suffit pas : cinq cartes font au mieux
 * 1280 px, et bien moins sur une fenêtre basse (leur taille suit la hauteur),
 * ce qui laissait un trou à droite sur les grands écrans. On mesure donc la
 * série et on la répète autant de fois qu'il faut.
 */
export default function Gallery({ images, alts }: { images: string[]; alts?: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [reps, setReps] = useState(2);
  const [shift, setShift] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const b = box.current;
      const s = firstSet.current;
      if (!b || !s) return;
      const setW = s.getBoundingClientRect().width;
      const boxW = b.getBoundingClientRect().width;
      if (!setW || !boxW) return;
      // Après le décalage d'une série, les suivantes doivent remplir l'écran.
      setReps(Math.max(2, Math.ceil(boxW / setW) + 1));
      setShift(setW);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [images.length]);

  return (
    <>
      <div ref={box} className="cava-gallery overflow-hidden">
        <div
          className="cava-marquee-track"
          style={{
            ['--cava-marquee-x' as string]: shift ? `-${shift}px` : '-50%',
            ['--cava-marquee-duration' as string]: `${shift ? Math.round(shift / SPEED) : 55}s`,
          }}
        >
          {Array.from({ length: reps }, (_, r) => (
            <div key={r} ref={r === 0 ? firstSet : undefined} className="flex shrink-0" aria-hidden={r > 0}>
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={alts?.[i] ?? 'Agrandir la photo'}
                  tabIndex={r > 0 ? -1 : undefined}
                  className="mx-2 aspect-[3/4] h-[clamp(200px,26vh,320px)] shrink-0 cursor-zoom-in overflow-hidden rounded-xl"
                >
                  <Photo
                    src={src}
                    // Sans `alts`, le bandeau est decoratif : alt vide, les
                    // lecteurs d'ecran passent. Avec (les pieces de la casa),
                    // chaque photo dit ce qu'elle montre.
                    alt={alts?.[i] ?? ''}
                    tone={i % 2 === 0 ? 'terra' : 'pink'}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-500 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}
