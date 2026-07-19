'use client';

import ContactCta from './ContactCta';
import Marquee from './Marquee';
import Icon, { type IconName } from './Icon';
import PersoLink from './PersoLink';
import { NAV, withBase } from './data';
import { useI18n, LangSwitcher } from './i18n';

/** Un lien géant du footer — une page du site. */
function FootLink({ href, label, icon }: { href: string; label: string; icon?: IconName }) {
  return (
    <a
      href={href}
      className="cava-footlink group flex items-center justify-between border-b py-4 md:py-5"
      style={{ borderColor: 'var(--cava-line)' }}
    >
      <span className="flex items-center gap-3 text-[clamp(1.7rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
        {/* Le picto ne sert qu'au quiz : il dit « ceci est un jeu », au milieu
            d'une liste de rubriques. Les pages, elles, n'en ont pas besoin. */}
        {icon && <Icon name={icon} size={28} strokeWidth={1.6} />}
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

      {/* Le bas de page se termine PLUS BAS que le reste : la bulle
          « Demander » est fixe dans un coin et venait recouvrir cette rangee —
          le « Copyright © Mag » quand elle etait a gauche, le selecteur de
          langue depuis qu'elle est a droite. La marge protege les deux, quel
          que soit le cote ou elle se tient. */}
      <div className="mx-auto max-w-[110rem] px-5 pb-28 pt-16 md:px-10 md:pb-32 md:pt-20">
        {/* Liens géants (maximaliste) — les pages. Contact et Instagram vivent
            au-dessus du bandeau, pas ici. */}
        <nav className="border-t" style={{ borderColor: 'var(--cava-line)' }}>
          {NAV.map((item, i) => (
            <FootLink key={item.href} href={withBase(item.href)} label={t.nav[item.href]} />
          ))}
          {/* Le quiz n'est pas une page, mais il se cherche comme une : il a
              donc sa ligne ici, a la suite des autres, avec son picto pour
              qu'on voie tout de suite que c'est un jeu et pas une rubrique. */}
          <FootLink href={`${withBase('/la-region')}#quiz`} label={t.quizPage.title} icon="target" />
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
