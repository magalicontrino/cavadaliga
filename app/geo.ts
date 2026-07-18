// ────────────────────────────────────────────────────────────────────────
// Le repère : la maison, et de quoi savoir si on est encore dans la région.
//
// Ce fichier portait avant une machinerie qui faisait correspondre une vraie
// position à la carte dessinée — le poster n'étant pas une projection, il
// fallait interpoler entre onze villages, pondérés par l'inverse de la
// distance. Elle a disparu avec le poster : sur une vraie carte, une position
// se pose telle quelle. Un des onze repères était d'ailleurs faux de sept
// kilomètres, et personne ne pouvait le voir.
// ────────────────────────────────────────────────────────────────────────

// La maison, geocodee sur Via Basilicata a Cava d'Aliga. Le point precedent
// (36.728 / 14.685) tombait a une centaine de metres au large : sur la carte,
// l'epingle flottait dans le bleu. Ici, elle est dans sa rue.
export const HOUSE = { lat: 36.72839, lon: 14.68608 };

/** Distance à vol d'oiseau, en km. */
export const distanceKm = (aLat: number, aLon: number, bLat: number, bLon: number) =>
  Math.hypot((aLat - bLat) * 111.2, (aLon - bLon) * 111.2 * Math.cos((36.8 * Math.PI) / 180));

/** Au-delà, on est hors de la zone dessinée : afficher une cible serait mentir. */
export const MAX_KM = 60;
