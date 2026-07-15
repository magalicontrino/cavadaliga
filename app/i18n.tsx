'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'fr' | 'it' | 'en';
export const LANGS: Lang[] = ['it', 'fr', 'en'];

type Block = { title: string; items: string[] };
type PageContent = { eyebrow: string; title: string; intro: string; blocks?: Block[] };
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
  toCome: string;
};
type DepartContent = {
  eyebrow: string;
  title: string;
  intro: string;
  checklistTitle: string;
  checklist: string[];
};

export type Dict = {
  nav: string[]; // ordre = NAV (Accueil, Préparer le voyage, Infos pratiques, Services locaux, La région, Contact)
  region: string;
  tagline: string;
  subLabels: string[];
  writeUs: string;
  contactLink: string;
  intro: string;
  welcome: string;
  highlights: { value: string; label: string }[];
  everythingForStay: string;
  sectionsWord: string;
  // Titres des CTA de l'accueil (ordre : infos pratiques, services locaux,
  // région, préparer le voyage, contact) — mini-phrases avec le nom de rubrique.
  ctaTitles: string[];
  indexCards: { title: string; desc: string }[];
  tasteOfSicily: string;
  galleryAlt: string[];
  apartmentAlt: string;
  cavaAlt: string;
  scicliAlt: string;
  placesTitle: string;
  salvaPage: { title: string; intro: string; historyTitle: string; historyText: string; treeTitle: string; treeNote: string; treePaternal: string; treeMaternal: string; treeWife1: string; treeWife2: string; treeAdd: string; treeAddSubject: string; treeExample: string };
  calendarPage: { title: string; intro: string; festivalsTitle: string; programTitle: string; programNote: string; programMore: string; socialsTitle: string; festivalDescs: string[]; legend: { occupied: string; tentative: string; free: string; festival: string } };
  ctaEyebrow: string;
  ctaTitle: string;
  question: string;
  contactLabels: { email: string; instagram: string };
  pages: Record<PageKey, PageContent>;
  prepare: PrepareContent;
  arrivee: ArriveeContent;
  depart: DepartContent;
};

