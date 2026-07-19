import type { IconName } from './Icon';
import type { Lang } from './localData';

// ────────────────────────────────────────────────────────────────────────
// LE COURS D'ITALIEN — les données.
//
// Mag : « fais un cours d'italien génial avec le passé, le présent et le
// futur, listé par catégorie, et fais des exercices. Je veux que tout le
// monde apprenne, et sur notre site. »
//
// LA METHODE, et pourquoi celle-la. On s'appuie sur le principe d'Assimil,
// la reference francaise des methodes qui marchent : des lecons COURTES, des
// PHRASES ENTIERES qu'on peut resservir telles quelles, et la grammaire qui
// arrive apres — pour expliquer ce qu'on dit deja, pas avant de savoir le
// dire. On y ajoute ce que le cadre europeen (CECRL) appelle le niveau A1-A2 :
// se debrouiller dans les situations de la vie courante.
//
// D'ou l'ordre de la page : prononcer, puis parler par situation, puis
// comprendre les trois temps, puis s'entrainer.
//
// L'ITALIEN ENSEIGNE NE VIT QU'UNE FOIS. C'est tout l'interet de ce fichier
// separe : la phrase italienne est ecrite ICI, une seule fois, et les trois
// langues du site ne traduisent que l'explication. Si les phrases vivaient
// dans i18n.tsx, il y en aurait trois copies — et le jour ou l'une derive,
// on enseigne deux italiens differents selon la langue du lecteur.
//
// LA PRONONCIATION est notee par l'ACCENT TONIQUE, en majuscules, et non par
// une transcription a la francaise. « tchao » aide un Francais et egare un
// Anglais ; « CIAO » avec la syllabe forte marquee aide tout le monde. Les
// regles de lecture, elles, sont expliquees en toutes lettres plus bas —
// c'est la, et seulement la, qu'on a besoin de la langue du lecteur.
// ────────────────────────────────────────────────────────────────────────

export type Texte = Record<Lang, string>;

/** Une phrase a dire. `it` est la seule verite ; le reste explique. */
export type Phrase = {
  it: string;
  /** Syllabes, accent tonique en majuscules. Neutre pour les 3 langues. */
  pron: string;
  sens: Texte;
  /** Le petit mot qui evite la gaffe — facultatif. */
  note?: Texte;
};

export type Lecon = {
  id: string;
  icon: IconName;
  titre: Texte;
  intro: Texte;
  phrases: Phrase[];
};

/* ── 1. Prononcer ─────────────────────────────────────────────────────
 * Huit regles, et on lit l'italien. C'est la vraie porte d'entree : la
 * grammaire attendra, mais quelqu'un qui prononce « tchi » au lieu de « ki »
 * pour « chi » ne sera pas compris, meme avec le bon mot.
 */
export type Regle = { regle: Texte; exemples: { it: string; pron: string }[] };

export const PRONONCIATION: Regle[] = [
  {
    regle: {
      fr: 'C et G se ramollissent devant E et I. « ce, ci » se disent tch ; « ge, gi » se disent dj. Devant A, O, U, ils restent durs.',
      it: 'C e G si addolciscono davanti a E e I; davanti ad A, O, U restano dure. È la regola che spiega quasi tutto il resto.',
      en: 'C and G soften before E and I: “ce, ci” sound like ch in church, “ge, gi” like j in jam. Before A, O, U they stay hard.',
    },
    exemples: [
      { it: 'ciao', pron: 'CIAO' },
      { it: 'gelato', pron: 'ge·LA·to' },
      { it: 'casa', pron: 'CA·sa' },
    ],
  },
  {
    regle: {
      fr: 'Un H glissé après C ou G les redurcit. C’est à ça que sert le H en italien : il ne se prononce jamais, il protège la consonne.',
      it: 'La H dopo C o G le rende di nuovo dure. In italiano la H non si pronuncia mai: serve solo a questo.',
      en: 'An H after C or G makes them hard again. That is all H does in Italian — it is never pronounced itself.',
    },
    exemples: [
      { it: 'chi', pron: 'KI' },
      { it: 'spaghetti', pron: 'spa·GHET·ti' },
      { it: 'chiuso', pron: 'KIU·so' },
    ],
  },
  {
    regle: {
      fr: 'GN se dit comme dans « agneau ». GLI se dit comme le « ill » de « famille ».',
      it: 'GN come in « agnello », GLI come in « famiglia ». Due suoni che gli stranieri sbagliano spesso.',
      en: 'GN sounds like the ni in onion. GLI sounds like the lli in million.',
    },
    exemples: [
      { it: 'bagno', pron: 'BA·gno' },
      { it: 'aglio', pron: 'A·glio' },
      { it: 'famiglia', pron: 'fa·MI·glia' },
    ],
  },
  {
    regle: {
      fr: 'SC devant E ou I se dit ch, comme dans « chat ». Devant A, O, U, il se dit sk.',
      it: 'SC davanti a E o I si legge come in « pesce »; davanti ad A, O, U si legge sk.',
      en: 'SC before E or I sounds like sh in ship. Before A, O, U it sounds like sk.',
    },
    exemples: [
      { it: 'pesce', pron: 'PE·sce' },
      { it: 'Scicli', pron: 'SCI·cli' },
      { it: 'scuola', pron: 'SCUO·la' },
    ],
  },
  {
    regle: {
      fr: 'Les doubles consonnes s’entendent : on tient la consonne. C’est le détail qui trahit le plus les étrangers — et parfois ça change le mot.',
      it: 'Le doppie si sentono davvero: si tiene la consonante. È il dettaglio che tradisce di più gli stranieri.',
      en: 'Double consonants are actually held longer. It is the single most audible giveaway for foreigners — and sometimes it changes the word.',
    },
    exemples: [
      { it: 'nonno / nono', pron: 'NON·no / NO·no' },
      { it: 'pizza', pron: 'PIZ·za' },
      { it: 'anno / ano', pron: 'AN·no / A·no' },
    ],
  },
  {
    regle: {
      fr: 'Toutes les voyelles se prononcent, y compris à la fin. Pas de voyelle avalée, pas de nasale : « pane » fait deux syllabes bien nettes.',
      it: 'Tutte le vocali si pronunciano, anche l’ultima. Niente nasali: « pane » sono due sillabe piene.',
      en: 'Every vowel is pronounced, including the final one. No nasal vowels, nothing swallowed: “pane” is two clear syllables.',
    },
    exemples: [
      { it: 'pane', pron: 'PA·ne' },
      { it: 'buonasera', pron: 'buo·na·SE·ra' },
      { it: 'grazie', pron: 'GRA·zie' },
    ],
  },
  {
    regle: {
      fr: 'L’accent tombe presque toujours sur l’avant-dernière syllabe. Quand il tombe sur la dernière, c’est écrit : caffè, città, perché.',
      it: 'L’accento cade quasi sempre sulla penultima sillaba. Quando cade sull’ultima, è scritto: caffè, città, perché.',
      en: 'The stress almost always falls on the second-to-last syllable. When it falls on the last one, it is written: caffè, città, perché.',
    },
    exemples: [
      { it: 'caffè', pron: 'caf·FÈ' },
      { it: 'città', pron: 'cit·TÀ' },
      { it: 'tavolo', pron: 'TA·vo·lo' },
    ],
  },
  {
    regle: {
      fr: 'Le Z se dit ts ou dz selon les mots — les Siciliens tirent vers le ts. Et le R se roule, sans excès : un simple battement de langue suffit.',
      it: 'La Z si legge ts o dz secondo le parole; in Sicilia tira verso il ts. La R si arrotola, ma basta un colpo di lingua.',
      en: 'Z sounds like ts or dz depending on the word — Sicilians lean towards ts. R is rolled, but lightly: one flick of the tongue is enough.',
    },
    exemples: [
      { it: 'grazie', pron: 'GRA·tsie' },
      { it: 'zucchero', pron: 'TSUC·che·ro' },
      { it: 'arancina', pron: 'a·ran·CI·na' },
    ],
  },
];

