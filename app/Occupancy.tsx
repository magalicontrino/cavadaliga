'use client';

import Reveal from './Reveal';
import { useI18n } from './i18n';

// ─────────────────────────────────────────────────────────────────────────
// QUI EST A LA MAISON — c'est ICI qu'on met a jour, et nulle part ailleurs.
//
// Dates INCLUSES, du premier au dernier jour du sejour, au format AAAA-MM-JJ.
// `tentative: true` → affiche en ocre, « a confirmer ».
//
// Les grilles se dessinent toutes seules a partir de MOIS : ajouter un sejour
// en novembre demande d'ajouter novembre a la liste, sinon il ne s'affichera
// nulle part.
// ─────────────────────────────────────────────────────────────────────────
type Sejour = { label: string; start: string; end: string; tentative?: boolean };

const SEJOURS: Sejour[] = [
  { label: 'Manon, Alex, Régine et Mag', start: '2026-07-04', end: '2026-07-14' },
  { label: 'Katia Asaro, sœur de Maria Assunta', start: '2026-07-15', end: '2026-07-28' },
  { label: 'Angèle +++', start: '2026-07-30', end: '2026-08-08' },
  { label: 'Eve', start: '2026-08-20', end: '2026-09-01' },
  { label: 'Wk juju mamie', start: '2026-09-17', end: '2026-09-21', tentative: true },
  { label: 'Mag +++', start: '2026-09-22', end: '2026-10-01' },
  { label: 'Marie & Guillaume', start: '2026-10-17', end: '2026-11-01' },
];

/** Mois montres : [annee, mois 0-indexe]. Juillet = 6. */
const MOIS: [number, number][] = [
  [2026, 6],
  [2026, 7],
  [2026, 8],
  [2026, 9],
  [2026, 10],
];

const LOCALES: Record<string, string> = { it: 'it-IT', fr: 'fr-FR', en: 'en-GB' };

/*
 * LES COULEURS DES JOURS — le dessin que Mag a montre : chaque jour est une
 * case pleine, et c'est la couleur qui repond, pas une barre posee par-dessus.
 *
 * On lit un calendrier d'occupation en CHERCHANT LE VIDE. L'ancienne version
 * posait le nom des occupants en travers des semaines : elle disait tres bien
 * qui etait la, et tres mal quand la maison ne l'etait pas — il fallait
 * repasser sur les jours sans barre pour s'en assurer. La couleur inverse le
 * geste : le libre se voit d'un coup d'oeil, a l'echelle de cinq mois.
 *
 * Les teintes sont TRES pales — 14 % — parce qu'elles portent un chiffre. Un
 * aplat franc obligerait a passer le texte en blanc, et un chiffre blanc sur
 * rose pale ne se lit pas. A cette pate, l'encre du site tient son contraste.
 */
const OCCUPE = 'rgba(230, 41, 111, 0.13)';
const A_CONFIRMER = 'rgba(192, 137, 74, 0.22)';
const LIBRE = 'rgba(90, 150, 110, 0.14)';
/** Les pastilles de la legende : pleines, elles, pour se voir a 12 px. */
const PLEIN = { occupe: '#e6296f', confirmer: '#c0894a', libre: '#5a966e' };

const ymd = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const lire = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const sejourDuJour = (d: Date) => {
  const v = ymd(d);
  return SEJOURS.findIndex((s) => v >= ymd(lire(s.start)) && v <= ymd(lire(s.end)));
};

/** Les semaines du mois, lundi en tete. Cellule vide = debord du mois voisin. */
function semainesDuMois(annee: number, mois: number): (Date | null)[][] {
  const premiereColonne = (new Date(annee, mois, 1).getDay() + 6) % 7;
  const jours = new Date(annee, mois + 1, 0).getDate();
  const cases: (Date | null)[] = [];
  for (let i = 0; i < premiereColonne; i++) cases.push(null);
  for (let d = 1; d <= jours; d++) cases.push(new Date(annee, mois, d));
  while (cases.length % 7 !== 0) cases.push(null);
  const semaines: (Date | null)[][] = [];
  for (let i = 0; i < cases.length; i += 7) semaines.push(cases.slice(i, i + 7));
  return semaines;
}

/** Les sejours qui touchent ce mois, dans l'ordre ou ils commencent. */
function sejoursDuMois(annee: number, mois: number) {
  const premier = ymd(new Date(annee, mois, 1));
  const dernier = ymd(new Date(annee, mois + 1, 0));
  return SEJOURS.map((s, i) => ({ s, i })).filter(
    ({ s }) => ymd(lire(s.end)) >= premier && ymd(lire(s.start)) <= dernier,
  );
}

