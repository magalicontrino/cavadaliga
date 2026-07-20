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
/** Les libelles de l'arbre dans la langue lue — `t.salvaPage`. */
type Salva = ReturnType<typeof useI18n>['t']['salvaPage'];

type Person = { name: string; subtitle?: string; children?: Person[] };
type Family = { fam: Person };
type Side = { label: string; lignee: Lignee; families: Family[] };

/**
 * La couleur dit D'OU L'ON VIENT, en partant du pere.
 *
 * Deux lignees se rencontrent ici : les Contrino, de Sicile, du cote de
 * Salvatore ; les Lux et les Thurot, de France, du cote de Regine. Chacune a sa
 * couleur — le jaune du soleil pour la Sicile, le turquoise de la mer pour
 * l'autre bord. La ou elles se rejoignent, sur la carte de Salvatore & Regine,
 * c'est le rose du site : la famille qui nait d'eux, et que leurs enfants
 * portent a leur tour.
 *
 * LES COUPLES SONT PLEINS, leurs enfants en contour. La hierarchie se voit donc
 * sans lire : une pastille de couleur ouvre une branche, les cartes fines sont
 * ce qu'elle contient.
 *
 * Chaque teinte a ete choisie sur son CONTRASTE, pas seulement sur son eclat.
 * Les trois aplats portent l'ENCRE du site, jamais du blanc — c'est ce qui leur
 * permet d'etre clairs sans devenir illisibles.
 *
 * Le rose a une zone morte qu'il faut connaitre avant d'y toucher. Fonce
 * (#d92263) il porte du blanc ; pastel (#f06a9b) il porte l'encre. ENTRE LES
 * DEUX — le rose exact de la marque, #e6296f — aucun texte ne passe : 4,28 en
 * blanc, 3,21 en encre, quand il en faut 4,5. Vouloir « le rose du site » sur
 * un aplat, c'est donc choisir entre l'assombrir ou l'eclaircir ; ici on
 * l'eclaircit, a 4,73.
 * Et le trait des cartes fines est toujours plus fonce que le plein, sinon il
 * palit sur le fond creme.
 */
type Lignee = 'pere' | 'mere' | 'nous';
const LIGNEES: Record<Lignee, { plein: string; surPlein: string; trait: string; texte: string }> = {
  pere: { plein: '#ffd452', surPlein: '#2e2d2d', trait: '#e0a800', texte: '#8a6200' },
  mere: { plein: '#5fdede', surPlein: '#2e2d2d', trait: '#2ec4c4', texte: '#0b6e73' },
  nous: { plein: '#f06a9b', surPlein: '#2e2d2d', trait: '#d92263', texte: '#b81a56' },
};

/*
 * LES ENFANTS ONT LEUR PROPRE COULEUR — Mag : « les parents, les enfants
 * doivent avoir une autre couleur ».
 *
 * Ils portaient jusqu'ici la teinte de leur lignee, en contour : la meme
 * couleur que le couple, seulement plus pale. La generation ne se lisait donc
 * qu'a l'epaisseur du remplissage, ce qui est peu — et sur un arbre qui compte
 * maintenant des petits-enfants imbriques, ce peu ne suffisait plus.
 *
 * Le vert ne designe aucune des deux lignees, et c'est exactement ce qu'on
 * veut : il ne dit pas d'ou l'on vient — la position sous le couple le dit
 * deja — il dit qu'on est la generation d'apres. Un couple garde sa couleur
 * d'origine, ses enfants prennent le vert : le sens de lecture devient
 * immediat.
 *
 * Le vert fonce porte le texte a 5,9 sur le fond creme, bien au-dela des 4,5
 * demandes ; le trait est plus clair, comme pour les trois autres, sinon la
 * carte se lit comme un bouton.
 */
const ENFANT = { trait: '#6f8f5f', texte: '#3b6d11' };

