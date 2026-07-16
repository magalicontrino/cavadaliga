'use client';

import { useEffect, useRef, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon, { type IconName } from '../Icon';
import LocalMap, { type MapSpot } from '../LocalMap';
import MapViewport, { type MapFocus } from '../MapViewport';
import { useI18n } from '../i18n';
import { LOCAL_PLACES, CATS, SEARCH_WORDS, norm, type CatKey } from '../localData';

export default function NosAdresses() {
  const { t, lang } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;

  const [filter, setFilter] = useState<'tout' | 'responsable' | CatKey>('tout');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [hover, setHover] = useState<{ spot: MapSpot; left: number; top: number } | null>(null);
  const mapRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Catégories affichées comme filtres (certaines encore vides → « à venir »).
  const FILTER_CATS: CatKey[] = ['chocolat', 'huile', 'marche', 'plantes', 'resto', 'supermarche', 'plage'];
  const filters: { key: 'tout' | 'responsable' | CatKey; label: string; icon: IconName }[] = [
    { key: 'tout', label: p.filterAll, icon: 'map' },
    { key: 'responsable', label: p.badge, icon: 'leaf' },
    ...FILTER_CATS.map((k) => ({ key: k, label: CATS[k].label[lang], icon: CATS[k].icon })),
  ];

  const q = norm(query.trim());
  const inCat = (l: (typeof LOCAL_PLACES)[number]) =>
    filter === 'tout' ? true : filter === 'responsable' ? l.responsible : l.cat === filter;

  const places = LOCAL_PLACES.filter((l) => {
    if (!inCat(l)) return false;
    if (!q) return true;
    return norm(`${l.name} ${l.town} ${CATS[l.cat].label[lang]} ${l.blurb[lang]}`).includes(q);
  });

  // Rien trouvé littéralement ? On passe par la base de mots (« pain »,
  // « apéro », « glace »…) pour proposer quand même une piste. Et si le mot
  // est inconnu, on montre les adresses les plus proches de la maison :
  // une recherche ne doit jamais finir sur du vide.
  const suggestions = (() => {
    if (!q || places.length > 0) return [];
    const hits = SEARCH_WORDS.filter((h) => h.words.some((w) => norm(w).includes(q) || q.includes(norm(w))));
    const ids = new Set(hits.flatMap((h) => h.ids ?? []));
    const cats = new Set(hits.map((h) => h.cat).filter(Boolean));
    const byWord = LOCAL_PLACES.filter((l) => ids.has(l.id) || cats.has(l.cat));
    if (byWord.length > 0) return byWord.slice(0, 6);
    return [...LOCAL_PLACES].sort((a, b) => a.km - b.km).slice(0, 3);
  })();

  const shown = places.length > 0 ? places : suggestions;

  // Distance depuis la maison — « Sur place » pour les adresses du village.
  const distance = (km: number) => (km === 0 ? t.regionHere : `≈ ${km} km`);

  // Épingles de la carte = les adresses actuellement affichées.
  const spots = shown.map((l) => ({
    id: l.id,
    name: l.name,
    icon: CATS[l.cat].icon,
    x: l.x,
    y: l.y,
    q: `${l.name} ${l.town}`,
    cat: `${l.town} · ${CATS[l.cat].label[lang]}`,
    km: distance(l.km),
  }));

  // Repères de la carte illustrée (viewBox "0 112 1000 548" de LocalMap).
  const VB = { w: 1000, y0: 112, h: 548 };
  const frac = (x: number, y: number) => ({ fx: x / VB.w, fy: (y - VB.y0) / VB.h });

  // Cadre l'ensemble des épingles affichées : zoom qui les fait toutes tenir,
  // centré sur leur milieu. Une seule épingle → on serre dessus.
  const fitSpots = (): MapFocus | null => {
    if (spots.length === 0) return null;
    const xs = spots.map((s) => s.x);
    const ys = spots.map((s) => s.y);
    const [x1, x2, y1, y2] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const c = frac((x1 + x2) / 2, (y1 + y2) / 2);
    const pad = 140; // marge autour du groupe, en unités de la carte
    const s = spots.length === 1 ? 2.6 : Math.min(VB.w / (x2 - x1 + pad), VB.h / (y2 - y1 + pad));
    return { ...c, scale: Math.min(3, Math.max(1, s)), key: `f-${filter}-${q}` };
  };

  // Clic sur une fiche : épingle en évidence, carte recentrée dessus.
  const showOnMap = (id: string) => {
    const next = active === id ? null : id;
    setActive(next);
    if (!next) return;
    const s = spots.find((sp) => sp.id === id);
    if (s) setFocus({ ...frac(s.x, s.y), scale: 2.6, key: `a-${id}-${Date.now()}` });
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Changement de filtre ou de recherche → on recadre sur les lieux concernés.
  useEffect(() => {
    setFocus(fitSpots());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, q]);

  return (
    <main>
      <Nav current="/services-locaux" />

      <PageHeader title={s.title} intro={s.intro} />

      {/* Carte illustrée — les épingles suivent le filtre et la recherche */}
      <section ref={mapRef} className="mx-auto max-w-[110rem] scroll-mt-24 px-5 md:px-10">
        <Reveal className="relative">
          <div ref={wrapRef} className="relative">
            <MapViewport labels={{ zoomIn: p.zoomIn, zoomOut: p.zoomOut, reset: p.zoomReset }} focus={focus}>
              <LocalMap
                houseLabel={t.regionHere}
                spots={spots}
                activeId={active}
                spotsKey={filter}
                legend={{ villages: p.legendVillages, spots: p.legendSpots }}
                onHover={(spot, rect) => {
                  const wrap = wrapRef.current;
                  if (!spot || !rect || !wrap) return setHover(null);
                  const w = wrap.getBoundingClientRect();
                  setHover({
                    spot,
                    left: Math.min(Math.max(rect.left - w.left + rect.width / 2, 90), w.width - 90),
                    top: rect.top - w.top,
                  });
                }}
              />
            </MapViewport>

            {/* Mini-carte au survol — en HTML au-dessus de la carte : ni rognée
                par la fenêtre de zoom, ni agrandie avec l'échelle. */}
            {hover && (
              <div
                className="cava-maptip pointer-events-none absolute z-10 max-w-[16rem] -translate-x-1/2 -translate-y-full rounded-xl border px-3.5 py-2.5"
                style={{
                  left: hover.left,
                  top: hover.top - 10,
                  background: 'var(--cava-bg)',
                  borderColor: 'var(--cava-ink)',
                }}
              >
                <p className="whitespace-nowrap text-[13.5px] leading-tight" style={{ fontWeight: 700 }}>
                  {hover.spot.name}
                </p>
                <p className="mt-1 whitespace-nowrap text-[11.5px] leading-tight" style={{ color: 'var(--cava-muted)' }}>
                  {hover.spot.cat} · {hover.spot.km}
                </p>
              </div>
            )}
          </div>
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
                onClick={() => {
                  setFilter(f.key);
                  setActive(null);
                }}
                aria-pressed={on}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition"
                style={{
                  borderColor: on ? 'var(--cava-ink)' : 'var(--cava-line)',
                  background: on ? 'var(--cava-ink)' : 'transparent',
                  color: on ? 'var(--cava-bg)' : 'var(--cava-ink)',
                  fontWeight: on ? 600 : 400,
                }}
              >
                <Icon
                  name={f.icon}
                  size={15}
                  className={f.key === 'responsable' && !on ? 'cava-leafpink' : undefined}
                />
                {f.label}
              </button>
            );
          })}
        </Reveal>

        {/* Recherche sans résultat direct → on annonce qu'on propose autre chose. */}
        {q && places.length === 0 && shown.length > 0 && (
          <Reveal
            className="mt-8 flex items-start gap-3 rounded-2xl px-6 py-4"
            style={{ background: 'rgba(230,41,111,0.07)', color: 'var(--cava-ink)' }}
          >
            <span className="mt-[2px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="search" size={17} />
            </span>
            <p className="text-[14.5px] leading-[1.6]">
              {p.suggestFor.replace('{q}', query.trim())}
            </p>
          </Reveal>
        )}

        {/* Filtre de catégorie encore vide (hors recherche) */}
        {!q && places.length === 0 && (
          <Reveal
            className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
            style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}
          >
            <Icon name="pin" size={28} />
            <p className="text-[15px] italic">{p.filterEmpty}</p>
          </Reveal>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((pl, i) => {
            const isActive = active === pl.id;
            return (
              <Reveal key={pl.id} delay={(i % 3) * 70}>
                <div
                  onClick={() => showOnMap(pl.id)}
                  className="cava-listcard group relative flex h-full w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border p-8 md:p-10"
                  style={{
                    borderColor: isActive ? 'var(--cava-pink)' : 'var(--cava-line)',
                    boxShadow: isActive ? '0 0 0 1px var(--cava-pink)' : undefined,
                    background: 'var(--cava-bg)',
                  }}
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
                  {/* Distance depuis la maison */}
                  <p className="relative inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                    <Icon name="home" size={14} /> {distance(pl.km)}
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
