import { LOCAL_PLACES, CATS, SEARCH_WORDS, norm, type Lang, type CatKey } from './localData';
import { WASTE, WEEK, mondayIndex } from './wasteData';
import { PHARMACY, GAS, EMERGENCIES, TRANSPORTS } from './practicalData';
import type { Dict } from './i18n';

// ────────────────────────────────────────────────────────────────────────
// « Demander » — le moteur de reponse.
//
// LA REGLE, celle qui commande tout le reste : cet assistant NE REDIGE RIEN.
// Il ne sait que retrouver un texte que Mag a ecrit et le rendre mot pour mot,
// avec le lien vers la page d'ou il vient. Aucune IA, aucun serveur, aucune
// clef — et donc aucune invention possible. Si quelqu'un demande ou est la
// vanne d'eau, il lit la phrase de la page ; il ne la reformule pas.
//
// C'est aussi pour ca que l'index se construit a partir du dictionnaire VIVANT
// (`t`) et des fichiers de donnees, jamais d'une copie. Corriger une phrase
// dans i18n.tsx corrige la reponse de l'assistant dans la seconde ; une copie,
// elle, aurait vieilli en silence.
//
// Quand rien ne correspond assez bien, il le DIT et renvoie vers Mag. Un
// assistant qui repond a cote fait plus de degats qu'un assistant qui avoue.
// ────────────────────────────────────────────────────────────────────────

export type Lien = { label: string; url: string };

export type Fiche = {
  id: string;
  /**
   * La page d'ou vient le texte — toujours affichee sous la reponse.
   *
   * Le fragment compte autant que la page : « Demander » coupe les reponses
   * longues, et le lien doit reprendre la lecture LA OU elle s'arrete. Les
   * infos pratiques n'affichent d'ailleurs qu'une section a la fois — sans
   * fragment, le lien ouvrirait l'adresse alors qu'on demandait les
   * poubelles. Voir informations-pratiques/page.tsx, qui lit ce fragment.
   */
  page: string;
  titre: string;
  /** Le texte de Mag, mot pour mot. */
  lignes: string[];
  liens?: Lien[];
  /**
   * Les mots-clefs CHOISIS — et rien d'autre.
   *
   * Ils portaient aussi, au debut, tous les mots du texte de la fiche. C'etait
   * l'erreur : « peut », croise dans une phrase sur l'arbre genealogique, pesait
   * alors autant que « wifi » choisi pour le wifi. « On peut se baigner ? »
   * repondait donc l'arbre genealogique, et « le prix de la nuit » repondait un
   * supermarche — alors que le site ne parle d'aucun prix et devait l'avouer.
   * Le texte se cherche toujours, mais il pese ce que pese du texte.
   */
  mots: string[];
  /** Les mots qui designent CETTE fiche et pas une famille de fiches. */
  motsPrecis?: string[];
  /**
   * Les EXPRESSIONS — plusieurs mots qui ne valent qu'ensemble.
   *
   * « fruits de mer » etait decoupe en mots isoles, et « fruits » devenait
   * donc un mot-clef de la trattoria de poisson : « des fruits » repondait un
   * restaurant au lieu du rayon. Une expression ne compte desormais que si
   * TOUS ses mots sont dans la question.
   */
  expressions?: string[][];
};

/** Mots trop courants pour departager quoi que ce soit — les 3 langues melees,
 *  comme SEARCH_WORDS, puisqu'on compare sans accents ni casse. */
const VIDES = new Set(
  (
    'le la les un une des du de d au aux et ou a c est ce cet cette quel quelle quels quelles ' +
    'comment quand pourquoi qui quoi que qu je tu il elle on nous vous ils faut il-y-a y en sur ' +
    'dans pour avec sans mon ma mes notre nos votre vos se sont ete etre avoir fait faire ' +
    'ne pas plus tres bien peut peux peuvent veux voudrais aimerais svp merci stp ' +
    'il lo la i gli le di da del della dei delle e ed o un uno una come dove quando perche chi ' +
    'che cosa si no per con senza sul nel alla al ai agli mio mia miei nostro vostro sono stato ' +
    'the a an of in on at to for with without and or is are was how what when where why who ' +
    'which do does did can i you we they my our your it its'
  ).split(/\s+/),
);

/** Les mots utiles d'une question, sans accents, sans bruit. */
export const motsDe = (s: string): string[] =>
  norm(s)
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((m) => m.length >= 2 && !VIDES.has(m));

/** Les mots d'un texte, pour l'indexation. Doublons ecartes. */
const motsDuTexte = (parties: string[]): string[] => [...new Set(parties.flatMap(motsDe))];

/**
 * Les synonymes de SEARCH_WORDS qui visent cette adresse.
 *
 * Cette table vivait dans localData.ts sans que rien ne la lise — douze lignes
 * de mots ecrits dans les trois langues pour relier une envie (« pizza »,
 * « apero », « gouter ») a une adresse. Elle sert enfin.
 */
const unMot = (w: string) => motsDe(w).length === 1;

const synonymesDuLieu = (id: string, cat: CatKey, aussi: CatKey[] = []) => {
  const cats = [cat, ...aussi];
  const pourLui = SEARCH_WORDS.filter((h) => h.ids?.includes(id));
  return {
    // Mag a ecrit « pain » en visant Giannone : c'est une adresse, pas un rayon.
    // Seuls les mots SIMPLES comptent isolement — voir `expressions`.
    precis: pourLui.flatMap((h) => h.words.filter(unMot).flatMap(motsDe)),
    // « plage » vise huit endroits : le mot situe, il ne designe pas.
    larges: SEARCH_WORDS.filter((h) => h.cat && cats.includes(h.cat)).flatMap((h) => h.words.filter(unMot).flatMap(motsDe)),
    expressions: pourLui.flatMap((h) => h.words.filter((w) => !unMot(w)).map(motsDe)),
  };
};