const FR: Dict = {
  nav: ['Accueil', 'Préparer le voyage', 'Informations pratiques', 'Bonnes adresses', 'La région', 'La famille', 'Calendrier'],
  region: 'Sicile',
  tagline: 'un village du sud-est de la Sicile',
  subLabels: ['Près de Scicli dans la province de Raguse'],
  writeUs: 'Nous écrire',
  contactLink: 'Contact',
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
    'Toutes les informations pratiques',
    'Nos bonnes adresses',
    'Découvrir la région',
    'Bien préparer le voyage',
    'Nous contacter',
  ],
  indexCards: [
    { title: 'Informations pratiques', desc: 'Arrivée, départ, équipements, wifi, tout pour un séjour sans accroc.' },
    { title: 'Services locaux & contacts utiles', desc: 'Commerces, restaurants, marchés et bonnes adresses autour de nous.' },
    { title: 'Découvrir la région', desc: 'Scicli, Raguse, le baroque du Val di Noto et les plages secrètes.' },
    { title: 'Préparer le voyage', desc: 'Vols, aéroports, comment rejoindre la maison et check-list avant de partir.' },
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
  salvaPage: { title: 'La famille', intro: 'Photos, souvenirs et histoire de la famille, au fil des années.', historyTitle: 'Histoire de la famille', historyText: "De génération en génération, cette maison de Cava d’Aliga rassemble la famille. On écrira bientôt son histoire ici — les origines, les étés partagés et les visages qui l’ont fait vivre.", treeTitle: 'Arbre généalogique', treeNote: 'Bientôt : un arbre participatif où chacun pourra ajouter sa branche.', treePaternal: 'Grands-parents paternels', treeMaternal: 'Grands-parents maternels', treeWife1: '1re épouse', treeWife2: '2e épouse', treeAdd: '+ Ajouter ma branche', treeAddSubject: 'Arbre généalogique — ma branche', treeExample: 'Structure d’exemple — dites-nous les vrais liens et on complète.' },
  calendarPage: { title: 'Le calendrier', intro: 'Les périodes où la maison est occupée, pour se coordonner en famille.', festivalsTitle: 'Fêtes siciliennes', programTitle: 'Événements à venir', programNote: 'Sotto il cielo di Bruca — le programme de l’été, à deux pas de la maison. Suivez les couleurs.', programMore: 'Détails et horaires sur Instagram', socialsTitle: 'À suivre', festivalDescs: ["Le grand jour de l’été italien. Héritée des Feriae Augusti romaines et associée à l’Assomption, la fête réunit familles et villages autour de la mer : baignades, grands repas, processions et feux d’artifice animent toute la Sicile.", "Saint Roch, invoqué depuis des siècles contre les épidémies, protège de nombreuses communautés siciliennes. À Scicli, sa statue est portée en procession dans les ruelles, au son des fanfares et sous les illuminations de fête.", "Saint Jean-Baptiste est le patron de Raguse, dont la cathédrale lui est dédiée. Le 29 août, jour de sa décollation, la ville s’illumine : procession solennelle de la statue du saint et grand feu d’artifice au-dessus de la vieille ville.", "Saint Conrad Confalonieri, ermite vénéré comme patron de Noto. Le dernier dimanche d’août, son urne d’argent traverse les rues baroques dans une immense ferveur populaire, entre cierges, fleurs et cortèges."], legend: { occupied: 'Occupé', tentative: 'En attente', free: 'Libre', festival: 'Fête sicilienne' } },
  ctaEyebrow: 'Envie de venir ?',
  ctaTitle: 'Écrivez-nous',
  question: 'Une question sur votre séjour ?',
  contactLabels: { email: 'Email', instagram: 'Instagram' },
  pages: {
    'informations-pratiques': {
      eyebrow: 'Informations pratiques',
      title: 'Infos pratiques',
      intro: "Arrivée, départ, équipements de l'appartement et petits conseils pour profiter pleinement de votre séjour à Cava d'Aliga.",
      blocks: [
        { title: 'Arrivée & départ', items: ['Horaires de check-in / check-out.', 'Remise des clés et instructions d’accès.'] },
        { title: 'L’appartement', items: ['Équipements (cuisine, wifi, climatisation, linge).', 'Capacité et configuration des couchages.'] },
        { title: 'Bon à savoir', items: ['Règles de la maison.', 'Tri des déchets et vie du hameau.'] },
        { title: 'Contacts utiles', items: ['Médecin, pharmacie, taxi.', 'Numéros d’urgence en Italie.'] },
      ],
    },
    'services-locaux': {
      eyebrow: 'Services locaux & contacts utiles',
      title: 'Nos bonnes adresses autour de vous',
      intro: "Commerces, restaurants, marchés et contacts utiles : nos recommandations personnelles pour vivre Cava d'Aliga comme à la maison.",
      blocks: [
        { title: 'Manger & boire', items: ['Restaurants et trattorias que nous aimons.', 'Glaciers, cafés et spécialités siciliennes.'] },
        { title: 'Courses & marchés', items: ['Épiceries et supermarchés proches.', 'Jours et lieux des marchés.'] },
        { title: 'Plage & loisirs', items: ['Plages et criques recommandées.', 'Locations (transats, bateaux, vélos).'] },
      ],
    },
    'la-region': {
      eyebrow: 'La région',
      title: 'Découvrir le sud-est de la Sicile',
      intro: 'Scicli, Raguse, le baroque du Val di Noto, les plages secrètes et la campagne des Iblei. De quoi remplir chaque journée de votre séjour.',
      blocks: [
        { title: 'Villes baroques', items: ['Scicli, Raguse Ibla, Modica et Noto.', 'Sites classés au patrimoine mondial de l’UNESCO.'] },
        { title: 'Mer & nature', items: ['Plages et criques de la côte sud.', 'Réserves naturelles et sentiers.'] },
        { title: 'Saveurs', items: ['Chocolat de Modica, cannoli, vins locaux.', 'Marchés et producteurs.'] },
        { title: 'Excursions', items: ['Journées à la découverte de l’île.', 'Idées d’itinéraires selon la durée du séjour.'] },
      ],
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
          'Chauffeur privé — Giovanni, notre perle (+39 380 313 8948) : 10 € de Donnalucata à l’appartement, 20 € de Pozzallo, 150 € depuis l’aéroport de Catane. Jusqu’à 5-6 personnes. À prévenir à l’avance selon ses disponibilités (prévoyez un plan B).',
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
      { icon: 'flame', title: 'Gaz', items: ['Un monsieur près de la place (en haut) livre à domicile.', 'Coordonnées à venir.'] },
      { icon: 'signal', title: 'Wifi', items: ['Réseau : cacestlaissetomber', 'Mot de passe : jamonito'] },
    ],
    toCome: 'Clés et conseils du premier jour (courses, boulangerie, pharmacie, essence) : bientôt en ligne.',
  },
  depart: {
    eyebrow: 'Départ',
    title: 'Quitter la maison sereinement',
    intro: 'La petite check-list à cocher avant de fermer la porte.',
    checklistTitle: 'Avant de partir',
    checklist: [
      'Couper l’eau (vanne salle de bain + rue)',
      'Couper l’électricité (interrupteurs terrasse)',
      'Dégivrer le frigo, laisser la porte ouverte',
      'Sortir les poubelles pour le lendemain',
    ],
  },
};

