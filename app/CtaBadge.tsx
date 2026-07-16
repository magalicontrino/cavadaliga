'use client';

import Reveal from './Reveal';
import { withBase } from './data';
import { useI18n } from './i18n';

/**
 * Section CTA éditoriale (style « Cyclops ») : grand titre gras avec le dernier
 * mot dans une pilule + badge circulaire rotatif cliquable menant à `href`.
 * `flip` inverse la disposition (badge à gauche) pour alterner d'une section à l'autre.
 */
export default function CtaBadge({
  href,
  title,
  circleId,
  flip = false,
}: {
  href: string;
  title: string;
  circleId: string;
  flip?: boolean;
}) {
  const { t } = useI18n();
  const words = title.split(' ');
  const last = words.pop();
  const circleText = `${t.region} · Mare · Sole · Barocco · Dolce vita · `.toUpperCase();

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-10">
      <div
        className={`flex flex-col items-start gap-10 border-t pb-14 pt-14 md:items-center md:gap-16 md:pb-20 md:pt-20 ${
          flip ? 'md:flex-row-reverse' : 'md:flex-row'
        }`}
        style={{ borderColor: 'var(--cava-ink)' }}
      >
        {/* Texte */}
        <div className={`flex flex-col gap-5 md:flex-1 ${flip ? 'md:items-end md:text-right' : 'md:items-start'}`}>
          <Reveal
            as="h2"
            className="text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[0.92] tracking-[-0.02em]"
            style={{ fontWeight: 900 }}
          >
            {words.join(' ')}{' '}
            <span
              className="inline-block whitespace-nowrap rounded-full border-2 px-4 pb-1 pt-0.5 leading-none"
              style={{ borderColor: 'var(--cava-ink)' }}
            >
              {last}
            </span>
          </Reveal>
        </div>

        {/* Badge rotatif */}
        <Reveal delay={120} className="shrink-0">
          <a
            href={withBase(href)}
            className="cava-circlebadge group relative inline-flex h-44 w-44 items-center justify-center md:h-48 md:w-48"
            aria-label={title}
          >
            <svg viewBox="0 0 200 200" className="cava-circlebadge-spin h-full w-full" aria-hidden>
              <defs>
                <path id={circleId} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" fill="none" />
              </defs>
              <text fill="currentColor" style={{ fontSize: '12.5px', letterSpacing: '0.14em', fontWeight: 600 }}>
                <textPath href={`#${circleId}`} startOffset="0">
                  {circleText}
                </textPath>
              </text>
            </svg>
            <span
              className="cava-circlebadge-arrow absolute inline-flex h-14 w-14 items-center justify-center rounded-full text-xl"
              style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}
            >
              ↗
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
