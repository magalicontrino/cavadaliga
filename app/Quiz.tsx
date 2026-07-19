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

const NIVEAUX = ['facile', 'moyen', 'difficile'] as const;

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
  /** null = on ne trie pas. Mag : « par themes, par niveau ». */
  const [theme, setTheme] = useState<string | null>(null);
  const [niveau, setNiveau] = useState<string | null>(null);

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
    const choisies = q.questions.filter(
      (x) => (!theme || x.ancre === theme) && (!niveau || x.niveau === niveau),
    );
    return melange(choisies, partie * 7919 + choisies.length);
  }, [q.questions, theme, niveau, partie]);

  const question = paquet[n];
  const bonne = question?.choix[question.bonne];
  const choix = useMemo(
    () => (question ? melange(question.choix, partie * 1000 + n) : []),
    [question, partie, n],
  );

  const fini = n >= 0 && n >= paquet.length;

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
          <Icon name="target" size={16} /> {q.eyebrow}
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

            <div className="flex flex-wrap gap-2">
              <Puce on={theme === null} onClick={() => trier(() => setTheme(null))}>{q.allThemes}</Puce>
              {THEMES.map((x) => (
                <Puce key={x.ancre} on={theme === x.ancre} onClick={() => trier(() => setTheme(x.ancre))}>
                  {t.regionFilter[x.cle]}
                </Puce>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Puce on={niveau === null} onClick={() => trier(() => setNiveau(null))}>{q.allLevels}</Puce>
              {NIVEAUX.map((x) => (
                <Puce key={x} on={niveau === x} onClick={() => trier(() => setNiveau(x))}>
                  {q.levels[x]}
                </Puce>
              ))}
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
              {libelleTheme(question.ancre)} · {q.levels[question.niveau]}
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
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={rejouer} className="cava-pill px-6 py-3 text-[15px]">
                {q.again} ↻
              </button>
              {/* Retour au tri : apres une partie, on veut souvent changer de
                  theme plutot que refaire le meme paquet. */}
              <button
                type="button"
                onClick={() => trier(() => {})}
                className="rounded-full px-6 py-3 text-[15px]"
                style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)', fontWeight: 600 }}
              >
                {q.pick.split(/[,.]/)[0]}
              </button>
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}
