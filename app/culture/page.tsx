'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import { useI18n } from '../i18n';
import { ARTISTS, SCREENS, SPOTIFY_PLAYLIST_URL } from '../cultureData';

export default function Culture() {
  const { t, lang } = useI18n();
  const c = t.culturePage;

  return (
    <main>
      <Nav current="/culture" />

      <PageHeader title={c.title} intro={c.intro} />

      {/* La playlist partagée */}
      <section className="mx-auto max-w-[110rem] px-5 pt-8 md:px-10">
        <Reveal
          className="relative flex flex-col gap-6 overflow-hidden rounded-3xl p-10 md:flex-row md:items-center md:justify-between md:p-16"
          style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}
        >
          {/* Vinyle décoratif */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 opacity-[0.12] md:-right-6 md:top-1/2 md:-translate-y-1/2"
            style={{ color: 'var(--cava-pink)' }}
          >
            <Icon name="vinyl" size={260} />
          </span>

          <div className="relative max-w-[52ch]">
            <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em]" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="vinyl" size={16} /> {c.eyebrow}
            </span>
            <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
              {c.playlistTitle}
            </h2>
            <p className="mt-5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7]" style={{ color: 'rgba(247,245,242,0.72)' }}>
              {c.playlistDesc}
            </p>
          </div>

          <div className="relative shrink-0">
            {SPOTIFY_PLAYLIST_URL ? (
              <a
                href={SPOTIFY_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full px-7 py-4 text-[15px] transition hover:opacity-85"
                style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
              >
                <Icon name="spotify" size={22} /> {c.playlistCta} <span aria-hidden>↗</span>
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-3 rounded-full border border-dashed px-7 py-4 text-[15px] italic"
                style={{ borderColor: 'rgba(247,245,242,0.35)', color: 'rgba(247,245,242,0.6)' }}
              >
                <Icon name="spotify" size={22} /> {c.playlistSoon}
              </span>
            )}
          </div>
        </Reveal>
      </section>

      {/* À écouter — voix siciliennes */}
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
        >
          {c.artistsTitle}
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-[60ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {c.artistsIntro}
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTISTS.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 70}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cava-listcard group flex h-full flex-col gap-3 rounded-2xl border p-8"
                style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
                >
                  <Icon name="vinyl" size={24} />
                </span>
                <h3 className="mt-1 text-[clamp(1.2rem,2.4vw,1.5rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                  {a.name}
                </h3>
                <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-muted)' }}>
                  {a.from}
                </p>
                <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                  {a.blurb[lang]}
                </p>
                <span className="cava-pill mt-auto inline-flex w-fit items-center gap-2 px-4 py-2 pt-2 text-[13px]">
                  <Icon name="spotify" size={15} /> Spotify <span aria-hidden>↗</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* À l'écran — films & séries tournés ici */}
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
        >
          {c.screensTitle}
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-[60ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {c.screensIntro}
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {SCREENS.map((sc, i) => (
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
                    <Icon name="film" size={24} />
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
                    <Icon name="info" size={15} /> {c.moreLabel} <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="mx-auto max-w-[110rem] px-5 pb-24 pt-10 text-[14px] italic md:px-10" style={{ color: 'var(--cava-muted)' }}>
        {c.note}
      </Reveal>

      <Footer />
    </main>
  );
}