// ── Les mots qu'on tape pour parler de la MAISON ────────────────────────
// Meme esprit que SEARCH_WORDS, meme forme : les trois langues melangees,
// sans accents. On cherche « code wifi », « la lumiere marche pas », « ou sont
// les poubelles » — jamais le titre exact de la rubrique. Enrichir = ajouter
// des mots a une ligne.
const MOTS_MAISON: Record<string, string> = {
  // Les mots de la PANNE sur les quatre : c'est ainsi qu'on signale une chose
  // cassee. « marche » et « marcher » n'y sont PAS — voir MOTS_AMBIGUS.
  'op-bolt':
    'fonctionne panne casse '
    + 'non funziona guasto rotto broken not working '
    + 'electricite courant lumiere lumieres disjoncteur compteur interrupteur interrupteurs panne noir ' +
    'elettricita corrente luce luci interruttore contatore buio ' +
    'electricity power light lights switch breaker meter blackout prise prises branchement ampoule ampoules lampe plafonnier fusible tableau electrique coupure presa spina lampadina lampada fusibile quadro elettrico blackout socket plug bulb lamp fuse fusebox outage',
  'op-drop':
    'fonctionne panne casse non funziona guasto rotto broken '
    + 'eau vanne robinet douche pression fuite couper ouvrir buanderie evier ' +
    'acqua valvola rubinetto doccia pressione perdita chiudere aprire lavanderia lavello ' +
    'water valve tap faucet shower pressure leak turn laundry sink chaude froide chauffe eau ballon boiler robinet fuite goutte bouchon canalisation wc toilette chasse calda fredda scaldabagno rubinetto perdita goccia scarico water sciacquone hot cold boiler heater tap dripping drain toilet flush',
  'op-flame':
    'fonctionne panne casse non funziona guasto rotto broken '
    + 'gaz bouteille cuisiniere gaziniere plaque feu bonbonne cuisson recharge ' +
    'bombola cucina fornello fuoco ricarica ' +
    'gas bottle cylinder stove cooker hob refill allumer eteindre allumage flamme casserole poele four brulure securite odeur accendere spegnere fiamma pentola forno odore sicurezza light turn on off flame pan oven smell safety',
  'op-key':
    'buanderie lave linge machine laver lessive etendre seche linge cle clef accrochee buffet salon bois '
    + 'lavanderia lavatrice bucato stendere chiave credenza salotto legno '
    + 'laundry washing machine wash clothes key sideboard living room',
  'op-leaf':
    'plante plantes arroser arrosage eau litres jasmin jasmins bougainvillier bougainvilliers bougainvillee fleur fleurs jardin terrasse pot pots '
    + 'pianta piante annaffiare innaffiare annaffiatura gelsomino gelsomini bougainvillee fiori giardino vaso vasi litri '
    + 'plant plants water watering jasmine bougainvillea flowers garden pot pots litres how often tous les combien frequence quand arroser',
  'op-wave':
    'douche doucher sable plage mer canalisation canalisations plomberie tuyau tuyaux bouche bouché evacuation rincer rincage se rincer '
    + 'doccia sabbia spiaggia mare tubature idraulico tubo intasato sciacquare risciacquo '
    + 'shower sand beach sea pipes plumbing drain blocked rinse rinsing before coming home avant de rentrer',
  'op-signal':
    'fonctionne panne casse non funziona guasto rotto broken '
    + 'wifi wi internet reseau code password mot passe connexion connecter box debit recharger ' +
    'rete parola chiave collegare connessione ricaricare ' +
    'network connect connection login broadband identifiant login se connecter deconnecte lent coupe routeur modem antenne 4g 5g donnees partage credenziali collegarsi lento router modem dati credentials sign in slow router modem data hotspot tethering',
  // « aller » a du quitter cette ligne : c'est le verbe de TOUS les trajets.
  // « aller a l'aeroport » repondait l'adresse de la maison.
  adresse:
    'adresse situe maison casa appartement rue via numero itineraire plan ' +
    'indirizzo strada mappa ' +
    'address street house flat apartment directions map ou sommes nous venir arriver acces portail entree etage rez chaussee dove siamo venire arrivare accesso cancello ingresso piano terra where are we come arrive access gate entrance floor ground',
  depart:
    'partir depart quitter fermer cle cles rendre laisser derniere check liste verifier avant ' +
    'partire partenza chiudere chiave chiavi lasciare ultima controllare prima ' +
    'linge lessive laver machine lave lit lits draps refaire couvertures serviettes buanderie biancheria bucato lavare lavatrice letto letti lenzuola rifare asciugamani laundry wash washing machine bed beds sheets make towels ' +
    'leave leaving departure lock key keys checklist last check before menage nettoyer ranger vaisselle poubelle derniere minute rendre restituer volets fenetres pulire riordinare stoviglie ultimo minuto restituire persiane finestre clean tidy dishes last minute return shutters windows checkout',
  valise:
    'valise bagage emporter prendre apporter preparer papiers passeport permis carte identite ' +
    'assurance adaptateur prise ' +
    'valigia bagaglio portare preparare documenti passaporto patente carta identita contanti ' +
    'luggage pack bring passport licence id insurance adapter plug maillot serviette creme solaire chapeau lunettes chaussures medicaments trousse chargeur adaptateur costume asciugamano crema solare cappello occhiali scarpe medicine caricabatterie swimsuit towel sunscreen hat sunglasses shoes medicine charger',
  poubelles:
    'poubelle poubelles dechets tri ordures benne bac sac ramassage collecte sortir verre ' +
    'plastique papier carton organique compost recyclage ' +
    'rifiuti spazzatura differenziata raccolta giorno vetro plastica carta cartone organico umido ' +
    'bin bins rubbish waste sorting recycling collection glass plastic paper cardboard organic conteneur container benne sortir soir camion passage tri selectif dechetterie encombrant contenitore cassonetto sera camion ingombranti isola ecologica container bin lorry truck evening bulky recycling centre',
  pharmacie:
    'pharmacie pharmacien medicament medicaments ordonnance garde malade grippe ' +
    'farmacia medicina medicine ricetta turno malato ' +
    'pharmacy chemist medicine prescription duty ill sick parapharmacie creme piqure moustique brulure soleil fievre mal tete ventre pansement farmacia crema puntura zanzara febbre mal di testa cerotto chemist cream bite mosquito sunburn fever headache plaster bandage',
  urgences:
    'urgence urgences secours pompier pompiers police carabinieri ambulance hopital docteur medecin garde '
    + '112 118 115 113 numero unique guardia ' +
    'accident noye sauvetage numero appeler ' +
    'emergenza soccorso vigili fuoco polizia ambulanza ospedale medico incidente chiamare ' +
    'emergency ambulance fire police hospital doctor accident drowning rescue call sos aide danger blesse malaise brulure noyade meduse serpent chien morsure commissariat aiuto pericolo ferito malore ustione annegamento medusa serpente morso help danger injured faint burn drowning jellyfish snake bite police station',
  argent:
    'argent liquide especes cash monnaie retirer retrait distributeur dab bancomat postamat guichet automatique '
    + 'banque banca poste posta bureau poste carte bleue carte bancaire visa mastercard paiement payer especes seulement '
    + 'contanti prelevare prelievo sportello automatico bancomat ufficio postale banca carta pagare soldi '
    + 'money cash withdraw withdrawal atm cash machine cashpoint bank post office card visa mastercard pay where to get cash mister cash bancontact',
  parking:
    // Le gardien a la casquette : on le cherche avec des mots tres varies —
    // « type qui garde les voitures », « faut payer le gars ». On ratisse.
    'gardien gardiens casquette surveillant parcheggiatore posteggiatore abusivo pourboire tip mancia '
    + 'garde surveille surveiller monsieur type gars homme voiture volee vol securite sicurezza sorvegliare custode attendant watchman minder '
    + 'cap hat man guy bloke someone watching my car who is he should i pay him uomo berretto cappello chi e devo pagarlo '
    + 'parking parkings garer stationner stationnement place places emplacement voiture auto bleu blanc '
    + 'jaune rose vert ligne lignes bande bandes horodateur parcometre ticket disque amende pv fourriere '
    + 'parcheggio parcheggiare sosta stallo stalli strisce blu bianche gialle rosa verdi disco orario multa '
    + 'park parking bay bays lines blue white yellow meter ticket disc fine se garer voiture stationner amende contravention fourriere gratuit payant place libre parcheggiare multa carro attrezzi gratuito pagamento posto libero park fine towed free paid space',
  plombier:
    'plombier plomberie fuite tuyau canalisation bouche evier lavabo toilette wc chasse '
    + 'idraulico tubo scarico lavandino perdita '
    + 'plumber pipe drain leak sink toilet blocked '
    + 'devis preventivo quote chasse wc bouche deborde inonde chauffe eau siphon joint robinet qui fuit artisan depannage intasato allagato sifone guarnizione idraulico pronto intervento blocked overflowing flooded siphon washer emergency callout',
  gaz:
    'gaz bouteille bonbonne livraison reparer cuisiniere marchand mormina ' +
    'bombola consegna riparare fornello ' +
    'gas bottle cylinder delivery repair cooker supplier bonbonne vide changer echanger livrer commander brancher detendeur tuyau bombola vuota cambiare consegnare ordinare collegare regolatore tubo empty change swap deliver order connect regulator hose',
  // « nuit », « notte », « night » n'y sont PAS, et c'est deliberе. Je les
  // avais ajoutes en enrichissant : « le prix de la nuit » s'est mis a repondre
  // « Le calendrier », alors que le site ne parle d'aucun prix — c'est la regle
  // de fond de Mag, ce n'est pas une location. Une question d'argent doit
  // rester sans reponse. Le calendrier se trouve tres bien par « semaine »,
  // « dates », « libre », « dormir », « sejour ».
  calendrier:
    'calendrier libre libres disponible disponibilite occupe reserve dates sejour sejours quand ' +
    'venir monde qui vient planning ' +
    'calendario libero disponibile occupato date soggiorno quando venire chi viene ' +
    'calendar free available booked dates stay when coming who reserver reservation planning agenda semaine mois sejourner rester dormir dates libres prenotare prenotazione settimana mese dormire date libere book booking week month sleep stay free dates dort dorment couche loge heberge occupe qui vient',
  famille:
    'famille arbre genealogie genealogique ancetre ancetres grand grands parents cousin cousins ' +
    'origine nom histoire salva contrino ' +
    'famiglia albero genealogico antenati nonni cugini origine storia ' +
    'family tree genealogy ancestors grandparents cousins origin history parents grands parents oncle tante cousin cousine ancetre aieul nom prenom genealogie racines genitori nonni zio zia cugino antenati cognome radici parents grandparents uncle aunt cousin ancestors surname roots pere mere papa maman arriere bisaieul aieule frere soeur neveu niece padre madre nonno nonna bisnonno fratello sorella father mother great grandfather grandmother brother sister',
  // Les trois groupes de « Preparer le voyage », reperes par leur EMOJI.
  //
  // Leurs libelles de liens sont des marques — Skyscanner, Trenitalia, Goldcar
  // — et aucun ne contient les mots qu'on tape : « louer une voiture » ne
  // rendait rien. Leurs titres non plus (« Rejoindre Casa Cava d'Aliga »).
  // L'emoji, lui, ne change ni avec la langue ni avec le rang du groupe, ce
  // qu'un index ne garantissait pas.
  'voyage-✈️': 'vol vols avion billet compagnie escale bagage skyscanner volo aereo biglietto flight plane ticket luggage',
  'voyage-🛬': 'aeroport aeroporto airport catane catania palerme palermo comiso atterrir arrivee arrivo landing',
  'voyage-⛴️':
    'voiture auto route conduire rouler venir descendre traverser trajet autoroute peage '
    + 'bateau ferry traversier traversee genes genova gene palerme palermo messine messina calabre calabria reggio villa san giovanni detroit stretto gnv caronte cabine embarquer embarquement '
    + 'duree dure heures longtemps durata dura ore duration how long hours '
    + 'nave traghetto traghetti guidare strada autostrada pedaggio imbarco cabina venire in auto '
    + 'car drive driving road motorway toll boat ferry crossing genoa palermo messina calabria strait cabin board boarding come by car bring the car',
  'voyage-🚗':
    'voiture louer location loueur auto taxi uber vtc train navette transfert conduire permis autoroute peage '
    + 'macchina noleggio noleggiare treno trasferimento guidare patente autostrada pedaggio '
    + 'car rent rental hire drive licence motorway toll transfer shuttle',
  // Les transports. Sans ces mots, « le bus pour Modica » repondait la
  // chocolaterie de Modica : « modica » etait son mot, et « bus » n'etait celui
  // de personne.
  'transport-sais':
    'bus autobus car navette arret arrets ligne horaire horaires passage village '
    + 'fermata fermate orario orari corriera pullman '
    + 'stop stops timetable schedule coach arret navette ticket billet monter descendre ligne direction plage village voisin fermata biglietto salire scendere linea paese vicino stop ticket board get off line neighbouring village',
  'transport-ast':
    'bus autobus car interurbain horaire horaires modica ragusa raguse noto siracusa syracuse pozzallo ispica '
    + 'corriera pullman orario orari '
    + 'coach intercity timetable car autocar liaison interurbain gare routiere correspondance pullman collegamento autostazione coincidenza coach connection bus station transfer',
  'transport-catania': 'aeroport aeroporto airport avion aereo plane vol volo flight catane catania arrivee partenza retard ritardo delay porte gate bagage atterrissage decollage terminal enregistrement navette location voiture parking longue duree atterraggio decollo check in navetta noleggio landing takeoff terminal check in shuttle rental long stay',
  'region-etna':
    'etna volcan volcanique eruption lave cratere neige ski skier montagne granita nivaroli excursion '
    + 'vulcano eruzione lava cratere neve sciare montagna gita '
    + 'volcano eruption crater snow skiing mountain hike altitude sommet randonner telepherique guide sortie coulee cendres fumee sud nord refuge altitudine cima funivia guida colata cenere fumo rifugio altitude summit cable car guide lava ash smoke refuge',
  'region-arabe':
    'arabe arabes arabo normand histoire musulman sarrasin conquete heritage architecture nom noms toponymie '
    + 'sicile passe siecle moyen age '
    + 'arabo normanno storia musulmano saraceno conquista eredita '
    + 'arab norman history moorish conquest heritage sarrasin berbere irrigation jardin agrume mot nom de lieu quartier ruelle saraceno berbero irrigazione giardino agrume toponimo quartiere vicolo saracen berber irrigation garden citrus place name quarter alley',
  'region-coutumes':
    'coutume coutumes habitude habitudes usage usages horaire horaires sieste riposo pourboire mancia '
    + 'magasin magasins boutique boutiques commerce commerces ouvert ouverte ferme fermeture ouverture midi '
    + 'negozio negozi aperto chiuso chiusura apertura pomeriggio '
    + 'shop shops opening closing closed open lunchtime '
    + 'politesse maniere vivre local abitudini orari usanze '
    + 'customs habits opening hours siesta tipping manners pourboire service politesse tutoiement horaire repas diner tard sieste dimanche ferie mancia servizio educazione orario pasto cena tardi domenica festivo tipping service manners mealtime dinner late sunday public holiday',
  'region-specialites':
    'specialite specialites cuisine plat plats manger typique arancina cannolo cassata caponata pasta '
    + 'norma sarde ricotta amande pistache '
    + 'specialita piatti tipici mandorla pistacchio '
    + 'speciality dishes food typical almond pistachio arancina cannolo cassata caponata granita brioche pasta alla norma sarde pistache amande ricotta mandorla pistacchio ricotta sarde almond pistachio ricotta street food snack',
  'region-alcools':
    'vin vins alcool alcools cave vigne cepage nero avola frappato cerasuolo marsala passito moscato '
    + 'amaro liqueur biere aperitif '
    + 'vino vini cantina vigna vitigno birra liquore '
    + 'wine wines vineyard grape beer liqueur cave domaine degustation bouteille rouge blanc rose sec doux liquoreux digestif cantina degustazione bottiglia rosso bianco secco dolce digestivo winery tasting bottle red white dry sweet digestif',
  'region-cafe':
    'cafe caffe expresso espresso ristretto macchiato cappuccino comptoir bar matin granita brioche '
    + 'colazione banco mattina '
    + 'coffee breakfast counter morning comptoir debout sucre lait mousse tasse petit dejeuner croissant banco in piedi zucchero latte schiuma tazza colazione cornetto counter standing sugar milk foam cup breakfast pastry',
  // « quiz » s'ecrit avec un z, deux z, ou pas du tout — on prend les trois.
  quiz:
    'quiz quizz quizs questionnaire jeu jouer question questions test s amuser distraire connaissances culture '
    + 'gioco giocare quiz domande test divertirsi conoscenze '
    + 'game play questions test fun trivia knowledge how well do you know',
  'region-lieux':
    'baroque unesco patrimoine ville villes village alentour autour visiter visite excursion journee '
    + 'scicli modica raguse ragusa noto syracuse siracusa donnalucata sampieri marina '
    + 'barocco patrimonio citta paese visitare gita dintorni '
    + 'baroque unesco heritage town towns visit day trip nearby around excursion journee visiter eglise cathedrale palais escalier vue point de vue vieille ville centre historique gita visitare chiesa cattedrale palazzo scalinata veduta centro storico day trip visit church cathedral palace stairs view old town historic centre',
  evenements:
    'evenement evenements fete fetes festival festivals feria procession patron sagra concert spectacle '
    + 'programme agenda saison ete quoi faire sortir sortie '
    + 'evento eventi festa feste sagra processione programma stagione estate '
    + 'event events festival celebration procession programme season summer programme date heure lieu billet gratuit famille enfants feu artifice musique danse programma data ora luogo biglietto gratuito bambini fuochi artificio musica ballo programme date time venue ticket free children fireworks music dance',
  culture:
    'musique musiques playlist chanson chansons disque vinyle spotify film films cinema serie montalbano '
    + 'peinture peintre art artiste sculpture photo photographie livre lecture '
    + 'musica canzone disco vinile pittura pittore arte scultura fotografia libro '
    + 'music song record vinyl movie movies painting painter art sculpture photography book ecouter regarder lire voir artiste auteur realisateur album titre morceau serie tournage decor ascoltare guardare leggere autore regista album brano serie riprese listen watch read artist author director album track series filming location',
  meteo: 'meteo temps pluie soleil vent temperature chaud froid previsions tempo pioggia sole vento caldo freddo weather rain sun wind forecast hot cold',
};

