'use client';

import Reveal from './Reveal';
import { SITE } from './data';
import { useI18n } from './i18n';

/**
 * Les deux façons de nous joindre, en grand, juste avant le bandeau — donc au
 * même endroit sur toutes les pages. Elles ne figurent plus dans la liste de
 * liens du footer : c'était le même lien deux fois à trente centimètres d'écart.
 */
export default function ContactCta() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <a
          href={`mailto:${SITE.email}`}
          className="cava-footlink group flex w-full items-center justify-between border-b border-t py-4 text-left md:py-5"
          style={{ borderColor: 'var(--cava-line)' }}
        >
          <span className="text-[clamp(1.7rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.contactLink}
          </span>
          <span className="cava-cta-arrow text-[clamp(1.4rem,3.5vw,2.6rem)]" aria-hidden>
            ↗
          </span>
        </a>
      </Reveal>
      <Reveal delay={60}>
        <a
          href={SITE.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="cava-footlink group flex w-full items-center justify-between border-b py-4 text-left md:py-5"
          style={{ borderColor: 'var(--cava-line)' }}
        >
          <span className="text-[clamp(1.7rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            Instagram
          </span>
          <span className="cava-cta-arrow text-[clamp(1.4rem,3.5vw,2.6rem)]" aria-hidden>
            ↗
          </span>
        </a>
      </Reveal>
    </section>
  );
}
