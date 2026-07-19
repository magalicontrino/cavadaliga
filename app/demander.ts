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
const synonymesDuLieu = (id: string, cat: CatKey, aussi: CatKey[] = []) => {
  const cats = [cat, ...aussi];
  return {
    // Mag a ecrit « pain » en visant Giannone : c'est une adresse, pas un rayon.
    precis: SEARCH_WORDS.filter((h) => h.ids?.includes(id)).flatMap((h) => h.words.flatMap(motsDe)),
    // « plage » vise huit endroits : le mot situe, il ne designe pas.
    larges: SEARCH_WORDS.filter((h) => h.cat && cats.includes(h.cat)).flatMap((h) => h.words.flatMap(motsDe)),
  };
};

// ── Les mots qu'on tape pour parler de la MAISON ────────────────────────
// Meme esprit que SEARCH_WORDS, meme forme : les trois langues melangees,
// sans accents. On cherche « code wifi », « la lumiere marche pas », « ou sont
// les poubelles » — jamais le titre exact de la rubrique. Enrichir = ajouter
// des mots a une ligne.
const MOTS_MAISON: Record<string, string> = {
  'op-bolt':
    'electricite courant lumiere lumieres disjoncteur compteur interrupteur interrupteurs panne noir ' +
    'elettricita corrente luce luci interruttore contatore buio ' +
    'electricity power light lights switch breaker meter blackout',
  'op-drop':
    'eau vanne robinet douche pression fuite couper ouvrir buanderie evier ' +
    'acqua valvola rubinetto doccia pressione perdita chiudere aprire lavanderia lavello ' +
    'water valve tap faucet shower pressure leak turn laundry sink',
  'op-flame':
    'gaz bouteille cuisiniere gaziniere plaque feu bonbonne cuisson recharge ' +
    'bombola cucina fornello fuoco ricarica ' +
    'gas bottle cylinder stove cooker hob refill',
  'op-signal':
    'wifi wi internet reseau code password mot passe connexion connecter box debit recharger ' +
    'rete parola chiave collegare connessione ricaricare ' +
    'network connect connection login broadband',
  // « aller » a du quitter cette ligne : c'est le verbe de TOUS les trajets.
  // « aller a l'aeroport » repondait l'adresse de la maison.
  adresse:
    'adresse situe maison casa appartement rue via numero itineraire plan ' +
    'indirizzo strada mappa ' +
    'address street house flat apartment directions map',
  depart:
    'partir depart quitter fermer cle cles rendre laisser derniere check liste verifier avant ' +
    'partire partenza chiudere chiave chiavi lasciare ultima controllare prima ' +
    'leave leaving departure lock key keys checklist last check before',
  valise:
    'valise bagage emporter prendre apporter preparer papiers passeport permis carte identite ' +
    'assurance adaptateur prise argent especes ' +
    'valigia bagaglio portare preparare documenti passaporto patente carta identita contanti ' +
    'luggage pack bring passport licence id insurance adapter plug cash money',
  poubelles:
    'poubelle poubelles dechets tri ordures benne bac sac ramassage collecte jour sortir verre ' +
    'plastique papier carton organique compost recyclage ' +
    'rifiuti spazzatura differenziata raccolta giorno vetro plastica carta cartone organico umido ' +
    'bin bins rubbish waste sorting recycling collection glass plastic paper cardboard organic',
  pharmacie:
    'pharmacie pharmacien medicament medicaments ordonnance garde malade grippe ' +
    'farmacia medicina medicine ricetta turno malato ' +
    'pharmacy chemist medicine prescription duty ill sick',
  urgences:
    'urgence urgences secours pompier pompiers police carabinieri ambulance hopital docteur medecin ' +
    'accident noye sauvetage numero appeler ' +
    'emergenza soccorso vigili fuoco polizia ambulanza ospedale medico incidente chiamare ' +
    'emergency ambulance fire police hospital doctor accident drowning rescue call',
  gaz:
    'gaz bouteille bonbonne livraison reparer cuisiniere marchand mormina ' +
    'bombola consegna riparare fornello ' +
    'gas bottle cylinder delivery repair cooker supplier',
  calendrier:
    'calendrier libre libres disponible disponibilite occupe reserve dates sejour sejours quand ' +
    'venir monde qui vient planning ' +
    'calendario libero disponibile occupato date soggiorno quando venire chi viene ' +
    'calendar free available booked dates stay when coming who',
  famille:
    'famille arbre genealogie genealogique ancetre ancetres grand grands parents cousin cousins ' +
    'origine nom histoire salva contrino ' +
    'famiglia albero genealogico antenati nonni cugini origine storia ' +
    'family tree genealogy ancestors grandparents cousins origin history',
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
    lignes: [t.movePage.urgencyIntro, ...EMERGENCIES.map((e) => `${e.number} — ${e.label[lang]}`)],
    mots: motsMaison('urgences'),
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

  // ── Nos adresses ─────────────────────────────────────────────────────
  LOCAL_PLACES.forEach((l) => {
    const cats = [l.cat, ...(l.aussi ?? [])];
    const syn = synonymesDuLieu(l.id, l.cat, l.aussi);
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
      mots: [...syn.larges, ...motsDuTexte(cats.map((c) => CATS[c].label[lang])), ...motsDe(l.town)],
    });
  });

  return fiches;
}

// ── Le classement ───────────────────────────────────────────────────────
// Trois niveaux de preuve, du plus sur au plus faible : un mot-clef choisi,
// un mot du titre, un mot du corps. Un mot du corps ne peut PAS, a lui seul,
// declencher une reponse — c'est ce qui permet de se taire.
const POIDS_PRECIS = 10;
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
const poidsDesMots = (index: Fiche[]): Map<string, number> => {
  const combien = new Map<string, number>();
  for (const f of index) for (const m of new Set(f.mots)) combien.set(m, (combien.get(m) ?? 0) + 1);
  const poids = new Map<string, number>();
  for (const [m, n] of combien) poids.set(m, n === 1 ? 10 : n <= 3 ? 8 : 6);
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

  for (const m of mots) {
    let meilleur = 0;
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