const motsMaison = (id: string): string[] => motsDe(MOTS_MAISON[id] ?? '');

/**
 * L'index — tout ce que le site sait dire, reduit a des fiches cherchables.
 *
 * `aujourdhui` est passe en parametre plutot que lu ici : la reponse « ce soir,
 * c'est le verre » depend du jour, et un parametre se teste.
 */
export function construireIndex(t: Dict, lang: Lang, aujourdhui: Date = new Date()): Fiche[] {
  const fiches: Fiche[] = [];
  const ajouter = (f: Omit<Fiche, 'mots'> & { mots?: string[] }) =>
    fiches.push({ ...f, mots: [...new Set(f.mots ?? [])] });

  // ── La maison : electricite, eau, gaz, wifi ──────────────────────────
  t.arrivee.operation.forEach((g) => {
    ajouter({
      id: `op-${g.icon}`,
      page: '/informations-pratiques#arrivee',
      titre: g.title,
      lignes: g.items ?? [],
      mots: motsMaison(`op-${g.icon}`),
    });
  });

  // ── L'adresse ────────────────────────────────────────────────────────
  ajouter({
    id: 'adresse',
    page: '/informations-pratiques#adresse',
    titre: t.arrivee.addressLabel,
    lignes: t.arrivee.address,
    liens: [{ label: t.arrivee.mapsLabel, url: t.arrivee.mapsUrl }],
    mots: motsMaison('adresse'),
  });

  // ── Les deux check-lists ─────────────────────────────────────────────
  ajouter({
    id: 'depart',
    page: '/informations-pratiques#depart',
    titre: t.depart.checklistTitle,
    lignes: t.depart.checklist,
    mots: motsMaison('depart'),
  });
  ajouter({
    id: 'valise',
    page: '/preparer-le-voyage#valise',
    titre: t.prepare.checklistTitle,
    lignes: t.prepare.checklist,
    mots: motsMaison('valise'),
  });

  // ── Preparer le voyage : vols, voiture, aeroport… ────────────────────
  t.prepare.groups.forEach((g, i) => {
    ajouter({
      id: `voyage-${i}`,
      page: '/preparer-le-voyage#groupes',
      titre: g.title,
      lignes: g.items ?? [],
      liens: g.links,
      // Les marques citees en lien comptent aussi : on cherche parfois
      // « Trenitalia » ou « Goldcar » par leur nom.
      mots: [...motsMaison(`voyage-${g.icon}`), ...motsDuTexte((g.links ?? []).map((l) => l.label))],
    });
  });

  // ── Les poubelles ────────────────────────────────────────────────────
  // La seule fiche qui CALCULE quelque chose : quel bac sort ce soir. C'est
  // la question qu'on se pose le plus tard le soir, et la seule ou lire un
  // tableau a sept lignes est une corvee. Les libelles (« Ce soir », les noms
  // des jours) viennent de la page elle-meme, pas d'un formateur de dates :
  // ce sont les mots de Mag, deja traduits.
  const jours = t.wastePage.days;
  const iJour = mondayIndex(aujourdhui);
  const demain = (iJour + 1) % 7;
  ajouter({
    id: 'poubelles',
    page: '/poubelles',
    titre: t.wastePage.title,
    lignes: [
      `${t.wastePage.today} (${jours[iJour]}) — ${WASTE[WEEK[iJour]].label[lang]}.`,
      `${t.wastePage.tomorrow} (${jours[demain]}) — ${WASTE[WEEK[demain]].label[lang]}.`,
      t.wastePage.eveningNote,
      t.wastePage.changeNote,
      ...WEEK.map((k, i) => `${jours[i]} : ${WASTE[k].label[lang]}`),
    ],
    mots: motsMaison('poubelles'),
  });

  // ── Pharmacie, urgences, gaz ─────────────────────────────────────────
  ajouter({
    id: 'pharmacie',
    page: '/informations-pratiques#urgences',
    titre: PHARMACY.name,
    lignes: [PHARMACY.street, PHARMACY.hours[lang]],
    liens: [
      { label: t.localPage.mapLabel, url: PHARMACY.mapsUrl },
      { label: t.movePage.dutyCta, url: PHARMACY.dutyUrl },
    ],
    mots: motsMaison('pharmacie'),
  });
  ajouter({
    id: 'urgences',
    page: '/informations-pratiques#urgences',
    titre: t.movePage.urgencyTitle,
    lignes: [
      `112 — ${t.movePage.nueLabel}`,
      t.movePage.nueNote,
      ...EMERGENCIES.map((e) => `${e.number} — ${e.label[lang]}`),
      t.movePage.urgencyIntro,
    ],
    mots: motsMaison('urgences'),
  });
  // Se garer. Les couleurs au sol sont la premiere chose qu'on affronte en
  // arrivant avec une voiture de location, et le site n'en disait rien.
  ajouter({
    id: 'argent',
    page: '/informations-pratiques#argent',
    titre: t.cashPage.title,
    lignes: [...t.cashPage.spots.map((x) => `${x.title} — ${x.where}. ${x.text}`), t.cashPage.note],
    liens: t.cashPage.spots.map((x) => ({ label: `${x.title} — ${x.label}`, url: x.url })),
    mots: motsMaison('argent'),
  });

  ajouter({
    id: 'parking',
    page: '/informations-pratiques#parking',
    titre: t.parkingPage.title,
    lignes: [...t.parkingPage.facts.map((f) => `${f.title} — ${f.text}`), t.parkingPage.note, `${t.parkingPage.gardien.title} — ${t.parkingPage.gardien.text}`],
    mots: motsMaison('parking'),
  });
  // Le plombier. Il etait ecrit sur la page et introuvable ici : « un
  // plombier » ne rendait rien. C'est pourtant le genre de question qu'on pose
  // en catastrophe, un dimanche.
  ajouter({
    id: 'plombier',
    page: '/informations-pratiques#urgences',
    titre: t.movePage.plumberTitle,
    lignes: [t.movePage.plumberDesc],
    mots: motsMaison('plombier'),
  });
  ajouter({
    id: 'gaz',
    page: '/informations-pratiques#urgences',
    titre: GAS.name,
    lignes: [GAS.street, t.movePage.gasDesc],
    liens: [{ label: t.localPage.mapLabel, url: GAS.mapsUrl }],
    mots: motsMaison('gaz'),
  });

  // ── Se deplacer : bus, aeroport ──────────────────────────────────────
  TRANSPORTS.forEach((tr) => {
    ajouter({
      id: `transport-${tr.id}`,
      page: '/informations-pratiques#bouger',
      titre: tr.name,
      lignes: [tr.blurb[lang]],
      mots: motsMaison(`transport-${tr.id}`),
      liens: [
        { label: tr.name, url: tr.url },
        ...(tr.appUrl && tr.appLabel ? [{ label: tr.appLabel, url: tr.appUrl }] : []),
      ],
    });
  });

  // ── Le calendrier et l'arbre : on renvoie a la page, elle seule sait ──
  ajouter({
    id: 'calendrier',
    page: '/calendrier',
    titre: t.stayPage.title,
    lignes: [t.stayPage.intro],
    mots: motsMaison('calendrier'),
  });
  ajouter({
    id: 'famille',
    page: '/famille#arbre',
    titre: t.salvaPage.treeTitle,
    lignes: [t.salvaPage.treeNote],
    mots: motsMaison('famille'),
  });

  // ── La region ────────────────────────────────────────────────────────
  //
  // Toute cette moitie du site etait invisible : « l'Etna », « les vins du
  // coin », « la Sicile arabe » ne rendaient rien, alors que Mag a ecrit des
  // pages entieres dessus. Elles sont pourtant faites du meme materiau que le
  // reste — un chapeau, une intro, des faits — et s'indexent donc pareil.
  //
  // Chaque section garde son fragment : la page « La region » n'en affiche
  // qu'une a la fois, comme les infos pratiques.
  const sections: { id: string; ancre: string; bloc: { eyebrow: string; title: string; intro: string; facts: { title: string; text: string }[] } }[] = [
    { id: 'etna', ancre: 'etna', bloc: t.etnaPage },
    { id: 'arabe', ancre: 'arabe', bloc: t.arabPage },
    { id: 'coutumes', ancre: 'coutumes', bloc: t.tastePage },
    { id: 'specialites', ancre: 'specialites', bloc: t.specialtiesPage },
    { id: 'alcools', ancre: 'alcools', bloc: t.drinksPage },
    { id: 'cafe', ancre: 'cafe', bloc: t.coffeePage },
  ];
  sections.forEach(({ id, ancre, bloc }) => {
    ajouter({
      id: `region-${id}`,
      page: `/la-region#${ancre}`,
      titre: bloc.title,
      // L'intro d'abord : c'est elle qui repond a « c'est quoi ? ». Les faits
      // suivent, et se font couper les premiers quand la place manque.
      lignes: [bloc.intro, ...bloc.facts.map((f) => `${f.title} — ${f.text}`)],
      mots: motsMaison(`region-${id}`),
    });
  });

  // « Les lieux autour de nous » — Scicli, Modica, Raguse, Noto, Syracuse.
  // C'est la que vit le baroque, et « le baroque » ne rendait rien.
  ajouter({
    id: 'region-lieux',
    page: '/la-region#lieux',
    titre: t.placesTitle,
    lignes: [t.placesIntro, ...t.regionPlaces.slice(0, 4)],
    mots: motsMaison('region-lieux'),
  });

  // Le quiz. Mag a tape « quizz » : rien. Rien du tout — ni pastille, ni aveu.
  // Un jeu qu'on ne trouve pas n'existe pas.
  ajouter({
    id: 'quiz',
    page: '/la-region#quiz',
    titre: t.quizPage.title,
    lignes: [t.quizPage.intro],
    mots: motsMaison('quiz'),
  });

  // Les evenements et les fetes : une page a elle seule, jamais indexee.
  ajouter({
    id: 'evenements',
    page: '/evenements',
    titre: t.calendarPage.title,
    lignes: [t.calendarPage.intro, t.calendarPage.festivalsTitle, ...t.calendarPage.festivalDescs],
    mots: motsMaison('evenements'),
  });

  // Sons & images : la playlist, les films, la peinture. Le picto vinyle de la
  // barre du haut y mene deja ; encore fallait-il pouvoir le demander.
  ajouter({
    id: 'culture',
    page: '/la-region#playlist',
    titre: t.culturePage.title,
    lignes: [t.culturePage.intro, t.culturePage.playlistDesc, t.culturePage.artistsIntro],
    mots: motsMaison('culture'),
  });

  // ── Les rayons de « Nos adresses » ───────────────────────────────────
  //
  // Un mot LARGE mene au rayon, un mot PRECIS mene a l'adresse. Mag l'avait
  // demande pour les pastilles — « le nom des lieux, je ne suis pas certaine ;
  // plutot diriger vers le bouton qui coincide » — et ca vaut autant pour les
  // reponses : elle a tape « pomme » et obtenu le Despar de Sampieri, alors
  // qu'il y a deux epiceries dans le village. Une enseigne prise au hasard
  // parmi six repond moins bien que le rayon, ou l'on choisit par distance.
  //
  // Les mots precis, eux, gardent leur adresse : « pizza » rend toujours la
  // pizzeria, « chocolat » la dolceria — ce sont des envies a UNE adresse.
  const rayons = new Map<CatKey, string[]>();
  LOCAL_PLACES.forEach((l) => {
    [l.cat, ...(l.aussi ?? [])].forEach((c) => {
      if (!rayons.has(c)) rayons.set(c, []);
    });
  });
  rayons.forEach((_, cle) => {
    const larges = SEARCH_WORDS.filter((h) => h.cat === cle).flatMap((h) => h.words.flatMap(motsDe));
    const combien = LOCAL_PLACES.filter((l) => l.cat === cle || l.aussi?.includes(cle)).length;
    ajouter({
      id: `rayon-${cle}`,
      page: `/services-locaux#${cle}`,
      titre: CATS[cle].label[lang],
      // AUCUN texte : la fiche d'un rayon n'a rien a raconter, elle a un
      // chemin a donner. Elle portait l'intro de la page « Nos adresses » —
      // un paragraphe entier, qui gonflait la carte, declenchait le
      // resserrement, et faisait donc disparaitre la rangee « Aussi » ou
      // l'autre rayon devait s'afficher. Titre + bouton suffisent.
      lignes: [],
      liens: [],
      mots: [...larges, ...motsDuTexte([CATS[cle].label[lang]])],
      // Un rayon d'une seule adresse n'a pas d'interet a s'interposer : on
      // laisse alors l'adresse repondre directement.
      motsPrecis: combien <= 1 ? [] : undefined,
    });
  });

  // ── Nos adresses ─────────────────────────────────────────────────────
  RAYON_DU_LIEU.clear();
  LOCAL_PLACES.forEach((l) => {
    const cats = [l.cat, ...(l.aussi ?? [])];
    const syn = synonymesDuLieu(l.id, l.cat, l.aussi);
    RAYON_DU_LIEU.set(`lieu-${l.id}`, { cle: l.cat, label: CATS[l.cat].label[lang] });
    ajouter({
      id: `lieu-${l.id}`,
      page: '/services-locaux',
      titre: l.name,
      lignes: [`${l.town} · ${cats.map((c) => CATS[c].label[lang]).join(' · ')}`, l.blurb[lang]],
      liens: [
        { label: t.localPage.mapLabel, url: l.url },
        ...(l.site ? [{ label: t.localPage.siteLabel, url: l.site }] : []),
      ],
      motsPrecis: syn.precis,
      expressions: syn.expressions,
      // PLUS les mots larges : ils appartiennent au rayon (voir plus haut).
      // Restent le nom, la ville, et les envies qui visent cette adresse-la.
      mots: motsDe(l.town),
    });
  });

  return fiches;
}

