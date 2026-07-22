'use client';

/*
 * LA BIBLIOGRAPHIE — Mag : « fais une page bibliographie avec des cards et
 * toutes tes sources ».
 *
 * ELLE NE RECOPIE RIEN. Les sources vivent dans `sourcesData.ts`, et cette page
 * les LIT. C'est la seule façon qu'elle reste vraie : une bibliographie
 * recopiee a la main vieillit au premier lien change, et personne ne s'en
 * apercoit puisque les deux listes ont l'air d'accord. Ici, ajouter une source
 * a une section la fait apparaitre ici toute seule.
 *
 * LES SECTIONS SONT NOMMEES DEPUIS `i18n`, PAS EN DUR. Le nom d'une section
 * change avec la langue, et l'ecrire ici en francais aurait donne une page
 * bilingue par accident. Quand un nom manque, on affiche la clef plutot que
 * rien : un trou visible se corrige, un trou invisible reste.
 */
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import { useI18n } from '../i18n';
import { SOURCES } from '../sourcesData';

export default function Bibliographie() {
  const { t } = useI18n();
  const rf = t.regionFilter;

  /*
   * Le nom lisible d'une section. Les clefs viennent de trois pages
   * differentes — « La region », « Preparer le voyage », la famille — d'ou ce
   * tableau, seul endroit qui les rassemble.
   */
  const NOMS: Record<string, string> = {
    lieux: rf.places,
    sports: rf.sports,
    faune: t.faunaPage.title,
    coutumes: rf.customs,
    specialites: rf.specialties,
    alcools: rf.drinks,
    cafe: rf.coffee,
    pastasciutta: rf.pasta,
    symboles: rf.symbols,
    legendes: rf.legends,
    scopa: rf.scopa,
    etna: rf.etna,
    arabe: rf.arab,
    valguarnera: t.valguarneraPage.title,
    avion: t.prepare.groups[0]?.title ?? 'avion',
    voiture: t.prepare.groups[1]?.title ?? 'voiture',
    train: t.prepare.groups[2]?.title ?? 'train',
    'depuis-laeroport': t.prepare.groups[3]?.title ?? 'aéroport',
  };

  const entrees = Object.entries(SOURCES).filter(([, v]) => v.length > 0);
  const total = entrees.reduce((n, [, v]) => n + v.length, 0);

  return (
    <main>
      <Nav current="/bibliographie" />

      <PageHeader title={t.biblio.title} intro={t.biblio.intro} />

      <section className="mx-auto max-w-[110rem] px-5 pb-24 pt-6 md:px-10">
        {/*
          LE COMPTE EST CALCULE, JAMAIS ECRIT. « Vingt-six sources » tape a la
          main serait faux des la prochaine que j'ajoute — et faux en silence.
        */}
        <Reveal className="mb-10 flex items-center gap-3 text-[13px] uppercase tracking-[0.2em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
          <Icon name="asterisque" size={16} />
          {t.biblio.count.replace('{n}', String(total)).replace('{s}', String(entrees.length))}
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {entrees.map(([cle, liens], i) => (
            <Reveal
              key={cle}
              delay={(i % 2) * 80}
              className="flex flex-col gap-4 p-8 md:p-10"
              style={{ background: 'var(--cava-bg)' }}
            >
              <h2 className="text-[clamp(1.05rem,2vw,1.3rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {NOMS[cle] ?? cle}
              </h2>
              <ul className="flex flex-col gap-3">
                {liens.map((l) => (
                  <li key={l.url} className="flex gap-2.5 text-[14px] leading-[1.6]">
                    <span aria-hidden className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cava-lien-encre"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="mt-10 max-w-[68ch] border-l-2 pl-5 text-[15px] italic leading-[1.7]"
          style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}
        >
          {t.biblio.note}
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
