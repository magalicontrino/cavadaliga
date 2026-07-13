'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import Photo from '../Photo';
import PageHeader from '../PageHeader';
import { useI18n } from '../i18n';

// Galerie souvenir de Salva — vraies photos dans /public/picture-sicile/.
// Pas de repli déco (illustrations siciliennes) pour des portraits : à défaut
// de photo, un dégradé sobre + libellé s'affiche (voir Photo.tsx).
const TONES = ['ink', 'terra', 'pink', 'sand'] as const;
// Légendes optionnelles par numéro de photo (rien = pas de légende).
const CAPTIONS: Record<number, string> = {
  20: 'Avec Manon et Ève',
};
const SALVA = Array.from({ length: 20 }, (_, i) => ({
  src: `/picture-sicile/salva-${i + 1}.jpg`,
  caption: CAPTIONS[i + 1],
}));

export default function Salva() {
  const { t } = useI18n();
  const s = t.salvaPage;

  return (
    <main>
      <Nav current="/salva" />

      <PageHeader title={s.title} intro={s.intro} stackPill />

      <section className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        {/* Galerie en maçonnerie (masonry) — colonnes CSS, chaque photo garde
            ses proportions. break-inside-avoid empêche de couper une tuile. */}
        <div className="columns-2 gap-5 sm:columns-3 lg:columns-4 [&>*]:mb-5">
          {SALVA.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 90} className="flex break-inside-avoid flex-col gap-3">
              <Photo
                natural
                src={photo.src}
                alt={photo.caption ?? `${s.title} — ${i + 1}`}
                tone={TONES[i % TONES.length]}
                label={`${s.title} — photo à venir`}
                className="w-full rounded-2xl"
              />
              {photo.caption && (
                <span className="text-[13px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
                  {photo.caption}
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
