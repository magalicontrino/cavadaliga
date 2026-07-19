'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CATS, type Lang, type LocalPlace } from './localData';
import { HOUSE } from './geo';
import { COORDS } from './placeCoords';
import Icon, { ICON_PATHS, type IconName } from './Icon';
import { withBase } from './data';
import PlaceCard from './PlaceCard';

/**
 * La carte des adresses.
 *
 * MapLibre n'apporte que le moteur : les données viennent d'un unique fichier
 * .pmtiles posé dans public/, que le navigateur interroge par requêtes de
 * plage — il ne télécharge que les tuiles qu'il affiche. Pas de serveur, pas
 * de clé d'API, pas de quota.
 *
 * Tout est chargé à la demande (import dynamique) : les ~210 Ko de MapLibre ne
 * pèsent que sur cette page, jamais sur les sept autres.
 *
 * Elle ne décide de rien : la page lui passe les lieux déjà triés et cherchés,
 * et le lieu choisi. Elle les montre, et signale les clics.
 */

const INK = '#2e2d2d';
const BG = '#fcf9fa';
/** La mer. Sert deux fois : la couche « ocean », et le fond une fois les
 *  tuiles posees — tout autour de l'ile, c'est elle. */
const MER = '#e88aab';
/** Les petits noms de lieux : presents, mais qui ne volent pas la vedette aux
 *  villes ni aux epingles. C'est le gris du site. */
const MUET = '#6f6e6e';

/**
 * Le fichier de tuiles. Deux choses dans ce nom, aucune n'est cosmetique.
 *
 * « .png » — ce n'est PAS une image, c'est bien du PMTiles. Mais GitHub Pages
 * sert les .pmtiles en application/octet-stream, et son CDN les gzipe a la
 * volee. Les requetes de plage portent alors sur les octets COMPRESSES : on
 * demande le morceau 1000-1099 du fichier, on recoit celui d'un autre, plus
 * court (14 557 460 octets au lieu de 14 562 244). PMTiles n'y comprend rien et
 * rend « Server returned no content-length header ». Une extension d'image
 * donne un content-type que le CDN ne compresse pas — verifie : nos .jpg et
 * .webp passent intacts. On ne peut pas regler les en-tetes de GitHub Pages ;
 * c'est le seul levier qui reste.
 *
 * « v3 » — le navigateur cache les morceaux. Remplacer le fichier sans changer
 * d'URL melangerait l'ancien et le nouveau. Changer le fichier = changer le nom.
 */
const TUILES = '/tuiles/sicile-v4.pmtiles.png';

/**
 * Le fond de promenade de la camera. Il DEBORDE volontairement nos tuiles
 * (12.35,36.6 -> 15.72,38.35), et c'est tout le sujet.
 *
 * Mag : « on doit toujours voir toute la Sicile ». On ne pouvait pas. La camera
 * etait fencee sur la boite des tuiles, qui epouse l'ile : pour voir l'ile en
 * entier sur un ecran large, il faut montrer de la mer sur les cotes — la
 * boite l'interdisait. Mesure au banc, largeur 691 px : la carte ne pouvait
 * montrer que 12.81 -> 15.26 en longitude. Trapani (12.71) restait dehors, et
 * dezoomer ne changeait rien.
 *
 * D'ou ces marges. Elles couvrent les deux extremes : un ecran large (la carte
 * y est 2,7 fois plus large que haute, l'ile 1,3 — il faut de la mer a l'est et
 * a l'ouest) et un telephone (etroit et haut — il en faut au nord et au sud).
 * Verifie au banc : l'ile entiere tient, de Trapani a Syracuse.
 *
 * Et hors des tuiles, on ne voit pas du vide : `pmtiles extract` garde les
 * tuiles ENTIERES qui touchent la boite, et une tuile de bas zoom couvre bien
 * plus large. Les Eoliennes et la pointe de la Calabre sont donc dessinees.
 * Plus loin encore, c'est le fond du style — peint couleur mer, ce qui est vrai
 * tout autour de l'ile.
 *
 * L'ile au zoom 14 pese 60 Mo dans le depot. Ca ne change RIEN au chargement :
 * par requetes de plage, une vue coute une centaine de kilo-octets, qu'on
 * regarde Cava d'Aliga ou Palerme.
 */
const EMPRISE: [[number, number], [number, number]] = [
  [10.3, 35.2],
  [17.8, 39.7],
];

/** Le strict nécessaire de l'API MapLibre, typé à la main. */
type Epingle = { setLngLat: (l: [number, number]) => Epingle; addTo: (m: unknown) => Epingle; remove: () => void };
type Carte = {
  m: { easeTo: (o: object) => void; resize: () => void; fitBounds: (b: [[number, number], [number, number]], o: object) => void };
  Marker: new (o: { element: HTMLElement; anchor?: string; offset?: [number, number] }) => Epingle;
};

/**
 * L'epingle du depart simule : la punaise plantee, avec son anneau au sol.
 * Dessinee ici plutot que prise au jeu d'icones du site — celui-ci est en
 * traits fins, et il faut ici une masse qu'on repere d'un coup sur la carte.
 */
const EPINGLE = `
  <svg viewBox="0 0 32 36" width="32" height="36" aria-hidden="true">
    <ellipse cx="16" cy="30.5" rx="12" ry="4.6" fill="none" stroke="${INK}" stroke-width="3" />
    <path d="M16 1.5c-5.5 0-10 4.5-10 10 0 7.2 10 19 10 19s10-11.8 10-19c0-5.5-4.5-10-10-10z" fill="${INK}" />
    <circle cx="16" cy="11.5" r="4.2" fill="#fff" />
  </svg>`;

/** Un picto du site en HTML brut — les épingles vivent hors de l'arbre React. */
const picto = (name: IconName, size: number) =>
  renderToStaticMarkup(
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </svg>,
  );

