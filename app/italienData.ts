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
// Le sens des mots-exemples n'est donne qu'en francais et en anglais : le mot
// EST italien, un lecteur italien n'a pas besoin qu'on le lui traduise (on ne
// l'affiche donc pas pour lui, voir la page).
export type Regle = { regle: Texte; exemples: { it: string; pron: string; sens: { fr: string; en: string } }[] };

export const PRONONCIATION: Regle[] = [
  {
    regle: {
      fr: 'C et G se ramollissent devant E et I. « ce, ci » se disent tch ; « ge, gi » se disent dj. Devant A, O, U, ils restent durs.',
      it: 'C e G si addolciscono davanti a E e I; davanti ad A, O, U restano dure. È la regola che spiega quasi tutto il resto.',
      en: 'C and G soften before E and I: “ce, ci” sound like ch in church, “ge, gi” like j in jam. Before A, O, U they stay hard.',
    },
    exemples: [
      { it: 'giustizia', pron: 'giu·STI·zia', sens: { fr: 'justice', en: 'justice' } },
      { it: 'società', pron: 'so·cie·TÀ', sens: { fr: 'société', en: 'society' } },
      { it: 'compagno', pron: 'com·PA·gno', sens: { fr: 'camarade', en: 'comrade' } },
    ],
  },
  {
    regle: {
      fr: 'Un H glissé après C ou G les redurcit. C’est à ça que sert le H en italien : il ne se prononce jamais, il protège la consonne.',
      it: 'La H dopo C o G le rende di nuovo dure. In italiano la H non si pronuncia mai: serve solo a questo.',
      en: 'An H after C or G makes them hard again. That is all H does in Italian — it is never pronounced itself.',
    },
    exemples: [
      { it: 'anarchico', pron: 'a·NAR·chi·co', sens: { fr: 'anarchiste', en: 'anarchist' } },
      { it: 'borghesia', pron: 'bor·ghe·SI·a', sens: { fr: 'bourgeoisie', en: 'bourgeoisie' } },
      { it: 'oligarchia', pron: 'o·li·gar·CHI·a', sens: { fr: 'oligarchie', en: 'oligarchy' } },
    ],
  },
  {
    regle: {
      fr: 'GN se dit comme dans « agneau ». GLI se dit comme le « ill » de « famille ».',
      it: 'GN come in « agnello », GLI come in « famiglia ». Due suoni che gli stranieri sbagliano spesso.',
      en: 'GN sounds like the ni in onion. GLI sounds like the lli in million.',
    },
    exemples: [
      { it: 'compagni', pron: 'com·PA·gni', sens: { fr: 'camarades', en: 'comrades' } },
      { it: 'consiglio', pron: 'con·SI·glio', sens: { fr: 'conseil', en: 'council' } },
      { it: 'battaglia', pron: 'bat·TA·glia', sens: { fr: 'bataille', en: 'battle' } },
    ],
  },
  {
    regle: {
      fr: 'SC devant E ou I se dit ch, comme dans « chat ». Devant A, O, U, il se dit sk.',
      it: 'SC davanti a E o I si legge come in « pesce »; davanti ad A, O, U si legge sk.',
      en: 'SC before E or I sounds like sh in ship. Before A, O, U it sounds like sk.',
    },
    exemples: [
      { it: 'sciopero', pron: 'SCIO·pe·ro', sens: { fr: 'grève', en: 'strike' } },
      { it: 'coscienza', pron: 'co·SCIEN·za', sens: { fr: 'conscience', en: 'conscience' } },
      { it: 'sconfitta', pron: 'scon·FIT·ta', sens: { fr: 'défaite', en: 'defeat' } },
    ],
  },
  {
    regle: {
      fr: 'Les doubles consonnes s’entendent : on tient la consonne. C’est le détail qui trahit le plus les étrangers — et parfois ça change le mot.',
      it: 'Le doppie si sentono davvero: si tiene la consonante. È il dettaglio che tradisce di più gli stranieri.',
      en: 'Double consonants are actually held longer. It is the single most audible giveaway for foreigners — and sometimes it changes the word.',
    },
    exemples: [
      { it: 'occupazione', pron: 'oc·cu·pa·ZIO·ne', sens: { fr: 'occupation', en: 'occupation' } },
      { it: 'assemblea', pron: 'as·sem·BLE·a', sens: { fr: 'assemblée', en: 'assembly' } },
      { it: 'bandiera rossa', pron: 'ban·DIE·ra ROS·sa', sens: { fr: 'drapeau rouge', en: 'red flag' } },
    ],
  },
  {
    regle: {
      fr: 'Toutes les voyelles se prononcent, y compris à la fin. Pas de voyelle avalée, pas de nasale : « pane » fait deux syllabes bien nettes.',
      it: 'Tutte le vocali si pronunciano, anche l’ultima. Niente nasali: « pane » sono due sillabe piene.',
      en: 'Every vowel is pronounced, including the final one. No nasal vowels, nothing swallowed: “pane” is two clear syllables.',
    },
    exemples: [
      { it: 'popolo', pron: 'PO·po·lo', sens: { fr: 'peuple', en: 'people' } },
      { it: 'terra', pron: 'TER·ra', sens: { fr: 'terre', en: 'land' } },
      { it: 'compagne', pron: 'com·PA·gne', sens: { fr: 'camarades (f.)', en: 'comrades (f.)' } },
    ],
  },
  {
    regle: {
      fr: 'L’accent tombe presque toujours sur l’avant-dernière syllabe. Quand il tombe sur la dernière, c’est écrit : caffè, città, perché.',
      it: 'L’accento cade quasi sempre sulla penultima sillaba. Quando cade sull’ultima, è scritto: caffè, città, perché.',
      en: 'The stress almost always falls on the second-to-last syllable. When it falls on the last one, it is written: caffè, città, perché.',
    },
    exemples: [
      { it: 'libertà', pron: 'li·ber·TÀ', sens: { fr: 'liberté', en: 'freedom' } },
      { it: 'solidarietà', pron: 'so·li·da·rie·TÀ', sens: { fr: 'solidarité', en: 'solidarity' } },
      { it: 'uguaglianza', pron: 'u·gua·GLIAN·za', sens: { fr: 'égalité', en: 'equality' } },
    ],
  },
  {
    regle: {
      fr: 'Le Z se dit ts ou dz selon les mots — les Siciliens tirent vers le ts. Et le R se roule, sans excès : un simple battement de langue suffit.',
      it: 'La Z si legge ts o dz secondo le parole; in Sicilia tira verso il ts. La R si arrotola, ma basta un colpo di lingua.',
      en: 'Z sounds like ts or dz depending on the word — Sicilians lean towards ts. R is rolled, but lightly: one flick of the tongue is enough.',
    },
    exemples: [
      { it: 'rivoluzione', pron: 'ri·vo·lu·TSIO·ne', sens: { fr: 'révolution', en: 'revolution' } },
      { it: 'resistenza', pron: 're·si·STEN·za', sens: { fr: 'résistance', en: 'resistance' } },
      { it: 'giustizia', pron: 'giu·STI·tsia', sens: { fr: 'justice', en: 'justice' } },
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
    /*
     * Les mots des luttes. Mag : « tous les exemples doivent avoir un rapport
     * avec l'anarchisme, le communisme ». Les exercices et les mots de
     * prononciation le portent ; il fallait aussi une lecon a part entiere,
     * sinon le theme n'aurait vecu que dans les marges.
     *
     * Les phrases de survie, elles, restent des phrases de survie : on ne
     * politise pas « j'ai besoin d'aide » ni « appelez une ambulance ». Ce
     * sont des outils, pas des exemples.
     */
    id: 'lutte',
    icon: 'landmark',
    titre: { fr: 'Les mots des luttes', it: 'Le parole delle lotte', en: 'The words of the struggles' },
    intro: {
      fr: 'Ceux qu’on lit sur les murs, dans les livres et sur les banderoles du 1er mai. Ils viennent d’ici : la province de Raguse s’est soulevée en janvier 1945, et Comiso a tenu six jours. Voir « Luttes & mémoire » sur la page La région.',
      it: 'Quelle che si leggono sui muri, nei libri e sugli striscioni del Primo Maggio. Vengono da qui: la provincia di Ragusa insorse nel gennaio 1945.',
      en: 'The words you read on walls, in books and on May Day banners. They come from here: the province of Ragusa rose up in January 1945, and Comiso held out for six days.',
    },
    phrases: [
      { it: 'Sciopero', pron: 'SCIO·pe·ro', sens: { fr: 'La grève', it: 'Astensione dal lavoro', en: 'Strike' },
        note: { fr: 'Se prononce « CHO-pé-ro » : SC devant I se dit ch.', it: 'SC davanti a I si legge come in « pesce ».', en: 'Pronounced “SHO-peh-ro”: SC before I sounds like sh.' } },
      { it: 'Compagno, compagna', pron: 'com·PA·gno · com·PA·gna', sens: { fr: 'Camarade — au masculin, puis au féminin', it: 'Appellativo tra militanti', en: 'Comrade — masculine, then feminine' },
        note: { fr: 'Le mot dit aussi « compagnon » au sens amoureux : le contexte tranche.', it: 'La parola vale anche per il partner: decide il contesto.', en: 'The same word also means “partner” in the romantic sense — context decides.' } },
      { it: 'La lotta continua', pron: 'la LOT·ta con·TI·nua', sens: { fr: 'La lutte continue', it: 'Slogan storico', en: 'The struggle continues' } },
      { it: 'Non si parte!', pron: 'non si PAR·te', sens: { fr: '« On ne part pas ! » — le cri de janvier 1945, ici', it: 'Il grido del gennaio 1945, in provincia di Ragusa', en: '“We are not going!” — the cry of January 1945, right here' },
        note: { fr: 'Le refus d’aller à la guerre. C’est le nom que l’histoire a gardé pour cette révolte.', it: 'Il rifiuto della leva. È il nome rimasto a quella rivolta.', en: 'The refusal to be conscripted. It is the name history kept for that revolt.' } },
      { it: 'Occupare le terre', pron: 'oc·cu·PA·re le TER·re', sens: { fr: 'Occuper les terres — ce que firent les paysans siciliens', it: 'Quello che fecero i contadini siciliani', en: 'To occupy the land — what the Sicilian peasants did' } },
      { it: 'Né dio né padrone', pron: 'né DI·o né pa·DRO·ne', sens: { fr: 'Ni dieu ni maître', it: 'Motto anarchico', en: 'No gods, no masters' },
        note: { fr: 'Padrone veut dire le patron, le propriétaire, le maître — les trois à la fois.', it: 'Padrone: il capo, il proprietario, il padrone di casa.', en: 'Padrone means boss, owner and master all at once.' } },
      { it: 'L’unione fa la forza', pron: 'lu·NIO·ne fa la FOR·za', sens: { fr: 'L’union fait la force', it: 'Proverbio, e slogan', en: 'Unity is strength' } },
      { it: 'Ora e sempre Resistenza', pron: 'O·ra e SEM·pre re·si·STEN·za', sens: { fr: '« Maintenant et toujours, Résistance » — la formule de Piero Calamandrei', it: 'La formula di Piero Calamandrei', en: '“Now and always, Resistance” — Piero Calamandrei’s phrase' },
        note: { fr: 'Gravée sur les monuments aux partisans dans toute l’Italie. On la lit encore sur les murs le 25 avril, jour de la Libération.', it: 'Incisa sui monumenti ai partigiani. Si legge ancora sui muri il 25 aprile.', en: 'Carved on partisan memorials across Italy. Still written on walls every 25 April, Liberation Day.' } },
      { it: 'Odio gli indifferenti', pron: 'O·dio gli in·dif·fe·REN·ti', sens: { fr: '« Je hais les indifférents » — Antonio Gramsci, 1917', it: '« Odio gli indifferenti » — Antonio Gramsci, 1917', en: '“I hate the indifferent” — Antonio Gramsci, 1917' },
        note: { fr: 'La phrase la plus citée de Gramsci, écrite à vingt-six ans dans La Città Futura. Elle vise ceux qui ne prennent pas parti.', it: 'La frase più citata di Gramsci, scritta a ventisei anni su La Città Futura.', en: 'Gramsci’s most quoted line, written at twenty-six in La Città Futura. It is aimed at those who take no side.' } },
      { it: 'Pessimismo dell’intelligenza, ottimismo della volontà', pron: 'pes·si·MI·smo · ot·ti·MI·smo', sens: { fr: '« Pessimisme de l’intelligence, optimisme de la volonté » — Gramsci', it: 'La formula che Gramsci riprende da Romain Rolland', en: '“Pessimism of the intellect, optimism of the will” — Gramsci' },
        note: { fr: 'Gramsci l’emprunte à Romain Rolland et en fait sa devise. Voir clair sans renoncer à agir : tout le programme en six mots.', it: 'Gramsci la riprende da Romain Rolland e la fa sua.', en: 'Gramsci borrowed it from Romain Rolland and made it his motto: see clearly, act anyway.' } },
      // Des figures, pas seulement des slogans : des anarchistes italiens qu'on
      // peut nommer. Chaque phrase est au passe compose — le temps du cours — et
      // les noms renvoient a Wikipedia (voir REFERENCES dans la page).
      { it: 'Errico Malatesta è stato il più grande anarchico italiano', pron: 'ER·ri·co ma·la·TE·sta',
        sens: { fr: 'Errico Malatesta a été le plus grand anarchiste italien', it: 'La figura di riferimento dell’anarchismo italiano', en: 'Errico Malatesta was the greatest Italian anarchist' },
        note: { fr: 'Né en 1853, mort à Rome en 1932 sous surveillance fasciste. « è stato », c’est le passé composé — le temps du cours.', it: 'Nato nel 1853, morto a Roma nel 1932, sorvegliato dal fascismo.', en: 'Born in 1853, died in Rome in 1932 under fascist surveillance. “è stato” is the passato prossimo — the tense of this course.' } },
      { it: 'Sacco e Vanzetti sono stati giustiziati nel 1927', pron: 'SAC·co e van·ZET·ti',
        sens: { fr: 'Sacco et Vanzetti ont été exécutés en 1927', it: 'Due anarchici italiani giustiziati negli Stati Uniti', en: 'Sacco and Vanzetti were executed in 1927' },
        note: { fr: 'Deux ouvriers anarchistes italiens condamnés à mort aux États-Unis au terme d’un procès inique — un symbole mondial de l’injustice.', it: 'Due operai anarchici condannati a morte negli USA dopo un processo iniquo.', en: 'Two Italian anarchist workers sentenced to death in the USA after an unfair trial — a worldwide symbol of injustice.' } },
      { it: 'L’anarchico Pinelli è morto in questura', pron: 'la·NAR·chi·co pi·NEL·li',
        sens: { fr: 'L’anarchiste Pinelli est mort au commissariat', it: 'Giuseppe Pinelli, ferroviere anarchico', en: 'The anarchist Pinelli died in the police station' },
        note: { fr: 'Giuseppe Pinelli, cheminot, tombé d’une fenêtre de la questure de Milan en 1969. Dario Fo en a tiré « Mort accidentelle d’un anarchiste ».', it: 'Giuseppe Pinelli cadde da una finestra della questura di Milano nel 1969.', en: 'Giuseppe Pinelli, a railway worker, fell from a window of the Milan police station in 1969. Dario Fo based “Accidental Death of an Anarchist” on it.' } },
      { it: 'Pietro Gori ha scritto canzoni anarchiche', pron: 'PIE·tro GO·ri',
        sens: { fr: 'Pietro Gori a écrit des chansons anarchistes', it: 'Avvocato e poeta anarchico', en: 'Pietro Gori wrote anarchist songs' },
        note: { fr: 'Avocat et poète, auteur d’« Addio a Lugano ». Participe irrégulier : scrivere → scritto.', it: 'Autore di « Addio a Lugano ». Participio irregolare: scrivere → scritto.', en: 'A lawyer and poet, author of “Addio a Lugano”. Irregular participle: scrivere → scritto.' } },
      { it: 'Camillo Berneri è morto a Barcellona nel 1937', pron: 'ca·MIL·lo ber·NE·ri',
        sens: { fr: 'Camillo Berneri est mort à Barcelone en 1937', it: 'Intellettuale anarchico, ucciso durante la guerra di Spagna', en: 'Camillo Berneri died in Barcelona in 1937' },
        note: { fr: 'Intellectuel anarchiste, assassiné pendant la guerre d’Espagne par des agents staliniens.', it: 'Ucciso da agenti stalinisti durante la guerra civile spagnola.', en: 'An anarchist intellectual, killed by Stalinist agents during the Spanish Civil War.' } },
      { it: 'Luigi Fabbri ha scritto contro il fascismo', pron: 'lu·I·gi FAB·bri',
        sens: { fr: 'Luigi Fabbri a écrit contre le fascisme', it: 'Teorico anarchico, amico di Malatesta', en: 'Luigi Fabbri wrote against fascism' },
        note: { fr: 'Théoricien anarchiste, ami de Malatesta, mort en exil en Uruguay en 1935.', it: 'Amico di Malatesta, morto in esilio in Uruguay nel 1935.', en: 'An anarchist theorist and friend of Malatesta, he died in exile in Uruguay in 1935.' } },
      { it: 'Virgilia D’Andrea è stata una poetessa anarchica', pron: 'vir·GI·lia dan·DRE·a',
        sens: { fr: 'Virgilia D’Andrea a été une poétesse anarchiste', it: 'Poetessa e militante, esule dal fascismo', en: 'Virgilia D’Andrea was an anarchist poet' },
        note: { fr: 'Poétesse et militante, exilée par le fascisme, morte à New York en 1933. « è stata » s’accorde au féminin.', it: 'Esule dal fascismo, morta a New York nel 1933.', en: 'A poet and activist, exiled by fascism, she died in New York in 1933. “è stata” agrees in the feminine.' } },
      { it: 'Armando Borghi ha guidato il sindacato anarchico', pron: 'ar·MAN·do BOR·ghi',
        sens: { fr: 'Armando Borghi a dirigé le syndicat anarchiste', it: 'Anarcosindacalista, alla guida dell’USI', en: 'Armando Borghi led the anarchist union' },
        note: { fr: 'Figure de l’anarcho-syndicalisme, à la tête de l’Unione Sindacale Italiana (USI), puis exilé par le fascisme.', it: 'Alla guida dell’Unione Sindacale Italiana, poi esule dal fascismo.', en: 'A leading anarcho-syndicalist, head of the Unione Sindacale Italiana (USI), later exiled by fascism.' } },
      { it: 'Leda Rafanelli ha aperto una casa editrice anarchica', pron: 'LE·da ra·fa·NEL·li',
        sens: { fr: 'Leda Rafanelli a ouvert une maison d’édition anarchiste', it: 'Scrittrice e tipografa, anarchica individualista', en: 'Leda Rafanelli opened an anarchist publishing house' },
        note: { fr: 'Écrivaine et typographe, figure de l’anarchisme individualiste. Participe irrégulier : aprire → aperto.', it: 'Scrittrice e tipografa dell’anarchismo individualista. Participio irregolare: aprire → aperto.', en: 'A writer and printer, a figure of individualist anarchism. Irregular participle: aprire → aperto.' } },
      { it: 'La Settimana Rossa è scoppiata nel giugno 1914', pron: 'set·ti·MA·na ROS·sa',
        sens: { fr: 'La Semaine rouge a éclaté en juin 1914', it: 'Rivolta popolare del giugno 1914', en: 'The Red Week broke out in June 1914' },
        note: { fr: 'Insurrection partie d’Ancône, où Malatesta militait, contre la répression militaire. « è scoppiata » : essere, accordé au féminin (la settimana).', it: 'Rivolta partita da Ancona, dove agiva Malatesta. « è scoppiata »: essere, femminile.', en: 'An uprising that began in Ancona, where Malatesta was active, against military repression. “è scoppiata”: essere, agreeing in the feminine.' } },
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

/* ── 5. Ailleurs ──────────────────────────────────────────────────────
 * Ce cours n'a pas de son, et c'est sa limite : on ne peut pas apprendre a
 * prononcer une langue sans l'entendre. Ces sites-la comblent le trou, et
 * font ce qu'une page de site de famille ne fera jamais — des heures
 * d'exercices, des voix, un dictionnaire complet.
 *
 * Chaque adresse a ete ouverte et verifiee. Aucune ne demande de compte pour
 * commencer, sauf Duolingo, et c'est dit.
 */
export type Ailleurs = { titre: Texte; url: string; quoi: Texte; sites: { nom: string; url: string; quoi: Texte }[] };

export const AILLEURS: { titre: Texte; sites: { nom: string; url: string; quoi: Texte }[] }[] = [
  {
    titre: { fr: 'Entendre la langue', it: 'Sentire la lingua', en: 'Hearing the language' },
    sites: [
      { nom: 'Coffee Break Italian', url: 'https://coffeebreaklanguages.com/coffeebreakitalian/',
        quoi: { fr: 'Le podcast qui a le mieux compris qu’on apprend en écoutant quelqu’un se tromper puis se corriger. Gratuit, progressif, une saison entière pour débuter.',
                it: 'Il podcast che ha capito meglio di tutti come si impara: ascoltando qualcuno che sbaglia e si corregge. Gratuito e progressivo.',
                en: 'The podcast that best understood you learn by hearing someone get it wrong and then right. Free, progressive, a whole season for beginners.' } },
      { nom: 'RaiPlay Sound', url: 'https://www.raiplaysound.it/',
        quoi: { fr: 'La radio italienne, en direct et en rattrapage. On ne comprend rien les premiers jours : c’est normal, et c’est l’exercice.',
                it: 'La radio italiana, in diretta e on demand. All’inizio non si capisce nulla: è l’esercizio.',
                en: 'Italian radio, live and on demand. You will understand nothing for days — that is normal, and that is the exercise.' } },
    ],
  },
  {
    titre: { fr: 'S’exercer pour de bon', it: 'Esercitarsi sul serio', en: 'Real practice' },
    sites: [
      { nom: 'One World Italiano', url: 'https://oneworlditaliano.com/',
        quoi: { fr: 'Des leçons vidéo par niveau, du débutant au confirmé, avec les exercices qui vont avec. Fait par une école de Cagliari, et entièrement gratuit.',
                it: 'Videolezioni per livello con i relativi esercizi. Fatto da una scuola di Cagliari, del tutto gratuito.',
                en: 'Video lessons by level, beginner to advanced, with the matching exercises. Made by a school in Cagliari, entirely free.' } },
      { nom: 'Lingua.com', url: 'https://www.lingua.com/italian/reading/',
        quoi: { fr: 'Des textes courts suivis de questions de compréhension. C’est l’exercice le plus utile quand on a fini le nôtre : lire pour de vrai.',
                it: 'Testi brevi seguiti da domande di comprensione. L’esercizio più utile dopo il nostro.',
                en: 'Short texts followed by comprehension questions. The most useful exercise once you have finished ours: actually reading.' } },
      { nom: 'Duolingo', url: 'https://fr.duolingo.com/course/it/fr/apprendre-italien',
        quoi: { fr: 'Cinq minutes par jour, en jeu. Ça ne fera jamais de vous un causeur, mais ça entretient le vocabulaire sans effort. Compte gratuit obligatoire.',
                it: 'Cinque minuti al giorno, sotto forma di gioco. Non vi renderà conversatori, ma tiene vivo il vocabolario. Serve un account.',
                en: 'Five minutes a day, as a game. It will never make you a talker, but it keeps vocabulary alive effortlessly. Free account required.' } },
    ],
  },
  {
    titre: { fr: 'Vérifier un mot, un verbe', it: 'Verificare una parola, un verbo', en: 'Checking a word, a verb' },
    sites: [
      { nom: 'Treccani', url: 'https://www.treccani.it/vocabolario/',
        quoi: { fr: 'Le dictionnaire de référence de la langue italienne. En italien, donc : c’est déjà un exercice de le consulter.',
                it: 'Il vocabolario di riferimento della lingua italiana.',
                en: 'The reference dictionary of the Italian language. In Italian, of course — looking things up is already practice.' } },
      { nom: 'Coniugazione.it', url: 'https://www.coniugazione.it/',
        quoi: { fr: 'Tous les verbes, à tous les temps. Quand un participe passé vous échappe, la réponse est là en trois secondes.',
                it: 'Tutti i verbi, a tutti i tempi. Quando sfugge un participio, la risposta è lì.',
                en: 'Every verb, every tense. When a past participle escapes you, the answer is three seconds away.' } },
      { nom: 'Accademia della Crusca', url: 'https://accademiadellacrusca.it/',
        quoi: { fr: 'L’autorité sur la langue italienne depuis 1583 — c’est elle qui a tranché le débat arancina / arancino. On y lit ses réponses aux questions du public.',
                it: 'L’autorità sulla lingua italiana dal 1583: è lei che ha risolto la disputa arancina / arancino.',
                en: 'The authority on the Italian language since 1583 — the body that settled the arancina / arancino argument. You can read its answers to public questions.' } },
    ],
  },
];

/* ── Les chansons ─────────────────────────────────────────────────────
 * Mag les a demandees, et elles enseignent vraiment : une chanson entre par
 * l'oreille et reste, la ou une liste de mots s'efface.
 *
 * CE QU'ON N'ECRIT PAS, ET POURQUOI. Les paroles de « L'italiano » (1983) et
 * de « Via con me » (1981) appartiennent a leurs auteurs : on ne les recopie
 * pas, meme traduites. On enseigne donc ce qui s'enseigne — les MOTS et les
 * TOURNURES qu'on y entend, ce que la chanson raconte, la regle de grammaire
 * qu'elle illustre — et on renvoie a l'ecoute pour le reste. C'est d'ailleurs
 * la bonne facon d'apprendre : les mots en main, on ecoute et on reconnait.
 *
 * « Bella ciao » est un chant traditionnel anonyme, tombe dans le domaine
 * public : rien n'empeche d'en citer le refrain, qui tient en trois mots et
 * qu'on chante de toute facon dans toute l'Italie le 25 avril.
 */
export type Chanson = {
  id: string;
  titre: string;
  auteur: string;
  annee: string;
  lien: string;
  /**
   * De quoi ça parle — FACULTATIF.
   *
   * Mag l'a retire des chansons d'auteur : « retire les intros comme ça ». Le
   * deroule dit deja ce qui se passe, passage par passage ; une presentation
   * avant lui ne faisait que retarder la lecon. Bella ciao garde la sienne,
   * reduite a ce qu'elle a d'irremplacable — le chant des partisans, le
   * 25 avril.
   */
  quoi?: Texte;
  /** Les mots a avoir en tete AVANT d'ecouter. */
  mots: { it: string; pron: string; sens: Texte }[];
  /** Le point de langue que la chanson montre mieux qu'un tableau. */
  langue: Texte;
  /**
   * Le rayon de la chanson — c'est lui qui la range sous un bouton.
   *
   * Mag : « mets des boutons pour trier les chansons plus facilement parce
   * qu'on va en avoir au moins 10 ». A trois, une liste suffit ; a dix, on ne
   * retrouve plus rien. Le tri est donc pose maintenant, pendant qu'il ne
   * coute rien, plutot que le jour ou la page sera devenue illisible.
   */
  genre: 'lutte' | 'sicile' | 'auteur';
  /**
   * L'ecoute, sur Spotify.
   *
   * Mag voulait les paroles depliables sur la page. Elles ne peuvent pas y
   * etre — elles appartiennent a ceux qui les ont ecrites. Ce lien-la est la
   * vraie reponse a sa demande : Spotify affiche le texte SOUS le morceau,
   * qui defile en meme temps que la voix. C'est mieux qu'un texte pose a
   * plat, puisqu'on lit au rythme ou l'on entend.
   */
  spotify: string;
  /**
   * Ce que la chanson raconte, passage par passage, ECRIT PAR NOUS.
   *
   * C'est la reponse aux chansons dont on ne peut pas donner le texte : on
   * dit ce qui s'y passe, dans l'ordre, et le vocabulaire d'a cote permet de
   * suivre a l'ecoute presque mot a mot. C'est meme la meilleure facon
   * d'apprendre une chanson — on reconnait au vol au lieu de lire en silence.
   */
  deroule?: { titre: Texte; texte: Texte }[];
};

export const CHANSONS: Chanson[] = [
  {
    id: 'bella-ciao',
    titre: 'Bella ciao',
    auteur: 'Traditionnel — anonyme',
    annee: 'XIXᵉ-XXᵉ s.',
    lien: 'https://it.wikipedia.org/wiki/Bella_ciao',
    genre: 'lutte',
    /*
     * Mag : « pour Bella ciao, mets une plus originale, vieille ». C'est
     * l'enregistrement de GIOVANNA DAFFINI, fait en 1962 pour les musicologues
     * Bosio et Leydi — une mondina de la plaine du Po qui chantait ce qu'elle
     * avait appris en travaillant, pas un arrangement de studio. On entend la
     * voix nue, et la chanson d'avant les reprises.
     */
    spotify: 'https://open.spotify.com/track/72I4PYnCQqdPnx1YgpBmUS',
    quoi: {
      fr: 'Le chant des partisans italiens, devenu celui de toutes les résistances. On le chante chaque 25 avril, jour de la Libération.',
      it: 'Il canto dei partigiani italiani, diventato quello di tutte le resistenze. Si canta ogni 25 aprile, giorno della Liberazione.',
      en: 'The song of the Italian partisans, since taken up by resistance movements everywhere. It is sung every 25 April, Liberation Day.',
    },
    mots: [
      { it: 'ciao', pron: 'CIAO', sens: { fr: 'salut — et aussi adieu : le mot sert à l’arrivée comme au départ', it: 'saluto d’arrivo e di partenza', en: 'hello — and goodbye: the word works both ways' } },
      { it: 'il partigiano', pron: 'il par·ti·GIA·no', sens: { fr: 'le partisan, le résistant', it: 'chi combatté nella Resistenza', en: 'the partisan, the resistance fighter' } },
      { it: 'l’invasore', pron: 'lin·va·SO·re', sens: { fr: 'l’envahisseur', it: 'chi occupa un paese', en: 'the invader' } },
      { it: 'la montagna', pron: 'la mon·TA·gna', sens: { fr: 'la montagne — là où les partisans se cachaient', it: 'dove si nascondevano i partigiani', en: 'the mountain — where the partisans hid' } },
      { it: 'seppellire', pron: 'sep·pel·LI·re', sens: { fr: 'enterrer', it: 'mettere sotto terra', en: 'to bury' } },
      { it: 'il fiore', pron: 'il FIO·re', sens: { fr: 'la fleur — celle qui pousse sur la tombe, à la fin', it: 'quello che nasce sulla tomba', en: 'the flower — the one that grows on the grave, at the end' } },
      { it: 'una mattina', pron: 'u·na mat·TI·na', sens: { fr: 'un matin — c’est ainsi que tout commence', it: 'così comincia tutto', en: 'one morning — that is how it all starts' } },
      { it: 'svegliarsi', pron: 'sve·GLIAR·si', sens: { fr: 'se réveiller', it: 'smettere di dormire', en: 'to wake up' } },
      { it: 'portare via', pron: 'por·TA·re VI·a', sens: { fr: 'emmener — « portami via » veut dire « emmène-moi »', it: '« portami via »: portami con te', en: 'to take away — “portami via” means “take me with you”' } },
      { it: 'morire', pron: 'mo·RI·re', sens: { fr: 'mourir', it: 'cessare di vivere', en: 'to die' } },
      { it: 'la tomba', pron: 'la TOM·ba', sens: { fr: 'la tombe', it: 'dove si seppellisce', en: 'the grave' } },
      { it: 'l’ombra', pron: 'LOM·bra', sens: { fr: 'l’ombre', it: 'dove non batte il sole', en: 'the shade' } },
      { it: 'la gente', pron: 'la GEN·te', sens: { fr: 'les gens — singulier en italien, pluriel en français', it: 'le persone; in italiano è singolare', en: 'people — singular in Italian, plural in English' } },
      { it: 'passare', pron: 'pas·SA·re', sens: { fr: 'passer — « passeranno », ils passeront', it: '« passeranno »: al futuro', en: 'to pass — “passeranno”, they will pass' } },
      { it: 'la libertà', pron: 'la li·ber·TÀ', sens: { fr: 'la liberté — le dernier mot de la chanson', it: 'l’ultima parola della canzone', en: 'freedom — the last word of the song' } },
    ],
    langue: {
      fr: 'Elle est bâtie sur l’impératif et le futur : « portami via » (emmène-moi), « seppellire » à l’infinitif après un verbe de volonté. Et surtout, elle répète — c’est pour ça qu’on la retient sans l’apprendre.',
      it: 'È costruita sull’imperativo e sul futuro, e soprattutto ripete: per questo si impara senza studiarla.',
      en: 'It is built on the imperative and the future, and above all it repeats — which is why you learn it without studying it.',
    },
    deroule: [
      { titre: { fr: '1. Un matin, l’envahisseur', it: '1. Una mattina, l’invasore', en: '1. One morning, the invader' },
        texte: { fr: 'Le chant s’ouvre sur un réveil : celui qui parle se lève et trouve le pays occupé. Tout part de là — un homme ordinaire, un matin ordinaire, et une décision à prendre.', it: 'Il canto si apre su un risveglio: chi parla si alza e trova il paese occupato. Tutto parte da lì.', en: 'The song opens on a waking: the speaker gets up and finds the country occupied. Everything follows from that.' } },
      { titre: { fr: '2. L’adieu, en refrain', it: '2. L’addio, nel ritornello', en: '2. The farewell, as refrain' },
        texte: { fr: 'Entre chaque couplet revient le même adieu, répété jusqu’à devenir une scansion. C’est ce retour qui fait qu’on retient la chanson sans l’avoir apprise — et qui la rend chantable à mille.', it: 'Tra una strofa e l’altra torna lo stesso addio, ripetuto fino a diventare una scansione. È questo che la rende cantabile in mille.', en: 'Between each verse the same farewell returns, repeated until it becomes a beat. That is why you remember it without learning it — and why a thousand people can sing it together.' } },
      { titre: { fr: '3. Emmène-moi', it: '3. Portami via', en: '3. Take me away' },
        texte: { fr: 'Il demande au partisan de l’emmener : c’est le moment où il choisit de partir se battre. La formule est un impératif avec le pronom collé au verbe — très italien, impossible en français.', it: 'Chiede al partigiano di portarlo via: è il momento in cui sceglie di partire. È un imperativo con il pronome attaccato al verbo.', en: 'He asks the partisan to take him along: the moment he chooses to go and fight. It is an imperative with the pronoun attached to the verb — very Italian.' } },
      { titre: { fr: '4. S’il meurt', it: '4. Se muore', en: '4. If he dies' },
        texte: { fr: 'Il envisage sa mort et laisse ses instructions : qu’on l’enterre à la montagne. Le chant ne promet aucune victoire — il regarde en face ce qu’il peut en coûter, et c’est ce qui le rend grave plutôt que martial.', it: 'Immagina la propria morte e lascia le sue istruzioni: che lo seppelliscano in montagna. Il canto non promette nessuna vittoria.', en: 'He imagines his own death and leaves instructions: bury him up in the mountains. The song promises no victory — it looks the cost in the face.' } },
      { titre: { fr: '5. La fleur, et ceux qui passeront', it: '5. Il fiore, e chi passerà', en: '5. The flower, and those who will pass' },
        texte: { fr: 'Sur la tombe pousse une fleur, et les passants la remarqueront. Ces derniers couplets sont au futur : la chanson finit sur ce qui viendra après, pas sur celui qui meurt. Le dernier mot est « liberté ».', it: 'Sulla tomba nasce un fiore, e chi passa lo noterà. Le ultime strofe sono al futuro: finisce su ciò che verrà dopo. L’ultima parola è « libertà ».', en: 'A flower grows on the grave, and passers-by will notice it. These last verses are in the future: the song ends on what comes after. Its last word is “freedom”.' } },
    ],
  },
  {
    id: 'litaliano',
    titre: 'L’italiano',
    auteur: 'Toto Cutugno',
    annee: '1983',
    lien: 'https://it.wikipedia.org/wiki/L%27italiano_(brano_musicale)',
    genre: 'auteur',
    spotify: 'https://open.spotify.com/track/2S7RApTsKT0CtYojYq2cKz',
    mots: [
      { it: 'lasciare', pron: 'la·SCIA·re', sens: { fr: 'laisser — « lasciatemi » veut dire « laissez-moi »', it: 'permettere: « lasciatemi » vale « permettetemi »', en: 'to let — “lasciatemi” means “let me”' } },
      { it: 'cantare', pron: 'can·TA·re', sens: { fr: 'chanter', it: 'cantare', en: 'to sing' } },
      { it: 'la chitarra', pron: 'la chi·TAR·ra', sens: { fr: 'la guitare — attention, « chi » se dit ki', it: 'strumento a corde', en: 'the guitar — note that “chi” sounds like ki' } },
      { it: 'orgoglioso', pron: 'or·go·GLIO·so', sens: { fr: 'fier', it: 'che prova orgoglio', en: 'proud' } },
      { it: 'la mano', pron: 'la MA·no', sens: { fr: 'la main — un des rares mots en -o qui soit féminin', it: 'una delle poche parole in -o femminili', en: 'the hand — one of the rare -o words that is feminine' } },
      { it: 'buongiorno Italia', pron: 'buon·GIOR·no i·TA·lia', sens: { fr: 'bonjour l’Italie — la formule qui ouvre la chanson', it: 'la formula che apre la canzone', en: 'good morning Italy — the phrase that opens the song' } },
      { it: 'il mattino', pron: 'il mat·TI·no', sens: { fr: 'le matin', it: 'la prima parte del giorno', en: 'the morning' } },
      { it: 'il presidente', pron: 'il pre·si·DEN·te', sens: { fr: 'le président', it: 'chi guida uno Stato', en: 'the president' } },
      { it: 'partigiano', pron: 'par·ti·GIA·no', sens: { fr: 'partisan — le mot revient d’une chanson à l’autre', it: 'la parola torna da una canzone all’altra', en: 'partisan — the word travels from one song to the next' } },
      { it: 'il cappellino', pron: 'il cap·pel·LI·no', sens: { fr: 'le petit chapeau — le diminutif en -ino est partout en italien', it: 'il diminutivo in -ino è ovunque in italiano', en: 'the little hat — the -ino diminutive is everywhere in Italian' } },
      { it: 'la bandiera', pron: 'la ban·DIE·ra', sens: { fr: 'le drapeau', it: 'il vessillo', en: 'the flag' } },
      { it: 'la televisione', pron: 'la te·le·vi·SIO·ne', sens: { fr: 'la télévision', it: 'la TV', en: 'television' } },
      { it: 'il canto', pron: 'il CAN·to', sens: { fr: 'le chant', it: 'quello che si canta', en: 'the singing, the song' } },
      { it: 'l’amore', pron: 'la·MO·re', sens: { fr: 'l’amour — masculin en italien', it: 'in italiano è maschile', en: 'love — masculine in Italian' } },
      { it: 'il cuore', pron: 'il CUO·re', sens: { fr: 'le cœur', it: 'l’organo, e il sentimento', en: 'the heart' } },
      { it: 'la mamma', pron: 'la MAM·ma', sens: { fr: 'la maman — mot central de la chanson comme de l’Italie', it: 'parola centrale della canzone', en: 'mum — as central to the song as to Italy' } },
      { it: 'il caffè', pron: 'il caf·FÈ', sens: { fr: 'le café — celui du bar, serré', it: 'l’espresso del bar', en: 'coffee — the short one, at the bar' } },
      { it: 'vero', pron: 'VE·ro', sens: { fr: 'vrai — « un vero italiano »', it: '« un vero italiano »', en: 'true, real — “un vero italiano”' } },
      { it: 'sognare', pron: 'so·GNA·re', sens: { fr: 'rêver', it: 'fare sogni', en: 'to dream' } },
      { it: 'troppo', pron: 'TROP·po', sens: { fr: 'trop', it: 'più del necessario', en: 'too much' } },
    ],
    langue: {
      fr: 'Elle enseigne l’impératif de politesse au pluriel : lasciatemi, c’est « laissez-moi », avec le pronom collé au verbe. C’est très italien — en français on le mettrait devant.',
      it: 'Insegna l’imperativo con il pronome attaccato al verbo: lasciatemi. Molto italiano.',
      en: 'It teaches the plural imperative with the pronoun stuck onto the verb: lasciatemi. Very Italian — French and English would put it in front.',
    },
    deroule: [
      { titre: { fr: '1. Bonjour l’Italie', it: '1. Buongiorno Italia', en: '1. Good morning Italy' },
        texte: { fr: 'La chanson s’ouvre en saluant le pays, puis enchaîne une série d’images de la vie italienne — ce qu’on mange, ce qu’on boit, ce qu’on regarde. Un inventaire, pas un récit : c’est un portrait par accumulation.', it: 'La canzone si apre salutando il paese, poi allinea immagini della vita italiana. Un inventario più che un racconto: un ritratto per accumulo.', en: 'The song opens by greeting the country, then lines up images of Italian life — what people eat, drink, watch. An inventory rather than a story: a portrait by accumulation.' } },
      { titre: { fr: '2. Les contradictions', it: '2. Le contraddizioni', en: '2. The contradictions' },
        texte: { fr: 'Cutugno met côte à côte ce dont on est fier et ce dont on l’est moins. Le personnage n’est pas idéalisé : c’est ce mélange qui fait que tout le monde s’y reconnaît, y compris hors d’Italie.', it: 'Cutugno mette accanto ciò di cui si è fieri e ciò di cui lo si è meno. Il personaggio non è idealizzato: per questo tutti ci si riconoscono.', en: 'Cutugno sets what Italians are proud of beside what they are less proud of. The character is not idealised — which is why everyone recognises themselves in him.' } },
      { titre: { fr: '3. Le refrain : laissez-moi chanter', it: '3. Il ritornello: lasciatemi cantare', en: '3. The refrain: let me sing' },
        texte: { fr: 'La demande est modeste — qu’on le laisse chanter, guitare en main, parce qu’il est italien. C’est la phrase que le monde entier connaît, et grammaticalement la plus intéressante de la chanson : « lasciatemi » colle le pronom au verbe.', it: 'La richiesta è modesta: che lo lascino cantare, con la chitarra in mano, perché è italiano. È la frase che tutti conoscono, e la più interessante dal punto di vista grammaticale.', en: 'The request is modest — let him sing, guitar in hand, because he is Italian. It is the line the whole world knows, and grammatically the most interesting: “lasciatemi” attaches the pronoun to the verb.' } },
    ],
  },
  {
    id: 'via-con-me',
    titre: 'Via con me',
    auteur: 'Paolo Conte',
    annee: '1981',
    lien: 'https://it.wikipedia.org/wiki/Via_con_me',
    genre: 'auteur',
    spotify: 'https://open.spotify.com/track/751bsmv3KNPrytbCUdzQJN',
    mots: [
      { it: 'via', pron: 'VI·a', sens: { fr: 'au loin, partons — le même mot veut dire « rue »', it: 'lontano, andiamo — e anche « strada »', en: 'away, let’s go — the same word also means “street”' } },
      { it: 'con me', pron: 'con ME', sens: { fr: 'avec moi', it: 'insieme a me', en: 'with me' } },
      { it: 'gli uomini', pron: 'gli UO·mi·ni', sens: { fr: 'les hommes — pluriel irrégulier de « uomo »', it: 'plurale irregolare di uomo', en: 'the men — irregular plural of “uomo”' } },
      { it: 'perdere', pron: 'PER·de·re', sens: { fr: 'perdre', it: 'non trovare più', en: 'to lose' } },
      { it: 'la notte', pron: 'la NOT·te', sens: { fr: 'la nuit', it: 'quando è buio', en: 'the night' } },
      { it: 'meraviglioso', pron: 'me·ra·vi·GLIO·so', sens: { fr: 'merveilleux — ce que « wonderful » dit en italien', it: 'ciò che « wonderful » dice in italiano', en: 'wonderful — what the English word says in Italian' } },
      { it: 'andare', pron: 'an·DA·re', sens: { fr: 'aller, partir', it: 'muoversi verso', en: 'to go' } },
      { it: 'il locale', pron: 'il lo·CA·le', sens: { fr: 'le bar, l’endroit où l’on sort le soir', it: 'il posto dove si esce la sera', en: 'the bar, the place you go out to' } },
      { it: 'l’America', pron: 'la·ME·ri·ca', sens: { fr: 'l’Amérique — l’ailleurs rêvé de toute une génération', it: 'l’altrove sognato di una generazione', en: 'America — the imagined elsewhere of a whole generation' } },
      { it: 'il tempo', pron: 'il TEM·po', sens: { fr: 'le temps — celui qui passe, et aussi la météo', it: 'quello che passa, e anche il meteo', en: 'time — and also the weather' } },
      { it: 'la stagione', pron: 'la sta·GIO·ne', sens: { fr: 'la saison', it: 'primavera, estate…', en: 'the season' } },
      { it: 'ridere', pron: 'RI·de·re', sens: { fr: 'rire', it: 'fare una risata', en: 'to laugh' } },
      { it: 'guardare', pron: 'guar·DA·re', sens: { fr: 'regarder', it: 'posare lo sguardo', en: 'to look at' } },
      { it: 'ballare', pron: 'bal·LA·re', sens: { fr: 'danser', it: 'muoversi a ritmo', en: 'to dance' } },
      { it: 'il mondo', pron: 'il MON·do', sens: { fr: 'le monde', it: 'tutto quanto', en: 'the world' } },
      { it: 'strano', pron: 'STRA·no', sens: { fr: 'étrange, bizarre', it: 'insolito', en: 'strange' } },
      { it: 'dolce', pron: 'DOL·ce', sens: { fr: 'doux, sucré — les deux à la fois', it: 'sia di sapore sia di modi', en: 'sweet, gentle — both at once' } },
      { it: 'insieme', pron: 'in·SIE·me', sens: { fr: 'ensemble', it: 'l’uno con l’altro', en: 'together' } },
      { it: 'lontano', pron: 'lon·TA·no', sens: { fr: 'loin', it: 'non vicino', en: 'far away' } },
    ],
    langue: {
      fr: 'Elle montre l’impératif de l’invitation, celui qu’on emploie entre amis, et le pluriel irrégulier uomo → uomini. Écoutez-la surtout pour le rythme : Conte avale les syllabes comme on parle vraiment.',
      it: 'Mostra l’imperativo dell’invito e il plurale irregolare uomo → uomini. Ascoltatela per il ritmo: Conte mangia le sillabe come si fa parlando.',
      en: 'It shows the inviting imperative and the irregular plural uomo → uomini. Listen to it above all for the rhythm: Conte swallows syllables the way people really speak.',
    },
    deroule: [
      { titre: { fr: '1. L’invitation', it: '1. L’invito', en: '1. The invitation' },
        texte: { fr: 'Tout tient dans le titre : viens avec moi, partons. Conte ne dit ni où ni pourquoi — l’invitation reste ouverte, et c’est ce qui la rend séduisante plutôt que pressante.', it: 'Tutto sta nel titolo: vieni con me, andiamo. Conte non dice né dove né perché: l’invito resta aperto.', en: 'It is all in the title: come with me, let us go. Conte never says where or why — the invitation stays open, which is what makes it seductive rather than pressing.' } },
      { titre: { fr: '2. L’anglais au milieu de l’italien', it: '2. L’inglese dentro l’italiano', en: '2. English inside the Italian' },
        texte: { fr: 'Au milieu du morceau surgit une exclamation en anglais. Elle n’est pas là par hasard : dans l’Italie de 1981, l’anglais c’est le cinéma, l’Amérique, l’ailleurs. Conte s’en sert avec ironie autant qu’avec tendresse.', it: 'A metà brano spunta un’esclamazione in inglese. Non è casuale: nell’Italia del 1981 l’inglese è il cinema, l’America, l’altrove.', en: 'Halfway through, an English exclamation appears. It is not an accident: in the Italy of 1981, English meant cinema, America, elsewhere. Conte uses it with irony and tenderness at once.' } },
      { titre: { fr: '3. Le rythme plutôt que les mots', it: '3. Il ritmo più delle parole', en: '3. Rhythm over words' },
        texte: { fr: 'Écoutez-la d’abord pour la voix et la scansion. Conte avale les syllabes comme on le fait en parlant vraiment — c’est un excellent exercice d’oreille, bien plus utile qu’un texte lu lentement.', it: 'Ascoltatela prima per la voce e la scansione. Conte mangia le sillabe come si fa parlando davvero: ottimo esercizio d’orecchio.', en: 'Listen first for the voice and the beat. Conte swallows syllables the way people really do when speaking — a far better ear exercise than a text read slowly.' } },
    ],
  },
  {
    /*
     * Les trois suivantes viennent de Mag, par leurs liens Spotify. Titres et
     * interpretes releves sur Spotify meme, pas devines : « 1908 » est de Tony
     * Canto, « Gnè, Gnè » de Giorgio Conte — le frere de Paolo —, « Storia
     * d'emigrante » de Teresa Merante.
     */
    id: 'mille-novecento-otto',
    titre: '1908',
    auteur: 'Tony Canto',
    annee: '2016',
    genre: 'sicile',
    lien: 'https://it.wikipedia.org/wiki/Terremoto_di_Messina_del_1908',
    spotify: 'https://open.spotify.com/track/19wxP8pv3sRzp7hiwd8GSq',
    quoi: {
      fr: 'Tony Canto est de Messine, et 1908 est la date qui hante sa ville : le tremblement de terre qui l’a rasée, le plus meurtrier de l’histoire européenne. Il en a fait une chanson — sur la peur qui reste, longtemps après, et qui décourage d’entreprendre.',
      it: 'Tony Canto è di Messina, e il 1908 è la data che pesa sulla sua città: il terremoto che la rase al suolo. Ne ha fatto una canzone sulla paura che resta, molto dopo.',
      en: 'Tony Canto is from Messina, and 1908 is the date that haunts his city: the earthquake that levelled it, the deadliest in European history. He turned it into a song about the fear that lingers long afterwards.',
    },
    mots: [
      { it: 'il terremoto', pron: 'il ter·re·MO·to', sens: { fr: 'le tremblement de terre', it: 'la scossa che fa crollare', en: 'the earthquake' } },
      { it: 'la paura', pron: 'la pa·U·ra', sens: { fr: 'la peur', it: 'quello che si prova davanti al pericolo', en: 'fear' } },
      { it: 'la città', pron: 'la cit·TÀ', sens: { fr: 'la ville — accent écrit sur la dernière syllabe', it: 'accento scritto sull’ultima sillaba', en: 'the city — written accent on the last syllable' } },
      { it: 'crollare', pron: 'crol·LA·re', sens: { fr: 's’effondrer', it: 'venire giù', en: 'to collapse' } },
      { it: 'ricostruire', pron: 'ri·co·stru·I·re', sens: { fr: 'reconstruire — le préfixe ri- veut dire « de nouveau »', it: 'il prefisso ri- vuol dire « di nuovo »', en: 'to rebuild — the ri- prefix means “again”' } },
      { it: 'la memoria', pron: 'la me·MO·ria', sens: { fr: 'la mémoire, le souvenir', it: 'quello che non si dimentica', en: 'memory' } },
      { it: 'il mare', pron: 'il MA·re', sens: { fr: 'la mer — le détroit, à Messine', it: 'lo Stretto, a Messina', en: 'the sea — the strait, at Messina' } },
    ],
    langue: {
      fr: 'Le préfixe ri- est partout en italien et se comprend d’un coup : ricostruire, rivedere, ripetere. Une fois qu’on l’a repéré, on devine des dizaines de verbes sans les avoir appris.',
      it: 'Il prefisso ri- è ovunque: ricostruire, rivedere, ripetere. Una volta capito, si indovinano decine di verbi.',
      en: 'The ri- prefix is everywhere in Italian and clicks at once: ricostruire, rivedere, ripetere. Spot it and you can guess dozens of verbs you never learnt.',
    },
  },
  {
    id: 'storia-emigrante',
    titre: 'Storia d’emigrante',
    auteur: 'Teresa Merante',
    annee: '2006',
    genre: 'sicile',
    lien: 'https://it.wikipedia.org/wiki/Emigrazione_italiana',
    spotify: 'https://open.spotify.com/track/2NwTGJmolMEE649cbsvnAo',
    quoi: {
      fr: 'L’histoire d’un émigrant — celle de millions d’Italiens du Sud partis chercher du travail ailleurs, et celle de cette maison : Salvatore est parti pour la Belgique à dix-neuf ans.',
      it: 'La storia di un emigrante — quella di milioni di meridionali partiti a cercare lavoro altrove, e quella di questa casa.',
      en: 'The story of an emigrant — that of millions of southern Italians who left to find work elsewhere, and the story of this house too.',
    },
    mots: [
      { it: 'l’emigrante', pron: 'le·mi·GRAN·te', sens: { fr: 'l’émigrant — celui qui part ; celui qui arrive, c’est l’immigrato', it: 'chi parte; chi arriva è l’immigrato', en: 'the emigrant — the one who leaves; the one who arrives is immigrato' } },
      { it: 'la valigia', pron: 'la va·LI·gia', sens: { fr: 'la valise — celle en carton, dans toutes les photos de l’époque', it: 'quella di cartone, nelle foto dell’epoca', en: 'the suitcase — the cardboard one, in every photo of the period' } },
      { it: 'partire', pron: 'par·TI·re', sens: { fr: 'partir', it: 'andare via', en: 'to leave' } },
      { it: 'tornare', pron: 'tor·NA·re', sens: { fr: 'revenir — le verbe de tous ceux qui espéraient rentrer', it: 'il verbo di chi sperava di rientrare', en: 'to come back — the verb of everyone who hoped to return' } },
      { it: 'il lavoro', pron: 'il la·VO·ro', sens: { fr: 'le travail', it: 'l’impiego', en: 'work' } },
      { it: 'la terra', pron: 'la TER·ra', sens: { fr: 'la terre — le pays qu’on quitte', it: 'il paese che si lascia', en: 'the land — the country you leave' } },
      { it: 'lontano', pron: 'lon·TA·no', sens: { fr: 'loin', it: 'non vicino', en: 'far away' } },
      { it: 'la nostalgia', pron: 'la no·stal·GI·a', sens: { fr: 'la nostalgie, le mal du pays', it: 'il rimpianto di casa', en: 'homesickness' } },
    ],
    langue: {
      fr: 'Le titre montre l’élision : di emigrante devient d’emigrante. L’italien fait sauter la voyelle devant une autre voyelle, comme le français — c’est ce qui donne l’apostrophe.',
      it: 'Il titolo mostra l’elisione: di emigrante diventa d’emigrante.',
      en: 'The title shows elision: di emigrante becomes d’emigrante. Italian drops the vowel before another vowel, as French does — hence the apostrophe.',
    },
  },
  {
    id: 'gne-gne',
    titre: 'Gnè, Gnè',
    auteur: 'Giorgio Conte',
    annee: '2003',
    genre: 'auteur',
    lien: 'https://it.wikipedia.org/wiki/Giorgio_Conte',
    spotify: 'https://open.spotify.com/track/2qvOr9G3WEjRsuEDWf7KnO',
    quoi: {
      fr: 'Giorgio Conte est le frère de Paolo, et son titre n’est pas un mot : « gnè gnè » est l’onomatopée de la moquerie, ce qu’on lance en imitant quelqu’un. Le genre de chose qu’aucun manuel n’enseigne, et qu’on entend partout.',
      it: 'Giorgio Conte è il fratello di Paolo, e il titolo non è una parola: « gnè gnè » è l’onomatopea della presa in giro.',
      en: 'Giorgio Conte is Paolo’s brother, and his title is not a word: “gnè gnè” is the sound of mockery. The kind of thing no textbook teaches and everyone uses.',
    },
    mots: [
      { it: 'gnè gnè', pron: 'GNÈ GNÈ', sens: { fr: 'na na nère — l’onomatopée de la moquerie', it: 'l’onomatopea della presa in giro', en: 'nyah nyah — the sound of mockery' } },
      { it: 'prendere in giro', pron: 'PREN·de·re in GI·ro', sens: { fr: 'se moquer de quelqu’un — mot à mot, « prendre en rond »', it: 'burlarsi di qualcuno', en: 'to make fun of someone — literally “to take around”' } },
      { it: 'scherzare', pron: 'scher·ZA·re', sens: { fr: 'plaisanter', it: 'non dire sul serio', en: 'to joke' } },
      { it: 'ridere', pron: 'RI·de·re', sens: { fr: 'rire', it: 'fare una risata', en: 'to laugh' } },
      { it: 'il fratello', pron: 'il fra·TEL·lo', sens: { fr: 'le frère — celui de Paolo Conte, justement', it: 'quello di Paolo Conte, appunto', en: 'the brother — Paolo Conte’s, as it happens' } },
      { it: 'la canzone', pron: 'la can·ZO·ne', sens: { fr: 'la chanson', it: 'quello che si canta', en: 'the song' } },
    ],
    langue: {
      fr: 'Les onomatopées sont une langue à part, et elles ne se traduisent pas : boh (aucune idée), mah (dubitatif), uffa (ras-le-bol), magari (si seulement !). En apprendre quatre vous fera passer pour quelqu’un qui parle vraiment.',
      it: 'Le onomatopee sono una lingua a parte: boh, mah, uffa, magari. Impararne quattro fa una gran differenza.',
      en: 'Interjections are a language of their own and do not translate: boh (no idea), mah (doubtful), uffa (fed up), magari (if only!). Learn four and you will sound like someone who really speaks.',
    },
  },
  {
    id: 'parla-piu-piano',
    titre: 'Parla più piano',
    auteur: 'Gianni Morandi',
    annee: '1972',
    genre: 'auteur',
    lien: 'https://it.wikipedia.org/wiki/Il_padrino_(film)',
    spotify: 'https://open.spotify.com/track/4e7rkCd5zwHoSlDD2E3woW',
    quoi: {
      fr: 'La mélodie du Parrain, chantée en italien. Nino Rota l’avait écrite pour le film ; Morandi lui a donné des mots — « parle plus bas », dit le titre, et c’est une chanson d’amour murmurée, pas une histoire de mafia.',
      it: 'La melodia del Padrino, cantata in italiano. Nino Rota l’aveva scritta per il film; Morandi le ha dato le parole. È una canzone d’amore sussurrata, non una storia di mafia.',
      en: 'The Godfather theme, sung in Italian. Nino Rota wrote it for the film; Morandi gave it words. “Speak more softly”, says the title — a whispered love song, not a mafia story.',
    },
    mots: [
      { it: 'parlare', pron: 'par·LA·re', sens: { fr: 'parler — « parla » à l’impératif : parle', it: '« parla » all’imperativo', en: 'to speak — “parla” is the imperative: speak' } },
      { it: 'più', pron: 'PIÙ', sens: { fr: 'plus — le comparatif se fait avec ce seul mot', it: 'il comparativo si fa con questa parola', en: 'more — the comparative is made with this one word' } },
      { it: 'piano', pron: 'PIA·no', sens: { fr: 'doucement, bas — et aussi « lentement », et « l’étage »', it: 'a voce bassa; e anche « lentamente », e il piano di un edificio', en: 'softly, quietly — and also “slowly”, and “floor” of a building' } },
      { it: 'nessuno', pron: 'nes·SU·no', sens: { fr: 'personne, aucun', it: 'nemmeno uno', en: 'nobody, no one' } },
      { it: 'sentire', pron: 'sen·TI·re', sens: { fr: 'entendre — et sentir : le même verbe pour les deux', it: 'udire, e anche provare', en: 'to hear — and to feel: the same verb for both' } },
      { it: 'l’amore', pron: 'la·MO·re', sens: { fr: 'l’amour', it: 'il sentimento', en: 'love' } },
      { it: 'la notte', pron: 'la NOT·te', sens: { fr: 'la nuit', it: 'quando è buio', en: 'the night' } },
      { it: 'vicino', pron: 'vi·CI·no', sens: { fr: 'près, proche — le contraire de lontano', it: 'il contrario di lontano', en: 'near, close — the opposite of lontano' } },
    ],
    langue: {
      fr: 'Le comparatif italien tient en un mot : più. Plus doucement, più piano ; plus loin, più lontano ; plus beau, più bello. Aucune exception à retenir — l’une des choses les plus faciles de la langue.',
      it: 'Il comparativo si fa con « più »: più piano, più lontano, più bello. Nessuna eccezione.',
      en: 'The Italian comparative is one word: più. More softly, più piano; further, più lontano; more beautiful, più bello. No exceptions — one of the easiest things in the language.',
    },
  },
  {
    id: 'mi-sono-innamorato',
    titre: 'Mi sono innamorato di te',
    auteur: 'Luigi Tenco',
    annee: '1962',
    genre: 'auteur',
    lien: 'https://it.wikipedia.org/wiki/Mi_sono_innamorato_di_te',
    spotify: 'https://open.spotify.com/track/2mk42YyKT2pV4Kbc78lSVU',
    quoi: {
      fr: 'Tenco chante l’amour sans emphase, presque à contrecœur — le titre dit « je suis tombé amoureux de toi », et la chanson explique surtout qu’il n’avait rien demandé. Cette pudeur-là a fait école : c’est l’acte de naissance de la chanson d’auteur italienne.',
      it: 'Tenco canta l’amore senza enfasi, quasi controvoglia. Quel pudore ha fatto scuola: è l’atto di nascita della canzone d’autore italiana.',
      en: 'Tenco sings about love without emphasis, almost reluctantly — the title says “I have fallen in love with you”, and the song mostly explains that he had not asked for it. That restraint founded the Italian singer-songwriter tradition.',
    },
    mots: [
      { it: 'innamorarsi', pron: 'in·na·mo·RAR·si', sens: { fr: 'tomber amoureux — verbe pronominal, comme en français', it: 'verbo riflessivo', en: 'to fall in love — a reflexive verb, as in French' } },
      { it: 'mi sono innamorato', pron: 'mi SO·no in·na·mo·RA·to', sens: { fr: 'je suis tombé amoureux — une femme dirait innamorata', it: 'al femminile: innamorata', en: 'I have fallen in love — a woman would say innamorata' } },
      { it: 'di te', pron: 'di TE', sens: { fr: 'de toi', it: 'della tua persona', en: 'with you' } },
      { it: 'perché', pron: 'per·CHÉ', sens: { fr: 'parce que — et aussi pourquoi : le même mot pour les deux', it: 'la stessa parola per la domanda e per la risposta', en: 'because — and also why: the same word for both' } },
      { it: 'la sera', pron: 'la SE·ra', sens: { fr: 'le soir', it: 'la fine del giorno', en: 'the evening' } },
      { it: 'la noia', pron: 'la NO·ia', sens: { fr: 'l’ennui — un mot très présent chez Tenco', it: 'parola molto presente in Tenco', en: 'boredom — a word that runs through Tenco’s work' } },
      { it: 'niente', pron: 'NIEN·te', sens: { fr: 'rien', it: 'nessuna cosa', en: 'nothing' } },
      { it: 'il cuore', pron: 'il CUO·re', sens: { fr: 'le cœur', it: 'l’organo, e il sentimento', en: 'the heart' } },
    ],
    langue: {
      fr: 'Le titre est un passé composé pronominal : mi sono innamorato. Avec un verbe pronominal, l’auxiliaire est toujours essere, et le participe s’accorde — innamorato pour un homme, innamorata pour une femme. C’est la règle qui trahit le plus les débutants.',
      it: 'Il titolo è un passato prossimo riflessivo: l’ausiliare è sempre essere e il participio si accorda — innamorato, innamorata.',
      en: 'The title is a reflexive past tense: mi sono innamorato. With reflexive verbs the auxiliary is always essere, and the participle agrees — innamorato for a man, innamorata for a woman. The rule that catches out beginners most.',
    },
  },
  {
    /*
     * La premiere chanson du site en SICILIEN, et non en italien. Elle merite
     * d'y etre : c'est la langue qu'on entend vraiment au village, celle des
     * grands-parents, et le titre est d'abord un dicton — un de ceux que tout
     * le monde connait dans la region de Messine.
     */
    id: 'mamma-cicciu',
    titre: 'Mamma Cicciu mi tocca',
    auteur: 'Santina Romeo',
    annee: 'Traditionnel',
    genre: 'sicile',
    lien: 'https://scn.wikipedia.org/wiki/Mamma_Ciccu_mi_tocca_%E2%80%93_T%C3%B2cchimi_Ciccu_ca_a_mamma_non_c%E2%80%99%C3%A8',
    spotify: 'https://open.spotify.com/track/24XNWvFJHxwAmUQOVxT4UF',
    quoi: {
      fr: 'Un dicton de la région de Messine, devenu chanson. Il moque celui qui se plaint tout haut de ce qu’il cherche tout bas : on proteste d’abord, puis on redemande dès que personne ne regarde. Toute la malice sicilienne tient dans ce renversement.',
      it: 'Un detto della zona di Messina, diventato canzone. Prende in giro chi si lamenta ad alta voce di ciò che in realtà cerca: prima si protesta, poi si richiede appena nessuno guarda.',
      en: 'A saying from around Messina, turned into a song. It mocks the person who loudly complains about what they quietly want: first you protest, then you ask again the moment nobody is watching.',
    },
    mots: [
      { it: 'la mamma', pron: 'la MAM·ma', sens: { fr: 'la maman — même mot en sicilien et en italien', it: 'stessa parola in siciliano e in italiano', en: 'mum — the same word in Sicilian and Italian' } },
      { it: 'Cicciu', pron: 'CIC·ciu', sens: { fr: 'Cicciu — le diminutif sicilien de Francesco, comme Ciccio en italien', it: 'diminutivo siciliano di Francesco', en: 'Cicciu — the Sicilian nickname for Francesco' } },
      { it: 'toccare', pron: 'toc·CA·re', sens: { fr: 'toucher — « mi tocca », il me touche', it: '« mi tocca »: mi sta toccando', en: 'to touch — “mi tocca”, he is touching me' } },
      { it: 'lamentarsi', pron: 'la·men·TAR·si', sens: { fr: 'se plaindre — verbe pronominal, comme innamorarsi', it: 'verbo riflessivo, come innamorarsi', en: 'to complain — reflexive, like innamorarsi' } },
      { it: 'il detto', pron: 'il DET·to', sens: { fr: 'le dicton, le proverbe', it: 'il proverbio', en: 'the saying, the proverb' } },
      { it: 'non c’è', pron: 'non CÈ', sens: { fr: 'il n’y a pas, elle n’est pas là — la tournure la plus utile de la langue', it: 'la formula più utile della lingua', en: 'there is not, she is not here — the most useful little phrase in the language' } },
    ],
    langue: {
      fr: 'Le sicilien n’est pas un accent, c’est une langue à part, avec sa grammaire et son Wikipédia. On l’entend au village bien plus que l’italien de la télévision : ici on dit tocchimi là où l’italien dirait toccami. Repérer ces petits écarts, c’est comprendre ce qui se dit autour de soi.',
      it: 'Il siciliano non è un accento ma una lingua a sé, con la sua grammatica: qui si dice tocchimi dove l’italiano direbbe toccami.',
      en: 'Sicilian is not an accent but a language of its own, with its own grammar and its own Wikipedia. You hear it in the village far more than television Italian: here they say tocchimi where Italian would say toccami.',
    },
  },
  {
    id: 'ancora-tu',
    titre: 'Ancora tu',
    auteur: 'Lucio Battisti',
    annee: '1976',
    genre: 'auteur',
    lien: 'https://it.wikipedia.org/wiki/Ancora_tu',
    spotify: 'https://open.spotify.com/track/5vghFB2WeXjQaF8FtMDJja',
    quoi: {
      fr: 'Battisti est à la chanson italienne ce que les Beatles sont à l’anglaise : tout le monde connaît les mélodies, même sans savoir de qui elles sont. Le titre dit « encore toi » — quelqu’un revient, et on ne sait pas encore si c’est une bonne nouvelle.',
      it: 'Battisti è alla canzone italiana ciò che i Beatles sono a quella inglese. Il titolo dice « ancora tu »: qualcuno torna, e non si sa ancora se sia una buona notizia.',
      en: 'Battisti is to Italian song what the Beatles are to English song. The title says “you again” — someone comes back, and you cannot yet tell if that is good news.',
    },
    mots: [
      { it: 'ancora', pron: 'an·CO·ra', sens: { fr: 'encore — et aussi « toujours », et « pas encore » avec non', it: 'di nuovo; e anche « tuttora »', en: 'again — and also “still”, and “not yet” with non' } },
      { it: 'tornare', pron: 'tor·NA·re', sens: { fr: 'revenir', it: 'venire di nuovo', en: 'to come back' } },
      { it: 'insieme', pron: 'in·SIE·me', sens: { fr: 'ensemble', it: 'l’uno con l’altro', en: 'together' } },
      { it: 'meglio', pron: 'ME·glio', sens: { fr: 'mieux — irrégulier : ce n’est pas « più bene »', it: 'irregolare: non si dice « più bene »', en: 'better — irregular: not “più bene”' } },
      { it: 'stanco', pron: 'STAN·co', sens: { fr: 'fatigué', it: 'senza forze', en: 'tired' } },
      { it: 'davvero', pron: 'dav·VE·ro', sens: { fr: 'vraiment', it: 'sul serio', en: 'really' } },
      { it: 'la voglia', pron: 'la VO·glia', sens: { fr: 'l’envie — « ho voglia di », j’ai envie de', it: '« ho voglia di »', en: 'the desire — “ho voglia di”, I feel like' } },
    ],
    langue: {
      fr: 'Attention à « ancora » : selon la phrase, il veut dire encore, toujours, ou — avec non — pas encore. Non è ancora pronto : ce n’est pas encore prêt. Un mot, trois usages, et c’est le contexte qui tranche.',
      it: 'Attenzione ad « ancora »: vale di nuovo, tuttora, e — con non — non ancora. Non è ancora pronto.',
      en: 'Watch out for “ancora”: depending on the sentence it means again, still, or — with non — not yet. Non è ancora pronto: it is not ready yet.',
    },
  },
  {
    id: 'giovanni-telegrafista',
    titre: 'Giovanni telegrafista',
    auteur: 'Enzo Jannacci',
    annee: '1968',
    genre: 'auteur',
    lien: 'https://it.wikipedia.org/wiki/Enzo_Jannacci',
    spotify: 'https://open.spotify.com/track/48yS5o8UlNiAeoieuKuJJd',
    quoi: {
      fr: 'Jannacci était cardiologue le jour et chanteur le soir, et il a passé sa vie à raconter les petites gens de Milan — les clochards, les manœuvres, les employés. Ici c’est un télégraphiste. Personne n’a fait rire et pleurer les mêmes gens avec autant de tendresse.',
      it: 'Jannacci era cardiologo di giorno e cantante di sera, e ha passato la vita a raccontare la gente piccola di Milano. Qui è un telegrafista.',
      en: 'Jannacci was a cardiologist by day and a singer by night, and spent his life telling the stories of Milan’s small people. Here it is a telegraph operator.',
    },
    mots: [
      { it: 'il telegrafista', pron: 'il te·le·gra·FI·sta', sens: { fr: 'le télégraphiste — les noms en -ista sont masculins ou féminins sans changer', it: 'i nomi in -ista valgono per entrambi i generi', en: 'the telegraph operator — nouns in -ista are the same for both genders' } },
      { it: 'il lavoro', pron: 'il la·VO·ro', sens: { fr: 'le travail', it: 'l’impiego', en: 'work' } },
      { it: 'solo', pron: 'SO·lo', sens: { fr: 'seul — et aussi « seulement »', it: 'da solo; e anche « soltanto »', en: 'alone — and also “only”' } },
      { it: 'il messaggio', pron: 'il mes·SAG·gio', sens: { fr: 'le message', it: 'quello che si trasmette', en: 'the message' } },
      { it: 'aspettare', pron: 'a·spet·TA·re', sens: { fr: 'attendre — sans préposition : aspetto te, je t’attends', it: 'senza preposizione: aspetto te', en: 'to wait for — no preposition: aspetto te, I am waiting for you' } },
      { it: 'la gente', pron: 'la GEN·te', sens: { fr: 'les gens — singulier en italien', it: 'in italiano è singolare', en: 'people — singular in Italian' } },
      { it: 'povero', pron: 'PO·ve·ro', sens: { fr: 'pauvre — avant le nom, il veut dire « qui fait pitié »', it: 'prima del nome vuol dire « che fa pena »', en: 'poor — before the noun it means “to be pitied”' } },
    ],
    langue: {
      fr: 'Les noms en -ista ne changent pas au masculin et au féminin : il telegrafista, la telegrafista ; il giornalista, la giornalista. Seul l’article bouge. C’est une famille entière de mots réglée d’un coup.',
      it: 'I nomi in -ista non cambiano tra maschile e femminile: cambia solo l’articolo.',
      en: 'Nouns in -ista do not change between masculine and feminine: il telegrafista, la telegrafista. Only the article moves — a whole family of words settled at once.',
    },
  },
  {
    id: 'immensita',
    titre: 'Immensità',
    auteur: 'Andrea Laszlo De Simone',
    annee: '2017',
    genre: 'auteur',
    lien: 'https://it.wikipedia.org/wiki/Andrea_Laszlo_De_Simone',
    spotify: 'https://open.spotify.com/track/4NvoIMq8DkHSHxP5CLAj1Q',
    quoi: {
      fr: 'La chanson d’auteur italienne d’aujourd’hui, dans la lignée de Battisti et de Tenco — De Simone écrit, joue et enregistre presque tout lui-même. Preuve que le genre n’est pas un souvenir : il continue de s’écrire.',
      it: 'La canzone d’autore italiana di oggi, nella scia di Battisti e di Tenco. De Simone scrive, suona e registra quasi tutto da solo.',
      en: 'Italian songwriting as it is today, in the line of Battisti and Tenco — De Simone writes, plays and records almost everything himself.',
    },
    mots: [
      { it: 'l’immensità', pron: 'lim·men·si·TÀ', sens: { fr: 'l’immensité — encore un mot en -tà, donc féminin et invariable', it: 'un’altra parola in -tà: femminile e invariabile', en: 'immensity — another -tà word, feminine and invariable' } },
      { it: 'il cielo', pron: 'il CIE·lo', sens: { fr: 'le ciel', it: 'quello che sta sopra', en: 'the sky' } },
      { it: 'perdersi', pron: 'PER·der·si', sens: { fr: 'se perdre — pronominal, comme innamorarsi', it: 'riflessivo, come innamorarsi', en: 'to get lost — reflexive, like innamorarsi' } },
      { it: 'il tempo', pron: 'il TEM·po', sens: { fr: 'le temps', it: 'quello che passa', en: 'time' } },
      { it: 'grande', pron: 'GRAN·de', sens: { fr: 'grand — même forme au masculin et au féminin', it: 'stessa forma al maschile e al femminile', en: 'big — the same form for masculine and feminine' } },
      { it: 'guardare', pron: 'guar·DA·re', sens: { fr: 'regarder', it: 'posare lo sguardo', en: 'to look' } },
      { it: 'restare', pron: 're·STA·re', sens: { fr: 'rester — se conjugue avec essere au passé', it: 'al passato vuole essere', en: 'to stay — takes essere in the past' } },
    ],
    langue: {
      fr: 'Tous les mots en -tà sont féminins, invariables au pluriel, et accentués sur la fin : la libertà, la città, la solidarietà, l’immensità. Les reconnaître, c’est savoir d’avance leur genre et leur accent — trois règles pour le prix d’une.',
      it: 'Le parole in -tà sono femminili, invariabili al plurale e accentate in fondo: libertà, città, immensità.',
      en: 'Every -tà word is feminine, invariable in the plural, and stressed on the last syllable: la libertà, la città, l’immensità. Spot the ending and you know gender and stress in advance.',
    },
  },
];

export const EXERCICES: Exercice[] = [
  {
    question: 'La ___ non si compra.',
    consigne: { fr: 'Le mot « liberté ». Attention à l’accent écrit.', it: 'La parola « libertà ». Attenzione all’accento scritto.', en: 'The word for “freedom”. Watch the written accent.' },
    choix: ['libertà', 'libertá', 'liberta'],
    pourquoi: { fr: 'L’accent tombe sur la dernière syllabe, et en italien il s’écrit toujours grave sur le A : libertà. Comme società, solidarietà, città.', it: 'L’accento cade sull’ultima sillaba ed è grave: libertà, società, solidarietà.', en: 'The stress falls on the last syllable and on an A it is always written grave: libertà — like società, solidarietà, città.' },
  },
  {
    question: 'sciopero',
    consigne: { fr: 'Le mot « grève ». Comment se prononce son début ?', it: 'La parola « sciopero »: come si pronuncia l’inizio?', en: 'The word for “strike”. How does it begin?' },
    choix: ['chi, comme dans « chat »', 'ski', 'tchi'],
    pourquoi: { fr: 'SC devant I ou E se dit ch. « Sciopero » commence donc comme « chocolat » — c’est la règle qui fait trébucher tout le monde, y compris sur le nom de Scicli.', it: 'SC davanti a I o E si legge come in « pesce ». Vale anche per Scicli.', en: 'SC before I or E sounds like sh. So “sciopero” starts like “shop” — the same rule that trips people up on the name Scicli.' },
  },
  {
    question: 'L’assemblea ___ alle otto.',
    consigne: { fr: 'Présent de cominciare (commencer). Le sujet est « l’assemblée ».', it: 'Presente di cominciare. Il soggetto è « l’assemblea ».', en: 'Present of cominciare (to begin). The subject is “the assembly”.' },
    choix: ['comincia', 'cominciano', 'cominci'],
    pourquoi: { fr: 'Un seul sujet, donc troisième personne du singulier : comincia. Au pluriel — le assemblee — on dirait cominciano.', it: 'Soggetto singolare: comincia. Al plurale: cominciano.', en: 'A single subject, so third person singular: comincia. In the plural — le assemblee — it would be cominciano.' },
  },
  {
    question: 'Io ___ anarchica.',
    consigne: { fr: 'Présent d’essere (être), première personne. C’est ainsi que Maria Occhipinti se définissait.', it: 'Presente di essere, prima persona. Così si definiva Maria Occhipinti.', en: 'Present of essere (to be), first person. This is how Maria Occhipinti described herself.' },
    choix: ['sono', 'sei', 'siamo'],
    pourquoi: { fr: 'Essere : sono, sei, è, siamo, siete, sono. Le mot anarchica est au féminin ; un homme dirait sono anarchico.', it: 'Essere: sono, sei, è, siamo, siete, sono. Al maschile: anarchico.', en: 'Essere: sono, sei, è, siamo, siete, sono. Anarchica is feminine; a man would say sono anarchico.' },
  },
  {
    question: 'Noi ___ in piazza.',
    consigne: { fr: 'Présent d’andare (aller), première personne du pluriel.', it: 'Presente di andare, prima plurale.', en: 'Present of andare (to go), first person plural.' },
    choix: ['andiamo', 'vanno', 'vado'],
    pourquoi: { fr: 'Andare est irrégulier au singulier (vado, vai, va) mais redevient sage au pluriel : andiamo, andate, vanno.', it: 'Andare è irregolare al singolare, regolare al plurale: andiamo.', en: 'Andare is irregular in the singular (vado, vai, va) but behaves in the plural: andiamo, andate, vanno.' },
  },
  {
    question: 'Non ___ padroni.',
    consigne: { fr: 'Présent de volere (vouloir), première personne, à la forme négative.', it: 'Presente di volere, prima persona, negativo.', en: 'Present of volere (to want), first person, negative.' },
    choix: ['voglio', 'vuole', 'vogliamo'],
    pourquoi: { fr: 'La négation italienne tient en un mot placé devant le verbe : non voglio. Rien ne vient après, contrairement au « ne… pas » français.', it: 'La negazione è una sola parola davanti al verbo: non voglio.', en: 'Italian negation is one word before the verb: non voglio. Nothing follows, unlike the French “ne… pas”.' },
  },
  {
    question: 'Ieri ___ il giornale.',
    consigne: { fr: 'Passé composé de leggere (lire), première personne.', it: 'Passato prossimo di leggere, prima persona.', en: 'Past tense of leggere (to read), first person.' },
    choix: ['ho letto', 'ho leggiuto', 'sono letto'],
    pourquoi: { fr: 'Leggere se conjugue avec avere, et son participe est irrégulier : letto. « Leggiuto » n’existe pas — c’est le piège de tous les verbes en -ere.', it: 'Leggere vuole avere e ha il participio irregolare: letto.', en: 'Leggere takes avere, and its participle is irregular: letto. “Leggiuto” does not exist — the classic trap of -ere verbs.' },
  },
  {
    question: 'Maria ___ in carcere.',
    consigne: { fr: 'Passé composé d’andare, à propos d’une femme — Maria Occhipinti, emprisonnée après janvier 1945.', it: 'Passato prossimo di andare, riferito a una donna: Maria Occhipinti, incarcerata dopo il gennaio 1945.', en: 'Past tense of andare, about a woman — Maria Occhipinti, jailed after January 1945.' },
    choix: ['è andata', 'è andato', 'ha andato'],
    pourquoi: { fr: 'Andare se conjugue avec essere, donc le participe s’accorde : andata pour une femme. « Ha andato » n’existe pas.', it: 'Andare vuole essere e il participio si accorda: andata.', en: 'Andare takes essere, so the participle agrees: andata for a woman. “Ha andato” does not exist.' },
  },
  {
    question: 'I contadini ___ le terre.',
    consigne: { fr: 'Passé composé d’occupare, troisième personne du pluriel — les occupations de terres de l’après-guerre.', it: 'Passato prossimo di occupare, terza plurale: le occupazioni delle terre del dopoguerra.', en: 'Past tense of occupare, third person plural — the post-war land occupations.' },
    choix: ['hanno occupato', 'sono occupati', 'hanno occupate'],
    pourquoi: { fr: 'Occupare se conjugue avec avere, et avec avere le participe ne s’accorde pas avec le sujet : hanno occupato, quel que soit le nombre.', it: 'Con avere il participio non si accorda con il soggetto: hanno occupato.', en: 'Occupare takes avere, and with avere the participle does not agree with the subject: hanno occupato, whatever the number.' },
  },
  {
    question: 'Domani ___ allo sciopero.',
    consigne: { fr: 'Futur d’andare, première personne.', it: 'Futuro di andare, prima persona.', en: 'Future of andare, first person.' },
    choix: ['andrò', 'anderò', 'andarò'],
    pourquoi: { fr: 'Andare perd une voyelle au futur : andrò, andrai, andrà. Même chose pour fare (farò), potere (potrò), volere (vorrò), venire (verrò).', it: 'Andare perde una vocale al futuro: andrò. Come farò, potrò, vorrò, verrò.', en: 'Andare loses a vowel in the future: andrò, andrai, andrà. Same for fare (farò), potere (potrò), volere (vorrò), venire (verrò).' },
  },
  {
    question: '___ una lunga lotta.',
    consigne: { fr: 'Futur d’essere, troisième personne — « ce sera une longue lutte ».', it: 'Futuro di essere, terza persona.', en: 'Future of essere, third person — “it will be a long struggle”.' },
    choix: ['Sarà', 'Sarai', 'Saremo'],
    pourquoi: { fr: 'Essere au futur : sarò, sarai, sarà, saremo, sarete, saranno. Et « sarà » sert aussi à supposer : « ça doit être ça ».', it: 'Essere al futuro: sarò, sarai, sarà… « Sarà » serve anche per supporre.', en: 'Essere in the future: sarò, sarai, sarà, saremo, sarete, saranno. And “sarà” also expresses a guess.' },
  },
  {
    question: '___ gli indifferenti.',
    consigne: { fr: 'Présent d’odiare (haïr), première personne. C’est le début de la phrase la plus connue de Gramsci.', it: 'Presente di odiare, prima persona: l’inizio della frase più nota di Gramsci.', en: 'Present of odiare (to hate), first person — the opening of Gramsci’s best-known line.' },
    choix: ['Odio', 'Odia', 'Odiamo'],
    pourquoi: { fr: 'Odiare suit le modèle de parlare : odio, odi, odia, odiamo, odiate, odiano. Gramsci écrit « Odio gli indifferenti » en 1917, à vingt-six ans.', it: 'Odiare segue parlare: odio, odi, odia… Gramsci scrive « Odio gli indifferenti » nel 1917.', en: 'Odiare follows the parlare pattern: odio, odi, odia, odiamo, odiate, odiano. Gramsci wrote “Odio gli indifferenti” in 1917, aged twenty-six.' },
  },
  {
    question: 'Il fascismo non ___.',
    consigne: { fr: 'Futur de passare (passer), troisième personne — « le fascisme ne passera pas ».', it: 'Futuro di passare, terza persona.', en: 'Future of passare, third person — “fascism shall not pass”.' },
    choix: ['passerà', 'passera', 'passarà'],
    pourquoi: { fr: 'Les verbes en -are changent le a en e au futur : passare donne passerò, passerai, passerà. Et l’accent de la troisième personne s’écrit : passerà.', it: 'I verbi in -are cambiano la a in e: passerà, con l’accento scritto.', en: 'Verbs in -are turn the a into an e in the future: passare gives passerò, passerai, passerà — and the accent is written.' },
  },
  {
    question: 'Chi ___ decidere per noi?',
    consigne: { fr: 'Présent de potere (pouvoir), troisième personne.', it: 'Presente di potere, terza persona.', en: 'Present of potere (can), third person.' },
    choix: ['può', 'puoi', 'posso'],
    pourquoi: { fr: 'Potere : posso, puoi, può, possiamo, potete, possono. La même forme può sert au vouvoiement — la politesse italienne passe par la troisième personne.', it: 'Potere: posso, puoi, può… La stessa forma serve per la cortesia.', en: 'Potere: posso, puoi, può, possiamo, potete, possono. The same può serves as the polite form — Italian politeness uses the third person.' },
  },
  {
    question: 'Malatesta ___ un grande anarchico.',
    consigne: { fr: 'Passé composé d’essere (être), 3e personne — à propos d’Errico Malatesta.', it: 'Passato prossimo di essere, terza persona — su Errico Malatesta.', en: 'Past tense of essere (to be), third person — about Errico Malatesta.' },
    choix: ['è stato', 'ha stato', 'è stata'],
    pourquoi: { fr: 'Essere se conjugue avec lui-même : è stato. « Ha stato » n’existe pas, et le participe est ici au masculin (Malatesta, un homme) : stato, pas stata.', it: 'Essere: è stato. « Ha stato » non esiste; al maschile: stato.', en: 'Essere takes essere as its auxiliary: è stato. “Ha stato” does not exist, and the participle is masculine here: stato, not stata.' },
  },
  {
    question: 'Sacco e Vanzetti ___ giustiziati.',
    consigne: { fr: 'Passé composé, 3e personne du pluriel — les deux anarchistes Sacco e Vanzetti.', it: 'Passato prossimo, terza plurale — Sacco e Vanzetti.', en: 'Past tense, third person plural — the two anarchists Sacco and Vanzetti.' },
    choix: ['sono stati', 'hanno stati', 'sono stato'],
    pourquoi: { fr: 'Deux hommes : essere au pluriel, participe masculin pluriel — sono stati. « Hanno stati » n’existe pas.', it: 'Due uomini: sono stati. « Hanno stati » non esiste.', en: 'Two men: essere in the plural, masculine plural participle — sono stati. “Hanno stati” does not exist.' },
  },
  {
    question: 'Virgilia D’Andrea ___ una poetessa.',
    consigne: { fr: 'Passé composé d’essere, à propos d’une femme — la poétesse Virgilia D’Andrea.', it: 'Passato prossimo di essere, su una donna: Virgilia D’Andrea.', en: 'Past tense of essere, about a woman — the poet Virgilia D’Andrea.' },
    choix: ['è stata', 'è stato', 'ha stata'],
    pourquoi: { fr: 'Avec essere, le participe s’accorde : une femme, donc è stata. Un homme dirait è stato.', it: 'Con essere il participio si accorda: è stata.', en: 'With essere the participle agrees: a woman, so è stata. A man would say è stato.' },
  },
  {
    question: 'Pietro Gori ___ molte canzoni.',
    consigne: { fr: 'Passé composé de scrivere (écrire) — à propos de Pietro Gori.', it: 'Passato prossimo di scrivere — su Pietro Gori.', en: 'Past tense of scrivere (to write) — about Pietro Gori.' },
    choix: ['ha scritto', 'ha scrivuto', 'è scritto'],
    pourquoi: { fr: 'Scrivere se conjugue avec avere, et son participe est irrégulier : scritto. « Scrivuto » n’existe pas.', it: 'Scrivere vuole avere e ha il participio irregolare: scritto.', en: 'Scrivere takes avere, and its participle is irregular: scritto. “Scrivuto” does not exist.' },
  },
];
