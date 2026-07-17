'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import Photo from '../Photo';
import Lightbox from '../Lightbox';
import { withBase } from '../data';
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

      {/* Ce qu'on tient a dire tout de suite : c'est de plain-pied. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-10 md:px-10">
        <Reveal className="flex max-w-[64ch] items-start gap-3">
          <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="home" size={18} />
          </span>
          <p className="text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7]">{a.rdc}</p>
        </Reveal>
      </section>

      {/* L'album — masonry + lightbox, comme la galerie de la famille. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-16 md:px-10">
        <div className="columns-2 gap-5 sm:columns-3 lg:columns-4 [&>*]:mb-5">
          {ALBUM.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 90} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${a.albumAlt} — ${i + 1}`}
                className="block w-full cursor-zoom-in"
              >
                <Photo
                  natural
                  src={src}
                  alt={`${a.albumAlt} — ${i + 1}`}
                  tone={TONES[i % TONES.length]}
                  label={`${a.albumAlt} — à venir`}
                  className="w-full rounded-2xl"
                  imgClassName="transition-transform duration-500 hover:scale-[1.03]"
                />
              </button>
            </Reveal>
          ))}
        </div>

        <Lightbox images={ALBUM} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      </section>

      {/* Ce qui reste a venir, et le renvoi vers les infos pratiques pour que la
          page ne soit pas un cul-de-sac. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        <Reveal
          className="rounded-2xl border border-dashed p-8 md:p-10"
          style={{ borderColor: 'var(--cava-line)' }}
        >
          <p className="max-w-[62ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {a.soon}
          </p>
          <a
            href={withBase('/informations-pratiques')}
            className="cava-navlink cava-ancre cava-ancre-lat mt-6 inline-flex items-center gap-2.5 text-[15px]"
            style={{ fontWeight: 500 }}
          >
            {t.pages['informations-pratiques'].title}{' '}
            <span className="cava-ancre-fleche" aria-hidden>
              →
            </span>
          </a>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
