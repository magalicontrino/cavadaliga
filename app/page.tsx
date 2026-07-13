'use client';

import Nav from './Nav';
import Hero from './Hero';
import Reveal from './Reveal';
import Photo from './Photo';
import Footer from './Footer';
import CtaBadge from './CtaBadge';
import { SITE } from './data';
import { useI18n } from './i18n';

// Bandeau d'images défilant de la galerie (visuels présents dans /public/deco/).
const GALLERY_STRIP = [
  '/deco/figue-barbarie.jpg',
  '/deco/carte-pop.jpg',
  '/deco/spaghetti.jpg',
  '/deco/testa-di-moro.jpg',
  '/deco/glace.jpg',
  '/deco/soleil-sicilien.png',
  '/deco/figue-barbarie-2.jpg',
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
        <Reveal as="h2" delay={60} className="mt-4 text-[clamp(2.6rem,8.5vw,6.6rem)] uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
          {t.welcome}
          <br />
          <span
            className="mt-3 inline-block whitespace-nowrap rounded-full border-2 px-5 pb-1.5 pt-1 leading-none"
            style={{ borderColor: 'var(--cava-ink)' }}
          >
            {SITE.name}
          </span>
        </Reveal>
        <Reveal as="p" delay={140} className="mt-8 max-w-[42ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
          {t.intro}
        </Reveal>
        <Reveal delay={220} className="mt-14">
          <Photo
            src="/picture-sicile/appartement.jpg"
            alt={t.apartmentAlt}
            tone="sand"
            label="Photo de l’appartement à venir"
            className="aspect-[16/10] w-full rounded-2xl md:aspect-[2.2/1]"
          />
        </Reveal>
      </section>

      {/* ---------- Les rubriques (CTA à badge rotatif) ---------- */}
      {/* Titre = mini-phrase incluant le nom de la rubrique (t.ctaTitles) */}
      <CtaBadge href="/informations-pratiques" title={t.ctaTitles[0]} circleId="cava-c-info" />
      <CtaBadge href="/services-locaux" title={t.ctaTitles[1]} circleId="cava-c-services" flip />
      <CtaBadge href="/la-region" title={t.ctaTitles[2]} circleId="cava-c-region" />
      <CtaBadge href="/preparer-le-voyage" title={t.ctaTitles[3]} circleId="cava-c-prepare" flip />
      <CtaBadge href="/contact" title={t.ctaTitles[4]} circleId="cava-c-contact" />

      {/* ---------- Galerie : bandeau d'images défilant ---------- */}
      <section className="py-24 md:py-28">
        <Reveal
          as="h2"
          className="mx-auto mb-10 max-w-[110rem] px-5 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05] md:px-10"
          style={{ fontWeight: 500 }}
        >
          {t.tasteOfSicily}
        </Reveal>
        <div className="overflow-hidden">
          <div className="cava-marquee-track" style={{ ['--cava-marquee-duration' as string]: '55s' }}>
            {[...GALLERY_STRIP, ...GALLERY_STRIP].map((src, i) => (
              <div
                key={i}
                className="mx-2 aspect-[3/4] h-[clamp(200px,26vh,320px)] shrink-0 overflow-hidden rounded-xl"
              >
                <Photo src={src} alt={t.tasteOfSicily} tone={i % 2 === 0 ? 'terra' : 'pink'} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA contact (ouvert, sans boîte) ---------- */}
      <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-col items-center gap-7 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--cava-pink)' }}>
            {t.ctaEyebrow}
          </p>
          <p className="max-w-[16ch] text-[clamp(2.2rem,7vw,4.6rem)] leading-[1.04]" style={{ fontWeight: 400 }}>
            {t.ctaTitle}
          </p>
          <a href={`mailto:${SITE.email}`} className="cava-pill mt-2 inline-flex items-center px-7 py-3 text-[15px]">
            {t.writeUs}
          </a>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cava-navlink text-[13px] uppercase tracking-[0.16em]"
            style={{ color: 'var(--cava-muted)' }}
          >
            Instagram {SITE.instagram.handle}
          </a>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
