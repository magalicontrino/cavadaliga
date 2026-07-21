'use client';

import { useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';
import Icon from './Icon';
import { useI18n } from './i18n';

// ─────────────────────────────────────────────────────────────────────────
// QUI EST A LA MAISON — c'est ICI qu'on met a jour, et nulle part ailleurs.
//
// Dates INCLUSES, du premier au dernier jour du sejour, au format AAAA-MM-JJ.
// `tentative: true` → affiche en ocre, « a confirmer ».
//
// Les grilles se dessinent toutes seules a partir de MOIS : ajouter un sejour
// en novembre demande d'ajouter novembre a la liste, sinon il ne s'affichera
// nulle part.
// ─────────────────────────────────────────────────────────────────────────
/*
 * LE DEGRE DE PARENTE, COMPTE DEPUIS MAG — Mag : « la famille au premier et
 * deuxieme degre [en rose], et le reste tu mets en jaune, et quand ce sera pas
 * la famille, en vert ».
 *
 * Le degre se compte comme en droit civil : un cran de generation, un degre.
 * Les parents et les enfants sont au premier ; les freres et soeurs, les
 * grands-parents et les petits-enfants au deuxieme (on remonte puis on
 * redescend). Les nieces sont donc au TROISIEME, et les cousines germaines au
 * QUATRIEME — ce qui les met en jaune, alors qu'on les dirait volontiers
 * « proches » dans la conversation. C'est la regle demandee, appliquee telle
 * quelle ; c'est le genre de chose qui se voit mieux a l'ecran que dans une
 * phrase.
 *
 * LE TABLEAU EST LA SOURCE, ET LE COMPILATEUR LA GARDE. `qui` n'accepte que
 * des prenoms ecrits ici : nommer quelqu'un d'inconnu ne compile pas. Sans ce
 * garde-fou, un nom mal orthographie tomberait silencieusement dans « hors
 * famille » — soit, sur cette page, la maniere la plus discrete possible de
 * mettre un cousin dehors. Une erreur de build vaut mieux qu'une vexation.
 *
 * Les degres viennent de l'arbre de `FamilyTree.tsx`, seule source genealogique
 * du site : Salvatore & Giuseppina sont les grands-parents de Mag, leurs
 * enfants ses oncles et tantes, et Angele — fille d'Helene — sa cousine
 * germaine.
 */
const DEHORS = 'dehors';
/*
 * QUI EST DANS QUELLE TRANCHE. Le compilateur garde toujours la liste : `qui`
 * n'accepte que des prenoms ecrits ici, donc une faute de frappe ne compile
 * pas — sans ce garde-fou, un nom mal ecrit tomberait en silence dans « hors
 * famille », la maniere la plus discrete de mettre un cousin dehors.
 */
const TRANCHES = {
  // LE PREMIER CERCLE : Mag, ses filles, ses parents, ses freres, ses nieces.
  // Mag a SA couleur : « quand c'est moi qui part je veux un rose fushia,
  // il faut qu'on le voit bien ».
  Mag: 'mag',
  Eve: 'proche',
  Manon: 'proche',
  Régine: 'proche',
  Salvatore: 'proche',
  David: 'proche',
  Michaël: 'proche',
  // Les filles de Michaël. Mag : « c'est Marie ma niece donc c'est la famille ».
  Juliette: 'proche',
  Marie: 'proche',
  Zoé: 'proche',
  /*
   * LA BELLE-FAMILLE. Katia est la sœur de Maria Assunta, elle-meme demi-sœur
   * du pere de Mag — donc la sœur de sa tante. Elle est de la famille, et pas
   * du meme cercle que ses nieces : c'est exactement ce que Mag a corrige.
   */
  'Katia Asaro': 'belle',
  // LES COUSINS. Angèle est cousine germaine : fille d'Helene, sœur du
  // grand-pere de Mag.
  Angèle: 'famille',
  /*
   * Hors de l'arbre, et ça ne coute rien : ils partagent le sejour de
   * quelqu'un de plus proche, et c'est le plus proche qui donne la couleur.
   */
  Alex: DEHORS,
  Guillaume: DEHORS,
} as const;

type Personne = keyof typeof TRANCHES;

// ─────────────────────────────────────────────────────────────────────────
// `qui` NE REMPLACE PAS `label` : le libelle reste ce que Mag ecrit et ce qui
// s'affiche (« Wk juju mamie », « Angèle +++ »), `qui` est ce qui se compte.
// Les « +++ » disent qu'il y a du monde en plus sans dire qui : ils ne peuvent
// donc peser sur aucune couleur.
// ─────────────────────────────────────────────────────────────────────────
/*
 * `travaux` N'EST PAS UNE TRANCHE DE PARENTE, et c'est pour ça qu'il ne vit pas
 * dans TRANCHES : personne n'« est » en travaux. C'est un etat de la MAISON, pas
 * une propriete des gens — un chantier n'a pas d'invites. Il se pose donc sur le
 * sejour, et il l'emporte sur tout le reste : quand la maison est fermee, savoir
 * qui aurait pu venir n'interesse plus personne.
 */
type Sejour = { label: string; qui: Personne[]; start: string; end: string; tentative?: boolean; travaux?: boolean };

const SEJOURS: Sejour[] = [
  { label: 'Manon, Alex, Régine et Mag', qui: ['Manon', 'Alex', 'Régine', 'Mag'], start: '2026-07-04', end: '2026-07-14' },
  { label: 'Katia Asaro, sœur de Maria Assunta', qui: ['Katia Asaro'], start: '2026-07-15', end: '2026-07-28' },
  { label: 'Angèle +++', qui: ['Angèle'], start: '2026-07-30', end: '2026-08-08' },
  { label: 'Eve', qui: ['Eve'], start: '2026-08-20', end: '2026-09-01' },
  { label: 'Wk juju mamie', qui: ['Juliette', 'Régine'], start: '2026-09-17', end: '2026-09-21', tentative: true },
  { label: 'Mag +++', qui: ['Mag'], start: '2026-09-22', end: '2026-10-01' },
  { label: 'Marie & Guillaume', qui: ['Marie', 'Guillaume'], start: '2026-10-17', end: '2026-11-01' },
];

/*
 * LE PLUS PROCHE L'EMPORTE. Un sejour n'est pas une personne : « Manon, Alex,
 * Régine et Mag » melange deux filles, une mere et quelqu'un qui n'est pas de
 * la famille. La case prend donc le degre le PLUS PETIT du groupe.
 *
 * L'inverse — le plus eloigne l'emporte — donnerait un calendrier ou la
 * presence d'un seul invite exterieur effacerait la famille de la couleur.
 */
type Parente = 'travaux' | 'mag' | 'proche' | 'belle' | 'famille' | 'dehors';
const parenteDu = (s: Sejour): Parente => {
  /*
   * LES TRANCHES SONT NOMMEES, PLUS CALCULEES — et c'est Mag qui a montre
   * pourquoi le calcul ne pouvait pas suffire.
   *
   * Le seuil de degres marchait tant qu'on ne lui demandait qu'une chose. Puis
   * elle a voulu ses nieces en rose (« c'est Marie ma niece donc c'est la
   * famille »), ce qui portait le seuil au troisieme degre — et emportait Katia
   * avec elles. Sa reponse : « non, Katia est la sœur de ma tante ».
   *
   * ELLE A RAISON, ET AUCUN COMPTE NE PEUT LES SEPARER : une niece et la sœur
   * d'une tante valent TOUTES DEUX trois degres. Ce que Mag distingue n'est pas
   * une distance, c'est une APPARTENANCE — le sang direct d'un cote, l'alliance
   * de l'autre. Un nombre ne saura jamais dire ça.
   *
   * Chaque personne porte donc sa tranche, ecrite a la main. C'est plus verbeux
   * qu'une comparaison, et c'est le seul moyen d'etre juste.
   */
  if (s.travaux) return 'travaux';
  const tranches = s.qui.map((p) => TRANCHES[p]);
  // Le plus proche l'emporte, dans cet ordre : un sejour ou vient une fille de
  // Mag est un sejour « proche », meme s'il y a du monde autour.
  for (const t of ['mag', 'proche', 'belle', 'famille'] as const) {
    if (tranches.includes(t)) return t;
  }
  return 'dehors';
};


/*
 * LES MOIS NE SE LISTENT PLUS A LA MAIN.
 *
 * Il y avait ici un tableau `MOIS` a tenir a jour en parallele des sejours,
 * avec ce commentaire : « ajouter un sejour en novembre demande d'ajouter
 * novembre a la liste, sinon il ne s'affichera nulle part ». C'etait un piege :
 * l'oubli ne casse rien, ne previent pas, et fait simplement DISPARAITRE un
 * sejour du calendrier. Personne ne s'en apercevrait avant que quelqu'un
 * debarque un jour deja pris.
 *
 * La plage se deduit donc des sejours eux-memes : du mois du premier au mois du
 * dernier, plus un an devant pour qu'on puisse regarder plus loin et constater
 * que la maison est libre. Ajouter un sejour suffit maintenant a le voir.
 */
const FENETRE = 6; // mois affiches d'un coup — le format du modele de Mag

const moisIndex = (annee: number, mois: number) => annee * 12 + mois;
const deMoisIndex = (n: number): [number, number] => [Math.floor(n / 12), n % 12];

const LOCALES: Record<string, string> = { it: 'it-IT', fr: 'fr-FR', en: 'en-GB' };

/*
 * LES COULEURS DES JOURS — le dessin que Mag a montre : chaque jour est une
 * case pleine, et c'est la couleur qui repond, pas une barre posee par-dessus.
 *
 * On lit un calendrier d'occupation en CHERCHANT LE VIDE. L'ancienne version
 * posait le nom des occupants en travers des semaines : elle disait tres bien
 * qui etait la, et tres mal quand la maison ne l'etait pas — il fallait
 * repasser sur les jours sans barre pour s'en assurer. La couleur inverse le
 * geste : le libre se voit d'un coup d'oeil, a l'echelle de cinq mois.
 *
 * LES JOURS OCCUPES SE REJOIGNENT EN UN TRAIT (Mag : « c'est plus clair »).
 * La couleur seule ne disait que « ce jour est pris », sept fois de suite ; il
 * fallait compter les pastilles pour savoir combien de temps. Reliees, elles
 * disent la DUREE — un sejour se mesure a la longueur du trait, sans compter.
 * Ce n'est pas la barre en travers d'avant, qui portait un nom et masquait les
 * chiffres : le trait reste sous les jours, qui restent lisibles dessus.
 *
 * LA COULEUR NE DIT PLUS « OCCUPE », ELLE DIT QUI (Mag). Rose la famille au
 * premier et deuxieme degre, jaune le reste de la famille, vert ceux qui n'en
 * sont pas, bleu les jours libres.
 *
 * CE QUE CE CHANGEMENT COUTE, ecrit ici pour que personne n'ait a le
 * redecouvrir : la couleur ne repond qu'a UNE question a la fois. Elle
 * repondait a « est-ce libre ? » — la question qu'on se pose vraiment en
 * ouvrant cette page. Elle repond maintenant a « qui est la ? ». Le libre ne se
 * lit donc plus a la couleur seule mais au BLEU, une teinte parmi quatre, quand
 * il etait la seule note verte au milieu du rose.
 *
 * LES QUATRE TEINTES SONT CALEES SUR LA CLARTE, PAS SUR LA TEINTE, et cette
 * fois-ci la raison saute aux yeux : la palette demandee met cote a cote du
 * ROSE et du VERT, exactement la paire que huit hommes sur cent ne separent
 * pas. La version d'avant s'y etait deja cassee — rose contre vert a 1,04 de
 * rapport, soit aucun ecart de clarte, un calendrier muet pour eux. Refaire la
 * meme erreur en la rendant porteuse de sens (« famille » contre « pas la
 * famille ») aurait ete pire que decoratif.
 *
 * Mesures sur le fond creme du site, encre #2e2d2d par-dessus :
 *
 *   rose  45 %   encre  6,71
 *   jaune 50 %   encre  9,28
 *   vert  70 %   encre  4,81
 *   bleu  14 %   encre 11,24
 *
 * et les ecarts de clarte entre teintes, la ou le daltonisme frappe :
 *
 *   rose / vert   1,39      jaune / vert  1,93      rose / jaune  1,38
 *   bleu / vert   2,34      bleu / rose   1,68      bleu / jaune  1,21
 *
 * Le seul ecart faible est bleu contre jaune (1,21) — et c'est le seul qu'on
 * puisse se permettre : bleu et jaune sont precisement la paire que la vision
 * rouge-vert distingue le MIEUX. Les trois autres, elle ne les tient que par la
 * clarte, et elles l'ont.
 *
 * Le vert est le plus fonce des quatre (encre a 4,81, contre 4,5 demandes) :
 * c'est la seule maniere de le decoller du jaune sans le confondre avec le
 * rose. Il n'y avait pas de marge ailleurs.
 */
/*
 * L'ECHELLE EST RECALEE A PAS CONSTANT DEPUIS QUE MAG A SA COULEUR, et c'est
 * une mesure qui l'a exigee, pas un gout.
 *
 * En posant le fuchsia a 70 % je l'ai mis a une clarte de 0,302 — et l'olive
 * du « hors famille » etait a 0,317. Un ecart de 1,04 : deux cases voisines
 * strictement indiscernables des qu'on ne voit plus la teinte. Or c'est
 * exactement le cas qu'il faut tenir, le rouge et le vert etant la paire que
 * la vision daltonienne confond.
 *
 * Les six fonds sont etales a pas EGAL entre le fuchsia (le plus sombre
 * que l'encre supporte) et le bleu du libre (le plus clair qu'on distingue du
 * papier) : un facteur 1,20 entre chaque voisin, ce qui est le maximum
 * mathematique pour six paliers dans cet intervalle. Une septieme tranche
 * descendrait tout le monde sous 1,17 — c'est la limite de structure, et elle
 * est atteinte.
 *
 * LE FUCHSIA DE MAG — « quand c'est moi qui part je veux un rose fushia, il
 * faut qu'on le voit bien ».
 *
 * A 70 % et pas plus : le rose de la marque, pose plein, tombe dans sa ZONE
 * MORTE — mesure, l'encre n'y passe qu'a 3,21 et le blanc a 4,28, quand il en
 * faut 4,5. Aucun texte n'y tient. A 70 % il reste franchement fuchsia et
 * l'encre remonte a 4,59.
 *
 * Le rose de la famille proche descend a 35 % pour lui laisser la place : deux
 * roses de la meme teinte, l'un dense et l'autre pale, se distinguent par la
 * CLARTE — ce qui survit au noir et blanc, contrairement a deux teintes
 * differentes de meme intensite.
 */
/*
 * LES TRAVAUX SONT LE SEUL FOND SOMBRE, et le seul qui porte du blanc. Mag :
 * « et en noir quand c'est en travaux ». Il sort volontairement de l'echelle
 * pastel : une maison fermee n'est pas une variante de maison occupee, et le
 * bloc noir se lit avant meme qu'on ait cherche la legende.
 */
const TRAVAUX = '#1a1a1a';
const MAG = 'rgba(230, 41, 111, 0.70)';
const PROCHE = 'rgba(230, 41, 111, 0.23)';
const FAMILLE = '#e8a800';
const DEHORS_T = 'rgba(90, 122, 46, 0.62)';
/*
 * L'INDIGO DE LA BELLE-FAMILLE, ET SON PRIX. Mag voulait une tranche a part
 * pour Katia. Une CINQUIEME teinte sur ce calendrier est a la limite du
 * possible : les quatre autres occupent deja toute la plage de clarte (encre a
 * 4,81 / 6,71 / 9,28 / 11,24), et le meilleur candidat trouve n'obtient que
 * 1,17 d'ecart avec le rose, la ou les quatre premieres tiennent 1,38 au pire.
 *
 * L'indigo passe parce que sa TEINTE est franchement ailleurs — un bleu-violet
 * ne se confond avec rien d'autre ici, et le bleu du « libre » est quatre fois
 * plus pale. Mais l'ecart de clarte reste le plus faible du jeu, et c'est
 * signale a Mag : sur une impression en noir et blanc, la case de Katia et
 * celle des filles se ressembleraient.
 */
/*
 * LE MAUVE A CHANGE DE BARREAU, ET C'EST LA SEULE FAÇON DE L'ECLAIRCIR. Mag :
 * « plus clair ce mauve, ou en vert sinon ».
 *
 * Le vert etait exclu : il est deja au « hors famille ». Deux verts sur une
 * grille ou la couleur porte SEULE le sens, c'est exactement le cas qu'il faut
 * eviter — celui que la vision daltonienne ne peut pas demeler.
 *
 * Et l'echelle ne s'etire pas. Ses deux bouts sont bloques : le fuchsia est le
 * plus sombre que l'encre supporte, le bleu du libre le plus clair qui se
 * distingue encore du papier. Entre les deux, six barreaux a 1,20 — le maximum.
 * Eclaircir le mauve sur place l'aurait colle au rose voisin.
 *
 * On ECHANGE donc les places au lieu d'etirer. Le mauve monte du 3e au 4e
 * barreau (0,455 -> 0,553), l'or descend prendre le sien, et le rose de la
 * famille proche monte au 5e — ou il est d'ailleurs mieux : un rose pale a
 * 0,672 ne risque plus du tout d'etre confondu avec le fuchsia de Mag a 0,302,
 * alors qu'ils partagent la meme teinte. Les ecarts sont intacts, 1,19 mini.
 *
 * La pastille suit : #4a5fc4 -> #93a0e6, sa clarte passe de 0,136 a 0,371. Elle
 * n'est plus le point lourd de la legende, c'etait la plainte d'origine.
 */
const BELLE = 'rgba(147, 160, 230, 0.62)';
const LIBRE = 'rgba(74, 127, 196, 0.14)';
const TEINTES: Record<Parente, string> = { travaux: TRAVAUX, mag: MAG, proche: PROCHE, belle: BELLE, famille: FAMILLE, dehors: DEHORS_T };
/** Les pastilles de la legende : pleines, elles, pour se voir a 12 px. */
const PLEIN = { travaux: TRAVAUX, mag: '#e6296f', proche: '#f0a0bd', belle: '#93a0e6', famille: '#e8a800', dehors: '#5a7a2e', libre: '#4a7fc4' };

const ymd = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const lire = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const sejourDuJour = (d: Date) => {
  const v = ymd(d);
  return SEJOURS.findIndex((s) => v >= ymd(lire(s.start)) && v <= ymd(lire(s.end)));
};

/** Les semaines du mois, lundi en tete. Cellule vide = debord du mois voisin. */
function semainesDuMois(annee: number, mois: number): (Date | null)[][] {
  const premiereColonne = (new Date(annee, mois, 1).getDay() + 6) % 7;
  const jours = new Date(annee, mois + 1, 0).getDate();
  const cases: (Date | null)[] = [];
  for (let i = 0; i < premiereColonne; i++) cases.push(null);
  for (let d = 1; d <= jours; d++) cases.push(new Date(annee, mois, d));
  while (cases.length % 7 !== 0) cases.push(null);
  const semaines: (Date | null)[][] = [];
  for (let i = 0; i < cases.length; i += 7) semaines.push(cases.slice(i, i + 7));
  return semaines;
}

/** Les sejours qui touchent ce mois, dans l'ordre ou ils commencent. */
function sejoursDuMois(annee: number, mois: number) {
  const premier = ymd(new Date(annee, mois, 1));
  const dernier = ymd(new Date(annee, mois + 1, 0));
  return SEJOURS.map((s, i) => ({ s, i })).filter(
    ({ s }) => ymd(lire(s.end)) >= premier && ymd(lire(s.start)) <= dernier,
  );
}

/**
 * Le calendrier d'occupation — « la maison est libre quand ? ».
 *
 * C'est la question qu'on se pose le plus souvent en famille. Elle a sa page a
 * elle, /calendrier, atteignable par le picto de la barre du haut. Le composant
 * ne porte donc PAS de titre : PageHeader s'en charge, et le repeter l'ecrirait
 * deux fois.
 */
export default function Occupancy() {
  const { t, lang } = useI18n();
  const c = t.stayPage;
  const locale = LOCALES[lang] ?? 'fr-FR';
  // Les initiales des jours. Le 1er janvier 2024 etait un lundi : on part de la.
  const jours = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 1 + i)),
  );
  /*
   * AUJOURD'HUI N'EXISTE QU'APRES LE MONTAGE. C'est la precaution qui compte
   * ici, et elle n'est pas theorique.
   *
   * Le site est EXPORTE EN STATIQUE : le HTML est calcule une fois, le jour du
   * build, puis servi tel quel pendant des semaines. Tout ce qui depend de la
   * date se figerait donc a cette date-la — les jours grises, le contour du
   * jour, la page ouverte — et le navigateur, lui, calculerait autre chose.
   * React verrait deux rendus differents et refuserait d'hydrater la page.
   *
   * Rien ne se voit tant que le build est frais, ce qui est le pire des cas :
   * la panne serait arrivee toute seule, un mois plus tard, sans qu'on ait
   * rien touche.
   *
   * `null` avant l'hydratation : aucun jour n'est passe, aucun n'est
   * aujourd'hui. Le serveur et le premier rendu client disent donc exactement
   * la meme chose, et la date arrive juste apres.
   */
  const [aujourdhui, setAujourdhui] = useState<number | null>(null);

  const jourFormat = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
  const moisFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });

  /*
   * La plage navigable, deduite des sejours. `useMemo` parce qu'elle ne depend
   * de rien qui bouge : la recalculer a chaque clic de fleche ne servirait
   * qu'a refaire le meme tri.
   */
  const [premier, dernier] = useMemo(() => {
    const debuts = SEJOURS.map((x) => lire(x.start));
    const fins = SEJOURS.map((x) => lire(x.end));
    const min = debuts.reduce((a, b) => (a < b ? a : b));
    const max = fins.reduce((a, b) => (a > b ? a : b));
    return [moisIndex(min.getFullYear(), min.getMonth()), moisIndex(max.getFullYear(), max.getMonth()) + 12];
  }, []);

  /*
   * ON OUVRE SUR LE MOIS COURANT, pas sur le premier sejour enregistre : la
   * question qu'on se pose en arrivant est « et maintenant ? ». Les pages sont
   * calees sur la plage, si bien qu'avancer puis reculer ramene exactement au
   * meme endroit — un decoupage flottant donnerait des fenetres qui glissent.
   */
  const maintenant = new Date();
  const page0 = Math.max(
    0,
    Math.min(
      Math.floor((moisIndex(maintenant.getFullYear(), maintenant.getMonth()) - premier) / FENETRE),
      Math.floor((dernier - premier) / FENETRE),
    ),
  );
  // Meme raison : la page d'ouverture depend d'aujourd'hui, donc elle ne peut
  // pas etre choisie au build. On part de la premiere, on saute a la bonne des
  // que le navigateur a la main.
  const [page, setPage] = useState(0);
  const pageMax = Math.floor((dernier - premier) / FENETRE);

  useEffect(() => {
    setAujourdhui(ymd(new Date()));
    setPage(page0);
    // Une seule fois, au montage : ensuite c'est aux fleches de decider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debutFenetre = premier + page * FENETRE;
  const mois: [number, number][] = Array.from({ length: FENETRE }, (_, i) => deMoisIndex(debutFenetre + i)).filter(
    ([, ], i) => debutFenetre + i <= dernier,
  );
  const titre = `${moisFormat.format(new Date(...deMoisIndex(debutFenetre), 1))} – ${moisFormat.format(
    new Date(...deMoisIndex(debutFenetre + mois.length - 1), 1),
  )}`;

  return (
    <section className="mx-auto max-w-[110rem] px-5 pb-16 md:px-10">
      {/*
        LA LEGENDE NE GARDE QUE CE QU'ELLE SEULE PEUT DIRE. Mag : « mets juste
        les travaux et quand c'est libre ».

        Les cinq tranches de parente en sont sorties, et elles ne manquent pas :
        chaque sejour est nomme EN TOUTES LETTRES dans la liste sous son mois,
        avec sa pastille a cote. « Mag +++ », « Katia Asaro » — la legende ne
        faisait que repeter, en moins precis, ce que la liste dit deja. Elle
        prenait deux lignes pour ça.

        Restent les deux etats que la liste ne peut pas porter, faute de sejour
        a nommer : le noir des travaux et le bleu du libre.

        Le pointille des sejours a confirmer avait quitte la legende avant eux,
        pour la meme raison — c'est la liste qui l'ecrit, a cote des dates.
      */}
      <Reveal className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]" style={{ color: 'var(--cava-muted)' }}>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.travaux }} />
          {c.legend.works}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.libre }} />
          {c.legend.free}
        </span>
      </Reveal>

      {/*
        L'ENTETE DE NAVIGATION — le modele de Mag : une fleche, la plage de
        mois, une fleche.

        Les fleches se DESACTIVENT aux bords plutot que de disparaitre : un
        bouton qui s'evapore fait douter de ce qu'on vient de cliquer, et
        deplace ce qui l'entoure. Grisees, elles disent « c'est le bout » sans
        rien bouger. Et si tout tient sur une seule page, l'entete ne s'affiche
        pas du tout : deux fleches mortes n'expliquent rien.
      */}
      {pageMax > 0 && (
        <Reveal className="mb-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label={t.monthsPrev}
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-200 enabled:hover:scale-[1.06] disabled:opacity-30 motion-reduce:transition-none"
            style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-ink)' }}
          >
            <Icon name="arrowLeft" size={18} />
          </button>

          <p className="min-w-[16ch] text-center text-[clamp(1rem,1.7vw,1.2rem)] capitalize" style={{ fontWeight: 700 }}>
            {titre}
          </p>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageMax, p + 1))}
            disabled={page === pageMax}
            aria-label={t.monthsNext}
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-200 enabled:hover:scale-[1.06] disabled:opacity-30 motion-reduce:transition-none"
            style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-ink)' }}
          >
            <Icon name="arrowRight" size={18} />
          </button>
        </Reveal>
      )}

      {/* Trois mois par rangee sur grand ecran, comme le modele. */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {mois.map(([y, m]) => {
          const semaines = semainesDuMois(y, m);
          // A plat : le trait a besoin de connaitre les VOISINS de chaque case,
          // ce que la decoupe en semaines cache. L'indice suffit ensuite a dire
          // la colonne (`di % 7`), donc a savoir si le voisin est bien sur la
          // meme ligne.
          const cases = semaines.flat();
          const nomDuMois = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(y, m, 1));
          return (
            <Reveal
              key={`${y}-${m}`}
              className="flex flex-col gap-4 rounded-2xl border p-5 md:p-6"
              style={{ borderColor: 'var(--cava-line)' }}
            >
              <h3 className="text-center text-[clamp(1rem,1.6vw,1.15rem)] capitalize leading-[1.1]" style={{ fontWeight: 700 }}>
                {nomDuMois}
              </h3>

              <div className="grid grid-cols-7 text-center text-[11px]" style={{ color: 'var(--cava-muted)' }}>
                {jours.map((j, i) => (
                  <div key={i} className="pb-1 capitalize">
                    {j}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cases.map((d, di) => {
                  if (!d) return <div key={di} aria-hidden />;
                  const si = sejourDuJour(d);
                  const s = si >= 0 ? SEJOURS[si] : null;
                  const passe = aujourdhui !== null && ymd(d) < aujourdhui;
                  const cejour = aujourdhui === ymd(d);
                  const parente = s ? parenteDu(s) : null;
                  /*
                   * LE PASSE RESTE VISIBLE — Mag : « laisse les passages qu'on
                   * puisse voir !!! on doit pouvoir voir quelles dates ont ete
                   * les precedents, et ce toujours ».
                   *
                   * Je l'avais efface, en ecrivant que « libre sur une date
                   * ecoulee est une information morte ». C'etait juger a sa
                   * place : ce calendrier n'est pas seulement un outil de
                   * reservation, c'est la MEMOIRE des sejours. Savoir qui est
                   * venu en juillet dernier vaut autant que savoir qui vient en
                   * octobre — et ça ne se retrouve nulle part ailleurs.
                   *
                   * Seul le LIBRE passe s'efface encore : un jour ecoule sans
                   * personne n'a rien a raconter, et le colorier ferait du
                   * bruit autour des sejours qu'on cherche.
                   */
                  const teinte = parente ? TEINTES[parente] : passe ? 'transparent' : LIBRE;
                  /*
                   * LE TRAIT — Mag : « quand les dates sont occupees fait
                   * plutot une ligne, c'est plus clair ».
                   *
                   * Il ne se prolonge que vers un jour DU MEME SEJOUR. C'est la
                   * condition qui fait tout le travail : deux sejours colles
                   * bout a bout — Manon jusqu'au 14 juillet, Katia des le 15 —
                   * portent la meme couleur et se lisaient comme une seule
                   * masse de vingt-cinq jours. Le trait se coupe entre eux, et
                   * ce blanc de 4 px est maintenant la seule chose qui dit le
                   * jour de la releve.
                   *
                   * LE PASSE SE RELIE COMME LE RESTE depuis qu'il garde sa
                   * couleur : le couper a aujourd'hui casserait un sejour en
                   * cours en plein milieu, sur un jour qui n'a rien de
                   * particulier pour lui.
                   */
                  const suite = (autre: Date | null | undefined) =>
                    !!s && !!autre && sejourDuJour(autre) === si;
                  const versGauche = di % 7 > 0 && suite(cases[di - 1]);
                  const versDroite = di % 7 < 6 && suite(cases[di + 1]);
                  const rond = (coin: boolean) => (coin ? '0px' : '10px');
                  return (
                    <div
                      key={di}
                      /*
                       * Le titre porte le PRENOM : le dessin de Mag ne montre
                       * que des couleurs, mais ici savoir QUI est la vaut
                       * autant que savoir que c'est pris. La liste sous la
                       * grille le dit en clair — ceci n'est que le raccourci.
                       */
                      title={s ? `${s.label} — ${jourFormat.format(lire(s.start))} → ${jourFormat.format(lire(s.end))}` : undefined}
                      className="flex aspect-square items-center justify-center text-[13px]"
                      style={{
                        background: teinte,
                        /*
                         * Le chiffre garde l'encre des qu'il y a une couleur
                         * dessous, et ne palit que sur un jour libre ecoule.
                         * Seuls LES TRAVAUX le passent au blanc : c'est le seul
                         * fond sombre du jeu, l'encre y tombe a 1,00 — soit
                         * strictement invisible — quand le blanc y monte a 17,4.
                         */
                        color:
                          parente === 'travaux'
                            ? '#fff'
                            : passe && !parente
                              ? 'var(--cava-line)'
                              : 'var(--cava-ink)',
                        fontWeight: cejour ? 800 : 500,
                        border: cejour ? '1.5px solid var(--cava-ink)' : '1.5px solid transparent',
                        /*
                         * « A CONFIRMER » N'EST PLUS UNE COULEUR, C'EST UN
                         * POINTILLE. Il l'etait — l'ocre — mais la couleur sert
                         * desormais a dire QUI, et les deux faits sont
                         * independants : un sejour peut etre incertain quel que
                         * soit le degre de parente de celui qui vient. Les
                         * confondre dans une seule teinte obligeait a choisir
                         * lequel des deux on renonce a dire.
                         *
                         * Le pointille se pose SOUS la case, dans la couleur
                         * pleine de sa parente. Il traverse le trait sans le
                         * couper, et il survit a une impression en noir et
                         * blanc — ce qu'une quatrieme teinte n'aurait pas fait.
                         */
                        borderBottom:
                          s?.tentative ? `2px dashed ${PLEIN[parente!]}` : undefined,
                        // Carre du cote ou le sejour continue, arrondi la ou il
                        // s'ouvre et la ou il se ferme : le trait a donc deux
                        // bouts ronds et rien au milieu.
                        borderRadius: `${rond(versGauche)} ${rond(versDroite)} ${rond(versDroite)} ${rond(versGauche)}`,
                        /*
                         * L'ombre COMBLE L'ECART DE LA GRILLE, elle ne decore
                         * rien. `gap-1` pose 4 px entre deux cases : sans elle,
                         * le « trait » resterait une file de pastilles collees.
                         * Elle porte la teinte exacte de la case, et se peint
                         * dans le vide entre les deux — jamais par-dessus la
                         * voisine, donc aucun risque de doubler la
                         * transparence et d'y laisser une barre plus foncee.
                         */
                        boxShadow: versDroite ? `4px 0 0 0 ${teinte}` : undefined,
                      }}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>

              {/*
                QUI, ET QUAND. C'est ce que la couleur ne peut pas dire, et
                c'etait tout l'interet de l'ancienne version : on la garde, en
                liste sous le mois plutot qu'en barres au travers. Un mois sans
                personne n'affiche rien — mieux qu'un titre suivi du vide.
              */}
              {sejoursDuMois(y, m).length > 0 && (
                <ul className="flex flex-col gap-1.5 border-t pt-3 text-[12.5px] leading-[1.45]" style={{ borderColor: 'var(--cava-line)' }}>
                  {sejoursDuMois(y, m).map(({ s, i }) => (
                    <li key={i} className="flex items-start gap-2">
                      {/* La pastille reprend la parente, et le pointille
                          l'incertitude — les deux memes signaux que la grille,
                          pour qu'on n'ait pas a apprendre deux codes. */}
                      <span
                        className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          background: s.tentative ? 'transparent' : PLEIN[parenteDu(s)],
                          border: s.tentative ? `2px dashed ${PLEIN[parenteDu(s)]}` : undefined,
                        }}
                      />
                      <span>
                        <span style={{ fontWeight: 600 }}>{s.label}</span>{' '}
                        <span style={{ color: 'var(--cava-muted)' }}>
                          {jourFormat.format(lire(s.start))} → {jourFormat.format(lire(s.end))}
                          {s.tentative && ` — ${c.legend.tentative.toLowerCase()}`}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
