'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import Shape from './Shape';
import SectionHeading from './SectionHeading';
import { useI18n } from './i18n';

// Rubrique « Préparer le voyage » — groupes de conseils + check-list cochable.
export default function PrepareSection() {
  const { t } = useI18n();
  const p = t.prepare;
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <>
      <SectionHeading id="preparer-le-voyage" title={p.title} intro={p.intro} />

      {/* Groupes */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {p.groups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 90} className="flex flex-col gap-5 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <div className="flex items-center gap-3">
                <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
                  <Shape index={i} size={30} />
                </span>
                <h3 className="text-[clamp(1.4rem,3vw,2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
                  {g.title}
                </h3>
              </div>

              {g.links && g.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {g.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cava-pill inline-flex items-center gap-2 px-4 py-1.5 text-[13px] tracking-[0.02em]"
                    >
                      {l.label} <span aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              )}

              {g.items && g.items.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                      <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Check-list cochable */}
      <section className="mx-auto max-w-[110rem] px-5 pb-8 pt-16 md:px-10">
        <Reveal className="rounded-2xl p-8 text-white md:p-12" style={{ background: 'var(--cava-ink)' }}>
          <div className="mb-8 flex items-center gap-3">
            <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
              <Shape index={5} size={30} />
            </span>
            <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              {p.checklistTitle}
            </h3>
          </div>
          <ul className="grid gap-x-10 gap-y-1 md:grid-cols-2">
            {p.checklist.map((c, i) => {
              const on = checked.has(i);
              return (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    className="flex w-full items-center gap-4 border-b py-4 text-left text-[15px] transition-opacity"
                    style={{ borderColor: 'rgba(255,255,255,0.12)', opacity: on ? 0.5 : 1 }}
                  >
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[13px] transition-colors"
                      style={{
                        border: `1.5px solid ${on ? 'var(--cava-pink)' : 'rgba(255,255,255,0.4)'}`,
                        background: on ? 'var(--cava-pink)' : 'transparent',
                        color: '#fff',
                      }}
                    >
                      {on ? '✓' : ''}
                    </span>
                    <span style={{ textDecoration: on ? 'line-through' : 'none' }}>{c}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