// ── Le classement ───────────────────────────────────────────────────────
// Trois niveaux de preuve, du plus sur au plus faible : un mot-clef choisi,
// un mot du titre, un mot du corps. Un mot du corps ne peut PAS, a lui seul,
// declencher une reponse — c'est ce qui permet de se taire.
/**
 * Un mot que Mag a rattache a UNE adresse bat toujours un rayon.
 *
 * Il valait 10, autant qu'un mot-clef rare de rayon — et depuis que les fiches
 * de rayon n'ont plus de texte, elles gagnaient les egalites en etant les plus
 * courtes : « du pain » repondait « Supermarches » au lieu de la Gastronomia
 * Giannone, que Mag avait pourtant designee expressement. A 12, le choix
 * explicite l'emporte, ce qui est la moindre des choses.
 */
const POIDS_PRECIS = 12;
const POIDS_TITRE_MOT = 7;
const POIDS_RACINE = 5;
const POIDS_TITRE_BOUT = 4;
const POIDS_TEXTE_MOT = 2;
const POIDS_TEXTE_BOUT = 1;
/** Longueur de racine commune qui vaut un mot : « baigner » doit trouver
 *  « baignade », « poubelles » doit trouver « poubelle ». */
const RACINE = 5;
/** En dessous, on se tait. Un mot-clef choisi ou un mot du titre franchit la
 *  barre ; deux mots croises dans un paragraphe, non. */
