'use client';

import Reveal from './Reveal';

// Étoile plate (accent), identique à l'intro de l'accueil et aux CTA.
const STAR = (
  <svg width="46" height="46" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 1l2.2 7.8L22 11l-7.8 2.2L12 22l-2.2-8.8L2 11l7.8-2.2z" />
  </svg>
);

/**
 * En-tête éditorial des pages secondaires (même style que l'intro « BIENVENUE »
 * de l'accueil) : étoile + grand titre gras en capitales avec le dernier mot
 * enfermé dans une pilule, puis l'intro en dessous.
 */
export default function PageHeader({
  title,
  intro,
  stackPill = false,
}: {
  title: string;
  intro: string;
  // Force la pilule (dernier mot) sur une nouvelle ligne.
  stackPill?: boolean;
}) {
  const words = title.split(' ');
  const last = words.pop();

  return (
    <header className="mx-auto max-w-[110rem] px-5 pb-16 pt-[22vh] md:px-10">
      <Reveal>
        <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
          {STAR}
        </span>
      </Reveal>
      <Reveal
        as="h1"
        delay={60}
        className="mt-4 max-w-[16ch] text-[clamp(2.4rem,7vw,5.6rem)] uppercase leading-[0.95] tracking-[-0.02em]"
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
      <Reveal
        as="p"
        delay={140}
        className="mt-8 max-w-[54ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]"
        style={{ color: 'var(--cava-muted)' }}
      >
        {intro}
      </Reveal>
    </header>
  );
}