const IT: Dict = {
  nav: ['Home', 'Preparare il viaggio', 'Informazioni pratiche', 'I nostri indirizzi', 'La regione', 'La famiglia', 'Calendario'],
  region: 'Sicilia',
  tagline: 'un villaggio del sud-est della Sicilia',
  subLabels: ['Vicino a Scicli in provincia di Ragusa'],
  writeUs: 'Scrivici',
  contactLink: 'Contatti',
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
    'Tutte le informazioni pratiche',
    'I nostri indirizzi',
    'Scoprire la regione',
    'Preparare bene il viaggio',
    'Contattaci',
  ],
  indexCards: [
    { title: 'Informazioni pratiche', desc: 'Arrivo, partenza, dotazioni, wifi, tutto per un soggiorno senza pensieri.' },
    { title: 'Servizi locali e contatti utili', desc: 'Negozi, ristoranti, mercati e i nostri indirizzi preferiti nei dintorni.' },
    { title: 'Scoprire la regione', desc: 'Scicli, Ragusa, il barocco del Val di Noto e le spiagge nascoste.' },
    { title: 'Preparare il viaggio', desc: 'Voli, aeroporti, come raggiungere la casa e la check-list prima di partire.' },
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
  salvaPage: { title: 'La famiglia', intro: 'Foto, ricordi e storia della famiglia, nel corso degli anni.', historyTitle: 'Storia della famiglia', historyText: "Di generazione in generazione, questa casa di Cava d’Aliga riunisce la famiglia. Presto ne racconteremo qui la storia — le origini, le estati condivise e i volti che l’hanno animata.", treeTitle: 'Albero genealogico', treeNote: 'Presto: un albero partecipativo dove ognuno potrà aggiungere il proprio ramo.', treePaternal: 'Nonni paterni', treeMaternal: 'Nonni materni', treeWife1: '1ª moglie', treeWife2: '2ª moglie', treeAdd: '+ Aggiungi il mio ramo', treeAddSubject: 'Albero genealogico — il mio ramo', treeExample: 'Struttura di esempio — diteci i legami reali e completiamo.' },
  calendarPage: { title: 'Il calendario', intro: 'I periodi in cui la casa è occupata, per coordinarsi in famiglia.', festivalsTitle: 'Feste siciliane', programTitle: 'Prossimi eventi', programNote: 'Sotto il cielo di Bruca — il programma dell’estate, a due passi da casa. Seguite i colori.', programMore: 'Dettagli e orari su Instagram', socialsTitle: 'Da seguire', festivalDescs: ["Il grande giorno dell’estate italiana. Erede delle Feriae Augusti romane e legata all’Assunzione, la festa riunisce famiglie e paesi in riva al mare: bagni, grandi pranzi, processioni e fuochi d’artificio animano tutta la Sicilia.", "San Rocco, invocato da secoli contro le epidemie, protegge molte comunità siciliane. A Scicli la sua statua è portata in processione tra i vicoli, tra bande musicali e luminarie di festa.", "San Giovanni Battista è il patrono di Ragusa, a cui è dedicata la cattedrale. Il 29 agosto, giorno della sua decollazione, la città si illumina: solenne processione della statua e grande spettacolo pirotecnico sopra la città vecchia.", "San Corrado Confalonieri, eremita venerato come patrono di Noto. L’ultima domenica d’agosto, la sua urna d’argento attraversa le vie barocche in una grande devozione popolare, tra ceri, fiori e cortei."], legend: { occupied: 'Occupato', tentative: 'In attesa', free: 'Libero', festival: 'Festa siciliana' } },
  ctaEyebrow: 'Voglia di venire?',
  ctaTitle: 'Scriveteci',
  question: 'Una domanda sul vostro soggiorno?',
  contactLabels: { email: 'Email', instagram: 'Instagram' },
  pages: {
    'informations-pratiques': {
      eyebrow: 'Informazioni pratiche',
      title: 'Info pratiche',
      intro: 'Arrivo, partenza, dotazioni dell’appartamento e piccoli consigli per godervi appieno il vostro soggiorno a Cava d’Aliga.',
      blocks: [
        { title: 'Arrivo & partenza', items: ['Orari di check-in / check-out.', 'Consegna delle chiavi e istruzioni per l’accesso.'] },
        { title: 'L’appartamento', items: ['Dotazioni (cucina, wifi, aria condizionata, biancheria).', 'Capienza e configurazione dei letti.'] },
        { title: 'Buono a sapersi', items: ['Regole della casa.', 'Raccolta differenziata e vita del borgo.'] },
        { title: 'Contatti utili', items: ['Medico, farmacia, taxi.', 'Numeri di emergenza in Italia.'] },
      ],
    },
    'services-locaux': {
      eyebrow: 'Servizi locali e contatti utili',
      title: 'I nostri indirizzi nei dintorni',
      intro: 'Negozi, ristoranti, mercati e contatti utili: i nostri consigli personali per vivere Cava d’Aliga come a casa.',
      blocks: [
        { title: 'Mangiare & bere', items: ['Ristoranti e trattorie che amiamo.', 'Gelaterie, caffè e specialità siciliane.'] },
        { title: 'Spesa & mercati', items: ['Alimentari e supermercati vicini.', 'Giorni e luoghi dei mercati.'] },
        { title: 'Spiaggia & tempo libero', items: ['Spiagge e cale consigliate.', 'Noleggi (lettini, barche, bici).'] },
      ],
    },
    'la-region': {
      eyebrow: 'La regione',
      title: 'Scoprire il sud-est della Sicilia',
      intro: 'Scicli, Ragusa, il barocco del Val di Noto, le spiagge nascoste e la campagna degli Iblei. Di che riempire ogni giornata del vostro soggiorno.',
      blocks: [
        { title: 'Città barocche', items: ['Scicli, Ragusa Ibla, Modica e Noto.', 'Siti patrimonio mondiale dell’UNESCO.'] },
        { title: 'Mare & natura', items: ['Spiagge e cale della costa sud.', 'Riserve naturali e sentieri.'] },
        { title: 'Sapori', items: ['Cioccolato di Modica, cannoli, vini locali.', 'Mercati e produttori.'] },
        { title: 'Escursioni', items: ['Giornate alla scoperta dell’isola.', 'Idee di itinerari secondo la durata del soggiorno.'] },
      ],
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
          'Autista privato — Giovanni, la nostra perla (+39 380 313 8948): 10 € da Donnalucata all’appartamento, 20 € da Pozzallo, 150 € dall’aeroporto di Catania. Fino a 5-6 persone. Da avvisare in anticipo in base alla disponibilità (tenete un piano B).',
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
      { icon: 'flame', title: 'Gas', items: ['Un signore vicino alla piazza (in alto) consegna a domicilio.', 'Contatti in arrivo.'] },
      { icon: 'signal', title: 'Wifi', items: ['Rete: cacestlaissetomber', 'Password: jamonito'] },
    ],
    toCome: 'Chiavi e consigli per il primo giorno (spesa, panetteria, farmacia, benzina): presto online.',
  },
  depart: {
    eyebrow: 'Partenza',
    title: 'Lasciare la casa in tutta serenità',
    intro: 'La piccola check-list da spuntare prima di chiudere la porta.',
    checklistTitle: 'Prima di partire',
    checklist: [
      'Chiudere l’acqua (valvola bagno + strada)',
      'Staccare l’elettricità (interruttori terrazza)',
      'Sbrinare il frigo, lasciare lo sportello aperto',
      'Portare fuori i rifiuti per il giorno dopo',
    ],
  },
};

