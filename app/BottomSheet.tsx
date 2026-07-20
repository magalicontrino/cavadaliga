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

        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-2">
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
        <div className="relative min-h-0 flex-1">
          <div className="h-full overflow-y-auto overscroll-contain px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5">
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
