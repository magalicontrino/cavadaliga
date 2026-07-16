'use client';

import { useEffect, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon, { type IconName } from '../Icon';
import LocalMap from '../LocalMap';
import { PAGE_ICONS } from '../data';
import { useI18n } from '../i18n';

const CAT_ICONS: IconName[] = ['cone', 'droplet', 'citrus', 'leaf'];
const BLOCK_ICONS: IconName[] = PAGE_ICONS['services-locaux'];
const BLOCK_TAGS = ['manger', 'courses', 'plage'];
const MAP_QUERY = 'Cava d’Aliga, Scicli';

type Spot = { label: string; url: string; instagram?: string };
type Card = {
  title: string;
  desc?: string;
  icon: IconName;
  responsible: boolean;
  tag: string;
  spots?: Spot[];
  items?: string[];
  wide?: boolean;
};

// Sépare « Nom — détail » pour la pop-up.
function splitLabel(label: string) {
  const i = label.indexOf(' — ');
  return i === -1 ? { name: label, detail: '' } : { name: label.slice(0, i), detail: label.slice(i + 3) };
}

export default function NosAdresses() {
  const { t } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

  const [filter, setFilter] = useState('tout');
  const [openSpot, setOpenSpot] = useState<Spot | null>(null);

  // Fermeture de la pop-up : Échap + blocage du scroll.
  useEffect(() => {
    if (!openSpot) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenSpot(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openSpot]);

  // Toutes les cartes réunies (producteurs + marchés + rubriques thématiques).
  const cards: Card[] = [
    ...p.categories.map((c, i) => ({
      title: c.title,
      desc: c.desc,
      icon: CAT_ICONS[i] ?? 'bag',
      responsible: true,
      tag: 'responsable',
      spots: c.spots,
    })),
    {
      title: p.markets.title,
      desc: p.markets.desc,
      icon: 'bag' as IconName,
      responsible: true,
      tag: 'responsable',
      spots: p.markets.list,
      wide: true,
    },
    ...(s.blocks ?? []).map((b, i) => ({
      title: b.title,
      icon: BLOCK_ICONS[i] ?? 'info',
      responsible: false,
      tag: BLOCK_TAGS[i] ?? 'autre',
      items: b.items,
    })),
  ];

  const filters = [
    { key: 'tout', label: p.filterAll },
    { key: 'responsable', label: p.badge },
    ...(s.blocks ?? []).map((b, i) => ({ key: BLOCK_TAGS[i], label: b.title })),
  ];

  const shown = cards.filter((c) => filter === 'tout' || c.tag === filter);

  return (
    <main>
      <Nav current="/services-locaux" />

      <PageHeader title={s.title} intro={s.intro} />

      {/* Carte illustrée */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <Reveal>
          <LocalMap houseLabel={t.regionHere} />
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

      {/* Filtres */}
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

        {/* Cartes */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c, i) => (
            <Reveal
              key={c.title}
              delay={(i % 3) * 70}
              className={`flex flex-col gap-4 rounded-2xl border p-8 md:p-10 ${c.wide ? 'sm:col-span-2 lg:col-span-2' : ''}`}
              style={{ background: 'var(--cava-bg)', borderColor: 'var(--cava-line)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
                >
                  <Icon name={c.icon} size={24} />
                </span>
                {c.responsible && (
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
                    style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
                  >
                    <Icon name="leaf" size={13} /> {p.badge}
                  </span>
                )}
              </div>
              <h2 className="text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.1]" style={{ fontWeight: 600 }}>
                {c.title}
              </h2>
              {c.desc && (
                <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                  {c.desc}
                </p>
              )}

              {/* Lieux cliquables → pop-up */}
              {c.spots && c.spots.length > 0 && (
                <ul className={`mt-1 grid gap-x-8 gap-y-3 ${c.wide ? 'sm:grid-cols-2' : ''}`}>
                  {c.spots.map((sp) => (
                    <li key={sp.url}>
                      <button
                        type="button"
                        onClick={() => setOpenSpot(sp)}
                        className="cava-navlink inline-flex items-start gap-2 text-left text-[15px] leading-[1.4]"
                      >
                        <span className="mt-0.5 shrink-0" style={{ color: 'var(--cava-pink)' }}>
                          <Icon name="pin" size={16} />
                        </span>
                        <span>{sp.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Rubriques thématiques : puces de texte */}
              {c.items && c.items.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                      <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal
        className="mx-auto max-w-[110rem] px-5 pb-24 pt-8 text-[14px] italic md:px-10"
        style={{ color: 'var(--cava-muted)' }}
      >
        {p.note}
      </Reveal>

      {/* Pop-up d'un lieu */}
      {openSpot && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenSpot(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: 'rgba(24,23,23,0.6)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl p-8 md:p-10"
            style={{ background: 'var(--cava-bg)' }}
          >
            <button
              type="button"
              onClick={() => setOpenSpot(null)}
              aria-label="Fermer"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[16px] ring-1 ring-black/15 transition hover:bg-black/5"
            >
              ✕
            </button>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
              style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
            >
              <Icon name="pin" size={13} /> Sicilia
            </span>
            <h3 className="mt-4 text-[clamp(1.4rem,3vw,2rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
              {splitLabel(openSpot.label).name}
            </h3>
            {splitLabel(openSpot.label).detail && (
              <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {splitLabel(openSpot.label).detail}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={openSpot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cava-pill inline-flex items-center gap-2 px-5 py-2.5 text-[14px]"
              >
                <Icon name="pin" size={16} /> {p.mapLabel} <span aria-hidden>↗</span>
              </a>
              {openSpot.instagram && (
                <a
                  href={openSpot.instagram}
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
      )}

      <Footer />
    </main>
  );
}