/* ── 2. Parler, par situation ─────────────────────────────────────────
 * Des phrases entieres, pas des mots isoles : on ne commande pas un cafe
 * avec le mot « cafe », on le commande avec une phrase. Chacune est choisie
 * pour resservir telle quelle, et beaucoup renvoient a ce que le site
 * raconte deja — le caffe corretto, l'arancina, le marche du mardi.
 */
export const LECONS: Lecon[] = [
  {
    id: 'indispensables',
    icon: 'sun',
    titre: { fr: 'Les indispensables', it: 'L’indispensabile', en: 'The essentials' },
    intro: {
      fr: 'Dix phrases et vous êtes poli partout. En Sicile, on salue en entrant dans un commerce — ne pas le faire est la seule vraie impolitesse.',
      it: 'Dieci frasi e si è educati ovunque. In Sicilia si saluta entrando in un negozio: non farlo è la vera scortesia.',
      en: 'Ten phrases and you are polite anywhere. In Sicily you greet people when you walk into a shop — not doing it is the one real rudeness.',
    },
    phrases: [
      { it: 'Buongiorno', pron: 'buon·GIOR·no', sens: { fr: 'Bonjour (jusqu’en début d’après-midi)', it: 'Saluto del mattino', en: 'Good morning / hello (until early afternoon)' } },
      { it: 'Buonasera', pron: 'buo·na·SE·ra', sens: { fr: 'Bonsoir — dès le milieu de l’après-midi', it: 'Saluto del pomeriggio e della sera', en: 'Good evening — from mid-afternoon onwards' },
        note: { fr: 'On passe à buonasera bien plus tôt qu’en France : vers 16 h, parfois avant.', it: 'Si passa a buonasera prima di quanto pensino gli stranieri.', en: 'Italians switch to buonasera much earlier than you would expect — around 4 pm.' } },
      { it: 'Per favore', pron: 'per fa·VO·re', sens: { fr: 'S’il vous plaît', it: 'Per cortesia', en: 'Please' } },
      { it: 'Grazie mille', pron: 'GRA·zie MIL·le', sens: { fr: 'Merci beaucoup', it: 'Ringraziamento', en: 'Thank you very much' } },
      { it: 'Mi scusi', pron: 'mi SCU·si', sens: { fr: 'Excusez-moi (à quelqu’un qu’on vouvoie)', it: 'Formula di scusa, forma di cortesia', en: 'Excuse me (polite form)' },
        note: { fr: 'Entre amis ou à un enfant : scusa.', it: 'Con amici o bambini: scusa.', en: 'With friends or children: scusa.' } },
      { it: 'Non parlo italiano, parlo francese', pron: 'non PAR·lo i·ta·LIA·no', sens: { fr: 'Je ne parle pas italien, je parle français', it: 'Per dichiarare la propria lingua', en: 'I do not speak Italian, I speak French' } },
      { it: 'Può ripetere più lentamente?', pron: 'può ri·PE·te·re più len·ta·MEN·te', sens: { fr: 'Pouvez-vous répéter plus lentement ?', it: 'Per far ripetere', en: 'Could you repeat that more slowly?' },
        note: { fr: 'La phrase la plus utile du cours. Apprenez-la par cœur.', it: 'La frase più utile in assoluto.', en: 'The single most useful sentence here. Learn it by heart.' } },
    ],
  },
  {
    id: 'bar',
    icon: 'droplet',
    titre: { fr: 'Au bar', it: 'Al bar', en: 'At the bar' },
    intro: {
      fr: 'On commande debout, on boit en trente secondes, on paie et on repart. Voir « Le café, tout un rituel » sur la page La région.',
      it: 'Si ordina in piedi, si beve in trenta secondi, si paga e si va. Vedi « Il caffè, tutto un rito ».',
      en: 'You order standing, drink it in thirty seconds, pay and leave. See “Coffee, a whole ritual” on the region page.',
    },
    phrases: [
      { it: 'Un caffè, per favore', pron: 'un caf·FÈ per fa·VO·re', sens: { fr: 'Un café, s’il vous plaît — c’est-à-dire un espresso', it: 'Un espresso', en: 'A coffee, please — meaning an espresso' } },
      { it: 'Un cappuccino e una brioche', pron: 'un cap·puc·CI·no e u·na bri·OCHE', sens: { fr: 'Un cappuccino et une brioche', it: 'Colazione classica', en: 'A cappuccino and a brioche' },
        note: { fr: 'Le cappuccino, c’est le matin. Jamais après un repas.', it: 'Il cappuccino è di mattina, mai dopo i pasti.', en: 'Cappuccino is a morning thing. Never after a meal.' } },
      { it: 'Una granita al limone con la brioche', pron: 'u·na gra·NI·ta al li·MO·ne', sens: { fr: 'Une granita au citron avec la brioche', it: 'La colazione d’estate', en: 'A lemon granita with the brioche' } },
      { it: 'Vorrei un’acqua naturale', pron: 'vor·REI un ACQUA na·tu·RA·le', sens: { fr: 'Je voudrais une eau plate', it: 'Acqua senza bollicine', en: 'I would like a still water' },
        note: { fr: 'Gazeuse : frizzante. Vorrei est plus poli que voglio (« je veux »).', it: 'Gassata: frizzante. « Vorrei » è più educato di « voglio ».', en: 'Sparkling: frizzante. Vorrei is politer than voglio (“I want”).' } },
      { it: 'Quant’è?', pron: 'quan·TÈ', sens: { fr: 'Ça fait combien ?', it: 'Per chiedere il conto al banco', en: 'How much is it?' } },
      { it: 'Posso pagare con la carta?', pron: 'POS·so pa·GA·re con la CAR·ta', sens: { fr: 'Je peux payer par carte ?', it: 'Per pagare senza contanti', en: 'Can I pay by card?' } },
      { it: 'Il conto, per favore', pron: 'il CON·to per fa·VO·re', sens: { fr: 'L’addition, s’il vous plaît', it: 'A tavola, per chiudere', en: 'The bill, please' } },
    ],
  },
  {
    id: 'marche',
    icon: 'bag',
    titre: { fr: 'Au marché et dans les magasins', it: 'Al mercato e nei negozi', en: 'At the market and in shops' },
    intro: {
      fr: 'Le marché du mardi à Scicli, le marché paysan du vendredi, l’épicerie du village. On demande, on goûte, on paie en liquide.',
      it: 'Il mercato del martedì a Scicli, quello contadino del venerdì, il market del paese. Si chiede, si assaggia, si paga in contanti.',
      en: 'Tuesday market in Scicli, Friday farmers’ market, the village grocery. You ask, you taste, you pay cash.',
    },
    phrases: [
      { it: 'Quanto costa?', pron: 'QUAN·to CO·sta', sens: { fr: 'Combien ça coûte ?', it: 'Il prezzo di una cosa', en: 'How much does it cost?' } },
      { it: 'Un chilo di pomodori, per favore', pron: 'un CHI·lo di po·mo·DO·ri', sens: { fr: 'Un kilo de tomates, s’il vous plaît', it: 'Per comprare a peso', en: 'A kilo of tomatoes, please' },
        note: { fr: 'Un demi-kilo : mezzo chilo. Deux cents grammes : due etti.', it: 'Mezzo chilo, due etti.', en: 'Half a kilo: mezzo chilo. Two hundred grams: due etti.' } },
      { it: 'Ne vorrei un po’ di più', pron: 'ne vor·REI un po di PIÙ', sens: { fr: 'J’en voudrais un peu plus', it: 'Per aggiustare la quantità', en: 'I would like a little more' } },
      { it: 'Basta così, grazie', pron: 'BA·sta co·SÌ GRA·zie', sens: { fr: 'Ça ira comme ça, merci', it: 'Per fermare la quantità', en: 'That is enough, thank you' } },
      { it: 'È di stagione?', pron: 'è di sta·GIO·ne', sens: { fr: 'C’est de saison ?', it: 'Domanda che fa piacere al produttore', en: 'Is it in season?' },
        note: { fr: 'Question qui ouvre la conversation : on vous expliquera tout.', it: 'Apre la conversazione: vi spiegheranno tutto.', en: 'This one opens a conversation — you will get the whole story.' } },
      { it: 'Avete del pane?', pron: 'a·VE·te del PA·ne', sens: { fr: 'Vous avez du pain ?', it: 'Per chiedere se c’è', en: 'Do you have any bread?' } },
      { it: 'A che ora chiudete?', pron: 'a che O·ra chiu·DE·te', sens: { fr: 'Vous fermez à quelle heure ?', it: 'Orari di chiusura', en: 'What time do you close?' } },
    ],
  },
  {
    id: 'table',
    icon: 'fork',
    titre: { fr: 'À table', it: 'A tavola', en: 'At the table' },
    intro: {
      fr: 'Au restaurant comme à la pizzeria. Le service est compris ; le coperto, lui, se paie et s’affiche.',
      it: 'Al ristorante come in pizzeria. Il servizio è compreso; il coperto si paga ed è indicato.',
      en: 'In restaurants and pizzerias alike. Service is included; the coperto is a cover charge and is always posted.',
    },
    phrases: [
      { it: 'Un tavolo per quattro, per favore', pron: 'un TA·vo·lo per QUAT·tro', sens: { fr: 'Une table pour quatre, s’il vous plaît', it: 'Per farsi accomodare', en: 'A table for four, please' } },
      { it: 'Che cosa mi consiglia?', pron: 'che CO·sa mi con·SI·glia', sens: { fr: 'Qu’est-ce que vous me conseillez ?', it: 'Per farsi consigliare', en: 'What would you recommend?' },
        note: { fr: 'La meilleure question du repas : on mange toujours mieux ensuite.', it: 'La domanda migliore: si mangia sempre meglio dopo.', en: 'The best question of the meal — you always eat better afterwards.' } },
      { it: 'Sono allergico ai crostacei', pron: 'SO·no al·LER·gi·co ai cro·STA·cei', sens: { fr: 'Je suis allergique aux crustacés', it: 'Allergia da segnalare', en: 'I am allergic to shellfish' },
        note: { fr: 'Une femme dit allergica. Aux fruits à coque : alla frutta secca.', it: 'Al femminile: allergica.', en: 'A woman says allergica. To nuts: alla frutta secca.' } },
      { it: 'Per me la pasta con le sarde', pron: 'per me la PA·sta con le SAR·de', sens: { fr: 'Pour moi, les pâtes aux sardines', it: 'Per ordinare il proprio piatto', en: 'For me, the pasta with sardines' } },
      { it: 'È piccante?', pron: 'è pic·CAN·te', sens: { fr: 'C’est piquant ?', it: 'Per il peperoncino', en: 'Is it spicy?' } },
      { it: 'Era tutto buonissimo', pron: 'E·ra TUT·to buo·NIS·si·mo', sens: { fr: 'C’était vraiment très bon', it: 'Complimento di fine pasto', en: 'It was all delicious' },
        note: { fr: 'Le -issimo est le vrai compliment italien. Utilisez-le.', it: 'Il superlativo in -issimo è il complimento vero.', en: 'The -issimo ending is the real Italian compliment. Use it.' } },
      { it: 'Un caffè corretto, grazie', pron: 'un caf·FÈ cor·RET·to', sens: { fr: 'Un café « corrigé » d’un trait de liqueur', it: 'Espresso con un goccio di liquore', en: 'An espresso “corrected” with a dash of liqueur' } },
    ],
  },
  {
    id: 'route',
    icon: 'car',
    titre: { fr: 'Sur la route et pour se garer', it: 'In strada e per parcheggiare', en: 'On the road and parking' },
    intro: {
      fr: 'Demander son chemin, faire le plein, comprendre le gardien à la casquette. Voir « Les couleurs au sol » dans les infos pratiques.',
      it: 'Chiedere la strada, fare il pieno, capire il posteggiatore. Vedi « I colori sull’asfalto ».',
      en: 'Asking the way, filling up, understanding the man in the cap. See “The colours on the ground” in the practical pages.',
    },
    phrases: [
      { it: 'Scusi, dov’è il mercato?', pron: 'SCU·si do·VÈ il mer·CA·to', sens: { fr: 'Excusez-moi, où est le marché ?', it: 'Per chiedere dov’è una cosa', en: 'Excuse me, where is the market?' } },
      { it: 'È lontano da qui?', pron: 'è lon·TA·no da QUI', sens: { fr: 'C’est loin d’ici ?', it: 'Per la distanza', en: 'Is it far from here?' } },
      { it: 'Sempre dritto, poi a destra', pron: 'SEM·pre DRIT·to poi a DE·stra', sens: { fr: 'Tout droit, puis à droite — ce qu’on va vous répondre', it: 'La risposta che vi daranno', en: 'Straight on, then right — the answer you will get' },
        note: { fr: 'À gauche : a sinistra. Retenez les deux, ils arrivent vite.', it: 'A sinistra: l’altro lato.', en: 'Left: a sinistra. Learn both — they come at you fast.' } },
      { it: 'Il pieno, per favore', pron: 'il PIE·no per fa·VO·re', sens: { fr: 'Le plein, s’il vous plaît', it: 'Al distributore', en: 'Fill it up, please' } },
      { it: 'Posso parcheggiare qui?', pron: 'POS·so par·cheg·GIA·re QUI', sens: { fr: 'Je peux me garer ici ?', it: 'Per il parcheggio', en: 'Can I park here?' } },
      { it: 'Quanto costa un’ora?', pron: 'QUAN·to CO·sta un O·ra', sens: { fr: 'Combien coûte une heure ?', it: 'Tariffa oraria', en: 'How much for an hour?' } },
      { it: 'Ho bucato una gomma', pron: 'ho bu·CA·to u·na GOM·ma', sens: { fr: 'J’ai crevé un pneu', it: 'Guasto in strada', en: 'I have a flat tyre' } },
    ],
  },
  {
    id: 'pepin',
    icon: 'phone',
    titre: { fr: 'En cas de pépin', it: 'Se qualcosa va storto', en: 'When something goes wrong' },
    intro: {
      fr: 'Pharmacie, médecin, plombier, urgences. Les phrases qu’on n’a pas le temps de chercher au moment où on en a besoin.',
      it: 'Farmacia, medico, idraulico, emergenze. Le frasi che non si ha tempo di cercare quando servono.',
      en: 'Pharmacy, doctor, plumber, emergencies. The sentences you have no time to look up when you actually need them.',
    },
    phrases: [
      { it: 'Ho bisogno di aiuto', pron: 'ho bi·SO·gno di a·IU·to', sens: { fr: 'J’ai besoin d’aide', it: 'Richiesta di aiuto', en: 'I need help' } },
      { it: 'Chiamate un’ambulanza', pron: 'chia·MA·te un am·bu·LAN·za', sens: { fr: 'Appelez une ambulance', it: 'Emergenza medica', en: 'Call an ambulance' },
        note: { fr: 'Le numéro unique d’urgence en Italie est le 112.', it: 'Il numero unico di emergenza è il 112.', en: 'The single emergency number in Italy is 112.' } },
      { it: 'Mi fa male qui', pron: 'mi fa MA·le QUI', sens: { fr: 'J’ai mal ici — en montrant', it: 'Indicando il punto', en: 'It hurts here — while pointing' },
        note: { fr: 'Montrer vaut mieux que traduire : personne ne connaît le mot « cheville » sous la douleur.', it: 'Indicare vale più che tradurre.', en: 'Pointing beats translating: nobody remembers the word for “ankle” while in pain.' } },
      { it: 'Avete qualcosa per le punture di zanzara?', pron: 'a·VE·te qual·CO·sa per le pun·TU·re', sens: { fr: 'Vous avez quelque chose pour les piqûres de moustique ?', it: 'In farmacia', en: 'Do you have anything for mosquito bites?' } },
      { it: 'Non c’è acqua calda', pron: 'non CÈ ACQUA CAL·da', sens: { fr: 'Il n’y a pas d’eau chaude', it: 'Problema in casa', en: 'There is no hot water' } },
      { it: 'Il water perde', pron: 'il VA·ter PER·de', sens: { fr: 'Les toilettes fuient', it: 'Per l’idraulico', en: 'The toilet is leaking' },
        note: { fr: 'Perdere veut dire « fuir » pour un tuyau. Et water se dit « vater ».', it: '« Perdere » vale per una perdita d’acqua.', en: 'Perdere means “to leak” for a pipe. And water is said “VA-ter”.' } },
      { it: 'Può venire oggi?', pron: 'può ve·NI·re OG·gi', sens: { fr: 'Vous pouvez venir aujourd’hui ?', it: 'Per far venire un artigiano', en: 'Can you come today?' } },
    ],
  },
  {
    id: 'gens',
    icon: 'walk',
    titre: { fr: 'Faire connaissance', it: 'Fare conoscenza', en: 'Getting to know people' },
    intro: {
      fr: 'Vers 19 h, tout le village descend sur le front de mer. C’est là que ces phrases servent — et c’est là qu’on vous parlera en premier.',
      it: 'Verso le 19 tutto il paese scende sul lungomare. È lì che servono queste frasi.',
      en: 'Around 7 pm the whole village comes down to the seafront. That is where these sentences come in — and where people will speak to you first.',
    },
    phrases: [
      { it: 'Come si chiama?', pron: 'CO·me si CHIA·ma', sens: { fr: 'Comment vous appelez-vous ? (vouvoiement)', it: 'Forma di cortesia', en: 'What is your name? (polite)' },
        note: { fr: 'Entre jeunes ou entre amis : come ti chiami ?', it: 'Tra amici: come ti chiami?', en: 'Among friends or young people: come ti chiami?' } },
      { it: 'Mi chiamo Mag, e lei?', pron: 'mi CHIA·mo MAG e LEI', sens: { fr: 'Je m’appelle Mag, et vous ?', it: 'Per presentarsi', en: 'My name is Mag, and you?' } },
      { it: 'Siamo francesi, in vacanza a Cava d’Aliga', pron: 'SIA·mo fran·CE·si', sens: { fr: 'Nous sommes français, en vacances à Cava d’Aliga', it: 'Per dire da dove si viene', en: 'We are French, on holiday in Cava d’Aliga' } },
      { it: 'È la prima volta che veniamo qui', pron: 'è la PRI·ma VOL·ta', sens: { fr: 'C’est la première fois qu’on vient ici', it: 'Apre sempre una conversazione', en: 'It is our first time here' } },
      { it: 'Che bello!', pron: 'che BEL·lo', sens: { fr: 'Que c’est beau ! — ou simplement : super !', it: 'Esclamazione di approvazione', en: 'How lovely! — or simply: great!' },
        note: { fr: 'S’emploie pour tout : un paysage, une nouvelle, un plat.', it: 'Vale per tutto: un paesaggio, una notizia, un piatto.', en: 'Works for anything: a view, a piece of news, a dish.' } },
      { it: 'Ci vediamo domani', pron: 'ci ve·DIA·mo do·MA·ni', sens: { fr: 'À demain', it: 'Per congedarsi', en: 'See you tomorrow' } },
      { it: 'Buona giornata!', pron: 'BUO·na gior·NA·ta', sens: { fr: 'Bonne journée !', it: 'Saluto d’uscita', en: 'Have a good day!' } },
    ],
  },
];

