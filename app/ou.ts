// ────────────────────────────────────────────────────────────────────────
// « Vous êtes où ? » — trouver un point de départ en tapant.
//
// Mag demandait pourquoi on ne pouvait pas chercher à la frappe. La réponse
// n'était pas « OpenStreetMap est interdit » : ses DONNÉES sont libres. C'est
// Nominatim — le moteur de recherche qu'ils hébergent — dont le règlement
// interdit l'autocomplétion, parce qu'il tourne sur leurs dons.
//
// Photon fait le même travail sur les mêmes données, et il est FAIT pour la
// frappe : c'est son objet même. Sans clé, sans compte. On lui demande d'être
// juste raisonnable — d'où l'attente de 250 ms ci-dessous, et une requête
// abandonnée dès que la suivante part.
//
// Trois couches, dans cet ordre. Chacune rattrape le trou de la précédente :
//   1. NOS adresses — chercher « Bonajuto », c'est vouloir Bonajuto.
//   2. Les villes d'ici — figées dans le fichier, instantanées, hors réseau.
//   3. Photon — tout le reste, jusqu'au numéro de rue. Il peut être lent ou
//      absent ; les deux premières couches, elles, répondent toujours.
// ────────────────────────────────────────────────────────────────────────

import { LOCAL_PLACES } from './localData';
import { COORDS } from './placeCoords';

export type Suggestion = {
  nom: string;
  /** La ligne du dessous : « Scicli », « village », ce qui lève le doute. */
  detail?: string;
  lat: number;
  lon: number;
  /** D'où elle vient — l'icône en dépend, pas le comportement. */
  source: 'lieu' | 'ville' | 'loin';
};

/** L'emprise de nos tuiles. Hors de là, la carte n'a rien à dessiner : on ne
 *  propose pas un point où l'on ne pourrait pas se poser. */
export const BBOX = { ouest: 12.35, sud: 36.6, est: 15.72, nord: 38.35 };

export const dansLEmprise = (lat: number, lon: number) =>
  lat >= BBOX.sud && lat <= BBOX.nord && lon >= BBOX.ouest && lon <= BBOX.est;

export type Ville = { nom: string; lat: number; lon: number };

/**
 * Les villes de Sicile, positions vérifiées une fois puis figées ici.
 * Les villages du sud-est d'abord — c'est là qu'on est —, puis les grandes
 * villes de l'île. Ce qui manque, Photon le trouve.
 */
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

/**
 * Ce qu'on a sous la main : nos adresses, puis les villes d'ici.
 * Sans réseau, sans attente — c'est ce qui s'affiche pendant que Photon
 * réfléchit, et ce qui reste s'il ne répond jamais.
 */
export const chercherIci = (q: string, max = 6): Suggestion[] => {
  const n = nu(q);
  if (n.length < 2) return [];

  // Nos adresses : par le nom, mais aussi par la ville — « Modica » doit
  // remonter la dolceria autant que la ville elle-meme.
  const lieux: Suggestion[] = LOCAL_PLACES.filter((l) => COORDS[l.id])
    .filter((l) => nu(l.name).startsWith(n) || nu(l.name).includes(' ' + n) || nu(l.town).startsWith(n))
    .map((l) => ({ nom: l.name, detail: l.town, lat: COORDS[l.id].lat, lon: COORDS[l.id].lon, source: 'lieu' as const }));

  const villes: Suggestion[] = VILLES.filter((v) => nu(v.nom).startsWith(n)).map((v) => ({
    nom: v.nom,
    lat: v.lat,
    lon: v.lon,
    source: 'ville' as const,
  }));

  return [...lieux, ...villes].slice(0, max);
};

/** Ce que Photon renvoie, réduit à ce qu'on lit. */
type Trait = {
  geometry: { coordinates: [number, number] };
  properties: { name?: string; street?: string; housenumber?: string; city?: string; county?: string; state?: string; osm_value?: string };
};

/**
 * Tout le reste — les villages, les rues, les numéros. Chez Photon.
 * Borné à la Sicile : sans ça, « Roma » nous emmènerait hors de nos tuiles.
 * Le `signal` sert à abandonner en cours de route quand une lettre de plus
 * arrive : sans lui, une vieille réponse lente écraserait la bonne.
 */
export const chercherLoin = async (q: string, signal: AbortSignal, lang: 'fr' | 'it' | 'en' = 'fr', max = 5): Promise<Suggestion[]> => {
  // `lang` n'est pas un detail : sans lui, Photon suit la langue du NAVIGATEUR
  // et rendait « Catane » a un visiteur qui lit le site en italien.
  const url =
    'https://photon.komoot.io/api/?limit=' +
    max +
    `&lang=${lang}` +
    `&bbox=${BBOX.ouest},${BBOX.sud},${BBOX.est},${BBOX.nord}` +
    '&q=' +
    encodeURIComponent(q);
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error(String(r.status));
  const d: { features?: Trait[] } = await r.json();
  return (d.features ?? [])
    .map((f) => {
      const p = f.properties;
      const [lon, lat] = f.geometry.coordinates;
      // Une rue n'a pas de « name » : elle a un « street ». Un numéro non plus.
      const nom = [p.name ?? p.street, p.housenumber].filter(Boolean).join(' ');
      return { nom, detail: p.city ?? p.county ?? p.state, lat, lon, source: 'loin' as const };
    })
    .filter((s) => s.nom && dansLEmprise(s.lat, s.lon)); // bbox laisse parfois passer
};

/** Deux fois le même endroit sous deux couches : on garde le premier, qui
 *  vient de la couche la plus sûre. */
export const sansDoublons = (l: Suggestion[]): Suggestion[] => {
  const vus = new Set<string>();
  return l.filter((s) => {
    const c = nu(s.nom);
    if (vus.has(c)) return false;
    vus.add(c);
    return true;
  });
};
