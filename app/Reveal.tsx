'use client';

import { createContext, useContext, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Reveal — apparition fade + translate au scroll (reproduction de l'effet
 * Webflow d'origine : opacity 0 → 1, translateY → 0). Respecte
 * prefers-reduced-motion (géré en CSS via .cava-reveal).
 *
 * L'effet ne vaut que pour la page qu'on ouvre. Ce qui répond à un clic — le
 * contenu d'un filtre — doit être là tout de suite et en entier.
 */

/**
 * Compteur de clics sur un filtre. Une page à tri l'incrémente à chaque choix ;
 * tous les Reveal en dessous se montrent alors d'un coup, sans fondu.
 *
 * On passe par là plutôt que de recréer les sections : une section recréée perd
 * son état — les cases cochées de la check-list de départ disparaissaient.
 */
export const RevealNow = createContext(0);

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
  const now = useContext(RevealNow);

  // Un filtre vient d'être cliqué (ou ce bloc naît après) → on montre, sans fondu.
  useEffect(() => {
    if (now === 0) return;
    setInstant(true);
    setInView(true);
  }, [now]);

  /**
   * Ce qui est DEJA a l'ecran quand la page s'ouvre se montre tout de suite.
   *
   * L'observateur ci-dessous attend 15 % de l'element, moins 8 % de marge en
   * bas. Une grande photo qui depasse a peine du bas de l'ecran n'atteint jamais
   * ce seuil : mesure sur « La famille », la premiere rangee commençait a 706 px
   * dans une fenetre de 745 — visible, et pourtant a opacite 0. Elle attendait
   * un defilement pour exister.
   *
   * On garde le fondu : c'est l'effet, pas son contournement. L'observateur
   * continue de servir pour tout ce qui vient plus bas.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight) setInView(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Le seuil de 15 % attend qu'un sixième de l'élément soit à l'écran.
          // Pour un bloc plus haut que la fenêtre — l'arbre généalogique en
          // entier — ce sixième n'y tient jamais : le seuil n'est jamais
          // atteint et le bloc reste à opacité 0. C'est le clic « arbre ↓ » qui
          // tombait sur un écran vide. On le révèle donc aussi dès qu'il
          // remplit une bonne moitié de la fenêtre.
          const rootH = e.rootBounds?.height ?? window.innerHeight;
          const enough = e.intersectionRatio >= 0.15 || e.intersectionRect.height >= rootH * 0.5;
          if (e.isIntersecting && enough) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once && !e.isIntersecting) {
            setInView(false);
          }
        }
      },
      { threshold: [0, 0.15], rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

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
