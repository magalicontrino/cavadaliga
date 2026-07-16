'use client';

import { SITE } from './data';
import { useI18n } from './i18n';

/**
 * PersoLink — « ● Copyright © Mag » : le copyright mène au site perso de Mag
 * (racine du domaine). Même style que le lien Instagram voisin.
 */
export default function PersoLink() {
  const { t } = useI18n();
  return (
    <a
      href={SITE.perso}
      target="_blank"
      rel="noopener noreferrer"
      title={t.persoSite}
      className="cava-navlink group flex items-center gap-2 uppercase tracking-[0.16em]"
    >
      <span
        className="block h-[10px] w-[10px] shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
        style={{ background: 'var(--cava-ink)' }}
        aria-hidden
      />
      Copyright © {SITE.author}
    </a>
  );
}
