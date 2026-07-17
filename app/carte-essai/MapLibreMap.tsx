'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { CATS, LOCAL_PLACES, type Lang } from '../localData';
import { HOUSE } from '../geo';
import { COORDS } from './coords';
import { ICON_PATHS } from '../Icon';
import { renderToStaticMarkup } from 'react-dom/server';
import { withBase } from '../data';

/**
 * MAQUETTE — la même région, en vraie carte.
 *
 * MapLibre n'apporte que le moteur : les données viennent d'un unique fichier
 * .pmtiles posé dans public/, que le navigateur interroge par requêtes de
 * plage — il ne télécharge que les tuiles qu'il affiche. Pas de serveur, pas
 * de clé d'API, pas de quota.
 *
 * Tout est chargé à la demande (import dynamique) : les ~210 Ko de MapLibre ne
 * pèsent que sur cette page, jamais sur le reste du site.
 */

const INK = '#2e2d2d';
const BG = '#f7f5f2';

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
    {
      id: 'batiments',
      type: 'fill' as const,
      source: 'p',
      'source-layer': 'buildings',
      minzoom: 14,
      paint: { 'fill-color': '#e2dfd8' },
    },
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

export default function MapLibreMap({ lang, filter }: { lang: Lang; filter: string }) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<unknown>(null);
  const markers = useRef<{ remove: () => void }[]>([]);
  const [state, setState] = useState<'chargement' | 'ok' | 'erreur'>('chargement');
  const [erreur, setErreur] = useState('');

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
          style: style(`${location.origin}${withBase('/tuiles/cava.pmtiles')}`) as never,
          center: [HOUSE.lon, HOUSE.lat],
          zoom: 11,
          attributionControl: { compact: false },
        });
        m.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
        m.on('load', () => !mort && setState('ok'));
        m.on('error', (e: { error?: { message?: string } }) => {
          if (mort) return;
          setErreur(e?.error?.message ?? 'inconnue');
          setState('erreur');
        });
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
    const c = map.current as { m: unknown; Marker: new (o: { element: HTMLElement }) => { setLngLat: (l: [number, number]) => { addTo: (m: unknown) => { remove: () => void } } } } | null;
    if (!c || state !== 'ok') return;
    markers.current.forEach((x) => x.remove());
    markers.current = [];

    LOCAL_PLACES.filter((p) => (filter === 'tout' ? true : filter === 'responsable' ? p.responsible : p.cat === filter))
      .forEach((p) => {
        const co = COORDS[p.id];
        if (!co) return; // pas de position réelle : pas d'épingle inventée
        const el = document.createElement('a');
        el.href = p.url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.title = `${p.name} — ${p.town}`;
        el.className = 'cava-glpin';
        el.innerHTML = `<span>${renderToStaticMarkup(
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {ICON_PATHS[CATS[p.cat].icon]}
          </svg>,
        )}</span>`;
        markers.current.push(new c.Marker({ element: el }).setLngLat([co.lon, co.lat]).addTo(c.m));
      });

    // La maison, à part
    const h = document.createElement('div');
    h.className = 'cava-glhouse';
    h.title = "Cava d'Aliga";
    markers.current.push(new c.Marker({ element: h }).setLngLat([HOUSE.lon, HOUSE.lat]).addTo(c.m));
  }, [state, filter, lang]);

  return (
    <div className="relative h-[68vh] max-h-[620px] overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--cava-line)' }}>
      <div ref={box} className="h-full w-full" />
      {state !== 'ok' && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[14px]" style={{ background: BG, color: 'var(--cava-muted)' }}>
          {state === 'chargement' ? (
            <p className="italic">Chargement de la carte…</p>
          ) : (
            <p>
              La carte n’a pas pu se charger.
              <br />
              <span className="font-mono text-[12px]">{erreur}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
