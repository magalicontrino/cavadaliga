'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import { useI18n } from '../i18n';
import { ARTISTS, ARTS, GESTURES, PHOTOS, SCREENS, SPOTIFY_EMBED_HEIGHT, SPOTIFY_EMBED_URL, SPOTIFY_PLAYLIST_URL, MUNARI_BOOK, MUNARI_WIKI, DE_JORIO_WIKI, type Screen } from '../cultureData';
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
                <a
                  href={sc.placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                >
                  <Icon name="pin" size={15} /> {sc.placeLabel} <span aria-hidden>↗</span>
                </a>
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

export default function Culture() {
  const { t, lang } = useI18n();
  const c = t.culturePage;

  return (
    <main>
      <Nav current="/culture" />

      <PageHeader title={c.title} intro={c.intro} />

      {/* La playlist partagée — bloc clair, lecteur compact.
          Le lecteur Spotify est sombre par nature (pas de thème clair chez eux) :
          on l'entoure de clair et on le garde bas pour ne pas noircir la page. */}
      <section className="mx-auto max-w-[110rem] px-5 pt-8 md:px-10">
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

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[56ch]">
              <span
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--cava-pink)' }}
              >
                <Icon name="vinyl" size={16} /> {c.eyebrow}
              </span>
              <h2 className="mt-2 text-[clamp(1.4rem,2.8vw,2rem)] uppercase leading-[1.05] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
                {c.playlistTitle}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {c.playlistDesc}
              </p>
            </div>

            <div className="shrink-0">
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

          {/* Lecteur compact — écoute directe, sans noircir la page */}
          {SPOTIFY_PLAYLIST_URL && (
            <div className="relative mt-6 overflow-hidden rounded-xl">
              <iframe
                src={SPOTIFY_EMBED_URL}
                title={c.playlistTitle}
                width="100%"
                height={SPOTIFY_EMBED_HEIGHT}
                frameBorder="0"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ border: 0, display: 'block' }}
              />
            </div>
          )}
        </Reveal>
      </section>

      {/* À l'écran — films & séries tournés ici */}
      <WorkGrid title={c.screensTitle} intro={c.screensIntro} items={SCREENS} icon="film" lang={lang} more={c.moreLabel} />

      {/* Peint ici — Guccione & le Gruppo di Scicli */}
      <WorkGrid title={c.artsTitle} intro={c.artsIntro} items={ARTS} icon="brush" lang={lang} more={c.moreLabel} />

      {/* Photographié ici — Giuseppe Leone & Scianna */}
      <WorkGrid title={c.photosTitle} intro={c.photosIntro} items={PHOTOS} icon="target" lang={lang} more={c.moreLabel} />

      {/* Parler avec les mains — Munari et son dictionnaire de gestes */}
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
        >
          {c.handsTitle}
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-[68ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {c.handsIntro}
        </Reveal>

        {/* Qui était Munari + le livre */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div
              className="flex h-full flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name="brush" size={28} />
              </span>
              <h3 className="text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.12]" style={{ fontWeight: 600 }}>
                Bruno Munari
              </h3>
              <p className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                1907 – 1998
              </p>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {c.handsWho}
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-3">
                <a href={MUNARI_WIKI} target="_blank" rel="noopener noreferrer" className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="info" size={15} /> {c.moreLabel} <span aria-hidden>↗</span>
                </a>
                <a href={DE_JORIO_WIKI} target="_blank" rel="noopener noreferrer" className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="info" size={15} /> Andrea de Jorio, 1832 <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div
              className="flex h-full flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-pink)', background: 'rgba(230,41,111,0.05)' }}
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: 'var(--cava-pink)', color: '#fff' }}
              >
                <Icon name="info" size={28} strokeWidth={2} />
              </span>
              <h3 className="text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {c.handsBookTitle}
              </h3>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {c.handsBookDesc}
              </p>
              <a
                href={MUNARI_BOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-[13.5px] transition hover:opacity-85"
                style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
              >
                <Icon name="search" size={15} /> {c.handsBookCta} <span aria-hidden>↗</span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Les gestes, décrits */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2 lg:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {GESTURES.map((g, i) => (
            <Reveal key={g.id} delay={(i % 3) * 60} className="flex flex-col gap-2.5 p-8" style={{ background: 'var(--cava-bg)' }}>
              <p className="text-[clamp(1.1rem,2vw,1.3rem)] leading-[1.2]" style={{ fontWeight: 700 }}>
                {g.name}
              </p>
              <p className="text-[13.5px] leading-[1.6]" style={{ color: 'var(--cava-pink)', fontWeight: 500 }}>
                {g.how[lang]}
              </p>
              <p className="text-[14px] leading-[1.65]" style={{ color: 'var(--cava-muted)' }}>
                {g.means[lang]}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4 flex items-start gap-3 text-[13px] italic leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
          <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="info" size={14} />
          </span>
          <p className="max-w-[70ch]">{c.handsPhotoNote}</p>
        </Reveal>
      </section>

      {/* Chansons & histoires de Sicile — mini-liste, tout en bas */}
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.4rem,2.6vw,1.9rem)] uppercase leading-[1.05] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-line)' }}
        >
          {c.artistsTitle}
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

      <Reveal className="mx-auto max-w-[110rem] px-5 pb-24 pt-10 text-[14px] italic md:px-10" style={{ color: 'var(--cava-muted)' }}>
        {c.note}
      </Reveal>

      <Footer />
    </main>
  );
}
