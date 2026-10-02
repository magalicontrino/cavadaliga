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
  { words: ['glace', 'gelato', 'gelateria', 'ice cream', 'granita', 'granite', 'cornet', 'sorbet'], ids: ['gelateria-smile', 'bar-del-duomo', 'chiosco-funtana'] },
  { words: ['pizza', 'pizzeria', 'pizze', 'a emporter', 'emporter', 'asporto', 'takeaway', 'take away', 'a piedi le soir'], ids: ['be-happy', 'lancora', 'osteria-del-ponte'] },
  { words: ['arancina', 'arancine', 'arancini', 'friture', 'fritto', 'street food', 'rosticceria'], ids: ['ssg-market', 'giannone'] },
  { words: ['poisson', 'pesce', 'fish', 'fruits de mer', 'frutti di mare', 'seafood', 'peche', 'port', 'porto'], ids: ['poisson-donnalucata', 'rabbuso'] },
  { words: ['chocolat', 'cioccolato', 'chocolate', 'cacao', 'modica', 'douceur', 'dolci', 'sweets', 'dessert'], ids: ['bonajuto', 'bar-del-duomo'] },
  { words: ['huile', 'olio', 'oil', 'olive', 'frantoio', 'frantoi', 'dop'], cat: 'huile' },
  // LE VERRE DU SOIR AU VILLAGE — on sort de chez soi a pied, c'est tout ce
  // qu'on demande. Ces deux-la restent en tete pour « apero » et « bar ».
  { words: ['vin', 'vino', 'wine', 'apero', 'aperitivo', 'aperitif', 'drink', 'bar', 'cocktail', 'biere', 'birra', 'beer', 'verre', 'soir', 'sera'], ids: ['maracaibo', 'blazer'] },
  /*
   * LE VIN QU'ON VIENT CHERCHER POUR LUI-MEME, et pas le verre de passage.
   * Ces mots-la meritaient leur ligne : melanges a « apero », ils renvoyaient
   * au bar du village, ce qui est une bonne reponse a « boire un verre » et
   * une mauvaise a « vin naturel ». Ummara d'abord — sa carte est faite
   * presque entierement de ça.
   */
  { words: ['vin naturel', 'vins naturels', 'vino naturale', 'vini naturali', 'natural wine', 'naturel', 'bio', 'biologique', 'vigneron', 'vignaiolo', 'winemaker', 'vineria', 'enoteca', 'wine bar', 'cave a manger', 'carte des vins', 'carta dei vini', 'wine list', 'degustation', 'degustazione', 'tasting'], ids: ['ummara', 'prosit', 'tannino'] },
  { words: ['boucherie', 'macelleria', 'butcher', 'viande', 'carne', 'meat', 'boucher', 'salumi', 'charcuterie'], cat: 'boucherie' },
  { words: ['essence', 'carburant', 'station', 'station essence', 'pompe', 'gasoil', 'gazole', 'diesel', 'sans plomb', 'benzina', 'distributore', 'carburante', 'gasolio', 'pompa', 'petrol', 'fuel', 'gas station', 'petrol station', 'unleaded', 'faire le plein', 'plein', 'fare il pieno', 'fill up'], cat: 'essence' },
  // Le tabacchi : on y va rarement pour le tabac. Timbres, tickets de bus,
  // disque de stationnement (cite dans « Se garer »), loto, journaux.
  { words: ['tabac', 'tabacchi', 'tabaccheria', 'tabaccaio', 'tobacconist', 'cigarette', 'cigarettes', 'sigarette', 'clope', 'briquet', 'accendino', 'lighter', 'timbre', 'timbres', 'francobollo', 'francobolli', 'stamp', 'stamps', 'carte postale', 'cartolina', 'postcard', 'poste', 'ticket', 'tickets', 'biglietto', 'biglietti', 'bus', 'autobus', 'disque', 'disque de stationnement', 'disco orario', 'parking disc', 'loto', 'lotto', 'gratter', 'gratta e vinci', 'lottery', 'journal', 'journaux', 'giornale', 'giornali', 'newspaper', 'presse', 'edicola', 'recharge', 'ricarica', 'top up'], cat: 'tabac' },
  { words: ['bricolage', 'brico', 'ferramenta', 'quincaillerie', 'outil', 'outils', 'utensili', 'attrezzi', 'tools', 'hardware', 'diy', 'fai da te', 'scie', 'sega', 'seghetto', 'saw', 'perceuse', 'trapano', 'drill', 'visserie', 'vis', 'viti', 'screws', 'clou', 'chiodi', 'nails', 'peinture', 'vernice', 'paint', 'cheville', 'ampoule', 'lampadina', 'bulb', 'cle', 'chiave'], cat: 'bricolage' },
  // « Randonnee pres de Syracuse » ne rendait rien : Cavagrande est a Avola, et
  // personne ne le sait avant d'y etre alle. On cherche par la grande ville
  // d'a cote, pas par le hameau — d'ou Syracuse, Avola et la reserve nommee.
  { words: ['randonnee', 'randonnée', 'rando', 'marcher', 'sentier', 'sentiero', 'trail', 'hike', 'hiking', 'balade', 'passeggiata', 'trekking', 'canyon', 'gorge', 'crique', 'cala', 'nature', 'syracuse', 'siracusa', 'avola', 'cassibile', 'cavagrande', 'riserva', 'reserve naturelle', 'riserva naturale', 'nature reserve', 'vasque', 'vasques', 'laghetti', 'pools', 'baignade en riviere'], cat: 'randonnee' },
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
  // Ragusa Ibla se cherche par « Raguse », par « baroque », ou par « que voir » —
  // jamais par son identifiant.
  { words: ['ibla', 'ragusa ibla', 'raguse', 'ragusa', 'baroque', 'barocco', 'baroque town', 'san giorgio', 'unesco', 'que voir', 'a voir', 'da vedere', 'what to see', 'visite', 'visita', 'ville basse'], ids: ['ragusa-ibla'] },
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
      fr: 'Le canyon aux vasques naturelles, côté Avola, sur la route de Syracuse — une journée entière. La descente se fait par la Scala Cruci, depuis le belvédère d’Avola Antica : raide, longue, et à remonter. La réserve régule ses sentiers et peut les fermer : vérifiez avant de partir.',
      it: 'Il canyon con i laghetti naturali, verso Avola, sulla strada per Siracusa — una giornata intera. Si scende dalla Scala Cruci, dal belvedere di Avola Antica: ripida, lunga, e da risalire. La riserva regola i sentieri e può chiuderli: verificate prima di partire.',
      en: 'The canyon with its natural pools, over towards Avola on the Syracuse road — a full day out. The descent is by the Scala Cruci from the Avola Antica viewpoint: steep, long, and to be climbed back up. The reserve regulates its paths and may close them: check before setting off.',
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
  /*
   * DEUX ADRESSES SUR LE MEME TORRENT, a quelques pas l'une de l'autre : le
   * long de la via Aleardi, dans le Scicli baroque. Elles se ressemblent assez
   * pour qu'on les confonde, et differe assez pour qu'on choisisse — l'une est
   * un aperitif qui devient diner, l'autre une cave qui s'est mise a cuisiner.
   * Les fiches le disent plutot que de les laisser se doubler.
   *
   * UN JOUR DE FERMETURE NE S'ECRIT QUE SI LA MAISON LE DIT ELLE-MEME. Ummara
   * publie ses horaires sur son site : on peut donc ecrire « ferme le
   * mercredi ». Pour Tannino, seuls des agregateurs annoncaient le mardi, et
   * un agregateur se trompe sans jamais se corriger — la fiche renvoie donc au
   * site plutot que d'envoyer quelqu'un devant une porte close un soir de
   * vacances.
   */
  {
    id: 'tannino',
    name: 'My Name is Tannino',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=My+Name+is+Tannino%2C+Via+Aleardi%2C+Scicli',
    site: 'https://www.mynameistannino.it/',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Un angle discret du Scicli baroque, au bord du torrent Aleardi, sous l’église du Carmine. On y vient pour l’apéritif autant que pour dîner : cuisine sicilienne, petites fritures, involtini d’aubergine, et une carte des vins qui va d’ici à l’étranger. On y sert le soir ; le jour de fermeture change, un coup d’œil au site avant d’y monter.',
      it: 'Un angolo discreto della Scicli barocca, sul torrente Aleardi, sotto la chiesa del Carmine. Ci si viene per l’aperitivo quanto per cena: cucina siciliana, frittini, involtini di melanzane, e una carta dei vini che va da qui all’estero. Si cena la sera; il giorno di chiusura cambia, meglio un’occhiata al sito prima di salire.',
      en: 'A quiet corner of baroque Scicli, on the Aleardi stream below the Carmine church. As much a place for an aperitivo as for dinner: Sicilian cooking, little fried things, aubergine involtini, and a wine list that travels from here to abroad. Dinner is served in the evening; the closing day moves, so check the site before heading up.' },
  },
  {
    id: 'ummara',
    name: 'Ùmmara — vineria con cucina',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=%C3%99mmara%2C+Via+Aleardi+9%2C+Scicli',
    site: 'https://ummara.it/',
    instagram: 'https://www.instagram.com/ummara_vineriaconcucina/',
    km: 8,
    // Les vins naturels ne sont pas un argument de carte ici, c'est la carte
    // entiere : petits producteurs, fermentations spontanees. C'est ce que
    // `responsible` veut dire.
    responsible: true,
    blurb: {
      fr: 'Une cave à manger ouverte en 2016 par Giuseppe Fiorilla, sur le même torrent, quelques pas plus bas. « Ùmmara », c’est l’ombre en dialecte de Raguse. La carte est faite presque entièrement de vins naturels — petits producteurs, fermentations spontanées — et la cuisine de Roberta Padua mêle la tradition de l’île à des détours méditerranéens et japonais. Le soir seulement, fermé le mercredi.',
      it: 'Una vineria aperta nel 2016 da Giuseppe Fiorilla, sullo stesso torrente, qualche passo più giù. «Ùmmara» è l’ombra in dialetto ragusano. La carta è fatta quasi solo di vini naturali — piccoli produttori, fermentazioni spontanee — e la cucina di Roberta Padua intreccia la tradizione dell’Isola con deviazioni mediterranee e giapponesi. Solo la sera, chiuso il mercoledì.',
      en: 'A wine bar with a kitchen, opened in 2016 by Giuseppe Fiorilla, on the same stream a few steps further down. “Ùmmara” means shade in the Ragusa dialect. The list is almost entirely natural wines — small growers, spontaneous fermentations — and Roberta Padua’s cooking weaves the island’s tradition through Mediterranean and Japanese detours. Evenings only, closed on Wednesdays.' },
  },
  /*
   * LES DEUX BARS DE SCICLI, recommandes par Juliette : « Chiosco a funtana »
   * pour la journee comme pour le soir, « Spritz Point » pour le soir.
   */
  {
    id: 'chiosco-funtana',
    name: 'Chiosco ’A Funtana',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Chiosco+a+Funtana%2C+Via+Aleardi%2C+Scicli',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Un kiosque posé dans le jardin public qui longe le torrent, à l’ombre, avec des tables dehors. On y prend le café et la brioche le matin, la granita l’après-midi, un verre le soir — le même endroit tient les trois moments de la journée.',
      it: 'Un chiosco nel giardino pubblico lungo il torrente, all’ombra, con i tavoli fuori. Caffè e brioche la mattina, granita il pomeriggio, un bicchiere la sera — lo stesso posto regge i tre momenti della giornata.',
      en: 'A kiosk set in the public garden along the stream, in the shade, with tables outside. Coffee and brioche in the morning, granita in the afternoon, a drink in the evening — one place that holds all three parts of the day.' },
  },
  {
    id: 'spritz-point',
    name: 'Spritz Point',
    cat: 'resto',
    town: 'Scicli',
    url: 'https://www.google.com/maps/search/?api=1&query=Spritz+Point%2C+Scicli',
    km: 8,
    responsible: false,
    blurb: {
      fr: 'Un bar à cocktails de Scicli, pour le soir. Le nom dit l’essentiel.',
      it: 'Un cocktail bar di Scicli, per la sera. Il nome dice l’essenziale.',
      en: 'A cocktail bar in Scicli, for the evening. The name says the rest.' },
  },
  /*
   * DONNALUCATA, LA TABLE QU'ON GARDE POUR UN SOIR. Juliette : « resto super
   * bon un peu plus cher ». Le prix est dit dans la fiche plutot que decouvert
   * sur place — c'est la moindre des choses quand on envoie quelqu'un chez un
   * chef.
   */
  {
    id: 'caro-melo',
    name: 'Caro Melo',
    cat: 'resto',
    town: 'Donnalucata',
    url: 'https://www.google.com/maps/search/?api=1&query=Caro+Melo%2C+Via+San+Remo+7%2C+Donnalucata',
    site: 'https://www.caromelo.it/',
    km: 7,
    responsible: false,
    blurb: {
      fr: 'L’osteria de Carmelo Chiaramonte, qui a longtemps cuisiné partout avant de s’arrêter dans ce village de pêcheurs. Une petite salle, puis une terrasse qui tient du jardin. Cuisine sicilienne revisitée, et une addition plus élevée qu’ailleurs ici — c’est une table pour un soir, pas pour tous les soirs.',
      it: 'L’osteria di Carmelo Chiaramonte, che ha cucinato a lungo ovunque prima di fermarsi in questo paese di pescatori. Una saletta, poi una terrazza che sa di giardino. Cucina siciliana rivisitata, e un conto più alto che altrove da queste parti — è una tavola per una sera, non per tutte le sere.',
      en: 'Carmelo Chiaramonte’s osteria — he cooked his way around for years before settling in this fishing village. A small room, then a terrace more like a garden. Sicilian cooking reimagined, and a bill higher than most around here: a table for one evening, not every evening.' },
  },
  /*
   * MODICA — trois adresses de Juliette, et elles ne se concurrencent pas :
   * deux osterie dans le meme corso, l'une copieuse, l'autre en plus petites
   * portions, et un bar sur la place du Duomo pour la glace ou le spritz.
   */
  {
    id: 'sapori-perduti',
    name: 'Osteria dei Sapori Perduti',
    cat: 'resto',
    town: 'Modica',
    url: 'https://www.google.com/maps/search/?api=1&query=Osteria+dei+Sapori+Perduti%2C+Corso+Umberto+I+230%2C+Modica',
    km: 20,
    responsible: false,
    blurb: {
      fr: 'Dans un vieux palais du corso Umberto, la cuisine modicaine des recettes de maison. Les parts sont généreuses, surtout les pâtes : prévoyez de partager plutôt que de commander chacun son plat.',
      it: 'In un vecchio palazzo del corso Umberto, la cucina modicana delle ricette di casa. Le porzioni sono generose, soprattutto i primi: meglio condividere che ordinare un piatto a testa.',
      en: 'In an old palazzo on corso Umberto, Modica home cooking. Portions are generous, the pasta especially: plan on sharing rather than a dish each.' },
  },
  {
    id: 'ricotta-co',
    name: 'Osteria Ricotta & Co',
    cat: 'resto',
    town: 'Modica',
    url: 'https://www.google.com/maps/search/?api=1&query=Osteria+Ricotta+%26+Co%2C+Corso+Umberto+I+261%2C+Modica',
    km: 20,
    responsible: false,
    blurb: {
      fr: 'Quelques portes plus loin sur le même corso, la même cuisine de maison en plus petites assiettes — ricotta chaude, ravioli, scaccia. L’adresse quand on veut goûter à plusieurs choses sans s’attabler pour deux heures.',
      it: 'Qualche porta più in là sullo stesso corso, la stessa cucina di casa in piatti più piccoli — ricotta calda, ravioli, scaccia. L’indirizzo per assaggiare più cose senza mettersi a tavola per due ore.',
      en: 'A few doors along the same corso, the same home cooking in smaller plates — warm ricotta, ravioli, scaccia. The place to taste several things without settling in for two hours.' },
  },
  {
    id: 'bar-del-duomo',
    name: 'Bar del Duomo',
    cat: 'resto',
    town: 'Modica',
    url: 'https://www.google.com/maps/search/?api=1&query=Bar+del+Duomo%2C+Via+San+Michele%2C+Modica',
    km: 20,
    responsible: false,
    blurb: {
      fr: 'La terrasse qui donne sur San Giorgio, en haut de Modica : une glace, une granita au chocolat ou un spritz au pied de l’escalier. On y achète aussi le chocolat de Modica, joliment emballé — avec un marque-page.',
      it: 'La terrazza che dà su San Giorgio, a Modica Alta: un gelato, una granita al cioccolato o uno spritz ai piedi della scalinata. Ci si compra anche il cioccolato di Modica, confezionato con cura — e un segnalibro.',
      en: 'The terrace looking onto San Giorgio, up in Modica Alta: an ice cream, a chocolate granita or a spritz at the foot of the staircase. They also sell Modica chocolate, prettily boxed — with a bookmark.' },
  },
  /*
   * LA PIZZA A EMPORTER DU VILLAGE. Juliette : « les pizzas a emporter pour le
   * soir, celles de l'Ancora en haut de la maison sont tres bonnes ». Be Happy
   * etait seule dans ce role ; elles ne se genent pas, on n'a jamais trop d'une
   * pizza qu'on rapporte a pied.
   */
  {
    id: 'lancora',
    name: 'Ristorante Pizzeria L’Ancora',
    cat: 'resto',
    town: 'Cava d’Aliga',
    url: 'https://www.google.com/maps/search/?api=1&query=Ristorante+Pizzeria+L%27Ancora%2C+Cava+d%27Aliga',
    km: 0.5,
    responsible: false,
    blurb: {
      fr: 'Restaurant-pizzeria du village, en haut de la maison. On s’y attable, mais c’est surtout la pizza à emporter qu’on vient chercher le soir, à pied.',
      it: 'Ristorante-pizzeria del paese, sopra casa. Ci si siede anche, ma soprattutto si passa a ritirare la pizza da asporto la sera, a piedi.',
      en: 'The village restaurant-pizzeria, just up from the house. You can sit down, but it is the takeaway pizza you mostly walk up for in the evening.' },
  },
  /*
   * RAGUSA IBLA N'EST PAS UN LIEU OU L'ON ENTRE, c'est une ville basse entiere
   * qu'on descend a pied. L'epingle vise donc le quartier, pas une porte — et
   * la fiche le dit, pour que personne ne cherche un guichet.
   */
  {
    id: 'ragusa-ibla',
    name: 'Ragusa Ibla',
    cat: 'avoir',
    town: 'Ragusa',
    url: 'https://www.google.com/maps/search/?api=1&query=Ragusa+Ibla',
    km: 35,
    responsible: false,
    blurb: {
      fr: 'La ville basse de Raguse, reconstruite après le tremblement de terre de 1693 et classée par l’UNESCO avec les autres villes du Val di Noto. On ne la visite pas, on la descend : des ruelles, des escaliers, le dôme de San Giorgio au bout, et le jardin ibléen tout en bas. Prévoyez des chaussures, ça monte autant que ça descend.',
      it: 'La città bassa di Ragusa, ricostruita dopo il terremoto del 1693 e iscritta dall’UNESCO con le altre città del Val di Noto. Non si visita, si scende: vicoli, scalinate, la cupola di San Giorgio in fondo, e il giardino ibleo in basso. Scarpe comode: si sale quanto si scende.',
      en: 'Ragusa’s lower town, rebuilt after the 1693 earthquake and listed by UNESCO with the other Val di Noto towns. You do not tour it, you walk down it: alleys, stairways, the dome of San Giorgio at the end, and the Iblean garden at the bottom. Wear shoes — there is as much climbing as descending.' },
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
      fr: 'Gastronomia et boucherie du côté de Donnalucata. Les arancine y sont excellentes, y compris à la seiche et aux fruits de mer, et la maison les fait à la minute : passez vers 9 h 30, c’est l’heure.',
      it: 'Gastronomia e macelleria dalle parti di Donnalucata. Le arancine sono ottime, anche al nero di seppia e ai frutti di mare, e le fanno al momento: passate verso le 9.30, è l’ora giusta.',
      en: 'Deli and butcher over towards Donnalucata. The arancine are excellent — cuttlefish and seafood among them — and made to order: come by around 9.30 am, that is the hour.' },
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
      fr: 'L’épicerie du village, viale della Pace, à 280 m de la maison. La plus proche de tous : celle qu’on fait à pied quand il manque quelque chose. Et on y trouve du pain — pas la peine d’aller plus loin pour ça. Et le tuyau de Juliette : ses arancine sont les meilleures du coin, « il n’y a pas de compétition ».',
      it: 'Il market del paese, viale della Pace, a 280 m da casa. Il più vicino di tutti: quello che si fa a piedi quando manca qualcosa. E c’è il pane — non serve andare più lontano per quello. E la dritta di Juliette: le sue arancine sono le migliori della zona, «non c’è partita».',
      en: 'The village grocery, viale della Pace, 280 m from the house. The closest of them all — the one you walk to when something is missing. And it has bread, so there is no need to go further for that.' },
  },
  {
    id: 'coop-superstore And Juliette’s tip: their arancine are the best around — “no competition”.',
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
];
