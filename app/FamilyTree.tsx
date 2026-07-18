'use client';

import { useState } from 'react';
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
// Le nom de Mag : « Mag » PARTOUT sur le site — sauf ici, dans le couple
// « Magali Contrino & Benoît Vanbastelaer », qu'elle a explicitement autorisé :
// c'est là qu'on nomme les gens comme les autres couples de l'arbre. Sa case
// d'enfant, sous Salvatore & Régine, reste « Mag ». N'étendez pas l'exception.
// ─────────────────────────────────────────────────────────────────────────
type Person = { name: string; subtitle?: string; children?: Person[] };
type Family = { fam: Person; gen: number };
type Side = { label: string; lignee: Lignee; families: Family[] };

/**
 * La couleur dit D'OU L'ON VIENT, en partant du pere.
 *
 * Deux lignees se rencontrent dans cet arbre : les Contrino, de Sicile, du cote
 * de Salvatore ; les Lux et les Thurot, de France, du cote de Regine. Chacune a
 * sa teinte — terre cuite pour l'une, bleu ardoise pour l'autre — et l'on voit
 * d'un coup d'oeil de quel bord vient quelqu'un.
 *
 * La ou elles se rejoignent, sur la carte de Salvatore & Regine, la couleur
 * change : c'est le rose du site, celui de la famille qui nait de ces deux-la.
 * Leurs enfants et petits-enfants le portent a leur tour.
 *
 * Dans chaque lignee, la teinte s'eclaircit a mesure qu'on descend les
 * generations : le plus fonce est le plus ancien.
 */
type Lignee = 'pere' | 'mere' | 'nous';
const LIGNEES: Record<Lignee, string[]> = {
  pere: ['#8c3b3b', '#a85a5a', '#bd7f7f', '#cfa1a1'],
  mere: ['#3f5d7a', '#5b7c9c', '#84a0b8', '#a8bccd'],
  nous: ['#b31456', '#d0206a', '#e35c92', '#ee92b5'],
};
const teinte = (l: Lignee, gen: number) => LIGNEES[l][Math.min(gen, LIGNEES[l].length - 1)];
/** Le nom reste lisible : il ne prend jamais les deux teintes les plus claires. */
const encre = (l: Lignee, gen: number) => LIGNEES[l][Math.min(gen, 1)];

