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
import { chercherIci, chercherLoin, sansDoublons, dansLEmprise, type Suggestion } from '../ou';

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
  const [ou, setOu] = useState('');
  const [cherche, setCherche] = useState<'idle' | 'cours' | 'rien' | 'loin' | 'panne'>('idle');
  // Change a chaque demande de retour a la maison — la carte n'ecoute que ca.
  const [versMaison, setVersMaison] = useState(0);
  /** Ce que Photon a trouve pour la frappe en cours. Vide au depart : les deux
   *  couches locales repondent seules le temps qu'il reponde. */
  const [loin, setLoin] = useState<Suggestion[]>([]);
  // Incrementé à chaque tri ou recherche : les fiches se montrent d'un coup.
  const [clicks, setClicks] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  // Carte ou liste : les deux disent la même chose autrement. La liste répond à
  // « qu'est-ce qu'il y a ? », la carte à « c'est où ? ». La liste d'abord :
  // c'est la première question, et elle se lit sans viser une épingle.
  const [vue, setVue] = useState<'carte' | 'liste'>('liste');
  // La vraie position du visiteur, s'il l'a demandée — plus besoin de la faire
  // correspondre à un dessin.
  const [me, setMe] = useState<{ lat: number; lon: number } | null>(null);
  const [geo, setGeo] = useState<'idle' | 'asking' | 'ok' | 'far' | 'error'>('idle');
  const mapRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  /**
   * Choisir doit MONTRER le resultat — sans perdre de vue ce avec quoi on
   * choisit. On cale donc le HAUT DU MENU en haut de l'ecran : « Vous etes
   * ou ? », la bascule et le tri restent ensemble sous les yeux, et la carte
   * ou la liste prend toute la place en dessous.
   *
   * On visait avant la seule rangee de boutons : la recherche se retrouvait
   * poussee hors du champ juste apres qu'on s'en etait servi.
   */
  const montrerLeResultat = () => menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Catégories affichées comme filtres (certaines encore vides → « à venir »).
  // Le chocolat n'est plus une categorie a lui seul : Bonajuto se mange, il vit
  // donc dans « Manger & boire ». Les mots « chocolat », « cacao », « Modica »
  // le trouvent toujours par la recherche — c'est une autre liste.
  const FILTER_CATS: CatKey[] = ['huile', 'marche', 'plantes', 'resto', 'supermarche', 'plage'];
  // « Tout voir » ouvre la ligne, en retrait. Ailleurs il la ferme, mais ici la
  // rangee glisse : le dernier bouton finirait hors champ, et c'est justement
  // l'etat par defaut — celui vers lequel on revient. Il reste discret pour
  // qu'on ne le confonde pas avec une categorie.
  const filters: { key: 'tout' | 'responsable' | CatKey; label: string; icon: IconName }[] = [
    { key: 'responsable', label: p.badge, icon: 'leaf' },
    ...FILTER_CATS.map((k) => ({ key: k, label: CATS[k].label[lang], icon: CATS[k].icon })),
  ];

  const retenus = LOCAL_PLACES.filter((l) =>
    filter === 'tout' ? true : filter === 'responsable' ? l.responsible : l.cat === filter,
  );

  /**
   * Le plus proche en premier. « Proche de quoi ? » — de la maison tant qu'on
   * n'a rien pose, du depart des qu'il existe. C'est le meme repere que les
   * pastilles de la carte : les deux vues doivent raconter la meme chose.
   *
   * Une adresse sans position (le frantoio Gatto, absent d'OpenStreetMap) ne
   * peut pas etre classee depuis un depart : on la met a la fin plutot que de
   * lui inventer une distance.
   */
  const rang = (l: (typeof LOCAL_PLACES)[number]) => {
    if (!depart) return l.km;
    const co = COORDS[l.id];
    return co ? distanceKm(depart.lat, depart.lon, co.lat, co.lon) : Infinity;
  };
  const shown = [...retenus].sort((a, b) => rang(a) - rang(b));

  /**
   * Ce qu'on deroule sous le champ — le plus proche en premier.
   *
   * Comme la liste, et pour la meme raison : « don » doit rendre Donnalucata,
   * qui est a cote, avant un Don Giovanni de Messine, qui est a l'autre bout de
   * l'ile. L'ordre des couches (nos lieux, nos villes, Photon) dit d'ou vient
   * une reponse ; il n'a jamais rien dit de sa distance, et c'est pourtant la
   * seule chose qu'on se demande en cherchant ou l'on est.
   *
   * On coupe a sept APRES avoir trie : couper avant, c'est jeter le plus proche
   * parce qu'il est arrive dans la mauvaise couche.
   */
  const dOu = depart ?? HOUSE;
  const suggestions = sansDoublons([...chercherIci(ou, 20), ...loin])
    .map((s) => ({ s, km: distanceKm(dOu.lat, dOu.lon, s.lat, s.lon) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 7)
    .map(({ s }) => s);

  /**
   * Photon, a la frappe — mais pas a chaque lettre.
   *
   * On attend 250 ms de silence avant de partir : en tapant « Donnalucata »
   * d'une traite, ca fait UNE requete au lieu de onze. Et toute requete encore
   * en vol est abandonnee des que la suivante part — sans ca, une reponse lente
   * a « Don » ecraserait celle de « Donnal ».
   *
   * S'il ne repond pas, on ne dit rien : les deux couches locales sont deja la,
   * et une panne chez eux ne doit pas se voir chez nous.
   */
  useEffect(() => {
    const q = ou.trim();
    if (q.length < 3) return setLoin([]);
    const stop = new AbortController();
    const minuteur = setTimeout(() => {
      chercherLoin(q, stop.signal, lang)
        .then(setLoin)
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(minuteur);
      stop.abort();
    };
  }, [ou, lang]);

  /** Se poser quelque part — par une suggestion, ou par la recherche. */
  const seposer = (s: { nom: string; lat: number; lon: number }) => {
    setDepart({ lat: s.lat, lon: s.lon });
    setOu('');
    setLoin([]);
    setCherche('idle');
    setClicks((c) => c + 1);
    montrerLeResultat();
  };

  /**
   * Le libelle de distance — et son SENS change avec le depart.
   *
   * Depuis la maison : les km de Mag, mesures par la route. Depuis un point
   * pose sur la carte : je ne sais faire que du vol d'oiseau, ce qui donne
   * toujours moins, parfois beaucoup moins dans les Iblei ou les routes
   * tournent.
   *
   * Une ligne le disait au-dessus de la carte. Mag l'a retiree en connaissance
   * de cause : c'est une page de famille, on regarde « c'est loin ? », pas un
   * calculateur d'itineraire. Le « ≈ » porte donc seul cette reserve. Si un
   * jour un chiffre doit etre juste au kilometre pres, il faudra le dire —
   * ou aller chercher la vraie distance routiere.
   *
   * Rend une chaine VIDE quand la distance n'apprend rien — on est dessus. Ca
   * disait « Sur place », et Mag a raison : devant un bar du village, personne
   * ne se demande combien de kilometres le separent du village. Le mot occupait
   * la place du seul renseignement utile, le nom. Qui n'affiche rien affiche
   * moins qu'un mot vide de sens : les appelants sautent la ligne.
   */
  const kmLabel = (l: { id: string; km: number }) => {
    // La maison est un cas a part : elle n'est pas dans LOCAL_PLACES, et sa
    // position est le repere de tout le reste.
    const co = l.id === '__maison__' ? HOUSE : COORDS[l.id];
    if (!depart) return l.id === '__maison__' ? p.houseHere : l.km === 0 ? '' : `≈ ${l.km} km`;
    if (!co) return ''; // sans position reelle, on n'invente pas une distance
    const d = distanceKm(depart.lat, depart.lon, co.lat, co.lon);
    return d < 0.4 ? '' : `≈ ${d < 10 ? d.toFixed(1) : Math.round(d)} km`;
  };

  /** Clic sur une fiche : on la met en évidence sur la carte. */
  const showOnMap = (id: string) => {
    setActive(active === id ? null : id);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /**
   * Valider sans avoir choisi de suggestion : on prend la premiere qu'on a.
   * Si la liste deroulee est vide — Photon lent, ou rien d'ici —, on lui pose
   * la question une derniere fois, franchement, et on attend sa reponse.
   */
  const chercherOu = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = ou.trim();
    if (!q) return;
    if (suggestions.length) return seposer(suggestions[0]);
    setCherche('cours');
    try {
      const r = await chercherLoin(q, new AbortController().signal, lang, 1);
      if (!r.length) return setCherche('rien');
      if (!dansLEmprise(r[0].lat, r[0].lon)) return setCherche('loin');
      seposer(r[0]);
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
          En dessous, on choisissait a l'aveugle ce qu'on ne voyait plus.

          C'est ICI que le defilement s'arrete, et pas sur la rangee de boutons
          en dessous : « ou etes-vous ? » et le tri sont un seul et meme geste —
          choisir ce qu'on regarde. Caler les boutons en haut de l'ecran
          chassait la recherche du champ juste au moment ou l'on s'en sert. */}
      <section ref={menuRef} className="mx-auto max-w-[110rem] scroll-mt-4 px-5 pt-4 md:px-10">
        {/* « Vous etes ou ? » et la bascule carte / liste */}
        {/* `relative z-30` n'est pas cosmetique : .cava-reveal porte un
            transform, donc CHAQUE bloc revele est un contexte d'empilement. Le
            z-20 de la liste deroulee ne vaut qu'a l'interieur de celui-ci — et
            la rangee de boutons, qui vient apres dans la page, lui passait
            devant quoi qu'il arrive. C'est le bloc qu'il faut classer. */}
        <Reveal className="relative z-30 mb-5 flex flex-col gap-3 md:flex-row md:items-center">
          {/* « Vous etes ou ? » — on se pose par le nom plutot qu'au doigt. */}
          <form onSubmit={chercherOu} className="relative flex flex-1 items-center gap-3 md:max-w-md">
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
            {/* Ce qui repond a ce qu'on tape : nos adresses d'abord, puis les
                villes d'ici, puis tout le reste — rues et numeros compris. Les
                deux premieres couches sont dans la page, la troisieme arrive
                de chez Photon un quart de seconde plus tard. */}
            {suggestions.length > 0 && (
              <ul
                className="absolute left-0 top-[calc(100%+6px)] z-20 w-full overflow-hidden rounded-2xl border"
                style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)', boxShadow: '0 8px 30px rgb(0 0 0 / 0.14)' }}
              >
                {suggestions.map((v) => (
                  <li key={`${v.source}-${v.nom}-${v.lat}`}>
                    <button
                      type="button"
                      onClick={() => seposer(v)}
                      className="cava-suggestion flex w-full items-center gap-2.5 px-5 py-3 text-left text-[14.5px]"
                    >
                      {/* Une de nos adresses ne se confond pas avec une ville :
                          le picto le dit avant qu'on lise. */}
                      <span className="shrink-0" style={{ color: 'var(--cava-pink)' }}>
                        <Icon name={v.source === 'lieu' ? 'home' : 'pin'} size={15} />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{v.nom}</span>
                      {v.detail && v.detail !== v.nom && (
                        <span className="shrink-0 text-[12px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-muted)' }}>
                          {v.detail}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
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
                  montrerLeResultat();
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

        <div>
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
              montrerLeResultat();
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
                  montrerLeResultat();
                }}
              />
            );
          })}
        </Reveal>
        </div>
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

      {/* Rien entre les boutons et le contenu. Il y avait ici une ligne — le
          geste a decouvrir, puis l'avertissement du vol d'oiseau. Mag n'en veut
          plus : elle n'existait qu'en vue carte, et basculer carte / liste
          faisait donc sauter tout ce qui suit. Les deux vues commencent
          maintenant a la meme hauteur, au pixel pres — meme `pt-3` de part et
          d'autre, plus rien qui ne vive que d'un cote. */}

      {/* La carte — les épingles suivent le filtre.
          Ni légende ni mini-carte de survol : chaque pastille porte déjà sa
          distance, et les villages sont écrits sur la carte. */}
      <section ref={mapRef} className={`mx-auto max-w-[110rem] scroll-mt-24 px-5 pt-3 md:px-10 ${vue === 'carte' ? '' : 'hidden'}`}>
        <Reveal>
          <PlaceMap
            places={shown}
            lang={lang}
            labels={{ map: p.mapLabel, badge: p.badge, close: p.closeLabel, mapFailed: p.mapFailed, mapFailedHint: p.mapFailedHint, house: p.houseHere, departReset: p.departReset }}
            choisi={shown.find((l) => l.id === active) ?? null}
            onChoisir={(l) => setActive(l?.id ?? null)}
            me={me}
            visible={vue === 'carte'}
            onLocate={locate}
            geoAsking={geo === 'asking'}
            locateLabel={geo === 'asking' ? p.locating : p.locateMe}
            onRetirerDepart={() => {
              setDepart(null);
              setOu('');
              setClicks((c) => c + 1);
            }}
            onMaison={() => {
              // On va voir la maison : la fiche d'une adresse n'a plus rien a
              // faire la, et elle couvrirait justement ce qu'on vient demander.
              setActive(null);
              setVersMaison(Date.now());
            }}
            versMaison={versMaison}
            onDepart={(c) => {
              setDepart(c);
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
                  {kmLabel(pl) && (
                    <p className="relative inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                      <Icon name="home" size={14} /> {kmLabel(pl)}
                    </p>
                  )}
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
