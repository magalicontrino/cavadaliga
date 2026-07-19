'use client';

import { useMemo, useState } from 'react';
import Reveal from './Reveal';
import Icon from './Icon';
import { useI18n } from './i18n';

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
 * brasser — et de façon STABLE : un melange refait a chaque rendu deplacerait
 * les boutons sous le doigt. D'ou ce tirage sans hasard, tire du numero de la
 * question et de celui de la partie.
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
const THEMES = [
  { ancre: 'lieux', cle: 'places' },
  { ancre: 'etna', cle: 'etna' },
  { ancre: 'arabe', cle: 'arab' },
  { ancre: 'coutumes', cle: 'customs' },
  { ancre: 'specialites', cle: 'specialties' },
  { ancre: 'alcools', cle: 'drinks' },
  { ancre: 'cafe', cle: 'coffee' },
  { ancre: 'faune', cle: 'fauna' },
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
function texteDe(t: ReturnType<typeof useI18n>['t'], ancre: string): string {
  switch (ancre) {
    case 'lieux':
      return [t.placesIntro, ...t.regionPlaces].join(' ');
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
    case 'faune':
      return [t.faunaPage.intro, ...t.faunaPage.facts.map((f) => f.text), t.faunaPage.note].join(' ');
    default:
      return '';
  }
}

function extraitPour(texte: string, reponse: string): string | null {
  // Les mots qui portent le sens : au moins quatre lettres, ou un nombre.
  // « la », « du », « les » se retrouvent partout et ne designent rien.
  const cles = nettoie(reponse)
    .split(/[^a-z0-9\u2018\u2019']+/)
    .filter((m) => m.length >= 4 || /^[0-9]+$/.test(m));
  if (!cles.length) return null;

  // Decoupage en PHRASES, et rien de plus fin.
  //
  // J'avais aussi coupe sur le tiret cadratin, pour des extraits plus courts.
  // Mesure : « les hommes enfouissaient la neige dans des fosses de pierre —
  // les neviere — isolees sous la cendre » donnait « les neviere », treize
  // signes, jete par le filtre de longueur. La reponse etait dans la page et
  // l'extrait sortait vide. Le tiret est une respiration, pas une fin de
  // phrase.
  const phrases = texte
    .split(/(?<=[.!?\u2026])\s+|;\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 25);

  let meilleure: string | null = null;
  let score = 0;
  for (const ph of phrases) {
    const n = nettoie(ph);
    const touches = cles.filter((m) => n.includes(m)).length;
    // A egalite, la phrase la plus courte : c'est un extrait, pas un chapitre.
    if (touches > score || (touches === score && touches > 0 && meilleure && ph.length < meilleure.length)) {
      score = touches;
      meilleure = ph;
    }
  }
  if (!meilleure || score === 0) return null;
  return meilleure.length > 230 ? `${meilleure.slice(0, 227).trimEnd()}\u2026` : meilleure;
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

export default function Quiz() {
  const { t } = useI18n();
  const q = t.quizPage;
  const [partie, setPartie] = useState(0);
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
  const [points, setPoints] = useState(0);
  /** null = on ne trie pas. Le tri se fait par theme, et par theme seulement. */
  const [theme, setTheme] = useState<string | null>(null);

  /*
   * Le paquet de la partie en cours.
   *
   * Il est fige au demarrage (`partie`), pas recalcule a chaque rendu : sans
   * ca, changer un tri en pleine partie decalerait les questions sous le
   * doigt. On melange aussi l'ORDRE des questions — a 46 questions, les
   * reprendre toujours dans le meme ordre rendrait la deuxieme partie
   * previsible des la premiere.
   */
  const paquet = useMemo(() => {
    const choisies = q.questions.filter((x) => !theme || x.ancre === theme);
    return melange(choisies, partie * 7919 + choisies.length);
  }, [q.questions, theme, partie]);

  const question = paquet[n];
  const bonne = question?.choix[question.bonne];
  const choix = useMemo(
    () => (question ? melange(question.choix, partie * 1000 + n) : []),
    [question, partie, n],
  );

  const fini = n >= 0 && n >= paquet.length;

  /** Lancer une partie depuis l'ecran de choix. (« Rejouer », lui, revient a
   *  cet ecran : voir le bouton de fin.) */
  const rejouer = () => {
    setPartie((p) => p + 1);
    setPoints(0);
    setChoisi(null);
    setValide(false);
    setN(0);
  };

  /** Changer un tri remet le jeu a l'accueil : on ne change pas de paquet en
   *  cours de route sans le dire. */
  const trier = (f: () => void) => {
    f();
    setN(-1);
    setChoisi(null);
    setValide(false);
    setPoints(0);
  };

  /** La phrase de la page qui porte la bonne reponse. Vide si on ne la
   *  retrouve pas — mieux vaut rien qu'un extrait a cote. */
  const extrait = useMemo(
    () => (question && bonne ? extraitPour(texteDe(t, question.ancre), bonne) : null),
    [question, bonne, t],
  );

  const libelleTheme = (ancre: string) => {
    const x = THEMES.find((y) => y.ancre === ancre);
    return x ? t.regionFilter[x.cle] : ancre;
  };

  const suivante = () => {
    setChoisi(null);
    setValide(false);
    setN((i) => i + 1);
  };

  return (
    <section id="quiz" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-24 pt-16 md:px-10">
      <Reveal className="mb-8 flex flex-col gap-2 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
        <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
          <Icon name="hourglass" size={16} /> {q.eyebrow}
        </span>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
          {q.title}
        </h2>
        <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
          {q.intro}
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
            <div className="cava-swipe -mx-6 shrink-0 overflow-x-auto px-6 md:-mx-10 md:px-10">
              <div className="flex w-max gap-2">
                <Puce on={theme === null} onClick={() => trier(() => setTheme(null))}>{q.allThemes}</Puce>
                {THEMES.map((x) => (
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

            {/* Tant qu'on n'a pas valide : un seul bouton, et rien d'autre.
                Le verdict n'apparait pas, donc rien ne presse. */}
            {choisi !== null && !valide && (
              <div className="border-t pt-5" style={{ borderColor: 'var(--cava-line)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setValide(true);
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
                  <a href={`#${question.ancre}`} className="cava-pill px-5 py-2.5 text-[13px]">
                    {q.seeSection} ↑
                  </a>
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
