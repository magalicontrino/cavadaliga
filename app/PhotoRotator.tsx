'use client';

import Photo from './Photo';

/**
 * Deux photos au meme endroit, qui se relaient en fondu — 10 secondes chacune.
 *
 * Tout est en CSS, volontairement. Une premiere version tenait le compte en
 * React (useState + setInterval) : impossible a prouver au banc, ou l'onglet
 * masque affame l'ordonnanceur, et le relais ne partait jamais. Une animation
 * CSS ne depend ni de l'etat ni d'un minuteur ; le navigateur la joue seul, et
 * on peut lire ses reglages pour verifier qu'elle est bien la.
 *
 * Le tour dure 20 s : chaque photo tient 10 s. La seconde porte le meme cycle
 * avec un retard NEGATIF d'une demi-periode — elle demarre donc a mi-parcours,
 * exactement quand la premiere s'efface. Aucun calcul, aucune synchronisation
 * a maintenir entre les deux.
 *
 * Accessibilite : la premiere photo porte la description, la seconde est
 * decorative. Le relais est un agrement — il ne doit pas faire lire deux
 * legendes pour une seule image.
 */
export default function PhotoRotator({
  images,
  alts,
  tone = 'sand',
  className = '',
}: {
  /** Exactement deux : le cycle CSS est ecrit pour deux. */
  images: [string, string];
  alts: [string, string];
  tone?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden={i > 0}
          className="cava-relais absolute inset-0"
          // Retard negatif : la seconde photo entre dans le cycle a mi-course.
          style={i > 0 ? { animationDelay: '-10s' } : undefined}
        >
          <Photo src={src} alt={i === 0 ? alts[0] : ''} tone={tone} className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}
