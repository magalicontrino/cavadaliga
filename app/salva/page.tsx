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
const SALVA = Array.from({ length: 16 }, (_, i) => ({ src: `/picture-sicile/salva-${i + 1}.jpg` }));

export default function Salva() {
  const { t } = useI18n();
  const s = t.salvaPage;

  return (
    <main>
      <Nav current="/salva" />

      <PageHeader title={s.title} intro={s.intro} />

      <section className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SALVA.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 90}>
              <Photo
                src={photo.src}
                alt={`${s.title} — ${i + 1}`}
                tone={TONES[i % TONES.length]}
                label={`${s.title} — photo à venir`}
                className="aspect-[3/4] w-full rounded-2xl"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
