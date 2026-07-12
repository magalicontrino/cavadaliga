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
