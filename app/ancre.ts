'use client';

import { useEffect } from 'react';

/**
 * Aller a la section visee par « #… » — quand elle existe enfin.
 *
 * Le saut natif du navigateur ne marche pas ici. Les pages du site sont des
 * composants client : au moment ou le navigateur cherche l'ancre, la page est
 * encore vide, il ne trouve rien, et il renonce SANS REESSAYER. Mesure au
 * banc sur /preparer-le-voyage#valise : defilement a 0 pour une section qui
 * se trouvait a 2357 px.
 *
 * On regarde donc a chaque image pendant une seconde, et on s'arrete des que
 * la section est la. Une seconde suffit largement — et si l'ancre ne designe
 * rien, on abandonne au lieu de tourner en fond.
 *
 * La marge sous la barre du haut ne se regle pas ici : c'est `scroll-mt-24`
 * sur la section elle-meme, pour que le lien pose depuis un autre endroit du
 * site se comporte pareil.
 */
export function useAncre() {
  useEffect(() => {
    const cle = window.location.hash.slice(1);
    if (!cle) return;

    let vivant = true;
    let minuterie = 0;
    const jusqua = performance.now() + 1000;
    /*
     * On reessaie par MINUTERIE, pas par requestAnimationFrame.
     *
     * La premiere version bouclait sur rAF, et ne partait jamais quand
     * l'onglet n'etait pas au premier plan : un onglet en arriere-plan ne
     * recoit pas d'images. Or c'est exactement le cas au moment ou l'on
     * revient sur un onglet ouvert plus tot, ou quand le lien s'ouvre a cote.
     * Une minuterie, elle, se declenche dans tous les cas.
     */
    const chercher = () => {
      if (!vivant) return;
      const el = document.getElementById(cle);
      if (el) {
        // `instant`, et pas le glissement doux du site : on arrive d'une AUTRE
        // page, il n'y a donc rien a suivre du regard — traverser deux mille
        // pixels au ralenti ne renseigne personne. Le glissement doux garde
        // tout son sens pour les ancres internes a une page, ou il montre le
        // chemin.
        el.scrollIntoView({ block: 'start', behavior: 'instant' });
        return;
      }
      if (performance.now() < jusqua) minuterie = window.setTimeout(chercher, 50);
    };
    chercher();
    return () => {
      vivant = false;
      window.clearTimeout(minuterie);
    };
  }, []);
}
