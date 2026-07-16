import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export 100 % statique (HTML/CSS/JS dans /out) — hébergeable partout,
  // sans serveur Node. Le site n'a aucune logique serveur dynamique.
  output: 'export',
  // <img> classiques (pas next/image) → pas d'optimisation serveur.
  images: { unoptimized: true },
  // Génère /page/index.html (URLs propres).
  trailingSlash: true,
  // Le site est servi à la racine du domaine (public/CNAME) : aucun sous-chemin.
  env: { NEXT_PUBLIC_BASE_PATH: '' },
  devIndicators: false,
};

export default nextConfig;
