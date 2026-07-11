'use client';

import Nav from './Nav';
import Hero from './Hero';
import Reveal from './Reveal';
import Photo from './Photo';
import Marquee from './Marquee';
import Footer from './Footer';
import CtaBadge from './CtaBadge';
import { SITE, INDEX_CARDS, GALLERY } from './data';
import { useI18n } from './i18n';

// Fond couleur de marque des cartes d'index (selon tone).
const TONE_BG: Record<string, string> = {
  ink: 'linear-gradient(145deg, #3a3838 0%, #201f1f 100%)',
  terra: 'linear-gradient(145deg, #b95555 0%, #8c3838 100%)',
  pink: 'linear-gradient(145deg, #ef3f7d 0%, #c71d5b 100%)',
};

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
        <Reveal as="h2" delay={60} className="mt-4 text-[clamp(2.8rem,9vw,7rem)] uppercase leading-[0.88] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
          {t.welcome}
          <br />
          {SITE.name}
        </Reveal>
        <Reveal as="p" delay={140} className="mt-8 max-w-[42ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
          {t.intro}
        </Reveal>
      </section>

      {/* ---------- CTA vers Informations pratiques (badge rotatif) ---------- */}
      <CtaBadge pageKey="informations-pratiques" circleId="cava-circle-info" />

      {/* ---------- Bandeau défilant ---------- */}
      <section className="border-y py-6" style={{ borderColor: 'var(--cava-line)' }}>
        <Marquee items={['Cava d’Aliga', 'Scicli', 'Raguse', 'Val di Noto', t.region]} duration={38} />
      </section>

      {/* ---------- Points forts (style éditorial audacieux) ---------- */}
      <section className="mx-auto max-w-[110rem] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          {t.highlights.map((h, i) => (
            <Reveal key={h.value} delay={i * 100} className="flex flex-col gap-6 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
              <span aria-hidden style={{ color: 'var(--cava-pink)' }}>
                {HIGHLIGHT_GLYPHS[i]}
              </span>
              <span
                className="text-[clamp(2.6rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-[-0.02em]"
                style={{ fontWeight: 900 }}
              >
                {h.value}
              </span>
              <span className="max-w-[24ch] text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                {h.label}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Index des sections (cœur instructif) ---------- */}
      <section className="mx-auto max-w-[110rem] px-5 py-16 md:px-10">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-[clamp(1.9rem,4.5vw,3.2rem)] uppercase leading-[1.05] tracking-[-0.01em]" style={{ fontWeight: 800 }}>
            {(() => {
              const words = t.everythingForStay.split(' ');
              const last = words.pop();
              return (
                <>
                  {words.join(' ')}{' '}
                  <span
                    className="inline-block whitespace-nowrap rounded-full border-2 px-4 pb-1 pt-0.5 leading-none"
                    style={{ borderColor: 'var(--cava-ink)' }}
                  >
                    {last}
                  </span>
                </>
              );
            })()}
          </h2>
          <span className="hidden text-[14px] md:block" style={{ color: 'var(--cava-muted)' }}>
            {INDEX_CARDS.length} {t.sectionsWord}
          </span>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {INDEX_CARDS.map((c, i) => (
            <Reveal key={c.href} delay={i * 90}>
              <a
                href={c.href}
                className="cava-indexcard group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl p-8 text-white"
                style={{ background: TONE_BG[c.tone] }}
              >
                {/* Grand numéro typographique en contour (animé au survol) */}
                <span aria-hidden className="cava-indexcard-num pointer-events-none absolute -bottom-6 right-3 text-[clamp(6rem,15vw,11rem)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Haut : flèche */}
                <div className="relative flex items-start justify-end">
                  <span className="cava-indexcard-arrow text-2xl leading-none">↗</span>
                </div>
                {/* Bas : filet + titre + description */}
                <div className="relative">
                  <span aria-hidden className="cava-indexcard-rule mb-5 block h-px" />
                  <h3 className="cava-indexcard-title text-[clamp(1.6rem,3.2vw,2.4rem)] uppercase leading-[1] tracking-[-0.01em]" style={{ fontWeight: 800 }}>
                    {t.indexCards[i].title}
                  </h3>
                  <p className="mt-3 max-w-[32ch] text-[14px] leading-[1.5] opacity-85">{t.indexCards[i].desc}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA vers Services locaux (badge rotatif, inversé) ---------- */}
      <div className="pt-20 md:pt-28">
        <CtaBadge pageKey="services-locaux" circleId="cava-circle-services" flip />
      </div>

      {/* ---------- Aperçu galerie ---------- */}
      <section className="mx-auto max-w-[110rem] px-5 py-24 md:px-10">
        <Reveal as="h2" className="mb-10 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05]" style={{ fontWeight: 500 }}>
          {t.tasteOfSicily}
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal
              key={g.src}
              delay={(i % 4) * 80}
              className={i === 0 ? 'col-span-2 row-span-2' : ''}
            >
              <Photo
                src={g.src}
                fallback={g.deco}
                alt={t.galleryAlt[i]}
                tone={i % 2 === 0 ? 'terra' : 'pink'}
                label="Photo à venir"
                className={`w-full overflow-hidden rounded-xl ${i === 0 ? 'aspect-square' : 'aspect-[4/5]'}`}
                imgClassName="transition-transform duration-700 hover:scale-105"
              />
            </Reveal>
          ))}
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
