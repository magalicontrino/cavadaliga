'use client';

import { useI18n } from './i18n';

// ─────────────────────────────────────────────────────────────────────────
// Arbre généalogique — vrais membres. Les prénoms sont des données (pas
// traduits) ; seuls les libellés descriptifs passent par i18n.
// Côté paternel : Angelo a eu deux épouses, toutes deux prénommées Concetta.
//   • 1ʳᵉ Concetta → Salvatore
//   • 2ᵉ Concetta → Stefano, Saro, Pina (demi-frères/sœur de Salvatore)
// Les deux « côtés » se rejoindront via la génération des parents (à venir).
// Plus tard : ces données pourront venir d'un Google Sheet partagé.
// ─────────────────────────────────────────────────────────────────────────
type Person = { name: string; subtitle?: string; children?: Person[] };
type Side = { label: string; families: Person[] };

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
      {p.subtitle && (
        <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-muted)' }}>
          {p.subtitle}
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
  const { t } = useI18n();
  const s = t.salvaPage;

  const SIDES: Side[] = [
    {
      label: s.treePaternal,
      families: [
        { name: 'Angelo & Concetta', subtitle: s.treeWife1, children: [{ name: 'Salvatore' }] },
        {
          name: 'Angelo & Concetta',
          subtitle: s.treeWife2,
          children: [{ name: 'Stefano' }, { name: 'Saro' }, { name: 'Pina' }],
        },
      ],
    },
    {
      label: s.treeMaternal,
      // Les noms viennent de Mag : Juliette Thurot, et Lux Pierre — « Galoi »
      // etait faux, et Lux n'avait pas son nom. On n'invente rien ici.
      families: [{ name: 'Juliette Thurot & Lux Pierre', children: [{ name: 'Régine' }] }],
    },
  ];

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {SIDES.map((side) => (
        <div key={side.label}>
          <p className="mb-5 text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)' }}>
            {side.label}
          </p>
          <div className="flex flex-col gap-8">
            {side.families.map((fam, i) => (
              <div key={`${fam.name}-${i}`} className="cava-tree overflow-x-auto pb-4">
                <ul>
                  <Node p={fam} />
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
