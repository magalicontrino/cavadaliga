'use client';

// Carte « poster » du sud-est de la Sicile — inspiration cartes d'art
// (terre rose, réseau de rues crème, mer crème, cadre minimaliste).
// Décorative et non à l'échelle. Villages et producteurs = pastilles cliquables
// qui ouvrent Google Maps.

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

// Producteurs / adresses locales — pastille sombre + picto produit.
type LocalSpot = { name: string; icon: 'cone' | 'droplet' | 'leaf'; x: number; y: number; q: string };
const LOCALS: LocalSpot[] = [
  { name: 'Antica Dolceria Bonajuto (chocolat)', icon: 'cone', x: 505, y: 322, q: 'Antica Dolceria Bonajuto Modica' },
  { name: 'Frantoi Cutrera (huile d’olive)', icon: 'droplet', x: 274, y: 278, q: 'Frantoi Cutrera Chiaramonte Gulfi' },
  { name: 'Pépinières (plantes & fleurs)', icon: 'leaf', x: 372, y: 442, q: 'vivaio Scicli' },
];
const ICON_PATHS: Record<LocalSpot['icon'], React.ReactNode> = {
  cone: (
    <>
      <path d="M8 9a4 4 0 018 0" />
      <path d="M7.5 10.5h9L12 21z" />
      <path d="M9 13.5h6M10 17h4" />
    </>
  ),
  droplet: <path d="M12 3.5s6 6.2 6 10.5a6 6 0 01-12 0c0-4.3 6-10.5 6-10.5z" />,
  leaf: (
    <>
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" />
      <path d="M5 19c3-3 6-5 9-6.5" />
    </>
  ),
};

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

export default function LocalMap({ houseLabel }: { houseLabel: string }) {
  return (
    <svg
      viewBox="0 0 1000 660"
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

      {/* ---------- En-tête poster ---------- */}
      {/* Boussole */}
      <g transform="translate(46 46)">
        <circle r="21" fill={CREAM} stroke="var(--cava-ink)" strokeWidth="1.5" />
        <path d="M0 -11 L6 7 L0 3 L-6 7 Z" fill="var(--cava-pink)" />
        <text y="-6" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--cava-ink)">
          N
        </text>
      </g>
      <text x="80" y="51" fontSize="13" letterSpacing="0.04em" fill="var(--cava-ink)">
        36.72° N · 14.70° E
      </text>
      <g fill="var(--cava-pink)">
        <circle cx="930" cy="44" r="3.5" />
        <circle cx="946" cy="44" r="3.5" />
        <circle cx="962" cy="44" r="3.5" />
      </g>
      <text x="962" y="112" textAnchor="end" fontSize="52" fontWeight="700" letterSpacing="-0.01em" fill="var(--cava-ink)">
        cava d’aliga
      </text>
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

      {/* Producteurs — pastille sombre + picto */}
      {LOCALS.map((s) => (
        <a key={s.q} href={maps(s.q)} target="_blank" rel="noopener noreferrer" className="cava-mappin" aria-label={s.name}>
          <circle cx={s.x} cy={s.y} r="15" fill="transparent" />
          <rect className="dot" x={s.x - 10} y={s.y - 10} width="20" height="20" rx="6" fill="var(--cava-ink)" />
          <svg
            x={s.x - 7}
            y={s.y - 7}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={CREAM}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICON_PATHS[s.icon]}
          </svg>
        </a>
      ))}

      {/* Légende */}
      <g transform="translate(700 470)">
        <rect width="262" height="94" rx="14" fill={CREAM} stroke="var(--cava-ink)" strokeWidth="1.2" opacity="0.96" />
        <circle cx="24" cy="26" r="5.5" fill={CREAM} stroke="var(--cava-ink)" strokeWidth="1.6" />
        <text x="42" y="30" fontSize="13.5" fill="var(--cava-ink)">
          Villages
        </text>
        <rect x="15" y="45" width="18" height="18" rx="5" fill="var(--cava-ink)" />
        <text x="42" y="59" fontSize="13.5" fill="var(--cava-ink)">
          Producteurs locaux
        </text>
        <text x="17" y="82" fontSize="11.5" fontStyle="italic" fill="var(--cava-muted)">
          + d’autres bonnes adresses à venir
        </text>
      </g>
    </svg>
  );
}
