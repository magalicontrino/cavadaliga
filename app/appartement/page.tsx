'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon from '../Icon';
import { withBase } from '../data';
import { useI18n } from '../i18n';

// La page dédiée à l'appartement. Volontairement légère : Mag l'a demandée
// « à venir » — le squelette est là (en-tête, intro, l'état d'attente), et le
// contenu (photos des pièces, plan, équipements) viendra le remplir. Le renvoi
// vers les infos pratiques évite qu'elle soit un cul-de-sac en attendant.
export default function Appartement() {
  const { t } = useI18n();
  const a = t.apartment;

  return (
    <main>
      <Nav current="/appartement" />

      <PageHeader title={a.title} intro={a.intro} stackPill />

      <section className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        <Reveal
          className="rounded-2xl border border-dashed p-8 md:p-12"
          style={{ borderColor: 'var(--cava-line)' }}
        >
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
          >
            <Icon name="home" size={24} />
          </span>
          <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {a.soon}
          </p>
          <a
            href={withBase('/informations-pratiques')}
            className="cava-navlink cava-ancre cava-ancre-lat mt-6 inline-flex items-center gap-2.5 text-[15px]"
            style={{ fontWeight: 500 }}
          >
            {t.pages['informations-pratiques'].title}{' '}
            <span className="cava-ancre-fleche" aria-hidden>
              →
            </span>
          </a>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
