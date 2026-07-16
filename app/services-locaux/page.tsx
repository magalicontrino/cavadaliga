'use client';

import { useEffect, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import LocalMap from '../LocalMap';
import { InfoBlocks } from '../SectionShell';
import { PAGE_ICONS } from '../data';
import { useI18n } from '../i18n';
import { LOCAL_PLACES, CATS, type LocalPlace, type CatKey } from '../localData';

const MAP_QUERY = 'Cava d’Aliga, Scicli';

export default function NosAdresses() {
  const { t, lang } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

  const [filter, setFilter] = useState<'tout' | 'responsable' | CatKey>('tout');
  const [open, setOpen] = useState<LocalPlace | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

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

  const embed = (pl: LocalPlace) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(`${pl.name} ${pl.town}`)}&z=13&output=embed`;

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
          {places.map((pl, i) => (
            <Reveal key={pl.id} delay={(i % 3) * 70}>
              <button
                type="button"
                onClick={() => setOpen(pl)}
                className="cava-listcard group flex h-full w-full flex-col gap-3 rounded-2xl border p-8 text-left md:p-10"
                style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
              >
                <div className="flex items-start justify-between gap-3">
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
                <div className="mt-1 flex items-start justify-between gap-2">
                  <h2 className="text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                    {pl.name}
                  </h2>
                  <span className="cava-listcard-arrow mt-0.5 shrink-0 text-[15px]" aria-hidden>
                    ↗
                  </span>
                </div>
                <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-muted)' }}>
                  {pl.town} · {CATS[pl.cat].label[lang]}
                </p>
                <p className="line-clamp-2 text-[14px] leading-[1.55]" style={{ color: 'var(--cava-muted)' }}>
                  {pl.blurb[lang]}
                </p>
              </button>
            </Reveal>
          ))}
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

      {/* Fiche détaillée (annonce) */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 py-8 md:items-center"
          style={{ background: 'rgba(24,23,23,0.6)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl"
            style={{ background: 'var(--cava-bg)' }}
          >
            {/* En-tête visuel */}
            <div className="relative aspect-[16/7] w-full" style={{ background: CATS[open.cat].bg }}>
              <span className="absolute inset-0 flex items-center justify-center text-white/25">
                <Icon name={CATS[open.cat].icon} size={96} />
              </span>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Fermer"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[17px] text-white ring-1 ring-white/40 transition hover:bg-white/15"
              >
                ✕
              </button>
              {open.responsible && (
                <span
                  className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
                  style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--cava-pink)', fontWeight: 700 }}
                >
                  <Icon name="leaf" size={13} /> {p.badge}
                </span>
              )}
            </div>

            <div className="p-8 md:p-10">
              <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)' }}>
                {CATS[open.cat].label[lang]} · {open.town}
              </p>
              <h3 className="mt-2 text-[clamp(1.5rem,4vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 600 }}>
                {open.name}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.65]" style={{ color: 'var(--cava-muted)' }}>
                {open.blurb[lang]}
              </p>

              {/* Mini-carte du lieu */}
              <div className="mt-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--cava-line)' }}>
                <iframe
                  title={`Carte — ${open.name}`}
                  src={embed(open)}
                  className="block h-[220px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={open.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-pill inline-flex items-center gap-2 px-5 py-2.5 text-[14px]"
                >
                  <Icon name="pin" size={16} /> {p.mapLabel} <span aria-hidden>↗</span>
                </a>
                {open.instagram && (
                  <a
                    href={open.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cava-pill inline-flex items-center gap-2 px-5 py-2.5 text-[14px]"
                  >
                    <Icon name="instagram" size={16} /> Instagram <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
