import type { NextConfig } from 'next';

// Sur GitHub Pages, le site est servi depuis un sous-chemin /<repo>/.
// En CI (GitHub Actions) on active ce basePath ; en local il est vide.
const repo = 'cavadaliga';
const isCI = process.env.GITHUB_ACTIONS === 'true';
const basePath = isCI ? `/${repo}` : '';

const nextConfig: NextConfig = {
  // Export 100 % statique (HTML/CSS/JS dans /out) — hébergeable partout,
  // sans serveur Node. Le site n'a aucune logique serveur dynamique.
  output: 'export',
  // <img> classiques (pas next/image) → pas d'optimisation serveur.
  images: { unoptimized: true },
  // Génère /page/index.html (URLs propres, fiables sur GitHub Pages).
  trailingSlash: true,
  // Préfixe le sous-chemin GitHub Pages (assets _next + routes).
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Exposé au code client pour préfixer les <a href> et <img src> bruts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  devIndicators: false,
};

export default nextConfig;