/**
 * Le calendrier d'occupation — « la maison est libre quand ? ».
 *
 * C'est la question qu'on se pose le plus souvent en famille. Elle a sa page a
 * elle, /calendrier, atteignable par le picto de la barre du haut. Le composant
 * ne porte donc PAS de titre : PageHeader s'en charge, et le repeter l'ecrirait
 * deux fois.
 */
export default function Occupancy() {
  const { t, lang } = useI18n();
  const c = t.stayPage;
  const locale = LOCALES[lang] ?? 'fr-FR';
  // Les initiales des jours. Le 1er janvier 2024 etait un lundi : on part de la.
  const jours = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 1 + i)),
  );
  /*
   * AUJOURD'HUI est calcule au rendu, donc cote serveur a la construction PUIS
   * cote navigateur. Les deux peuvent tomber de part et d'autre de minuit, et
   * React refuserait la page pour une pastille. On ne s'en sert donc que pour
   * comparer des jours entiers, jamais pour un rendu conditionnel avant
   * l'hydratation : la case existe toujours, seule sa bordure change.
   */
  const aujourdhui = ymd(new Date());

  const jourFormat = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });

  return (
    <section className="mx-auto max-w-[110rem] px-5 pb-16 md:px-10">
      <Reveal className="mb-10 flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: 'var(--cava-muted)' }}>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.occupe }} />
          {c.legend.occupied}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.confirmer }} />
          {c.legend.tentative}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: PLEIN.libre }} />
          {c.legend.free}
        </span>
      </Reveal>

      {/* Trois mois par rangee sur grand ecran, comme le modele. */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {MOIS.map(([y, m]) => {
          const semaines = semainesDuMois(y, m);
          const nomDuMois = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(y, m, 1));
          return (
            <Reveal
              key={`${y}-${m}`}
              className="flex flex-col gap-4 rounded-2xl border p-5 md:p-6"
              style={{ borderColor: 'var(--cava-line)' }}
            >
              <h3 className="text-center text-[clamp(1rem,1.6vw,1.15rem)] capitalize leading-[1.1]" style={{ fontWeight: 700 }}>
                {nomDuMois}
              </h3>

              <div className="grid grid-cols-7 text-center text-[11px]" style={{ color: 'var(--cava-muted)' }}>
                {jours.map((j, i) => (
                  <div key={i} className="pb-1 capitalize">
                    {j}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {semaines.flat().map((d, di) => {
                  if (!d) return <div key={di} aria-hidden />;
                  const si = sejourDuJour(d);
                  const s = si >= 0 ? SEJOURS[si] : null;
                  const passe = ymd(d) < aujourdhui;
                  const cejour = ymd(d) === aujourdhui;
                  return (
                    <div
                      key={di}
                      /*
                       * Le titre porte le PRENOM : le dessin de Mag ne montre
                       * que des couleurs, mais ici savoir QUI est la vaut
                       * autant que savoir que c'est pris. La liste sous la
                       * grille le dit en clair — ceci n'est que le raccourci.
                       */
                      title={s ? `${s.label} — ${jourFormat.format(lire(s.start))} → ${jourFormat.format(lire(s.end))}` : undefined}
                      className="flex aspect-square items-center justify-center rounded-[10px] text-[13px]"
                      style={{
                        // Le passe ne dit plus rien d'utile : « libre » sur une
                        // date ecoulee est une information morte, et le vert la
                        // ferait lire comme une occasion.
                        background: passe ? 'transparent' : s ? (s.tentative ? A_CONFIRMER : OCCUPE) : LIBRE,
                        color: passe ? 'var(--cava-line)' : 'var(--cava-ink)',
                        fontWeight: cejour ? 800 : 500,
                        border: cejour ? '1.5px solid var(--cava-ink)' : '1.5px solid transparent',
                      }}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>

              {/*
                QUI, ET QUAND. C'est ce que la couleur ne peut pas dire, et
                c'etait tout l'interet de l'ancienne version : on la garde, en
                liste sous le mois plutot qu'en barres au travers. Un mois sans
                personne n'affiche rien — mieux qu'un titre suivi du vide.
              */}
              {sejoursDuMois(y, m).length > 0 && (
                <ul className="flex flex-col gap-1.5 border-t pt-3 text-[12.5px] leading-[1.45]" style={{ borderColor: 'var(--cava-line)' }}>
                  {sejoursDuMois(y, m).map(({ s, i }) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: s.tentative ? PLEIN.confirmer : PLEIN.occupe }}
                      />
                      <span>
                        <span style={{ fontWeight: 600 }}>{s.label}</span>{' '}
                        <span style={{ color: 'var(--cava-muted)' }}>
                          {jourFormat.format(lire(s.start))} → {jourFormat.format(lire(s.end))}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
