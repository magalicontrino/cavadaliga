import type { IconName } from './Icon';

// ────────────────────────────────────────────────────────────────────────
// Base de données locale — les adresses du sud-est de la Sicile.
// Source unique pour la page « Nos adresses » (grille de fiches + fiche détail).
// Textes visibles dans les 3 langues (fr · it · en).
// ────────────────────────────────────────────────────────────────────────
export type Lang = 'fr' | 'it' | 'en';
export type CatKey = 'huile' | 'agrumes' | 'plantes' | 'marche' | 'resto' | 'supermarche' | 'plage' | 'bricolage' | 'boucherie' | 'randonnee' | 'avoir' | 'tabac' | 'essence';

export const CATS: Record<CatKey, { icon: IconName; bg: string; label: Record<Lang, string> }> = {
  huile: { icon: 'droplet', bg: 'linear-gradient(135deg,#b89a4a,#856a2c)', label: { fr: 'Huile d’olive', it: 'Olio d’oliva', en: 'Olive oil' } },
  agrumes: { icon: 'citrus', bg: 'linear-gradient(135deg,#f0568c,#c02057)', label: { fr: 'Agrumes & épices', it: 'Agrumi & spezie', en: 'Citrus & spices' } },
  plantes: { icon: 'leaf', bg: 'linear-gradient(135deg,#6f8f5f,#4f7346)', label: { fr: 'Plantes & fleurs', it: 'Piante & fiori', en: 'Plants & flowers' } },
  marche: { icon: 'bag', bg: 'linear-gradient(135deg,#3a3838,#2e2d2d)', label: { fr: 'Marchés', it: 'Mercati', en: 'Markets' } },
  resto: { icon: 'fork', bg: 'linear-gradient(135deg,#c05a5a,#8f3f3f)', label: { fr: 'Manger & boire', it: 'Mangiare & bere', en: 'Eat & drink' } },
  supermarche: { icon: 'cart', bg: 'linear-gradient(135deg,#d98b3f,#a86526)', label: { fr: 'Supermarchés', it: 'Supermercati', en: 'Supermarkets' } },
  boucherie: { icon: 'cleaver', bg: 'linear-gradient(135deg,#b5565e,#8c3a41)', label: { fr: 'Boucherie', it: 'Macelleria', en: 'Butcher' } },
  bricolage: { icon: 'tools', bg: 'linear-gradient(135deg,#7b8794,#565f6b)', label: { fr: 'Bricolage', it: 'Ferramenta & fai da te', en: 'DIY & hardware' } },
  randonnee: { icon: 'walk', bg: 'linear-gradient(135deg,#8a9a6b,#5f6b47)', label: { fr: 'Randonnée', it: 'Escursioni', en: 'Hiking' } },
  avoir: { icon: 'landmark', bg: 'linear-gradient(135deg,#7f88a8,#565f7d)', label: { fr: 'À voir', it: 'Da vedere', en: 'Sights' } },
  essence: { icon: 'car', bg: 'linear-gradient(135deg,#5f8f7a,#3f6b58)', label: { fr: 'Station essence', it: 'Distributore', en: 'Petrol station' } },
  // Le tabacchi n'est pas qu'un bureau de tabac : timbres, tickets de bus,
  // disque de stationnement, loto, journaux. Il meritait son rayon plutot que
  // d'etre range sous « supermarche », ou personne ne l'aurait cherche.
  tabac: { icon: 'tabac', bg: 'linear-gradient(135deg,#4a6fa5,#2f4c78)', label: { fr: 'Tabac & journaux', it: 'Tabacchi & giornali', en: 'Tobacconist & press' } },
  plage: { icon: 'sun', bg: 'linear-gradient(135deg,#5aa0a0,#3f7d7d)', label: { fr: 'Plage & loisirs', it: 'Spiaggia & tempo libero', en: 'Beach & leisure' } },
};

export type LocalPlace = {
  id: string;
  name: string; // nom propre — identique dans les 3 langues
  /** La categorie PRINCIPALE : c'est elle qui donne le picto et le libelle
   *  « Ville · Categorie » de la fiche. */
  cat: CatKey;
  /** Les autres rayons ou la fiche doit apparaitre. Un lieu peut se ranger a
   *  deux endroits sans etre duplique : Vendicari est une randonnee ET des
   *  plages, la crique se marche ET s'y baigne. La fiche reste unique, seul le
   *  tri la fait remonter sous plusieurs boutons. */
  aussi?: CatKey[];
  town: string;
  /** TOUJOURS un lien de carte : c'est ce que promet le bouton. Y mettre un
   *  site officiel faisait mentir le libelle « Ouvrir dans Google Maps ». */
  url: string;
  /** Le site officiel, quand il existe — bouton distinct. */
  site?: string;
  instagram?: string;
  responsible: boolean;
  km: number; // distance routière depuis la maison (0 = dans le village)
  // La vraie position vit dans placeCoords.ts, avec sa provenance. Ce fichier
  // portait avant un x/y de dessin : le poster a disparu, eux aussi.
  blurb: Record<Lang, string>;
};

// ── Base de mots ──────────────────────────────────────────────────────
// Les gens cherchent par envie (« pain », « apéro », « glace »), pas par nom
// de commerce. Ces mots — mélangés dans les 3 langues, sans accents — relient
// une envie à une catégorie et/ou à des adresses précises. La page s'en sert
// quand la recherche littérale ne donne rien, pour toujours proposer une piste.
// Pour enrichir : ajouter une ligne, ou des mots à une ligne existante.
export type WordHint = { words: string[]; cat?: CatKey; ids?: string[] };

