'use client';

import Reveal from './Reveal';

// Étoile plate (accent) — même glyphe que l'intro de l'accueil et les CTA.
const STAR = (
  <svg width="46" height="46" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 1l2.2 7.8L22 11l-7.8 2.2L12 22l-2.2-8.8L2 11l7.8-2.2z" />
  </svg>
);

/**
 * En-tête d'une rubrique DANS la page unique (étoile + grand titre en capitales
 * avec le dernier mot en pilule + intro). `id` = ancre visée par le menu ;
 * scroll-mt donne un peu d'air quand on saute jusqu'à la section.
 */
export default function SectionHeading({
  id,
  title,
  intro,
  stackPill = false,
}: {
  id: string;
  title: string;
  intro?: string;
  stackPill?: boolean;
}) {
  const words = title.split(' ');
  const last = words.pop();

  return (
    <header id={id} className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-12 pt-24 md:px-10 md:pt-32">
      <Reveal>
        <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
          {STAR}
        </span>
      </Reveal>
      <Reveal
        as="h2"
        delay={60}
        className="mt-4 text-[clamp(2.2rem,6vw,4.8rem)] uppercase leading-[0.95] tracking-[-0.02em]"
        style={{ fontWeight: 900 }}
      >
        {words.join(' ')}
        {stackPill ? <br /> : ' '}
        <span
          className={`inline-block whitespace-nowrap rounded-full border-2 px-4 pb-1 pt-0.5 leading-none ${stackPill ? 'mt-2' : ''}`}
          style={{ borderColor: 'var(--cava-ink)' }}
        >
          {last}
        </span>
      </Reveal>
      {intro && (
        <Reveal
          as="p"
          delay={140}
          className="mt-8 max-w-[54ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]"
          style={{ color: 'var(--cava-muted)' }}
        >
          {intro}
        </Reveal>
      )}
    </header>
  );
}
