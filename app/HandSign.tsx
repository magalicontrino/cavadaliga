'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * Les six gestes, dessinés plutôt que photographiés : les photos du livre de
 * Munari sont sous droits, ces silhouettes-ci sont à nous.
 *
 * Ce qui fait qu'une main se lit comme une main, ce sont les doigts SÉPARÉS.
 * Chaque picto est donc bâti de capsules espacées d'un ou deux points : elles
 * se chevauchent avec la paume (même remplissage, l'union fait la silhouette)
 * mais jamais entre elles. Les traits fins en retrait portent le mouvement —
 * c'est lui qui fait le sens, et une image fixe ne peut que le désigner.
 */

/** Main ouverte, doigts vers le haut, poignet en bas. Repère local 0-70 × 0-96. */
function OpenHand() {
  return (
    <>
      <rect x="12" y="20" width="9" height="32" rx="4.5" />
      <rect x="23" y="15" width="9" height="37" rx="4.5" />
      <rect x="34" y="14" width="9" height="38" rx="4.5" />
      <rect x="45" y="19" width="9" height="33" rx="4.5" />
      <rect x="10" y="44" width="46" height="26" rx="11" />
      <rect x="24" y="66" width="18" height="26" rx="9" />
    </>
  );
}

/** Poing fermé, index tendu vers la droite. Repère local 0-70 × 0-96. */
function PointHand() {
  return (
    <>
      {/* les phalanges repliées, en bosses */}
      <rect x="10" y="34" width="9" height="12" rx="4.5" />
      <rect x="21" y="32" width="9" height="14" rx="4.5" />
      <rect x="32" y="33" width="9" height="13" rx="4.5" />
      {/* le poing */}
      <rect x="6" y="40" width="38" height="26" rx="12" />
      {/* l'index */}
      <rect x="40" y="47" width="28" height="9" rx="4.5" />
      {/* le poignet */}
      <rect x="8" y="62" width="18" height="28" rx="9" />
    </>
  );
}

const SIGNS: Record<string, ReactNode> = {
  // Ma che vuoi? — les cinq doigts pincés en bouton, la main qui bascule.
  // Faire partir les doigts de la pointe donnait un triangle plein : un
  // parapluie, pas une main. Ici chaque doigt est droit et espacé de ses
  // voisins sur toute sa longueur, et seule sa pointe se replie vers le
  // pincement — c'est ce qui fait qu'on les compte.
  'che-vuoi': (
    <>
      <g fill="currentColor">
        {[
          { xc: 21.5, len: 28, a: 47 },
          { xc: 30.5, len: 22, a: 31 },
          { xc: 39.5, len: 19, a: 8 },
          { xc: 48.5, len: 20, a: -19 },
          { xc: 57.5, len: 25, a: -39 },
        ].map((f) => (
          <g key={f.xc}>
            {/* la pointe, repliée vers le bouton */}
            <rect x={f.xc - 3.5} y={34 - f.len} width="7" height={f.len} rx="3.5" transform={`rotate(${f.a} ${f.xc} 34)`} />
            {/* le doigt, droit */}
            <rect x={f.xc - 3.5} y="30" width="7" height="34" rx="3.5" />
          </g>
        ))}
        <ellipse cx="39.5" cy="66" rx="19" ry="11" />
        <rect x="30" y="70" width="19" height="26" rx="9.5" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity="0.4">
        <path d="M72 44c4 5 4 12 0 17" />
        <path d="M7 44c-4 5-4 12 0 17" />
      </g>
    </>
  ),

  // Non me ne importa — le dos des doigts sous le menton, poussé vers l'avant.
  'non-me-ne-importa': (
    <>
      <g fill="currentColor" transform="rotate(-24 42 56) translate(7 0)">
        <OpenHand />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity="0.4">
        <path d="M66 22c5 3 8 9 7 14" />
        <path d="M57 13c7 5 10 12 9 20" />
      </g>
    </>
  ),

  // Insisto — l'index frappe la paume ouverte de l'autre main.
  insisto: (
    <>
      {/* la paume offerte, debout à droite */}
      <g fill="currentColor" transform="translate(52 6) scale(0.62)">
        <OpenHand />
      </g>
      {/* la main qui pointe, à gauche */}
      <g fill="currentColor" transform="translate(0 6) scale(0.72)">
        <PointHand />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity="0.4">
        <path d="M54 34v-7" />
        <path d="M54 66v7" />
      </g>
    </>
  ),

  // Che peso! — l'index tapote lentement l'estomac.
  'che-peso': (
    <>
      {/* le corps, suggéré : le geste n'existe pas sans lui */}
      <path d="M78 6c-7 20-7 46 0 84" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity="0.35" />
      <g fill="currentColor" transform="translate(2 8) scale(0.76)">
        <PointHand />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity="0.4">
        <path d="M60 38h7" />
        <path d="M60 52h7" />
      </g>
    </>
  ),

  // Leggere — l'index court sur la paume ouverte, ligne après ligne.
  leggere: (
    <>
      {/* la paume : c'est la page — couchée, doigts vers la droite */}
      <g fill="currentColor" transform="rotate(90 42 62) translate(0 24) scale(0.68)">
        <OpenHand />
      </g>
      {/* la main qui lit, au-dessus */}
      <g fill="currentColor" transform="translate(4 -8) scale(0.56) rotate(28 35 48)">
        <PointHand />
      </g>
      <path
        d="M20 66h44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="3 7"
        opacity="0.5"
      />
    </>
  ),

  // Rubare — la main se referme doigt après doigt, pouce tendu.
  // Les doigts se replient : courts, et écartés autour d'un pivot lointain
  // (le poignet) pour qu'ils restent lisibles un par un. C'est le pouce resté
  // tendu et les petits arcs au-dessus qui disent le mouvement.
  rubare: (
    <>
      <g fill="currentColor">
        {/* les quatre doigts, courts et crochetés vers la paume */}
        {[
          { x: 14, h: 22 },
          { x: 25, h: 27 },
          { x: 36, h: 27 },
          { x: 47, h: 22 },
        ].map((f) => (
          <g key={f.x}>
            <rect x={f.x} y={54 - f.h} width="9" height={f.h} rx="4.5" />
            {/* la phalange repliée : c'est elle qui dit « ça se ferme » */}
            <rect x={f.x} y={54 - f.h} width="9" height="15" rx="4.5" transform={`rotate(64 ${f.x + 4.5} ${58 - f.h})`} />
          </g>
        ))}
        <rect x="12" y="46" width="46" height="26" rx="12" />
        {/* le pouce, resté tendu à l'horizontale */}
        <rect x="56" y="54" width="24" height="9" rx="4.5" />
        <rect x="22" y="68" width="18" height="28" rx="9" />
      </g>
      {/* le mouvement : chaque doigt se referme, l'un après l'autre */}
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.45">
        <path d="M16 20c3-5 8-8 14-8" />
        <path d="M40 12c6 0 11 3 14 8" />
      </g>
    </>
  ),
};

export default function HandSign({ id, className = '', style }: { id: string; className?: string; style?: CSSProperties }) {
  const sign = SIGNS[id];
  if (!sign) return null;
  return (
    <svg viewBox="0 0 84 96" className={className} style={style} aria-hidden="true" role="presentation">
      {sign}
    </svg>
  );
}
