'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import LocalMap from '../LocalMap';
import { useI18n } from '../i18n';
import { LOCAL_PLACES, CATS, type CatKey } from '../localData';

export default function NosAdresses() {
  const { t, lang } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;

  const [filter, setFilter] = useState<'tout' | 'responsable' | CatKey>('tout');
  const [query, setQuery] = useState('');

  // Catégories affichées comme filtres (certaines encore vides → « à venir »).
  const FILTER_CATS: CatKey[] = ['chocolat', 'huile', 'marche', 'plantes', 'resto', 'courses', 'plage'];
  const filters: { key: 'tout' | 'responsable' | CatKey; label: string }[] = [
    { key: 'tout', label: p.filterAll },
    { key: 'responsable', label: p.badge },
    ...FILTER_CATS.map((k) => ({ key: k, label: CATS[k].label[lang] })),
  ];

  const q = query.trim().toLowerCase();
  const places = LOCAL_PLACES.filter((l) => {
    const byCat = filter === 'tout' ? true : filter === 'responsable' ? l.responsible : l.cat === filter;
    if (!byCat) return false;
    if (!q) return true;
    const hay = `${l.name} ${l.town} ${CATS[l.cat].label[lang]} ${l.blurb[lang]}`.toLowerCase();
    return hay.includes(q);
  });

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
      </section>

      {/* Filtres + grille de fiches */}
      <section className="mx-auto max-w-[110rem] px-5 pt-10 md:px-10">
        {/* Recherche manuelle par mots ou envie */}
        <Reveal className="mb-5">
          <label
            className="flex items-center gap-3 rounded-full border px-5 py-3 md:max-w-md"
            style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
          >
            <span style={{ color: 'var(--cava-muted)' }}>
              <Icon name="search" size={18} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={p.searchPlaceholder}
              className="w-full bg-transparent text-[15px] outline-none"
              style={{ color: 'var(--cava-ink)' }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="×"
                className="shrink-0 text-[18px] leading-none"
                style={{ color: 'var(--cava-muted)' }}
              >
                ×
              </button>
            )}
          </label>
        </Reveal>

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

        {places.length === 0 && (
          <Reveal
            className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
            style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}
          >
            <Icon name="pin" size={28} />
            <p className="text-[15px] italic">{p.filterEmpty}</p>
          </Reveal>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((pl, i) => {
            return (
              <Reveal key={pl.id} delay={(i % 3) * 70}>
                <div
                  className="cava-listcard group relative flex h-full w-full flex-col gap-3 overflow-hidden rounded-2xl border p-8 md:p-10"
                  style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
                >
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
                      className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                    >
                      <Icon name="pin" size={15} /> {p.mapLabel} <span aria-hidden>↗</span>
                    </a>
                    {pl.instagram && (
                      <a
                        href={pl.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
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
