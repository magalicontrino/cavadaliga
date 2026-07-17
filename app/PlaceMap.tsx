'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CATS, type Lang, type LocalPlace } from './localData';
import { HOUSE } from './geo';
import { COORDS } from './placeCoords';
import Icon, { ICON_PATHS, type IconName } from './Icon';
import { withBase } from './data';
import PlaceCard from './PlaceCard';

/**
 * La carte des adresses.
 *
 * MapLibre n'apporte que le moteur : les données viennent d'un unique fichier
 * .pmtiles posé dans public/, que le navigateur interroge par requêtes de
 * plage — il ne télécharge que les tuiles qu'il affiche. Pas de serveur, pas
 * de clé d'API, pas de quota.
 *
 * Tout est chargé à la demande (import dynamique) : les ~210 Ko de MapLibre ne
 * pèsent que sur cette page, jamais sur les sept autres.
 *
 * Elle ne décide de rien : la page lui passe les lieux déjà triés et cherchés,
 * et le lieu choisi. Elle les montre, et signale les clics.
 */

const INK = '#2e2d2d';
const BG = '#f7f5f2';

/**
 * Le fichier de tuiles. Le NOM PORTE UNE VERSION, et ce n'est pas cosmetique :
 * PMTiles lit ce fichier par morceaux, que le navigateur met en cache. Remplacer
 * le fichier en gardant la meme URL fait melanger a un visiteur deja venu les
 * morceaux de l'ancien avec la taille du nouveau — et la carte tombe sur
 * « Failed to fetch », chez lui seulement. Changer d'emprise = changer de nom.
 */
const TUILES = '/tuiles/cava-v2.pmtiles';

/**
 * L'emprise de nos tuiles (le --bbox de l'extrait). Hors de la, il n'y a rien
 * a dessiner : on verrait le fond du style, une bande vide. On l'impose donc
 * comme limite a la camera — MapLibre l'empeche d'en sortir, et remonte le
 * zoom au besoin pour que les donnees remplissent toujours la fenetre.
 */
const EMPRISE: [[number, number], [number, number]] = [
  [14.05, 36.55],
  [15.45, 37.25],
];

/** Le strict nécessaire de l'API MapLibre, typé à la main. */
type Epingle = { setLngLat: (l: [number, number]) => Epingle; addTo: (m: unknown) => Epingle; remove: () => void };
type Carte = {
  m: { easeTo: (o: object) => void; fitBounds: (b: [[number, number], [number, number]], o: object) => void };
  Marker: new (o: { element: HTMLElement }) => Epingle;
};

/** Un picto du site en HTML brut — les épingles vivent hors de l'arbre React. */
const picto = (name: IconName, size: number) =>
  renderToStaticMarkup(
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </svg>,
  );

/** Le style : ce qu'on dessine, dans quel ordre, avec quelles couleurs.
 *  Écrit à la main plutôt que repris d'un thème tout fait — c'était la
 *  question posée : peut-on avoir NOTRE fond de carte ? Le voici. */
const style = (tiles: string) => ({
  version: 8 as const,
  glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
  sources: {
    // L'attribution n'est pas décorative : les données sont sous ODbL, le
    // crédit et son lien sont dus. Cliquable, comme tout lien du site.
    p: {
      type: 'vector' as const,
      url: `pmtiles://${tiles}`,
      attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>',
    },
  },
  layers: [
    { id: 'fond', type: 'background' as const, paint: { 'background-color': BG } },
    { id: 'terre', type: 'fill' as const, source: 'p', 'source-layer': 'earth', paint: { 'fill-color': BG } },
    { id: 'vert', type: 'fill' as const, source: 'p', 'source-layer': 'landuse', paint: { 'fill-color': '#eeece7' } },
    // La mer en rose : c'est l'aplat qui donne son air au poster.
    { id: 'mer', type: 'fill' as const, source: 'p', 'source-layer': 'water', paint: { 'fill-color': '#e88aab' } },
    {
      id: 'routes',
      type: 'line' as const,
      source: 'p',
      'source-layer': 'roads',
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.6, 14, 4, 17, 12] as never,
      },
    },
    { id: 'batiments', type: 'fill' as const, source: 'p', 'source-layer': 'buildings', minzoom: 14, paint: { 'fill-color': '#e2dfd8' } },
    {
      id: 'villages',
      type: 'symbol' as const,
      source: 'p',
      'source-layer': 'places',
      filter: ['<=', ['get', 'kind_detail'], 10] as never,
      layout: {
        'text-field': ['get', 'name'] as never,
        'text-font': ['Noto Sans Medium'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 11, 14, 15] as never,
      },
      paint: { 'text-color': INK, 'text-halo-color': BG, 'text-halo-width': 2 },
    },
  ],
});

