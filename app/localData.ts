import type { IconName } from './Icon';

// ────────────────────────────────────────────────────────────────────────
// Base de données locale — les adresses du sud-est de la Sicile.
// Source unique pour la page « Nos adresses » (grille de fiches + fiche détail).
// Textes visibles dans les 3 langues (fr · it · en).
// ────────────────────────────────────────────────────────────────────────
export type Lang = 'fr' | 'it' | 'en';
export type CatKey = 'huile' | 'agrumes' | 'plantes' | 'marche' | 'resto' | 'supermarche' | 'plage' | 'bricolage' | 'boucherie';

export const CATS: Record<CatKey, { icon: IconName; bg: string; label: Record<Lang, string> }> = {
  huile: { icon: 'droplet', bg: 'linear-gradient(135deg,#b89a4a,#856a2c)', label: { fr: 'Huile d’olive', it: 'Olio d’oliva', en: 'Olive oil' } },
  agrumes: { icon: 'citrus', bg: 'linear-gradient(135deg,#f0568c,#c02057)', label: { fr: 'Agrumes & épices', it: 'Agrumi & spezie', en: 'Citrus & spices' } },
  plantes: { icon: 'leaf', bg: 'linear-gradient(135deg,#6f8f5f,#4f7346)', label: { fr: 'Plantes & fleurs', it: 'Piante & fiori', en: 'Plants & flowers' } },
  marche: { icon: 'bag', bg: 'linear-gradient(135deg,#3a3838,#2e2d2d)', label: { fr: 'Marchés', it: 'Mercati', en: 'Markets' } },
  resto: { icon: 'fork', bg: 'linear-gradient(135deg,#c05a5a,#8f3f3f)', label: { fr: 'Manger & boire', it: 'Mangiare & bere', en: 'Eat & drink' } },
  supermarche: { icon: 'cart', bg: 'linear-gradient(135deg,#d98b3f,#a86526)', label: { fr: 'Supermarchés', it: 'Supermercati', en: 'Supermarkets' } },
  boucherie: { icon: 'cleaver', bg: 'linear-gradient(135deg,#b5565e,#8c3a41)', label: { fr: 'Boucherie', it: 'Macelleria', en: 'Butcher' } },
  bricolage: { icon: 'tools', bg: 'linear-gradient(135deg,#7b8794,#565f6b)', label: { fr: 'Bricolage', it: 'Ferramenta & fai da te', en: 'DIY & hardware' } },
  plage: { icon: 'sun', bg: 'linear-gradient(135deg,#5aa0a0,#3f7d7d)', label: { fr: 'Plage & loisirs', it: 'Spiaggia & tempo libero', en: 'Beach & leisure' } },
};

export type LocalPlace = {
  id: string;
  name: string; // nom propre — identique dans les 3 langues
  cat: CatKey;
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
  { words: ['pain', 'pane', 'bread', 'boulangerie', 'panificio', 'bakery', 'baguette', 'brioche', 'pignolata'], cat: 'supermarche', ids: ['giannone'] },
  { words: ['glace', 'gelato', 'gelateria', 'ice cream', 'granita', 'granite', 'cornet', 'sorbet'], ids: ['gelateria-smile'] },
  { words: ['pizza', 'pizzeria', 'pizze'], ids: ['be-happy'] },
  { words: ['arancina', 'arancine', 'arancini', 'friture', 'fritto', 'street food', 'rosticceria'], ids: ['giannone'] },
  { words: ['poisson', 'pesce', 'fish', 'fruits de mer', 'frutti di mare', 'seafood', 'peche', 'port', 'porto'], ids: ['poisson-donnalucata', 'rabbuso'] },
  { words: ['chocolat', 'cioccolato', 'chocolate', 'cacao', 'modica', 'douceur', 'dolci', 'sweets', 'dessert'], ids: ['bonajuto'] },
  { words: ['huile', 'olio', 'oil', 'olive', 'frantoio', 'frantoi', 'dop'], cat: 'huile' },
  { words: ['vin', 'vino', 'wine', 'apero', 'aperitivo', 'aperitif', 'drink', 'bar', 'cocktail', 'biere', 'birra', 'beer', 'verre', 'soir', 'sera'], ids: ['maracaibo', 'blazer'] },
  { words: ['boucherie', 'macelleria', 'butcher', 'viande', 'carne', 'meat', 'boucher', 'salumi', 'charcuterie'], cat: 'boucherie' },
  { words: ['bricolage', 'brico', 'ferramenta', 'quincaillerie', 'outil', 'outils', 'utensili', 'attrezzi', 'tools', 'hardware', 'diy', 'fai da te', 'scie', 'sega', 'seghetto', 'saw', 'perceuse', 'trapano', 'drill', 'visserie', 'vis', 'viti', 'screws', 'clou', 'chiodi', 'nails', 'peinture', 'vernice', 'paint', 'cheville', 'ampoule', 'lampadina', 'bulb', 'cle', 'chiave'], cat: 'bricolage' },
  { words: ['plage', 'spiaggia', 'beach', 'mer', 'mare', 'sea', 'baignade', 'nager', 'swim', 'sable', 'sabbia', 'sand', 'lido', 'transat'], cat: 'plage' },
  { words: ['courses', 'spesa', 'groceries', 'shopping', 'supermarche', 'supermarket', 'supermercato', 'caddie', 'carrello', 'lessive', 'papier'], cat: 'supermarche' },
  { words: ['marche', 'mercato', 'market', 'legume', 'verdura', 'vegetables', 'fruit', 'frutta', 'fromage', 'formaggio', 'cheese', 'producteur', 'produttore', 'farmer', 'local', 'bio'], cat: 'marche' },
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
    cat: 'plage',
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
    cat: 'plage',
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
    id: 'covo-contrabbandieri',
    name: 'Covo dei contrabbandieri',
    cat: 'plage',
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
      fr: 'La plage de Bruca, juste à l’ouest de Cava d’Aliga. Le lido le plus proche de la maison : sable, transats et de quoi boire un verre.',
      it: 'La spiaggia di Bruca, appena a ovest di Cava d’Aliga. Il lido più vicino a casa: sabbia, lettini e qualcosa da bere.',
      en: 'Bruca beach, just west of Cava d’Aliga. The closest lido to the house: sand, sunbeds and somewhere for a drink.' },
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
      fr: 'Le commerce d’alimentation du village, viale della Pace, à 280 m de la maison. Le plus proche de tous : celui qu’on fait à pied quand il manque quelque chose.',
      it: 'Il market del paese, viale della Pace, a 280 m da casa. Il più vicino di tutti: quello che si fa a piedi quando manca qualcosa.',
      en: 'The village’s food shop, viale della Pace, 280 m from the house. The closest of them all — the one you walk to when something is missing.' },
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
