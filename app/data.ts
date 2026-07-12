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
} as const;

// Menu principal — hrefs (les libellés viennent de i18n, même ordre)
export const NAV = [
  { href: '/' },
  { href: '/preparer-le-voyage' },
  { href: '/informations-pratiques' },
  { href: '/services-locaux' },
  { href: '/la-region' },
  { href: '/contact' },
] as const;

// Cartes d'index — structure (libellés via i18n.indexCards, même ordre).
// Plus de photo ni picto : fond couleur de marque (tone) + numéro typographique.
export const INDEX_CARDS = [
  { href: '/informations-pratiques', tone: 'ink' },
  { href: '/services-locaux', tone: 'terra' },
  { href: '/la-region', tone: 'pink' },
  { href: '/preparer-le-voyage', tone: 'ink' },
] as const;

// Icônes des cartes de chaque page « à blocs » (même ordre que t.pages[x].blocks).
// Les noms correspondent à app/Icon.tsx.
import type { IconName } from './Icon';
export const PAGE_ICONS: Record<'informations-pratiques' | 'services-locaux' | 'la-region', IconName[]> = {
  'informations-pratiques': ['key', 'home', 'info', 'pin'],
  'services-locaux': ['fork', 'bag', 'sun', 'phone'],
  'la-region': ['landmark', 'wave', 'cone', 'compass'],
};

// Galerie — vraies photos dans /public/picture-sicile/, repli /public/deco/
// (chaque image déco utilisée une seule fois). Alt via i18n.galleryAlt.
export const GALLERY: { src: string; deco?: string }[] = [
  { src: '/picture-sicile/mer.jpg', deco: '/deco/glace.jpg' },
  { src: '/picture-sicile/ruelle.jpg', deco: '/deco/spaghetti.jpg' },
  { src: '/picture-sicile/scicli.jpg', deco: '/deco/motif-1.jpg' },
  { src: '/picture-sicile/plage.jpg' },
  { src: '/picture-sicile/coucher.jpg', deco: '/deco/figue-barbarie-2.jpg' },
];
