'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import PageHeader from '../PageHeader';
import Occupancy from '../Occupancy';
import CtaBadge from '../CtaBadge';
import { useI18n } from '../i18n';

/**
 * Le calendrier des sejours — « la maison est libre quand ? ».
 *
 * Elle n'est PAS dans le menu, volontairement : on y accede par le picto
 * calendrier de la barre du haut, present sur toutes les pages, et par sa
 * vignette sur l'accueil. C'est une page qu'on consulte, pas une rubrique
 * qu'on parcourt.
 *
 * Elle se ferme sur les evenements, et les evenements renvoient ici : les deux
 * repondent a la meme question a deux echelles — quand la maison est prise, et
 * ce qui se passe au village pendant ce temps-la.
 */
export default function Calendrier() {
  const { t } = useI18n();

  return (
    <main>
      <Nav current="/calendrier" />

      <PageHeader title={t.stayPage.title} intro={t.stayPage.intro} />

      <Occupancy />

      <CtaBadge
        href="/evenements"
        title={t.calendarPage.title}
        circleId="cava-c-calendrier-evenements"
      />

      <Footer />
    </main>
  );
}
