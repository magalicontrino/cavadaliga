// Données STRUCTURELLES du site Cava d'Aliga (indépendantes de la langue).
// Tout le texte visible vit dans app/i18n.tsx (FR / IT / EN).

// Sous-chemin de base (rempli en prod GitHub Pages, vide en local/dev).
// À appliquer aux <a href> et <img src> internes bruts (que Next ne préfixe
// pas automatiquement, contrairement à <Link>/next/image).
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const withBase = (p: string) => (p.startsWith('/') ? `${BASE}${p}` : p);

export const SITE = {
  name: "Cava d'Aliga",
  email: 'magalicontrino@hotmail.fr',
  instagram: { handle: '@cavadaliga_contrino', url: 'https://instagram.com/cavadaliga_contrino' },
  author: 'Mag',
  // Site perso de Mag, à la racine du domaine (ce site vit sur le sous-domaine).
  perso: 'https://magalicontrino.com',
} as const;

// Menu principal — hrefs (les libellés viennent de i18n, même ordre)
// L'ordre voulu par Mag. La casa n'y est plus : elle garde son picto rond dans
// la barre du haut et sa vignette sur l'accueil, mais quitte le menu.
export const NAV = [
  { href: '/preparer-le-voyage' },
  { href: '/famille' },
  { href: '/la-region' },
  { href: '/services-locaux' },
  { href: '/evenements' },
  { href: '/informations-pratiques' },
] as const;

// Les 12 photos de la casa (/public/appart/). Partagées par la page La casa,
// qui les range pièce par pièce, et par les infos pratiques, qui les fait
// défiler : une seule liste, donc une photo ajoutée apparaît aux deux endroits.
export const APPART_ALBUM = Array.from(
  { length: 12 },
  (_, i) => `/appart/appart-${String(i + 1).padStart(2, '0')}.jpg`,
);

// Bandeau d'images défilant — partagé par l'accueil ET la page La casa : une
// seule liste, donc toute retouche se répercute d'un coup sur les deux pages.
// Ordre pensé pour que deux visuels SEMBLABLES (les 2 figuiers de Barbarie) ne
// soient jamais côte à côte — y compris au raccord de boucle (dernier ↔ premier,
// car le bandeau répète cette liste).
export const GALLERY_STRIP = [
  '/deco/figue-barbarie.jpg',
  '/deco/carte-pop.jpg',
  '/deco/spaghetti.jpg',
  '/deco/figue-barbarie-2.jpg',
  '/deco/testa-di-moro.jpg',
  '/deco/glace.jpg',
];

// Galerie — vraies photos dans /public/picture-sicile/, repli /public/deco/
// (chaque image déco utilisée une seule fois). Alt via i18n.galleryAlt.
export const GALLERY: { src: string; deco?: string }[] = [
  { src: '/picture-sicile/mer.jpg', deco: '/deco/glace.jpg' },
  { src: '/picture-sicile/ruelle.jpg', deco: '/deco/spaghetti.jpg' },
  { src: '/picture-sicile/scicli.jpg', deco: '/deco/motif-1.jpg' },
  { src: '/picture-sicile/plage.jpg' },
  { src: '/picture-sicile/coucher.jpg', deco: '/deco/figue-barbarie-2.jpg' },
];
