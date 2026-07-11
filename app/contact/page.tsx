'use client';

import SectionShell from '../SectionShell';
import Reveal from '../Reveal';
import { SITE } from '../data';
import { useI18n } from '../i18n';

export default function Contact() {
  const { t } = useI18n();
  return (
    <SectionShell pageKey="contact">
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal className="flex flex-col justify-between gap-8 rounded-2xl p-8 md:p-10" style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}>
          <span className="text-[12px] uppercase tracking-[0.24em]" style={{ color: 'var(--cava-pink)' }}>
            {t.contactLabels.email}
          </span>
          <a href={`mailto:${SITE.email}`} className="text-[clamp(1.3rem,3vw,2rem)] leading-[1.15] underline-offset-4 hover:underline" style={{ fontWeight: 400 }}>
            {t.writeUs}
          </a>
        </Reveal>

        <Reveal delay={90} className="flex flex-col justify-between gap-8 rounded-2xl border p-8 md:p-10" style={{ borderColor: 'var(--cava-line)' }}>
          <span className="text-[12px] uppercase tracking-[0.24em]" style={{ color: 'var(--cava-pink)' }}>
            {t.contactLabels.instagram}
          </span>
          <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="text-[clamp(1.3rem,3vw,2rem)] leading-[1.15] underline-offset-4 hover:underline" style={{ fontWeight: 400 }}>
            {SITE.instagram.handle}
          </a>
        </Reveal>
      </div>
    </SectionShell>
  );
}
