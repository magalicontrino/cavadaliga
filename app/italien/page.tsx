'use client';

import { useEffect, useMemo, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import BottomSheet from '../BottomSheet';
import Icon, { type IconName } from '../Icon';
import { useI18n } from '../i18n';
import { PRONONCIATION, LECONS, CONJUGAISONS, PRONOMS, EXERCICES, AILLEURS } from '../italienData';

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

/*
 * Aller a une section du sommaire, et l'y TENIR.
 *
 * Meme lecon que sur « La region » : le saut natif ne suffit pas ici. Les
 * blocs au-dessus grandissent encore pendant que leurs apparitions se jouent,
 * si bien qu'on vise juste et qu'on tombe a cote — mesure : « Le futur »
 * atterrissait a 558 px au lieu du haut de l'ecran.
 *
 * On corrige donc la visee pendant une seconde et demie, et on LACHE des que
 * quelqu'un touche la molette ou l'ecran : se battre contre un doigt serait
 * pire que d'arriver un peu bas.
 */
function allerA(id: string) {
  const jusqua = performance.now() + 1500;
  let vivant = true;
  const lacher = () => {
    vivant = false;
    for (const e of ['wheel', 'touchstart', 'keydown']) window.removeEventListener(e, lacher);
  };
  for (const e of ['wheel', 'touchstart', 'keydown']) window.addEventListener(e, lacher, { passive: true });
  const viser = () => {
    if (!vivant) return;
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
    if (performance.now() < jusqua) window.setTimeout(viser, 80);
    else lacher();
  };
  viser();
}

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

  /*
   * LA FLECHE DE RETOUR. Mag : « mets une fleche en sticky sur cette page
   * pour pouvoir remonter a tout moment ».
   *
   * Elle est a GAUCHE : la bulle « Demander » occupe le coin droit sur toutes
   * les pages, et deux ronds qui se chevauchent valent moins que pas de
   * fleche du tout.
   *
   * Elle n'apparait qu'apres un ecran de defilement. En haut de page, elle ne
   * proposerait que d'aller la ou l'on est deja — un bouton qui ne sert a
   * rien apprend a ignorer les boutons.
   */
  const [remonter, setRemonter] = useState(false);
  useEffect(() => {
    const voir = () => setRemonter(window.scrollY > window.innerHeight * 0.8);
    voir();
    window.addEventListener('scroll', voir, { passive: true });
    return () => window.removeEventListener('scroll', voir);
  }, []);

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

  /*
   * Les feuilles qui montent du bas — Mag les veut sur telephone : une pour le
   * sommaire (sauter a une section), une pour repondre aux exercices (les
   * boutons a portee de pouce, tout en bas). Sur grand ecran, les listes
   * restent en clair et ces feuilles ne s'ouvrent jamais (boutons `md:hidden`).
   */
  const [sommaireOuvert, setSommaireOuvert] = useState(false);
  const [exoOuvert, setExoOuvert] = useState(false);

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

  /*
   * Choisir une reponse depuis la feuille : on retient le choix ET on referme
   * la feuille, pour revenir a la question avec le bouton « Verifier » sous les
   * yeux. Depuis la liste en clair du bureau, refermer une feuille deja close
   * ne fait rien — c'est le meme geste pour les deux.
   */
  const choisir = (c: string) => {
    setChoisi(c);
    setExoOuvert(false);
  };

  /*
   * Un bouton de reponse. Le meme code sert la liste du bureau et la feuille du
   * telephone : c'est le placement qui change, pas la reponse. `interactif` est
   * faux une fois la reponse validee — le jaune dit alors la bonne, le trait
   * dit l'erreur.
   */
  const boutonChoix = (c: string, interactif: boolean) => {
    const monChoix = c === choisi;
    const estBonne = c === bonne;
    const fond = !valide ? (monChoix ? 'var(--cava-ink)' : 'transparent') : estBonne ? '#ffd452' : 'transparent';
    return (
      <button
        key={c}
        type="button"
        disabled={!interactif || valide}
        onClick={interactif ? () => choisir(c) : undefined}
        className="rounded-full px-5 py-3 text-left text-[15px] transition-transform duration-200 hover:scale-[1.02] disabled:hover:scale-100 motion-reduce:transition-none"
        style={{
          background: fond,
          color: !valide && monChoix ? 'var(--cava-bg)' : 'var(--cava-ink)',
          fontWeight: 600,
          border: '1px solid var(--cava-ink)',
          opacity: valide && !estBonne && !monChoix ? 0.45 : 1,
        }}
      >
        <span style={valide && monChoix && !estBonne ? { textDecoration: 'line-through', textDecorationThickness: '1px' } : undefined}>
          {c}
        </span>
      </button>
    );
  };

  /*
   * Le sommaire. Les niveaux ne sont pas decoratifs : ils disent dans quel
   * ordre ça sert. Prononcer et parler d'abord — sans eux on ne dit rien ; le
   * present ensuite, qui porte l'essentiel ; le passe et le futur en dernier,
   * dont on se passe une semaine sans que personne s'en apercoive.
   */
  const PLAN: { id: string; titre: string; niveau: string; icon: IconName }[] = [
    { id: 'prononcer', titre: p.soundTitle, niveau: p.level1, icon: 'chat' },
    { id: 'parler', titre: p.talkTitle, niveau: p.level1, icon: 'parler' },
    { id: 'presente', titre: CONJUGAISONS[0].temps[lang], niveau: p.level2, icon: 'sun' },
    { id: 'passato', titre: CONJUGAISONS[1].temps[lang], niveau: p.level2, icon: 'landmark' },
    { id: 'futuro', titre: CONJUGAISONS[2].temps[lang], niveau: p.level3, icon: 'compass' },
    { id: 'exercices', titre: p.drillTitle, niveau: p.levelAll, icon: 'target' },
    { id: 'ailleurs', titre: p.elsewhereTitle, niveau: p.levelAll, icon: 'map' },
  ];

  /*
   * Une CARTE de section — le style que Mag a montre sur son modele : un titre,
   * une phrase, et une icone en bas. La meme dans la grille du bureau et dans la
   * feuille du telephone. Cliquer y saute et referme la feuille (sans effet sur
   * le bureau, ou elle est deja close).
   */
  const carteSommaire = (x: (typeof PLAN)[number], i: number) => (
    <a
      key={x.id}
      href={`#${x.id}`}
      onClick={(e) => {
        e.preventDefault();
        setSommaireOuvert(false);
        allerA(x.id);
      }}
      className="group flex min-h-[9.5rem] flex-col justify-between gap-5 rounded-2xl border p-6 transition-transform duration-200 hover:scale-[1.01] motion-reduce:transition-none"
      style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
    >
      <div className="flex flex-col gap-2">
        <span className="text-[17px] leading-tight" style={{ fontWeight: 800 }}>{x.titre}</span>
        <p className="text-[13px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>{p.planDesc[i]}</p>
      </div>
      {/* L'icone en bas, grande et grasse comme sur le modele ; le niveau se
          range a cote, discret. */}
      <div className="flex items-end justify-between gap-2">
        <span style={{ color: 'var(--cava-ink)' }}>
          <Icon name={x.icon} size={38} strokeWidth={1.9} />
        </span>
        <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
          {x.niveau}
        </span>
      </div>
    </a>
  );

  return (
    <main>
      <Nav />
      <PageHeader title={p.title} intro={p.intro} />

      {/*
        LE SOMMAIRE, par niveaux — une liste des sections dans l'ordre, du plus
        simple au plus exigeant. Le titre « Le programme » et sa phrase d'intro
        ont ete retires (Mag) : les cartes se suffisent, chacune dit deja son
        niveau.
      */}
      <section className="mx-auto max-w-[110rem] px-5 pt-10 md:px-10">
        {/* Sur grand ecran, les sections s'affichent en grille de cartes. */}
        <Reveal className="hidden gap-3 md:grid md:grid-cols-2">
          {PLAN.map(carteSommaire)}
        </Reveal>

        {/* Sur telephone, un bouton ouvre la meme liste dans une feuille qui
            monte du bas — a portee de pouce, sans manger la page. */}
        <Reveal className="md:hidden">
          <button
            type="button"
            onClick={() => setSommaireOuvert(true)}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4"
            style={{ borderColor: 'var(--cava-line)' }}
          >
            <span className="text-[15px]" style={{ fontWeight: 600 }}>{p.tocOpen}</span>
            <span aria-hidden className="text-[16px]" style={{ color: 'var(--cava-pink)' }}>↑</span>
          </button>
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
            <div key={c.id} id={c.id} className="scroll-mt-24">
            <Reveal className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--cava-line)' }}>
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
            </div>
          ))}
        </div>
      </section>

      {/* 4 — S’entraîner */}
      <section id="exercices" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-16 pt-16 md:px-10">
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

              {/* Les reponses en clair : sur grand ecran tout le temps, sur
                  telephone SEULEMENT une fois la reponse validee — le jaune dit
                  alors la bonne, le trait l'erreur. Avant de valider, le
                  telephone passe par la feuille du bas. */}
              <div className={`${valide ? 'flex' : 'hidden md:flex'} flex-col gap-3 md:flex-row md:flex-wrap`}>
                {choix.map((c) => boutonChoix(c, !valide))}
              </div>

              {/* Telephone, avant de valider : un bouton ouvre la feuille pour
                  repondre ; une fois choisi, on voit sa reponse et on peut en
                  changer. « Verifier » reste juste en dessous, commun aux deux. */}
              {!valide && (
                <div className="md:hidden">
                  {choisi === null ? (
                    <button
                      type="button"
                      onClick={() => setExoOuvert(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px]"
                      style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)', fontWeight: 600 }}
                    >
                      {p.answerCta} <span aria-hidden>↑</span>
                    </button>
                  ) : (
                    <div
                      className="flex items-center justify-between gap-3 rounded-full px-5 py-3"
                      style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}
                    >
                      <span className="text-[15px]" style={{ fontWeight: 600 }}>{choisi}</span>
                      <button
                        type="button"
                        onClick={() => setExoOuvert(true)}
                        className="shrink-0 text-[13px] underline underline-offset-2"
                        style={{ color: 'var(--cava-bg)' }}
                      >
                        {p.answerChange}
                      </button>
                    </div>
                  )}
                </div>
              )}

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

      {/* 5 — Ailleurs. Apres les exercices, pas avant : on ne renvoie pas
          quelqu'un ailleurs avant qu'il ait essaye ici. */}
      <section id="ailleurs" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-24 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="compass" size={16} /> 5
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {p.elsewhereTitle}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {p.elsewhereIntro}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-8">
          {AILLEURS.map((g) => (
            <Reveal key={g.titre.fr}>
              <h3 className="mb-4 text-[13px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                {g.titre[lang]}
              </h3>
              <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
                {g.sites.map((x) => (
                  <a
                    key={x.url}
                    href={x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-2 p-6 transition-transform duration-200 hover:scale-[1.01] motion-reduce:transition-none"
                    style={{ background: 'var(--cava-bg)' }}
                  >
                    <span className="text-[15px]" style={{ fontWeight: 600 }}>
                      {x.nom} <span style={{ color: 'var(--cava-pink)' }}>↗</span>
                    </span>
                    <span className="text-[14px] leading-[1.65]" style={{ color: 'var(--cava-muted)' }}>
                      {x.quoi[lang]}
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Assimil est cite parce que la page s'en reclame. Il est payant, et
            ca se dit — sinon la recommandation ressemble a une reclame. */}
        <Reveal className="mt-8 max-w-[70ch] border-l-2 pl-4 text-[14px] leading-[1.7]" style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}>
          {p.assimilNote}{' '}
          <a href="https://www.assimil.com/" target="_blank" rel="noopener noreferrer" className="cava-navlink" style={{ color: 'var(--cava-pink)', fontWeight: 500 }}>
            assimil.com ↗
          </a>
        </Reveal>
      </section>

      <Footer />

      {/* La feuille du sommaire — ouverte par le bouton du telephone. Sur grand
          ecran, rien ne l'ouvre : la liste y est deja en clair. */}
      <BottomSheet
        ouvert={sommaireOuvert}
        onFermer={() => setSommaireOuvert(false)}
        titre={p.tocOpen}
        labelFermer={p.sheetClose}
      >
        <div className="grid grid-cols-2 gap-3">
          {PLAN.map(carteSommaire)}
        </div>
      </BottomSheet>

      {/* La feuille des reponses — la question en titre, les choix a portee de
          pouce. Choisir referme et ramene au bouton « Verifier ». */}
      <BottomSheet
        ouvert={exoOuvert}
        onFermer={() => setExoOuvert(false)}
        titre={ex ? ex.question : ''}
        intro={ex ? ex.consigne[lang] : undefined}
        labelFermer={p.sheetClose}
      >
        <div className="flex flex-col gap-3">
          {choix.map((c) => boutonChoix(c, true))}
        </div>
      </BottomSheet>

      <button
        type="button"
        aria-label={p.backToTop}
        title={p.backToTop}
        onClick={() => {
          // `smooth` sauf si la personne a demande moins d'animation : sur
          // une page de cette longueur, un saut sec desoriente.
          const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: doux ? 'smooth' : 'instant' });
        }}
        className={`fixed bottom-5 left-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-[opacity,transform] duration-300 motion-reduce:transition-none md:bottom-8 md:left-8 ${
          remonter ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}
      >
        <span aria-hidden className="text-[20px] leading-none">↑</span>
      </button>
    </main>
  );
}
