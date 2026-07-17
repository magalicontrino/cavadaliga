'use client';

import { useEffect, useRef, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal, { RevealNow } from '../Reveal';
import PageHeader from '../PageHeader';
import Icon, { type IconName } from '../Icon';
import FilterChip from '../FilterChip';
import dynamic from 'next/dynamic';
import { useI18n } from '../i18n';
import { LOCAL_PLACES, CATS, SEARCH_WORDS, norm, type CatKey } from '../localData';
import { HOUSE, MAX_KM, distanceKm } from '../geo';

/** MapLibre pèse ~210 Ko : il n'est chargé que si on ouvre cette page. */
const PlaceMap = dynamic(() => import('../PlaceMap'), { ssr: false });

export default function NosAdresses() {
  const { t, lang } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;

  const [filter, setFilter] = useState<'tout' | 'responsable' | CatKey>('tout');
  const [query, setQuery] = useState('');
  // Incrementé à chaque tri ou recherche : les fiches se montrent d'un coup.
  const [clicks, setClicks] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  // Carte ou liste : les deux disent la même chose autrement. La carte répond à
  // « c'est où ? », la liste à « qu'est-ce qu'il y a ? ». On choisit.
  const [vue, setVue] = useState<'carte' | 'liste'>('carte');
  // La vraie position du visiteur, s'il l'a demandée — plus besoin de la faire
  // correspondre à un dessin.
  const [me, setMe] = useState<{ lat: number; lon: number } | null>(null);
  const [geo, setGeo] = useState<'idle' | 'asking' | 'ok' | 'far' | 'error'>('idle');
  const mapRef = useRef<HTMLElement>(null);

  // Catégories affichées comme filtres (certaines encore vides → « à venir »).
  const FILTER_CATS: CatKey[] = ['chocolat', 'huile', 'marche', 'plantes', 'resto', 'supermarche', 'plage'];
  // Les categories d'abord ; « Tout voir » ferme la ligne, en retrait — comme
  // sur les autres pages a tri. Ici il reste l'etat par defaut : contrairement a
  // La region, il ne fait doublon avec aucune categorie (19 adresses vs 7).
  const filters: { key: 'tout' | 'responsable' | CatKey; label: string; icon: IconName }[] = [
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

  /** Clic sur une fiche : on la met en évidence sur la carte. */
  const showOnMap = (id: string) => {
    setActive(active === id ? null : id);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // « Où suis-je ? » — sur demande seulement : on ne réclame jamais la position
  // sans que le visiteur l'ait cliqué.
  const locate = () => {
    if (!navigator.geolocation) return setGeo('error');
    setGeo('asking');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        // Trop loin, la carte ne couvre plus : le dire plutôt que de poser un
        // point hors du cadre.
        if (distanceKm(coords.latitude, coords.longitude, HOUSE.lat, HOUSE.lon) > MAX_KM) {
          setMe(null);
          return setGeo('far');
        }
        setMe({ lat: coords.latitude, lon: coords.longitude });
        setGeo('ok');
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      () => setGeo('error'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <RevealNow.Provider value={clicks}>
    <main>
      <Nav current="/services-locaux" />

      <PageHeader title={s.title} />

      {/* Le menu avant la carte : on trie, on cherche, et la carte repond.
          En dessous, on choisissait a l'aveugle ce qu'on ne voyait plus. */}
      <section className="mx-auto max-w-[110rem] px-5 pt-4 md:px-10">
        {/* Recherche manuelle par mots ou envie + « Où suis-je ? » */}
        <Reveal className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
          <label
            className="flex flex-1 items-center gap-3 rounded-full border px-5 py-3 md:max-w-md"
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

          <button
            type="button"
            onClick={locate}
            disabled={geo === 'asking'}
            className="cava-pill inline-flex w-fit shrink-0 items-center gap-2 px-5 py-3 text-[13px] disabled:opacity-50"
          >
            <Icon name="target" size={16} /> {geo === 'asking' ? p.locating : p.locateMe}
          </button>

          {/* Carte ou liste — à côté du tri, c'est le même geste : choisir ce
              qu'on regarde. */}
          <div
            className="inline-flex w-fit shrink-0 rounded-full border p-1 md:ml-auto"
            style={{ borderColor: 'var(--cava-line)' }}
            role="group"
          >
            {(['carte', 'liste'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setVue(v);
                  // Comme pour les filtres : ce qui répond à un clic doit être
                  // là tout de suite, pas attendre d'être vu pour apparaître.
                  setClicks((c) => c + 1);
                }}
                aria-pressed={vue === v}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition"
                style={{
                  background: vue === v ? 'var(--cava-ink)' : 'transparent',
                  color: vue === v ? 'var(--cava-bg)' : 'var(--cava-muted)',
                  fontWeight: vue === v ? 700 : 500,
                }}
              >
                <Icon name={v === 'carte' ? 'map' : 'list'} size={15} />
                {v === 'carte' ? p.viewMap : p.viewList}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Retour de la géolocalisation — jamais silencieux */}
        {(geo === 'far' || geo === 'error' || geo === 'ok') && (
          <Reveal
            className="mb-5 flex items-start gap-3 rounded-2xl px-5 py-3 text-[13.5px] leading-[1.6]"
            style={{ background: 'rgba(230,41,111,0.07)' }}
          >
            <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="target" size={15} />
            </span>
            <p>{geo === 'ok' ? p.locateOk : geo === 'far' ? p.locateFar : p.locateError}</p>
          </Reveal>
        )}

        <Reveal className="cava-swipe -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10">
          {filters.map((f) => {
            const on = filter === f.key;
            return (
              <FilterChip
                key={f.key}
                label={f.label}
                icon={f.icon}
                active={on}
                onClick={() => {
                  setFilter(f.key);
                  setActive(null);
                  setClicks((c) => c + 1);
                }}
              />
            );
          })}
          <FilterChip
            label={p.filterAll}
            icon="map"
            active={filter === 'tout'}
            subtle
            onClick={() => {
              setFilter('tout');
              setActive(null);
              setClicks((c) => c + 1);
            }}
          />
        </Reveal>
      </section>

      {/* La carte — les épingles suivent le filtre et la recherche.
          Ni légende ni mini-carte de survol : chaque pastille porte déjà sa
          distance, et les villages sont écrits sur la carte. */}
      <section ref={mapRef} className={`mx-auto max-w-[110rem] scroll-mt-24 px-5 md:px-10 ${vue === 'carte' ? '' : 'hidden'}`}>
        <Reveal>
          <PlaceMap
            places={shown}
            lang={lang}
            labels={{ map: p.mapLabel, badge: p.badge, here: t.regionHere, close: p.closeLabel }}
            choisi={shown.find((l) => l.id === active) ?? null}
            onChoisir={(l) => setActive(l?.id ?? null)}
            me={me}
            visible={vue === 'carte'}
          />
        </Reveal>
      </section>

      {/* La liste des adresses */}
      <section className={`mx-auto max-w-[110rem] px-5 pt-10 md:px-10 ${vue === 'liste' ? '' : 'hidden'}`}>
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

        {/* Sur téléphone les fiches défilaient en une colonne sans fin : elles
            glissent maintenant du doigt, une par écran. À partir de « sm » on
            retrouve la grille. Tout en CSS — rien à mesurer, rien à hydrater.
            Les marges négatives font toucher les bords de l'écran ; le padding
            qui les compense garde la première fiche alignée sur le texte. */}
        <div className="cava-swipe -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {shown.map((pl, i) => {
            const isActive = active === pl.id;
            return (
              <Reveal key={pl.id} delay={(i % 3) * 70} className="w-[85%] shrink-0 snap-center sm:w-auto sm:shrink">

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
    </RevealNow.Provider>
  );
}
