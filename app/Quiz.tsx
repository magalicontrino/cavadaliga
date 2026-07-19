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

/** Les couleurs des reponses — celles de l'arbre, deja choisies par Mag. */
const GAIES = ['#ffd452', '#5fdede', '#c8e6a0'];

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

export default function Quiz() {
  const { t } = useI18n();
  const q = t.quizPage;
  const [partie, setPartie] = useState(0);
  const [n, setN] = useState(-1); // -1 = ecran d'accueil
  const [choisi, setChoisi] = useState<string | null>(null);
  const [points, setPoints] = useState(0);

  const question = q.questions[n];
  const bonne = question?.choix[question.bonne];
  const choix = useMemo(
    () => (question ? melange(question.choix, partie * 1000 + n) : []),
    [question, partie, n],
  );

  const fini = n >= q.questions.length;

  const rejouer = () => {
    setPartie((p) => p + 1);
    setPoints(0);
    setChoisi(null);
    setN(0);
  };

  const suivante = () => {
    setChoisi(null);
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
          <button type="button" onClick={rejouer} className="cava-pill px-6 py-3 text-[15px]">
            {q.start} →
          </button>
        )}

        {question && (
          <div className="flex flex-col gap-6">
            <p className="text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)', fontWeight: 700 }}>
              {q.progress.replace('{n}', String(n + 1)).replace('{t}', String(q.questions.length))}
            </p>

            <h3 className="max-w-[46ch] text-[clamp(1.2rem,2.6vw,1.7rem)] leading-[1.25]" style={{ fontWeight: 600 }}>
              {question.q}
            </h3>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              {choix.map((c, i) => {
                const repondu = choisi !== null;
                const estBonne = c === bonne;
                // Une fois repondu, on montre TOUJOURS la bonne — sinon on
                // repart sans savoir, et le jeu n'apprend rien.
                const fond = !repondu ? GAIES[i % GAIES.length] : estBonne ? '#c8e6a0' : c === choisi ? '#f3a5a5' : 'transparent';
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={repondu}
                    onClick={() => {
                      setChoisi(c);
                      if (estBonne) setPoints((p) => p + 1);
                    }}
                    className="rounded-full px-5 py-3 text-left text-[15px] transition-transform duration-200 hover:scale-[1.02] disabled:hover:scale-100 motion-reduce:transition-none"
                    style={{
                      background: fond,
                      color: 'var(--cava-ink)',
                      fontWeight: 600,
                      border: '1px solid var(--cava-ink)',
                      opacity: repondu && !estBonne && c !== choisi ? 0.45 : 1,
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {choisi !== null && (
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
                    {n + 1 === q.questions.length ? q.scoreTitle : q.next} →
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
              {q.scoreLine.replace('{n}', String(points)).replace('{t}', String(q.questions.length))}
            </p>
            <button type="button" onClick={rejouer} className="cava-pill px-6 py-3 text-[15px]">
              {q.again} ↻
            </button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
