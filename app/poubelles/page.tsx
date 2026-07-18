'use client';

import Nav from '../Nav';
import Footer from '../Footer';
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

      {/* `nu` : PageHeader porte deja le titre, le composant n'a pas a le redire. */}
      <WasteSchedule nu />

      <CtaBadge
        href="/informations-pratiques"
        title={t.pages['informations-pratiques'].title}
        circleId="cava-c-poubelles-infos"
      />

      <Footer />
    </main>
  );
}
