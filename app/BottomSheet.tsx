'use client';

import { useEffect, type ReactNode } from 'react';

/**
 * La feuille qui glisse depuis le BAS de l'ecran — Mag l'a demandee sur son
 * modele, ou l'on tape un choix et ou les options montent d'en dessous.
 *
 * Elle est pensee POUR LE TELEPHONE : c'est la que le pouce atteint le bas de
 * l'ecran sans effort. Sur grand ecran elle marche encore, mais les endroits
 * qui l'ouvrent sont `md:hidden` — le bureau garde ses listes en clair.
 *
 * Elle vit tout en haut de la pile (z-[80]) : au-dessus de la barre (z-50), du
 * menu (z-60) et meme de la bulle « Demander » (z-70), qui sans cela passerait
 * par-dessus le coin de la feuille.
 *
 * Elle reste MONTEE dans le DOM, ouverte ou non : c'est ce qui permet aux deux
 * mouvements — l'entree ET la sortie — de s'animer. Fermee, elle est simplement
 * poussee hors de l'ecran (`translate-y-full`) et rendue inerte
 * (`pointer-events-none`), de sorte qu'elle n'attrape aucun clic de la page.
 */
export default function BottomSheet({
  ouvert,
  onFermer,
  titre,
  intro,
  labelFermer,
  children,
}: {
  ouvert: boolean;
  onFermer: () => void;
  titre: string;
  intro?: string;
  labelFermer: string;
  children: ReactNode;
}) {
  // Echap referme, et le fond ne defile plus tant que la feuille est levee :
  // sinon on fait bouger la page derriere en croyant faire glisser la feuille.
  useEffect(() => {
    if (!ouvert) return;
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer();
    };
    window.addEventListener('keydown', auClavier);
    const avant = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', auClavier);
      document.body.style.overflow = avant;
    };
  }, [ouvert, onFermer]);

  return (
    <div className={`fixed inset-0 z-[80] ${ouvert ? '' : 'pointer-events-none'}`}>
      {/* Le voile. Toucher a cote referme — c'est le geste qu'on attend d'une
          feuille de ce genre. */}
      <button
        type="button"
        aria-label={labelFermer}
        tabIndex={ouvert ? 0 : -1}
        onClick={onFermer}
        className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${
          ouvert ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'rgba(46,45,45,0.45)' }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        className={`absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-[28px] transition-transform duration-300 motion-reduce:transition-none ${
          ouvert ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ background: '#fff', boxShadow: '0 -12px 40px rgba(46,45,45,0.25)' }}
      >
        {/* La poignee — le petit trait qui dit « ca s'attrape et ca redescend ». */}
        <div className="flex shrink-0 justify-center pb-1 pt-3">
          <span aria-hidden className="h-1.5 w-10 rounded-full" style={{ background: 'var(--cava-line)' }} />
        </div>

        {/*
          `pb-4` SOUS L'EN-TETE — Mag : « il n'y a pas assez d'espace en dessous
          de ce paragraphe ».

          L'en-tete n'avait aucun retrait en bas : mesure faite, le bas de
          l'intro tombait EXACTEMENT sur le haut de la zone qui defile, ecart
          zero. Le seul espace venait du `pt-5` de cette zone, soit 20 px — et
          le degrade blanc en fait 24. Il couvrait donc la totalite de l'ecart
          et mordait 4 px sur la premiere ligne : le texte naissait deja
          efface, ce qui se lit comme un manque d'air.

          ATTENTION AU PIEGE, J'Y SUIS TOMBE : ajouter du retrait ICI ne suffit
          pas. Le degrade est pose en haut de la zone qui defile, donc il
          DESCEND AVEC ELLE — l'ecart total passait bien de 20 a 36 px, et le
          voile mordait toujours exactement 4 px sur la premiere ligne. Ce qu'il
          faut augmenter, c'est le retrait INTERIEUR de la zone (`pt-7` = 28 px,
          quatre de plus que les 24 du voile) : lui seul separe le texte du
          degrade. Les deux ensemble donnent 44 px d'air, et une premiere ligne
          nette.
        */}
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pb-4 pt-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-[19px] leading-tight" style={{ fontWeight: 800 }}>
              {titre}
            </h2>
            {intro && (
              <p className="text-[13.5px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                {intro}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onFermer}
            aria-label={labelFermer}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] leading-none"
            style={{ background: 'rgba(46,45,45,0.06)', color: 'var(--cava-ink)' }}
          >
            ✕
          </button>
        </div>

        {/* La zone qui defile. On la coiffe d'un mince degrade blanc : quand le
            texte remonte sous le titre, il s'efface au lieu d'etre tranche net
            au ras de l'en-tete. Le degrade est POSE PAR-DESSUS (absolu, inerte),
            il ne pousse rien et ne prend aucun clic. */}
        {/*
          LA ZONE QUI DEFILE RESTE DANS LE FLUX, et les deux facons de l'en
          sortir ont chacune casse quelque chose de different. Elles valent
          d'etre ecrites, parce que le degrade donne envie des deux.

          1. `h-full` sur un enfant du bloc positionne — Mag : « c'est bloque,
             ça ne scroll plus ». `h-full` vaut `height: 100%`, et 100 % de
             quoi ? Le parent mesurait bien 551 px, mais il les tenait du FLEX :
             sa propriete `height`, elle, vaut `auto`. Le pourcentage n'avait
             rien contre quoi se calculer, il retombait sur `auto`, et la boite
             prenait la hauteur de son contenu — 21 970 px mesures sur « Par les
             chansons ». `scrollHeight` devenait egal a `clientHeight` : plus
             rien a faire defiler.

          2. `absolute inset-0`, ma premiere correction. Elle rendait bien le
             defilement, et cassait la feuille : mesuree a 139 px de haut au
             lieu de 690. La feuille tire sa hauteur de SON CONTENU, plafonnee a
             `max-h-[85dvh]` ; une zone hors du flux ne contribue plus a rien,
             et il ne restait que l'en-tete.

          On garde donc une zone EN FLUX (`flex-1`), qui donne sa hauteur a la
          feuille, avec `min-h-0` pour qu'elle puisse retrecir sous son contenu
          — sans quoi un element de flex refuse de passer sous sa taille
          naturelle, et c'est lui qui deborde. Le degrade se pose par-dessus
          grace au `relative` du parent, sans jamais entrer dans le calcul.
        */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-7">
            {children}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-6"
            style={{ background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0))' }}
          />
        </div>
      </div>
    </div>
  );
}
