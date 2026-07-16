'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import Icon from './Icon';
import { useI18n } from './i18n';

// Les coches survivent au changement de filtre — la section est alors retirée
// de la page, et l'état d'un composant retiré est perdu. Elles ne survivent pas
// au rechargement : rien n'est enregistré, c'est un pense-bête, pas une donnée.
let ticked: number[] = [];

/**
 * Check-list « Avant de fermer la porte » — cases à cocher.
 * C'est un pense-bête qu'on coche pendant qu'on range, pas une donnée à garder.
 */
export default function DepartChecklist() {
  const { t } = useI18n();
  const d = t.depart;
  const [done, setDone] = useState<number[]>(ticked);

  const toggle = (i: number) =>
    setDone((prev) => {
      ticked = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      return ticked;
    });
  const allDone = done.length === d.checklist.length;

  return (
    <section className="mx-auto max-w-[110rem] px-5 pb-24 pt-8 md:px-10">
      <Reveal className="mb-8 flex flex-col gap-2">
        <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
          <Icon name="key" size={16} /> {d.eyebrow}
        </span>
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
          {d.title}
        </h2>
        <p className="max-w-[60ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {d.intro}
        </p>
      </Reveal>

      <Reveal className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--cava-line)' }}>
        {/* En-tête : titre + compteur d'avancement */}
        <div
          className="flex items-center justify-between gap-4 px-8 py-5 md:px-10"
          style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}
        >
          <span className="text-[13px] uppercase tracking-[0.18em]" style={{ fontWeight: 700 }}>
            {d.checklistTitle}
          </span>
          <span
            className="shrink-0 rounded-full px-3 py-1 font-mono text-[12px] transition-colors"
            style={{
              background: allDone ? 'var(--cava-pink)' : 'rgba(247,245,242,0.14)',
              color: allDone ? '#fff' : 'rgba(247,245,242,0.8)',
              fontWeight: 700,
            }}
          >
            {done.length} / {d.checklist.length}
          </span>
        </div>

        <ul>
          {d.checklist.map((item, i) => {
            const on = done.includes(i);
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  className="cava-checkrow flex w-full items-start gap-4 border-t px-8 py-5 text-left md:px-10"
                  style={{ borderColor: 'var(--cava-line)' }}
                >
                  {/* Case à cocher */}
                  <span
                    aria-hidden
                    className="mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors"
                    style={{
                      borderColor: on ? 'var(--cava-pink)' : 'var(--cava-line)',
                      background: on ? 'var(--cava-pink)' : 'transparent',
                      color: '#fff',
                    }}
                  >
                    {on && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12.5l5 5L20 6.5" />
                      </svg>
                    )}
                  </span>
                  <span
                    className="text-[15px] leading-[1.6] transition-colors"
                    style={{
                      color: on ? 'var(--cava-muted)' : 'var(--cava-ink)',
                      textDecoration: on ? 'line-through' : 'none',
                    }}
                  >
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal className="mt-4 text-[13px] italic" style={{ color: 'var(--cava-muted)' }}>
        {d.checklistNote}
      </Reveal>
    </section>
  );
}
