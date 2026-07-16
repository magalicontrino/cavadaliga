'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import OpIcon, { type OpIconName } from '../OpIcon';
import DepartChecklist from '../DepartChecklist';
import { InfoBlocks } from '../SectionShell';
import { PAGE_ICONS } from '../data';
import { useI18n } from '../i18n';

export default function InformationsPratiques() {
  const { t } = useI18n();
  const p = t.pages['informations-pratiques'];
  const a = t.arrivee;

  return (
    <main>
      <Nav current="/informations-pratiques" />

      <PageHeader title={p.title} intro={p.intro} />

      {/* L'adresse d'abord : c'est l'info qu'on vient chercher en premier. */}
      <section className="mx-auto max-w-[110rem] px-5 pt-8 md:px-10">
        <Reveal
          className="relative flex flex-col gap-8 overflow-hidden rounded-3xl p-10 md:flex-row md:items-center md:justify-between md:p-16"
          style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}
        >
          {/* Maison décorative en filigrane */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 opacity-[0.13] md:-right-4 md:top-1/2 md:-translate-y-1/2"
            style={{ color: 'var(--cava-pink)' }}
          >
            <Icon name="home" size={280} />
          </span>

          <div className="relative">
            <span
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--cava-pink)' }}
            >
              <Icon name="pin" size={16} /> {a.addressLabel}
            </span>
            <address className="mt-4 not-italic">
              {a.address.map((line, i) => (
                <div
                  key={line}
                  className="text-[clamp(1.5rem,3.4vw,2.4rem)] uppercase leading-[1.12] tracking-[-0.02em]"
                  style={{ fontWeight: i === 0 ? 900 : 500, color: i === 0 ? 'var(--cava-bg)' : 'rgba(247,245,242,0.7)' }}
                >
                  {line}
                </div>
              ))}
            </address>
          </div>

          <a
            href={a.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex shrink-0 items-center gap-3 self-start rounded-full px-7 py-4 text-[15px] transition hover:opacity-85 md:self-auto"
            style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
          >
            <Icon name="pin" size={20} /> {a.mapsLabel} <span aria-hidden>↗</span>
          </a>
        </Reveal>
      </section>

      {/* Rubriques en préparation */}
      {p.blocks && (
        <div className="mx-auto max-w-[110rem] px-5 md:px-10">
          <InfoBlocks blocks={p.blocks} icons={PAGE_ICONS['informations-pratiques']} />
        </div>
      )}

      {/* Arrivée : fonctionnement de la maison (wifi inclus) */}
      <section className="mx-auto max-w-[110rem] px-5 pb-24 pt-16 md:px-10">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            {a.eyebrow}
          </span>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {a.title}
          </h2>
        </Reveal>

        {/* Fonctionnement de la maison */}
        <Reveal className="mb-5 text-[13px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
          {a.operationTitle}
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {a.operation.map((g, i) => (
            <Reveal
              key={g.title}
              delay={(i % 2) * 90}
              className="flex flex-col gap-4 p-8 md:p-10"
              style={{ background: 'var(--cava-bg)' }}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden className="leading-none" style={{ color: 'var(--cava-pink)' }}>
                  <OpIcon name={g.icon as OpIconName} size={26} />
                </span>
                <h3 className="text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
                  {g.title}
                </h3>
              </div>
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

        <Reveal className="mt-6 text-[14px] italic" style={{ color: 'var(--cava-muted)' }}>
          {a.toCome}
        </Reveal>
      </section>

      {/* Check-list du départ */}
      <DepartChecklist />

      <Footer />
    </main>
  );
}
