// ────────────────────────────────────────────────────────────────────────
// MAQUETTE — vraies coordonnées des lieux de LOCAL_PLACES.
//
// La carte du site est un poster dessiné : LOCAL_PLACES ne porte qu'un x/y
// de dessin, pas de position réelle. Une vraie carte en a besoin. Ce fichier
// ne vit que pour la maquette ; si on garde MapLibre, ces valeurs ont
// vocation à rejoindre LOCAL_PLACES et à rendre app/geo.ts inutile.
//
// Provenance, vérifiable :
//   « google »    → lien Google Maps du lieu, résolu jusqu'à sa fiche
//                   (coordonnées !3d/!4d). C'est la position que Google
//                   affiche pour l'établissement.
//   « nominatim » → géocodage OpenStreetMap du nom ou de l'adresse.
//                   Moins précis : sur un supermarché, ça vise le bâtiment ;
//                   sur un marché, la place.
//
// Manque : gatto (Gatto Frantoio). Absent d'OpenStreetMap, et son adresse
// (« Contrada Lago », un lieu-dit sans numéro) ne se géocode pas. À demander
// à Mag plutôt qu'à inventer.
// ────────────────────────────────────────────────────────────────────────

export type PlaceCoord = { lat: number; lon: number; src: 'google' | 'nominatim' };

export const COORDS: Record<string, PlaceCoord> = {
  // Cava d'Aliga et la côte
  blazer: { lat: 36.7289037, lon: 14.6850646, src: 'google' },
  maracaibo: { lat: 36.728109, lon: 14.685499, src: 'google' },
  'gelateria-smile': { lat: 36.7277778, lon: 14.6863889, src: 'google' },
  'be-happy': { lat: 36.7298231, lon: 14.6866401, src: 'google' },
  'lido-bruca': { lat: 36.7340778, lon: 14.6800518, src: 'google' },
  // Bricolage. Zisa : viale I Maggio a Scicli, geocode a la voie. ItalBrico :
  // zone Serrauccelli a Modica, meme precision — le magasin borde la route.
  // Vivai Cintoli — adresse donnee par Mag, coordonnees tirees de son lien
  // Google Maps (la fiche de l'etablissement, pas un geocodage de rue).
  'vivai-cintoli': { lat: 36.7527929, lon: 14.7023483, src: 'google' },
  // Max Centro Commerciale — lien donne par Mag ; coordonnees prises dans la
  // fiche Google de ce lien, donc l'etablissement lui-meme.
  'max-centro': { lat: 36.7491071, lon: 14.6818194, src: 'google' },
  zisa: { lat: 36.77904, lon: 14.68606, src: 'nominatim' },
  italbrico: { lat: 36.81246, lon: 14.77482, src: 'nominatim' },

  // Les cinq tables de Scicli. Coordonnees au niveau de la RUE, pas de la porte :
  // aucune n'est dans OpenStreetMap en tant qu'etablissement, et Photon ne rend
  // rien sur leurs noms. On geocode donc leur voie — precision de l'ordre de
  // cent metres, ce qui situe le quartier sans pretendre a l'adresse exacte.
  // Baqqala suit le palais Beneventano, qui borde sa place.
  baqqala: { lat: 36.7933, lon: 14.70753, src: 'nominatim' },
  'la-grotta': { lat: 36.79404, lon: 14.71195, src: 'nominatim' },
  prosit: { lat: 36.79397, lon: 14.70927, src: 'nominatim' },
  'le-gioie': { lat: 36.79412, lon: 14.70535, src: 'nominatim' },
  'osteria-del-ponte': { lat: 36.79417, lon: 14.70513, src: 'nominatim' },

  rabbuso: { lat: 36.7209608, lon: 14.7407246, src: 'google' },
  giannone: { lat: 36.7626725, lon: 14.6366871, src: 'google' },

  // Marchés
  'marche-scicli': { lat: 36.7821692, lon: 14.6892346, src: 'nominatim' },
  'marche-marina': { lat: 36.7856448, lon: 14.5586843, src: 'nominatim' },
  'poisson-donnalucata': { lat: 36.7630666, lon: 14.6348007, src: 'nominatim' },

  // Supermarchés
  // S.S.G. Market — lien de Mag, coordonnees de sa fiche Google.
  'ssg-market': { lat: 36.7308227, lon: 14.6868863, src: 'google' },
  'coop-superstore': { lat: 36.7468923, lon: 14.6824101, src: 'nominatim' },
  eurospin: { lat: 36.7504564, lon: 14.6812486, src: 'nominatim' },
  'conad-donnalucata': { lat: 36.7637133, lon: 14.6521295, src: 'nominatim' },
  'despar-sampieri': { lat: 36.7205079, lon: 14.7373003, src: 'nominatim' },
  'deco-scicli': { lat: 36.7871465, lon: 14.6966338, src: 'nominatim' },

  // Producteurs & plantes
  bonajuto: { lat: 36.8602541, lon: 14.7599117, src: 'nominatim' },
  cutrera: { lat: 37.0837135, lon: 14.6666207, src: 'nominatim' },
};
