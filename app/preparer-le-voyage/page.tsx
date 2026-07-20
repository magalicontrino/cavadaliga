'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Quiz from '../Quiz';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Shape from '../Shape';
import Icon from '../Icon';
import { useI18n } from '../i18n';
import { withBase } from '../data';
import { useAncre } from '../ancre';

export default function PreparerLeVoyage() {
  // Arriver par « #valise » ou « #arbre » depuis « Demander » doit ouvrir
  // la bonne section, pas le haut de la page.
  useAncre();
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

      <PageHeader title={p.title} intro={p.intro} />

      {/* Le cours d'italien, en raccourci : preparer le voyage, c'est aussi
          apprendre a se debrouiller dans la langue avant de partir. Meme picto
          rond que partout ailleurs. */}
      <section className="mx-auto max-w-[110rem] px-5 pt-2 md:px-10">
        <Reveal>
          <a
            href={withBase('/italien')}
            aria-label={t.italianPage.title}
            title={t.italianPage.title}
            className="cava-vinyllink flex h-11 w-11 items-center justify-center rounded-full"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="parler" size={22} />
          </a>
        </Reveal>
      </section>

      {/* Rubriques — empilées les unes sous les autres, style éditorial façon
          CTA de l'accueil (grand titre en capitales, filet, sans cadre). */}
      <section id="groupes" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 md:px-10">
        {p.groups.map((g, gi) => {
          const words = g.title.split(' ');
          const last = words.pop();
          return (
            <Reveal
              key={g.title}
              delay={(gi % 2) * 80}
              className="border-t py-12 md:py-16"
              style={{ borderColor: 'var(--cava-ink)' }}
            >
              <h2
                className="text-[clamp(1.9rem,5.5vw,3.6rem)] uppercase leading-[0.98] tracking-[-0.02em]"
                style={{ fontWeight: 900 }}
              >
                {words.join(' ')}{' '}
                <span
                  className="inline-block whitespace-nowrap rounded-full border-2 px-3 pb-0.5 pt-0 leading-none"
                  style={{ borderColor: 'var(--cava-ink)' }}
                >
                  {last}
                </span>
              </h2>

              {g.links && g.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
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
                <ul className="mt-7 flex max-w-[80ch] flex-col gap-4">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="flex gap-3 text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.6]"
                      style={{ color: 'var(--cava-muted)' }}
                    >
                      <span className="mt-2.5 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          );
        })}
      </section>

      {/* Check-list cochable */}
      <section id="valise" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-24 pt-16 md:px-10">
        <Reveal className="rounded-2xl p-8 text-white md:p-12" style={{ background: 'var(--cava-ink)' }}>
          <div className="mb-2 flex items-center gap-3">
            <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
              <Shape index={5} size={30} />
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              {p.checklistTitle}
            </h2>
          </div>
          <p className="mb-8 text-[14px] italic" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {p.checklistNote}
          </p>
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


      {/*
        LE QUIZ DE LA PAGE — Mag : « tu peux remettre a chaque fois le meme
        quizz mais pointe sur le sujet en rapport avec la page ». Le meme
        composant que sur « La region », la famille et l'italien ; seuls les
        themes changent, et avec eux les questions.

        La regle ne bouge pas : chaque bonne reponse est ecrite plus haut sur
        CETTE page, et « relire le passage » y mene par l'ancre de sa section.
      */}
      <Quiz only={['voyage']} titre={t.quizPage.tripTitle} intro={t.quizPage.tripIntro} ancreLocale="groupes" />

      <Footer />
    </main>
  );
}
