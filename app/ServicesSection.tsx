'use client';

import SectionHeading from './SectionHeading';
import { InfoBlocks } from './SectionShell';
import { PAGE_ICONS } from './data';
import { useI18n } from './i18n';

// Rubrique « Services locaux & contacts utiles ».
export default function ServicesSection() {
  const { t } = useI18n();
  const p = t.pages['services-locaux'];

  return (
    <>
      <SectionHeading id="services-locaux" title={p.title} intro={p.intro} />
      {p.blocks && (
        <div className="mx-auto max-w-[110rem] px-5 pb-8 md:px-10">
          <InfoBlocks blocks={p.blocks} icons={PAGE_ICONS['services-locaux']} />
        </div>
      )}
    </>
  );
}
