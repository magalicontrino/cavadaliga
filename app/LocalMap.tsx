'use client';

// Carte « poster » du sud-est de la Sicile — inspiration cartes d'art
// (terre rose, réseau de rues crème, mer crème, cadre minimaliste).
// Décorative et non à l'échelle. Villages et producteurs = pastilles cliquables
// qui ouvrent Google Maps.

const CREAM = '#f4eede';
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

// Réseau de rues : deux familles de lignes parallèles (grille pivotée),
// générées de façon déterministe (mêmes valeurs au rendu serveur et client).
const STREETS = (() => {
  const out: { d: string; w: number }[] = [];
  const fams = [
    { a: 14, sp: 23 },
    { a: 103, sp: 28 },
  ];
  const cx = 500;
  const cy = 400;
  const L = 900;
  for (const f of fams) {
    const th = (f.a * Math.PI) / 180;
    const dx = Math.cos(th);
    const dy = Math.sin(th);
    const nx = -dy;
    const ny = dx;
    for (let k = -30; k <= 30; k++) {
      const ox = cx + nx * k * f.sp;
      const oy = cy + ny * k * f.sp;
      out.push({
        d: `M${(ox - dx * L).toFixed(1)} ${(oy - dy * L).toFixed(1)} L${(ox + dx * L).toFixed(1)} ${(oy + dy * L).toFixed(1)}`,
        w: k % 4 === 0 ? 2.6 : 1.3,
      });
    }
  }
  return out;
})();

// Routes principales (crème, plus épaisses) reliant les villages.
const ROADS = [
  'M150 502 L292 500 L408 494 L535 476 L606 460 L702 360 L888 272', // route côtière → est
  'M408 494 L405 420 L470 345 L702 360', // vers l'intérieur
  'M405 420 L300 322 L235 250', // vers Raguse / Chiaramonte
  'M470 345 L505 322', // Modica → Bonajuto
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

      {/* Fond crème (mer + cadre) */}
      <rect x="0" y="0" width="1000" height="660" fill={CREAM} />

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

      {/* Réseau de rues (crème), coupé à la terre */}
      <g clipPath="url(#cava-landclip)" stroke={CREAM} fill="none" strokeLinecap="round">
        {STREETS.map((s, i) => (
          <path key={i} d={s.d} strokeWidth={s.w} opacity="0.9" />
        ))}
        {ROADS.map((d, i) => (
          <path key={`r${i}`} d={d} strokeWidth="5.5" />
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
          <g className="dot" transform={`translate(${s.x} ${s.y})`}>
            <rect x="-10" y="-10" width="20" height="20" rx="6" fill="var(--cava-ink)" />
          </g>
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
