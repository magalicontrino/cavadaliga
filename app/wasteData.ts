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

export const WASTE: Record<
  WasteKey,
  { icon: IconName; color: string; label: Record<Lang, string>; sub: Record<Lang, string> }
> = {
  organique: {
    icon: 'leaf',
    color: '#6f8f5f',
    label: { fr: 'Déchets organiques', it: 'Rifiuti organici', en: 'Organic waste' },
    sub: { fr: 'Biodéchets', it: 'Umido', en: 'Food waste' },
  },
  papier: {
    icon: 'box',
    color: '#4a6f8f',
    label: { fr: 'Papier & carton', it: 'Carta & cartone', en: 'Paper & cardboard' },
    sub: { fr: 'Cartons pliés', it: 'Cartoni piegati', en: 'Flattened boxes' },
  },
  plastique: {
    icon: 'bottle',
    color: '#d98b3f',
    label: { fr: 'Plastique & métaux', it: 'Plastica & metalli', en: 'Plastic & metals' },
    sub: { fr: 'Bouteilles, canettes', it: 'Bottiglie, lattine', en: 'Bottles, cans' },
  },
  residuel: {
    icon: 'trash',
    color: '#6f6e6e',
    label: { fr: 'Déchets résiduels', it: 'Rifiuti residui', en: 'Residual waste' },
    sub: { fr: 'Non recyclables', it: 'Non riciclabili', en: 'Non-recyclable' },
  },
  verre: {
    icon: 'glass',
    color: '#3f7d7d',
    label: { fr: 'Verre', it: 'Vetro', en: 'Glass' },
    sub: { fr: 'Bouteilles, bocaux', it: 'Bottiglie, barattoli', en: 'Bottles, jars' },
  },
};

// Index 0 = lundi (et non dimanche comme Date.getDay()).
export const WEEK: WasteKey[] = ['organique', 'papier', 'organique', 'plastique', 'organique', 'residuel', 'verre'];

/** Lundi = 0 … dimanche = 6. */
export const mondayIndex = (d: Date) => (d.getDay() + 6) % 7;
