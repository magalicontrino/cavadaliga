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
const DEGRES = {
  Mag: 0,
  // Ses filles, et ses parents : un cran, un degre.
  Eve: 1,
  Manon: 1,
  Régine: 1,
  Salvatore: 1,
  // Ses freres : on remonte au pere, on redescend. Deux crans.
  David: 2,
  Michaël: 2,
  // Les filles de Michaël — trois crans depuis Mag.
  Juliette: 3,
  Marie: 3,
  Zoé: 3,
  // Cousine germaine : Mag → son pere → ses grands-parents → Helene → Angèle.
  Angèle: 4,
  // Hors de l'arbre. Katia est dite « sœur de Maria Assunta », et Maria Assunta
  // ne figure nulle part dans la genealogie relevee par Mag.
  'Katia Asaro': DEHORS,
  Alex: DEHORS,
  Guillaume: DEHORS,
} as const;

type Personne = keyof typeof DEGRES;

// ─────────────────────────────────────────────────────────────────────────
// `qui` NE REMPLACE PAS `label` : le libelle reste ce que Mag ecrit et ce qui
// s'affiche (« Wk juju mamie », « Angèle +++ »), `qui` est ce qui se compte.
// Les « +++ » disent qu'il y a du monde en plus sans dire qui : ils ne peuvent
// donc peser sur aucune couleur.
// ─────────────────────────────────────────────────────────────────────────
type Sejour = { label: string; qui: Personne[]; start: string; end: string; tentative?: boolean };

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
type Parente = 'proche' | 'famille' | 'dehors';
const parenteDu = (s: Sejour): Parente => {
  const degres: number[] = s.qui.map((p) => DEGRES[p]).filter((d) => d !== DEHORS) as number[];
  if (degres.length === 0) return 'dehors';
  return Math.min(...degres) <= 2 ? 'proche' : 'famille';
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
const PROCHE = 'rgba(230, 41, 111, 0.45)';
const FAMILLE = 'rgba(232, 168, 0, 0.50)';
const DEHORS_T = 'rgba(90, 122, 46, 0.70)';
const LIBRE = 'rgba(74, 127, 196, 0.14)';
const TEINTES: Record<Parente, string> = { proche: PROCHE, famille: FAMILLE, dehors: DEHORS_T };
/** Les pastilles de la legende : pleines, elles, pour se voir a 12 px. */
const PLEIN = { proche: '#e6296f', famille: '#e8a800', dehors: '#5a7a2e', libre: '#4a7fc4' };

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
        LA LEGENDE PORTE MAINTENANT DEUX CHOSES DE NATURES DIFFERENTES : quatre
        pastilles de couleur, qui disent QUI, et une derniere entree qui n'est
        pas une couleur du tout mais un SOULIGNE POINTILLE. Elles sont separees
        par un filet vertical, sans quoi « a confirmer » se lirait comme une
        cinquieme categorie de personnes.
      */}
      <Reveal className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]" style={{ color: 'var(--cava-muted)' }}>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.proche }} />
          {c.legend.close}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.famille }} />
          {c.legend.family}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.dehors }} />
          {c.legend.outside}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.libre }} />
          {c.legend.free}
        </span>
        <span aria-hidden className="h-4 w-px" style={{ background: 'var(--cava-line)' }} />
        <span className="flex items-center gap-2">
          <span
            className="h-3 w-4"
            style={{ borderBottom: `2px dashed ${PLEIN.proche}` }}
          />
          {c.legend.tentative}
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
                  const teinte = passe ? 'transparent' : parente ? TEINTES[parente] : LIBRE;
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
                   * Le passe ne se relie pas non plus : sa case est
                   * transparente, un trait l'y ferait reapparaitre.
                   */
                  const suite = (autre: Date | null | undefined) =>
                    !!s &&
                    !passe &&
                    !!autre &&
                    sejourDuJour(autre) === si &&
                    !(aujourdhui !== null && ymd(autre) < aujourdhui);
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
                        // Le passe ne dit plus rien d'utile : « libre » sur une
                        // date ecoulee est une information morte, et le vert la
                        // ferait lire comme une occasion.
                        background: teinte,
                        color: passe ? 'var(--cava-line)' : 'var(--cava-ink)',
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
                          s?.tentative && !passe ? `2px dashed ${PLEIN[parente!]}` : undefined,
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
