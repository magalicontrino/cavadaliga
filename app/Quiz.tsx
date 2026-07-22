'use client';

import { useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';
import Icon from './Icon';
import { useI18n } from './i18n';
import { withBase } from './data';
import { PRONONCIATION, LECONS, CONJUGAISONS, CHANSONS } from './italienData';
import { sansMarques } from './Surligne';
import { texteArbre } from './FamilyTree';

/**
 * Le quiz de « La region ».
 *
 * LA REGLE, la meme que « Demander » : rien n'est invente. Chaque bonne
 * reponse est ecrite noir sur blanc dans une section de cette page, et le
 * bouton « relire le passage » y mene. Corriger un texte corrige donc le quiz.
 *
 * Il vit au BAS de la page, hors des filtres : on joue apres avoir lu, et on
 * ne veut pas qu'un bouton de tri le fasse disparaitre.
 */

/*
 * Les propositions ne sont PAS colorees tant qu'on n'a pas repondu.
 *
 * Elles l'ont ete — jaune, cyan, vert tendre, les couleurs de l'arbre. Mag :
 * « retire ces couleurs, c'est perturbant, on a l'impression qu'on a deja
 * joue ». Elle a raison, et la raison est mecanique : le vert et le rouge
 * sont deja le langage de la correction, juste en dessous. Peindre les choix
 * avant la reponse, c'est parler deux fois la meme langue pour dire deux
 * choses differentes.
 *
 * La couleur ne sort donc qu'apres le clic, et elle ne veut plus dire qu'une
 * chose : juste, faux, ou pas choisi.
 */
// Le jaune de l'arbre pour la bonne reponse — Mag : « le vert non, du jaune
// oui ». Une seule couleur dans tout le jeu : elle ne dit qu'une chose, et
// on n'a jamais a se demander laquelle.
const JAUNE = '#ffd452';

/**
 * Melange les reponses, sinon la bonne serait TOUJOURS la premiere.
 *
 * Elles sont ecrites dans l'ordre « bonne d'abord » dans i18n, parce que c'est
 * ainsi qu'on les relit sans se tromper. A l'ecran, il faut evidemment les
 * brasser — et de façon STABLE pendant la partie : un melange refait a chaque
 * rendu deplacerait les boutons sous le doigt. D'ou ce tirage reproductible,
 * calcule a partir de la graine du jour et du rang de la question.
 */
function melange<T>(liste: T[], graine: number): T[] {
  // Un vrai generateur (mulberry32) : ma premiere version tirait sur un
  // Math.sin, et la bonne reponse restait en tete huit fois sur douze —
  // mesure faite. Un melange qui ne melange pas est pire que pas de melange :
  // on croit le jeu honnete alors qu'il souffle la reponse.
  let a = graine + 0x6d2b79f5;
  const suivant = () => {
    a = (a + 0x6d2b79f5) | 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...liste];
  for (let i = out.length - 1; i > 0; i--) {
    const k = Math.floor(suivant() * (i + 1));
    [out[i], out[k]] = [out[k], out[i]];
  }
  return out;
}

/**
 * Le theme d'une question EST la section d'ou vient sa reponse — et son
 * libelle est celui du bouton de tri de la page, pas un mot invente pour le
 * quiz. Deux listes de themes qui divergent, c'est une question qui renvoie
 * vers une section qui ne s'appelle plus pareil.
 */
/*
 * `page` n'est la que pour les themes dont le texte vit AILLEURS que sur « La
 * region ». Le cours d'italien est le premier du genre : « relire le passage »
 * doit alors quitter la page au lieu de chercher une ancre qui n'existe pas
 * ici — sans ça, le lien tomberait dans le vide, comme au tout premier jour du
 * quiz.
 */
const THEMES = [
  { ancre: 'lieux', cle: 'places' },
  { ancre: 'etna', cle: 'etna' },
  { ancre: 'arabe', cle: 'arab' },
  { ancre: 'coutumes', cle: 'customs' },
  { ancre: 'specialites', cle: 'specialties' },
  { ancre: 'alcools', cle: 'drinks' },
  { ancre: 'cafe', cle: 'coffee' },
  { ancre: 'sports', cle: 'sports' },
  { ancre: 'faune', cle: 'fauna' },
  { ancre: 'histoire', cle: 'history' },
  { ancre: 'livres', cle: 'books' },
  { ancre: 'pastasciutta', cle: 'pasta' },
  { ancre: 'symboles', cle: 'symbols' },
  { ancre: 'legendes', cle: 'legends' },
  { ancre: 'scopa', cle: 'scopa' },
  { ancre: 'italien', cle: 'italian', page: '/italien' },
  /*
   * LA FAMILLE vit sur sa propre page, et son quiz aussi.
   *
   * `chezElle` veut dire : ce theme ne se melange pas au quiz de « La
   * region ». Ce n'est pas de la coquetterie — les questions sur l'arbre ne
   * s'adressent pas au meme monde. Un visiteur qui decouvre la Sicile n'a
   * aucune raison de tomber sur « combien d'enfants avaient Salvatore et
   * Giuseppina », et un cousin qui vient lire l'arbre ne veut pas trier a
   * travers soixante questions sur les cannoli.
   *
   * Pas de `page` : le quiz est SUR la page famille, l'ancre est donc locale
   * et la fleche remonte, comme partout ailleurs.
   */
  { ancre: 'recit', cle: 'story', chezElle: true },
  { ancre: 'arbre', cle: 'tree', chezElle: true },
  { ancre: 'valguarnera', cle: 'valguarnera', chezElle: true },
  /*
   * LES PAGES PRATIQUES ont leur quiz elles aussi — Mag : « tu peux remettre a
   * chaque fois le meme quizz mais pointe sur le sujet en rapport avec la
   * page ».
   *
   * L'ancre de chaque theme est l'IDENTIFIANT DE SECTION de sa page : `arrivee`,
   * `parking`, `argent`, `bestioles`, `depart` existent deja tels quels sur
   * « Infos pratiques ». « Relire le passage » y mene donc sans qu'on ait rien
   * a inventer — et le jour ou une section est renommee, le lien casse
   * visiblement au lieu de mentir.
   */
  { ancre: 'arrivee', cle: 'arrival', chezElle: true },
  { ancre: 'depart', cle: 'leaving', chezElle: true },
  { ancre: 'parking', cle: 'parking', chezElle: true },
  { ancre: 'argent', cle: 'money', chezElle: true },
  { ancre: 'bestioles', cle: 'clean', chezElle: true },
  { ancre: 'voyage', cle: 'trip', chezElle: true },
  { ancre: 'dechets', cle: 'waste', chezElle: true },
] as const;

/*
 * Les NIVEAUX ont ete retires — Mag les a juges de trop. Le champ `niveau`
 * reste sur chaque question dans i18n : il ne coute rien, il documente la
 * difficulte pour qui relit la liste, et le retirer voudrait dire toucher
 * soixante-trois lignes dans trois langues pour ne rien gagner.
 */

/*
 * L'EXTRAIT : la phrase de la page qui porte la reponse.
 *
 * Mag : « quand c'est faux, note juste l'extrait court en plus du lien
 * "relire le passage" — et quand c'est bon aussi ». Le lien renvoie plus haut ;
 * l'extrait, lui, repond tout de suite, sans quitter le jeu.
 *
 * Il n'est PAS ecrit a la main. Soixante-trois extraits recopies dans trois
 * langues, ce sont soixante-trois occasions de dire autre chose que la
 * section — et le jour ou Mag corrige un texte, l'extrait mentirait sans que
 * personne s'en apercoive. On va donc le CHERCHER dans la page : on decoupe
 * la section en phrases, et on garde celle qui contient le plus de mots de la
 * bonne reponse. Corriger le texte corrige l'extrait, comme pour tout le
 * reste du quiz.
 */
const nettoie = (x: string) =>
  x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Le texte de la section d'ou vient la reponse — la meme que `ancre`. */
function texteDe(t: ReturnType<typeof useI18n>['t'], ancre: string, lang: 'fr' | 'it' | 'en'): string {
  switch (ancre) {
    case 'lieux':
      // Le bloc du Val di Noto fait partie de la section « Les lieux » : sans
      // lui, les questions sur les huit villes n'auraient pas d'extrait.
      return [t.placesIntro, ...t.regionPlaces, t.unescoNote.quake, t.unescoNote.towns, t.unescoNote.near, t.unescoNote.syracuse].join(' ');
    case 'etna':
      return [t.etnaPage.intro, ...t.etnaPage.facts.map((f) => f.text)].join(' ');
    case 'arabe':
      return [t.arabPage.intro, ...t.arabPage.facts.map((f) => f.text), t.arabPage.note].join(' ');
    case 'coutumes':
      return t.tastePage.facts.map((f) => f.text).join(' ');
    case 'specialites':
      return t.specialtiesPage.facts.map((f) => f.text).join(' ');
    case 'alcools':
      return t.drinksPage.facts.map((f) => f.text).join(' ');
    case 'cafe':
      return t.coffeePage.facts.map((f) => f.text).join(' ');
    // La pastasciutta : tout ce que la section affiche, y compris la recette.
    // Une question sur les 100 g de beurre doit pouvoir retrouver sa phrase.
    // Les deux symboles : les deux textes, plus la note sur Caltagirone. Les
    // legendes des photos comptent aussi — elles portent « par paire ».
    // Les legendes : le lieu compte autant que le recit, une question peut
    // porter sur « ou ». On recolle donc titre, lieu et texte.
    // La scopa : les regles, le decompte ET le bareme de la primiera. Une
    // question sur « combien vaut le 7 » doit retrouver sa ligne.
    case 'scopa':
      return [
        t.scopaPage.intro,
        ...t.scopaPage.rules.map((r) => `${r.title}. ${r.text}`),
        ...t.scopaPage.score.map((x) => `${x.label} : ${x.text}`),
        t.scopaPage.primieraText,
        ...t.scopaPage.primiera.map((x) => `${x.carte} ${x.points}`),
        t.scopaPage.note,
      ].join(' ');
    case 'legendes':
      return [
        t.legendsPage.intro,
        ...t.legendsPage.items.map((l) => `${l.title}, ${l.place}. ${l.text}`),
        t.legendsPage.note,
      ].join(' ');
    case 'symboles':
      return [
        t.symbolsPage.intro,
        `${t.symbolsPage.trinacria.title}. ${t.symbolsPage.trinacria.text} ${t.symbolsPage.trinacria.caption}`,
        `${t.symbolsPage.teste.title}. ${t.symbolsPage.teste.text} ${t.symbolsPage.teste.caption}`,
        t.symbolsPage.note,
      ].join(' ');
    case 'pastasciutta':
      return [
        t.pastaPage.intro,
        t.pastaPage.word.text,
        ...t.pastaPage.story.map((x) => `${x.title}. ${x.text}`),
        t.pastaPage.brothers,
        t.pastaPage.recipe.intro,
        ...t.pastaPage.recipe.ingredients,
        ...t.pastaPage.recipe.steps,
        t.pastaPage.recipe.note,
      ].join(' ');
    case 'faune':
      return [t.faunaPage.intro, ...t.faunaPage.facts.map((f) => f.text), t.faunaPage.note].join(' ');
    case 'sports':
      return [t.sportsPage.intro, ...t.sportsPage.facts.map((f) => `${f.title}. ${f.text}`), t.sportsPage.note].join(' ');
    case 'histoire':
      return [t.historyPage.intro, ...t.historyPage.facts.map((f) => f.text)].join(' ');
    case 'livres':
      return t.booksPage.list.map((b) => `${b.titre}, ${b.auteur}. ${b.text}`).join(' ');
    // Le recit de Salva, tel que Mag l'a ecrit — rien d'autre. C'est court, et
    // c'est bien : chaque phrase y porte un fait.
    case 'recit':
      return t.salvaPage.storyText.join(' ');
    // L'arbre lui-meme, aplati en phrases par FamilyTree. Une seule source :
    // corriger une branche corrige l'extrait du quiz.
    case 'arbre':
      return texteArbre(t.salvaPage);
    // Valguarnera : le village et la bataille de juillet 1943. `chezElle`, comme
    // le recit et l'arbre — un visiteur venu pour la Sicile n'a rien a faire
    // avec les regiments canadiens de 1943.
    case 'valguarnera':
      return [
        t.valguarneraPage.intro,
        ...t.valguarneraPage.facts.map((f) => `${f.title}. ${f.text}`),
        t.valguarneraPage.family,
        t.valguarneraPage.note,
      ].join(' ');
    /*
     * LES PAGES PRATIQUES. Meme principe que partout : on recolle le texte
     * REELLEMENT affiche par la section, et l'extrait va y chercher la phrase
     * qui porte la reponse. Corriger la page corrige le quiz.
     */
    case 'arrivee':
      return [
        t.arrivee.intro,
        ...t.arrivee.address,
        ...t.arrivee.operation.flatMap((o) => [o.title, ...(o.items ?? [])]),
      ].join(' ');
    case 'depart':
      return [t.depart.intro, ...t.depart.checklist].join(' ');
    case 'parking':
      return [t.parkingPage.intro, ...t.parkingPage.facts.map((f) => `${f.title}. ${f.text}`), t.parkingPage.note].join(' ');
    case 'argent':
      return [t.cashPage.intro, ...t.cashPage.spots.map((x) => `${x.title}, ${x.where}. ${x.text}`), t.cashPage.note].join(' ');
    case 'bestioles':
      return [t.cleanPage.intro, ...t.cleanPage.rules, t.cleanPage.antsText].join(' ');
    case 'voyage':
      // Nu, comme pour le chat : l'extrait du quiz est du texte affiche tel quel.
      return sansMarques(t.prepare.groups.flatMap((g) => [g.title, ...(g.items ?? []), ...(g.links ?? []).map((l) => l.label)]).join(' '));
    case 'dechets':
      return [t.wastePage.intro, t.wastePage.eveningNote, t.wastePage.changeNote].join(' ');
    /*
     * L'italien : l'extrait se batit EN DEUX LANGUES, la phrase italienne
     * suivie de son sens. C'est ce que Mag demande — « fais tout en bilingue
     * pour que ça ait du sens » — et c'est la seule facon qu'un extrait soit
     * lisible : « Odio gli indifferenti » tout seul ne dit rien a qui ne parle
     * pas italien, et sa traduction seule ne prouve rien.
     */
    case 'italien':
      return [
        // Les regles de prononciation aussi : une question sur le son de
        // « sciopero » n'avait aucun texte ou puiser son extrait.
        ...PRONONCIATION.map((r) => r.regle[lang]),
        /*
         * ET LES CONJUGAISONS. Elles manquaient : une question sur « ho
         * parlato » ou sur le futur de essere n'avait aucun passage ou puiser,
         * donc pas d'extrait — la reponse etait pourtant dans la page, en
         * toutes lettres, dans les tableaux. Chaque table devient une phrase :
         * l'infinitif, son sens, puis les six formes.
         */
        ...CONJUGAISONS.flatMap((c) => [
          c.quand[lang],
          c.regle[lang],
          ...c.tables.map((t) => `${t.verbe} (${t.sens[lang]}) : ${t.formes.join(', ')}`),
        ]),
        ...LECONS.flatMap((l) =>
          l.phrases.flatMap((f) => [`${f.it} — ${f.sens[lang]}`, ...(f.note ? [f.note[lang]] : [])]),
        ),
        // `quoi` est facultatif depuis que Mag l'a retire des chansons
        // d'auteur ; le deroule, lui, porte desormais le recit.
        ...CHANSONS.flatMap((c) => [
          ...(c.quoi ? [c.quoi[lang]] : []),
          ...(c.deroule ?? []).map((d) => d.texte[lang]),
          c.langue[lang],
          ...c.mots.map((m) => `${m.it} — ${m.sens[lang]}`),
        ]),
      ]
        /*
         * Chaque entree est CLOSE avant d'etre recollee aux autres.
         *
         * Sans ça, « Sciopero — La grève » n'ayant pas de point final se
         * soudait a ce qui l'entourait, et l'extrait ressortait en bouillie :
         * « Vous pouvez venir aujourd'hui ? Sciopero — La grève Se prononce… »
         * — la fin d'une lecon sur le plombier collee au mot « greve ». Mesure
         * faite. Un point, et chaque phrase redevient une phrase.
         */
        .map((x) => (/[.!?\u2026]$/.test(x.trim()) ? x.trim() : `${x.trim()}.`))
        .join(' ');
    default:
      return '';
  }
}

function extraitPour(texte: string, reponse: string): string | null {
  // Les mots qui portent le sens : au moins quatre lettres, ou un nombre.
  // « la », « du », « les » se retrouvent partout et ne designent rien.
  const mots = nettoie(reponse).split(/[^a-z0-9\u2018\u2019']+/).filter(Boolean);
  let cles = mots.filter((m) => m.length >= 4 || /^[0-9]+$/.test(m));
  // Une reponse faite de petits mots n'a aucune cle de quatre lettres :
  // « Let me » n'en laissait aucune, et l'extrait sortait vide alors que la
  // phrase etait dans la page. On redescend alors a deux lettres — c'est moins
  // precis, mais chercher quelque chose vaut mieux que ne rien chercher.
  if (!cles.length) cles = mots.filter((m) => m.length >= 2);
  if (!cles.length) return null;

  // Decoupage en PHRASES, et rien de plus fin.
  //
  // J'avais aussi coupe sur le tiret cadratin, pour des extraits plus courts.
  // Mesure : « les hommes enfouissaient la neige dans des fosses de pierre —
  // les neviere — isolees sous la cendre » donnait « les neviere », treize
  // signes, jete par le filtre de longueur. La reponse etait dans la page et
  // l'extrait sortait vide. Le tiret est une respiration, pas une fin de
  // phrase.
  const morceaux = texte
    .split(/(?<=[.!?\u2026])\s+|;\s+/)
    .map((x) => x.trim())
    .filter(Boolean);

  /*
   * Une phrase trop courte se RECOLLE a la suivante, elle ne se jette pas.
   *
   * Le filtre de longueur avait deja mange « les neviere » ; il a remis ca
   * avec « Ca tient six jours. », dix-huit signes, alors que c'est exactement
   * la reponse a la question. Une phrase breve n'est pas une phrase pauvre :
   * c'est souvent la chute, donc le fait. On la garde, avec ce qui suit pour
   * lui donner un contexte.
   */
  const phrases: string[] = [];
  for (const m of morceaux) {
    if (phrases.length && phrases[phrases.length - 1].length < 40) phrases[phrases.length - 1] += ` ${m}`;
    else phrases.push(m);
  }

  let meilleure: string | null = null;
  let score = 0;
  for (const ph of phrases) {
    const n = nettoie(ph);
    /*
     * On compte la LONGUEUR des mots retrouves, pas leur nombre.
     *
     * A compter les mots, « Sono anarchica » tombait sur « Sono allergico ai
     * crostacei » : les deux phrases partagent « sono », une touche chacune,
     * et la plus courte gagnait. Or « anarchica » vaut evidemment mieux que
     * « sono » — un mot long est un mot rare, donc un mot qui designe. Neuf
     * lettres contre quatre, et la bonne phrase repasse devant.
     */
    const poids = cles.filter((m) => n.includes(m)).reduce((somme, m) => somme + m.length, 0);
    // A merite egal, la phrase la plus courte : c'est un extrait, pas un chapitre.
    if (poids > score || (poids === score && poids > 0 && meilleure && ph.length < meilleure.length)) {
      score = poids;
      meilleure = ph;
    }
  }
  if (!meilleure || score === 0) return null;
  return meilleure.length > 400 ? `${meilleure.slice(0, 397).trimEnd()}\u2026` : meilleure;
}

/** La puce de tri : allumee, elle prend l'encre ; eteinte, elle attend. */
function Puce({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-4 py-2 text-[13px] transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none"
      style={{
        background: on ? 'var(--cava-ink)' : 'transparent',
        color: on ? 'var(--cava-bg)' : 'var(--cava-ink)',
        border: '1px solid var(--cava-ink)',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/*
 * `only` : la liste des themes que CE quiz couvre.
 *
 * Sans lui, il n'y a qu'un quiz sur le site et il prend tout. Avec, la page
 * famille peut avoir le sien sans que « La region » herite de questions sur
 * l'arbre genealogique. Les themes marques `chezElle` ne sortent jamais
 * d'eux-memes : il faut les demander.
 */
export default function Quiz({
  only,
  titre: titreDonne,
  intro: introDonnee,
  ancreLocale,
}: { only?: readonly string[]; titre?: string; intro?: string; ancreLocale?: string } = {}) {
  const { t, lang } = useI18n();
  const q = t.quizPage;
  /*
   * Le meme jeu, mais il ne peut pas s'annoncer « Vous connaissez la region ? »
   * au bas d'une page qui parle de l'arbre genealogique ou du cours d'italien.
   * Seuls le titre et l'accroche changent : tout le reste est litteralement le
   * meme quiz.
   *
   * Le titre est DONNE par la page, il n'est plus deduit d'un drapeau. La
   * premiere version avait un `famille` booleen ; il aurait fallu un `italien`,
   * puis un autre — et le composant aurait fini par connaitre la liste des
   * pages du site, ce qui n'est pas son affaire.
   */
  const titre = titreDonne ?? q.title;
  const accroche = introDonnee ?? q.intro;

  const themes = useMemo(
    () => THEMES.filter((x) => (only ? only.includes(x.ancre) : !('chezElle' in x && x.chezElle))),
    [only],
  );
  /*
   * La graine du hasard, tiree A CHAQUE PARTIE.
   *
   * Le melange etait stable, mais previsible : il se calculait a partir du
   * NUMERO de la partie, si bien que la premiere partie sortait toujours dans
   * le meme ordre — recharger la page redonnait exactement les memes questions
   * dans la meme suite. Mag : « ca doit etre aleatoire, l'ordre des questions
   * et des reponses ».
   *
   * Elle est tiree au clic sur « Commencer », jamais pendant un rendu : un
   * `Math.random()` au rendu donnerait au serveur et au navigateur deux ordres
   * differents, et React refuserait la page.
   *
   * Elle reste FIXE pendant toute la partie — c'est elle qui empeche les
   * boutons de se redistribuer sous le doigt entre deux rendus.
   */
  const [graine, setGraine] = useState(0);
  const [n, setN] = useState(-1); // -1 = ecran d'accueil
  const [choisi, setChoisi] = useState<string | null>(null);
  /*
   * Choisir n'est pas repondre.
   *
   * Le premier clic revelait tout, et fermait les trois boutons dans la
   * foulee. Mag : « je ne peux pas me raviser — si je me dis "ah bah non,
   * c'est ni l'un ni l'autre", je ne peux plus cliquer sur autre chose ».
   * C'etait une faute : on ferme la porte avant que la personne ait fini de
   * penser.
   *
   * Le clic pose donc un choix, qui se deplace tant qu'on veut. C'est
   * « Valider » qui tranche — et lui seul compte le point. Sans cette
   * separation, se raviser APRES avoir vu la reponse rendrait le score
   * gratuit : le jeu n'apprendrait plus rien.
   */
  const [valide, setValide] = useState(false);
  /** Ce qu'on a repondu, question par question — pour le remontrer en
   *  revenant en arriere. */
  const [memoire, setMemoire] = useState<(string | null)[]>([]);
  const [points, setPoints] = useState(0);
  /** null = on ne trie pas. Le tri se fait par theme, et par theme seulement. */
  const [theme, setTheme] = useState<string | null>(null);

  /*
   * ARRIVER DIRECTEMENT SUR UN THEME — « /la-region#quiz-italien ».
   *
   * Le cours d'italien renvoie ici depuis « S'entrainer », et le lien doit
   * tenir sa promesse : dire « le quiz d'italien » puis deposer quelqu'un
   * devant quatre-vingt-dix-sept questions dont douze le concernent, c'est le
   * tromper. L'ancre porte donc le theme, et le tri se pose tout seul.
   *
   * On lit AUSSI les changements d'ancre : revenir sur la page par un autre
   * lien doit retrier, pas laisser le tri precedent.
   */
  useEffect(() => {
    const lire = () => {
      const cle = window.location.hash.replace(/^#quiz-?/, '');
      if (cle && THEMES.some((x) => x.ancre === cle)) setTheme(cle);
    };
    lire();
    window.addEventListener('hashchange', lire);
    return () => window.removeEventListener('hashchange', lire);
  }, []);

  /*
   * Le paquet de la partie en cours.
   *
   * Il tient a la graine, tiree une fois au depart : rien ne se redistribue
   * sous le doigt entre deux rendus, et deux parties ne se ressemblent pas.
   * L'ORDRE DES QUESTIONS est melange lui aussi — a soixante-trois questions,
   * les reprendre toujours dans la meme suite rendrait la deuxieme partie
   * previsible des la premiere.
   */
  const paquet = useMemo(() => {
    const choisies = q.questions.filter(
      (x) => themes.some((th) => th.ancre === x.ancre) && (!theme || x.ancre === theme),
    );
    return melange(choisies, graine);
  }, [q.questions, themes, theme, graine]);

  const question = paquet[n];
  const bonne = question?.choix[question.bonne];
  // Chaque question tire son propre melange de la meme graine — decale par son
  // rang, sinon deux questions voisines seraient brassees a l'identique.
  const choix = useMemo(
    () => (question ? melange(question.choix, graine + n * 7919) : []),
    [question, graine, n],
  );

  const fini = n >= 0 && n >= paquet.length;

  /** Lancer une partie depuis l'ecran de choix. (« Rejouer », lui, revient a
   *  cet ecran : voir le bouton de fin.) */
  const rejouer = () => {
    setGraine(Math.floor(Math.random() * 2147483647));
    setPoints(0);
    setChoisi(null);
    setValide(false);
    setMemoire([]);
    setN(0);
  };

  /** Changer un tri remet le jeu a l'accueil : on ne change pas de paquet en
   *  cours de route sans le dire. */
  const trier = (f: () => void) => {
    f();
    setN(-1);
    setChoisi(null);
    setValide(false);
    setMemoire([]);
    setPoints(0);
  };

  /** La phrase de la page qui porte la bonne reponse. Vide si on ne la
   *  retrouve pas — mieux vaut rien qu'un extrait a cote. */
  const extrait = useMemo(
    () => (question && bonne ? extraitPour(texteDe(t, question.ancre, lang), bonne) : null),
    [question, bonne, t, lang],
  );

  const libelleTheme = (ancre: string) => {
    const x = THEMES.find((y) => y.ancre === ancre);
    return x ? t.regionFilter[x.cle] : ancre;
  };

  /*
   * REVENIR EN ARRIERE — Mag : « permets de revenir en arriere au cas ou on
   * voudrait relire une reponse ».
   *
   * La question precedente se rouvre DEJA VALIDEE : on y revient pour relire
   * l'extrait et la bonne reponse, pas pour rejouer un coup deja joue. Le
   * point reste donc acquis, et le score ne bouge pas — sans quoi il suffirait
   * de reculer pour se rattraper.
   *
   * Le paquet ne bouge pas non plus : il tient a la graine de la partie, la
   * question d'avant est exactement celle qu'on avait sous les yeux.
   */
  const precedente = () => {
    setChoisi(memoire[n - 1] ?? null);
    setValide(true);
    setN((i) => i - 1);
  };

  const suivante = () => {
    // Si la suivante a deja ete jouee — on etait revenu en arriere — on la
    // rouvre telle qu'on l'avait laissee plutot que de la reposer a blanc.
    const dejaJouee = memoire[n + 1] !== undefined;
    setChoisi(dejaJouee ? memoire[n + 1] : null);
    setValide(dejaJouee);
    setN((i) => i + 1);
  };

  return (
    <section id="quiz" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-24 pt-16 md:px-10">
      <Reveal className="mb-8 flex flex-col gap-2 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
        <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
          <Icon name="hourglass" size={16} /> {q.eyebrow}
        </span>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
          {titre}
        </h2>
        <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
          {accroche}
        </p>
      </Reveal>

      <Reveal
        className="rounded-3xl border p-6 md:p-10"
        style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
      >
        {n === -1 && (
          <div className="flex flex-col gap-5">
            <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
              {q.pick}
            </p>

            {/*
              TOUT REUNI, en un seul ruban — comme les pastilles du chat.
              Les themes et les niveaux prenaient trois lignes de haut, et sur
              un telephone le bouton « Commencer » tombait sous le pli : on
              choisissait sans voir par ou partir. Ils glissent maintenant
              ensemble, d'un seul geste, sur deux lignes alignees.

              Chaque pastille garde SA ligne (`gridRow`), sinon le remplissage
              en colonnes melangerait un theme et un niveau dans la meme
              colonne — deux questions differentes posees au meme endroit.
            */}
            {/*
              `-my-2 py-2` : de la place VERTICALE pour le survol.
              Mesure du bug signale par Mag : le ruban faisait exactement
              38 px, la hauteur d'une pastille, marge zero en haut comme en
              bas. Or `overflow-x-auto` entraine `overflow-y: auto` — au
              survol, l'agrandissement de 4 % debordait d'un pixel de chaque
              cote et se faisait RABOTER par le conteneur, quand il ne
              declenchait pas une barre de defilement verticale qui faisait
              sauter la rangee. Huit pixels de marge interieure donnent l'air
              qu'il faut, et la marge negative les reprend pour que rien ne
              bouge autour.
            */}
            {/*
              LE RUBAN DE TRI DISPARAIT QUAND IL N'Y A QU'UN THEME.
              Au bas du cours d'italien, il affichait « Tous les themes » et
              « L'italien » : deux boutons pour un seul choix, qui ne trie rien
              et laisse croire qu'il manque quelque chose.
            */}
            {/*
              LES THEMES REVIENNENT A LA LIGNE — Mag : « revient a la ligne
              quand il y en a trop ».

              C'etait un ruban qui defilait lateralement. A douze themes, les
              derniers sortaient de l'ecran : on ne pouvait pas choisir ce qu'on
              ne voyait pas, et rien n'indiquait qu'il y en avait d'autres — un
              debordement horizontal ne laisse aucune trace, contrairement a une
              page qui se prolonge vers le bas.

              `flex-wrap` remplace `overflow-x-auto`, et les marges negatives
              partent avec lui : elles n'etaient la que pour rendre au ruban la
              place que son debordement lui prenait. Au passage, la vieille gene
              au survol disparait d'elle-meme — c'est `overflow-y: auto`,
              implique par `overflow-x-auto`, qui rognait l'agrandissement des
              pastilles.
            */}
            <div className={themes.length > 1 ? '' : 'hidden'}>
              <div className="flex flex-wrap gap-2">
                <Puce on={theme === null} onClick={() => trier(() => setTheme(null))}>{q.allThemes}</Puce>
                {themes.map((x) => (
                  <Puce key={x.ancre} on={theme === x.ancre} onClick={() => trier(() => setTheme(x.ancre))}>
                    {t.regionFilter[x.cle]}
                  </Puce>
                ))}
              </div>
            </div>

            {paquet.length === 0 ? (
              <p className="text-[14px]" style={{ fontWeight: 600 }}>{q.empty}</p>
            ) : (
              <button type="button" onClick={rejouer} className="cava-pill w-fit px-6 py-3 text-[15px]">
                {q.start} · {paquet.length} →
              </button>
            )}
          </div>
        )}

        {question && (
          <div className="flex flex-col gap-6">
            <p className="text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)', fontWeight: 700 }}>
              {q.progress.replace('{n}', String(n + 1)).replace('{t}', String(paquet.length))}
              {' · '}
              {libelleTheme(question.ancre)}
            </p>

            <h3 className="max-w-[46ch] text-[clamp(1.2rem,2.6vw,1.7rem)] leading-[1.25]" style={{ fontWeight: 600 }}>
              {question.q}
            </h3>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              {choix.map((c) => {
                const estBonne = c === bonne;
                const monChoix = c === choisi;
                /*
                 * Avant de valider : le choix se marque a l'encre, comme les
                 * pastilles de tri de tout le site — « c'est celui-la que je
                 * vise », rien de plus. Aucune couleur ne juge encore.
                 * Apres : le jaune dit la bonne reponse, TOUJOURS, meme quand
                 * on s'est trompe — sinon on repart sans savoir. Le rouge ne
                 * marque que l'erreur qu'on a commise soi-meme.
                 */
                const fond = !valide
                  ? monChoix ? 'var(--cava-ink)' : 'transparent'
                  : estBonne ? JAUNE : 'transparent';
                // L'erreur qu'on a commise : raturee, pas rougie. Mag —
                // « laisse plutot en noir et blanc et barre au milieu, une
                // belle barre fine a travers les mots ». Le rouge criait la
                // faute ; le trait la constate, et laisse le jaune etre la
                // seule couleur de l'ecran.
                const rature = valide && monChoix && !estBonne;
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={valide}
                    aria-pressed={monChoix}
                    onClick={() => setChoisi(c)}
                    className="rounded-full px-5 py-3 text-left text-[15px] transition-transform duration-200 hover:scale-[1.02] disabled:hover:scale-100 motion-reduce:transition-none"
                    style={{
                      background: fond,
                      color: !valide && monChoix ? 'var(--cava-bg)' : 'var(--cava-ink)',
                      fontWeight: 600,
                      border: '1px solid var(--cava-ink)',
                      opacity: valide && !estBonne && !monChoix ? 0.45 : 1,
                    }}
                  >
                    {/* Le trait porte sur les MOTS, pas sur la pastille : il
                        s'arrete donc avec le texte, et ne traverse pas le
                        vide jusqu'au bord. Fin — un demi-pixel de plus et il
                        rature au lieu de barrer. */}
                    <span
                      style={
                        rature
                          ? {
                              textDecoration: 'line-through',
                              textDecorationThickness: '1px',
                              textDecorationColor: 'var(--cava-ink)',
                            }
                          : undefined
                      }
                    >
                      {c}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Revenir en arriere : disponible a tout moment, pas seulement
                une fois la question validee. On veut souvent relire la
                precedente AVANT de repondre a celle-ci — c'est meme le cas le
                plus frequent, et l'exiger d'avoir repondu d'abord serait une
                porte fermee de plus. */}
            {n > 0 && (
              <button
                type="button"
                onClick={precedente}
                className="w-fit rounded-full px-4 py-2 text-[13px] transition-transform duration-200 hover:scale-[1.03] motion-reduce:transition-none"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-muted)', fontWeight: 600 }}
              >
                ← {q.back}
              </button>
            )}

            {/* Tant qu'on n'a pas valide : un seul bouton, et rien d'autre.
                Le verdict n'apparait pas, donc rien ne presse. */}
            {choisi !== null && !valide && (
              <div className="border-t pt-5" style={{ borderColor: 'var(--cava-line)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setValide(true);
                    setMemoire((m) => { const c = [...m]; c[n] = choisi; return c; });
                    if (choisi === bonne) setPoints((p) => p + 1);
                  }}
                  className="rounded-full px-6 py-2.5 text-[14px]"
                  style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)', fontWeight: 600 }}
                >
                  {q.check} →
                </button>
              </div>
            )}

            {valide && (
              <div className="flex flex-col gap-4 border-t pt-5" style={{ borderColor: 'var(--cava-line)' }}>
                <p className="text-[15px]" style={{ fontWeight: 600, color: choisi === bonne ? '#3b6d11' : 'var(--cava-pink-fonce)' }}>
                  {choisi === bonne ? q.good : q.wrong}
                </p>
                {/* L'extrait, avant les boutons : on repond a la question
                    posee avant de proposer d'aller relire. Il est en italique
                    et entre guillemets — ce n'est pas notre phrase, c'est
                    celle de la page. */}
                {extrait && (
                  <p
                    className="max-w-[70ch] border-l-2 pl-4 text-[14px] italic leading-[1.65]"
                    style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}
                  >
                    « {extrait} »
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {/* Le renvoi au texte : c'est lui qui fait du jeu une lecture. */}
                  {(() => {
                    // Un theme qui vit ailleurs emmene sur SA page ; les autres
                    // gardent l'ancre locale et la fleche qui monte.
                    const th = THEMES.find((x) => x.ancre === question.ancre);
                    /*
                     * `ancreLocale` l'emporte sur `page`.
                     *
                     * Le theme « italien » porte `page: '/italien'` — c'etait
                     * juste tant que le quiz vivait sur « La region ». Depuis
                     * qu'une copie tourne SUR le cours, ce meme lien y renvoyait
                     * a lui-meme : un rechargement de la page ou l'on est deja,
                     * et la partie perdue au passage. La page qui pose le quiz
                     * dit donc ou relire chez elle.
                     */
                    const ailleurs = ancreLocale ? null : th && 'page' in th ? (th as { page: string }).page : null;
                    return (
                      <a
                        href={ailleurs ? withBase(ailleurs) : `#${ancreLocale ?? question.ancre}`}
                        className="cava-pill px-5 py-2.5 text-[13px]"
                      >
                        {q.seeSection} {ailleurs ? '→' : '↑'}
                      </a>
                    );
                  })()}
                  <button type="button" onClick={suivante} className="rounded-full px-5 py-2.5 text-[13px]" style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)', fontWeight: 600 }}>
                    {n + 1 === paquet.length ? q.scoreTitle : q.next} →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {fini && (
          <div className="flex flex-col items-start gap-5">
            <p className="text-[13px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
              {q.scoreTitle}
            </p>
            <p className="text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.1]" style={{ fontWeight: 900 }}>
              {q.scoreLine.replace('{n}', String(points)).replace('{t}', String(paquet.length))}
            </p>
            {/* « Rejouer » ramene aux CHOIX INITIAUX — Mag : « il faut que ca
                revienne au choix initiaux avec les themes ». Apres une partie,
                on veut presque toujours changer de sujet plutot que refaire le
                meme paquet. Il n'y a donc plus qu'un bouton.

                Le theme repart a zero, et pas seulement l'ecran : en gardant
                le dernier choisi, on revenait sur une rangee ou AUCUNE
                pastille visible n'etait allumee — celle qui l'etait se
                trouvait hors ecran, a droite — pendant que le bouton annoncait
                « Commencer · 5 ». On lisait un compte sans sa raison. */}
            <button type="button" onClick={() => trier(() => setTheme(null))} className="cava-pill px-6 py-3 text-[15px]">
              {q.again} ↻
            </button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
