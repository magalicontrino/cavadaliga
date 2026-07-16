'use client';

// Carte « poster » du sud-est de la Sicile — inspiration cartes d'art
// (terre rose, réseau de rues crème, mer crème, cadre minimaliste).
// Décorative et non à l'échelle. Villages et adresses = pastilles cliquables
// qui ouvrent Google Maps.
//
// Les épingles d'adresses (spots) viennent de la page : elles suivent le filtre
// et la recherche. `activeId` met une épingle en évidence (clic sur une fiche).

import { ICON_PATHS, type IconName } from './Icon';

const CREAM = '#f7f5f2'; // = fond de page (--cava-bg) → la carte se fond dans la page
const PINK = '#ec7291';

type Place = {
  name: string;
  x: number;
  y: number;
  q: string;
  lp: 'top' | 'bottom' | 'left' | 'right';
  km?: number;
  house?: boolean;
};

const PLACES: Place[] = [
  { name: 'Chiaramonte Gulfi', x: 235, y: 250, q: 'Chiaramonte Gulfi', lp: 'top', km: 35 },
  { name: 'Ragusa', x: 300, y: 322, q: 'Ragusa Ibla', lp: 'left', km: 28 },
  { name: 'Modica', x: 470, y: 345, q: 'Modica', lp: 'right', km: 20 },
  { name: 'Noto', x: 702, y: 360, q: 'Noto', lp: 'top', km: 55 },
  { name: 'Siracusa', x: 888, y: 272, q: 'Siracusa Ortigia', lp: 'left', km: 85 },
  { name: 'Scicli', x: 405, y: 420, q: 'Scicli', lp: 'right', km: 8 },
  { name: 'Marina di Ragusa', x: 150, y: 502, q: 'Marina di Ragusa', lp: 'bottom', km: 13 },
  { name: 'Donnalucata', x: 292, y: 500, q: 'Donnalucata Scicli', lp: 'bottom', km: 3 },
  { name: 'Cava d’Aliga', x: 408, y: 494, q: 'Cava d’Aliga Scicli', lp: 'bottom', house: true },
  { name: 'Sampieri', x: 535, y: 476, q: 'Sampieri Scicli', lp: 'bottom', km: 5 },
  { name: 'Punta Pisciotto', x: 606, y: 460, q: 'Fornace Penna Sampieri', lp: 'right', km: 6 },
];

// Adresse épinglée sur la carte — vient de LOCAL_PLACES via la page.
// `cat` et `km` alimentent la mini-carte affichée au survol de l'épingle.
export type MapSpot = { id: string; name: string; icon: IconName; x: number; y: number; q: string; cat: string; km: string };

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// Contour de la terre (le reste = mer, crème).
const LAND =
  'M0 176 H1000 V250 C912 296 862 336 818 392 C758 466 692 512 572 550 C482 578 386 585 300 576 C212 567 120 566 0 594 Z';

// Routes « creusées » dans la terre rose (couleur du fond). Courbes organiques,
// pas de grille en damier : uniquement les axes qui relient les lieux.
const ROADS: { d: string; w: number }[] = [
  // Route côtière (principale)
  { d: 'M150 502 C250 506 350 500 408 494 C480 486 560 470 606 460 C662 446 698 408 702 360', w: 5 },
  { d: 'M702 360 C782 342 848 302 888 272', w: 5 },
  // Artère intérieure : Cava → Scicli → Modica → Noto
  { d: 'M408 494 C407 460 406 445 405 420 C418 388 448 360 470 345 C560 350 650 355 702 360', w: 5 },
  // Vers Raguse / Chiaramonte
  { d: 'M405 420 C362 392 322 356 300 322 C278 298 252 274 235 250', w: 4 },
  // Secondaires (plus fines)
  { d: 'M300 322 C360 330 420 340 470 345', w: 2.6 },
  { d: 'M150 502 C182 452 232 384 300 322', w: 2.6 },
  { d: 'M292 500 C322 470 372 440 405 420', w: 2.6 },
  { d: 'M470 345 C502 384 528 430 535 476', w: 2.6 },
  { d: 'M606 460 C640 430 675 396 702 360', w: 2.6 },
  { d: 'M235 250 C305 258 390 288 470 345', w: 2.2 },
];

