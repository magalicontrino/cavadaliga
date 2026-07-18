'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Occupancy from '../Occupancy';
import Icon from '../Icon';
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

// Lien Google Maps + requêtes précises par lieu (nom local pour bien trouver).
const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const PLACE_MAP: Record<string, string> = {
  'Piazza Morana': 'Piazza Morana, Bruca, Scicli',
  'Plage de Bruca': 'Spiaggia di Bruca, Scicli',
};

// ─────────────────────────────────────────────────────────────────────────
// Fêtes siciliennes & événements — À COMPLÉTER ici (une ligne = un jour).
// label = nom court affiché ; city = lieu (dans l'infobulle et la liste).
// ─────────────────────────────────────────────────────────────────────────
// Descriptions traduites dans app/i18n.tsx (c.festivalDescs, même ordre).
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

const LOCALES: Record<string, string> = { it: 'it-IT', fr: 'fr-FR', en: 'en-GB' };
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
/** Le dernier jour d'un evenement : c'est lui qui decide s'il est passe. Une
 *  fete sur deux jours reste a l'affiche pendant les deux. */
const finit = (ev: { dates: string[] }) => ev.dates.map(jour).sort().at(-1) ?? 0;
const jour = (s: string) => Number(s.replaceAll('-', ''));

export default function Calendrier() {
  const { t, lang } = useI18n();
  const c = t.calendarPage;
  const locale = LOCALES[lang] ?? 'fr-FR';

  /**
   * Un evenement termine disparait — et il faut le decider dans le NAVIGATEUR,
   * pas au build.
   *
   * Cette page est fabriquee une fois, quand on publie. Filtrer a ce moment-la
   * figerait « aujourd'hui » au jour de la publication : le programme
   * repourrirait des le lendemain, sans que personne ne s'en apercoive.
   *
   * D'ou l'etat : au premier rendu on ne sait pas encore quel jour on est — le
   * serveur et le navigateur doivent dessiner la meme chose, sinon React
   * proteste. On montre tout, puis on retire le passe des que le navigateur a
   * dit la date. Le fondu des Reveal couvre l'echange.
   */
  const [aujourdhui, setAujourdhui] = useState<number | null>(null);
  useEffect(() => {
    const d = new Date();
    setAujourdhui(d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate());
  }, []);
  const aVenir = aujourdhui === null ? PROGRAM : PROGRAM.filter((ev) => finit(ev) >= aujourdhui);

  return (
    <main>
      <Nav current="/evenements" />

      <PageHeader title={c.title} intro={c.intro} />

      {/* Qui est a la maison, d'abord : c'est la question qu'on se pose le plus
          souvent en famille. Les fetes du village viennent apres. */}
      <Occupancy />

      <section className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        {/* Le programme « Sotto il cielo di Bruca ». Sans titre de section : la
            page entiere s'appelle « Evenements a venir » depuis que le
            calendrier d'occupation en est parti. */}
        <Reveal>
          <p className="max-w-[62ch] text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
            {c.programNote}
          </p>
          {aVenir.length === 0 && (
            <p className="mt-8 text-[15px] italic leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
              {c.programDone}
            </p>
          )}
          <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {aVenir.map((ev) => (
              <div
                key={ev.dates[0]}
                className="flex flex-col gap-2 rounded-2xl border-2 p-6"
                style={{ borderColor: 'var(--cava-ink)', background: 'var(--cava-bg)', boxShadow: '6px 6px 0 var(--cava-pink)' }}
              >
                <span className="flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--cava-ink)' }}>
                  <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: 'var(--cava-ink)' }} />
                  {ev.dates.map((d) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(parse(d))).join(' · ')}
                </span>
                <h3 className="mt-1 text-[clamp(1.1rem,2vw,1.5rem)] uppercase leading-[1.05]" style={{ fontWeight: 800 }}>
                  {ev.title}
                  {ev.film && <span className="italic" style={{ fontWeight: 400 }}> — {ev.film}</span>}
                </h3>
                <p className="font-mono text-[12px] uppercase tracking-[0.03em]" style={{ color: 'var(--cava-muted)' }}>{ev.type}</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={mapsUrl(PLACE_MAP[ev.place] ?? ev.place)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase underline-offset-2 hover:underline"
                    style={{ color: 'var(--cava-ink)' }}
                  >
                    <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
                      <Icon name="pin" size={14} />
                    </span>
                    {ev.place}
                  </a>
                  <span
                    className="rounded-md font-mono text-[13px] uppercase tracking-[0.04em]"
                    style={{ background: 'var(--cava-pink)', color: 'var(--cava-ink)', padding: '4px 10px', fontWeight: 700 }}
                  >
                    {ev.time}
                  </span>
                </div>
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
            <h2 className="mb-8 flex items-center gap-3 text-[clamp(2.2rem,8vw,5rem)] uppercase leading-[0.9] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
              <span className="inline-block h-4 w-4 rounded-full" style={{ background: 'var(--cava-pink)' }} />
              {c.festivalsTitle}
            </h2>
            <div className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2">
              {EVENTS.map((e, i) => (
                <div key={e.date} className="border-l pl-6" style={{ borderColor: 'var(--cava-ink)' }}>
                  <p className="text-[14px] uppercase tracking-[0.12em]" style={{ fontWeight: 700 }}>{e.label}</p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-muted)' }}>
                    {new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(parse(e.date))}
                    {e.city ? ` — ${e.city}` : ''}
                  </p>
                  {c.festivalDescs[i] && (
                    <p className="mt-6 text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>{c.festivalDescs[i]}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </section>

      <Footer />
    </main>
  );
}
