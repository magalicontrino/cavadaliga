'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { NAV } from './data';

/** Les pages du menu — tirees de NAV, pour qu'on ne puisse pas diverger. */
type Page = (typeof NAV)[number]['href'];

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
  /**
   * Les libelles, indexes PAR PAGE et non par rang.
   *
   * C'etaient deux tableaux alignes a la main sur l'ordre de NAV. En retirant
   * « Sons & images » du menu, tout ce qui suivait s'est decale d'un cran sans
   * qu'aucun outil ne bronche : l'accueil annonçait « Sons & images » et
   * ouvrait « Preparer le voyage ». Avec ces clefs, le typechecker refuse une
   * page sans titre — et un titre sans page.
   */
  nav: Record<Page, string>;
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
  ctaTitles: Record<Page, string>;
  tasteOfSicily: string;
  sunsetAlt: string;
  apartment: { eyebrow: string; title: string; albumAlt: string; captions: string[]; rooms: string[]; label: string; ctaTitle: string };
  // Rappel de la casa au bas des infos pratiques : quelques pieces + le lien.
  casaPeek: { eyebrow: string; title: string; link: string };
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
  // L'Etna : la montagne, le ski, et le fil qui mene de sa neige a la granita.
  etnaPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string }[];
    linkPark: string;
    linkSki: string;
    /** Excursions guidees. L'URL suit la langue : le site existe en fr et it,
     *  sa racine sert l'anglais (/en/ y redirige). */
    linkTours: string;
    linkToursUrl: string;
    photoAlt: string;
  };
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
    /** Bouton du site officiel, quand la fiche en a un. */
    siteLabel: string;
    /** Le picto marcheur, quand l'adresse est a moins d'un kilometre. */
    walkLabel: string;
    closeLabel: string;
    viewMap: string;
    viewList: string;
    /** L'infobulle de l'epingle du depart : on l'arrache en la touchant. */
    departReset: string;
    /** Le bandeau qui dit d'ou l'on compte, et comment revenir a la maison. */
    departFrom: string;
    departPin: string;
    departBack: string;
    houseHere: string;
    wherePlaceholder: string;
    whereSearching: string;
    whereNotFound: string;
    whereError: string;
    whereOut: string;
    mapFailed: string;
    mapFailedHint: string;
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
  salvaPage: { title: string; intro: string; historyTitle: string; storyText: string[]; storyOpen: string; storyOpenCta: string; storyOpenSubject: string; treeTitle: string; treeNote: string; treePaternal: string; treeMaternal: string; treeWife1: string; treeWife2: string; treeMarriage1: string; treeMarriage2: string; treeGreat: string; treeParents: string; treeChildren: string; treeQuestionsTitle: string; treeAdd: string; treeAddSubject: string; treeExample: string; treeOpen: string; treeClose: string; treeOpenAll: string; treeCloseAll: string; treeKid: string; treeKids: string; treeSideFather: string; treeSideMother: string; treeSideUs: string };
  // La page du calendrier des sejours. Son `title` sert AUSSI de titre aux CTA
  // qui pointent vers elle, depuis l'accueil et depuis les evenements.
  stayPage: { title: string; intro: string; legend: { occupied: string; tentative: string; free: string } };
  calendarPage: { title: string; intro: string; festivalsTitle: string; programDone: string; programNote: string; programMore: string; socialsTitle: string; festivalDescs: string[]; };
  culturePage: {
    eyebrow: string;
    title: string;
    intro: string;
    playlistDesc: string;
    playlistCta: string;
    playlistSoon: string;
    artistsIntro: string;
    screensIntro: string;
    artsIntro: string;
    sculptureIntro: string;
    photosIntro: string;
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
  specialtiesPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string }[];
  };
  drinksPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string }[];
  };
  coffeePage: {
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
    sculpture: string;
    photo: string;
    hands: string;
    songs: string;
  };
  regionFilter: {
    all: string;
    places: string;
    customs: string;
    specialties: string;
    drinks: string;
    coffee: string;
    arab: string;
    /** Rassemble les sept sections venues de « Sons & images » en un seul bouton. */
    sounds: string;
    etna: string;
    fauna: string;
    books: string;
    history: string;
  };
  infoFilter: {
    all: string;
    address: string;
    parking: string;
    arrival: string;
    move: string;
    urgent: string;
    waste: string;
    leaving: string;
    money: string;
    fauna: string;
  };
  /**
   * Se garer en Sicile — c'est-a-dire en Italie : les couleurs au sol sont
   * fixees par le code de la route national, pas par la commune.
   *
   * Chaque cas porte SA COULEUR plutot qu'un picto : ici c'est la couleur qui
   * EST l'information. Un dessin de voiture ne dirait rien de plus que le mot.
   */
  parkingPage: {
    eyebrow: string;
    title: string;
    intro: string;
    note: string;
    facts: { couleur: string; bord?: string; title: string; text: string }[];
    /**
     * Le « gardien » des parkings publics. Ce n'est pas une couleur au sol,
     * donc pas une fact : c'est une coutume, et elle merite son encadre.
     */
    gardien: { title: string; text: string };
  };
  /**
   * Retirer de l'argent a Donnalucata.
   *
   * Deux endroits, pas un : l'agence bancaire ET le bureau de poste. Un
   * guichet en panne un dimanche d'aout ne doit bloquer personne, et le
   * Postamat de la poste accepte les cartes etrangeres comme n'importe quel
   * Bancomat.
   *
   * Le mot affiche est « Bancomat ». « Bancontact », « Mister Cash », « carte
   * bleue » ne veulent rien dire ici : c'est « Bancomat » qui est ecrit sur
   * les facades, donc c'est ce mot qu'il faut avoir en tete en cherchant.
   */
  /**
   * La proprete, cote INFOS PRATIQUES : ce qui se traduit en gestes.
   *
   * Mag : « pas de miettes, vaisselle faite sans trainer… pas forcement
   * evident pour les nordistes ». Sous la chaleur et l'humidite de la cote,
   * une assiette laissee le soir n'est pas une negligence sans consequence,
   * c'est une invitation.
   *
   * Puis elle a scinde : « on veut juste parler des fourmis et de la proprete
   * dans les infos ». Elle a raison — un gecko n'est pas une consigne de
   * menage. Les fourmis restent ici parce qu'elles sont la RAISON de la regle
   * des miettes ; le reste de la faune est parti dans « La region », ou l'on
   * decouvre plutot qu'on ne range.
   */
  cleanPage: {
    eyebrow: string;
    title: string;
    intro: string;
    rulesTitle: string;
    rules: string[];
    antsTitle: string;
    antsText: string;
    faunaLink: string;
  };
  /**
   * Des livres, et l'histoire des luttes d'ici.
   *
   * Mag : « rajoute une liste de livres qui parlent de la Sicile ou qui s'y
   * passent. De l'histoire aussi. De la guerre, du communisme. Tu peux aussi
   * parler de l'histoire du communisme sicilien dans la region. »
   *
   * La region n'a pas ete choisie au hasard : la revolte antimilitariste de
   * janvier 1945 a eclate le plus fort dans la PROVINCE DE RAGUSE, et la
   * « Republique de Comiso » a tenu six jours a vingt kilometres de la
   * maison. C'est de l'histoire locale, pas un cours general.
   */
  /**
   * Le cours d'italien. Le CONTENU (phrases, tableaux, exercices) vit dans
   * app/italienData.ts, pas ici : l'italien enseigne ne doit exister qu'une
   * fois, sinon les trois versions du site finiraient par enseigner trois
   * italiens differents. Ici, seulement le decor de la page.
   */
  italianPage: {
    eyebrow: string;
    title: string;
    intro: string;
    methodTitle: string;
    method: string;
    soundTitle: string;
    soundIntro: string;
    talkTitle: string;
    talkIntro: string;
    grammarTitle: string;
    grammarIntro: string;
    whenLabel: string;
    howLabel: string;
    trapLabel: string;
    drillTitle: string;
    drillIntro: string;
    check: string;
    good: string;
    wrong: string;
    next: string;
    again: string;
    score: string;
    progress: string;
    start: string;
  };
  booksPage: {
    eyebrow: string;
    title: string;
    intro: string;
    list: { titre: string; auteur: string; annee: string; text: string; lien: string }[];
    linkLabel: string;
  };
  historyPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string; lien: string }[];
    note: string;
    linkLabel: string;
  };
  /**
   * La faune, cote LA REGION : qui vit ici.
   *
   * Ca rassure — mais SANS mentir. Mag croyait qu'il n'y avait ni serpents ni
   * scorpions ; verification faite, les deux existent. Voir la carte des
   * serpents : « il n'y a rien ici » aurait ete rassurant et faux, et sur une
   * morsure de vipere une fausse reassurance coute cher.
   */
  faunaPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string }[];
    note: string;
  };
  /**
   * La page 404 — la seule qu'on atteint sans l'avoir voulu.
   *
   * Le site n'en avait aucune : Next servait la sienne, « This page could not
   * be found », en anglais, hors charte, sans un seul lien de retour. C'etait
   * la seule page du site qui ne parlait ni francais ni italien.
   *
   * Elle doit faire trois choses, dans cet ordre : dire ou l'on est, ne
   * culpabiliser personne, et rouvrir le chemin.
   */
  notFoundPage: {
    eyebrow: string;
    title: string;
    text: string;
    definition: string;
    home: string;
    elsewhere: string;
  };
  cashPage: {
    eyebrow: string;
    title: string;
    intro: string;
    note: string;
    spots: { title: string; where: string; text: string; label: string; url: string }[];
  };
  /**
   * Le quiz de « La region ».
   *
   * REGLE : chaque bonne reponse est ecrite noir sur blanc dans une section du
   * site, et `ancre` dit laquelle. Rien n'est invente, rien ne vient d'ailleurs
   * — comme « Demander ». Corriger un texte corrige donc le quiz, et une
   * question dont on ne trouve plus la reponse sur le site est une question a
   * retirer.
   */
  quizPage: {
    eyebrow: string;
    title: string;
    intro: string;
    start: string;
    next: string;
    /** « Valider » : on choisit d'abord, on verifie ensuite. */
    check: string;
    /** « Question précédente » : on revient relire, sans rejouer. */
    back: string;
    seeSection: string;
    good: string;
    wrong: string;
    progress: string;
    scoreTitle: string;
    scoreLine: string;
    again: string;
    allThemes: string;
    /** Quand le tri ne laisse aucune question — ça ne doit jamais arriver, mais. */
    empty: string;
    pick: string;
    /**
     * `ancre` dit ou relire ET fait office de theme : les deux ne peuvent pas
     * diverger, donc autant qu'ils soient le meme champ. Le libelle du theme
     * vient de `regionFilter`, celui des boutons de tri de la page — un theme
     * du quiz est une section de la page, et rien d'autre.
     */
    questions: { q: string; choix: string[]; bonne: number; ancre: string; niveau: 'facile' | 'moyen' | 'difficile' }[];
  };
  askMag: {
    text: string;
    textFor: string;
    cta: string;
    subject: string;
  };
  // « Demander » — la bulle qui cherche dans le site. Ses reponses sont les
  // textes du site, mot pour mot : rien ici ne redige.
  //
  // Elle a porte un temps une phrase qui l'annonçait (« je reponds avec ce qui
  // est ecrit, rien d'invente »). Mag l'a retiree : ce site s'adresse a des
  // proches, pas a des inconnus a rassurer, et la promesse encombrait une
  // boite qu'on ouvre pour taper trois mots. La garantie, elle, n'a pas
  // bouge — chaque reponse porte le lien de la page d'ou elle sort.
  assistant: {
    label: string;
    title: string;
    placeholder: string;
    send: string;
    suggestions: string[];
    sourceLabel: string;
    alsoTitle: string;
    noneTitle: string;
    noneText: string;
    close: string;
    clear: string;
  };
  wastePage: {
    eyebrow: string;
    title: string;
    intro: string;
    today: string;
    tomorrow: string;
    noneToday: string;
    eveningNote: string;
    /** L'avertissement : ces jours changent, et il faut aller verifier. */
    changeNote: string;
    officialLabel: string;
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
  nav: {
    '/famille': 'La famille',
    '/la-region': 'La région',
    '/preparer-le-voyage': 'Le voyage',
    '/informations-pratiques': 'Infos pratiques',
    '/services-locaux': 'Nos adresses',
    '/evenements': 'Événements',
  },
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
  ctaTitles: {
    '/famille': 'Souvenir de famille',
    '/la-region': 'Découvrir la région',
    '/preparer-le-voyage': 'Bien préparer le voyage',
    '/informations-pratiques': 'Toutes les informations pratiques',
    '/services-locaux': 'Nos adresses',
    '/evenements': 'Le calendrier des événements à venir',
  },
  tasteOfSicily: 'Un avant-goût de la Sicile',
  sunsetAlt: 'Coucher de soleil sur la plage, la mer et le village au crépuscule',
  apartment: { eyebrow: 'La maison', title: 'La casa', albumAlt: 'La casa de Cava d’Aliga', captions: ['La terrasse avant', 'La terrasse arrière', 'Le hamac', 'Le séjour', 'La cuisine', 'La petite chambre', 'La petite chambre', 'La grande chambre', 'La salle de bain', 'La salle de bain', 'La salle de bain', 'La douche'], rooms: ['La terrasse avant', 'La terrasse arrière', 'Le séjour', 'La cuisine', 'La petite chambre', 'La grande chambre', 'La salle de bain'], label: 'La casa', ctaTitle: 'Visiter la casa' },
  casaPeek: { eyebrow: 'La casa', title: 'La maison en photos', link: 'Voir toutes les pièces' },
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
  etnaPage: {
    eyebrow: 'L’Etna',
    title: 'A Muntagna',
    intro:
      'Les Siciliens ne disent pas « l’Etna ». Ils disent a Muntagna, la Montagne, comme s’il n’y en avait qu’une — et pour eux il n’y en a qu’une. À deux heures et demie de route de la maison, elle fume, elle gronde, elle saupoudre parfois les voitures de cendre, et elle a donné à la Sicile sa terre noire, son vin… et, pendant des siècles, sa glace.',
    facts: [
      {
        icon: 'volcano',
        title: 'Le plus haut volcan actif d’Europe',
        text:
          'Un peu plus de 3 300 mètres — le chiffre change à chaque éruption, la montagne se construit et s’effondre sans arrêt, si bien qu’aucune altitude n’y reste vraie très longtemps. Son activité est presque permanente, et elle est inscrite au patrimoine mondial de l’UNESCO depuis juin 2013.',
      },
      {
        icon: 'compass',
        title: 'On y skie, face à la mer',
        text:
          'Deux domaines, un de chaque côté. Etna Sud, au-dessus de Nicolosi, monte de 1 910 à 2 700 mètres ; Etna Nord, à Piano Provenzana au-dessus de Linguaglossa, de 1 800 à 2 340 mètres. Skier sur de la cendre noire avec la mer Ionienne en contrebas : cela ne se fait nulle part ailleurs.',
      },
      {
        icon: 'droplet',
        title: 'Les nivaroli et les neviere',
        text:
          'Dès le Moyen Âge, des hommes montaient récolter la neige en hiver et l’enfouissaient dans des fosses de pierre, les neviere, isolées sous la cendre volcanique, la fougère et la paille. L’été venu, ils la redescendaient à dos de mulet dans des sacs de jute. La Sicile a compté parmi les grands producteurs de glace d’Europe jusqu’au XVIIIᵉ siècle.',
      },
      {
        icon: 'cone',
        title: 'De la neige à la granita',
        text:
          'Cette neige râpée, arrosée de jus de citron ou de sirop de fruits, est l’ancêtre direct de la granita. Puis on découvre que la neige mêlée de sel marin refroidit sans se mélanger : elle passe d’ingrédient à réfrigérant, et la granita telle qu’on la mange aujourd’hui — celle du petit déjeuner, avec la brioche — est née de ce geste.',
      },
    ],
    linkPark: 'Le parc de l’Etna, site UNESCO',
    linkTours: 'Excursions guidées sur l’Etna',
    linkToursUrl: 'https://etnaway.com/fr/',
    linkSki: 'Les domaines skiables de l’Etna',
    photoAlt: 'L’Etna',
  },
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
      {
        icon: 'fork',
        title: 'Les premières pâtes sèches d’Europe sont siciliennes',
        text: 'Et c’est le même al-Idrisi qui l’écrit. En 1154, dans le Livre de Roger, il décrit à Trabia — près de Palerme — des moulins qui fabriquent des fils de semoule appelés itriyya, en telle quantité qu’on en exporte partout, chez les musulmans comme chez les chrétiens. C’est la plus ancienne mention connue d’une production de pâtes sèches en Europe : trois siècles avant les récits sur Marco Polo, et à quatre-vingts kilomètres d’ici.',
      },
      {
        icon: 'citrus',
        title: 'Le riz, le safran, et donc l’arancina',
        text: 'Le riz et le safran arrivent avec les Arabes. Une boule de riz safrané, panée et frite, c’est exactement ce qu’ils cuisinaient — et la couleur d’or de l’arancina vient de là. Le sfincione palermitain, lui, tiendrait son nom de l’arabe isfanǧ, la pâte frite.',
      },
      {
        icon: 'cleaver',
        title: 'Le sucré-salé : une signature qui ne s’est jamais effacée',
        text: 'Les pâtes aux sardines — sardines, fenouil sauvage, raisins secs, pignons, safran — mettent dans la même assiette le poisson de la côte et les fruits secs venus d’Orient. La caponata joue le même accord aigre-doux, avec le vinaigre et le sucre. Nulle part ailleurs en Italie on ne cuisine ainsi : c’est la trace la plus reconnaissable de deux siècles arabes.',
      },
      {
        icon: 'cone',
        title: 'La pâtisserie : amande, sucre, ricotta',
        text: 'Le sucre de canne arrive avec eux, et avec lui toute la confiserie sicilienne. La pasta reale — la pâte d’amande de la frutta martorana — descend en droite ligne du marzipan arabe. La cubbaita, le nougat au sésame et au miel, garde son nom de l’arabe qubbayt. Et la cassata tiendrait le sien de qas‘ah, le bol dans lequel on la moulait.',
      },
      {
        icon: 'wave',
        title: 'Même en mer, on parle arabe',
        text: 'Le chef d’une tonnara — la pêcherie de thon — s’appelle le raìs, de l’arabe raʾīs, le chef. Tout le vocabulaire de la pêche au thon a gardé ses mots arabes, et les tonnare de Sicile ont fonctionné ainsi jusqu’au XXᵉ siècle. À Trapani et San Vito Lo Capo, on mange toujours le couscous — au poisson.',
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
    siteLabel: 'Site officiel',
    walkLabel: 'On peut y aller à pied',
    closeLabel: 'Fermer',
    viewMap: 'Carte',
    viewList: 'Liste',
    departReset: 'Retirer ce départ — recompter depuis la maison',
    departFrom: 'Distances depuis',
    departPin: 'un point posé sur la carte',
    departBack: 'Revenir à la maison',
    houseHere: 'La maison',
    wherePlaceholder: 'Vous êtes où ? Un village, une adresse…',
    whereSearching: 'On cherche…',
    whereNotFound: 'Introuvable. Essayez le nom italien (« Aeroporto Catania » plutôt que « aéroport de Catane ») — les lieux viennent d’OpenStreetMap.',
    whereError: 'La recherche n’a pas répondu. Réessayez, ou touchez directement la carte.',
    whereOut: 'C’est hors de la Sicile — la carte ne va pas jusque-là.',
    mapFailed: 'La carte n’a pas pu se charger.',
    mapFailedHint: 'Rechargez la page. Si ça persiste, un bloqueur de publicité ou un réseau d’entreprise empêche peut-être le chargement — la liste, elle, fonctionne toujours.',
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
        spots: [{ label: 'Vivai Cintoli', url: 'https://maps.app.goo.gl/X2VCrFrZEK2caPpH9' }],
      },
    ],
    markets: {
      title: 'Marchés',
      desc: 'Fruits, légumes, fromages et poisson du jour, directement des producteurs.',
      list: [
        { label: 'Marché de Scicli — le mardi, 8 h-13 h, contrada Zagarone', url: 'https://www.google.com/maps/search/?api=1&query=mercato+settimanale+contrada+Zagarone+Scicli+RG' },
        { label: 'Marché paysan Campagna Amica — le vendredi, 8 h-13 h, via Badiula (Scicli)', url: 'https://www.google.com/maps/search/?api=1&query=Via+Badiula+Scicli+RG' },
        { label: 'Marché fermier de Marina di Ragusa — vendredi matin (juin–sept.)', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Vincenzo+Rabito+Marina+di+Ragusa' },
        { label: 'Marché au poisson de Donnalucata — poisson frais du jour', url: 'https://www.google.com/maps/search/?api=1&query=Mercato+ittico+Donnalucata' },
      ],
    },
  },
  salvaPage: { title: 'La famille', intro: 'Photos, souvenirs et histoire de la famille, au fil des années.', historyTitle: 'Histoire de la famille', storyText: [
    'Salvatore Contrino est né le 26 janvier 1947 à Valguarnera, en Sicile.',
    'Son père Angelo, revenu des camps russes, s’est retrouvé veuf avec un bébé de six mois. Il l’a confié à sa mère Giuseppina — mémé Pipine —, émigrée à Saint-Étienne avec ses enfants, qui l’a élevé comme le dixième de la fratrie.',
    'À dix-neuf ans, il est parti travailler en Belgique, qu’il n’a plus quittée. En gardant la Sicile, son patrimoine, dans un coin de son cœur.',
    'De génération en génération, cette maison de Cava d’Aliga rassemble la famille. C’est là le point central, celui qui nous ramenait tous à ses origines.',
  ], storyOpen: 'Cette histoire s’écrit à plusieurs. Une date, un lieu, un nom, une anecdote, une photo — envoyez-les, et ils prendront leur place ici. Le plus utile : dites de qui vous parlez, quand, et où. C’est ce qui permet de raccrocher chaque morceau au bon endroit.', storyOpenCta: 'Ajouter à l’histoire', storyOpenSubject: 'Histoire de la famille — j’ai quelque chose à ajouter', treeTitle: 'Arbre généalogique', treeNote: 'Ce que la famille nous a transmis. Il reste des blancs — ils sont listés en bas, et chacun peut les combler.', treePaternal: 'Grands-parents paternels', treeMaternal: 'Grands-parents maternels', treeWife1: '1re épouse', treeWife2: '2e épouse', treeMarriage1: '1er mariage', treeMarriage2: '2e mariage', treeGreat: 'Arrière-grands-parents', treeParents: 'Les parents', treeChildren: 'Les enfants', treeQuestionsTitle: 'Ce qu’il nous manque', treeAdd: '+ Ajouter ma branche', treeAddSubject: 'Arbre généalogique — ma branche', treeExample: 'Il manque du monde, et des dates — dites-nous ce que vous savez.', treeOpen: 'Déplier', treeClose: 'Replier', treeOpenAll: 'Tout déplier', treeCloseAll: 'Tout replier', treeKid: 'enfant', treeKids: 'enfants', treeSideFather: 'Côté Contrino', treeSideMother: 'Côté Lux', treeSideUs: 'Nous' },
  stayPage: { title: 'Le calendrier', intro: 'Les périodes où la maison est occupée, pour se coordonner en famille.', legend: { occupied: 'Occupé', tentative: 'À confirmer', free: 'Libre' } },
  calendarPage: { title: 'Événements à venir', intro: 'Ce qui se passe autour de la maison — le programme de l’été à Bruca, et les grandes fêtes siciliennes.', festivalsTitle: 'Fêtes siciliennes', programNote: 'Sotto il cielo di Bruca — le programme de l’été, à deux pas de la maison. Suivez les couleurs.', programDone: 'Le programme de l’été est terminé. Le prochain arrivera au printemps — les fêtes siciliennes, elles, reviennent chaque année.', programMore: 'Détails et horaires sur Instagram', socialsTitle: 'À suivre', festivalDescs: ["Le grand jour de l’été italien. Héritée des Feriae Augusti romaines et associée à l’Assomption, la fête réunit familles et villages autour de la mer : baignades, grands repas, processions et feux d’artifice animent toute la Sicile.", "Saint Roch, invoqué depuis des siècles contre les épidémies, protège de nombreuses communautés siciliennes. À Scicli, sa statue est portée en procession dans les ruelles, au son des fanfares et sous les illuminations de fête.", "Saint Jean-Baptiste est le patron de Raguse, dont la cathédrale lui est dédiée. Le 29 août, jour de sa décollation, la ville s’illumine : procession solennelle de la statue du saint et grand feu d’artifice au-dessus de la vieille ville.", "Saint Conrad Confalonieri, ermite vénéré comme patron de Noto. Le dernier dimanche d’août, son urne d’argent traverse les rues baroques dans une immense ferveur populaire, entre cierges, fleurs et cortèges."] },
  culturePage: {
    eyebrow: 'Culture',
    title: 'Sons & images',
    intro: 'Ce coin de Sicile a une bande-son et des décors de cinéma. Une playlist partagée à écouter sur la route, et les films et séries tournés à quelques kilomètres de la maison — souvent dans des rues que vous reconnaîtrez.',
    playlistDesc: 'Une playlist partagée : chacun y ajoute ce qu’il écoute ici. Pour la route depuis l’aéroport, la cuisine ou la terrasse le soir.',
    playlistCta: 'Ouvrir dans Spotify',
    playlistSoon: 'Le lien de la playlist arrive bientôt.',
    artistsIntro: 'Les voix qui racontent l’île — à écouter avant, pendant, après.',
    handsIntro: 'En 1958, le designer milanais Bruno Munari photographie cinquante gestes italiens et les légende en quatre langues. Le titre dit tout : « Supplément au dictionnaire italien ». Il ne le fait pas pour rire — il le fait pour les étrangers de passage en Italie. Autrement dit, pour nous.',
    handsWho: 'Bruno Munari (Milan, 1907-1998) commence chez les futuristes à vingt ans, puis passe sa vie à démonter le sérieux : ses « machines inutiles » de 1933 tournent au plafond sans rien produire. Les gestes, il ne les a pas inventés — il les a pris au chanoine Andrea de Jorio, qui les avait recensés à Naples en 1832.',
    handsBookCta: 'Le livre chez Corraini',
    handsBook2Title: 'Design as Art',
    handsBook2Desc: 'Son livre le plus lu, publié chez Laterza en 1966 sous le titre « Arte come mestiere » — l’art comme métier. Munari y regarde les lampes, les panneaux routiers, les affiches, les voitures et les chaises, et demande à chaque fois la même chose : est-ce beau, est-ce que ça marche, est-ce que c’est pour tout le monde ? Picasso l’appelait « le nouveau Léonard ». Réédité en Penguin Modern Classics en 2008.',
    handsBook2Cta: 'Le livre chez Penguin',
    handsPhotoNote: 'La main sur la couverture du Supplemento, c’est « ma che vuoi » — le geste par lequel tout commence. Les autres sont dans le livre, et n’ont pas leur place ici : elles sont sous droits. On montre les couvertures, pas ce qu’il y a dedans.',
    handsCoverAlt: 'Couverture de « Speak Italian: The Fine Art of the Gesture » de Bruno Munari : une main photographiée en noir et blanc, les cinq doigts pincés en bouton.',
    handsCoverCredit: 'Bruno Munari, Speak Italian: The Fine Art of the Gesture — Chronicle Books, 2005',
    handsCover2Alt: 'Couverture de « Design as Art » de Bruno Munari chez Penguin : seize visages dessinés en noir et blanc, chacun dans un style différent, sur fond crème.',
    handsCover2Credit: 'Bruno Munari, Design as Art — Penguin Modern Classics, 2008',
    photosIntro: 'Avant les téléphones, d’autres ont regardé ces pierres et ces fêtes — et les ont fixées pour de bon.',
    artsIntro: 'Scicli n’est pas qu’un décor de série : c’est un vrai foyer de peinture, et cette mer a été peinte toute une vie.',
    sculptureIntro: 'Le seul de ces artistes encore au travail — et il travaille à 8 km, en faisant de Scicli son atelier à ciel ouvert.',
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
        text: 'Pas un dessert : le vrai petit-déjeuner sicilien de l’été. On commande une granita — amande, citron, mûre, pistache, café — avec une brioche col tuppo, celle qui a un chignon sur la tête. On trempe la brioche dedans — et certains la fendent pour la fourrer de granita. Se lever tôt et aller la manger au bar avant que la chaleur tombe, c’est l’une des meilleures raisons d’être ici.',
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
  specialtiesPage: {
    eyebrow: 'Spécialités',
    title: 'Les spécialités du coin',
    intro: 'Ce qu’on rapporte et ce qu’on goûte sur place — les vraies spécialités des monts Iblei, entre Scicli, Modica et Ragusa.',
    facts: [
      {
        icon: 'fork',
        title: 'La scaccia ragusana',
        text: 'Une pâte à pain fine comme du papier, roulée sur sa garniture puis cuite au four. Les classiques : tomate et oignon, ricotta et oignon, ricotta et saucisse, tomate et aubergine. C’est le casse-croûte du coin depuis toujours — on en trouve dans toutes les boulangeries.',
      },
      {
        icon: 'leaf',
        title: 'Le chocolat de Modica',
        text: 'Un chocolat travaillé à froid, hérité des Aztèques par les Espagnols : le sucre ne fond pas, il reste en grains, et le chocolat croque. Cannelle, vanille, piment, agrumes… À Modica, à vingt minutes, l’Antica Dolceria Bonajuto le fait depuis 1880.',
      },
      {
        icon: 'cone',
        title: 'Les teste di turco de Scicli',
        text: 'LE dolce de Scicli : une grosse pâte soufflée en forme de turban, fourrée de ricotta ou de crème. Le nom et la forme viennent de la légende de la Madonna delle Milizie — le turban des envahisseurs turcs. On ne les trouve vraiment bien qu’ici.',
      },
      {
        icon: 'cleaver',
        title: 'Les ’mpanatigghi de Modica',
        text: 'Des petits chaussons en demi-lune qui cachent un secret : viande de bœuf hachée, chocolat noir, amandes, sucre et épices. Sucré-salé, hérité des couvents espagnols. Étonnant — et bien meilleur que ça n’en a l’air.',
      },
      {
        icon: 'droplet',
        title: 'Le caciocavallo ragusano',
        text: 'Le grand fromage des Iblei — le « cosacavaddu », gros pain de pâte filée, affiné en parallélépipède et pendu à une corde. Doux et frais quand il est jeune, piquant en vieillissant. Avec la provola ragusana, c’est la base de la table d’ici.',
      },
      {
        icon: 'citrus',
        title: 'Torrone et cubbaita',
        text: 'Les douceurs d’amandes et de miel du pays : le torrone d’amandes, et la cubbaita, un nougat dur au sésame et au miel d’origine arabe, qu’on casse en morceaux. Les sucreries des fêtes, à emporter.',
      },
    ],
  },
  drinksPage: {
    eyebrow: 'Vins & alcools',
    title: 'Les vins et alcools du coin',
    intro: 'Le sud-est est une grande terre de vin — et l’unique DOCG de Sicile est née juste à côté. De quoi accompagner la table et clore le repas.',
    facts: [
      {
        icon: 'glass',
        title: 'Le Cerasuolo di Vittoria',
        text: 'LE vin du coin — et l’unique DOCG de toute la Sicile, née à Vittoria, juste à côté. Un assemblage de nero d’avola et de frappato sur la terre rouge du secteur : rouge cerise, sec, velouté, un nez de fleurs et de fruits rouges. Le vin des grands producteurs d’ici — COS, Planeta, Valle dell’Acate.',
      },
      {
        icon: 'leaf',
        title: 'Le frappato',
        text: 'Le cépage léger et parfumé de Vittoria. Seul, il donne un rouge clair, presque désaltérant, sur la fraise et la cerise, qu’on sert un peu frais l’été. Le contraire d’un vin lourd — parfait à table quand il fait chaud.',
      },
      {
        icon: 'bottle',
        title: 'Le nero d’avola',
        text: 'Le grand rouge sicilien, qui tient son nom d’Avola, tout près. Charnu, sombre, chaleureux, sur le fruit noir et les épices. C’est lui qui donne du corps au Cerasuolo, mais on le boit aussi seul, partout sur l’île.',
      },
      {
        icon: 'droplet',
        title: 'Le marsala',
        text: 'Le célèbre vin muté de Sicile, de l’ouest de l’île. Du sec à l’ambré très doux : à l’apéritif, sur les fromages, ou en cuisine — c’est lui qui parfume le zabaione et bien des desserts. Une gorgée d’histoire sicilienne.',
      },
      {
        icon: 'citrus',
        title: 'L’amaro',
        text: 'Le digestif de fin de repas : une liqueur amère aux herbes et aux agrumes, servie fraîche. L’Averna, né à Caltanissetta, est le plus connu de Sicile. On le boit très frais, parfois sur glace, pour clore le repas.',
      },
      {
        icon: 'sun',
        title: 'Limoncello & rosolio',
        text: 'Les liqueurs maison qu’on sort après le café : le limoncello, aux zestes de citron, glacé ; et les rosoli, ces vieilles liqueurs siciliennes parfumées (cannelle, café, mandarine…). Souvent faites à la maison, toujours offertes.',
      },
    ],
  },
  coffeePage: {
    eyebrow: 'Le café',
    title: 'Le café, tout un rituel',
    intro: 'Ici le café rythme la journée — vif au comptoir le matin, glacé l’été, corrigé d’une goutte de liqueur après le repas. Petit mode d’emploi.',
    facts: [
      {
        icon: 'droplet',
        title: 'Un café = un espresso',
        text: 'Ici, « un caffè », c’est un espresso serré, bu debout au comptoir en trente secondes, pour à peu près un euro. On ne s’assoit pas, on ne l’emporte pas : on le boit là, on paie, on repart. Le grand café allongé n’existe pas — demandez un caffè lungo si vous le voulez moins serré.',
      },
      {
        icon: 'sun',
        title: 'Le café glacé, à l’amande',
        text: 'L’été, le caffè freddo : un espresso froid, souvent adouci au lait d’amande — une merveille du sud. On le trouve aussi « in ghiaccio », versé brûlant sur des glaçons. Une boisson à part entière, pas un café oublié.',
      },
      {
        icon: 'cone',
        title: 'La granita al caffè',
        text: 'La version café de la granita du petit-déjeuner : glacée, une pointe de crème (con panna) et la brioche à tremper. Le réveil sicilien de l’été, quand il fait déjà chaud à huit heures.',
      },
      {
        icon: 'list',
        title: 'Le petit lexique du comptoir',
        text: 'Macchiato (une goutte de lait), lungo (allongé), ristretto (encore plus serré), corretto (avec un trait de liqueur). Et le cappuccino, c’est le matin — jamais après un repas : c’est la règle non écrite.',
      },
      {
        icon: 'glass',
        title: 'Le corretto, pour finir',
        text: 'À la fin du repas, le caffè corretto : un espresso « corrigé » d’un trait de grappa, d’anis ou d’amaro. On l’appelle aussi ammazzacaffè — « tue-café » — la gorgée qui clôt vraiment le déjeuner.',
      },
      {
        icon: 'bottle',
        title: 'La moka, à la maison',
        text: 'Hors du bar, le café se fait à la moka — la petite cafetière qui gargouille sur le feu. Chaque maison a la sienne, culottée par les années, qu’on ne lave jamais au savon. Le bruit et l’odeur du matin.',
      },
    ],
  },
  cultureFilter: {
    all: 'Tout voir',
    playlist: 'La playlist',
    screens: 'Écrans',
    painting: 'Peinture',
    sculpture: 'Sculpture',
    photo: 'Photo',
    hands: 'Designer',
    songs: 'Chansons',
  },
  regionFilter: {
    all: 'Tout voir',
    places: 'Les lieux',
    customs: 'Us et coutumes',
    specialties: 'Spécialités',
    drinks: 'Vins & alcools',
    coffee: 'Le café',
    arab: 'Sicile arabe',
    sounds: 'Sons & images',
    etna: 'L’Etna',
    fauna: 'La faune',
    books: 'Des livres',
    history: 'Luttes & mémoire',
  },
  infoFilter: {
    all: 'Tout voir',
    address: 'Adresse',
    parking: 'Se garer',
    arrival: 'Arrivée',
    move: 'Se déplacer',
    urgent: 'Urgences',
    waste: 'Déchets',
    leaving: 'Le départ',
    money: 'Retirer de l’argent',
    fauna: 'Propreté',
  },
  parkingPage: {
    eyebrow: 'Se garer',
    title: 'Les couleurs au sol',
    intro: 'En Italie, la couleur des lignes dit tout, et elle est la même partout : c’est le code de la route qui la fixe, pas la commune. Trois couleurs suffisent à s’en sortir.',
    note: 'Ticket non affiché ou disque oublié : 41 €. Le disque de stationnement se garde dans la voiture — un loueur en fournit un, sinon il se trouve dans n’importe quel bureau de tabac.',
    facts: [
      { couleur: '#2f6fd0', title: 'Bleu — payant', text: 'On paie au parcomètre, à l’heure, et on pose le ticket derrière le pare-brise. C’est ce qu’on trouve dans les centres, et sur le bord de mer l’été.' },
      { couleur: '#ffffff', bord: '#d9d9d9', title: 'Blanc — gratuit', text: 'Mais lisez le panneau : certaines places blanches sont limitées dans le temps. Il faut alors afficher le disque de stationnement — le disco orario — avec l’heure d’arrivée.' },
      { couleur: '#f2c033', title: 'Jaune — réservé', text: 'Handicapés avec macaron, livraisons, forces de l’ordre, parfois les résidents. On ne s’y gare pas, même cinq minutes.' },
      { couleur: '#f06a9b', title: 'Rose — femmes enceintes', text: 'Et parents d’un enfant de moins de deux ans. Officiel depuis 2021, mais il faut un permis délivré par sa commune de résidence : de passage, on n’y a pas droit.' },
      { couleur: '#6f8f5f', title: 'Vert — recharge', text: 'Le plus souvent réservé aux voitures électriques en train de se recharger. On ne s’y arrête pas pour autre chose.' },
    ],
    gardien: {
      title: 'Le gardien à la casquette',
      text: 'Sur les parkings publics des grandes villes et des sites très touristiques, quelqu’un vient souvent vous placer et surveiller la voiture. Officiel ou non, on ne le sait pas toujours. Il demande peu, il surveille vraiment bien, et là-bas mieux vaut accepter — on ne sait pas trop ce qui arrive à la voiture si on refuse. Chez nous, à Cava d’Aliga, la question ne se pose pas : on est loin des lieux touristiques.',
    },
  },
  cleanPage: {
    eyebrow: 'Propreté',
    title: 'Tenir la maison dans un pays chaud',
    intro: 'Chaleur et humidité : ce qui passe inaperçu chez nous, au nord, ne pardonne pas ici. Une assiette laissée le soir, quelques miettes sous la table, et la colonne de fourmis est là au matin. Rien de dramatique — juste des réflexes à prendre, et ils deviennent vite naturels.',
    rulesTitle: 'Les réflexes',
    rules: [
      'Pas de miettes. Un coup de balai après chaque repas, sous la table aussi.',
      'La table se débarrasse et la vaisselle se fait sans traîner — pas au lendemain matin.',
      'Tout ce qui est ouvert se range : biscuits, farine, pain, fruits, sucre. Chez nous, on met un maximum au frigo, et c’est la meilleure des boîtes hermétiques.',
      'Poubelle fermée, et sortie le bon soir. Un sac qui passe la nuit ouvert dans la cuisine, c’est le plus sûr moyen d’avoir de la visite.',
      'On ne laisse pas d’eau stagner : soucoupes sous les pots, seaux, arrosoir. C’est là que les moustiques pondent, et nulle part ailleurs.',
      'On secoue les chaussures laissées dehors avant de les remettre. Vieux réflexe du sud, qui ne coûte rien.',
    ],
    antsTitle: 'Les fourmis',
    antsText: 'C’est la vraie raison de tout ce qui précède. Elles ne piquent pas et ne transportent rien de grave, mais une fois qu’une file a trouvé le chemin du sucre, elle le refait pendant des jours. On ne les combat pas : on ne leur donne rien.',
    faunaLink: 'Qui vit ici — geckos, lézards, serpents, scorpions',
  },
  italianPage: {
    eyebrow: 'Apprendre l’italien',
    title: 'Parler italien ici',
    intro: 'Pas un cours de grammaire : de quoi se débrouiller dès le premier matin, puis comprendre ce qu’on dit. On commence par prononcer, on continue par des phrases entières, la grammaire vient après — et on s’entraîne à la fin.',
    methodTitle: 'Comment s’en servir',
    method: 'Dix minutes par jour valent mieux qu’une heure le dimanche. Lisez à voix haute, même seul, même mal : l’italien s’attrape par l’oreille et par la bouche, pas par les yeux. Ne cherchez pas à tout retenir — prenez les trois phrases dont vous avez besoin aujourd’hui, servez-vous-en pour de vrai, et revenez demain. C’est le principe des méthodes qui marchent, celle d’Assimil la première : des leçons courtes, des phrases entières, et la règle expliquée seulement une fois qu’on la dit déjà.',
    soundTitle: 'D’abord, prononcer',
    soundIntro: 'Huit règles et vous lisez l’italien à voix haute sans vous tromper. C’est la vraie porte d’entrée : on pardonne une faute de grammaire, on ne comprend pas un mot mal prononcé. L’accent tonique est marqué en majuscules.',
    talkTitle: 'Parler, par situation',
    talkIntro: 'Des phrases entières, à resservir telles quelles. On n’a jamais besoin du mot « café » tout seul — on a besoin de savoir commander un café.',
    grammarTitle: 'Les trois temps',
    grammarIntro: 'Le présent, le passé, le futur. Dans cet ordre : le présent porte l’essentiel et remplace même le futur proche ; le futur est celui dont on se passe le plus facilement.',
    whenLabel: 'Quand s’en servir',
    howLabel: 'Comment ça se fabrique',
    trapLabel: 'Ce qui piège',
    drillTitle: 'S’entraîner',
    drillIntro: 'Douze exercices, corrigés tout de suite et expliqués. Une réponse fausse sans explication ne sert à rien : on retient l’erreur aussi bien que la solution.',
    check: 'Vérifier',
    good: 'C’est ça',
    wrong: 'Pas tout à fait',
    next: 'Exercice suivant',
    again: 'Recommencer',
    score: '{n} bonnes réponses sur {t}',
    progress: 'Exercice {n} sur {t}',
    start: 'Commencer les exercices',
  },
  booksPage: {
    eyebrow: 'Des livres',
    title: 'À lire avant, pendant, après',
    intro: 'Sept livres qui parlent de la Sicile ou s’y passent — et deux qui racontent ce que les familles d’ici ont traversé. Rien d’obligatoire : c’est une étagère, pas un programme.',
    linkLabel: 'La fiche du livre',
    list: [
      { titre: 'Una donna di Ragusa', auteur: 'Maria Occhipinti', annee: '1957', lien: 'https://it.wikipedia.org/wiki/Una_donna_di_Ragusa', text: 'Le livre d’ici. Maria Occhipinti avait vingt-trois ans et cinq mois de grossesse quand elle s’est couchée devant le camion militaire qui emportait les garçons de son quartier, à Ragusa, le 4 janvier 1945. Elle l’a payé de la déportation à Ustica, où elle a accouché, puis de la prison. Son autobiographie est passée inaperçue en 1957 et a fait l’effet d’une bombe à sa réédition en 1976.' },
      { titre: 'La plupart ne reviendront pas', auteur: 'Eugenio Corti', annee: '1947', lien: 'https://it.wikipedia.org/wiki/I_pi%C3%B9_non_ritornano', text: 'Le choix de Mag. Le journal d’un survivant de la retraite de Russie : vingt-huit jours d’encerclement dans la neige, écrits par un homme de vingt-deux ans qui en est sorti. Ce n’est pas un livre sicilien, mais il raconte ce que des milliers de familles d’ici ont vécu sans le dire — et cette maison en sait quelque chose.' },
      { titre: 'Le parole sono pietre', auteur: 'Carlo Levi', annee: '1955', lien: 'https://it.wikipedia.org/wiki/Carlo_Levi', text: 'Trois voyages en Sicile, entre les mines de soufre, les paysans qui occupent les terres et le souvenir tout frais de Portella della Ginestra. « Les mots sont des pierres » : le titre dit le livre. C’est le meilleur récit de ce que fut la lutte pour la terre dans l’île, écrit à chaud par quelqu’un qui écoutait.' },
      { titre: 'Il Gattopardo', auteur: 'Giuseppe Tomasi di Lampedusa', annee: '1958', lien: 'https://it.wikipedia.org/wiki/Il_Gattopardo', text: 'Le grand roman sicilien, écrit par un prince à la fin de sa vie et refusé par deux éditeurs avant de devenir un classique. La Sicile de 1860, un monde qui s’effondre et une phrase que tout le monde cite : « il faut que tout change pour que rien ne change ».' },
      { titre: 'Il giorno della civetta', auteur: 'Leonardo Sciascia', annee: '1961', lien: 'https://it.wikipedia.org/wiki/Il_giorno_della_civetta', text: 'Le livre qui a nommé ce dont on ne parlait pas. Un capitaine venu du Nord enquête sur un meurtre dans un village sicilien, et se heurte à un mur de silence. Sciascia écrivait à une époque où l’existence même de la mafia était officiellement discutée.' },
      { titre: 'Conversazione in Sicilia', auteur: 'Elio Vittorini', annee: '1941', lien: 'https://it.wikipedia.org/wiki/Conversazione_in_Sicilia', text: 'Un homme rentre voir sa mère en Sicile après quinze ans. Publié sous le fascisme, le livre dit tout sans jamais rien nommer — c’est pour cela qu’il a passé la censure, et c’est pour cela qu’il a compté.' },
      { titre: 'I Malavoglia', auteur: 'Giovanni Verga', annee: '1881', lien: 'https://it.wikipedia.org/wiki/I_Malavoglia', text: 'Une famille de pêcheurs, une barque, une dette, et la mer qui reprend tout. Verga écrit les pauvres sans les plaindre ni les embellir : c’est la Sicile d’avant les photos, celle des villages de la côte.' },
    ],
  },
  historyPage: {
    eyebrow: 'Luttes & mémoire',
    title: 'Ce qui s’est passé ici',
    intro: 'On vient en Sicile pour le baroque et la mer, et on repart sans savoir que la province de Raguse a connu l’une des révoltes les plus oubliées de l’histoire italienne. Voilà de quoi il s’agit — et pourquoi les vieux d’ici ne racontent pas tout.',
    linkLabel: 'En savoir plus',
    note: 'Cette page ne prend pas parti : elle raconte ce qui a eu lieu, à l’endroit où ça a eu lieu. Les livres juste au-dessus vont beaucoup plus loin que nous, et ceux qui l’ont vécu les ont écrits eux-mêmes.',
    facts: [
      { icon: 'landmark', lien: 'https://it.wikipedia.org/wiki/Fasci_siciliani', title: 'Les Fasci siciliani, 1891-1894', text: 'Avant les partis, il y eut les fasci : des ligues de paysans, de soufriers et d’artisans, jusqu’à trois cent mille adhérents dans une île misérable. Ils réclamaient des contrats, des terres, la fin des abus. Le gouvernement Crispi — un Sicilien — a répondu par l’état de siège en janvier 1894, des morts, des tribunaux militaires. C’est le premier grand mouvement social de l’Italie unie, et il est né ici.' },
      { icon: 'walk', lien: 'https://it.wikipedia.org/wiki/Nonsiparte', title: '« Non si parte ! » — janvier 1945, ici même', text: 'La guerre finit au nord, et Rome rappelle les jeunes Siciliens sous les drapeaux. L’île refuse. La révolte éclate le plus fort dans la province de Raguse : le 4 janvier 1945, l’armée ratisse les quartiers populaires pour emmener les garçons. C’est la révolte antimilitariste la plus oubliée de l’histoire italienne — et elle s’est passée à quelques kilomètres de cette maison.' },
      { icon: 'compass', lien: 'https://it.wikipedia.org/wiki/Prigionieri_di_guerra_italiani_in_Unione_Sovietica', title: 'Les camps russes : ceux qui ne sont pas revenus', text: 'Décembre 1942, sur le Don : l’armée italienne de Russie est anéantie. Ceux qui survivent partent à pied vers les camps, des centaines de kilomètres dans la neige — les survivants ont appelé ça les marches du « davaï », du mot russe qu’on leur criait pour les faire avancer. Vingt-deux mille meurent en chemin. Cinquante-quatre mille arrivent vivants dans les camps, de la Russie d’Europe jusqu’à la Sibérie ; quarante-quatre mille y meurent, la plupart dès l’hiver 1943. Dix mille reviendront, entre 1945 et 1954 — les derniers officiers, condamnés au travail forcé sur des accusations qui se révéleront fausses, ne sont libérés qu’après la mort de Staline. Cette maison le sait de première main : Angelo, le père de Salvatore, est rentré de ces camps-là.' },
      { icon: 'info', lien: 'https://it.wikipedia.org/wiki/Maria_Occhipinti', title: 'La femme qui s’est couchée devant le camion', text: 'Maria Occhipinti, vingt-trois ans, enceinte de cinq mois, s’allonge devant le camion militaire qui emporte les garçons de son quartier. Les soldats tirent sur la foule. Elle sera déportée à Ustica, où elle accouche, puis emprisonnée à Palerme. Le Parti communiste ayant condamné la révolte, elle rompt avec lui et finira anarchiste. Elle a raconté tout cela elle-même — voir les livres.' },
      { icon: 'home', lien: 'https://it.wikipedia.org/wiki/Nonsiparte', title: 'La « République de Comiso », six jours', text: 'À Comiso, à vingt kilomètres d’ici, les insurgés font prisonniers les carabiniers les 5 et 6 janvier et proclament un gouvernement populaire : comité de salut public, équipes d’ordre, distribution de vivres à prix coûtant. Ça tient six jours. Le 11 janvier, sous la menace d’un bombardement allié sur la ville, ils négocient leur reddition.' },
      { icon: 'cone', lien: 'https://it.wikipedia.org/wiki/Portella_della_Ginestra', title: 'Portella della Ginestra, 1er mai 1947', text: 'Deux ans plus tard, la gauche gagne les élections régionales siciliennes. Le 1er mai, des familles fêtent le travail dans un col au-dessus de Piana degli Albanesi ; la bande du bandit Giuliano tire sur la foule. Onze morts, dont des enfants. C’est le premier massacre politique de la République italienne, et il n’a jamais été entièrement élucidé.' },
    ],
  },
  faunaPage: {
    eyebrow: 'La faune',
    title: 'Qui vit ici',
    intro: 'Les bêtes qu’on croise vraiment dans le sud-est de la Sicile — et ce qu’elles changent, c’est-à-dire presque rien. Les geckos du mur, les lézards des pierres, et deux réputations à remettre à leur place.',
    facts: [
      {
        icon: 'leaf',
        title: 'Les geckos',
        text: 'Les petites tarentes beiges qui traversent le mur le soir, immobiles autour des lampes. Elles ne mordent pas, ne s’approchent pas, ne montent pas dans les lits — et elles passent leur nuit à manger des moustiques. Ce sont les meilleures colocataires de la maison : laissez-les tranquilles.',
      },
      {
        icon: 'walk',
        title: 'Les petits lézards',
        text: 'Ils filent entre les pierres au soleil et disparaissent dès qu’on approche. Totalement inoffensifs, et chez eux bien avant nous.',
      },
      {
        icon: 'droplet',
        title: 'Les moustiques',
        text: 'Ils piquent surtout au lever et au coucher du soleil, et le moustique tigre, présent en Sicile, pique aussi en pleine journée. Ils naissent dans l’eau immobile — quelques centimètres dans une soucoupe suffisent. Vider ce qui retient l’eau est plus efficace que n’importe quelle bombe.',
      },
      {
        icon: 'info',
        title: 'Les serpents : rares, mais ils existent',
        text: 'On n’en voit pas au village, et pratiquement jamais près des maisons. Mais la Sicile en compte plusieurs espèces, et l’une d’elles est venimeuse : la vipère (Vipera aspis hugyi), qui vit dans la campagne sèche et pierreuse. Elle fuit avant qu’on l’ait vue. En randonnée, chaussures fermées et on regarde où l’on met les mains. Et en cas de morsure : on appelle les secours, on immobilise le membre — jamais de garrot, jamais d’incision, jamais d’aspiration.',
      },
      {
        icon: 'target',
        title: 'Les scorpions : présents, et sans danger',
        text: 'Le scorpion sicilien (Euscorpius sicanus) est petit, sombre, nocturne, et se cache sous les pierres ou les pots. Il est extrêmement craintif et pique rarement ; sa piqûre fait le même effet qu’une piqûre d’ortie ou d’abeille, sans danger. C’est de là que vient l’habitude de secouer ses chaussures.',
      },
    ],
    note: 'Nous ne disons pas « il n’y a rien ici » : ce serait rassurant et faux. Nous disons ce qui vit là, et ce que ça change vraiment — c’est-à-dire presque rien, à condition de tenir la cuisine propre.',
  },
  notFoundPage: {
    eyebrow: 'Erreur 404',
    title: 'Cette page n’existe pas',
    text: 'Un lien s’est cassé quelque part, ou l’adresse a été recopiée de travers. Ça n’a rien de grave, et ce n’est pas votre faute. Voilà par où repartir.',
    definition: '404 : le navigateur a bien joint le serveur, mais le serveur n’a pas trouvé ce qu’on lui demandait.',
    home: 'Retour à l’accueil',
    elsewhere: 'Ou allez directement quelque part',
  },
  cashPage: {
    eyebrow: 'Retirer de l’argent',
    title: 'Où trouver un Bancomat',
    intro: 'En Italie, un distributeur s’appelle un Bancomat — c’est le mot écrit sur les façades, et le seul que tout le monde comprendra si vous demandez votre chemin. Il y en a deux à Donnalucata.',
    spots: [
      {
        title: 'Banca Agricola Popolare di Sicilia',
        where: 'Via Miccichè 23, Donnalucata',
        text: 'L’agence du village. Le distributeur est en façade, accessible aux heures d’ouverture et souvent au-delà.',
        label: 'Ouvrir dans Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=Banca+Agricola+Popolare+di+Sicilia+Via+Miccich%C3%A8+23+Donnalucata+Scicli+RG',
      },
      {
        title: 'Le bureau de poste — Postamat',
        where: 'Via Casmene, Donnalucata',
        text: 'La poste italienne a son propre distributeur, le Postamat. Il accepte les cartes étrangères comme n’importe quel Bancomat, et dépanne quand la banque est fermée.',
        label: 'Ouvrir dans Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=Poste+Italiane+Via+Casmene+Donnalucata+Scicli+RG',
      },
    ],
    note: 'Les deux adresses sont sûres, mais qu’un appareil soit en service tel jour, personne ne peut le promettre — d’où les deux plutôt qu’un seul. Prévoyez un peu d’espèces d’avance : beaucoup de petits commerces, et le marché, n’acceptent que ça.',
  },
  quizPage: {
    eyebrow: 'Petit jeu',
    title: 'Vous connaissez la région ?',
    intro: 'Par thème, ou tout mélangé. Trois réponses possibles à chaque fois, et tout ce qu’il faut savoir est écrit plus haut sur cette page — chaque réponse vous dit où aller relire.',
    start: 'Commencer',
    next: 'Question suivante',
    check: 'Valider',
    back: 'Question précédente',
    seeSection: 'Relire le passage',
    good: 'C’est ça',
    wrong: 'Raté',
    progress: 'Question {n} sur {t}',
    scoreTitle: 'Terminé',
    scoreLine: '{n} bonnes réponses sur {t}',
    again: 'Rejouer',
    allThemes: 'Tous les thèmes',
    empty: 'Aucune question avec ce tri — élargissez un peu.',
    pick: 'Choisissez un thème, ou lancez-vous sur tout.',
    questions: [
      { q: 'D’où vient le nom « Cava d’Aliga » ?', choix: ['Des algues — « aliga » en sicilien', 'D’une ancienne carrière de pierre', 'Du nom d’un saint local'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Quelle série télévisée a fait de Scicli son décor ?', choix: ['Le commissaire Montalbano', 'Le Guépard', 'Gomorra'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Après quel séisme le Val di Noto a-t-il été rebâti en baroque ?', choix: ['Celui de 1693', 'Celui de 1908', 'Celui de 1542'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'La Fornace Penna, sur le promontoire de Sampieri, était…', choix: ['Une briqueterie', 'Un phare', 'Une conserverie de thon'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'De quelle cité grecque Syracuse fut-elle la rivale ?', choix: ['Athènes', 'Sparte', 'Corinthe'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Où se trouve l’Oreille de Denys ?', choix: ['À Syracuse', 'À Raguse', 'À Noto'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Sur les dix lieux de cette page, combien sont classés à l’UNESCO ?', choix: ['Cinq', 'Deux', 'Les dix'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Où se trouve la Torre Cabrera, tour de guet du XVIᵉ siècle ?', choix: ['À Marina di Ragusa', 'À Sampieri', 'À Donnalucata'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Comment les Siciliens appellent-ils l’Etna ?', choix: ['A Muntagna', 'Il Vulcano', 'La Signora'], bonne: 0, ancre: 'etna', niveau: 'facile' },
      { q: 'Peut-on skier sur l’Etna ?', choix: ['Oui, sur deux domaines', 'Non, il y fait trop chaud', 'Oui, mais un seul mois par an'], bonne: 0, ancre: 'etna', niveau: 'facile' },
      { q: 'Que récoltaient les nivaroli sur l’Etna ?', choix: ['La neige', 'Le soufre', 'La lave refroidie'], bonne: 0, ancre: 'etna', niveau: 'moyen' },
      { q: 'Quelle découverte a transformé la neige en réfrigérant ?', choix: ['La mêler à du sel marin', 'La tasser en blocs', 'La couvrir de paille'], bonne: 0, ancre: 'etna', niveau: 'moyen' },
      { q: 'Comment appelait-on les fosses de pierre où l’on enfouissait la neige ?', choix: ['Les neviere', 'Les cisterne', 'Les gebbie'], bonne: 0, ancre: 'etna', niveau: 'difficile' },
      { q: 'Depuis quand l’Etna est-il inscrit au patrimoine mondial de l’UNESCO ?', choix: ['Depuis 2013', 'Depuis 1993', 'Depuis 2021'], bonne: 0, ancre: 'etna', niveau: 'difficile' },
      { q: 'En quelle année les Arabes débarquent-ils en Sicile ?', choix: ['En 827', 'En 1091', 'En 1492'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'Que veut dire « Donnalucata » ?', choix: ['La source des heures', 'La dame du lac', 'Le port aux poissons'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Les noms qui commencent par « Calta- » viennent de qal‘at. Ça veut dire…', choix: ['La forteresse', 'La rivière', 'Le marché'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Marsala vient de « marsa ». Que veut dire ce mot ?', choix: ['Le port', 'La montagne', 'Le pont'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Qui décrit la source de Donnalucata au XIIᵉ siècle ?', choix: ['Le géographe al-Idrisi', 'L’émir Belcane', 'Le comte Roger'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'La fête de la Madonna delle Milizie rejoue une bataille de quelle année ?', choix: ['1091', '827', '1693'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Dans le dialecte, la « zàgara », c’est…', choix: ['La fleur d’oranger', 'Le canal d’irrigation', 'Le bassin'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Comment s’appelle le gâteau de la fête de Scicli ?', choix: ['La testa di turco', 'Le cannolo', 'La cassata'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Le vrai petit-déjeuner sicilien de l’été, c’est…', choix: ['Une granita et une brioche', 'Un cappuccino et un cannolo', 'Du pain et de l’huile d’olive'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'À Palerme, on dit…', choix: ['Arancina, au féminin', 'Arancino, au masculin', 'Ni l’un ni l’autre'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'La passeggiata, c’est vers quelle heure ?', choix: ['Vers 19 h, quand la chaleur tombe', 'À midi pile', 'Au lever du soleil'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'La brioche du petit-déjeuner s’appelle…', choix: ['La brioche col tuppo', 'La brioche col nodo', 'La brioche della nonna'], bonne: 0, ancre: 'coutumes', niveau: 'moyen' },
      { q: 'Qui a tranché le débat arancina / arancino ?', choix: ['L’Académie de la Crusca', 'Le maire de Palerme', 'Personne, il dure encore'], bonne: 0, ancre: 'coutumes', niveau: 'difficile' },
      { q: 'Le chocolat de Modica est travaillé…', choix: ['À froid, le sucre reste en grains', 'À très haute température', 'Avec du beurre de cacao ajouté'], bonne: 0, ancre: 'specialites', niveau: 'facile' },
      { q: 'La scaccia ragusana, c’est…', choix: ['Une pâte à pain fine roulée sur sa garniture', 'Une pizza épaisse', 'Un beignet sucré'], bonne: 0, ancre: 'specialites', niveau: 'facile' },
      { q: 'Que cachent les ’mpanatigghi de Modica ?', choix: ['De la viande de bœuf', 'De la ricotta', 'Des figues sèches'], bonne: 0, ancre: 'specialites', niveau: 'moyen' },
      { q: 'Les teste di turco de Scicli sont fourrées…', choix: ['De ricotta ou de crème', 'De chocolat de Modica', 'De viande hachée'], bonne: 0, ancre: 'specialites', niveau: 'moyen' },
      { q: 'Le caciocavallo ragusano est affiné…', choix: ['En parallélépipède, pendu à une corde', 'En meule ronde', 'En petites boules dans l’huile'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'La cubbaita est un nougat dur au…', choix: ['Sésame et miel', 'Amandes et sucre glace', 'Pistache et chocolat'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'Depuis quand l’Antica Dolceria Bonajuto fait-elle du chocolat ?', choix: ['Depuis 1880', 'Depuis 1950', 'Depuis 1720'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'Quel est l’unique DOCG de toute la Sicile ?', choix: ['Le Cerasuolo di Vittoria', 'Le nero d’avola', 'Le marsala'], bonne: 0, ancre: 'alcools', niveau: 'facile' },
      { q: 'Le Cerasuolo di Vittoria assemble deux cépages. Lesquels ?', choix: ['Nero d’avola et frappato', 'Frappato et grillo', 'Nero d’avola et syrah'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'D’où le nero d’avola tient-il son nom ?', choix: ['De la ville d’Avola', 'D’un cépage grec', 'De la couleur de la terre'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Le marsala vient de quelle partie de la Sicile ?', choix: ['De l’ouest de l’île', 'Des pentes de l’Etna', 'Des monts Iblei'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Quel amaro sicilien est né à Caltanissetta ?', choix: ['L’Averna', 'Le Fernet', 'Le Cynar'], bonne: 0, ancre: 'alcools', niveau: 'difficile' },
      { q: 'Le frappato seul donne un vin…', choix: ['Rouge clair, servi un peu frais', 'Blanc et minéral', 'Rouge très tannique'], bonne: 0, ancre: 'alcools', niveau: 'difficile' },
      { q: 'Au bar, un « caffè corretto », c’est un espresso…', choix: ['Avec un trait de liqueur', 'Avec beaucoup de lait', 'Servi avec un verre d’eau'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'Quand boit-on un cappuccino ?', choix: ['Le matin, jamais après un repas', 'Après le dîner', 'À n’importe quelle heure'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'À la maison, le café se fait…', choix: ['À la moka, sur le feu', 'À la machine à filtre', 'Au piston'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'Que veut dire « ristretto » ?', choix: ['Encore plus serré', 'Allongé', 'Avec une goutte de lait'], bonne: 0, ancre: 'cafe', niveau: 'moyen' },
      { q: 'Le caffè freddo sicilien est souvent adouci…', choix: ['Au lait d’amande', 'Au sirop de sucre de canne', 'Au miel'], bonne: 0, ancre: 'cafe', niveau: 'moyen' },
      { q: 'Que désigne l’« ammazzacaffè » ?', choix: ['Le corretto qui clôt le repas', 'Un gâteau au café', 'Une très grande tasse'], bonne: 0, ancre: 'cafe', niveau: 'difficile' },
      { q: 'Que mangent les geckos qui traversent le mur le soir ?', choix: ['Des moustiques', 'Des miettes', 'Rien, ils dorment'], bonne: 0, ancre: 'faune', niveau: 'facile' },
      { q: 'Y a-t-il des scorpions en Sicile ?', choix: ['Oui, mais leur piqûre est sans danger', 'Non, aucun', 'Oui, et ils sont mortels'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Où naissent les moustiques ?', choix: ['Dans l’eau immobile, même quelques centimètres', 'Dans les haies sèches', 'Sous les pierres chaudes'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Quel est le seul serpent venimeux de Sicile ?', choix: ['La vipère aspic', 'La couleuvre verte et jaune', 'Il n’y en a aucun'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'Que ne faut-il SURTOUT pas faire en cas de morsure de vipère ?', choix: ['Poser un garrot ou inciser', 'Appeler les secours', 'Immobiliser le membre'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'Où les premières pâtes sèches d’Europe sont-elles documentées ?', choix: ['En Sicile, à Trabia', 'À Naples', 'En Chine, rapportées par Marco Polo'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'Comment s’appelaient ces fils de semoule décrits en 1154 ?', choix: ['Itriyya', 'Maccheroni', 'Tagliatelle'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Qui a écrit la plus ancienne mention des pâtes sèches d’Europe ?', choix: ['Al-Idrisi, dans le Livre de Roger', 'Marco Polo', 'Pline l’Ancien'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'D’où vient la couleur d’or de l’arancina ?', choix: ['Du safran, apporté par les Arabes', 'Du curcuma', 'De la chapelure'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Comment appelle-t-on le chef d’une tonnara, la pêcherie de thon ?', choix: ['Le raìs', 'Le padrone', 'Le capitano'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'La cubbaita tient son nom de l’arabe…', choix: ['Qubbayt', 'Zabīb', 'Sāqiya'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Le sfincione palermitain tiendrait son nom de l’arabe…', choix: ['Isfanǧ, la pâte frite', 'Sifr, le zéro', 'Sukkar, le sucre'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Dans quelles villes siciliennes mange-t-on encore le couscous ?', choix: ['Trapani et San Vito Lo Capo', 'Catane et Syracuse', 'Modica et Scicli'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Qu’y a-t-il dans les pâtes aux sardines ?', choix: ['Fenouil sauvage, raisins secs, pignons et safran', 'Crème et lardons', 'Tomate et basilic seulement'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'Qu’est-ce qui caractérise la caponata ?', choix: ['L’aigre-doux : vinaigre et sucre', 'Le piment fort', 'La cuisson au feu de bois'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'La frutta martorana est faite de…', choix: ['Pâte d’amande', 'Pâte à sucre', 'Chocolat de Modica'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'La cassata tiendrait son nom de qas‘ah, qui désigne…', choix: ['Le bol dans lequel on la moulait', 'La ricotta', 'Une fête religieuse'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'En janvier 1945, où la révolte « Non si parte ! » a-t-elle éclaté le plus fort ?', choix: ['Dans la province de Raguse', 'À Palerme', 'En Calabre'], bonne: 0, ancre: 'histoire', niveau: 'facile' },
      { q: 'Contre quoi les Siciliens se soulèvent-ils en janvier 1945 ?', choix: ['Contre l’appel des jeunes sous les drapeaux', 'Contre le prix du pain', 'Contre la fermeture des mines'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'Qu’a fait Maria Occhipinti, enceinte de cinq mois, le 4 janvier 1945 ?', choix: ['Elle s’est couchée devant le camion militaire', 'Elle a caché les garçons dans sa cave', 'Elle a écrit au préfet'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'Combien de temps a tenu la « République de Comiso » ?', choix: ['Six jours', 'Six semaines', 'Six mois'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Qu’étaient les Fasci siciliani de 1891-1894 ?', choix: ['Des ligues de paysans, soufriers et artisans', 'Un parti fasciste avant l’heure', 'Une confrérie religieuse'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Que s’est-il passé à Portella della Ginestra le 1er mai 1947 ?', choix: ['Une fusillade sur la foule du 1er mai', 'Une éruption de l’Etna', 'Une grève générale'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Qui a écrit « Una donna di Ragusa » ?', choix: ['Maria Occhipinti', 'Leonardo Sciascia', 'Elio Vittorini'], bonne: 0, ancre: 'livres', niveau: 'facile' },
      { q: '« La plupart ne reviendront pas » raconte…', choix: ['La retraite de Russie', 'Le débarquement allié en Sicile', 'La construction de l’autoroute'], bonne: 0, ancre: 'livres', niveau: 'moyen' },
      { q: 'Dans quel livre trouve-t-on « il faut que tout change pour que rien ne change » ?', choix: ['Il Gattopardo', 'I Malavoglia', 'Conversazione in Sicilia'], bonne: 0, ancre: 'livres', niveau: 'moyen' },
      { q: 'De quoi parle « Il giorno della civetta » de Sciascia ?', choix: ['De la mafia, à une époque où on niait son existence', 'De la pêche au thon', 'Du tremblement de terre de 1693'], bonne: 0, ancre: 'livres', niveau: 'difficile' },
      { q: '« Le parole sono pietre » de Carlo Levi raconte…', choix: ['Trois voyages en Sicile et la lutte pour la terre', 'Un séjour à Venise', 'L’histoire du chocolat de Modica'], bonne: 0, ancre: 'livres', niveau: 'difficile' },
      { q: 'Comment les survivants appelaient-ils les marches vers les camps russes ?', choix: ['Les marches du « davaï »', 'Les marches blanches', 'Les marches du Don'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'Sur les prisonniers italiens des camps soviétiques, combien sont revenus ?', choix: ['Environ dix mille', 'Presque tous', 'Aucun'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Quand les derniers prisonniers italiens de Russie ont-ils été libérés ?', choix: ['En 1954, après la mort de Staline', 'En 1945, à la fin de la guerre', 'En 1948'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
    ],
  },
  askMag: {
    text: 'On n’a pas encore l’info ici. Écrivez à Mag : elle vous répond, et on l’ajoute pour les suivants.',
    textFor: 'Pour {what} : on n’a pas encore l’info ici. Écrivez à Mag, elle vous répond — et on l’ajoute pour les suivants.',
    cta: 'Écrire à Mag',
    subject: 'Une question depuis le site',
  },
  assistant: {
    label: 'Demander',
    title: 'Une question ?',
    placeholder: 'Le code du wifi, la vanne d’eau, une pizza…',
    send: 'Chercher',
    suggestions: ['L’adresse', 'Ouvrir l’eau', 'Le code du wifi', 'Avant de partir', 'Poubelles ce soir ?', 'Une pizza ?', 'Du pain ?', 'Urgences'],
    sourceLabel: 'Voir la page',
    alsoTitle: 'Aussi',
    noneTitle: 'Je ne trouve pas.',
    noneText: 'Rien sur le site ne répond à ça — et je préfère le dire plutôt que d’inventer. Écrivez à Mag : elle répond, et on l’ajoute pour les suivants.',
    close: 'Fermer',
    clear: 'Effacer',
  },
  wastePage: {
    eyebrow: 'Tri des déchets',
    title: 'Quelle poubelle, quel soir',
    intro: 'À Cava d’Aliga, chaque type de déchet a son jour. Les bacs se sortent la veille au soir : le camion passe tôt.',
    today: 'Ce soir',
    tomorrow: 'Demain soir',
    noneToday: 'Rien à sortir',
    eveningNote: 'On sort les bacs le soir, pas le matin — le camion est déjà passé. Si vous ratez le passage la veille du départ, laissez les sacs sur la terrasse, jamais dans la rue.',
    changeNote: 'Ces jours ont été relevés par Mag, et ils changent : la commune les modifie pour les fêtes, l’été, ou quand elle change de prestataire. Un bac sorti le mauvais soir reste dehors une semaine — au moindre doute, allez voir la page officielle, et prévenez Mag si elle ne dit plus la même chose que nous.',
    officialLabel: 'Le calendrier officiel de la commune',
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
      title: 'Nos adresses',
      intro: "Commerces, restaurants, marchés et contacts utiles : nos recommandations personnelles pour vivre Cava d'Aliga comme à la maison.",
    },
    'la-region': {
      eyebrow: 'La région',
      title: 'Découvrir le sud-est de la Sicile',
      intro: 'Scicli, Raguse, le baroque du Val di Noto, les plages et la campagne des Iblei.',
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
        icon: '⛴️',
        title: 'Venir en voiture',
        links: [
          { label: 'GNV — Gênes ↔ Palerme', url: 'https://www.gnv.it/fr/destinations-des-ferries/sicile/g%C3%AAnes-palerme' },
          { label: 'Caronte & Tourist — la traversée du détroit', url: 'https://www.carontetourist.it/' },
        ],
        items: [
          'Le bateau depuis Gênes — de loin le plus reposant. GNV part le soir, la traversée dure une vingtaine d’heures et on débarque à Palerme le lendemain, la voiture chargée et la route de France déjà derrière soi. Il reste environ 3 h jusqu’à la maison.',
          'La descente de la Botte — on roule jusqu’en Calabre et on embarque pour Messine. Attention : le ferry ne part pas de Reggio de Calabre même mais de Villa San Giovanni, quelques kilomètres avant, là où l’autoroute s’arrête. La traversée fait une vingtaine de minutes, sans réservation, et il reste ensuite environ 3 h de route.',
          'Entre les deux, c’est une question de fatigue : Gênes coûte une nuit en cabine et vous épargne toute l’Italie du Sud au volant.',
        ],
      },
      {
        icon: '🚗',
        title: 'Rejoindre Casa Cava d’Aliga',
        links: [
          { label: 'AST — horaires', url: 'http://www.aziendasicilianatrasporti.it:8080/' },
          { label: 'Trenitalia', url: 'https://www.trenitalia.com/' },
          { label: 'Goldcar', url: 'https://www.goldcar.es/' },
        ],
        items: [
          'Bus AST — depuis l’aéroport de Catane vers Modica, Scicli, Donnalucata et Pozzallo.',
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
      { icon: 'drop', title: 'Eau', items: ['Pour ouvrir l’eau : la vanne est dans la buanderie, à l’arrière, sur le mur entre le lave-linge et l’évier. La clé de la buanderie est juste là, dans le petit meuble à tiroirs du buffet du salon.', 'Le chauffe-eau est dans la salle de bain, dans la douche.'] },
      { icon: 'bottle', title: 'Ne pas boire l’eau du robinet', items: ['On ne la boit pas, et on ne s’en sert pas pour les glaçons. L’eau de boisson s’achète en bouteille — tous les supermarchés du coin en vendent, en packs de six litres et demi.', 'Pour tout le reste, elle est parfaitement bonne : la cuisine, les pâtes, le café, laver les fruits et les légumes, la vaisselle et la douche.'] },
      { icon: 'flame', title: 'Gaz', items: ['Mormina Gas, Via Tolstoj — il vend les bouteilles, livre à domicile et répare les cuisinières. Ses coordonnées sont plus bas, dans les contacts.'] },
      { icon: 'signal', title: 'Wifi', items: ['Réseau : cacestlaissetomber', 'Mot de passe : jamonito', 'Le wifi fonctionne avec un système de recharge : contactez-moi avant votre arrivée pour que je le recharge.'] },
      { icon: 'key', title: 'Buanderie', items: ['La clé de la buanderie est dans le petit meuble à tiroirs, à l’intérieur du buffet du salon. Elle est apparente, on la voit tout de suite.'] },
      { icon: 'box', title: 'Les draps', items: ['Ils sont dans le tiroir de l’armoire, dans la petite chambre.'] },
      { icon: 'sun', title: 'Pas de climatisation', items: ['La maison n’en a pas — c’est bon à savoir avant d’arriver en août. On la tient au frais à l’ancienne : volets fermés aux heures chaudes, et grande ouverture le soir quand l’air tourne.'] },
      { icon: 'leaf', title: 'Arroser les plantes', items: ['Un arrosage tous les trois ou quatre jours, environ 3 litres par plante.', 'Deux jasmins — un devant, un derrière — et deux bougainvilliers derrière. Toutes les autres plantes de la maison suivent le même rythme.'] },
      { icon: 'wave', title: 'La douche de la plage', items: ['En rentrant de la mer, passez sous la douche du bord de plage. Le sable qu’on ramène sur soi finit dans les canalisations — c’est comme ça qu’on se retrouve avec un problème de plomberie.'] },
    ],
  },
  depart: {
    eyebrow: 'Départ',
    title: 'Quitter la maison sereinement',
    intro: 'La petite check-list à cocher avant de fermer la porte.',
    checklistTitle: 'Avant de fermer la porte',
    checklistNote: 'Cochez au fur et à mesure — rien n’est enregistré, c’est juste pour ne rien oublier.',
    checklist: [
      'Couper l’eau : la vanne de la rue, au coin, en descendant à droite — perpendiculaire = fermé.',
      'Couper l’électricité : les interrupteurs dehors, sur la terrasse de devant, à droite de la porte.',
      'Fermer la bouteille de gaz.',
      'Vider le frigo, le débrancher et laisser la porte entrouverte pour qu’il ne moisisse pas.',
      'Sortir les poubelles selon le tri du jour. Passage manqué ? Laissez-les sur la terrasse, jamais dans la rue.',
      'Rentrer le tissu du hamac, le petit banc en bois et les tabourets en bois. Rien en bois ne passe l’hiver dehors — seule la structure du hamac reste en place.',
      'Fermer volets et fenêtres.',
      'Laver le linge avant de partir — draps et serviettes utilisés — et refaire les lits pour les suivants. Les draps propres sont dans le tiroir de l’armoire de la petite chambre.',
      'Encore humide au moment de fermer ? Laissez-le étendu quelque part dans la maison, jamais plié dans le panier.',
      'Dernier tour : chargeurs, salle de bain, terrasse, sous les lits.',
      'Remettre la clé de la buanderie dans le petit meuble à tiroirs, à l’intérieur du buffet du salon — c’est là qu’on la cherchera.',
      'Fermer à clé et remettre les clés à leur place.',
    ],
  },
};

const IT: Dict = {
  nav: {
    '/famille': 'La famiglia',
    '/la-region': 'La regione',
    '/preparer-le-voyage': 'Il viaggio',
    '/informations-pratiques': 'Info pratiche',
    '/services-locaux': 'I nostri indirizzi',
    '/evenements': 'Eventi',
  },
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
  ctaTitles: {
    '/famille': 'Ricordi di famiglia',
    '/la-region': 'Scoprire la regione',
    '/preparer-le-voyage': 'Preparare bene il viaggio',
    '/informations-pratiques': 'Tutte le info pratiche',
    '/services-locaux': 'I nostri indirizzi',
    '/evenements': 'Il calendario dei prossimi eventi',
  },
  tasteOfSicily: 'Un assaggio di Sicilia',
  sunsetAlt: 'Tramonto sulla spiaggia, il mare e il paese al crepuscolo',
  apartment: { eyebrow: 'La casa', title: 'La casa', albumAlt: 'La casa di Cava d’Aliga', captions: ['La terrazza davanti', 'La terrazza sul retro', 'L’amaca', 'Il soggiorno', 'La cucina', 'La camera piccola', 'La camera piccola', 'La camera grande', 'Il bagno', 'Il bagno', 'Il bagno', 'La doccia'], rooms: ['La terrazza davanti', 'La terrazza sul retro', 'Il soggiorno', 'La cucina', 'La camera piccola', 'La camera grande', 'Il bagno'], label: 'La casa', ctaTitle: 'Visitare la casa' },
  casaPeek: { eyebrow: 'La casa', title: 'La casa in foto', link: 'Vedere tutte le stanze' },
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
  etnaPage: {
    eyebrow: 'L’Etna',
    title: 'A Muntagna',
    intro:
      'I siciliani non dicono « l’Etna ». Dicono a Muntagna, la Montagna, come se ce ne fosse una sola — e per loro ce n’è una sola. A due ore e mezza di strada da casa, fuma, brontola, a volte impolvera le auto di cenere, e ha dato alla Sicilia la sua terra nera, il suo vino… e, per secoli, il suo ghiaccio.',
    facts: [
      {
        icon: 'volcano',
        title: 'Il vulcano attivo più alto d’Europa',
        text:
          'Poco più di 3 300 metri — la cifra cambia a ogni eruzione, la montagna si costruisce e crolla di continuo, tanto che nessuna quota resta vera a lungo. La sua attività è quasi permanente, ed è patrimonio mondiale UNESCO dal giugno 2013.',
      },
      {
        icon: 'compass',
        title: 'Ci si scia, davanti al mare',
        text:
          'Due comprensori, uno per versante. Etna Sud, sopra Nicolosi, sale da 1 910 a 2 700 metri ; Etna Nord, a Piano Provenzana sopra Linguaglossa, da 1 800 a 2 340 metri. Sciare sulla cenere nera con lo Ionio là sotto : non succede da nessun’altra parte.',
      },
      {
        icon: 'droplet',
        title: 'I nivaroli e le neviere',
        text:
          'Fin dal Medioevo alcuni uomini salivano a raccogliere la neve d’inverno e la seppellivano in fosse di pietra, le neviere, isolate sotto la cenere vulcanica, la felce e la paglia. D’estate la riportavano a valle a dorso di mulo, in sacchi di juta. La Sicilia è stata tra i grandi produttori di ghiaccio d’Europa fino al Settecento.',
      },
      {
        icon: 'cone',
        title: 'Dalla neve alla granita',
        text:
          'Quella neve grattata, bagnata di succo di limone o di sciroppo di frutta, è l’antenata diretta della granita. Poi si scopre che la neve mescolata al sale marino raffredda senza confondersi : da ingrediente diventa refrigerante, e la granita come la mangiamo oggi — quella della colazione, con la brioche — nasce da questo gesto.',
      },
    ],
    linkPark: 'Il parco dell’Etna, sito UNESCO',
    linkTours: 'Escursioni guidate sull’Etna',
    linkToursUrl: 'https://etnaway.com/it/',
    linkSki: 'I comprensori sciistici dell’Etna',
    photoAlt: 'L’Etna',
  },
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
      {
        icon: 'fork',
        title: 'La prima pasta secca d’Europa è siciliana',
        text: 'E lo scrive lo stesso al-Idrisi. Nel 1154, nel Libro di Ruggero, descrive a Trabia — vicino Palermo — mulini che producono fili di semola chiamati itriyya, in tale quantità da esportarne ovunque, presso i musulmani come presso i cristiani. È la più antica testimonianza nota di una produzione di pasta secca in Europa: tre secoli prima dei racconti su Marco Polo, e a ottanta chilometri da qui.',
      },
      {
        icon: 'citrus',
        title: 'Il riso, lo zafferano, e quindi l’arancina',
        text: 'Riso e zafferano arrivano con gli arabi. Una palla di riso allo zafferano, impanata e fritta, è esattamente quello che cucinavano — e il colore dorato dell’arancina viene da lì. Lo sfincione palermitano, invece, prenderebbe il nome dall’arabo isfanǧ, la pasta fritta.',
      },
      {
        icon: 'cleaver',
        title: 'L’agrodolce: una firma che non si è mai cancellata',
        text: 'La pasta con le sarde — sarde, finocchietto selvatico, uvetta, pinoli, zafferano — mette nello stesso piatto il pesce della costa e la frutta secca venuta dall’Oriente. La caponata suona lo stesso accordo agrodolce, con aceto e zucchero. In nessun’altra parte d’Italia si cucina così: è la traccia più riconoscibile di due secoli arabi.',
      },
      {
        icon: 'cone',
        title: 'La pasticceria: mandorla, zucchero, ricotta',
        text: 'Lo zucchero di canna arriva con loro, e con esso tutta la pasticceria siciliana. La pasta reale — il marzapane della frutta martorana — discende in linea diretta dal marzapane arabo. La cubbaita, il torrone di sesamo e miele, conserva il nome dall’arabo qubbayt. E la cassata prenderebbe il suo da qas‘ah, la scodella in cui la si modellava.',
      },
      {
        icon: 'wave',
        title: 'Anche in mare si parla arabo',
        text: 'Il capo di una tonnara si chiama raìs, dall’arabo raʾīs, il capo. Tutto il vocabolario della pesca al tonno ha conservato le sue parole arabe, e le tonnare di Sicilia hanno funzionato così fino al Novecento. A Trapani e San Vito Lo Capo si mangia ancora il cuscus — di pesce.',
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
    siteLabel: 'Sito ufficiale',
    walkLabel: 'Ci si può andare a piedi',
    closeLabel: 'Chiudi',
    viewMap: 'Mappa',
    viewList: 'Elenco',
    departReset: 'Togli questa partenza — ricalcola dalla casa',
    departFrom: 'Distanze da',
    departPin: 'un punto posato sulla mappa',
    departBack: 'Tornare alla casa',
    houseHere: 'La casa',
    wherePlaceholder: 'Dove sei? Un paese, un indirizzo…',
    whereSearching: 'Cerco…',
    whereNotFound: 'Non trovato. Prova il nome italiano — i luoghi vengono da OpenStreetMap.',
    whereError: 'La ricerca non ha risposto. Riprova, o tocca direttamente la mappa.',
    whereOut: 'È fuori dalla Sicilia — la mappa non arriva fin là.',
    mapFailed: 'La mappa non si è caricata.',
    mapFailedHint: 'Ricarica la pagina. Se continua, forse un blocco pubblicità o una rete aziendale impedisce il caricamento — l’elenco funziona comunque.',
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
        spots: [{ label: 'Vivai Cintoli', url: 'https://maps.app.goo.gl/X2VCrFrZEK2caPpH9' }],
      },
    ],
    markets: {
      title: 'Mercati',
      desc: 'Frutta, verdura, formaggi e pesce del giorno, direttamente dai produttori.',
      list: [
        { label: 'Mercato di Scicli — il martedì, 8-13, contrada Zagarone', url: 'https://www.google.com/maps/search/?api=1&query=mercato+settimanale+contrada+Zagarone+Scicli+RG' },
        { label: 'Mercato Campagna Amica — il venerdì, 8-13, via Badiula (Scicli)', url: 'https://www.google.com/maps/search/?api=1&query=Via+Badiula+Scicli+RG' },
        { label: 'Mercato degli agricoltori di Marina di Ragusa — venerdì mattina (giu–set)', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Vincenzo+Rabito+Marina+di+Ragusa' },
        { label: 'Mercato del pesce di Donnalucata — pesce fresco del giorno', url: 'https://www.google.com/maps/search/?api=1&query=Mercato+ittico+Donnalucata' },
      ],
    },
  },
  salvaPage: { title: 'La famiglia', intro: 'Foto, ricordi e storia della famiglia, nel corso degli anni.', historyTitle: 'Storia della famiglia', storyText: [
    'Salvatore Contrino è nato il 26 gennaio 1947 a Valguarnera, in Sicilia.',
    'Suo padre Angelo, tornato dai campi russi, si ritrovò vedovo con un bambino di sei mesi. Lo affidò a sua madre Giuseppina — nonna Pipine —, emigrata a Saint-Étienne con i figli, che lo crebbe come il decimo della nidiata.',
    'A diciannove anni partì a lavorare in Belgio, che non lasciò più. Tenendo la Sicilia, il suo patrimonio, in un angolo del cuore.',
    'Di generazione in generazione, questa casa di Cava d’Aliga riunisce la famiglia. È lì il punto centrale, quello che ci riportava tutti alle sue origini.',
  ], storyOpen: 'Questa storia si scrive in tanti. Una data, un luogo, un nome, un aneddoto, una foto — mandateli e troveranno il loro posto qui. La cosa più utile: dite di chi parlate, quando e dove. È ciò che permette di agganciare ogni pezzo al punto giusto.', storyOpenCta: 'Aggiungere alla storia', storyOpenSubject: 'Storia della famiglia — ho qualcosa da aggiungere', treeTitle: 'Albero genealogico', treeNote: 'Quello che la famiglia ci ha trasmesso. Restano dei vuoti — sono elencati in fondo, e ognuno può colmarli.', treePaternal: 'Nonni paterni', treeMaternal: 'Nonni materni', treeWife1: '1ª moglie', treeWife2: '2ª moglie', treeMarriage1: '1º matrimonio', treeMarriage2: '2º matrimonio', treeGreat: 'Bisnonni', treeParents: 'I genitori', treeChildren: 'I figli', treeQuestionsTitle: 'Quello che ci manca', treeAdd: '+ Aggiungi il mio ramo', treeAddSubject: 'Albero genealogico — il mio ramo', treeExample: 'Mancano persone e date — diteci quello che sapete.', treeOpen: 'Apri', treeClose: 'Chiudi', treeOpenAll: 'Apri tutto', treeCloseAll: 'Chiudi tutto', treeKid: 'figlio', treeKids: 'figli', treeSideFather: 'Ramo Contrino', treeSideMother: 'Ramo Lux', treeSideUs: 'Noi' },
  stayPage: { title: 'Il calendario', intro: 'I periodi in cui la casa è occupata, per coordinarsi in famiglia.', legend: { occupied: 'Occupato', tentative: 'Da confermare', free: 'Libero' } },
  calendarPage: { title: 'Prossimi eventi', intro: 'Cosa succede intorno a casa — il programma dell’estate a Bruca e le grandi feste siciliane.', festivalsTitle: 'Feste siciliane', programNote: 'Sotto il cielo di Bruca — il programma dell’estate, a due passi da casa. Seguite i colori.', programDone: 'Il programma dell’estate è finito. Il prossimo arriverà in primavera — le feste siciliane, invece, tornano ogni anno.', programMore: 'Dettagli e orari su Instagram', socialsTitle: 'Da seguire', festivalDescs: ["Il grande giorno dell’estate italiana. Erede delle Feriae Augusti romane e legata all’Assunzione, la festa riunisce famiglie e paesi in riva al mare: bagni, grandi pranzi, processioni e fuochi d’artificio animano tutta la Sicilia.", "San Rocco, invocato da secoli contro le epidemie, protegge molte comunità siciliane. A Scicli la sua statua è portata in processione tra i vicoli, tra bande musicali e luminarie di festa.", "San Giovanni Battista è il patrono di Ragusa, a cui è dedicata la cattedrale. Il 29 agosto, giorno della sua decollazione, la città si illumina: solenne processione della statua e grande spettacolo pirotecnico sopra la città vecchia.", "San Corrado Confalonieri, eremita venerato come patrono di Noto. L’ultima domenica d’agosto, la sua urna d’argento attraversa le vie barocche in una grande devozione popolare, tra ceri, fiori e cortei."] },
  culturePage: {
    eyebrow: 'Cultura',
    title: 'Suoni & immagini',
    intro: 'Questo angolo di Sicilia ha una colonna sonora e scenografie da cinema. Una playlist condivisa da ascoltare in viaggio, e i film e le serie girati a pochi chilometri da casa — spesso in strade che riconoscerete.',
    playlistDesc: 'Una playlist condivisa: ognuno aggiunge ciò che ascolta qui. Per la strada dall’aeroporto, la cucina o la terrazza la sera.',
    playlistCta: 'Apri su Spotify',
    playlistSoon: 'Il link della playlist arriva presto.',
    artistsIntro: 'Le voci che raccontano l’isola — da ascoltare prima, durante, dopo.',
    handsIntro: 'Nel 1958 il designer milanese Bruno Munari fotografa cinquanta gesti italiani e li didascalizza in quattro lingue. Il titolo dice tutto: « Supplemento al dizionario italiano ». Non lo fa per scherzo — lo fa per gli stranieri di passaggio in Italia. Cioè per noi.',
    handsWho: 'Bruno Munari (Milano, 1907-1998) comincia tra i futuristi a vent’anni, poi passa la vita a smontare la serietà: le sue « macchine inutili » del 1933 girano al soffitto senza produrre nulla. I gesti non li ha inventati — li ha presi dal canonico Andrea de Jorio, che li aveva raccolti a Napoli nel 1832.',
    handsBookCta: 'Il libro da Corraini',
    handsBook2Title: 'Design as Art',
    handsBook2Desc: 'Il suo libro più letto, pubblicato da Laterza nel 1966 con il titolo « Arte come mestiere ». Munari guarda le lampade, i segnali stradali, i manifesti, le automobili e le sedie, e ogni volta chiede la stessa cosa: è bello, funziona, è per tutti? Picasso lo chiamava « il nuovo Leonardo ». Ristampato nei Penguin Modern Classics nel 2008.',
    handsBook2Cta: 'Il libro da Penguin',
    handsPhotoNote: 'La mano sulla copertina del Supplemento è « ma che vuoi » — il gesto da cui parte tutto. Gli altri sono nel libro, e qui non ci stanno: sono sotto diritti. Mostriamo le copertine, non quello che c’è dentro.',
    handsCoverAlt: 'Copertina di « Speak Italian: The Fine Art of the Gesture » di Bruno Munari: una mano fotografata in bianco e nero, le cinque dita unite a pigna.',
    handsCoverCredit: 'Bruno Munari, Speak Italian: The Fine Art of the Gesture — Chronicle Books, 2005',
    handsCover2Alt: 'Copertina di « Design as Art » di Bruno Munari per Penguin: sedici volti disegnati in bianco e nero, ognuno in uno stile diverso, su fondo crema.',
    handsCover2Credit: 'Bruno Munari, Design as Art — Penguin Modern Classics, 2008',
    photosIntro: 'Prima dei telefoni, altri hanno guardato queste pietre e queste feste — e le hanno fissate per sempre.',
    artsIntro: 'Scicli non è solo un set televisivo: è un vero focolaio di pittura, e questo mare è stato dipinto per tutta una vita.',
    sculptureIntro: 'L’unico di questi artisti ancora al lavoro — e lavora a 8 km, facendo di Scicli il suo atelier a cielo aperto.',
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
        text: 'Non un dolce: la vera colazione siciliana d’estate. Si ordina una granita — mandorla, limone, gelso, pistacchio, caffè — con una brioche col tuppo, quella con il ciuffo in testa. La brioche si inzuppa — e c’è chi la apre e la riempie di granita. Alzarsi presto e andarla a mangiare al bar prima che cali il caldo è uno dei motivi migliori per essere qui.',
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
  specialtiesPage: {
    eyebrow: 'Specialità',
    title: 'Le specialità del posto',
    intro: 'Quello che si porta a casa e quello che si assaggia sul posto — le vere specialità dei monti Iblei, tra Scicli, Modica e Ragusa.',
    facts: [
      {
        icon: 'fork',
        title: 'La scaccia ragusana',
        text: 'Una sfoglia di pasta di pane sottile come carta, arrotolata sul ripieno e cotta al forno. Le classiche: pomodoro e cipolla, ricotta e cipolla, ricotta e salsiccia, pomodoro e melanzana. È da sempre il pranzo al sacco di qui — la trovi in ogni panificio.',
      },
      {
        icon: 'leaf',
        title: 'Il cioccolato di Modica',
        text: 'Un cioccolato lavorato a freddo, ereditato dagli Aztechi tramite gli spagnoli: lo zucchero non si scioglie, resta in granuli e il cioccolato scrocchia. Cannella, vaniglia, peperoncino, agrumi… A Modica, a venti minuti, l’Antica Dolceria Bonajuto lo fa dal 1880.',
      },
      {
        icon: 'cone',
        title: 'Le teste di turco di Scicli',
        text: 'IL dolce di Scicli: un grosso bignè a forma di turbante, farcito di ricotta o crema. Nome e forma vengono dalla leggenda della Madonna delle Milizie — il turbante degli invasori turchi. Buone davvero solo qui.',
      },
      {
        icon: 'cleaver',
        title: 'Gli ’mpanatigghi di Modica',
        text: 'Mezzelune di pasta frolla che nascondono un segreto: carne di manzo tritata, cioccolato fondente, mandorle, zucchero e spezie. Dolce-salato, eredità dei conventi spagnoli. Sorprendenti — e molto più buoni di quanto sembri.',
      },
      {
        icon: 'droplet',
        title: 'Il caciocavallo ragusano',
        text: 'Il grande formaggio degli Iblei — il « cosacavaddu », grande forma di pasta filata, stagionata a parallelepipedo e appesa a una corda. Dolce e fresco da giovane, piccante con la stagionatura. Con la provola ragusana, è la base della tavola di qui.',
      },
      {
        icon: 'citrus',
        title: 'Torrone e cubbaita',
        text: 'I dolci di mandorle e miele del posto: il torrone di mandorle e la cubbaita, un croccante duro di sesamo e miele di origine araba, che si spezza a pezzi. I dolci delle feste, da portar via.',
      },
    ],
  },
  drinksPage: {
    eyebrow: 'Vini & liquori',
    title: 'I vini e i liquori del posto',
    intro: 'Il sud-est è una grande terra di vino — e l’unica DOCG della Sicilia è nata qui accanto. Di che accompagnare la tavola e chiudere il pasto.',
    facts: [
      {
        icon: 'glass',
        title: 'Il Cerasuolo di Vittoria',
        text: 'IL vino di qui — e l’unica DOCG di tutta la Sicilia, nata a Vittoria, qui accanto. Un assemblaggio di nero d’avola e frappato sulla terra rossa della zona: rosso ciliegia, secco, vellutato, un naso di fiori e frutti rossi. Il vino dei grandi produttori del posto — COS, Planeta, Valle dell’Acate.',
      },
      {
        icon: 'leaf',
        title: 'Il frappato',
        text: 'Il vitigno leggero e profumato di Vittoria. Da solo dà un rosso chiaro, quasi dissetante, di fragola e ciliegia, da servire un po’ fresco d’estate. L’opposto di un vino pesante — perfetto a tavola quando fa caldo.',
      },
      {
        icon: 'bottle',
        title: 'Il nero d’avola',
        text: 'Il grande rosso siciliano, che prende il nome da Avola, qui vicino. Polposo, scuro, caldo, di frutta nera e spezie. È lui a dare corpo al Cerasuolo, ma si beve anche da solo, in tutta l’isola.',
      },
      {
        icon: 'droplet',
        title: 'Il marsala',
        text: 'Il celebre vino liquoroso di Sicilia, dall’ovest dell’isola. Dal secco all’ambrato dolcissimo: come aperitivo, sui formaggi o in cucina — è lui a profumare lo zabaione e tanti dolci. Un sorso di storia siciliana.',
      },
      {
        icon: 'citrus',
        title: 'L’amaro',
        text: 'Il digestivo di fine pasto: un liquore amaro alle erbe e agli agrumi, servito freddo. L’Averna, nato a Caltanissetta, è il più noto di Sicilia. Si beve ghiacciato, a volte con ghiaccio, per chiudere il pasto.',
      },
      {
        icon: 'sun',
        title: 'Limoncello & rosolio',
        text: 'I liquori di casa che si tirano fuori dopo il caffè: il limoncello, alle scorze di limone, ghiacciato; e i rosoli, i vecchi liquori siciliani profumati (cannella, caffè, mandarino…). Spesso fatti in casa, sempre offerti.',
      },
    ],
  },
  coffeePage: {
    eyebrow: 'Il caffè',
    title: 'Il caffè, tutto un rito',
    intro: 'Qui il caffè scandisce la giornata — svelto al banco la mattina, freddo d’estate, corretto con una goccia di liquore dopo il pasto. Piccole istruzioni per l’uso.',
    facts: [
      {
        icon: 'droplet',
        title: 'Un caffè = un espresso',
        text: 'Qui « un caffè » è un espresso ristretto, bevuto in piedi al banco in trenta secondi, per circa un euro. Non ci si siede, non si porta via: si beve lì, si paga, si esce. Il caffè lungo all’americana non esiste — chiedete un caffè lungo se lo volete meno concentrato.',
      },
      {
        icon: 'sun',
        title: 'Il caffè freddo, alla mandorla',
        text: 'D’estate il caffè freddo: un espresso freddo, spesso addolcito col latte di mandorla — una meraviglia del sud. Si trova anche « in ghiaccio », versato bollente sui cubetti. Una bevanda vera e propria, non un caffè dimenticato.',
      },
      {
        icon: 'cone',
        title: 'La granita al caffè',
        text: 'La versione al caffè della granita della colazione: ghiacciata, con un ciuffo di panna e la brioche da inzuppare. Il risveglio siciliano d’estate, quando alle otto fa già caldo.',
      },
      {
        icon: 'list',
        title: 'Il piccolo lessico del banco',
        text: 'Macchiato (una goccia di latte), lungo (allungato), ristretto (ancora più concentrato), corretto (con un goccio di liquore). E il cappuccino è la mattina — mai dopo un pasto: è la regola non scritta.',
      },
      {
        icon: 'glass',
        title: 'Il corretto, per finire',
        text: 'A fine pasto, il caffè corretto: un espresso « corretto » con un goccio di grappa, anice o amaro. Si chiama anche ammazzacaffè — il sorso che chiude davvero il pranzo.',
      },
      {
        icon: 'bottle',
        title: 'La moka, a casa',
        text: 'Fuori dal bar, il caffè si fa con la moka — la caffettiera che gorgoglia sul fuoco. Ogni casa ha la sua, brunita dagli anni, che non si lava mai col sapone. Il rumore e il profumo del mattino.',
      },
    ],
  },
  cultureFilter: {
    all: 'Vedi tutto',
    playlist: 'La playlist',
    screens: 'Schermi',
    painting: 'Pittura',
    sculpture: 'Scultura',
    photo: 'Foto',
    hands: 'Designer',
    songs: 'Canzoni',
  },
  regionFilter: {
    all: 'Vedi tutto',
    places: 'I luoghi',
    customs: 'Usi e costumi',
    specialties: 'Specialità',
    drinks: 'Vini & liquori',
    coffee: 'Il caffè',
    arab: 'Sicilia araba',
    sounds: 'Suoni & immagini',
    etna: 'L’Etna',
    fauna: 'La fauna',
    books: 'Libri',
    history: 'Lotte & memoria',
  },
  infoFilter: {
    all: 'Vedi tutto',
    address: 'Indirizzo',
    parking: 'Parcheggiare',
    arrival: 'Arrivo',
    move: 'Spostarsi',
    urgent: 'Emergenze',
    waste: 'Rifiuti',
    leaving: 'La partenza',
    money: 'Prelevare contanti',
    fauna: 'Pulizia',
  },
  parkingPage: {
    eyebrow: 'Parcheggiare',
    title: 'I colori sull’asfalto',
    intro: 'In Italia il colore delle strisce dice tutto, ed è lo stesso ovunque: lo fissa il codice della strada, non il comune. Bastano tre colori per cavarsela.',
    note: 'Ticket non esposto o disco dimenticato: 41 €. Il disco orario si tiene in macchina — un autonoleggio lo fornisce, altrimenti si trova in qualsiasi tabaccheria.',
    facts: [
      { couleur: '#2f6fd0', title: 'Blu — a pagamento', text: 'Si paga al parcometro, a ore, e si mette il ticket dietro il parabrezza. È quello che si trova nei centri, e sul lungomare d’estate.' },
      { couleur: '#ffffff', bord: '#d9d9d9', title: 'Bianco — gratuito', text: 'Ma leggete il cartello: alcuni stalli bianchi hanno un tempo massimo. Allora bisogna esporre il disco orario con l’ora di arrivo.' },
      { couleur: '#f2c033', title: 'Giallo — riservato', text: 'Disabili con contrassegno, carico e scarico, forze dell’ordine, a volte i residenti. Non ci si parcheggia, nemmeno cinque minuti.' },
      { couleur: '#f06a9b', title: 'Rosa — donne in gravidanza', text: 'E genitori con un bambino sotto i due anni. Ufficiale dal 2021, ma serve il permesso rilasciato dal proprio comune di residenza: di passaggio, non spetta.' },
      { couleur: '#6f8f5f', title: 'Verde — ricarica', text: 'Di solito riservato alle auto elettriche in ricarica. Non ci si ferma per altro.' },
    ],
    gardien: {
      title: 'Il posteggiatore',
      text: 'Nei parcheggi pubblici delle grandi città e dei posti molto turistici arriva spesso qualcuno a farvi posteggiare e a sorvegliare l’auto. Se sia autorizzato o no, non si sa sempre. Chiede poco, sorveglia davvero bene, e lì conviene accettare — non si sa bene cosa succeda all’auto se si dice di no. Da noi, a Cava d’Aliga, il problema non si pone: siamo lontani dai luoghi turistici.',
    },
  },
  cleanPage: {
    eyebrow: 'Pulizia',
    title: 'Tenere la casa in un paese caldo',
    intro: 'Caldo e umidità: quello che al nord passa inosservato, qui non perdona. Un piatto lasciato la sera, qualche briciola sotto il tavolo, e la mattina la fila di formiche è già lì. Niente di drammatico — solo qualche abitudine da prendere, e si prende in fretta.',
    rulesTitle: 'Le abitudini',
    rules: [
      'Niente briciole. Una scopata dopo ogni pasto, anche sotto il tavolo.',
      'Il tavolo si sparecchia e i piatti si lavano subito — non l’indomani mattina.',
      'Tutto quello che è aperto si ripone: biscotti, farina, pane, frutta, zucchero. Noi mettiamo il più possibile in frigo: è il miglior contenitore ermetico che ci sia.',
      'Pattumiera chiusa, e fuori la sera giusta. Un sacco lasciato aperto tutta la notte in cucina è l’invito più sicuro.',
      'Mai lasciare acqua ferma: sottovasi, secchi, annaffiatoio. È lì che le zanzare depongono, e da nessun’altra parte.',
      'Scuotere le scarpe lasciate fuori prima di rimetterle. Vecchia abitudine del sud, non costa nulla.',
    ],
    antsTitle: 'Le formiche',
    antsText: 'È il vero motivo di tutto quanto sopra. Non pungono e non portano nulla di grave, ma una volta che una fila ha trovato la strada dello zucchero la rifà per giorni. Non si combattono: non si dà loro niente.',
    faunaLink: 'Chi vive qui — gechi, lucertole, serpenti, scorpioni',
  },
  italianPage: {
    eyebrow: 'Imparare l’italiano',
    title: 'Parlare italiano qui',
    intro: 'Non un corso di grammatica: quanto basta per cavarsela dal primo mattino, e poi per capire quello che si dice. Prima la pronuncia, poi frasi intere, la grammatica dopo — e alla fine gli esercizi. Questa versione serve soprattutto a chi vuole rivedere le regole o aiutare qualcuno a impararle.',
    methodTitle: 'Come usarlo',
    method: 'Dieci minuti al giorno valgono più di un’ora la domenica. Leggete ad alta voce, anche da soli, anche male. Non cercate di ricordare tutto: prendete le tre frasi che vi servono oggi, usatele davvero, e tornate domani. È il principio dei metodi che funzionano, a cominciare da Assimil: lezioni brevi, frasi intere, e la regola spiegata solo quando la si dice già.',
    soundTitle: 'Prima, la pronuncia',
    soundIntro: 'Otto regole e si legge l’italiano ad alta voce senza sbagliare. L’accento tonico è segnato in maiuscolo.',
    talkTitle: 'Parlare, per situazione',
    talkIntro: 'Frasi intere, da riutilizzare così come sono. Non serve mai la parola « caffè » da sola: serve saperlo ordinare.',
    grammarTitle: 'I tre tempi',
    grammarIntro: 'Presente, passato, futuro. In quest’ordine: il presente regge quasi tutto e sostituisce perfino il futuro vicino.',
    whenLabel: 'Quando si usa',
    howLabel: 'Come si forma',
    trapLabel: 'Dove si sbaglia',
    drillTitle: 'Esercitarsi',
    drillIntro: 'Dodici esercizi, corretti subito e spiegati. Una risposta sbagliata senza spiegazione non serve a nulla.',
    check: 'Verifica',
    good: 'Esatto',
    wrong: 'Non proprio',
    next: 'Esercizio successivo',
    again: 'Ricominciare',
    score: '{n} risposte giuste su {t}',
    progress: 'Esercizio {n} di {t}',
    start: 'Iniziare gli esercizi',
  },
  booksPage: {
    eyebrow: 'Libri',
    title: 'Da leggere prima, durante, dopo',
    intro: 'Sette libri che parlano della Sicilia o che ci si svolgono — e due che raccontano quello che le famiglie di qui hanno attraversato. Niente di obbligatorio: è uno scaffale, non un programma.',
    linkLabel: 'La scheda del libro',
    list: [
      { titre: 'Una donna di Ragusa', auteur: 'Maria Occhipinti', annee: '1957', lien: 'https://it.wikipedia.org/wiki/Una_donna_di_Ragusa', text: 'Il libro di qui. Maria Occhipinti aveva ventitré anni ed era incinta di cinque mesi quando si sdraiò davanti al camion militare che portava via i ragazzi del suo quartiere, a Ragusa, il 4 gennaio 1945. Lo pagò con il confino a Ustica, dove partorì, e poi con il carcere. La sua autobiografia passò inosservata nel 1957 e fece l’effetto di una bomba alla riedizione del 1976.' },
      { titre: 'La plupart ne reviendront pas', auteur: 'Eugenio Corti', annee: '1947', lien: 'https://it.wikipedia.org/wiki/I_pi%C3%B9_non_ritornano', text: 'La scelta di Mag. Il diario di un sopravvissuto alla ritirata di Russia: ventotto giorni di accerchiamento nella neve, scritti da un ragazzo di ventidue anni che ne è uscito. Non è un libro siciliano, ma racconta quello che migliaia di famiglie di qui hanno vissuto senza dirlo — e questa casa ne sa qualcosa.' },
      { titre: 'Le parole sono pietre', auteur: 'Carlo Levi', annee: '1955', lien: 'https://it.wikipedia.org/wiki/Carlo_Levi', text: 'Tre viaggi in Sicilia, tra le zolfare, i contadini che occupano le terre e il ricordo ancora fresco di Portella della Ginestra. Il titolo dice il libro. È il racconto migliore di che cosa fu la lotta per la terra nell’isola, scritto a caldo da uno che ascoltava.' },
      { titre: 'Il Gattopardo', auteur: 'Giuseppe Tomasi di Lampedusa', annee: '1958', lien: 'https://it.wikipedia.org/wiki/Il_Gattopardo', text: 'Il grande romanzo siciliano, scritto da un principe alla fine della sua vita e rifiutato da due editori prima di diventare un classico. La Sicilia del 1860, un mondo che crolla e una frase che tutti citano: « se vogliamo che tutto rimanga come è, bisogna che tutto cambi ».' },
      { titre: 'Il giorno della civetta', auteur: 'Leonardo Sciascia', annee: '1961', lien: 'https://it.wikipedia.org/wiki/Il_giorno_della_civetta', text: 'Il libro che ha dato un nome a ciò di cui non si parlava. Un capitano venuto dal Nord indaga su un omicidio in un paese siciliano e sbatte contro un muro di silenzio. Sciascia scriveva quando l’esistenza stessa della mafia era ufficialmente in discussione.' },
      { titre: 'Conversazione in Sicilia', auteur: 'Elio Vittorini', annee: '1941', lien: 'https://it.wikipedia.org/wiki/Conversazione_in_Sicilia', text: 'Un uomo torna a trovare sua madre in Sicilia dopo quindici anni. Pubblicato sotto il fascismo, il libro dice tutto senza nominare mai nulla — per questo passò la censura, e per questo contò.' },
      { titre: 'I Malavoglia', auteur: 'Giovanni Verga', annee: '1881', lien: 'https://it.wikipedia.org/wiki/I_Malavoglia', text: 'Una famiglia di pescatori, una barca, un debito, e il mare che si riprende tutto. Verga scrive i poveri senza compatirli né abbellirli: è la Sicilia di prima delle fotografie, quella dei paesi di costa.' },
    ],
  },
  historyPage: {
    eyebrow: 'Lotte & memoria',
    title: 'Che cosa è successo qui',
    intro: 'Si viene in Sicilia per il barocco e per il mare, e si riparte senza sapere che la provincia di Ragusa ha conosciuto una delle rivolte più dimenticate della storia italiana. Ecco di che si tratta — e perché i vecchi di qui non raccontano tutto.',
    linkLabel: 'Per saperne di più',
    note: 'Questa pagina non prende posizione: racconta quello che è successo, nel posto in cui è successo. I libri qui sopra vanno molto più lontano di noi, e chi l’ha vissuto li ha scritti di persona.',
    facts: [
      { icon: 'landmark', lien: 'https://it.wikipedia.org/wiki/Fasci_siciliani', title: 'I Fasci siciliani, 1891-1894', text: 'Prima dei partiti ci furono i fasci: leghe di contadini, zolfatari e artigiani, fino a trecentomila iscritti in un’isola miserabile. Chiedevano contratti, terre, la fine degli abusi. Il governo Crispi — un siciliano — rispose con lo stato d’assedio nel gennaio 1894, con i morti e i tribunali militari. È il primo grande movimento sociale dell’Italia unita, ed è nato qui.' },
      { icon: 'walk', lien: 'https://it.wikipedia.org/wiki/Nonsiparte', title: '« Non si parte! » — gennaio 1945, proprio qui', text: 'La guerra finisce al nord, e Roma richiama i giovani siciliani sotto le armi. L’isola rifiuta. La rivolta esplode più forte nella provincia di Ragusa: il 4 gennaio 1945 l’esercito rastrella i quartieri popolari per portare via i ragazzi. È la rivolta antimilitarista più dimenticata della storia italiana — ed è successa a pochi chilometri da questa casa.' },
      { icon: 'compass', lien: 'https://it.wikipedia.org/wiki/Prigionieri_di_guerra_italiani_in_Unione_Sovietica', title: 'I campi russi: quelli che non sono tornati', text: 'Dicembre 1942, sul Don: l’Armata italiana in Russia viene annientata. Chi sopravvive parte a piedi verso i campi, centinaia di chilometri nella neve — i sopravvissuti le hanno chiamate le marce del « davaj », dalla parola russa che veniva urlata per farli camminare. Ventiduemila muoiono lungo la strada. Cinquantaquattromila arrivano vivi nei campi, dalla Russia europea fino alla Siberia; quarantaquattromila vi muoiono, i più già nell’inverno del 1943. Diecimila torneranno, tra il 1945 e il 1954 — gli ultimi ufficiali, condannati ai lavori forzati con accuse che si riveleranno false, sono liberati solo dopo la morte di Stalin. Questa casa lo sa di prima mano: Angelo, il padre di Salvatore, è tornato da quei campi.' },
      { icon: 'info', lien: 'https://it.wikipedia.org/wiki/Maria_Occhipinti', title: 'La donna che si sdraiò davanti al camion', text: 'Maria Occhipinti, ventitré anni, incinta di cinque mesi, si sdraia davanti al camion militare che porta via i ragazzi del suo quartiere. I soldati sparano sulla folla. Sarà confinata a Ustica, dove partorisce, e poi incarcerata a Palermo. Poiché il Partito comunista condannò la rivolta, ruppe con esso e finì anarchica. Ha raccontato tutto lei stessa — vedi i libri.' },
      { icon: 'home', lien: 'https://it.wikipedia.org/wiki/Nonsiparte', title: 'La « Repubblica di Comiso », sei giorni', text: 'A Comiso, a venti chilometri da qui, gli insorti fanno prigionieri i carabinieri il 5 e 6 gennaio e proclamano un governo popolare: comitato di salute pubblica, squadre per l’ordine, distribuzione di viveri a prezzo di consorzio. Dura sei giorni. L’11 gennaio, sotto la minaccia di un bombardamento alleato sulla città, trattano la resa.' },
      { icon: 'cone', lien: 'https://it.wikipedia.org/wiki/Portella_della_Ginestra', title: 'Portella della Ginestra, 1º maggio 1947', text: 'Due anni dopo, la sinistra vince le elezioni regionali siciliane. Il 1º maggio alcune famiglie festeggiano il lavoro in un valico sopra Piana degli Albanesi; la banda del bandito Giuliano spara sulla folla. Undici morti, tra cui dei bambini. È la prima strage politica della Repubblica italiana, e non è mai stata chiarita del tutto.' },
    ],
  },
  faunaPage: {
    eyebrow: 'La fauna',
    title: 'Chi vive qui',
    intro: 'Gli animali che si incontrano davvero nel sud-est della Sicilia — e quello che cambiano, cioè quasi nulla. I gechi del muro, le lucertole tra le pietre, e due reputazioni da rimettere a posto.',
    facts: [
      {
        icon: 'leaf',
        title: 'I gechi',
        text: 'Le tarantoline chiare che attraversano il muro la sera, ferme intorno alle lampade. Non mordono, non si avvicinano, non salgono sui letti — e passano la notte a mangiare zanzare. Sono i migliori coinquilini della casa: lasciateli in pace.',
      },
      {
        icon: 'walk',
        title: 'Le lucertole',
        text: 'Sfrecciano tra le pietre al sole e spariscono appena ci si avvicina. Del tutto innocue, e qui da molto prima di noi.',
      },
      {
        icon: 'droplet',
        title: 'Le zanzare',
        text: 'Pungono soprattutto all’alba e al tramonto, e la zanzara tigre, presente in Sicilia, punge anche in pieno giorno. Nascono nell’acqua ferma — bastano pochi centimetri in un sottovaso. Svuotare ciò che trattiene l’acqua funziona meglio di qualsiasi spray.',
      },
      {
        icon: 'info',
        title: 'I serpenti: rari, ma esistono',
        text: 'In paese non se ne vedono, e quasi mai vicino alle case. Ma in Sicilia vivono diverse specie, e una è velenosa: la vipera (Vipera aspis hugyi), che sta nella campagna secca e pietrosa. Fugge prima ancora che la si veda. In escursione: scarpe chiuse e attenzione a dove si mettono le mani. In caso di morso: si chiamano i soccorsi e si immobilizza l’arto — mai laccio, mai incisione, mai suzione.',
      },
      {
        icon: 'target',
        title: 'Gli scorpioni: presenti, e innocui',
        text: 'Lo scorpione siciliano (Euscorpius sicanus) è piccolo, scuro, notturno, e si nasconde sotto le pietre o i vasi. È timidissimo e punge di rado; la puntura fa l’effetto di un’ortica o di un’ape, senza pericolo. Da qui l’abitudine di scuotere le scarpe.',
      },
    ],
    note: 'Non diciamo « qui non c’è niente »: sarebbe rassicurante e falso. Diciamo che cosa vive qui e che cosa cambia davvero — cioè quasi nulla, a patto di tenere la cucina pulita.',
  },
  notFoundPage: {
    eyebrow: 'Errore 404',
    title: 'Questa pagina non esiste',
    text: 'Un link si è rotto da qualche parte, oppure l’indirizzo è stato ricopiato male. Non è niente di grave, e non è colpa vostra. Ecco da dove ripartire.',
    definition: '404: il browser ha raggiunto il server, ma il server non ha trovato quello che gli veniva chiesto.',
    home: 'Torna alla home',
    elsewhere: 'Oppure andate direttamente da qualche parte',
  },
  cashPage: {
    eyebrow: 'Prelevare contanti',
    title: 'Dove trovare un Bancomat',
    intro: 'A Donnalucata ci sono due sportelli automatici.',
    spots: [
      {
        title: 'Banca Agricola Popolare di Sicilia',
        where: 'Via Miccichè 23, Donnalucata',
        text: 'La filiale del paese. Lo sportello è sulla facciata, accessibile negli orari di apertura e spesso anche oltre.',
        label: 'Apri in Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=Banca+Agricola+Popolare+di+Sicilia+Via+Miccich%C3%A8+23+Donnalucata+Scicli+RG',
      },
      {
        title: 'L’ufficio postale — Postamat',
        where: 'Via Casmene, Donnalucata',
        text: 'Le Poste hanno il proprio sportello, il Postamat. Accetta le carte straniere come qualsiasi Bancomat e salva la giornata quando la banca è chiusa.',
        label: 'Apri in Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=Poste+Italiane+Via+Casmene+Donnalucata+Scicli+RG',
      },
    ],
    note: 'Gli indirizzi sono certi, ma che un apparecchio funzioni proprio quel giorno nessuno può prometterlo — per questo ne indichiamo due e non uno. Tenete un po’ di contanti da parte: molti piccoli negozi, e il mercato, prendono solo quelli.',
  },
  quizPage: {
    eyebrow: 'Piccolo gioco',
    title: 'Conoscete la regione?',
    intro: 'Per tema, o tutto mescolato. Tre risposte possibili ogni volta, e tutto quello che serve sapere è scritto più su in questa pagina — ogni risposta vi dice dove rileggere.',
    start: 'Iniziare',
    next: 'Domanda successiva',
    check: 'Conferma',
    back: 'Domanda precedente',
    seeSection: 'Rileggere il passaggio',
    good: 'Esatto',
    wrong: 'Sbagliato',
    progress: 'Domanda {n} di {t}',
    scoreTitle: 'Finito',
    scoreLine: '{n} risposte giuste su {t}',
    again: 'Rigiocare',
    allThemes: 'Tutti i temi',
    empty: 'Nessuna domanda con questi filtri — allargate un po’.',
    pick: 'Scegliete un tema, oppure partite su tutto.',
    questions: [
      { q: 'Da dove viene il nome « Cava d’Aliga »?', choix: ['Dalle alghe — « aliga » in siciliano', 'Da un’antica cava di pietra', 'Dal nome di un santo locale'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Quale serie televisiva ha scelto Scicli come set?', choix: ['Il commissario Montalbano', 'Il Gattopardo', 'Gomorra'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Dopo quale terremoto il Val di Noto è stato ricostruito in barocco?', choix: ['Quello del 1693', 'Quello del 1908', 'Quello del 1542'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'La Fornace Penna, sul promontorio di Sampieri, era…', choix: ['Una fornace di mattoni', 'Un faro', 'Una tonnara'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Di quale città greca fu rivale Siracusa?', choix: ['Atene', 'Sparta', 'Corinto'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Dove si trova l’Orecchio di Dionisio?', choix: ['A Siracusa', 'A Ragusa', 'A Noto'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Dei dieci luoghi di questa pagina, quanti sono patrimonio UNESCO?', choix: ['Cinque', 'Due', 'Tutti e dieci'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Dove si trova la Torre Cabrera, torre di guardia del Cinquecento?', choix: ['A Marina di Ragusa', 'A Sampieri', 'A Donnalucata'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Come chiamano l’Etna i siciliani?', choix: ['A Muntagna', 'Il Vulcano', 'La Signora'], bonne: 0, ancre: 'etna', niveau: 'facile' },
      { q: 'Si può sciare sull’Etna?', choix: ['Sì, su due comprensori', 'No, fa troppo caldo', 'Sì, ma un solo mese all’anno'], bonne: 0, ancre: 'etna', niveau: 'facile' },
      { q: 'Che cosa raccoglievano i nivaroli sull’Etna?', choix: ['La neve', 'Lo zolfo', 'La lava raffreddata'], bonne: 0, ancre: 'etna', niveau: 'moyen' },
      { q: 'Quale scoperta ha trasformato la neve in refrigerante?', choix: ['Mescolarla con il sale marino', 'Pressarla in blocchi', 'Coprirla di paglia'], bonne: 0, ancre: 'etna', niveau: 'moyen' },
      { q: 'Come si chiamavano le fosse di pietra dove si conservava la neve?', choix: ['Le neviere', 'Le cisterne', 'Le gebbie'], bonne: 0, ancre: 'etna', niveau: 'difficile' },
      { q: 'Da quando l’Etna è patrimonio mondiale UNESCO?', choix: ['Dal 2013', 'Dal 1993', 'Dal 2021'], bonne: 0, ancre: 'etna', niveau: 'difficile' },
      { q: 'In che anno gli arabi sbarcano in Sicilia?', choix: ['Nell’827', 'Nel 1091', 'Nel 1492'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'Che cosa significa « Donnalucata »?', choix: ['La fonte delle ore', 'La dama del lago', 'Il porto dei pesci'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'I nomi che iniziano per « Calta- » vengono da qal‘at. Significa…', choix: ['La fortezza', 'Il fiume', 'Il mercato'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Marsala viene da « marsa ». Che cosa vuol dire?', choix: ['Il porto', 'La montagna', 'Il ponte'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Chi descrive la fonte di Donnalucata nel XII secolo?', choix: ['Il geografo al-Idrisi', 'L’emiro Belcane', 'Il conte Ruggero'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'La festa della Madonna delle Milizie rievoca una battaglia di quale anno?', choix: ['1091', '827', '1693'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'In dialetto, la « zàgara » è…', choix: ['Il fiore d’arancio', 'Il canale d’irrigazione', 'La vasca'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Come si chiama il dolce della festa di Scicli?', choix: ['La testa di turco', 'Il cannolo', 'La cassata'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'La vera colazione siciliana d’estate è…', choix: ['Una granita e una brioche', 'Un cappuccino e un cannolo', 'Pane e olio d’oliva'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'A Palermo si dice…', choix: ['Arancina, al femminile', 'Arancino, al maschile', 'Né l’uno né l’altro'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'La passeggiata, verso che ora?', choix: ['Verso le 19, quando cala il caldo', 'A mezzogiorno in punto', 'All’alba'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'La brioche della colazione si chiama…', choix: ['La brioche col tuppo', 'La brioche col nodo', 'La brioche della nonna'], bonne: 0, ancre: 'coutumes', niveau: 'moyen' },
      { q: 'Chi ha risolto la disputa arancina / arancino?', choix: ['L’Accademia della Crusca', 'Il sindaco di Palermo', 'Nessuno, dura ancora'], bonne: 0, ancre: 'coutumes', niveau: 'difficile' },
      { q: 'Il cioccolato di Modica è lavorato…', choix: ['A freddo, lo zucchero resta in grani', 'Ad altissima temperatura', 'Con burro di cacao aggiunto'], bonne: 0, ancre: 'specialites', niveau: 'facile' },
      { q: 'La scaccia ragusana è…', choix: ['Una sfoglia di pane sottile arrotolata sul ripieno', 'Una pizza alta', 'Una frittella dolce'], bonne: 0, ancre: 'specialites', niveau: 'facile' },
      { q: 'Che cosa nascondono gli ’mpanatigghi di Modica?', choix: ['Carne di manzo', 'Ricotta', 'Fichi secchi'], bonne: 0, ancre: 'specialites', niveau: 'moyen' },
      { q: 'Le teste di turco di Scicli sono farcite…', choix: ['Di ricotta o di crema', 'Di cioccolato di Modica', 'Di carne macinata'], bonne: 0, ancre: 'specialites', niveau: 'moyen' },
      { q: 'Il caciocavallo ragusano si stagiona…', choix: ['A parallelepipedo, appeso a una corda', 'In forma tonda', 'In piccole palle sott’olio'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'La cubbaita è un torrone duro a base di…', choix: ['Sesamo e miele', 'Mandorle e zucchero a velo', 'Pistacchio e cioccolato'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'Da quando l’Antica Dolceria Bonajuto fa cioccolato?', choix: ['Dal 1880', 'Dal 1950', 'Dal 1720'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'Qual è l’unica DOCG di tutta la Sicilia?', choix: ['Il Cerasuolo di Vittoria', 'Il nero d’avola', 'Il marsala'], bonne: 0, ancre: 'alcools', niveau: 'facile' },
      { q: 'Il Cerasuolo di Vittoria unisce due vitigni. Quali?', choix: ['Nero d’avola e frappato', 'Frappato e grillo', 'Nero d’avola e syrah'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Da dove prende il nome il nero d’avola?', choix: ['Dalla città di Avola', 'Da un vitigno greco', 'Dal colore della terra'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Il marsala viene da quale parte della Sicilia?', choix: ['Dall’ovest dell’isola', 'Dalle pendici dell’Etna', 'Dai monti Iblei'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Quale amaro siciliano è nato a Caltanissetta?', choix: ['L’Averna', 'Il Fernet', 'Il Cynar'], bonne: 0, ancre: 'alcools', niveau: 'difficile' },
      { q: 'Il frappato in purezza dà un vino…', choix: ['Rosso chiaro, servito fresco', 'Bianco e minerale', 'Rosso molto tannico'], bonne: 0, ancre: 'alcools', niveau: 'difficile' },
      { q: 'Al bar, un « caffè corretto » è un espresso…', choix: ['Con un goccio di liquore', 'Con molto latte', 'Servito con un bicchiere d’acqua'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'Quando si beve il cappuccino?', choix: ['La mattina, mai dopo i pasti', 'Dopo cena', 'A qualsiasi ora'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'A casa, il caffè si fa…', choix: ['Con la moka, sul fuoco', 'Con la macchina a filtro', 'Con la french press'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'Che cosa vuol dire « ristretto »?', choix: ['Ancora più concentrato', 'Allungato', 'Con una goccia di latte'], bonne: 0, ancre: 'cafe', niveau: 'moyen' },
      { q: 'Il caffè freddo siciliano è spesso addolcito…', choix: ['Con il latte di mandorla', 'Con lo sciroppo di canna', 'Con il miele'], bonne: 0, ancre: 'cafe', niveau: 'moyen' },
      { q: 'Che cos’è l’« ammazzacaffè »?', choix: ['Il corretto che chiude il pasto', 'Un dolce al caffè', 'Una tazza molto grande'], bonne: 0, ancre: 'cafe', niveau: 'difficile' },
      { q: 'Che cosa mangiano i gechi che attraversano il muro la sera?', choix: ['Le zanzare', 'Le briciole', 'Niente, dormono'], bonne: 0, ancre: 'faune', niveau: 'facile' },
      { q: 'Ci sono scorpioni in Sicilia?', choix: ['Sì, ma la loro puntura è innocua', 'No, nessuno', 'Sì, e sono mortali'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Dove nascono le zanzare?', choix: ['Nell’acqua ferma, bastano pochi centimetri', 'Nelle siepi secche', 'Sotto le pietre calde'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Qual è l’unico serpente velenoso della Sicilia?', choix: ['La vipera aspide', 'Il biacco', 'Non ce n’è nessuno'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'Che cosa NON si deve assolutamente fare in caso di morso di vipera?', choix: ['Mettere un laccio o incidere', 'Chiamare i soccorsi', 'Immobilizzare l’arto'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'Dove è documentata la prima pasta secca d’Europa?', choix: ['In Sicilia, a Trabia', 'A Napoli', 'In Cina, portata da Marco Polo'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'Come si chiamavano quei fili di semola descritti nel 1154?', choix: ['Itriyya', 'Maccheroni', 'Tagliatelle'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Chi ha scritto la più antica testimonianza della pasta secca d’Europa?', choix: ['Al-Idrisi, nel Libro di Ruggero', 'Marco Polo', 'Plinio il Vecchio'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Da dove viene il colore dorato dell’arancina?', choix: ['Dallo zafferano, portato dagli arabi', 'Dalla curcuma', 'Dal pangrattato'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Come si chiama il capo di una tonnara?', choix: ['Il raìs', 'Il padrone', 'Il capitano'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'La cubbaita prende il nome dall’arabo…', choix: ['Qubbayt', 'Zabīb', 'Sāqiya'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Lo sfincione palermitano prenderebbe il nome dall’arabo…', choix: ['Isfanǧ, la pasta fritta', 'Sifr, lo zero', 'Sukkar, lo zucchero'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'In quali città siciliane si mangia ancora il cuscus?', choix: ['Trapani e San Vito Lo Capo', 'Catania e Siracusa', 'Modica e Scicli'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Che cosa c’è nella pasta con le sarde?', choix: ['Finocchietto selvatico, uvetta, pinoli e zafferano', 'Panna e pancetta', 'Solo pomodoro e basilico'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'Che cosa caratterizza la caponata?', choix: ['L’agrodolce: aceto e zucchero', 'Il peperoncino forte', 'La cottura a legna'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'La frutta martorana è fatta di…', choix: ['Pasta di mandorle', 'Pasta di zucchero', 'Cioccolato di Modica'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'La cassata prenderebbe il nome da qas‘ah, che indica…', choix: ['La scodella in cui la si modellava', 'La ricotta', 'Una festa religiosa'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Nel gennaio 1945, dove è esplosa più forte la rivolta del « Non si parte! »?', choix: ['Nella provincia di Ragusa', 'A Palermo', 'In Calabria'], bonne: 0, ancre: 'histoire', niveau: 'facile' },
      { q: 'Contro che cosa insorgono i siciliani nel gennaio 1945?', choix: ['Contro la chiamata alle armi dei giovani', 'Contro il prezzo del pane', 'Contro la chiusura delle miniere'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'Che cosa ha fatto Maria Occhipinti, incinta di cinque mesi, il 4 gennaio 1945?', choix: ['Si è sdraiata davanti al camion militare', 'Ha nascosto i ragazzi in cantina', 'Ha scritto al prefetto'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'Quanto è durata la « Repubblica di Comiso »?', choix: ['Sei giorni', 'Sei settimane', 'Sei mesi'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Che cos’erano i Fasci siciliani del 1891-1894?', choix: ['Leghe di contadini, zolfatari e artigiani', 'Un partito fascista ante litteram', 'Una confraternita religiosa'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Che cosa è successo a Portella della Ginestra il 1º maggio 1947?', choix: ['Una sparatoria sulla folla del Primo Maggio', 'Un’eruzione dell’Etna', 'Uno sciopero generale'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Chi ha scritto « Una donna di Ragusa »?', choix: ['Maria Occhipinti', 'Leonardo Sciascia', 'Elio Vittorini'], bonne: 0, ancre: 'livres', niveau: 'facile' },
      { q: '« I più non ritornano » racconta…', choix: ['La ritirata di Russia', 'Lo sbarco alleato in Sicilia', 'La costruzione dell’autostrada'], bonne: 0, ancre: 'livres', niveau: 'moyen' },
      { q: 'In quale libro si trova « bisogna che tutto cambi perché nulla cambi »?', choix: ['Il Gattopardo', 'I Malavoglia', 'Conversazione in Sicilia'], bonne: 0, ancre: 'livres', niveau: 'moyen' },
      { q: 'Di che cosa parla « Il giorno della civetta » di Sciascia?', choix: ['Della mafia, quando se ne negava l’esistenza', 'Della pesca al tonno', 'Del terremoto del 1693'], bonne: 0, ancre: 'livres', niveau: 'difficile' },
      { q: '« Le parole sono pietre » di Carlo Levi racconta…', choix: ['Tre viaggi in Sicilia e la lotta per la terra', 'Un soggiorno a Venezia', 'La storia del cioccolato di Modica'], bonne: 0, ancre: 'livres', niveau: 'difficile' },
      { q: 'Come chiamavano i sopravvissuti le marce verso i campi russi?', choix: ['Le marce del « davaj »', 'Le marce bianche', 'Le marce del Don'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'Dei prigionieri italiani nei campi sovietici, quanti sono tornati?', choix: ['Circa diecimila', 'Quasi tutti', 'Nessuno'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Quando sono stati liberati gli ultimi prigionieri italiani in Russia?', choix: ['Nel 1954, dopo la morte di Stalin', 'Nel 1945, a fine guerra', 'Nel 1948'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
    ],
  },
  askMag: {
    text: 'Qui non abbiamo ancora l’informazione. Scrivete a Mag: vi risponde, e noi la aggiungiamo per i prossimi.',
    textFor: 'Per {what}: qui non abbiamo ancora l’informazione. Scrivete a Mag, vi risponde — e noi la aggiungiamo per i prossimi.',
    cta: 'Scrivi a Mag',
    subject: 'Una domanda dal sito',
  },
  assistant: {
    label: 'Chiedere',
    title: 'Una domanda?',
    placeholder: 'La password del wifi, la valvola dell’acqua, una pizza…',
    send: 'Cerca',
    suggestions: ['L’indirizzo', 'Aprire l’acqua', 'Password del wifi', 'Prima di partire', 'Rifiuti stasera?', 'Una pizza?', 'Del pane?', 'Emergenze'],
    sourceLabel: 'Vedi la pagina',
    alsoTitle: 'Anche',
    noneTitle: 'Non trovo.',
    noneText: 'Niente nel sito risponde a questo — e preferisco dirlo piuttosto che inventare. Scrivete a Mag: vi risponde, e noi lo aggiungiamo per i prossimi.',
    close: 'Chiudi',
    clear: 'Cancella',
  },
  wastePage: {
    eyebrow: 'Raccolta differenziata',
    title: 'Quale pattumiera, quale sera',
    intro: 'A Cava d’Aliga ogni tipo di rifiuto ha il suo giorno. I bidoni si mettono fuori la sera prima: il camion passa presto.',
    today: 'Stasera',
    tomorrow: 'Domani sera',
    noneToday: 'Niente da mettere fuori',
    eveningNote: 'I bidoni si mettono fuori la sera, non la mattina — il camion è già passato. Se saltate il passaggio prima di partire, lasciate i sacchi sulla terrazza, mai in strada.',
    changeNote: 'Questi giorni li ha rilevati Mag, e cambiano: il comune li modifica per le feste, d’estate, o quando cambia ditta. Un bidone portato fuori la sera sbagliata resta lì una settimana — al minimo dubbio guardate la pagina ufficiale, e avvisate Mag se non dice più quello che diciamo noi.',
    officialLabel: 'Il calendario ufficiale del comune',
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
      title: 'I nostri indirizzi',
      intro: 'Negozi, ristoranti, mercati e contatti utili: i nostri consigli personali per vivere Cava d’Aliga come a casa.',
    },
    'la-region': {
      eyebrow: 'La regione',
      title: 'Scoprire il sud-est della Sicilia',
      intro: 'Scicli, Ragusa, il barocco del Val di Noto, le spiagge e la campagna degli Iblei.',
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
        icon: '⛴️',
        title: 'Venire in auto',
        links: [
          { label: 'GNV — Genova ↔ Palermo', url: 'https://www.gnv.it/it/destinazioni-traghetti/sicilia/genova-palermo' },
          { label: 'Caronte & Tourist — la traversata dello Stretto', url: 'https://www.carontetourist.it/' },
        ],
        items: [
          'La nave da Genova — di gran lunga la più riposante. GNV parte la sera, la traversata dura una ventina d’ore e si sbarca a Palermo l’indomani, con l’auto carica e tutta la strada già alle spalle. Restano circa 3 h fino a casa.',
          'Scendere lungo lo Stivale — si guida fino in Calabria e ci si imbarca per Messina. Attenzione: il traghetto non parte da Reggio Calabria ma da Villa San Giovanni, qualche chilometro prima, dove finisce l’autostrada. La traversata dura una ventina di minuti, senza prenotazione, e poi restano circa 3 h di strada.',
          'Tra le due è una questione di stanchezza: Genova costa una notte in cabina e vi risparmia tutto il Sud Italia al volante.',
        ],
      },
      {
        icon: '🚗',
        title: 'Raggiungere Casa Cava d’Aliga',
        links: [
          { label: 'AST — orari', url: 'http://www.aziendasicilianatrasporti.it:8080/' },
          { label: 'Trenitalia', url: 'https://www.trenitalia.com/' },
          { label: 'Goldcar', url: 'https://www.goldcar.es/' },
        ],
        items: [
          'Bus AST — dall’aeroporto di Catania verso Modica, Scicli, Donnalucata e Pozzallo.',
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
      { icon: 'drop', title: 'Acqua', items: ['Per aprire l’acqua: la valvola è in lavanderia, sul retro, sul muro tra la lavatrice e il lavello. La chiave della lavanderia è lì vicino, nel mobiletto a cassetti della credenza del salotto.', 'Lo scaldabagno è in bagno, dentro la doccia.'] },
      { icon: 'bottle', title: 'Non bere l’acqua del rubinetto', items: ['Non si beve, e non si usa nemmeno per il ghiaccio. L’acqua da bere si compra in bottiglia — la vendono tutti i supermercati della zona, a confezioni.', 'Per tutto il resto va benissimo: cucinare, la pasta, il caffè, lavare frutta e verdura, i piatti e la doccia.'] },
      { icon: 'flame', title: 'Gas', items: ['Mormina Gas, Via Tolstoj — vende le bombole, consegna a domicilio e ripara le cucine. I contatti sono più sotto.'] },
      { icon: 'signal', title: 'Wifi', items: ['Rete: cacestlaissetomber', 'Password: jamonito', 'Il wifi funziona con un sistema di ricarica: contattatemi prima del vostro arrivo così lo ricarico.'] },
      { icon: 'key', title: 'Lavanderia', items: ['La chiave della lavanderia è nel mobiletto a cassetti, dentro la credenza del salotto. È in vista, si trova subito.'] },
      { icon: 'box', title: 'Le lenzuola', items: ['Sono nel cassetto dell’armadio, nella cameretta.'] },
      { icon: 'sun', title: 'Niente aria condizionata', items: ['La casa non ce l’ha — meglio saperlo prima di arrivare ad agosto. Si tiene fresca all’antica: persiane chiuse nelle ore calde, e tutto aperto la sera quando gira l’aria.'] },
      { icon: 'leaf', title: 'Annaffiare le piante', items: ['Un’annaffiatura ogni tre o quattro giorni, circa 3 litri a pianta.', 'Due gelsomini — uno davanti, uno dietro — e due bougainvillee dietro. Tutte le altre piante della casa seguono lo stesso ritmo.'] },
      { icon: 'wave', title: 'La doccia in spiaggia', items: ['Tornando dal mare, fate la doccia sul bordo della spiaggia. La sabbia che ci si porta addosso finisce nelle tubature — ed è così che nascono i problemi idraulici.'] },
    ],
  },
  depart: {
    eyebrow: 'Partenza',
    title: 'Lasciare la casa in tutta serenità',
    intro: 'La piccola check-list da spuntare prima di chiudere la porta.',
    checklistTitle: 'Prima di chiudere la porta',
    checklistNote: 'Spuntate man mano — non viene salvato nulla, serve solo a non dimenticare niente.',
    checklist: [
      'Chiudere l’acqua: la valvola in strada, all’angolo scendendo a destra — perpendicolare = chiusa.',
      'Staccare l’elettricità: gli interruttori fuori, sulla terrazza davanti, a destra della porta.',
      'Chiudere la bombola del gas.',
      'Svuotare il frigo, staccarlo e lasciare lo sportello socchiuso perché non faccia muffa.',
      'Portare fuori i rifiuti secondo la raccolta del giorno. Passaggio mancato? Lasciateli sulla terrazza, mai in strada.',
      'Ritirare in casa il telo dell’amaca, la panchetta di legno e gli sgabelli di legno. Niente di legno passa l’inverno all’aperto — resta fuori solo la struttura dell’amaca.',
      'Chiudere persiane e finestre.',
      'Lavare la biancheria prima di partire — lenzuola e asciugamani usati — e rifare i letti per chi arriva dopo. Le lenzuola pulite sono nel cassetto dell’armadio della cameretta.',
      'Ancora umida al momento di chiudere? Lasciatela stesa da qualche parte in casa, mai piegata nel cesto.',
      'Ultimo giro: caricabatterie, bagno, terrazza, sotto i letti.',
      'Rimettere la chiave della lavanderia nel mobiletto a cassetti, dentro la credenza del salotto — è lì che la si cercherà.',
      'Chiudere a chiave e rimettere le chiavi al loro posto.',
    ],
  },
};

const EN: Dict = {
  nav: {
    '/famille': 'The family',
    '/la-region': 'The region',
    '/preparer-le-voyage': 'The trip',
    '/informations-pratiques': 'Practical info',
    '/services-locaux': 'Our spots',
    '/evenements': 'Events',
  },
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
  ctaTitles: {
    '/famille': 'Family memories',
    '/la-region': 'Discover the region',
    '/preparer-le-voyage': 'Plan the trip properly',
    '/informations-pratiques': 'All the practical info',
    '/services-locaux': 'Our spots',
    '/evenements': 'The calendar of upcoming events',
  },
  tasteOfSicily: 'A taste of Sicily',
  sunsetAlt: 'Sunset over the beach, the sea and the village at dusk',
  apartment: { eyebrow: 'The home', title: 'La casa', albumAlt: 'La casa in Cava d’Aliga', captions: ['The front terrace', 'The back terrace', 'The hammock', 'The living room', 'The kitchen', 'The small bedroom', 'The small bedroom', 'The large bedroom', 'The bathroom', 'The bathroom', 'The bathroom', 'The shower'], rooms: ['The front terrace', 'The back terrace', 'The living room', 'The kitchen', 'The small bedroom', 'The large bedroom', 'The bathroom'], label: 'La casa', ctaTitle: 'Visit la casa' },
  casaPeek: { eyebrow: 'La casa', title: 'The home in photos', link: 'See every room' },
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
  etnaPage: {
    eyebrow: 'Etna',
    title: 'A Muntagna',
    intro:
      'Sicilians don’t say « Etna ». They say a Muntagna, the Mountain, as though there were only one — and for them there is only one. Two and a half hours’ drive from the house, it smokes, it rumbles, it sometimes dusts the cars with ash, and it gave Sicily its black earth, its wine… and, for centuries, its ice.',
    facts: [
      {
        icon: 'volcano',
        title: 'Europe’s highest active volcano',
        text:
          'A little over 3,300 metres — the figure changes with every eruption, as the mountain builds itself up and collapses again, so no altitude stays true for long. It is almost permanently active, and a UNESCO World Heritage site since June 2013.',
      },
      {
        icon: 'compass',
        title: 'You can ski there, facing the sea',
        text:
          'Two ski areas, one on each side. Etna Sud, above Nicolosi, runs from 1,910 to 2,700 metres ; Etna Nord, at Piano Provenzana above Linguaglossa, from 1,800 to 2,340 metres. Skiing on black ash with the Ionian Sea below : it happens nowhere else.',
      },
      {
        icon: 'droplet',
        title: 'The nivaroli and the neviere',
        text:
          'From the Middle Ages, men climbed up to harvest snow in winter and buried it in stone pits — the neviere — insulated under volcanic ash, ferns and straw. Come summer they carried it back down by mule, in jute sacks. Sicily was among Europe’s great ice producers until the eighteenth century.',
      },
      {
        icon: 'cone',
        title: 'From snow to granita',
        text:
          'That grated snow, doused with lemon juice or fruit syrup, is granita’s direct ancestor. Then came the discovery that snow mixed with sea salt chills without blending in : it went from ingredient to refrigerant, and the granita we eat today — the breakfast one, with the brioche — was born of that shift.',
      },
    ],
    linkPark: 'Etna Park, a UNESCO site',
    linkTours: 'Guided Etna excursions',
    linkToursUrl: 'https://etnaway.com/',
    linkSki: 'Etna’s ski areas',
    photoAlt: 'Etna',
  },
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
      {
        icon: 'fork',
        title: 'Europe’s first dried pasta was Sicilian',
        text: 'And the same al-Idrisi wrote it down. In 1154, in the Book of Roger, he describes mills at Trabia — near Palermo — making threads of semolina called itriyya, in such quantity that it was exported everywhere, to Muslim and Christian lands alike. It is the earliest known record of dried pasta being produced in Europe: three centuries before the Marco Polo stories, and eighty kilometres from here.',
      },
      {
        icon: 'citrus',
        title: 'Rice, saffron — and therefore the arancina',
        text: 'Rice and saffron arrived with the Arabs. A ball of saffron rice, breadcrumbed and fried, is exactly what they cooked — and the golden colour of the arancina comes from that. Palermo’s sfincione is thought to take its very name from Arabic isfanǧ, fried dough.',
      },
      {
        icon: 'cleaver',
        title: 'Sweet-and-sour: a signature that never faded',
        text: 'Pasta with sardines — sardines, wild fennel, raisins, pine nuts, saffron — puts the fish of this coast and the dried fruit of the East on the same plate. Caponata strikes the same sweet-sour chord, with vinegar and sugar. Nowhere else in Italy is food cooked this way: it is the most recognisable trace of two Arab centuries.',
      },
      {
        icon: 'cone',
        title: 'The pastry: almond, sugar, ricotta',
        text: 'Cane sugar arrived with them, and with it the whole of Sicilian confectionery. Pasta reale — the almond paste of the frutta martorana — descends directly from Arab marzipan. Cubbaita, the sesame-and-honey nougat, keeps its name from Arabic qubbayt. And cassata is thought to take its own from qas‘ah, the bowl it was shaped in.',
      },
      {
        icon: 'wave',
        title: 'Even at sea, the words are Arabic',
        text: 'The head of a tonnara — a tuna fishery — is the raìs, from Arabic raʾīs, the chief. The whole vocabulary of tuna fishing kept its Arabic words, and Sicily’s tonnare worked that way into the twentieth century. In Trapani and San Vito Lo Capo they still eat couscous — with fish.',
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
    siteLabel: 'Official site',
    walkLabel: 'Walkable from here',
    closeLabel: 'Close',
    viewMap: 'Map',
    viewList: 'List',
    departReset: 'Remove this start — measure from the house again',
    departFrom: 'Distances from',
    departPin: 'a point dropped on the map',
    departBack: 'Back to the house',
    houseHere: 'The house',
    wherePlaceholder: 'Where are you? A village, an address…',
    whereSearching: 'Searching…',
    whereNotFound: 'Not found. Try the Italian name — places come from OpenStreetMap.',
    whereError: 'The search did not answer. Try again, or just tap the map.',
    whereOut: 'That is outside Sicily — the map does not reach that far.',
    mapFailed: 'The map could not load.',
    mapFailedHint: 'Reload the page. If it persists, an ad blocker or a company network may be blocking it — the list still works.',
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
        spots: [{ label: 'Vivai Cintoli', url: 'https://maps.app.goo.gl/X2VCrFrZEK2caPpH9' }],
      },
    ],
    markets: {
      title: 'Markets',
      desc: 'Fruit, vegetables, cheese and the day’s catch, straight from the producers.',
      list: [
        { label: 'Scicli market — Tuesdays, 8 am-1 pm, contrada Zagarone', url: 'https://www.google.com/maps/search/?api=1&query=mercato+settimanale+contrada+Zagarone+Scicli+RG' },
        { label: 'Campagna Amica farmers’ market — Fridays, 8 am-1 pm, via Badiula (Scicli)', url: 'https://www.google.com/maps/search/?api=1&query=Via+Badiula+Scicli+RG' },
        { label: 'Marina di Ragusa farmers’ market — Friday morning (Jun–Sep)', url: 'https://www.google.com/maps/search/?api=1&query=Piazza+Vincenzo+Rabito+Marina+di+Ragusa' },
        { label: 'Donnalucata fish market — fresh catch of the day', url: 'https://www.google.com/maps/search/?api=1&query=Mercato+ittico+Donnalucata' },
      ],
    },
  },
  salvaPage: { title: 'The family', intro: 'Photos, memories and family history, over the years.', historyTitle: 'Family history', storyText: [
    'Salvatore Contrino was born on 26 January 1947 in Valguarnera, Sicily.',
    'His father Angelo, back from the Russian camps, found himself a widower with a six-month-old baby. He entrusted him to his own mother Giuseppina — granny Pipine — who had emigrated to Saint-Étienne with her children, and who raised him as the tenth of the siblings.',
    'At nineteen he left to work in Belgium, and never left it again. Keeping Sicily, his heritage, in a corner of his heart.',
    'From one generation to the next, this house in Cava d’Aliga brings the family together. That is the centre of it all — the place that kept bringing us back to where he came from.',
  ], storyOpen: 'This story is written by many hands. A date, a place, a name, an anecdote, a photograph — send them over and they will find their place here. Most useful of all: say who you are talking about, when, and where. That is what lets us hook each piece onto the right spot.', storyOpenCta: 'Add to the story', storyOpenSubject: 'Family history — I have something to add', treeTitle: 'Family tree', treeNote: 'What the family has passed on to us. Blanks remain — they are listed at the bottom, and anyone can fill them in.', treePaternal: 'Paternal grandparents', treeMaternal: 'Maternal grandparents', treeWife1: '1st wife', treeWife2: '2nd wife', treeMarriage1: '1st marriage', treeMarriage2: '2nd marriage', treeGreat: 'Great-grandparents', treeParents: 'The parents', treeChildren: 'The children', treeQuestionsTitle: 'What we are missing', treeAdd: '+ Add my branch', treeAddSubject: 'Family tree — my branch', treeExample: 'People and dates are missing — tell us what you know.', treeOpen: 'Expand', treeClose: 'Collapse', treeOpenAll: 'Expand all', treeCloseAll: 'Collapse all', treeKid: 'child', treeKids: 'children', treeSideFather: 'Contrino side', treeSideMother: 'Lux side', treeSideUs: 'Us' },
  stayPage: { title: 'The calendar', intro: 'When the house is occupied, so the family can coordinate.', legend: { occupied: 'Occupied', tentative: 'To confirm', free: 'Free' } },
  calendarPage: { title: 'Upcoming events', intro: 'What is happening around the house — the summer programme in Bruca, and the great Sicilian feasts.', festivalsTitle: 'Sicilian festivals', programNote: 'Sotto il cielo di Bruca — the summer programme, steps from the house. Follow the colours.', programDone: 'The summer programme is over. The next one comes in spring — the Sicilian feasts, though, return every year.', programMore: 'Details and times on Instagram', socialsTitle: 'Follow', festivalDescs: ["The high point of the Italian summer. Descended from the Roman Feriae Augusti and tied to the Assumption, the holiday gathers families and villages by the sea: swimming, big meals, processions and fireworks all across Sicily.", "Saint Roch, invoked for centuries against epidemics, protects many Sicilian communities. In Scicli his statue is carried in procession through the alleys, amid brass bands and festive lights.", "Saint John the Baptist is the patron of Ragusa, whose cathedral is dedicated to him. On 29 August, the day of his beheading, the town lights up: a solemn procession of the statue and a grand fireworks display over the old town.", "Saint Conrad Confalonieri, a hermit venerated as Noto’s patron. On the last Sunday of August, his silver urn moves through the baroque streets in great popular devotion, among candles, flowers and processions."] },
  culturePage: {
    eyebrow: 'Culture',
    title: 'Sounds & screens',
    intro: 'This corner of Sicily has a soundtrack and film-set scenery. A shared playlist for the drive, and the films and series shot a few kilometres from the house — often in streets you will recognise.',
    playlistDesc: 'A shared playlist: everyone adds what they listen to here. For the drive from the airport, the kitchen, or the terrace at night.',
    playlistCta: 'Open in Spotify',
    playlistSoon: 'The playlist link is coming soon.',
    artistsIntro: 'The voices that tell the island — listen before, during, after.',
    handsIntro: 'In 1958 the Milanese designer Bruno Munari photographed fifty Italian gestures and captioned them in four languages. The title says it all: “Supplement to the Italian dictionary”. He did not do it as a joke — he did it for foreigners visiting Italy. That is, for us.',
    handsWho: 'Bruno Munari (Milan, 1907-1998) started out among the Futurists at twenty, then spent his life dismantling seriousness: his 1933 “useless machines” turn on the ceiling and produce nothing. He did not invent the gestures — he took them from canon Andrea de Jorio, who catalogued them in Naples in 1832.',
    handsBookCta: 'The book at Corraini',
    handsBook2Title: 'Design as Art',
    handsBook2Desc: 'His most widely read book, published by Laterza in 1966 as « Arte come mestiere » — art as a trade. Munari looks at lamps, road signs, posters, cars and chairs, and each time asks the same thing: is it beautiful, does it work, is it for everyone? Picasso called him “the new Leonardo”. Reissued as a Penguin Modern Classic in 2008.',
    handsBook2Cta: 'The book at Penguin',
    handsPhotoNote: 'The hand on the Supplemento cover is “ma che vuoi” — the gesture everything starts from. The others are in the book, and have no place here: they are under copyright. We show the covers, not what is inside them.',
    handsCoverAlt: 'Cover of “Speak Italian: The Fine Art of the Gesture” by Bruno Munari: a hand photographed in black and white, all five fingertips pinched together.',
    handsCoverCredit: 'Bruno Munari, Speak Italian: The Fine Art of the Gesture — Chronicle Books, 2005',
    handsCover2Alt: 'Cover of “Design as Art” by Bruno Munari for Penguin: sixteen faces drawn in black and white, each in a different style, on a cream background.',
    handsCover2Credit: 'Bruno Munari, Design as Art — Penguin Modern Classics, 2008',
    photosIntro: 'Before phones, others looked at these stones and these festivals — and fixed them for good.',
    artsIntro: 'Scicli is not only a TV set: it is a real home of painting, and this sea was painted for a whole lifetime.',
    sculptureIntro: 'The only one of these artists still at work — and he works 8 km away, turning Scicli into his open-air studio.',
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
        text: 'Not a dessert: the real Sicilian summer breakfast. You order a granita — almond, lemon, mulberry, pistachio, coffee — with a brioche col tuppo, the one with a topknot. You dip the brioche in it — and some split it open and fill it with the granita. Getting up early to eat it at the bar before the heat arrives is one of the best reasons to be here.',
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
  specialtiesPage: {
    eyebrow: 'Specialties',
    title: 'Local specialties',
    intro: 'What you take home and what you taste on the spot — the real specialties of the Iblei hills, between Scicli, Modica and Ragusa.',
    facts: [
      {
        icon: 'fork',
        title: 'Scaccia ragusana',
        text: 'A paper-thin bread dough rolled around its filling and baked. The classics: tomato and onion, ricotta and onion, ricotta and sausage, tomato and aubergine. It has always been the local packed lunch — every bakery has it.',
      },
      {
        icon: 'leaf',
        title: 'Modica chocolate',
        text: 'Cold-worked chocolate, handed down from the Aztecs via the Spanish: the sugar never melts, it stays grainy, and the chocolate crunches. Cinnamon, vanilla, chilli, citrus… In Modica, twenty minutes away, the Antica Dolceria Bonajuto has made it since 1880.',
      },
      {
        icon: 'cone',
        title: 'Scicli’s teste di turco',
        text: 'Scicli’s own pastry: a big choux puff shaped like a turban, filled with ricotta or custard. The name and shape come from the legend of the Madonna delle Milizie — the turban of the Turkish invaders. Only really good right here.',
      },
      {
        icon: 'cleaver',
        title: 'Modica’s ’mpanatigghi',
        text: 'Half-moon shortcrust pastries hiding a secret: minced beef, dark chocolate, almonds, sugar and spices. Sweet-and-savoury, inherited from the Spanish convents. Surprising — and far better than it sounds.',
      },
      {
        icon: 'droplet',
        title: 'Ragusano caciocavallo',
        text: 'The great cheese of the Iblei — the “cosacavaddu”, a big block of stretched-curd cheese, aged in a brick shape and hung from a rope. Mild and fresh when young, sharp as it ages. With ragusana provola, it is the backbone of the table here.',
      },
      {
        icon: 'citrus',
        title: 'Torrone and cubbaita',
        text: 'The local almond-and-honey sweets: almond torrone, and cubbaita, a hard sesame-and-honey brittle of Arab origin, snapped into pieces. Festival treats, made to take away.',
      },
    ],
  },
  drinksPage: {
    eyebrow: 'Wine & spirits',
    title: 'Local wine & spirits',
    intro: 'The south-east is great wine country — and Sicily’s only DOCG was born right next door. Enough to carry the table and close the meal.',
    facts: [
      {
        icon: 'glass',
        title: 'Cerasuolo di Vittoria',
        text: 'The wine of this corner — and the only DOCG in all of Sicily, born in nearby Vittoria. A blend of nero d’avola and frappato grown on the local red earth: cherry-red, dry, velvety, with flowers and red fruit on the nose. The wine of the great local producers — COS, Planeta, Valle dell’Acate.',
      },
      {
        icon: 'leaf',
        title: 'Frappato',
        text: 'The light, perfumed grape of Vittoria. On its own it makes a pale, almost thirst-quenching red of strawberry and cherry, good served slightly chilled in summer. The opposite of a heavy wine — perfect at the table in the heat.',
      },
      {
        icon: 'bottle',
        title: 'Nero d’Avola',
        text: 'Sicily’s great red, named after nearby Avola. Fleshy, dark and warm, with black fruit and spice. It gives the Cerasuolo its body, but it is drunk on its own all over the island too.',
      },
      {
        icon: 'droplet',
        title: 'Marsala',
        text: 'Sicily’s famous fortified wine, from the west of the island. From dry to deep amber and sweet: as an aperitif, with cheese, or in the kitchen — it is what perfumes zabaione and many desserts. A sip of Sicilian history.',
      },
      {
        icon: 'citrus',
        title: 'Amaro',
        text: 'The end-of-meal digestivo: a bitter herb-and-citrus liqueur served cold. Averna, born in Caltanissetta, is Sicily’s best known. Drink it ice-cold, sometimes over ice, to close the meal.',
      },
      {
        icon: 'sun',
        title: 'Limoncello & rosolio',
        text: 'The homemade liqueurs brought out after coffee: limoncello, from lemon zest, ice-cold; and the rosoli, those old perfumed Sicilian liqueurs (cinnamon, coffee, mandarin…). Often homemade, always offered.',
      },
    ],
  },
  coffeePage: {
    eyebrow: 'Coffee',
    title: 'Coffee, a whole ritual',
    intro: 'Here coffee punctuates the day — quick at the bar in the morning, iced in summer, corrected with a drop of liquor after the meal. A short guide.',
    facts: [
      {
        icon: 'droplet',
        title: 'A coffee = an espresso',
        text: 'Here “un caffè” is a tight espresso, drunk standing at the counter in thirty seconds, for about a euro. You don’t sit, you don’t take it away: you drink it there, pay, and leave. The big American-style coffee doesn’t exist — ask for a caffè lungo if you want it less concentrated.',
      },
      {
        icon: 'sun',
        title: 'Iced coffee, with almond',
        text: 'In summer, caffè freddo: a cold espresso, often sweetened with almond milk — a marvel of the south. You’ll also find it “in ghiaccio”, poured hot over ice cubes. A drink in its own right, not a forgotten coffee.',
      },
      {
        icon: 'cone',
        title: 'Granita al caffè',
        text: 'The coffee version of the breakfast granita: ice-cold, with a tuft of cream (con panna) and the brioche to dip. The Sicilian summer wake-up, when it is already hot at eight.',
      },
      {
        icon: 'list',
        title: 'The little counter lexicon',
        text: 'Macchiato (a drop of milk), lungo (long), ristretto (even tighter), corretto (with a splash of liquor). And cappuccino is for the morning — never after a meal: that is the unwritten rule.',
      },
      {
        icon: 'glass',
        title: 'The corretto, to finish',
        text: 'At the end of the meal, caffè corretto: an espresso “corrected” with a splash of grappa, anise or amaro. Also called ammazzacaffè — the sip that truly closes lunch.',
      },
      {
        icon: 'bottle',
        title: 'The moka, at home',
        text: 'Away from the bar, coffee is made in the moka — the little pot that gurgles on the stove. Every home has its own, darkened by the years, never washed with soap. The sound and smell of morning.',
      },
    ],
  },
  cultureFilter: {
    all: 'See all',
    playlist: 'The playlist',
    screens: 'Screens',
    painting: 'Painting',
    sculpture: 'Sculpture',
    photo: 'Photo',
    hands: 'Designer',
    songs: 'Songs',
  },
  regionFilter: {
    all: 'See all',
    places: 'The places',
    customs: 'Local customs',
    specialties: 'Specialties',
    drinks: 'Wine & spirits',
    coffee: 'Coffee',
    arab: 'Arab Sicily',
    sounds: 'Sounds & screens',
    etna: 'Etna',
    fauna: 'Wildlife',
    books: 'Books',
    history: 'Struggles & memory',
  },
  infoFilter: {
    all: 'See all',
    address: 'Address',
    parking: 'Parking',
    arrival: 'Arriving',
    move: 'Getting around',
    urgent: 'Emergencies',
    waste: 'Waste',
    leaving: 'Leaving',
    money: 'Cash',
    fauna: 'Cleaning',
  },
  parkingPage: {
    eyebrow: 'Parking',
    title: 'The colours on the ground',
    intro: 'In Italy the colour of the lines tells you everything, and it is the same everywhere: it is set by national law, not by the town. Three colours are enough to manage.',
    note: 'No ticket on show, or a forgotten disc: €41. The parking disc lives in the car — a rental firm provides one, otherwise any tobacconist sells them.',
    facts: [
      { couleur: '#2f6fd0', title: 'Blue — paid', text: 'You pay at the meter, by the hour, and put the ticket behind the windscreen. That is what you find in town centres, and along the seafront in summer.' },
      { couleur: '#ffffff', bord: '#d9d9d9', title: 'White — free', text: 'But read the sign: some white bays have a time limit. You must then display the parking disc — the disco orario — showing your arrival time.' },
      { couleur: '#f2c033', title: 'Yellow — reserved', text: 'Blue-badge holders, loading, police, sometimes residents. You do not park there, not even for five minutes.' },
      { couleur: '#f06a9b', title: 'Pink — expectant mothers', text: 'And parents of a child under two. Official since 2021, but it needs a permit issued by your town of residence: as a visitor, you are not entitled.' },
      { couleur: '#6f8f5f', title: 'Green — charging', text: 'Usually reserved for electric cars while charging. You do not stop there for anything else.' },
    ],
    gardien: {
      title: 'The man in the cap',
      text: 'In public car parks in big cities and very touristy spots, someone often turns up to wave you into a space and watch the car. Whether he is official or not, you cannot always tell. He asks for little, he really does keep an eye on it, and there it is better to accept — you never quite know what happens to the car if you say no. Here in Cava d’Aliga the question does not arise: we are far from the tourist spots.',
    },
  },
  cleanPage: {
    eyebrow: 'Cleaning',
    title: 'Keeping house in a hot country',
    intro: 'Heat and humidity: what goes unnoticed up north does not forgive here. One plate left overnight, a few crumbs under the table, and the line of ants is there by morning. Nothing dramatic — just a few habits to pick up, and they come quickly.',
    rulesTitle: 'The habits',
    rules: [
      'No crumbs. A quick sweep after every meal, under the table too.',
      'Clear the table and wash up without waiting — not the next morning.',
      'Anything opened gets put away: biscuits, flour, bread, fruit, sugar. We put as much as possible in the fridge — the best airtight box there is.',
      'Bin closed, and out on the right evening. A bag left open overnight in the kitchen is the surest invitation.',
      'Never let water stand: pot saucers, buckets, the watering can. That is where mosquitoes breed, and nowhere else.',
      'Shake out shoes left outside before putting them back on. An old southern habit that costs nothing.',
    ],
    antsTitle: 'The ants',
    antsText: 'They are the real reason for everything above. They do not sting and carry nothing serious, but once a line has found the way to the sugar it will take it again for days. You do not fight them: you give them nothing.',
    faunaLink: 'Who lives here — geckos, lizards, snakes, scorpions',
  },
  italianPage: {
    eyebrow: 'Learning Italian',
    title: 'Speaking Italian here',
    intro: 'Not a grammar course: enough to get by from the first morning, and then to understand what you are saying. Pronunciation first, whole sentences next, grammar after that — and exercises at the end.',
    methodTitle: 'How to use it',
    method: 'Ten minutes a day beats an hour on Sunday. Read out loud, even alone, even badly: Italian is caught by ear and mouth, not by eye. Do not try to remember everything — take the three sentences you need today, actually use them, and come back tomorrow. That is the principle behind the methods that work, Assimil first among them: short lessons, whole sentences, and the rule explained only once you are already saying it.',
    soundTitle: 'First, the sounds',
    soundIntro: 'Eight rules and you can read Italian aloud without going wrong. This is the real front door: people forgive a grammar mistake, but they cannot understand a mispronounced word. Stress is marked in capitals.',
    talkTitle: 'Speaking, by situation',
    talkIntro: 'Whole sentences, to be reused exactly as they are. You never need the word “coffee” on its own — you need to know how to order one.',
    grammarTitle: 'The three tenses',
    grammarIntro: 'Present, past, future. In that order: the present carries most of the load and even stands in for the near future; the future is the one you can most easily do without.',
    whenLabel: 'When to use it',
    howLabel: 'How it is built',
    trapLabel: 'Where it trips you',
    drillTitle: 'Practice',
    drillIntro: 'Twelve exercises, marked at once and explained. A wrong answer with no explanation is worthless: you remember the mistake just as well as the fix.',
    check: 'Check',
    good: 'That is it',
    wrong: 'Not quite',
    next: 'Next exercise',
    again: 'Start again',
    score: '{n} correct out of {t}',
    progress: 'Exercise {n} of {t}',
    start: 'Start the exercises',
  },
  booksPage: {
    eyebrow: 'Books',
    title: 'To read before, during, after',
    intro: 'Seven books about Sicily or set in Sicily — and two that tell what the families here lived through. Nothing compulsory: this is a shelf, not a syllabus.',
    linkLabel: 'About the book',
    list: [
      { titre: 'Una donna di Ragusa', auteur: 'Maria Occhipinti', annee: '1957', lien: 'https://it.wikipedia.org/wiki/Una_donna_di_Ragusa', text: 'The book from here. Maria Occhipinti was twenty-three and five months pregnant when she lay down in front of the army truck taking away the young men of her neighbourhood, in Ragusa, on 4 January 1945. She paid for it with internal exile on Ustica, where she gave birth, and then prison. Her autobiography went unnoticed in 1957 and landed like a bomb when it was reissued in 1976.' },
      { titre: 'La plupart ne reviendront pas', auteur: 'Eugenio Corti', annee: '1947', lien: 'https://it.wikipedia.org/wiki/I_pi%C3%B9_non_ritornano', text: 'Mag’s pick. The diary of a survivor of the retreat from Russia: twenty-eight days encircled in the snow, written by a twenty-two-year-old who came out alive. It is not a Sicilian book, but it tells what thousands of families here lived through without ever speaking of it — and this house knows something about that.' },
      { titre: 'Le parole sono pietre', auteur: 'Carlo Levi', annee: '1955', lien: 'https://it.wikipedia.org/wiki/Carlo_Levi', text: 'Three journeys through Sicily, among the sulphur mines, the peasants occupying the land, and the still-fresh memory of Portella della Ginestra. “Words are stones”: the title says the book. It is the finest account of what the struggle for land in the island really was, written in the moment by someone who listened.' },
      { titre: 'Il Gattopardo', auteur: 'Giuseppe Tomasi di Lampedusa', annee: '1958', lien: 'https://it.wikipedia.org/wiki/Il_Gattopardo', text: 'The great Sicilian novel, written by a prince at the end of his life and turned down by two publishers before becoming a classic. The Sicily of 1860, a world collapsing, and the line everyone quotes: everything must change so that everything can stay the same.' },
      { titre: 'Il giorno della civetta', auteur: 'Leonardo Sciascia', annee: '1961', lien: 'https://it.wikipedia.org/wiki/Il_giorno_della_civetta', text: 'The book that named what nobody named. A carabinieri captain from the north investigates a killing in a Sicilian village and runs into a wall of silence. Sciascia was writing at a time when the very existence of the mafia was officially up for debate.' },
      { titre: 'Conversazione in Sicilia', auteur: 'Elio Vittorini', annee: '1941', lien: 'https://it.wikipedia.org/wiki/Conversazione_in_Sicilia', text: 'A man goes back to see his mother in Sicily after fifteen years. Published under fascism, the book says everything while naming nothing — which is how it got past the censors, and why it mattered.' },
      { titre: 'I Malavoglia', auteur: 'Giovanni Verga', annee: '1881', lien: 'https://it.wikipedia.org/wiki/I_Malavoglia', text: 'A family of fishermen, a boat, a debt, and the sea taking it all back. Verga writes the poor without pity and without prettifying: this is the Sicily from before photographs, the Sicily of the coastal villages.' },
    ],
  },
  historyPage: {
    eyebrow: 'Struggles & memory',
    title: 'What happened here',
    intro: 'People come to Sicily for the baroque and the sea, and leave without knowing that the province of Ragusa saw one of the most forgotten revolts in Italian history. Here is what it was — and why the old people here do not tell you everything.',
    linkLabel: 'Read more',
    note: 'This page takes no side: it tells what happened, in the place where it happened. The books just above go much further than we do, and the people who lived it wrote them themselves.',
    facts: [
      { icon: 'landmark', lien: 'https://it.wikipedia.org/wiki/Fasci_siciliani', title: 'The Sicilian Fasci, 1891-1894', text: 'Before the parties there were the fasci: leagues of peasants, sulphur miners and artisans, up to three hundred thousand members in a destitute island. They demanded contracts, land, an end to abuse. The Crispi government — a Sicilian — answered with a state of siege in January 1894, with deaths and military tribunals. It is united Italy’s first great social movement, and it was born here.' },
      { icon: 'walk', lien: 'https://it.wikipedia.org/wiki/Nonsiparte', title: '“Non si parte!” — January 1945, right here', text: 'The war was ending in the north, and Rome called Sicily’s young men up. The island refused. The revolt burned hottest in the province of Ragusa: on 4 January 1945 the army swept the working-class districts to take the boys away. It is the most forgotten antimilitarist revolt in Italian history — and it happened a few kilometres from this house.' },
      { icon: 'compass', lien: 'https://it.wikipedia.org/wiki/Prigionieri_di_guerra_italiani_in_Unione_Sovietica', title: 'The Russian camps: those who did not come back', text: 'December 1942, on the Don: the Italian army in Russia is destroyed. Those who survive set out on foot for the camps, hundreds of kilometres through the snow — survivors called them the “davai” marches, after the Russian word shouted at them to keep moving. Twenty-two thousand died on the way. Fifty-four thousand reached the camps alive, from European Russia to Siberia; forty-four thousand died there, most of them in the winter of 1943. Ten thousand came home, between 1945 and 1954 — the last officers, sentenced to forced labour on charges that would prove false, were freed only after Stalin’s death. This house knows it first-hand: Angelo, Salvatore’s father, came back from those camps.' },
      { icon: 'info', lien: 'https://it.wikipedia.org/wiki/Maria_Occhipinti', title: 'The woman who lay down in front of the truck', text: 'Maria Occhipinti, twenty-three, five months pregnant, lay down in front of the army truck carrying off the young men of her neighbourhood. The soldiers fired into the crowd. She was exiled to Ustica, where she gave birth, then jailed in Palermo. Because the Communist Party condemned the revolt, she broke with it and ended an anarchist. She told all of it herself — see the books.' },
      { icon: 'home', lien: 'https://it.wikipedia.org/wiki/Nonsiparte', title: 'The “Comiso Republic”, six days', text: 'At Comiso, twenty kilometres from here, the insurgents took the carabinieri prisoner on 5 and 6 January and proclaimed a people’s government: a committee of public safety, order squads, food handed out at cost. It lasted six days. On 11 January, under threat of an Allied bombing of the town, they negotiated their surrender.' },
      { icon: 'cone', lien: 'https://it.wikipedia.org/wiki/Portella_della_Ginestra', title: 'Portella della Ginestra, 1 May 1947', text: 'Two years later the left won the Sicilian regional elections. On May Day, families were celebrating in a mountain pass above Piana degli Albanesi when the bandit Giuliano’s gang fired into the crowd. Eleven dead, children among them. It is the first political massacre of the Italian Republic, and it has never been fully explained.' },
    ],
  },
  faunaPage: {
    eyebrow: 'Wildlife',
    title: 'Who lives here',
    intro: 'The creatures you actually meet in south-eastern Sicily — and what they change, which is almost nothing. The geckos on the wall, the lizards in the stones, and two reputations worth correcting.',
    facts: [
      {
        icon: 'leaf',
        title: 'The geckos',
        text: 'The pale little wall geckos that cross the wall at dusk and sit motionless around the lamps. They do not bite, do not come near you, do not climb into beds — and they spend the night eating mosquitoes. They are the best housemates here: leave them be.',
      },
      {
        icon: 'walk',
        title: 'The small lizards',
        text: 'They dart between the stones in the sun and vanish the moment you step closer. Completely harmless, and here long before we were.',
      },
      {
        icon: 'droplet',
        title: 'The mosquitoes',
        text: 'They bite mostly at sunrise and sunset, and the tiger mosquito, present in Sicily, bites in broad daylight too. They breed in still water — a few centimetres in a saucer is enough. Emptying anything that holds water beats any spray.',
      },
      {
        icon: 'info',
        title: 'Snakes: rare, but they exist',
        text: 'You will not see them in the village, and hardly ever near the houses. But Sicily has several species, and one is venomous: the asp viper (Vipera aspis hugyi), which lives in dry stony countryside. It flees before you ever see it. Hiking: closed shoes, and watch where you put your hands. If bitten: call the emergency services and keep the limb still — never a tourniquet, never a cut, never suction.',
      },
      {
        icon: 'target',
        title: 'Scorpions: present, and harmless',
        text: 'The Sicilian scorpion (Euscorpius sicanus) is small, dark, nocturnal, and hides under stones or flowerpots. It is extremely shy and rarely stings; the sting feels like a nettle or a bee, with no danger. That is where the habit of shaking out your shoes comes from.',
      },
    ],
    note: 'We are not saying “there is nothing here”: that would be reassuring and untrue. We say what lives here and what it actually changes — which is almost nothing, as long as the kitchen stays clean.',
  },
  notFoundPage: {
    eyebrow: 'Error 404',
    title: 'This page does not exist',
    text: 'A link broke somewhere, or the address was copied down wrong. It is nothing serious, and it is not your fault. Here is where to pick things up again.',
    definition: '404: the browser reached the server, but the server could not find what was asked of it.',
    home: 'Back to the home page',
    elsewhere: 'Or go straight somewhere',
  },
  cashPage: {
    eyebrow: 'Getting cash',
    title: 'Where to find a Bancomat',
    intro: 'In Italy a cash machine is called a Bancomat — that is the word on the shopfronts, and the only one everyone will understand if you ask for directions. There are two in Donnalucata.',
    spots: [
      {
        title: 'Banca Agricola Popolare di Sicilia',
        where: 'Via Miccichè 23, Donnalucata',
        text: 'The village branch. The machine is on the front wall, available during opening hours and often beyond.',
        label: 'Open in Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=Banca+Agricola+Popolare+di+Sicilia+Via+Miccich%C3%A8+23+Donnalucata+Scicli+RG',
      },
      {
        title: 'The post office — Postamat',
        where: 'Via Casmene, Donnalucata',
        text: 'The Italian post office has its own machine, the Postamat. It takes foreign cards like any Bancomat, and saves the day when the bank is shut.',
        label: 'Open in Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=Poste+Italiane+Via+Casmene+Donnalucata+Scicli+RG',
      },
    ],
    note: 'Both addresses are certain, but no one can promise a given machine is working on a given day — hence two rather than one. Keep some cash on you: plenty of small shops, and the market, take nothing else.',
  },
  quizPage: {
    eyebrow: 'A little game',
    title: 'How well do you know the region?',
    intro: 'By theme, or all mixed up. Three answers to choose from each time, and everything you need is written further up this page — each answer tells you where to read it again.',
    start: 'Start',
    next: 'Next question',
    check: 'Check',
    back: 'Previous question',
    seeSection: 'Read that part again',
    good: 'That’s it',
    wrong: 'Not quite',
    progress: 'Question {n} of {t}',
    scoreTitle: 'Done',
    scoreLine: '{n} right out of {t}',
    again: 'Play again',
    allThemes: 'All themes',
    empty: 'No question matches that — widen the choice a little.',
    pick: 'Pick a theme, or take on the lot.',
    questions: [
      { q: 'Where does the name “Cava d’Aliga” come from?', choix: ['From seaweed — “aliga” in Sicilian', 'From an old stone quarry', 'From a local saint’s name'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Which TV series uses Scicli as its set?', choix: ['Inspector Montalbano', 'The Leopard', 'Gomorrah'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'After which earthquake was the Val di Noto rebuilt in baroque style?', choix: ['The one of 1693', 'The one of 1908', 'The one of 1542'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'The Fornace Penna, on the Sampieri headland, was…', choix: ['A brickworks', 'A lighthouse', 'A tuna cannery'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Which Greek city was Syracuse the rival of?', choix: ['Athens', 'Sparta', 'Corinth'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Where is the Ear of Dionysius?', choix: ['In Syracuse', 'In Ragusa', 'In Noto'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Of the ten places on this page, how many are UNESCO listed?', choix: ['Five', 'Two', 'All ten'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Where is the Torre Cabrera, the 16th-century watchtower?', choix: ['In Marina di Ragusa', 'In Sampieri', 'In Donnalucata'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'What do Sicilians call Etna?', choix: ['A Muntagna', 'Il Vulcano', 'La Signora'], bonne: 0, ancre: 'etna', niveau: 'facile' },
      { q: 'Can you ski on Etna?', choix: ['Yes, on two ski areas', 'No, it is far too warm', 'Yes, but only one month a year'], bonne: 0, ancre: 'etna', niveau: 'facile' },
      { q: 'What did the nivaroli harvest on Etna?', choix: ['Snow', 'Sulphur', 'Cooled lava'], bonne: 0, ancre: 'etna', niveau: 'moyen' },
      { q: 'Which discovery turned snow into a refrigerant?', choix: ['Mixing it with sea salt', 'Pressing it into blocks', 'Covering it with straw'], bonne: 0, ancre: 'etna', niveau: 'moyen' },
      { q: 'What were the stone pits used to store the snow called?', choix: ['Neviere', 'Cisterne', 'Gebbie'], bonne: 0, ancre: 'etna', niveau: 'difficile' },
      { q: 'Since when has Etna been a UNESCO World Heritage site?', choix: ['Since 2013', 'Since 1993', 'Since 2021'], bonne: 0, ancre: 'etna', niveau: 'difficile' },
      { q: 'In which year did the Arabs land in Sicily?', choix: ['In 827', 'In 1091', 'In 1492'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'What does “Donnalucata” mean?', choix: ['The spring of the hours', 'The lady of the lake', 'The fish harbour'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Names beginning with “Calta-” come from qal‘at. It means…', choix: ['The fortress', 'The river', 'The market'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Marsala comes from “marsa”. What does it mean?', choix: ['The port', 'The mountain', 'The bridge'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Who described the spring of Donnalucata in the 12th century?', choix: ['The geographer al-Idrisi', 'The emir Belcane', 'Count Roger'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'The Madonna delle Milizie feast re-enacts a battle of which year?', choix: ['1091', '827', '1693'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'In dialect, the “zàgara” is…', choix: ['The orange blossom', 'The irrigation channel', 'The water basin'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'What is the cake of Scicli’s feast called?', choix: ['Testa di turco', 'Cannolo', 'Cassata'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'The real Sicilian summer breakfast is…', choix: ['A granita and a brioche', 'A cappuccino and a cannolo', 'Bread and olive oil'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'In Palermo they say…', choix: ['Arancina, feminine', 'Arancino, masculine', 'Neither of the two'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'What time does the passeggiata happen?', choix: ['Around 7 pm, as the heat drops', 'At noon sharp', 'At sunrise'], bonne: 0, ancre: 'coutumes', niveau: 'facile' },
      { q: 'The breakfast brioche is called…', choix: ['Brioche col tuppo', 'Brioche col nodo', 'Brioche della nonna'], bonne: 0, ancre: 'coutumes', niveau: 'moyen' },
      { q: 'Who settled the arancina / arancino debate?', choix: ['The Accademia della Crusca', 'The mayor of Palermo', 'Nobody, it still rages'], bonne: 0, ancre: 'coutumes', niveau: 'difficile' },
      { q: 'Modica chocolate is worked…', choix: ['Cold, so the sugar stays grainy', 'At very high temperature', 'With added cocoa butter'], bonne: 0, ancre: 'specialites', niveau: 'facile' },
      { q: 'The scaccia ragusana is…', choix: ['Paper-thin bread dough rolled around its filling', 'A thick pizza', 'A sweet fritter'], bonne: 0, ancre: 'specialites', niveau: 'facile' },
      { q: 'What do Modica’s ’mpanatigghi hide?', choix: ['Beef', 'Ricotta', 'Dried figs'], bonne: 0, ancre: 'specialites', niveau: 'moyen' },
      { q: 'Scicli’s teste di turco are filled with…', choix: ['Ricotta or custard', 'Modica chocolate', 'Minced meat'], bonne: 0, ancre: 'specialites', niveau: 'moyen' },
      { q: 'Ragusano caciocavallo is aged…', choix: ['As a block, hung from a rope', 'As a round wheel', 'In small balls in oil'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'Cubbaita is a hard nougat made with…', choix: ['Sesame and honey', 'Almonds and icing sugar', 'Pistachio and chocolate'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'Since when has Antica Dolceria Bonajuto made chocolate?', choix: ['Since 1880', 'Since 1950', 'Since 1720'], bonne: 0, ancre: 'specialites', niveau: 'difficile' },
      { q: 'Which is the only DOCG in all of Sicily?', choix: ['Cerasuolo di Vittoria', 'Nero d’Avola', 'Marsala'], bonne: 0, ancre: 'alcools', niveau: 'facile' },
      { q: 'Cerasuolo di Vittoria blends two grapes. Which?', choix: ['Nero d’Avola and Frappato', 'Frappato and Grillo', 'Nero d’Avola and Syrah'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Where does Nero d’Avola get its name?', choix: ['From the town of Avola', 'From a Greek grape', 'From the colour of the soil'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Which part of Sicily does Marsala come from?', choix: ['The west of the island', 'The slopes of Etna', 'The Iblei mountains'], bonne: 0, ancre: 'alcools', niveau: 'moyen' },
      { q: 'Which Sicilian amaro was born in Caltanissetta?', choix: ['Averna', 'Fernet', 'Cynar'], bonne: 0, ancre: 'alcools', niveau: 'difficile' },
      { q: 'Frappato on its own gives a wine that is…', choix: ['Pale red, served slightly chilled', 'White and mineral', 'Deep red and tannic'], bonne: 0, ancre: 'alcools', niveau: 'difficile' },
      { q: 'At the bar, a “caffè corretto” is an espresso…', choix: ['With a dash of liqueur', 'With plenty of milk', 'Served with a glass of water'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'When do you drink a cappuccino?', choix: ['In the morning, never after a meal', 'After dinner', 'At any time of day'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'At home, coffee is made…', choix: ['In a moka pot, on the stove', 'In a filter machine', 'In a french press'], bonne: 0, ancre: 'cafe', niveau: 'facile' },
      { q: 'What does “ristretto” mean?', choix: ['Even shorter and stronger', 'Lengthened with water', 'With a drop of milk'], bonne: 0, ancre: 'cafe', niveau: 'moyen' },
      { q: 'Sicilian caffè freddo is often sweetened…', choix: ['With almond milk', 'With cane syrup', 'With honey'], bonne: 0, ancre: 'cafe', niveau: 'moyen' },
      { q: 'What is the “ammazzacaffè”?', choix: ['The corretto that ends the meal', 'A coffee cake', 'A very large cup'], bonne: 0, ancre: 'cafe', niveau: 'difficile' },
      { q: 'What do the geckos crossing the wall at dusk eat?', choix: ['Mosquitoes', 'Crumbs', 'Nothing, they sleep'], bonne: 0, ancre: 'faune', niveau: 'facile' },
      { q: 'Are there scorpions in Sicily?', choix: ['Yes, but their sting is harmless', 'No, none at all', 'Yes, and they are deadly'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Where do mosquitoes breed?', choix: ['In still water — a few centimetres is enough', 'In dry hedges', 'Under warm stones'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Which is the only venomous snake in Sicily?', choix: ['The asp viper', 'The western whip snake', 'There is none'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'What must you never do after a viper bite?', choix: ['Apply a tourniquet or cut the wound', 'Call the emergency services', 'Keep the limb still'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'Where is Europe’s first dried pasta documented?', choix: ['In Sicily, at Trabia', 'In Naples', 'In China, brought back by Marco Polo'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'What were those threads of semolina described in 1154 called?', choix: ['Itriyya', 'Maccheroni', 'Tagliatelle'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Who wrote the earliest record of dried pasta in Europe?', choix: ['Al-Idrisi, in the Book of Roger', 'Marco Polo', 'Pliny the Elder'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Where does the arancina’s golden colour come from?', choix: ['From saffron, brought by the Arabs', 'From turmeric', 'From the breadcrumbs'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'What is the head of a tonnara, a tuna fishery, called?', choix: ['The raìs', 'The padrone', 'The capitano'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Cubbaita takes its name from Arabic…', choix: ['Qubbayt', 'Zabīb', 'Sāqiya'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'Palermo’s sfincione is thought to be named from Arabic…', choix: ['Isfanǧ, fried dough', 'Sifr, zero', 'Sukkar, sugar'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'In which Sicilian towns is couscous still eaten?', choix: ['Trapani and San Vito Lo Capo', 'Catania and Syracuse', 'Modica and Scicli'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'What goes into pasta with sardines?', choix: ['Wild fennel, raisins, pine nuts and saffron', 'Cream and bacon', 'Only tomato and basil'], bonne: 0, ancre: 'arabe', niveau: 'facile' },
      { q: 'What defines caponata?', choix: ['Sweet and sour: vinegar and sugar', 'Fierce chilli heat', 'Cooking over a wood fire'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Frutta martorana is made of…', choix: ['Almond paste', 'Sugar paste', 'Modica chocolate'], bonne: 0, ancre: 'arabe', niveau: 'moyen' },
      { q: 'Cassata may be named after qas‘ah, which means…', choix: ['The bowl it was shaped in', 'Ricotta', 'A religious feast'], bonne: 0, ancre: 'arabe', niveau: 'difficile' },
      { q: 'In January 1945, where did the “Non si parte!” revolt burn hottest?', choix: ['In the province of Ragusa', 'In Palermo', 'In Calabria'], bonne: 0, ancre: 'histoire', niveau: 'facile' },
      { q: 'What did Sicilians rise up against in January 1945?', choix: ['The call-up of their young men', 'The price of bread', 'The closing of the mines'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'What did Maria Occhipinti, five months pregnant, do on 4 January 1945?', choix: ['She lay down in front of the army truck', 'She hid the boys in her cellar', 'She wrote to the prefect'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'How long did the “Comiso Republic” last?', choix: ['Six days', 'Six weeks', 'Six months'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'What were the Sicilian Fasci of 1891-1894?', choix: ['Leagues of peasants, sulphur miners and artisans', 'An early fascist party', 'A religious brotherhood'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'What happened at Portella della Ginestra on 1 May 1947?', choix: ['A shooting into the May Day crowd', 'An eruption of Etna', 'A general strike'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'Who wrote “Una donna di Ragusa”?', choix: ['Maria Occhipinti', 'Leonardo Sciascia', 'Elio Vittorini'], bonne: 0, ancre: 'livres', niveau: 'facile' },
      { q: '“I più non ritornano” tells the story of…', choix: ['The retreat from Russia', 'The Allied landing in Sicily', 'The building of the motorway'], bonne: 0, ancre: 'livres', niveau: 'moyen' },
      { q: 'Which book contains “everything must change so that nothing changes”?', choix: ['Il Gattopardo', 'I Malavoglia', 'Conversazione in Sicilia'], bonne: 0, ancre: 'livres', niveau: 'moyen' },
      { q: 'What is Sciascia’s “Il giorno della civetta” about?', choix: ['The mafia, when its existence was still denied', 'Tuna fishing', 'The 1693 earthquake'], bonne: 0, ancre: 'livres', niveau: 'difficile' },
      { q: 'Carlo Levi’s “Le parole sono pietre” tells of…', choix: ['Three journeys in Sicily and the struggle for land', 'A stay in Venice', 'The story of Modica chocolate'], bonne: 0, ancre: 'livres', niveau: 'difficile' },
      { q: 'What did survivors call the marches to the Russian camps?', choix: ['The “davai” marches', 'The white marches', 'The Don marches'], bonne: 0, ancre: 'histoire', niveau: 'moyen' },
      { q: 'Of the Italian prisoners in the Soviet camps, how many came home?', choix: ['About ten thousand', 'Nearly all of them', 'None'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
      { q: 'When were the last Italian prisoners in Russia freed?', choix: ['In 1954, after Stalin’s death', 'In 1945, at the end of the war', 'In 1948'], bonne: 0, ancre: 'histoire', niveau: 'difficile' },
    ],
  },
  askMag: {
    text: 'We do not have this yet. Write to Mag: she will answer you, and we will add it here for the next ones.',
    textFor: 'For {what}: we do not have this yet. Write to Mag, she will answer you — and we will add it here for the next ones.',
    cta: 'Write to Mag',
    subject: 'A question from the site',
  },
  assistant: {
    label: 'Ask',
    title: 'A question?',
    placeholder: 'The wifi password, the water valve, a pizza…',
    send: 'Search',
    suggestions: ['The address', 'Turn the water on', 'The wifi password', 'Before leaving', 'Bins tonight?', 'Pizza?', 'Bread?', 'Emergencies'],
    sourceLabel: 'See the page',
    alsoTitle: 'Also',
    noneTitle: 'I cannot find it.',
    noneText: 'Nothing on the site answers that — and I would rather say so than make something up. Write to Mag: she will answer, and we will add it here for the next ones.',
    close: 'Close',
    clear: 'Clear',
  },
  wastePage: {
    eyebrow: 'Waste sorting',
    title: 'Which bin, which evening',
    intro: 'In Cava d’Aliga each kind of waste has its day. Bins go out the evening before: the truck comes early.',
    today: 'Tonight',
    tomorrow: 'Tomorrow evening',
    noneToday: 'Nothing to put out',
    eveningNote: 'Bins go out in the evening, not in the morning — by then the truck has been. If you miss the round before leaving, leave the bags on the terrace, never in the street.',
    changeNote: 'These days were noted down by Mag, and they change: the town alters them for public holidays, in summer, or when it changes contractor. A bin put out on the wrong evening stays there a week — if in any doubt, check the official page, and tell Mag if it no longer says what we say.',
    officialLabel: 'The town’s official calendar',
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
      title: 'Our addresses',
      intro: 'Shops, restaurants, markets and useful contacts: our personal recommendations to live Cava d’Aliga like a local.',
    },
    'la-region': {
      eyebrow: 'The region',
      title: 'Discover south-east Sicily',
      intro: 'Scicli, Ragusa, the baroque of Val di Noto, the beaches and the Iblei countryside.',
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
        icon: '⛴️',
        title: 'Coming by car',
        links: [
          { label: 'GNV — Genoa ↔ Palermo', url: 'https://www.gnv.it/en/ferries-destinations/sicily/genoa-palermo' },
          { label: 'Caronte & Tourist — crossing the strait', url: 'https://www.carontetourist.it/' },
        ],
        items: [
          'The boat from Genoa — by far the restful one. GNV sails in the evening, the crossing takes about twenty hours, and you land in Palermo the next day with the car loaded and the whole drive through France behind you. About 3 h left to the house.',
          'Driving down the boot — you drive to Calabria and board for Messina. Careful: the ferry does not leave from Reggio Calabria itself but from Villa San Giovanni, a few kilometres earlier, where the motorway ends. The crossing takes about twenty minutes, no booking needed, and roughly 3 h of road remain.',
          'Between the two it is a question of tiredness: Genoa costs you a night in a cabin and spares you the whole of southern Italy at the wheel.',
        ],
      },
      {
        icon: '🚗',
        title: 'Reach Casa Cava d’Aliga',
        links: [
          { label: 'AST — timetables', url: 'http://www.aziendasicilianatrasporti.it:8080/' },
          { label: 'Trenitalia', url: 'https://www.trenitalia.com/' },
          { label: 'Goldcar', url: 'https://www.goldcar.es/' },
        ],
        items: [
          'AST bus — from Catania airport to Modica, Scicli, Donnalucata and Pozzallo.',
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
      { icon: 'drop', title: 'Water', items: ['To turn the water on: the valve is in the laundry room at the back, on the wall between the washing machine and the sink. The laundry-room key is right there, in the little chest of drawers in the living-room sideboard.', 'The water heater is in the bathroom, inside the shower.'] },
      { icon: 'bottle', title: 'Do not drink the tap water', items: ['Do not drink it, and do not use it for ice cubes either. Drinking water is bought in bottles — every supermarket nearby sells it, by the pack.', 'For everything else it is perfectly fine: cooking, pasta, coffee, washing fruit and vegetables, the dishes and the shower.'] },
      { icon: 'flame', title: 'Gas', items: ['Mormina Gas, Via Tolstoj — he sells the bottles, delivers to your door and repairs cookers. His details are further down, in the contacts.'] },
      { icon: 'signal', title: 'Wifi', items: ['Network: cacestlaissetomber', 'Password: jamonito', 'The wifi runs on a top-up system: contact me before you arrive so I can recharge it.'] },
      { icon: 'key', title: 'Laundry room', items: ['The laundry-room key is in the little chest of drawers, inside the living-room sideboard. It is in plain sight — you will spot it straight away.'] },
      { icon: 'box', title: 'The bed linen', items: ['In the wardrobe drawer, in the small bedroom.'] },
      { icon: 'sun', title: 'No air conditioning', items: ['The house has none — worth knowing before you arrive in August. It is kept cool the old way: shutters closed through the hot hours, everything thrown open in the evening when the air turns.'] },
      { icon: 'leaf', title: 'Watering the plants', items: ['Water them every three or four days, about 3 litres per plant.', 'Two jasmines — one at the front, one at the back — and two bougainvilleas at the back. Every other plant in the house follows the same rhythm.'] },
      { icon: 'wave', title: 'The beach shower', items: ['On your way back from the sea, use the shower at the edge of the beach. The sand you carry back ends up in the pipes — that is how plumbing trouble starts.'] },
    ],
  },
  depart: {
    eyebrow: 'Departure',
    title: 'Leaving the house with peace of mind',
    intro: 'The short checklist to tick off before you close the door.',
    checklistTitle: 'Before you close the door',
    checklistNote: 'Tick as you go — nothing is saved, it is just so you forget nothing.',
    checklist: [
      'Turn off the water: the street valve, at the corner, down to the right — perpendicular = closed.',
      'Turn off the electricity: the switches outside, on the front terrace, to the right of the door.',
      'Close the gas bottle.',
      'Empty the fridge, unplug it and leave the door ajar so it does not go mouldy.',
      'Put the bins out according to the day’s collection. Missed the round? Leave them on the terrace, never in the street.',
      'Bring in the hammock fabric, the little wooden bench and the wooden stools. Nothing wooden survives a winter outdoors — only the hammock frame stays in place.',
      'Close shutters and windows.',
      'Wash the laundry before you leave — used sheets and towels — and make the beds up again for the next people. Clean sheets are in the wardrobe drawer in the small bedroom.',
      'Still damp when you close the door? Leave it hanging somewhere in the house, never folded in the basket.',
      'Last sweep: chargers, bathroom, terrace, under the beds.',
      'Put the laundry-room key back in the little chest of drawers, inside the living-room sideboard — that is where the next people will look.',
      'Lock up and put the keys back where they belong.',
    ],
  },
};

/** Exporte pour pouvoir interroger l'index de « Demander » hors du navigateur. */
export const DICTS: Record<Lang, Dict> = { fr: FR, it: IT, en: EN };
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
