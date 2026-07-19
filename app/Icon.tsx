'use client';

/**
 * Jeu d'icônes « ligne » maison — style wayfinding élégant (inspiration
 * Streamline Guidance), sans dépendance externe. Trait fin en currentColor,
 * viewBox 24×24, bouts arrondis. Ajouter une entrée = ajouter un cas ici.
 */
export type IconName =
  | 'car'
  | 'hourglass'
  | 'robot'
  | 'chat'
  | 'key'
  | 'volcano'
  | 'window'
  | 'tools'
  | 'cleaver'
  | 'walk'
  | 'home'
  | 'info'
  | 'pin'
  | 'fork'
  | 'bag'
  | 'sun'
  | 'phone'
  | 'landmark'
  | 'wave'
  | 'cone'
  | 'compass'
  | 'droplet'
  | 'citrus'
  | 'leaf'
  | 'instagram'
  | 'map'
  | 'list'
  | 'search'
  | 'calendar'
  | 'vinyl'
  | 'film'
  | 'spotify'
  | 'cart'
  | 'brush'
  | 'target'
  | 'camera'
  | 'box'
  | 'bottle'
  | 'trash'
  | 'glass';

// Tracés bruts (viewBox 24×24) — réutilisables hors du composant, par exemple
// dans un <svg> imbriqué (voir LocalMap).
export const ICON_PATHS: Record<IconName, React.ReactNode> = {
  // Calendrier — les periodes ou la maison est occupee. Deux anneaux en haut,
  // une reglure, et un jour marque : de loin on lit « calendrier » avant de
  // distinguer quoi que ce soit.
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3.5v3M16 3.5v3" />
      <path d="M8 14h2.5" />
    </>
  ),
  // Fenetre a arc BRISE, persiennes dedans — la casa. D'apres la reference
  // choisie par Mag : la baie ogivale des fenetres arabo-normandes, dont
  // l'interieur devient ici des lames de volet plutot qu'un moucharabieh —
  // impossible a rendre a 24 px sans virer au gribouillis.
  //
  // L'arc est a DEUX CENTRES, comme le vrai : deux arcs de meme rayon qui se
  // rejoignent en pointe. Le rayon n'est pas choisi au hasard, il decoule des
  // montants (x=5 et 19), de la naissance (y=11) et du sommet vise (12,3) —
  // equidistance resolue : centres en x=13,07 et 10,93, rayon 8,07. C'est ce
  // qui ferme la pointe exactement sur (12,3) au lieu d'a peu pres.
  //
  // DEUX VANTAUX : c'est le meneau vertical qui le dit, pas le nombre de
  // lames. Sans lui, deux traits horizontaux dans une baie ne racontent rien —
  // avec lui, on lit deux volets qu'on pourrait pousser. Les lames traversent
  // le meneau au lieu de s'interrompre : coupees en six petits tirets, elles
  // se brouillaient a 24 px.
  //
  // Le meneau part de y=5, sous la clef, et non du sommet : monte jusqu'a la
  // pointe, il refermait l'ogive en deux triangles au lieu de la laisser
  // respirer.
  //
  // Les deux poignees sont des traits d'un centieme a bout rond, pas des petits
  // cercles : un cercle de ce diametre se lit comme un trou, le trait donne un
  // point plein. C'est la meme astuce que `info` et `list` dans ce fichier, et
  // elle ne coute rien en trace — l'epaisseur peut donc rester franche.
  window: (
    <>
      <path d="M5 20.5V11a8.07 8.07 0 0 1 7-8 8.07 8.07 0 0 1 7 8v9.5z" />
      <path d="M12 5v15.5" />
      <path d="M7.2 8h9.6" />
      <path d="M7 12h10" />
      <path d="M7 16h10" />
      <path d="M10.6 14h.01M13.4 14h.01" />
    </>
  ),
  // Cle plate — le bricolage. Une silhouette d'outil se lit plus vite qu'un
  // marteau de face, qui tourne vite au maillet de justice a cette taille.
  // Trace ferme d'un seul tenant, comme la goutte ou la feuille du jeu.
  tools: (
    <path d="M15.2 3.4a5 5 0 0 0-6.3 6.3l-5.1 5.1a2.3 2.3 0 0 0 3.3 3.3l5.1-5.1a5 5 0 0 0 6.3-6.3l-2.9 2.9-2.7-.6-.6-2.7z" />
  ),
  // Couperet — la boucherie. La fourchette etant deja prise par « Manger &
  // boire », il fallait un objet, pas un couvert : on ne va pas AU restaurant,
  // on va CHERCHER de la viande.
  cleaver: (
    <>
      <path d="M3.5 5h9a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-9z" />
      <path d="M14 9.5h6.5" />
      <path d="M20.5 8v3" />
    </>
  ),
  // Marcheur — « on peut y aller a pied ». Silhouette en mouvement : jambe
  // avant pliee, bras lance, tete detachee. A 13 px dans une fiche, c'est la
  // POSTURE qu'on reconnait, pas le detail.
  walk: (
    <>
      <circle cx="13.6" cy="4" r="1.9" />
      <path d="M10.4 21.5l2.2-6.6-2.2-2.3.9-4.4 3.3 1.9 2.3 1.4" />
      <path d="M12.6 14.9l2.9 6.6" />
      <path d="M11.3 8.4L8 11.6" />
    </>
  ),
  // Volcan — l'Etna. Un cone tronque (le cratere est ouvert, pas pointu) et
  // deux volutes de fumee : de loin on lit « volcan » avant de distinguer quoi
  // que ce soit, ce qui est tout ce qu'on demande a un picto de tri.
  volcano: (
    <>
      <path d="M2.5 20.5L9.5 9h5l7 11.5z" />
      <path d="M9.5 9h5" />
      <path d="M10.5 6.2c0-1.4 2.5-1.4 2.5-2.8" />
      <path d="M14.5 6.2c0-1 1.6-1 1.6-2" />
    </>
  ),
  // Clé — arrivée & départ
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l8 8M16 16l2-2M18.5 18.5l2-2" />
    </>
  ),
  // Maison — l'appartement. Dessinee pour REMPLIR sa boite (x 3→21, y 3,5→20,5),
  // comme le calendrier et le vinyle : sinon, plus petite dans son cercle et
  // trois traits epars, elle paraissait plus terne a cote d'eux.
  home: (
    <>
      <path d="M3 11L12 3.5l9 7.5" />
      <path d="M5.5 9.5V20.5h13V9.5" />
      <path d="M9.5 20.5v-6h5v6" />
    </>
  ),
  // Info — bon à savoir
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  // La voiture — « se garer ». Vue de profil, deux roues et un pare-brise
  // incline : a 16 px, c'est la silhouette qui se lit, pas le detail.
  car: (
    <>
      <path d="M3 13.5h18" />
      <path d="M5 13.5 7 8h10l2 5.5" />
      <rect x="3" y="13.5" width="18" height="5" rx="1.6" />
      <path d="M7 18.5v1.6M17 18.5v1.6" />
      <path d="M6.5 16h1.2M16.3 16h1.2" />
    </>
  ),
  // Le robot de « Demander ». Une tete carree aux coins tres arrondis — la
  // meme rondeur que les pastilles du site —, deux yeux, une antenne, et une
  // bouche qui est un TRAIT et non une grille : la grille faisait machine a
  // laver a 24 px. Les oreilles le posent de face, sinon la tete flottait.
  robot: (
    <>
      <path d="M12 3.2v2.4" />
      <circle cx="12" cy="2.6" r="0.9" />
      <rect x="4" y="5.8" width="16" height="12.6" rx="4.2" />
      <path d="M9.3 10.4v1.7M14.7 10.4v1.7" />
      <path d="M9.6 15.1h4.8" />
      <path d="M4 10.6H2.4M20 10.6h1.6" />
    </>
  ),
  // Bulle de parole — « Demander ». Une queue vers le bas a gauche pour qu'on
  // lise « on parle » et non « on informe », et trois points : la question est
  // en train de se poser.
  chat: (
    <>
      <path d="M20.5 12.4c0 3.5-3.4 6.3-7.6 6.3-.9 0-1.8-.1-2.6-.4l-4.3 1.6 1.3-3.3c-1.4-1.1-2.3-2.6-2.3-4.2 0-3.5 3.4-6.3 7.6-6.3s7.9 2.8 7.9 6.3Z" />
      <path d="M9.8 12.4h.01M12.9 12.4h.01M16 12.4h.01" />
    </>
  ),
  // Épingle — sur place
  pin: (
    <>
      <path d="M12 21c4-4.5 6-7.6 6-10.5A6 6 0 006 10.5C6 13.4 8 16.5 12 21z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </>
  ),
  // Couverts — manger & boire
  fork: (
    <>
      <path d="M7 3v7a2 2 0 002 2h0v9" />
      <path d="M7 3v5M10 3v5" />
      <path d="M16 3c-1.6 0-2.5 2-2.5 5S15 13 16 13v8" />
    </>
  ),
  // Cabas — courses & marchés
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8a3 3 0 016 0" />
    </>
  ),
  // Soleil — plage & loisirs
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </>
  ),
  // Téléphone — contacts utiles
  phone: (
    <path d="M6 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A15 15 0 014 6a2 2 0 012-2z" />
  ),
  // Édifice à colonnes — villes baroques
  landmark: (
    <>
      <path d="M4 9l8-5 8 5" />
      <path d="M4 9h16" />
      <path d="M6 9v8M10 9v8M14 9v8M18 9v8" />
      <path d="M4 20h16" />
    </>
  ),
  // Vagues — mer & nature
  wave: (
    <>
      <path d="M3 8c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M3 13c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M3 18c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
    </>
  ),
  // Cornet — saveurs
  cone: (
    <>
      <path d="M8 9a4 4 0 018 0" />
      <path d="M7.5 10.5h9L12 21z" />
      <path d="M9 13.5l6 0M10 17l4 0" />
    </>
  ),
  // Boussole — excursions
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  // Goutte — huile d'olive
  droplet: <path d="M12 3.5s6 6.2 6 10.5a6 6 0 01-12 0c0-4.3 6-10.5 6-10.5z" />,
  // Agrume (tranche) — agrumes & épices
  citrus: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" />
    </>
  ),
  // Feuille — plantes & fleurs
  leaf: (
    <>
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" />
      <path d="M5 19c3-3 6-5 9-6.5" />
    </>
  ),
  // Instagram — réseaux
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.6 7.4h.01" />
    </>
  ),
  // Carte — section carte
  map: (
    <>
      <path d="M9 4L3 6.5v13.5L9 17.5l6 2.5 6-2.5V6L15 8.5 9 6z" />
      <path d="M9 4v13.5M15 8.5V22" />
    </>
  ),
  // Liste — la vue en fiches, face à la carte
  list: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  // Loupe — recherche
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l4 4" />
    </>
  ),
  // Vinyle — sons & images
  vinyl: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="0.6" />
      <path d="M12 3.5a8.5 8.5 0 016 2.5" />
    </>
  ),
  // Clap / pellicule — écrans
  film: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 5v14M16 5v14" />
      <path d="M3 9.5h5M3 14.5h5M16 9.5h5M16 14.5h5" />
    </>
  ),
  // Carton — papier & carton
  box: (
    <>
      <path d="M3 8.5l9-4.5 9 4.5v7L12 20l-9-4.5v-7z" />
      <path d="M3 8.5l9 4.5 9-4.5" />
      <path d="M12 13v7" />
    </>
  ),
  // Bouteille plastique — plastique & métaux
  bottle: (
    <>
      <path d="M10 2.5h4v2.2c0 1 .5 1.5 1.2 2.1 1 .9 1.8 1.9 1.8 3.4V19a2.5 2.5 0 01-2.5 2.5h-5A2.5 2.5 0 017 19v-8.8c0-1.5.8-2.5 1.8-3.4C9.5 6.2 10 5.7 10 4.7V2.5z" />
      <path d="M7 11.5h10" />
    </>
  ),
  // Poubelle — déchets résiduels
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4.5h6V7" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  // Bouteille en verre — verre
  glass: (
    <>
      <path d="M9.5 2.5h5v3.2c0 1.3 3 2.6 3 5.3V19a2.5 2.5 0 01-2.5 2.5h-6A2.5 2.5 0 016.5 19v-8c0-2.7 3-4 3-5.3V2.5z" />
      <path d="M9.5 5.7h5" />
    </>
  ),
  // Appareil photo — les photographes
  camera: (
    <>
      <path d="M3 8.5a2 2 0 012-2h2.4l1.3-2.2h6.6L16.6 6.5H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9z" />
      <circle cx="12" cy="12.8" r="3.7" />
    </>
  ),
  /*
   * Sablier — le quiz. Choix de Mag, apres une cible puis un point
   * d'interrogation.
   *
   * Les deux moities se rejoignent exactement en (12,12) : c'est le pincement
   * qui fait lire un sablier plutot que deux triangles poses l'un sur
   * l'autre. Les deux traits du haut et du bas depassent un peu des cotes,
   * comme le bois d'un vrai sablier.
   */
  hourglass: (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M7.5 3v3.3c0 .9.4 1.8 1.1 2.4L12 12l3.4-3.3c.7-.6 1.1-1.5 1.1-2.4V3" />
      <path d="M7.5 21v-3.3c0-.9.4-1.8 1.1-2.4L12 12l3.4 3.3c.7.6 1.1 1.5 1.1 2.4V21" />
    </>
  ),
  // Cible — « vous êtes ici »
  target: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </>
  ),
  // Pinceau — peinture & arts visuels
  brush: (
    <>
      <path d="M20.5 3.5c-1 -1 -2.4 -.7 -3.4 .3L9.8 11.1l2.5 2.5 7.3 -6.7c1 -1 1.4 -2.4 .4 -3.4z" />
      <path d="M8.6 12.3c-1.6 0-2.9 1.3-2.9 2.9 0 1.3-.6 2.2-1.7 2.8 1 1.2 2.5 2 4 2a3.7 3.7 0 003.7-3.7c0-1.6-1.4-4-3.1-4z" />
    </>
  ),
  // Caddie — supermarchés
  cart: (
    <>
      <path d="M3 4h2.3l2.5 11.3a1.5 1.5 0 001.5 1.2h8.3a1.5 1.5 0 001.5-1.2L21 8.2H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </>
  ),
  // Spotify — la playlist partagée
  spotify: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.4 9.2c3-.8 6.4-.5 9.2 1" />
      <path d="M8 12.3c2.4-.6 5.1-.4 7.4.9" />
      <path d="M8.6 15.3c1.9-.5 4-.3 5.8.7" />
    </>
  ),
};

export default function Icon({
  name,
  className = '',
  size = 24,
  strokeWidth = 1.5,
}: {
  name: IconName;
  className?: string;
  size?: number;
  // Trait plus gras quand le picto est petit ou pose sur un aplat de couleur.
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
