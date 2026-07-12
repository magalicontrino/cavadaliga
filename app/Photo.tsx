'use client';

import { useEffect, useRef, useState } from 'react';
import { withBase } from './data';

const TONES: Record<string, string> = {
  ink: 'linear-gradient(135deg, #3a3838 0%, #2e2d2d 100%)',
  pink: 'linear-gradient(135deg, #f0568c 0%, #e6296f 100%)',
  terra: 'linear-gradient(135deg, #c05a5a 0%, #aa4646 100%)',
  sand: 'linear-gradient(135deg, #e9e4dc 0%, #d8d0c4 100%)',
};

/**
 * Photo — repli gracieux à 3 niveaux, jamais un cadre cassé :
 *  1. `src`      → la vraie photo (déposée dans /public/picture-sicile/)
 *  2. `fallback` → une image de /public/deco/ si la vraie photo n'existe pas
 *  3. dégradé de la palette + libellé discret (si aucune image ne charge)
 * Dès qu'une vraie photo est ajoutée, elle remplace automatiquement la déco.
 * Aucun filtre N&B : les images restent toujours en couleur.
 */
export default function Photo({
  src,
  fallback,
  alt,
  tone = 'sand',
  className = '',
  imgClassName = '',
  label,
}: {
  src: string;
  fallback?: string;
  alt: string;
  tone?: keyof typeof TONES | string;
  className?: string;
  imgClassName?: string;
  label?: string;
}) {
  // Étape courante de la cascade : image principale → déco → dégradé.
  const [step, setStep] = useState<'primary' | 'fallback' | 'gradient'>('primary');
  const imgRef = useRef<HTMLImageElement>(null);
  const bg = TONES[tone] ?? TONES.sand;

  const raw = step === 'primary' ? src : step === 'fallback' ? fallback : null;
  const current = raw ? withBase(raw) : null;

  function handleError() {
    setStep((s) => (s === 'primary' && fallback ? 'fallback' : 'gradient'));
  }

  // Rattrape les erreurs survenues AVANT l'hydratation (images au-dessus de
  // la ligne de flottaison qui échouent pendant le parsing du HTML SSR :
  // l'événement onError est alors manqué). On revérifie l'état au montage.
  useEffect(() => {
    const im = imgRef.current;
    if (im && im.complete && im.naturalWidth === 0) handleError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <div className={`overflow-hidden ${className}`} style={{ background: bg }}>
      {current ? (
        <img
          ref={imgRef}
          src={current}
          alt={alt}
          loading="lazy"
          onError={handleError}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full items-end p-4">
          <span
            className="text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: tone === 'sand' ? '#8a8378' : 'rgba(255,255,255,0.75)' }}
          >
            {label ?? 'Photo à venir'}
          </span>
        </div>
      )}
    </div>
  );
}
