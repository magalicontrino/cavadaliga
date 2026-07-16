'use client';

// Carte illustrée du sud-est de la Sicile — dessinée à la main (SVG), aux
// couleurs du site. Décorative et non à l'échelle. Chaque village est un point
// cliquable qui ouvre Google Maps. Mer en dégradé, côte à l'encre, accents roses.

type Place = {
  name: string;
  x: number;
  y: number;
  q: string; // requête Google Maps
  lp: 'top' | 'bottom' | 'left' | 'right';
  km?: number; // distance depuis la maison (Cava d'Aliga)
  house?: boolean;
};

const PLACES: Place[] = [
  { name: 'Chiaramonte Gulfi', x: 235, y: 112, q: 'Chiaramonte Gulfi', lp: 'top', km: 35 },
  { name: 'Ragusa', x: 305, y: 205, q: 'Ragusa Ibla', lp: 'left', km: 28 },
  { name: 'Modica', x: 480, y: 235, q: 'Modica', lp: 'right', km: 20 },
  { name: 'Noto', x: 700, y: 255, q: 'Noto', lp: 'top', km: 55 },
  { name: 'Siracusa', x: 892, y: 132, q: 'Siracusa Ortigia', lp: 'left', km: 85 },
  { name: 'Scicli', x: 405, y: 315, q: 'Scicli', lp: 'right', km: 8 },
  { name: 'Marina di Ragusa', x: 150, y: 400, q: 'Marina di Ragusa', lp: 'bottom', km: 13 },
  { name: 'Donnalucata', x: 290, y: 388, q: 'Donnalucata Scicli', lp: 'bottom', km: 3 },
  { name: 'Cava d’Aliga', x: 408, y: 380, q: 'Cava d’Aliga Scicli', lp: 'bottom', house: true },
  { name: 'Sampieri', x: 535, y: 362, q: 'Sampieri Scicli', lp: 'bottom', km: 5 },
  { name: 'Punta Pisciotto', x: 606, y: 346, q: 'Fornace Penna Sampieri', lp: 'right', km: 6 },
];

