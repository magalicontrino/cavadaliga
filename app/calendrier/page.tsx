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

// ─────────────────────────────────────────────────────────────────────────
// Fêtes siciliennes & événements — À COMPLÉTER ici (une ligne = un jour).
// label = nom court affiché ; city = lieu (dans l'infobulle et la liste).
// ─────────────────────────────────────────────────────────────────────────
type Event = { date: string; label: string; city?: string };
const EVENTS: Event[] = [
  { date: '2026-08-15', label: 'Ferragosto', city: 'partout' },
  { date: '2026-08-16', label: 'San Rocco', city: 'Scicli' },
  { date: '2026-08-29', label: 'San Giovanni', city: 'Raguse' },
  { date: '2026-08-30', label: 'San Corrado', city: 'Noto' },
];

// ─────────────────────────────────────────────────────────────────────────
// Programme « Sotto il cielo di Bruca — Estate 2026 » — événements à venir.
// Source : Instagram @brucasenzafrontiere (couleurs reprises de leur calendrier).
// ─────────────────────────────────────────────────────────────────────────
type ProgramEvent = { dates: string[]; color: string; title: string; type: string; time: string; place: string; film?: string };
const PROGRAM: ProgramEvent[] = [
  { dates: ['2026-07-16'], color: '#4a8a6f', title: "Passi d'amare", type: 'Soirée dansante & danses de groupe', time: '21h30', place: 'Piazza Morana' },
  { dates: ['2026-07-22'], color: '#4f9dc4', title: 'Cinemàre', film: 'La Planète au trésor', type: 'Cinéma en plein air', time: '21h30', place: 'Piazza Morana' },
  { dates: ['2026-07-24'], color: '#d98b3f', title: 'Il Matrimonio', type: 'Spectacle folklorique', time: '21h30', place: 'Piazza Morana' },
  { dates: ['2026-07-29'], color: '#4f9dc4', title: 'Cinemàre', film: 'Retour vers le futur', type: 'Cinéma en plein air', time: '21h30', place: 'Plage de Bruca' },
  { dates: ['2026-08-05'], color: '#4f9dc4', title: 'Cinemàre', film: 'Titre à venir', type: 'Cinéma en plein air', time: '21h30', place: 'Piazza Morana' },
  { dates: ['2026-08-08', '2026-08-09'], color: '#c0453f', title: 'Bruca Senza Frontiere', type: '3ᵉ Memorial Pippo Puglisi · jeux sur la plage', time: 'Toute la journée', place: 'Plage de Bruca' },
  { dates: ['2026-08-13'], color: '#4a8a6f', title: "Passi d'amare", type: 'Soirée dansante & danses de groupe', time: '21h30', place: 'Piazza Morana' },
  { dates: ['2026-08-21'], color: '#8a5aa8', title: 'Bruca Party', type: 'The Mazers (live) & DJ set', time: '21h30', place: 'Piazza Morana' },
];

// Comptes à suivre (liens ajoutés au fur et à mesure).
type Social = { label: string; handle: string; url: string };
const SOCIALS: Social[] = [
  { label: 'Bruca Senza Frontiere', handle: '@brucasenzafrontiere', url: 'https://www.instagram.com/brucasenzafrontiere/' },
  { label: 'Comitato Bruca', handle: '@comitato.bruca', url: 'https://www.instagram.com/comitato.bruca/' },
];

// Mois affichés : [année, mois 0-indexé].
const MONTHS: [number, number][] = [
  [2026, 6], [2026, 7], [2026, 8], [2026, 9], [2026, 10],
];

const LOCALES: Record<string, string> = { it: 'it-IT', fr: 'fr-FR', en: 'en-GB' };
const OCCUPIED = '#4a8a6f';
const TENTATIVE = '#c0894a';
const TENTATIVE_LIGHT = '#d7a066';
// Rayures diagonales = « en attente » (deux tons d'ocre).
const stripes = (w: number) =>
  `repeating-linear-gradient(-45deg, ${TENTATIVE} 0 ${w}px, ${TENTATIVE_LIGHT} ${w}px ${w * 2}px)`;

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

