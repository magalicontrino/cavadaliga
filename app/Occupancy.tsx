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
  { label: 'Angèle', start: '2026-07-30', end: '2026-08-07' },
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
const OCCUPE = '#4a8a6f';
const A_CONFIRMER = '#c0894a';

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

/**
 * Les barres d'une semaine : les suites de jours consecutifs d'un MEME sejour.
 * Un sejour a cheval sur deux semaines donne donc deux barres, une par ligne —
 * c'est ce qui permet de les poser en grille sans les couper au milieu d'un
 * jour.
 */
type Barre = { sejour: number; debut: number; fin: number };
function barresDeLaSemaine(semaine: (Date | null)[]): Barre[] {
  const barres: Barre[] = [];
  let encours: Barre | null = null;
  semaine.forEach((d, col) => {
    const si = d ? sejourDuJour(d) : -1;
    if (si >= 0 && encours && encours.sejour === si) {
      encours.fin = col;
    } else {
      if (encours) barres.push(encours);
      encours = si >= 0 ? { sejour: si, debut: col, fin: col } : null;
    }
  });
  if (encours) barres.push(encours);
  return barres;
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

  return (
    <section className="mx-auto max-w-[110rem] px-5 pb-16 md:px-10">
      <Reveal className="mb-10 flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: 'var(--cava-muted)' }}>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: OCCUPE }} />
          {c.legend.occupied}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: A_CONFIRMER }} />
          {c.legend.tentative}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border" style={{ borderColor: 'var(--cava-line)' }} />
          {c.legend.free}
        </span>
      </Reveal>

      <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
        {MOIS.map(([y, m]) => {
          const semaines = semainesDuMois(y, m);
          const nomDuMois = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(y, m, 1));
          return (
            <Reveal key={`${y}-${m}`} className="flex flex-col gap-3">
              <h3 className="text-[clamp(1.1rem,2.2vw,1.4rem)] capitalize leading-[1.1]" style={{ fontWeight: 500 }}>
                {nomDuMois}
              </h3>

              <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--cava-muted)' }}>
                {jours.map((j, i) => (
                  <div key={i} className="py-1">
                    {j}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                {semaines.map((semaine, wi) => (
                  <div key={wi}>
                    <div className="grid grid-cols-7 text-center text-[13px]">
                      {semaine.map((d, di) => (
                        <div key={di} className="py-0.5" style={{ color: d ? 'var(--cava-ink)' : 'transparent' }}>
                          {d ? d.getDate() : '.'}
                        </div>
                      ))}
                    </div>
                    <div className="grid min-h-[20px] grid-cols-7 gap-x-1">
                      {barresDeLaSemaine(semaine).map((b, bi) => {
                        const s = SEJOURS[b.sejour];
                        return (
                          <div
                            key={bi}
                            style={{
                              gridColumn: `${b.debut + 1} / ${b.fin + 2}`,
                              background: s.tentative ? A_CONFIRMER : OCCUPE,
                            }}
                            className="truncate rounded-full px-2 py-0.5 text-center text-[11px] leading-tight text-white"
                            title={s.label}
                          >
                            {s.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
