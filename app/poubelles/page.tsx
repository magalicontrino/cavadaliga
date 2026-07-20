'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Quiz from '../Quiz';
import PageHeader from '../PageHeader';
import WasteSchedule from '../WasteSchedule';
import CtaBadge from '../CtaBadge';
import { useI18n } from '../i18n';

/**
 * La sortie des poubelles — sa propre page.
 *
 * Le calendrier vivait deja dans les infos pratiques, derriere un bouton de
 * tri. C'est pourtant la question la plus pressante d'un sejour : « qu'est-ce
 * qu'on sort ce soir ? », et elle se pose souvent tard, une fois. La page lui
 * donne une adresse a elle, atteignable en un geste depuis le picto de la
 * barre du haut.
 *
 * Le calendrier n'est PAS recopie ici : c'est le meme composant qu'aux infos
 * pratiques. Une seule source, donc une seule verite — corriger un jour le
 * corrige aux deux endroits.
 */
export default function Poubelles() {
  const { t } = useI18n();
  const w = t.wastePage;

  return (
    <main>
      <Nav current="/poubelles" />

      <PageHeader title={w.title} intro={w.intro} />

      {/* `nu` : PageHeader porte deja le titre, le composant n'a pas a le redire.
          `id` et marge d'ancre : le quiz du bas renvoie ici — cette page n'avait
          aucune section nommee, et « relire le passage » serait tombe dans le
          vide. */}
      <div id="tri" className="scroll-mt-24">
        <WasteSchedule nu />
      </div>

      <CtaBadge
        href="/informations-pratiques"
        title={t.pages['informations-pratiques'].title}
        circleId="cava-c-poubelles-infos"
      />


      {/*
        LE QUIZ DE LA PAGE — Mag : « tu peux remettre a chaque fois le meme
        quizz mais pointe sur le sujet en rapport avec la page ». Le meme
        composant que sur « La region », la famille et l'italien ; seuls les
        themes changent, et avec eux les questions.

        La regle ne bouge pas : chaque bonne reponse est ecrite plus haut sur
        CETTE page, et « relire le passage » y mene par l'ancre de sa section.
      */}
      <Quiz only={['dechets']} titre={t.quizPage.wasteTitle} intro={t.quizPage.wasteIntro} ancreLocale="tri" />

      <Footer />
    </main>
  );
}