// Fêtes tombant dans une semaine → { label, city, col }.
function weekEvents(week: (Date | null)[]) {
  const out: { label: string; city?: string; col: number }[] = [];
  week.forEach((d, col) => {
    if (!d) return;
    const v = ymd(d);
    EVENTS.filter((e) => ymd(parse(e.date)) === v).forEach((e) => out.push({ label: e.label, city: e.city, col }));
  });
  return out;
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
            <span className="h-3 w-3 rounded-full" style={{ background: stripes(3) }} />
            {c.legend.tentative}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: 'var(--cava-pink)' }} />
            {c.legend.festival}
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
                                background: stay.tentative ? stripes(6) : OCCUPIED,
                              }}
                              className={`truncate rounded-full px-2 py-0.5 text-center text-[11px] leading-tight text-white ${
                                stay.tentative ? 'ring-1 ring-inset ring-white/70' : ''
                              }`}
                              title={stay.tentative ? `${stay.label} — ${c.legend.tentative}` : stay.label}
                            >
                              {stay.label}
                            </div>
                          );
                        })}
                      </div>
                      {weekEvents(week).length > 0 && (
                        <div className="mt-0.5 grid grid-cols-7 gap-x-1">
                          {weekEvents(week).map((ev, ei) => (
                            <div
                              key={ei}
                              style={{ gridColumn: `${ev.col + 1}`, background: 'var(--cava-pink)' }}
                              className="truncate rounded-full px-1.5 py-0.5 text-center text-[10px] leading-tight text-white"
                              title={`${ev.label}${ev.city ? ` — ${ev.city}` : ''}`}
                            >
                              {ev.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Événements à venir — programme « Sotto il cielo di Bruca » */}
        <Reveal className="mt-16">
          <h2 className="text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {c.programTitle}
          </h2>
          <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
            {c.programNote}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAM.map((ev) => (
              <div
                key={ev.dates[0]}
                className="flex flex-col gap-2 rounded-2xl border p-6"
                style={{ borderColor: 'var(--cava-line)', borderLeftColor: ev.color, borderLeftWidth: 4 }}
              >
                <span className="text-[12px] uppercase tracking-[0.08em]" style={{ color: ev.color, fontWeight: 600 }}>
                  {ev.dates.map((d) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(parse(d))).join(' · ')} · {ev.time}
                </span>
                <h3 className="text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                  {ev.title}
                  {ev.film && (
                    <span style={{ fontWeight: 400, fontStyle: 'italic' }}> — {ev.film}</span>
                  )}
                </h3>
                <p className="text-[14px] leading-[1.4]" style={{ color: 'var(--cava-muted)' }}>{ev.type}</p>
                <p className="text-[13px]" style={{ color: 'var(--cava-muted)' }}>{ev.place}</p>
              </div>
            ))}
          </div>
          <a
            href="https://www.instagram.com/brucasenzafrontiere/"
            target="_blank"
            rel="noopener noreferrer"
            className="cava-navlink mt-6 inline-block text-[13px] uppercase tracking-[0.14em]"
            style={{ color: 'var(--cava-muted)' }}
          >
            {c.programMore} — @brucasenzafrontiere ↗
          </a>
        </Reveal>

        {/* Réseaux à suivre */}
        <Reveal className="mt-16">
          <h2 className="text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {c.socialsTitle}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cava-pill inline-flex items-center gap-2 px-5 py-2.5 text-[14px]"
              >
                {s.label}
                <span style={{ color: 'var(--cava-muted)' }}>{s.handle}</span>
                <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </Reveal>

        {/* Récapitulatif des fêtes siciliennes */}
        {EVENTS.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="mb-6 flex items-center gap-2 text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: 'var(--cava-pink)' }} />
              {c.festivalsTitle}
            </h2>
            <ul className="flex flex-col gap-2">
              {EVENTS.map((e) => (
                <li key={e.date} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                  <span className="min-w-[7rem] capitalize" style={{ color: 'var(--cava-ink)' }}>
                    {new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(parse(e.date))}
                  </span>
                  <span>
                    {e.label}
                    {e.city ? ` — ${e.city}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </section>

      <Footer />
    </main>
  );
}
