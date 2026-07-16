'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Reveal — apparition fade + translate au scroll (reproduction de l'effet
 * Webflow d'origine : opacity 0 → 1, translateY → 0). Respecte
 * prefers-reduced-motion (géré en CSS via .cava-reveal).
 *
 * L'effet ne vaut que pour la page qu'on ouvre. Ce qui apparaît ensuite est une
 * réponse à un clic — un filtre — et doit être là tout de suite, entièrement :
 * pas seulement le titre, avec le contenu qui se dévoile au défilement.
 */

// Le premier rendu garde l'animation ; tout ce qui naît ensuite s'affiche d'un
// bloc, sans condition de position à l'écran.
//
// Le drapeau bascule deux frames après le premier montage, et non sur un
// minuteur : un délai serait une course entre l'hydratation de React et lui —
// selon lequel gagne, un bloc de la page se retrouverait « instantané » alors
// qu'on vient d'arriver. Ici, tous les Reveal du premier rendu posent leur effet
// avant la bascule, donc aucun ne peut être pris pour un clic.
let pageSettled = false;

// useLayoutEffect prévient React côté serveur ; en rendu statique on retombe
// sur useEffect, qui ne sert de toute façon qu'une fois dans le navigateur.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Reveal({
  children,
  as,
  className = '',
  y = '6vh',
  delay = 0,
  once = true,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: string;
  delay?: number;
  once?: boolean;
  style?: React.CSSProperties;
}) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [instant, setInstant] = useState(false);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Né après le chargement → réponse à un clic : on montre, tout de suite.
    if (pageSettled) {
      setInstant(true);
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  // Pose le drapeau une fois le premier rendu passé. Idempotent : chaque Reveal
  // le programme, tous écrivent la même valeur.
  useEffect(() => {
    if (pageSettled) return;
    requestAnimationFrame(() => requestAnimationFrame(() => (pageSettled = true)));
  }, []);

  return (
    <Tag
      ref={ref}
      className={`cava-reveal ${inView ? 'is-in' : ''} ${instant ? 'cava-reveal-now' : ''} ${className}`}
      style={{ ['--cava-reveal-y' as string]: y, ['--cava-reveal-delay' as string]: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
