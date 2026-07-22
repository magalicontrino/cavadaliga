'use client';

/*
 * LE SOUS-MENU D'UNE PAGE LONGUE — Mag, devant « Préparer le voyage » :
 * « peut-être un sous-menu ici ? »
 *
 * Elle avait raison, et la page le disait deja sans qu'on l'ecoute : elle
 * portait depuis quelques jours des renvois d'une section a l'autre
 * (« l'aeroport de Catane » qui ramene plus haut). On ne fabrique ce genre de
 * lien que dans une page ou l'on se PERD — la vraie reponse etait un plan.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IL SUIT LE DEFILEMENT, ET IL DIT OU L'ON EST
 *
 * Une rangee d'ancres qui reste en haut ne sert qu'a moitie : elle permet
 * d'aller ailleurs, mais pas de savoir ou l'on est. La pastille de la section
 * courante s'allume donc, et c'est la moitie utile — sur un telephone, ou l'on
 * ne voit qu'un ecran a la fois, c'est la seule chose qui dit « il reste des
 * sections apres celle-ci ».
 *
 * ON REGARDE UNE BANDE, PAS UN POINT. Le repere est une ligne horizontale au
 * quart superieur de l'ecran : la section courante est la DERNIERE dont le
 * haut est passe au-dessus. Ma premiere version prenait la section la plus
 * visible, ce qui faisait clignoter la pastille entre deux voisines quand une
 * section courte passait — un titre suivi de trois lignes occupait moins de
 * place que la fin de la precedente, et le sous-menu revenait en arriere.
 *
 * On ecoute le defilement plutot que des IntersectionObserver par section : il
 * n'y a qu'un seul etat a tenir, et un observateur par cible se serait declenche
 * en desordre au chargement, quand les hauteurs bougent encore.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState } from 'react';

export type Etape = { id: string; label: string };

export default function SousMenu({ etapes }: { etapes: Etape[] }) {
  const [actif, setActif] = useState<string | null>(null);
  const barre = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let brut = 0;
    const calcule = () => {
      brut = 0;
      // Le quart superieur : assez bas pour que la section soit vraiment
      // entamee, assez haut pour ne pas attendre qu'elle remplisse l'ecran.
      const repere = window.innerHeight * 0.25;
      let courant: string | null = null;
      for (const e of etapes) {
        const el = document.getElementById(e.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= repere) courant = e.id;
      }
      /*
       * LE BAS DE PAGE FORCE LA DERNIERE. Sans ça, la derniere section ne
       * s'allume jamais si elle est plus courte que le repere — on ne peut plus
       * defiler, son haut reste sous la ligne, et le sous-menu montre
       * l'avant-derniere alors qu'on lit la fin.
       */
      const bas = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      setActif(bas ? etapes[etapes.length - 1].id : courant ?? etapes[0].id);
    };
    const auCadre = () => {
      // rAF plutot qu'un appel par evenement : le defilement en tire des
      // dizaines par seconde, et seul le dernier compte.
      if (brut) return;
      brut = requestAnimationFrame(() => {
        brut = 0;
        calcule();
      });
    };
    calcule();
    window.addEventListener('scroll', auCadre, { passive: true });
    window.addEventListener('resize', auCadre);
    return () => {
      window.removeEventListener('scroll', auCadre);
      window.removeEventListener('resize', auCadre);
      if (brut) cancelAnimationFrame(brut);
    };
  }, [etapes]);

  /*
   * LA PASTILLE ACTIVE SE RAMENE DANS SA BARRE. Sur telephone la rangee
   * deborde et defile lateralement : sans ça, on arrive au bout de la page
   * avec la pastille allumee hors de l'ecran, et le plan ne montre plus rien.
   */
  useEffect(() => {
    if (!actif || !barre.current) return;
    const p = barre.current.querySelector<HTMLElement>(`[data-etape="${actif}"]`);
    if (!p) return;
    const b = barre.current.getBoundingClientRect();
    const r = p.getBoundingClientRect();
    if (r.left < b.left || r.right > b.right) {
      barre.current.scrollTo({ left: p.offsetLeft - 16, behavior: 'smooth' });
    }
  }, [actif]);

  /*
   * IL N'EST ENVELOPPE DANS RIEN, ET C'EST LA CONDITION POUR QU'IL COLLE.
   *
   * Je l'avais d'abord pose dans un `<div>` qui ne contenait que lui. Un
   * element `sticky` ne peut pas sortir de son parent : ce parent faisait la
   * hauteur du sous-menu, si bien qu'il se decollait au premier pixel de
   * defilement. Mesure : il etait a -1259 px de l'ecran alors qu'il aurait du
   * etre a 72. Ça ne casse rien, ça ne leve aucune erreur, ça ne colle
   * simplement pas.
   *
   * Il est donc rendu a la racine de la page, ou son parent fait toute la
   * hauteur, et il porte lui-meme sa marge interieure.
   */
  return (
    <div
      className="sticky top-[4.5rem] z-30 py-3 md:top-[5.25rem]"
      style={{
        // Le fond n'est pas decoratif : sans lui, le texte de la page defile
        // DERRIERE les pastilles et les rend illisibles.
        background: 'var(--cava-bg)',
        borderBottom: '1px solid var(--cava-line)',
      }}
    >
      <nav aria-label="Sections de la page" className="mx-auto max-w-[110rem] px-5 md:px-10">
        <div ref={barre} className="cava-swipe -my-1 flex gap-2 overflow-x-auto py-1">
          {etapes.map((e) => {
            const on = e.id === actif;
            return (
              <a
                key={e.id}
                href={`#${e.id}`}
                data-etape={e.id}
                aria-current={on ? 'true' : undefined}
                className="shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-200"
                style={{
                  /*
                   * L'ACTIVE EST PLEINE, PAS SEULEMENT COLOREE. Une pastille qui
                   * ne changerait que de teinte disparaitrait pour qui distingue
                   * mal les couleurs ; le fond sombre se voit en noir et blanc.
                   * Blanc sur l'encre : 12,9.
                   */
                  background: on ? 'var(--cava-ink)' : 'transparent',
                  color: on ? 'var(--cava-bg)' : 'var(--cava-muted)',
                  borderColor: on ? 'var(--cava-ink)' : 'var(--cava-line)',
                  fontWeight: on ? 600 : 400,
                }}
              >
                {e.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
