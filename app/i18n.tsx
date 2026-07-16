'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'fr' | 'it' | 'en';
export const LANGS: Lang[] = ['it', 'fr', 'en'];

type PageContent = { eyebrow: string; title: string; intro: string };
export type PageKey =
  | 'informations-pratiques'
  | 'services-locaux'
  | 'la-region'
  | 'contact';

// « Préparer le voyage » — page riche (groupes avec liens + check-list)
type PrepareGroup = {
  icon: string;
  title: string;
  links?: { label: string; url: string }[];
  items?: string[];
};
type PrepareContent = {
  eyebrow: string;
  title: string;
  intro: string;
  groups: PrepareGroup[];
  checklistTitle: string;
  checklistNote: string;
  checklist: string[];
};
type ArriveeContent = {
  eyebrow: string;
  title: string;
  intro: string;
  addressLabel: string;
  address: string[];
  mapsLabel: string;
  mapsUrl: string;
  operationTitle: string;
  operation: PrepareGroup[];
};
type DepartContent = {
  eyebrow: string;
  title: string;
  intro: string;
  checklistTitle: string;
  checklistNote: string;
  checklist: string[];
};

export type Dict = {
  nav: string[]; // ordre = NAV (Accueil, Préparer le voyage, Infos pratiques, Services locaux, La région, Contact)
  region: string;
  tagline: string;
  subLabels: string[];
  writeUs: string;
  contactLink: string;
  persoSite: string;
  intro: string;
  welcome: string;
  highlights: { value: string; label: string }[];
  everythingForStay: string;
  sectionsWord: string;
  // Titres des CTA de l'accueil (ordre : infos pratiques, services locaux,
  // région, préparer le voyage, contact) — mini-phrases avec le nom de rubrique.
  ctaTitles: string[];
  tasteOfSicily: string;
  galleryAlt: string[];
  apartmentAlt: string;
  cavaAlt: string;
  scicliAlt: string;
  placesTitle: string;
  placesIntro: string;
  regionPlaces: string[]; // histoires des lieux, même ordre que PLACES (la-region)
  regionHighlights: string[][]; // points forts par lieu, même ordre que PLACES
  unescoLabel: string; // badge patrimoine mondial UNESCO
  regionHere: string; // distance affichée pour Cava d'Aliga (la maison)
  // Histoire : la Sicile arabe, très présente juste autour de la maison.
  arabPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string }[];
    note: string;
    moreTitle: string;
    moreDesc: string;
  };
  localPage: {
    title: string;
    intro: string;
    note: string;
    mapLabel: string;
    badge: string;
    filterAll: string;
    filterEmpty: string;
    searchPlaceholder: string;
    suggestFor: string;
    zoomIn: string;
    zoomOut: string;
    zoomReset: string;
    legendVillages: string;
    legendYou: string;
    locateMe: string;
    locating: string;
    locateOk: string;
    locateFar: string;
    locateError: string;
    legendSpots: string;
    categories: { title: string; desc: string; spots: { label: string; url: string; instagram?: string }[] }[];
    markets: { title: string; desc: string; list: { label: string; url: string }[] };
  };
  salvaPage: { title: string; intro: string; historyTitle: string; historyText: string; treeTitle: string; treeNote: string; treePaternal: string; treeMaternal: string; treeWife1: string; treeWife2: string; treeAdd: string; treeAddSubject: string; treeExample: string };
  calendarPage: { title: string; intro: string; festivalsTitle: string; programTitle: string; programNote: string; programMore: string; socialsTitle: string; festivalDescs: string[]; legend: { occupied: string; tentative: string; free: string; festival: string } };
  culturePage: {
    eyebrow: string;
    title: string;
    intro: string;
    playlistTitle: string;
    playlistDesc: string;
    playlistCta: string;
    playlistSoon: string;
    artistsTitle: string;
    artistsIntro: string;
    screensTitle: string;
    screensIntro: string;
    artsTitle: string;
    artsIntro: string;
    photosTitle: string;
    photosIntro: string;
    handsTitle: string;
    handsIntro: string;
    handsBookCta: string;
    handsBook2Title: string;
    handsBook2Desc: string;
    handsBook2Cta: string;
    handsWho: string;
    handsPhotoNote: string;
    handsCoverAlt: string;
    handsCoverCredit: string;
    handsCover2Alt: string;
    handsCover2Credit: string;
    placeLabel: string;
    moreLabel: string;
    note: string;
  };
  movePage: {
    eyebrow: string;
    title: string;
    intro: string;
    appLabel: string;
    urgencyEyebrow: string;
    urgencyTitle: string;
    urgencyIntro: string;
    nueLabel: string;
    nueNote: string;
    alsoLabel: string;
    localTitle: string;
    pharmacyWalk: string;
    hoursNote: string;
    dutyTitle: string;
    dutyDesc: string;
    dutyCta: string;
    plumberTitle: string;
    plumberDesc: string;
    gasDesc: string;
    gasWalk: string;
    gasLandline: string;
    gasMobile: string;
    localToCome: string;
  };
  // Les habitudes siciliennes qu'on ne devine pas.
  tastePage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string }[];
  };
  cultureFilter: {
    all: string;
    playlist: string;
    screens: string;
    painting: string;
    photo: string;
    hands: string;
    songs: string;
  };
  regionFilter: {
    all: string;
    places: string;
    customs: string;
    arab: string;
  };
  infoFilter: {
    all: string;
    address: string;
    arrival: string;
    move: string;
    urgent: string;
    waste: string;
    leaving: string;
  };
  askMag: {
    text: string;
    textFor: string;
    cta: string;
    subject: string;
  };
  wastePage: {
    eyebrow: string;
    title: string;
    intro: string;
    today: string;
    tomorrow: string;
    noneToday: string;
    eveningNote: string;
    days: string[]; // lundi → dimanche
  };
  ctaEyebrow: string;
  ctaTitle: string;
  question: string;
  contactLabels: { email: string };
  pages: Record<PageKey, PageContent>;
  prepare: PrepareContent;
  arrivee: ArriveeContent;
  depart: DepartContent;
};

