'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Photo from '../Photo';
import CtaBadge from '../CtaBadge';
import Lightbox from '../Lightbox';
import Gallery from '../Gallery';
import { GALLERY_STRIP } from '../data';
import { useI18n } from '../i18n';

// L'album de la maison : les vraies photos, deposees dans /public/appart/.
// Ordre pense comme une visite — on entre par la terrasse, puis le sejour, la
// cuisine, les chambres, la salle de bain.
const ALBUM = Array.from({ length: 12 }, (_, i) => `/appart/appart-${String(i + 1).padStart(2, '0')}.jpg`);
const TONES = ['sand', 'terra', 'pink', 'ink'] as const;

// La visite se fait piece par piece : chaque groupe = les indices de ses photos
// dans ALBUM. Le decoupage est structurel (il ne change pas avec la langue) ;
// les titres vivent dans i18n.apartment.rooms, dans ce meme ordre.
// Le hamac rejoint la terrasse arriere (c'est le meme dehors), et les quatre
// vues d'eau tiennent sous un seul titre — c'etait la meme legende repetee
// trois fois, ce qui salissait la galerie.
const ROOMS: number[][] = [
  [0], // la terrasse avant
  [1, 2], // la terrasse arriere + le hamac
  [3], // le sejour
  [4], // la cuisine
  [5, 6], // la grande chambre, vue large puis de pres — c'est la meme piece
  [7], // la chambre-bureau
  [8, 9, 10, 11], // la salle de bain + la douche
];

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

      {/* La visite, piece par piece. Chaque bande porte son titre en grand a
          gauche — il reste au regard (sticky) pendant qu'on parcourt ses photos
          a droite — et un filet la separe de la suivante. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-16 md:px-10">
        {ROOMS.map((photos, r) => (
          <div
            key={a.rooms[r]}
            className="grid gap-6 border-t py-12 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-12 md:py-16 first:border-t-0 first:pt-0"
            style={{ borderColor: 'var(--cava-line)' }}
          >
            <Reveal as="h2" className="self-start md:sticky md:top-24">
              <span
                className="block text-[clamp(1.7rem,4.4vw,3rem)] uppercase leading-[0.95] tracking-[-0.02em]"
                style={{ fontWeight: 900 }}
              >
                {a.rooms[r]}
              </span>
            </Reveal>

            {/* Une seule photo occupe toute la colonne ; a plusieurs, elles se
                rangent en deux colonnes MACONNEES : une grille alignerait les
                rangees, et un portrait a cote d'un paysage creusait un grand
                vide sous le plus court. */}
            <div className={photos.length > 1 ? 'gap-5 sm:columns-2 [&>*]:mb-5' : ''}>
              {photos.map((i, n) => {
                const legende = a.captions[i];
                // La legende ne s'affiche que si elle dit autre chose que le
                // titre de la piece : sinon on lisait « La salle de bain »
                // quatre fois de suite sous le meme titre.
                const utile = legende && legende !== a.rooms[r];
                return (
                  <Reveal key={ALBUM[i]} delay={n * 90} className="flex break-inside-avoid flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      aria-label={legende ?? `${a.albumAlt} — ${i + 1}`}
                      className="block w-full cursor-zoom-in"
                    >
                      <Photo
                        natural
                        src={ALBUM[i]}
                        alt={legende ?? `${a.albumAlt} — ${i + 1}`}
                        tone={TONES[i % TONES.length]}
                        label={`${a.albumAlt} — à venir`}
                        className="w-full rounded-2xl"
                        imgClassName="transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </button>
                    {utile && (
                      <span className="text-[13px] leading-[1.4]" style={{ color: 'var(--cava-muted)' }}>
                        {legende}
                      </span>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}

        <Lightbox images={ALBUM} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      </section>

      {/* Meme fin que l'accueil, apres l'album : le bandeau d'images defilant
          (la meme liste partagee, GALLERY_STRIP), puis le coucher de soleil en
          pleine largeur — la derniere image qu'on emporte. */}
      <section className="py-24 md:py-28">
        <Gallery images={GALLERY_STRIP} />
      </section>

      <section>
        <Photo
          src="/picture-sicile/coucher-soleil.jpg"
          alt={t.sunsetAlt}
          tone="terra"
          className="aspect-[2/1] w-full md:aspect-[2.4/1]"
        />
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
