import type { IconName } from './Icon';
import type { Lang } from './localData';

// ────────────────────────────────────────────────────────────────────────
// Transports locaux & urgences.
// Liens vérifiés : chaque URL répond, et on ne publie que ce qui existe.
// ────────────────────────────────────────────────────────────────────────

export type Transport = {
  id: string;
  name: string;
  icon: IconName;
  url: string;
  appUrl?: string;
  appLabel?: string;
  blurb: Record<Lang, string>;
};

export const TRANSPORTS: Transport[] = [
  {
    id: 'sais',
    name: 'SAIS — bus locaux',
    icon: 'target',
    url: 'https://ssl.autoroute.it/apps/sais_scicli/index.cfm',
    blurb: {
      fr: 'Le plus utile : les bus d’un village à l’autre, en temps réel. Les arrêts de Cava d’Aliga, Bruca, Donnalucata et Sampieri y sont. Horaires, position du bus en direct et billets. C’est le QR code du panneau à Donnalucata.',
      it: 'Il più utile: i bus da un paese all’altro, in tempo reale. Ci sono le fermate di Cava d’Aliga, Bruca, Donnalucata e Sampieri. Orari, posizione del bus in diretta e biglietti. È il QR code del cartello a Donnalucata.',
      en: 'The most useful one: buses from village to village, in real time. The Cava d’Aliga, Bruca, Donnalucata and Sampieri stops are all there. Timetables, live bus position and tickets. It is the QR code on the sign at Donnalucata.',
    },
  },
  {
    id: 'ast',
    // Le moteur « Percorsi e orari » (port 8080), pas la page d'accueil : on
    // y choisit départ et arrivée. Vérifié : 451 localités, dont CATANIA
    // AEROPORTO, SCICLI, SCICLI-SAMPIERI et DONNALUCATA. Cava d'Aliga n'y est
    // pas — AST fait l'interurbain, le local c'est SAIS.
    name: 'AST — bus régionaux',
    icon: 'compass',
    url: 'http://www.aziendasicilianatrasporti.it:8080/',
    blurb: {
      fr: 'Pour sortir du village : on choisit un départ, une arrivée, et il sort les horaires. Scicli, Donnalucata, Sampieri, Modica, Raguse, Noto, Syracuse — et l’aéroport de Catane, ce qui vaut le coup d’être vérifié avant de réserver un taxi. Cava d’Aliga n’y est pas : pour le village même, c’est SAIS.',
      it: 'Per uscire dal paese: si sceglie partenza e arrivo, e lui dà gli orari. Scicli, Donnalucata, Sampieri, Modica, Ragusa, Noto, Siracusa — e l’aeroporto di Catania, cosa che vale la pena controllare prima di prenotare un taxi. Cava d’Aliga non c’è: per il paese stesso c’è SAIS.',
      en: 'To get out of the village: pick a departure and an arrival, and it gives you the times. Scicli, Donnalucata, Sampieri, Modica, Ragusa, Noto, Siracusa — and Catania airport, which is worth checking before booking a taxi. Cava d’Aliga is not listed: for the village itself, use SAIS.',
    },
  },
  {
    id: 'catania',
    name: 'Aéroport de Catane (CTA)',
    icon: 'compass',
    url: 'https://www.aeroporto.catania.it/tracking-voli/partenze',
    appUrl: 'https://play.google.com/store/apps/details?id=it.aeroporto.catania',
    appLabel: 'Appli « Aeroporto Catania »',
    blurb: {
      fr: 'Arrivées et départs en direct, retards, annulations, numéro de porte. L’appli officielle fait la même chose dans la poche — pratique quand on va chercher quelqu’un et qu’on a deux heures de route.',
      it: 'Arrivi e partenze in diretta, ritardi, cancellazioni, numero del gate. L’app ufficiale fa lo stesso in tasca — comoda quando si va a prendere qualcuno e ci sono due ore di strada.',
      en: 'Live arrivals and departures, delays, cancellations, gate number. The official app does the same in your pocket — handy when you are collecting someone and it is a two-hour drive.',
    },
  },
];

// ── Pharmacie ─────────────────────────────────────────────────────────
// La plus proche, relevée dans OpenStreetMap puis confirmée par géocodage
// inverse : elle est dans le village, à 300 m de la maison.
//
// Pour les gardes, le site officiel de l'Ordre des pharmaciens de Raguse
// (farmacistiragusa.it) est en panne — vérifié dans un navigateur, il renvoie
// « Technical Problems ». On pointe donc vers l'agrégateur qui cite cet Ordre
// comme source, et qui prévient lui-même que le tour est prévisionnel.
export const PHARMACY = {
  name: 'Farmacia Trovato',
  street: 'Via Sofocle, Cava d’Aliga',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Farmacia+Trovato+Cava+d%27Aliga+Scicli',
  dutyUrl: 'https://www.farmaciaditurno.org/comune/scicli',
  hours: {
    fr: 'Lun–ven 9 h–13 h et 17 h 30–20 h 30',
    it: 'Lun–ven 9–13 e 17.30–20.30',
    en: 'Mon–Fri 9am–1pm and 5.30–8.30pm',
  },
};

// ── Gaz ───────────────────────────────────────────────────────────────
// Mormina Gas, d'après sa carte de visite. C'est un commerce : ses numéros
// sont ceux qu'il distribue lui-même, on peut les afficher — contrairement
// aux contacts privés, qui passent par Mag.
export const GAS = {
  name: 'Mormina Gas',
  street: 'Via Tolstoj 132A, Cava d’Aliga',
  phone: '0932 852454',
  phoneTel: '+390932852454',
  mobile: '334 889 6789',
  mobileTel: '+393348896789',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Tolstoj+132A+Cava+d%27Aliga+Scicli',
};

// ── Urgences ──────────────────────────────────────────────────────────
// En Sicile le 112 est le numéro unique : il reçoit l'appel et bascule vers
// le bon service. Les anciens numéros restent joignables.
export type Emergency = { number: string; label: Record<Lang, string> };

export const EMERGENCIES: Emergency[] = [
  { number: '118', label: { fr: 'Urgence médicale', it: 'Emergenza sanitaria', en: 'Medical emergency' } },
  { number: '115', label: { fr: 'Pompiers', it: 'Vigili del fuoco', en: 'Fire brigade' } },
  { number: '113', label: { fr: 'Police', it: 'Polizia', en: 'Police' } },
  { number: '1530', label: { fr: 'Secours en mer', it: 'Guardia costiera', en: 'Coastguard' } },
];
