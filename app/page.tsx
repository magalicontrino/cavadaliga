'use client';

import Nav from './Nav';
import Hero from './Hero';
import Reveal from './Reveal';
import Photo from './Photo';
import Footer from './Footer';
import CtaBadge from './CtaBadge';
import Gallery from './Gallery';
import Weather from './Weather';
import { SITE } from './data';
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

// Glyphes géométriques plats (SVG inline, style « geometric shapes flat »)
// utilisés comme accents des points forts. currentColor = couleur du parent.
const HIGHLIGHT_GLYPHS = [
  // Étoile / sparkle
  <svg key="star" width="46" height="46" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 1l2.2 7.8L22 11l-7.8 2.2L12 22l-2.2-8.8L2 11l7.8-2.2z" />
  </svg>,
  // Demi-disque (cercle mi-plein)
  <svg key="half" width="46" height="46" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="10.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M1.4 12a10.6 10.6 0 0 1 21.2 0z" fill="currentColor" />
  </svg>,
  // Triangle plein
  <svg key="tri" width="46" height="46" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3l9.5 17.5H2.5z" />
  </svg>,
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
          <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
            {HIGHLIGHT_GLYPHS[0]}
          </span>
        </Reveal>
        <Reveal delay={60} className="mt-4">
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

      {/* ---------- Les rubriques (CTA à badge rotatif) ---------- */}
      {/* Ordre cohérent avec le menu : voyage → infos → adresses → région.
          Titre = mini-phrase incluant le nom de la rubrique (t.ctaTitles). */}
      <CtaBadge href="/preparer-le-voyage" title={t.ctaTitles[3]} circleId="cava-c-prepare" />
      <CtaBadge href="/informations-pratiques" title={t.ctaTitles[0]} circleId="cava-c-info" flip />
      <CtaBadge href="/services-locaux" title={t.ctaTitles[1]} circleId="cava-c-services" />
      <CtaBadge href="/la-region" title={t.ctaTitles[2]} circleId="cava-c-region" flip />

      {/* ---------- Galerie : bandeau d'images défilant ---------- */}
      <section className="py-24 md:py-28">
        <Gallery images={GALLERY_STRIP} />
      </section>

      {/* ---------- CTA : liens géants Contact + Instagram ---------- */}
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
      </section>

      <Footer />
    </main>
  );
}
