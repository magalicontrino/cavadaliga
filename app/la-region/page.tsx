'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import Photo from '../Photo';
import PageHeader from '../PageHeader';
import { InfoBlocks } from '../SectionShell';
import { PAGE_ICONS } from '../data';
import { useI18n } from '../i18n';

export default function LaRegion() {
  const { t } = useI18n();
  const p = t.pages['la-region'];

  return (
    <main>
      <Nav current="/la-region" />

      <PageHeader title={p.title} intro={p.intro} />

      {/* Photo de Scicli en tête de page */}
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
