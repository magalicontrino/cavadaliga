// ────────────────────────────────────────────────────────────────────────
// Les villes de Sicile, pour « Vous êtes où ? ».
//
// Cette liste existe pour une raison précise : le règlement de Nominatim
// (le géocodeur d'OpenStreetMap) INTERDIT de s'en servir comme d'une
// autocomplétion — une requête par lettre tapée. On propose donc à la frappe
// depuis cette liste-ci, qui ne coûte rien et répond instantanément ; et on ne
// dérange leur service qu'à la validation, pour ce qui n'y est pas.
//
// Positions vérifiées une fois chez eux, puis figées ici. Les villages du
// sud-est d'abord — c'est là qu'on est —, puis les grandes villes de l'île.
// Un nom manque ? On l'ajoute, ou on le cherche à la volée : les deux marchent.
// ────────────────────────────────────────────────────────────────────────

export type Ville = { nom: string; lat: number; lon: number };

export const VILLES: Ville[] = [
  // Autour de la maison
  { nom: 'Cava d’Aliga', lat: 36.728, lon: 14.685 },
  { nom: 'Bruca', lat: 36.73, lon: 14.68078 },
  { nom: 'Sampieri', lat: 36.7204, lon: 14.73678 },
  { nom: 'Donnalucata', lat: 36.76279, lon: 14.63722 },
  { nom: 'Scicli', lat: 36.79357, lon: 14.70696 },
  { nom: 'Marina di Ragusa', lat: 36.78395, lon: 14.55449 },
  { nom: 'Punta Braccetto', lat: 36.8167, lon: 14.46851 },
  { nom: 'Pozzallo', lat: 36.72653, lon: 14.84658 },
  { nom: 'Ispica', lat: 36.78587, lon: 14.90764 },
  { nom: 'Modica', lat: 36.85892, lon: 14.7613 },
  { nom: 'Ragusa', lat: 36.92571, lon: 14.73075 },
  { nom: 'Comiso', lat: 36.95073, lon: 14.60746 },
  { nom: 'Vittoria', lat: 36.9515, lon: 14.53049 },
  { nom: 'Chiaramonte Gulfi', lat: 37.03134, lon: 14.70129 },
  { nom: 'Marzamemi', lat: 36.74184, lon: 15.11765 },
  { nom: 'Noto', lat: 36.89089, lon: 15.07065 },
  { nom: 'Avola', lat: 36.90952, lon: 15.135 },
  { nom: 'Siracusa', lat: 37.03158, lon: 15.21243 },
  // Le reste de l'île
  { nom: 'Gela', lat: 37.06644, lon: 14.25024 },
  { nom: 'Caltagirone', lat: 37.2372, lon: 14.5132 },
  { nom: 'Piazza Armerina', lat: 37.38595, lon: 14.36717 },
  { nom: 'Catania', lat: 37.50236, lon: 15.08737 },
  { nom: 'Taormina', lat: 37.85122, lon: 15.28302 },
  { nom: 'Messina', lat: 38.19376, lon: 15.55421 },
  { nom: 'Cefalù', lat: 38.03496, lon: 14.02446 },
  { nom: 'Palermo', lat: 38.11123, lon: 13.35244 },
  { nom: 'Trapani', lat: 37.90037, lon: 12.71163 },
  { nom: 'Agrigento', lat: 37.3123, lon: 13.57465 },
];

/** Sans accents ni casse : « cefalu » doit trouver « Cefalù ». */
const nu = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase()
    .trim();

/** Ce qui COMMENCE par ce qu'on tape — c'est ce qu'on attend en tapant « Donn ». */
export const chercherVilles = (q: string, max = 6): Ville[] => {
  const n = nu(q);
  if (n.length < 2) return [];
  return VILLES.filter((v) => nu(v.nom).startsWith(n)).slice(0, max);
};
