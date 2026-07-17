'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import { useState } from 'react';
import Reveal, { RevealNow } from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import FilterChip from '../FilterChip';
import { withBase } from '../data';
import { useI18n } from '../i18n';
import { ARTISTS, ARTS, SCULPTURES, PHOTOS, SCREENS, SPOTIFY_EMBED_HEIGHT, SPOTIFY_EMBED_URL, SPOTIFY_PLAYLIST_URL, MUNARI_BOOK, MUNARI_DESIGN_BOOK, MUNARI_WIKI, DE_JORIO_WIKI, type Screen } from '../cultureData';
import { type IconName } from '../Icon';
import { type Lang } from '../localData';

/** Grille de fiches « œuvre » — sert pour les écrans et pour la peinture. */
function WorkGrid({
  title,
  intro,
  items,
  icon,
  lang,
  more,
}: {
  title: string;
  intro: string;
  items: Screen[];
  icon: IconName;
  lang: Lang;
  more: string;
}) {
  return (
    <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
      <Reveal
        as="h2"
        className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
        style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
      >
        {title}
      </Reveal>
      <Reveal as="p" className="mt-4 max-w-[60ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
        {intro}
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {items.map((sc, i) => (
          <Reveal key={sc.id} delay={(i % 2) * 70}>
            <div
              className="cava-listcard flex h-full flex-col gap-3 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
                >
                  <Icon name={icon} size={24} />
                </span>
                <span
                  className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
                  style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
                >
                  {sc.kind[lang]}
                </span>
              </div>
              <h3 className="mt-1 text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.12]" style={{ fontWeight: 600 }}>
                {sc.title}
              </h3>
              <p className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                {sc.year}
              </p>
              <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {sc.blurb[lang]}
              </p>

              <div className="mt-auto flex flex-wrap gap-3 pt-3">
                {sc.placeUrl && sc.placeLabel && (
                  <a
                    href={sc.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                  >
                    <Icon name="pin" size={15} /> {sc.placeLabel} <span aria-hidden>↗</span>
                  </a>
                )}
                <a
                  href={sc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                >
                  <Icon name="info" size={15} /> {more} <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

type Key = 'tout' | 'playlist' | 'ecrans' | 'peinture' | 'sculpture' | 'photo' | 'mains' | 'chansons';

export default function Culture() {
  const { t, lang } = useI18n();
  const c = t.culturePage;
  const cf = t.cultureFilter;

  // On ouvre sur la playlist : le bouton allumé correspond à ce qu'on voit.
  const [filter, setFilter] = useState<Key>('playlist');
  const [clicks, setClicks] = useState(0);
  const choose = (k: Key) => {
    setFilter(k);
    setClicks((n) => n + 1);
  };
  const show = (k: Key) => filter === 'tout' || filter === k;

  // Les sections d'abord ; « Tout voir » ferme la ligne, en retrait.
  const filters: { key: Key; label: string; icon: IconName }[] = [
    { key: 'playlist', label: cf.playlist, icon: 'spotify' },
    { key: 'ecrans', label: cf.screens, icon: 'film' },
    { key: 'peinture', label: cf.painting, icon: 'brush' },
    { key: 'sculpture', label: cf.sculpture, icon: 'landmark' },
    { key: 'photo', label: cf.photo, icon: 'camera' },
    { key: 'mains', label: cf.hands, icon: 'compass' },
    { key: 'chansons', label: cf.songs, icon: 'vinyl' },
  ];

  return (
    <RevealNow.Provider value={clicks}>
    <main>
      <Nav current="/culture" />

      <PageHeader title={c.title} intro={c.intro} />

      {/* Le tri : six sections, on choisit */}
      <section className="mx-auto max-w-[110rem] px-5 pt-4 md:px-10">
        <Reveal className="cava-swipe -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10">
          {filters.map((x) => (
            <FilterChip key={x.key} label={x.label} icon={x.icon} active={filter === x.key} onClick={() => choose(x.key)} />
          ))}
          <FilterChip label={cf.all} icon="map" active={filter === 'tout'} onClick={() => choose('tout')} subtle />
        </Reveal>
      </section>

      {/* La playlist partagée — bloc clair, lecteur compact.
          Le lecteur Spotify est sombre par nature (pas de thème clair chez eux) :
          on l'entoure de clair et on le garde bas pour ne pas noircir la page. */}
      {show('playlist') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-12 md:px-10">
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
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
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
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
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

      <Reveal className="mx-auto max-w-[110rem] px-5 pb-24 pt-10 text-[14px] italic md:px-10" style={{ color: 'var(--cava-muted)' }}>
        {c.note}
      </Reveal>

      <Footer />
    </main>
    </RevealNow.Provider>
  );
}