export default function LocalMap({
  houseLabel,
  spots,
  activeId,
  spotsKey,
  me,
  onHover,
}: {
  houseLabel: string;
  spots: MapSpot[];
  activeId?: string | null;
  spotsKey?: string; // change → rejoue l'animation d'apparition des épingles
  // Position du visiteur sur la carte (voir geo.ts). Dans le SVG : elle doit
  // suivre le zoom, contrairement à la légende qui reste fixe par-dessus.
  me?: { x: number; y: number } | null;
  // La mini-carte est rendue en HTML par la page, au-dessus de la carte : dans
  // le SVG elle serait rognée par la fenêtre de zoom et déformée par l'échelle.
  onHover?: (spot: MapSpot | null, rect: DOMRect | null) => void;
}) {
  return (
    <svg
      viewBox="0 112 1000 548"
      className="block h-auto w-full"
      role="img"
      aria-label="Carte du sud-est de la Sicile, style poster"
      style={{ fontFamily: 'inherit' }}
    >
      <defs>
        <clipPath id="cava-landclip">
          <path d={LAND} />
        </clipPath>
      </defs>

      {/* Pas de fond : la mer / le cadre = le fond de page (blend). */}

      {/* ---------- En-tête minimal (filet + échelle) ---------- */}
      <line x1="38" y1="134" x2="962" y2="134" stroke="var(--cava-pink)" strokeWidth="2" />
      {/* Échelle */}
      <text x="38" y="162" fontSize="12" letterSpacing="0.06em" fill="var(--cava-muted)">
        ≈ 5 km
      </text>
      <line x1="118" y1="158" x2="182" y2="158" stroke="var(--cava-ink)" strokeWidth="1.4" />
      <circle cx="182" cy="158" r="2.4" fill="var(--cava-ink)" />
      <path d="M118 154v8" stroke="var(--cava-ink)" strokeWidth="1.4" />
      <text x="962" y="162" textAnchor="end" fontSize="14" letterSpacing="0.22em" fill="var(--cava-muted)">
        sicilia
      </text>

      {/* ---------- Carte ---------- */}
      {/* Terre rose */}
      <path d={LAND} fill={PINK} />

      {/* Routes (couleur du fond), coupées à la terre */}
      <g clipPath="url(#cava-landclip)" stroke={CREAM} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {ROADS.map((r, i) => (
          <path key={i} d={r.d} strokeWidth={r.w} />
        ))}
      </g>

      {/* Villages — pastille crème cerclée */}
      {PLACES.map((p) => {
        const anchor = p.lp === 'left' ? ('end' as const) : p.lp === 'right' ? ('start' as const) : ('middle' as const);
        const dx = p.lp === 'left' ? -13 : p.lp === 'right' ? 13 : 0;
        const dy = p.lp === 'top' ? -14 : p.lp === 'bottom' ? 22 : 5;
        return (
          <a key={p.name} href={maps(p.q)} target="_blank" rel="noopener noreferrer" className="cava-mappin">
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
            {p.house && <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="var(--cava-ink)" strokeWidth="1.4" opacity="0.5" />}
            <circle
              className="dot"
              cx={p.x}
              cy={p.y}
              r={p.house ? 6.5 : 4.5}
              fill={CREAM}
              stroke="var(--cava-ink)"
              strokeWidth="1.6"
            />
            <text
              x={p.x + dx}
              y={p.y + dy}
              textAnchor={anchor}
              fontSize={p.house ? 16 : 14}
              fontWeight={p.house ? 700 : 500}
              fill="var(--cava-ink)"
              style={{ paintOrder: 'stroke', stroke: CREAM, strokeWidth: 4, strokeLinejoin: 'round' }}
            >
              {p.name}
            </text>
            <text
              x={p.x + dx}
              y={p.y + dy + 15}
              textAnchor={anchor}
              fontSize="11"
              fontWeight="600"
              fill="rgba(46,45,45,0.72)"
              style={{ paintOrder: 'stroke', stroke: CREAM, strokeWidth: 3.5, strokeLinejoin: 'round', letterSpacing: '0.03em' }}
            >
              {p.house ? houseLabel : `≈ ${p.km} km`}
            </text>
          </a>
        );
      })}

      {/* Nos adresses — pastille sombre + picto de catégorie.
          Suivent le filtre ; l'épingle active (fiche cliquée) grossit. */}
      <g key={spotsKey}>
        {spots.map((s, i) => {
          const on = s.id === activeId;
          const half = on ? 15 : 10; // demi-côté de la pastille
          const ico = on ? 21 : 14;
          return (
            <a
              key={s.id}
              href={maps(s.q)}
              target="_blank"
              rel="noopener noreferrer"
              className={`cava-mappin cava-mapspot${on ? ' cava-mapspot-on' : ''}`}
              aria-label={s.name}
              style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
              onMouseEnter={(e) => onHover?.(s, e.currentTarget.getBoundingClientRect())}
              onMouseLeave={() => onHover?.(null, null)}
              onFocus={(e) => onHover?.(s, e.currentTarget.getBoundingClientRect())}
              onBlur={() => onHover?.(null, null)}
            >
              {/* Onde autour de l'épingle mise en évidence */}
              {on && (
                <circle
                  className="cava-spotripple"
                  cx={s.x}
                  cy={s.y}
                  r="15"
                  fill="none"
                  stroke="var(--cava-pink)"
                  strokeWidth="2.5"
                />
              )}
              <circle cx={s.x} cy={s.y} r="15" fill="transparent" />
              <rect
                className="dot"
                x={s.x - half}
                y={s.y - half}
                width={half * 2}
                height={half * 2}
                rx={on ? 9 : 6}
                fill={on ? 'var(--cava-pink)' : 'var(--cava-ink)'}
                stroke={CREAM}
                strokeWidth={on ? 2 : 0}
              />
              <svg
                x={s.x - ico / 2}
                y={s.y - ico / 2}
                width={ico}
                height={ico}
                viewBox="0 0 24 24"
                fill="none"
                stroke={CREAM}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICON_PATHS[s.icon]}
              </svg>
              {/* Pas de nom sur l'épingle : il chevaucherait les labels de
                  villages. Le nom est dans aria-label / l'infobulle. */}
              <title>{s.name}</title>
            </a>
          );
        })}
      </g>

      {/* Cible « vous êtes ici » — suit la carte, contrairement à la légende. */}
      {me && (
        <g className="cava-mehere" pointerEvents="none">
          <circle className="cava-mering" cx={me.x} cy={me.y} r="13" fill="none" stroke="#2563eb" strokeWidth="2.5" />
          <circle cx={me.x} cy={me.y} r="8" fill="#2563eb" stroke={CREAM} strokeWidth="2.5" />
        </g>
      )}

    </svg>
  );
}
