'use client';

import { useRef } from 'react';
import Reveal from './Reveal';
import Photo from './Photo';
import { SITE } from './data';
import { useI18n } from './i18n';

// Les 3 cartes photo empilées et en éventail du hero. `tx` = décalage
// horizontal (éventail), `rot` = inclinaison. Couleurs de repli = palette.
const CARDS = [
  { cls: 'third', tone: 'terra', rot: -15, tx: '-20%', src: '/picture-sicile/hero-3.jpg', deco: '/deco/figue-barbarie.jpg', alt: 'La mer et les rochers de Cava d’Aliga' },
  { cls: 'second', tone: 'pink', rot: -7, tx: '-9%', src: '/picture-sicile/hero-2.jpg', deco: '/deco/carte-pop.jpg', alt: 'Le hameau marin de Cava d’Aliga' },
  { cls: 'first', tone: 'ink', rot: 4, tx: '4%', src: '/picture-sicile/hero-1.jpg', deco: '/deco/testa-di-moro.jpg', alt: 'La côte de Cava d’Aliga' },
] as const;

const CARD_W = 'min(46vh, 330px)';
const CARD_H = 'min(64vh, 460px)';

export default function Hero() {
  const { t } = useI18n();
  const stackRef = useRef<HTMLDivElement | null>(null);

  // Parallaxe légère : la souris décale chaque carte proportionnellement.
  function onMove(e: React.MouseEvent) {
    const el = stackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.querySelectorAll<HTMLElement>('.cava-herocard').forEach((c, i) => {
      const depth = (i + 1) * 6;
      c.style.setProperty('--px', `${dx * depth}px`);
      c.style.setProperty('--py', `${dy * depth}px`);
    });
  }
  function onLeave() {
    stackRef.current?.querySelectorAll<HTMLElement>('.cava-herocard').forEach((c) => {
      c.style.setProperty('--px', '0px');
      c.style.setProperty('--py', '0px');
    });
  }

  return (
    <section className="relative min-h-[100svh] overflow-x-clip pb-[12vh] pt-[14vh]">
      {/* Halo décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] -z-10 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(230,41,111,0.18), transparent 65%)' }}
      />

      {/* Texte au premier plan : tag + titre centrés */}
      <div className="relative z-20 flex flex-col items-center gap-5 px-5 text-center md:px-10">
        <Reveal className="flex items-center gap-3" y="3vh">
          <span className="h-[0.4rem] w-[0.4rem] rounded-full" style={{ background: 'var(--cava-pink)' }} />
          <span className="text-[13px] font-medium uppercase tracking-[0.28em]">{t.region}</span>
          <span className="h-[0.4rem] w-[0.4rem] rounded-full" style={{ background: 'var(--cava-pink)' }} />
        </Reveal>
        <Reveal
          as="h1"
          y="5vh"
          delay={80}
          className="mx-auto max-w-[18ch] text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]"
          style={{ fontWeight: 400, color: 'var(--cava-ink)' }}
        >
          {SITE.name}, {t.tagline}
        </Reveal>
      </div>

      {/* Sous-labels À GAUCHE + email À DROITE */}
      <div className="relative z-20 mx-auto mt-10 flex max-w-[110rem] flex-wrap items-end justify-between gap-4 px-5 md:px-10">
        <Reveal className="flex flex-col gap-0.5" y="3vh" delay={140}>
          {t.subLabels.map((s) => (
            <span key={s} className="text-[12px] uppercase tracking-[0.22em] leading-[1.2]" style={{ color: 'var(--cava-muted)' }}>
              {s}
            </span>
          ))}
        </Reveal>
        <Reveal y="3vh" delay={200}>
          <a href={`mailto:${SITE.email}`} className="cava-pill inline-block px-6 py-2 text-[13px] tracking-[0.02em]">
            {t.writeUs}
          </a>
        </Reveal>
      </div>

      {/* Wordmark en marquee — reste collé EN BAS DU FULL-SCREEN (20px),
          en arrière-plan des cartes, très lent. Le cadre h-[100svh] l'ancre
          au bas de l'écran initial quelle que soit la hauteur de la section. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh]">
        <Reveal y="4vh" delay={220} className="absolute inset-x-0 bottom-5 select-none overflow-x-clip">
          <div className="cava-marquee-track" style={{ ['--cava-marquee-duration' as string]: '130s' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="mx-6 inline-flex items-center gap-6 text-[clamp(3rem,15vw,13rem)] leading-[0.9] tracking-[-0.02em]"
                style={{ fontWeight: 500, color: 'var(--cava-ink)' }}
              >
                {SITE.name}
                <span className="inline-block rounded-full" style={{ background: 'var(--cava-pink)', width: '0.2em', height: '0.2em' }} />
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Zone cartes : pile en éventail, en flux normal → la section grandit,
          les cartes ne sont jamais coupées (leur bas se révèle au scroll). */}
      <div className="relative mt-[7vh] flex justify-center">
        {/* Pile de cartes — DEVANT le marquee, en éventail */}
        <div
          ref={stackRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="cava-herostack relative z-10"
          style={{ width: CARD_W, height: CARD_H }}
        >
          {CARDS.map((c, i) => (
            <Reveal
              key={c.cls}
              y="8vh"
              delay={200 + i * 120}
              className={`cava-herocard ${c.cls} absolute left-1/2 top-1/2`}
              style={{
                width: CARD_W,
                height: CARD_H,
                transform: `translate(calc(-50% + ${c.tx} + var(--px, 0px)), calc(-50% + var(--py, 0px))) rotate(${c.rot}deg)`,
                zIndex: i + 1,
              }}
            >
              <Photo
                src={c.src}
                fallback={c.deco}
                alt={c.alt}
                tone={c.tone}
                label="Photo Sicile"
                className="h-full w-full rounded-[1.2vh] shadow-[0_30px_60px_-25px_rgba(46,45,45,0.55)]"
                imgClassName="[object-position:50%_30%]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
