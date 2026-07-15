'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import Photo from '../Photo';
import Lightbox from '../Lightbox';
import PageHeader from '../PageHeader';
import { useI18n } from '../i18n';

// Lieux autour de Cava d'Aliga (ordre = i18n regionPlaces / regionHighlights).
// photo:true = vraie photo dans /public/picture-sicile/ (cliquable → lightbox).
// photo:false = ville d'excursion en attente de photo (visuel provisoire).
// unesco:true = badge « Patrimoine mondial UNESCO ». Noms propres = mêmes 3 langues.
const PLACES = [
  { src: '/picture-sicile/cava-daliga.jpg', label: 'Cava d’Aliga', tone: 'sand', photo: true, unesco: false },
  { src: '/picture-sicile/scicli.jpg', label: 'Scicli', tone: 'sand', photo: true, unesco: true },
  { src: '/picture-sicile/bruca.jpg', label: 'Bruca', tone: 'sand', photo: true, unesco: false },
  { src: '/picture-sicile/sampieri.jpg', label: 'Sampieri', tone: 'sand', photo: true, unesco: false },
  { src: '/picture-sicile/punta-pisciotto.jpg', label: 'Punta Pisciotto', tone: 'sand', photo: true, unesco: false },
  { src: '/picture-sicile/modica.jpg', label: 'Modica', tone: 'terra', photo: false, unesco: true },
  { src: '/picture-sicile/ragusa.jpg', label: 'Raguse', tone: 'ink', photo: false, unesco: true },
  { src: '/picture-sicile/noto.jpg', label: 'Noto', tone: 'pink', photo: false, unesco: true },
  { src: '/picture-sicile/siracusa.jpg', label: 'Syracuse', tone: 'terra', photo: false, unesco: true },
] as const;
// Images de la lightbox = uniquement les lieux avec une vraie photo.
const GALLERY = PLACES.filter((pl) => pl.photo).map((pl) => pl.src);

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
            const galleryIndex = place.photo ? GALLERY.indexOf(place.src) : -1;
            return (
              <Reveal key={place.label} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                {/* Photo — cliquable (→ lightbox) si vraie photo, sinon visuel provisoire */}
                {place.photo ? (
                  <button
                    type="button"
                    onClick={() => setOpen(galleryIndex)}
                    aria-label={`Agrandir la photo — ${place.label}`}
                    className={`group block w-full cursor-zoom-in overflow-hidden rounded-2xl ${flip ? 'md:order-2' : ''}`}
                  >
                    <Photo
                      src={place.src}
                      alt={place.label}
                      tone={place.tone}
                      label={`${place.label} — photo à venir`}
                      className="aspect-[4/3] w-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                  </button>
                ) : (
                  <div className={`w-full overflow-hidden rounded-2xl ${flip ? 'md:order-2' : ''}`}>
                    <Photo
                      src={place.src}
                      alt={place.label}
                      tone={place.tone}
                      label={`${place.label} — photo à venir`}
                      className="aspect-[4/3] w-full"
                    />
                  </div>
                )}

                {/* Fiche : numéro + (badge UNESCO) + nom + histoire */}
                <div className={flip ? 'md:order-1' : ''}>
                  <span className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                    {String(i + 1).padStart(2, '0')} / {String(PLACES.length).padStart(2, '0')}
                  </span>
                  {place.unesco && (
                    <div className="mt-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
                        style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                      >
                        <span aria-hidden>★</span> {t.unescoLabel}
                      </span>
                    </div>
                  )}
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

                  {t.regionHighlights[i] && t.regionHighlights[i].length > 0 && (
                    <ul className="mt-7 flex max-w-[48ch] flex-col gap-3">
                      {t.regionHighlights[i].map((h) => (
                        <li key={h} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-ink)' }}>
                          <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Lightbox images={GALLERY} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      </section>

      <div className="pb-24" />

      <Footer />
    </main>
  );
}