function Card({ p, gen, lignee }: { p: Person; gen: number; lignee: Lignee }) {
  const placeholder = p.name.startsWith('…');
  return (
    <span
      className={`inline-flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 ${placeholder ? 'border-dashed' : ''}`}
      style={{
        border: `1.5px solid ${placeholder ? 'var(--cava-line)' : teinte(lignee, gen)}`,
        background: 'var(--cava-bg)',
        color: placeholder ? 'var(--cava-muted)' : encre(lignee, gen),
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

function Node({ p, gen, lignee }: { p: Person; gen: number; lignee: Lignee }) {
  return (
    <li>
      <Card p={p} gen={gen} lignee={lignee} />
      {p.children && p.children.length > 0 && (
        <ul>
          {p.children.map((c) => (
            <Node key={c.name} p={c} gen={gen + 1} lignee={lignee} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Une famille qu'on deplie — ou pas.
 *
 * Repliee, elle ne montre que le couple et le nombre d'enfants : l'arbre entier
 * tient alors sous les yeux, et c'est tout l'interet. Depliee, elle rend sa
 * descendance. Le bouton porte l'etat pour les lecteurs d'ecran (aria-expanded)
 * et le chevron tourne — deux facons de dire la meme chose.
 *
 * Une famille SANS enfant connu n'a rien a deplier : elle s'affiche seule, sans
 * bouton, plutot qu'un bouton qui n'ouvrirait sur rien.
 */
function Famille({
  fam,
  gen,
  lignee,
  ouvert,
  onBascule,
  labels,
}: {
  fam: Person;
  gen: number;
  lignee: Lignee;
  ouvert: boolean;
  onBascule: () => void;
  labels: { open: string; close: string; kid: string; kids: string };
}) {
  const enfants = fam.children?.length ?? 0;
  if (!enfants) {
    return (
      <div className="cava-tree overflow-x-auto pb-4">
        <ul>
          <Node p={fam} gen={gen} lignee={lignee} />
        </ul>
      </div>
    );
  }
  return (
    <div>
      {/* Le texte revient a la ligne, et le bouton ne depasse jamais son
          conteneur : sans cela, « Pierre Lux & Angelina Viseux » et ses deux
          paires de dates faisaient 444 px de large sur un ecran de 409. */}
      <div className="flex justify-center px-1">
        <button
          type="button"
          onClick={onBascule}
          aria-expanded={ouvert}
          className="cava-treetoggle inline-flex max-w-full items-center gap-3 rounded-xl px-4 py-2 text-left transition"
          style={{ border: `1.5px solid ${teinte(lignee, gen)}`, background: 'var(--cava-bg)', color: encre(lignee, gen) }}
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[14px] leading-[1.25]" style={{ fontWeight: 600 }}>
              {fam.name}
            </span>
            <span className="text-[11px] uppercase leading-[1.35] tracking-[0.1em]" style={{ color: 'var(--cava-muted)' }}>
              {fam.subtitle ? `${fam.subtitle} · ` : ''}
              {enfants} {enfants > 1 ? labels.kids : labels.kid}
            </span>
          </span>
          <span
            aria-hidden
            className="shrink-0 text-[13px] transition-transform duration-300"
            style={{ transform: ouvert ? 'rotate(180deg)' : 'none' }}
          >
            ▾
          </span>
          <span className="sr-only">{ouvert ? labels.close : labels.open}</span>
        </button>
      </div>

      {ouvert && (
        <div className="cava-tree mt-4 overflow-x-auto pb-4">
          <ul>
            {/* Deplie, on redessine l'arbre complet : le couple redevient une
                carte ordinaire, avec ses branches sous lui. */}
            <Node p={fam} gen={gen} lignee={lignee} />
          </ul>
        </div>
      )}
    </div>
  );
}

export default function FamilyTree() {
  const { t, lang } = useI18n();
  const s = t.salvaPage;

  /**
   * Quelles familles sont depliees. Toutes repliees au depart : c'est ce que
   * Mag demandait — la vue d'ensemble d'abord, le detail a la demande. Une clef
   * par bloc, l'index seul ne suffirait pas (les deux cotes se renumerotent).
   */
  const [ouverts, setOuverts] = useState<Record<string, boolean>>({});
  const bascule = (cle: string) => setOuverts((o) => ({ ...o, [cle]: !o[cle] }));
  const labels = { open: s.treeOpen, close: s.treeClose, kid: s.treeKid, kids: s.treeKids };

  const SIDES: Side[] = [
    {
      label: s.treePaternal,
      lignee: 'pere',
      families: [
        {
          gen: 0,
          fam: {
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
        } },
        {
          gen: 1,
          fam: {
          // Helene apparait deja comme fille de Salvatore & Giuseppina ci-dessus ;
          // ici c'est sa propre branche. Son mari reste inconnu (dans les
          // questions). Cinq filles, un surnom pour trois d'entre elles.
          name: 'Helene Contrino',
          children: [
            { name: 'Maria' },
            { name: 'Angelina Contrino & Patrick Gamino', subtitle: 'Angèle' },
            { name: 'Antoinette' },
            { name: 'Rosalba', subtitle: 'Rose' },
            { name: 'Giuseppina', subtitle: 'Jo' },
          ],
        } },
        {
          gen: 1,
          fam: {
          name: 'Angelo Contrino & Conchetta Canolo',
          subtitle: `${s.treeWife1} · ~1900 – ~1947`,
          children: [{ name: 'Salvatore', subtitle: '1947' }],
        } },
        {
          gen: 1,
          fam: {
          name: 'Angelo Contrino & Conchetta Sberna',
          subtitle: s.treeWife2,
          children: [{ name: 'Josephine' }, { name: 'Sarro' }, { name: 'Stefano' }],
        } },
      ],
    },
    {
      label: s.treeMaternal,
      lignee: 'mere',
      families: [
        {
          gen: 0,
          fam: {
          name: 'Pierre Lux & Angelina Viseux',
          subtitle: `${s.treeGreat} · 1881–1975 · 1882–1959`,
          children: [{ name: 'Pierre', subtitle: '1920' }],
        } },
        {
          gen: 0,
          fam: {
          name: 'Louis Thurot & Mélanie Souveton',
          subtitle: `${s.treeGreat} · 1893`,
          children: [{ name: 'Juliette Emilienne', subtitle: '1923' }],
        } },
        {
          gen: 1,
          fam: {
          name: 'Pierre Lux & Juliette Emilienne Thurot',
          subtitle: s.treeMarriage1,
          children: [{ name: 'Régine' }],
        } },
        // Le second mariage de Juliette. « Tonton Charles » est le nom que la
        // famille lui donne — c'est le seul qu'on ait, et on n'en invente pas.
        {
          gen: 1,
          fam: {
          name: 'Juliette Emilienne Thurot & Charles',
          subtitle: s.treeMarriage2,
          },
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
    { name: 'Magali Contrino & Benoît Vanbastelaer', children: [{ name: 'Eve' }, { name: 'Manon' }] },
  ];

  // Toutes les clefs de bloc, pour le « tout deplier » : les deux cotes, les
  // parents, et chaque famille d'enfants.
  const TOUTES = [
    ...SIDES.flatMap((side) => side.families.map(({ fam }, i) => `${side.label}-${fam.name}-${i}`)),
    'parents',
    ...ENFANTS.map((f) => f.name),
  ];
  const toutOuvert = TOUTES.every((c) => ouverts[c]);

  return (
    <div className="flex flex-col gap-14">
      {/* La legende des couleurs, et la commande d'ensemble. Sans legende, le
          code couleur se devine ; avec, il se lit. */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px]" style={{ color: 'var(--cava-muted)' }}>
          {([
            ['pere', s.treeSideFather],
            ['mere', s.treeSideMother],
            ['nous', s.treeSideUs],
          ] as [Lignee, string][]).map(([l, texte]) => (
            <span key={l} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: teinte(l, 0) }} />
              {texte}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setOuverts(toutOuvert ? {} : Object.fromEntries(TOUTES.map((c) => [c, true])))
          }
          className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
        >
          {toutOuvert ? s.treeCloseAll : s.treeOpenAll}
        </button>
      </div>

      <div className="flex flex-col gap-14">
        {SIDES.map((side) => (
          <div key={side.label}>
            <p className="mb-5 text-center text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)' }}>
              {side.label}
            </p>
            <div className="flex flex-col gap-8">
              {side.families.map(({ fam, gen }, i) => {
                const cle = `${side.label}-${fam.name}-${i}`;
                return (
                  <Famille
                    key={cle}
                    fam={fam}
                    gen={gen}
                    lignee={side.lignee}
                    ouvert={!!ouverts[cle]}
                    onBascule={() => bascule(cle)}
                    labels={labels}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* La jonction des deux côtés */}
      <div>
        <p className="mb-5 text-center text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)' }}>
          {s.treeParents}
        </p>
        {/* Salvatore & Regine : la ou les deux lignees se rejoignent. La carte
            change donc de couleur — c'est le rose du site, celui de la famille
            qui nait d'eux. */}
        <Famille
          fam={PARENTS}
          gen={0}
          lignee="nous"
          ouvert={!!ouverts.parents}
          onBascule={() => bascule('parents')}
          labels={labels}
        />
      </div>

      {/* Et leurs enfants */}
      <div>
        <p className="mb-5 text-center text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-muted)' }}>
          {s.treeChildren}
        </p>
        <div className="flex flex-col gap-8">
          {ENFANTS.map((f) => (
            <Famille
              key={f.name}
              fam={f}
              gen={1}
              lignee="nous"
              ouvert={!!ouverts[f.name]}
              onBascule={() => bascule(f.name)}
              labels={labels}
            />
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
        {/* Numerotees, et grandes : ce sont des questions posees a quelqu'un,
            pas des notes de bas de page. */}
        <ol className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2">
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
    fr: 'Le mari d’Helene Contrino, et ceux de ses filles Maria, Antoinette, Rose et Jo (celui d’Angèle, on le sait : Patrick Gamino).',
    it: 'Il marito di Helene Contrino, e quelli delle figlie Maria, Antoinette, Rose e Jo (quello di Angèle lo sappiamo: Patrick Gamino).',
    en: 'Helene Contrino’s husband, and those of her daughters Maria, Antoinette, Rose and Jo (Angèle’s we know: Patrick Gamino).',
  },
  {
    fr: 'Le premier mari de Lucia Contrino, le père de Giuseppe et Salvatore. Le second, on le sait : Dolciamore, le père de Tino.',
    it: 'Il primo marito di Lucia Contrino, il padre di Giuseppe e Salvatore. Il secondo lo sappiamo: Dolciamore, il padre di Tino.',
    en: 'Lucia Contrino’s first husband, father of Giuseppe and Salvatore. The second one we know: Dolciamore, Tino’s father.',
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
