'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import LocalMap from '../LocalMap';
import { InfoBlocks } from '../SectionShell';
import { PAGE_ICONS } from '../data';
import { useI18n } from '../i18n';
import { LOCAL_PLACES, CATS, type CatKey } from '../localData';

const MAP_QUERY = 'Cava d’Aliga, Scicli';

export default function NosAdresses() {
  const { t, lang } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

  const [filter, setFilter] = useState<'tout' | 'responsable' | CatKey>('tout');
  const [active, setActive] = useState<string | null>(null);

  // Catégories présentes dans la base (pas de filtre vide).
  const presentCats = [...new Set(LOCAL_PLACES.map((l) => l.cat))];
  const filters: { key: 'tout' | 'responsable' | CatKey; label: string }[] = [
    { key: 'tout', label: p.filterAll },
    { key: 'responsable', label: p.badge },
    ...presentCats.map((k) => ({ key: k, label: CATS[k].label[lang] })),
  ];

  const places = LOCAL_PLACES.filter((l) =>
    filter === 'tout' ? true : filter === 'responsable' ? l.responsible : l.cat === filter,
  );

  return (
    <main>
      <Nav current="/services-locaux" />

      <PageHeader title={s.title} intro={s.intro} />

      {/* Carte illustrée (bandeau) */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <Reveal className="relative">
          <LocalMap houseLabel={t.regionHere} />
          {/* Ping d'épingle : rejoue à chaque changement de filtre */}
          <span key={filter} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 block h-0 w-0">
            <span
              className="cava-pinripple absolute left-0 top-0 block h-20 w-20 rounded-full"
              style={{ border: '3px solid var(--cava-pink)' }}
            />
            <span className="cava-pinpop absolute left-0 top-0 block" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="pin" size={60} />
            </span>
          </span>
        </Reveal>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cava-navlink mt-4 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.14em]"
          style={{ color: 'var(--cava-muted)' }}
        >
          <Icon name="pin" size={16} /> {p.mapLabel} <span aria-hidden>↗</span>
        </a>
      </section>

      {/* Filtres + grille de fiches */}
      <section className="mx-auto max-w-[110rem] px-5 pt-10 md:px-10">
        <Reveal className="flex flex-wrap gap-2.5">
          {filters.map((f) => {
            const on = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={on}
                className="rounded-full border px-4 py-2 text-[13px] transition"
                style={{
                  borderColor: on ? 'var(--cava-ink)' : 'var(--cava-line)',
                  background: on ? 'var(--cava-ink)' : 'transparent',
                  color: on ? 'var(--cava-bg)' : 'var(--cava-ink)',
                  fontWeight: on ? 600 : 400,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((pl, i) => {
            const isActive = active === pl.id;
            return (
              <Reveal key={pl.id} delay={(i % 3) * 70}>
                <div
                  onClick={() => setActive(isActive ? null : pl.id)}
                  className="cava-listcard group relative flex h-full w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border p-8 md:p-10"
                  style={{ borderColor: isActive ? 'var(--cava-ink)' : 'var(--cava-line)', background: 'var(--cava-bg)' }}
                >
                  {/* Gros picto au clic */}
                  {isActive && (
                    <span aria-hidden className="cava-bigpicto pointer-events-none absolute -bottom-7 -right-6" style={{ color: 'var(--cava-pink)' }}>
                      <Icon name={CATS[pl.cat].icon} size={150} />
                    </span>
                  )}

                  <div className="relative flex items-start justify-between gap-3">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
                    >
                      <Icon name={CATS[pl.cat].icon} size={24} />
                    </span>
                    {pl.responsible && (
                      <span
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
                        style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
                      >
                        <Icon name="leaf" size={13} /> {p.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="relative mt-1 text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                    {pl.name}
                  </h2>
                  <p className="relative text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-muted)' }}>
                    {pl.town} · {CATS[pl.cat].label[lang]}
                  </p>
                  <p className="relative text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                    {pl.blurb[lang]}
                  </p>

                  {/* Liens dans la card */}
                  <div className="relative mt-auto flex flex-wrap gap-3 pt-3">
                    <a
                      href={pl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                    >
                      <Icon name="pin" size={15} /> {p.mapLabel} <span aria-hidden>↗</span>
                    </a>
                    {pl.instagram && (
                      <a
                        href={pl.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                      >
                        <Icon name="instagram" size={15} /> Instagram <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Bon à savoir — rubriques thématiques (manger, courses, plage) */}
      {s.blocks && (
        <section className="mx-auto max-w-[110rem] px-5 pt-14 md:px-10">
          <InfoBlocks blocks={s.blocks} icons={PAGE_ICONS['services-locaux']} />
        </section>
      )}

      <Reveal
        className="mx-auto max-w-[110rem] px-5 pb-24 pt-10 text-[14px] italic md:px-10"
        style={{ color: 'var(--cava-muted)' }}
      >
        {p.note}
      </Reveal>

      <Footer />
    </main>
  );
}