const SEUIL = 5;

export type Reponse = { fiche: Fiche; score: number };

/**
 * Ce que vaut un mot-clef : d'autant plus qu'il designe peu de fiches.
 *
 * « pizza » ne pointe qu'un endroit, « plage » en pointe huit. Sans cela, une
 * question precise se noyait dans une categorie entiere : « du pain » — dont
 * Mag a pourtant liste l'adresse exacte — rendait le premier supermarche venu.
 */
/**
 * Les mots qui sont deux choses a la fois.
 *
 * « marche » est un nom (le marche de Scicli) ET un verbe (« ca ne marche
 * pas »). Il ne peut donc pas peser autant qu'un mot qui ne designe qu'une
 * chose. J'ai d'abord essaye l'inverse — semer « marche » dans les fiches de
 * panne — et casse le marche : les six fiches se valaient, la plus courte
 * gagnait, et « ou est le marche » repondait « Electricite ».
 *
 * Plafonnes au seuil, ces mots suffisent SEULS a repondre (« ou est le
 * marche » rend bien le marche) mais s'effacent des qu'un mot franc les
 * accompagne (« le wifi ne marche pas » rend le wifi).
 */
const MOTS_AMBIGUS = new Set(['marche', 'marcher', 'sortie', 'passe', 'passage', 'coin', 'point']);

