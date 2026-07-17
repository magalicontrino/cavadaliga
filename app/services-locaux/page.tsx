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
import { LOCAL_PLACES, CATS, type CatKey } from '../localData';
import { HOUSE, MAX_KM, distanceKm } from '../geo';
import { COORDS } from '../placeCoords';

/** MapLibre pèse ~210 Ko : il n'est chargé que si on ouvre cette page. */
const PlaceMap = dynamic(() => import('../PlaceMap'), { ssr: false });

export default function NosAdresses() {
  const { t, lang } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;

  const [filter, setFilter] = useState<'tout' | 'responsable' | CatKey>('tout');
  // « Et si j'etais la ? » — un point pose sur la carte. Tant qu'il est nul, on
  // compte depuis la maison, par la route, avec les km que Mag a saisis.
  const [depart, setDepart] = useState<{ lat: number; lon: number } | null>(null);
  // Le nom du lieu trouve — « Depart : Palerme » vaut mieux que « Depart ».
  const [departNom, setDepartNom] = useState<string | null>(null);
  const [ou, setOu] = useState('');
  const [cherche, setCherche] = useState<'idle' | 'cours' | 'rien' | 'loin' | 'panne'>('idle');
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
  // « Tout voir » ouvre la ligne, en retrait. Ailleurs il la ferme, mais ici la
  // rangee glisse : le dernier bouton finirait hors champ, et c'est justement
  // l'etat par defaut — celui vers lequel on revient. Il reste discret pour
  // qu'on ne le confonde pas avec une categorie.
  const filters: { key: 'tout' | 'responsable' | CatKey; label: string; icon: IconName }[] = [
    { key: 'responsable', label: p.badge, icon: 'leaf' },
    ...FILTER_CATS.map((k) => ({ key: k, label: CATS[k].label[lang], icon: CATS[k].icon })),
  ];

  const shown = LOCAL_PLACES.filter((l) =>
    filter === 'tout' ? true : filter === 'responsable' ? l.responsible : l.cat === filter,
  );

  /**
   * Le libelle de distance — et son SENS change avec le depart.
   *
   * Depuis la maison : les km de Mag, mesures par la route. Depuis un point
   * pose sur la carte : je ne sais faire que du vol d'oiseau, ce qui donne
   * toujours moins, parfois beaucoup moins dans les Iblei ou les routes
   * tournent. C'est dit en toutes lettres au-dessus de la carte : afficher les
   * deux sous le meme « km » sans prevenir serait mentir.
   */
  const kmLabel = (l: { id: string; km: number }) => {
    // La maison est un cas a part : elle n'est pas dans LOCAL_PLACES, et sa
    // position est le repere de tout le reste.
    const co = l.id === '__maison__' ? HOUSE : COORDS[l.id];
    if (!depart) return l.id === '__maison__' ? p.houseHere : l.km === 0 ? t.regionHere : `≈ ${l.km} km`;
    if (!co) return '—'; // sans position reelle, on n'invente pas une distance
    const d = distanceKm(depart.lat, depart.lon, co.lat, co.lon);
    return d < 0.4 ? t.regionHere : `≈ ${d < 10 ? d.toFixed(1) : Math.round(d)} km`;
  };

  /** Clic sur une fiche : on la met en évidence sur la carte. */
  const showOnMap = (id: string) => {
    setActive(active === id ? null : id);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /**
   * « Vous etes ou ? » — le texte part chez le geocodeur d'OpenStreetMap, qui
   * renvoie un point ; il devient le depart.
   *
   * A l'envoi seulement, jamais a la frappe : leur reglement interdit de s'en
   * servir comme d'une autocompletion, et ce serait une requete par lettre.
   * La recherche est bornee a la Sicile (viewbox + bounded) — sans ca, « Roma »
   * nous emmenerait a l'autre bout du pays, hors de nos tuiles.
   */
  const chercherOu = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = ou.trim();
    if (!q) return;
    setCherche('cours');
    try {
      const r = await fetch(
        'https://nominatim.openstreetmap.org/search?format=json&limit=1&bounded=1' +
          '&viewbox=12.35,38.35,15.72,36.60&q=' +
          encodeURIComponent(q),
      );
      if (!r.ok) throw new Error(String(r.status));
      const d: { lat: string; lon: string; display_name: string }[] = await r.json();
      if (!d.length) return setCherche('rien');
      const lat = parseFloat(d[0].lat);
      const lon = parseFloat(d[0].lon);
      // Ceinture et bretelles : bounded=1 laisse parfois passer un debordement.
      if (lat < 36.6 || lat > 38.35 || lon < 12.35 || lon > 15.72) return setCherche('loin');
      setDepart({ lat, lon });
      setDepartNom(d[0].display_name.split(',').slice(0, 2).join(', '));
      setCherche('idle');
      setClicks((c) => c + 1);
      mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      setCherche('panne');
    }
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
          {/* « Vous etes ou ? » — on se pose par le nom plutot qu'au doigt. */}
          <form onSubmit={chercherOu} className="flex flex-1 items-center gap-3 md:max-w-md">
            <label
              className="flex flex-1 items-center gap-3 rounded-full border px-5 py-3"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <span style={{ color: 'var(--cava-muted)' }}>
                <Icon name="search" size={18} />
              </span>
              <input
                type="search"
                value={ou}
                onChange={(e) => {
                  setOu(e.target.value);
                  if (cherche !== 'idle') setCherche('idle');
                }}
                placeholder={p.wherePlaceholder}
                className="w-full bg-transparent text-[15px] outline-none"
                style={{ color: 'var(--cava-ink)' }}
              />
            </label>
            {ou.trim() && (
              <button
                type="submit"
                disabled={cherche === 'cours'}
                className="shrink-0 rounded-full px-5 py-3 text-[13px] transition hover:opacity-85 disabled:opacity-50"
                style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)', fontWeight: 700 }}
              >
                {cherche === 'cours' ? p.whereSearching : '→'}
              </button>
            )}
          </form>

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
        </Reveal>
      </section>

      {/* La recherche a echoue — on dit pourquoi, et on rappelle qu'il reste le doigt. */}
      {cherche !== 'idle' && cherche !== 'cours' && (
        <section className="mx-auto max-w-[110rem] px-5 pt-3 md:px-10">
          <Reveal
            className="flex items-start gap-3 rounded-2xl px-5 py-3 text-[13.5px] leading-[1.6]"
            style={{ background: 'rgba(230,41,111,0.07)' }}
          >
            <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="search" size={15} />
            </span>
            <p>{cherche === 'rien' ? p.whereNotFound : cherche === 'loin' ? p.whereOut : p.whereError}</p>
          </Reveal>
        </section>
      )}

      {/* L'invitation au geste : un clic sur la carte, ca ne se devine pas. */}
      {!depart && vue === 'carte' && (
        <section className="mx-auto max-w-[110rem] px-5 pt-3 md:px-10">
          <Reveal className="flex items-center gap-2.5 text-[13px] italic" style={{ color: 'var(--cava-muted)' }}>
            <span className="shrink-0" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="pin" size={14} />
            </span>
            {p.departHint}
          </Reveal>
        </section>
      )}

      {/* Le depart simule — on dit d'ou l'on compte ET comment, sinon les
          « km » voudraient dire deux choses sans prevenir. */}
      {depart && (
        <section className="mx-auto max-w-[110rem] px-5 pt-3 md:px-10">
          <Reveal
            className="flex items-start gap-3 rounded-2xl px-5 py-3 text-[13.5px] leading-[1.6]"
            style={{ background: 'rgba(46,45,45,0.06)' }}
          >
            <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-ink)' }}>
              <Icon name="pin" size={15} />
            </span>
            <p className="flex-1">
              {departNom && <strong style={{ color: 'var(--cava-ink)' }}>{departNom} — </strong>}
              {p.departOn}
            </p>
            <button
              type="button"
              onClick={() => {
                setDepart(null);
                setDepartNom(null);
                setOu('');
                setClicks((c) => c + 1);
              }}
              className="cava-pill shrink-0 px-4 py-1.5 text-[12.5px]"
            >
              {p.departReset}
            </button>
          </Reveal>
        </section>
      )}

      {/* La carte — les épingles suivent le filtre.
          Ni légende ni mini-carte de survol : chaque pastille porte déjà sa
          distance, et les villages sont écrits sur la carte. */}
      <section ref={mapRef} className={`mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-3 md:px-10 ${vue === 'carte' ? '' : 'hidden'}`}>
        <Reveal>
          <PlaceMap
            places={shown}
            lang={lang}
            labels={{ map: p.mapLabel, badge: p.badge, here: t.regionHere, close: p.closeLabel, mapFailed: p.mapFailed, mapFailedHint: p.mapFailedHint }}
            choisi={shown.find((l) => l.id === active) ?? null}
            onChoisir={(l) => setActive(l?.id ?? null)}
            me={me}
            visible={vue === 'carte'}
            onLocate={locate}
            geoAsking={geo === 'asking'}
            locateLabel={geo === 'asking' ? p.locating : p.locateMe}
            onDepart={(c) => {
              setDepart(c);
              setDepartNom(null);
              setCherche('idle');
            }}
            depart={depart}
            kmLabel={kmLabel}
          />
        </Reveal>
      </section>

      {/* La liste des adresses. Meme marge haute que la carte : les deux vues
          suivent les memes boutons, elles doivent commencer au meme endroit. */}
      <section className={`mx-auto max-w-[110rem] px-5 pt-3 md:px-10 ${vue === 'liste' ? '' : 'hidden'}`}>
        {/* Une categorie encore sans adresse */}
        {shown.length === 0 && (
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
        <div className="cava-swipe -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
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
                    <Icon name="home" size={14} /> {kmLabel(pl)}
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
