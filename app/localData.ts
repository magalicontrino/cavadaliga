import type { IconName } from './Icon';

// ────────────────────────────────────────────────────────────────────────
// Base de données locale — les adresses du sud-est de la Sicile.
// Source unique pour la page « Nos adresses » (grille de fiches + fiche détail).
// Textes visibles dans les 3 langues (fr · it · en).
// ────────────────────────────────────────────────────────────────────────
export type Lang = 'fr' | 'it' | 'en';
export type CatKey = 'chocolat' | 'huile' | 'agrumes' | 'plantes' | 'marche';

export const CATS: Record<CatKey, { icon: IconName; bg: string; label: Record<Lang, string> }> = {
  chocolat: { icon: 'cone', bg: 'linear-gradient(135deg,#7a4a3a,#553025)', label: { fr: 'Chocolat', it: 'Cioccolato', en: 'Chocolate' } },
  huile: { icon: 'droplet', bg: 'linear-gradient(135deg,#b89a4a,#856a2c)', label: { fr: 'Huile d’olive', it: 'Olio d’oliva', en: 'Olive oil' } },
  agrumes: { icon: 'citrus', bg: 'linear-gradient(135deg,#f0568c,#c02057)', label: { fr: 'Agrumes & épices', it: 'Agrumi & spezie', en: 'Citrus & spices' } },
  plantes: { icon: 'leaf', bg: 'linear-gradient(135deg,#6f8f5f,#4f7346)', label: { fr: 'Plantes & fleurs', it: 'Piante & fiori', en: 'Plants & flowers' } },
  marche: { icon: 'bag', bg: 'linear-gradient(135deg,#3a3838,#2e2d2d)', label: { fr: 'Marché', it: 'Mercato', en: 'Market' } },
};

export type LocalPlace = {
  id: string;
  name: string; // nom propre — identique dans les 3 langues
  cat: CatKey;
  town: string;
  url: string; // Google Maps ou site officiel
  instagram?: string;
  responsible: boolean;
  blurb: Record<Lang, string>;
};

export const LOCAL_PLACES: LocalPlace[] = [
  {
    id: 'bonajuto',
    name: 'Antica Dolceria Bonajuto',
    cat: 'chocolat',
    town: 'Modica',
    url: 'https://www.bonajuto.it',
    instagram: 'https://www.instagram.com/bonajuto/',
    responsible: true,
    blurb: {
      fr: 'La plus ancienne chocolaterie de Sicile (depuis 1880). Le fameux chocolat de Modica, travaillé à froid selon une recette d’origine aztèque.',
      it: 'La più antica cioccolateria della Sicilia (dal 1880). Il celebre cioccolato di Modica, lavorato a freddo secondo una ricetta di origine azteca.',
      en: 'Sicily’s oldest chocolate maker (since 1880). The famous Modica chocolate, cold-worked to an Aztec-origin recipe.',
    },
  },
  {
    id: 'cutrera',
    name: 'Frantoi Cutrera',
    cat: 'huile',
    town: 'Chiaramonte Gulfi',
    url: 'https://www.google.com/maps/search/?api=1&query=Frantoi+Cutrera+Chiaramonte+Gulfi',
    instagram: 'https://www.instagram.com/frantoi_cutrera/',
    responsible: true,
    blurb: {
      fr: 'Moulin familial primé de Chiaramonte Gulfi. Huile extra-vierge DOP Monti Iblei (Tonda Iblea) et bottega à visiter sur place.',
      it: 'Frantoio familiare premiato di Chiaramonte Gulfi. Olio extravergine DOP Monti Iblei (Tonda Iblea) e bottega da visitare in loco.',
      en: 'Award-winning family mill in Chiaramonte Gulfi. Extra-virgin DOP Monti Iblei oil (Tonda Iblea), with a shop to visit on site.',
    },
  },
  {
    id: 'gatto',
    name: 'Gatto Frantoio',
    cat: 'huile',
    town: 'Chiaramonte Gulfi',
    url: 'https://www.gattofrantoio.com',
    responsible: true,
    blurb: {
      fr: 'Frantoio de Chiaramonte Gulfi, « ville de l’huile ». Huiles extra-vierges des monts Iblei, vente directe.',
      it: 'Frantoio di Chiaramonte Gulfi, « città dell’olio ». Oli extravergini dei monti Iblei, vendita diretta.',
      en: 'Mill in Chiaramonte Gulfi, the “town of oil”. Extra-virgin oils from the Iblei mountains, direct sale.',
    },
  },
  {
    id: 'marche-scicli',
    name: 'Marché de Scicli',
    cat: 'marche',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Olimpiadi+Scicli',
    responsible: true,
    blurb: {
      fr: 'Marché hebdomadaire le mardi matin, Piazza Olimpiadi. Fruits, légumes, fromages et poisson du jour, directement des producteurs.',
      it: 'Mercato settimanale il martedì mattina, Piazza Olimpiadi. Frutta, verdura, formaggi e pesce del giorno, direttamente dai produttori.',
      en: 'Weekly market on Tuesday mornings, Piazza Olimpiadi. Fruit, vegetables, cheese and the day’s catch, straight from the producers.',
    },
  },
  {
    id: 'marche-marina',
    name: 'Marché fermier de Marina di Ragusa',
    cat: 'marche',
    town: 'Marina di Ragusa',
    url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Vincenzo+Rabito+Marina+di+Ragusa',
    responsible: true,
    blurb: {
      fr: 'Marché des producteurs le vendredi matin (mi-juin à mi-septembre), Piazza Vincenzo Rabito.',
      it: 'Mercato degli agricoltori il venerdì mattina (metà giugno – metà settembre), Piazza Vincenzo Rabito.',
      en: 'Farmers’ market on Friday mornings (mid-June to mid-September), Piazza Vincenzo Rabito.',
    },
  },
  {
    id: 'poisson-donnalucata',
    name: 'Marché au poisson de Donnalucata',
    cat: 'marche',
    town: 'Donnalucata',
    url: 'https://www.google.com/maps/search/?api=1&query=Mercato+ittico+Donnalucata',
    responsible: true,
    blurb: {
      fr: 'Le marché aux poissons du petit port : poisson frais débarqué du jour, réputé dans toute la région.',
      it: 'Il mercato del pesce del piccolo porto: pesce fresco sbarcato in giornata, rinomato in tutta la zona.',
      en: 'The little harbour’s fish market: fresh catch landed that day, renowned across the whole area.',
    },
  },
  {
    id: 'pepinieres-scicli',
    name: 'Pépinières autour de Scicli',
    cat: 'plantes',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=vivaio+Scicli',
    responsible: true,
    blurb: {
      fr: 'Pépinières et fleuristes locaux pour fleurir la maison et le jardin.',
      it: 'Vivai e fioristi locali per abbellire la casa e il giardino.',
      en: 'Local nurseries and florists to brighten the house and garden.',
    },
  },
];
