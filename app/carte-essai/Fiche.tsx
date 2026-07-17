'use client';

import Icon from '../Icon';
import { CATS, type Lang, type LocalPlace } from '../localData';

/**
 * La fiche d'un lieu. Elle ne se place pas elle-même : c'est la carte qui
 * décide où elle va — seule en bas à gauche sur écran large, ou alignée avec
 * ses voisines sur une piste qu'on fait glisser sur téléphone.
 *
 * Elle n'est surtout PAS accrochée à l'épingle. La version ancrée débordait :
 * une fiche de 300px suspendue à un point, dans une boîte à `overflow: hidden`,
 * ne tient que si l'on mesure sa hauteur puis qu'on déplace la carte juste
 * assez. Deux choses fragiles pour un résultat qui doit être sûr.
 */
export default function Fiche({
  place,
  lang,
  labels,
  onClose,
}: {
  place: LocalPlace;
  lang: Lang;
  labels: { map: string; badge: string; here: string; close: string };
  onClose: () => void;
}) {
  return (
    <div
      className="cava-fiche-boite relative h-full overflow-hidden rounded-2xl border"
      style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
      role="dialog"
      aria-label={place.name}
    >
      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2 pr-8">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
          >
            <Icon name={CATS[place.cat].icon} size={20} />
          </span>
          {place.responsible && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] uppercase tracking-[0.1em]"
              style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
            >
              <Icon name="leaf" size={12} /> {labels.badge}
            </span>
          )}
        </div>

        <p className="text-[19px] leading-[1.15]" style={{ fontWeight: 600 }}>
          {place.name}
        </p>
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-muted)' }}>
          {place.town} · {CATS[place.cat].label[lang]}
        </p>
        <p
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em]"
          style={{ color: 'var(--cava-pink)', fontWeight: 700 }}
        >
          <Icon name="home" size={13} /> {place.km === 0 ? labels.here : `≈ ${place.km} km`}
        </p>
        <p className="text-[13px] leading-[1.55]" style={{ color: 'var(--cava-muted)' }}>
          {place.blurb[lang]}
        </p>

        <div className="mt-1 flex flex-wrap gap-2">
          <a
            href={place.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[12.5px]"
          >
            <Icon name="pin" size={14} /> {labels.map} <span aria-hidden>↗</span>
          </a>
          {place.instagram && (
            <a
              href={place.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[12.5px]"
            >
              <Icon name="instagram" size={14} /> Instagram <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full text-[18px] leading-none transition"
        style={{ color: 'var(--cava-muted)' }}
      >
        ×
      </button>
    </div>
  );
}
