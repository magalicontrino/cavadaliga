'use client';

import Marquee from './Marquee';
import Weather from './Weather';
import { NAV, SITE, withBase } from './data';
import { useI18n } from './i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t" style={{ borderColor: 'var(--cava-line)' }}>
      {/* Bandeau défilant — fond noir contrasté */}
      <div className="py-6" style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}>
        <Marquee items={['Scicli', 'Ragusa', 'Modica', 'Noto', 'Donnalucata', 'Marina di Ragusa']} duration={38} />
      </div>

      <div className="mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-20">
        {/* Météo dynamique + bouton écrire */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
          <Weather />
          <a
            href={`mailto:${SITE.email}`}
            className="cava-pill inline-flex shrink-0 items-center self-start px-7 py-3 text-[15px]"
          >
            {t.writeUs}
          </a>
        </div>

        {/* Liens géants (maximaliste) */}
        <nav className="mt-14 border-t md:mt-20" style={{ borderColor: 'var(--cava-line)' }}>
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href.startsWith('#') ? item.href : withBase(item.href)}
              className="cava-footlink group flex items-center justify-between border-b py-4 md:py-5"
              style={{ borderColor: 'var(--cava-line)' }}
            >
              <span className="text-[clamp(1.7rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
                {t.nav[i]}
              </span>
              <span className="cava-footlink-arrow text-[clamp(1.1rem,3vw,2rem)]" aria-hidden>
                ↗
              </span>
            </a>
          ))}
        </nav>

        {/* Bas de footer */}
        <div
          className="mt-12 flex flex-col-reverse items-start gap-4 text-[12px] md:flex-row md:items-center md:justify-between"
          style={{ color: 'var(--cava-muted)' }}
        >
          <span className="uppercase tracking-[0.16em]">Copyright © {SITE.author}</span>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cava-navlink uppercase tracking-[0.16em]"
          >
            Instagram {SITE.instagram.handle}
          </a>
        </div>
      </div>
    </footer>
  );
}
