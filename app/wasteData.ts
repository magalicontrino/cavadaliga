import type { IconName } from './Icon';
import type { Lang } from './localData';

// ────────────────────────────────────────────────────────────────────────
// Tri des déchets à Cava d'Aliga — calendrier des passages.
//
// Source : le schéma fourni par Mag, et VALIDÉ PAR ELLE le 19 juillet 2026.
// Ça compte : c'était jusque-là le seul contenu du site que personne n'avait
// certifié, alors qu'une erreur d'un jour fait rater la collecte à quelqu'un.
// Les bacs se sortent le soir.
//
// Si la commune change les jours, tout se corrige dans WEEK ci-dessous — et il
// faudra une nouvelle validation, pas une déduction.
// ────────────────────────────────────────────────────────────────────────
export type WasteKey = 'organique' | 'papier' | 'plastique' | 'residuel' | 'verre';

/*
 * LES COULEURS DES BACS — Mag : « mets plus de couleur vive, plus gaie, qui
 * rappelle les vacances, et rapproche-toi des couleurs deja utilisees ».
 *
 * Elles viennent donc de la palette du site : le vert tendre et le turquoise du
 * robot, le jaune de l'arbre, le rose de la marque. Seul le gris des residuels
 * reste terne, et c'est voulu : c'est le bac de ce qui ne se recycle pas, il n'a
 * pas a faire envie.
 *
 * LE PICTO PASSE DU BLANC A L'ENCRE, et ce n'est pas un detail de gout. Les
 * anciennes teintes etaient sombres et portaient du blanc — mal : mesure, 2,72
 * sur l'orange et 3,64 sur le vert, pour 4,5 demandes. Deux des cinq bacs
 * etaient donc deja sous la limite AVANT ce changement. Les nouvelles teintes
 * sont claires : l'encre y passe partout entre 4,73 et 9,67.
 *
 * CE QU'ON ACCEPTE ICI ET QU'ON REFUSERAIT AILLEURS : ces cinq teintes sont
 * proches en clarte — 1,09 au plus serre entre le vert et le turquoise. Sur le
 * calendrier, ce serait redhibitoire, parce que la couleur y porte SEULE le
 * sens. Ici chaque tuile a son picto ET son mot ecrit en toutes lettres : la
 * couleur decore, elle n'informe pas. Un lecteur qui ne distingue pas le vert
 * du turquoise lit « Déchets organiques » et « Papier & carton ».
 */
export const WASTE: Record<
  WasteKey,
  { icon: IconName; color: string; label: Record<Lang, string>; sub: Record<Lang, string> }
> = {
  organique: {
    icon: 'leaf',
    color: '#a8d06a',
    label: { fr: 'Déchets organiques', it: 'Rifiuti organici', en: 'Organic waste' },
    sub: { fr: 'Biodéchets', it: 'Umido', en: 'Food waste' },
  },
  papier: {
    icon: 'box',
    color: '#5fdede',
    label: { fr: 'Papier & carton', it: 'Carta & cartone', en: 'Paper & cardboard' },
    sub: { fr: 'Cartons pliés', it: 'Cartoni piegati', en: 'Flattened boxes' },
  },
  plastique: {
    icon: 'bottle',
    color: '#ffd452',
    label: { fr: 'Plastique & métaux', it: 'Plastica & metalli', en: 'Plastic & metals' },
    sub: { fr: 'Bouteilles, canettes', it: 'Bottiglie, lattine', en: 'Bottles, cans' },
  },
  residuel: {
    icon: 'trash',
    color: '#b8b0a8',
    label: { fr: 'Déchets résiduels', it: 'Rifiuti residui', en: 'Residual waste' },
    sub: { fr: 'Non recyclables', it: 'Non riciclabili', en: 'Non-recyclable' },
  },
  verre: {
    icon: 'glass',
    color: '#f06a9b',
    label: { fr: 'Verre', it: 'Vetro', en: 'Glass' },
    sub: { fr: 'Bouteilles, bocaux', it: 'Bottiglie, barattoli', en: 'Bottles, jars' },
  },
};

// Index 0 = lundi (et non dimanche comme Date.getDay()).
export const WEEK: WasteKey[] = ['organique', 'papier', 'organique', 'plastique', 'organique', 'residuel', 'verre'];

/** Lundi = 0 … dimanche = 6. */
export const mondayIndex = (d: Date) => (d.getDay() + 6) % 7;
