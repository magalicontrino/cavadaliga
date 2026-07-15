'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import Photo from '../Photo';
import PageHeader from '../PageHeader';
import { InfoBlocks } from '../SectionShell';
import { PAGE_ICONS } from '../data';
import { useI18n } from '../i18n';

// Lieux autour de Cava d'Aliga — vraies photos dans /public/picture-sicile/,
// repli /public/deco/ tant que la photo n'est pas déposée. Légendes = noms
// de lieux (noms propres, identiques dans les 3 langues).
const PLACES = [
  { src: '/picture-sicile/cava-daliga.jpg', deco: '/deco/glace.jpg', label: 'Cava d’Aliga' },
  { src: '/picture-sicile/scicli.jpg', deco: '/deco/motif-1.jpg', label: 'Scicli' },
  { src: '/picture-sicile/bruca.jpg', deco: '/deco/figue-barbarie.jpg', label: 'Bruca' },
  { src: '/picture-sicile/sampieri.jpg', deco: '/deco/spaghetti.jpg', label: 'Sampieri' },
];

export default function LaRegion() {
  const { t } = useI18n();
  const p = t.pages['la-region'];

  return (
    <main>
      <Nav current="/la-region" />

      <PageHeader title={p.title} intro={p.intro} />

      {/* Panorama de Scicli en tête de page */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <Reveal>
          <Photo
            src="/picture-sicile/scicli.jpg"
            fallback="/deco/carte-pop.jpg"
            alt={t.scicliAlt}
            tone="sand"
            label="Photo de Scicli à venir"
            className="aspect-[16/10] w-full rounded-2xl md:aspect-[2.4/1]"
          />
        </Reveal>
      </section>

      {/* Galerie légendée : les lieux autour de nous */}
      <section className="mx-auto max-w-[110rem] px-5 pt-16 md:px-10">
        <Reveal
          as="h2"
          className="mb-8 text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]"
          style={{ fontWeight: 500 }}
        >
          {t.placesTitle}
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLACES.map((place, i) => (
            <Reveal key={place.label} delay={(i % 3) * 90} className="flex flex-col gap-3">
              <Photo
                src={place.src}
                fallback={place.deco}
                alt={place.label}
                tone="sand"
                label={`${place.label} — photo à venir`}
                className="aspect-[4/3] w-full rounded-2xl"
              />
              <span className="text-[13px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
                {place.label}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Rubriques */}
      {p.blocks && (
        <div className="mx-auto max-w-[110rem] px-5 pb-24 pt-16 md:px-10">
          <InfoBlocks blocks={p.blocks} icons={PAGE_ICONS['la-region']} />
        </div>
      )}

      <Footer />
    </main>
  );
}
