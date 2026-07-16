'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import Icon from './Icon';
import { useI18n } from './i18n';
import { WASTE, WEEK, mondayIndex } from './wasteData';

/**
 * Tri des déchets — le calendrier de la semaine.
 *
 * L'info vraiment utile n'est pas le tableau : c'est « qu'est-ce que je sors
 * ce soir ? ». On répond donc à ça d'abord, en gros, puis la semaine complète
 * dessous.
 *
 * Le jour est calculé côté navigateur : en rendu statique le serveur ne sait
 * pas quel jour il est chez le visiteur. On part donc de « rien de mis en
 * avant » et on complète après le montage — sinon React signalerait une
 * différence entre le HTML servi et l'affichage.
 */
export default function WasteSchedule() {
  const { t, lang } = useI18n();
  const w = t.wastePage;
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => setToday(mondayIndex(new Date())), []);

  const tomorrow = today === null ? null : (today + 1) % 7;
  const tonight = today === null ? null : WASTE[WEEK[today]];
  const next = tomorrow === null ? null : WASTE[WEEK[tomorrow]];

  return (
    <section className="mx-auto max-w-[110rem] px-5 pt-8 md:px-10">
      <Reveal className="mb-8 flex flex-col gap-2">
        <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
          <Icon name="trash" size={16} /> {w.eyebrow}
        </span>
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
          {w.title}
        </h2>
        <p className="max-w-[62ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {w.intro}
        </p>
      </Reveal>

      {/* Ce soir — la réponse à la seule question qu'on se pose vraiment */}
      <Reveal
        className="overflow-hidden rounded-3xl border"
        style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
      >
        <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex items-center gap-5">
            <span
              aria-hidden
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl md:h-28 md:w-28"
              style={{ background: tonight ? tonight.color : 'var(--cava-line)', color: '#fff' }}
            >
              <Icon name={tonight ? tonight.icon : 'trash'} size={56} />
            </span>
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
                {w.today}
                {today !== null && <span style={{ color: 'var(--cava-muted)', fontWeight: 400 }}> · {w.days[today]}</span>}
              </p>
              <p className="mt-1 text-[clamp(1.3rem,3vw,2rem)] leading-[1.1]" style={{ fontWeight: 700 }}>
                {tonight ? tonight.label[lang] : w.noneToday}
              </p>
              {tonight && (
                <p className="mt-1 text-[14px]" style={{ color: 'var(--cava-muted)' }}>
                  {tonight.sub[lang]}
                </p>
              )}
            </div>
          </div>

          {/* Demain, en second plan */}
          {next && tomorrow !== null && (
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-4"
              style={{ background: 'rgba(46,45,45,0.04)' }}
            >
              <span aria-hidden className="shrink-0" style={{ color: next.color }}>
                <Icon name={next.icon} size={28} />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--cava-muted)' }}>
                  {w.tomorrow} · {w.days[tomorrow]}
                </p>
                <p className="text-[14.5px]" style={{ fontWeight: 600 }}>
                  {next.label[lang]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* La semaine, toujours visible.
            7 jours = nombre premier : aucune grille intermédiaire ne tombe juste
            (dimanche se retrouvait seul sur une ligne). En dessous du grand
            écran, on fait donc défiler la semaine horizontalement. */}
        <div
          className="flex snap-x gap-px overflow-x-auto border-t lg:grid lg:grid-cols-7"
          style={{ background: 'var(--cava-line)', borderColor: 'var(--cava-line)' }}
        >
          {WEEK.map((key, i) => {
            const k = WASTE[key];
            const isToday = i === today;
            return (
              <div
                key={i}
                className="flex min-w-[9.5rem] shrink-0 snap-start flex-col items-center gap-4 p-6 text-center lg:min-w-0 lg:p-7"
                style={{ background: isToday ? 'rgba(230,41,111,0.06)' : 'var(--cava-bg)' }}
              >
                <p
                  className="text-[11.5px] uppercase tracking-[0.16em]"
                  style={{ color: isToday ? 'var(--cava-pink)' : 'var(--cava-muted)', fontWeight: isToday ? 700 : 500 }}
                >
                  {w.days[i]}
                </p>
                <span
                  aria-hidden
                  className="flex h-20 w-20 items-center justify-center rounded-3xl lg:h-[5.5rem] lg:w-[5.5rem]"
                  style={{ background: k.color, color: '#fff' }}
                >
                  <Icon name={k.icon} size={46} />
                </span>
                <p className="text-[14px] leading-[1.35]" style={{ fontWeight: 700 }}>
                  {k.label[lang]}
                </p>
                <p className="text-[11.5px] leading-[1.3]" style={{ color: 'var(--cava-muted)' }}>
                  {k.sub[lang]}
                </p>
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal className="mt-4 flex items-start gap-3 text-[13.5px] italic leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
        <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
          <Icon name="info" size={15} />
        </span>
        <p>{w.eveningNote}</p>
      </Reveal>
    </section>
  );
}
