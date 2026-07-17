'use client';

import { useI18n } from './i18n';

// ─────────────────────────────────────────────────────────────────────────
// Arbre généalogique — vrais membres, repris du relevé généalogique de Mag.
//
// Les prénoms et les noms sont des données (pas traduits) ; seuls les libellés
// descriptifs passent par i18n.
//
// Deux pièges de lecture, et je suis tombé dans le premier :
//   • Le relevé liste les gens en « Nom Prénom » (« Lux Pierre », « Thurot
//     Juliette Emilienne »), alors que ses phrases disent « Prénom Nom »
//     (« fils de Pierre Lux et Angelina Viseux »). Ici on écrit comme on parle :
//     Pierre Lux. Régine est née Lux.
//   • Il y a DEUX Pierre Lux, le père (1881-1975) et le fils (1920). Celui qui
//     épouse Juliette Thurot est le fils.
//
// Ce qui manque est en bas de page, et c'est voulu : une case vide n'est pas un
// oubli, c'est une question posée à ceux qui savent.
//
// Ne JAMAIS écrire le nom complet de Mag : « Mag », et rien d'autre.
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
        <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-muted)' }}>
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
  const { t, lang } = useI18n();
  const s = t.salvaPage;

  const SIDES: Side[] = [
    {
      label: s.treePaternal,
      families: [
        {
          name: 'Salvatore Contrino & Giuseppina Marcino',
          subtitle: s.treeGreat,
          children: [
            { name: 'Angelo' },
            { name: 'Stefano', subtitle: '1930' },
            { name: 'Joseph' },
            { name: 'Gabi' },
            { name: 'Jacques' },
            { name: 'Benito', subtitle: '1943' },
            { name: 'Lucia' },
            { name: 'Helene' },
            { name: 'Maria' },
          ],
        },
        {
          name: 'Angelo Contrino & Conchetta Canolo',
          subtitle: `${s.treeWife1} · ~1900 – ~1947`,
          children: [{ name: 'Salvatore', subtitle: '1947' }],
        },
        {
          name: 'Angelo Contrino & Conchetta Sberna',
          subtitle: s.treeWife2,
          children: [{ name: 'Josephine' }, { name: 'Sarro' }, { name: 'Stefano' }],
        },
      ],
    },
    {
      label: s.treeMaternal,
      families: [
        {
          name: 'Pierre Lux & Angelina Viseux',
          subtitle: `${s.treeGreat} · 1881–1975 · 1882–1959`,
          children: [{ name: 'Pierre', subtitle: '1920' }],
        },
        {
          name: 'Louis Thurot & Mélanie Souveton',
          subtitle: `${s.treeGreat} · 1893`,
          children: [{ name: 'Juliette Emilienne', subtitle: '1923' }],
        },
        {
          name: 'Pierre Lux & Juliette Emilienne Thurot',
          subtitle: s.treeMarriage1,
          children: [{ name: 'Régine' }],
        },
        // Le second mariage de Juliette. « Tonton Charles » est le nom que la
        // famille lui donne — c'est le seul qu'on ait, et on n'en invente pas.
        {
          name: 'Juliette Emilienne Thurot & Charles',
          subtitle: s.treeMarriage2,
        },
      ],
    },
  ];

  // Les deux côtés se rejoignent ici — c'est ce que l'arbre attendait depuis le
  // début. Prénoms seuls pour cette génération : ils sont vivants, et le site
  // est ouvert à tous.
  const PARENTS: Person = {
    name: 'Salvatore Contrino & Régine Lux',
    children: [{ name: 'David' }, { name: 'Michaël' }, { name: 'Mag' }],
  };

  // La generation suivante. Prenoms seuls, sans annees : le releve les porte,
  // mais certaines sont mineures et le site est ouvert a tous. Et « Mag » reste
  // « Mag », meme quand la demande ecrit son nom entier — c'est la regle.
  const ENFANTS: Person[] = [
    { name: 'Michaël Contrino & Nathalie Gigli', children: [{ name: 'Juliette' }, { name: 'Marie' }, { name: 'Zoé' }] },
    { name: 'Mag & Benoît Vanbastelaer', children: [{ name: 'Eve' }, { name: 'Manon' }] },
  ];

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-14">
        {SIDES.map((side) => (
          <div key={side.label}>
            <p className="mb-5 text-center text-[12px] uppercase tracking-[0.12em] md:text-left" style={{ color: 'var(--cava-muted)' }}>
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

      {/* La jonction des deux côtés */}
      <div>
        <p className="mb-5 text-center text-[12px] uppercase tracking-[0.12em] md:text-left" style={{ color: 'var(--cava-muted)' }}>
          {s.treeParents}
        </p>
        <div className="cava-tree overflow-x-auto pb-4">
          <ul>
            <Node p={PARENTS} />
          </ul>
        </div>
      </div>

      {/* Et leurs enfants */}
      <div>
        <p className="mb-5 text-center text-[12px] uppercase tracking-[0.12em] md:text-left" style={{ color: 'var(--cava-muted)' }}>
          {s.treeChildren}
        </p>
        <div className="flex flex-col gap-8">
          {ENFANTS.map((f) => (
            <div key={f.name} className="cava-tree overflow-x-auto pb-4">
              <ul>
                <Node p={f} />
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Ce qui manque — en bas, et nommé. Une case vide ne dit rien ; une
          question posée peut trouver sa réponse. */}
      <div className="rounded-3xl border-2 px-6 py-14 md:px-14 md:py-20" style={{ borderColor: 'var(--cava-ink)' }}>
        <h3
          className="max-w-[16ch] text-[clamp(1.8rem,4.4vw,3.2rem)] uppercase leading-[0.95] tracking-[-0.02em]"
          style={{ fontWeight: 900 }}
        >
          {s.treeQuestionsTitle.split(' ').slice(0, -1).join(' ')}{' '}
          <span
            className="inline-block whitespace-nowrap rounded-full border-2 px-4 pb-1 pt-0.5 leading-none"
            style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-pink)' }}
          >
            {s.treeQuestionsTitle.split(' ').at(-1)}
          </span>
        </h3>
        <p className="mt-6 max-w-[62ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.65]" style={{ color: 'var(--cava-muted)' }}>
          {s.treeQuestionsNote}
        </p>
        {/* Numerotees, et grandes : ce sont des questions posees a quelqu'un,
            pas des notes de bas de page. */}
        <ol className="mt-12 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {QUESTIONS.map((q, i) => (
            <li key={q.fr} className="flex items-baseline gap-4 border-t pt-5" style={{ borderColor: 'var(--cava-line)' }}>
              <span className="shrink-0 font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[clamp(0.95rem,1.35vw,1.1rem)] leading-[1.5]">{q[lang]}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Ce que le relevé laisse en blanc — les « ? ? » et les dates absentes. Chaque
// ligne est une question à quelqu'un de la famille, pas un défaut du site.
const QUESTIONS: { fr: string; it: string; en: string }[] = [
  {
    fr: 'Les dates d’Angelo Contrino, et celles de ses parents Salvatore et Giuseppina.',
    it: 'Le date di Angelo Contrino e quelle dei suoi genitori Salvatore e Giuseppina.',
    en: 'Angelo Contrino’s dates, and those of his parents Salvatore and Giuseppina.',
  },
  {
    fr: 'Les dates de Conchetta Sberna, la seconde épouse d’Angelo.',
    it: 'Le date di Conchetta Sberna, la seconda moglie di Angelo.',
    en: 'The dates of Conchetta Sberna, Angelo’s second wife.',
  },
  {
    fr: 'Le mari d’Helene Contrino — et celui de ses filles Angelina, Antoinette, Josephine et Rosalba.',
    it: 'Il marito di Helene Contrino — e quello delle figlie Angelina, Antoinette, Josephine e Rosalba.',
    en: 'Helene Contrino’s husband — and those of her daughters Angelina, Antoinette, Josephine and Rosalba.',
  },
  {
    fr: 'Les deux maris de Lucia Contrino.',
    it: 'I due mariti di Lucia Contrino.',
    en: 'Lucia Contrino’s two husbands.',
  },
  {
    fr: 'Le mari de Maria Contrino, et celui de Lara Contrino.',
    it: 'Il marito di Maria Contrino e quello di Lara Contrino.',
    en: 'Maria Contrino’s husband, and Lara Contrino’s.',
  },
  {
    fr: 'Le nom de famille de Sophie, l’épouse de Gabi Contrino.',
    it: 'Il cognome di Sophie, la moglie di Gabi Contrino.',
    en: 'The surname of Sophie, Gabi Contrino’s wife.',
  },
  {
    fr: 'Le nom de famille de Charles — « tonton Charles », le second mari de Juliette Thurot.',
    it: 'Il cognome di Charles — « zio Charles », il secondo marito di Juliette Thurot.',
    en: 'The surname of Charles — “uncle Charles”, Juliette Thurot’s second husband.',
  },
  {
    fr: 'Les dates de Louis Thurot, de Mélanie Souveton, de Pierre Lux et de Juliette Thurot.',
    it: 'Le date di Louis Thurot, Mélanie Souveton, Pierre Lux e Juliette Thurot.',
    en: 'The dates of Louis Thurot, Mélanie Souveton, Pierre Lux and Juliette Thurot.',
  },
];