/* ── 3. Les trois temps ───────────────────────────────────────────────
 * Mag les a demandes nommement. On les donne dans l'ordre ou ils servent :
 * le present d'abord (il porte 80 % des besoins et remplace meme le futur
 * proche), le passe compose ensuite (raconter ce qu'on a fait), le futur en
 * dernier — c'est celui dont on se passe le plus facilement.
 */
export type Conjugaison = {
  id: string;
  temps: Texte;
  quand: Texte;
  /** Le mode d'emploi : comment on fabrique la forme. */
  regle: Texte;
  /** Les tableaux : un par verbe modele. */
  tables: { verbe: string; sens: Texte; formes: string[] }[];
  /** Les irreguliers qu'on ne peut pas deviner. */
  pieges: Texte;
};

const PERSONNES = ['io', 'tu', 'lui / lei', 'noi', 'voi', 'loro'];
export const PRONOMS = PERSONNES;

export const CONJUGAISONS: Conjugaison[] = [
  {
    id: 'presente',
    temps: { fr: 'Le présent', it: 'Il presente', en: 'The present' },
    quand: {
      fr: 'Ce qu’on fait maintenant, ce qu’on fait d’habitude — et, en italien courant, ce qu’on va faire tout à l’heure : « domani parto » veut dire « je pars demain ».',
      it: 'Quello che si fa adesso, di solito, e anche il futuro vicino: « domani parto ».',
      en: 'What you are doing now, what you usually do — and, in everyday Italian, what you are about to do: “domani parto” means “I leave tomorrow”.',
    },
    regle: {
      fr: 'On enlève la terminaison de l’infinitif (-are, -ere, -ire) et on ajoute celle de la personne. Trois familles, trois séries de terminaisons — et elles se ressemblent beaucoup.',
      it: 'Si toglie la desinenza dell’infinito e si aggiunge quella della persona. Tre famiglie, tre serie di desinenze.',
      en: 'Drop the infinitive ending (-are, -ere, -ire) and add the one for the person. Three families, three sets of endings — and they look very much alike.',
    },
    tables: [
      { verbe: 'parlare', sens: { fr: 'parler', it: 'parlare', en: 'to speak' }, formes: ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano'] },
      { verbe: 'prendere', sens: { fr: 'prendre', it: 'prendere', en: 'to take' }, formes: ['prendo', 'prendi', 'prende', 'prendiamo', 'prendete', 'prendono'] },
      { verbe: 'dormire', sens: { fr: 'dormir', it: 'dormire', en: 'to sleep' }, formes: ['dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono'] },
      { verbe: 'essere', sens: { fr: 'être', it: 'essere', en: 'to be' }, formes: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'] },
      { verbe: 'avere', sens: { fr: 'avoir', it: 'avere', en: 'to have' }, formes: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'] },
      { verbe: 'andare', sens: { fr: 'aller', it: 'andare', en: 'to go' }, formes: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'] },
      { verbe: 'fare', sens: { fr: 'faire', it: 'fare', en: 'to do / to make' }, formes: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'] },
      { verbe: 'volere', sens: { fr: 'vouloir', it: 'volere', en: 'to want' }, formes: ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono'] },
      { verbe: 'potere', sens: { fr: 'pouvoir', it: 'potere', en: 'can / to be able' }, formes: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'] },
    ],
    pieges: {
      fr: 'Le pronom (io, tu…) se dit rarement : la terminaison suffit à dire qui parle. « Parlo » veut déjà dire « je parle ». Et certains verbes en -ire intercalent -isc- : capire donne capisco, capisci, capisce, capiamo, capite, capiscono.',
      it: 'Il pronome si omette quasi sempre: la desinenza basta. Alcuni verbi in -ire inseriscono -isc-: capisco, capisci, capisce, capiamo, capite, capiscono.',
      en: 'The pronoun (io, tu…) is usually left out — the ending already says who. “Parlo” means “I speak” on its own. Some -ire verbs insert -isc-: capisco, capisci, capisce, capiamo, capite, capiscono.',
    },
  },
  {
    id: 'passato',
    temps: { fr: 'Le passé composé', it: 'Il passato prossimo', en: 'The past tense' },
    quand: {
      fr: 'Tout ce qui est fait : hier, ce matin, l’an dernier. C’est le passé de la conversation — les Italiens s’en servent là où le français hésiterait avec l’imparfait.',
      it: 'Tutto ciò che è concluso: ieri, stamattina, l’anno scorso. È il passato della conversazione.',
      en: 'Anything finished: yesterday, this morning, last year. It is the past tense of conversation.',
    },
    regle: {
      fr: 'Auxiliaire au présent + participe passé. Avere pour la plupart des verbes ; essere pour les verbes de mouvement et d’état (andare, venire, restare, essere, nascere…). Participes : -are donne -ato, -ere donne -uto, -ire donne -ito.',
      it: 'Ausiliare al presente + participio passato. Avere per la maggior parte, essere per i verbi di movimento e di stato. -ato, -uto, -ito.',
      en: 'Auxiliary in the present + past participle. Avere for most verbs; essere for verbs of motion and state (andare, venire, restare, essere, nascere…). Participles: -ato, -uto, -ito.',
    },
    tables: [
      { verbe: 'parlare', sens: { fr: 'j’ai parlé…', it: 'ho parlato…', en: 'I spoke…' }, formes: ['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato'] },
      { verbe: 'andare', sens: { fr: 'je suis allé(e)…', it: 'sono andato/a…', en: 'I went…' }, formes: ['sono andato/a', 'sei andato/a', 'è andato/a', 'siamo andati/e', 'siete andati/e', 'sono andati/e'] },
      { verbe: 'mangiare', sens: { fr: 'j’ai mangé…', it: 'ho mangiato…', en: 'I ate…' }, formes: ['ho mangiato', 'hai mangiato', 'ha mangiato', 'abbiamo mangiato', 'avete mangiato', 'hanno mangiato'] },
      { verbe: 'essere', sens: { fr: 'j’ai été / je suis allé(e)…', it: 'sono stato/a…', en: 'I have been…' }, formes: ['sono stato/a', 'sei stato/a', 'è stato/a', 'siamo stati/e', 'siete stati/e', 'sono stati/e'] },
    ],
    pieges: {
      fr: 'Avec essere, le participe s’accorde : une femme dit sono andata. Et les participes les plus courants sont irréguliers, il faut les apprendre : fare → fatto, prendere → preso, dire → detto, vedere → visto, aprire → aperto, chiudere → chiuso, leggere → letto, scrivere → scritto, bere → bevuto, venire → venuto, rimanere → rimasto, mettere → messo.',
      it: 'Con essere il participio si accorda: sono andata. I participi più comuni sono irregolari: fatto, preso, detto, visto, aperto, chiuso, letto, scritto, bevuto, venuto, rimasto, messo.',
      en: 'With essere the participle agrees: a woman says sono andata. And the commonest participles are irregular, so learn them: fatto, preso, detto, visto, aperto, chiuso, letto, scritto, bevuto, venuto, rimasto, messo.',
    },
  },
  {
    id: 'futuro',
    temps: { fr: 'Le futur', it: 'Il futuro semplice', en: 'The future' },
    quand: {
      fr: 'Ce qui arrivera plus tard, et surtout les promesses et les suppositions : « sarà bello » veut dire aussi bien « ce sera beau » que « ça doit être beau ». Pour demain, le présent suffit le plus souvent.',
      it: 'Quello che accadrà, e soprattutto promesse e supposizioni: « sarà bello ». Per domani basta spesso il presente.',
      en: 'What will happen later, and above all promises and guesses: “sarà bello” means both “it will be lovely” and “it must be lovely”. For tomorrow, the present usually does the job.',
    },
    regle: {
      fr: 'Un seul jeu de terminaisons pour les trois familles : -ò, -ai, -à, -emo, -ete, -anno. Les verbes en -are prennent un e à la place du a : parlare donne parlerò.',
      it: 'Un’unica serie di desinenze: -ò, -ai, -à, -emo, -ete, -anno. I verbi in -are cambiano la a in e: parlerò.',
      en: 'One single set of endings for all three families: -ò, -ai, -à, -emo, -ete, -anno. Verbs in -are turn the a into an e: parlare gives parlerò.',
    },
    tables: [
      { verbe: 'parlare', sens: { fr: 'je parlerai…', it: 'parlerò…', en: 'I will speak…' }, formes: ['parlerò', 'parlerai', 'parlerà', 'parleremo', 'parlerete', 'parleranno'] },
      { verbe: 'prendere', sens: { fr: 'je prendrai…', it: 'prenderò…', en: 'I will take…' }, formes: ['prenderò', 'prenderai', 'prenderà', 'prenderemo', 'prenderete', 'prenderanno'] },
      { verbe: 'dormire', sens: { fr: 'je dormirai…', it: 'dormirò…', en: 'I will sleep…' }, formes: ['dormirò', 'dormirai', 'dormirà', 'dormiremo', 'dormirete', 'dormiranno'] },
      { verbe: 'essere', sens: { fr: 'je serai…', it: 'sarò…', en: 'I will be…' }, formes: ['sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno'] },
      { verbe: 'avere', sens: { fr: 'j’aurai…', it: 'avrò…', en: 'I will have…' }, formes: ['avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno'] },
    ],
    pieges: {
      fr: 'Quelques verbes très courants perdent une voyelle : andare → andrò, fare → farò, potere → potrò, volere → vorrò, venire → verrò, dovere → dovrò. Ce sont les mêmes irréguliers que partout, autant les apprendre une bonne fois.',
      it: 'Alcuni verbi comuni perdono una vocale: andrò, farò, potrò, vorrò, verrò, dovrò.',
      en: 'A few very common verbs drop a vowel: andare → andrò, fare → farò, potere → potrò, volere → vorrò, venire → verrò, dovere → dovrò. They are the usual suspects, so learn them once and for all.',
    },
  },
];

/* ── 4. S'entrainer ───────────────────────────────────────────────────
 * Des exercices a trous, corriges tout de suite et EXPLIQUES — sans
 * l'explication, on retient l'erreur aussi bien que la reponse. Ils suivent
 * l'ordre du cours : prononciation, phrases, puis les trois temps.
 */
export type Exercice = {
  /** La phrase, avec « ___ » a la place du mot cherche. */
  question: string;
  /** La consigne, dans la langue du lecteur. */
  consigne: Texte;
  /** La bonne reponse EN PREMIER — melangee a l'affichage. */
  choix: string[];
  pourquoi: Texte;
};

export const EXERCICES: Exercice[] = [
  {
    question: 'Un ___, per favore.',
    consigne: { fr: 'Vous commandez un espresso au comptoir.', it: 'Ordinate un espresso al banco.', en: 'You are ordering an espresso at the counter.' },
    choix: ['caffè', 'caffé', 'cafè'],
    pourquoi: { fr: 'L’accent tombe sur la dernière syllabe, et il s’écrit grave : caffè. Deux f, comme souvent en italien.', it: 'L’accento cade sull’ultima sillaba ed è grave: caffè.', en: 'The stress falls on the last syllable and the accent is a grave one: caffè. Two f’s, as often in Italian.' },
  },
  {
    question: 'Scicli',
    consigne: { fr: 'Comment se prononce le début du nom ?', it: 'Come si pronuncia l’inizio del nome?', en: 'How is the start of the name pronounced?' },
    choix: ['chi, comme dans « chat »', 'ski', 'tchi'],
    pourquoi: { fr: 'SC devant I se dit ch. Scicli se prononce « CHI-cli » — c’est la règle qui fait trébucher tout le monde.', it: 'SC davanti a I si legge come in « pesce ».', en: 'SC before I sounds like sh. Scicli is “SHEE-clee” — the rule everyone trips over.' },
  },
  {
    question: 'Quanto ___?',
    consigne: { fr: 'Vous demandez le prix d’un kilo de tomates.', it: 'Chiedete il prezzo di un chilo di pomodori.', en: 'You are asking the price of a kilo of tomatoes.' },
    choix: ['costa', 'costi', 'costano'],
    pourquoi: { fr: 'Le sujet est « un kilo », donc troisième personne du singulier : costa. Au pluriel on dirait quanto costano i pomodori ?', it: 'Il soggetto è singolare: costa.', en: 'The subject is “a kilo”, so third person singular: costa. In the plural: quanto costano i pomodori?' },
  },
  {
    question: 'Io ___ francese.',
    consigne: { fr: 'Présent du verbe être, première personne.', it: 'Presente del verbo essere, prima persona.', en: 'Present tense of “to be”, first person.' },
    choix: ['sono', 'sei', 'siamo'],
    pourquoi: { fr: 'Essere : sono, sei, è, siamo, siete, sono. Attention, sono sert à la fois pour « je suis » et « ils sont ».', it: 'Essere: sono, sei, è, siamo, siete, sono.', en: 'Essere: sono, sei, è, siamo, siete, sono. Note that sono covers both “I am” and “they are”.' },
  },
  {
    question: 'Noi ___ al mercato ogni martedì.',
    consigne: { fr: 'Présent de andare (aller), première personne du pluriel.', it: 'Presente di andare, prima plurale.', en: 'Present of andare (to go), first person plural.' },
    choix: ['andiamo', 'vanno', 'vado'],
    pourquoi: { fr: 'Andare est irrégulier au singulier (vado, vai, va) mais redevient régulier au pluriel : andiamo, andate, vanno.', it: 'Andare è irregolare al singolare, regolare al plurale: andiamo.', en: 'Andare is irregular in the singular (vado, vai, va) but regular in the plural: andiamo, andate, vanno.' },
  },
  {
    question: 'Ieri ___ la granita.',
    consigne: { fr: 'Passé composé de prendere, première personne.', it: 'Passato prossimo di prendere, prima persona.', en: 'Past tense of prendere, first person.' },
    choix: ['ho preso', 'sono preso', 'ho prenduto'],
    pourquoi: { fr: 'Prendere se conjugue avec avere, et son participe est irrégulier : preso, pas « prenduto ».', it: 'Prendere vuole avere e ha il participio irregolare: preso.', en: 'Prendere takes avere, and its participle is irregular: preso, not “prenduto”.' },
  },
  {
    question: 'Maria ___ al mare.',
    consigne: { fr: 'Passé composé d’andare, à propos d’une femme.', it: 'Passato prossimo di andare, riferito a una donna.', en: 'Past tense of andare, about a woman.' },
    choix: ['è andata', 'è andato', 'ha andato'],
    pourquoi: { fr: 'Andare se conjugue avec essere, donc le participe s’accorde : andata pour une femme. « Ha andato » n’existe pas.', it: 'Andare vuole essere e il participio si accorda: andata.', en: 'Andare takes essere, so the participle agrees: andata for a woman. “Ha andato” does not exist.' },
  },
  {
    question: 'Domani ___ a Modica.',
    consigne: { fr: 'Futur d’andare, première personne.', it: 'Futuro di andare, prima persona.', en: 'Future of andare, first person.' },
    choix: ['andrò', 'anderò', 'andarò'],
    pourquoi: { fr: 'Andare perd une voyelle au futur : andrò, andrai, andrà. Même chose pour fare (farò), potere (potrò), volere (vorrò).', it: 'Andare perde una vocale al futuro: andrò.', en: 'Andare loses a vowel in the future: andrò, andrai, andrà. Same for fare (farò), potere (potrò), volere (vorrò).' },
  },
  {
    question: '___ bello domani.',
    consigne: { fr: 'Futur d’essere, troisième personne — « il fera beau ».', it: 'Futuro di essere, terza persona.', en: 'Future of essere, third person — “it will be lovely”.' },
    choix: ['Sarà', 'Sarai', 'Saremo'],
    pourquoi: { fr: 'Essere au futur : sarò, sarai, sarà, saremo, sarete, saranno. Et « sarà » sert aussi à supposer : « ça doit être ça ».', it: 'Essere al futuro: sarò, sarai, sarà… « Sarà » serve anche per supporre.', en: 'Essere in the future: sarò, sarai, sarà, saremo, sarete, saranno. And “sarà” also expresses a guess.' },
  },
  {
    question: 'Mi ___ male qui.',
    consigne: { fr: 'Vous montrez où vous avez mal.', it: 'Indicate dove vi fa male.', en: 'You are showing where it hurts.' },
    choix: ['fa', 'fai', 'faccio'],
    pourquoi: { fr: 'Littéralement « ça me fait mal ici » : le sujet est la douleur, donc troisième personne, fa.', it: 'Il soggetto è il dolore: terza persona, fa.', en: 'Literally “it makes me pain here”: the subject is the pain, so third person, fa.' },
  },
  {
    question: 'Non ___ italiano.',
    consigne: { fr: 'Présent de parlare, première personne, à la forme négative.', it: 'Presente di parlare, prima persona, negativo.', en: 'Present of parlare, first person, negative.' },
    choix: ['parlo', 'parla', 'parli'],
    pourquoi: { fr: 'La négation se fait avec un seul mot placé devant le verbe : non parlo. Pas de « pas » après.', it: 'La negazione è una sola parola davanti al verbo: non parlo.', en: 'Negation is a single word before the verb: non parlo. Nothing comes after.' },
  },
  {
    question: '___ ripetere più lentamente?',
    consigne: { fr: 'Présent de potere, forme de politesse (lei).', it: 'Presente di potere, forma di cortesia.', en: 'Present of potere, polite form.' },
    choix: ['Può', 'Puoi', 'Posso'],
    pourquoi: { fr: 'Le vouvoiement italien passe par la troisième personne : può. Puoi serait du tutoiement, posso voudrait dire « je peux ».', it: 'La cortesia usa la terza persona: può.', en: 'Italian politeness uses the third person: può. Puoi is informal, posso means “I can”.' },
  },
];
