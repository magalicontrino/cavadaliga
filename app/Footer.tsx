'use client';

import Marquee from './Marquee';
import { NAV, SITE } from './data';
import { useI18n } from './i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24">
      {/* Bandeau défilant en haut du footer */}
      <div className="border-y py-6" style={{ borderColor: 'var(--cava-line)' }}>
        <Marquee items={[SITE.name, 'Scicli', 'Raguse', 'Val di Noto', t.region]} duration={38} />
      </div>

      <div className="mx-auto flex max-w-[110rem] flex-col gap-12 px-5 pb-10 pt-16 md:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <p className="text-[clamp(1.8rem,4vw,2.6rem)] leading-[1]" style={{ fontWeight: 500 }}>
              {SITE.name}
            </p>
            <p className="mt-3 text-[14px]" style={{ color: 'var(--cava-muted)' }}>
              {t.subLabels.join(' · ')}
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="cava-navlink mt-5 inline-block text-[14px]"
            >
              {t.writeUs}
            </a>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2">
            {NAV.map((item, i) => (
              <a key={item.href} href={item.href} className="cava-navlink text-[14px]" style={{ color: 'var(--cava-muted)' }}>
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