const poidsDesMots = (index: Fiche[]): Map<string, number> => {
  const combien = new Map<string, number>();
  for (const f of index) for (const m of new Set(f.mots)) combien.set(m, (combien.get(m) ?? 0) + 1);
  const poids = new Map<string, number>();
  for (const [m, n] of combien) {
    if (MOTS_AMBIGUS.has(m)) poids.set(m, SEUIL);
    else poids.set(m, n === 1 ? 10 : n <= 3 ? 8 : 6);
  }
  return poids;
};

const memeRacine = (a: string, b: string) => {
  if (a.length < RACINE || b.length < RACINE) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i >= RACINE;
};

const scorer = (
  fiche: Fiche,
  mots: string[],
  poids: Map<string, number>,
): { score: number; couverts: number } => {
  const motsDuTitre = new Set(motsDe(fiche.titre));
  const titre = norm(fiche.titre);
  const motsDuCorps = new Set(motsDe(fiche.lignes.join(' ')));
  const corps = norm(fiche.lignes.join(' '));
  let score = 0;
  let couverts = 0;

  // Une expression vaut autant qu'un mot precis, mais seulement en entier :
  // « fruits de mer » compte si les deux mots sont la, « fruits » seul non.
  for (const exp of fiche.expressions ?? []) {
    if (exp.length && exp.every((m) => mots.includes(m))) {
      score += POIDS_PRECIS;
      couverts += exp.length;
    }
  }

  for (const m of mots) {
    let meilleur = 0;
    /*
     * Un mot ambigu ne vaut QUE s'il tombe juste.
     *
     * « quel jour le marche » rendait Cavagrande del Cassibile : sa fiche
     * porte « marcher » (c'est une randonnee), qui ressemble assez a
     * « marche » pour marquer des points, et sa description contient
     * « journee ». Deux a-peu-pres battaient une correspondance exacte.
     * Sur ces mots-la, on ignore donc les racines et le corps du texte : ou
     * bien le mot est celui de la fiche, ou bien il ne compte pas.
     */
    if (MOTS_AMBIGUS.has(m)) {
      if (fiche.mots.includes(m) || motsDuTitre.has(m)) {
        meilleur = SEUIL;
        couverts++;
        score += meilleur;
      }
      continue;
    }
    if (fiche.motsPrecis?.includes(m)) meilleur = POIDS_PRECIS;
    if (meilleur < POIDS_TITRE_MOT && fiche.mots.includes(m)) meilleur = poids.get(m) ?? 8;
    if (meilleur < POIDS_TITRE_MOT && motsDuTitre.has(m)) meilleur = POIDS_TITRE_MOT;
    if (meilleur < POIDS_RACINE && [...fiche.mots, ...(fiche.motsPrecis ?? [])].some((k) => memeRacine(k, m)))
      meilleur = POIDS_RACINE;
    if (meilleur < POIDS_TITRE_BOUT && titre.includes(m)) meilleur = POIDS_TITRE_BOUT;
    if (meilleur < POIDS_TEXTE_MOT && motsDuCorps.has(m)) meilleur = POIDS_TEXTE_MOT;
    if (meilleur < POIDS_TEXTE_BOUT && corps.includes(m)) meilleur = POIDS_TEXTE_BOUT;
    if (meilleur > 0) couverts++;
    score += meilleur;
  }
  return { score, couverts };
};

