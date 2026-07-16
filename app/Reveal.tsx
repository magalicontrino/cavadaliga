'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Reveal — apparition fade + translate au scroll (reproduction de l'effet
 * Webflow d'origine : opacity 0 → 1, translateY → 0). Respecte
 * prefers-reduced-motion (géré en CSS via .cava-reveal).
 *
 * L'effet ne vaut que pour ce qui ENTRE dans l'écran en défilant. Un bloc qui
 * naît déjà sous les yeux — le contenu d'un filtre qu'on vient de cliquer — ne
 * doit pas se fondre : on cliquerait, et il ne se passerait rien pendant une
 * seconde. Celui-là s'affiche d'emblée.
 */

// Le premier rendu garde l'animation d'arrivée ; tout ce qui naît ensuite est
// une réaction à un clic et doit s'afficher tout de suite.
//
// Le drapeau bascule deux frames après le premier montage, et non sur un
// minuteur : un délai serait une course entre l'hydratation de React et lui —
// selon lequel gagne, un bloc de la page d'accueil se retrouverait « instantané »
// alors qu'on vient d'arriver. Ici, tous les Reveal du premier rendu posent
// leur effet avant la bascule, donc aucun ne peut être pris pour un clic.
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

    // Né déjà visible, après le chargement → on montre tout de suite.
    if (pageSettled) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setInstant(true);
        setInView(true);
        return;
      }
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
