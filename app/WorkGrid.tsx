'use client';

import Reveal from './Reveal';
import Icon, { type IconName } from './Icon';
import { type Lang } from './localData';
import { type Screen } from './cultureData';

/** Grille de fiches « œuvre » — sert pour les écrans et pour la peinture. */
export default function WorkGrid({
  title,
  intro,
  items,
  icon,
  lang,
  more,
}: {
  title: string;
  intro: string;
  items: Screen[];
  icon: IconName;
  lang: Lang;
  more: string;
}) {
  return (
    <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
      <Reveal
        as="h2"
        className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
        style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
      >
        {title}
      </Reveal>
      <Reveal as="p" className="mt-4 max-w-[60ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
        {intro}
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {items.map((sc, i) => (
          <Reveal key={sc.id} delay={(i % 2) * 70}>
            <div
              className="cava-listcard flex h-full flex-col gap-3 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
                >
                  <Icon name={icon} size={24} />
                </span>
                <span
                  className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
                  style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
                >
                  {sc.kind[lang]}
                </span>
              </div>
              <h3 className="mt-1 text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.12]" style={{ fontWeight: 600 }}>
                {sc.title}
              </h3>
              <p className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                {sc.year}
              </p>
              <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {sc.blurb[lang]}
              </p>

              <div className="mt-auto flex flex-wrap gap-3 pt-3">
                {sc.placeUrl && sc.placeLabel && (
                  <a
                    href={sc.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                  >
                    <Icon name="pin" size={15} /> {sc.placeLabel} <span aria-hidden>↗</span>
                  </a>
                )}
                <a
                  href={sc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                >
                  <Icon name="info" size={15} /> {more} <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
