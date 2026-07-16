'use client';

import Icon from './Icon';
import { SITE } from './data';
import { useI18n } from './i18n';

/**
 * Ce qu'on affiche quand on n'a pas l'info.
 *
 * « Bientôt en ligne » laisse le visiteur sans rien : il est sur place, il a
 * besoin du numéro maintenant. On lui donne donc quelqu'un à qui écrire —
 * et sa réponse alimente le site pour les suivants.
 */
export default function AskMag({ what }: { what?: string }) {
  const { t } = useI18n();
  const a = t.askMag;
  const subject = encodeURIComponent(what ? `${a.subject} — ${what}` : a.subject);
  // wa.me pré-remplit le message : le visiteur n'a plus qu'à envoyer.
  const waText = encodeURIComponent(what ? `${a.subject} — ${what}` : a.subject);

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-dashed p-6 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: 'var(--cava-line)' }}
    >
      <p className="max-w-[54ch] text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
        {what ? a.textFor.replace('{what}', what) : a.text}
      </p>
      <div className="flex shrink-0 flex-wrap gap-2">
        <a
          href={`${SITE.whatsapp.url}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cava-pill inline-flex w-fit shrink-0 items-center gap-2 px-5 py-2.5 text-[13px]"
        >
          <Icon name="chat" size={15} /> {a.ctaChat}
        </a>
        <a
          href={`mailto:${SITE.email}?subject=${subject}`}
          className="cava-pill inline-flex w-fit shrink-0 items-center gap-2 px-5 py-2.5 text-[13px]"
        >
          <Icon name="phone" size={15} /> {a.cta}
        </a>
      </div>
    </div>
  );
}
