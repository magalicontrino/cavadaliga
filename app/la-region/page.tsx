'use client';

import { useEffect, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal, { RevealNow } from '../Reveal';
import Carousel from '../Carousel';
import PageHeader from '../PageHeader';
import Photo from '../Photo';
import Icon, { type IconName } from '../Icon';
import { surligne } from '../Surligne';
import Sources from '../Sources';
import FilterChip from '../FilterChip';
import { useI18n } from '../i18n';
import { withBase } from '../data';
import WorkGrid from '../WorkGrid';
import { ARTISTS, ARTS, SCULPTURES, PHOTOS, SCREENS, SPOTIFY_EMBED_HEIGHT, SPOTIFY_EMBED_URL, SPOTIFY_PLAYLIST_URL, MUNARI_BOOK, MUNARI_DESIGN_BOOK, MUNARI_WIKI, DE_JORIO_WIKI } from '../cultureData';
import Quiz from '../Quiz';

// Lieux autour de Cava d'Aliga (ordre = i18n regionPlaces / regionHighlights).
// images[] = photos du lieu (carrousel, sans lightbox). Ajouter d'autres photos
// dans le tableau au fil du temps. Vide → visuel provisoire « photo à venir ».
// unesco:true = badge « Patrimoine mondial UNESCO ». Noms propres = mêmes 3 langues.
const PLACES = [
  { images: ['/picture-sicile/cava-daliga.jpg', '/picture-sicile/cava-daliga-c.jpg'], label: 'Cava d’Aliga', tone: 'sand', km: 0, unesco: false },
  { images: ['/picture-sicile/scicli.jpg', '/picture-sicile/scicli-b.jpg'], label: 'Scicli', tone: 'sand', km: 8, unesco: true },
  { images: ['/picture-sicile/bruca.jpg'], label: 'Bruca', tone: 'sand', km: 4, unesco: false },
  { images: ['/picture-sicile/sampieri.jpg'], label: 'Sampieri', tone: 'sand', km: 5, unesco: false },
  { images: ['/picture-sicile/punta-pisciotto.jpg'], label: 'Punta Pisciotto', tone: 'sand', km: 6, unesco: false },
  // Punta Corvo, donne par Mag. Elle vient en 6e position, juste apres les
  // plages voisines : c'est la meme cote, a deux kilometres, mais ce n'est plus
  // une plage — d'ou sa fiche a part. ATTENTION : `regionPlaces` et
  // `regionHighlights` sont alignes sur CE tableau, dans les trois langues. Y
  // toucher sans les six, c'est decaler toutes les descriptions d'un cran.
  { images: [], label: 'Punta Corvo', tone: 'sand', km: 2, unesco: false },
  { images: [], label: 'Marina di Ragusa', tone: 'pink', km: 13, unesco: false },
  { images: [], label: 'Modica', tone: 'terra', km: 20, unesco: true },
  { images: [], label: 'Raguse', tone: 'ink', km: 28, unesco: true },
  { images: [], label: 'Noto', tone: 'pink', km: 55, unesco: true },
  { images: [], label: 'Syracuse', tone: 'terra', km: 85, unesco: true },
] as const;

// « Sons & images » n'est plus une page : ses sept sections vivent ici. La
// region, c'est aussi ce qu'on en a chante, filme, peint et photographie — une
// page de moins dans le menu, et le meme geste pour tout parcourir.
type Section = 'lieux' | 'sports' | 'faune' | 'livres' | 'histoire' | 'coutumes' | 'specialites' | 'alcools' | 'cafe' | 'pastasciutta' | 'symboles' | 'legendes' | 'scopa' | 'etna' | 'arabe' | 'genes' | 'playlist' | 'ecrans' | 'peinture' | 'sculpture' | 'photo' | 'mains' | 'chansons';
type Key = 'tout' | 'sons' | Section;

// « Sons & images » n'est pas une section : c'est un GROUPE. Un bouton pour les
// sept d'un coup — sinon la page perdait ce qu'elle etait, et il fallait sept
// clics pour retrouver l'ancienne. Les sept restent la, un a un, pour qui
// cherche precisement la peinture ou les ecrans.
const SONS: Section[] = ['playlist', 'ecrans', 'peinture', 'sculpture', 'photo', 'mains', 'chansons'];

/** Les sections qu'un lien « #… » peut ouvrir — celles qui portent une ancre. */
/*
 * Emmener au quiz, et l'y TENIR.
 *
 * Le quiz est a huit mille pixels du haut, et la page ne tient pas en place :
 * les sections au-dessus se replient une fois qu'on les a depassees. Mesure
 * au banc, trois fois : visee juste (1 px), puis la page se retracte de
 * 1 272 px et le quiz repart hors de l'ecran.
 *
 * Poser l'ancre ne suffit pas non plus — le saut natif ne fonctionne pas sur
 * ce site, les pages sont des composants client et le navigateur cherche
 * l'ancre avant qu'elle existe (voir app/ancre.ts, meme constat).
 *
 * On corrige donc la visee pendant deux secondes et demie, sans s'arreter
 * plus tot : c'est le temps qu'il faut a la page pour se figer. Et on LACHE
 * des que quelqu'un touche l'ecran ou la molette — se battre contre le doigt
 * de quelqu'un serait pire que de le laisser un peu loin du but.
 */
function allerAuQuiz() {
  const jusqua = performance.now() + 2500;
  let vivant = true;
  const lacher = () => {
    vivant = false;
    for (const e of ['wheel', 'touchstart', 'keydown']) window.removeEventListener(e, lacher);
  };
  for (const e of ['wheel', 'touchstart', 'keydown']) window.addEventListener(e, lacher, { passive: true });

  const viser = () => {
    if (!vivant) return;
    document.getElementById('quiz')?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
    if (performance.now() < jusqua) window.setTimeout(viser, 80);
    else lacher();
  };
  viser();
}

/*
 * LES SECTIONS QU'UNE ANCRE PEUT OUVRIR. Une section absente d'ici garde son
 * `id`, donc son ancre a l'air de marcher — et ne fait rien : le tri reste sur
 * « Les lieux », la section visee n'est pas rendue, et on atterrit en haut de
 * la page. C'est un piege silencieux, sans erreur ni avertissement, et c'est
 * exactement ce qui attendait « pastasciutta » : le quiz et « Demander » y
 * renvoient tous les deux.
 */
const SECTIONS_ANCREES: Section[] = ['lieux', 'sports', 'faune', 'livres', 'histoire', 'coutumes', 'specialites', 'alcools', 'cafe', 'pastasciutta', 'symboles', 'legendes', 'scopa', 'etna', 'arabe', 'genes', 'playlist'];

export default function LaRegion() {
  const { t, lang } = useI18n();
  const p = t.pages['la-region'];
  const rf = t.regionFilter;
  const c = t.culturePage;
  const q = t.quizPage;
  const cf = t.cultureFilter;

  // On arrive sur « Les lieux » : le bouton allumé correspond à ce qu'on voit.
  // Ce n'est plus le premier bouton depuis que la Sicile arabe ouvre la rangee,
  // mais l'accord tient — c'est bien la section affichee qui est allumee.
  // Avec « Tout » par défaut, cliquer « Les lieux » ne changeait rien à l'écran —
  // les deux commencent par la même section, et le clic semblait échouer.
  const [filter, setFilter] = useState<Key>('lieux');

  /**
   * On peut arriver sur une section precise : « #etna », « #cafe », « #arabe »…
   *
   * Comme les infos pratiques, cette page n'affiche qu'UNE section a la fois :
   * une ancre seule aurait vise un titre que le filtre tenait cache. Le
   * fragment choisit donc d'abord le bouton, et le defilement suit une fois la
   * section rendue. C'est « Demander » qui s'en sert.
   */
  const [cible, setCible] = useState<Key | null>(null);
  /*
   * On ecoute AUSSI les changements d'ancre en cours de page, pas seulement
   * celle du chargement.
   *
   * Le quiz, en bas, propose « relire le passage » et pointe #etna, #arabe…
   * Sans cet ecouteur, l'ancre changeait et il ne se passait rien : la page
   * n'affiche qu'une section a la fois, et celle qu'on visait n'existait meme
   * pas dans le document. Mesure au banc : hash a « #etna », sections
   * presentes « lieux » et « quiz » — le lien tombait dans le vide.
   */
  useEffect(() => {
    const viser = () => {
      // Lu en texte brut, pas en `Key` : « #quiz » n'est justement PAS une
      // section triable, et le typer comme telle rendait le test impossible.
      const cle = window.location.hash.slice(1);
      /*
       * « #quiz » ne designe pas une section triable : le quiz vit hors des
       * filtres, tout en bas. Il faut pourtant l'atteindre — le lien du bas de
       * page y mene depuis n'importe ou. Sans cette ligne, on arrivait en haut
       * de « La region » : defilement a 0, quiz a 8447 px. Mesure au banc.
       */
      if (cle === 'quiz') { allerAuQuiz(); return; }
      if (!cle || !SECTIONS_ANCREES.includes(cle as Section)) return;
      setFilter(cle as Key);
      setClicks((c) => c + 1);
      setCible(cle as Key);
    };
    viser();
    window.addEventListener('hashchange', viser);
    return () => window.removeEventListener('hashchange', viser);
  }, []);
  useEffect(() => {
    if (!cible || filter !== cible) return;
    // `instant` : on arrive d'une autre page, voir app/ancre.ts.
    document.getElementById(cible)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    setCible(null);
  }, [cible, filter]);
  // Incrementé à chaque choix : dit aux Reveal en dessous de se montrer d'un coup.
  // Le tri deplie ou non — telephone seulement, voir le rendu plus bas.
  const [deplie, setDeplie] = useState(false);
  const [clicks, setClicks] = useState(0);
  const choose = (k: Key) => {
    setFilter(k);
    setClicks((c) => c + 1);
  };
  // « Tout » enchaîne les trois ; sinon on isole une seule section.
  const show = (k: Section) => filter === 'tout' || filter === k || (filter === 'sons' && SONS.includes(k));

  // Le vinyle du bandeau vise « #sons » : il promet l'ancienne page, il doit la
  // rendre entiere — les sept sections, pas la seule playlist. Sans ca il
  // deposait sur « Les lieux », le tri par defaut, et le picto mentait. Une
  // seule fois, a l'arrivee : ensuite on trie a la main.
  useEffect(() => {
    if (window.location.hash !== '#sons') return;
    setFilter('sons');
    setClicks((c) => c + 1);
  }, []);

  // Les sections d'abord ; « Tout voir » ferme la marche, en retrait : c'est une
  // commande (tout enchaîner), pas une catégorie de plus.
  const filters: { key: Key; label: string; icon: IconName }[] = [
    { key: 'arabe', label: rf.arab, icon: 'landmark' },
    { key: 'genes', label: rf.genes, icon: 'target' },
    { key: 'etna', label: rf.etna, icon: 'volcano' },
    { key: 'lieux', label: rf.places, icon: 'pin' },
    { key: 'coutumes', label: rf.customs, icon: 'cone' },
    { key: 'specialites', label: rf.specialties, icon: 'fork' },
    { key: 'alcools', label: rf.drinks, icon: 'glass' },
    { key: 'cafe', label: rf.coffee, icon: 'droplet' },
    { key: 'pastasciutta', label: rf.pasta, icon: 'fork' },
    { key: 'symboles', label: rf.symbols, icon: 'brush' },
    { key: 'legendes', label: rf.legends, icon: 'compass' },
    { key: 'scopa', label: rf.scopa, icon: 'target' },
    { key: 'sports', label: rf.sports, icon: 'wave' },
    { key: 'faune', label: rf.fauna, icon: 'leaf' },
    { key: 'histoire', label: rf.history, icon: 'landmark' },
    { key: 'livres', label: rf.books, icon: 'list' },
    { key: 'sons', label: rf.sounds, icon: 'vinyl' },
    { key: 'playlist', label: cf.playlist, icon: 'spotify' },
    { key: 'ecrans', label: cf.screens, icon: 'film' },
    { key: 'peinture', label: cf.painting, icon: 'brush' },
    { key: 'sculpture', label: cf.sculpture, icon: 'landmark' },
    { key: 'photo', label: cf.photo, icon: 'camera' },
    { key: 'mains', label: cf.hands, icon: 'compass' },
    { key: 'chansons', label: cf.songs, icon: 'vinyl' },
  ];

  // Un lien Wikipédia par carte, dans la langue du lecteur — repli sur l'italien
  // pour les spécialités siciliennes qui n'ont pas d'article ailleurs. L'ordre
  // suit EXACTEMENT celui des cartes (t.specialtiesPage.facts / t.drinksPage.facts) :
  // une carte ajoutée ici doit ajouter sa ligne là, sinon les liens glissent.
  const wiki = (fr: string, it: string, en: string): string => ({ fr, it, en } as Record<string, string>)[lang] ?? it;
  const SPEC_LINKS = [
    wiki('https://it.wikipedia.org/wiki/Scaccia', 'https://it.wikipedia.org/wiki/Scaccia', 'https://it.wikipedia.org/wiki/Scaccia'),
    wiki('https://fr.wikipedia.org/wiki/Chocolat_de_Modica', 'https://it.wikipedia.org/wiki/Cioccolato_di_Modica', 'https://en.wikipedia.org/wiki/Modica_chocolate'),
    wiki('https://it.wikipedia.org/wiki/Testa_di_turco_(dolce)', 'https://it.wikipedia.org/wiki/Testa_di_turco_(dolce)', 'https://it.wikipedia.org/wiki/Testa_di_turco_(dolce)'),
    wiki("https://it.wikipedia.org/wiki/'Mpanatigghi", "https://it.wikipedia.org/wiki/'Mpanatigghi", "https://it.wikipedia.org/wiki/'Mpanatigghi"),
    wiki('https://fr.wikipedia.org/wiki/Caciocavallo', 'https://it.wikipedia.org/wiki/Caciocavallo', 'https://en.wikipedia.org/wiki/Caciocavallo'),
    wiki('https://fr.wikipedia.org/wiki/Torrone', 'https://it.wikipedia.org/wiki/Torrone', 'https://en.wikipedia.org/wiki/Torrone'),
  ];
  const DRINK_LINKS = [
    wiki('https://fr.wikipedia.org/wiki/Cerasuolo_di_Vittoria', 'https://it.wikipedia.org/wiki/Cerasuolo_di_Vittoria', 'https://en.wikipedia.org/wiki/Cerasuolo_di_Vittoria'),
    wiki('https://fr.wikipedia.org/wiki/Frappato', 'https://it.wikipedia.org/wiki/Frappato', 'https://en.wikipedia.org/wiki/Frappato'),
    wiki("https://fr.wikipedia.org/wiki/Nero_d'Avola", "https://it.wikipedia.org/wiki/Nero_d'Avola", "https://en.wikipedia.org/wiki/Nero_d'Avola"),
    wiki('https://fr.wikipedia.org/wiki/Marsala_(vin)', 'https://it.wikipedia.org/wiki/Marsala_(vino)', 'https://en.wikipedia.org/wiki/Marsala_wine'),
    wiki('https://fr.wikipedia.org/wiki/Amaro_(liqueur)', 'https://it.wikipedia.org/wiki/Amaro_(liquore)', 'https://en.wikipedia.org/wiki/Amaro_(liqueur)'),
    wiki('https://fr.wikipedia.org/wiki/Limoncello', 'https://it.wikipedia.org/wiki/Limoncello', 'https://en.wikipedia.org/wiki/Limoncello'),
  ];
  // Le café : lien seulement là où un article existe vraiment. Les cartes
  // « rituel » (café glacé, lexique du comptoir) n'en ont pas — chaîne vide,
  // le lien ne s'affiche pas.
  const COFFEE_LINKS = [
    wiki('https://fr.wikipedia.org/wiki/Espresso', 'https://it.wikipedia.org/wiki/Caffè_espresso', 'https://en.wikipedia.org/wiki/Espresso'),
    '',
    wiki('https://it.wikipedia.org/wiki/Granita', 'https://it.wikipedia.org/wiki/Granita', 'https://en.wikipedia.org/wiki/Granita'),
    '',
    wiki('https://it.wikipedia.org/wiki/Caffè_corretto', 'https://it.wikipedia.org/wiki/Caffè_corretto', 'https://en.wikipedia.org/wiki/Caffè_corretto'),
    wiki('https://fr.wikipedia.org/wiki/Cafetière_italienne', 'https://it.wikipedia.org/wiki/Moka_(caffettiera)', 'https://en.wikipedia.org/wiki/Moka_pot'),
  ];
  const wikiLabel = lang === 'fr' ? 'Wikipédia' : 'Wikipedia';

  return (
    <RevealNow.Provider value={clicks}>
    <main>
      <Nav current="/la-region" />

      <PageHeader title={p.title} intro={p.intro} />

      {/*
        Le quiz, AVANT le tri — Mag : « aussi par la pour le voir avant le
        tri, mais discret ».
        Il etait dans la rangee de tri : mal place deux fois. Cette rangee
        defile horizontalement, il fallait donc la pousser pour le decouvrir ;
        et surtout ce n'est pas un tri — cliquer un filtre et voir la page se
        vider de tout sauf d'un jeu serait un contresens. Un simple picto, du
        meme rond que ceux de la barre du haut, sans un mot : il se voit sans
        rien peser.
      */}
      {/* `pb-10` : le picto touchait presque les pastilles de tri, et on lisait
          une rangee de six boutons au lieu d'un picto et d'une rangee. Mag :
          « il n'y a pas assez d'ecart entre les boutons du tri et ce picto ».
          En bas de page il respirait deja — c'est la marge qui manquait.
          Mesure : 24 px entre le picto et la premiere pastille avec `pb-6`,
          encore trop peu ; 40 px avec `pb-10`, et la rangee redevient une
          rangee. La marge est mangee en partie par le `-my-4` du tri. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-10 pt-2 md:px-10">
        <Reveal className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => allerAuQuiz()}
            aria-label={q.title}
            title={q.title}
            className="cava-vinyllink flex h-11 w-11 items-center justify-center rounded-full"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="hourglass" size={22} />
          </button>
          {/* Le cours d'italien, a cote du quiz : deux choses qu'on FAIT, et
              parler la langue commence justement ici, dans la region. */}
          <a
            href={withBase('/italien')}
            aria-label={t.italianPage.title}
            title={t.italianPage.title}
            className="cava-vinyllink flex h-11 w-11 items-center justify-center rounded-full"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="parler" size={22} />
          </a>
        </Reveal>
      </section>

      {/* Le tri : la page est longue, on choisit ce qu'on cherche */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        {/*
          LE TRI REVIENT A LA LIGNE, comme celui du quiz — meme raison, en pire :
          ce ruban compte vingt boutons et en cachait 1755 px sur la droite,
          mesure faite. Un debordement lateral ne laisse aucune trace ; on ne
          peut pas choisir « Des livres » ni « L'italien » si rien ne dit qu'ils
          existent.

          MAIS DEPLIER VINGT BOUTONS SUR UN TELEPHONE NE VAUT PAS MIEUX : mesure
          a 375 px, onze lignes et 694 px de haut, soit 85 % de l'ecran rien que
          pour le tri. On aurait remplace un defaut par un autre.

          D'ou le repli : sur telephone, trois rangees au plus, et un bouton
          « Voir tous les themes » qui ouvre le reste. Ce n'est PAS le meme
          geste que le defilement lateral — ici, ce qui est cache s'annonce, et
          s'ouvre d'une seule touche. Sur grand ecran il n'y a rien a replier :
          les vingt tiennent en trois lignes, et `md:max-h-none` leve la limite.

          LE PLAFOND EST MESURE, PLUS DEVINE — Mag : « c'est coupe ». Il valait
          `10.5rem`, soit 168 px, et il n'a JAMAIS laisse voir trois rangees :
          une puce fait 54 px de haut, l'ecart 10, donc trois rangees demandent
          3 × 54 + 2 × 10 = 182 px. Il en tranchait la troisieme de 14 px depuis
          le debut. Le defaut ne s'etait pas vu tant que la rangee coupee ne
          portait rien qu'on cherchait ; ajouter une puce a suffi a le rendre
          criant.

          182 px cache aussi la QUATRIEME rangee en entier — elle commence a
          192 — ce qui compte autant : une rangee a moitie visible se lit comme
          un bug, pas comme une promesse de « voir plus ».

          A remesurer si la taille des puces bouge : hauteur d'une puce, ecart
          entre rangees, et on refait le calcul.
        */}
        <Reveal>
          <div
            className={`flex flex-wrap gap-2.5 md:max-h-none md:overflow-visible ${
              deplie ? '' : 'max-h-[182px] overflow-hidden'
            }`}
          >
            {filters.map((x) => {
              const on = filter === x.key;
              return (
                <FilterChip key={x.key} label={x.label} icon={x.icon} active={on} onClick={() => choose(x.key)} />
              );
            })}
            <FilterChip label={rf.all} icon="map" active={filter === 'tout'} onClick={() => choose('tout')} subtle />
          </div>

          {/* `md:hidden` : sur grand ecran, rien n'est cache, donc rien a ouvrir. */}
          <button
            type="button"
            onClick={() => setDeplie((d) => !d)}
            className="mt-3 text-[13px] underline underline-offset-4 md:hidden"
            style={{ color: 'var(--cava-muted)', fontWeight: 600 }}
          >
            {deplie ? t.filtersLess : t.filtersMore}
          </button>
        </Reveal>
      </section>

      {/* La Sicile arabe — l'histoire qui explique ce qu'on a sous les yeux */}
      {/*
        LA GENETIQUE, REMISE APRES VERIFICATION. La premiere version est sortie
        du site le jour meme : Mag a demande d'aller chercher d'autres sources,
        et deux etudes recentes ont contredit ce que j'avais publie.

        L'ORDRE DES CARTES EST L'ARGUMENT. On commence par ce que ces etudes
        MESURENT — un chromosome, une lignee — avant de donner le moindre
        chiffre ; sinon le 37 % se lit comme une part d'ancetres. Et on finit
        sur la phrase de Mag, qui est la seule conclusion honnete : un Sicilien
        reste un Sicilien.
      */}
      {show('genes') && (
      <section id="genes" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="target" size={16} /> {t.genesPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.genesPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.genesPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.genesPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={24} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.4rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {surligne(f.text)}
              </p>
            </Reveal>
          ))}
        </div>

        <Sources section="genes" />
      </section>
      )}

      {show('arabe') && (
      <section id="arabe" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="landmark" size={16} /> {t.arabPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.arabPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.arabPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.arabPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={24} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.4rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="mt-8 max-w-[68ch] border-l-2 pl-5 text-[15px] italic leading-[1.7]"
          style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}
        >
          {t.arabPage.note}
        </Reveal>

        {/* Pour aller plus loin — @iosonolibero, « Musica e Sicilia Araba » */}
        <Reveal
          className="mt-8 flex flex-col gap-4 rounded-2xl border p-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'var(--cava-line)' }}
        >
          <div className="max-w-[58ch]">
            <p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
              {t.arabPage.moreTitle}
            </p>
            <p className="mt-2 text-[15px] leading-[1.65]" style={{ color: 'var(--cava-muted)' }}>
              {t.arabPage.moreDesc}
            </p>
          </div>
          <a
            href="https://www.instagram.com/iosonolibero/"
            target="_blank"
            rel="noopener noreferrer"
            className="cava-pill inline-flex w-fit shrink-0 items-center gap-2 px-5 py-2.5 text-[13px]"
          >
            <Icon name="instagram" size={15} /> @iosonolibero <span aria-hidden>↗</span>
          </a>
        </Reveal>
      </section>
      )}

      {/* L'Etna, en deuxieme. Le fil de sa neige mene a la granita, dont parlent
          « Us et coutumes » plus bas : les deux sections se repondent, meme si
          elles ne se touchent plus. */}
      {show('etna') && (
      <section id="etna" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="volcano" size={16} /> {t.etnaPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.etnaPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.etnaPage.intro}
          </p>
        </Reveal>

        {/* Les deux photos de Mag. Tant qu'elles ne sont pas deposees dans
            /public/picture-sicile/, Photo affiche son aplat de repli plutot
            qu'une image cassee. */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {['/picture-sicile/etna-01.webp', '/picture-sicile/etna-02.webp'].map((src, i) => (
            <Reveal key={src} delay={i * 90}>
              <Photo
                src={src}
                alt={t.etnaPage.photoAlt}
                tone={i === 0 ? 'ink' : 'terra'}
                label={`${t.etnaPage.photoAlt} — à venir`}
                className="aspect-[4/3] w-full rounded-2xl"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.etnaPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Deux liens verifies vivants : le parc (site UNESCO officiel) et le
            detail des domaines skiables, pour qui veut vraiment y monter. */}
        <Reveal className="mt-8 flex flex-wrap gap-3">
          {[
            { url: 'https://www.unescoparcoetna.it/', label: t.etnaPage.linkPark, icon: 'volcano' as IconName },
            { url: 'https://www.skiresort.info/ski-resorts/parco-delletna/', label: t.etnaPage.linkSki, icon: 'compass' as IconName },
            // Un vrai operateur d'excursions, choisi par Mag. Son adresse suit
            // la langue : le site existe en fr et it, sa racine sert l'anglais.
            { url: t.etnaPage.linkToursUrl, label: t.etnaPage.linkTours, icon: 'pin' as IconName },
          ].map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-[14px] transition hover:opacity-85"
              style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)', fontWeight: 600 }}
            >
              <Icon name={l.icon} size={18} /> {l.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </Reveal>
        <Sources section="etna" />
      </section>
      )}

      {/* Les lieux autour de nous — fiches éditoriales alternées + lightbox */}
      {show('lieux') && (
      <section id="lieux" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-12 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="pin" size={16} /> {t.regionFilter.places}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.placesTitle}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.placesIntro}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-28">
          {PLACES.map((place, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={place.label} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                {/* Carrousel de photos (sans lightbox) */}
                <div className={flip ? 'md:order-2' : ''}>
                  <Carousel
                    images={place.images}
                    alt={place.label}
                    tone={place.tone}
                    label={`${place.label} — photo à venir`}
                  />
                </div>

                {/* Fiche : numéro + (badge UNESCO) + nom + histoire */}
                <div className={flip ? 'md:order-1' : ''}>
                  <span className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                    {String(i + 1).padStart(2, '0')} / {String(PLACES.length).padStart(2, '0')}
                    <span style={{ color: 'var(--cava-muted)' }}> · {place.km === 0 ? t.regionHere : `≈ ${place.km} km`}</span>
                  </span>
                  {place.unesco && (
                    <div className="mt-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
                        style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                      >
                        <span aria-hidden>★</span> {t.unescoLabel}
                      </span>
                    </div>
                  )}
                  <h3
                    className="mt-3 text-[clamp(2rem,5vw,3.4rem)] uppercase leading-[0.98] tracking-[-0.02em]"
                    style={{ fontWeight: 900 }}
                  >
                    {place.label}
                  </h3>
                  <p
                    className="mt-6 max-w-[48ch] border-l-2 pl-5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]"
                    style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}
                  >
                    {t.regionPlaces[i]}
                  </p>

                  {t.regionHighlights[i] && t.regionHighlights[i].length > 0 && (
                    <ul className="mt-7 flex max-w-[48ch] flex-col gap-3">
                      {t.regionHighlights[i].map((h) => (
                        <li key={h} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-ink)' }}>
                          <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      
        {/* Les sources de la section, en petit — voir app/sourcesData.ts. */}
        <Reveal>
          {/*
            LE VAL DI NOTO — Mag voulait « un lien de l'UNESCO qui corrobore ».
            En allant verifier, il s'est avere que l'intro disait vrai mais
            melangeait deux choses : les cinq villes badgees ne relevent pas du
            meme classement. Scicli, Modica, Raguse et Noto appartiennent au Val
            di Noto (huit villes, 2002) ; Syracuse a une inscription a elle,
            avec Pantalica, en 2005.

            Le bloc dit donc les trois choses dans l'ordre : d'ou vient le
            baroque d'ici, ce que l'UNESCO a inscrit, et — le seul chiffre qui
            compte pour qui loge ici — que QUATRE des huit sont a moins de
            55 km.
          */}
          <Reveal className="mt-16 rounded-2xl p-8 md:p-10" style={{ background: 'var(--cava-note)' }}>
            <h3 className="text-[clamp(1.2rem,2.4vw,1.5rem)] uppercase leading-[1.1]" style={{ fontWeight: 900 }}>
              {t.unescoNote.title}
            </h3>
            <p className="mt-4 max-w-[68ch] text-[15px] leading-[1.8]">{t.unescoNote.quake}</p>
            <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.8]">{t.unescoNote.towns}</p>
            <p className="mt-4 max-w-[68ch] text-[clamp(1rem,1.5vw,1.1rem)] leading-[1.75]" style={{ fontWeight: 600 }}>
              {t.unescoNote.near}
            </p>
            <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.8]" style={{ color: 'var(--cava-muted)' }}>
              {t.unescoNote.syracuse}
            </p>
          </Reveal>

          <Sources section="lieux" />
        </Reveal>
      </section>
      )}

      {/* Us et coutumes — granita, arancina, passeggiata */}
      {show('coutumes') && (
      <section id="coutumes" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="cone" size={16} /> {t.tastePage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.tastePage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.tastePage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {t.tastePage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
              {/* Le lien de carte, quand la fiche en porte un. `mt-auto` le colle
                  en bas : les cartes de la rangee gardent leurs liens alignes
                  meme quand les textes n'ont pas la meme longueur. */}
              {f.lien && (
                <a
                  href={f.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-navlink mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px]"
                  style={{ color: 'var(--cava-pink)', fontWeight: 500 }}
                >
                  {f.lienLabel} ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>

        <Sources section="coutumes" />
      </section>
      )}

      {/* Les spécialités du coin — ce qu'on rapporte et ce qu'on goûte sur place.
          Même grille de cartes que « Us et coutumes » : les deux se répondent. */}
      {show('specialites') && (
      <section id="specialites" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="fork" size={16} /> {t.specialtiesPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.specialtiesPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.specialtiesPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {t.specialtiesPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
              {SPEC_LINKS[i] && (
                <a
                  href={SPEC_LINKS[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-navlink mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px]"
                  style={{ color: 'var(--cava-pink)', fontWeight: 500 }}
                >
                  {wikiLabel} ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/* Les vins et alcools du coin — le pendant liquide des spécialités.
          Même grille de cartes ; le Cerasuolo di Vittoria ouvre, forcément. */}
      {show('alcools') && (
      <section id="alcools" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="glass" size={16} /> {t.drinksPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.drinksPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.drinksPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {t.drinksPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
              {DRINK_LINKS[i] && (
                <a
                  href={DRINK_LINKS[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-navlink mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px]"
                  style={{ color: 'var(--cava-pink)', fontWeight: 500 }}
                >
                  {wikiLabel} ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>
        <Sources section="alcools" />
      </section>
      )}

      {/* Le café — le rituel qui rythme la journée. Même grille de cartes ;
          lien Wikipédia sur les cartes « objet » (espresso, granita, corretto,
          moka), pas sur les cartes « rituel ». */}
      {show('cafe') && (
      <section id="cafe" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="droplet" size={16} /> {t.coffeePage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.coffeePage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.coffeePage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {t.coffeePage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
              {COFFEE_LINKS[i] && (
                <a
                  href={COFFEE_LINKS[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-navlink mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px]"
                  style={{ color: 'var(--cava-pink)', fontWeight: 500 }}
                >
                  {wikiLabel} ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/*
        LA PASTASCIUTTA ANTIFASCISTE — Mag a envoye le sujet. Elle est POSEE
        ENTRE LE CAFE ET L'ETNA, c'est-a-dire au milieu des sections qui se
        mangent : ce n'est pas une section d'histoire, c'est une recette qui se
        trouve avoir une date. Rangee avec l'histoire, elle serait devenue une
        lecon ; rangee ici, elle reste ce qu'elle est — un plat qu'on refait.

        Le recit tient en quatre temps parce que la chute est le sujet : la
        famille, la fete, la fusillade, la fete refaite. Sauter le troisieme
        rendrait le quatrieme incomprehensible, et sauter le quatrieme ferait
        de cette page un memorial.
      */}
      {show('pastasciutta') && (
      <section id="pastasciutta" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="fork" size={16} /> {t.pastaPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.pastaPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.pastaPage.intro}
          </p>
        </Reveal>

        {/* Le mot d'abord : sans lui, « pastasciutta » n'est qu'un mot long. */}
        <Reveal className="mt-10 max-w-[68ch] border-l-2 pl-5" style={{ borderColor: 'var(--cava-pink)' }}>
          <h3 className="text-[15px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
            {t.pastaPage.word.title}
          </h3>
          <p className="mt-2 text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>{t.pastaPage.word.text}</p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.pastaPage.story.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 80} className="flex flex-col gap-3 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>{b.title}</h3>
              <p className="text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>{b.text}</p>
            </Reveal>
          ))}
        </div>

        {/* Les sept prenoms, en clair. Une liste de morts se lit mal en pave. */}
        <Reveal className="mt-8 rounded-2xl px-6 py-5 text-[15px] leading-[1.7]" style={{ background: 'rgba(230,41,111,0.08)' }}>
          {t.pastaPage.brothers}
        </Reveal>

        {/*
          LA RECETTE PREND TOUTE LA LARGEUR depuis que les livres ont rejoint
          l'etagere de « Des livres » (Mag : « ajoute les livres dans des
          livres »). Les garder ici EN PLUS les aurait ecrits deux fois sur la
          meme page : deux endroits a corriger le jour ou une reference change,
          et un lecteur qui se demande laquelle fait foi.
        */}
        <Reveal className="mt-12 rounded-2xl border p-8 md:p-10" style={{ borderColor: 'var(--cava-line)' }}>
          <h3 className="text-[clamp(1.3rem,2.6vw,1.7rem)] uppercase leading-[1.1]" style={{ fontWeight: 900 }}>
            {t.pastaPage.recipe.title}
          </h3>
          <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>{t.pastaPage.recipe.intro}</p>
          <div className="mt-6 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <ul className="flex flex-col gap-2 text-[15px]">
              {t.pastaPage.recipe.ingredients.map((x) => (
                <li key={x} className="flex items-baseline gap-3">
                  <span aria-hidden style={{ color: 'var(--cava-pink)' }}>·</span>
                  {x}
                </li>
              ))}
            </ul>
            <ol className="flex flex-col gap-3 text-[15px] leading-[1.7]">
              {t.pastaPage.recipe.steps.map((x, i) => (
                <li key={x} className="flex items-baseline gap-3">
                  <span className="shrink-0 font-mono text-[13px]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {x}
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-7 max-w-[68ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)', fontStyle: 'italic' }}>
            {t.pastaPage.recipe.note}
          </p>
        </Reveal>

        {/* Le renvoi vers l'etagere : une phrase, et l'ancre fait le reste. */}
        <Reveal className="mt-6 text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
          {t.pastaPage.shelf}{' '}
          <a href="#livres" className="cava-navlink" style={{ color: 'var(--cava-pink)', fontWeight: 600 }}>↗</a>
        </Reveal>

        <Sources section="pastasciutta" />
      </section>
      )}

      {/*
        LES DEUX SYMBOLES — Mag a envoye les deux photos. Ils tiennent dans UNE
        SEULE section : ce sont deux objets, pas deux sujets, et deux puces de
        tri pour ça auraient encombre la rangee sans rien clarifier.

        CHAQUE TEXTE PORTE SA PHOTO A COTE, pas au-dessus : la Trinacria ne se
        comprend qu'en la voyant — trois jambes autour d'une tete, ça ne se
        raconte pas. Sur telephone la photo passe au-dessus du texte, l'objet
        avant l'explication.
      */}
      {show('symboles') && (
      <section id="symboles" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="brush" size={16} /> {t.symbolsPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.symbolsPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.symbolsPage.intro}
          </p>
        </Reveal>

        {[
          { d: t.symbolsPage.trinacria, src: '/deco/trinacria.jpeg', w: 447, h: 447 },
          { d: t.symbolsPage.teste, src: '/deco/teste-di-moro-caltagirone.webp', w: 800, h: 800 },
        ].map((b, i) => (
          <Reveal key={b.src} className="mt-12 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <figure className={`flex flex-col gap-2 ${i % 2 ? 'md:order-2' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBase(b.src)}
                alt={b.d.alt}
                width={b.w}
                height={b.h}
                loading="lazy"
                className="w-full rounded-2xl object-cover"
              />
              <figcaption className="text-[13px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                {b.d.caption}
              </figcaption>
            </figure>
            <div className={i % 2 ? 'md:order-1' : ''}>
              <h3 className="text-[clamp(1.2rem,2.4vw,1.5rem)] leading-[1.2]" style={{ fontWeight: 700 }}>{b.d.title}</h3>
              <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.8]" style={{ color: 'var(--cava-muted)' }}>{b.d.text}</p>
            </div>
          </Reveal>
        ))}

        <Reveal className="mt-10 max-w-[68ch] border-l-2 pl-5 text-[15px] leading-[1.75]" style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}>
          {t.symbolsPage.note}
        </Reveal>

        <Sources section="symboles" />
      </section>
      )}

      {/*
        LES HUIT LEGENDES. Une grille de cartes, comme les autres sections
        explicatives — mais avec le LIEU sous le titre, parce qu'une legende
        sicilienne est toujours attachee a un endroit precis qu'on peut aller
        voir. Sans le lieu, ce ne sont que des contes ; avec, ce sont des
        adresses.

        La note du bas relie Cola Pesce a la Trinacria : ses trois colonnes sont
        les trois caps du symbole. Les deux sections de cette page racontent la
        meme ile sans le savoir, et le dire vaut mieux que de compter sur le
        lecteur pour le remarquer.
      */}
      {show('legendes') && (
      <section id="legendes" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="compass" size={16} /> {t.legendsPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.legendsPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.legendsPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.legendsPage.items.map((l, i) => (
            <Reveal key={l.title} delay={(i % 2) * 80} className="flex flex-col gap-2 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>{l.title}</h3>
              <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{l.place}</p>
              <p className="mt-1 text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>{l.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 max-w-[68ch] border-l-2 pl-5 text-[15px] leading-[1.75]" style={{ borderColor: 'var(--cava-pink)' }}>
          {t.legendsPage.note}
        </Reveal>

        <Sources section="legendes" />
      </section>
      )}

      {/*
        LA SCOPA — Mag l'a demandee deux fois, « avec ses regles ». La section
        se lit donc comme une regle du jeu et non comme un article : on donne
        d'abord de quoi jouer ce soir, le decompte ensuite, et la primiera a
        part parce que c'est le seul point que personne ne retient.

        L'IMAGE DES ENSEIGNES DORMAIT dans `public/deco` depuis le debut, sans
        etre affichee nulle part. Elle trouve enfin son emploi : les quatre
        enseignes italiennes ne ressemblent a rien de ce qu'on connait, et les
        nommer sans les montrer ne sert a rien.
      */}
      {show('scopa') && (
      <section id="scopa" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="target" size={16} /> {t.scopaPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.scopaPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.scopaPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <Reveal className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBase('/deco/scopa-enseignes.webp')}
              alt={t.scopaPage.suitsAlt}
              width={1414}
              height={2000}
              loading="lazy"
              className="w-full rounded-2xl object-contain"
              style={{ background: 'var(--cava-bg)' }}
            />
            <p className="text-[13px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>{t.scopaPage.suitsCaption}</p>
          </Reveal>

          <Reveal className="flex flex-col gap-6">
            {t.scopaPage.rules.map((r, i) => (
              <div key={r.title} className={i > 0 ? 'border-t pt-6' : ''} style={i > 0 ? { borderColor: 'var(--cava-line)' } : undefined}>
                <h3 className="text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.2]" style={{ fontWeight: 700 }}>{r.title}</h3>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>{r.text}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <h3 className="text-[clamp(1.2rem,2.4vw,1.5rem)] uppercase leading-[1.1]" style={{ fontWeight: 900 }}>{t.scopaPage.scoreTitle}</h3>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
            {t.scopaPage.score.map((x) => (
              <li key={x.label} className="flex flex-col gap-1 p-6 md:p-7" style={{ background: 'var(--cava-bg)' }}>
                <span className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>{x.label}</span>
                <span className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>{x.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* La primiera a son propre bloc : c'est le seul point du jeu qui a
            besoin d'un tableau pour se comprendre. */}
        <Reveal className="mt-10 rounded-2xl p-8 md:p-10" style={{ background: 'var(--cava-note)' }}>
          <h3 className="text-[clamp(1.05rem,2vw,1.25rem)]" style={{ fontWeight: 700 }}>{t.scopaPage.primieraTitle}</h3>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.75]">{t.scopaPage.primieraText}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {t.scopaPage.primiera.map((x) => (
              <span key={x.carte} className="rounded-full px-4 py-2 text-[14px]" style={{ background: 'var(--cava-bg)' }}>
                <strong>{x.carte}</strong> · {x.points}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-8 max-w-[68ch] border-l-2 pl-5 text-[15px] leading-[1.75]" style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}>
          {t.scopaPage.note}
        </Reveal>

        <Sources section="scopa" />
      </section>
      )}

      {/* La faune. Elle etait dans les infos pratiques avec les consignes de
          menage ; Mag l'a deplacee ici — « on veut juste parler des fourmis et
          de la proprete dans les infos ». Un gecko n'est pas une consigne, il
          se decouvre. Les fourmis, elles, sont restees la-bas : elles sont la
          raison de la regle des miettes. */}
      {show('sports') && (
      /*
       * LES JEUX DE PLAGE. Meme habit que « La faune » : un chapeau, trois
       * cartes par rangee, une note en bas. La section est ANCREE (`sports`),
       * donc « Demander » et le quiz peuvent y renvoyer.
       */
      <section id="sports" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="wave" size={16} /> {t.sportsPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.sportsPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.sportsPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {t.sportsPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 max-w-[68ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {t.sportsPage.note}
        </Reveal>

        {/* Les sources, en petit, sous la note — voir app/sourcesData.ts. */}
        <Reveal>
          <Sources section="sports" />
        </Reveal>
      </section>
      )}

      {show('faune') && (
      <section id="faune" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="leaf" size={16} /> {t.faunaPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.faunaPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.faunaPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {t.faunaPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 max-w-[68ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {t.faunaPage.note}
        </Reveal>

        {/* Les sources, en petit, sous la note — voir app/sourcesData.ts. */}
        <Reveal>
          <Sources section="faune" />
        </Reveal>
      </section>
      )}

      {/* Luttes & memoire, puis les livres. Dans cet ordre : on raconte
          d'abord ce qui s'est passe a vingt kilometres d'ici, et les livres
          viennent juste apres, parce que ceux qui l'ont vecu les ont ecrits
          eux-memes. */}
      {show('histoire') && (
      <section id="histoire" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="landmark" size={16} /> {t.historyPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.historyPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.historyPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.historyPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl" style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}>
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
              <a href={f.lien} target="_blank" rel="noopener noreferrer" className="cava-navlink mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px]" style={{ color: 'var(--cava-pink)', fontWeight: 500 }}>
                {t.historyPage.linkLabel} ↗
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 max-w-[68ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {t.historyPage.note}
        </Reveal>
      </section>
      )}

      {show('livres') && (
      <section id="livres" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="list" size={16} /> {t.booksPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.booksPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.booksPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--cava-line)' }}>
          {t.booksPage.list.map((b, i) => (
            <Reveal key={b.titre} delay={Math.min(i, 4) * 60} className="flex flex-col gap-3 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                  {b.titre}
                </h3>
                <span className="text-[13px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-pink)', fontWeight: 600 }}>
                  {b.auteur} · {b.annee}
                </span>
              </div>
              <p className="max-w-[80ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {b.text}
              </p>
              <a href={b.lien} target="_blank" rel="noopener noreferrer" className="cava-navlink inline-flex w-fit items-center gap-1.5 text-[13px]" style={{ color: 'var(--cava-pink)', fontWeight: 500 }}>
                {t.booksPage.linkLabel} ↗
              </a>
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {show('playlist') && (
      <section id="playlist" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-12 md:px-10">
        <Reveal
          className="relative overflow-hidden rounded-3xl border p-8 md:p-10"
          style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
        >
          {/* Vinyle décoratif */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 opacity-[0.06]"
            style={{ color: 'var(--cava-pink)' }}
          >
            <Icon name="vinyl" size={220} />
          </span>

          {/* Le lecteur monte à côté du texte : il ne fait que 152px de haut,
              il n'a pas besoin d'attendre la fin du paragraphe pour exister. */}
          <div className="relative grid gap-6 md:gap-10 lg:grid-cols-[1fr_minmax(300px,440px)] lg:items-center">
            <div className="max-w-[56ch]">
              <span
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--cava-pink)' }}
              >
                <Icon name="vinyl" size={16} /> {c.eyebrow}
              </span>
              <h2 className="mt-2 text-[clamp(1.4rem,2.8vw,2rem)] uppercase leading-[1.05] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
                {cf.playlist}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {c.playlistDesc}
              </p>
              <div className="mt-5">
                {SPOTIFY_PLAYLIST_URL ? (
                  <a
                    href={SPOTIFY_PLAYLIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[14px] transition hover:opacity-85"
                    style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                  >
                    <Icon name="spotify" size={19} /> {c.playlistCta} <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-2.5 rounded-full border border-dashed px-6 py-3 text-[14px] italic"
                    style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}
                  >
                    <Icon name="spotify" size={19} /> {c.playlistSoon}
                  </span>
                )}
              </div>
            </div>

            {SPOTIFY_PLAYLIST_URL && (
              <div className="overflow-hidden rounded-xl">
                <iframe
                  src={SPOTIFY_EMBED_URL}
                  title={cf.playlist}
                  width="100%"
                  height={SPOTIFY_EMBED_HEIGHT}
                  frameBorder="0"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ border: 0, display: 'block' }}
                />
              </div>
            )}
          </div>
        </Reveal>
      </section>
      )}

      {/* À l'écran — films & séries tournés ici */}
      {show('ecrans') && <WorkGrid title={cf.screens} intro={c.screensIntro} items={SCREENS} icon="film" lang={lang} more={c.moreLabel} />}

      {/* Peint ici — Guccione & le Gruppo di Scicli */}
      {show('peinture') && <WorkGrid title={cf.painting} intro={c.artsIntro} items={ARTS} icon="brush" lang={lang} more={c.moreLabel} />}

      {/* Sculpté ici — Sasha Vinci. A sa propre section : « Peint ici » ne parle
          que de peinture, et son texte le dit. */}
      {show('sculpture') && <WorkGrid title={cf.sculpture} intro={c.sculptureIntro} items={SCULPTURES} icon="landmark" lang={lang} more={c.moreLabel} />}

      {/* Photographié ici — Giuseppe Leone & Scianna */}
      {show('photo') && <WorkGrid title={cf.photo} intro={c.photosIntro} items={PHOTOS} icon="camera" lang={lang} more={c.moreLabel} />}

      {/* Designer — Munari, son dictionnaire de gestes et son livre sur le design */}
      {show('mains') && (
      <section id="mains" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
        >
          {cf.hands}
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-[68ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {c.handsIntro}
        </Reveal>

        {/* Deux cartes, un livre chacune : sa couverture en tête, son lien en
            pied. Les couvertures ne sont pas à nous — crédit éditeur sous
            chaque image, et rien du contenu des livres n'est repris. */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div
              className="flex h-full flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <figure className="flex flex-col gap-2">
                <img
                  src={withBase('/livres/speak-italian.jpg')}
                  alt={c.handsCoverAlt}
                  width={1103}
                  height={1500}
                  loading="lazy"
                  className="block h-auto w-[180px] rounded-lg"
                />
                <figcaption className="max-w-[34ch] text-[11.5px] leading-[1.45]" style={{ color: 'var(--cava-muted)' }}>
                  {c.handsCoverCredit}
                </figcaption>
              </figure>
              <h3 className="text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.12]" style={{ fontWeight: 600 }}>
                Bruno Munari
              </h3>
              <p className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                1907 – 1998
              </p>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {c.handsWho}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={MUNARI_BOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-[13.5px] transition hover:opacity-85"
                  style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                >
                  <Icon name="search" size={15} /> {c.handsBookCta} <span aria-hidden>↗</span>
                </a>
                <a href={MUNARI_WIKI} target="_blank" rel="noopener noreferrer" className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="info" size={15} /> {c.moreLabel} <span aria-hidden>↗</span>
                </a>
                <a href={DE_JORIO_WIKI} target="_blank" rel="noopener noreferrer" className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="info" size={15} /> Andrea de Jorio, 1832 <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Design as Art — son livre le plus lu, celui qui explique le reste */}
          <Reveal delay={70}>
            <div
              className="flex h-full flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <figure className="flex flex-col gap-2">
                <img
                  src={withBase('/livres/design-as-art.webp')}
                  alt={c.handsCover2Alt}
                  width={304}
                  height={500}
                  loading="lazy"
                  className="block h-auto w-[180px] rounded-lg"
                />
                <figcaption className="max-w-[34ch] text-[11.5px] leading-[1.45]" style={{ color: 'var(--cava-muted)' }}>
                  {c.handsCover2Credit}
                </figcaption>
              </figure>
              <h3 className="text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.12]" style={{ fontWeight: 600 }}>
                {c.handsBook2Title}
              </h3>
              <p className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                1966
              </p>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {c.handsBook2Desc}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={MUNARI_DESIGN_BOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-[13.5px] transition hover:opacity-85"
                  style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                >
                  <Icon name="search" size={15} /> {c.handsBook2Cta} <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6 flex items-start gap-3 text-[13px] italic leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
          <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="info" size={14} />
          </span>
          <p className="max-w-[70ch]">{c.handsPhotoNote}</p>
        </Reveal>
      </section>
      )}

      {/* Chansons & histoires de Sicile — mini-liste, tout en bas */}
      {show('chansons') && (
      <section id="chansons" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.4rem,2.6vw,1.9rem)] uppercase leading-[1.05] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-line)' }}
        >
          {cf.songs}
        </Reveal>
        <Reveal as="p" className="mt-2 max-w-[60ch] text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
          {c.artistsIntro}
        </Reveal>

        <Reveal as="ul" className="mt-6 max-w-[70rem]">
          {ARTISTS.map((a) => (
            <li key={a.id}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cava-songrow group flex items-baseline gap-3 border-b py-3.5"
                style={{ borderColor: 'var(--cava-line)' }}
              >
                <span aria-hidden className="shrink-0 self-center" style={{ color: 'var(--cava-pink)' }}>
                  <Icon name="vinyl" size={15} />
                </span>
                {/* Le nom se tronque plutôt que de pousser la ligne : tout en
                    shrink-0, « Colapesce Dimartino · SOLARINO & PALERMO »
                    debordait l'ecran sur telephone. */}
                <span className="min-w-0 truncate text-[15px]" style={{ fontWeight: 600 }}>
                  {a.name}
                </span>
                <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.14em] sm:inline" style={{ color: 'var(--cava-muted)' }}>
                  {a.from}
                </span>
                <span
                  className="hidden flex-1 truncate text-[13px] md:block"
                  style={{ color: 'var(--cava-muted)' }}
                >
                  {a.blurb[lang]}
                </span>
                <span
                  className="cava-songrow-cta ml-auto shrink-0 self-center md:ml-0"
                  style={{ color: 'var(--cava-pink)' }}
                >
                  <Icon name="spotify" size={17} />
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </section>
      )}

      <Reveal className="mx-auto max-w-[110rem] px-5 pb-8 pt-10 text-[14px] italic md:px-10" style={{ color: 'var(--cava-muted)' }}>
        {c.note}
      </Reveal>

      {/* Plus de cale ici : la note portait deja pb-24, et l'ancienne cale en
          ajoutait 96 autres — 192 px de vide avant le pied de page. */}


      {/* Le quiz ferme la page, HORS des filtres : on joue apres avoir lu, et

          un bouton de tri ne doit pas le faire disparaitre. */}

      <Quiz />


      <Footer />
    </main>
    </RevealNow.Provider>
  );
}
