'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import { useI18n } from '../i18n';

export default function PreparerLeVoyage() {
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
    <main>
      <Nav current="/preparer-le-voyage" />

      <header className="mx-auto max-w-[110rem] px-5 pb-16 pt-[22vh] md:px-10">
        <Reveal className="flex items-center gap-3" y="3vh">
          <span className="h-[0.4rem] w-[0.4rem] rounded-full" style={{ background: 'var(--cava-pink)' }} />
          <span className="text-[12px] font-medium uppercase tracking-[0.28em]">{p.eyebrow}</span>
        </Reveal>
        <Reveal as="h1" delay={80} className="mt-6 max-w-[20ch] text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02]" style={{ fontWeight: 400 }}>
          {p.title}
        </Reveal>
        <Reveal as="p" delay={160} className="mt-8 max-w-[54ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
          {p.intro}
        </Reveal>
      </header>

      {/* Groupes */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {p.groups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 90} className="flex flex-col gap-5 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none" aria-hidden>{g.icon}</span>
                <h2 className="text-[clamp(1.4rem,3vw,2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
                  {g.title}
                </h2>
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
      <section className="mx-auto max-w-[110rem] px-5 pb-24 pt-16 md:px-10">
        <Reveal className="rounded-2xl p-8 text-white md:p-12" style={{ background: 'var(--cava-ink)' }}>
          <div className="mb-8 flex items-center gap-3">
            <span className="text-2xl leading-none" aria-hidden>✅</span>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              {p.checklistTitle}
            </h2>
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

      <Footer />
    </main>
  );
}
