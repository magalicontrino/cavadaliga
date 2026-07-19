'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import BottomSheet from '../BottomSheet';
import Icon, { type IconName } from '../Icon';
import { useI18n } from '../i18n';
import type { Lang } from '../localData';
import { PRONONCIATION, LECONS, CONJUGAISONS, PRONOMS, EXERCICES, AILLEURS, CHANSONS } from '../italienData';

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

/*
 * Aller a une section du sommaire, et l'y TENIR (grand ecran seulement).
 *
 * LE DEFILEMENT EST DOUX, comme celui de la fleche de retour — Mag les voulait
 * pareils, et elle a raison : deux facons de se deplacer sur la meme page, ça
 * se remarque. Il respecte « moins d'animation » si le systeme le demande.
 *
 * Mais on ne peut pas se contenter d'un glissement : les blocs au-dessus
 * grandissent encore pendant que leurs apparitions se jouent, si bien qu'on
 * arrive a cote de la cible — mesure faite, « Le futur » tombait 558 px trop
 * bas. La version precedente reglait ça en visant en boucle, sechement, dix
 * fois par seconde : ça arrivait juste, et ça sautait.
 *
 * On fait donc les deux dans l'ordre : un seul glissement doux, puis on ATTEND
 * QU'IL SE POSE — trois mesures identiques d'affilee — et alors seulement on
 * corrige, en douceur aussi, si la cible a bouge entre-temps. Trois retouches
 * au maximum : au-dela, la page ne se stabilise pas et s'acharner ferait
 * osciller l'ecran.
 *
 * Et on LACHE des que quelqu'un touche la molette ou l'ecran : se battre
 * contre un doigt serait pire que d'arriver un peu bas.
 */
