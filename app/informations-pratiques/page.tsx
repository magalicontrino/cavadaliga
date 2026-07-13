'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
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

      {/* Rubriques en préparation */}
      {p.blocks && (
        <div className="mx-auto max-w-[110rem] px-5 md:px-10">
          <InfoBlocks blocks={p.blocks} icons={PAGE_ICONS['informations-pratiques']} />
        </div>
      )}

      {/* Arrivée : adresse + fonctionnement de la maison (wifi inclus) */}
      <section className="mx-auto max-w-[110rem] px-5 pb-24 pt-16 md:px-10">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            {a.eyebrow}
          </span>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {a.title}
          </h2>
        </Reveal>

        {/* Adresse + lien Google Maps */}
        <Reveal
          className="mb-5 flex flex-col gap-4 rounded-2xl border p-8 md:flex-row md:items-center md:justify-between md:p-10"
          style={{ background: 'var(--cava-bg)', borderColor: 'var(--cava-line)' }}
        >
          <div>
            <div className="mb-2 text-[13px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
              {a.addressLabel}
            </div>
            <div className="text-[16px] leading-[1.5]">
              {a.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
          <a
            href={a.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cava-pill inline-flex items-center gap-2 self-start px-5 py-2 text-[13px] md:self-auto"
          >
            {a.mapsLabel} <span aria-hidden>↗</span>
          </a>
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
                <span aria-hidden className="text-[26px] leading-none">
                  {g.icon}
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

      <Footer />
    </main>
  );
}
