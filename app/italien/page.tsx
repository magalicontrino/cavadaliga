'use client';

import { useMemo, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon, { type IconName } from '../Icon';
import { useI18n } from '../i18n';
import { PRONONCIATION, LECONS, CONJUGAISONS, PRONOMS, EXERCICES } from '../italienData';

/**
 * Le cours d'italien.
 *
 * La page suit l'ordre d'apprentissage et pas l'ordre d'un manuel : on
 * prononce, on parle par situation, on comprend les trois temps, on
 * s'entraine. La grammaire arrive TROISIEME, exprès — elle explique ce qu'on
 * dit deja plutot que de barrer la route a qui veut juste commander un cafe.
 *
 * Tout le contenu vient de app/italienData.ts. La page ne fait que le poser.
 */

/** Le meme melange stable que le quiz — voir app/Quiz.tsx. */
function melange<T>(liste: T[], graine: number): T[] {
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

export default function Italien() {
  const { t, lang } = useI18n();
  const p = t.italianPage;

  /* ── Les exercices ──────────────────────────────────────────────────
   * Meme logique que le quiz, et pour les memes raisons : on choisit, on
   * verifie, et on ne peut plus changer apres — sinon le score ne veut rien
   * dire. La graine est tiree au clic pour que deux seances ne se
   * ressemblent pas.
   */
  const [graine, setGraine] = useState(0);
  const [n, setN] = useState(-1);
  const [choisi, setChoisi] = useState<string | null>(null);
  const [valide, setValide] = useState(false);
  const [points, setPoints] = useState(0);

  const paquet = useMemo(() => (graine ? melange(EXERCICES, graine) : EXERCICES), [graine]);
  const ex = paquet[n];
  const bonne = ex?.choix[0];
  const choix = useMemo(() => (ex ? melange(ex.choix, graine + n * 7919) : []), [ex, graine, n]);
  const fini = n >= 0 && n >= paquet.length;

  const lancer = () => {
    setGraine(Math.floor(Math.random() * 2147483647));
    setPoints(0);
    setChoisi(null);
    setValide(false);
    setN(0);
  };
  const suivant = () => {
    setChoisi(null);
    setValide(false);
    setN((i) => i + 1);
  };

  return (
    <main>
      <Nav />
      <PageHeader title={p.title} intro={p.intro} />

      {/* La méthode. Elle vient en premier parce qu’une méthode qu’on ne lit
          pas ne sert à rien — et celle-ci tient en un paragraphe. */}
      <section className="mx-auto max-w-[110rem] px-5 pt-4 md:px-10">
        <Reveal className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--cava-line)' }}>
          <h2 className="mb-3 flex items-center gap-2 text-[13px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
            <Icon name="info" size={16} /> {p.methodTitle}
          </h2>
          <p className="max-w-[70ch] text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {p.method}
          </p>
        </Reveal>
      </section>

      {/* 1 — Prononcer */}
      <section id="prononcer" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="parler" size={16} /> 1
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {p.soundTitle}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {p.soundIntro}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {PRONONCIATION.map((r, i) => (
            <Reveal key={i} delay={(i % 2) * 60} className="flex flex-col gap-4 p-7 md:p-8" style={{ background: 'var(--cava-bg)' }}>
              <p className="max-w-[52ch] text-[15px] leading-[1.7]">{r.regle[lang]}</p>
              <div className="flex flex-wrap gap-2">
                {r.exemples.map((x) => (
                  <span key={x.it} className="rounded-full px-3.5 py-2 text-[13px]" style={{ background: '#ffd452', color: 'var(--cava-ink)', fontWeight: 600 }}>
                    {x.it} <span style={{ opacity: 0.7 }}>· {x.pron}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2 — Parler, par situation */}
      <section id="parler" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="parler" size={16} /> 2
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {p.talkTitle}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {p.talkIntro}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {LECONS.map((l) => (
            <Reveal key={l.id} className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--cava-line)' }}>
              <h3 className="flex items-center gap-2.5 text-[clamp(1.15rem,2.4vw,1.5rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                <Icon name={l.icon as IconName} size={22} /> {l.titre[lang]}
              </h3>
              <p className="mt-2 max-w-[70ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {l.intro[lang]}
              </p>

              <ul className="mt-6 flex flex-col gap-5">
                {l.phrases.map((f) => (
                  <li key={f.it} className="border-t pt-5" style={{ borderColor: 'var(--cava-line)' }}>
                    {/* L’italien d’abord et en gros : c’est lui qu’on vient
                        chercher. La traduction est en dessous, en retrait. */}
                    <p className="text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.35]" style={{ fontWeight: 600 }}>
                      {f.it}
                    </p>
                    <p className="mt-1 text-[13px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-pink)', fontWeight: 600 }}>
                      {f.pron}
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                      {f.sens[lang]}
                    </p>
                    {f.note && (
                      <p className="mt-2 max-w-[64ch] border-l-2 pl-3 text-[13px] leading-[1.6]" style={{ borderColor: '#ffd452', color: 'var(--cava-ink)' }}>
                        {f.note[lang]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3 — Les trois temps */}
      <section id="temps" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="parler" size={16} /> 3
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {p.grammarTitle}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {p.grammarIntro}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {CONJUGAISONS.map((c) => (
            <Reveal key={c.id} className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--cava-line)' }}>
              <h3 className="text-[clamp(1.15rem,2.4vw,1.5rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {c.temps[lang]}
              </h3>

              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{p.whenLabel}</p>
                  <p className="mt-1 max-w-[70ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>{c.quand[lang]}</p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{p.howLabel}</p>
                  <p className="mt-1 max-w-[70ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>{c.regle[lang]}</p>
                </div>
              </div>

              {/*
                PAS DE TABLEAU. Il y en a eu un, qui defilait de cote avec la
                colonne des verbes collee a gauche. Mag l'a vu tout de suite :
                les formes du milieu passaient sous cette colonne et on lisait
                « a », « nde », « ne » — des bouts de mots. C'est le defaut
                connu des tableaux colles sur telephone, et aucun reglage de
                fond ou de z-index ne le repare : la cellule EST a moitie
                cachee, c'est le principe meme.

                Un verbe tient donc dans son bloc, et ses six formes se posent
                en grille : deux colonnes sur telephone, six sur grand ecran.
                Rien ne defile, rien ne se coupe, et le pronom reste collé a sa
                forme au lieu d'etre a l'autre bout d'une ligne.
              */}
              <div className="mt-6 flex flex-col gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--cava-line)' }}>
                {c.tables.map((v) => (
                  <div key={v.verbe} className="p-5" style={{ background: 'var(--cava-bg)' }}>
                    <p className="text-[15px]" style={{ fontWeight: 600 }}>
                      {v.verbe}
                      <span className="ml-2 text-[13px]" style={{ color: 'var(--cava-muted)', fontWeight: 400 }}>{v.sens[lang]}</span>
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3 md:grid-cols-6">
                      {v.formes.map((f, i) => (
                        <div key={i}>
                          <dt className="text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                            {PRONOMS[i]}
                          </dt>
                          <dd className="text-[15px] leading-[1.4]">{f}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl p-4" style={{ background: 'rgba(255,212,82,0.22)' }}>
                <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-ink)', fontWeight: 700 }}>{p.trapLabel}</p>
                <p className="mt-1 max-w-[72ch] text-[14px] leading-[1.7]">{c.pieges[lang]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 — S’entraîner */}
      <section id="exercices" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-24 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="parler" size={16} /> 4
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {p.drillTitle}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {p.drillIntro}
          </p>
        </Reveal>

        <Reveal className="mt-10 rounded-3xl border p-6 md:p-10" style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}>
          {n === -1 && (
            <button type="button" onClick={lancer} className="cava-pill px-6 py-3 text-[15px]">
              {p.start} · {EXERCICES.length} →
            </button>
          )}

          {ex && (
            <div className="flex flex-col gap-6">
              <p className="text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)', fontWeight: 700 }}>
                {p.progress.replace('{n}', String(n + 1)).replace('{t}', String(paquet.length))}
              </p>
              <p className="max-w-[60ch] text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>{ex.consigne[lang]}</p>
              <p className="max-w-[46ch] text-[clamp(1.3rem,3vw,1.9rem)] leading-[1.25]" style={{ fontWeight: 600 }}>
                {ex.question}
              </p>

              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                {choix.map((c) => {
                  const monChoix = c === choisi;
                  const estBonne = c === bonne;
                  const fond = !valide ? (monChoix ? 'var(--cava-ink)' : 'transparent') : estBonne ? '#ffd452' : 'transparent';
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={valide}
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
                      {/* Même langage que le quiz : le jaune dit la bonne
                          réponse, le trait dit l’erreur qu’on a faite. */}
                      <span style={valide && monChoix && !estBonne ? { textDecoration: 'line-through', textDecorationThickness: '1px' } : undefined}>
                        {c}
                      </span>
                    </button>
                  );
                })}
              </div>

              {choisi !== null && !valide && (
                <div className="border-t pt-5" style={{ borderColor: 'var(--cava-line)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setValide(true);
                      if (choisi === bonne) setPoints((x) => x + 1);
                    }}
                    className="rounded-full px-6 py-2.5 text-[14px]"
                    style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)', fontWeight: 600 }}
                  >
                    {p.check} →
                  </button>
                </div>
              )}

              {valide && (
                <div className="flex flex-col gap-4 border-t pt-5" style={{ borderColor: 'var(--cava-line)' }}>
                  <p className="text-[15px]" style={{ fontWeight: 600, color: choisi === bonne ? '#3b6d11' : 'var(--cava-pink-fonce)' }}>
                    {choisi === bonne ? p.good : p.wrong}
                  </p>
                  <p className="max-w-[70ch] border-l-2 pl-4 text-[14px] leading-[1.65]" style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}>
                    {ex.pourquoi[lang]}
                  </p>
                  <button type="button" onClick={suivant} className="w-fit rounded-full px-5 py-2.5 text-[13px]" style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)', fontWeight: 600 }}>
                    {n + 1 === paquet.length ? p.drillTitle : p.next} →
                  </button>
                </div>
              )}
            </div>
          )}

          {fini && (
            <div className="flex flex-col items-start gap-5">
              <p className="text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.1]" style={{ fontWeight: 900 }}>
                {p.score.replace('{n}', String(points)).replace('{t}', String(paquet.length))}
              </p>
              <button type="button" onClick={lancer} className="cava-pill px-6 py-3 text-[15px]">
                {p.again} ↻
              </button>
            </div>
          )}
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
