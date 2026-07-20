'use client';

import { SOURCES } from './sourcesData';
import { useI18n } from './i18n';

/**
 * Les sources d'une section, en bas, en petit.
 *
 * DISCRET est le mot de Mag, et c'est une contrainte de dessin autant qu'une
 * politesse : une source qui pese autant que le texte laisse croire qu'il faut
 * la lire, alors qu'elle n'est la que pour qui doute. Elle prend donc la taille
 * la plus petite de la page et le gris des notes, et elle ne se souligne qu'au
 * survol — comme les autres liens du site.
 *
 * Elle ne s'affiche pas si la section n'a pas de source : mieux vaut un blanc
 * qu'un « Sources : » suivi de rien.
 */
export default function Sources({ section }: { section: string }) {
  const { t } = useI18n();
  const liens = SOURCES[section];
  if (!liens?.length) return null;

  return (
    <p className="mt-5 max-w-[68ch] text-[12px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
      <span style={{ fontWeight: 600 }}>{t.sourcesLabel}</span>{' '}
      {liens.map((l, i) => (
        <span key={l.url}>
          {i > 0 && <span aria-hidden> · </span>}
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cava-navlink"
            style={{ color: 'var(--cava-muted)' }}
          >
            {l.label} ↗
          </a>
        </span>
      ))}
    </p>
  );
}
