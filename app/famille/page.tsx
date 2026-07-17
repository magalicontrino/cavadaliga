'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import Photo from '../Photo';
import Lightbox from '../Lightbox';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import FamilyTree from '../FamilyTree';
import { SITE } from '../data';
import { useI18n } from '../i18n';

// Galerie souvenir de Salva — vraies photos dans /public/picture-sicile/.
// Pas de repli déco (illustrations siciliennes) pour des portraits : à défaut
// de photo, un dégradé sobre + libellé s'affiche (voir Photo.tsx).
const TONES = ['ink', 'terra', 'pink', 'sand'] as const;
// Légendes optionnelles par numéro de photo (rien = pas de légende).
const CAPTIONS: Record<number, string> = {
  20: 'Avec Manon et Eve',
};
const SALVA = Array.from({ length: 20 }, (_, i) => ({
  src: `/picture-sicile/salva-${i + 1}.jpg`,
  caption: CAPTIONS[i + 1],
}));

export default function Salva() {
  const { t } = useI18n();
  const s = t.salvaPage;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main>
      <Nav current="/famille" />

      <PageHeader title={s.title} intro={s.intro} stackPill />

      {/* L'arbre vit tout en bas, apres la galerie : sans ce renvoi, il fallait
          deviner qu'il existe. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-10 md:px-10">
        <Reveal>
          <a href="#arbre" className="cava-pill inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px]">
            <Icon name="landmark" size={16} /> {s.treeTitle} <span aria-hidden>↓</span>
          </a>
        </Reveal>
      </section>

      {/* Histoire de la famille — bloc éditorial (filet + label + colonne) */}
      <section className="mx-auto max-w-[110rem] px-5 pb-16 md:px-10">
        <Reveal className="border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <span className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-muted)' }}>
              {s.historyTitle}
            </span>
            <p className="max-w-[64ch] text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7]">{s.historyText}</p>
          </div>
        </Reveal>
      </section>

      {/* Galerie souvenirs */}
      <section className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        {/* Galerie en maçonnerie (masonry) — colonnes CSS, chaque photo garde
            ses proportions. break-inside-avoid empêche de couper une tuile. */}
        <div className="columns-2 gap-5 sm:columns-3 lg:columns-4 [&>*]:mb-5">
          {SALVA.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 90} className="flex break-inside-avoid flex-col gap-3">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label="Agrandir la photo"
                className="block w-full cursor-zoom-in"
              >
                <Photo
                  natural
                  src={photo.src}
                  alt={photo.caption ?? `${s.title} — ${i + 1}`}
                  tone={TONES[i % TONES.length]}
                  label={`${s.title} — photo à venir`}
                  className="w-full rounded-2xl"
                  imgClassName="transition-transform duration-500 hover:scale-[1.03]"
                />
              </button>
              {photo.caption && (
                <span className="text-[13px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
                  {photo.caption}
                </span>
              )}
            </Reveal>
          ))}
        </div>

        <Lightbox images={SALVA.map((p) => p.src)} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      </section>

      {/* Arbre généalogique — cible du renvoi place sous le titre de la page. */}
      <section id="arbre" className="mx-auto max-w-[110rem] scroll-mt-8 px-5 pb-24 md:px-10">
        <Reveal>
          {/* Le meme habit que le titre de la page : capitales, gras, et le
              dernier mot enferme dans sa pilule. Plus petit, parce qu'une
              section n'est pas une page. */}
          <h2
            className="max-w-[16ch] text-[clamp(1.8rem,4.4vw,3.2rem)] uppercase leading-[0.95] tracking-[-0.02em]"
            style={{ fontWeight: 900 }}
          >
            {s.treeTitle.split(' ').slice(0, -1).join(' ')}{' '}
            <span
              className="inline-block whitespace-nowrap rounded-full border-2 px-4 pb-1 pt-0.5 leading-none"
              style={{ borderColor: 'var(--cava-ink)' }}
            >
              {s.treeTitle.split(' ').at(-1)}
            </span>
          </h2>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
            {s.treeNote}
          </p>
          <div className="mt-12">
            <FamilyTree />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(s.treeAddSubject)}`}
              className="cava-treeadd inline-flex items-center rounded-full border-2 border-dashed px-5 py-2 text-[13px]"
              style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-pink)', fontWeight: 500 }}
            >
              {s.treeAdd}
            </a>
            <span className="text-[13px]" style={{ color: 'var(--cava-muted)' }}>
              {s.treeExample}
            </span>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