function Card({ p, lignee, plein = false }: { p: Person; lignee: Lignee; plein?: boolean }) {
  const placeholder = p.name.startsWith('…');
  // Le couple garde la couleur de sa lignee ; tout ce qui descend prend le vert.
  const c = plein ? LIGNEES[lignee] : { ...LIGNEES[lignee], ...ENFANT };
  return (
    <span
      className="inline-flex flex-col items-center gap-0.5 rounded-xl px-4 py-2"
      style={{
        // Le pointille s'ecrit ICI et pas en classe : la regle `border`
        // ci-dessous est un style EN LIGNE, elle l'emportait sur la classe
        // `border-dashed` et la rendait inoperante — mesure faite, les cartes
        // vides s'affichaient en trait plein comme les autres.
        border: `1.5px ${placeholder ? 'dashed' : 'solid'} ${placeholder ? 'var(--cava-line)' : plein ? c.plein : c.trait}`,
        background: placeholder ? 'var(--cava-bg)' : plein ? c.plein : 'var(--cava-bg)',
        color: placeholder ? 'var(--cava-muted)' : plein ? c.surPlein : c.texte,
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

function Node({ p, lignee, racine = false }: { p: Person; lignee: Lignee; racine?: boolean }) {
  return (
    <li>
      <Card p={p} lignee={lignee} plein={racine} />
      {p.children && p.children.length > 0 && (
        <ul>
          {p.children.map((c) => (
            <Node key={c.name} p={c} lignee={lignee} />
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
  lignee,
  ouvert,
  onBascule,
  labels,
}: {
  fam: Person;
  lignee: Lignee;
  ouvert: boolean;
  onBascule: () => void;
  labels: { open: string; close: string; kid: string; kids: string };
}) {
  const enfants = fam.children?.length ?? 0;
  const c = LIGNEES[lignee];

  // Rien a deplier : une carte simple, sans bouton qui n'ouvrirait sur rien.
  if (!enfants) {
    return (
      <div className="cava-tree overflow-x-auto pb-4">
        <ul>
          <Node p={fam} lignee={lignee} racine />
        </ul>
      </div>
    );
  }

  return (
    <div className="cava-tree overflow-x-auto pb-4">
      <ul>
        <li>
          {/*
            Le bouton EST la carte du couple — il ne la precede pas.
            Une premiere version posait le bouton au-dessus de l'arbre : deplie,
            le nom du couple s'ecrivait deux fois de suite, une fois sur le
            bouton et une fois sur la racine. Ici la racine se replie et se
            deplie elle-meme. Le texte revient a la ligne et la carte ne depasse
            jamais son conteneur : « Pierre Lux & Angelina Viseux » et ses deux
            paires de dates faisaient 444 px sur un ecran de 409.
          */}
          <button
            type="button"
            onClick={onBascule}
            aria-expanded={ouvert}
            className="cava-treetoggle inline-flex max-w-full items-center gap-3 rounded-xl px-4 py-2 text-left align-middle transition"
            style={{ border: `1.5px solid ${c.plein}`, background: c.plein, color: c.surPlein }}
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[14px] leading-[1.25]" style={{ fontWeight: 600 }}>
                {fam.name}
              </span>
              {/* Sur un aplat de couleur, le gris du site ne se lit plus : on
                  garde l'encre du plein, juste un peu retenue. */}
              <span className="text-[11px] uppercase leading-[1.35] tracking-[0.1em] opacity-75">
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

          {ouvert && (
            <ul>
              {fam.children!.map((enfant) => (
                <Node key={enfant.name} p={enfant} lignee={lignee} />
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

/*
 * L'ARBRE, en donnees pures — hors du composant expres.
 *
 * Le quiz de cette page doit pouvoir le LIRE : sa regle est que chaque bonne
 * reponse soit ecrite quelque part sur la page, et l'arbre est justement ou
 * elle est ecrite. Recopier les prenoms et les dates dans le quiz les
 * condamnerait a diverger le jour ou Mag corrige une branche. Ici, une seule
 * source : corriger l'arbre corrige le quiz.
 *
 * Les libelles de generation viennent de `s`, donc de la langue lue — d'ou la
 * fonction plutot qu'une constante.
 */
export type Arbre = { sides: Side[]; parents: Person; enfants: Person[] };

export function arbre(s: Salva): Arbre {

const sides: Side[] = [
  {
    label: s.treePaternal,
    lignee: 'pere',
    families: [
      {
        fam: {
        name: 'Salvatore Contrino & Giuseppina Marcino',
        subtitle: s.treeGreat,
        children: [
          { name: 'Angelo' },
          { name: 'Stefano', subtitle: '1930' },
          // Joseph n'a pas eu d'enfants — Mag l'a dit expressement. C'est un
          // FAIT, pas un trou dans nos connaissances : il n'a donc rien sous
          // lui, et surtout il ne figure pas dans les questions ouvertes.
          { name: 'Joseph' },
          // Gabi a deux enfants, dont Mag ne se rappelle que le premier
          // prenom. Le second est une carte en pointilles : un blanc qu'on
          // assume vaut mieux qu'un enfant qu'on oublie de compter.
          { name: 'Gabi', children: [{ name: 'Christian' }, { name: '…' }] },
          {
            // Les deux enfants de Jacques, donnes par Mag. Meme construction
            // que pour Helene : ils descendent d'un cran sous leur parent, a
            // leur generation, plutot que d'ouvrir un bloc a part.
            name: 'Jacques',
            children: [{ name: 'Nathalie' }, { name: 'Olivier' }],
          },
          // Benito : on sait qu'une de ses filles s'appelle Ambre, sans
          // savoir combien ils sont en tout. Une seule carte en pointilles
          // dit « il y en a d'autres » sans inventer un nombre.
          { name: 'Benito', subtitle: '1943', children: [{ name: 'Ambre' }, { name: '…' }] },
          // Lucia a trois enfants de deux mariages : Salvatore et Joseph du
          // premier, Tino du second. Le nom du second mari, Dolciamore,
          // s'ecrit sous Tino — c'est le seul endroit ou il se rattache a
          // quelqu'un. Le premier mari, lui, reste une question ouverte.
          {
            name: 'Lucia',
            children: [{ name: 'Salvatore' }, { name: 'Joseph' }, { name: 'Tino', subtitle: 'Dolciamore' }],
          },
          {
            // Helene est une FILLE de Salvatore & Giuseppina, comme ses huit
            // freres et soeurs — Mag l'a corrige. Elle avait en plus son
            // propre bloc a cote du couple, ce qui la faisait lire comme une
            // grand-mere de la maison alors qu'elle en est la tante. Ses
            // cinq filles ne se perdent pas pour autant : elles descendent
            // d'un cran, a leur vraie place.
            name: 'Helene',
            children: [
              { name: 'Maria' },
              { name: 'Angelina Contrino & Patrick Gamino', subtitle: 'Angèle' },
              { name: 'Antoinette' },
              { name: 'Rosalba', subtitle: 'Rose' },
              { name: 'Giuseppina', subtitle: 'Jo' },
            ],
          },
          // Maria a « plusieurs gosses », dont aucun prenom ne nous est
          // parvenu. Une carte en pointilles, et la question posee plus bas.
          { name: 'Maria', children: [{ name: '…' }] },
        ],
      } },
      {
        fam: {
        name: 'Angelo Contrino & Conchetta Canolo',
        subtitle: `${s.treeWife1} · ~1900 – ~1947`,
        children: [{ name: 'Salvatore', subtitle: '1947' }],
      } },
      {
        fam: {
        name: 'Angelo Contrino & Conchetta Sberna',
        subtitle: s.treeWife2,
        // « Sarro » etait une faute : un seul r. Et « Saro » est le diminutif —
        // le prenom est Rosario. Meme convention que Rosalba dite Rose ou
        // Giuseppina dite Jo : le prenom en titre, le surnom dessous.
        children: [{ name: 'Josephine' }, { name: 'Rosario', subtitle: 'Saro' }, { name: 'Stefano' }],
      } },
    ],
  },
  {
    label: s.treeMaternal,
    lignee: 'mere',
    families: [
      /*
       * ══ LES ASCENDANTS D'ANGELINA VISEUX, jusqu'a 1702 ══
       *
       * Quinze couples, remontes du releve que Mag a envoye. C'est de loin la
       * plus vieille branche du site : la precedente s'arretait a Augustin
       * Viseux, ne en 1853.
       *
       * ILS SONT RANGES DU PLUS ANCIEN AU PLUS RECENT, a rebours de la lecture
       * habituelle. C'est ce que la structure impose — chaque carte montre son
       * ENFANT, donc lire de haut en bas, c'est descendre le temps. Jean
       * Baptiste Viseux ouvre, Angelina ferme.
       *
       * LA COHERENCE A ETE VERIFIEE AVANT LA SAISIE, couple par couple : aucun
       * enfant ne nait apres la mort d'un parent, aucun mariage avant quinze
       * ans, aucune naissance avant son mariage. Deux meres sortent du lot
       * sans etre impossibles — Marie Barbe de Rollencourt a 42 ans et Agnes
       * Isabelle Decoupigny a 41 — et elles sont ecrites telles que le releve
       * les donne.
       *
       * LES NOTATIONS DU RELEVE SONT TRADUITES, pas recopiees. « ca 1702-/1764 »
       * ne veut rien dire pour qui lit cette page : ça devient « vers 1702 –
       * avant 1764 », dans les trois langues. Le « † » seul — pose sur Pierre
       * Timothee Joseph Duquesnoy — est simplement omis : dire d'un homme ne
       * vers 1700 qu'il est mort n'apprend rien a personne.
       *
       * DEUX FAMILLES LAURENT SE CROISENT ici sans etre parentes, a deux
       * siecles et deux branches d'ecart : Marie Anne Joseph Laurent (vers
       * 1705) du cote Viseux, et Philippe Albert Laurent (vers 1723) du cote
       * Guilluy. C'est une homonymie, pas un lien — ne les rapprochez pas.
       */
      {
        fam: {
        name: 'Jean Baptiste Viseux & Marie Anne Joseph Laurent',
        subtitle: `${s.treeGen8} · ${s.treeAbout} 1702 – ${s.treeBefore} 1764 · ${s.treeAbout} 1705 – ${s.treeBefore} 1764 · ${s.treeWedAbout} 1729`,
        children: [{ name: 'Antoine Joseph', subtitle: '1737–1821' }],
      } },
      {
        fam: {
        name: 'Pierre Timothée Joseph Duquesnoy & Marie Anne Démaré',
        subtitle: `${s.treeGen8} · ${s.treeBefore} 1764`,
        children: [{ name: 'Marie Alexandrine Joseph', subtitle: '1738–1825' }],
      } },
      {
        fam: {
        name: 'Raimond Decoupigny & Marie Guislaine Fressin',
        subtitle: `${s.treeGen8} · ${s.treeAbout} 1703–1781`,
        children: [{ name: 'Louis', subtitle: '1737–1806' }],
      } },
      {
        fam: {
        name: 'Adrien Carpentier & Marie Thérèse Lefèbvre',
        subtitle: `${s.treeGen8} · ${s.treeAbout} 1701–1765 · 1699–1767 · ${s.treeWed} 1723`,
        children: [{ name: 'Marie Agnès', subtitle: '1733' }],
      } },
      {
        fam: {
        name: 'Denis Fréville & Marie Catherine Cresson',
        subtitle: s.treeGen8,
        children: [{ name: 'Jean Baptiste', subtitle: '1756–1831' }],
      } },
      {
        fam: {
        name: 'Jean Nicolas Guilluy & Marie Barbe de Rollencourt',
        subtitle: `${s.treeGen8} · ${s.treeAbout} 1718–1771 · ${s.treeAbout} 1718 – ${s.treeAfter} 1782 · ${s.treeWed} 1743`,
        children: [{ name: 'Jean Baptiste', subtitle: '1760–1825' }],
      } },
      {
        fam: {
        name: 'Philippe Albert Laurent & Marie Monique Caillot',
        subtitle: `${s.treeGen8} · ${s.treeAbout} 1723–1778 · ${s.treeAbout} 1725–1788 · ${s.treeWed} 1745`,
        children: [{ name: 'Augustine', subtitle: '1758–1832' }],
      } },
      {
        fam: {
        name: 'Antoine Joseph Viseux & Marie Alexandrine Joseph Duquesnoy',
        subtitle: `${s.treeGen7} · 1737–1821 · 1738–1825 · ${s.treeWed} 1764`,
        children: [{ name: 'Léonard', subtitle: '1771–1841' }],
      } },
      {
        fam: {
        name: 'Louis Decoupigny & Marie Agnès Carpentier',
        subtitle: `${s.treeGen7} · 1737–1806 · 1733 · ${s.treeWed} 1769`,
        children: [{ name: 'Agnès Isabelle', subtitle: '1771–1832' }],
      } },
      {
        fam: {
        name: 'Jean Baptiste Fréville & Eugénie Joseph Coyez',
        subtitle: `${s.treeGen7} · 1756–1831 · 1759–1837 · ${s.treeWed} 1780`,
        children: [{ name: 'Martin Louis', subtitle: '1791–1861' }],
      } },
      {
        fam: {
        name: 'Jean Baptiste Guilluy & Augustine Laurent',
        subtitle: `${s.treeGen7} · 1760–1825 · 1758–1832 · ${s.treeWed} 1782`,
        children: [{ name: 'Amandine', subtitle: '1792–1844' }],
      } },
      {
        fam: {
        name: 'Léonard Viseux & Agnès Isabelle Decoupigny',
        subtitle: `${s.treeGen6} · 1771–1841 · 1771–1832 · ${s.treeWed} 1800`,
        children: [{ name: 'Pierre Antoine', subtitle: '1812–1854' }],
      } },
      {
        fam: {
        name: 'Martin Louis Fréville & Amandine Guilluy',
        subtitle: `${s.treeGen6} · 1791–1861 · 1792–1844 · ${s.treeWed} 1812`,
        children: [{ name: 'Rosalie', subtitle: '1817–1904' }],
      } },
      {
        fam: {
        name: 'Pierre Antoine Viseux & Rosalie Fréville',
        subtitle: `${s.treeGen5} · 1812–1854 · 1817–1904 · ${s.treeWed} 1843`,
        children: [{ name: 'Augustin', subtitle: '1853–1899' }],
      } },
      {
        fam: {
        name: 'Louis Joseph Wasson & Marie Joseph Gernez',
        subtitle: `${s.treeGen5} · 1814 · 1828`,
        children: [{ name: 'Flore Marie', subtitle: '1860–1944' }],
      } },
      /*
       * La generation d'avant, relevee par Mag sur son arbre en ligne. Elle
       * ouvre le cote Lux d'un cran de plus : les parents de Pierre (1881) et
       * ceux d'Angelina (1882).
       *
       * LES DATES DU COTE VISEUX SONT ARRIVEES, celles du cote Lux non — et
       * c'est pour ça que la question d'en bas n'a pas disparu, elle a
       * retreci. Mag a envoye les ascendants d'Angelina Viseux : Augustin
       * (1853-1899) et Flore Marie Wasson (1860-1944) y sont dates. Henri Lux
       * et Angelique Bourg, eux, n'y figurent pas — ce releve ne remonte que
       * la branche d'Angelina. Ils restent donc « on les sait decedes, rien de
       * plus », et la question ne demande plus qu'eux.
       *
       * Le prenom complet de Flore vient du meme releve : « Flore Marie
       * Wasson ». L'arbre ecrivait « Flore Wasson ».
       */
      {
        fam: {
        name: 'Henri Lux & Angélique Bourg',
        subtitle: s.treeGreat2,
        children: [{ name: 'Pierre', subtitle: '1881–1975' }],
      } },
      {
        fam: {
        name: 'Augustin Viseux & Flore Marie Wasson',
        subtitle: `${s.treeGreat2} · 1853–1899 · 1860–1944 · ${s.treeWed} 1880`,
        children: [{ name: 'Angelina', subtitle: '1882–1959' }],
      } },
      {
        fam: {
        name: 'Pierre Lux & Angelina Viseux',
        subtitle: `${s.treeGreat} · 1881–1975 · 1882–1959`,
        children: [{ name: 'Pierre', subtitle: '1920–2007' }],
      } },
      {
        fam: {
        name: 'Louis Thurot & Mélanie Souveton',
        subtitle: `${s.treeGreat} · 1893 · 1898–1981`,
        children: [{ name: 'Juliette Emilienne', subtitle: '1923–2015' }],
      } },
      {
        fam: {
        name: 'Pierre Lux & Juliette Emilienne Thurot',
        subtitle: s.treeMarriage1,
        children: [{ name: 'Régine' }],
      } },
      // Le second mariage de Juliette. Longtemps « tonton Charles » tout court,
      // faute de mieux : Mag a donne son nom, et la question qui le demandait
      // a quitte « Ce qu'il nous manque ».
      {
        fam: {
        name: 'Juliette Emilienne Thurot & Charles Gallois',
        subtitle: s.treeMarriage2,
        },
      },
    ],
  },
];

// Les deux côtés se rejoignent ici — c'est ce que l'arbre attendait depuis le
// début. Prénoms seuls pour cette génération : ils sont vivants, et le site
// est ouvert à tous.
const parents: Person = {
  name: 'Salvatore Contrino & Régine Lux',
  children: [{ name: 'David' }, { name: 'Michaël' }, { name: 'Mag' }],
};

// La generation suivante. Prenoms seuls, sans annees : le releve les porte,
// mais certaines sont mineures et le site est ouvert a tous. Et « Mag » reste
// « Mag », meme quand la demande ecrit son nom entier — c'est la regle.
const enfants: Person[] = [
  { name: 'Michaël Contrino & Nathalie Gigli', children: [{ name: 'Juliette' }, { name: 'Marie' }, { name: 'Zoé' }] },
  { name: 'Magali Contrino & Benoît Vanbastelaer', children: [{ name: 'Eve' }, { name: 'Manon' }] },
];

  return { sides, parents, enfants };
}

/*
 * L'arbre APLATI en phrases — la matiere ou le quiz va chercher ses extraits.
 *
 * Une phrase par famille : le couple, sa generation, puis ses enfants avec
 * leurs annees. C'est volontairement telegraphique — ce n'est pas de la prose
 * a lire, c'est le texte ou `extraitPour` pioche la ligne qui porte la
 * reponse. Les cartes en pointilles sont sautees : « … » ne repond a rien.
 */
export function texteArbre(s: Salva): string {
  const { sides, parents, enfants } = arbre(s);
  const dit = (p: Person) => (p.subtitle ? `${p.name} (${p.subtitle})` : p.name);
  const phrase = (fam: Person, ou: string) => {
    const kids = (fam.children ?? []).filter((c) => !c.name.startsWith('\u2026'));
    const suite = kids.length
      ? ` — ${kids.length} ${kids.length > 1 ? s.treeKids : s.treeKid} : ${kids
          .map((c) => `${dit(c)}${(c.children ?? []).filter((x) => !x.name.startsWith('\u2026')).length ? ` (${(c.children ?? []).filter((x) => !x.name.startsWith('\u2026')).map(dit).join(', ')})` : ''}`)
          .join(', ')}`
      : '';
    return `${ou} : ${dit(fam)}${suite}.`;
  };
  return [
    ...sides.flatMap((side) => side.families.map((f) => phrase(f.fam, side.label))),
    phrase(parents, s.treeParents),
    ...enfants.map((f) => phrase(f, s.treeChildren)),
  ].join(' ');
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

  // L'arbre vient d'`arbre(s)`, plus d'ici : c'est la meme source que celle ou
  // le quiz de la page va chercher ses extraits.
  const { sides: SIDES, parents: PARENTS, enfants: ENFANTS } = arbre(s);

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
              <span className="h-3 w-3 rounded-full" style={{ background: LIGNEES[l].plein }} />
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
              {side.families.map(({ fam }, i) => {
                const cle = `${side.label}-${fam.name}-${i}`;
                return (
                  <Famille
                    key={cle}
                    fam={fam}
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
    fr: 'Le premier mari de Lucia Contrino, le père de Joseph et Salvatore. Le second, on le sait : Dolciamore, le père de Tino.',
    it: 'Il primo marito di Lucia Contrino, il padre di Joseph e Salvatore. Il secondo lo sappiamo: Dolciamore, il padre di Tino.',
    en: 'Lucia Contrino’s first husband, father of Joseph and Salvatore. The second one we know: Dolciamore, Tino’s father.',
  },
  {
    fr: 'Le prénom du second enfant de Gabi Contrino — le premier, c’est Christian.',
    it: 'Il nome del secondo figlio di Gabi Contrino — il primo è Christian.',
    en: 'The name of Gabi Contrino’s second child — the first is Christian.',
  },
  {
    fr: 'Les enfants de Benito Contrino : combien ils sont, et leurs prénoms. On sait qu’une de ses filles s’appelle Ambre.',
    it: 'I figli di Benito Contrino: quanti sono e come si chiamano. Sappiamo che una delle figlie si chiama Ambre.',
    en: 'Benito Contrino’s children: how many, and their names. We know one of his daughters is called Ambre.',
  },
  {
    fr: 'Les enfants de Maria Contrino : elle en a plusieurs, mais aucun prénom ne nous est parvenu.',
    it: 'I figli di Maria Contrino: ne ha diversi, ma nessun nome ci è arrivato.',
    en: 'Maria Contrino’s children: she has several, but no name has reached us.',
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
    fr: 'Les dates d’Henri Lux et Angélique Bourg, les parents de Pierre. On les sait décédés, rien de plus — celles d’Augustin Viseux et Flore Marie Wasson, elles, nous sont arrivées.',
    it: 'Le date di Henri Lux e Angélique Bourg, i genitori di Pierre. Sappiamo che sono morti, nulla di più — quelle di Augustin Viseux e Flore Marie Wasson, invece, ci sono arrivate.',
    en: 'The dates of Henri Lux and Angélique Bourg, Pierre’s parents. We know they have died, nothing more — Augustin Viseux’s and Flore Marie Wasson’s, on the other hand, have reached us.',
  },
  {
    fr: 'La date de décès de Louis Thurot, mort à Saint-Étienne : on a sa naissance, en 1893, mais pas sa fin.',
    it: 'La data di morte di Louis Thurot, morto a Saint-Étienne: abbiamo la sua nascita, nel 1893, ma non la sua fine.',
    en: 'Louis Thurot’s date of death, who died in Saint-Étienne: we have his birth, in 1893, but not his end.',
  },
];