/**
 * Ecrire — ou effacer — la distance d'une pastille.
 *
 * Une seule fonction pour les deux moments : quand on cree l'epingle, et quand
 * un depart pose change toutes les distances. Deux codes pour la meme regle
 * finiraient par ne plus dire la meme chose.
 *
 * Vide = pas de span du tout. Une adresse du village n'a rien a annoncer ; un
 * span vide laisserait son filet vertical pendre apres le nom. Et si un depart
 * lui redonne une distance, le span revient.
 */
const poserLesKm = (el: HTMLElement, texte: string) => {
  const actuel = el.querySelector('.cava-glpin-km');
  if (!texte) return actuel?.remove();
  if (actuel) return void (actuel.textContent = texte);
  const km = document.createElement('span');
  km.className = 'cava-glpin-km';
  km.textContent = texte;
  el.append(km);
};

/** Le style : ce qu'on dessine, dans quel ordre, avec quelles couleurs.
 *  Écrit à la main plutôt que repris d'un thème tout fait — c'était la
 *  question posée : peut-on avoir NOTRE fond de carte ? Le voici. */
const style = (tiles: string) => ({
  version: 8 as const,
  glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
  sources: {
    // L'attribution n'est pas décorative : les données sont sous ODbL, le
    // crédit et son lien sont dus. Cliquable, comme tout lien du site.
    p: {
      type: 'vector' as const,
      url: `pmtiles://${tiles}`,
      attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>',
    },
  },
  layers: [
    /* Le fond est le creme du site, et pas la mer — j'avais essaye l'inverse.
     *
     * Le raisonnement se tenait : hors de nos tuiles, tout autour de la Sicile,
     * c'est de la mer. Mais le fond, c'est AUSSI ce qu'on voit tant que les
     * tuiles n'ont pas fini d'arriver — et notre archive pese 60 Mo, lue par
     * morceaux. Resultat : la carte s'ouvrait sur un aplat rose franc, a chaque
     * visite, le temps du chargement. Mag l'a vu tout de suite.
     *
     * Le creme, lui, se tait : c'est la couleur de la page. Le large en creme
     * n'est pas juste, mais on ne le voit presque jamais — les tuiles de bas
     * zoom debordent largement la boite, jusqu'aux Eoliennes et a la Calabre.
     * Une inexactitude qu'on ne voit pas coute moins qu'une gifle a chaque
     * ouverture.
     */
    { id: 'fond', type: 'background' as const, paint: { 'background-color': BG } },
    { id: 'terre', type: 'fill' as const, source: 'p', 'source-layer': 'earth', paint: { 'fill-color': BG } },

    /* Le relief de l'ile — ce qui la sortait de sa blancheur.
     *
     * Vue en entier, la Sicile n'etait qu'une tache creme : rien ne disait les
     * champs, les forets, les villes. Il n'y a pas d'ombrage a en tirer — nos
     * tuiles ne portent aucune altitude —, mais elles portent `landcover` : ce
     * qui COUVRE le sol. Des teintes a peine posees suffisent a lui donner du
     * grain.
     *
     * Cette couche s'arrete au zoom 7 dans nos tuiles, et c'est exactement la
     * ou on regarde l'ile entiere. Au-dela, `landuse` prend le relais.
     */
    {
      id: 'couverture',
      type: 'fill' as const,
      source: 'p',
      'source-layer': 'landcover',
      maxzoom: 8,
      paint: {
        'fill-color': [
          'match',
          ['get', 'kind'],
          'forest', '#dbe1d2',
          'scrub', '#e3e6d9',
          'grassland', '#e9ecdf',
          'farmland', '#f1ebdc',
          'barren', '#eee9e0',
          'urban_area', '#e4e0da',
          'glacier', '#ffffff',
          BG,
        ] as never,
        // Un fondu plutot qu'une disparition seche quand landuse prend la main.
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 6.5, 1, 8, 0] as never,
      },
    },

    /* De pres, l'usage du sol : les parcs, les bois, le bati, les plages.
     * C'etait un aplat unique — tout se valait, donc rien ne se voyait. */
    {
      id: 'usage-du-sol',
      type: 'fill' as const,
      source: 'p',
      'source-layer': 'landuse',
      paint: {
        'fill-color': [
          'match',
          ['get', 'kind'],
          ['park', 'forest', 'wood', 'nature_reserve', 'protected_area', 'village_green', 'grass', 'garden', 'meadow', 'orchard', 'vineyard'], '#dde3d4',
          ['residential', 'commercial', 'retail', 'industrial', 'railway', 'quarry'], '#e7e3dd',
          ['beach', 'sand'], '#f3ead6',
          ['cemetery', 'golf_course', 'pitch', 'playground', 'recreation_ground', 'zoo'], '#e2e7db',
          ['hospital', 'school', 'university', 'college'], '#ebe6e2',
          ['aerodrome', 'military'], '#e9e6e0',
          '#eeece7',
        ] as never,
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 6.5, 0, 8, 1] as never,
      },
    },

    /* La mer, et les plans d'eau qui n'en sont pas.
     *
     * Tout etait peint d'un meme rose : un lac de barrage au milieu des terres
     * se lisait comme un bout de mer. Les eaux interieures prennent un ton plus
     * dense — on les distingue sans quitter la couleur. */
    { id: 'mer', type: 'fill' as const, source: 'p', 'source-layer': 'water', filter: ['==', ['get', 'kind'], 'ocean'] as never, paint: { 'fill-color': MER } },
    /* Les eaux interieures — de PRES seulement.
     *
     * Mag : « quoi, c'est un defaut ? ». Non : ce sont de vrais plans d'eau
     * d'OpenStreetMap, les lits des rivieres des Iblei. Mais vus de loin, la
     * geometrie est simplifiee a l'extreme dans les tuiles : une riviere fine et
     * sinueuse devient un long coin rose bien droit en travers des terres. Ca ne
     * ressemble a rien, et surtout ca ne ressemble pas a de l'eau.
     *
     * A partir du zoom 10, la geometrie redevient fidele et les rivieres
     * ressemblent a des rivieres. Avant, on se tait : mieux vaut ne rien montrer
     * que montrer faux.
     */
    {
      id: 'eaux',
      type: 'fill' as const,
      source: 'p',
      'source-layer': 'water',
      filter: ['!=', ['get', 'kind'], 'ocean'] as never,
      minzoom: 10,
      paint: { 'fill-color': '#e07fa2' },
    },
    /* Les rivieres : des lignes, pas des surfaces — elles n'apparaissaient donc
     * pas du tout. Elles dessinent les vallees des Iblei. */
    {
      id: 'rivieres',
      type: 'line' as const,
      source: 'p',
      'source-layer': 'water',
      filter: ['==', ['geometry-type'], 'LineString'] as never,
      minzoom: 9,
      paint: {
        'line-color': '#dd6f97',
        'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.5, 14, 2.2] as never,
        'line-opacity': 0.75,
      },
    },

    /* Les routes, par importance. Elles etaient toutes du meme blanc et de la
     * meme largeur : l'autoroute de Catane valait le chemin de terre. */
    {
      id: 'routes-petites',
      type: 'line' as const,
      source: 'p',
      'source-layer': 'roads',
      filter: ['in', ['get', 'kind'], ['literal', ['minor_road', 'path', 'pier']]] as never,
      minzoom: 12,
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.6, 14, 2, 17, 7] as never,
      },
    },
    {
      id: 'routes-moyennes',
      type: 'line' as const,
      source: 'p',
      'source-layer': 'roads',
      filter: ['==', ['get', 'kind'], 'major_road'] as never,
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.8, 12, 2.4, 14, 4, 17, 11] as never,
      },
    },
    {
      id: 'routes-grandes',
      type: 'line' as const,
      source: 'p',
      'source-layer': 'roads',
      filter: ['==', ['get', 'kind'], 'highway'] as never,
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1.2, 12, 3.6, 14, 6, 17, 14] as never,
      },
    },
    /* Le train : en traits, et a l'encre. Une ligne blanche de plus se serait
     * confondue avec les routes — c'est justement ce que Mag ne voulait plus. */
    {
      id: 'rail',
      type: 'line' as const,
      source: 'p',
      'source-layer': 'roads',
      filter: ['==', ['get', 'kind'], 'rail'] as never,
      minzoom: 9,
      paint: {
        'line-color': MUET,
        'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.6, 14, 1.4] as never,
        'line-dasharray': [3, 2] as never,
        'line-opacity': 0.7,
      },
    },
    { id: 'batiments', type: 'fill' as const, source: 'p', 'source-layer': 'buildings', minzoom: 14, paint: { 'fill-color': '#e2dfd8' } },
    // Les noms de lieux, par paliers — les grandes villes d'abord, le reste en
    // s'approchant. Sans ca la carte est une jolie forme sans reperes : on voit
    // « ≈ 20 km » sans savoir 20 km de quoi.
    //
    // Un palier = une couche avec son `minzoom`, plutot qu'un seul filtre sur
    // le zoom : dans un filtre, le zoom n'est evalue qu'aux niveaux entiers, et
    // les noms apparaitraient par a-coups en pincant l'ecran.
    //
    // `kind_detail` est une CHAINE — « city », « town », « village ». Le filtre
    // d'avant le comparait a un nombre (`<= 10`) : toujours faux, aucun nom
    // n'est jamais sorti. C'est pour ca que la carte etait muette.
    ...villes([
      // Palerme, Catane, Messine, Syracuse, Raguse — visibles de loin.
      { id: 'villes-grandes', kinds: ['city'], depuis: 0, taille: [7, 12, 13, 19], couleur: INK, poids: 'Noto Sans Medium' },
      // Modica, Scicli, Noto, Vittoria — les chefs-lieux qu'on traverse.
      { id: 'villes-moyennes', kinds: ['town'], depuis: 8.5, taille: [9, 11, 14, 16], couleur: INK, poids: 'Noto Sans Medium' },
      // Donnalucata, Sampieri, Cava d'Aliga — le voisinage.
      { id: 'villages', kinds: ['village'], depuis: 10, taille: [10, 10.5, 14, 14.5], couleur: MUET, poids: 'Noto Sans Regular' },
      // Les hameaux et les quartiers : seulement quand on a le nez dessus.
      { id: 'hameaux', kinds: ['hamlet', 'isolated_dwelling', 'quarter', 'neighbourhood'], depuis: 12.5, taille: [12.5, 10, 16, 13], couleur: MUET, poids: 'Noto Sans Regular' },
    ]),
  ],
});