function allerA(id: string) {
  const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let vivant = true;
  const lacher = () => {
    vivant = false;
    for (const e of ['wheel', 'touchstart', 'keydown']) window.removeEventListener(e, lacher);
  };
  for (const e of ['wheel', 'touchstart', 'keydown']) window.addEventListener(e, lacher, { passive: true });

  const viser = () =>
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: doux ? 'smooth' : ('instant' as ScrollBehavior) });

  viser();
  if (!doux) {
    lacher();
    return;
  }

  /*
   * LE FILET DE SECURITE. Un glissement doux a besoin d'images pour avancer :
   * dans un onglet en arriere-plan, le navigateur n'en fournit aucune et le
   * defilement ne demarre tout simplement PAS — mesure au banc, dix
   * echantillons a zero pendant qu'un defilement sec, lui, arrivait a bon
   * port. Sans ce filet, un clic dans ces conditions-la ne ferait rien du
   * tout, et « rien » est la pire des reponses.
   *
   * Si l'ecran n'a pas bouge d'un pixel apres une demi-seconde, on tranche :
   * on y va sechement. Mieux vaut un saut qu'une porte qui ne s'ouvre pas.
   */
  const depart = Math.round(window.scrollY);
  window.setTimeout(() => {
    if (!vivant) return;
    if (Math.round(window.scrollY) === depart) {
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
    }
  }, 500);

  let dernier = Number.NaN;
  let immobile = 0;
  let retouches = 0;
  const jusqua = performance.now() + 3000;

  const surveiller = () => {
    if (!vivant) return;
    const y = Math.round(window.scrollY);
    if (y === dernier) immobile += 1;
    else {
      immobile = 0;
      dernier = y;
    }

    if (immobile >= 3) {
      const el = document.getElementById(id);
      // La marge visee est celle de la section elle-meme (`scroll-mt-24`), lue
      // plutot que recopiee : le jour ou la barre du haut change de hauteur,
      // cette mesure suit toute seule.
      const marge = el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0;
      const ecart = el ? Math.round(el.getBoundingClientRect().top - marge) : 0;
      if (el && Math.abs(ecart) > 4 && retouches < 3) {
        retouches += 1;
        immobile = 0;
        viser();
      } else {
        lacher();
        return;
      }
    }

    if (performance.now() < jusqua) window.setTimeout(surveiller, 60);
    else lacher();
  };
  window.setTimeout(surveiller, 120);
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
  // Anarchistes italiens cites dans le cours.
  { formes: ['Maria Occhipinti'], url: { fr: wiki('fr', 'Maria_Occhipinti'), it: wiki('it', 'Maria_Occhipinti'), en: wiki('en', 'Maria_Occhipinti') } },
  // « Errico Malatesta » d'abord, « Malatesta » seul ensuite : la forme longue
  // gagne quand les deux sont la, la courte relie les notes qui ne citent que
  // le nom de famille.
  { formes: ['Errico Malatesta', 'Malatesta'], url: { fr: wiki('fr', 'Errico_Malatesta'), it: wiki('it', 'Errico_Malatesta'), en: wiki('en', 'Errico_Malatesta') } },
  { formes: ['Sacco e Vanzetti', 'Sacco et Vanzetti', 'Sacco and Vanzetti'], url: { fr: wiki('fr', 'Sacco_et_Vanzetti'), it: wiki('it', 'Sacco_e_Vanzetti'), en: wiki('en', 'Sacco_and_Vanzetti') } },
  { formes: ['Giuseppe Pinelli', 'Pinelli'], url: { fr: wiki('fr', 'Giuseppe_Pinelli'), it: wiki('it', 'Giuseppe_Pinelli'), en: wiki('en', 'Giuseppe_Pinelli') } },
  { formes: ['Pietro Gori'], url: { fr: wiki('fr', 'Pietro_Gori'), it: wiki('it', 'Pietro_Gori'), en: wiki('en', 'Pietro_Gori') } },
  { formes: ['Camillo Berneri'], url: { fr: wiki('fr', 'Camillo_Berneri'), it: wiki('it', 'Camillo_Berneri'), en: wiki('en', 'Camillo_Berneri') } },
  { formes: ['Luigi Fabbri'], url: { fr: wiki('fr', 'Luigi_Fabbri'), it: wiki('it', 'Luigi_Fabbri'), en: wiki('en', 'Luigi_Fabbri') } },
  // Virgilia D'Andrea : article sur les editions italienne et anglaise ; le
  // lecteur francais est renvoye a l'italienne, faute d'article dedie.
  { formes: ['Virgilia D’Andrea'], url: { fr: wiki('it', "Virgilia_D'Andrea"), it: wiki('it', "Virgilia_D'Andrea"), en: wiki('en', "Virgilia_D'Andrea") } },
  { formes: ['Armando Borghi'], url: { fr: wiki('it', 'Armando_Borghi'), it: wiki('it', 'Armando_Borghi'), en: wiki('en', 'Armando_Borghi') } },
  { formes: ['Leda Rafanelli'], url: { fr: wiki('it', 'Leda_Rafanelli'), it: wiki('it', 'Leda_Rafanelli'), en: wiki('en', 'Leda_Rafanelli') } },
  // L'evenement — renvoye a l'edition italienne dans toutes les langues, la
  // seule ou l'article existe a coup sur. On relie chaque forme traduite.
  { formes: ['Settimana Rossa', 'Semaine rouge', 'Red Week'], url: { fr: wiki('it', 'Settimana_rossa'), it: wiki('it', 'Settimana_rossa'), en: wiki('it', 'Settimana_rossa') } },
  { formes: ['Dario Fo'], url: { fr: wiki('fr', 'Dario_Fo'), it: wiki('it', 'Dario_Fo'), en: wiki('en', 'Dario_Fo') } },
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

  /*
   * L'AIGUILLAGE selon la taille d'ecran. Sur telephone, toucher une carte fait
   * monter le contenu dans la feuille. Sur grand ecran, ou le contenu s'affiche
   * en clair sous les cartes, elle y fait defiler — et l'ancre reste dans l'URL,
   * partageable et retrouvable. On lit la taille AU CLIC, pas au rendu, pour ne
   * pas dependre d'un etat qui aurait pu changer entre-temps.
   */
  const surCarte = (id: string) => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      /*
       * L'ancre est REPOSEE a la main. Le commentaire ci-dessus l'annoncait
       * depuis le debut, mais `preventDefault` — necessaire pour prendre en
       * charge le defilement nous-memes — l'empechait d'arriver dans l'URL :
       * on repartait avec une adresse nue. Mesure faite, hash vide sur les
       * cinq sections.
       *
       * `replaceState` et non `pushState` : sinon parcourir le sommaire
       * remplirait l'historique de sept ancres, et le bouton « retour »
       * remonterait le cours a l'envers au lieu de quitter la page.
       */
      window.history.replaceState(null, '', `#${id}`);
      allerA(id);
    } else ouvrir(id);
  };

  /*
   * LA FLECHE DE RETOUR, sur grand ecran : la page y est longue (tout le cours
   * s'affiche en clair). Elle apparait apres un ecran de defilement — en haut,
   * elle ne menerait qu'a la ou l'on est deja. Sur telephone, la page se resume
   * aux cartes : la fleche ne s'y declenche jamais.
   */
  const [remonter, setRemonter] = useState(false);
  useEffect(() => {
    const voir = () => setRemonter(window.scrollY > window.innerHeight * 0.8);
    voir();
    window.addEventListener('scroll', voir, { passive: true });
    return () => window.removeEventListener('scroll', voir);
  }, []);

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
    { id: 'chansons', titre: p.songsTitle, niveau: p.levelAll, icon: 'vinyl', intro: p.songsIntro },
    { id: 'exercices', titre: p.drillTitle, niveau: p.levelAll, icon: 'target', intro: p.drillIntro },
    { id: 'ailleurs', titre: p.elsewhereTitle, niveau: p.levelAll, icon: 'map', intro: p.elsewhereIntro },
  ];
  const ouverte = section ? PLAN.find((x) => x.id === section) : null;

  /*
   * Une CARTE de section — le style que Mag a montre sur son modele : un titre,
   * une phrase, et une icone en bas. Cliquer OUVRE la feuille de la section, la
   * ou avant on sautait dans la page.
   */
  const carteSommaire = (x: (typeof PLAN)[number]) => (
    <a
      key={x.id}
      href={`#${x.id}`}
      onClick={(e) => {
        e.preventDefault();
        surCarte(x.id);
      }}
      className="group flex min-h-[9.5rem] flex-col justify-between gap-5 rounded-2xl border p-6 text-left transition-transform duration-200 hover:scale-[1.01] motion-reduce:transition-none"
      style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
    >
      <div className="flex flex-col gap-2">
        <span className="text-[17px] leading-tight" style={{ fontWeight: 800 }}>{x.titre}</span>
        <p className="text-[13px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>{p.planDesc[x.id]}</p>
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

  /*
   * Une SECTION en clair — la version grand ecran. Le contenu (le meme
   * `contenu()` que la feuille) s'affiche sous les cartes, sous un titre ancre :
   * c'est ce que Google indexe, ce que le Ctrl+F trouve, et ce qu'un lien
   * #prononcer partage. Masquee sur telephone (`hidden md:block`), ou la feuille
   * prend le relais.
   */
  const sectionInline = (x: (typeof PLAN)[number]) => (
    <section key={x.id} id={x.id} className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
      <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
        <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
          <Icon name={x.icon} size={16} /> {x.niveau}
        </span>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
          {x.titre}
        </h2>
        {x.intro && (
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {x.intro}
          </p>
        )}
      </Reveal>
      <div className="mt-10">{contenu(x.id)}</div>
    </section>
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
                    {/* Le sens, en fin de pastille — sauf pour un lecteur italien,
                        qui lit deja le mot. En italique pour ne pas le confondre
                        avec la prononciation, qui est en milieu de point. */}
                    {lang !== 'it' && (
                      <span className="italic" style={{ opacity: 0.75, fontWeight: 500 }}> — {x.sens[lang]}</span>
                    )}
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
                {/*
                  Sur grand ecran, les colonnes se calent sur LEUR CONTENU
                  (`max-content`) au lieu de se partager la largeur en trois.
                  Mag : « sur ecran, mets moins d'espace entre les colonnes ».
                  Avec des tiers, « io parlerò » et « tu parlerai » se
                  retrouvaient a huit cents pixels l'un de l'autre sur un ecran
                  large — l'oeil ne rattache plus le pronom a sa forme, et la
                  conjugaison cesse de se lire comme un ensemble.
                  Sur telephone on garde les deux colonnes pleines : la largeur
                  y est comptee, et la partager reste le meilleur usage.
                */}
                <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-[repeat(3,minmax(0,max-content))] sm:gap-x-12">
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

              {/*
                Les reponses. En COLONNE PLEINE sur telephone : dans la
                feuille, on repond au pouce, et une cible large se touche sans
                viser. En RANGEE des qu'il y a de la place — Mag : « moins longs
                les boutons, non ? ». Elle a raison : etires sur toute la
                largeur d'un ecran, trois mots deviennent trois barres de
                1 900 px, et on ne lit plus des reponses mais des lignes de
                formulaire. Ils se calent donc sur leur texte, et se rangent
                cote a cote.
              */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
    // Les chansons. On enseigne les MOTS et ce que la chanson montre de la
    // langue — pas les paroles : celles de Cutugno et de Conte appartiennent a
    // leurs auteurs, et les recopier, meme traduites, ne se fait pas. La note
    // du bas le dit en clair plutot que de laisser croire a un oubli.
    if (id === 'chansons') {
      return (
        <div className="flex flex-col gap-8">
          {CHANSONS.map((ch) => (
            <div key={ch.id} className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--cava-line)' }}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-[clamp(1.15rem,2.4vw,1.5rem)] leading-[1.2]" style={{ fontWeight: 600 }}>{ch.titre}</h3>
                <span className="text-[13px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                  {ch.auteur} · {ch.annee}
                </span>
              </div>

              <p className="mt-3 max-w-[72ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>{ch.quoi[lang]}</p>

              <p className="mt-6 text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{p.songsWords}</p>
              <dl className="mt-3 grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-[repeat(2,minmax(0,max-content))]">
                {ch.mots.map((m) => (
                  <div key={m.it}>
                    <dt className="text-[15px]" style={{ fontWeight: 600 }}>
                      {m.it} <span className="text-[12px] uppercase tracking-[0.08em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{m.pron}</span>
                    </dt>
                    <dd className="text-[14px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>{m.sens[lang]}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-xl p-4" style={{ background: 'rgba(255,212,82,0.22)' }}>
                <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-ink)', fontWeight: 700 }}>{p.songsPoint}</p>
                <p className="mt-1 max-w-[72ch] text-[14px] leading-[1.7]">{ch.langue[lang]}</p>
              </div>

              <a href={ch.lien} target="_blank" rel="noopener noreferrer" className="cava-navlink mt-5 inline-flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--cava-pink)', fontWeight: 500 }}>
                {p.songsListen} ↗
              </a>
            </div>
          ))}

          <p className="max-w-[72ch] border-l-2 pl-4 text-[14px] leading-[1.7]" style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}>
            {p.songsWhy}
          </p>
        </div>
      );
    }

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
      <section className="mx-auto max-w-[110rem] px-5 pb-16 pt-10 md:px-10 md:pb-0">
        <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {PLAN.map((x) => carteSommaire(x))}
        </Reveal>
      </section>

      {/* LE COURS EN CLAIR, sur grand ecran. Sur telephone il reste masque : la
          feuille du bas le porte, section par section. Ici il est present dans
          le HTML (donc indexe et cherchable), sous des titres ancres. */}
      <div className="hidden md:block">
        {PLAN.map(sectionInline)}
      </div>

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

      {/* La fleche de retour — n'apparait qu'apres un ecran de defilement, donc
          en pratique sur grand ecran seulement (sur telephone la page tient en
          une grille). */}
      <button
        type="button"
        aria-label={p.backToTop}
        title={p.backToTop}
        onClick={() => {
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
