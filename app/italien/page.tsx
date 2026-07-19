'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import BottomSheet from '../BottomSheet';
import Icon, { type IconName } from '../Icon';
import { useI18n } from '../i18n';
import type { Lang } from '../localData';
import { PRONONCIATION, LECONS, CONJUGAISONS, PRONOMS, EXERCICES, AILLEURS } from '../italienData';

/**
 * Le cours d'italien.
 *
 * La page suit l'ordre d'apprentissage et pas l'ordre d'un manuel : on
 * prononce, on parle par situation, on comprend les trois temps, on
 * s'entraine. La grammaire arrive TROISIEME, exprès — elle explique ce qu'on
 * dit deja plutot que de barrer la route a qui veut juste commander un cafe.
 *
 * LA PAGE, c'est UN CHOIX DE SECTIONS — rien d'autre. Mag l'a montre sur son
 * modele : une grille de cartes, une par section, et TOUCHER UNE CARTE fait
 * monter le contenu de cette section dans une feuille depuis le bas. La page
 * ne deroule donc plus tout le cours d'un bloc ; chaque section vit dans sa
 * feuille, ouverte a la demande.
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

/*
 * LES RENVOIS A WIKIPEDIA. Mag : « quand tu cites des gens historiques ou des
 * lieux, fais-en un lien vers Wikipedia ». On ne lie que des NOMS PROPRES
 * verifies — une personne, un lieu — jamais un mot courant : sur-souligner un
 * texte le rend illisible et fait douter de chaque lien.
 *
 * Le lien pointe vers le Wikipedia de la LANGUE lue (fr / it / en). La plupart
 * des articles portent le meme titre dans les trois langues ; les exceptions
 * (la ville de Raguse en francais, Cava d'Aliga qui n'existe que sur l'edition
 * italienne) sont ecrites a la main ci-dessous.
 */
const wiki = (edition: string, titre: string) => `https://${edition}.wikipedia.org/wiki/${titre}`;

const REFERENCES: { formes: string[]; url: Record<Lang, string> }[] = [
  { formes: ['Maria Occhipinti'], url: { fr: wiki('fr', 'Maria_Occhipinti'), it: wiki('it', 'Maria_Occhipinti'), en: wiki('en', 'Maria_Occhipinti') } },
  { formes: ['Scicli'], url: { fr: wiki('fr', 'Scicli'), it: wiki('it', 'Scicli'), en: wiki('en', 'Scicli') } },
  { formes: ['Comiso'], url: { fr: wiki('fr', 'Comiso'), it: wiki('it', 'Comiso'), en: wiki('en', 'Comiso') } },
  // Cava d'Aliga n'a d'article que sur l'edition italienne : on y renvoie quelle
  // que soit la langue lue. La forme a apostrophe courbe est celle du texte.
  { formes: ['Cava d’Aliga', "Cava d'Aliga"], url: { fr: wiki('it', "Cava_d'Aliga"), it: wiki('it', "Cava_d'Aliga"), en: wiki('it', "Cava_d'Aliga") } },
  // « Raguse » en francais, « Ragusa » en italien et en anglais.
  { formes: ['Raguse', 'Ragusa'], url: { fr: wiki('fr', 'Raguse_(Italie)'), it: wiki('it', 'Ragusa'), en: wiki('en', 'Ragusa') } },
];

/*
 * Reecrit un texte en semant des liens : on cherche la premiere occurrence
 * d'un nom connu, on la change en lien, et on recommence sur la suite. A
 * egalite de position, la forme la plus longue gagne (evite qu'un nom court
 * mange un nom long qui commence pareil).
 */
