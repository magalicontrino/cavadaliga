'use client';

/**
 * Icônes PLEINES, style « sharp solid » (remplies, angles nets) — pour les
 * cartes « Fonctionnement de la maison ». Tracés maison en currentColor,
 * viewBox 24×24, aucune dépendance externe. Remplacent les emojis ⚡💧🔥📶.
 */
export type OpIconName = 'bolt' | 'drop' | 'flame' | 'signal' | 'key';

const PATHS: Record<OpIconName, React.ReactNode> = {
  // La clef — la buanderie. Elle ne se trouve pas, elle se DONNE : c'est un
  // objet a repérer dans le salon, pas un compteur a manoeuvrer.
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l8 8M16 16l2-2M18.5 18.5l2-2" />
    </>
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
