'use client';

import ContactCta from './ContactCta';
import Marquee from './Marquee';
import Icon, { type IconName } from './Icon';
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

  /*
   * L'ordre suit celui de la barre du haut, puis les deux qui n'y sont pas.
   * Le picto de la casa porte un trait plus fin, celui de la poubelle un peu
   * plus gras : c'est ainsi qu'ils sont regles en haut, et deux rangees du
   * meme site ne doivent pas se dessiner differemment.
   */
  const RACCOURCIS: { href: string; label: string; icon: IconName; trait?: number }[] = [
    { href: withBase('/appartement'), label: t.apartment.label, icon: 'window', trait: 1.25 },
    { href: withBase('/calendrier'), label: t.stayPage.title, icon: 'calendar' },
    { href: withBase('/poubelles'), label: t.wastePage.title, icon: 'trash', trait: 1.7 },
    { href: `${withBase('/la-region')}#sons`, label: t.culturePage.title, icon: 'vinyl' },
    { href: `${withBase('/la-region')}#quiz`, label: t.quizPage.title, icon: 'hourglass' },
    { href: withBase('/italien'), label: t.italianPage.title, icon: 'parler' },
  ];
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
        </nav>

        {/* Bas de footer — les langues y sont sur TOUS les ecrans : c'est le
            point de chute commun, celui qu'on trouve sans chercher. */}
        <div className="mt-12 flex flex-col gap-6 text-[12px] sm:flex-row sm:items-center sm:justify-between" style={{ color: 'var(--cava-muted)' }}>
          <PersoLink />
          <LangSwitcher />
        </div>

        {/*
          LES RACCOURCIS, tous ensemble et a DROITE — Mag les voulait ici.

          Ce sont les memes que la barre du haut (la casa, le calendrier, les
          poubelles, sons & images), plus le quiz et le cours d'italien qui
          n'y tiennent pas : a 375 px, un cinquieme picto poussait deja le
          bouton menu hors de l'ecran, mesure faite. Le bas de page, lui, a la
          place — c'est le bon endroit pour la liste complete.

          Ils ne rejoignent pas la grande liste juste au-dessus : celle-la ne
          contient que des PAGES, et ni le quiz ni les poubelles n'en sont.
        */}
        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          {RACCOURCIS.map((r) => (
            <a
              key={r.href}
              href={r.href}
              aria-label={r.label}
              title={r.label}
              className="cava-vinyllink flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
            >
              <Icon name={r.icon} size={24} strokeWidth={r.trait} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
