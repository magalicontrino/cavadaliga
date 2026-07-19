'use client';

/**
 * Icônes PLEINES, style « sharp solid » (remplies, angles nets) — pour les
 * cartes « Fonctionnement de la maison ». Tracés maison en currentColor,
 * viewBox 24×24, aucune dépendance externe. Remplacent les emojis ⚡💧🔥📶.
 */
/*
 * Ce jeu ne connaissait que cinq noms, et les cartes ajoutees depuis en
 * demandaient cinq autres. Elles s'affichaient donc avec un picto VIDE — un
 * carre de rien la ou les autres ont un dessin — sans que rien ne le signale :
 * la page ecrit `g.icon as OpIconName`, et ce `as` fait taire le compilateur.
 * Repere a l'oeil sur la carte de l'eau du robinet, une fois le reste verifie.
 *
 * Les formes sont PLEINES, comme les cinq premieres : le composant peint en
 * `fill`, un dessin au trait y sortirait en pate noire.
 */
export type OpIconName =
  | 'bolt'
  | 'drop'
  | 'flame'
  | 'signal'
  | 'key'
  | 'leaf'
  | 'wave'
  | 'box'
  | 'sun'
  | 'bottle';

const PATHS: Record<OpIconName, React.ReactNode> = {
  // La clef — la buanderie. Elle ne se trouve pas, elle se DONNE : c'est un
  // objet a repérer dans le salon, pas un compteur a manoeuvrer.
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l8 8M16 16l2-2M18.5 18.5l2-2" />
    </>
  ),
  // Feuille — les plantes a arroser
  leaf: <path d="M20.5 3.5C11 3.5 5 8 5 15c0 1.6.4 3 1.1 4.2L4 21.3l1.4 1.4 2.1-2.1A8.4 8.4 0 0 0 12 22c7 0 8.5-9.5 8.5-18.5zM12 19.9c-1.2 0-2.3-.3-3.2-.8l7-7-1.4-1.4-7 7c-.5-.9-.8-2-.8-3.2 0-5.4 4.5-9 12.4-9.4-.4 8.2-2.8 14.8-7 14.8z" />,
  // Vague — la douche de la plage
  wave: (
    <path d="M2 8.5c2.2 0 2.2 2 4.4 2s2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 4.4-2c1.1 0 1.7.5 2.4 1V7.4c-.7-.5-1.3-.9-2.4-.9-2.2 0-2.2 2-4.4 2s-2.2-2-4.4-2-2.2 2-4.4 2-2.2-2-4.4-2zm0 5c2.2 0 2.2 2 4.4 2s2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 4.4-2c1.1 0 1.7.5 2.4 1v-2.1c-.7-.5-1.3-.9-2.4-.9-2.2 0-2.2 2-4.4 2s-2.2-2-4.4-2-2.2 2-4.4 2-2.2-2-4.4-2zm0 5c2.2 0 2.2 2 4.4 2s2.2-2 4.4-2 2.2 2 4.4 2 2.2-2 4.4-2c1.1 0 1.7.5 2.4 1v-2.1c-.7-.5-1.3-.9-2.4-.9-2.2 0-2.2 2-4.4 2s-2.2-2-4.4-2-2.2 2-4.4 2-2.2-2-4.4-2z" />
  ),
  // Tiroir — les draps
  box: (
    <path d="M3 4h18a1 1 0 0 1 1 1v5H2V5a1 1 0 0 1 1-1zm7 3.5h4v-2h-4v2zM2 12h20v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7zm8 3.5h4v-2h-4v2z" />
  ),
  // Soleil — la chaleur, et pas de climatisation
  sun: (
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-6 1.6 3.2h-3.2L12 1zm0 22-1.6-3.2h3.2L12 23zM1 12l3.2-1.6v3.2L1 12zm22 0-3.2 1.6v-3.2L23 12zM4.2 4.2l3.4 1-2.3 2.3-1.1-3.3zm15.6 15.6-3.4-1 2.3-2.3 1.1 3.3zM4.2 19.8l1.1-3.3 2.3 2.3-3.4 1zM19.8 4.2l-1.1 3.3-2.3-2.3 3.4-1z" />
  ),
  // Bouteille — l'eau qu'on boit, celle qui s'achete
  bottle: (
    <path d="M10 2h4v2.6c0 .9.3 1.7.9 2.4l1.4 1.6c.5.6.7 1.3.7 2V21a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V10.6c0-.7.2-1.4.7-2l1.4-1.6c.6-.7.9-1.5.9-2.4V2zm-1 11v7h6v-7H9z" />
  ),
  // Éclair — électricité
  bolt: <path d="M7 2v11h3v9l7-12h-4l4-8z" />,
  // Goutte — eau (pointe nette en haut, base arrondie)
  drop: <path d="M12 2 18 13A7 7 0 1 1 6 13Z" />,
  // Flamme — gaz
  flame: (
    <path d="M13.5 1s.9 3 .9 5.2c0 2.1-1.4 3.6-3.4 3.6-2 0-3.5-1.5-3.5-3.6l.03-.4C5.2 7.6 4 10.7 4 14a8 8 0 0 0 16 0C20 8.7 17.4 4 13.5 1zM11.7 19.8c-1.8 0-3.2-1.4-3.2-3.1 0-1.6 1-2.7 2.8-3.1 1.8-.4 3.6-1.2 4.6-2.5.4 1.3.6 2.6.6 4 0 2.6-2.1 4.7-4.8 4.7z" />
  ),
  // Barres de signal — wifi
  signal: (
    <>
      <rect x="3" y="14" width="3" height="6" />
      <rect x="8.5" y="10" width="3" height="10" />
      <rect x="14" y="6" width="3" height="14" />
      <rect x="19.5" y="2" width="3" height="18" />
    </>
  ),
};

export default function OpIcon({
  name,
  size = 24,
  className = '',
}: {
  name: OpIconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {PATHS[name]}
    </svg>
  );
}