export default function PlaceMap({
  places,
  lang,
  labels,
  choisi,
  onChoisir,
  me,
  visible = true,
  onLocate,
  geoAsking = false,
  locateLabel = '',
}: {
  /** Déjà triés et cherchés par la page — la carte ne filtre rien. */
  places: LocalPlace[];
  lang: Lang;
  // Les libellés viennent de la page : ce composant ne doit rien écrire en dur.
  labels: { map: string; badge: string; here: string; close: string; mapFailed: string; mapFailedHint: string };
  choisi: LocalPlace | null;
  onChoisir: (p: LocalPlace | null) => void;
  /** Position réelle du visiteur, s'il l'a demandée. */
  me: { lat: number; lon: number } | null;
  /**
   * La page peut la masquer (bascule carte/liste). On la garde montée — la
   * démonter la rechargerait et lui ferait perdre son zoom — mais masquée son
   * canvas tombe à zéro : il faut le lui dire quand elle revient.
   */
  visible?: boolean;
  /** « Où suis-je ? » — la cible vit sur la carte, c'est là qu'on la cherche. */
  onLocate?: () => void;
  geoAsking?: boolean;
  locateLabel?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<unknown>(null);
  const markers = useRef<Epingle[]>([]);
  // id -> element : permet d'allumer l'épingle choisie sans reconstruire les 18
  const pins = useRef(new Map<string, HTMLElement>());
  const [state, setState] = useState<'chargement' | 'ok' | 'erreur'>('chargement');
  const [erreur, setErreur] = useState('');
  const piste = useRef<HTMLDivElement>(null);
  // D'ou vient le choix ? Cliquer une epingle doit amener sa fiche ; glisser
  // la piste ne doit surtout PAS la repositionner — sinon on lutte contre le
  // doigt de l'utilisateur, et le geste suivant est ignore.
  const origine = useRef<'epingle' | 'piste'>('epingle');

  /**
   * `places` est un tableau neuf à chaque rendu de la page : s'y fier par
   * IDENTITÉ ferait croire que la liste change sans arrêt, et l'effet qui pose
   * les épingles se rejouerait — en effaçant le choix au passage. On ne se fie
   * donc qu'au CONTENU : cette clé ne bouge que si les lieux changent vraiment.
   */
  const cle = places.map((p) => p.id).join(',');
  /** Ceux qu'on peut poser : sans position réelle, pas d'épingle inventée. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const liste = useMemo(() => places.filter((p) => COORDS[p.id]), [cle]);

  /** Amène une épingle au centre, sans brusquer. */
  const viser = useCallback((p: LocalPlace) => {
    const c = map.current as Carte | null;
    const co = COORDS[p.id];
    if (c && co) c.m.easeTo({ center: [co.lon, co.lat], duration: 400 });
  }, []);

  useEffect(() => {
    let mort = false;
    (async () => {
      try {
        const [gl, pm] = await Promise.all([import('maplibre-gl'), import('pmtiles')]);
        const { Map: GlMap, Marker, NavigationControl } = gl;
        const { Protocol } = pm;
        if (mort || !box.current) return;

        // pmtiles:// — apprend à MapLibre à lire l'archive par requêtes de plage
        const proto = new Protocol();
        gl.addProtocol('pmtiles', proto.tile);

        const m = new GlMap({
          container: box.current,
          style: style(`${location.origin}${withBase(TUILES)}`) as never,
          center: [HOUSE.lon, HOUSE.lat],
          zoom: 11,
          maxBounds: EMPRISE,
          attributionControl: { compact: false },
        });
        // En haut à droite : en bas, les commandes tomberaient derrière la fiche.
        m.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        m.on('load', () => !mort && setState('ok'));
        m.on('error', (e: { error?: { message?: string } }) => {
          if (mort) return;
          setErreur(e?.error?.message ?? 'inconnue');
          setState('erreur');
        });
        // Cliquer le fond referme la fiche — le réflexe attendu d'une carte.
        m.on('click', () => !mort && onChoisir(null));
        map.current = { m, Marker };
      } catch (e) {
        if (mort) return;
        setErreur(e instanceof Error ? e.message : String(e));
        setState('erreur');
      }
    })();
    return () => {
      mort = true;
      const c = map.current as { m?: { remove: () => void } } | null;
      c?.m?.remove();
    };
  }, []);

  // Les épingles suivent le filtre. Chacune porte le picto de sa catégorie —
  // le même jeu d'icônes que le reste du site, pour comparer à armes égales.
  useEffect(() => {
    const c = map.current as Carte | null;
    if (!c || state !== 'ok') return;
    onChoisir(null); // la fiche parlerait d'une épingle que le filtre a retirée
    markers.current.forEach((x) => x.remove());
    markers.current = [];
    pins.current.clear();

    liste.forEach((p) => {
      const co = COORDS[p.id]; // garanti par « liste »

      // Un bouton, pas un lien : cliquer ouvre la fiche, on ne quitte pas la
      // page. Le lien vers Google Maps vit DANS la fiche, une fois qu'on sait
      // de quel endroit il s'agit.
      // Le principe Airbnb : l'épingle porte déjà ce qui décide. Chez eux le
      // prix, ici la distance — c'est la question qu'on se pose devant une
      // adresse quand on est en vacances sans voiture, ou avec.
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'cava-glpin';
      el.setAttribute('aria-label', `${p.name} — ${p.town}`);
      el.innerHTML = `${picto(CATS[p.cat].icon, 19)}<span>${p.km === 0 ? labels.here : `${p.km} km`}</span>`;
      pins.current.set(p.id, el);
      el.addEventListener('click', (ev) => {
        ev.stopPropagation(); // sinon le clic atteint la carte et referme aussitôt
        origine.current = 'epingle';
        onChoisir(p);
        viser(p);
      });
      markers.current.push(new c.Marker({ element: el }).setLngLat([co.lon, co.lat]).addTo(c.m));
    });

    // La maison, à part
    const h = document.createElement('div');
    h.className = 'cava-glhouse';
    h.title = "Cava d'Aliga";
    markers.current.push(new c.Marker({ element: h }).setLngLat([HOUSE.lon, HOUSE.lat]).addTo(c.m));

    // « Vous êtes ici » : la vraie position, posée telle quelle. Plus besoin de
    // la faire correspondre à un dessin — c'était tout l'objet de geo.ts.
    if (me) {
      const v = document.createElement('div');
      v.className = 'cava-glme';
      markers.current.push(new c.Marker({ element: v }).setLngLat([me.lon, me.lat]).addTo(c.m));
    }

    // Choisir un filtre doit MONTRER ce qu'on a choisi : on cadre sur les
    // épingles retenues (la maison comprise, c'est le repère). Sans ça, on
    // cliquait « Plantes & fleurs » et on restait devant une carte vide.
    const vus = liste.map((p) => COORDS[p.id]);
    const lons = [...vus.map((v) => v.lon), HOUSE.lon];
    const lats = [...vus.map((v) => v.lat), HOUSE.lat];
    c.m.fitBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)],
      ],
      // Un seul lieu ? fitBounds irait au zoom maximum : on le retient.
      { padding: 70, maxZoom: 13.5, duration: 500 },
    );
  }, [state, cle, lang, viser, me]);

  // De retour de la liste : le canvas s'est vidé pendant qu'on ne le voyait
  // pas. On le remesure, sinon la carte revient en miette.
  useEffect(() => {
    if (!visible || state !== 'ok') return;
    const c = map.current as { m: { resize: () => void } } | null;
    c?.m.resize();
  }, [visible, state]);

  // L'épingle choisie s'inverse — on doit voir de quel point la fiche parle.
  useEffect(() => {
    pins.current.forEach((el, id) => el.classList.toggle('is-on', id === choisi?.id));
  }, [choisi]);

  // Cliquer une épingle amène sa fiche sous les yeux (téléphone). On ne le
  // fait QUE dans ce sens : si le choix vient du doigt, la piste est déjà là
  // où l'utilisateur l'a mise.
  useEffect(() => {
    const p = piste.current;
    if (!p || !choisi || origine.current !== 'epingle') return;
    const i = liste.findIndex((x) => x.id === choisi.id);
    const el = p.children[i] as HTMLElement | undefined;
    if (!el) return;
    // Instantané, et c'est voulu : un défilement animé émet des événements en
    // traînée qui arrivaient APRÈS le clic suivant et écrasaient le choix. Ici
    // le seul événement émis tombe pile sur la fiche déjà choisie — « on a
    // glissé » n'a donc rien à rechoisir, et les deux sens cessent de lutter.
    p.scrollTo({ left: el.offsetLeft - (p.clientWidth - el.clientWidth) / 2, behavior: 'auto' });
  }, [choisi, liste]);

  // …et inversement : faire glisser la piste choisit le lieu qui arrive au
  // centre, et la carte suit. C'est le geste d'Airbnb — on passe d'un lieu au
  // suivant sans jamais revenir a la carte.
  const onGlisse = useCallback(() => {
    const p = piste.current;
    if (!p) return;
    const centre = p.scrollLeft + p.clientWidth / 2;
    let best = 0;
    let d = Infinity;
    [...p.children].forEach((el, i) => {
      const e = el as HTMLElement;
      const dd = Math.abs(e.offsetLeft + e.clientWidth / 2 - centre);
      if (dd < d) {
        d = dd;
        best = i;
      }
    });
    const cible = liste[best];
    if (cible && cible.id !== choisi?.id) {
      origine.current = 'piste';
      onChoisir(cible);
      viser(cible);
    }
  }, [liste, choisi, viser]);

  return (
    <div className="relative h-[68vh] max-h-[620px] overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--cava-line)' }}>
      <div ref={box} className="h-full w-full" />

      {/* La cible, sous les commandes de zoom : sur une carte, « où suis-je ? »
          se cherche sur la carte, pas dans une barre de recherche. */}
      {onLocate && state === 'ok' && (
        <button
          type="button"
          onClick={onLocate}
          disabled={geoAsking}
          aria-label={locateLabel}
          title={locateLabel}
          className="cava-maptarget absolute right-[10px] top-[84px] z-10 flex h-[29px] w-[29px] items-center justify-center disabled:opacity-50"
        >
          <Icon name="target" size={16} />
        </button>
      )}

      {/* Téléphone : une piste qu'on feuillette, comme chez Airbnb. La fiche
          choisie est au centre ; on glisse pour passer a la suivante et la
          carte suit. */}
      {choisi && (
        <div
          ref={piste}
          onScroll={onGlisse}
          className="cava-swipe absolute inset-x-0 bottom-3 z-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 sm:hidden"
        >
          {liste.map((p) => (
            <div key={p.id} className="w-[86%] shrink-0 snap-center">
              <PlaceCard place={p} lang={lang} labels={labels} onClose={() => onChoisir(null)} />
            </div>
          ))}
        </div>
      )}

      {/* Écran large : une seule fiche, en bas a gauche. */}
      {choisi && (
        <div className="absolute bottom-4 left-4 z-10 hidden w-[330px] sm:block">
          <PlaceCard place={choisi} lang={lang} labels={labels} onClose={() => onChoisir(null)} />
        </div>
      )}

      {/* Une carte muette n'aide personne : quand elle rate, on dit quoi, et on
          laisse une porte de sortie — la liste, elle, marche toujours. */}
      {state !== 'ok' && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[14px]" style={{ background: BG, color: 'var(--cava-muted)' }}>
          {state === 'chargement' ? (
            <p className="italic">Chargement de la carte…</p>
          ) : (
            <div className="max-w-[46ch]">
              <p style={{ color: 'var(--cava-ink)', fontWeight: 600 }}>{labels.mapFailed}</p>
              <p className="mt-2 text-[13px]">{labels.mapFailedHint}</p>
              <p className="mt-3 break-all font-mono text-[11px]" style={{ opacity: 0.7 }}>
                {erreur}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
