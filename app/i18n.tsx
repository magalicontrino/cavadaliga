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
  salvaPage: { title: string; intro: string; historyTitle: string; storyText: string[]; storyOpen: string; storyOpenCta: string; storyOpenSubject: string; treeTitle: string; treeNote: string; treePaternal: string; treeMaternal: string; treeWife1: string; treeWife2: string; treeMarriage1: string; treeMarriage2: string; treeToday: string; treeGreat: string; treeGreat2: string; treeDeeper: string; treeGen5: string; treeGen6: string; treeGen7: string; treeGen8: string; treeAbout: string; treeBefore: string; treeAfter: string; treeWed: string; treeWedAbout: string; treeBuried: string; treeParents: string; treeChildren: string; treeQuestionsTitle: string; treeAdd: string; treeAddSubject: string; treeExample: string; treeOpen: string; treeClose: string; treeOpenAll: string; treeCloseAll: string; treeKid: string; treeKids: string; treeSideFather: string; treeSideMother: string; treeSideUs: string };
  // La page du calendrier des sejours. Son `title` sert AUSSI de titre aux CTA
  // qui pointent vers elle, depuis l'accueil et depuis les evenements.
  stayPage: {
    title: string;
    intro: string;
    // La couleur ne dit plus « occupe » mais QUI est la. `occupied` a donc
    // disparu au profit de trois degres de parente ; `tentative` reste, mais
    // ne se lit plus a la couleur — voir Occupancy.tsx.
    legend: { mag: string; close: string; inlaw: string; family: string; outside: string; tentative: string; free: string };
  };
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
    /*
     * `lien` est FACULTATIF : la plupart de ces fiches n'ont rien a montrer sur
     * une carte. Celle du bazar, si — Mag : « mets le lien vers le google map ».
     * Une adresse qu'on ne peut pas ouvrir d'un doigt ne sert a rien quand on
     * cherche un maillot oublie un dimanche.
     */
    facts: { icon: string; title: string; text: string; lien?: string; lienLabel?: string }[];
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
  /*
   * LA PASTASCIUTTA ANTIFASCISTE. Mag a envoye le sujet ; le recit, la recette
   * et le livre sont verifies aux sources listees dans `sourcesData.ts`.
   */
  pastaPage: {
    eyebrow: string;
    title: string;
    intro: string;
    word: { title: string; text: string };
    story: { title: string; text: string }[];
    brothers: string;
    recipe: { title: string; intro: string; ingredients: string[]; steps: string[]; note: string };
    shelf: string;
  };
  /*
   * VALGUARNERA CAROPEPE. Le village de Salvatore, et un champ de bataille de
   * juillet 1943 — quatre ans avant sa naissance.
   */
  valguarneraPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { title: string; text: string }[];
    family: string;
    note: string;
  };
  /*
   * LES DEUX SYMBOLES qu'on voit partout en Sicile, et dont personne
   * n'explique jamais l'histoire. Les photos viennent de Mag.
   */
  symbolsPage: {
    eyebrow: string;
    title: string;
    intro: string;
    trinacria: { title: string; text: string; alt: string; caption: string };
    teste: { title: string; text: string; alt: string; caption: string };
    note: string;
  };
  /* LES LEGENDES SICILIENNES. Huit recits, du detroit de Messine a l'Etna. */
  legendsPage: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { title: string; place: string; text: string }[];
    note: string;
  };
  /* LA SCOPA. Le jeu dont une carte sert de logo au site. */
  scopaPage: {
    eyebrow: string;
    title: string;
    intro: string;
    suitsAlt: string;
    suitsCaption: string;
    rules: { title: string; text: string }[];
    scoreTitle: string;
    score: { label: string; text: string }[];
    primieraTitle: string;
    primieraText: string;
    primiera: { carte: string; points: string }[];
    note: string;
  };
  /* Le Val di Noto : huit villes, un seisme, et quatre d'entre elles ici. */
  unescoNote: { title: string; quake: string; towns: string; near: string; syracuse: string };
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
  /** Le mot « Sources », devant les liens discrets des sections explicatives. */
  sourcesLabel: string;
  /** Le repli du tri sur telephone : vingt boutons n'y tiennent pas deplies. */
  filtersMore: string;
  filtersLess: string;
  /** Les fleches du calendrier : elles n'ont pas de texte, il leur faut un nom. */
  monthsPrev: string;
  monthsNext: string;
  regionFilter: {
    all: string;
    places: string;
    customs: string;
    specialties: string;
    drinks: string;
    coffee: string;
    pasta: string;
    symbols: string;
    legends: string;
    scopa: string;
    arab: string;
    /** Rassemble les sept sections venues de « Sons & images » en un seul bouton. */
    sounds: string;
    etna: string;
    fauna: string;
    /** Les jeux de plage. */
    sports: string;
    books: string;
    history: string;
    /** Le cours d'italien : un theme de quiz qui vit sur une AUTRE page. */
    italian: string;
    // Les deux themes du quiz de la page famille.
    story: string;
    tree: string;
    valguarnera: string;
    // Les themes des quiz poses sur les pages pratiques.
    arrival: string;
    leaving: string;
    parking: string;
    money: string;
    clean: string;
    trip: string;
    waste: string;
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
    backToTop: string;
    songsTitle: string;
    songsIntro: string;
    songsWords: string;
    songsPoint: string;
    songsListen: string;
    songsListenSpotify: string;
    songsAll: string;
    songsGenres: Record<string, string>;
    elsewhereTitle: string;
    elsewhereIntro: string;
    assimilNote: string;
    planTitle: string;
    planIntro: string;
    level1: string;
    level2: string;
    level3: string;
    levelAll: string;
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
    /** Le renvoi vers les questions d'italien du quiz de « La region ». */
    drillQuiz: string;
    drillIntro: string;
    check: string;
    good: string;
    wrong: string;
    next: string;
    again: string;
    score: string;
    progress: string;
    start: string;
    menuLabel: string;
    tocOpen: string;
    answerCta: string;
    answerChange: string;
    sheetClose: string;
    /*
     * Le resume de chaque carte, RANGE PAR NOM DE SECTION et non par position.
     *
     * C'etait une liste : la sixieme phrase allait a la sixieme carte. En
     * inserant « Par les chansons » au milieu, tout ce qui suivait s'est
     * decale d'un cran — la carte des chansons annonçait « s'entrainer, une
     * question a la fois ». Un rangement par position se casse en silence des
     * qu'on ajoute quelque chose ; un rangement par nom, jamais.
     */
    planDesc: Record<string, string>;
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
  /**
   * Les JEUX DE PLAGE — Mag : « rajoute les sports dans region, tambourin et
   * petanque sur le sable, et trouve d'autres choses si tu veux, renseigne-toi ».
   *
   * Verifie plutot que devine : ce que Mag appelle le tambourin s'appelle
   * `racchettoni` en italien — il descend bien du « tamburello da spiaggia »,
   * mais personne ne le demandera sous ce nom au marchand de jouets. Et les
   * boules de Donnalucata ne sont pas une image d'Epinal : la presse locale a
   * raconte en 2023 les memes retraites qui s'y retrouvent depuis plus de
   * cinquante ans.
   */
  sportsPage: {
    eyebrow: string;
    title: string;
    intro: string;
    facts: { icon: string; title: string; text: string }[];
    note: string;
  };
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
    /** Le meme jeu, sur la page famille : il ne parle pas de la region. */
    familyTitle: string;
    familyIntro: string;
    /** Et le meme jeu, au bas du cours d'italien. */
    italianTitle: string;
    italianIntro: string;
    /** Les quiz des pages pratiques. */
    houseTitle: string;
    houseIntro: string;
    tripTitle: string;
    tripIntro: string;
    wasteTitle: string;
    wasteIntro: string;
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
    'À deux kilomètres de la maison, la côte cesse d’être une plage : une falaise basse, creusée par l’eau, qu’on longe par une piste de terre jusqu’à Sampieri. On y trouve la Grotta dei Contrabbandieri — la grotte des Contrebandiers — où la mer entre par un bras d’eau qui s’allume quand la lumière tombe bas, et « a spaccazza », une descente naturelle taillée dans une fissure si étroite qu’on n’y passe qu’un par un. À la pointe, une bâtisse abandonnée avec sa guérite au bord du vide : ce n’est pas tout à fait un phare, c’est la casa del finanziere, l’ancien poste des douaniers, où Montalbano a tourné. Autour, des agaves, des figuiers de Barbarie, des câpriers et des palmiers nains.',
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
    ['La grotte des Contrebandiers, où la mer entre.', '« A spaccazza » : une descente dans une fissure de la falaise.', 'La casa del finanziere, ancien poste de douane pris pour un phare.', 'Palmiers nains, agaves et figuiers de Barbarie.', 'Piste de terre jusqu’à Sampieri.'],
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
  ], storyOpen: 'Cette histoire s’écrit à plusieurs. Une date, un lieu, un nom, une anecdote, une photo — envoyez-les, et ils prendront leur place ici. Le plus utile : dites de qui vous parlez, quand, et où. C’est ce qui permet de raccrocher chaque morceau au bon endroit.', storyOpenCta: 'Ajouter à l’histoire', storyOpenSubject: 'Histoire de la famille — j’ai quelque chose à ajouter', treeTitle: 'Arbre généalogique', treeNote: 'Ce que la famille nous a transmis. Il reste des blancs — ils sont listés en bas, et chacun peut les combler.', treePaternal: 'Grands-parents paternels', treeMaternal: 'Grands-parents maternels', treeWife1: '1re épouse', treeWife2: '2e épouse', treeMarriage1: '1er mariage', treeMarriage2: '2e mariage', treeToday: 'Aujourd’hui', treeGreat: 'Arrière-grands-parents', treeGreat2: 'Arrière-arrière-grands-parents', treeDeeper: 'Remonter plus loin', treeGen5: '5 générations en arrière', treeGen6: '6 générations en arrière', treeGen7: '7 générations en arrière', treeGen8: '8 générations en arrière', treeAbout: 'vers', treeBefore: 'avant', treeAfter: 'après', treeWed: 'mariés en', treeWedAbout: 'mariés vers', treeBuried: 'inhumés à', treeParents: 'Les parents', treeChildren: 'Les enfants', treeQuestionsTitle: 'Ce qu’il nous manque', treeAdd: '+ Ajouter ma branche', treeAddSubject: 'Arbre généalogique — ma branche', treeExample: 'Il manque du monde, et des dates — dites-nous ce que vous savez.', treeOpen: 'Déplier', treeClose: 'Replier', treeOpenAll: 'Tout déplier', treeCloseAll: 'Tout replier', treeKid: 'enfant', treeKids: 'enfants', treeSideFather: 'Côté Contrino', treeSideMother: 'Côté Lux', treeSideUs: 'Nous' },
  stayPage: { title: 'Le calendrier', intro: 'Les périodes où la maison est occupée, pour se coordonner en famille.', legend: { mag: 'Mag', close: 'Famille proche', inlaw: 'La belle-famille', family: 'Les cousins', outside: 'Hors famille', tentative: 'À confirmer', free: 'Libre' } },
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
    intro: 'Ce qui se fait, et ce qui ne se fait pas.',
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
      {
        icon: 'wave',
        title: 'Le maillot toute la journée — mais pas partout',
        text: 'À Cava d’Aliga, la journée s’habille de peu : un maillot, un paréo, et c’est réglé. La plage est à deux mètres, il fait chaud, et personne ne se change pour aller chercher le pain. Les vrais vêtements ne servent qu’à sortir du village — et là, attention. Plusieurs communes siciliennes interdisent par arrêté de circuler en maillot ou torse nu dans leur centre — à Favignana, Marettimo et Levanzo, l’amende va de 25 à 150 €, et San Vito Lo Capo a le même règlement. Scicli n’en a pas, à notre connaissance. Un tee-shirt dans le sac, et la question ne se pose plus.',
      },
      {
        icon: 'sun',
        title: 'Le monokini : légal, mais on ne le fait pas',
        text: 'Aucune loi italienne ne l’interdit — la Cour de cassation l’a tranché en 2000, au terme de presque trente ans de procédures. Mais les communes et les plages privées peuvent le refuser, et sur une plage de familles comme ici, l’usage suffit : personne ne le fait. Ce n’est pas une règle affichée, c’est une habitude, et c’est plus fort qu’un panneau.',
      },
      {
        icon: 'bag',
        title: 'Voyagez léger, vraiment',
        text: 'Il fait chaud, la mer est à deux mètres, et la maison a déjà tout. On n’a besoin de presque rien : un maillot, de quoi se couvrir le soir, et des chaussures fermées si vous marchez dans la campagne. Le premier repas se fait en dix minutes avec des tomates, de la mozzarella et un filet d’huile. Pour les vêtements en revanche, rien à Cava d’Aliga : le village n’en vend pas. Le bazar du centre commercial Max, à deux kilomètres et demi — cinq minutes de voiture — dépanne très bien en premier prix d’été : un maillot oublié, des tongs, un tee-shirt.',
        lien: 'https://maps.app.goo.gl/QERUZZMUWQHtRFrA6',
        lienLabel: 'Le centre commercial sur la carte',
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
  pastaPage: {
    eyebrow: '25 juillet 1943',
    title: 'La pastasciutta antifasciste',
    intro: 'Le jour où Mussolini est tombé, une famille de paysans a fait cuire des quintaux de pâtes et les a distribuées à tout son village. Cinq mois plus tard, les sept frères étaient fusillés. C’est la fête la plus tendre et la plus terrible de la cuisine italienne, et on la refait chaque 25 juillet.',
    word: {
      title: 'D’abord, le mot',
      text: 'Pastasciutta, c’est « pâte sèche » : la pâte qu’on égoutte et qu’on assaisonne, par opposition à la pâte en bouillon. Le mot est familier, régional, et il dit le plat du dimanche — celui du ragù, du pomodoro e basilico, de la cacio e pepe. C’est le premier plat des repas de famille, pas celui des jours ordinaires.',
    },
    story: [
      {
        title: 'Une famille, sept frères',
        text: 'Les Cervi sont des métayers des Campi Rossi, à Gattatico, dans la province de Reggio d’Émilie. Alcide, le père, né en 1875 ; Genoeffa Cocconi, la mère, née en 1876 ; et sept fils. Catholiques, paysans, et têtus : ils achètent le premier tracteur du coin, ils montent une bibliothèque itinérante pour que le village lise, et ils cachent chez eux des prisonniers évadés et des antifascistes en fuite.',
      },
      {
        title: 'Le jour où le fascisme tombe',
        text: 'Le 25 juillet 1943, Mussolini est destitué. Les Cervi ne font pas un discours : ils font à manger. Ils prennent le fromage à crédit à la laiterie, Alcide s’engage à fournir le beurre gratuitement pendant un temps, les voisins donnent la farine. Des quintaux de pastasciutta cuisent et sont distribués sur la place de Campegine, à qui veut. Alcide dira que l’eau qui bouillait « sonnait comme une symphonie », et que ce fut « le plus beau discours sur la fin du fascisme ».',
      },
      {
        title: 'Cinq mois plus tard',
        text: 'Le 25 novembre 1943, une rafle fasciste emporte les sept frères et leur père. Le 28 décembre, les sept sont fusillés au champ de tir de Reggio d’Émilie. Genoeffa mourra de chagrin en 1944. Alcide, lui, sort de prison et vit jusqu’en 1970 — il a quatre-vingt-quinze ans. On lui demande comment il a fait. Il répond : « Dopo un raccolto ne viene un altro » — après une récolte il en vient une autre.',
      },
      {
        title: 'Et depuis, chaque 25 juillet',
        text: 'On refait la pastasciutta. À Gattatico, dans la maison devenue le Musée Cervi, et partout en Italie où des gens s’organisent pour ça. C’est une fête qui se mange : on ne commémore pas des morts, on refait le repas des vivants.',
      },
    ],
    brothers: 'Gelindo (1901), Antenore (1904), Aldo (1909), Ferdinando (1911), Agostino (1916), Ovidio (1918), Ettore (1921).',
    recipe: {
      title: 'La recette',
      intro: 'Elle est d’une simplicité désarmante, et c’est le sujet : en 1943, le beurre et le parmesan étaient une fête. Rien à ajouter, surtout pas de crème.',
      ingredients: [
        '500 g de pâtes courtes ou de tagliatelles',
        '100 g de beurre, à température ambiante',
        '150 g de parmesan fraîchement râpé',
        'Du gros sel pour l’eau',
        'Une louche d’eau de cuisson',
      ],
      steps: [
        'Faites bouillir une grande quantité d’eau et salez-la franchement.',
        'Cuisez les pâtes al dente, et gardez une louche d’eau de cuisson avant d’égoutter.',
        'Égouttez, remettez dans la casserole hors du feu, ajoutez le beurre coupé en morceaux et mélangez jusqu’à ce qu’il disparaisse.',
        'Ajoutez le parmesan en pluie, et un peu d’eau de cuisson : c’est elle qui lie et rend crémeux.',
        'Servez tout de suite, et pour beaucoup de monde — c’est le seul point non négociable.',
      ],
      note: 'Ce jour-là, il n’y avait ni tomate ni viande. Le beurre et le fromage suffisaient à faire un festin, et c’est précisément ce que la fête raconte.',
    },
    shelf: 'Trois livres racontent cette famille — le témoignage du père, une bande dessinée et un roman à thèse. Ils sont sur l’étagère, dans « Des livres ».',
  },
  valguarneraPage: {
    eyebrow: 'Valguarnera Caropepe',
    title: 'Le village d’où l’on vient',
    intro: 'À 590 mètres d’altitude, dans la province d’Enna, au centre exact de la Sicile — le point le plus loin de la mer qu’on puisse trouver sur cette île. C’est là qu’est né Salvatore, le 26 janvier 1947. Et c’est là que la guerre est passée, trois ans et demi plus tôt.',
    facts: [
      {
        title: 'Un carrefour à tenir',
        text: 'À partir du 17 juillet 1943, les commandants allemands en Sicile commencent à craindre que leur route d’évacuation vers l’Italie continentale soit coupée. Ils laissent des arrière-gardes dans les villages perchés qui commandent les grands carrefours. Valguarnera est l’un d’eux.',
      },
      {
        title: 'Le 17 juillet, sur la route 117',
        text: 'Piazza Armerina prise, la 3e Brigade d’infanterie canadienne monte vers le nord. Le Carleton and York Regiment est en tête quand il essuie les tirs des avant-postes. Les chars du Three Rivers Regiment forcent les Allemands à se replier dans les collines ; le Royal 22e Régiment repart, puis bute sur un énorme cratère de mines et sur un autre groupe allemand. Ils passent la nuit retranchés là.',
      },
      {
        title: 'Le 18 juillet, le Monte della Forma',
        text: 'Le Royal 22e Régiment et le Carleton and York montent vers le carrefour au sommet du Monte della Forma, pendant que le West Nova Scotia Regiment contourne par l’ouest pour couper la route 117 et interdire la retraite. À l’est, les compagnies du Hastings and Prince Edward Regiment ont traversé les champs toute la nuit ; au matin, elles barrent la route qui sort du village. Le Royal Canadian Regiment tente la ville et se heurte au terrain, aux tirs allemands, et à la crainte d’une contre-attaque.',
      },
      {
        title: 'Le soir, plus personne',
        text: 'À la nuit tombée, la 3e Brigade tient le carrefour et les Allemands décrochent vers le nord. La 1re Brigade, à court d’appui feu, attend l’obscurité pour envoyer sa réserve — le 48th Highlanders of Canada — dans Valguarnera. Ils n’y trouvent aucun Allemand. Le village est pris sans un coup de feu de plus.',
      },
    ],
    family: 'Trois ans et demi plus tard, Salvatore naît dans ce village. Son père Angelo est rentré des camps russes ; il se retrouve veuf avec un bébé de six mois. Plus tard, quand la famille reviendra de Belgique pour l’été, on ne filera pas droit à la mer : on passait d’abord par Valguarnera, voir la famille et pépé Angelo. La maison de Cava d’Aliga, elle, n’est entrée dans la famille qu’il y a une cinquantaine d’années.',
    note: 'L’armée canadienne porte « Valguarnera » comme honneur de bataille, rattaché à « Sicile, 1943 ».',
  },
  symbolsPage: {
    eyebrow: 'Ce qu’on voit partout',
    title: 'La Trinacria et les têtes de Maure',
    intro: 'Deux objets qu’on croise sur tous les balcons, tous les murs et tous les étals de l’île — et dont presque personne ne raconte l’histoire. L’une est vieille de vingt-trois siècles. L’autre est un meurtre.',
    trinacria: {
      title: 'La Trinacria, ou triskèle',
      text: 'Le nom vient du grec : « trois pointes ». Ce sont les trois caps de la Sicile — Lilibeo à l’ouest, Peloro au nord-est, Passero au sud-est. Au centre, une tête de femme : Hybla, déesse de la fertilité. Les trois jambes pliées tournent autour d’elle, et l’île entière tient dans ce mouvement. Les serpents viennent de la tradition grecque ; les épis de blé ont été ajoutés par les Romains, pour qui la Sicile était le grenier de l’Empire — la mythologie en attribue le don à Cérès, qui aurait appris l’agriculture aux Siciliens. Le symbole apparaît sur les monnaies de Syracuse au IIIᵉ siècle avant notre ère. Il a fallu attendre l’an 2000 pour que l’Assemblée régionale en fasse officiellement le drapeau de la Sicile.',
      alt: 'Une Trinacria en fonte noire accrochée sur un mur de carreaux de ciment siciliens',
      caption: 'Trois jambes, une tête de femme, des épis : vingt-trois siècles tiennent là-dedans.',
    },
    teste: {
      title: 'Les têtes de Maure',
      text: 'La légende se passe à la Kalsa, le quartier arabe de Palerme, du temps de la domination musulmane. Une jeune fille très belle cultivait des plantes sur son balcon. Un Maure la vit, en tomba amoureux, et fut aimé en retour — jusqu’à ce qu’elle découvre qu’il avait une femme et des enfants en Orient. Elle le tua dans son sommeil, lui coupa la tête, et s’en servit comme pot de fleurs. Elle y planta du basilic. Le parfum était si beau que les voisins commandèrent des vases de céramique à l’imitation. Une seconde version raconte deux amants, elle sicilienne et noble, lui arabe, découverts par la famille et décapités tous les deux — leurs têtes exposées sur un balcon en avertissement. C’est pour ça qu’on les vend par paire.',
      alt: 'Une paire de têtes de Maure en céramique de Caltagirone, vert et blanc, un homme et une femme couronnés',
      caption: 'On les achète par deux, en souvenir des amants. Celles-ci sont de Caltagirone.',
    },
    note: 'Caltagirone est la capitale de la céramique sicilienne : la ville s’y est mise après la conquête normande de 1090, le tremblement de terre de 1693 l’a rasée, et elle s’est reconstruite en baroque — l’escalier de Santa Maria del Monte y monte encore, marche après marche, en majolique peinte.',
  },
  legendsPage: {
    eyebrow: 'Ce qu’on se raconte',
    title: 'Huit légendes siciliennes',
    intro: 'Une île qui a été grecque, arabe, normande et espagnole ne manque pas d’histoires. En voici huit, du détroit de Messine au cratère de l’Etna. Certaines expliquent un phénomène réel, d’autres une pierre qu’on peut encore toucher.',
    items: [
      {
        title: 'Cola Pesce',
        place: 'Messine',
        text: 'Fils de pêcheur, il nageait mieux que les poissons. Frédéric II le mit à l’épreuve : il jeta une coupe à la mer, Cola la rapporta ; puis sa couronne, il la rapporta encore ; puis un anneau, plus profond. Il n’est jamais remonté. Au fond, il avait découvert que la Sicile repose sur trois colonnes — au cap Peloro, au cap Passero et au cap Lilibeo — et que l’une d’elles, rongée par le feu de l’Etna, se fendait. Il est resté dessous pour la soutenir. Quand la terre tremble, c’est qu’il change d’épaule. La légende est attestée dès le XIIᵉ siècle.',
      },
      {
        title: 'Aréthuse',
        place: 'Syracuse',
        text: 'La nymphe Aréthuse fuyait le dieu-fleuve Alphée, qui la poursuivait. Elle supplia Artémis, qui la changea en source. Alphée se fit fleuve pour la rejoindre, et traversa la mer depuis la Grèce. La source porte son nom, à Ortygie, à quelques mètres du port — une eau douce qui sourd au bord de l’eau salée. On y voit encore pousser du papyrus.',
      },
      {
        title: 'La Fata Morgana',
        place: 'Le détroit de Messine',
        text: 'Par certaines conditions de température, la Calabre semble si proche qu’on la croirait accessible à pied — des villes flottent au-dessus de l’eau, à l’envers. La fée Morgane montrait ces terres enchantées aux marins pour les perdre. C’est un vrai mirage, qui porte encore son nom dans les livres d’optique, et qu’on peut voir aujourd’hui.',
      },
      {
        title: 'Charybde et Scylla',
        place: 'Le détroit de Messine',
        text: 'Sur une rive, Scylla, le monstre à six têtes qui attrapait les marins au passage. Sur l’autre, Charybde, le tourbillon qui engloutissait les navires entiers. Entre les deux, le passage le plus redouté de l’Antiquité — et l’expression qu’on emploie encore quand on n’a le choix qu’entre deux malheurs.',
      },
      {
        title: 'Mata et Grifone',
        place: 'Messine',
        text: 'Elle est sicilienne, il est un guerrier sarrasin ; il s’éprend d’elle, elle refuse, il se convertit pour l’épouser. De ce couple de géants, la ville a fait deux statues immenses qu’elle promène en procession chaque mois d’août. C’est la seule légende de la liste qui célèbre le mélange plutôt que le drame.',
      },
      {
        title: 'La baronne de Carini',
        place: 'Le château de Carini, près de Palerme',
        text: 'Laura Lanza, baronne de Carini, fut tuée par son propre père en 1563 pour adultère. On dit que son fantôme erre encore entre les murs, et qu’on l’entend les nuits de pleine lune. Un trésor y serait enterré, gardé par des esprits inquiets ; personne ne l’a trouvé. Le château, lui, existe et se visite.',
      },
      {
        title: 'Empédocle',
        place: 'L’Etna',
        text: 'Le philosophe d’Agrigente, fasciné par le feu, se serait jeté dans le cratère — pour prouver qu’il était un dieu, ou pour disparaître sans laisser de corps. Le volcan lui a rendu une seule chose : une sandale. C’est la fin la plus littéraire qu’un philosophe se soit inventée.',
      },
      {
        title: 'La Vieille au vinaigre',
        place: 'Palerme',
        text: 'Au XVIIᵉ siècle, une vieille femme du centre historique préparait des potions. On venait la voir en secret, surtout les jeunes femmes. Beaucoup disparaissaient. On retrouva des corps traités au vinaigre, pour en masquer l’odeur. Elle fut arrêtée et jugée. On dit que son esprit rôde dans les vieilles rues, et qu’on y sent parfois passer une odeur âcre.',
      },
    ],
    note: 'Les trois colonnes de Cola Pesce sont les trois caps de la Trinacria : Peloro, Passero, Lilibeo. La légende et le symbole racontent la même île, tenue par ses trois pointes.',
  },
  scopaPage: {
    eyebrow: 'Le jeu de la maison',
    title: 'La scopa, et ses règles',
    intro: 'C’est le jeu de cartes italien par excellence : celui des soirées de famille, des bars de village et des fins de repas qui s’étirent. Il se joue vite, il s’apprend en dix minutes, et il se rejoue toute une vie. Le logo de ce site est d’ailleurs une carte de scopa.',
    suitsAlt: 'Les quatre enseignes du jeu italien : bâton, denier, coupe et épée',
    suitsCaption: 'Les quatre enseignes : bastoni, denari, coppe, spade — bâtons, deniers, coupes, épées.',
    rules: [
      {
        title: 'Le jeu',
        text: 'Quarante cartes, quatre enseignes de dix : bâtons, deniers, coupes et épées. Pas de dame — les figures sont le valet (8), le cavalier (9) et le roi (10). L’as vaut 1. C’est tout ce qu’il faut savoir avant de commencer.',
      },
      {
        title: 'La donne',
        text: 'Trois cartes à chaque joueur, quatre posées face visible au milieu de la table. Quand tout le monde a joué ses trois cartes, on en redonne trois — et ainsi de suite jusqu’à épuisement du paquet. La table, elle, n’est plus jamais regarnie.',
      },
      {
        title: 'Prendre',
        text: 'On pose une carte. Si elle a la même valeur qu’une carte de la table, on prend celle-là — et on n’a pas le choix : si la valeur exacte est sur la table, on est obligé de la prendre, plutôt qu’une somme. Sinon, on peut prendre plusieurs cartes dont le total fait la valeur de la nôtre. Un 7 ramasse un 7, ou bien un 4 et un 3. Si rien ne correspond, la carte reste sur la table.',
      },
      {
        title: 'La scopa',
        text: 'Si votre prise vide entièrement la table, c’est une scopa — un balayage. Un point, immédiatement, et on le marque en posant la carte de travers dans son tas. Une seule exception : la scopa faite avec la toute dernière carte de la partie ne compte pas.',
      },
      {
        title: 'La fin',
        text: 'Les cartes qui restent sur la table à la fin vont au dernier joueur qui a pris. Ensuite on compte.',
      },
    ],
    scoreTitle: 'Le décompte, à la fin de chaque manche',
    score: [
      { label: 'Les scope', text: 'Un point par balayage, tout au long de la manche.' },
      { label: 'Les cartes', text: 'Un point à qui en a le plus. Il en faut au moins 21 sur 40.' },
      { label: 'Les deniers', text: 'Un point à qui a le plus de cartes de l’enseigne deniers. Il en faut au moins 6 sur 10.' },
      { label: 'Le settebello', text: 'Un point pour le 7 de deniers. Une seule carte, un point garanti — c’est la carte la plus disputée du jeu.' },
      { label: 'La primiera', text: 'Un point, et c’est le calcul le plus déroutant. Voir juste en dessous.' },
    ],
    primieraTitle: 'La primiera, expliquée',
    primieraText: 'On prend sa meilleure carte dans chacune des quatre enseignes, et on additionne — mais avec un barème à part, où le 7 vaut plus que le roi. Le plus haut total gagne le point. Le maximum théorique est 84 : quatre 7, un par enseigne. En cas d’égalité, personne ne marque.',
    primiera: [
      { carte: 'Le 7', points: '21 points' },
      { carte: 'Le 6', points: '18 points' },
      { carte: 'L’as', points: '16 points' },
      { carte: 'Le 5', points: '15 points' },
      { carte: 'Le 4', points: '14 points' },
      { carte: 'Le 3', points: '13 points' },
      { carte: 'Le 2', points: '12 points' },
      { carte: 'Les figures', points: '10 points' },
    ],
    note: 'On joue jusqu’à 11 points à deux, 16 à trois, 21 par équipes. Le jeu était déjà répandu dans toute l’Italie au XVIIIᵉ siècle, et viendrait de jeux espagnols passés par Naples.',
  },
  unescoNote: {
    title: 'Huit villes, un tremblement de terre',
    quake: 'Le 11 janvier 1693, un séisme de magnitude 7,4 rase le sud-est de la Sicile. Des dizaines de milliers de morts, et des villes entières à refaire. Des architectes siciliens formés à Rome les reconstruisent d’un seul mouvement, en baroque tardif — et pour la première fois en pensant aux secousses suivantes.',
    towns: 'L’UNESCO les a inscrites ensemble en 2002, sous le nom de « Villes du baroque tardif du Val di Noto » : Caltagirone, Catane, Militello, Modica, Noto, Palazzolo Acreide, Raguse et Scicli. Huit villes, un seul bien, une seule catastrophe à l’origine.',
    near: 'Quatre de ces huit villes sont à moins de 55 kilomètres de la maison : Scicli à 8, Modica à 20, Raguse à 28, Noto à 55. On peut donc voir la moitié d’un site du patrimoine mondial en une semaine, sans jamais faire plus d’une heure de route.',
    syracuse: 'Syracuse ne fait pas partie du Val di Noto : elle relève d’une inscription à part, avec la nécropole rupestre de Pantalica, en 2005. Et Caltagirone, la première de la liste, est la ville d’où viennent les têtes de Maure en céramique.',
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
  sourcesLabel: 'Sources :',
  filtersMore: 'Voir tous les thèmes',
  filtersLess: 'Réduire',
  monthsPrev: 'Mois précédents',
  monthsNext: 'Mois suivants',
  regionFilter: {
    all: 'Tout voir',
    places: 'Les lieux',
    customs: 'Us et coutumes',
    specialties: 'Spécialités',
    drinks: 'Vins & alcools',
    coffee: 'Le café', pasta: 'La pastasciutta', symbols: 'Trinacria & teste di moro', legends: 'Les légendes', scopa: 'La scopa',
    arab: 'Sicile arabe',
    sounds: 'Sons & images',
    etna: 'L’Etna',
    fauna: 'La faune',
    sports: 'Jeux de plage',
    books: 'Des livres',
    italian: 'L’italien',
    story: 'Le récit',
    tree: 'L’arbre', valguarnera: 'Valguarnera',
    arrival: 'La maison',
    leaving: 'Le départ',
    parking: 'Se garer',
    money: 'L’argent',
    clean: 'Propreté',
    trip: 'Le voyage',
    waste: 'Les poubelles',
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
    menuLabel: 'L’italien',
    tocOpen: 'Aller à une section',
    answerCta: 'Répondre',
    answerChange: 'Changer',
    sheetClose: 'Fermer',
    planDesc: {
      prononcer: 'Les sons de l’italien, et comment les dire juste.',
      parler: 'Des phrases entières, prêtes pour chaque situation.',
      presente: 'Le temps de tous les jours — demander, commander, se présenter.',
      passato: 'Raconter ce qui s’est déjà passé.',
      futuro: 'Dire ce qu’on fera, sans se tromper de terminaison.',
      chansons: 'Trois chansons, leurs mots, et ce qu’elles apprennent.',
      exercices: 'S’entraîner, une question à la fois, le score à la fin.',
      ailleurs: 'Où continuer : applis, livres et sites choisis.',
    },
    title: 'Parler italien ici',
    intro: 'Pas un cours de grammaire : de quoi se débrouiller dès le premier matin, puis comprendre ce qu’on dit. On commence par prononcer, on continue par des phrases entières, la grammaire vient après — et on s’entraîne à la fin.',
    backToTop: 'Remonter en haut de la page',
    songsTitle: 'Par les chansons',
    songsIntro: 'Une chanson entre par l’oreille et reste, là où une liste de mots s’efface. Pour chacune : de quoi elle parle, les mots à avoir en tête avant d’écouter, et ce qu’elle apprend de la langue.',
    songsWords: 'Les mots à connaître',
    songsPoint: 'Ce qu’elle apprend',
    songsListen: 'La fiche de la chanson',
    songsListenSpotify: 'Écouter, et lire le texte',
    songsAll: 'Toutes',
    songsGenres: { lutte: 'Luttes & mémoire', sicile: 'La Sicile', auteur: 'Chanson d’auteur' },
    elsewhereTitle: 'Continuer ailleurs',
    elsewhereIntro: 'Cette page n’a pas de son, et c’est sa limite : on n’apprend pas à prononcer une langue sans l’entendre. Voilà où aller pour ça — et pour les heures d’exercices qu’un site de famille ne fera jamais.',
    assimilNote: 'La méthode dont ce cours s’inspire est celle d’Assimil — leçons courtes, phrases entières, grammaire expliquée après coup. C’est un livre payant, et il vaut son prix si vous voulez aller vraiment loin.',
    planTitle: 'Le programme',
    planIntro: 'Dans l’ordre, du plus simple au plus exigeant. Rien n’oblige à tout faire : le niveau 1 suffit pour se débrouiller une semaine.',
    level1: 'Niveau 1 · débuter',
    level2: 'Niveau 2 · se débrouiller',
    level3: 'Niveau 3 · aller plus loin',
    levelAll: 'Tous niveaux',
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
    drillQuiz: 'Le quiz : les questions d’italien',
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
    intro: 'Six livres qui parlent de la Sicile ou s’y passent — et quatre qui racontent ce que des familles ont traversé ailleurs en Italie, de la retraite de Russie à la ferme des Cervi. Rien d’obligatoire : c’est une étagère, pas un programme.',
    linkLabel: 'La fiche du livre',
    list: [
      { titre: 'Una donna di Ragusa', auteur: 'Maria Occhipinti', annee: '1957', lien: 'https://it.wikipedia.org/wiki/Una_donna_di_Ragusa', text: 'Le livre d’ici. Maria Occhipinti avait vingt-trois ans et cinq mois de grossesse quand elle s’est couchée devant le camion militaire qui emportait les garçons de son quartier, à Ragusa, le 4 janvier 1945. Elle l’a payé de la déportation à Ustica, où elle a accouché, puis de la prison. Son autobiographie est passée inaperçue en 1957 et a fait l’effet d’une bombe à sa réédition en 1976.' },
      { titre: 'La plupart ne reviendront pas', auteur: 'Eugenio Corti', annee: '1947', lien: 'https://it.wikipedia.org/wiki/I_pi%C3%B9_non_ritornano', text: 'Le choix de Mag. Le journal d’un survivant de la retraite de Russie : vingt-huit jours d’encerclement dans la neige, écrits par un homme de vingt-deux ans qui en est sorti. Ce n’est pas un livre sicilien, mais il raconte ce que des milliers de familles d’ici ont vécu sans le dire — et cette maison en sait quelque chose.' },
      { titre: 'Le parole sono pietre', auteur: 'Carlo Levi', annee: '1955', lien: 'https://it.wikipedia.org/wiki/Carlo_Levi', text: 'Trois voyages en Sicile, entre les mines de soufre, les paysans qui occupent les terres et le souvenir tout frais de Portella della Ginestra. « Les mots sont des pierres » : le titre dit le livre. C’est le meilleur récit de ce que fut la lutte pour la terre dans l’île, écrit à chaud par quelqu’un qui écoutait.' },
      { titre: 'Il Gattopardo', auteur: 'Giuseppe Tomasi di Lampedusa', annee: '1958', lien: 'https://it.wikipedia.org/wiki/Il_Gattopardo', text: 'Le grand roman sicilien, écrit par un prince à la fin de sa vie et refusé par deux éditeurs avant de devenir un classique. La Sicile de 1860, un monde qui s’effondre et une phrase que tout le monde cite : « il faut que tout change pour que rien ne change ».' },
      { titre: 'Il giorno della civetta', auteur: 'Leonardo Sciascia', annee: '1961', lien: 'https://it.wikipedia.org/wiki/Il_giorno_della_civetta', text: 'Le livre qui a nommé ce dont on ne parlait pas. Un capitaine venu du Nord enquête sur un meurtre dans un village sicilien, et se heurte à un mur de silence. Sciascia écrivait à une époque où l’existence même de la mafia était officiellement discutée.' },
      { titre: 'Conversazione in Sicilia', auteur: 'Elio Vittorini', annee: '1941', lien: 'https://it.wikipedia.org/wiki/Conversazione_in_Sicilia', text: 'Un homme rentre voir sa mère en Sicile après quinze ans. Publié sous le fascisme, le livre dit tout sans jamais rien nommer — c’est pour cela qu’il a passé la censure, et c’est pour cela qu’il a compté.' },
      { titre: 'I Malavoglia', auteur: 'Giovanni Verga', annee: '1881', lien: 'https://it.wikipedia.org/wiki/I_Malavoglia', text: 'Une famille de pêcheurs, une barque, une dette, et la mer qui reprend tout. Verga écrit les pauvres sans les plaindre ni les embellir : c’est la Sicile d’avant les photos, celle des villages de la côte.' },
      { titre: 'I miei sette figli', auteur: 'Alcide Cervi', annee: '1955', lien: 'https://www.einaudi.it/catalogo-libri/storia/storia-contemporanea/i-miei-sette-figli-alcide-cervi-9788806221157/', text: 'Le père raconte lui-même. Sept fils fusillés le même jour, le 28 décembre 1943, et un paysan de soixante-huit ans qui sort de prison et retourne faire la terre avec les femmes et les petits-enfants restés là. Recueilli par Renato Nicolai, traduit dans de nombreuses langues : c’est la source la plus directe sur la famille dont on refait les pâtes chaque 25 juillet.' },
      { titre: 'I sette fratelli Cervi. Una famiglia antifascista', auteur: 'Federico Attardo', annee: '2024', lien: 'https://www.beccogiallo.it/negozio/biografie/i-sette-fratelli-cervi/', text: 'La même histoire en bande dessinée, faite avec l’Institut Cervi, prix Andersen 2025. Elle prend le temps de raconter la famille AVANT la Résistance : les paysans qui achètent le premier tracteur du coin, la bibliothèque itinérante, la maison ouverte aux fugitifs. On comprend mieux la suite quand on a vu d’où ils partaient.' },
      { titre: 'L’ultima notte dei fratelli Cervi', auteur: 'Dario Fertilio', annee: '2012', lien: 'https://www.marsilioeditori.it/libri/scheda-libro/3171306/l-ultima-notte-dei-fratelli-cervi', text: 'À lire en sachant ce que c’est : un ROMAN POLICIER, pas un livre d’histoire, avec un personnage inventé. Il défend une thèse contestée — que les Cervi auraient été isolés par la direction communiste de la Résistance, puis trahis par un infiltré. Ce que personne ne discute, c’est le reste : arrêtés le 25 novembre 1943, fusillés le 28 décembre par les fascistes.' },
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
  sportsPage: {
    eyebrow: 'Jeux de plage',
    title: 'Ce qu’on joue sur le sable',
    intro: 'Aucun de ces jeux ne demande de club, de licence ni de réservation. Une paire de raquettes en bois, trois boules, et l’après-midi passe. C’est aussi la façon la plus simple de parler à ses voisins de serviette : on prête, on compte les points, on recommence.',
    facts: [
      {
        icon: 'sun',
        title: 'I racchettoni',
        text: 'Deux raquettes en bois, une petite balle en caoutchouc, et le seul but est de ne PAS la faire tomber : on ne marque pas de point, on tient l’échange. C’est le jeu que Mag appelle le tambourin, et elle n’a pas tort — il descend du « tamburello da spiaggia » qu’on jouait déjà sur les plages italiennes au début du XXᵉ siècle. Sous sa forme actuelle, il date des années 1970, sur la riviera de Romagne. Demandez des « racchettoni » : c’est le mot écrit sur les paquets.',
      },
      {
        icon: 'tools',
        title: 'La balle au tambourin, le vrai sport',
        text: 'Mag a raison de l’appeler ainsi : le tambourin est un sport codifié, et l’ancêtre de ce qu’on joue sur le sable. Le terrain fait 80 mètres de long sur 18 à 20 de large, coupé par une ligne médiane — pas de filet. Cinq joueurs par équipe dehors, trois en salle : deux fonds, deux cordiers, un tiers. On compte comme au tennis — 15, 30, 45, jeu — et il faut treize jeux pour gagner. Le service change à chaque jeu, on change de camp tous les trois. L’instrument est un cercle de plastique cerclé de cuivre, tendu d’une toile synthétique, avec une poignée de cuir ; le premier a été fabriqué en 1861 par un tonnelier de Mèze, dans l’Hérault. L’Italie a son championnat depuis 1896 — mais dans le Nord, en Lombardie et en Vénétie, pas ici. En Sicile, c’est son cousin de plage qu’on trouve.',
      },
      {
        icon: 'cone',
        title: 'Le beach tennis',
        text: 'Né en Italie, et directement des racchettoni — mais avec un filet, un terrain et un vainqueur. La balle est plus grosse et moins dure, la raquette plus épaisse. C’est la version sportive du même geste : on y compte les points, et il y a des tournois tout l’été sur la côte.',
      },
      {
        icon: 'pin',
        title: 'Les boules sur le sable',
        text: 'Des tournois s’organisent sur place l’été — Mag le confirme, et c’est le genre de chose qu’on apprend en passant devant. Ce sont des boules EN BOIS — elle y tient, et elle a doublement raison. C’est le jeu de plage classique en Italie, vendu en coffret de bois, quand la pétanque française se joue en acier. Et c’est un retour aux origines : la boule a été d’argile, de pierre, puis de bois, et l’acier n’est arrivé qu’en 1927, à Saint-Bonnet-le-Château. Entre les deux, on jouait avec des boules cloutées — du bois recouvert d’une carapace de clous, inventée à Marseille en 1904 par Félix Rofritsch. La pétanque italienne s’appelle les bocce, et le cochonnet le pallino. La règle tient en une phrase : la boule la plus proche du pallino gagne, et on peut chasser celle de l’adversaire en la frappant — ça s’appelle une bocciata. Sur le sable, on aplanit une bande d’une quinzaine de mètres et on joue en douze points. À Donnalucata, ce n’est pas un jeu de vacanciers : les mêmes retraités s’y retrouvent tous les après-midi depuis plus de cinquante ans.',
      },
      {
        icon: 'walk',
        title: 'Le beach-volley et le football de plage',
        text: 'Les deux universels, et les deux se jouent ici comme partout : un filet tendu entre deux piquets, ou quatre sacs posés en guise de buts. Ils ne demandent rien d’autre que du monde — et c’est justement leur intérêt en vacances, où l’on est rarement le même nombre d’un jour à l’autre. Le sable ralentit tout : une mi-temps de football de plage fatigue comme un match entier sur herbe.',
      },
      {
        icon: 'wave',
        title: 'Le vent, en fin de journée',
        text: 'La brise se lève l’après-midi et forge une mer plus courte : c’est l’heure des planches. La côte de Scicli fait dix-huit kilomètres, et l’eau se hache dès qu’on s’éloigne des plages abritées, vers Sampieri. Rien de spectaculaire, mais de quoi naviguer — et de quoi rendre la baignade plus sportive si vous restez sans planche.',
      },
      {
        icon: 'walk',
        title: 'La passeggiata, qui est un sport',
        text: 'Ne riez pas : c’est l’exercice le plus pratiqué de Sicile. Le soir, quand la chaleur tombe, tout le village descend marcher sur le front de mer, dans les deux sens, pendant une heure. On ne va nulle part. On se montre, on s’arrête, on repart. C’est gratuit, ça se fait à tout âge, et c’est là qu’on croise les gens.',
      },
      {
        icon: 'tools',
        title: 'A strummula',
        text: 'La toupie sicilienne — dite aussi u tuppettu. Un morceau de bois tourné, une ficelle enroulée, deux traits à la craie par terre pour délimiter le terrain, et il s’agit de la faire tourner le plus longtemps possible. Ce n’est pas un jeu de plage mais un jeu de rue, et il a deux mille ans : Homère la décrit déjà dans l’Iliade. Si vous en voyez une chez un brocanteur, c’est ça.',
      },
    ],
    note: 'Les raquettes, les boules et les balles se trouvent dans n’importe quel bazar de bord de mer ou supermarché du coin, pour quelques euros — inutile de les emporter de France. Rien de tout cela ne se réserve : ça se pose sur le sable et ça commence.',
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
    familyTitle: 'Vous connaissez la famille ?',
    familyIntro: 'Le récit de Salva, et l’arbre. Trois réponses possibles à chaque fois, et tout ce qu’il faut savoir est écrit plus haut sur cette page — chaque réponse vous dit où aller relire.',
    italianTitle: 'Vous connaissez l’italien ?',
    italianIntro: 'Cinquante-cinq questions tirées de ce cours — prononciation, conjugaison, phrases utiles, mots des chansons. Trois réponses possibles à chaque fois, et chacune vous dit où aller relire.',
    houseTitle: 'Vous connaissez la maison ?',
    houseIntro: 'La maison, le départ, le stationnement, l’argent, la propreté. Tout ce qu’il faut savoir est écrit plus haut sur cette page — chaque réponse vous dit où aller relire.',
    tripTitle: 'Vous connaissez le trajet ?',
    tripIntro: 'Aéroports, ferries, routes. Tout ce qu’il faut savoir est écrit plus haut sur cette page — chaque réponse vous dit où aller relire.',
    wasteTitle: 'Vous connaissez le tri ?',
    wasteIntro: 'Trois questions sur les bacs et leurs soirs. Tout est écrit plus haut sur cette page.',
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
      { q: 'Combien de villes compte le site UNESCO du Val di Noto ?', choix: ['Huit', 'Cinq', 'Trois'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Quel événement a fait naître le baroque du Val di Noto ?', choix: ['Le séisme du 11 janvier 1693', 'Une éruption de l’Etna', 'La conquête normande'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Syracuse fait-elle partie du Val di Noto ?', choix: ['Non, elle a une inscription à part avec Pantalica', 'Oui, c’est la première de la liste', 'Non, elle n’est pas classée'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
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
      { q: 'Le monokini est-il interdit par la loi en Italie ?', choix: ['Non — la Cour de cassation l’a tranché en 2000', 'Oui, depuis 2000', 'Oui, mais seulement en Sicile'], bonne: 0, ancre: 'coutumes', niveau: 'difficile' },
      { q: 'Peut-on se promener en maillot dans le centre de toutes les villes siciliennes ?', choix: ['Non — certaines communes verbalisent de 25 à 150 €', 'Oui, partout', 'Non, c’est interdit dans toute la Sicile'], bonne: 0, ancre: 'coutumes', niveau: 'moyen' },
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
      { q: 'Que veut dire « pastasciutta » ?', choix: ['La pâte qu’on égoutte et qu’on assaisonne', 'Une pâte servie en bouillon', 'Une pâte cuite au four'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'Que fêtait la pastasciutta du 25 juillet 1943 ?', choix: ['La chute de Mussolini', 'La fin de la guerre', 'La fête du village'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'Combien de frères Cervi ont été fusillés le 28 décembre 1943 ?', choix: ['Sept', 'Trois', 'Neuf'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'Avec quoi les Cervi ont-ils assaisonné les pâtes ce jour-là ?', choix: ['Du beurre et du parmesan', 'De la tomate et du basilic', 'Un ragù de viande'], bonne: 0, ancre: 'pastasciutta', niveau: 'moyen' },
      { q: 'Dans quel village les pâtes ont-elles été distribuées ?', choix: ['Campegine', 'Gattatico', 'Reggio d’Émilie'], bonne: 0, ancre: 'pastasciutta', niveau: 'difficile' },
      { q: 'Qu’a répondu Alcide Cervi quand on lui a demandé comment il avait tenu ?', choix: ['Après une récolte il en vient une autre', 'Le temps efface tout', 'Il ne faut jamais oublier'], bonne: 0, ancre: 'pastasciutta', niveau: 'difficile' },
      { q: 'Que veut dire « Trinacria » ?', choix: ['Trois pointes, en grec', 'Terre du soleil', 'Île du milieu'], bonne: 0, ancre: 'symboles', niveau: 'facile' },
      { q: 'Qui est la tête au centre de la Trinacria ?', choix: ['Hybla, déesse de la fertilité', 'Méduse la Gorgone', 'Cérès'], bonne: 0, ancre: 'symboles', niveau: 'difficile' },
      { q: 'Qui a ajouté les épis de blé au symbole ?', choix: ['Les Romains', 'Les Grecs', 'Les Arabes'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'En quelle année la Trinacria est-elle devenue le drapeau officiel de la Sicile ?', choix: ['En 2000', 'En 1946', 'Au IIIᵉ siècle avant notre ère'], bonne: 0, ancre: 'symboles', niveau: 'difficile' },
      { q: 'Dans la légende, que plante la jeune fille dans la tête coupée ?', choix: ['Du basilic', 'Du jasmin', 'Un citronnier'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'Pourquoi vend-on les têtes de Maure par paire ?', choix: ['En souvenir des deux amants', 'Pour encadrer une porte', 'Parce qu’elles se font au tour par deux'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'Que soutient Cola Pesce au fond de la mer ?', choix: ['Une des trois colonnes qui portent la Sicile', 'Un trésor englouti', 'Le tombeau de Frédéric II'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'Selon la légende, pourquoi la terre tremble-t-elle en Sicile ?', choix: ['Cola Pesce change d’épaule', 'L’Etna se réveille', 'Charybde tourne plus vite'], bonne: 0, ancre: 'legendes', niveau: 'facile' },
      { q: 'En quoi la nymphe Aréthuse a-t-elle été transformée ?', choix: ['En source', 'En laurier', 'En oiseau'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'Qu’est-ce que la Fata Morgana ?', choix: ['Un mirage dans le détroit de Messine', 'Une fête de Palerme', 'Un vent du sud'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'Que le volcan a-t-il rendu d’Empédocle ?', choix: ['Une sandale', 'Son manteau', 'Rien du tout'], bonne: 0, ancre: 'legendes', niveau: 'difficile' },
      { q: 'Quelle légende sicilienne célèbre le mélange plutôt que le drame ?', choix: ['Mata et Grifone', 'La baronne de Carini', 'La Vieille au vinaigre'], bonne: 0, ancre: 'legendes', niveau: 'difficile' },
      { q: 'Combien de cartes compte un jeu de scopa ?', choix: ['Quarante', 'Cinquante-deux', 'Trente-deux'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'Quelles sont les quatre enseignes du jeu italien ?', choix: ['Bâtons, deniers, coupes, épées', 'Cœurs, piques, trèfles, carreaux', 'Soleils, lunes, étoiles, mers'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'Qu’est-ce qu’une « scopa » ?', choix: ['Une prise qui vide toute la table', 'Le 7 de deniers', 'La dernière carte du paquet'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'Quelle carte vaut un point à elle seule ?', choix: ['Le settebello, le 7 de deniers', 'Le roi de coupes', 'L’as de bâtons'], bonne: 0, ancre: 'scopa', niveau: 'moyen' },
      { q: 'Dans la primiera, combien vaut le 7 ?', choix: ['21 points', '10 points', '7 points'], bonne: 0, ancre: 'scopa', niveau: 'difficile' },
      { q: 'Si la valeur exacte de votre carte est sur la table, que devez-vous faire ?', choix: ['La prendre, vous n’avez pas le choix', 'Prendre plutôt une somme', 'Passer votre tour'], bonne: 0, ancre: 'scopa', niveau: 'difficile' },
      { q: 'Que mangent les geckos qui traversent le mur le soir ?', choix: ['Des moustiques', 'Des miettes', 'Rien, ils dorment'], bonne: 0, ancre: 'faune', niveau: 'facile' },
      { q: 'Y a-t-il des scorpions en Sicile ?', choix: ['Oui, mais leur piqûre est sans danger', 'Non, aucun', 'Oui, et ils sont mortels'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Où naissent les moustiques ?', choix: ['Dans l’eau immobile, même quelques centimètres', 'Dans les haies sèches', 'Sous les pierres chaudes'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Quel est le seul serpent venimeux de Sicile ?', choix: ['La vipère aspic', 'La couleuvre verte et jaune', 'Il n’y en a aucun'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'Que ne faut-il SURTOUT pas faire en cas de morsure de vipère ?', choix: ['Poser un garrot ou inciser', 'Appeler les secours', 'Immobiliser le membre'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      // ── Les jeux de plage. Chaque reponse est ecrite dans la section « sports ».
      { q: 'Comment s’appelle en italien le jeu de raquettes en bois de la plage ?', choix: ['I racchettoni', 'Il pallino', 'La bocciata'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'Aux racchettoni, quel est le but du jeu ?', choix: ['Ne pas faire tomber la balle — on tient l’échange', 'Marquer le plus de points', 'Toucher son adversaire'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'De quoi descendent les racchettoni ?', choix: ['Du tamburello da spiaggia', 'Du beach volley', 'De la pelote basque'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Où le beach tennis est-il né ?', choix: ['En Italie, des racchettoni', 'Au Brésil', 'En Californie'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Comment appelle-t-on le cochonnet, en italien ?', choix: ['Le pallino', 'La boccia', 'Il tuppettu'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Comment s’appelle le fait de chasser la boule de l’adversaire ?', choix: ['Une bocciata', 'Une passeggiata', 'Une strummula'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'En combien de points joue-t-on aux boules sur le sable ?', choix: ['Douze', 'Treize', 'Vingt et un'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Depuis combien de temps les mêmes retraités jouent-ils aux boules à Donnalucata ?', choix: ['Plus de cinquante ans', 'Deux ou trois étés', 'Depuis 2020'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Quand la brise se lève-t-elle ?', choix: ['L’après-midi', 'Au lever du jour', 'En pleine nuit'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Combien de kilomètres fait la côte de Scicli ?', choix: ['Dix-huit', 'Cinq', 'Quarante'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Qu’est-ce que la passeggiata ?', choix: ['La marche du soir sur le front de mer', 'Une course de barques', 'Un plat de pâtes'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'Qu’est-ce que « a strummula » ?', choix: ['La toupie sicilienne', 'Une raquette en bois', 'Un filet de pêche'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Quel autre nom porte la strummula ?', choix: ['U tuppettu', 'U pallino', 'A bocciata'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Quel poète antique décrit déjà la toupie ?', choix: ['Homère, dans l’Iliade', 'Virgile, dans l’Énéide', 'Ovide'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Où trouver raquettes, boules et balles sur place ?', choix: ['Dans n’importe quel bazar de bord de mer ou supermarché', 'Uniquement à Raguse', 'Il faut les apporter de France'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      // ── La balle au tambourin, le sport codifie. Source envoyee par Mag.
      { q: 'Quelle longueur fait un terrain de balle au tambourin ?', choix: ['80 mètres', '40 mètres', '120 mètres'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Qu’est-ce qui sépare les deux camps, au tambourin ?', choix: ['Une ligne médiane, pas de filet', 'Un filet comme au tennis', 'Un mur'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Combien de joueurs par équipe, en plein air ?', choix: ['Cinq', 'Trois', 'Sept'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Comment compte-t-on les points au tambourin ?', choix: ['Comme au tennis — 15, 30, 45, jeu', 'De un en un jusqu’à 21', 'En sets de onze'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Combien de jeux faut-il gagner ?', choix: ['Treize', 'Six', 'Vingt'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Comment s’appellent les postes au tambourin ?', choix: ['Fonds, cordiers et tiers', 'Avants, arrières et pivots', 'Meneurs et ailiers'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'En quelle année le premier tambourin a-t-il été fabriqué ?', choix: ['En 1861, par un tonnelier de Mèze', 'En 1896', 'En 1952'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Depuis quand l’Italie a-t-elle un championnat de tamburello ?', choix: ['Depuis 1896', 'Depuis 1861', 'Depuis 1955'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Où joue-t-on au tamburello, en Italie ?', choix: ['Au Nord — Lombardie, Vénétie', 'En Sicile', 'Partout également'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      // ── Les boules en bois. Mag : « la petanque ce sont des boules en bois ».
      { q: 'En quoi sont les boules du jeu de plage italien ?', choix: ['En bois', 'En acier', 'En verre'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'Quels matériaux la boule a-t-elle traversés, dans l’ordre ?', choix: ['Argile, pierre, bois, puis acier', 'Acier, bois, puis pierre', 'Verre, bois, puis acier'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'En quelle année l’acier arrive-t-il dans la pétanque ?', choix: ['En 1927', 'En 1904', 'En 1861'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Qu’est-ce qu’une boule cloutée ?', choix: ['Du bois recouvert d’une carapace de clous', 'Une boule percée de trous', 'Une boule peinte à la main'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Qui a inventé la boule cloutée, et où ?', choix: ['Félix Rofritsch, à Marseille en 1904', 'Jean Blanc, à Lyon en 1930', 'Un tonnelier de Mèze en 1861'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      // ── Punta Corvo et le beach-volley. Contenu donne par Mag.
      { q: 'Où entre la mer, tout près de Cava d’Aliga ?', choix: ['Dans la Grotta dei Contrabbandieri', 'Dans la Fornace Penna', 'Dans le port de Donnalucata'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Qu’est-ce que « a spaccazza » ?', choix: ['Une descente dans une fissure de la falaise', 'Une grotte sous-marine', 'Un sentier de crête'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'La bâtisse abandonnée de Punta Corvo était…', choix: ['La casa del finanziere, un poste de douane', 'Un vrai phare', 'Une chapelle'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Quels arbres poussent dans les criques de Punta Corvo ?', choix: ['Des palmiers nains', 'Des pins parasols', 'Des oliviers'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Comment longe-t-on la côte jusqu’à Sampieri ?', choix: ['Par une piste de terre', 'Par l’autoroute', 'En bateau seulement'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Pourquoi le football de plage fatigue-t-il autant ?', choix: ['Le sable ralentit tout', 'Les matchs durent plus longtemps', 'Le ballon est plus lourd'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Que faut-il pour jouer au beach-volley ou au foot de plage ?', choix: ['Rien d’autre que du monde', 'Un terrain homologué', 'Une licence'], bonne: 0, ancre: 'sports', niveau: 'facile' },
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
      { q: '« Odio gli indifferenti », écrit Gramsci en 1917. Que veut-il dire ?', choix: ['Je hais les indifférents', 'J’aime les différences', 'J’écoute les autres'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Comment dit-on « fusiller » en italien ?', choix: ['Fucilare', 'Festeggiare', 'Scolare'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Dans « pastasciutta », le groupe SCI se prononce…', choix: ['« chi », comme dans « chou »', '« ski »', '« si »'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Sciopero » veut dire…', choix: ['La grève', 'Le travail', 'La fête'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Comment se prononce le début de « sciopero » ?', choix: ['Cho, comme dans « chocolat »', 'Sko', 'Tcho'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Né dio né padrone » — que signifie « padrone » ?', choix: ['Le patron, le propriétaire, le maître', 'Le prêtre', 'Le père'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Non si parte ! » était le cri de janvier 1945. Il voulait dire…', choix: ['On ne part pas — refus d’aller à la guerre', 'La fête commence', 'On s’en va tous'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Dans « lasciatemi cantare », que veut dire « lasciatemi » ?', choix: ['Laissez-moi', 'Chantez-moi', 'Écoutez-moi'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Ora e sempre Resistenza » se traduit par…', choix: ['Maintenant et toujours, Résistance', 'Hier et demain, la paix', 'Ici et là, la patrie'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« Bella ciao » — que veut dire « ciao » dans ce refrain ?', choix: ['Adieu : on part se battre', 'Bonjour : on arrive', 'Merci : on remercie'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Comment dit-on « je suis anarchiste » (au féminin) ?', choix: ['Sono anarchica', 'Sono anarchico', 'Ho anarchica'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« Pessimismo dell’intelligenza, ottimismo della volontà » — cette devise de Gramsci dit…', choix: ['Voir clair sans renoncer à agir', 'Espérer sans réfléchir', 'Se taire et attendre'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« Buongiorno » s’emploie…', choix: ['Le matin et jusqu’en début d’après-midi', 'Seulement à l’aube', 'Uniquement le soir'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Au comptoir, « un caffè » veut dire…', choix: ['Un espresso', 'Un grand café allongé', 'Un café au lait'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: '« Quanto costa ? » se traduit par…', choix: ['Combien ça coûte ?', 'Où est-ce ?', 'À quelle heure ?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Pour dire « je ne parle pas italien », on dit…', choix: ['Non parlo italiano', 'Non parla italiano', 'Non parliamo italiano'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Mi scusi » plutôt que « scusa », c’est…', choix: ['La forme de politesse, à un inconnu', 'Ce qu’on dit à un enfant', 'Une insulte'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Compagno » veut dire camarade — mais aussi…', choix: ['Compagnon, au sens amoureux', 'Patron', 'Voisin'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« L’unione fa la forza » signifie…', choix: ['L’union fait la force', 'La force fait l’union', 'L’union fait la fête'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Que veut dire « occupare le terre » ?', choix: ['Occuper les terres', 'Cultiver les terres', 'Vendre les terres'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« La lotta continua » veut dire…', choix: ['La lutte continue', 'La lutte est finie', 'La lutte commence'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Dans « Sacco e Vanzetti sono stati giustiziati », « sono stati » indique…', choix: ['Le passé composé, avec essere', 'Le futur', 'Le présent'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      // ── Italien, seconde fournee. Mag : « rajoute beaucoup de questions
      // d'italien dans le quizz ». Prononciation, conjugaison, phrases utiles,
      // mots des luttes, mots des chansons — chaque reponse est ecrite dans
      // app/italienData.ts, et l'extrait va l'y chercher.
      { q: 'Comment se prononce le « ci » de « ciao » ?', choix: ['Tch', 'Ss', 'K'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'À quoi sert le H en italien, après un C ou un G ?', choix: ['À redurcir la consonne', 'À allonger la voyelle', 'À marquer l’accent'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Comment se dit « gli » dans « famiglia » ?', choix: ['Comme le « ill » de famille', 'Comme un G dur', 'Comme un J'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Où tombe l’accent tonique, presque toujours ?', choix: ['Sur l’avant-dernière syllabe', 'Sur la première', 'Sur la dernière'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Pourquoi « caffè » porte-t-il un accent écrit ?', choix: ['Parce que l’accent tombe sur la dernière syllabe', 'Pour allonger le E', 'Parce que le mot est étranger'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Les doubles consonnes, en italien…', choix: ['S’entendent : on tient la consonne', 'Ne se prononcent pas', 'Se disent comme une seule'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Combien de syllabes s’entendent dans « pane » ?', choix: ['Deux, bien nettes', 'Une seule', 'Trois'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Comment se dit « sc » devant A, O ou U — comme dans « scuola » ?', choix: ['Sk', 'Ch', 'S'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Comment demander l’addition ?', choix: ['Il conto, per favore', 'Quant’è?', 'Basta così'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Que dire pour signaler une allergie aux crustacés ?', choix: ['Sono allergico ai crostacei', 'È piccante?', 'Che cosa mi consiglia?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Comment demander qu’on répète plus lentement ?', choix: ['Può ripetere più lentamente?', 'Come si chiama?', 'A che ora chiudete?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Que veut dire « Un caffè corretto » ?', choix: ['Un café « corrigé » d’un trait de liqueur', 'Un café bien serré', 'Un café allongé'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'À partir de quand dit-on « Buonasera » ?', choix: ['Dès le milieu de l’après-midi', 'À la tombée de la nuit', 'Après le dîner'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Comment dire qu’on a crevé un pneu ?', choix: ['Ho bucato una gomma', 'Il water perde', 'Non c’è acqua calda'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Que demander à la pharmacie contre les piqûres de moustique ?', choix: ['Avete qualcosa per le punture di zanzara?', 'Mi fa male qui', 'Ho bisogno di aiuto'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Le présent de « parlare », à la première personne ?', choix: ['parlo', 'parli', 'parla'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Comment forme-t-on le présent en italien ?', choix: ['On enlève la terminaison de l’infinitif et on ajoute celle de la personne', 'On ajoute un auxiliaire devant le verbe', 'On garde l’infinitif tel quel'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Que veut dire « domani parto » ?', choix: ['Je pars demain', 'Je suis parti hier', 'Je partirais bien'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Quelles sont les trois familles de verbes italiens ?', choix: ['-are, -ere, -ire', '-ar, -er, -ir', '-are, -ire, -ure'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Nous » de « prendere », au présent ?', choix: ['prendiamo', 'prendete', 'prendono'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Que veut dire « Né dio né padrone » ?', choix: ['Ni dieu ni maître', 'Ni pain ni travail', 'Ni hier ni demain'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Qui a dirigé le syndicat anarchiste italien ?', choix: ['Armando Borghi', 'Leda Rafanelli', 'Camillo Berneri'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Qu’a ouvert Leda Rafanelli ?', choix: ['Une maison d’édition anarchiste', 'Une école du soir', 'Un syndicat paysan'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Où est mort Camillo Berneri, en 1937 ?', choix: ['À Barcelone', 'À Milan', 'À Paris'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'En quelle année a éclaté la Semaine rouge ?', choix: ['En juin 1914', 'En janvier 1945', 'En 1927'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Que veut dire « prendere in giro » ?', choix: ['Se moquer de quelqu’un', 'Faire un tour en voiture', 'Prendre son temps'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« La gente » est un mot…', choix: ['Singulier en italien, pluriel en français', 'Toujours pluriel', 'Masculin'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Que veut dire « piano », en plus de « doucement » ?', choix: ['L’étage', 'Le sol', 'La porte'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Quel mot italien sert à la fois pour l’arrivée et le départ ?', choix: ['Ciao', 'Buongiorno', 'Grazie'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: '« La mano » est l’un des rares mots en -o à être…', choix: ['Féminin', 'Invariable', 'Toujours pluriel'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Que veut dire le préfixe « ri- », dans « ricostruire » ?', choix: ['De nouveau', 'Contre', 'Presque'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Comment se dit « la valise » ?', choix: ['La valigia', 'La città', 'La stagione'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Celui qui part est l’emigrante ; celui qui arrive est…', choix: ['L’immigrato', 'Il partigiano', 'Il forestiero'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Que veut dire « dolce » ?', choix: ['Doux et sucré à la fois', 'Amer', 'Froid'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Comment dit-on « mieux » en italien ?', choix: ['Meglio', 'Più bene', 'Molto bene'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      // ── Les pages pratiques. Mag : « remets a chaque fois le meme quizz mais
      // pointe sur le sujet en rapport avec la page ». Chaque reponse est
      // ecrite dans la section que `ancre` designe.
      { q: 'Où se trouve la vanne générale d’eau ?', choix: ['Dans la rue, au coin en descendant à droite', 'Dans la buanderie', 'Sous l’évier de la cuisine'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'La vanne d’eau est fermée quand elle est…', choix: ['Perpendiculaire', 'Parallèle', 'Vers le haut'], bonne: 0, ancre: 'arrivee', niveau: 'difficile' },
      { q: 'Peut-on boire l’eau du robinet ?', choix: ['Non, et pas de glaçons non plus', 'Oui, sans problème', 'Seulement le matin'], bonne: 0, ancre: 'arrivee', niveau: 'facile' },
      { q: 'À quoi l’eau du robinet sert-elle sans souci ?', choix: ['La cuisine, les pâtes, le café, la vaisselle', 'Uniquement la vaisselle', 'Rien du tout'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Où est le chauffe-eau ?', choix: ['Dans la salle de bain, dans la douche', 'Dans la buanderie', 'Sur la terrasse'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Où est la clé de la buanderie ?', choix: ['Dans le petit meuble à tiroirs du buffet du salon', 'Sous le paillasson', 'Dans la petite chambre'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Où sont les draps ?', choix: ['Dans le tiroir de l’armoire, dans la petite chambre', 'Dans la buanderie', 'Sous le lit de la grande chambre'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'La maison a-t-elle la climatisation ?', choix: ['Non — volets fermés le jour, ouverts le soir', 'Oui, dans chaque chambre', 'Oui, mais seulement au salon'], bonne: 0, ancre: 'arrivee', niveau: 'facile' },
      { q: 'À quel rythme arroser les plantes ?', choix: ['Tous les trois ou quatre jours, environ 3 litres par plante', 'Tous les jours, un litre', 'Une fois par semaine'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Pourquoi se doucher au bord de la plage en rentrant ?', choix: ['Pour que le sable ne finisse pas dans les canalisations', 'Pour économiser l’eau', 'Parce que l’eau y est chaude'], bonne: 0, ancre: 'arrivee', niveau: 'difficile' },
      { q: 'Que faire du frigo avant de partir ?', choix: ['Le vider, le débrancher et laisser la porte entrouverte', 'Le laisser branché et plein', 'Le débrancher et bien le fermer'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'Que rentre-t-on avant de partir ?', choix: ['Le tissu du hamac, le petit banc et les tabourets en bois', 'Les pots de fleurs', 'La table de la terrasse'], bonne: 0, ancre: 'depart', niveau: 'difficile' },
      { q: 'Que fait-on du linge avant de partir ?', choix: ['On le lave et on refait les lits pour les suivants', 'On le laisse dans le panier', 'On l’emporte avec soi'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'Et si le linge est encore humide au moment de fermer ?', choix: ['On le laisse étendu dans la maison, jamais plié', 'On le plie dans le panier', 'On le met dans un sac'], bonne: 0, ancre: 'depart', niveau: 'difficile' },
      { q: 'Passage des poubelles manqué la veille du départ ?', choix: ['On les laisse sur la terrasse, jamais dans la rue', 'On les laisse dans la rue', 'On les emporte'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'Que dit une place de parking bleue ?', choix: ['Payante — ticket derrière le pare-brise', 'Gratuite', 'Réservée aux résidents'], bonne: 0, ancre: 'parking', niveau: 'facile' },
      { q: 'Une place blanche est gratuite, mais…', choix: ['Elle peut être limitée dans le temps — disque obligatoire', 'Elle est réservée aux livraisons', 'Elle devient payante le soir'], bonne: 0, ancre: 'parking', niveau: 'moyen' },
      { q: 'À qui sont réservées les places jaunes ?', choix: ['Handicapés avec macaron, livraisons, forces de l’ordre', 'Aux femmes enceintes', 'Aux voitures électriques'], bonne: 0, ancre: 'parking', niveau: 'moyen' },
      { q: 'Combien coûte un ticket non affiché ou un disque oublié ?', choix: ['41 €', '25 €', '80 €'], bonne: 0, ancre: 'parking', niveau: 'difficile' },
      { q: 'Où trouver un disque de stationnement si le loueur n’en fournit pas ?', choix: ['Dans n’importe quel bureau de tabac', 'À la poste', 'Au commissariat'], bonne: 0, ancre: 'parking', niveau: 'difficile' },
      { q: 'Comment appelle-t-on un distributeur en Italie ?', choix: ['Un Bancomat', 'Un Postomat', 'Un Cassa'], bonne: 0, ancre: 'argent', niveau: 'facile' },
      { q: 'Combien y a-t-il de distributeurs à Donnalucata ?', choix: ['Deux', 'Un seul', 'Quatre'], bonne: 0, ancre: 'argent', niveau: 'moyen' },
      { q: 'Comment s’appelle le distributeur de la poste italienne ?', choix: ['Le Postamat', 'Le Postabank', 'Le Posteomat'], bonne: 0, ancre: 'argent', niveau: 'difficile' },
      { q: 'Pourquoi prévoir des espèces d’avance ?', choix: ['Beaucoup de petits commerces, et le marché, n’acceptent que ça', 'Les cartes étrangères sont refusées', 'Les distributeurs ferment l’été'], bonne: 0, ancre: 'argent', niveau: 'moyen' },
      { q: 'Où les moustiques pondent-ils ?', choix: ['Dans l’eau stagnante — soucoupes, seaux, arrosoir', 'Dans les poubelles', 'Sous les meubles'], bonne: 0, ancre: 'bestioles', niveau: 'moyen' },
      { q: 'Quelle est la meilleure des boîtes hermétiques ?', choix: ['Le frigo', 'Un bocal en verre', 'Un sac congélation'], bonne: 0, ancre: 'bestioles', niveau: 'difficile' },
      { q: 'Comment combat-on les fourmis ?', choix: ['On ne les combat pas : on ne leur donne rien', 'Avec un insecticide', 'En bouchant les fissures'], bonne: 0, ancre: 'bestioles', niveau: 'moyen' },
      { q: 'Quel vieux réflexe du sud avant de remettre ses chaussures ?', choix: ['On les secoue', 'On les retourne', 'On les rentre la nuit'], bonne: 0, ancre: 'bestioles', niveau: 'difficile' },
      { q: 'Quel aéroport est conseillé pour venir ?', choix: ['Catania (CTA)', 'Palerme (PMO)', 'Comiso (CIY)'], bonne: 0, ancre: 'voyage', niveau: 'facile' },
      { q: 'Quel aéroport est le plus proche de la maison ?', choix: ['Comiso (CIY), environ 40 min de route', 'Catania (CTA)', 'Palerme (PMO)'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'D’où part le ferry pour Messine ?', choix: ['De Villa San Giovanni', 'De Reggio de Calabre', 'De Naples'], bonne: 0, ancre: 'voyage', niveau: 'difficile' },
      { q: 'Combien de temps dure la traversée depuis Gênes ?', choix: ['Une vingtaine d’heures', 'Une vingtaine de minutes', 'Six heures'], bonne: 0, ancre: 'voyage', niveau: 'difficile' },
      { q: 'Où débarque-t-on en venant de Gênes ?', choix: ['À Palerme', 'À Messine', 'À Catane'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'Combien de temps dure la traversée du détroit ?', choix: ['Une vingtaine de minutes, sans réservation', 'Deux heures', 'Une nuit entière'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'Quand sort-on les bacs ?', choix: ['La veille au soir — le camion passe tôt', 'Le matin même', 'Quand ils sont pleins'], bonne: 0, ancre: 'dechets', niveau: 'facile' },
      { q: 'Que se passe-t-il si un bac est sorti le mauvais soir ?', choix: ['Il reste dehors une semaine', 'Il est ramassé quand même', 'La commune met une amende'], bonne: 0, ancre: 'dechets', niveau: 'moyen' },
      { q: 'Pourquoi les jours de collecte peuvent-ils changer ?', choix: ['La commune les modifie pour les fêtes, l’été, ou quand elle change de prestataire', 'Ils ne changent jamais', 'Ils dépendent de la météo'], bonne: 0, ancre: 'dechets', niveau: 'difficile' },
      // ── La page famille : le recit de Salva, puis l'arbre. Ces questions
      // n'apparaissent QUE sur /famille (themes `chezElle`). Chaque reponse est
      // ecrite dans le recit de Mag ou dans l'arbre lui-meme.
      { q: 'Où est né Salvatore Contrino ?', choix: ['À Valguarnera, en Sicile', 'À Scicli', 'À Cava d’Aliga'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'En quelle année Salvatore est-il né ?', choix: ['1947', '1937', '1957'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'D’où revenait son père Angelo quand il s’est retrouvé veuf ?', choix: ['Des camps russes', 'D’Amérique', 'D’Afrique du Nord'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Qui a élevé Salvatore ?', choix: ['Sa grand-mère Giuseppina, mémé Pipine', 'Une tante restée en Sicile', 'Son père Angelo'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Où mémé Pipine avait-elle émigré avec ses enfants ?', choix: ['À Saint-Étienne', 'À Bruxelles', 'À Lyon'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Elle l’a élevé comme…', choix: ['Le dixième de la fratrie', 'Un petit-fils à part', 'Son fils aîné'], bonne: 0, ancre: 'recit', niveau: 'difficile' },
      { q: 'À quel âge est-il parti travailler en Belgique ?', choix: ['À dix-neuf ans', 'À quinze ans', 'À vingt-cinq ans'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Que rassemble la maison de Cava d’Aliga, de génération en génération ?', choix: ['La famille', 'Les voisins du village', 'Les amis de Belgique'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'Quel est le nom de jeune fille de Giuseppina, la mère de la fratrie Contrino ?', choix: ['Marcino', 'Sberna', 'Canolo'], bonne: 0, ancre: 'arbre', niveau: 'facile' },
      { q: 'Comment s’appellent les deux enfants de Jacques ?', choix: ['Nathalie et Olivier', 'Christian et Ambre', 'Salvatore et Tino'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Quelle fille d’Helene a épousé Patrick Gamino ?', choix: ['Angelina, dite Angèle', 'Rosalba, dite Rose', 'Giuseppina, dite Jo'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Quel est le nom de famille du second mari de Lucia ?', choix: ['Dolciamore', 'Gallois', 'Gamino'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Qui sont les parents de Pierre Lux, né en 1881 ?', choix: ['Henri Lux et Angélique Bourg', 'Augustin Viseux et Flore Marie Wasson', 'Louis Thurot et Mélanie Souveton'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Qui sont les parents d’Angelina Viseux, née en 1882 ?', choix: ['Augustin Viseux et Flore Marie Wasson', 'Henri Lux et Angélique Bourg', 'Pierre Lux et Juliette Thurot'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'En quelle année est mort Augustin Viseux, le père d’Angelina ?', choix: ['1899', '1944', '1959'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Qui est l’ancêtre le plus ancien de l’arbre, du côté d’Angelina Viseux ?', choix: ['Jean Baptiste Viseux, vers 1702', 'Adrien Carpentier, vers 1701', 'Denis Fréville'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'En quelle année Pierre Antoine Viseux et Rosalie Fréville se sont-ils mariés ?', choix: ['1843', '1800', '1880'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Dans quelle commune sont inhumés Pierre Lux et Angelina Viseux ?', choix: ['Saint-Avold', 'Saint-Étienne', 'Valguarnera'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Qui sont les enfants d’Angelo Contrino et de sa seconde épouse Conchetta Sberna ?', choix: ['Josephine, Rosario, Stefano et Maria Assunta', 'Salvatore seul', 'David, Michaël et Mag'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'En quelle année est née Juliette Emilienne Thurot ?', choix: ['1923', '1898', '1920'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Qui Juliette Emilienne Thurot a-t-elle épousé en secondes noces ?', choix: ['Charles Gallois', 'Patrick Gamino', 'Louis Thurot'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Quel est le nom de jeune fille de Régine, la mère de Mag ?', choix: ['Lux', 'Thurot', 'Viseux'], bonne: 0, ancre: 'arbre', niveau: 'facile' },
      { q: 'Comment s’appelle la fille de Benito que l’on connaît ?', choix: ['Ambre', 'Zoé', 'Manon'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Comment s’appelle le premier enfant de Gabi ?', choix: ['Christian', 'Stefano', 'Rosario'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Quel est le diminutif de Rosario, fils d’Angelo et Conchetta Sberna ?', choix: ['Saro', 'Jo', 'Rose'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Dans quelle province se trouve Valguarnera Caropepe ?', choix: ['Enna, au centre de la Sicile', 'Raguse, au sud-est', 'Palerme, au nord'], bonne: 0, ancre: 'valguarnera', niveau: 'moyen' },
      { q: 'Quel régiment canadien menait l’avance sur la route 117, le 17 juillet 1943 ?', choix: ['The Carleton and York Regiment', 'Le Royal 22e Régiment', 'Le West Nova Scotia Regiment'], bonne: 0, ancre: 'valguarnera', niveau: 'difficile' },
      { q: 'Qu’ont trouvé les 48th Highlanders en entrant dans Valguarnera ?', choix: ['Aucun Allemand : le village était vide', 'Une contre-attaque', 'Un pont détruit'], bonne: 0, ancre: 'valguarnera', niveau: 'difficile' },
      { q: 'Que faisait la famille avant d’aller à la mer, l’été ?', choix: ['Elle passait par Valguarnera voir la famille et pépé Angelo', 'Elle allait d’abord à Palerme', 'Elle dormait à Raguse'], bonne: 0, ancre: 'valguarnera', niveau: 'facile' },
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
      { icon: 'drop', title: 'Eau', items: ['La vanne générale, celle qui ouvre et coupe toute l’eau de la maison, est dans la rue : au coin, en descendant à droite — perpendiculaire = fermé.', 'Dans la buanderie, à l’arrière, sur le mur entre le lave-linge et l’évier, il y a une seconde vanne : elle ne commande que l’eau de la terrasse arrière. La clé de la buanderie est juste là, dans le petit meuble à tiroirs du buffet du salon.', 'Le chauffe-eau est dans la salle de bain, dans la douche.'] },
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
    'A due chilometri da casa la costa smette di essere spiaggia: una scogliera bassa, scavata dall’acqua, che si costeggia per una strada sterrata fino a Sampieri. Ci sono la Grotta dei Contrabbandieri, dove il mare entra da un braccio d’acqua che si accende quando la luce cala, e « a spaccazza », una discesa naturale scavata in una fessura così stretta che ci si passa uno alla volta. Sulla punta, un rudere con la sua garitta sull’orlo del vuoto: non è proprio un faro, è la casa del finanziere, l’antico posto di guardia, dove ha girato Montalbano. Intorno, agavi, fichi d’India, capperi e palme nane.',
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
    ['La Grotta dei Contrabbandieri, dove entra il mare.', '« A spaccazza »: una discesa in una fessura della scogliera.', 'La casa del finanziere, vecchio posto di guardia scambiato per un faro.', 'Palme nane, agavi e fichi d’India.', 'Strada sterrata fino a Sampieri.'],
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
  ], storyOpen: 'Questa storia si scrive in tanti. Una data, un luogo, un nome, un aneddoto, una foto — mandateli e troveranno il loro posto qui. La cosa più utile: dite di chi parlate, quando e dove. È ciò che permette di agganciare ogni pezzo al punto giusto.', storyOpenCta: 'Aggiungere alla storia', storyOpenSubject: 'Storia della famiglia — ho qualcosa da aggiungere', treeTitle: 'Albero genealogico', treeNote: 'Quello che la famiglia ci ha trasmesso. Restano dei vuoti — sono elencati in fondo, e ognuno può colmarli.', treePaternal: 'Nonni paterni', treeMaternal: 'Nonni materni', treeWife1: '1ª moglie', treeWife2: '2ª moglie', treeMarriage1: '1º matrimonio', treeMarriage2: '2º matrimonio', treeToday: 'Oggi', treeGreat: 'Bisnonni', treeGreat2: 'Trisnonni', treeDeeper: 'Risalire più indietro', treeGen5: '5 generazioni indietro', treeGen6: '6 generazioni indietro', treeGen7: '7 generazioni indietro', treeGen8: '8 generazioni indietro', treeAbout: 'circa', treeBefore: 'prima del', treeAfter: 'dopo il', treeWed: 'sposati nel', treeWedAbout: 'sposati verso il', treeBuried: 'sepolti a', treeParents: 'I genitori', treeChildren: 'I figli', treeQuestionsTitle: 'Quello che ci manca', treeAdd: '+ Aggiungi il mio ramo', treeAddSubject: 'Albero genealogico — il mio ramo', treeExample: 'Mancano persone e date — diteci quello che sapete.', treeOpen: 'Apri', treeClose: 'Chiudi', treeOpenAll: 'Apri tutto', treeCloseAll: 'Chiudi tutto', treeKid: 'figlio', treeKids: 'figli', treeSideFather: 'Ramo Contrino', treeSideMother: 'Ramo Lux', treeSideUs: 'Noi' },
  stayPage: { title: 'Il calendario', intro: 'I periodi in cui la casa è occupata, per coordinarsi in famiglia.', legend: { mag: 'Mag', close: 'Famiglia stretta', inlaw: 'I parenti acquisiti', family: 'I cugini', outside: 'Fuori famiglia', tentative: 'Da confermare', free: 'Libero' } },
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
    intro: 'Quello che si fa, e quello che non si fa.',
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
      {
        icon: 'wave',
        title: 'In costume tutto il giorno — ma non ovunque',
        text: 'A Cava d’Aliga la giornata si veste di poco: un costume, un pareo, e la questione è chiusa. La spiaggia è a due metri, fa caldo, e nessuno si cambia per andare a prendere il pane. I vestiti veri servono solo per uscire dal paese — e lì, attenzione. Diversi comuni siciliani vietano per ordinanza di circolare in costume o a torso nudo nel centro — a Favignana, Marettimo e Levanzo la multa va da 25 a 150 €, e San Vito Lo Capo ha lo stesso regolamento. Scicli non ne ha, per quanto ne sappiamo. Una maglietta in borsa, e il problema non si pone.',
      },
      {
        icon: 'sun',
        title: 'Il monokini: legale, ma non si fa',
        text: 'Nessuna legge italiana lo vieta — la Cassazione lo ha stabilito nel 2000, dopo quasi trent’anni di cause. Ma i comuni e gli stabilimenti privati possono rifiutarlo, e su una spiaggia di famiglie come questa basta l’uso: non lo fa nessuno. Non è una regola affissa, è un’abitudine, ed è più forte di un cartello.',
      },
      {
        icon: 'bag',
        title: 'Viaggiate leggeri, davvero',
        text: 'Fa caldo, il mare è a due metri, e la casa ha già tutto. Non serve quasi niente: un costume, qualcosa per la sera, e scarpe chiuse se camminate in campagna. Il primo pasto si fa in dieci minuti con pomodori, mozzarella e un filo d’olio. Per i vestiti invece, a Cava d’Aliga niente: il paese non ne vende. Il bazar del centro commerciale Max, a due chilometri e mezzo — cinque minuti di macchina — risolve benissimo con il primo prezzo estivo: un costume dimenticato, infradito, una maglietta.',
        lien: 'https://maps.app.goo.gl/QERUZZMUWQHtRFrA6',
        lienLabel: 'Il centro commerciale sulla mappa',
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
  pastaPage: {
    eyebrow: '25 luglio 1943',
    title: 'La pastasciutta antifascista',
    intro: 'Il giorno in cui cadde Mussolini, una famiglia di contadini cucinò quintali di pasta e la distribuì a tutto il paese. Cinque mesi dopo i sette fratelli furono fucilati. È la festa più tenera e più terribile della cucina italiana, e si rifà ogni 25 luglio.',
    word: {
      title: 'Prima di tutto, la parola',
      text: 'Pastasciutta vuol dire pasta scolata e condita con un sugo, in contrapposizione alla pasta in brodo. È un termine familiare e regionale, e dice il piatto della domenica — il ragù alla bolognese, il pomodoro e basilico, la cacio e pepe. È il primo piatto dei pranzi in famiglia, non quello dei giorni qualunque.',
    },
    story: [
      {
        title: 'Una famiglia, sette fratelli',
        text: 'I Cervi erano affittuari dei Campi Rossi, a Gattatico, in provincia di Reggio Emilia. Alcide, il padre, nato nel 1875 ; Genoeffa Cocconi, la madre, nata nel 1876 ; e sette figli. Cattolici, contadini e testardi : comprarono il primo trattore della zona, misero in piedi una biblioteca itinerante perché il paese leggesse, e nascosero in casa prigionieri evasi e antifascisti in fuga.',
      },
      {
        title: 'Il giorno in cui cade il fascismo',
        text: 'Il 25 luglio 1943 Mussolini viene destituito. I Cervi non fanno un discorso : cuciniamo. Presero il formaggio a credito dal caseificio, Alcide si impegnò a fornire il burro gratuitamente per un periodo, i vicini diedero la farina. Quintali di pastasciutta furono cotti e distribuiti nella piazza di Campegine, a chiunque ne volesse. Alcide disse che l’acqua che bolliva « sembrava una sinfonia », e che fu « il più bel discorso sulla fine del fascismo ».',
      },
      {
        title: 'Cinque mesi dopo',
        text: 'Il 25 novembre 1943 un rastrellamento fascista porta via i sette fratelli e il padre. Il 28 dicembre i sette vengono fucilati al poligono di tiro di Reggio Emilia. Genoeffa morirà di dolore nel 1944. Alcide esce di prigione e vive fino al 1970 — novantacinque anni. Gli chiesero come avesse fatto. Rispose : « Dopo un raccolto ne viene un altro ».',
      },
      {
        title: 'E da allora, ogni 25 luglio',
        text: 'Si rifà la pastasciutta. A Gattatico, nella casa diventata Museo Cervi, e in tutta Italia dove qualcuno si organizza. È una festa che si mangia : non si commemorano dei morti, si rifà il pasto dei vivi.',
      },
    ],
    brothers: 'Gelindo (1901), Antenore (1904), Aldo (1909), Ferdinando (1911), Agostino (1916), Ovidio (1918), Ettore (1921).',
    recipe: {
      title: 'La ricetta',
      intro: 'È di una semplicità disarmante, ed è proprio il punto : nel 1943 il burro e il parmigiano erano una festa. Niente da aggiungere, e soprattutto niente panna.',
      ingredients: [
        '500 g di pasta corta o tagliatelle',
        '100 g di burro, a temperatura ambiente',
        '150 g di parmigiano grattugiato al momento',
        'Sale grosso per l’acqua',
        'Un mestolo di acqua di cottura',
      ],
      steps: [
        'Portate a bollore molta acqua e salatela bene.',
        'Cuocete la pasta al dente, e tenete un mestolo di acqua di cottura prima di scolare.',
        'Scolate, rimettete nella pentola fuori dal fuoco, unite il burro a pezzetti e mescolate finché sparisce.',
        'Aggiungete il parmigiano a pioggia e un po’ di acqua di cottura : è lei che lega e rende cremoso.',
        'Servite subito, e per molte persone — è l’unico punto non negoziabile.',
      ],
      note: 'Quel giorno non c’era né pomodoro né carne. Il burro e il formaggio bastavano a fare un banchetto, ed è esattamente quello che la festa racconta.',
    },
    shelf: 'Tre libri raccontano questa famiglia — la testimonianza del padre, un fumetto e un romanzo a tesi. Sono sullo scaffale, in « Dei libri ».',
  },
  valguarneraPage: {
    eyebrow: 'Valguarnera Caropepe',
    title: 'Il paese da cui veniamo',
    intro: 'A 590 metri di altitudine, in provincia di Enna, nel centro esatto della Sicilia — il punto più lontano dal mare che si possa trovare sull’isola. Lì è nato Salvatore, il 26 gennaio 1947. E lì era passata la guerra, tre anni e mezzo prima.',
    facts: [
      {
        title: 'Un bivio da tenere',
        text: 'Dal 17 luglio 1943 i comandanti tedeschi in Sicilia cominciano a temere che la loro via di fuga verso l’Italia continentale venga tagliata. Lasciano retroguardie nei paesi arroccati che dominano i grandi bivi. Valguarnera è uno di questi.',
      },
      {
        title: 'Il 17 luglio, sulla strada 117',
        text: 'Presa Piazza Armerina, la 3ª Brigata di fanteria canadese sale verso nord. Il Carleton and York Regiment è in testa quando incassa il fuoco degli avamposti. I carri del Three Rivers Regiment costringono i tedeschi a ripiegare sulle colline ; il Royal 22e Régiment riparte, poi si ferma davanti a un enorme cratere di mine e a un altro gruppo tedesco. Passano la notte trincerati lì.',
      },
      {
        title: 'Il 18 luglio, il Monte della Forma',
        text: 'Il Royal 22e Régiment e il Carleton and York salgono verso il bivio in cima al Monte della Forma, mentre il West Nova Scotia Regiment aggira da ovest per tagliare la strada 117 e impedire la ritirata. A est, le compagnie dell’Hastings and Prince Edward Regiment hanno attraversato i campi tutta la notte ; al mattino sbarrano la strada che esce dal paese. Il Royal Canadian Regiment tenta il paese e si scontra col terreno, col fuoco tedesco e col timore di un contrattacco.',
      },
      {
        title: 'La sera, più nessuno',
        text: 'Al calare della notte la 3ª Brigata tiene il bivio e i tedeschi si sganciano verso nord. La 1ª Brigata, a corto di appoggio di fuoco, aspetta il buio per mandare la sua riserva — i 48th Highlanders of Canada — dentro Valguarnera. Non vi trovano nessun tedesco. Il paese è preso senza un altro colpo.',
      },
    ],
    family: 'Tre anni e mezzo dopo, Salvatore nasce in questo paese. Suo padre Angelo è tornato dai campi russi ; si ritrova vedovo con un bambino di sei mesi. Più tardi, quando la famiglia tornerà dal Belgio per l’estate, non si andrà dritti al mare : si passava prima da Valguarnera, a trovare la famiglia e nonno Angelo. La casa di Cava d’Aliga è entrata in famiglia solo una cinquantina d’anni fa.',
    note: 'L’esercito canadese porta « Valguarnera » come onore di battaglia, legato a « Sicilia, 1943 ».',
  },
  symbolsPage: {
    eyebrow: 'Quello che si vede ovunque',
    title: 'La Trinacria e le teste di moro',
    intro: 'Due oggetti che si incontrano su tutti i balconi, tutti i muri e tutte le bancarelle dell’isola — e di cui quasi nessuno racconta la storia. Uno ha ventitré secoli. L’altro è un omicidio.',
    trinacria: {
      title: 'La Trinacria, o triscele',
      text: 'Il nome viene dal greco: « tre punte ». Sono i tre capi della Sicilia — Lilibeo a ovest, Peloro a nord-est, Passero a sud-est. Al centro una testa di donna: Hybla, dea della fertilità. Le tre gambe piegate le girano intorno, e l’isola intera sta in quel movimento. I serpenti vengono dalla tradizione greca ; le spighe di grano furono aggiunte dai Romani, per i quali la Sicilia era il granaio dell’Impero — il mito ne attribuisce il dono a Cerere, che avrebbe insegnato l’agricoltura ai Siciliani. Il simbolo compare sulle monete di Siracusa nel III secolo avanti Cristo. Bisognerà aspettare il 2000 perché l’Assemblea regionale ne faccia ufficialmente la bandiera della Sicilia.',
      alt: 'Una Trinacria in ghisa nera appesa a un muro di cementine siciliane',
      caption: 'Tre gambe, una testa di donna, delle spighe: ventitré secoli stanno lì dentro.',
    },
    teste: {
      title: 'Le teste di moro',
      text: 'La leggenda si svolge alla Kalsa, il quartiere arabo di Palermo, ai tempi della dominazione musulmana. Una fanciulla bellissima coltivava piante sul balcone. Un moro la vide, se ne innamorò e fu riamato — finché lei non scoprì che aveva moglie e figli in Oriente. Lo uccise nel sonno, gli tagliò la testa e la usò come vaso. Ci piantò del basilico. Il profumo era così bello che i vicini ordinarono vasi di ceramica a imitazione. Una seconda versione racconta di due amanti, lei siciliana e nobile, lui arabo, scoperti dalla famiglia e decapitati entrambi — le loro teste esposte su un balcone come monito. Per questo si vendono in coppia.',
      alt: 'Una coppia di teste di moro in ceramica di Caltagirone, verde e bianco, un uomo e una donna coronati',
      caption: 'Si comprano a due, in ricordo degli amanti. Queste sono di Caltagirone.',
    },
    note: 'Caltagirone è la capitale della ceramica siciliana: la città vi si dedicò dopo la conquista normanna del 1090, il terremoto del 1693 la rase al suolo, e si ricostruì in barocco — la scalinata di Santa Maria del Monte sale ancora, gradino dopo gradino, in maiolica dipinta.',
  },
  legendsPage: {
    eyebrow: 'Quello che si racconta',
    title: 'Otto leggende siciliane',
    intro: 'Un’isola che è stata greca, araba, normanna e spagnola non manca di storie. Eccone otto, dallo Stretto di Messina al cratere dell’Etna. Alcune spiegano un fenomeno reale, altre una pietra che si può ancora toccare.',
    items: [
      { title: 'Cola Pesce', place: 'Messina', text: 'Figlio di pescatore, nuotava meglio dei pesci. Federico II lo mise alla prova: gettò in mare una coppa, Cola la riportò ; poi la corona, la riportò ancora ; poi un anello, più a fondo. Non è mai risalito. Là sotto aveva scoperto che la Sicilia poggia su tre colonne — a Capo Peloro, Capo Passero e Capo Lilibeo — e che una, corrosa dal fuoco dell’Etna, si stava spezzando. È rimasto lì a sostenerla. Quando la terra trema, sta cambiando spalla. La leggenda è attestata già dal XII secolo.' },
      { title: 'Aretusa', place: 'Siracusa', text: 'La ninfa Aretusa fuggiva il dio-fiume Alfeo che la inseguiva. Supplicò Artemide, che la trasformò in fonte. Alfeo si fece fiume per raggiungerla e attraversò il mare dalla Grecia. La fonte porta il suo nome, a Ortigia, a pochi metri dal porto — acqua dolce che sgorga sul bordo del mare salato. Vi cresce ancora il papiro.' },
      { title: 'La Fata Morgana', place: 'Lo Stretto di Messina', text: 'In certe condizioni di temperatura la Calabria sembra così vicina da poterci arrivare a piedi — città che galleggiano sull’acqua, capovolte. La fata Morgana mostrava ai marinai queste terre incantate per perderli. È un vero miraggio, che porta ancora il suo nome nei libri di ottica, e che si può vedere oggi.' },
      { title: 'Cariddi e Scilla', place: 'Lo Stretto di Messina', text: 'Su una riva Scilla, il mostro dalle sei teste che afferrava i marinai al passaggio. Sull’altra Cariddi, il vortice che inghiottiva navi intere. In mezzo, il passaggio più temuto dell’antichità — e l’espressione che si usa ancora quando si può scegliere solo fra due disgrazie.' },
      { title: 'Mata e Grifone', place: 'Messina', text: 'Lei è siciliana, lui un guerriero saraceno ; se ne innamora, lei rifiuta, lui si converte per sposarla. Di questa coppia di giganti la città ha fatto due statue enormi che porta in processione ogni agosto. È l’unica leggenda dell’elenco che festeggia la mescolanza invece del dramma.' },
      { title: 'La baronessa di Carini', place: 'Il castello di Carini, presso Palermo', text: 'Laura Lanza, baronessa di Carini, fu uccisa dal proprio padre nel 1563 per adulterio. Si dice che il suo fantasma vaghi ancora fra le mura, e che lo si senta nelle notti di luna piena. Vi sarebbe sepolto un tesoro, custodito da spiriti inquieti ; nessuno l’ha trovato. Il castello, quello, esiste e si visita.' },
      { title: 'Empedocle', place: 'L’Etna', text: 'Il filosofo di Agrigento, affascinato dal fuoco, si sarebbe gettato nel cratere — per dimostrare di essere un dio, o per sparire senza lasciare corpo. Il vulcano gli ha restituito una cosa sola: un sandalo. È la fine più letteraria che un filosofo si sia inventato.' },
      { title: 'La Vecchia dell’Aceto', place: 'Palermo', text: 'Nel Seicento una vecchia del centro storico preparava pozioni. Si andava da lei di nascosto, soprattutto giovani donne. Molte sparivano. Furono trovati corpi trattati con l’aceto, per coprirne l’odore. Fu arrestata e processata. Si dice che il suo spirito si aggiri per i vicoli, e che a volte vi passi un odore pungente.' },
    ],
    note: 'Le tre colonne di Cola Pesce sono i tre capi della Trinacria: Peloro, Passero, Lilibeo. La leggenda e il simbolo raccontano la stessa isola, retta dalle sue tre punte.',
  },
  scopaPage: {
    eyebrow: 'Il gioco di casa',
    title: 'La scopa, e le sue regole',
    intro: 'È il gioco di carte italiano per eccellenza: quello delle serate in famiglia, dei bar di paese e dei pranzi che non finiscono. Si gioca in fretta, si impara in dieci minuti e si rigioca per tutta la vita. Il logo di questo sito è, del resto, una carta da scopa.',
    suitsAlt: 'I quattro semi delle carte italiane: bastone, denaro, coppa e spada',
    suitsCaption: 'I quattro semi: bastoni, denari, coppe, spade.',
    rules: [
      { title: 'Il mazzo', text: 'Quaranta carte, quattro semi da dieci: bastoni, denari, coppe e spade. Niente donna — le figure sono fante (8), cavallo (9) e re (10). L’asso vale 1. È tutto quello che serve sapere per cominciare.' },
      { title: 'La distribuzione', text: 'Tre carte a ogni giocatore, quattro scoperte al centro del tavolo. Quando tutti hanno giocato le loro tre carte se ne danno altre tre, e così via fino a esaurire il mazzo. Il tavolo, invece, non si rifornisce più.' },
      { title: 'Prendere', text: 'Si cala una carta. Se ha lo stesso valore di una carta sul tavolo si prende quella — e non c’è scelta: se il valore esatto è sul tavolo, si è obbligati a prenderlo invece di una somma. Altrimenti si possono prendere più carte la cui somma faccia il valore della propria. Un 7 prende un 7, oppure un 4 e un 3. Se niente corrisponde, la carta resta sul tavolo.' },
      { title: 'La scopa', text: 'Se la presa svuota completamente il tavolo, è una scopa. Un punto, subito, e lo si segna mettendo la carta di traverso nel proprio mazzetto. Un’unica eccezione: la scopa fatta con l’ultimissima carta della partita non conta.' },
      { title: 'La fine', text: 'Le carte rimaste sul tavolo alla fine vanno all’ultimo giocatore che ha preso. Poi si conta.' },
    ],
    scoreTitle: 'Il conteggio, alla fine di ogni mano',
    score: [
      { label: 'Le scope', text: 'Un punto per ogni scopa, lungo tutta la mano.' },
      { label: 'Le carte', text: 'Un punto a chi ne ha di più. Ne servono almeno 21 su 40.' },
      { label: 'I denari', text: 'Un punto a chi ha più carte di denari. Ne servono almeno 6 su 10.' },
      { label: 'Il settebello', text: 'Un punto per il 7 di denari. Una sola carta, un punto garantito — è la carta più contesa del gioco.' },
      { label: 'La primiera', text: 'Un punto, ed è il calcolo più sconcertante. Vedi qui sotto.' },
    ],
    primieraTitle: 'La primiera, spiegata',
    primieraText: 'Si prende la carta migliore di ciascuno dei quattro semi e si somma — ma con una scala a parte, dove il 7 vale più del re. Vince il punto il totale più alto. Il massimo teorico è 84: quattro sette, uno per seme. In caso di parità non segna nessuno.',
    primiera: [
      { carte: 'Il 7', points: '21 punti' },
      { carte: 'Il 6', points: '18 punti' },
      { carte: 'L’asso', points: '16 punti' },
      { carte: 'Il 5', points: '15 punti' },
      { carte: 'Il 4', points: '14 punti' },
      { carte: 'Il 3', points: '13 punti' },
      { carte: 'Il 2', points: '12 punti' },
      { carte: 'Le figure', points: '10 punti' },
    ],
    note: 'Si gioca a 11 punti in due, 16 in tre, 21 a squadre. Il gioco era già diffuso in tutta Italia nel Settecento, e verrebbe da giochi spagnoli passati per Napoli.',
  },
  unescoNote: {
    title: 'Otto città, un terremoto',
    quake: 'L’11 gennaio 1693 un sisma di magnitudo 7,4 rade al suolo la Sicilia sud-orientale. Decine di migliaia di morti, e città intere da rifare. Architetti siciliani formati a Roma le ricostruiscono in un solo movimento, in tardo barocco — e per la prima volta pensando alle scosse successive.',
    towns: 'L’UNESCO le ha iscritte insieme nel 2002, come « Città tardo barocche del Val di Noto »: Caltagirone, Catania, Militello, Modica, Noto, Palazzolo Acreide, Ragusa e Scicli. Otto città, un solo bene, una sola catastrofe all’origine.',
    near: 'Quattro di queste otto città sono a meno di 55 chilometri da casa: Scicli a 8, Modica a 20, Ragusa a 28, Noto a 55. Si può quindi vedere metà di un sito del patrimonio mondiale in una settimana, senza mai fare più di un’ora di strada.',
    syracuse: 'Siracusa non fa parte del Val di Noto: ha un’iscrizione a sé, con la necropoli rupestre di Pantalica, nel 2005. E Caltagirone, la prima della lista, è la città da cui vengono le teste di moro in ceramica.',
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
  sourcesLabel: 'Fonti:',
  filtersMore: 'Mostra tutti i temi',
  filtersLess: 'Mostra meno',
  monthsPrev: 'Mesi precedenti',
  monthsNext: 'Mesi successivi',
  regionFilter: {
    all: 'Vedi tutto',
    places: 'I luoghi',
    customs: 'Usi e costumi',
    specialties: 'Specialità',
    drinks: 'Vini & liquori',
    coffee: 'Il caffè', pasta: 'La pastasciutta', symbols: 'Trinacria e teste di moro', legends: 'Le leggende', scopa: 'La scopa',
    arab: 'Sicilia araba',
    sounds: 'Suoni & immagini',
    etna: 'L’Etna',
    fauna: 'La fauna',
    sports: 'Giochi da spiaggia',
    books: 'Libri',
    italian: 'L’italiano',
    story: 'Il racconto',
    tree: 'L’albero', valguarnera: 'Valguarnera',
    arrival: 'La casa',
    leaving: 'La partenza',
    parking: 'Parcheggiare',
    money: 'I soldi',
    clean: 'Pulizia',
    trip: 'Il viaggio',
    waste: 'La spazzatura',
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
    menuLabel: 'L’italiano',
    tocOpen: 'Vai a una sezione',
    answerCta: 'Rispondi',
    answerChange: 'Cambia',
    sheetClose: 'Chiudi',
    planDesc: {
      prononcer: 'I suoni dell’italiano, e come pronunciarli bene.',
      parler: 'Frasi intere, pronte per ogni situazione.',
      presente: 'Il tempo di tutti i giorni — chiedere, ordinare, presentarsi.',
      passato: 'Raccontare ciò che è già successo.',
      futuro: 'Dire ciò che si farà, senza sbagliare la desinenza.',
      chansons: 'Tre canzoni, le loro parole, e che cosa insegnano.',
      exercices: 'Allenarsi, una domanda alla volta, il punteggio alla fine.',
      ailleurs: 'Dove continuare: app, libri e siti scelti.',
    },
    title: 'Parlare italiano qui',
    intro: 'Non un corso di grammatica: quanto basta per cavarsela dal primo mattino, e poi per capire quello che si dice. Prima la pronuncia, poi frasi intere, la grammatica dopo — e alla fine gli esercizi. Questa versione serve soprattutto a chi vuole rivedere le regole o aiutare qualcuno a impararle.',
    backToTop: 'Torna in cima alla pagina',
    songsTitle: 'Con le canzoni',
    songsIntro: 'Una canzone entra dall’orecchio e resta, dove un elenco di parole si cancella. Per ciascuna: di che parla, le parole da avere in mente prima di ascoltare, e che cosa insegna della lingua.',
    songsWords: 'Le parole da sapere',
    songsPoint: 'Che cosa insegna',
    songsListen: 'La scheda della canzone',
    songsListenSpotify: 'Ascoltare, e leggere il testo',
    songsAll: 'Tutte',
    songsGenres: { lutte: 'Lotte & memoria', sicile: 'La Sicilia', auteur: 'Cantautori' },
    elsewhereTitle: 'Continuare altrove',
    elsewhereIntro: 'Questa pagina non ha audio, ed è il suo limite: non si impara a pronunciare una lingua senza sentirla. Ecco dove andare.',
    assimilNote: 'Il metodo a cui questo corso si ispira è quello di Assimil: lezioni brevi, frasi intere, grammatica spiegata dopo. È un libro a pagamento, e li vale.',
    planTitle: 'Il programma',
    planIntro: 'In ordine, dal più semplice al più impegnativo. Non serve fare tutto: il livello 1 basta per cavarsela una settimana.',
    level1: 'Livello 1 · iniziare',
    level2: 'Livello 2 · cavarsela',
    level3: 'Livello 3 · andare oltre',
    levelAll: 'Tutti i livelli',
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
    drillQuiz: 'Il quiz: le domande di italiano',
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
    intro: 'Sei libri che parlano della Sicilia o che ci si svolgono — e quattro che raccontano quello che alcune famiglie hanno attraversato altrove in Italia, dalla ritirata di Russia al podere dei Cervi. Niente di obbligatorio: è uno scaffale, non un programma.',
    linkLabel: 'La scheda del libro',
    list: [
      { titre: 'Una donna di Ragusa', auteur: 'Maria Occhipinti', annee: '1957', lien: 'https://it.wikipedia.org/wiki/Una_donna_di_Ragusa', text: 'Il libro di qui. Maria Occhipinti aveva ventitré anni ed era incinta di cinque mesi quando si sdraiò davanti al camion militare che portava via i ragazzi del suo quartiere, a Ragusa, il 4 gennaio 1945. Lo pagò con il confino a Ustica, dove partorì, e poi con il carcere. La sua autobiografia passò inosservata nel 1957 e fece l’effetto di una bomba alla riedizione del 1976.' },
      { titre: 'La plupart ne reviendront pas', auteur: 'Eugenio Corti', annee: '1947', lien: 'https://it.wikipedia.org/wiki/I_pi%C3%B9_non_ritornano', text: 'La scelta di Mag. Il diario di un sopravvissuto alla ritirata di Russia: ventotto giorni di accerchiamento nella neve, scritti da un ragazzo di ventidue anni che ne è uscito. Non è un libro siciliano, ma racconta quello che migliaia di famiglie di qui hanno vissuto senza dirlo — e questa casa ne sa qualcosa.' },
      { titre: 'Le parole sono pietre', auteur: 'Carlo Levi', annee: '1955', lien: 'https://it.wikipedia.org/wiki/Carlo_Levi', text: 'Tre viaggi in Sicilia, tra le zolfare, i contadini che occupano le terre e il ricordo ancora fresco di Portella della Ginestra. Il titolo dice il libro. È il racconto migliore di che cosa fu la lotta per la terra nell’isola, scritto a caldo da uno che ascoltava.' },
      { titre: 'Il Gattopardo', auteur: 'Giuseppe Tomasi di Lampedusa', annee: '1958', lien: 'https://it.wikipedia.org/wiki/Il_Gattopardo', text: 'Il grande romanzo siciliano, scritto da un principe alla fine della sua vita e rifiutato da due editori prima di diventare un classico. La Sicilia del 1860, un mondo che crolla e una frase che tutti citano: « se vogliamo che tutto rimanga come è, bisogna che tutto cambi ».' },
      { titre: 'Il giorno della civetta', auteur: 'Leonardo Sciascia', annee: '1961', lien: 'https://it.wikipedia.org/wiki/Il_giorno_della_civetta', text: 'Il libro che ha dato un nome a ciò di cui non si parlava. Un capitano venuto dal Nord indaga su un omicidio in un paese siciliano e sbatte contro un muro di silenzio. Sciascia scriveva quando l’esistenza stessa della mafia era ufficialmente in discussione.' },
      { titre: 'Conversazione in Sicilia', auteur: 'Elio Vittorini', annee: '1941', lien: 'https://it.wikipedia.org/wiki/Conversazione_in_Sicilia', text: 'Un uomo torna a trovare sua madre in Sicilia dopo quindici anni. Pubblicato sotto il fascismo, il libro dice tutto senza nominare mai nulla — per questo passò la censura, e per questo contò.' },
      { titre: 'I Malavoglia', auteur: 'Giovanni Verga', annee: '1881', lien: 'https://it.wikipedia.org/wiki/I_Malavoglia', text: 'Una famiglia di pescatori, una barca, un debito, e il mare che si riprende tutto. Verga scrive i poveri senza compatirli né abbellirli: è la Sicilia di prima delle fotografie, quella dei paesi di costa.' },
      { titre: 'I miei sette figli', auteur: 'Alcide Cervi', annee: '1955', lien: 'https://www.einaudi.it/catalogo-libri/storia/storia-contemporanea/i-miei-sette-figli-alcide-cervi-9788806221157/', text: 'È il padre a raccontare. Sette figli fucilati lo stesso giorno, il 28 dicembre 1943, e un contadino di sessantotto anni che esce di prigione e torna a lavorare la terra con le donne e i nipoti rimasti. Raccolto da Renato Nicolai, tradotto in molte lingue: è la fonte più diretta sulla famiglia di cui si rifà la pasta ogni 25 luglio.' },
      { titre: 'I sette fratelli Cervi. Una famiglia antifascista', auteur: 'Federico Attardo', annee: '2024', lien: 'https://www.beccogiallo.it/negozio/biografie/i-sette-fratelli-cervi/', text: 'La stessa storia a fumetti, realizzata con l’Istituto Cervi, Premio Andersen 2025. Si prende il tempo di raccontare la famiglia PRIMA della Resistenza: i contadini che comprano il primo trattore della zona, la biblioteca itinerante, la casa aperta ai fuggiaschi. Si capisce meglio il seguito quando si è visto da dove partivano.' },
      { titre: 'L’ultima notte dei fratelli Cervi', auteur: 'Dario Fertilio', annee: '2012', lien: 'https://www.marsilioeditori.it/libri/scheda-libro/3171306/l-ultima-notte-dei-fratelli-cervi', text: 'Da leggere sapendo che cos’è: un ROMANZO GIALLO, non un libro di storia, con un personaggio inventato. Sostiene una tesi contestata — che i Cervi sarebbero stati isolati dalla direzione comunista della Resistenza e poi traditi da un infiltrato. Quello che nessuno discute è il resto: arrestati il 25 novembre 1943, fucilati il 28 dicembre dai fascisti.' },
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
  sportsPage: {
    eyebrow: 'Giochi da spiaggia',
    title: 'Quello che si gioca sulla sabbia',
    intro: 'Nessuno di questi giochi chiede un club, una licenza o una prenotazione. Due racchette di legno, tre bocce, e il pomeriggio passa. È anche il modo più semplice per parlare con i vicini di ombrellone: si presta, si contano i punti, si ricomincia.',
    facts: [
      {
        icon: 'sun',
        title: 'I racchettoni',
        text: 'Due racchette di legno, una pallina di gomma, e l’unico scopo è NON farla cadere: non si fanno punti, si tiene lo scambio. È il gioco che Mag chiama tambourin, e non ha torto — discende dal « tamburello da spiaggia » che si giocava sulle spiagge italiane già a inizio Novecento. Nella forma attuale nasce negli anni Settanta, sulla riviera romagnola. Chiedete « racchettoni »: è la parola scritta sulle confezioni.',
      },
      {
        icon: 'tools',
        title: 'Il tamburello, lo sport vero',
        text: 'Mag fa bene a chiamarlo così: il tamburello è uno sport codificato, e l’antenato di quello che si gioca sulla sabbia. Il campo è lungo 80 metri e largo dai 18 ai 20, tagliato da una linea mediana — nessuna rete. Cinque giocatori per squadra all’aperto, tre al coperto. Si conta come nel tennis — 15, 30, 45, gioco — e servono tredici giochi per vincere. Il servizio cambia a ogni gioco, si cambia campo ogni tre. Lo strumento è un cerchio di plastica cerchiato di rame, con una tela sintetica tesa e un’impugnatura di cuoio; il primo fu costruito nel 1861 da un bottaio di Mèze, nell’Hérault. L’Italia ha il suo campionato dal 1896 — ma al Nord, in Lombardia e in Veneto, non qui. In Sicilia si trova il cugino da spiaggia.',
      },
      {
        icon: 'cone',
        title: 'Il beach tennis',
        text: 'Nato in Italia, e proprio dai racchettoni — ma con una rete, un campo e un vincitore. La pallina è più grande e meno dura, la racchetta più spessa. È la versione sportiva dello stesso gesto: qui si contano i punti, e d’estate ci sono tornei lungo tutta la costa.',
      },
      {
        icon: 'pin',
        title: 'Le bocce sulla sabbia',
        text: 'D’estate si organizzano tornei sul posto — Mag lo conferma, ed è il genere di cosa che si scopre passandoci davanti. Sono bocce DI LEGNO — ci tiene, e ha ragione due volte. È il gioco da spiaggia classico in Italia, venduto in cofanetto di legno, mentre la pétanque francese si gioca in acciaio. Ed è un ritorno alle origini: la boccia è stata d’argilla, di pietra, poi di legno, e l’acciaio è arrivato solo nel 1927, a Saint-Bonnet-le-Château. Nel mezzo si giocava con le boules cloutées — legno rivestito da una corazza di chiodi, inventata a Marsiglia nel 1904 da Félix Rofritsch. La regola sta in una frase: vince la boccia più vicina al pallino, e si può mandare via quella dell’avversario colpendola — si chiama bocciata. Sulla sabbia si spiana una striscia di una quindicina di metri e si gioca ai dodici punti. A Donnalucata non è un gioco da turisti: gli stessi pensionati si ritrovano ogni pomeriggio da più di cinquant’anni.',
      },
      {
        icon: 'walk',
        title: 'Beach volley e calcio da spiaggia',
        text: 'I due universali, e qui si giocano come ovunque: una rete tesa fra due paletti, o quattro borse per terra a fare da porte. Non chiedono altro che gente — ed è proprio il loro pregio in vacanza, quando non si è mai lo stesso numero da un giorno all’altro. La sabbia rallenta tutto: un tempo di calcio da spiaggia stanca quanto una partita intera sull’erba.',
      },
      {
        icon: 'wave',
        title: 'Il vento, a fine giornata',
        text: 'La brezza si alza nel pomeriggio e increspa il mare: è l’ora delle tavole. La costa di Scicli fa diciotto chilometri, e l’acqua si fa mossa appena ci si allontana dalle spiagge riparate, verso Sampieri. Niente di spettacolare, ma abbastanza per navigare — e per rendere il bagno più sportivo se restate senza tavola.',
      },
      {
        icon: 'walk',
        title: 'La passeggiata, che è uno sport',
        text: 'Non ridete: è l’esercizio più praticato di Sicilia. La sera, quando cala il caldo, tutto il paese scende a camminare sul lungomare, avanti e indietro, per un’ora. Non si va da nessuna parte. Ci si mostra, ci si ferma, si riparte. È gratis, si fa a ogni età, ed è lì che si incontra la gente.',
      },
      {
        icon: 'tools',
        title: 'A strummula',
        text: 'La trottola siciliana — detta anche u tuppettu. Un pezzo di legno tornito, uno spago avvolto, due righe di gesso per terra a segnare il campo, e si tratta di farla girare il più a lungo possibile. Non è un gioco da spiaggia ma da strada, e ha duemila anni: Omero la cita già nell’Iliade. Se ne vedete una da un rigattiere, è quella.',
      },
    ],
    note: 'Racchette, bocce e palline si trovano in qualsiasi bazar sul mare o supermercato della zona, per pochi euro — inutile portarle da casa. Niente di tutto questo si prenota: si posa sulla sabbia e si comincia.',
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
    familyTitle: 'Conoscete la famiglia?',
    familyIntro: 'Il racconto di Salva e l’albero genealogico. Tre risposte possibili ogni volta, e tutto quello che serve è scritto più in alto in questa pagina — ogni risposta vi dice dove rileggere.',
    italianTitle: 'Conoscete l’italiano?',
    italianIntro: 'Cinquantacinque domande tratte da questo corso — pronuncia, coniugazione, frasi utili, parole delle canzoni. Tre risposte possibili ogni volta, e ognuna vi dice dove rileggere.',
    houseTitle: 'Conoscete la casa?',
    houseIntro: 'La casa, la partenza, il parcheggio, i soldi, la pulizia. Tutto quello che serve è scritto più in alto in questa pagina — ogni risposta vi dice dove rileggere.',
    tripTitle: 'Conoscete il tragitto?',
    tripIntro: 'Aeroporti, traghetti, strade. Tutto quello che serve è scritto più in alto in questa pagina — ogni risposta vi dice dove rileggere.',
    wasteTitle: 'Conoscete la raccolta?',
    wasteIntro: 'Tre domande sui bidoni e le loro sere. Tutto è scritto più in alto in questa pagina.',
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
      { q: 'Quante città comprende il sito UNESCO del Val di Noto ?', choix: ['Otto', 'Cinque', 'Tre'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Quale evento ha fatto nascere il barocco del Val di Noto ?', choix: ['Il sisma dell’11 gennaio 1693', 'Un’eruzione dell’Etna', 'La conquista normanna'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Siracusa fa parte del Val di Noto ?', choix: ['No, ha un’iscrizione a sé con Pantalica', 'Sì, è la prima della lista', 'No, non è patrimonio'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
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
      { q: 'Il monokini è vietato dalla legge in Italia ?', choix: ['No — la Cassazione lo ha stabilito nel 2000', 'Sì, dal 2000', 'Sì, ma solo in Sicilia'], bonne: 0, ancre: 'coutumes', niveau: 'difficile' },
      { q: 'Si può girare in costume nel centro di tutte le città siciliane ?', choix: ['No — alcuni comuni multano da 25 a 150 €', 'Sì, ovunque', 'No, è vietato in tutta la Sicilia'], bonne: 0, ancre: 'coutumes', niveau: 'moyen' },
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
      { q: 'Che cosa vuol dire « pastasciutta » ?', choix: ['La pasta scolata e condita', 'La pasta servita in brodo', 'La pasta cotta al forno'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'Che cosa festeggiava la pastasciutta del 25 luglio 1943 ?', choix: ['La caduta di Mussolini', 'La fine della guerra', 'La festa del paese'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'Quanti fratelli Cervi furono fucilati il 28 dicembre 1943 ?', choix: ['Sette', 'Tre', 'Nove'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'Con che cosa i Cervi condirono la pasta quel giorno ?', choix: ['Burro e parmigiano', 'Pomodoro e basilico', 'Un ragù di carne'], bonne: 0, ancre: 'pastasciutta', niveau: 'moyen' },
      { q: 'In quale paese fu distribuita la pasta ?', choix: ['Campegine', 'Gattatico', 'Reggio Emilia'], bonne: 0, ancre: 'pastasciutta', niveau: 'difficile' },
      { q: 'Che cosa rispose Alcide Cervi a chi gli chiedeva come avesse resistito ?', choix: ['Dopo un raccolto ne viene un altro', 'Il tempo cancella tutto', 'Non bisogna mai dimenticare'], bonne: 0, ancre: 'pastasciutta', niveau: 'difficile' },
      { q: 'Che cosa vuol dire « Trinacria » ?', choix: ['Tre punte, in greco', 'Terra del sole', 'Isola di mezzo'], bonne: 0, ancre: 'symboles', niveau: 'facile' },
      { q: 'Chi è la testa al centro della Trinacria ?', choix: ['Hybla, dea della fertilità', 'Medusa la Gorgone', 'Cerere'], bonne: 0, ancre: 'symboles', niveau: 'difficile' },
      { q: 'Chi ha aggiunto le spighe di grano al simbolo ?', choix: ['I Romani', 'I Greci', 'Gli Arabi'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'In che anno la Trinacria è diventata la bandiera ufficiale della Sicilia ?', choix: ['Nel 2000', 'Nel 1946', 'Nel III secolo avanti Cristo'], bonne: 0, ancre: 'symboles', niveau: 'difficile' },
      { q: 'Nella leggenda, che cosa pianta la fanciulla nella testa tagliata ?', choix: ['Del basilico', 'Del gelsomino', 'Un limone'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'Perché le teste di moro si vendono in coppia ?', choix: ['In ricordo dei due amanti', 'Per incorniciare una porta', 'Perché si tornano a due a due'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'Che cosa sostiene Cola Pesce in fondo al mare ?', choix: ['Una delle tre colonne che reggono la Sicilia', 'Un tesoro sommerso', 'La tomba di Federico II'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'Secondo la leggenda, perché trema la terra in Sicilia ?', choix: ['Cola Pesce cambia spalla', 'L’Etna si risveglia', 'Cariddi gira più forte'], bonne: 0, ancre: 'legendes', niveau: 'facile' },
      { q: 'In che cosa fu trasformata la ninfa Aretusa ?', choix: ['In fonte', 'In alloro', 'In uccello'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'Che cos’è la Fata Morgana ?', choix: ['Un miraggio nello Stretto di Messina', 'Una festa di Palermo', 'Un vento del sud'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'Che cosa restituì il vulcano di Empedocle ?', choix: ['Un sandalo', 'Il suo mantello', 'Niente'], bonne: 0, ancre: 'legendes', niveau: 'difficile' },
      { q: 'Quale leggenda siciliana festeggia la mescolanza invece del dramma ?', choix: ['Mata e Grifone', 'La baronessa di Carini', 'La Vecchia dell’Aceto'], bonne: 0, ancre: 'legendes', niveau: 'difficile' },
      { q: 'Quante carte ha un mazzo da scopa ?', choix: ['Quaranta', 'Cinquantadue', 'Trentadue'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'Quali sono i quattro semi delle carte italiane ?', choix: ['Bastoni, denari, coppe, spade', 'Cuori, picche, fiori, quadri', 'Soli, lune, stelle, mari'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'Che cos’è una « scopa » ?', choix: ['Una presa che svuota tutto il tavolo', 'Il 7 di denari', 'L’ultima carta del mazzo'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'Quale carta vale un punto da sola ?', choix: ['Il settebello, il 7 di denari', 'Il re di coppe', 'L’asso di bastoni'], bonne: 0, ancre: 'scopa', niveau: 'moyen' },
      { q: 'Nella primiera, quanto vale il 7 ?', choix: ['21 punti', '10 punti', '7 punti'], bonne: 0, ancre: 'scopa', niveau: 'difficile' },
      { q: 'Se il valore esatto della tua carta è sul tavolo, che cosa devi fare ?', choix: ['Prenderlo, non hai scelta', 'Prendere piuttosto una somma', 'Passare il turno'], bonne: 0, ancre: 'scopa', niveau: 'difficile' },
      { q: 'Che cosa mangiano i gechi che attraversano il muro la sera?', choix: ['Le zanzare', 'Le briciole', 'Niente, dormono'], bonne: 0, ancre: 'faune', niveau: 'facile' },
      { q: 'Ci sono scorpioni in Sicilia?', choix: ['Sì, ma la loro puntura è innocua', 'No, nessuno', 'Sì, e sono mortali'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Dove nascono le zanzare?', choix: ['Nell’acqua ferma, bastano pochi centimetri', 'Nelle siepi secche', 'Sotto le pietre calde'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Qual è l’unico serpente velenoso della Sicilia?', choix: ['La vipera aspide', 'Il biacco', 'Non ce n’è nessuno'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'Che cosa NON si deve assolutamente fare in caso di morso di vipera?', choix: ['Mettere un laccio o incidere', 'Chiamare i soccorsi', 'Immobilizzare l’arto'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      // ── I giochi da spiaggia. Vedi la nota francese.
      { q: 'Come si chiama il gioco delle racchette di legno da spiaggia?', choix: ['I racchettoni', 'Il pallino', 'La bocciata'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'Ai racchettoni, qual è lo scopo del gioco?', choix: ['Non far cadere la pallina — si tiene lo scambio', 'Fare più punti possibile', 'Colpire l’avversario'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Da che cosa discendono i racchettoni?', choix: ['Dal tamburello da spiaggia', 'Dal beach volley', 'Dalla pelota basca'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Dov’è nato il beach tennis?', choix: ['In Italia, dai racchettoni', 'In Brasile', 'In California'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Come si chiama la bilia piccola, alle bocce?', choix: ['Il pallino', 'La boccia', 'U tuppettu'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Come si chiama il colpo che manda via la boccia avversaria?', choix: ['Una bocciata', 'Una passeggiata', 'Una strummula'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'A quanti punti si gioca a bocce sulla sabbia?', choix: ['Dodici', 'Tredici', 'Ventuno'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Da quanto tempo gli stessi pensionati giocano a bocce a Donnalucata?', choix: ['Da più di cinquant’anni', 'Da due o tre estati', 'Dal 2020'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Quando si alza la brezza?', choix: ['Nel pomeriggio', 'All’alba', 'Nel cuore della notte'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Quanti chilometri fa la costa di Scicli?', choix: ['Diciotto', 'Cinque', 'Quaranta'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Che cos’è la passeggiata?', choix: ['La camminata della sera sul lungomare', 'Una gara di barche', 'Un piatto di pasta'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'Che cos’è « a strummula »?', choix: ['La trottola siciliana', 'Una racchetta di legno', 'Una rete da pesca'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Quale altro nome ha la strummula?', choix: ['U tuppettu', 'U pallino', 'A bocciata'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Quale poeta antico cita già la trottola?', choix: ['Omero, nell’Iliade', 'Virgilio, nell’Eneide', 'Ovidio'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Dove si trovano racchette, bocce e palline sul posto?', choix: ['In qualsiasi bazar sul mare o supermercato', 'Solo a Ragusa', 'Bisogna portarle da casa'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      // ── Il tamburello, lo sport codificato. Fonte inviata da Mag.
      { q: 'Quanto è lungo un campo da tamburello?', choix: ['80 metri', '40 metri', '120 metri'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Che cosa separa i due campi, nel tamburello?', choix: ['Una linea mediana, nessuna rete', 'Una rete come nel tennis', 'Un muro'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Quanti giocatori per squadra, all’aperto?', choix: ['Cinque', 'Tre', 'Sette'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Come si contano i punti nel tamburello?', choix: ['Come nel tennis — 15, 30, 45, gioco', 'Uno alla volta fino a 21', 'In set da undici'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Quanti giochi servono per vincere?', choix: ['Tredici', 'Sei', 'Venti'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'In che anno fu costruito il primo tamburello?', choix: ['Nel 1861, da un bottaio di Mèze', 'Nel 1896', 'Nel 1952'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Da quando l’Italia ha un campionato di tamburello?', choix: ['Dal 1896', 'Dal 1861', 'Dal 1955'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Dove si gioca a tamburello, in Italia?', choix: ['Al Nord — Lombardia, Veneto', 'In Sicilia', 'Ovunque allo stesso modo'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Di che cosa è fatto lo strumento?', choix: ['Un cerchio di plastica cerchiato di rame, con tela sintetica', 'Legno massiccio', 'Metallo pieno'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      // ── Le bocce di legno. Mag: « la pétanque sono bocce di legno ».
      { q: 'Di che cosa sono fatte le bocce del gioco da spiaggia italiano?', choix: ['Di legno', 'Di acciaio', 'Di vetro'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'Quali materiali ha attraversato la boccia, nell’ordine?', choix: ['Argilla, pietra, legno, poi acciaio', 'Acciaio, legno, poi pietra', 'Vetro, legno, poi acciaio'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'In che anno arriva l’acciaio nella pétanque?', choix: ['Nel 1927', 'Nel 1904', 'Nel 1861'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Che cos’è una boule cloutée?', choix: ['Legno rivestito da una corazza di chiodi', 'Una boccia bucata', 'Una boccia dipinta a mano'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Chi ha inventato la boule cloutée, e dove?', choix: ['Félix Rofritsch, a Marsiglia nel 1904', 'Jean Blanc, a Lione nel 1930', 'Un bottaio di Mèze nel 1861'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      // ── Punta Corvo e il beach volley. Contenuto dato da Mag.
      { q: 'Dove entra il mare, vicinissimo a Cava d’Aliga?', choix: ['Nella Grotta dei Contrabbandieri', 'Nella Fornace Penna', 'Nel porto di Donnalucata'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Che cos’è « a spaccazza »?', choix: ['Una discesa in una fessura della scogliera', 'Una grotta sottomarina', 'Un sentiero di cresta'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Il rudere di Punta Corvo era…', choix: ['La casa del finanziere, un posto di guardia', 'Un vero faro', 'Una cappella'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'Quali piante crescono nelle cale di Punta Corvo?', choix: ['Palme nane', 'Pini marittimi', 'Ulivi'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Come si costeggia la costa fino a Sampieri?', choix: ['Per una strada sterrata', 'Per l’autostrada', 'Solo in barca'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Perché il calcio da spiaggia stanca così tanto?', choix: ['La sabbia rallenta tutto', 'Le partite durano di più', 'Il pallone è più pesante'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'Che cosa serve per giocare a beach volley o a calcio da spiaggia?', choix: ['Nient’altro che gente', 'Un campo omologato', 'Una licenza'], bonne: 0, ancre: 'sports', niveau: 'facile' },
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
      { q: '« Odio gli indifferenti », scrive Gramsci nel 1917. Che cosa significa?', choix: ['Odio chi non prende posizione', 'Amo le differenze', 'Ascolto gli altri'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Come si dice « fucilare » ?', choix: ['Fucilare', 'Festeggiare', 'Scolare'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'In « pastasciutta », il gruppo SCI si pronuncia…', choix: ['Come in « sciarpa »', 'Come « ski »', 'Come « si »'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Sciopero » significa…', choix: ['L’astensione dal lavoro', 'Il lavoro', 'La festa'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Come si pronuncia l’inizio di « sciopero »?', choix: ['Come in « pesce »', 'Sko', 'Tcho'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Né dio né padrone » — che cosa vuol dire « padrone »?', choix: ['Il capo, il proprietario', 'Il prete', 'Il padre'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Non si parte! » era il grido del gennaio 1945. Voleva dire…', choix: ['Rifiuto della leva militare', 'Comincia la festa', 'Andiamo via tutti'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'In « lasciatemi cantare », che cosa vuol dire « lasciatemi »?', choix: ['Permettetemi', 'Cantatemi', 'Ascoltatemi'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Ora e sempre Resistenza » significa…', choix: ['Adesso e per sempre, Resistenza', 'Ieri e domani, la pace', 'Qui e là, la patria'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« Bella ciao » — che cosa vuol dire « ciao » in questo ritornello?', choix: ['Addio: si parte a combattere', 'Buongiorno: si arriva', 'Grazie: si ringrazia'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Come si dice « sono anarchica » al femminile?', choix: ['Sono anarchica', 'Sono anarchico', 'Ho anarchica'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« Pessimismo dell’intelligenza, ottimismo della volontà » — il motto di Gramsci dice…', choix: ['Vedere chiaro senza rinunciare ad agire', 'Sperare senza pensare', 'Tacere e aspettare'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« Buongiorno » si usa…', choix: ['La mattina e fino al primo pomeriggio', 'Solo all’alba', 'Solo la sera'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Al banco, « un caffè » significa…', choix: ['Un espresso', 'Un caffè lungo', 'Un caffellatte'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: '« Quanto costa? » significa…', choix: ['Qual è il prezzo?', 'Dov’è?', 'A che ora?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Per dire « non parlo italiano » si dice…', choix: ['Non parlo italiano', 'Non parla italiano', 'Non parliamo italiano'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Mi scusi » invece di « scusa » è…', choix: ['La forma di cortesia, a uno sconosciuto', 'Quello che si dice a un bambino', 'Un insulto'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Compagno » vuol dire camerata — ma anche…', choix: ['Il partner, in amore', 'Il capo', 'Il vicino'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« L’unione fa la forza » significa…', choix: ['Insieme si è più forti', 'La forza fa l’unione', 'L’unione fa la festa'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Che cosa vuol dire « occupare le terre »?', choix: ['Prendere possesso delle terre', 'Coltivare le terre', 'Vendere le terre'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« La lotta continua » significa…', choix: ['La lotta va avanti', 'La lotta è finita', 'La lotta comincia'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'In « Sacco e Vanzetti sono stati giustiziati », « sono stati » indica…', choix: ['Il passato prossimo, con essere', 'Il futuro', 'Il presente'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      // ── Italiano, seconda infornata. Vedi la nota francese.
      { q: 'Che cosa succede a C e G davanti a E e I?', choix: ['Si addolciscono', 'Restano dure', 'Non si pronunciano'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'A cosa serve la H in italiano, dopo C o G?', choix: ['A indurire di nuovo la consonante', 'Ad allungare la vocale', 'A segnare l’accento'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Come si dice « gli » in « famiglia »?', choix: ['Come « ill » di famille in francese', 'Come una G dura', 'Come una J'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Dove cade l’accento tonico, quasi sempre?', choix: ['Sulla penultima sillaba', 'Sulla prima', 'Sull’ultima'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Perché « caffè » porta un accento scritto?', choix: ['Perché l’accento cade sull’ultima sillaba', 'Per allungare la E', 'Perché è una parola straniera'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Le doppie consonanti, in italiano…', choix: ['Si sentono: si tiene la consonante', 'Non si pronunciano', 'Si dicono come una sola'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Quante sillabe si sentono in « pane »?', choix: ['Due sillabe piene', 'Una sola', 'Tre'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Come si dice « sc » davanti a A, O o U — come in « scuola »?', choix: ['Sk', 'Sc come sciare', 'S'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Come si chiede il conto?', choix: ['Il conto, per favore', 'Quant’è?', 'Basta così'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Come si segnala un’allergia ai crostacei?', choix: ['Sono allergico ai crostacei', 'È piccante?', 'Che cosa mi consiglia?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Come si chiede di ripetere più lentamente?', choix: ['Può ripetere più lentamente?', 'Come si chiama?', 'A che ora chiudete?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Che cos’è « un caffè corretto »?', choix: ['Un caffè « corretto » con un goccio di liquore', 'Un caffè ristretto', 'Un caffè lungo'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Da quando si dice « Buonasera »?', choix: ['Da metà pomeriggio', 'Dal tramonto', 'Dopo cena'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Come si dice di aver bucato una gomma?', choix: ['Ho bucato una gomma', 'Il water perde', 'Non c’è acqua calda'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Cosa si chiede in farmacia contro le punture di zanzara?', choix: ['Avete qualcosa per le punture di zanzara?', 'Mi fa male qui', 'Ho bisogno di aiuto'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Il presente di « parlare », alla prima persona?', choix: ['parlo', 'parli', 'parla'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Come si forma il presente in italiano?', choix: ['Si toglie la desinenza dell’infinito e si aggiunge quella della persona', 'Si mette un ausiliare davanti al verbo', 'Si lascia l’infinito com’è'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Che cosa vuol dire « domani parto »?', choix: ['Parto domani', 'Sono partito ieri', 'Partirei volentieri'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Quali sono le tre famiglie di verbi italiani?', choix: ['-are, -ere, -ire', '-ar, -er, -ir', '-are, -ire, -ure'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '« Noi » di « prendere », al presente?', choix: ['prendiamo', 'prendete', 'prendono'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Che cosa vuol dire « Né dio né padrone »?', choix: ['Né dio né padrone', 'Né pane né lavoro', 'Né ieri né domani'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Chi ha guidato il sindacato anarchico italiano?', choix: ['Armando Borghi', 'Leda Rafanelli', 'Camillo Berneri'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Che cosa ha aperto Leda Rafanelli?', choix: ['Una casa editrice anarchica', 'Una scuola serale', 'Un sindacato contadino'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Dove è morto Camillo Berneri, nel 1937?', choix: ['A Barcellona', 'A Milano', 'A Parigi'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'In che anno è scoppiata la Settimana Rossa?', choix: ['Nel giugno 1914', 'Nel gennaio 1945', 'Nel 1927'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Che cosa vuol dire « prendere in giro »?', choix: ['Prendere in giro qualcuno', 'Fare un giro in macchina', 'Prendersela comoda'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '« La gente » è una parola…', choix: ['Singolare in italiano, plurale in francese', 'Sempre plurale', 'Maschile'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Che cosa vuol dire « piano », oltre a « adagio »?', choix: ['Il piano di un palazzo', 'Il pavimento', 'La porta'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Quale parola italiana serve sia per arrivare che per andarsene?', choix: ['Ciao', 'Buongiorno', 'Grazie'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: '« La mano » è una delle rare parole in -o a essere…', choix: ['Femminile', 'Invariabile', 'Sempre plurale'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Che cosa vuol dire il prefisso « ri- », in « ricostruire »?', choix: ['Di nuovo', 'Contro', 'Quasi'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Come si dice « la valigia »?', choix: ['La valigia', 'La città', 'La stagione'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'Chi parte è l’emigrante; chi arriva è…', choix: ['L’immigrato', 'Il partigiano', 'Il forestiero'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Che cosa vuol dire « dolce »?', choix: ['Dolce e zuccherato insieme', 'Amaro', 'Freddo'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Come si dice « meglio » in italiano?', choix: ['Meglio', 'Più bene', 'Molto bene'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      // ── Le pagine pratiche. Vedi la nota francese.
      { q: 'Dov’è la valvola generale dell’acqua?', choix: ['Nella strada, all’angolo scendendo a destra', 'In lavanderia', 'Sotto il lavello della cucina'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'La valvola dell’acqua è chiusa quando è…', choix: ['Perpendicolare', 'Parallela', 'Verso l’alto'], bonne: 0, ancre: 'arrivee', niveau: 'difficile' },
      { q: 'Si può bere l’acqua del rubinetto?', choix: ['No, e nemmeno per il ghiaccio', 'Sì, senza problemi', 'Solo la mattina'], bonne: 0, ancre: 'arrivee', niveau: 'facile' },
      { q: 'Per che cosa va benissimo l’acqua del rubinetto?', choix: ['Cucinare, la pasta, il caffè, i piatti', 'Solo i piatti', 'Per niente'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Dov’è lo scaldabagno?', choix: ['In bagno, dentro la doccia', 'In lavanderia', 'Sulla terrazza'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Dov’è la chiave della lavanderia?', choix: ['Nel mobiletto a cassetti dentro la credenza del soggiorno', 'Sotto lo zerbino', 'Nella camera piccola'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Dove sono le lenzuola?', choix: ['Nel cassetto dell’armadio, nella camera piccola', 'In lavanderia', 'Sotto il letto della camera grande'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'La casa ha l’aria condizionata?', choix: ['No — persiane chiuse di giorno, aperte la sera', 'Sì, in ogni camera', 'Sì, ma solo in soggiorno'], bonne: 0, ancre: 'arrivee', niveau: 'facile' },
      { q: 'Ogni quanto annaffiare le piante?', choix: ['Ogni tre o quattro giorni, circa 3 litri a pianta', 'Ogni giorno, un litro', 'Una volta a settimana'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Perché farsi la doccia in spiaggia tornando dal mare?', choix: ['Perché la sabbia non finisca nelle tubature', 'Per risparmiare acqua', 'Perché l’acqua è calda'], bonne: 0, ancre: 'arrivee', niveau: 'difficile' },
      { q: 'Che cosa fare del frigo prima di partire?', choix: ['Svuotarlo, staccarlo e lasciare la porta socchiusa', 'Lasciarlo acceso e pieno', 'Staccarlo e chiuderlo bene'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'Che cosa si ritira prima di partire?', choix: ['Il telo dell’amaca, la panchetta e gli sgabelli di legno', 'I vasi di fiori', 'Il tavolo della terrazza'], bonne: 0, ancre: 'depart', niveau: 'difficile' },
      { q: 'Che cosa si fa della biancheria prima di partire?', choix: ['La si lava e si rifanno i letti per i prossimi', 'La si lascia nel cesto', 'La si porta via'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'E se la biancheria è ancora umida al momento di chiudere?', choix: ['La si lascia stesa in casa, mai piegata', 'La si piega nel cesto', 'La si mette in un sacchetto'], bonne: 0, ancre: 'depart', niveau: 'difficile' },
      { q: 'Raccolta persa la vigilia della partenza?', choix: ['Si lasciano sulla terrazza, mai in strada', 'Si lasciano in strada', 'Si portano via'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'Che cosa dice un posto auto blu?', choix: ['A pagamento — biglietto dietro il parabrezza', 'Gratuito', 'Riservato ai residenti'], bonne: 0, ancre: 'parking', niveau: 'facile' },
      { q: 'Un posto bianco è gratuito, ma…', choix: ['Può essere a tempo — disco orario obbligatorio', 'È riservato alle consegne', 'Diventa a pagamento la sera'], bonne: 0, ancre: 'parking', niveau: 'moyen' },
      { q: 'A chi sono riservati i posti gialli?', choix: ['Disabili con contrassegno, consegne, forze dell’ordine', 'Alle donne incinte', 'Alle auto elettriche'], bonne: 0, ancre: 'parking', niveau: 'moyen' },
      { q: 'Quanto costa un biglietto non esposto o un disco dimenticato?', choix: ['41 €', '25 €', '80 €'], bonne: 0, ancre: 'parking', niveau: 'difficile' },
      { q: 'Dove si trova un disco orario se il noleggio non lo fornisce?', choix: ['In qualsiasi tabaccheria', 'Alla posta', 'In questura'], bonne: 0, ancre: 'parking', niveau: 'difficile' },
      { q: 'Come si chiama un distributore di contanti in Italia?', choix: ['Un Bancomat', 'Un Postomat', 'Una Cassa'], bonne: 0, ancre: 'argent', niveau: 'facile' },
      { q: 'Quanti distributori ci sono a Donnalucata?', choix: ['Due', 'Uno solo', 'Quattro'], bonne: 0, ancre: 'argent', niveau: 'moyen' },
      { q: 'Come si chiama il distributore delle Poste italiane?', choix: ['Il Postamat', 'Il Postabank', 'Il Posteomat'], bonne: 0, ancre: 'argent', niveau: 'difficile' },
      { q: 'Perché portarsi un po’ di contanti?', choix: ['Molti piccoli negozi, e il mercato, accettano solo quelli', 'Le carte straniere sono rifiutate', 'I distributori chiudono d’estate'], bonne: 0, ancre: 'argent', niveau: 'moyen' },
      { q: 'Dove depongono le zanzare?', choix: ['Nell’acqua ferma — sottovasi, secchi, annaffiatoio', 'Nella spazzatura', 'Sotto i mobili'], bonne: 0, ancre: 'bestioles', niveau: 'moyen' },
      { q: 'Qual è il migliore dei contenitori ermetici?', choix: ['Il frigo', 'Un barattolo di vetro', 'Un sacchetto per congelare'], bonne: 0, ancre: 'bestioles', niveau: 'difficile' },
      { q: 'Come si combattono le formiche?', choix: ['Non si combattono: non si dà loro niente', 'Con un insetticida', 'Chiudendo le fessure'], bonne: 0, ancre: 'bestioles', niveau: 'moyen' },
      { q: 'Quale vecchia abitudine del sud prima di rimettersi le scarpe?', choix: ['Scuotere le scarpe', 'Rovesciare le scarpe', 'Ritirarle la notte'], bonne: 0, ancre: 'bestioles', niveau: 'difficile' },
      { q: 'Quale aeroporto è consigliato per venire?', choix: ['Catania (CTA)', 'Palermo (PMO)', 'Comiso (CIY)'], bonne: 0, ancre: 'voyage', niveau: 'facile' },
      { q: 'Quale aeroporto è il più vicino alla casa?', choix: ['Comiso (CIY), circa 40 minuti di strada', 'Catania (CTA)', 'Palermo (PMO)'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'Da dove parte il traghetto per Messina?', choix: ['Da Villa San Giovanni', 'Da Reggio Calabria', 'Da Napoli'], bonne: 0, ancre: 'voyage', niveau: 'difficile' },
      { q: 'Quanto dura la traversata da Genova?', choix: ['Una ventina di ore', 'Una ventina di minuti', 'Sei ore'], bonne: 0, ancre: 'voyage', niveau: 'difficile' },
      { q: 'Dove si sbarca venendo da Genova?', choix: ['A Palermo', 'A Messina', 'A Catania'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'Quanto dura la traversata dello stretto?', choix: ['Una ventina di minuti, senza prenotazione', 'Due ore', 'Una notte intera'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'Quando si mettono fuori i bidoni?', choix: ['La sera prima — il camion passa presto', 'La mattina stessa', 'Quando sono pieni'], bonne: 0, ancre: 'dechets', niveau: 'facile' },
      { q: 'Che cosa succede se un bidone esce la sera sbagliata?', choix: ['Resta fuori una settimana', 'Viene raccolto lo stesso', 'Il comune fa una multa'], bonne: 0, ancre: 'dechets', niveau: 'moyen' },
      { q: 'Perché i giorni di raccolta possono cambiare?', choix: ['Il comune li cambia per le feste, d’estate, o cambiando gestore', 'Non cambiano mai', 'Dipendono dal tempo'], bonne: 0, ancre: 'dechets', niveau: 'difficile' },
      // ── La pagina famiglia. Vedi la nota francese.
      { q: 'Dove è nato Salvatore Contrino?', choix: ['A Valguarnera, in Sicilia', 'A Scicli', 'A Cava d’Aliga'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'In che anno è nato Salvatore?', choix: ['1947', '1937', '1957'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'Da dove tornava suo padre Angelo quando è rimasto vedovo?', choix: ['Dai campi russi', 'Dall’America', 'Dall’Africa del Nord'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Chi ha cresciuto Salvatore?', choix: ['La nonna Giuseppina, nonna Pipine', 'Una zia rimasta in Sicilia', 'Suo padre Angelo'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Dove era emigrata nonna Pipine con i suoi figli?', choix: ['A Saint-Étienne', 'A Bruxelles', 'A Lione'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Lo ha cresciuto come…', choix: ['Il decimo dei fratelli', 'Un nipote a parte', 'Il suo figlio maggiore'], bonne: 0, ancre: 'recit', niveau: 'difficile' },
      { q: 'A che età è partito a lavorare in Belgio?', choix: ['A diciannove anni', 'A quindici anni', 'A venticinque anni'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Che cosa riunisce la casa di Cava d’Aliga, di generazione in generazione?', choix: ['La famiglia', 'I vicini del paese', 'Gli amici del Belgio'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'Qual è il cognome da nubile di Giuseppina, la madre dei fratelli Contrino?', choix: ['Marcino', 'Sberna', 'Canolo'], bonne: 0, ancre: 'arbre', niveau: 'facile' },
      { q: 'Come si chiamano i due figli di Jacques?', choix: ['Nathalie e Olivier', 'Christian e Ambre', 'Salvatore e Tino'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Quale figlia di Helene ha sposato Patrick Gamino?', choix: ['Angelina, detta Angèle', 'Rosalba, detta Rose', 'Giuseppina, detta Jo'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Qual è il cognome del secondo marito di Lucia?', choix: ['Dolciamore', 'Gallois', 'Gamino'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Chi sono i genitori di Pierre Lux, nato nel 1881?', choix: ['Henri Lux e Angélique Bourg', 'Augustin Viseux e Flore Marie Wasson', 'Louis Thurot e Mélanie Souveton'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Chi sono i genitori di Angelina Viseux, nata nel 1882?', choix: ['Augustin Viseux e Flore Marie Wasson', 'Henri Lux e Angélique Bourg', 'Pierre Lux e Juliette Thurot'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In che anno è morto Augustin Viseux, il padre di Angelina?', choix: ['1899', '1944', '1959'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Chi è l’antenato più antico dell’albero, dal lato di Angelina Viseux?', choix: ['Jean Baptiste Viseux, circa 1702', 'Adrien Carpentier, circa 1701', 'Denis Fréville'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In che anno si sono sposati Pierre Antoine Viseux e Rosalie Fréville?', choix: ['1843', '1800', '1880'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In quale comune sono sepolti Pierre Lux e Angelina Viseux?', choix: ['Saint-Avold', 'Saint-Étienne', 'Valguarnera'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Chi sono i figli di Angelo Contrino e della seconda moglie Conchetta Sberna?', choix: ['Josephine, Rosario, Stefano e Maria Assunta', 'Solo Salvatore', 'David, Michaël e Mag'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In che anno è nata Juliette Emilienne Thurot?', choix: ['1923', '1898', '1920'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Chi ha sposato Juliette Emilienne Thurot in seconde nozze?', choix: ['Charles Gallois', 'Patrick Gamino', 'Louis Thurot'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Qual è il cognome da nubile di Régine, la madre di Mag?', choix: ['Lux', 'Thurot', 'Viseux'], bonne: 0, ancre: 'arbre', niveau: 'facile' },
      { q: 'Come si chiama la figlia di Benito che conosciamo?', choix: ['Ambre', 'Zoé', 'Manon'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Come si chiama il primo figlio di Gabi?', choix: ['Christian', 'Stefano', 'Rosario'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Qual è il diminutivo di Rosario, figlio di Angelo e Conchetta Sberna?', choix: ['Saro', 'Jo', 'Rose'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In quale provincia si trova Valguarnera Caropepe ?', choix: ['Enna, nel centro della Sicilia', 'Ragusa, a sud-est', 'Palermo, a nord'], bonne: 0, ancre: 'valguarnera', niveau: 'moyen' },
      { q: 'Quale reggimento canadese guidava l’avanzata sulla strada 117, il 17 luglio 1943 ?', choix: ['Il Carleton and York Regiment', 'Il Royal 22e Régiment', 'Il West Nova Scotia Regiment'], bonne: 0, ancre: 'valguarnera', niveau: 'difficile' },
      { q: 'Che cosa trovarono i 48th Highlanders entrando a Valguarnera ?', choix: ['Nessun tedesco : il paese era vuoto', 'Un contrattacco', 'Un ponte distrutto'], bonne: 0, ancre: 'valguarnera', niveau: 'difficile' },
      { q: 'Che cosa faceva la famiglia prima di andare al mare, d’estate ?', choix: ['Passava da Valguarnera a trovare la famiglia e nonno Angelo', 'Andava prima a Palermo', 'Dormiva a Ragusa'], bonne: 0, ancre: 'valguarnera', niveau: 'facile' },
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
      { icon: 'drop', title: 'Acqua', items: ['La valvola generale, quella che apre e chiude tutta l’acqua della casa, è in strada: all’angolo, scendendo a destra — perpendicolare = chiusa.', 'In lavanderia, sul retro, sul muro tra la lavatrice e il lavello, c’è una seconda valvola: comanda solo l’acqua della terrazza sul retro. La chiave della lavanderia è lì vicino, nel mobiletto a cassetti della credenza del salotto.', 'Lo scaldabagno è in bagno, dentro la doccia.'] },
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
    'Two kilometres from the house the coast stops being a beach: a low cliff, hollowed by the water, which you follow along a dirt track all the way to Sampieri. Here are the Grotta dei Contrabbandieri — the Smugglers’ Cave — where the sea comes in through an arm of water that lights up as the sun drops low, and “a spaccazza”, a natural descent cut into a fissure so narrow that only one person passes at a time. Out on the point, an abandoned building with its sentry box on the edge of the drop: not quite a lighthouse, but the casa del finanziere, the old customs post, where Montalbano was filmed. All around: agaves, prickly pears, capers and dwarf palms.',
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
    ['The Smugglers’ Cave, where the sea comes in.', '“A spaccazza”: a descent through a fissure in the cliff.', 'The casa del finanziere, an old customs post mistaken for a lighthouse.', 'Dwarf palms, agaves and prickly pears.', 'Dirt track all the way to Sampieri.'],
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
  ], storyOpen: 'This story is written by many hands. A date, a place, a name, an anecdote, a photograph — send them over and they will find their place here. Most useful of all: say who you are talking about, when, and where. That is what lets us hook each piece onto the right spot.', storyOpenCta: 'Add to the story', storyOpenSubject: 'Family history — I have something to add', treeTitle: 'Family tree', treeNote: 'What the family has passed on to us. Blanks remain — they are listed at the bottom, and anyone can fill them in.', treePaternal: 'Paternal grandparents', treeMaternal: 'Maternal grandparents', treeWife1: '1st wife', treeWife2: '2nd wife', treeMarriage1: '1st marriage', treeMarriage2: '2nd marriage', treeToday: 'Today', treeGreat: 'Great-grandparents', treeGreat2: 'Great-great-grandparents', treeDeeper: 'Go further back', treeGen5: '5 generations back', treeGen6: '6 generations back', treeGen7: '7 generations back', treeGen8: '8 generations back', treeAbout: 'around', treeBefore: 'before', treeAfter: 'after', treeWed: 'married in', treeWedAbout: 'married around', treeBuried: 'buried in', treeParents: 'The parents', treeChildren: 'The children', treeQuestionsTitle: 'What we are missing', treeAdd: '+ Add my branch', treeAddSubject: 'Family tree — my branch', treeExample: 'People and dates are missing — tell us what you know.', treeOpen: 'Expand', treeClose: 'Collapse', treeOpenAll: 'Expand all', treeCloseAll: 'Collapse all', treeKid: 'child', treeKids: 'children', treeSideFather: 'Contrino side', treeSideMother: 'Lux side', treeSideUs: 'Us' },
  stayPage: { title: 'The calendar', intro: 'When the house is occupied, so the family can coordinate.', legend: { mag: 'Mag', close: 'Close family', inlaw: 'In-laws', family: 'Cousins', outside: 'Outside the family', tentative: 'To confirm', free: 'Free' } },
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
    intro: 'What is done, and what is not.',
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
      {
        icon: 'wave',
        title: 'In a swimsuit all day — but not everywhere',
        text: 'At Cava d’Aliga the day dresses on very little: a swimsuit, a pareo, and that is that. The beach is two metres away, it is hot, and nobody changes to go and buy bread. Real clothes are only for leaving the village — and there, be careful. Several Sicilian towns ban walking through their centre in swimwear or bare-chested by municipal order — in Favignana, Marettimo and Levanzo the fine runs from 25 to 150 €, and San Vito Lo Capo has the same rule. Scicli has none, as far as we know. A T-shirt in the bag settles it.',
      },
      {
        icon: 'sun',
        title: 'Topless: legal, but not done',
        text: 'No Italian law forbids it — the Court of Cassation settled that in 2000, after nearly thirty years of litigation. But towns and private beach clubs may refuse it, and on a family beach like this one custom is enough: nobody does. It is not a posted rule, it is a habit, and that is stronger than a sign.',
      },
      {
        icon: 'bag',
        title: 'Travel light, really',
        text: 'It is hot, the sea is two metres away, and the house already has everything. You need almost nothing: a swimsuit, something for the evening, and closed shoes if you walk in the countryside. The first meal takes ten minutes: tomatoes, mozzarella and a thread of olive oil. For clothes, though, nothing in Cava d’Aliga — the village sells none. The bazaar at the Max shopping centre, two and a half kilometres away, five minutes by car, does the job with cheap summer basics: a forgotten swimsuit, flip-flops, a T-shirt.',
        lien: 'https://maps.app.goo.gl/QERUZZMUWQHtRFrA6',
        lienLabel: 'The shopping centre on the map',
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
  pastaPage: {
    eyebrow: '25 July 1943',
    title: 'The antifascist pastasciutta',
    intro: 'On the day Mussolini fell, a family of farmers cooked hundredweights of pasta and handed it out to their whole village. Five months later the seven brothers were shot. It is the tenderest and most terrible feast in Italian cooking, and it is cooked again every 25 July.',
    word: {
      title: 'First, the word',
      text: 'Pastasciutta means «dry pasta»: pasta drained and dressed with a sauce, as opposed to pasta in broth. The word is homely and regional, and it means the Sunday dish — ragù, tomato and basil, cacio e pepe. It is the first course of family lunches, not of ordinary days.',
    },
    story: [
      {
        title: 'One family, seven brothers',
        text: 'The Cervis were tenant farmers at Campi Rossi, in Gattatico, in the province of Reggio Emilia. Alcide, the father, born 1875; Genoeffa Cocconi, the mother, born 1876; and seven sons. Catholic, peasant and stubborn: they bought the first tractor in the area, they set up a travelling library so the village would read, and they hid escaped prisoners and antifascists on the run.',
      },
      {
        title: 'The day fascism fell',
        text: 'On 25 July 1943 Mussolini was deposed. The Cervis did not make a speech: they cooked. They took the cheese on credit from the dairy, Alcide undertook to supply the butter free for a time, the neighbours gave the flour. Hundredweights of pastasciutta were cooked and handed out in the square at Campegine, to anyone who wanted some. Alcide said the boiling water «sounded like a symphony», and that it was «the finest speech on the end of fascism».',
      },
      {
        title: 'Five months later',
        text: 'On 25 November 1943 a fascist raid took the seven brothers and their father. On 28 December all seven were shot at the Reggio Emilia firing range. Genoeffa died of grief in 1944. Alcide came out of prison and lived until 1970 — ninety-five years old. He was asked how he had managed. He answered: «Dopo un raccolto ne viene un altro» — after one harvest comes another.',
      },
      {
        title: 'And ever since, every 25 July',
        text: 'The pastasciutta is cooked again. At Gattatico, in the house that became the Cervi Museum, and all over Italy wherever people organise it. It is a feast you eat: it does not commemorate the dead, it cooks the meal of the living again.',
      },
    ],
    brothers: 'Gelindo (1901), Antenore (1904), Aldo (1909), Ferdinando (1911), Agostino (1916), Ovidio (1918), Ettore (1921).',
    recipe: {
      title: 'The recipe',
      intro: 'It is disarmingly simple, and that is the point: in 1943 butter and Parmesan were a feast. Nothing to add, and above all no cream.',
      ingredients: [
        '500 g short pasta or tagliatelle',
        '100 g butter, at room temperature',
        '150 g freshly grated Parmesan',
        'Coarse salt for the water',
        'A ladle of pasta water',
      ],
      steps: [
        'Bring a large pot of water to the boil and salt it well.',
        'Cook the pasta al dente, and save a ladle of the cooking water before draining.',
        'Drain, return to the pan off the heat, add the butter in pieces and stir until it disappears.',
        'Scatter in the Parmesan with a little pasta water: that is what binds it and makes it creamy.',
        'Serve at once, and for a crowd — the one non-negotiable point.',
      ],
      note: 'That day there was neither tomato nor meat. Butter and cheese were enough to make a banquet, and that is exactly what the feast is about.',
    },
    shelf: 'Three books tell this family — the father’s testimony, a graphic novel and a novel with a thesis. They are on the shelf, under «Books».',
  },
  valguarneraPage: {
    eyebrow: 'Valguarnera Caropepe',
    title: 'The village we come from',
    intro: 'At 590 metres, in the province of Enna, at the exact centre of Sicily — the furthest point from the sea you can find on the island. Salvatore was born there on 26 January 1947. And the war had come through three and a half years earlier.',
    facts: [
      {
        title: 'A crossroads to hold',
        text: 'From 17 July 1943 the German commanders in Sicily began to fear their escape route to mainland Italy would be cut. They left rearguards in the hilltop towns commanding the main crossroads. Valguarnera was one of them.',
      },
      {
        title: '17 July, on Highway 117',
        text: 'Piazza Armerina taken, the 3rd Canadian Infantry Brigade pushed north. The Carleton and York Regiment was leading when it came under fire from the outposts. Tanks of the Three Rivers Regiment forced the Germans back into the hills; the Royal 22e Régiment moved on, then ran into a huge mine crater and another German party. They dug in there for the night.',
      },
      {
        title: '18 July, Monte della Forma',
        text: 'The Royal 22e Régiment and the Carleton and York climbed towards the crossroads on top of Monte della Forma, while the West Nova Scotia Regiment swung west to cut Highway 117 and deny the withdrawal. To the east, companies of the Hastings and Prince Edward Regiment had crossed the fields all night; by morning they had blocked the road out of the town. The Royal Canadian Regiment tried the town itself and ran into the ground, German fire, and the fear of a counter-attack.',
      },
      {
        title: 'By evening, nobody',
        text: 'By nightfall the 3rd Brigade held the crossroads and the Germans were pulling out to the north. The 1st Brigade, short of fire support, waited for dark to send in its reserve — the 48th Highlanders of Canada — into Valguarnera. They found no Germans. The town was taken without another shot.',
      },
    ],
    family: 'Three and a half years later Salvatore was born in this village. His father Angelo had come back from the Russian camps; he found himself a widower with a six-month-old baby. Later, when the family came down from Belgium for the summer, they did not go straight to the sea: they went through Valguarnera first, to see the family and grandpa Angelo. The Cava d’Aliga house only came into the family some fifty years ago.',
    note: 'The Canadian Army carries «Valguarnera» as a battle honour, attached to «Sicily, 1943».',
  },
  symbolsPage: {
    eyebrow: 'What you see everywhere',
    title: 'The Trinacria and the Moor’s heads',
    intro: 'Two objects you meet on every balcony, every wall and every market stall on the island — and whose story almost nobody tells. One is twenty-three centuries old. The other is a murder.',
    trinacria: {
      title: 'The Trinacria, or triskelion',
      text: 'The name is Greek for «three points». They are Sicily’s three capes — Lilibeo in the west, Peloro in the north-east, Passero in the south-east. At the centre, a woman’s head: Hybla, goddess of fertility. Three bent legs turn around her, and the whole island is held in that movement. The snakes come from the Greek tradition; the ears of wheat were added by the Romans, for whom Sicily was the granary of the Empire — myth credits the gift to Ceres, who is said to have taught the Sicilians farming. The symbol appears on the coins of Syracuse in the third century BC. It took until the year 2000 for the Regional Assembly to make it officially the flag of Sicily.',
      alt: 'A black cast-iron Trinacria hanging on a wall of Sicilian cement tiles',
      caption: 'Three legs, a woman’s head, ears of wheat: twenty-three centuries fit in there.',
    },
    teste: {
      title: 'The Moor’s heads',
      text: 'The legend is set in the Kalsa, the Arab quarter of Palermo, in the time of Muslim rule. A very beautiful girl grew plants on her balcony. A Moor saw her, fell in love, and was loved back — until she found out he had a wife and children in the East. She killed him in his sleep, cut off his head, and used it as a flowerpot. She planted basil in it. The scent was so fine that the neighbours ordered ceramic copies. A second version tells of two lovers, she Sicilian and noble, he Arab, discovered by her family and both beheaded — their heads set on a balcony as a warning. That is why they are sold in pairs.',
      alt: 'A pair of Moor’s heads in Caltagirone ceramic, green and white, a crowned man and woman',
      caption: 'You buy them two at a time, in memory of the lovers. These are from Caltagirone.',
    },
    note: 'Caltagirone is the capital of Sicilian ceramics: the town took it up after the Norman conquest of 1090, the earthquake of 1693 levelled it, and it rebuilt itself in baroque — the Santa Maria del Monte staircase still climbs, step after step, in painted majolica.',
  },
  legendsPage: {
    eyebrow: 'What people tell',
    title: 'Eight Sicilian legends',
    intro: 'An island that has been Greek, Arab, Norman and Spanish does not run short of stories. Here are eight, from the Strait of Messina to the crater of Etna. Some explain a real phenomenon, others a stone you can still touch.',
    items: [
      { title: 'Cola Pesce', place: 'Messina', text: 'A fisherman’s son who swam better than the fish. Frederick II put him to the test: he threw a cup into the sea, Cola brought it back; then his crown, he brought that back too; then a ring, deeper still. He never came up. Down there he had found that Sicily rests on three columns — at Cape Peloro, Cape Passero and Cape Lilibeo — and that one of them, eaten away by Etna’s fire, was splitting. He stayed under to hold it. When the earth shakes, he is shifting shoulders. The legend is attested from the twelfth century.' },
      { title: 'Arethusa', place: 'Syracuse', text: 'The nymph Arethusa fled the river-god Alpheus, who pursued her. She begged Artemis, who turned her into a spring. Alpheus made himself a river to reach her, and crossed the sea from Greece. The spring bears her name, on Ortygia, a few metres from the harbour — fresh water welling up at the edge of the salt. Papyrus still grows there.' },
      { title: 'The Fata Morgana', place: 'The Strait of Messina', text: 'In certain temperature conditions Calabria looks so close you would think you could walk to it — cities floating above the water, upside down. The fairy Morgan showed sailors these enchanted lands to lead them astray. It is a real mirage, which still carries her name in optics textbooks, and which can be seen today.' },
      { title: 'Charybdis and Scylla', place: 'The Strait of Messina', text: 'On one shore Scylla, the six-headed monster that snatched sailors as they passed. On the other Charybdis, the whirlpool that swallowed whole ships. Between them, the most feared passage in antiquity — and the phrase we still use when the only choice is between two disasters.' },
      { title: 'Mata and Grifone', place: 'Messina', text: 'She is Sicilian, he a Saracen warrior; he falls for her, she refuses, he converts to marry her. From this pair of giants the city made two vast statues that it parades every August. It is the only legend on this list that celebrates mixing rather than tragedy.' },
      { title: 'The baroness of Carini', place: 'Carini castle, near Palermo', text: 'Laura Lanza, baroness of Carini, was killed by her own father in 1563 for adultery. Her ghost is said to wander the walls still, and to be heard on full-moon nights. A treasure is said to be buried there, guarded by uneasy spirits; nobody has found it. The castle itself exists and can be visited.' },
      { title: 'Empedocles', place: 'Etna', text: 'The philosopher of Agrigento, fascinated by fire, is said to have thrown himself into the crater — to prove he was a god, or to vanish leaving no body. The volcano gave back one thing only: a sandal. It is the most literary end a philosopher ever invented for himself.' },
      { title: 'The Old Woman of the Vinegar', place: 'Palermo', text: 'In the seventeenth century an old woman in the old town brewed potions. People came to her in secret, young women above all. Many disappeared. Bodies were found treated with vinegar, to mask the smell. She was arrested and tried. Her spirit is said to haunt the oldest streets, where a sharp smell sometimes passes.' },
    ],
    note: 'Cola Pesce’s three columns are the three capes of the Trinacria: Peloro, Passero, Lilibeo. The legend and the symbol tell the same island, held up by its three points.',
  },
  scopaPage: {
    eyebrow: 'The house game',
    title: 'Scopa, and how to play it',
    intro: 'This is the Italian card game: the one played at family evenings, in village bars and at the end of long meals. It plays fast, it takes ten minutes to learn, and it lasts a lifetime. The logo of this site is, as it happens, a scopa card.',
    suitsAlt: 'The four Italian suits: club, coin, cup and sword',
    suitsCaption: 'The four suits: bastoni, denari, coppe, spade — clubs, coins, cups, swords.',
    rules: [
      { title: 'The deck', text: 'Forty cards, four suits of ten: clubs, coins, cups and swords. No queen — the face cards are jack (8), knight (9) and king (10). The ace is worth 1. That is all you need before you start.' },
      { title: 'The deal', text: 'Three cards to each player, four face up in the middle of the table. When everyone has played their three, three more are dealt, and so on until the deck runs out. The table is never restocked.' },
      { title: 'Capturing', text: 'You play a card. If it matches the value of a card on the table you take that one — and you have no choice: if the exact value is there, you must take it rather than a sum. Otherwise you may take several cards adding up to your card’s value. A 7 takes a 7, or a 4 and a 3. If nothing matches, your card stays on the table.' },
      { title: 'The scopa', text: 'If your capture clears the table entirely, that is a scopa — a sweep. One point, straight away, marked by laying the card crosswise in your pile. One exception only: a scopa made with the very last card of the game does not count.' },
      { title: 'The end', text: 'Whatever is left on the table at the end goes to the last player who captured. Then you count.' },
    ],
    scoreTitle: 'The count, at the end of each hand',
    score: [
      { label: 'The scope', text: 'One point per sweep, throughout the hand.' },
      { label: 'Cards', text: 'One point to whoever has the most. You need at least 21 out of 40.' },
      { label: 'Coins', text: 'One point to whoever has the most cards in the coins suit. At least 6 out of 10.' },
      { label: 'The settebello', text: 'One point for the seven of coins. A single card, a guaranteed point — the most fought-over card in the game.' },
      { label: 'The primiera', text: 'One point, and the most baffling calculation of the lot. See just below.' },
    ],
    primieraTitle: 'The primiera, explained',
    primieraText: 'You take your best card in each of the four suits and add them up — but on a scale of its own, where the seven beats the king. The highest total takes the point. The theoretical maximum is 84: four sevens, one per suit. If it is a tie, nobody scores.',
    primiera: [
      { carte: 'The 7', points: '21 points' },
      { carte: 'The 6', points: '18 points' },
      { carte: 'The ace', points: '16 points' },
      { carte: 'The 5', points: '15 points' },
      { carte: 'The 4', points: '14 points' },
      { carte: 'The 3', points: '13 points' },
      { carte: 'The 2', points: '12 points' },
      { carte: 'Face cards', points: '10 points' },
    ],
    note: 'You play to 11 points with two, 16 with three, 21 in teams. The game was already widespread across Italy in the eighteenth century, and is thought to come from Spanish games by way of Naples.',
  },
  unescoNote: {
    title: 'Eight towns, one earthquake',
    quake: 'On 11 January 1693 an earthquake of magnitude 7.4 levelled south-eastern Sicily. Tens of thousands dead, and whole towns to rebuild. Sicilian architects trained in Rome rebuilt them in a single sweep, in late baroque — and for the first time with the next tremor in mind.',
    towns: 'UNESCO inscribed them together in 2002 as the «Late Baroque Towns of the Val di Noto»: Caltagirone, Catania, Militello, Modica, Noto, Palazzolo Acreide, Ragusa and Scicli. Eight towns, one property, one catastrophe behind it.',
    near: 'Four of those eight are within 55 kilometres of the house: Scicli at 8, Modica at 20, Ragusa at 28, Noto at 55. You can see half a World Heritage site in a week without ever driving more than an hour.',
    syracuse: 'Syracuse is not part of the Val di Noto: it has its own inscription, with the rocky necropolis of Pantalica, from 2005. And Caltagirone, first on the list, is the town the ceramic Moor’s heads come from.',
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
  sourcesLabel: 'Sources:',
  filtersMore: 'Show all themes',
  filtersLess: 'Show fewer',
  monthsPrev: 'Earlier months',
  monthsNext: 'Later months',
  regionFilter: {
    all: 'See all',
    places: 'The places',
    customs: 'Local customs',
    specialties: 'Specialties',
    drinks: 'Wine & spirits',
    coffee: 'Coffee', pasta: 'Pastasciutta', symbols: 'Trinacria & Moor’s heads', legends: 'The legends', scopa: 'Scopa',
    arab: 'Arab Sicily',
    sounds: 'Sounds & screens',
    etna: 'Etna',
    fauna: 'Wildlife',
    sports: 'Beach games',
    books: 'Books',
    italian: 'Italian',
    story: 'The story',
    tree: 'The tree', valguarnera: 'Valguarnera',
    arrival: 'The house',
    leaving: 'Leaving',
    parking: 'Parking',
    money: 'Money',
    clean: 'Cleanliness',
    trip: 'The trip',
    waste: 'The bins',
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
    menuLabel: 'Italian',
    tocOpen: 'Jump to a section',
    answerCta: 'Answer',
    answerChange: 'Change',
    sheetClose: 'Close',
    planDesc: {
      prononcer: 'The sounds of Italian, and how to get them right.',
      parler: 'Whole sentences, ready for every situation.',
      presente: 'The everyday tense — asking, ordering, introducing yourself.',
      passato: 'Telling what has already happened.',
      futuro: 'Saying what you’ll do, with the right ending.',
      chansons: 'Three songs, their words, and what they teach.',
      exercices: 'Practise, one question at a time, score at the end.',
      ailleurs: 'Where to go next: apps, books and hand-picked sites.',
    },
    title: 'Speaking Italian here',
    intro: 'Not a grammar course: enough to get by from the first morning, and then to understand what you are saying. Pronunciation first, whole sentences next, grammar after that — and exercises at the end.',
    backToTop: 'Back to the top of the page',
    songsTitle: 'Through songs',
    songsIntro: 'A song comes in through the ear and stays, where a word list fades. For each one: what it is about, the words to have in mind before listening, and what it teaches you about the language.',
    songsWords: 'Words to know',
    songsPoint: 'What it teaches',
    songsListen: 'About the song',
    songsListenSpotify: 'Listen, and read the words',
    songsAll: 'All',
    songsGenres: { lutte: 'Struggles & memory', sicile: 'Sicily', auteur: 'Singer-songwriters' },
    elsewhereTitle: 'Carrying on elsewhere',
    elsewhereIntro: 'This page has no sound, and that is its limit: you cannot learn to pronounce a language without hearing it. Here is where to go for that — and for the hours of drilling a family website will never provide.',
    assimilNote: 'The method this course is built on is Assimil’s — short lessons, whole sentences, grammar explained afterwards. It is a paid book, and it is worth it if you want to go a long way.',
    planTitle: 'The programme',
    planIntro: 'In order, from the simplest to the most demanding. You do not have to do it all: level 1 is enough to get through a week.',
    level1: 'Level 1 · starting out',
    level2: 'Level 2 · getting by',
    level3: 'Level 3 · going further',
    levelAll: 'All levels',
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
    drillQuiz: 'The quiz: the Italian questions',
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
    intro: 'Six books about Sicily or set in Sicily — and four about what families lived through elsewhere in Italy, from the retreat from Russia to the Cervi farm. Nothing compulsory: this is a shelf, not a syllabus.',
    linkLabel: 'About the book',
    list: [
      { titre: 'Una donna di Ragusa', auteur: 'Maria Occhipinti', annee: '1957', lien: 'https://it.wikipedia.org/wiki/Una_donna_di_Ragusa', text: 'The book from here. Maria Occhipinti was twenty-three and five months pregnant when she lay down in front of the army truck taking away the young men of her neighbourhood, in Ragusa, on 4 January 1945. She paid for it with internal exile on Ustica, where she gave birth, and then prison. Her autobiography went unnoticed in 1957 and landed like a bomb when it was reissued in 1976.' },
      { titre: 'La plupart ne reviendront pas', auteur: 'Eugenio Corti', annee: '1947', lien: 'https://it.wikipedia.org/wiki/I_pi%C3%B9_non_ritornano', text: 'Mag’s pick. The diary of a survivor of the retreat from Russia: twenty-eight days encircled in the snow, written by a twenty-two-year-old who came out alive. It is not a Sicilian book, but it tells what thousands of families here lived through without ever speaking of it — and this house knows something about that.' },
      { titre: 'Le parole sono pietre', auteur: 'Carlo Levi', annee: '1955', lien: 'https://it.wikipedia.org/wiki/Carlo_Levi', text: 'Three journeys through Sicily, among the sulphur mines, the peasants occupying the land, and the still-fresh memory of Portella della Ginestra. “Words are stones”: the title says the book. It is the finest account of what the struggle for land in the island really was, written in the moment by someone who listened.' },
      { titre: 'Il Gattopardo', auteur: 'Giuseppe Tomasi di Lampedusa', annee: '1958', lien: 'https://it.wikipedia.org/wiki/Il_Gattopardo', text: 'The great Sicilian novel, written by a prince at the end of his life and turned down by two publishers before becoming a classic. The Sicily of 1860, a world collapsing, and the line everyone quotes: everything must change so that everything can stay the same.' },
      { titre: 'Il giorno della civetta', auteur: 'Leonardo Sciascia', annee: '1961', lien: 'https://it.wikipedia.org/wiki/Il_giorno_della_civetta', text: 'The book that named what nobody named. A carabinieri captain from the north investigates a killing in a Sicilian village and runs into a wall of silence. Sciascia was writing at a time when the very existence of the mafia was officially up for debate.' },
      { titre: 'Conversazione in Sicilia', auteur: 'Elio Vittorini', annee: '1941', lien: 'https://it.wikipedia.org/wiki/Conversazione_in_Sicilia', text: 'A man goes back to see his mother in Sicily after fifteen years. Published under fascism, the book says everything while naming nothing — which is how it got past the censors, and why it mattered.' },
      { titre: 'I Malavoglia', auteur: 'Giovanni Verga', annee: '1881', lien: 'https://it.wikipedia.org/wiki/I_Malavoglia', text: 'A family of fishermen, a boat, a debt, and the sea taking it all back. Verga writes the poor without pity and without prettifying: this is the Sicily from before photographs, the Sicily of the coastal villages.' },
      { titre: 'I miei sette figli', auteur: 'Alcide Cervi', annee: '1955', lien: 'https://www.einaudi.it/catalogo-libri/storia/storia-contemporanea/i-miei-sette-figli-alcide-cervi-9788806221157/', text: 'The father tells it himself. Seven sons shot on the same day, 28 December 1943, and a farmer of sixty-eight who comes out of prison and goes back to working the land with the women and grandchildren who remained. Set down by Renato Nicolai, translated into many languages: the most direct source on the family whose pasta is cooked again every 25 July.' },
      { titre: 'I sette fratelli Cervi. Una famiglia antifascista', auteur: 'Federico Attardo', annee: '2024', lien: 'https://www.beccogiallo.it/negozio/biografie/i-sette-fratelli-cervi/', text: 'The same story as a graphic novel, made with the Cervi Institute, Andersen Prize 2025. It takes the time to tell the family BEFORE the Resistance: the farmers who buy the first tractor in the area, the travelling library, the house open to fugitives. The rest makes more sense once you have seen where they started.' },
      { titre: 'L’ultima notte dei fratelli Cervi', auteur: 'Dario Fertilio', annee: '2012', lien: 'https://www.marsilioeditori.it/libri/scheda-libro/3171306/l-ultima-notte-dei-fratelli-cervi', text: 'Read it knowing what it is: a CRIME NOVEL, not a history book, with an invented character. It argues a contested thesis — that the Cervis were isolated by the communist leadership of the Resistance, then betrayed by an infiltrator. What nobody disputes is the rest: arrested on 25 November 1943, shot on 28 December by the fascists.' },
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
  sportsPage: {
    eyebrow: 'Beach games',
    title: 'What gets played on the sand',
    intro: 'None of these games needs a club, a licence or a booking. A pair of wooden bats, three boules, and the afternoon is gone. It is also the easiest way to talk to the people on the next towel: you lend, you count the points, you start again.',
    facts: [
      {
        icon: 'sun',
        title: 'I racchettoni',
        text: 'Two wooden bats, a small rubber ball, and the only aim is NOT to let it drop: nobody scores, you keep the rally alive. This is the game Mag calls tambourin, and she is not wrong — it descends from the “tamburello da spiaggia” played on Italian beaches back in the early 1900s. In its present form it dates from the 1970s, on the Romagna riviera. Ask for “racchettoni”: that is the word written on the packets.',
      },
      {
        icon: 'tools',
        title: 'Tambourin ball, the real sport',
        text: 'Mag is right to call it that: tambourin is a codified sport, and the ancestor of what gets played on the sand. The pitch is 80 metres long by 18 to 20 wide, split by a centre line — no net. Five players a side outdoors, three indoors. Scoring follows tennis — 15, 30, 45, game — and it takes thirteen games to win. Service changes every game, ends change every three. The instrument is a plastic hoop bound with copper wire, stretched with synthetic cloth and fitted with a leather grip; the first was made in 1861 by a cooper from Mèze, in the Hérault. Italy has held a national championship since 1896 — but in the north, in Lombardy and the Veneto, not here. In Sicily you find its beach cousin.',
      },
      {
        icon: 'cone',
        title: 'Beach tennis',
        text: 'Born in Italy, and straight out of racchettoni — but with a net, a court and a winner. The ball is bigger and softer, the racket thicker. It is the competitive version of the same gesture: here you do score, and there are tournaments all summer along the coast.',
      },
      {
        icon: 'pin',
        title: 'Boules on the sand',
        text: 'Tournaments are organised locally in summer — Mag confirms it, and it is the sort of thing you learn by walking past. The boules are WOODEN — she insists on it, and she is right twice over. It is the classic Italian beach set, sold in a wooden case, whereas French pétanque is played with steel. And it is a return to the origin: the boule was first clay, then stone, then wood, and steel only arrived in 1927, at Saint-Bonnet-le-Château. In between came the boules cloutées — wood clad in a carapace of nails, invented in Marseille in 1904 by Félix Rofritsch. Italian pétanque is called bocce, and the jack is the pallino. The rule fits in one sentence: the boule closest to the pallino wins, and you may knock your opponent’s away by hitting it — that is a bocciata. On sand you flatten a strip some fifteen metres long and play to twelve points. In Donnalucata this is no holidaymakers’ game: the same retired men have met there every afternoon for over fifty years.',
      },
      {
        icon: 'walk',
        title: 'Beach volleyball and beach football',
        text: 'The two universals, played here as everywhere: a net strung between two poles, or four bags on the ground for goals. They ask for nothing but people — which is exactly their merit on holiday, when you are rarely the same number two days running. Sand slows everything down: one half of beach football tires you like a whole match on grass.',
      },
      {
        icon: 'wave',
        title: 'The wind, late in the day',
        text: 'The breeze picks up in the afternoon and chops the sea short: that is board time. The Scicli coast runs eighteen kilometres, and the water turns choppy as soon as you leave the sheltered beaches, towards Sampieri. Nothing spectacular, but enough to sail — and enough to make swimming more of a workout if you have no board.',
      },
      {
        icon: 'walk',
        title: 'The passeggiata, which is a sport',
        text: 'Do not laugh: it is the most practised exercise in Sicily. In the evening, when the heat drops, the whole village walks the seafront, up and down, for an hour. Nobody is going anywhere. You show yourself, you stop, you set off again. It is free, it works at any age, and it is where you meet people.',
      },
      {
        icon: 'tools',
        title: 'A strummula',
        text: 'The Sicilian spinning top — also called u tuppettu. A turned piece of wood, a wound string, two chalk lines on the ground for the pitch, and the point is to keep it spinning as long as possible. It is a street game rather than a beach one, and it is two thousand years old: Homer already describes it in the Iliad. If you spot one at a junk stall, that is it.',
      },
    ],
    note: 'Bats, boules and balls turn up in any seafront bazaar or local supermarket for a few euros — no need to bring them from home. None of it is bookable: you put it down on the sand and you begin.',
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
    familyTitle: 'How well do you know the family?',
    familyIntro: 'Salva’s story, and the family tree. Three possible answers each time, and everything you need is written higher up on this page — each answer tells you where to go and read it again.',
    italianTitle: 'How well do you know Italian?',
    italianIntro: 'Fifty-five questions drawn from this course — pronunciation, conjugation, useful phrases, words from the songs. Three possible answers each time, and each one tells you where to go and read it again.',
    houseTitle: 'How well do you know the house?',
    houseIntro: 'The house, leaving, parking, money, cleanliness. Everything you need is written higher up on this page — each answer tells you where to go and read it again.',
    tripTitle: 'How well do you know the journey?',
    tripIntro: 'Airports, ferries, roads. Everything you need is written higher up on this page — each answer tells you where to go and read it again.',
    wasteTitle: 'How well do you know the bins?',
    wasteIntro: 'Three questions about the bins and their evenings. Everything is written higher up on this page.',
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
      { q: 'How many towns make up the Val di Noto World Heritage site?', choix: ['Eight', 'Five', 'Three'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'What event gave birth to the baroque of the Val di Noto?', choix: ['The earthquake of 11 January 1693', 'An eruption of Etna', 'The Norman conquest'], bonne: 0, ancre: 'lieux', niveau: 'facile' },
      { q: 'Is Syracuse part of the Val di Noto?', choix: ['No — it has its own inscription with Pantalica', 'Yes, it is first on the list', 'No, it is not listed at all'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
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
      { q: 'Is topless bathing forbidden by law in Italy?', choix: ['No — the Court of Cassation settled it in 2000', 'Yes, since 2000', 'Yes, but only in Sicily'], bonne: 0, ancre: 'coutumes', niveau: 'difficile' },
      { q: 'Can you walk through any Sicilian town centre in a swimsuit?', choix: ['No — some towns fine 25 to 150 €', 'Yes, anywhere', 'No, it is banned across Sicily'], bonne: 0, ancre: 'coutumes', niveau: 'moyen' },
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
      { q: 'What does «pastasciutta» mean?', choix: ['Pasta drained and dressed with a sauce', 'Pasta served in broth', 'Pasta baked in the oven'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'What was the pastasciutta of 25 July 1943 celebrating?', choix: ['The fall of Mussolini', 'The end of the war', 'The village feast'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'How many Cervi brothers were shot on 28 December 1943?', choix: ['Seven', 'Three', 'Nine'], bonne: 0, ancre: 'pastasciutta', niveau: 'facile' },
      { q: 'What did the Cervis dress the pasta with that day?', choix: ['Butter and Parmesan', 'Tomato and basil', 'A meat ragù'], bonne: 0, ancre: 'pastasciutta', niveau: 'moyen' },
      { q: 'In which village was the pasta handed out?', choix: ['Campegine', 'Gattatico', 'Reggio Emilia'], bonne: 0, ancre: 'pastasciutta', niveau: 'difficile' },
      { q: 'What did Alcide Cervi answer when asked how he had borne it?', choix: ['After one harvest comes another', 'Time erases everything', 'One must never forget'], bonne: 0, ancre: 'pastasciutta', niveau: 'difficile' },
      { q: 'What does «Trinacria» mean?', choix: ['Three points, in Greek', 'Land of the sun', 'Middle island'], bonne: 0, ancre: 'symboles', niveau: 'facile' },
      { q: 'Who is the head at the centre of the Trinacria?', choix: ['Hybla, goddess of fertility', 'Medusa the Gorgon', 'Ceres'], bonne: 0, ancre: 'symboles', niveau: 'difficile' },
      { q: 'Who added the ears of wheat to the symbol?', choix: ['The Romans', 'The Greeks', 'The Arabs'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'In which year did the Trinacria become the official flag of Sicily?', choix: ['In 2000', 'In 1946', 'In the third century BC'], bonne: 0, ancre: 'symboles', niveau: 'difficile' },
      { q: 'In the legend, what does the girl plant in the severed head?', choix: ['Basil', 'Jasmine', 'A lemon tree'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'Why are Moor’s heads sold in pairs?', choix: ['In memory of the two lovers', 'To frame a doorway', 'Because they are thrown two at a time'], bonne: 0, ancre: 'symboles', niveau: 'moyen' },
      { q: 'What does Cola Pesce hold up at the bottom of the sea?', choix: ['One of the three columns that carry Sicily', 'A sunken treasure', 'Frederick II’s tomb'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'According to the legend, why does the earth shake in Sicily?', choix: ['Cola Pesce is shifting shoulders', 'Etna is waking up', 'Charybdis spins faster'], bonne: 0, ancre: 'legendes', niveau: 'facile' },
      { q: 'What was the nymph Arethusa turned into?', choix: ['A spring', 'A laurel', 'A bird'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'What is the Fata Morgana?', choix: ['A mirage in the Strait of Messina', 'A festival in Palermo', 'A southerly wind'], bonne: 0, ancre: 'legendes', niveau: 'moyen' },
      { q: 'What did the volcano give back of Empedocles?', choix: ['A sandal', 'His cloak', 'Nothing at all'], bonne: 0, ancre: 'legendes', niveau: 'difficile' },
      { q: 'Which Sicilian legend celebrates mixing rather than tragedy?', choix: ['Mata and Grifone', 'The baroness of Carini', 'The Old Woman of the Vinegar'], bonne: 0, ancre: 'legendes', niveau: 'difficile' },
      { q: 'How many cards are there in a scopa deck?', choix: ['Forty', 'Fifty-two', 'Thirty-two'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'What are the four Italian suits?', choix: ['Clubs, coins, cups, swords', 'Hearts, spades, clubs, diamonds', 'Suns, moons, stars, seas'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'What is a «scopa»?', choix: ['A capture that clears the whole table', 'The seven of coins', 'The last card of the deck'], bonne: 0, ancre: 'scopa', niveau: 'facile' },
      { q: 'Which single card is worth a point on its own?', choix: ['The settebello, the seven of coins', 'The king of cups', 'The ace of clubs'], bonne: 0, ancre: 'scopa', niveau: 'moyen' },
      { q: 'In the primiera, what is the seven worth?', choix: ['21 points', '10 points', '7 points'], bonne: 0, ancre: 'scopa', niveau: 'difficile' },
      { q: 'If your card’s exact value is on the table, what must you do?', choix: ['Take it — you have no choice', 'Take a sum instead', 'Pass your turn'], bonne: 0, ancre: 'scopa', niveau: 'difficile' },
      { q: 'What do the geckos crossing the wall at dusk eat?', choix: ['Mosquitoes', 'Crumbs', 'Nothing, they sleep'], bonne: 0, ancre: 'faune', niveau: 'facile' },
      { q: 'Are there scorpions in Sicily?', choix: ['Yes, but their sting is harmless', 'No, none at all', 'Yes, and they are deadly'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Where do mosquitoes breed?', choix: ['In still water — a few centimetres is enough', 'In dry hedges', 'Under warm stones'], bonne: 0, ancre: 'faune', niveau: 'moyen' },
      { q: 'Which is the only venomous snake in Sicily?', choix: ['The asp viper', 'The western whip snake', 'There is none'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      { q: 'What must you never do after a viper bite?', choix: ['Apply a tourniquet or cut the wound', 'Call the emergency services', 'Keep the limb still'], bonne: 0, ancre: 'faune', niveau: 'difficile' },
      // ── The beach games. See the French note.
      { q: 'What is the Italian name of the wooden beach bat game?', choix: ['I racchettoni', 'Il pallino', 'La bocciata'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'In racchettoni, what is the aim?', choix: ['Not to let the ball drop — you keep the rally alive', 'To score as many points as possible', 'To hit your opponent'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'What do racchettoni descend from?', choix: ['The tamburello da spiaggia', 'Beach volleyball', 'Basque pelota'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Where was beach tennis born?', choix: ['In Italy, out of racchettoni', 'In Brazil', 'In California'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'What is the jack called in Italian?', choix: ['The pallino', 'The boccia', 'U tuppettu'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'What is it called when you knock your opponent’s boule away?', choix: ['A bocciata', 'A passeggiata', 'A strummula'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'How many points do you play to, at boules on the sand?', choix: ['Twelve', 'Thirteen', 'Twenty-one'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'How long have the same retired men played boules in Donnalucata?', choix: ['For over fifty years', 'For two or three summers', 'Since 2020'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'When does the breeze pick up?', choix: ['In the afternoon', 'At daybreak', 'In the middle of the night'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'How many kilometres does the Scicli coast run?', choix: ['Eighteen', 'Five', 'Forty'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'What is the passeggiata?', choix: ['The evening walk along the seafront', 'A boat race', 'A pasta dish'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'What is “a strummula”?', choix: ['The Sicilian spinning top', 'A wooden bat', 'A fishing net'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'What other name does the strummula go by?', choix: ['U tuppettu', 'U pallino', 'A bocciata'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Which ancient poet already describes the spinning top?', choix: ['Homer, in the Iliad', 'Virgil, in the Aeneid', 'Ovid'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Where do you find bats, boules and balls locally?', choix: ['In any seafront bazaar or supermarket', 'Only in Ragusa', 'You have to bring them from home'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      // ── Tambourin ball, the codified sport. Source sent by Mag.
      { q: 'How long is a tambourin pitch?', choix: ['80 metres', '40 metres', '120 metres'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'What separates the two halves, in tambourin?', choix: ['A centre line, no net', 'A net as in tennis', 'A wall'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'How many players a side, outdoors?', choix: ['Five', 'Three', 'Seven'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'How is tambourin scored?', choix: ['As in tennis — 15, 30, 45, game', 'One by one up to 21', 'In sets of eleven'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'How many games does it take to win?', choix: ['Thirteen', 'Six', 'Twenty'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'When was the first tambourin made?', choix: ['In 1861, by a cooper from Mèze', 'In 1896', 'In 1952'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Since when has Italy held a tamburello championship?', choix: ['Since 1896', 'Since 1861', 'Since 1955'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Where is tamburello played, in Italy?', choix: ['In the north — Lombardy, the Veneto', 'In Sicily', 'Everywhere equally'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'What is the instrument made of?', choix: ['A plastic hoop bound with copper wire, stretched with synthetic cloth', 'Solid wood', 'Solid metal'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      // ── The wooden boules. Mag: “pétanque means wooden boules”.
      { q: 'What are the Italian beach boules made of?', choix: ['Wood', 'Steel', 'Glass'], bonne: 0, ancre: 'sports', niveau: 'facile' },
      { q: 'Which materials did the boule pass through, in order?', choix: ['Clay, stone, wood, then steel', 'Steel, wood, then stone', 'Glass, wood, then steel'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'What year did steel arrive in pétanque?', choix: ['In 1927', 'In 1904', 'In 1861'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'What is a boule cloutée?', choix: ['Wood clad in a carapace of nails', 'A boule drilled with holes', 'A hand-painted boule'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      { q: 'Who invented the boule cloutée, and where?', choix: ['Félix Rofritsch, in Marseille in 1904', 'Jean Blanc, in Lyon in 1930', 'A cooper from Mèze in 1861'], bonne: 0, ancre: 'sports', niveau: 'difficile' },
      // ── Punta Corvo and beach volleyball. Content given by Mag.
      { q: 'Where does the sea come in, right by Cava d’Aliga?', choix: ['Into the Grotta dei Contrabbandieri', 'Into the Fornace Penna', 'Into Donnalucata harbour'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'What is “a spaccazza”?', choix: ['A descent through a fissure in the cliff', 'An underwater cave', 'A ridge path'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'The abandoned building at Punta Corvo was…', choix: ['The casa del finanziere, a customs post', 'A real lighthouse', 'A chapel'], bonne: 0, ancre: 'lieux', niveau: 'difficile' },
      { q: 'What plants grow in the coves of Punta Corvo?', choix: ['Dwarf palms', 'Umbrella pines', 'Olive trees'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'How do you follow the coast to Sampieri?', choix: ['Along a dirt track', 'Along the motorway', 'Only by boat'], bonne: 0, ancre: 'lieux', niveau: 'moyen' },
      { q: 'Why is beach football so tiring?', choix: ['Sand slows everything down', 'The matches last longer', 'The ball is heavier'], bonne: 0, ancre: 'sports', niveau: 'moyen' },
      { q: 'What do you need to play beach volleyball or beach football?', choix: ['Nothing but people', 'An approved court', 'A licence'], bonne: 0, ancre: 'sports', niveau: 'facile' },
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
      { q: '“Odio gli indifferenti”, Gramsci wrote in 1917. What does it mean?', choix: ['I hate the indifferent', 'I love differences', 'I listen to others'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'How do you say «to shoot by firing squad» in Italian?', choix: ['Fucilare', 'Festeggiare', 'Scolare'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'In «pastasciutta», the SCI group is pronounced…', choix: ['Like «sh»', 'Like «ski»', 'Like «see»'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“Sciopero” means…', choix: ['Strike', 'Work', 'Party'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'How does “sciopero” begin?', choix: ['Sh, as in “ship”', 'Sko', 'Cho'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“Né dio né padrone” — what does “padrone” mean?', choix: ['The boss, the owner, the master', 'The priest', 'The father'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“Non si parte!” was the cry of January 1945. It meant…', choix: ['We are not going — refusing conscription', 'The party is starting', 'We are all leaving'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'In “lasciatemi cantare”, what does “lasciatemi” mean?', choix: ['Let me', 'Sing to me', 'Listen to me'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“Ora e sempre Resistenza” translates as…', choix: ['Now and always, Resistance', 'Yesterday and tomorrow, peace', 'Here and there, homeland'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '“Bella ciao” — what does “ciao” mean in this refrain?', choix: ['Goodbye: you are leaving to fight', 'Hello: you are arriving', 'Thank you'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'How does a woman say “I am an anarchist”?', choix: ['Sono anarchica', 'Sono anarchico', 'Ho anarchica'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '“Pessimismo dell’intelligenza, ottimismo della volontà” — Gramsci’s motto says…', choix: ['See clearly, act anyway', 'Hope without thinking', 'Stay silent and wait'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '“Buongiorno” is used…', choix: ['In the morning and until early afternoon', 'Only at dawn', 'Only in the evening'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'At the counter, “un caffè” means…', choix: ['An espresso', 'A large americano', 'A milky coffee'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: '“Quanto costa?” means…', choix: ['How much does it cost?', 'Where is it?', 'What time?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'To say “I do not speak Italian”, you say…', choix: ['Non parlo italiano', 'Non parla italiano', 'Non parliamo italiano'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“Mi scusi” rather than “scusa” is…', choix: ['The polite form, to a stranger', 'What you say to a child', 'An insult'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“Compagno” means comrade — but also…', choix: ['Partner, in the romantic sense', 'Boss', 'Neighbour'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“L’unione fa la forza” means…', choix: ['Unity is strength', 'Strength makes unity', 'Unity makes a party'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What does “occupare le terre” mean?', choix: ['To occupy the land', 'To farm the land', 'To sell the land'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '“La lotta continua” means…', choix: ['The struggle continues', 'The struggle is over', 'The struggle begins'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'In “Sacco e Vanzetti sono stati giustiziati”, “sono stati” marks…', choix: ['The past tense, with essere', 'The future', 'The present'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      // ── Italian, second batch. See the French note.
      { q: 'How is the “ci” of “ciao” pronounced?', choix: ['Like ch in church', 'Like ss', 'Like k'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'What does the H do in Italian, after a C or a G?', choix: ['It hardens the consonant again', 'It lengthens the vowel', 'It marks the stress'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'How is “gli” said in “famiglia”?', choix: ['Like the “lli” in million', 'Like a hard G', 'Like a J'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Where does the stress fall, almost always?', choix: ['On the second-to-last syllable', 'On the first', 'On the last'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Why does “caffè” carry a written accent?', choix: ['Because the stress falls on the last syllable', 'To lengthen the E', 'Because the word is foreign'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Double consonants, in Italian…', choix: ['Are heard: you hold the consonant', 'Are not pronounced', 'Sound like a single one'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'How many syllables are heard in “pane”?', choix: ['Two clear syllables', 'Only one', 'Three'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'How is “sc” said before A, O or U — as in “scuola”?', choix: ['Sk', 'Sh', 'S'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'How do you ask for the bill?', choix: ['Il conto, per favore', 'Quant’è?', 'Basta così'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'How do you say you are allergic to shellfish?', choix: ['Sono allergico ai crostacei', 'È piccante?', 'Che cosa mi consiglia?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'How do you ask someone to repeat more slowly?', choix: ['Può ripetere più lentamente?', 'Come si chiama?', 'A che ora chiudete?'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'What is “un caffè corretto”?', choix: ['A coffee “corrected” with a dash of liqueur', 'A very short coffee', 'A long coffee'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'From when do you say “Buonasera”?', choix: ['From the middle of the afternoon', 'From dusk', 'After dinner'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'How do you say you have a flat tyre?', choix: ['Ho bucato una gomma', 'Il water perde', 'Non c’è acqua calda'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What do you ask for at the chemist against mosquito bites?', choix: ['Avete qualcosa per le punture di zanzara?', 'Mi fa male qui', 'Ho bisogno di aiuto'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'The present of “parlare”, first person?', choix: ['parlo', 'parli', 'parla'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'How is the present formed in Italian?', choix: ['Drop the infinitive ending and add the one for the person', 'Put an auxiliary before the verb', 'Keep the infinitive as it is'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'What does “domani parto” mean?', choix: ['I leave tomorrow', 'I left yesterday', 'I would gladly leave'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'What are the three families of Italian verbs?', choix: ['-are, -ere, -ire', '-ar, -er, -ir', '-are, -ire, -ure'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: '“We” of “prendere”, in the present?', choix: ['prendiamo', 'prendete', 'prendono'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What does “Né dio né padrone” mean?', choix: ['Neither god nor master', 'Neither bread nor work', 'Neither yesterday nor tomorrow'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'Who led the Italian anarchist union?', choix: ['Armando Borghi', 'Leda Rafanelli', 'Camillo Berneri'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What did Leda Rafanelli open?', choix: ['An anarchist publishing house', 'A night school', 'A peasant union'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Where did Camillo Berneri die, in 1937?', choix: ['In Barcelona', 'In Milan', 'In Paris'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What year did the Red Week break out?', choix: ['In June 1914', 'In January 1945', 'In 1927'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What does “prendere in giro” mean?', choix: ['To make fun of someone', 'To go for a drive', 'To take your time'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: '“La gente” is a word that is…', choix: ['Singular in Italian, plural in French', 'Always plural', 'Masculine'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What does “piano” mean, besides “softly”?', choix: ['The floor of a building', 'The ground', 'The door'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'Which Italian word serves both for arriving and for leaving?', choix: ['Ciao', 'Buongiorno', 'Grazie'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: '“La mano” is one of the rare words in -o that is…', choix: ['Feminine', 'Invariable', 'Always plural'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What does the prefix “ri-” mean, in “ricostruire”?', choix: ['Again', 'Against', 'Almost'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'How do you say “the suitcase”?', choix: ['La valigia', 'La città', 'La stagione'], bonne: 0, ancre: 'italien', niveau: 'facile' },
      { q: 'The one who leaves is l’emigrante; the one who arrives is…', choix: ['L’immigrato', 'Il partigiano', 'Il forestiero'], bonne: 0, ancre: 'italien', niveau: 'difficile' },
      { q: 'What does “dolce” mean?', choix: ['Soft and sweet at once', 'Bitter', 'Cold'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      { q: 'How do you say “better” in Italian?', choix: ['Meglio', 'Più bene', 'Molto bene'], bonne: 0, ancre: 'italien', niveau: 'moyen' },
      // ── The practical pages. See the French note.
      { q: 'Where is the main water valve?', choix: ['In the street, at the corner going down to the right', 'In the laundry room', 'Under the kitchen sink'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'The water valve is closed when it is…', choix: ['Perpendicular', 'Parallel', 'Pointing up'], bonne: 0, ancre: 'arrivee', niveau: 'difficile' },
      { q: 'Can you drink the tap water?', choix: ['No, and no ice cubes either', 'Yes, no problem', 'Only in the morning'], bonne: 0, ancre: 'arrivee', niveau: 'facile' },
      { q: 'What is tap water perfectly fine for?', choix: ['Cooking, pasta, coffee, washing up', 'Washing up only', 'Nothing at all'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Where is the water heater?', choix: ['In the bathroom, inside the shower', 'In the laundry room', 'On the terrace'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Where is the laundry room key?', choix: ['In the small chest of drawers inside the living-room sideboard', 'Under the doormat', 'In the small bedroom'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Where are the sheets?', choix: ['In the wardrobe drawer, in the small bedroom', 'In the laundry room', 'Under the big bedroom bed'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Does the house have air conditioning?', choix: ['No — shutters closed by day, open in the evening', 'Yes, in every bedroom', 'Yes, but only in the living room'], bonne: 0, ancre: 'arrivee', niveau: 'facile' },
      { q: 'How often should the plants be watered?', choix: ['Every three or four days, about 3 litres per plant', 'Every day, one litre', 'Once a week'], bonne: 0, ancre: 'arrivee', niveau: 'moyen' },
      { q: 'Why shower at the beach on the way back?', choix: ['So the sand does not end up in the pipes', 'To save water', 'Because the water there is warm'], bonne: 0, ancre: 'arrivee', niveau: 'difficile' },
      { q: 'What should be done with the fridge before leaving?', choix: ['Empty it, unplug it and leave the door ajar', 'Leave it on and full', 'Unplug it and close it tight'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'What is brought inside before leaving?', choix: ['The hammock fabric, the small bench and the wooden stools', 'The flower pots', 'The terrace table'], bonne: 0, ancre: 'depart', niveau: 'difficile' },
      { q: 'What do you do with the linen before leaving?', choix: ['Wash it and remake the beds for the next ones', 'Leave it in the basket', 'Take it with you'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'And if the linen is still damp when you close up?', choix: ['Leave it hanging in the house, never folded', 'Fold it into the basket', 'Put it in a bag'], bonne: 0, ancre: 'depart', niveau: 'difficile' },
      { q: 'Missed the bin collection the night before leaving?', choix: ['Leave them on the terrace, never in the street', 'Leave them in the street', 'Take them with you'], bonne: 0, ancre: 'depart', niveau: 'moyen' },
      { q: 'What does a blue parking space mean?', choix: ['Paid — ticket behind the windscreen', 'Free', 'Reserved for residents'], bonne: 0, ancre: 'parking', niveau: 'facile' },
      { q: 'A white space is free, but…', choix: ['It may be time-limited — parking disc required', 'It is reserved for deliveries', 'It becomes paid in the evening'], bonne: 0, ancre: 'parking', niveau: 'moyen' },
      { q: 'Who are yellow spaces reserved for?', choix: ['Disabled badge holders, deliveries, the police', 'Pregnant women', 'Electric cars'], bonne: 0, ancre: 'parking', niveau: 'moyen' },
      { q: 'What does an unshown ticket or a forgotten disc cost?', choix: ['41 €', '25 €', '80 €'], bonne: 0, ancre: 'parking', niveau: 'difficile' },
      { q: 'Where do you find a parking disc if the rental company gives none?', choix: ['In any tobacconist', 'At the post office', 'At the police station'], bonne: 0, ancre: 'parking', niveau: 'difficile' },
      { q: 'What is a cash machine called in Italy?', choix: ['A Bancomat', 'A Postomat', 'A Cassa'], bonne: 0, ancre: 'argent', niveau: 'facile' },
      { q: 'How many cash machines are there in Donnalucata?', choix: ['Two', 'Only one', 'Four'], bonne: 0, ancre: 'argent', niveau: 'moyen' },
      { q: 'What is the Italian post office cash machine called?', choix: ['The Postamat', 'The Postabank', 'The Posteomat'], bonne: 0, ancre: 'argent', niveau: 'difficile' },
      { q: 'Why carry some cash in advance?', choix: ['Many small shops, and the market, take nothing else', 'Foreign cards are refused', 'The machines close in summer'], bonne: 0, ancre: 'argent', niveau: 'moyen' },
      { q: 'Where do mosquitoes lay their eggs?', choix: ['In standing water — saucers, buckets, watering can', 'In the bins', 'Under the furniture'], bonne: 0, ancre: 'bestioles', niveau: 'moyen' },
      { q: 'What is the best airtight container of all?', choix: ['The fridge', 'A glass jar', 'A freezer bag'], bonne: 0, ancre: 'bestioles', niveau: 'difficile' },
      { q: 'How do you fight the ants?', choix: ['You do not fight them: you give them nothing', 'With insecticide', 'By sealing the cracks'], bonne: 0, ancre: 'bestioles', niveau: 'moyen' },
      { q: 'What old southern reflex before putting your shoes back on?', choix: ['Shake them', 'Turn them over', 'Bring them in at night'], bonne: 0, ancre: 'bestioles', niveau: 'difficile' },
      { q: 'Which airport do we recommend?', choix: ['Catania (CTA)', 'Palermo (PMO)', 'Comiso (CIY)'], bonne: 0, ancre: 'voyage', niveau: 'facile' },
      { q: 'Which airport is closest to the house?', choix: ['Comiso (CIY), about 40 minutes away', 'Catania (CTA)', 'Palermo (PMO)'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'Where does the ferry to Messina leave from?', choix: ['From Villa San Giovanni', 'From Reggio Calabria', 'From Naples'], bonne: 0, ancre: 'voyage', niveau: 'difficile' },
      { q: 'How long is the crossing from Genoa?', choix: ['About twenty hours', 'About twenty minutes', 'Six hours'], bonne: 0, ancre: 'voyage', niveau: 'difficile' },
      { q: 'Where do you land coming from Genoa?', choix: ['In Palermo', 'In Messina', 'In Catania'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'How long is the strait crossing?', choix: ['About twenty minutes, no booking needed', 'Two hours', 'A whole night'], bonne: 0, ancre: 'voyage', niveau: 'moyen' },
      { q: 'When do you put the bins out?', choix: ['The evening before — the truck comes early', 'The same morning', 'When they are full'], bonne: 0, ancre: 'dechets', niveau: 'facile' },
      { q: 'What happens if a bin goes out on the wrong evening?', choix: ['It stays outside for a week', 'It gets collected anyway', 'The town issues a fine'], bonne: 0, ancre: 'dechets', niveau: 'moyen' },
      { q: 'Why can the collection days change?', choix: ['The town changes them for holidays, in summer, or when it changes contractor', 'They never change', 'They depend on the weather'], bonne: 0, ancre: 'dechets', niveau: 'difficile' },
      // ── The family page. See the French note.
      { q: 'Where was Salvatore Contrino born?', choix: ['In Valguarnera, Sicily', 'In Scicli', 'In Cava d’Aliga'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'What year was Salvatore born?', choix: ['1947', '1937', '1957'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'Where was his father Angelo coming back from when he was widowed?', choix: ['The Russian camps', 'America', 'North Africa'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Who raised Salvatore?', choix: ['His grandmother Giuseppina, mémé Pipine', 'An aunt who stayed in Sicily', 'His father Angelo'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'Where had mémé Pipine emigrated with her children?', choix: ['To Saint-Étienne', 'To Brussels', 'To Lyon'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'She raised him as…', choix: ['The tenth of the siblings', 'A grandson apart', 'Her eldest son'], bonne: 0, ancre: 'recit', niveau: 'difficile' },
      { q: 'How old was he when he left to work in Belgium?', choix: ['Nineteen', 'Fifteen', 'Twenty-five'], bonne: 0, ancre: 'recit', niveau: 'moyen' },
      { q: 'What does the house in Cava d’Aliga gather, generation after generation?', choix: ['The family', 'The village neighbours', 'Friends from Belgium'], bonne: 0, ancre: 'recit', niveau: 'facile' },
      { q: 'What is the maiden name of Giuseppina, mother of the Contrino siblings?', choix: ['Marcino', 'Sberna', 'Canolo'], bonne: 0, ancre: 'arbre', niveau: 'facile' },
      { q: 'What are the names of Jacques’ two children?', choix: ['Nathalie and Olivier', 'Christian and Ambre', 'Salvatore and Tino'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Which of Helene’s daughters married Patrick Gamino?', choix: ['Angelina, known as Angèle', 'Rosalba, known as Rose', 'Giuseppina, known as Jo'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'What is the surname of Lucia’s second husband?', choix: ['Dolciamore', 'Gallois', 'Gamino'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Who are the parents of Pierre Lux, born in 1881?', choix: ['Henri Lux and Angélique Bourg', 'Augustin Viseux and Flore Marie Wasson', 'Louis Thurot and Mélanie Souveton'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Who are the parents of Angelina Viseux, born in 1882?', choix: ['Augustin Viseux and Flore Marie Wasson', 'Henri Lux and Angélique Bourg', 'Pierre Lux and Juliette Thurot'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In which year did Augustin Viseux, Angelina’s father, die?', choix: ['1899', '1944', '1959'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'Who is the oldest ancestor in the tree, on Angelina Viseux’s side?', choix: ['Jean Baptiste Viseux, around 1702', 'Adrien Carpentier, around 1701', 'Denis Fréville'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In which year did Pierre Antoine Viseux and Rosalie Fréville marry?', choix: ['1843', '1800', '1880'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In which town are Pierre Lux and Angelina Viseux buried?', choix: ['Saint-Avold', 'Saint-Étienne', 'Valguarnera'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Who are the children of Angelo Contrino and his second wife Conchetta Sberna?', choix: ['Josephine, Rosario, Stefano and Maria Assunta', 'Salvatore only', 'David, Michaël and Mag'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'What year was Juliette Emilienne Thurot born?', choix: ['1923', '1898', '1920'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'Who did Juliette Emilienne Thurot marry the second time?', choix: ['Charles Gallois', 'Patrick Gamino', 'Louis Thurot'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'What is the maiden name of Régine, Mag’s mother?', choix: ['Lux', 'Thurot', 'Viseux'], bonne: 0, ancre: 'arbre', niveau: 'facile' },
      { q: 'What is the name of Benito’s daughter that we know of?', choix: ['Ambre', 'Zoé', 'Manon'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'What is the name of Gabi’s first child?', choix: ['Christian', 'Stefano', 'Rosario'], bonne: 0, ancre: 'arbre', niveau: 'moyen' },
      { q: 'What is the short form of Rosario, son of Angelo and Conchetta Sberna?', choix: ['Saro', 'Jo', 'Rose'], bonne: 0, ancre: 'arbre', niveau: 'difficile' },
      { q: 'In which province is Valguarnera Caropepe?', choix: ['Enna, at the centre of Sicily', 'Ragusa, in the south-east', 'Palermo, in the north'], bonne: 0, ancre: 'valguarnera', niveau: 'moyen' },
      { q: 'Which Canadian regiment was leading the advance on Highway 117 on 17 July 1943?', choix: ['The Carleton and York Regiment', 'The Royal 22e Régiment', 'The West Nova Scotia Regiment'], bonne: 0, ancre: 'valguarnera', niveau: 'difficile' },
      { q: 'What did the 48th Highlanders find when they entered Valguarnera?', choix: ['No Germans: the town was empty', 'A counter-attack', 'A destroyed bridge'], bonne: 0, ancre: 'valguarnera', niveau: 'difficile' },
      { q: 'What did the family do before going to the sea in summer?', choix: ['They went through Valguarnera to see the family and grandpa Angelo', 'They went to Palermo first', 'They slept in Ragusa'], bonne: 0, ancre: 'valguarnera', niveau: 'facile' },
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
      { icon: 'drop', title: 'Water', items: ['The main valve — the one that turns all the water in the house on and off — is out in the street: at the corner, down to the right — perpendicular = closed.', 'In the laundry room at the back, on the wall between the washing machine and the sink, there’s a second valve: it only controls the water for the back terrace. The laundry-room key is right there, in the little chest of drawers in the living-room sideboard.', 'The water heater is in the bathroom, inside the shower.'] },
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
