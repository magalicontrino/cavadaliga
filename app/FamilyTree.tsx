'use client';

// ─────────────────────────────────────────────────────────────────────────
// Arbre généalogique — en cours de construction avec les vrais membres.
// Chaque personne : { name, years?, children? }. Les deux « côtés » (paternel /
// maternel) se rejoindront via la génération des parents (à compléter).
// Plus tard : ces données pourront venir d'un Google Sheet partagé.
// ─────────────────────────────────────────────────────────────────────────
type Person = { name: string; years?: string; children?: Person[] };

const SIDES: { label: string; root: Person }[] = [
  {
    label: 'Grands-parents paternels',
    root: {
      name: 'Concetta & Angelo',
      children: [{ name: 'Salvatore' }, { name: 'Stefano' }, { name: 'Rosario' }],
    },
  },
  {
    label: 'Grands-parents maternels',
    root: {
      name: 'Juliette Galoi & Lux',
      children: [{ name: 'Régine' }],
    },
  },
];

function Card({ p }: { p: Person }) {
  const placeholder = p.name.startsWith('…');
  return (
    <span
      className={`inline-flex flex-col items-center gap-0.5 rounded-xl border-2 px-4 py-2 ${placeholder ? 'border-dashed' : ''}`}
      style={{
        borderColor: placeholder ? 'var(--cava-line)' : 'var(--cava-ink)',
        background: 'var(--cava-bg)',
        color: placeholder ? 'var(--cava-muted)' : 'inherit',
      }}
    >
      <span className="whitespace-nowrap text-[14px]" style={{ fontWeight: placeholder ? 400 : 600 }}>
        {p.name}
      </span>
      {p.years && (
        <span className="font-mono text-[11px]" style={{ color: 'var(--cava-muted)' }}>
          {p.years}
        </span>
      )}
    </span>
  );
}

function Node({ p }: { p: Person }) {
  return (
    <li>
      <Card p={p} />
      {p.children && p.children.length > 0 && (
        <ul>
          {p.children.map((c) => (
            <Node key={c.name} p={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FamilyTree() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {SIDES.map((s) => (
        <div key={s.label}>
          <p className="mb-5 text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)' }}>
            {s.label}
          </p>
          <div className="cava-tree overflow-x-auto pb-4">
            <ul>
              <Node p={s.root} />
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