const EN: Dict = {
  nav: ['Home', 'Plan your trip', 'Practical information', 'Favourite spots', 'The region', 'The family', 'Calendar'],
  region: 'Sicily',
  tagline: 'a village in south-east Sicily',
  subLabels: ['Near Scicli in the province of Ragusa'],
  writeUs: 'Write to us',
  contactLink: 'Contact',
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
    'All the practical information',
    'Our favourite spots',
    'Discover the region',
    'Everything to plan your trip',
    'Get in contact',
  ],
  indexCards: [
    { title: 'Practical information', desc: 'Arrival, departure, amenities, wifi — everything for a smooth stay.' },
    { title: 'Local services & useful contacts', desc: 'Shops, restaurants, markets and our favourite spots nearby.' },
    { title: 'Discover the region', desc: 'Scicli, Ragusa, the baroque of Val di Noto and the hidden beaches.' },
    { title: 'Plan your trip', desc: 'Flights, airports, how to reach the house and a checklist before you leave.' },
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
  salvaPage: { title: 'The family', intro: 'Photos, memories and family history, over the years.', historyTitle: 'Family history', historyText: "From one generation to the next, this house in Cava d’Aliga brings the family together. Its story will soon be written here — the origins, the shared summers and the faces that made it live.", treeTitle: 'Family tree', treeNote: 'Coming soon: a collaborative tree where everyone can add their branch.', treePaternal: 'Paternal grandparents', treeMaternal: 'Maternal grandparents', treeWife1: '1st wife', treeWife2: '2nd wife', treeAdd: '+ Add my branch', treeAddSubject: 'Family tree — my branch', treeExample: 'Example structure — tell us the real relationships and we’ll complete it.' },
  calendarPage: { title: 'The calendar', intro: 'When the house is occupied, so the family can coordinate.', festivalsTitle: 'Sicilian festivals', programTitle: 'Upcoming events', programNote: 'Sotto il cielo di Bruca — the summer programme, steps from the house. Follow the colours.', programMore: 'Details and times on Instagram', socialsTitle: 'Follow', festivalDescs: ["The high point of the Italian summer. Descended from the Roman Feriae Augusti and tied to the Assumption, the holiday gathers families and villages by the sea: swimming, big meals, processions and fireworks all across Sicily.", "Saint Roch, invoked for centuries against epidemics, protects many Sicilian communities. In Scicli his statue is carried in procession through the alleys, amid brass bands and festive lights.", "Saint John the Baptist is the patron of Ragusa, whose cathedral is dedicated to him. On 29 August, the day of his beheading, the town lights up: a solemn procession of the statue and a grand fireworks display over the old town.", "Saint Conrad Confalonieri, a hermit venerated as Noto’s patron. On the last Sunday of August, his silver urn moves through the baroque streets in great popular devotion, among candles, flowers and processions."], legend: { occupied: 'Occupied', tentative: 'Pending', free: 'Free', festival: 'Sicilian festival' } },
  ctaEyebrow: 'Ready to come?',
  ctaTitle: 'Write to us',
  question: 'A question about your stay?',
  contactLabels: { email: 'Email', instagram: 'Instagram' },
  pages: {
    'informations-pratiques': {
      eyebrow: 'Practical information',
      title: 'Practical info',
      intro: 'Arrival, departure, apartment amenities and a few tips to make the most of your stay in Cava d’Aliga.',
      blocks: [
        { title: 'Arrival & departure', items: ['Check-in / check-out times.', 'Key handover and access instructions.'] },
        { title: 'The apartment', items: ['Amenities (kitchen, wifi, air conditioning, linen).', 'Capacity and bedding layout.'] },
        { title: 'Good to know', items: ['House rules.', 'Waste sorting and life in the hamlet.'] },
        { title: 'Useful contacts', items: ['Doctor, pharmacy, taxi.', 'Emergency numbers in Italy.'] },
      ],
    },
    'services-locaux': {
      eyebrow: 'Local services & useful contacts',
      title: 'Our favourite spots nearby',
      intro: 'Shops, restaurants, markets and useful contacts: our personal recommendations to live Cava d’Aliga like a local.',
      blocks: [
        { title: 'Eat & drink', items: ['Restaurants and trattorias we love.', 'Gelato, cafés and Sicilian specialities.'] },
        { title: 'Groceries & markets', items: ['Nearby grocery stores and supermarkets.', 'Market days and locations.'] },
        { title: 'Beach & leisure', items: ['Recommended beaches and coves.', 'Rentals (sunbeds, boats, bikes).'] },
      ],
    },
    'la-region': {
      eyebrow: 'The region',
      title: 'Discover south-east Sicily',
      intro: 'Scicli, Ragusa, the baroque of Val di Noto, the hidden beaches and the Iblei countryside. Plenty to fill every day of your stay.',
      blocks: [
        { title: 'Baroque towns', items: ['Scicli, Ragusa Ibla, Modica and Noto.', 'UNESCO World Heritage sites.'] },
        { title: 'Sea & nature', items: ['Beaches and coves of the south coast.', 'Nature reserves and trails.'] },
        { title: 'Flavours', items: ['Modica chocolate, cannoli, local wines.', 'Markets and producers.'] },
        { title: 'Day trips', items: ['Days exploring the island.', 'Itinerary ideas depending on your stay.'] },
      ],
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
          'Private driver — Giovanni, our gem (+39 380 313 8948): €10 from Donnalucata to the apartment, €20 from Pozzallo, €150 from Catania airport. Up to 5-6 people. Book ahead subject to availability (keep a plan B).',
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
      { icon: 'flame', title: 'Gas', items: ['A gentleman near the square (uptown) delivers to your door.', 'Contact details coming soon.'] },
      { icon: 'signal', title: 'Wifi', items: ['Network: cacestlaissetomber', 'Password: jamonito'] },
    ],
    toCome: 'Keys and first-day tips (groceries, bakery, pharmacy, petrol): coming online soon.',
  },
  depart: {
    eyebrow: 'Departure',
    title: 'Leaving the house with peace of mind',
    intro: 'The short checklist to tick off before you close the door.',
    checklistTitle: 'Before you leave',
    checklist: [
      'Turn off the water (bathroom valve + street)',
      'Turn off the electricity (terrace switches)',
      'Defrost the fridge, leave the door open',
      'Put out the bins for the next day',
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
