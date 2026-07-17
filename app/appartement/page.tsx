'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Photo from '../Photo';
import CtaBadge from '../CtaBadge';
import Lightbox from '../Lightbox';
import { useI18n } from '../i18n';

// L'album de la maison : les vraies photos, deposees dans /public/appart/.
// Ordre pense comme une visite — on entre par la terrasse, puis le sejour, la
// cuisine, les chambres, les salles de bain.
const ALBUM = Array.from({ length: 12 }, (_, i) => `/appart/appart-${String(i + 1).padStart(2, '0')}.jpg`);
const TONES = ['sand', 'terra', 'pink', 'ink'] as const;

export default function Appartement() {
  const { t } = useI18n();
  const a = t.apartment;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main>
      <Nav current="/appartement" />

      {/* Le titre seul, sans intro : la phrase qui la resumait est partie, et
          l'appartement se raconte mieux en photos qu'en mots. */}
      <PageHeader title={a.title} stackPill />

      {/* L'album — masonry + lightbox, comme la galerie de la famille. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-16 md:px-10">
        <div className="columns-2 gap-5 sm:columns-3 lg:columns-4 [&>*]:mb-5">
          {ALBUM.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 90} className="flex break-inside-avoid flex-col gap-3">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={a.captions[i] ?? `${a.albumAlt} — ${i + 1}`}
                className="block w-full cursor-zoom-in"
              >
                <Photo
                  natural
                  src={src}
                  alt={a.captions[i] ?? `${a.albumAlt} — ${i + 1}`}
                  tone={TONES[i % TONES.length]}
                  label={`${a.albumAlt} — à venir`}
                  className="w-full rounded-2xl"
                  imgClassName="transition-transform duration-500 hover:scale-[1.03]"
                />
              </button>
              {a.captions[i] && (
                <span className="text-[13px] leading-[1.4]" style={{ color: 'var(--cava-muted)' }}>
                  {a.captions[i]}
                </span>
              )}
            </Reveal>
          ))}
        </div>

        <Lightbox images={ALBUM} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      </section>

      {/* Un CTA comme sur l'accueil : grand titre + badge rotatif, vers les
          infos pratiques. */}
      <CtaBadge
        href="/informations-pratiques"
        title={t.pages['informations-pratiques'].title}
        circleId="cava-c-casa-infos"
      />

      <Footer />
    </main>
  );
}