/** Un palier de noms de lieux. Les quatre se ressemblent trop pour les ecrire
 *  quatre fois : seuls changent le rang, le zoom d'apparition et la taille. */
const villes = (
  paliers: { id: string; kinds: string[]; depuis: number; taille: [number, number, number, number]; couleur: string; poids: string }[],
) =>
  paliers.map(({ id, kinds, depuis, taille, couleur, poids }) => ({
    id,
    type: 'symbol' as const,
    source: 'p',
    'source-layer': 'places',
    minzoom: depuis,
    filter: ['in', ['get', 'kind_detail'], ['literal', kinds]] as never,
    layout: {
      'text-field': ['get', 'name'] as never,
      'text-font': [poids],
      'text-size': ['interpolate', ['linear'], ['zoom'], taille[0], taille[1], taille[2], taille[3]] as never,
      // Le plus peuple gagne quand deux noms se disputent la meme place.
      'symbol-sort-key': ['-', 0, ['coalesce', ['get', 'population_rank'], 0]] as never,
      'text-padding': 4,
    },
    paint: { 'text-color': couleur, 'text-halo-color': BG, 'text-halo-width': 2 },
  }));

export default function PlaceMap({
  places,
  lang,
  labels,
  choisi,
  onChoisir,
  me,
  visible = true,
  onLocate,
  geoAsking = false,
  locateLabel = '',
  onDepart,
  onRetirerDepart,
  onMaison,
  versMaison = 0,
  versDepart = 0,
  depart = null,
  kmLabel,
}: {
  /** Déjà triés et cherchés par la page — la carte ne filtre rien. */
  places: LocalPlace[];
  lang: Lang;
  // Les libellés viennent de la page : ce composant ne doit rien écrire en dur.
  labels: { map: string; badge: string; close: string; site: string; walk: string; mapFailed: string; mapFailedHint: string; house: string; departReset: string };
  choisi: LocalPlace | null;
  onChoisir: (p: LocalPlace | null) => void;
  /** Position réelle du visiteur, s'il l'a demandée. */
  me: { lat: number; lon: number } | null;
  /**
   * La page peut la masquer (bascule carte/liste). On la garde montée — la
   * démonter la rechargerait et lui ferait perdre son zoom — mais masquée son
   * canvas tombe à zéro : il faut le lui dire quand elle revient.
   */
  visible?: boolean;
  /** « Où suis-je ? » — la cible vit sur la carte, c'est là qu'on la cherche. */
  onLocate?: () => void;
  geoAsking?: boolean;
  locateLabel?: string;
  /** Cliquer la carte pose un depart simule : « et si j'etais la ? ». */
  onDepart?: (c: { lat: number; lon: number }) => void;
  /** Retirer le depart pose — on recompte depuis la maison. Declenche en
   *  touchant l'epingle elle-meme : c'est le seul chemin de retour. */
  onRetirerDepart?: () => void;
  /** Ramener la carte sur la maison. */
  onMaison?: () => void;
  /** Change quand la page demande de revenir sur la maison. */
  versMaison?: number;
  /** Incremente quand le depart vient de la RECHERCHE : la carte va s'y poser.
   *  Un depart pose au doigt sur la carte ne l'incremente pas — on regarde deja
   *  l'endroit, la vue ne doit pas sauter sous le doigt. */
  versDepart?: number;
  depart?: { lat: number; lon: number } | null;
  /** La page decide de ce qu'affiche chaque pastille : elle seule sait si l'on
   *  compte depuis la maison (par la route) ou depuis un depart simule. */
  kmLabel: (p: LocalPlace) => string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<unknown>(null);
  const markers = useRef<Epingle[]>([]);
  // id -> element : permet d'allumer l'épingle choisie sans reconstruire les 18
  const pins = useRef(new Map<string, HTMLElement>());
  // « Vous etes ici » et le depart vivent dans leurs propres effets : melanges
  // aux epingles, ils rejouaient le cadrage a chaque clic — et la carte
  // repartait de sa vue de depart au lieu de rester ou l'on regardait.
  const mMe = useRef<Epingle | null>(null);
  const mDepart = useRef<Epingle | null>(null);
  const [state, setState] = useState<'chargement' | 'ok' | 'erreur'>('chargement');
  const [erreur, setErreur] = useState('');
  // La carte n'est construite qu'une fois : sans cette poignee, son ecouteur de
  // clic garderait pour toujours le tout premier onDepart.
  const onDepartRef = useRef(onDepart);
  onDepartRef.current = onDepart;
  // Meme raison : l'ecouteur de clic doit savoir si une fiche est ouverte
  // MAINTENANT, pas si elle l'etait au premier rendu.
  const choisiRef = useRef(choisi);
  choisiRef.current = choisi;
  const onChoisirRef = useRef(onChoisir);
  onChoisirRef.current = onChoisir;

  /**
   * On previent le reste de la page qu'une fiche occupe le bas de l'ecran.
   *
   * La bulle « Demander » est posee en bas a gauche — elle y est pour ne pas
   * recouvrir le « © OpenStreetMap », que la licence des donnees veut lisible.
   * Mais sur telephone, la piste de fiches occupe cette meme bande : la bulle
   * mangeait le bord de la premiere fiche.
   *
   * Un attribut sur <body> plutot qu'un etat partage : la bulle vit dans le
   * layout, tres loin d'ici, et une simple regle CSS (voir theme.css) suffit a
   * l'effacer. Pas de contexte a traverser pour une question de decor.
   */
  useEffect(() => {
    if (choisi) document.body.dataset.ficheCarte = '1';
    else delete document.body.dataset.ficheCarte;
    return () => {
      delete document.body.dataset.ficheCarte;
    };
  }, [choisi]);

  const piste = useRef<HTMLDivElement>(null);
  // La fiche des grands ecrans : on la mesure pour savoir de combien pousser
  // l'epingle qu'elle couvrirait.
  const ficheLarge = useRef<HTMLDivElement>(null);
  // D'ou vient le choix ? Cliquer une epingle doit amener sa fiche ; glisser
  // la piste ne doit surtout PAS la repositionner — sinon on lutte contre le
  // doigt de l'utilisateur, et le geste suivant est ignore.
  const origine = useRef<'epingle' | 'piste'>('epingle');

  /**
   * `places` est un tableau neuf à chaque rendu de la page : s'y fier par
   * IDENTITÉ ferait croire que la liste change sans arrêt, et l'effet qui pose
   * les épingles se rejouerait — en effaçant le choix au passage. On ne se fie
   * donc qu'au CONTENU : cette clé ne bouge que si les lieux changent vraiment.
   */
  const cle = places.map((p) => p.id).join(',');
  /** Ceux qu'on peut poser : sans position réelle, pas d'épingle inventée. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const liste = useMemo(() => places.filter((p) => COORDS[p.id]), [cle]);

  /** Le bouton de la maison : son nom, et sa distance quand un depart est pose.
   *  Sans depart, kmLabel renvoie deja « La maison » : on ne le repete pas. */
  const houseLabel = () => {
    const d = kmLabel({ id: '__maison__', km: 0 } as unknown as LocalPlace);
    return d === labels.house ? labels.house : `${labels.house} — ${d}`;
  };

  /**
   * Tout tenir dans le cadre : les epingles retenues ET la maison, qui est le
   * repere de toutes les distances. Sans elle, on cadrerait sur « Plantes &
   * fleurs » a Raguse sans voir d'ou l'on compte.
   *
   * `resize()` d'abord : la carte a pu grandir depuis son dernier cadrage — en
   * passant de la liste a la carte, ou en tournant le telephone —, et fitBounds
   * calcule sur la taille qu'elle CROIT avoir.
   */
  const cadrer = useCallback(
    (duree: number) => {
      const c = map.current as Carte | null;
      if (!c) return;
      c.m.resize();
      const vus = liste.map((p) => COORDS[p.id]).filter(Boolean);
      const lons = [...vus.map((v) => v.lon), HOUSE.lon];
      const lats = [...vus.map((v) => v.lat), HOUSE.lat];
      c.m.fitBounds(
        [
          [Math.min(...lons), Math.min(...lats)],
          [Math.max(...lons), Math.max(...lats)],
        ],
        // Un seul lieu ? fitBounds irait au zoom maximum : on le retient.
        { padding: 70, maxZoom: 13.5, duration: duree },
      );
    },
    [liste],
  );

  /** Amène une épingle au centre, sans brusquer. */
  const viser = useCallback((p: LocalPlace) => {
    const c = map.current as Carte | null;
    const co = COORDS[p.id];
    if (!c || !co) return;
    // Pas de zoom impose : on ne fait que pousser l'epingle a cote de sa fiche.
    // Il y en avait un — 13 minimum — parce que la camera, fencee sur la boite
    // des tuiles, n'avait aucun jeu pour se decaler : on demandait 188 px, elle
    // en bougeait 18. Les bornes elargies lui rendent ce jeu ; le contournement
    // n'a plus lieu d'etre, et cliquer une epingle ne rapproche plus la carte
    // par surprise.
    c.m.easeTo({ center: [co.lon, co.lat], offset: aCote(), duration: 400 });
  }, []);

  /**
   * De combien pousser l'epingle choisie pour que sa fiche ne la couvre pas.
   *
   * On centrait l'epingle. Mais la fiche se pose PAR-DESSUS la carte — en bas a
   * gauche sur grand ecran, en bandeau sur le telephone —, et le centre tombe
   * dessous : on ouvrait une fiche sur l'epingle qu'elle cachait.
   *
   * On mesure la fiche au lieu de supposer sa taille : sa hauteur depend du
   * texte, des liens, de la langue. Rien n'est devine ici — d'ou l'appel depuis
   * un effet, une fois la fiche dans la page.
   *
   * Le calcul : on vise le milieu de ce qui RESTE de carte a cote de la fiche.
   */
  const aCote = (): [number, number] => {
    const b = box.current;
    if (!b) return [0, 0];
    const R = b.getBoundingClientRect();

    // Telephone : la fiche barre le bas. On remonte dans la bande libre.
    const bandeau = piste.current?.getBoundingClientRect();
    if (bandeau && bandeau.height > 0) {
      const libre = bandeau.top - R.top;
      return [0, Math.round(libre / 2 - R.height / 2)];
    }

    // Grand ecran : la fiche tient la gauche. On decale vers la droite.
    const fiche = ficheLarge.current?.getBoundingClientRect();
    if (fiche && fiche.width > 0) return [Math.round((fiche.right - R.left) / 2), 0];

    return [0, 0]; // pas de fiche : le centre, comme avant
  };

  useEffect(() => {
    let mort = false;
    (async () => {
      try {
        const [gl, pm] = await Promise.all([import('maplibre-gl'), import('pmtiles')]);
        const { Map: GlMap, Marker, NavigationControl } = gl;
        const { Protocol } = pm;
        if (mort || !box.current) return;

        // pmtiles:// — apprend à MapLibre à lire l'archive par requêtes de plage
        const proto = new Protocol();
        gl.addProtocol('pmtiles', proto.tile);

        const m = new GlMap({
          container: box.current,
          style: style(`${location.origin}${withBase(TUILES)}`) as never,
          center: [HOUSE.lon, HOUSE.lat],
          zoom: 11,
          maxBounds: EMPRISE,
          attributionControl: { compact: false },
        });
        // En haut à droite : en bas, les commandes tomberaient derrière la fiche.
        m.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        /**
         * On attend que la carte ait DESSINE, pas seulement chargé son style.
         *
         * `load` signifie « le style est pret » — pas « il y a quelque chose a
         * voir ». Avec une archive de 62 Mo lue par requetes de plage, il
         * s'ecoule plusieurs secondes avant la premiere tuile : le voile de
         * chargement partait, les epingles et les commandes s'affichaient, et
         * la carte restait un aplat creme. Elle avait l'air cassee alors
         * qu'elle travaillait.
         *
         * `idle` ne se declenche qu'une fois toutes les tuiles de la vue
         * rendues. C'est lui qui dit « on peut regarder ».
         *
         * Filet de securite : si `idle` ne vient jamais — reseau coupe au
         * mauvais moment, tuile qui ne repond pas — on montre quand meme la
         * carte au bout de huit secondes. Mieux vaut une carte incomplete
         * qu'un « Chargement… » eternel.
         */
        let filet = 0;
        const montrer = () => {
          if (mort) return;
          window.clearTimeout(filet);
          setState('ok');
          /*
           * Les tuiles sont posees : le fond peut devenir la mer.
           *
           * Il nait creme, et c'est voulu — voir la couche « fond » : le creme
           * est AUSSI ce qu'on voit pendant que l'archive de 60 Mo arrive, et
           * un aplat rose franc a chaque ouverture, Mag l'a vu tout de suite.
           *
           * Mais une fois la carte dessinee, le creme ment : cadree sur tous
           * les lieux, la vue descend sous la limite sud de nos tuiles (36,6°)
           * et posait la une bande creme large comme un sixieme de la carte —
           * « la carte ne remplit pas tout l'espace ». Or sous cette ligne,
           * c'est la Mediterranee. Le passage se fait donc APRES le premier
           * rendu : plus de gifle a l'ouverture, plus de bande morte ensuite.
           */
          try {
            m.setPaintProperty('fond', 'background-color', MER);
          } catch {
            /* Le style a pu etre remplace : ce n'est qu'une couleur. */
          }
        };
        m.on('idle', montrer);
        filet = window.setTimeout(montrer, 8000);
        m.on('error', (e: { error?: { message?: string } }) => {
          if (mort) return;
          setErreur(e?.error?.message ?? 'inconnue');
          setState('erreur');
        });
        /**
         * Un clic sur le fond fait UNE chose, jamais deux — et laquelle depend
         * de ce qui est ouvert.
         *
         * Une fiche est ouverte ? Le clic la ferme, et s'arrete la. C'est le
         * geste que tout le monde a : on clique a cote pour refermer. Poser un
         * depart en meme temps planterait une epingle a chaque fois qu'on veut
         * juste se debarrasser d'une fiche.
         *
         * Rien d'ouvert ? Le clic pose le depart.
         *
         * Le clic sur une epingle, lui, n'arrive jamais ici : il s'arrete sur
         * elle (stopPropagation), sinon il refermerait la fiche qu'il vient
         * d'ouvrir.
         */
        m.on('click', (e: { lngLat: { lat: number; lng: number } }) => {
          if (mort) return;
          if (choisiRef.current) return onChoisirRef.current(null);
          onDepartRef.current?.({ lat: e.lngLat.lat, lon: e.lngLat.lng });
        });
        map.current = { m, Marker };
      } catch (e) {
        if (mort) return;
        setErreur(e instanceof Error ? e.message : String(e));
        setState('erreur');
      }
    })();
    return () => {
      mort = true;
      const c = map.current as { m?: { remove: () => void } } | null;
      c?.m?.remove();
    };
  }, []);

  // Les épingles suivent le filtre. Chacune porte le picto de sa catégorie —
  // le même jeu d'icônes que le reste du site, pour comparer à armes égales.
  useEffect(() => {
    const c = map.current as Carte | null;
    if (!c || state !== 'ok') return;
    onChoisir(null); // la fiche parlerait d'une épingle que le filtre a retirée
    markers.current.forEach((x) => x.remove());
    markers.current = [];
    pins.current.clear();

    liste.forEach((p) => {
      const co = COORDS[p.id]; // garanti par « liste »

      // Un bouton, pas un lien : cliquer ouvre la fiche, on ne quitte pas la
      // page. Le lien vers Google Maps vit DANS la fiche, une fois qu'on sait
      // de quel endroit il s'agit.
      // Le principe Airbnb : l'épingle porte déjà ce qui décide. Chez eux le
      // prix ; ici le nom ET la distance — « ≈ 15 km » tout seul ne disait pas
      // 15 km de QUOI, il fallait cliquer chaque pastille pour le savoir.
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'cava-glpin';
      el.setAttribute('aria-label', `${p.name} — ${p.town}`);
      el.innerHTML = picto(CATS[p.cat].icon, 19);
      // Le nom passe par textContent et pas par innerHTML : « Cava d'Aliga »,
      // « Frantoi Cutrera »… ce sont des noms propres, saisis a la main, et
      // l'apostrophe ou l'esperluette d'un futur nom ne doit pas pouvoir
      // casser la pastille — ni pire.
      const nom = document.createElement('span');
      nom.className = 'cava-glpin-nom';
      nom.textContent = p.name;
      el.append(nom);
      // Pas de distance a dire ? Pas de span : son filet vertical pendrait dans
      // le vide apres le nom. Il reviendra tout seul si un depart pose en donne
      // une — c'est l'effet plus bas qui s'en charge.
      poserLesKm(el, kmLabel(p));
      pins.current.set(p.id, el);
      el.addEventListener('click', (ev) => {
        ev.stopPropagation(); // sinon le clic atteint la carte et referme aussitôt
        origine.current = 'epingle';
        onChoisir(p);
        // Pas de viser() ici : la fiche n'est pas encore dans la page, on ne
        // pourrait pas la mesurer. C'est l'effet plus bas qui recadre, apres.
      });
      markers.current.push(new c.Marker({ element: el }).setLngLat([co.lon, co.lat]).addTo(c.m));
    });

    // La maison — un petit point discret. Sa distance vit sur le bouton, sous
    // la cible : une pastille de plus au milieu des adresses encombrait.
    const h = document.createElement('div');
    h.className = 'cava-glhouse';
    h.title = labels.house;
    // Le picto DANS le point : « la maison » se lit, au lieu de se deviner. Un
    // simple point noir de 13 px se perdait au milieu des pastilles — Mag ne le
    // voyait pas. Un disque a l'encre, le toit en blanc au centre, un anneau
    // clair pour le detacher du fond : c'est le repere de toutes les distances
    // de la page, il a le droit de se voir.
    h.innerHTML = picto('home', 15);
    markers.current.push(new c.Marker({ element: h }).setLngLat([HOUSE.lon, HOUSE.lat]).addTo(c.m));

    cadrer(0);
  }, [state, cle, lang, viser, cadrer]);

  /**
   * Arriver doit montrer TOUT — la maison comprise.
   *
   * La carte se monte cachee derriere la liste, qui est la vue d'accueil. Un
   * conteneur cache mesure 0 x 0 : le cadrage fait au chargement portait sur
   * une fenetre sans dimensions, et on decouvrait la carte posee n'importe ou,
   * des epingles hors champ. On recadre donc quand elle se montre, une fois
   * qu'elle a une taille — c'est la seule fois ou elle en a une.
   */
  useEffect(() => {
    if (!visible || state !== 'ok') return;
    cadrer(300);
  }, [visible, state, cadrer]);

  // « Vous etes ici » — sa propre vie, pour ne pas rejouer le cadrage.
  useEffect(() => {
    const c = map.current as Carte | null;
    if (!c || state !== 'ok') return;
    mMe.current?.remove();
    mMe.current = null;
    if (!me) return;
    const v = document.createElement('div');
    v.className = 'cava-glme';
    mMe.current = new c.Marker({ element: v }).setLngLat([me.lon, me.lat]).addTo(c.m);
  }, [state, me]);

  // Le depart simule. Poser l'epingle ne doit RIEN deplacer d'autre : on reste
  // exactement ou l'on regardait.
  useEffect(() => {
    const c = map.current as Carte | null;
    if (!c || state !== 'ok') return;
    if (!depart) {
      mDepart.current?.remove();
      mDepart.current = null;
      return;
    }
    // On la DEPLACE si elle existe deja. La detruire pour la refaire relancait
    // son animation : elle semblait retomber depuis le point precedent au lieu
    // de se planter la ou l'on venait de cliquer.
    if (mDepart.current) {
      mDepart.current.setLngLat([depart.lon, depart.lat]);
      return;
    }
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'cava-gldepart';
    d.innerHTML = EPINGLE;
    // L'epingle qu'on a plantee, on la retire en la touchant : c'est le seul
    // chemin de retour vers la maison depuis que le bandeau est parti. Sans le
    // stopPropagation, le clic atteindrait la carte dessous et replanterait un
    // depart au meme endroit — on ne pourrait plus jamais l'enlever.
    d.title = labels.departReset;
    d.setAttribute('aria-label', labels.departReset);
    d.addEventListener('click', (ev) => {
      ev.stopPropagation();
      onRetirerDepart?.();
    });
    // « bottom » + le decalage : ce qui doit tomber sur le point, c'est la
    // pointe au centre de l'anneau — pas le bas de l'image.
    mDepart.current = new c.Marker({ element: d, anchor: 'bottom', offset: [0, 5] })
      .setLngLat([depart.lon, depart.lat])
      .addTo(c.m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, depart]);

  // Les distances changent avec le depart — mais on se contente de reecrire le
  // texte des pastilles. Les reconstruire relancerait le cadrage.
  useEffect(() => {
    if (state !== 'ok') return;
    pins.current.forEach((el, id) => {
      const p = liste.find((x) => x.id === id);
      // Meme fonction qu'a la creation : le span apparait, change ou disparait
      // selon qu'il y ait une distance a dire. Viser « le premier span » aurait
      // attrape le NOM et l'aurait ecrase par des kilometres.
      if (p) poserLesKm(el, kmLabel(p));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, depart, cle]);

  // « Ou est la maison ? » — on y va. Declenche par le bouton sous la cible.
  useEffect(() => {
    if (!versMaison || state !== 'ok') return;
    const c = map.current as Carte | null;
    // Au plus pres : on demande a voir LA MAISON, pas la region autour. Nos
    // tuiles s'arretent au zoom 14, mais elles sont vectorielles — au-dela, les
    // formes grandissent sans se pixeliser. 17, c'est la rue.
    c?.m.easeTo({ center: [HOUSE.lon, HOUSE.lat], zoom: 17, duration: 700 });
  }, [versMaison, state]);

  /**
   * Aller voir le depart qu'on vient de CHOISIR dans la recherche.
   *
   * Poser une epingle au doigt ne deplace rien, et c'est voulu : on regarde
   * deja l'endroit, la vue ne doit pas sauter sous le doigt. Mais choisir
   * « Scicli » dans la liste, c'est demander a voir Scicli — sans recadrage, on
   * restait devant la maison avec des distances qui avaient change sans qu'on
   * sache d'ou. D'ou ce compteur, separe de `depart` : c'est l'ORIGINE du
   * depart qui decide, pas le depart lui-meme.
   *
   * Zoom 13 : le village et ses abords, pas la rue — on vient situer un point
   * de comparaison, pas y chercher une porte.
   */
  useEffect(() => {
    if (!versDepart || state !== 'ok' || !depart) return;
    const c = map.current as Carte | null;
    c?.m.easeTo({ center: [depart.lon, depart.lat], zoom: 13, duration: 700 });
    // `depart` volontairement hors des dependances : seul le compteur declenche.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versDepart, state]);

  // L'épingle choisie s'inverse — on doit voir de quel point la fiche parle.
  useEffect(() => {
    pins.current.forEach((el, id) => el.classList.toggle('is-on', id === choisi?.id));
  }, [choisi]);

  // Cliquer une épingle amène sa fiche sous les yeux (téléphone). On ne le
  // fait QUE dans ce sens : si le choix vient du doigt, la piste est déjà là
  // où l'utilisateur l'a mise.
  useEffect(() => {
    const p = piste.current;
    if (!p || !choisi || origine.current !== 'epingle') return;
    const i = liste.findIndex((x) => x.id === choisi.id);
    const el = p.children[i] as HTMLElement | undefined;
    if (!el) return;
    // Instantané, et c'est voulu : un défilement animé émet des événements en
    // traînée qui arrivaient APRÈS le clic suivant et écrasaient le choix. Ici
    // le seul événement émis tombe pile sur la fiche déjà choisie — « on a
    // glissé » n'a donc rien à rechoisir, et les deux sens cessent de lutter.
    p.scrollTo({ left: el.offsetLeft - (p.clientWidth - el.clientWidth) / 2, behavior: 'auto' });
  }, [choisi, liste]);

  /**
   * Un lieu est choisi : on l'amene a cote de sa fiche.
   *
   * Dans un effet, et pas dans les gestes qui choisissent : ici la fiche est
   * DEJA dans la page, donc mesurable. Vaut pour les trois chemins — cliquer
   * une epingle, glisser la piste, cliquer une fiche de la liste. Les trois
   * ouvrent une fiche ; les trois doivent la degager.
   */
  useEffect(() => {
    if (!choisi || state !== 'ok') return;
    viser(choisi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choisi, state]);

  // …et inversement : faire glisser la piste choisit le lieu qui arrive au
  // centre, et la carte suit. C'est le geste d'Airbnb — on passe d'un lieu au
  // suivant sans jamais revenir a la carte.
  const onGlisse = useCallback(() => {
    const p = piste.current;
    if (!p) return;
    const centre = p.scrollLeft + p.clientWidth / 2;
    let best = 0;
    let d = Infinity;
    [...p.children].forEach((el, i) => {
      const e = el as HTMLElement;
      const dd = Math.abs(e.offsetLeft + e.clientWidth / 2 - centre);
      if (dd < d) {
        d = dd;
        best = i;
      }
    });
    const cible = liste[best];
    if (cible && cible.id !== choisi?.id) {
      origine.current = 'piste';
      onChoisir(cible);
    }
  }, [liste, choisi]);

  return (
    <div className="relative h-[68vh] max-h-[620px] overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--cava-line)' }}>
      <div ref={box} className="h-full w-full" />

      {/* La cible, sous les commandes de zoom : sur une carte, « où suis-je ? »
          se cherche sur la carte, pas dans une barre de recherche. */}
      {onLocate && state === 'ok' && (
        <button
          type="button"
          onClick={onLocate}
          disabled={geoAsking}
          aria-label={locateLabel}
          title={locateLabel}
          className="cava-maptarget absolute right-[10px] top-[84px] z-20 flex h-[29px] w-[29px] items-center justify-center disabled:opacity-50"
        >
          <Icon name="target" size={16} />
        </button>
      )}

      {/* La maison, sous la cible : « c'est loin, chez nous ? ». En petit — la
          pastille au milieu des adresses encombrait la carte. */}
      {state === 'ok' && (
        <button
          type="button"
          onClick={() => onMaison?.()}
          aria-label={houseLabel()}
          title={houseLabel()}
          className="cava-maptarget absolute right-[10px] top-[119px] z-20 flex h-[29px] w-[29px] items-center justify-center"
        >
          <Icon name="home" size={16} />
        </button>
      )}

      {/* Téléphone : une piste qu'on feuillette, comme chez Airbnb. La fiche
          choisie est au centre ; on glisse pour passer a la suivante et la
          carte suit.
          Sa hauteur est PLAFONNEE. Libre, elle suivait son texte : sur un
          telephone court (375x667), elle mangeait 80 % de la carte et recouvrait
          la cible et la maison, en haut a droite. Elle s'arrete donc a 58 %, et
          defile en dedans quand le texte deborde. Bonus : aCote() mesure cette
          piste pour placer l'epingle choisie — la bande libre au-dessus est
          d'autant plus large.

          Et TOUTES LES FICHES ONT LA MEME HAUTEUR (items-stretch). Alignees en
          bas, chacune suivait son texte : en glissant d'une adresse a l'autre,
          le haut de la fiche sautait a chaque fois, plus haut, plus bas. La
          piste prend maintenant la hauteur de la plus longue — plafonnee a
          58 % — et les autres s'y tiennent. Un jeu de fiches courtes reste
          donc court : c'est la plus grande qui commande, pas une valeur
          arbitraire. */}
      {choisi && (
        <div
          ref={piste}
          onScroll={onGlisse}
          className="cava-swipe absolute inset-x-0 bottom-3 z-10 flex max-h-[58%] snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-3 pb-1 sm:hidden"
        >
          {liste.map((p) => (
            <div key={p.id} className="max-h-full w-[86%] shrink-0 snap-center overflow-y-auto">
              <PlaceCard place={p} lang={lang} labels={labels} km={kmLabel(p)} onClose={() => onChoisir(null)} />
            </div>
          ))}
        </div>
      )}

      {/* Écran large : une seule fiche, en bas a gauche. */}
      {choisi && (
        <div ref={ficheLarge} className="absolute bottom-4 left-4 z-10 hidden w-[330px] sm:block">
          <PlaceCard place={choisi} lang={lang} labels={labels} km={kmLabel(choisi)} onClose={() => onChoisir(null)} />
        </div>
      )}

      {/* Une carte muette n'aide personne : quand elle rate, on dit quoi, et on
          laisse une porte de sortie — la liste, elle, marche toujours. */}
      {state !== 'ok' && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[14px]" style={{ background: BG, color: 'var(--cava-muted)' }}>
          {state === 'chargement' ? (
            <p className="italic">Chargement de la carte…</p>
          ) : (
            <div className="max-w-[46ch]">
              <p style={{ color: 'var(--cava-ink)', fontWeight: 600 }}>{labels.mapFailed}</p>
              <p className="mt-2 text-[13px]">{labels.mapFailedHint}</p>
              <p className="mt-3 break-all font-mono text-[11px]" style={{ opacity: 0.7 }}>
                {erreur}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