// Minuscules + accents retirés : « marché » et « marche » doivent se valoir.
export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const SEARCH_WORDS: WordHint[] = [
  { words: ['pain', 'pane', 'bread', 'boulangerie', 'panificio', 'bakery', 'baguette', 'brioche', 'pignolata', 'epicerie', 'alimentari', 'grocery', 'miche', 'pagnotta', 'loaf'], cat: 'supermarche', ids: ['ssg-market', 'giannone'] },
  { words: ['glace', 'gelato', 'gelateria', 'ice cream', 'granita', 'granite', 'cornet', 'sorbet'], ids: ['gelateria-smile'] },
  { words: ['pizza', 'pizzeria', 'pizze'], ids: ['be-happy'] },
  { words: ['arancina', 'arancine', 'arancini', 'friture', 'fritto', 'street food', 'rosticceria'], ids: ['giannone'] },
  { words: ['poisson', 'pesce', 'fish', 'fruits de mer', 'frutti di mare', 'seafood', 'peche', 'port', 'porto'], ids: ['poisson-donnalucata', 'rabbuso'] },
  { words: ['chocolat', 'cioccolato', 'chocolate', 'cacao', 'modica', 'douceur', 'dolci', 'sweets', 'dessert'], ids: ['bonajuto'] },
  { words: ['huile', 'olio', 'oil', 'olive', 'frantoio', 'frantoi', 'dop'], cat: 'huile' },
  { words: ['vin', 'vino', 'wine', 'apero', 'aperitivo', 'aperitif', 'drink', 'bar', 'cocktail', 'biere', 'birra', 'beer', 'verre', 'soir', 'sera'], ids: ['maracaibo', 'blazer'] },
  { words: ['boucherie', 'macelleria', 'butcher', 'viande', 'carne', 'meat', 'boucher', 'salumi', 'charcuterie'], cat: 'boucherie' },
  { words: ['essence', 'carburant', 'station', 'station essence', 'pompe', 'gasoil', 'gazole', 'diesel', 'sans plomb', 'benzina', 'distributore', 'carburante', 'gasolio', 'pompa', 'petrol', 'fuel', 'gas station', 'petrol station', 'unleaded', 'faire le plein', 'plein', 'fare il pieno', 'fill up'], cat: 'essence' },
  // Le tabacchi : on y va rarement pour le tabac. Timbres, tickets de bus,
  // disque de stationnement (cite dans « Se garer »), loto, journaux.
  { words: ['tabac', 'tabacchi', 'tabaccheria', 'tabaccaio', 'tobacconist', 'cigarette', 'cigarettes', 'sigarette', 'clope', 'briquet', 'accendino', 'lighter', 'timbre', 'timbres', 'francobollo', 'francobolli', 'stamp', 'stamps', 'carte postale', 'cartolina', 'postcard', 'poste', 'ticket', 'tickets', 'biglietto', 'biglietti', 'bus', 'autobus', 'disque', 'disque de stationnement', 'disco orario', 'parking disc', 'loto', 'lotto', 'gratter', 'gratta e vinci', 'lottery', 'journal', 'journaux', 'giornale', 'giornali', 'newspaper', 'presse', 'edicola', 'recharge', 'ricarica', 'top up'], cat: 'tabac' },
  { words: ['bricolage', 'brico', 'ferramenta', 'quincaillerie', 'outil', 'outils', 'utensili', 'attrezzi', 'tools', 'hardware', 'diy', 'fai da te', 'scie', 'sega', 'seghetto', 'saw', 'perceuse', 'trapano', 'drill', 'visserie', 'vis', 'viti', 'screws', 'clou', 'chiodi', 'nails', 'peinture', 'vernice', 'paint', 'cheville', 'ampoule', 'lampadina', 'bulb', 'cle', 'chiave'], cat: 'bricolage' },
  { words: ['randonnee', 'randonnée', 'rando', 'marcher', 'sentier', 'sentiero', 'trail', 'hike', 'hiking', 'balade', 'passeggiata', 'trekking', 'canyon', 'gorge', 'crique', 'cala', 'nature'], cat: 'randonnee' },
  { words: ['voir', 'vedere', 'see', 'monument', 'statue', 'statua', 'panorama', 'belvedere', 'belvédère', 'point de vue', 'viewpoint', 'visite', 'visita', 'curiosite'], cat: 'avoir' },
  { words: ['plage', 'spiaggia', 'beach', 'mer', 'mare', 'sea', 'baignade', 'nager', 'swim', 'sable', 'sabbia', 'sand', 'lido', 'transat'], cat: 'plage' },
  { words: ['courses', 'spesa', 'groceries', 'shopping', 'supermarche', 'supermarket', 'supermercato', 'caddie', 'carrello', 'lessive', 'papier'], cat: 'supermarche' },
  { words: ['badiula', 'campagna amica', 'campagna', 'amica'], ids: ['campagna-amica'] },
  { words: ['poisson', 'poissons', 'pesce', 'pescato', 'fish', 'pescheria', 'poissonnerie', 'fishmonger', 'criee', 'mercato ittico', 'ittico', 'peche du jour', 'marche au poisson', 'marche poisson', 'mercato del pesce', 'mercato pesce', 'fish market', 'acheter du poisson', 'comprare pesce', 'buy fish'], ids: ['mercato-pesce'] },
  { words: ['coucher de soleil', 'tramonto', 'sunset', 'apero', 'aperitivo', 'aperitif'], ids: ['lido-bruca'] },
  { words: ['zagarone', 'contrada zagarone'], ids: ['mercato-scicli'] },
  { words: ['piment', 'piments', 'peperoncino', 'peperoncini', 'chili', 'chilli', 'pimente', 'piccante', 'spicy', 'fort',
    'origan', 'origano', 'oregano', 'herbe', 'herbes', 'erbe', 'aromatiche', 'herbs', 'basilic', 'basilico',
    'epice', 'epices', 'spezie', 'spices', 'sel', 'sel de mer', 'sale', 'salt', 'terroir', 'tipici', 'local produce'], cat: 'marche' },
  { words: ['marche', 'mercato', 'market', 'horaire', 'horaires', 'orario', 'orari', 'hours', 'opening', 'heure', 'heures', 'ora', 'ore', 'time', 'quel jour', 'che giorno', 'what day', 'mardi', 'martedi', 'tuesday', 'vendredi', 'venerdi', 'friday', 'paysan', 'contadino', 'farmers', 'circuit court', 'filiera corta', 'matin', 'mattina', 'morning', 'legume', 'verdura', 'vegetables', 'fruit', 'frutta', 'fromage', 'formaggio', 'cheese', 'producteur', 'produttore', 'farmer', 'local', 'bio'], cat: 'marche' },
  // Ce qu'on met dans un panier, produit par produit. Mag a tape « pomme » et
  // n'a rien eu : la table couvrait les ENVIES (pizza, apero, glace) et les
  // rayons, jamais les articles eux-memes. Or on cherche ce qu'on veut acheter,
  // pas le nom du rayon.
  //
  // Les fruits et legumes pointent LES DEUX rayons — Mag : « tu peux pointer
  // aussi vers les marches ». C'est plus juste : un marche est fait pour ca.
  // La meme liste est donc rattachee au supermarche ET au marche. Le
  // supermarche reste en tete parce qu'il ouvre tous les jours et qu'il y en a
  // deux dans le village ; le marche, lui, s'affiche juste a cote, dans
  // « Aussi » — un mardi, c'est la qu'il faut aller.
  { words: ['pomme', 'poire', 'orange', 'citron', 'tomate', 'salade', 'banane', 'fraise', 'raisin', 'peche', 'melon', 'pasteque', 'courgette', 'aubergine', 'oignon', 'ail', 'basilic', 'herbes', 'patate', 'pommes de terre',
    'mela', 'pera', 'arancia', 'limone', 'pomodoro', 'insalata', 'fragola', 'uva', 'pesca', 'melone', 'anguria', 'zucchina', 'melanzana', 'cipolla', 'aglio', 'basilico', 'patata',
    'apple', 'pear', 'lemon', 'tomato', 'salad', 'strawberry', 'grapes', 'peach', 'watermelon', 'courgette', 'aubergine', 'onion', 'garlic', 'basil', 'potato'], cat: 'supermarche' },
  { words: ['pomme', 'poire', 'orange', 'citron', 'tomate', 'salade', 'banane', 'fraise', 'raisin', 'peche', 'melon', 'pasteque', 'courgette', 'aubergine', 'oignon', 'ail', 'basilic', 'herbes', 'patate', 'pommes de terre',
    'mela', 'pera', 'arancia', 'limone', 'pomodoro', 'insalata', 'fragola', 'uva', 'pesca', 'melone', 'anguria', 'zucchina', 'melanzana', 'cipolla', 'aglio', 'basilico', 'patata',
    'apple', 'pear', 'lemon', 'tomato', 'salad', 'strawberry', 'grapes', 'peach', 'watermelon', 'courgette', 'aubergine', 'onion', 'garlic', 'basil', 'potato'], cat: 'marche' },
  // L'epicerie de tous les jours : ca, c'est le supermarche.
  { words: ['lait', 'oeuf', 'oeufs', 'beurre', 'yaourt', 'farine', 'sucre', 'sel', 'poivre', 'pates', 'riz', 'conserve', 'biscuit', 'cereales', 'confiture', 'jus', 'boisson', 'biere', 'soda', 'couche', 'couches', 'savon', 'shampoing', 'dentifrice', 'mouchoirs', 'sac poubelle', 'piles',
    'latte', 'uova', 'burro', 'yogurt', 'farina', 'zucchero', 'sale', 'pepe', 'pasta', 'riso', 'biscotti', 'marmellata', 'succo', 'bibita', 'pannolini', 'sapone', 'dentifricio',
    'milk', 'eggs', 'butter', 'yoghurt', 'flour', 'sugar', 'salt', 'pepper', 'pasta', 'rice', 'jam', 'juice', 'nappies', 'soap', 'toothpaste', 'batteries',
    'brosse a dents', 'brosse', 'dents', 'hygiene', 'gel douche', 'papier toilette', 'essuie tout', 'eponge', 'liquide vaisselle', 'spazzolino', 'igiene', 'carta igienica', 'spugna', 'toothbrush', 'shower gel', 'toilet paper', 'sponge', 'washing up'], cat: 'supermarche' },
  { words: ['fleur', 'fiori', 'flower', 'plante', 'pianta', 'plant', 'jardin', 'giardino', 'garden', 'vivaio', 'pepiniere', 'terrasse'], cat: 'plantes' },
  { words: ['restaurant', 'ristorante', 'trattoria', 'manger', 'mangiare', 'eat', 'diner', 'cena', 'dinner', 'midi', 'pranzo', 'lunch', 'table', 'tavola', 'food'], cat: 'resto' },
  { words: ['cafe', 'caffe', 'coffee', 'petit dejeuner', 'colazione', 'breakfast', 'matin', 'mattina', 'morning', 'expresso', 'cappuccino'], ids: ['gelateria-smile', 'maracaibo'] },
  { words: ['viande', 'carne', 'meat', 'boucherie', 'macelleria', 'butcher', 'charcuterie', 'salumi'], ids: ['giannone'] },
  { words: ['souvenir', 'cadeau', 'regalo', 'gift', 'rapporter', 'offrir', 'specialite', 'specialita'], ids: ['bonajuto'], cat: 'huile' },
  { words: ['enfant', 'bambini', 'kids', 'famille', 'famiglia', 'family', 'gouter', 'merenda'], ids: ['gelateria-smile', 'lido-bruca'] },
];

