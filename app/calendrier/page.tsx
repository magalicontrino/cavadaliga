'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import { useI18n } from '../i18n';

// ─────────────────────────────────────────────────────────────────────────
// Périodes d'occupation de la maison — FACILES À METTRE À JOUR ici.
// Dates incluses [start ; end] au format 'AAAA-MM-JJ'.
// tentative: true → affiché en ocre (« à confirmer »).
// ─────────────────────────────────────────────────────────────────────────
type Stay = { label: string; start: string; end: string; tentative?: boolean };
const STAYS: Stay[] = [
  { label: 'Manon, Alex, Régine et Mag', start: '2026-07-04', end: '2026-07-14' },
  { label: 'Sœur de Maria Assunta', start: '2026-07-15', end: '2026-07-28' },
  { label: 'Angèle Contrino', start: '2026-07-30', end: '2026-08-07' },
  { label: 'Eve', start: '2026-08-20', end: '2026-09-01' },
  { label: 'Wk juju mamie', start: '2026-09-17', end: '2026-09-21', tentative: true },
  { label: 'Mag +++', start: '2026-09-22', end: '2026-10-01' },
  { label: 'Marie & Guillaume', start: '2026-10-17', end: '2026-11-01' },
];

// Mois affichés : [année, mois 0-indexé].
const MONTHS: [number, number][] = [
  [2026, 6], [2026, 7], [2026, 8], [2026, 9], [2026, 10],
];

const LOCALES: Record<string, string> = { it: 'it-IT', fr: 'fr-FR', en: 'en-GB' };
const OCCUPIED = '#4a8a6f';
const TENTATIVE = '#c0894a';

const ymd = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const stayForDate = (d: Date) => {
  const v = ymd(d);
  return STAYS.findIndex((s) => v >= ymd(parse(s.start)) && v <= ymd(parse(s.end)));
};

// Semaines du mois (lundi en premier), cellule = Date ou null (débord).
function monthWeeks(year: number, month: number): (Date | null)[][] {
  const startCol = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// Segments d'occupation d'une semaine : runs contigus d'un même séjour.
type Seg = { stayIndex: number; start: number; end: number };
function weekSegments(week: (Date | null)[]): Seg[] {
  const segs: Seg[] = [];
  let cur: Seg | null = null;
  week.forEach((d, col) => {
    const si = d ? stayForDate(d) : -1;
    if (si >= 0 && cur && cur.stayIndex === si) {
      cur.end = col;
    } else {
      if (cur) segs.push(cur);
      cur = si >= 0 ? { stayIndex: si, start: col, end: col } : null;
    }
  });
  if (cur) segs.push(cur);
  return segs;
}

export default function Calendrier() {
  const { t, lang } = useI18n();
  const c = t.calendarPage;
  const locale = LOCALES[lang] ?? 'fr-FR';
  // En-têtes de jours (lun..dim). 2024-01-01 est un lundi.
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 1 + i)),
  );

  return (
    <main>
      <Nav current="/calendrier" />

      <PageHeader title={c.title} intro={c.intro} />

      <section className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        {/* Légende */}
        <Reveal className="mb-10 flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: 'var(--cava-muted)' }}>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: OCCUPIED }} />
            {c.legend.occupied}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: TENTATIVE }} />
            {c.legend.tentative}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border" style={{ borderColor: 'var(--cava-line)' }} />
            {c.legend.free}
          </span>
        </Reveal>

        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          {MONTHS.map(([y, m]) => {
            const weeks = monthWeeks(y, m);
            const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(y, m, 1));
            return (
              <Reveal key={`${y}-${m}`} className="flex flex-col gap-3">
                <h2 className="text-[clamp(1.2rem,2.4vw,1.6rem)] capitalize leading-[1.1]" style={{ fontWeight: 500 }}>
                  {monthName}
                </h2>
                {/* En-têtes des jours */}
                <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--cava-muted)' }}>
                  {weekdays.map((w, i) => (
                    <div key={i} className="py-1">
                      {w}
                    </div>
                  ))}
                </div>
                {/* Semaines : n° du jour puis barre d'occupation */}
                <div className="flex flex-col gap-1.5">
                  {weeks.map((week, wi) => (
                    <div key={wi}>
                      <div className="grid grid-cols-7 text-center text-[13px]">
                        {week.map((d, di) => (
                          <div key={di} className="py-0.5" style={{ color: d ? 'var(--cava-ink)' : 'transparent' }}>
                            {d ? d.getDate() : '.'}
                          </div>
                        ))}
                      </div>
                      <div className="grid min-h-[20px] grid-cols-7 gap-x-1">
                        {weekSegments(week).map((seg, si) => {
                          const stay = STAYS[seg.stayIndex];
                          return (
                            <div
                              key={si}
                              style={{
                                gridColumn: `${seg.start + 1} / ${seg.end + 2}`,
                                background: stay.tentative ? TENTATIVE : OCCUPIED,
                              }}
                              className="truncate rounded-full px-2 py-0.5 text-center text-[11px] leading-tight text-white"
                              title={stay.label}
                            >
                              {stay.label}
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

      <Footer />
    </main>
  );
}
