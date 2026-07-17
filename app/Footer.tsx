'use client';

import ContactCta from './ContactCta';
import Marquee from './Marquee';
import PersoLink from './PersoLink';
import { NAV, withBase } from './data';
import { useI18n, LangSwitcher } from './i18n';

/** Un lien géant du footer — une page du site. */
function FootLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="cava-footlink group flex items-center justify-between border-b py-4 md:py-5"
      style={{ borderColor: 'var(--cava-line)' }}
    >
      <span className="text-[clamp(1.7rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
        {label}
      </span>
      <span className="cava-footlink-arrow text-[clamp(1.1rem,3vw,2rem)]" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t" style={{ borderColor: 'var(--cava-line)' }}>
      {/* Nous joindre, en grand, au-dessus du bandeau */}
      <ContactCta />

      {/* Bandeau défilant — fond noir contrasté */}
      <div className="py-6" style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}>
        <Marquee items={['Scicli', 'Ragusa', 'Modica', 'Noto', 'Donnalucata', 'Marina di Ragusa']} duration={38} />
      </div>

      <div className="mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-20">
        {/* Liens géants (maximaliste) — les pages. Contact et Instagram vivent
            au-dessus du bandeau, pas ici. */}
        <nav className="border-t" style={{ borderColor: 'var(--cava-line)' }}>
          {NAV.map((item, i) => (
            <FootLink key={item.href} href={withBase(item.href)} label={t.nav[item.href]} />
          ))}
        </nav>

        {/* Bas de footer — les langues y sont sur TOUS les ecrans : c'est le
            point de chute commun, celui qu'on trouve sans chercher. */}
        <div className="mt-12 flex flex-col gap-6 text-[12px] sm:flex-row sm:items-center sm:justify-between" style={{ color: 'var(--cava-muted)' }}>
          <PersoLink />
          <LangSwitcher />
        </div>
      </div>
    </footer>
  );
}
