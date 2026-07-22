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
          {/*
            LA BIBLIOGRAPHIE, ET POURQUOI ELLE N'EST PAS DANS LA RANGEE DE
            PICTOS. Mag voulait le lien au pied de page avec l'asterisque —
            c'est fait, mais pas la-bas : cette rangee tient sur UNE ligne a
            375 px, elle l'a demande, et le calcul est ecrit plus bas. Six
            pictos y prennent 314 px pour 335 disponibles ; un septieme en
            demanderait 368 et le ferait tomber a la ligne.

            Sa place est ici, au milieu du bas de page, et c'est plus juste :
            l'asterisque renvoie a la note depuis les manuscrits, et une note
            se met en bas. Avec son mot a cote, il se comprend sans survol.
          */}
          <a
            href={withBase('/bibliographie')}
            className="cava-navlink inline-flex items-center gap-2 self-start"
            style={{ color: 'var(--cava-muted)' }}
          >
            <Icon name="asterisque" size={13} />
            {t.biblio.label}
          </a>
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
        {/*
          UNE SEULE LIGNE — Mag : « non laisse en 1 seule ligne ».

          Le calcul, sur un telephone de 375 px : six pictos de 48 px avec 12 px
          d'ecart demandent 348 px pour 335 disponibles. Il manquait treize
          pixels, et le sixieme tombait tout seul a la ligne.

          Les pictos passent donc a 44 px et l'ecart a 10 sur telephone : 314 px
          demandes, vingt et un de marge. 44 PX EST UN PLANCHER, PAS UN CHOIX —
          c'est la taille minimale recommandee pour une cible tactile, et
          descendre en dessous rendrait les liens durs a viser pour gagner un
          alignement. Des 640 px, on revient a 48 et 12 : la place est la.

          CE QUE ÇA NE REGLE PAS : a 320 px (les vieux iPhone SE), il ne reste
          que 280 px utiles. Six pictos de 44 en demandent 314. Sur ces
          telephones-la, le sixieme passera toujours a la ligne — sauf a
          descendre les cibles a 40 px, ce qui echangerait un defaut visible
          contre un defaut d'usage.
        */}
        <div className="mt-8 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
          {RACCOURCIS.map((r) => (
            <a
              key={r.href}
              href={r.href}
              aria-label={r.label}
              title={r.label}
              className="cava-vinyllink flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12"
              style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
            >
              <Icon name={r.icon} size={22} strokeWidth={r.trait} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