/**
 * Chercher. Rend les fiches classees, ou une liste vide si rien ne convient
 * assez — cas ou l'interface doit avouer et renvoyer vers Mag.
 */
export function chercher(question: string, index: Fiche[], max = 4): Reponse[] {
  const mots = motsDe(question);
  if (!mots.length) return [];
  const poids = poidsDesMots(index);

  return index
    .map((fiche) => {
      const { score, couverts } = scorer(fiche, mots, poids);
      // Une question de plusieurs mots dont un seul touche, c'est souvent un
      // hasard : on exige la moitie des mots des que la question s'allonge.
      const assez = mots.length <= 2 ? couverts >= 1 : couverts >= Math.ceil(mots.length / 2);
      return { fiche, score: assez ? score : 0, couverts };
    })
    .filter((r) => r.score >= SEUIL)
    /*
     * On classe par FORCE, et le nombre de mots touches ne fait que departager.
     *
     * L'inverse a ete essaye : compter d'abord les mots couverts. « Quel jour
     * le marche » repondait alors Cavagrande del Cassibile — sa description
     * contient « journee » (qui contient « jour ») et « marcher » ressemble a
     * « marche », deux miettes qui battaient le marche de Scicli, lequel ne
     * touchait qu'un mot mais le bon. Deux correspondances faibles ne valent
     * pas une forte ; le score, lui, sait deja la difference.
     */
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.couverts - a.couverts ||
        a.fiche.lignes.join(' ').length - b.fiche.lignes.join(' ').length,
    )
    .slice(0, max);
}

