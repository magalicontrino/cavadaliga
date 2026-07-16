// ────────────────────────────────────────────────────────────────────────
// Position réelle → carte illustrée.
//
// La carte est un poster : dessinée à la main, pas à l'échelle. Une formule
// linéaire (lat/lon → x/y) s'écarte jusqu'à 110 px sur 1000, ce qui poserait
// la cible à côté du bon village. On interpole donc entre des points
// d'ancrage — les villages dont on connaît la vraie position ET la position
// dessinée — pondérés par l'inverse de la distance. Résultat : sur un village,
// la cible tombe pile dessus ; entre deux, elle glisse proprement de l'un à
// l'autre. C'est approximatif par nature, et c'est assumé : le but est de
// répondre à « je suis où ? », pas de faire du GPS.
// ────────────────────────────────────────────────────────────────────────

export const HOUSE = { lat: 36.728, lon: 14.685 };

// nom, vraie position, position sur la carte (repère de LocalMap)
const ANCHORS: { lat: number; lon: number; x: number; y: number }[] = [
  { lat: 37.0311, lon: 14.7025, x: 235, y: 250 }, // Chiaramonte Gulfi
  { lat: 36.925, lon: 14.73, x: 300, y: 322 }, // Ragusa
  { lat: 36.8589, lon: 14.7617, x: 470, y: 345 }, // Modica
  { lat: 36.8906, lon: 15.0694, x: 702, y: 360 }, // Noto
  { lat: 37.0755, lon: 15.2866, x: 888, y: 272 }, // Siracusa
  { lat: 36.7906, lon: 14.7022, x: 405, y: 420 }, // Scicli
  { lat: 36.7194, lon: 14.5544, x: 150, y: 502 }, // Marina di Ragusa
  { lat: 36.7527, lon: 14.6477, x: 292, y: 500 }, // Donnalucata
  { lat: 36.728, lon: 14.685, x: 408, y: 494 }, // Cava d'Aliga (la maison)
  { lat: 36.7228, lon: 14.7414, x: 535, y: 476 }, // Sampieri
  { lat: 36.718, lon: 14.75, x: 606, y: 460 }, // Punta Pisciotto
];

/** Distance à vol d'oiseau, en km. */
export const distanceKm = (aLat: number, aLon: number, bLat: number, bLon: number) =>
  Math.hypot((aLat - bLat) * 111.2, (aLon - bLon) * 111.2 * Math.cos((36.8 * Math.PI) / 180));

/** Au-delà, on est hors de la zone dessinée : afficher une cible serait mentir. */
export const MAX_KM = 60;

/**
 * Position réelle → coordonnées de la carte. `null` si on est trop loin
 * de la région pour que la carte veuille dire quoi que ce soit.
 */
export function toMap(lat: number, lon: number): { x: number; y: number } | null {
  if (distanceKm(lat, lon, HOUSE.lat, HOUSE.lon) > MAX_KM) return null;
  let nx = 0;
  let ny = 0;
  let sum = 0;
  for (const a of ANCHORS) {
    const d = distanceKm(lat, lon, a.lat, a.lon);
    if (d < 0.05) return { x: a.x, y: a.y }; // pile sur un village
    const w = 1 / d ** 2.6;
    nx += w * a.x;
    ny += w * a.y;
    sum += w;
  }
  return { x: nx / sum, y: ny / sum };
}
