'use client';

import Nav from './Nav';
import Hero from './Hero';
import Reveal from './Reveal';
import Photo from './Photo';
import Footer from './Footer';
import CtaBadge from './CtaBadge';
import Gallery from './Gallery';
import Weather from './Weather';
import { SITE, NAV } from './data';
import { useI18n } from './i18n';

// Bandeau d'images défilant de la galerie (visuels présents dans /public/deco/).
// Ordre pensé pour que deux visuels SEMBLABLES (les 2 figuiers de Barbarie)
// ne soient jamais côte à côte — y compris au raccord de boucle (dernier ↔
// premier, car le bandeau répète cette liste).
const GALLERY_STRIP = [
  '/deco/figue-barbarie.jpg',
  '/deco/carte-pop.jpg',
  '/deco/spaghetti.jpg',
  '/deco/figue-barbarie-2.jpg',
  '/deco/testa-di-moro.jpg',
  '/deco/glace.jpg',
];

export default function CavaHome() {
  const { t } = useI18n();
  return (
    <main>
      <Nav current="/" />
      <Hero />

      {/* ---------- Intro (style éditorial « we are ») ---------- */}
      <section className="mx-auto max-w-[110rem] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <Weather />
        </Reveal>
        <Reveal as="p" delay={140} className="mt-8 max-w-[42ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
          {t.intro}
        </Reveal>
        <Reveal delay={220} className="mt-14">
          <Photo
            src="/picture-sicile/cava-daliga.jpg"
            alt={t.cavaAlt}
            tone="sand"
            label="Photo de Cava d’Aliga à venir"
            className="aspect-[16/10] w-full rounded-2xl md:aspect-[2.2/1]"
          />
        </Reveal>
      </section>

      {/* ---------- Les rubriques (CTA à badge rotatif) ----------
          Une CTA par page du menu, dans le même ordre : le visiteur retrouve
          la même séquence partout. Les titres viennent de t.ctaTitles, aligné
          sur NAV. Le badge alterne de côté d'une section à l'autre. */}
      {NAV.map((item, i) => (
        <CtaBadge
          key={item.href}
          href={item.href}
          title={t.ctaTitles[i]}
          circleId={`cava-c-${item.href.slice(1)}`}
          flip={i % 2 === 1}
        />
      ))}

      {/* ---------- Galerie : bandeau d'images défilant ---------- */}
      <section className="py-24 md:py-28">
        <Gallery images={GALLERY_STRIP} />
      </section>

      {/* ---------- CTA : lien géant Contact ---------- */}
      <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <a
            href={`mailto:${SITE.email}`}
            className="cava-footlink group flex w-full items-center justify-between border-b border-t py-4 text-left md:py-5"
            style={{ borderColor: 'var(--cava-line)' }}
          >
            <span
              className="text-[clamp(1.7rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontWeight: 900 }}
            >
              {t.contactLink}
            </span>
            <span className="cava-cta-arrow text-[clamp(1.4rem,3.5vw,2.6rem)]" aria-hidden>
              ↗
            </span>
          </a>
        </Reveal>
        <Reveal delay={60}>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cava-footlink group flex w-full items-center justify-between border-b py-4 text-left md:py-5"
            style={{ borderColor: 'var(--cava-line)' }}
          >
            <span
              className="text-[clamp(1.7rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontWeight: 900 }}
            >
              Instagram
            </span>
            <span className="cava-cta-arrow text-[clamp(1.4rem,3.5vw,2.6rem)]" aria-hidden>
              ↗
            </span>
          </a>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
