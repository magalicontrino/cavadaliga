'use client';

import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import Lightbox from './Lightbox';

// Vitesse de défilement, en pixels par seconde. On avance nous-mêmes, image par
// image de rendu : sans ça, plus il y a de photos, plus le tour serait rapide.
const SPEED = 23;

/**
 * Galerie : bandeau d'images qui défile tout seul, et qu'on peut aussi FAIRE
 * GLISSER au doigt. Clic sur une photo → lightbox.
 *
 * Le défilement est natif (overflow-x) plutôt qu'une animation CSS : c'est ce
 * qui rend le geste possible sur téléphone — le doigt entraîne le bandeau, avec
 * l'inertie du système, sans qu'on ait à réécrire un glisser à la main. On se
 * contente d'avancer `scrollLeft` à chaque frame, et de se taire dès que
 * quelqu'un touche ou survole.
 *
 * La boucle est sans couture parce que les séries sont IDENTIQUES : arrivé au
 * bout d'une série, on recule d'exactement sa largeur, et l'image sous les yeux
 * ne bouge pas d'un pixel. Encore faut-il que les séries restantes couvrent
 * tout l'écran — cinq cartes font au mieux 1280 px, et bien moins sur une
 * fenêtre basse (leur taille suit la hauteur), ce qui laissait un trou à droite
 * sur les grands écrans. On mesure donc la série et on la répète autant de fois
 * qu'il faut.
 */
export default function Gallery({ images, alts }: { images: string[]; alts?: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [reps, setReps] = useState(2);
  const box = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);
  // Largeur d'une série, mesurée : le pas de la boucle.
  const largeurSerie = useRef(0);
  // Doigt posé ou souris au-dessus : on n'avance pas, on laisse regarder.
  const retenu = useRef(false);
  // Distance parcourue depuis l'appui : au-delà, c'est un glissement, pas un
  // clic — on n'ouvre pas la lightbox sous le doigt qui faisait défiler.
  const depart = useRef(0);
  const glisse = useRef(false);

  useEffect(() => {
    const measure = () => {
      const b = box.current;
      const s = firstSet.current;
      if (!b || !s) return;
      const setW = s.getBoundingClientRect().width;
      const boxW = b.getBoundingClientRect().width;
      if (!setW || !boxW) return;
      largeurSerie.current = setW;
      // Il faut de la matière DES DEUX CÔTÉS : une série en réserve à gauche
      // pour pouvoir glisser à rebours (le défilement natif ne descend jamais
      // sous zéro), une série plus l'écran à droite pour l'avance.
      setReps(Math.max(3, Math.ceil(boxW / setW) + 2));
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

  useEffect(() => {
    const b = box.current;
    if (!b) return;
    // Mouvement réduit : le bandeau ne part pas tout seul, mais il reste
    // parfaitement glissable — on retire l'automatisme, pas la galerie.
    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let precedent = 0;

    const avancer = (t: number) => {
      raf = requestAnimationFrame(avancer);
      const dt = precedent ? (t - precedent) / 1000 : 0;
      precedent = t;
      if (!sobre && !retenu.current) b.scrollLeft += SPEED * dt;

      // La boucle, dans les deux sens. On maintient le ruban dans la bande
      // [w, 2w) : une série pleine reste en réserve à gauche, donc glisser à
      // rebours ne bute jamais sur le bord. Les séries étant identiques, ce
      // recalage ne se voit pas.
      // Les bornes sont choisies pour ne PAS osciller : ramener 2w à w laisse
      // w, qui n'est pas < w. Une première version bornait à [0, w) et, arrivée
      // à zéro, ajoutait une série que la borne haute retirait à la frame
      // suivante — le bandeau tremblait sur place.
      const w = largeurSerie.current;
      if (w > 0) {
        if (b.scrollLeft >= 2 * w) b.scrollLeft -= w;
        else if (b.scrollLeft < w) b.scrollLeft += w;
      }
    };

    raf = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Le doigt relâché, l'inertie du système continue un instant : on attend
  // qu'elle retombe avant de reprendre la main, sinon les deux se disputent.
  const relacher = () => {
    window.setTimeout(() => {
      retenu.current = false;
    }, 900);
  };

  return (
    <>
      <div
        ref={box}
        className="cava-gallery cava-swipe overflow-x-auto overflow-y-hidden"
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') retenu.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') retenu.current = false;
        }}
        onPointerDown={(e) => {
          retenu.current = true;
          depart.current = e.clientX;
          glisse.current = false;
        }}
        onPointerMove={(e) => {
          if (Math.abs(e.clientX - depart.current) > 8) glisse.current = true;
        }}
        onPointerUp={(e) => {
          if (e.pointerType !== 'mouse') relacher();
        }}
        onPointerCancel={relacher}
      >
        <div className="flex w-max">
          {Array.from({ length: reps }, (_, r) => (
            <div key={r} ref={r === 0 ? firstSet : undefined} className="flex shrink-0" aria-hidden={r > 0}>
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    // Un glissement finit souvent sur une photo : ce n'est pas
                    // pour autant qu'on veut l'agrandir.
                    if (glisse.current) return;
                    setOpen(i);
                  }}
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
                    imgClassName="pointer-events-none transition-transform duration-500 hover:scale-105"
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