// Producteurs / adresses locales — marqueur terracotta + picto produit.
type LocalSpot = { name: string; icon: 'cone' | 'droplet' | 'leaf'; x: number; y: number; q: string };
const LOCALS: LocalSpot[] = [
  { name: 'Antica Dolceria Bonajuto (chocolat)', icon: 'cone', x: 512, y: 210, q: 'Antica Dolceria Bonajuto Modica' },
  { name: 'Frantoi Cutrera (huile d’olive)', icon: 'droplet', x: 274, y: 132, q: 'Frantoi Cutrera Chiaramonte Gulfi' },
  { name: 'Pépinières (plantes & fleurs)', icon: 'leaf', x: 372, y: 296, q: 'vivaio Scicli' },
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

const LABEL = {
  top: { dx: 0, dy: -14, anchor: 'middle' as const },
  bottom: { dx: 0, dy: 22, anchor: 'middle' as const },
  left: { dx: -13, dy: 5, anchor: 'end' as const },
  right: { dx: 13, dy: 5, anchor: 'start' as const },
};

export default function LocalMap({ houseLabel }: { houseLabel: string }) {
  return (
    <svg
      viewBox="0 0 1000 560"
      className="block h-auto w-full"
      role="img"
      aria-label="Carte illustrée du sud-est de la Sicile"
      style={{ fontFamily: 'inherit' }}
    >
      <defs>
        <linearGradient id="cava-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6e0" />
          <stop offset="1" stopColor="#a7ccc4" />
        </linearGradient>
        <linearGradient id="cava-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2ece1" />
          <stop offset="1" stopColor="#eae1d1" />
        </linearGradient>
      </defs>

      {/* Mer */}
      <rect x="0" y="0" width="1000" height="560" fill="url(#cava-sea)" />

      {/* Vaguelettes décoratives dans la mer */}
      <g fill="none" stroke="#7fb4ab" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <path d="M120 470c14-9 26-9 40 0s26 9 40 0" />
        <path d="M700 430c14-9 26-9 40 0s26 9 40 0" />
        <path d="M840 300c14-9 26-9 40 0s26 9 40 0" />
        <path d="M520 500c14-9 26-9 40 0s26 9 40 0" />
      </g>

      {/* Terre */}
      <path
        d="M-30 -30 H1030 V150 C940 156 890 190 856 240 C802 322 742 352 662 376 C602 398 540 401 460 408 C400 412 340 406 290 413 C210 424 120 426 40 431 C10 432 -10 431 -30 433 Z"
        fill="url(#cava-land)"
        stroke="var(--cava-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Routes suggérées (pointillés) */}
      <g fill="none" stroke="#c19a76" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" opacity="0.85">
        <path d="M408 380 L405 315 L480 235 L700 255 L892 132" />
        <path d="M405 315 L305 205 L235 112" />
        <path d="M408 380 L290 388 L150 400" />
        <path d="M408 380 L535 362 L606 346" />
      </g>

      {/* Points cliquables */}
      {PLACES.map((p) => {
        const l = LABEL[p.lp];
        return (
          <a key={p.name} href={maps(p.q)} target="_blank" rel="noopener noreferrer" className="cava-mappin">
            {/* zone de clic élargie */}
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
            {p.house && <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="var(--cava-pink)" strokeWidth="1.6" opacity="0.55" />}
            <circle
              className="dot"
              cx={p.x}
              cy={p.y}
              r={p.house ? 6.5 : 5}
              fill="var(--cava-pink)"
              stroke="var(--cava-bg)"
              strokeWidth="2"
            />
            <text
              x={p.x + l.dx}
              y={p.y + l.dy}
              textAnchor={l.anchor}
              fontSize={p.house ? 17 : 15}
              fontWeight={p.house ? 700 : 500}
              fill={p.house ? 'var(--cava-pink)' : 'var(--cava-ink)'}
              style={{ paintOrder: 'stroke', stroke: 'var(--cava-bg)', strokeWidth: 4, strokeLinejoin: 'round' }}
            >
              {p.name}
            </text>
            <text
              x={p.x + l.dx}
              y={p.y + l.dy + 16}
              textAnchor={l.anchor}
              fontSize="11.5"
              fontWeight="600"
              fill={p.house ? 'var(--cava-pink)' : 'var(--cava-muted)'}
              style={{ paintOrder: 'stroke', stroke: 'var(--cava-bg)', strokeWidth: 4, strokeLinejoin: 'round', letterSpacing: '0.03em' }}
            >
              {p.house ? houseLabel : `≈ ${p.km} km`}
            </text>
          </a>
        );
      })}

      {/* Producteurs / adresses locales — marqueur terracotta + picto */}
      {LOCALS.map((s) => (
        <a key={s.q} href={maps(s.q)} target="_blank" rel="noopener noreferrer" className="cava-mappin" aria-label={s.name}>
          <circle cx={s.x} cy={s.y} r="16" fill="transparent" />
          <g className="dot" transform={`translate(${s.x} ${s.y})`}>
            <rect x="-10" y="-10" width="20" height="20" rx="6" fill="var(--cava-terra)" />
          </g>
          <svg
            x={s.x - 7}
            y={s.y - 7}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--cava-bg)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICON_PATHS[s.icon]}
          </svg>
        </a>
      ))}

      {/* Légende */}
      <g transform="translate(696 424)">
        <rect width="256" height="94" rx="14" fill="var(--cava-bg)" stroke="var(--cava-line)" strokeWidth="1.5" opacity="0.97" />
        {/* Villages */}
        <circle cx="24" cy="26" r="6" fill="var(--cava-pink)" stroke="var(--cava-bg)" strokeWidth="2" />
        <text x="42" y="30" fontSize="13.5" fill="var(--cava-ink)">
          Villages
        </text>
        {/* Producteurs locaux */}
        <rect x="15" y="45" width="18" height="18" rx="5" fill="var(--cava-terra)" />
        <text x="42" y="59" fontSize="13.5" fill="var(--cava-ink)">
          Producteurs locaux
        </text>
        {/* À venir */}
        <text x="17" y="82" fontSize="11.5" fontStyle="italic" fill="var(--cava-muted)">
          + d’autres bonnes adresses à venir
        </text>
      </g>

      {/* Boussole */}
      <g transform="translate(58 486)" opacity="0.75">
        <circle r="24" fill="none" stroke="var(--cava-ink)" strokeWidth="1.5" />
        <path d="M0 -18 L5 0 L0 18 L-5 0 Z" fill="var(--cava-pink)" />
        <text y="-27" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--cava-ink)">
          N
        </text>
      </g>

      {/* Petit soleil */}
      <g transform="translate(930 70)" stroke="var(--cava-pink)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8">
        <circle r="12" fill="var(--cava-pink)" stroke="none" />
        <path d="M0 -22V-16M0 16V22M-22 0h6M16 0h6M-15.5 -15.5l4.2 4.2M11.3 11.3l4.2 4.2M15.5 -15.5l-4.2 4.2M-11.3 11.3l-4.2 4.2" />
      </g>
    </svg>
  );
}