const FR: Dict = {
  nav: ['La famille', 'La région', 'Sons & images', 'Le voyage', 'Infos pratiques', 'Nos adresses', 'Calendrier'],
  region: 'Sicile',
  tagline: 'un village du sud-est de la Sicile',
  subLabels: ['Près de Scicli dans la province de Raguse'],
  writeUs: 'Nous écrire',
  contactLink: 'Contact',
  persoSite: 'Le site perso de Mag',
  intro: 'L’appartement de famille où nous avons grandi, à quelques mètres de la mer.',
  welcome: 'Bienvenue',
  highlights: [
    { value: 'Plain-pied', label: 'Un appartement de plain-pied, accessible et lumineux' },
    { value: 'À 2 pas', label: 'La mer à seulement quelques mètres de la porte' },
    { value: 'Sud-est', label: 'Cava d’Aliga, hameau marin de Scicli, province de Raguse' },
  ],
  everythingForStay: 'Tout pour votre séjour',
  sectionsWord: 'rubriques',
  ctaTitles: [
    'Souvenir de famille',
    'Découvrir la région',
    'Sons & images',
    'Bien préparer le voyage',
    'Toutes les informations pratiques',
    'Nos adresses',
    'Voir le calendrier',
  ],
  tasteOfSicily: 'Un avant-goût de la Sicile',
  galleryAlt: [
    'La mer à quelques mètres de Cava d’Aliga',
    'Une ruelle du hameau de Cava d’Aliga',
    'Scicli, ville baroque du Val di Noto',
    'La plage de Cava d’Aliga',
    'Coucher de soleil sur la côte sicilienne',
  ],
  apartmentAlt: 'Le salon de l’appartement de famille à Cava d’Aliga',
  cavaAlt: 'La plage et le village de Cava d’Aliga',
  scicliAlt: 'Vue panoramique de Scicli, ville baroque du Val di Noto',
  placesTitle: 'Les lieux autour de nous',
  placesIntro: 'Dix lieux, de la porte d’à côté à une heure et demie de route. Chacun porte sa distance depuis la maison : de quoi savoir ce qui se fait à pied, ce qui demande la voiture, et ce qui vaut la journée entière. Cinq sont classés au patrimoine mondial.',
  regionPlaces: [
    'Hameau marin de Scicli, Cava d’Aliga doit son nom au sicilien « aliga » (les algues, la posidonie) : jadis une crique de pêcheurs, devenue un village de villégiature aux plages de sable fin. C’est ici que se trouve la maison.',
    'Perle du baroque du Val di Noto, classée à l’UNESCO, Scicli fut reconstruite après le séisme de 1693. Nichée entre trois collines, ses églises et palais dorés servent de décor à la série du commissaire Montalbano.',
    'Petite plage entre Donnalucata et Cava d’Aliga, Bruca est un coin tranquille au sable clair, qui s’anime l’été autour de sa communauté : concerts, cinéma en plein air et fêtes du Comitato Bruca.',
    'Ancien village de pêcheurs aux maisons colorées, Sampieri déroule l’une des plus longues plages de la côte. Son charme suranné en a fait un décor récurrent des tournages de Montalbano.',
    'Sur le promontoire se dressent les ruines de la Fornace Penna, une briqueterie du début du XXᵉ siècle ravagée par un incendie en 1924. Sa silhouette face à la mer — « la Mànnara » de Montalbano — est devenue iconique.',
    'Station balnéaire animée de Ragusa, Marina di Ragusa aligne une longue plage de sable (Pavillon Bleu), un port de plaisance et une promenade qui s’animent surtout l’été — baignades, apéritifs et soirées au bord de l’eau.',
    'Ville baroque étagée dans une gorge, Modica est mondialement connue pour son chocolat travaillé à froid selon une recette d’origine aztèque. Son église San Giorgio compte parmi les chefs-d’œuvre du baroque sicilien.',
    'Perchée sur un éperon rocheux, Raguse se partage entre la ville haute et Ibla, son cœur baroque labyrinthique. Le duomo San Giorgio y domine une place en pente bordée de palais.',
    'Capitale du baroque du Val di Noto, Noto fut entièrement reconstruite en pierre dorée après le séisme de 1693. Son corso aligne cathédrale, palais et églises d’une théâtralité éblouissante, surtout au coucher du soleil.',
    'Ancienne rivale d’Athènes, Syracuse fut l’une des plus grandes cités du monde grec. L’île d’Ortygie mêle temples antiques, ruelles baroques et bord de mer ; son parc archéologique abrite un théâtre grec et l’Oreille de Denys.',
  ],
  regionHighlights: [
    ['Plage de sable et criques rocheuses le long de la côte.', 'Promenade en bord de mer jusqu’à Donnalucata.'],
    ['Centre baroque classé au patrimoine mondial de l’UNESCO.', 'Églises San Bartolomeo, San Giovanni Evangelista et San Matteo.', 'Palazzo Beneventano et la via Mormino Penna.', 'Décors de la série Montalbano (l’hôtel de ville = commissariat de Vigàta).'],
    ['Plage de sable clair et eaux peu profondes.', 'Réserves naturelles et sentiers le long de la côte.'],
    ['Longue plage de sable de la côte sud.', 'Vieux village de pêcheurs aux maisons colorées.', 'Décors de la série Montalbano.'],
    ['Ruines de la Fornace Penna (briqueterie de 1912).', 'Promontoire et côte rocheuse face à la mer.'],
    ['Longue plage de sable (Pavillon Bleu).', 'Port de plaisance et la Torre Cabrera, tour de guet du XVIᵉ siècle.'],
    ['Duomo di San Giorgio et son escalier monumental.', 'Église San Pietro et ses statues d’apôtres.', 'Chocolat de Modica IGP, travaillé à froid.'],
    ['Duomo di San Giorgio à Ibla, chef-d’œuvre de Rosario Gagliardi.', 'Ruelles d’Ibla et le Jardin Ibleo.', 'Cattedrale San Giovanni dans la ville haute.'],
    ['Cathédrale San Nicolò et le corso Vittorio Emanuele.', 'Palazzo Nicolaci et ses balcons baroques.', 'Basilique du SS. Salvatore.'],
    ['Ortygie : le Duomo bâti sur un temple grec et la fontaine Aréthuse.', 'Parc archéologique : théâtre grec et Oreille de Denys.', 'Castello Maniace à la pointe d’Ortygie.'],
  ],
  unescoLabel: 'Patrimoine mondial UNESCO',
  regionHere: 'Sur place',
  arabPage: {
    eyebrow: 'Un peu d’histoire',
    title: 'La Sicile arabe, juste sous nos pieds',
    intro: 'En 827, les Arabes débarquent à Mazara del Vallo. Ils resteront plus de deux siècles, jusqu’à l’arrivée des Normands à la fin du XIᵉ siècle. On dit « domination arabe » comme si c’était une parenthèse : en réalité, presque tout ce qu’on aime ici en vient. Les noms des villages, ce qu’il y a dans l’assiette, l’eau dans les champs, jusqu’à la fête du village d’à côté. Quelques exemples, tous à moins de 20 km.',
    facts: [
      {
        icon: 'droplet',
        title: 'Donnalucata = « la source des heures »',
        text: 'À 3 km d’ici. Le nom vient de l’arabe ʿAyn al-awqāt. Le grand géographe al-Idrisi le note au XIIᵉ siècle : « Près de Scicli se trouve la source appelée ʿAyn al-awqāt, parce que l’eau y jaillit aux heures des prières et s’arrête à toutes les autres. » Une source qui coulait cinq fois par jour, au rythme de la prière musulmane. Le nom a traversé mille ans presque intact — on va y acheter le poisson sans y penser.',
      },
      {
        icon: 'landmark',
        title: 'La fête de Scicli rejoue une bataille contre les Sarrasins',
        text: 'La Madonna delle Milizie, patronne de Scicli. Le dernier samedi de mai, le village rejoue en costumes la bataille de 1091 entre les Normands du comte Roger et les Sarrasins de l’émir Belcane — que la tradition situe dans la plaine face à la mer de Donnalucata. Une Vierge à cheval, l’épée à la main : c’est la seule au monde. Le gâteau de la fête s’appelle la « testa di turco », la tête de Turc.',
      },
      {
        icon: 'citrus',
        title: 'Les agrumes, l’irrigation, et les mots pour les dire',
        text: 'Citrons, oranges amères, canne à sucre, coton, pistache, melon : ce sont les Arabes qui les apportent, avec les techniques pour les arroser dans une île sèche. Le vocabulaire est resté dans le dialecte : la saia (le canal d’irrigation, de sāqiya), la gebbia (le bassin, de jābiya), la zàgara (la fleur d’oranger, de zahra). Des mots qu’on emploie encore sans savoir qu’ils sont arabes.',
      },
      {
        icon: 'cone',
        title: 'Dans l’assiette, tous les jours',
        text: 'La granita descend du sharbat. Le couscous se mange toujours à Trapani. Le zibibbo vient de zabīb, le raisin sec. Et ce goût sicilien pour l’aigre-doux — la caponata, les pâtes aux sardines avec raisins secs et pignons — c’est une cuisine arabe passée à l’italienne. La cassata elle-même tirerait son nom de qas‘ah, le bol dans lequel on la moulait.',
      },
      {
        icon: 'map',
        title: 'Les noms sur la carte routière',
        text: 'Quand vous conduisez, vous lisez de l’arabe. Tout ce qui commence par Calta- vient de qal‘at, la forteresse : Caltanissetta, Caltagirone. Marsala, c’est marsa, le port. Gibellina et Gibilrossa viennent de jabal, la montagne. Alcantara, c’est al-qantara, le pont. Misilmeri, manzil al-amir, la demeure de l’émir. Et près de Scicli, la contrada Balata doit son nom à balāt, la dalle de pierre.',
      },
    ],
    note: 'Un détail qui dit tout : les Normands ont chassé les Arabes, mais ils ont gardé leurs jardiniers, leurs ingénieurs et leurs poètes. La Sicile n’a jamais choisi entre ses héritages — elle les a empilés.',
    moreTitle: 'Si le sujet vous attrape',
    moreDesc: 'Libero Reina raconte cette Sicile arabe sur Instagram — et il la raconte en musique, ce qui est la meilleure façon de l’entendre.',
  },
  localPage: {
    title: 'Local & responsable',
    intro: 'Nos adresses pour consommer local et responsable : de petits producteurs et artisans du sud-est de la Sicile, choisis pour la qualité de leurs produits et pour faire vivre l’agriculture de la région.',
    note: 'Nous complétons cette page au fil de nos trouvailles — adresses et contacts à venir.',
    mapLabel: 'Ouvrir dans Google Maps',
    badge: 'Responsable & local',
    filterAll: 'Tout voir',
    filterEmpty: 'Ces adresses arrivent bientôt.',
    searchPlaceholder: 'Rechercher un lieu, une envie…',
    suggestFor: 'Rien qui s’appelle « {q} » chez nous — mais voilà ce qui s’en rapproche le plus.',
    zoomIn: 'Agrandir la carte',
    zoomOut: 'Réduire la carte',
    zoomReset: 'Revoir toute la carte',
    legendVillages: 'Villages',
    legendYou: 'Vous êtes ici',
    locateMe: 'Où suis-je ?',
    locating: 'Recherche…',
    locateOk: 'Le point bleu, c’est vous. La carte est dessinée à la main, pas à l’échelle : la position est approximative, mais elle vous situe par rapport aux villages.',
    locateFar: 'Vous êtes loin de Cava d’Aliga — trop pour apparaître sur cette carte. Réessayez une fois sur place.',
    locateError: 'Impossible de vous situer. Votre navigateur a peut-être refusé la position, ou le signal est trop faible.',
    legendSpots: 'Nos adresses',
    categories: [
      {
        title: 'Chocolat de Modica',
        desc: 'La capitale du chocolat travaillé à froid (recette d’origine aztèque), à ~30 min.',
        spots: [{ label: 'Antica Dolceria Bonajuto — Modica, la plus ancienne (depuis 1880)', url: 'https://www.bonajuto.it', instagram: 'https://www.instagram.com/bonajuto/' }],
      },
      {
        title: 'Huile d’olive — DOP Monti Iblei',
        desc: 'Chiaramonte Gulfi, « ville de l’huile », et ses moulins primés (Tonda Iblea).',
        spots: [
          { label: 'Frantoi Cutrera — Chiaramonte Gulfi', url: 'https://www.google.com/maps/search/?api=1&query=Frantoi+Cutrera+Chiaramonte+Gulfi', instagram: 'https://www.instagram.com/frantoi_cutrera/' },
          { label: 'Gatto Frantoio — Chiaramonte Gulfi', url: 'https://www.gattofrantoio.com' },
        ],
      },
      {
        title: 'Agrumes, piment & épices',
        desc: 'Citrons, oranges, piment, origan et sel de mer se trouvent sur les marchés et chez les petits producteurs voisins.',
        spots: [],
      },
      {
        title: 'Plantes & fleurs',
        desc: 'Pépinières locales pour fleurir la maison et le jardin.',
        spots: [{ label: 'Pépinières autour de Scicli', url: 'https://www.google.com/maps/search/?api=1&query=vivaio+Scicli' }],
      },
    ],
    markets: {
      title: 'Marchés',
      desc: 'Fruits, légumes, fromages et poisson du jour, directement des producteurs.',
      list: [
        { label: 'Marché de Scicli — mardi matin, Piazza Olimpiadi', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Olimpiadi+Scicli' },
        { label: 'Marché fermier de Marina di Ragusa — vendredi matin (juin–sept.)', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Vincenzo+Rabito+Marina+di+Ragusa' },
        { label: 'Marché au poisson de Donnalucata — poisson frais du jour', url: 'https://www.google.com/maps/search/?api=1&query=Mercato+ittico+Donnalucata' },
      ],
    },
  },
  salvaPage: { title: 'La famille', intro: 'Photos, souvenirs et histoire de la famille, au fil des années.', historyTitle: 'Histoire de la famille', historyText: "De génération en génération, cette maison de Cava d’Aliga rassemble la famille. On écrira bientôt son histoire ici — les origines, les étés partagés et les visages qui l’ont fait vivre.", treeTitle: 'Arbre généalogique', treeNote: 'Bientôt : un arbre participatif où chacun pourra ajouter sa branche.', treePaternal: 'Grands-parents paternels', treeMaternal: 'Grands-parents maternels', treeWife1: '1re épouse', treeWife2: '2e épouse', treeAdd: '+ Ajouter ma branche', treeAddSubject: 'Arbre généalogique — ma branche', treeExample: 'Structure d’exemple — dites-nous les vrais liens et on complète.' },
  calendarPage: { title: 'Le calendrier', intro: 'Les périodes où la maison est occupée, pour se coordonner en famille.', festivalsTitle: 'Fêtes siciliennes', programTitle: 'Événements à venir', programNote: 'Sotto il cielo di Bruca — le programme de l’été, à deux pas de la maison. Suivez les couleurs.', programMore: 'Détails et horaires sur Instagram', socialsTitle: 'À suivre', festivalDescs: ["Le grand jour de l’été italien. Héritée des Feriae Augusti romaines et associée à l’Assomption, la fête réunit familles et villages autour de la mer : baignades, grands repas, processions et feux d’artifice animent toute la Sicile.", "Saint Roch, invoqué depuis des siècles contre les épidémies, protège de nombreuses communautés siciliennes. À Scicli, sa statue est portée en procession dans les ruelles, au son des fanfares et sous les illuminations de fête.", "Saint Jean-Baptiste est le patron de Raguse, dont la cathédrale lui est dédiée. Le 29 août, jour de sa décollation, la ville s’illumine : procession solennelle de la statue du saint et grand feu d’artifice au-dessus de la vieille ville.", "Saint Conrad Confalonieri, ermite vénéré comme patron de Noto. Le dernier dimanche d’août, son urne d’argent traverse les rues baroques dans une immense ferveur populaire, entre cierges, fleurs et cortèges."], legend: { occupied: 'Occupé', tentative: 'En attente', free: 'Libre', festival: 'Fête sicilienne' } },
  culturePage: {
    eyebrow: 'Culture',
    title: 'Sons & images',
    intro: 'Ce coin de Sicile a une bande-son et des décors de cinéma. Une playlist partagée à écouter sur la route, et les films et séries tournés à quelques kilomètres de la maison — souvent dans des rues que vous reconnaîtrez.',
    playlistTitle: 'La playlist de la famille',
    playlistDesc: 'Une playlist partagée : chacun y ajoute ce qu’il écoute ici. Pour la route depuis l’aéroport, la cuisine ou la terrasse le soir.',
    playlistCta: 'Ouvrir dans Spotify',
    playlistSoon: 'Le lien de la playlist arrive bientôt.',
    artistsTitle: 'Chansons & histoires de Sicile',
    artistsIntro: 'Les voix qui racontent l’île — à écouter avant, pendant, après.',
    handsTitle: 'Parler avec les mains',
    handsIntro: 'En 1958, le designer milanais Bruno Munari photographie cinquante gestes italiens et les légende en quatre langues. Le titre dit tout : « Supplément au dictionnaire italien ». Il ne le fait pas pour rire — il le fait pour les étrangers de passage en Italie. Autrement dit, pour nous.',
    handsWho: 'Bruno Munari (Milan, 1907-1998) commence chez les futuristes à vingt ans, puis passe sa vie à démonter le sérieux : ses « machines inutiles » de 1933 tournent au plafond sans rien produire, il fonde le Mouvement d’art concret, invente des livres illisibles, et ouvre en 1977 le premier atelier pour enfants d’un musée italien, à la Pinacothèque de Brera. Trois Compas d’or, plus un pour l’ensemble de sa carrière. Il n’a pas inventé les gestes : il les a pris au chanoine Andrea de Jorio, qui les avait recensés à Naples en 1832, et y a ajouté les siens — jusqu’au « O.K. » américain.',
    handsBookCta: 'Le livre chez Corraini',
    handsBook2Title: 'Design as Art',
    handsBook2Desc: 'Son livre le plus lu, publié chez Laterza en 1966 sous le titre « Arte come mestiere » — l’art comme métier. Munari y regarde les lampes, les panneaux routiers, les affiches, les voitures et les chaises, et demande à chaque fois la même chose : est-ce beau, est-ce que ça marche, est-ce que c’est pour tout le monde ? Picasso l’appelait « le nouveau Léonard ». Réédité en Penguin Modern Classics en 2008.',
    handsBook2Cta: 'Le livre chez Penguin',
    handsPhotoNote: 'La main sur la couverture du Supplemento, c’est « ma che vuoi » — le geste par lequel tout commence. Les autres sont dans le livre, et n’ont pas leur place ici : elles sont sous droits. On montre les couvertures, pas ce qu’il y a dedans.',
    handsCoverAlt: 'Couverture de « Speak Italian: The Fine Art of the Gesture » de Bruno Munari : une main photographiée en noir et blanc, les cinq doigts pincés en bouton.',
    handsCoverCredit: 'Bruno Munari, Speak Italian: The Fine Art of the Gesture — Chronicle Books, 2005',
    handsCover2Alt: 'Couverture de « Design as Art » de Bruno Munari chez Penguin : seize visages dessinés en noir et blanc, chacun dans un style différent, sur fond crème.',
    handsCover2Credit: 'Bruno Munari, Design as Art — Penguin Modern Classics, 2008',
    photosTitle: 'Photographié ici',
    photosIntro: 'Avant les téléphones, d’autres ont regardé ces pierres et ces fêtes — et les ont fixées pour de bon.',
    artsTitle: 'Peint ici',
    artsIntro: 'Scicli n’est pas qu’un décor de série : c’est un vrai foyer de peinture, et cette mer a été peinte toute une vie.',
    screensTitle: 'À l’écran, ici',
    screensIntro: 'Tourné à côté de la maison. Regardez avant de venir : vous verrez la région autrement.',
    placeLabel: 'Voir le lieu',
    moreLabel: 'En savoir plus',
    note: 'Vous avez une pépite ? Une chanson, un film, une série : dites-le-nous, on l’ajoute.',
  },
  movePage: {
    eyebrow: 'Se déplacer',
    title: 'Bus, routes et avions',
    intro: 'On peut très bien vivre ici sans voiture pour aller d’un village à l’autre. Voilà où regarder.',
    appLabel: 'Appli',
    urgencyEyebrow: 'Urgences',
    urgencyTitle: 'En cas de pépin',
    urgencyIntro: 'En Sicile, un seul numéro suffit : on décroche, on vous parle, on vous bascule vers le bon service. Les anciens numéros restent joignables si vous les connaissez.',
    nueLabel: 'Numéro unique d’urgence',
    nueNote: 'Gratuit, depuis n’importe quel téléphone, même sans crédit ni carte SIM. On répond en italien et en anglais.',
    alsoLabel: 'Toujours actifs',
    localTitle: 'Contacts sur place',
    pharmacyWalk: 'À 300 m — on y va à pied',
    hoursNote: 'Horaires relevés sur OpenStreetMap : à confirmer sur la porte.',
    dutyTitle: 'Pharmacie de garde',
    dutyDesc: 'La nuit et les jours fériés, une pharmacie de Scicli est toujours de garde — à tour de rôle. La nôtre, Trovato, en fait partie. Le tour du jour se voit ici. Attention : la garde de nuit a le rideau baissé, il faut sonner à l’interphone pour réveiller le pharmacien.',
    dutyCta: 'Voir la garde du jour',
    gasDesc: 'Le monsieur près de la place, c’est lui. Vente de bouteilles, et il répare aussi les cuisinières à gaz. Il livre à domicile — et il est dans le village, à quelques rues d’ici.',
    gasWalk: 'Dans le village',
    gasLandline: 'Fixe',
    gasMobile: 'Portable',
    plumberTitle: 'Plombier',
    plumberDesc: 'Il y en a un, et il est bon. Son numéro n’est pas sur le site : demandez-le à Mag. Et rien ne se lance sans devis — on fait établir le devis, on le valide avec elle, puis seulement les travaux commencent. Ça évite les mauvaises surprises à tout le monde.',
    localToCome: 'le médecin ou un taxi',
  },
  tastePage: {
    eyebrow: 'Us et coutumes',
    title: 'Les habitudes d’ici',
    intro: 'Trois choses à savoir pour ne pas passer pour un touriste — et surtout pour ne pas les rater.',
    facts: [
      {
        icon: 'cone',
        title: 'La granita et la brioche, c’est le petit-déjeuner',
        text: 'Pas un dessert : le vrai petit-déjeuner sicilien de l’été. On commande une granita — amande, citron, mûre, pistache, café — avec une brioche col tuppo, celle qui a un chignon sur la tête. Et on trempe la brioche dedans. Se lever tôt et aller la manger au bar avant que la chaleur tombe, c’est l’une des meilleures raisons d’être ici.',
      },
      {
        icon: 'fork',
        title: 'Arancina ou arancino ? Attention au terrain miné',
        text: 'La boule de riz frite divise l’île depuis des siècles : Palerme dit arancina, au féminin, Catane dit arancino, au masculin. L’Académie de la Crusca a fini par trancher — les deux sont justes : le masculin vient du dialecte (aranciu → arancinu), le féminin de l’italien (arancia → arancina). Ici, dans le Ragusano, on dit arancina. Chez Giannone, à Donnalucata, allez les commander le matin.',
      },
      {
        icon: 'compass',
        title: 'La passeggiata, l’heure où le village sort',
        text: 'Quand la chaleur tombe, tout le monde descend : on marche lentement, on s’arrête tous les dix mètres pour parler, on regarde et on se laisse regarder. Ce n’est pas une promenade, c’est un rendez-vous. Vers 19 h, sur le front de mer. Ne prévoyez rien à cette heure-là — c’est là que le village existe.',
      },
    ],
  },
  cultureFilter: {
    all: 'Tout voir',
    playlist: 'La playlist',
    screens: 'Écrans',
    painting: 'Peinture',
    photo: 'Photo',
    hands: 'Les mains',
    songs: 'Chansons',
  },
  regionFilter: {
    all: 'Tout voir',
    places: 'Les lieux',
    customs: 'Us et coutumes',
    arab: 'Sicile arabe',
  },
  infoFilter: {
    all: 'Tout voir',
    address: 'Adresse',
    arrival: 'Arrivée',
    move: 'Se déplacer',
    urgent: 'Urgences',
    waste: 'Déchets',
    leaving: 'Le départ',
  },
  askMag: {
    text: 'On n’a pas encore l’info ici. Écrivez à Mag : elle vous répond, et on l’ajoute pour les suivants.',
    textFor: 'Pour {what} : on n’a pas encore l’info ici. Écrivez à Mag, elle vous répond — et on l’ajoute pour les suivants.',
    cta: 'Écrire à Mag',
    subject: 'Une question depuis le site',
  },
  wastePage: {
    eyebrow: 'Tri des déchets',
    title: 'Quelle poubelle, quel soir',
    intro: 'À Cava d’Aliga, chaque type de déchet a son jour. Les bacs se sortent la veille au soir : le camion passe tôt.',
    today: 'Ce soir',
    tomorrow: 'Demain soir',
    noneToday: 'Rien à sortir',
    eveningNote: 'On sort les bacs le soir, pas le matin — le camion est déjà passé. Si vous ratez le passage la veille du départ, laissez les sacs sur la terrasse, jamais dans la rue.',
    days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  },
  ctaEyebrow: 'Envie de venir ?',
  ctaTitle: 'Écrivez-nous',
  question: 'Une question sur votre séjour ?',
  contactLabels: { email: 'Email' },
  pages: {
    'informations-pratiques': {
      eyebrow: 'Informations pratiques',
      title: 'Infos pratiques',
      intro: "Arrivée, départ, équipements de l'appartement, conseils — et de quoi gérer le quotidien comme les imprévus.",
    },
    'services-locaux': {
      eyebrow: 'Services locaux & contacts utiles',
      title: 'Nos adresses autour de vous',
      intro: "Commerces, restaurants, marchés et contacts utiles : nos recommandations personnelles pour vivre Cava d'Aliga comme à la maison.",
    },
    'la-region': {
      eyebrow: 'La région',
      title: 'Découvrir le sud-est de la Sicile',
      intro: 'Scicli, Raguse, le baroque du Val di Noto, les plages secrètes et la campagne des Iblei.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Parlons de votre séjour',
      intro: 'Une question, une envie de réserver ? Écrivez-nous, nous répondons personnellement et avec plaisir.',
    },
  },
  prepare: {
    eyebrow: 'Préparer le voyage',
    title: 'Tout ce qui se passe avant le départ',
    intro: 'Vols, aéroport d’arrivée, comment rejoindre la maison… et une check-list pour ne rien oublier avant de fermer la valise.',
    groups: [
      {
        icon: '✈️',
        title: 'Trouver un vol',
        links: [
          { label: 'Skyscanner', url: 'https://www.skyscanner.fr' },
        ],
        items: ['Notre conseil : cherchez sur Skyscanner et privilégiez un vol qui arrive tôt à Catane — vous pourrez enchaîner avec le bus le jour même.', 'Vérifiez la politique bagages (souvent en supplément sur les compagnies low-cost).'],
      },
      {
        icon: '🛬',
        title: 'Choisir son aéroport d’arrivée',
        items: [
          'Catania (CTA) — notre aéroport conseillé : le plus de vols et le bus direct pour la région (environ 1 h 30 en voiture).',
          'Comiso (CIY) — le plus proche, environ 40 min de route.',
          'Palerme (PMO) — le plus loin, environ 3 h, à réserver aux bons plans.',
        ],
      },
      {
        icon: '🚗',
        title: 'Rejoindre Casa Cava d’Aliga',
        links: [
          { label: 'AST — horaires', url: 'https://www.astsicilia.it/' },
          { label: 'Trenitalia', url: 'https://www.trenitalia.com/' },
          { label: 'Goldcar', url: 'https://www.goldcar.es/' },
        ],
        items: [
          'Bus AST — depuis l’aéroport de Catane vers Modica, Scicli, Donnalucata et Pozzallo (horaires sur astsicilia.it).',
          'Train — la ligne régionale relie Modica, Scicli, Pozzallo et Raguse (horaires et billets sur trenitalia.com).',
          'Location de voiture — pratique pour explorer la région ; nous conseillons Goldcar, à l’aéroport de Catane. À la sortie de l’aéroport, prenez à droite : tous les loueurs sont regroupés au même endroit.',
          'Important : la carte de crédit doit être au nom de la personne qui a réservé. Goldcar bloque une caution (environ 950 € à ce jour) si vous ne prenez pas l’assurance, qui reste facultative.',
          'Chauffeur privé — Giovanni, notre perle : 10 € de Donnalucata à l’appartement, 20 € de Pozzallo, 150 € depuis l’aéroport de Catane. Jusqu’à 5-6 personnes. Demandez son numéro à Mag, et prévenez-le à l’avance selon ses disponibilités (prévoyez un plan B).',
          'Ne comptez pas trouver de Uber : l’application ne couvre pas cette région rurale (en Italie, Uber ne fonctionne qu’à Rome et Milan, et seulement avec des taxis/chauffeurs licenciés). Ici, on compte sur Giovanni, un taxi local ou le bus.',
        ],
      },
    ],
    checklistTitle: 'Check-list avant de partir',
    checklistNote: 'Surtout pour Mag, qui a oublié les clés la dernière fois.',
    checklist: [
      'Les clés de l’appartement',
      'Passeport / carte d’identité valides',
      'Billets d’avion et confirmation de location',
      'Permis de conduire (et permis international si besoin)',
      'Carte de crédit (type Visa) en cas de location de voiture, + un peu d’espèces',
      'Adaptateur non nécessaire (mêmes prises qu’en France)',
      'Crème solaire et maillot : la mer est à deux pas',
    ],
  },
  arrivee: {
    eyebrow: 'Arrivée',
    title: 'Le guide des premières heures',
    intro: 'Adresse, accès et fonctionnement rapide de la maison — de quoi vous installer sereinement dès votre arrivée.',
    addressLabel: 'Adresse',
    address: ['Via Basilicata 6, RDC', '97018 Cava d’Aliga', 'Scicli (RG) — Sicile'],
    mapsLabel: 'Ouvrir dans Google Maps',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Basilicata+6+Cava+d%27Aliga+97018+Scicli+RG',
    operationTitle: 'Fonctionnement de la maison',
    operation: [
      { icon: 'bolt', title: 'Électricité', items: ['Interrupteurs à activer dehors, sur la terrasse de devant, à droite de la porte.'] },
      { icon: 'drop', title: 'Eau', items: ['Dans la rue : descendre à droite, au coin.', 'Ouvrir la deuxième vanne en partant du bas → en parallèle = OUVERT (perpendiculaire = FERMÉ).'] },
      { icon: 'flame', title: 'Gaz', items: ['Mormina Gas, Via Tolstoj — il vend les bouteilles, livre à domicile et répare les cuisinières. Ses coordonnées sont plus bas, dans les contacts.'] },
      { icon: 'signal', title: 'Wifi', items: ['Réseau : cacestlaissetomber', 'Mot de passe : jamonito'] },
    ],
  },
  depart: {
    eyebrow: 'Départ',
    title: 'Quitter la maison sereinement',
    intro: 'La petite check-list à cocher avant de fermer la porte.',
    checklistTitle: 'Avant de fermer la porte',
    checklistNote: 'Cochez au fur et à mesure — rien n’est enregistré, c’est juste pour ne rien oublier.',
    checklist: [
      'Couper l’eau : la vanne de la salle de bain, puis celle de la rue (au coin, en descendant à droite) — perpendiculaire = fermé.',
      'Couper l’électricité : les interrupteurs dehors, sur la terrasse de devant, à droite de la porte.',
      'Fermer la bouteille de gaz.',
      'Vider le frigo, le débrancher et laisser la porte entrouverte pour qu’il ne moisisse pas.',
      'Sortir les poubelles selon le tri du jour. Passage manqué ? Laissez-les sur la terrasse, jamais dans la rue.',
      'Fermer volets et fenêtres, y compris à l’étage.',
      'Linge sale dans le panier, serviettes et draps utilisés rassemblés.',
      'Dernier tour : chargeurs, salle de bain, terrasse, sous les lits.',
      'Fermer à clé et remettre les clés à leur place.',
    ],
  },
};

const IT: Dict = {
  nav: ['La famiglia', 'La regione', 'Suoni & immagini', 'Il viaggio', 'Info pratiche', 'I nostri indirizzi', 'Calendario'],
  region: 'Sicilia',
  tagline: 'un villaggio del sud-est della Sicilia',
  subLabels: ['Vicino a Scicli in provincia di Ragusa'],
  writeUs: 'Scrivici',
  contactLink: 'Contatti',
  persoSite: 'Il sito personale di Mag',
  intro: 'L’appartamento di famiglia dove siamo cresciuti, a pochi metri dal mare.',
  welcome: 'Benvenuti',
  highlights: [
    { value: 'Piano terra', label: 'Un appartamento al piano terra, accessibile e luminoso' },
    { value: 'A due passi', label: 'Il mare a pochi metri dalla porta' },
    { value: 'Sud-est', label: 'Cava d’Aliga, borgo marinaro di Scicli, provincia di Ragusa' },
  ],
  everythingForStay: 'Tutto per il vostro soggiorno',
  sectionsWord: 'sezioni',
  ctaTitles: [
    'Ricordi di famiglia',
    'Scoprire la regione',
    'Suoni & immagini',
    'Preparare bene il viaggio',
    'Tutte le info pratiche',
    'I nostri indirizzi',
    'Vedere il calendario',
  ],
  tasteOfSicily: 'Un assaggio di Sicilia',
  galleryAlt: [
    'Il mare a pochi metri da Cava d’Aliga',
    'Un vicolo del borgo di Cava d’Aliga',
    'Scicli, città barocca del Val di Noto',
    'La spiaggia di Cava d’Aliga',
    'Tramonto sulla costa siciliana',
  ],
  apartmentAlt: 'Il soggiorno dell’appartamento di famiglia a Cava d’Aliga',
  cavaAlt: 'La spiaggia e il paese di Cava d’Aliga',
  scicliAlt: 'Vista panoramica di Scicli, città barocca del Val di Noto',
  placesTitle: 'I luoghi intorno a noi',
  placesIntro: 'Dieci luoghi, dalla porta accanto a un’ora e mezza di strada. Ognuno con la sua distanza da casa: per sapere cosa si fa a piedi, cosa richiede l’auto e cosa vale l’intera giornata. Cinque sono patrimonio mondiale.',
  regionPlaces: [
    'Borgo marino di Scicli, Cava d’Aliga prende il nome dal siciliano « aliga » (le alghe, la posidonia): un tempo cala di pescatori, oggi villaggio di villeggiatura dalle spiagge di sabbia fine. È qui che si trova la casa.',
    'Perla del barocco del Val di Noto, patrimonio UNESCO, Scicli fu ricostruita dopo il terremoto del 1693. Adagiata tra tre colline, le sue chiese e i palazzi dorati fanno da set alla serie del commissario Montalbano.',
    'Piccola spiaggia tra Donnalucata e Cava d’Aliga, Bruca è un angolo tranquillo dalla sabbia chiara, che d’estate si anima attorno alla sua comunità: concerti, cinema all’aperto e feste del Comitato Bruca.',
    'Antico borgo di pescatori dalle case colorate, Sampieri offre una delle spiagge più lunghe della costa. Il suo fascino d’altri tempi ne ha fatto un set ricorrente delle riprese di Montalbano.',
    'Sul promontorio si ergono le rovine della Fornace Penna, una fabbrica di mattoni di inizio Novecento distrutta da un incendio nel 1924. La sua sagoma di fronte al mare — « la Mànnara » di Montalbano — è diventata iconica.',
    'Vivace località balneare di Ragusa, Marina di Ragusa allinea una lunga spiaggia di sabbia (Bandiera Blu), un porto turistico e un lungomare che si animano soprattutto d’estate — bagni, aperitivi e serate in riva al mare.',
    'Città barocca adagiata in una gola, Modica è celebre nel mondo per il suo cioccolato lavorato a freddo secondo una ricetta di origine azteca. La chiesa di San Giorgio è tra i capolavori del barocco siciliano.',
    'Arroccata su uno sperone roccioso, Ragusa si divide tra la città alta e Ibla, il suo cuore barocco labirintico. Il duomo di San Giorgio domina una piazza in pendenza cinta di palazzi.',
    'Capitale del barocco del Val di Noto, Noto fu interamente ricostruita in pietra dorata dopo il terremoto del 1693. Il corso allinea cattedrale, palazzi e chiese di abbagliante teatralità, soprattutto al tramonto.',
    'Antica rivale di Atene, Siracusa fu una delle più grandi città del mondo greco. L’isola di Ortigia unisce templi antichi, vicoli barocchi e mare; il parco archeologico custodisce un teatro greco e l’Orecchio di Dioniso.',
  ],
  regionHighlights: [
    ['Spiaggia di sabbia e cale rocciose lungo la costa.', 'Passeggiata sul lungomare fino a Donnalucata.'],
    ['Centro barocco patrimonio mondiale dell’UNESCO.', 'Chiese di San Bartolomeo, San Giovanni Evangelista e San Matteo.', 'Palazzo Beneventano e la via Mormino Penna.', 'Set della serie Montalbano (il municipio = commissariato di Vigàta).'],
    ['Spiaggia di sabbia chiara e acque poco profonde.', 'Riserve naturali e sentieri lungo la costa.'],
    ['Lunga spiaggia di sabbia della costa sud.', 'Antico borgo di pescatori dalle case colorate.', 'Set della serie Montalbano.'],
    ['Rovine della Fornace Penna (fabbrica di mattoni del 1912).', 'Promontorio e costa rocciosa di fronte al mare.'],
    ['Lunga spiaggia di sabbia (Bandiera Blu).', 'Porto turistico e la Torre Cabrera, torre di avvistamento del ’500.'],
    ['Duomo di San Giorgio e la sua scalinata monumentale.', 'Chiesa di San Pietro e le statue degli apostoli.', 'Cioccolato di Modica IGP, lavorato a freddo.'],
    ['Duomo di San Giorgio a Ibla, capolavoro di Rosario Gagliardi.', 'Vicoli di Ibla e il Giardino Ibleo.', 'Cattedrale di San Giovanni nella città alta.'],
    ['Cattedrale di San Nicolò e il corso Vittorio Emanuele.', 'Palazzo Nicolaci e i suoi balconi barocchi.', 'Basilica del SS. Salvatore.'],
    ['Ortigia: il Duomo su un tempio greco e la fonte Aretusa.', 'Parco archeologico: teatro greco e Orecchio di Dioniso.', 'Castello Maniace sulla punta di Ortigia.'],
  ],
  unescoLabel: 'Patrimonio mondiale UNESCO',
  regionHere: 'Sul posto',
  arabPage: {
    eyebrow: 'Un po’ di storia',
    title: 'La Sicilia araba, proprio sotto i nostri piedi',
    intro: 'Nell’827 gli Arabi sbarcano a Mazara del Vallo. Resteranno più di due secoli, fino ai Normanni a fine XI secolo. Si dice « dominazione araba » come se fosse una parentesi: in realtà quasi tutto ciò che amiamo qui viene da lì. I nomi dei paesi, quello che c’è nel piatto, l’acqua nei campi, perfino la festa del paese accanto. Qualche esempio, tutti a meno di 20 km.',
    facts: [
      {
        icon: 'droplet',
        title: 'Donnalucata = « la fonte delle ore »',
        text: 'A 3 km da qui. Il nome viene dall’arabo ʿAyn al-awqāt. Il grande geografo al-Idrisi lo annota nel XII secolo: « Presso Scicli è ancora la fonte chiamata ʿAyn al-awqāt, perché l’acqua vi sgorga nelle ore delle preghiere e smette in tutte le altre. » Una sorgente che scorreva cinque volte al giorno, al ritmo della preghiera musulmana. Il nome ha attraversato mille anni quasi intatto — e noi ci andiamo a comprare il pesce senza pensarci.',
      },
      {
        icon: 'landmark',
        title: 'La festa di Scicli rievoca una battaglia contro i Saraceni',
        text: 'La Madonna delle Milizie, patrona di Scicli. L’ultimo sabato di maggio il paese rievoca in costume la battaglia del 1091 tra i Normanni del conte Ruggero e i Saraceni dell’emiro Belcane — che la tradizione colloca nella piana davanti al mare di Donnalucata. Una Madonna a cavallo, spada in mano: è l’unica al mondo. Il dolce della festa si chiama « testa di turco ».',
      },
      {
        icon: 'citrus',
        title: 'Gli agrumi, l’irrigazione e le parole per dirli',
        text: 'Limoni, arance amare, canna da zucchero, cotone, pistacchio, melone: sono gli Arabi a portarli, con le tecniche per irrigarli in un’isola secca. Il vocabolario è rimasto nel dialetto: la saia (il canale, da sāqiya), la gebbia (la vasca, da jābiya), la zàgara (il fiore d’arancio, da zahra). Parole che usiamo ancora senza sapere che sono arabe.',
      },
      {
        icon: 'cone',
        title: 'Nel piatto, ogni giorno',
        text: 'La granita discende dallo sharbat. Il cuscus si mangia ancora a Trapani. Lo zibibbo viene da zabīb, l’uva passa. E quel gusto siciliano per l’agrodolce — la caponata, la pasta con le sarde con uvetta e pinoli — è cucina araba passata all’italiana. La cassata stessa prenderebbe nome da qas‘ah, la scodella in cui si modellava.',
      },
      {
        icon: 'map',
        title: 'I nomi sulla carta stradale',
        text: 'Quando guidate, leggete arabo. Tutto ciò che inizia per Calta- viene da qal‘at, la fortezza: Caltanissetta, Caltagirone. Marsala è marsa, il porto. Gibellina e Gibilrossa vengono da jabal, la montagna. Alcantara è al-qantara, il ponte. Misilmeri, manzil al-amir, la dimora dell’emiro. E vicino a Scicli, la contrada Balata deve il nome a balāt, la lastra di pietra.',
      },
    ],
    note: 'Un dettaglio che dice tutto: i Normanni cacciarono gli Arabi, ma ne tennero i giardinieri, gli ingegneri e i poeti. La Sicilia non ha mai scelto tra le sue eredità — le ha impilate.',
    moreTitle: 'Se l’argomento vi prende',
    moreDesc: 'Libero Reina racconta questa Sicilia araba su Instagram — e la racconta in musica, che è il modo migliore per sentirla.',
  },
  localPage: {
    title: 'Locale & responsabile',
    intro: 'I nostri indirizzi per un consumo locale e responsabile: piccoli produttori e artigiani del sud-est della Sicilia, scelti per la qualità dei loro prodotti e per sostenere l’agricoltura della regione.',
    note: 'Completiamo questa pagina man mano che scopriamo — indirizzi e contatti in arrivo.',
    mapLabel: 'Apri in Google Maps',
    badge: 'Responsabile & locale',
    filterAll: 'Vedi tutto',
    filterEmpty: 'Questi indirizzi arrivano presto.',
    searchPlaceholder: 'Cerca un luogo, una voglia…',
    suggestFor: 'Niente che si chiami « {q} » da noi — ma ecco quello che ci si avvicina di più.',
    zoomIn: 'Ingrandisci la mappa',
    zoomOut: 'Riduci la mappa',
    zoomReset: 'Rivedi tutta la mappa',
    legendVillages: 'Paesi',
    legendYou: 'Siete qui',
    locateMe: 'Dove sono?',
    locating: 'Ricerca…',
    locateOk: 'Il punto blu siete voi. La mappa è disegnata a mano, non in scala: la posizione è approssimativa, ma vi situa rispetto ai paesi.',
    locateFar: 'Siete lontani da Cava d’Aliga — troppo per apparire su questa mappa. Riprovate una volta sul posto.',
    locateError: 'Impossibile localizzarvi. Forse il browser ha rifiutato la posizione, o il segnale è troppo debole.',
    legendSpots: 'I nostri indirizzi',
    categories: [
      {
        title: 'Cioccolato di Modica',
        desc: 'La capitale del cioccolato lavorato a freddo (ricetta di origine azteca), a ~30 min.',
        spots: [{ label: 'Antica Dolceria Bonajuto — Modica, la più antica (dal 1880)', url: 'https://www.bonajuto.it', instagram: 'https://www.instagram.com/bonajuto/' }],
      },
      {
        title: 'Olio d’oliva — DOP Monti Iblei',
        desc: 'Chiaramonte Gulfi, « città dell’olio », e i suoi frantoi premiati (Tonda Iblea).',
        spots: [
          { label: 'Frantoi Cutrera — Chiaramonte Gulfi', url: 'https://www.google.com/maps/search/?api=1&query=Frantoi+Cutrera+Chiaramonte+Gulfi', instagram: 'https://www.instagram.com/frantoi_cutrera/' },
          { label: 'Gatto Frantoio — Chiaramonte Gulfi', url: 'https://www.gattofrantoio.com' },
        ],
      },
      {
        title: 'Agrumi, peperoncino & spezie',
        desc: 'Limoni, arance, peperoncino, origano e sale marino si trovano ai mercati e dai piccoli produttori vicini.',
        spots: [],
      },
      {
        title: 'Piante & fiori',
        desc: 'Vivai locali per abbellire la casa e il giardino.',
        spots: [{ label: 'Vivai attorno a Scicli', url: 'https://www.google.com/maps/search/?api=1&query=vivaio+Scicli' }],
      },
    ],
    markets: {
      title: 'Mercati',
      desc: 'Frutta, verdura, formaggi e pesce del giorno, direttamente dai produttori.',
      list: [
        { label: 'Mercato di Scicli — martedì mattina, Piazza Olimpiadi', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Olimpiadi+Scicli' },
        { label: 'Mercato degli agricoltori di Marina di Ragusa — venerdì mattina (giu–set)', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Vincenzo+Rabito+Marina+di+Ragusa' },
        { label: 'Mercato del pesce di Donnalucata — pesce fresco del giorno', url: 'https://www.google.com/maps/search/?api=1&query=Mercato+ittico+Donnalucata' },
      ],
    },
  },
  salvaPage: { title: 'La famiglia', intro: 'Foto, ricordi e storia della famiglia, nel corso degli anni.', historyTitle: 'Storia della famiglia', historyText: "Di generazione in generazione, questa casa di Cava d’Aliga riunisce la famiglia. Presto ne racconteremo qui la storia — le origini, le estati condivise e i volti che l’hanno animata.", treeTitle: 'Albero genealogico', treeNote: 'Presto: un albero partecipativo dove ognuno potrà aggiungere il proprio ramo.', treePaternal: 'Nonni paterni', treeMaternal: 'Nonni materni', treeWife1: '1ª moglie', treeWife2: '2ª moglie', treeAdd: '+ Aggiungi il mio ramo', treeAddSubject: 'Albero genealogico — il mio ramo', treeExample: 'Struttura di esempio — diteci i legami reali e completiamo.' },
  calendarPage: { title: 'Il calendario', intro: 'I periodi in cui la casa è occupata, per coordinarsi in famiglia.', festivalsTitle: 'Feste siciliane', programTitle: 'Prossimi eventi', programNote: 'Sotto il cielo di Bruca — il programma dell’estate, a due passi da casa. Seguite i colori.', programMore: 'Dettagli e orari su Instagram', socialsTitle: 'Da seguire', festivalDescs: ["Il grande giorno dell’estate italiana. Erede delle Feriae Augusti romane e legata all’Assunzione, la festa riunisce famiglie e paesi in riva al mare: bagni, grandi pranzi, processioni e fuochi d’artificio animano tutta la Sicilia.", "San Rocco, invocato da secoli contro le epidemie, protegge molte comunità siciliane. A Scicli la sua statua è portata in processione tra i vicoli, tra bande musicali e luminarie di festa.", "San Giovanni Battista è il patrono di Ragusa, a cui è dedicata la cattedrale. Il 29 agosto, giorno della sua decollazione, la città si illumina: solenne processione della statua e grande spettacolo pirotecnico sopra la città vecchia.", "San Corrado Confalonieri, eremita venerato come patrono di Noto. L’ultima domenica d’agosto, la sua urna d’argento attraversa le vie barocche in una grande devozione popolare, tra ceri, fiori e cortei."], legend: { occupied: 'Occupato', tentative: 'In attesa', free: 'Libero', festival: 'Festa siciliana' } },
  culturePage: {
    eyebrow: 'Cultura',
    title: 'Suoni & immagini',
    intro: 'Questo angolo di Sicilia ha una colonna sonora e scenografie da cinema. Una playlist condivisa da ascoltare in viaggio, e i film e le serie girati a pochi chilometri da casa — spesso in strade che riconoscerete.',
    playlistTitle: 'La playlist della famiglia',
    playlistDesc: 'Una playlist condivisa: ognuno aggiunge ciò che ascolta qui. Per la strada dall’aeroporto, la cucina o la terrazza la sera.',
    playlistCta: 'Apri su Spotify',
    playlistSoon: 'Il link della playlist arriva presto.',
    artistsTitle: 'Canzoni & storie di Sicilia',
    artistsIntro: 'Le voci che raccontano l’isola — da ascoltare prima, durante, dopo.',
    handsTitle: 'Parlare con le mani',
    handsIntro: 'Nel 1958 il designer milanese Bruno Munari fotografa cinquanta gesti italiani e li didascalizza in quattro lingue. Il titolo dice tutto: « Supplemento al dizionario italiano ». Non lo fa per scherzo — lo fa per gli stranieri di passaggio in Italia. Cioè per noi.',
    handsWho: 'Bruno Munari (Milano, 1907-1998) comincia tra i futuristi a vent’anni, poi passa la vita a smontare la serietà: le sue « macchine inutili » del 1933 girano al soffitto senza produrre nulla, fonda il Movimento Arte Concreta, inventa libri illeggibili e apre nel 1977 il primo laboratorio per bambini di un museo italiano, alla Pinacoteca di Brera. Tre Compassi d’oro, più uno alla carriera. I gesti non li ha inventati: li ha presi dal canonico Andrea de Jorio, che li aveva raccolti a Napoli nel 1832, e ci ha aggiunto i suoi — fino all’« O.K. » americano.',
    handsBookCta: 'Il libro da Corraini',
    handsBook2Title: 'Design as Art',
    handsBook2Desc: 'Il suo libro più letto, pubblicato da Laterza nel 1966 con il titolo « Arte come mestiere ». Munari guarda le lampade, i segnali stradali, i manifesti, le automobili e le sedie, e ogni volta chiede la stessa cosa: è bello, funziona, è per tutti? Picasso lo chiamava « il nuovo Leonardo ». Ristampato nei Penguin Modern Classics nel 2008.',
    handsBook2Cta: 'Il libro da Penguin',
    handsPhotoNote: 'La mano sulla copertina del Supplemento è « ma che vuoi » — il gesto da cui parte tutto. Gli altri sono nel libro, e qui non ci stanno: sono sotto diritti. Mostriamo le copertine, non quello che c’è dentro.',
    handsCoverAlt: 'Copertina di « Speak Italian: The Fine Art of the Gesture » di Bruno Munari: una mano fotografata in bianco e nero, le cinque dita unite a pigna.',
    handsCoverCredit: 'Bruno Munari, Speak Italian: The Fine Art of the Gesture — Chronicle Books, 2005',
    handsCover2Alt: 'Copertina di « Design as Art » di Bruno Munari per Penguin: sedici volti disegnati in bianco e nero, ognuno in uno stile diverso, su fondo crema.',
    handsCover2Credit: 'Bruno Munari, Design as Art — Penguin Modern Classics, 2008',
    photosTitle: 'Fotografato qui',
    photosIntro: 'Prima dei telefoni, altri hanno guardato queste pietre e queste feste — e le hanno fissate per sempre.',
    artsTitle: 'Dipinto qui',
    artsIntro: 'Scicli non è solo un set televisivo: è un vero focolaio di pittura, e questo mare è stato dipinto per tutta una vita.',
    screensTitle: 'Sullo schermo, qui',
    screensIntro: 'Girato accanto a casa. Guardate prima di venire: vedrete la zona con altri occhi.',
    placeLabel: 'Vedi il luogo',
    moreLabel: 'Scopri di più',
    note: 'Avete una chicca? Una canzone, un film, una serie: ditecelo e la aggiungiamo.',
  },
  movePage: {
    eyebrow: 'Spostarsi',
    title: 'Bus, strade e aerei',
    intro: 'Si può benissimo vivere qui senza auto per andare da un paese all’altro. Ecco dove guardare.',
    appLabel: 'App',
    urgencyEyebrow: 'Emergenze',
    urgencyTitle: 'In caso di guai',
    urgencyIntro: 'In Sicilia basta un solo numero: rispondono, vi parlano e vi passano al servizio giusto. I vecchi numeri restano raggiungibili se li conoscete.',
    nueLabel: 'Numero unico di emergenza',
    nueNote: 'Gratuito, da qualsiasi telefono, anche senza credito né SIM. Rispondono in italiano e in inglese.',
    alsoLabel: 'Sempre attivi',
    localTitle: 'Contatti sul posto',
    pharmacyWalk: 'A 300 m — ci si va a piedi',
    hoursNote: 'Orari presi da OpenStreetMap: da confermare sulla porta.',
    dutyTitle: 'Farmacia di turno',
    dutyDesc: 'Di notte e nei giorni festivi c’è sempre una farmacia di turno a Scicli, a rotazione — e la nostra, Trovato, ne fa parte. Il turno del giorno si vede qui. Attenzione: la farmacia di turno notturno ha la saracinesca abbassata, bisogna suonare il citofono per svegliare il farmacista.',
    dutyCta: 'Vedi il turno di oggi',
    gasDesc: 'Il signore vicino alla piazza è lui. Vendita di bombole, e ripara anche le cucine a gas. Consegna a domicilio — ed è in paese, a poche strade da qui.',
    gasWalk: 'In paese',
    gasLandline: 'Fisso',
    gasMobile: 'Cellulare',
    plumberTitle: 'Idraulico',
    plumberDesc: 'C’è, ed è bravo. Il suo numero non è sul sito: chiedetelo a Mag. E non si parte senza preventivo — si fa fare il preventivo, lo si conferma con lei, e solo dopo iniziano i lavori. Evita brutte sorprese a tutti.',
    localToCome: 'il medico o un taxi',
  },
  tastePage: {
    eyebrow: 'Usi e costumi',
    title: 'Le abitudini del posto',
    intro: 'Tre cose da sapere per non sembrare turisti — e soprattutto per non perderle.',
    facts: [
      {
        icon: 'cone',
        title: 'La granita con la brioche è la colazione',
        text: 'Non un dolce: la vera colazione siciliana d’estate. Si ordina una granita — mandorla, limone, gelso, pistacchio, caffè — con una brioche col tuppo, quella con il ciuffo in testa. E la brioche si inzuppa. Alzarsi presto e andarla a mangiare al bar prima che cali il caldo è uno dei motivi migliori per essere qui.',
      },
      {
        icon: 'fork',
        title: 'Arancina o arancino? Attenzione, campo minato',
        text: 'La palla di riso fritta divide l’isola da secoli: Palermo dice arancina, al femminile, Catania dice arancino, al maschile. L’Accademia della Crusca ha infine deciso — valgono entrambi: il maschile viene dal dialetto (aranciu → arancinu), il femminile dall’italiano (arancia → arancina). Qui, nel Ragusano, si dice arancina. Da Giannone, a Donnalucata, andate a ordinarle la mattina.',
      },
      {
        icon: 'compass',
        title: 'La passeggiata, l’ora in cui il paese esce',
        text: 'Quando cala il caldo, scendono tutti: si cammina piano, ci si ferma ogni dieci metri a parlare, si guarda e ci si lascia guardare. Non è una passeggiata, è un appuntamento. Verso le 19, sul lungomare. Non organizzate niente a quell’ora — è lì che il paese esiste.',
      },
    ],
  },
  cultureFilter: {
    all: 'Vedi tutto',
    playlist: 'La playlist',
    screens: 'Schermi',
    painting: 'Pittura',
    photo: 'Foto',
    hands: 'Le mani',
    songs: 'Canzoni',
  },
  regionFilter: {
    all: 'Vedi tutto',
    places: 'I luoghi',
    customs: 'Usi e costumi',
    arab: 'Sicilia araba',
  },
  infoFilter: {
    all: 'Vedi tutto',
    address: 'Indirizzo',
    arrival: 'Arrivo',
    move: 'Spostarsi',
    urgent: 'Emergenze',
    waste: 'Rifiuti',
    leaving: 'La partenza',
  },
  askMag: {
    text: 'Qui non abbiamo ancora l’informazione. Scrivete a Mag: vi risponde, e noi la aggiungiamo per i prossimi.',
    textFor: 'Per {what}: qui non abbiamo ancora l’informazione. Scrivete a Mag, vi risponde — e noi la aggiungiamo per i prossimi.',
    cta: 'Scrivi a Mag',
    subject: 'Una domanda dal sito',
  },
  wastePage: {
    eyebrow: 'Raccolta differenziata',
    title: 'Quale pattumiera, quale sera',
    intro: 'A Cava d’Aliga ogni tipo di rifiuto ha il suo giorno. I bidoni si mettono fuori la sera prima: il camion passa presto.',
    today: 'Stasera',
    tomorrow: 'Domani sera',
    noneToday: 'Niente da mettere fuori',
    eveningNote: 'I bidoni si mettono fuori la sera, non la mattina — il camion è già passato. Se saltate il passaggio prima di partire, lasciate i sacchi sulla terrazza, mai in strada.',
    days: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
  },
  ctaEyebrow: 'Voglia di venire?',
  ctaTitle: 'Scriveteci',
  question: 'Una domanda sul vostro soggiorno?',
  contactLabels: { email: 'Email' },
  pages: {
    'informations-pratiques': {
      eyebrow: 'Informazioni pratiche',
      title: 'Info pratiche',
      intro: 'Arrivo, partenza, dotazioni dell’appartamento, consigli — e di che gestire la quotidianità come gli imprevisti.',
    },
    'services-locaux': {
      eyebrow: 'Servizi locali e contatti utili',
      title: 'I nostri indirizzi nei dintorni',
      intro: 'Negozi, ristoranti, mercati e contatti utili: i nostri consigli personali per vivere Cava d’Aliga come a casa.',
    },
    'la-region': {
      eyebrow: 'La regione',
      title: 'Scoprire il sud-est della Sicilia',
      intro: 'Scicli, Ragusa, il barocco del Val di Noto, le spiagge nascoste e la campagna degli Iblei.',
    },
    contact: {
      eyebrow: 'Contatti',
      title: 'Parliamo del vostro soggiorno',
      intro: 'Una domanda, voglia di prenotare? Scriveteci, rispondiamo personalmente e con piacere.',
    },
  },
  prepare: {
    eyebrow: 'Preparare il viaggio',
    title: 'Tutto quello che viene prima della partenza',
    intro: 'Voli, aeroporto d’arrivo, come raggiungere la casa… e una check-list per non dimenticare nulla prima di chiudere la valigia.',
    groups: [
      {
        icon: '✈️',
        title: 'Trovare un volo',
        links: [
          { label: 'Skyscanner', url: 'https://www.skyscanner.it' },
        ],
        items: ['Il nostro consiglio: cercate su Skyscanner e scegliete un volo che arriva presto a Catania — potrete prendere il bus in giornata.', 'Controllate la politica sui bagagli (spesso a pagamento sulle compagnie low-cost).'],
      },
      {
        icon: '🛬',
        title: 'Scegliere l’aeroporto d’arrivo',
        items: [
          'Catania (CTA) — il nostro aeroporto consigliato: più voli e il bus diretto per la zona (circa 1 h 30 in auto).',
          'Comiso (CIY) — il più vicino, circa 40 min di strada.',
          'Palermo (PMO) — il più lontano, circa 3 h, solo per le buone offerte.',
        ],
      },
      {
        icon: '🚗',
        title: 'Raggiungere Casa Cava d’Aliga',
        links: [
          { label: 'AST — orari', url: 'https://www.astsicilia.it/' },
          { label: 'Trenitalia', url: 'https://www.trenitalia.com/' },
          { label: 'Goldcar', url: 'https://www.goldcar.es/' },
        ],
        items: [
          'Bus AST — dall’aeroporto di Catania verso Modica, Scicli, Donnalucata e Pozzallo (orari su astsicilia.it).',
          'Treno — la linea regionale collega Modica, Scicli, Pozzallo e Ragusa (orari e biglietti su trenitalia.com).',
          'Noleggio auto — comodo per esplorare la regione; consigliamo Goldcar, all’aeroporto di Catania. All’uscita dell’aeroporto, girate a destra: tutti gli autonoleggi sono riuniti nello stesso punto.',
          'Importante: la carta di credito deve essere intestata alla persona che ha prenotato. Goldcar blocca una cauzione (circa 950 € a oggi) se non si prende l’assicurazione, che resta facoltativa.',
          'Autista privato — Giovanni, la nostra perla: 10 € da Donnalucata all’appartamento, 20 € da Pozzallo, 150 € dall’aeroporto di Catania. Fino a 5-6 persone. Chiedete il suo numero a Mag e avvisatelo in anticipo in base alla disponibilità (tenete un piano B).',
          'Non contate di trovare Uber: l’app non copre questa zona rurale (in Italia Uber funziona solo a Roma e Milano, e soltanto con taxi/autisti con licenza). Qui si conta su Giovanni, un taxi locale o il bus.',
        ],
      },
    ],
    checklistTitle: 'Check-list prima di partire',
    checklistNote: 'Soprattutto per Mag, che l’ultima volta ha dimenticato le chiavi.',
    checklist: [
      'Le chiavi dell’appartamento',
      'Passaporto / carta d’identità validi',
      'Biglietti aerei e conferma della prenotazione',
      'Patente di guida (e patente internazionale se serve)',
      'Carta di credito (tipo Visa) in caso di noleggio auto, + un po’ di contanti',
      'Adattatore non necessario (stesse prese italiane)',
      'Crema solare e costume: il mare è a due passi',
    ],
  },
  arrivee: {
    eyebrow: 'Arrivo',
    title: 'La guida delle prime ore',
    intro: 'Indirizzo, accesso e funzionamento rapido della casa — tutto per sistemarvi con serenità appena arrivati.',
    addressLabel: 'Indirizzo',
    address: ['Via Basilicata 6, piano terra', '97018 Cava d’Aliga', 'Scicli (RG) — Sicilia'],
    mapsLabel: 'Apri in Google Maps',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Basilicata+6+Cava+d%27Aliga+97018+Scicli+RG',
    operationTitle: 'Funzionamento della casa',
    operation: [
      { icon: 'bolt', title: 'Elettricità', items: ['Interruttori da attivare fuori, sulla terrazza davanti, a destra della porta.'] },
      { icon: 'drop', title: 'Acqua', items: ['In strada: scendere a destra, all’angolo.', 'Aprire la seconda valvola dal basso → in parallelo = APERTA (perpendicolare = CHIUSA).'] },
      { icon: 'flame', title: 'Gas', items: ['Mormina Gas, Via Tolstoj — vende le bombole, consegna a domicilio e ripara le cucine. I contatti sono più sotto.'] },
      { icon: 'signal', title: 'Wifi', items: ['Rete: cacestlaissetomber', 'Password: jamonito'] },
    ],
  },
  depart: {
    eyebrow: 'Partenza',
    title: 'Lasciare la casa in tutta serenità',
    intro: 'La piccola check-list da spuntare prima di chiudere la porta.',
    checklistTitle: 'Prima di chiudere la porta',
    checklistNote: 'Spuntate man mano — non viene salvato nulla, serve solo a non dimenticare niente.',
    checklist: [
      'Chiudere l’acqua: la valvola del bagno, poi quella in strada (all’angolo, scendendo a destra) — perpendicolare = chiusa.',
      'Staccare l’elettricità: gli interruttori fuori, sulla terrazza davanti, a destra della porta.',
      'Chiudere la bombola del gas.',
      'Svuotare il frigo, staccarlo e lasciare lo sportello socchiuso perché non faccia muffa.',
      'Portare fuori i rifiuti secondo la raccolta del giorno. Passaggio mancato? Lasciateli sulla terrazza, mai in strada.',
      'Chiudere persiane e finestre, anche al piano di sopra.',
      'Panni sporchi nel cesto, asciugamani e lenzuola usati raccolti insieme.',
      'Ultimo giro: caricabatterie, bagno, terrazza, sotto i letti.',
      'Chiudere a chiave e rimettere le chiavi al loro posto.',
    ],
  },
};

const EN: Dict = {
  nav: ['The family', 'The region', 'Sounds & screens', 'The trip', 'Practical info', 'Our spots', 'Calendar'],
  region: 'Sicily',
  tagline: 'a village in south-east Sicily',
  subLabels: ['Near Scicli in the province of Ragusa'],
  writeUs: 'Write to us',
  contactLink: 'Contact',
  persoSite: "Mag's personal site",
  intro: 'The family apartment where we grew up, a few metres from the sea.',
  welcome: 'Welcome',
  highlights: [
    { value: 'Ground floor', label: 'A ground-floor apartment, accessible and bright' },
    { value: 'Steps away', label: 'The sea just a few metres from the door' },
    { value: 'South-east', label: 'Cava d’Aliga, a seaside hamlet of Scicli, province of Ragusa' },
  ],
  everythingForStay: 'Everything for your stay',
  sectionsWord: 'sections',
  ctaTitles: [
    'Family memories',
    'Discover the region',
    'Sounds & screens',
    'Plan the trip properly',
    'All the practical info',
    'Our spots',
    'See the calendar',
  ],
  tasteOfSicily: 'A taste of Sicily',
  galleryAlt: [
    'The sea a few metres from Cava d’Aliga',
    'An alley in the hamlet of Cava d’Aliga',
    'Scicli, a baroque town of Val di Noto',
    'The beach of Cava d’Aliga',
    'Sunset over the Sicilian coast',
  ],
  apartmentAlt: 'The living room of the family apartment in Cava d’Aliga',
  cavaAlt: 'The beach and village of Cava d’Aliga',
  scicliAlt: 'Panoramic view of Scicli, baroque town of the Val di Noto',
  placesTitle: 'The places around us',
  placesIntro: 'Ten places, from next door to an hour and a half away. Each carries its distance from the house: what you can walk to, what needs the car, and what deserves a whole day. Five are World Heritage sites.',
  regionPlaces: [
    'A seaside hamlet of Scicli, Cava d’Aliga takes its name from the Sicilian « aliga » (seaweed, posidonia): once a fishermen’s cove, now a holiday village with fine sandy beaches. This is where the house is.',
    'A jewel of Val di Noto Baroque and a UNESCO site, Scicli was rebuilt after the 1693 earthquake. Set between three hills, its golden churches and palaces are a backdrop for the Inspector Montalbano series.',
    'A small beach between Donnalucata and Cava d’Aliga, Bruca is a quiet spot with pale sand that comes alive in summer around its community: concerts, open-air cinema and Comitato Bruca festivities.',
    'A former fishing village with colourful houses, Sampieri unrolls one of the longest beaches on the coast. Its old-world charm has made it a recurring filming location for Montalbano.',
    'On the headland stand the ruins of the Fornace Penna, an early-20th-century brickworks destroyed by fire in 1924. Its silhouette against the sea — Montalbano’s « Mànnara » — has become iconic.',
    'A lively seaside resort of Ragusa, Marina di Ragusa lines up a long sandy beach (Blue Flag), a marina and a promenade that come alive in summer — swimming, aperitivi and evenings by the water.',
    'A Baroque town cascading down a gorge, Modica is world-famous for its cold-worked chocolate, made to an Aztec-origin recipe. Its church of San Giorgio ranks among the masterpieces of Sicilian Baroque.',
    'Perched on a rocky spur, Ragusa is split between the upper town and Ibla, its labyrinthine Baroque heart. The San Giorgio cathedral crowns a sloping square lined with palaces.',
    'The capital of Val di Noto Baroque, Noto was entirely rebuilt in golden stone after the 1693 earthquake. Its avenue lines up cathedral, palaces and churches of dazzling theatricality, especially at sunset.',
    'Once a rival of Athens, Syracuse was one of the greatest cities of the Greek world. Its island of Ortygia blends ancient temples, Baroque lanes and seafront; its archaeological park holds a Greek theatre and the Ear of Dionysius.',
  ],
  regionHighlights: [
    ['Sandy beach and rocky coves along the coast.', 'Seafront walk to Donnalucata.'],
    ['Baroque centre listed as a UNESCO World Heritage site.', 'Churches of San Bartolomeo, San Giovanni Evangelista and San Matteo.', 'Palazzo Beneventano and Via Mormino Penna.', 'Inspector Montalbano filming locations (the town hall = Vigàta police station).'],
    ['Pale sandy beach with shallow water.', 'Nature reserves and coastal trails.'],
    ['A long sandy beach on the south coast.', 'Old fishing village with colourful houses.', 'Inspector Montalbano filming locations.'],
    ['Ruins of the Fornace Penna (a 1912 brickworks).', 'Headland and rocky coast facing the sea.'],
    ['Long sandy beach (Blue Flag).', 'Marina and the Torre Cabrera, a 16th-century watchtower.'],
    ['San Giorgio cathedral and its monumental staircase.', 'San Pietro church with its statues of the apostles.', 'Modica PGI chocolate, cold-worked.'],
    ['San Giorgio cathedral in Ibla, a masterpiece by Rosario Gagliardi.', 'The lanes of Ibla and the Giardino Ibleo.', 'San Giovanni cathedral in the upper town.'],
    ['San Nicolò cathedral and Corso Vittorio Emanuele.', 'Palazzo Nicolaci and its Baroque balconies.', 'Basilica of the Santissimo Salvatore.'],
    ['Ortygia: the Duomo built on a Greek temple, and the Arethusa spring.', 'Archaeological park: Greek theatre and the Ear of Dionysius.', 'Castello Maniace at the tip of Ortygia.'],
  ],
  unescoLabel: 'UNESCO World Heritage',
  regionHere: 'On site',
  arabPage: {
    eyebrow: 'A little history',
    title: 'Arab Sicily, right under our feet',
    intro: 'In 827 the Arabs landed at Mazara del Vallo. They stayed more than two centuries, until the Normans arrived in the late 11th century. People say “Arab rule” as if it were a parenthesis: in fact almost everything we love here comes from it. The village names, what is on the plate, the water in the fields, even the festival in the next town. A few examples, all within 20 km.',
    facts: [
      {
        icon: 'droplet',
        title: 'Donnalucata = “the spring of the hours”',
        text: '3 km from here. The name comes from the Arabic ʿAyn al-awqāt. The great geographer al-Idrisi recorded it in the 12th century: “Near Scicli is the spring called ʿAyn al-awqāt, because the water gushes at the hours of prayer and stops at all others.” A spring that ran five times a day, to the rhythm of Muslim prayer. The name crossed a thousand years almost intact — and we go there to buy fish without a thought.',
      },
      {
        icon: 'landmark',
        title: 'Scicli’s festival re-enacts a battle against the Saracens',
        text: 'The Madonna delle Milizie, patron of Scicli. On the last Saturday of May the town re-enacts, in costume, the 1091 battle between Count Roger’s Normans and the Saracens of Emir Belcane — which tradition places on the plain facing the sea at Donnalucata. A Madonna on horseback, sword in hand: the only one in the world. The festival cake is called “testa di turco”, the Turk’s head.',
      },
      {
        icon: 'citrus',
        title: 'Citrus, irrigation, and the words for them',
        text: 'Lemons, bitter oranges, sugar cane, cotton, pistachio, melon: the Arabs brought them, along with the techniques to water them on a dry island. The vocabulary stayed in the dialect: saia (the irrigation channel, from sāqiya), gebbia (the basin, from jābiya), zàgara (orange blossom, from zahra). Words still used without anyone knowing they are Arabic.',
      },
      {
        icon: 'cone',
        title: 'On the plate, every day',
        text: 'Granita descends from sharbat. Couscous is still eaten in Trapani. Zibibbo comes from zabīb, the raisin. And that Sicilian taste for sweet-and-sour — caponata, pasta with sardines, raisins and pine nuts — is Arab cooking turned Italian. Cassata itself is said to take its name from qas‘ah, the bowl it was moulded in.',
      },
      {
        icon: 'map',
        title: 'The names on the road map',
        text: 'When you drive, you are reading Arabic. Everything starting with Calta- comes from qal‘at, the fortress: Caltanissetta, Caltagirone. Marsala is marsa, the port. Gibellina and Gibilrossa come from jabal, the mountain. Alcantara is al-qantara, the bridge. Misilmeri, manzil al-amir, the emir’s dwelling. And near Scicli, the Balata district owes its name to balāt, the stone slab.',
      },
    ],
    note: 'One detail says it all: the Normans drove the Arabs out, but kept their gardeners, their engineers and their poets. Sicily never chose between its inheritances — it stacked them.',
    moreTitle: 'If the subject grabs you',
    moreDesc: 'Libero Reina tells this Arab Sicily on Instagram — and he tells it through music, which is the best way to hear it.',
  },
  localPage: {
    title: 'Local & responsible',
    intro: 'Our addresses for local, responsible shopping: small producers and artisans of south-east Sicily, chosen for the quality of their products and to support the region’s farming.',
    note: 'We complete this page as we make new finds — addresses and contacts coming soon.',
    mapLabel: 'Open in Google Maps',
    badge: 'Responsible & local',
    filterAll: 'See all',
    filterEmpty: 'These addresses are coming soon.',
    searchPlaceholder: 'Search a place, a craving…',
    suggestFor: 'Nothing called “{q}” here — but this is the closest we have.',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    zoomReset: 'See the whole map',
    legendVillages: 'Villages',
    legendYou: 'You are here',
    locateMe: 'Where am I?',
    locating: 'Locating…',
    locateOk: 'The blue dot is you. The map is hand-drawn, not to scale: the position is approximate, but it places you among the villages.',
    locateFar: 'You are far from Cava d’Aliga — too far to show on this map. Try again once you are there.',
    locateError: 'Could not locate you. Your browser may have refused the position, or the signal is too weak.',
    legendSpots: 'Our spots',
    categories: [
      {
        title: 'Modica chocolate',
        desc: 'The capital of cold-worked chocolate (an Aztec-origin recipe), ~30 min away.',
        spots: [{ label: 'Antica Dolceria Bonajuto — Modica, the oldest (since 1880)', url: 'https://www.bonajuto.it', instagram: 'https://www.instagram.com/bonajuto/' }],
      },
      {
        title: 'Olive oil — DOP Monti Iblei',
        desc: 'Chiaramonte Gulfi, “town of oil”, and its award-winning mills (Tonda Iblea).',
        spots: [
          { label: 'Frantoi Cutrera — Chiaramonte Gulfi', url: 'https://www.google.com/maps/search/?api=1&query=Frantoi+Cutrera+Chiaramonte+Gulfi', instagram: 'https://www.instagram.com/frantoi_cutrera/' },
          { label: 'Gatto Frantoio — Chiaramonte Gulfi', url: 'https://www.gattofrantoio.com' },
        ],
      },
      {
        title: 'Citrus, chilli & spices',
        desc: 'Lemons, oranges, chilli, oregano and sea salt are found at the markets and from nearby small producers.',
        spots: [],
      },
      {
        title: 'Plants & flowers',
        desc: 'Local nurseries to brighten the house and garden.',
        spots: [{ label: 'Nurseries around Scicli', url: 'https://www.google.com/maps/search/?api=1&query=vivaio+Scicli' }],
      },
    ],
    markets: {
      title: 'Markets',
      desc: 'Fruit, vegetables, cheese and the day’s catch, straight from the producers.',
      list: [
        { label: 'Scicli market — Tuesday morning, Piazza Olimpiadi', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Olimpiadi+Scicli' },
        { label: 'Marina di Ragusa farmers’ market — Friday morning (Jun–Sep)', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Vincenzo+Rabito+Marina+di+Ragusa' },
        { label: 'Donnalucata fish market — fresh catch of the day', url: 'https://www.google.com/maps/search/?api=1&query=Mercato+ittico+Donnalucata' },
      ],
    },
  },
  salvaPage: { title: 'The family', intro: 'Photos, memories and family history, over the years.', historyTitle: 'Family history', historyText: "From one generation to the next, this house in Cava d’Aliga brings the family together. Its story will soon be written here — the origins, the shared summers and the faces that made it live.", treeTitle: 'Family tree', treeNote: 'Coming soon: a collaborative tree where everyone can add their branch.', treePaternal: 'Paternal grandparents', treeMaternal: 'Maternal grandparents', treeWife1: '1st wife', treeWife2: '2nd wife', treeAdd: '+ Add my branch', treeAddSubject: 'Family tree — my branch', treeExample: 'Example structure — tell us the real relationships and we’ll complete it.' },
  calendarPage: { title: 'The calendar', intro: 'When the house is occupied, so the family can coordinate.', festivalsTitle: 'Sicilian festivals', programTitle: 'Upcoming events', programNote: 'Sotto il cielo di Bruca — the summer programme, steps from the house. Follow the colours.', programMore: 'Details and times on Instagram', socialsTitle: 'Follow', festivalDescs: ["The high point of the Italian summer. Descended from the Roman Feriae Augusti and tied to the Assumption, the holiday gathers families and villages by the sea: swimming, big meals, processions and fireworks all across Sicily.", "Saint Roch, invoked for centuries against epidemics, protects many Sicilian communities. In Scicli his statue is carried in procession through the alleys, amid brass bands and festive lights.", "Saint John the Baptist is the patron of Ragusa, whose cathedral is dedicated to him. On 29 August, the day of his beheading, the town lights up: a solemn procession of the statue and a grand fireworks display over the old town.", "Saint Conrad Confalonieri, a hermit venerated as Noto’s patron. On the last Sunday of August, his silver urn moves through the baroque streets in great popular devotion, among candles, flowers and processions."], legend: { occupied: 'Occupied', tentative: 'Pending', free: 'Free', festival: 'Sicilian festival' } },
  culturePage: {
    eyebrow: 'Culture',
    title: 'Sounds & screens',
    intro: 'This corner of Sicily has a soundtrack and film-set scenery. A shared playlist for the drive, and the films and series shot a few kilometres from the house — often in streets you will recognise.',
    playlistTitle: 'The family playlist',
    playlistDesc: 'A shared playlist: everyone adds what they listen to here. For the drive from the airport, the kitchen, or the terrace at night.',
    playlistCta: 'Open in Spotify',
    playlistSoon: 'The playlist link is coming soon.',
    artistsTitle: 'Songs & stories of Sicily',
    artistsIntro: 'The voices that tell the island — listen before, during, after.',
    handsTitle: 'Talking with your hands',
    handsIntro: 'In 1958 the Milanese designer Bruno Munari photographed fifty Italian gestures and captioned them in four languages. The title says it all: “Supplement to the Italian dictionary”. He did not do it as a joke — he did it for foreigners visiting Italy. That is, for us.',
    handsWho: 'Bruno Munari (Milan, 1907-1998) started among the Futurists at twenty, then spent his life dismantling seriousness: his 1933 “useless machines” turn on the ceiling producing nothing, he co-founded the Concrete Art Movement, invented unreadable books, and in 1977 opened the first children’s workshop in an Italian museum, at the Brera gallery. Three Compasso d’Oro awards, plus one for his career. He did not invent the gestures: he took them from canon Andrea de Jorio, who catalogued them in Naples in 1832, and added his own — right up to the American “O.K.”.',
    handsBookCta: 'The book at Corraini',
    handsBook2Title: 'Design as Art',
    handsBook2Desc: 'His most widely read book, published by Laterza in 1966 as « Arte come mestiere » — art as a trade. Munari looks at lamps, road signs, posters, cars and chairs, and each time asks the same thing: is it beautiful, does it work, is it for everyone? Picasso called him “the new Leonardo”. Reissued as a Penguin Modern Classic in 2008.',
    handsBook2Cta: 'The book at Penguin',
    handsPhotoNote: 'The hand on the Supplemento cover is “ma che vuoi” — the gesture everything starts from. The others are in the book, and have no place here: they are under copyright. We show the covers, not what is inside them.',
    handsCoverAlt: 'Cover of “Speak Italian: The Fine Art of the Gesture” by Bruno Munari: a hand photographed in black and white, all five fingertips pinched together.',
    handsCoverCredit: 'Bruno Munari, Speak Italian: The Fine Art of the Gesture — Chronicle Books, 2005',
    handsCover2Alt: 'Cover of “Design as Art” by Bruno Munari for Penguin: sixteen faces drawn in black and white, each in a different style, on a cream background.',
    handsCover2Credit: 'Bruno Munari, Design as Art — Penguin Modern Classics, 2008',
    photosTitle: 'Photographed here',
    photosIntro: 'Before phones, others looked at these stones and these festivals — and fixed them for good.',
    artsTitle: 'Painted here',
    artsIntro: 'Scicli is not only a TV set: it is a real home of painting, and this sea was painted for a whole lifetime.',
    screensTitle: 'On screen, right here',
    screensIntro: 'Filmed next door. Watch before you come: you will see the area differently.',
    placeLabel: 'See the place',
    moreLabel: 'Learn more',
    note: 'Got a gem? A song, a film, a series — tell us and we’ll add it.',
  },
  movePage: {
    eyebrow: 'Getting around',
    title: 'Buses, roads and planes',
    intro: 'You can live here perfectly well without a car to go from village to village. Here is where to look.',
    appLabel: 'App',
    urgencyEyebrow: 'Emergencies',
    urgencyTitle: 'If something goes wrong',
    urgencyIntro: 'In Sicily one number is enough: they pick up, talk to you, and put you through to the right service. The old numbers still work if you know them.',
    nueLabel: 'Single emergency number',
    nueNote: 'Free, from any phone, even with no credit or SIM. They answer in Italian and English.',
    alsoLabel: 'Still active',
    localTitle: 'Local contacts',
    pharmacyWalk: '300 m away — walkable',
    hoursNote: 'Hours taken from OpenStreetMap: check the door to be sure.',
    dutyTitle: 'On-duty pharmacy',
    dutyDesc: 'At night and on holidays one pharmacy in Scicli is always on duty, by rotation — and ours, Trovato, is part of it. Today’s rota is here. Note: the night pharmacy has its shutter down, you have to ring the intercom to wake the pharmacist.',
    dutyCta: 'See today’s rota',
    gasDesc: 'The gentleman near the square is him. He sells bottles and also repairs gas cookers. He delivers to your door — and he is in the village, a few streets away.',
    gasWalk: 'In the village',
    gasLandline: 'Landline',
    gasMobile: 'Mobile',
    plumberTitle: 'Plumber',
    plumberDesc: 'There is one, and he is good. His number is not on the site: ask Mag for it. And nothing starts without a quote — get the quote, confirm it with her, and only then does the work begin. It saves everyone nasty surprises.',
    localToCome: 'the doctor or a taxi',
  },
  tastePage: {
    eyebrow: 'Local customs',
    title: 'How things are done here',
    intro: 'Three things to know so you do not look like a tourist — and above all, so you do not miss them.',
    facts: [
      {
        icon: 'cone',
        title: 'Granita with brioche is breakfast',
        text: 'Not a dessert: the real Sicilian summer breakfast. You order a granita — almond, lemon, mulberry, pistachio, coffee — with a brioche col tuppo, the one with a topknot. And you dip the brioche in it. Getting up early to eat it at the bar before the heat arrives is one of the best reasons to be here.',
      },
      {
        icon: 'fork',
        title: 'Arancina or arancino? Careful, minefield',
        text: 'The fried rice ball has divided the island for centuries: Palermo says arancina, feminine; Catania says arancino, masculine. The Accademia della Crusca finally ruled — both are right: the masculine comes from dialect (aranciu → arancinu), the feminine from Italian (arancia → arancina). Here, in the Ragusa area, it is arancina. At Giannone in Donnalucata, go and order them in the morning.',
      },
      {
        icon: 'compass',
        title: 'The passeggiata, the hour the village comes out',
        text: 'When the heat drops, everyone comes down: you walk slowly, stop every ten metres to talk, look and let yourself be looked at. It is not a stroll, it is an appointment. Around 7pm, on the seafront. Plan nothing at that hour — that is when the village exists.',
      },
    ],
  },
  cultureFilter: {
    all: 'See all',
    playlist: 'The playlist',
    screens: 'Screens',
    painting: 'Painting',
    photo: 'Photo',
    hands: 'Hands',
    songs: 'Songs',
  },
  regionFilter: {
    all: 'See all',
    places: 'The places',
    customs: 'Local customs',
    arab: 'Arab Sicily',
  },
  infoFilter: {
    all: 'See all',
    address: 'Address',
    arrival: 'Arriving',
    move: 'Getting around',
    urgent: 'Emergencies',
    waste: 'Waste',
    leaving: 'Leaving',
  },
  askMag: {
    text: 'We do not have this yet. Write to Mag: she will answer you, and we will add it here for the next ones.',
    textFor: 'For {what}: we do not have this yet. Write to Mag, she will answer you — and we will add it here for the next ones.',
    cta: 'Write to Mag',
    subject: 'A question from the site',
  },
  wastePage: {
    eyebrow: 'Waste sorting',
    title: 'Which bin, which evening',
    intro: 'In Cava d’Aliga each kind of waste has its day. Bins go out the evening before: the truck comes early.',
    today: 'Tonight',
    tomorrow: 'Tomorrow evening',
    noneToday: 'Nothing to put out',
    eveningNote: 'Bins go out in the evening, not in the morning — by then the truck has been. If you miss the round before leaving, leave the bags on the terrace, never in the street.',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  ctaEyebrow: 'Ready to come?',
  ctaTitle: 'Write to us',
  question: 'A question about your stay?',
  contactLabels: { email: 'Email' },
  pages: {
    'informations-pratiques': {
      eyebrow: 'Practical information',
      title: 'Practical info',
      intro: 'Arriving, leaving, how the apartment is equipped, tips — and what you need for daily life and the unexpected.',
    },
    'services-locaux': {
      eyebrow: 'Local services & useful contacts',
      title: 'Our spots nearby',
      intro: 'Shops, restaurants, markets and useful contacts: our personal recommendations to live Cava d’Aliga like a local.',
    },
    'la-region': {
      eyebrow: 'The region',
      title: 'Discover south-east Sicily',
      intro: 'Scicli, Ragusa, the baroque of Val di Noto, the hidden beaches and the Iblei countryside.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Let’s talk about your stay',
      intro: 'A question, ready to book? Write to us — we reply personally and with pleasure.',
    },
  },
  prepare: {
    eyebrow: 'Plan your trip',
    title: 'Everything that happens before you leave',
    intro: 'Flights, arrival airport, how to reach the house… and a checklist so you forget nothing before closing the suitcase.',
    groups: [
      {
        icon: '✈️',
        title: 'Find a flight',
        links: [
          { label: 'Skyscanner', url: 'https://www.skyscanner.com' },
        ],
        items: ['Our tip: search on Skyscanner and pick a flight that lands early in Catania — you can catch the bus the same day.', 'Check the baggage policy (often an extra on low-cost airlines).'],
      },
      {
        icon: '🛬',
        title: 'Choose your arrival airport',
        items: [
          'Catania (CTA) — our recommended airport: the most flights and a direct bus to the area (about 1 h 30 by car).',
          'Comiso (CIY) — the closest, about 40 min away.',
          'Palermo (PMO) — the furthest, about 3 h, only for great deals.',
        ],
      },
      {
        icon: '🚗',
        title: 'Reach Casa Cava d’Aliga',
        links: [
          { label: 'AST — timetables', url: 'https://www.astsicilia.it/' },
          { label: 'Trenitalia', url: 'https://www.trenitalia.com/' },
          { label: 'Goldcar', url: 'https://www.goldcar.es/' },
        ],
        items: [
          'AST bus — from Catania airport to Modica, Scicli, Donnalucata and Pozzallo (timetables on astsicilia.it).',
          'Train — the regional line links Modica, Scicli, Pozzallo and Ragusa (timetables and tickets on trenitalia.com).',
          'Car rental — handy for exploring the region; we recommend Goldcar, at Catania airport. As you leave the airport, turn right: all the rental companies are grouped in the same spot.',
          'Important: the credit card must be in the name of the person who booked. Goldcar holds a deposit (around €950 as of today) if you decline the insurance, which is optional.',
          'Private driver — Giovanni, our gem: €10 from Donnalucata to the apartment, €20 from Pozzallo, €150 from Catania airport. Up to 5-6 people. Ask Mag for his number, and book ahead subject to availability (keep a plan B).',
          'Don’t count on finding an Uber: the app doesn’t cover this rural area (in Italy, Uber only runs in Rome and Milan, and only with licensed taxis/drivers). Here you rely on Giovanni, a local taxi or the bus.',
        ],
      },
    ],
    checklistTitle: 'Checklist before you go',
    checklistNote: 'Especially for Mag, who forgot the keys last time.',
    checklist: [
      'The apartment keys',
      'Valid passport / ID card',
      'Flight tickets and booking confirmation',
      'Driving licence (and international permit if needed)',
      'Credit card (Visa type) if renting a car, + some cash',
      'No adapter needed (same European sockets)',
      'Sunscreen and swimsuit: the sea is steps away',
    ],
  },
  arrivee: {
    eyebrow: 'Arrival',
    title: 'Your first-hours guide',
    intro: 'Address, access and how the house works — everything to settle in with ease as soon as you arrive.',
    addressLabel: 'Address',
    address: ['Via Basilicata 6, ground floor', '97018 Cava d’Aliga', 'Scicli (RG) — Sicily'],
    mapsLabel: 'Open in Google Maps',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Basilicata+6+Cava+d%27Aliga+97018+Scicli+RG',
    operationTitle: 'How the house works',
    operation: [
      { icon: 'bolt', title: 'Electricity', items: ['Switches to turn on outside, on the front terrace, to the right of the door.'] },
      { icon: 'drop', title: 'Water', items: ['In the street: go down to the right, at the corner.', 'Open the second valve from the bottom → parallel = OPEN (perpendicular = CLOSED).'] },
      { icon: 'flame', title: 'Gas', items: ['Mormina Gas, Via Tolstoj — he sells the bottles, delivers to your door and repairs cookers. His details are further down, in the contacts.'] },
      { icon: 'signal', title: 'Wifi', items: ['Network: cacestlaissetomber', 'Password: jamonito'] },
    ],
  },
  depart: {
    eyebrow: 'Departure',
    title: 'Leaving the house with peace of mind',
    intro: 'The short checklist to tick off before you close the door.',
    checklistTitle: 'Before you close the door',
    checklistNote: 'Tick as you go — nothing is saved, it is just so you forget nothing.',
    checklist: [
      'Turn off the water: the bathroom valve, then the street one (at the corner, down to the right) — perpendicular = closed.',
      'Turn off the electricity: the switches outside, on the front terrace, to the right of the door.',
      'Close the gas bottle.',
      'Empty the fridge, unplug it and leave the door ajar so it does not go mouldy.',
      'Put the bins out according to the day’s collection. Missed the round? Leave them on the terrace, never in the street.',
      'Close shutters and windows, upstairs too.',
      'Dirty laundry in the basket, used towels and sheets gathered together.',
      'Last sweep: chargers, bathroom, terrace, under the beds.',
      'Lock up and put the keys back where they belong.',
    ],
  },
};

const DICTS: Record<Lang, Dict> = { fr: FR, it: IT, en: EN };
export const LANG_LABELS: Record<Lang, string> = { it: 'IT', fr: 'FR', en: 'EN' };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const I18nContext = createContext<Ctx>({ lang: 'fr', setLang: () => {}, t: FR });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('cava-lang')) as Lang | null;
    if (saved && DICTS[saved]) setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      window.localStorage.setItem('cava-lang', l);
    } catch {}
  }

  return <I18nContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Sélecteur de langue IT · FR · EN */
export function LangSwitcher({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const { lang, setLang } = useI18n();
  const active = tone === 'light' ? 'var(--cava-bg)' : 'var(--cava-ink)';
  const idle = tone === 'light' ? 'rgba(239,239,239,0.5)' : 'rgba(46,45,45,0.4)';
  return (
    <div className={`flex items-center gap-2 text-[13px] tracking-[0.08em] ${className}`}>
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden style={{ color: idle }}>·</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className="uppercase transition-opacity hover:opacity-100"
            style={{ color: lang === l ? active : idle, fontWeight: lang === l ? 600 : 400 }}
          >
            {LANG_LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
