import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export 100 % statique (HTML/CSS/JS dans /out) — hébergeable partout,
  // sans serveur Node. Le site n'a aucune logique serveur dynamique.
  output: 'export',
  // Le site utilise des <img> classiques (pas next/image), donc pas
  // d'optimisation d'images serveur à désactiver — mais on le précise
  // par sécurité si next/image est ajouté un jour.
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
