'use client';

import Marquee from './Marquee';
import { NAV, SITE, withBase } from './data';
import { useI18n } from './i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24">
      {/* Bandeau défilant en haut du footer */}
      <div className="border-y py-6" style={{ borderColor: 'var(--cava-line)' }}>
        <Marquee items={['Scicli', 'Ragusa', 'Modica', 'Noto', 'Donnalucata', 'Marina di Ragusa']} duration={38} />
      </div>

      <div className="mx-auto flex max-w-[110rem] flex-col gap-12 px-5 pb-10 pt-16 md:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <a
            href={`mailto:${SITE.email}`}
            className="cava-navlink inline-block self-start text-[14px]"
          >
            {t.writeUs}
          </a>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2">
            {NAV.map((item, i) => (
              <a key={item.href} href={withBase(item.href)} className="cava-navlink text-[14px]" style={{ color: 'var(--cava-muted)' }}>
                {t.nav[i]}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 text-[12px] md:flex-row md:items-center" style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}>
          <span>Copyright © {SITE.author}</span>
          <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="cava-navlink uppercase tracking-[0.16em]">
            Instagram {SITE.instagram.handle}
          </a>
        </div>
      </div>
    </footer>
  );
}