// ── Ce qu'on propose PENDANT qu'on tape ──────────────────────────────────

export type Proposition = {
  /** La fiche a ouvrir dans la boite. Vide si la pastille est un lien. */
  id: string;
  label: string;
  /** Une page a ouvrir, quand la pastille vise un rayon plutot qu'une fiche. */
  href?: string;
};

/**
 * Les pastilles qui suivent la frappe, lettre par lettre.
 *
 * Elles etaient huit, ecrites d'avance, et ne bougeaient pas : taper « g » ne
 * changeait rien a l'ecran. Mag l'a vu tout de suite — « il faudrait que tu
 * anticipes pour chaque frappe ».
 *
 * Elles sortent donc de l'index lui-meme : « g » propose Gaz, la Gastronomia
 * Giannone, la Gelateria. Rien n'est ecrit d'avance, tout vient de ce que le
 * site contient deja — et le jour ou Mag ajoute une adresse, elle apparait ici
 * sans que personne n'y pense.
 *
 * On regarde le DERNIER mot tape, pas la phrase entiere : on cherche pendant
 * qu'on ecrit, et c'est le mot en cours qui dit ce qu'on vise. « une pi »
 * propose donc la pizzeria, ce que « une pi » en entier n'aurait pas trouve.
 *
 * LES ADRESSES NE SE PROPOSENT PAS PAR LEUR NOM. Mag : « le nom des lieux, je
 * ne suis pas certaine ; plutot diriger vers le bouton qui coincide, comme
 * manger et boire ». Elle a raison — personne ne cherche « Baqqala » ou
 * « Prosit Sicilian Bistrot », on cherche a manger. Une adresse trouvee rend
 * donc son RAYON, une seule fois, et la pastille mene a la page des adresses
 * ouverte sur ce bouton. Les fiches de la maison, elles, gardent leur nom :
 * « Gaz », « Plombier », « Wifi » sont exactement les mots qu'on tape.
 */
/**
 * Quel bouton de « Nos adresses » ouvre chaque lieu. Rempli en meme temps que
 * l'index, dans la langue lue — le libelle affiche doit etre celui du bouton.
 */
const RAYON_DU_LIEU = new Map<string, { cle: CatKey; label: string }>();

export function proposer(saisie: string, index: Fiche[], max = 6): Proposition[] {
  const brut = norm(saisie).replace(/[^a-z0-9]+/g, ' ').trim();
  if (!brut) return [];
  const bouts = brut.split(' ');
  const prefixe = bouts[bouts.length - 1];
  if (prefixe.length < 1) return [];
  // Les mots pleins deja tapes : ils affinent, sans etre obligatoires.
  const avant = motsDe(bouts.slice(0, -1).join(' '));

  const notees = index
    .map((f) => {
      const titre = norm(f.titre);
      const motsTitre = motsDe(f.titre);
      let note = 0;
      if (titre.startsWith(prefixe)) note = 10;
      else if (motsTitre.some((m) => m.startsWith(prefixe))) note = 8;
      else if ([...f.mots, ...(f.motsPrecis ?? [])].some((m) => m.startsWith(prefixe))) note = 6;
      else if (titre.includes(prefixe)) note = 3;
      if (!note) return null;
      // Un mot deja tape qui retombe sur la meme fiche la fait remonter.
      if (avant.some((m) => f.mots.includes(m) || f.motsPrecis?.includes(m) || motsTitre.includes(m))) note += 4;
      return { f, note };
    })
    .filter((x): x is { f: Fiche; note: number } => x !== null)
    .sort((a, b) => b.note - a.note || a.f.titre.length - b.f.titre.length);

  const vus = new Set<string>();
  const sorties: Proposition[] = [];
  for (const { f } of notees) {
    const rayon = RAYON_DU_LIEU.get(f.id);
    const cle = rayon ? `rayon:${rayon.cle}` : `fiche:${f.titre}`;
    if (vus.has(cle)) continue;
    vus.add(cle);
    sorties.push(
      rayon
        ? { id: '', label: rayon.label, href: `/services-locaux#${rayon.cle}` }
        : { id: f.id, label: f.titre },
    );
    if (sorties.length >= max) break;
  }
  return sorties;
}
