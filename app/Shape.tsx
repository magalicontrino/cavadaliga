'use client';

// Jeu de formes géométriques PLATES (style « geometric shapes flat ») :
// remplies, en currentColor. On les choisit par index.
const SHAPES = [
  <circle key="circle" cx="12" cy="12" r="9" />,
  <path key="triangle" d="M12 3 21 20 3 20 Z" />,
  <path key="semicircle" d="M3 12a9 9 0 0 1 18 0z" />,
  <path key="quarter" d="M4 20V4a16 16 0 0 1 16 16z" />,
  <path key="diamond" d="M12 2 22 12 12 22 2 12 Z" />,
  <path key="star" d="M12 1l2.2 7.8L22 11l-7.8 2.2L12 22l-2.2-8.8L2 11l7.8-2.2z" />,
  // Feuille / tulipe (deux lobes, base arrondie)
  <path key="leaf" d="M12 20.5C3.5 14.5 3.5 5.5 12 9c8.5-3.5 8.5 5.5 0 11.5Z" />,
  // Lune (disque mordu en haut à droite)
  <path
    key="moon"
    fillRule="evenodd"
    clipRule="evenodd"
    d="M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0ZM12.5 6a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0Z"
  />,
  // Cible (cercles concentriques + petit cercle)
  <g key="target">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="20" cy="4.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </g>,
];

export default function Shape({
  index,
  size = 30,
  className = '',
}: {
  index: number;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {SHAPES[index % SHAPES.length]}
    </svg>
  );
}