export const LOCAL_PLACES: LocalPlace[] = [
  {
    id: 'bonajuto',
    name: 'Antica Dolceria Bonajuto',
    cat: 'resto',
    town: 'Modica',
    url: 'https://www.google.com/maps/search/?api=1&query=Antica+Dolceria+Bonajuto+Modica',
    site: 'https://www.bonajuto.it',
    instagram: 'https://www.instagram.com/bonajuto/',
    km: 20,
    responsible: true,
    blurb: {
      fr: 'La plus ancienne chocolaterie de Sicile (depuis 1880). Le fameux chocolat de Modica, travaillé à froid selon une recette d’origine aztèque.',
      it: 'La più antica cioccolateria della Sicilia (dal 1880). Il celebre cioccolato di Modica, lavorato a freddo secondo una ricetta di origine azteca.',
      en: 'Sicily’s oldest chocolate maker (since 1880). The famous Modica chocolate, cold-worked to an Aztec-origin recipe.' },
  },
  {
    id: 'gatto',
    name: 'Gatto Frantoio',
    cat: 'huile',
    town: 'Chiaramonte Gulfi',
    url: 'https://www.google.com/maps/search/?api=1&query=Gatto+Frantoio+Chiaramonte+Gulfi',
    site: 'https://www.gattofrantoio.com',
    km: 35,
    responsible: true,
    blurb: {
      fr: 'Frantoio de Chiaramonte Gulfi, « ville de l’huile ». Huiles extra-vierges des monts Iblei, vente directe.',
      it: 'Frantoio di Chiaramonte Gulfi, « città dell’olio ». Oli extravergini dei monti Iblei, vendita diretta.',
      en: 'Mill in Chiaramonte Gulfi, the “town of oil”. Extra-virgin oils from the Iblei mountains, direct sale.' },
  },
  {
    id: 'vivai-cintoli',
    name: 'Vivai Cintoli',
    cat: 'plantes',
    town: 'Scicli',
    url: 'https://maps.app.goo.gl/X2VCrFrZEK2caPpH9',
    km: 4,
    responsible: false,
    blurb: {
      fr: 'Pépinière sur le viale della Serenità, à Scicli. Plants, arbustes et fleurs pour la terrasse et le jardin.',
      it: 'Vivaio sul viale della Serenità, a Scicli. Piante, arbusti e fiori per la terrazza e il giardino.',
      en: 'Plant nursery on viale della Serenità, in Scicli. Seedlings, shrubs and flowers for the terrace and garden.' },
  },
  {
    id: 'cristo-redentore',
    name: 'Statua del Cristo Redentore',
    cat: 'avoir',
    town: 'Portopalo di Capo Passero',
    url: 'https://maps.app.goo.gl/eWvX9cKM9piZZYmJ9',
    km: 55,
    responsible: false,
    blurb: {
      fr: 'La statue du Christ Rédempteur à Portopalo, face à la mer, près de la pointe sud de la Sicile. On y va pour le point de vue autant que pour la statue.',
      it: 'La statua del Cristo Redentore a Portopalo, di fronte al mare, vicino alla punta sud della Sicilia. Ci si va per il panorama quanto per la statua.',
      en: 'The Christ the Redeemer statue at Portopalo, facing the sea, near Sicily’s southern tip. You go for the view as much as for the statue.',
    },
  },
  {
    id: 'cavagrande',
    name: 'Cavagrande del Cassibile',
    cat: 'randonnee',
    town: 'Avola',
    url: 'https://maps.app.goo.gl/iR4MYCPs6Xo9BANv9',
    km: 70,
    responsible: false,
    blurb: {
      fr: 'Le canyon aux vasques naturelles, côté Avola — une journée entière. La descente se fait par la Scala Cruci, depuis le belvédère d’Avola Antica : raide, longue, et à remonter. La réserve régule ses sentiers et peut les fermer : vérifiez avant de partir.',
      it: 'Il canyon con i laghetti naturali, verso Avola — una giornata intera. Si scende dalla Scala Cruci, dal belvedere di Avola Antica: ripida, lunga, e da risalire. La riserva regola i sentieri e può chiuderli: verificate prima di partire.',
      en: 'The canyon with its natural pools, over towards Avola — a full day out. The descent is by the Scala Cruci from the Avola Antica viewpoint: steep, long, and to be climbed back up. The reserve regulates its paths and may close them: check before setting off.',
    },
  },
  {
    id: 'vendicari',
    name: 'Oasi Faunistica di Vendicari',
    cat: 'randonnee',
    aussi: ['plage'],
    town: 'Noto',
    url: 'https://maps.app.goo.gl/ngWVnascqBZPBeSf8',
    km: 50,
    responsible: false,
    blurb: {
      fr: 'La réserve entre Noto et Pachino : salines, vieille tonnara, oiseaux migrateurs, et des plages qu’on rejoint à pied depuis les entrées. Les sentiers sont plats et sablonneux — c’est la marche la plus facile de la liste. Entrées et horaires réglementés.',
      it: 'La riserva tra Noto e Pachino: saline, vecchia tonnara, uccelli migratori, e spiagge che si raggiungono a piedi dagli ingressi. I sentieri sono piani e sabbiosi — la camminata più facile dell’elenco. Ingressi e orari regolamentati.',
      en: 'The reserve between Noto and Pachino: salt pans, the old tuna works, migrating birds, and beaches reached on foot from the entrances. The paths are flat and sandy — the easiest walk on this list. Entrances and opening hours are regulated.',
    },
  },
  {
    id: 'covo-contrabbandieri',
    name: 'Covo dei contrabbandieri',
    cat: 'randonnee',
    aussi: ['plage'],
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/vzvgZYVvMbR7JJPF7',
    km: 3,
    responsible: false,
    blurb: {
      fr: 'La crique des contrebandiers, sur la côte à l’est du village. On y va par le bord de mer — compter plus que les 2 km à vol d’oiseau, le sentier suit les rochers.',
      it: 'La cala dei contrabbandieri, sulla costa a est del paese. Ci si arriva dal lungomare — conta più dei 2 km in linea d’aria, il sentiero segue gli scogli.',
      en: 'The smugglers’ cove, along the coast east of the village. You get there by the shore — allow more than the 2 km as the crow flies, the path follows the rocks.',
    },
  },
  {
    id: 'lido-bruca',
    name: 'Lido Bruca',
    cat: 'plage',
    town: 'Bruca',
    url: 'https://maps.app.goo.gl/2vfb1wShQXkDd9Ek6',
    km: 2,
    responsible: false,
    blurb: {
      fr: 'La plage de Bruca, juste à l’ouest de Cava d’Aliga. Le lido le plus proche de la maison : sable, transats et de quoi boire un verre. C’est l’endroit parfait pour prendre un verre en regardant le soleil se coucher — la côte regarde plein ouest.',
      it: 'La spiaggia di Bruca, appena a ovest di Cava d’Aliga. Il lido più vicino a casa: sabbia, lettini e qualcosa da bere. È il posto giusto per un aperitivo guardando il tramonto — la costa guarda a ovest.',
      en: 'Bruca beach, just west of Cava d’Aliga. The closest lido to the house: sand, sunbeds and somewhere for a drink. It is the place for a drink while the sun goes down — the coast faces due west.' },
  },
  {
    id: 'leroy-merlin-catania',
    name: 'Leroy Merlin Catania',
    cat: 'bricolage',
    town: 'Catania',
    url: 'https://maps.app.goo.gl/3YQNbPr48kNiQnjSA',
    km: 110,
    responsible: false,
    blurb: {
      fr: 'La grande surface de bricolage la plus proche — mais à Catane, donc un vrai déplacement. Pour ce qui ne se trouve pas dans la province : gros outillage, matériaux, cuisine, jardin. Il n’y a pas d’enseigne de cette taille du côté de Raguse.',
      it: 'Il grande magazzino di bricolage più vicino — ma a Catania, quindi un vero viaggio. Per ciò che non si trova in provincia: attrezzatura pesante, materiali, cucina, giardino. Non c’è un’insegna di queste dimensioni dalle parti di Ragusa.',
      en: 'The nearest big-box DIY store — but in Catania, so a proper trip. For what the province cannot supply: heavy tools, materials, kitchens, garden. There is no store of this size around Ragusa.',
    },
  },
  {
    id: 'max-centro',
    name: 'Max Centro Commerciale',
    cat: 'bricolage',
    town: 'Scicli',
    url: 'https://maps.app.goo.gl/iua5jUqR8fYQYVga9',
    km: 3,
    responsible: false,
    blurb: {
      fr: 'Le grand bazar de la route de Scicli, à 2 km. Un peu de tout : outillage, quincaillerie, rangement, cuisine, jardin, papeterie. Quand on ne sait pas où trouver un objet, c’est ici qu’on commence.',
      it: 'Il grande bazar sulla strada di Scicli, a 2 km. Un po’ di tutto: utensili, ferramenta, contenitori, cucina, giardino, cartoleria. Quando non si sa dove trovare un oggetto, si comincia da qui.',
      en: 'The big general store on the Scicli road, 2 km away. A little of everything: tools, hardware, storage, kitchen, garden, stationery. When you have no idea where to find something, start here.' },
  },
  // Le marche de Scicli. MARDI, en bordure de ville — et il a fallu deux
  // corrections pour en arriver la.
  //
  // J'avais d'abord ecrit samedi, au Largo Gramsci, sur la foi de deux pages
  // de la commune et d'un article de presse. Ils dataient de 2020 et 2023.
  // Mag a dit mardi ; la presse locale de mai 2026 parle du « mercato rionale
  // del martedi » a contrada Zagarone ; Mag a ensuite precise « au bord de
  // Scicli », et les articles de 2026 sur le financement de cette zone la
  // situent justement « alla periferia di Scicli ». Le marche a donc quitte le
  // centre pour l'aire de foire, entre 2023 et aujourd'hui.
  //
  // La lecon, deux fois la meme : une source officielle mais vieille ne bat pas
  // une source recente, et surtout pas quelqu'un qui y va.
  //
  // PAS DE COORDONNEES : contrada Zagarone est absente d'OpenStreetMap —
  // Nominatim comme Photon rendent le vide, y compris sur l'adresse postale
  // « Contrada Zagarone snc, 97018 Scicli ». Le lien de carte est donc une
  // RECHERCHE, qui trouvera l'endroit sans que j'aie a inventer un point. Le
  // km reste celui du centre de Scicli, l'aire etant a sa lisiere.
  //
  // Les HORAIRES ne sont donnes que par un annuaire de sorties — 8 h-13 h —,
  // c'est-a-dire par le genre de source qui m'avait fait ecrire « mardi matin,
  // Piazza Olimpiadi » la premiere fois. Le texte s'en tient donc a l'usage
  // sicilien, qu'on ne risque pas de faire mentir.
  {
    id: 'mercato-scicli',
    name: 'Mercato settimanale di Scicli',
    cat: 'marche',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Mercato+non+alimentare+Via+Ignazio+Emmolo+Scicli+RG',
    km: 8,
    responsible: true,
    blurb: {
      fr: 'Le marché hebdomadaire de Scicli : tous les mardis de l’année, de 8 h à 13 h, à contrada Zagarone, du côté de la via Ignazio Emmolo, en bordure de ville. Alimentation, fruits et légumes, produits du terroir, gastronomie — et de l’habillement. Les horaires peuvent bouger avec la saison : au moindre doute, la mairie de Scicli renseigne.',
      it: 'Il mercato settimanale di Scicli: ogni martedì dell’anno, dalle 8 alle 13, in contrada Zagarone, dalle parti di via Ignazio Emmolo, ai margini della città. Alimentari, frutta e verdura, prodotti tipici, gastronomia — e abbigliamento. Gli orari possono cambiare con la stagione: nel dubbio, il Comune di Scicli informa.',
      en: 'Scicli’s weekly market: every Tuesday of the year, 8 am to 1 pm, at contrada Zagarone, off via Ignazio Emmolo, on the edge of town. Food, fruit and vegetables, local produce, delicatessen — and clothing. Hours can shift with the season: when in doubt, Scicli town hall will tell you.' },
  },
  {
    id: 'baqqala',
    name: 'Baqqalà',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://share.google/DjeaG1WjfEn4wqSag',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Restaurant de poisson dans le centre historique de Scicli, contre le palais Beneventano. Une terrasse, et la pêche du jour travaillée finement.',
      it: 'Ristorante di pesce nel centro storico di Scicli, accanto a Palazzo Beneventano. Una terrazza, e il pescato del giorno lavorato con finezza.',
      en: 'Fish restaurant in Scicli’s old town, beside Palazzo Beneventano. A terrace, and the day’s catch handled with care.' },
  },
  {
    id: 'la-grotta',
    name: 'La Grotta',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://share.google/b2xQLAvjOn36ERcnV',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Une salle creusée dans la roche de la colline — d’où le nom. Pizzas au feu de bois et plats de poisson, dans un décor qu’on ne trouve nulle part ailleurs.',
      it: 'Una sala scavata nella roccia della collina — da qui il nome. Pizze al forno a legna e piatti di pesce, in un ambiente che non si trova altrove.',
      en: 'A room carved into the hillside rock — hence the name. Wood-fired pizzas and fish dishes, in a setting you will not find anywhere else.' },
  },
  {
    id: 'prosit',
    name: 'Prosit Sicilian Bistrot',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://share.google/tCRlL5ZF2uOAnJs03',
    km: 8,
    responsible: true,
    blurb: {
      fr: 'Un ancien dammuso devenu bistrot, du petit déjeuner au dîner. Produits de saison, recettes d’ici et vins naturels — c’est la maison qui va les chercher.',
      it: 'Un antico dammuso diventato bistrot, dalla colazione alla cena. Prodotti di stagione, ricette di qui e vini naturali — cercati uno per uno.',
      en: 'An old dammuso turned bistro, from breakfast through dinner. Seasonal produce, local recipes and natural wines, each sought out by hand.' },
  },
  {
    id: 'le-gioie',
    name: 'Le Gioie — Posto Siciliano',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://share.google/vcm6YDc198fVBkYd6',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Une dizaine de tables sur une petite place, à deux pas de San Giovanni Evangelista. Cuisine sicilienne de tous les jours, sans esbroufe.',
      it: 'Una decina di tavoli su una piazzetta, a due passi da San Giovanni Evangelista. Cucina siciliana di ogni giorno, senza fronzoli.',
      en: 'A dozen tables on a small square, steps from San Giovanni Evangelista. Everyday Sicilian cooking, no fuss.' },
  },
  {
    id: 'osteria-del-ponte',
    name: 'Osteria del Ponte',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://share.google/XJgr8vFbZDtvox1lu',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Osteria et pizzeria, cuisine sicilienne simple à base de produits du coin. L’adresse où l’on mange bien sans y penser.',
      it: 'Osteria e pizzeria, cucina siciliana semplice con prodotti a chilometro zero. L’indirizzo dove si mangia bene senza pensarci.',
      en: 'Osteria and pizzeria, plain Sicilian cooking from nearby producers. The place you eat well without giving it thought.' },
  },
  {
    id: 'rabbuso',
    name: 'Rabbuso trattoria di mare',
    cat: 'resto',
    town: 'Sampieri',
    url: 'https://maps.app.goo.gl/LpVKX3PPtxC5ncvw6',
    km: 6,
    responsible: false,
    blurb: {
      fr: 'Trattoria de poisson à Sampieri, face à la mer. Le poisson du jour, simplement cuisiné.',
      it: 'Trattoria di mare a Sampieri, di fronte al mare. Il pesce del giorno, cucinato semplicemente.',
      en: 'Seafood trattoria in Sampieri, facing the sea. The day’s catch, simply cooked.' },
  },
  {
    /*
     * La station essence, decrite par Mag et par elle seule : « juste dans la
     * rue principale en haut de la maison ». Pas de nom, pas de numero — donc
     * ni l'un ni l'autre ici. Le lien est une RECHERCHE cartographique, pas
     * une adresse inventee, et le texte donne le repere qui sert vraiment sur
     * place : la rue principale, en montant.
     */
    id: 'essence-cava',
    name: 'La station essence du village',
    cat: 'essence',
    town: 'Cava d\u2019Aliga',
    url: 'https://www.google.com/maps/search/?api=1&query=distributore+carburante+Cava+d%27Aliga+Scicli+RG',
    km: 0,
    responsible: false,
    blurb: {
      fr: 'Dans la rue principale, en haut de la maison — on y monte à pied. C’est la plus proche de loin ; la suivante demande la voiture.',
      it: 'Sulla via principale, sopra la casa — ci si arriva a piedi. È di gran lunga la più vicina; per la successiva serve l’auto.',
      en: 'On the main street, up above the house — walkable. By far the closest one; the next needs the car.' },
  },
  {
    // Adresse donnee par Mag (lien Google), verifiee : Via Leone Tolstoj est
    // bien a Cava d'Aliga — la meme rue que Mormina Gas. C'est donc le
    // tabacchi du village, a pied.
    id: 'lo-bartolo',
    name: 'Bar Lo Bartolo',
    cat: 'tabac',
    aussi: ['resto'],
    town: 'Cava d\u2019Aliga',
    url: 'https://www.google.com/maps/search/?api=1&query=Bar+Lo+Bartolo+Via+Tolstoj+7+Scicli+RG',
    km: 0,
    responsible: false,
    blurb: {
      fr: 'Le bar-tabac du village, Via Tolstoj — la rue de Mormina Gas. On y trouve ce qu’un tabacchi italien vend : timbres, tickets de bus, disque de stationnement, loto, journaux. Et le café au comptoir.',
      it: 'Il bar-tabacchi del paese, in Via Tolstoj — la strada di Mormina Gas. C’è quello che vende un tabacchi: francobolli, biglietti dell’autobus, disco orario, lotto, giornali. E il caffè al banco.',
      en: 'The village bar-tabacchi, on Via Tolstoj — Mormina Gas’s street. It sells what an Italian tabacchi sells: stamps, bus tickets, the parking disc, lottery, newspapers. And coffee at the counter.' },
  },
  {
    /*
     * Le marche au poisson de Donnalucata. Il n'etait qu'une ligne dans la
     * liste des marches : ni distance, ni epingle, introuvable par le chat et
     * absent de la carte. Lien donne par Mag ; OpenStreetMap le connait sous
     * « Mercato Ittico all'aperto », ce qui donne l'epingle.
     */
    id: 'mercato-pesce',
    name: 'Mercato del pesce di Donnalucata',
    cat: 'marche',
    town: 'Donnalucata',
    url: 'https://www.google.com/maps/search/?api=1&query=Mercato+del+pesce+Donnalucata+Scicli+RG',
    km: 6,
    responsible: true,
    blurb: {
      fr: 'Le marché au poisson, en plein air, sur le port de Donnalucata. On y achète la pêche du jour à ceux qui l’ont sortie — le matin tôt, et ça se termine quand tout est vendu.',
      it: 'Il mercato ittico, all’aperto, sul porto di Donnalucata. Si compra il pescato del giorno da chi l’ha tirato su — la mattina presto, e finisce quando è tutto venduto.',
      en: 'The open-air fish market on Donnalucata harbour. You buy the day’s catch from the people who landed it — early morning, and it ends when everything is sold.' },
  },
  {
    /*
     * Le marche paysan du vendredi, donne par Mag avec sa source : la page
     * du Comune di Scicli. C'est la seule adresse du site dont la source soit
     * la commune elle-meme — elle a donc droit au bouton « Site officiel ».
     *
     * Le telephone du service Culture et Tourisme n'y figure pas : aucun
     * numero ne s'affiche sur ce site.
     */
    id: 'campagna-amica',
    name: 'Mercato Campagna Amica',
    cat: 'marche',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Via+Badiula+Scicli+RG',
    site: 'https://www.comune.scicli.rg.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/10513',
    km: 8,
    responsible: true,
    blurb: {
      fr: 'Le marché paysan, tous les vendredis matin de 8 h à 13 h, sur le terre-plein au-dessus du parking de via Badiula. On y rencontre les producteurs eux-mêmes, en circuit court : c’est le marché à privilégier si vous voulez acheter local.',
      it: 'Il mercato contadino, ogni venerdì mattina dalle 8 alle 13, nell’area sopra il parcheggio di via Badiula. Si incontrano direttamente i produttori, a filiera corta: è il mercato da preferire per comprare locale.',
      en: 'The farmers’ market, every Friday morning from 8 am to 1 pm, on the ground above the via Badiula car park. You meet the growers themselves, straight from the farm — the one to choose if you want to buy local.' },
  },
  {
    id: 'giannone',
    name: 'Gastronomia Giannone',
    cat: 'resto',
    town: 'Donnalucata',
    url: 'https://maps.app.goo.gl/7TnYnMFyBySg1LXP9',
    km: 7,
    responsible: false,
    blurb: {
      fr: 'Gastronomia et boucherie du côté de Donnalucata. Les arancine y sont excellentes : passez le matin pour les commander.',
      it: 'Gastronomia e macelleria dalle parti di Donnalucata. Le arancine sono ottime: passate la mattina per ordinarle.',
      en: 'Deli and butcher over towards Donnalucata. The arancine are excellent — drop by in the morning to order them.' },
  },
  {
    id: 'spiaggia-cava-daliga',
    name: 'Spiaggia di Cava d’Aliga',
    cat: 'plage',
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/7jSQUD6jyjv2Khzp8',
    km: 0.1,
    responsible: false,
    blurb: {
      fr: 'La plage du village, à 70 m de la porte. C’est la plus proche de toutes nos adresses — on y descend en maillot.',
      it: 'La spiaggia del paese, a 70 m dalla porta. È la più vicina di tutti i nostri indirizzi — ci si scende in costume.',
      en: 'The village beach, 70 m from the door. The closest of all our addresses — you walk down in your swimsuit.',
    },
  },
  {
    id: 'maracaibo',
    name: 'Maracaibo',
    cat: 'resto',
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/KMRmcciNxkvM8Kf8A',
    km: 0,
    responsible: false,
    blurb: {
      fr: 'Bar-restaurant à Cava d’Aliga, à deux pas de la maison.',
      it: 'Bar-ristorante a Cava d’Aliga, a due passi da casa.',
      en: 'Bar-restaurant in Cava d’Aliga, steps from the house.',
    },
  },
  {
    id: 'blazer',
    name: 'Blazer',
    cat: 'resto',
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/DxvsZbth8ia8tmHXA',
    km: 0,
    responsible: false,
    blurb: {
      fr: 'Bar & lounge au cœur de Cava d’Aliga.',
      it: 'Bar & lounge nel cuore di Cava d’Aliga.',
      en: 'Bar & lounge in the heart of Cava d’Aliga.',
    },
  },
  {
    id: 'gelateria-smile',
    name: 'Bar Gelateria Smile',
    cat: 'resto',
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/XADZ7nPhhS3iAaPg7',
    km: 0,
    responsible: false,
    blurb: {
      fr: 'Bar et glacier à Cava d’Aliga — glaces, granites et cafés.',
      it: 'Bar e gelateria a Cava d’Aliga — gelati, granite e caffè.',
      en: 'Bar and gelateria in Cava d’Aliga — ice cream, granita and coffee.',
    },
  },
  {
    id: 'be-happy',
    name: 'Pizzeria Be Happy',
    cat: 'resto',
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/7bWbtWqT9zo1D6EA9',
    km: 0,
    responsible: false,
    blurb: {
      fr: 'Pizzeria à Cava d’Aliga, tout près de la maison.',
      it: 'Pizzeria a Cava d’Aliga, vicinissima a casa.',
      en: 'Pizzeria in Cava d’Aliga, very close to the house.',
    },
  },
  {
    id: 'carnico',
    name: 'Carnicò',
    cat: 'boucherie',
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/SSrHgt2GvoQ3DCNX9',
    km: 0.3,
    responsible: false,
    blurb: {
      fr: 'La boucherie du village, à 280 m de la maison. On y va à pied.',
      it: 'La macelleria del paese, a 280 m da casa. Ci si va a piedi.',
      en: 'The village butcher, 280 m from the house. You walk there.' },
  },
  {
    id: 'ssg-market',
    name: 'S.S.G. Market',
    cat: 'supermarche',
    town: 'Cava d’Aliga',
    url: 'https://maps.app.goo.gl/TLhac9uCQVuFuB7K8',
    km: 0.3,
    responsible: false,
    blurb: {
      fr: 'L’épicerie du village, viale della Pace, à 280 m de la maison. La plus proche de tous : celle qu’on fait à pied quand il manque quelque chose. Et on y trouve du pain — pas la peine d’aller plus loin pour ça.',
      it: 'Il market del paese, viale della Pace, a 280 m da casa. Il più vicino di tutti: quello che si fa a piedi quando manca qualcosa. E c’è il pane — non serve andare più lontano per quello.',
      en: 'The village grocery, viale della Pace, 280 m from the house. The closest of them all — the one you walk to when something is missing. And it has bread, so there is no need to go further for that.' },
  },
  {
    id: 'coop-superstore',
    name: 'Coop Superstore',
    cat: 'supermarche',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Coop+Superstore+Scicli',
    km: 3,
    responsible: false,
    blurb: {
      fr: 'Le grand supermarché le plus proche, sur la route de Scicli. Le plus pratique pour les grosses courses en arrivant.',
      it: 'Il grande supermercato più vicino, sulla strada per Scicli. Il più comodo per la spesa grossa all’arrivo.',
      en: 'The nearest big supermarket, on the road to Scicli. The easiest option for a big shop when you arrive.' },
  },
  {
    id: 'eurospin',
    name: 'Eurospin',
    cat: 'supermarche',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Eurospin+Scicli',
    km: 3,
    responsible: false,
    blurb: {
      fr: 'Supermarché discount sur la route de Scicli, à côté du Coop. Pour les basiques à petit prix.',
      it: 'Supermercato discount sulla strada per Scicli, accanto alla Coop. Per i prodotti di base a poco prezzo.',
      en: 'Discount supermarket on the road to Scicli, next to the Coop. For basics at low prices.' },
  },
  {
    id: 'conad-donnalucata',
    name: 'Conad',
    cat: 'supermarche',
    town: 'Donnalucata',
    url: 'https://www.google.com/maps/search/?api=1&query=Conad+Donnalucata',
    km: 7,
    responsible: false,
    blurb: {
      fr: 'Supermarché du côté de Donnalucata, à combiner avec le marché au poisson du port.',
      it: 'Supermercato dalle parti di Donnalucata, da abbinare al mercato del pesce del porto.',
      en: 'Supermarket over towards Donnalucata — combine it with the harbour fish market.' },
  },
  {
    id: 'despar-sampieri',
    name: 'Despar',
    cat: 'supermarche',
    town: 'Sampieri',
    url: 'https://www.google.com/maps/search/?api=1&query=Despar+Sampieri+Scicli',
    km: 6,
    responsible: false,
    blurb: {
      fr: 'L’épicerie de Sampieri, Via Cipro. Bien pour un oubli sur la route de la plage.',
      it: 'Il market di Sampieri, Via Cipro. Utile per una dimenticanza sulla strada per la spiaggia.',
      en: 'Sampieri’s grocery, Via Cipro. Handy for whatever you forgot on the way to the beach.' },
  },
  {
    id: 'deco-scicli',
    name: 'Decò',
    cat: 'supermarche',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Dec%C3%B2+Scicli',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Supermarché dans Scicli même, à faire en même temps qu’une balade dans le centre baroque.',
      it: 'Supermercato dentro Scicli, da fare insieme a una passeggiata nel centro barocco.',
      en: 'Supermarket in Scicli itself — pair it with a wander through the baroque centre.' },
  },
];