function avecLiens(texte: string, lang: Lang): ReactNode {
  let trouve: { i: number; forme: string; url: string } | null = null;
  for (const ref of REFERENCES) {
    for (const forme of ref.formes) {
      const i = texte.indexOf(forme);
      if (i === -1) continue;
      if (!trouve || i < trouve.i || (i === trouve.i && forme.length > trouve.forme.length)) {
        trouve = { i, forme, url: ref.url[lang] };
      }
    }
  }
  if (!trouve) return texte;
  return (
    <>
      {texte.slice(0, trouve.i)}
      <a
        href={trouve.url}
        target="_blank"
        rel="noopener noreferrer"
        className="cava-navlink"
        style={{ color: 'var(--cava-pink)', fontWeight: 500 }}
        title="Wikipédia ↗"
      >
        {trouve.forme}
      </a>
      {avecLiens(texte.slice(trouve.i + trouve.forme.length), lang)}
    </>
  );
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

  /*
   * La feuille de section. `section` retient QUELLE section montrer et reste
   * en place pendant la descente (`ouvert` seul repasse a faux), sinon la
   * feuille glisserait vers le bas VIDE, le contenu ayant disparu d'un coup.
   */
  const [section, setSection] = useState<string | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const ouvrir = (id: string) => {
    setSection(id);
    setOuvert(true);
  };
  const fermer = () => setOuvert(false);

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
   * Un bouton de reponse. Dans la feuille, les choix sont deja a portee de
   * pouce : on les affiche en clair, sans feuille supplementaire par-dessus.
   * `interactif` est faux une fois la reponse validee — le jaune dit alors la
   * bonne, le trait dit l'erreur.
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
        onClick={interactif ? () => setChoisi(c) : undefined}
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
  const PLAN: { id: string; titre: string; niveau: string; icon: IconName; intro?: string }[] = [
    { id: 'prononcer', titre: p.soundTitle, niveau: p.level1, icon: 'chat', intro: p.soundIntro },
    { id: 'parler', titre: p.talkTitle, niveau: p.level1, icon: 'parler', intro: p.talkIntro },
    { id: 'presente', titre: CONJUGAISONS[0].temps[lang], niveau: p.level2, icon: 'sun' },
    { id: 'passato', titre: CONJUGAISONS[1].temps[lang], niveau: p.level2, icon: 'landmark' },
    { id: 'futuro', titre: CONJUGAISONS[2].temps[lang], niveau: p.level3, icon: 'compass' },
    { id: 'exercices', titre: p.drillTitle, niveau: p.levelAll, icon: 'target', intro: p.drillIntro },
    { id: 'ailleurs', titre: p.elsewhereTitle, niveau: p.levelAll, icon: 'map', intro: p.elsewhereIntro },
  ];
  const ouverte = section ? PLAN.find((x) => x.id === section) : null;

  /*
   * Une CARTE de section — le style que Mag a montre sur son modele : un titre,
   * une phrase, et une icone en bas. Cliquer OUVRE la feuille de la section, la
   * ou avant on sautait dans la page.
   */
  const carteSommaire = (x: (typeof PLAN)[number], i: number) => (
    <button
      key={x.id}
      type="button"
      onClick={() => ouvrir(x.id)}
      className="group flex min-h-[9.5rem] flex-col justify-between gap-5 rounded-2xl border p-6 text-left transition-transform duration-200 hover:scale-[1.01] motion-reduce:transition-none"
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
    </button>
  );

  /*
   * Le contenu d'une section, tel qu'il monte dans la feuille. La feuille porte
   * deja le titre et la phrase d'intro (voir <BottomSheet> plus bas) — ici, on
   * ne pose que le corps. Pas de <Reveal> : dans une feuille qui vient de
   * s'ouvrir, une apparition au defilement laisserait le contenu invisible.
   */
  const contenu = (id: string) => {
    // 1 — Prononcer
    if (id === 'prononcer') {
      return (
        <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {PRONONCIATION.map((r, i) => (
            <div key={i} className="flex flex-col gap-4 p-6" style={{ background: 'var(--cava-bg)' }}>
              <p className="max-w-[52ch] text-[15px] leading-[1.7]">{r.regle[lang]}</p>
              <div className="flex flex-wrap gap-2">
                {r.exemples.map((x) => (
                  <span key={x.it} className="rounded-full px-3.5 py-2 text-[13px]" style={{ background: '#ffd452', color: 'var(--cava-ink)', fontWeight: 600 }}>
                    {x.it} <span style={{ opacity: 0.7 }}>· {x.pron}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 2 — Parler, par situation
    if (id === 'parler') {
      return (
        <div className="flex flex-col gap-8">
          {LECONS.map((l) => (
            <div key={l.id} className="rounded-2xl border p-6" style={{ borderColor: 'var(--cava-line)' }}>
              <h3 className="flex items-center gap-2.5 text-[clamp(1.15rem,2.4vw,1.5rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                <Icon name={l.icon as IconName} size={22} /> {l.titre[lang]}
              </h3>

              {/* Plus de phrase d'intro sous le titre (Mag) : dans « Parler, par
                  situation », on ne garde que le titre et les phrases. Le texte
                  d'intro reste dans les donnees (LECONS[].intro), simplement il
                  ne s'affiche plus ici. */}
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
                      {avecLiens(f.sens[lang], lang)}
                    </p>
                    {f.note && (
                      <p className="mt-2 max-w-[64ch] border-l-2 pl-3 text-[13px] leading-[1.6]" style={{ borderColor: '#ffd452', color: 'var(--cava-ink)' }}>
                        {avecLiens(f.note[lang], lang)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    // 3 — Les trois temps : une carte = UN temps
    const conj = CONJUGAISONS.find((c) => c.id === id);
    if (conj) {
      return (
        <div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{p.whenLabel}</p>
              <p className="mt-1 max-w-[70ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>{conj.quand[lang]}</p>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{p.howLabel}</p>
              <p className="mt-1 max-w-[70ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>{conj.regle[lang]}</p>
            </div>
          </div>

          {/*
            PAS DE TABLEAU. Un verbe tient dans son bloc, et ses six formes se
            posent en grille — rien ne defile, rien ne se coupe, et le pronom
            reste colle a sa forme. (Voir l'historique : les tableaux colles se
            faisaient couper sur telephone.)
          */}
          <div className="mt-6 flex flex-col gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--cava-line)' }}>
            {conj.tables.map((v) => (
              <div key={v.verbe} className="p-5" style={{ background: 'var(--cava-bg)' }}>
                <p className="text-[15px]" style={{ fontWeight: 600 }}>
                  {v.verbe}
                  <span className="ml-2 text-[13px]" style={{ color: 'var(--cava-muted)', fontWeight: 400 }}>{v.sens[lang]}</span>
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3">
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
            <p className="mt-1 max-w-[72ch] text-[14px] leading-[1.7]">{conj.pieges[lang]}</p>
          </div>
        </div>
      );
    }

    // 4 — S’entraîner
    if (id === 'exercices') {
      return (
        <div>
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
              <p className="max-w-[60ch] text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>{avecLiens(ex.consigne[lang], lang)}</p>
              <p className="max-w-[46ch] text-[clamp(1.3rem,3vw,1.9rem)] leading-[1.25]" style={{ fontWeight: 600 }}>
                {ex.question}
              </p>

              {/* Les reponses en clair, a portee de pouce dans la feuille. */}
              <div className="flex flex-col gap-3">
                {choix.map((c) => boutonChoix(c, !valide))}
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
                    {avecLiens(ex.pourquoi[lang], lang)}
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
        </div>
      );
    }

    // 5 — Ailleurs
    if (id === 'ailleurs') {
      return (
        <div className="flex flex-col gap-8">
          {AILLEURS.map((g) => (
            <div key={g.titre.fr}>
              <h3 className="mb-4 text-[13px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                {g.titre[lang]}
              </h3>
              <div className="grid gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--cava-line)' }}>
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
            </div>
          ))}

          {/* Assimil est cite parce que la page s'en reclame. Il est payant, et
              ca se dit — sinon la recommandation ressemble a une reclame. */}
          <p className="max-w-[70ch] border-l-2 pl-4 text-[14px] leading-[1.7]" style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}>
            {p.assimilNote}{' '}
            <a href="https://www.assimil.com/" target="_blank" rel="noopener noreferrer" className="cava-navlink" style={{ color: 'var(--cava-pink)', fontWeight: 500 }}>
              assimil.com ↗
            </a>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <main>
      <Nav />
      <PageHeader title={p.title} intro={p.intro} />

      {/*
        LE CHOIX DES SECTIONS — la grille de cartes, et rien d'autre. Une carte
        par section ; toucher une carte fait monter son contenu dans la feuille
        du bas. Le titre « Le programme » a ete retire (Mag) : les cartes se
        suffisent, chacune dit deja son niveau.
      */}
      <section className="mx-auto max-w-[110rem] px-5 pb-24 pt-10 md:px-10">
        <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {PLAN.map(carteSommaire)}
        </Reveal>
      </section>

      <Footer />

      {/* La feuille de section — s'ouvre au clic d'une carte, porte le titre et
          l'intro de la section, et fait defiler son contenu. */}
      <BottomSheet
        ouvert={ouvert}
        onFermer={fermer}
        titre={ouverte ? ouverte.titre : ''}
        intro={ouverte?.intro}
        labelFermer={p.sheetClose}
      >
        {section && contenu(section)}
      </BottomSheet>
    </main>
  );
}
