'use client';

import Reveal from './Reveal';
import { SITE } from './data';
import { useI18n, type PageKey } from './i18n';

// Étoile plate (accent), même glyphe que les points forts de l'accueil.
const STAR = (
  <svg width="46" height="46" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 1l2.2 7.8L22 11l-7.8 2.2L12 22l-2.2-8.8L2 11l7.8-2.2z" />
  </svg>
);

/**
 * Section CTA éditoriale (style « Cyclops ») : grand titre gras avec le dernier
 * mot dans une pilule + badge circulaire rotatif cliquable menant à la page.
 * `flip` inverse la disposition (badge à gauche) pour alterner d'une section à l'autre.
 */
export default function CtaBadge({
  pageKey,
  circleId,
  flip = false,
}: {
  pageKey: PageKey;
  circleId: string;
  flip?: boolean;
}) {
  const { t } = useI18n();
  const p = t.pages[pageKey];
  const words = p.title.split(' ');
  const last = words.pop();
  const circleText = `${p.eyebrow} · ${SITE.name} · ${t.region} · `.toUpperCase();

  return (
    <section className="mx-auto max-w-[110rem] px-5 md:px-10">
      <div
        className={`flex flex-col items-start gap-12 border-t pt-14 md:items-center md:justify-between md:pt-20 ${
          flip ? 'md:flex-row-reverse' : 'md:flex-row'
        }`}
        style={{ borderColor: 'var(--cava-ink)' }}
      >
        <div className="max-w-[22ch]">
          <Reveal>
            <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
              {STAR}
            </span>
          </Reveal>
          <Reveal
            as="h2"
            delay={60}
            className="mt-4 text-[clamp(2.2rem,5.5vw,4rem)] uppercase leading-[0.95] tracking-[-0.01em]"
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

        <Reveal delay={120}>
          <a
            href={`/${pageKey}`}
            className="cava-circlebadge group relative inline-flex h-44 w-44 items-center justify-center"
            aria-label={p.eyebrow}
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
