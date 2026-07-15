'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import Photo from '../Photo';
import Lightbox from '../Lightbox';
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
  { src: '/picture-sicile/punta-pisciotto.jpg', deco: '/deco/figue-barbarie-2.jpg', label: 'Punta Pisciotto' },
];

export default function LaRegion() {
  const { t } = useI18n();
  const p = t.pages['la-region'];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main>
      <Nav current="/la-region" />

      <PageHeader title={p.title} intro={p.intro} />

      {/* Les lieux autour de nous — fiches éditoriales alternées + lightbox */}
      <section className="mx-auto max-w-[110rem] px-5 pt-8 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
        >
          {t.placesTitle}
        </Reveal>

        <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-28">
          {PLACES.map((place, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={place.label} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                {/* Photo cliquable → lightbox */}
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Agrandir la photo — ${place.label}`}
                  className={`group block w-full cursor-zoom-in overflow-hidden rounded-2xl ${flip ? 'md:order-2' : ''}`}
                >
                  <Photo
                    src={place.src}
                    fallback={place.deco}
                    alt={place.label}
                    tone="sand"
                    label={`${place.label} — photo à venir`}
                    className="aspect-[4/3] w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                </button>

                {/* Fiche : numéro + nom + histoire */}
                <div className={flip ? 'md:order-1' : ''}>
                  <span className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                    {String(i + 1).padStart(2, '0')} / {String(PLACES.length).padStart(2, '0')}
                  </span>
                  <h3
                    className="mt-3 text-[clamp(2rem,5vw,3.4rem)] uppercase leading-[0.98] tracking-[-0.02em]"
                    style={{ fontWeight: 900 }}
                  >
                    {place.label}
                  </h3>
                  <p
                    className="mt-6 max-w-[48ch] border-l-2 pl-5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]"
                    style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}
                  >
                    {t.regionPlaces[i]}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Lightbox images={PLACES.map((pl) => pl.src)} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
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
