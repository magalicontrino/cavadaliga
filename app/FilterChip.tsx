'use client';

import Icon, { type IconName } from './Icon';

/**
 * Bouton de tri, partagé par « Nos adresses », « Infos pratiques » et
 * « La région » — le même balisage y était recopié trois fois.
 *
 * Le picto vit dans une pastille rose pleine, blanc à l'intérieur : c'est lui
 * qui porte la couleur, pas le texte. Actif, la pilule passe entièrement en
 * rose et la pastille s'inverse (fond blanc, picto rose).
 */
export default function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: IconName;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="cava-chip inline-flex items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-5 text-[14.5px]"
      style={{
        borderColor: active ? 'var(--cava-pink)' : 'var(--cava-line)',
        background: active ? 'var(--cava-pink)' : 'var(--cava-bg)',
        color: active ? '#fff' : 'var(--cava-ink)',
        fontWeight: active ? 700 : 500,
      }}
    >
      <span
        aria-hidden
        className="cava-chip-badge flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background: active ? '#fff' : 'var(--cava-pink)',
          color: active ? 'var(--cava-pink)' : '#fff',
        }}
      >
        <Icon name={icon} size={21} strokeWidth={2} />
      </span>
      {label}
    </button>
  );
}
