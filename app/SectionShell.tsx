'use client';

import Nav from './Nav';
import Footer from './Footer';
import Reveal from './Reveal';
import Icon, { type IconName } from './Icon';
import { PAGE_ICONS } from './data';
import { useI18n, type PageKey } from './i18n';

/**
 * SectionShell — coquille commune aux pages secondaires : Nav + en-tête
 * (tag + grand titre + intro) + contenu + Footer. Le contenu vient d'i18n
 * (t.pages[pageKey]) : InfoBlocks par défaut, ou `children` (page Contact).
 */
export default function SectionShell({
  pageKey,
  children,
}: {
  pageKey: PageKey;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  const p = t.pages[pageKey];
  const href = `/${pageKey}`;
  return (
    <main>
      <Nav current={href} />

      <header className="mx-auto max-w-[110rem] px-5 pb-16 pt-[22vh] md:px-10">
        <Reveal className="flex items-center gap-3" y="3vh">
          <span className="h-[0.4rem] w-[0.4rem] rounded-full" style={{ background: 'var(--cava-pink)' }} />
          <span className="text-[12px] font-medium uppercase tracking-[0.28em]">{p.eyebrow}</span>
        </Reveal>
        <Reveal as="h1" delay={80} className="mt-6 max-w-[18ch] text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02]" style={{ fontWeight: 400 }}>
          {p.title}
        </Reveal>
        <Reveal as="p" delay={160} className="mt-8 max-w-[52ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
          {p.intro}
        </Reveal>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 pb-24 md:px-10">
        {children ?? (p.blocks ? <InfoBlocks blocks={p.blocks} icons={PAGE_ICONS[pageKey as keyof typeof PAGE_ICONS]} /> : null)}
      </div>

      <Footer />
    </main>
  );
}

/**
 * Bloc « rubrique en préparation » — liste ce que la page contiendra, sans
 * inventer d'infos factuelles (distances, horaires) qui restent à fournir.
 */
export function InfoBlocks({ blocks, icons }: { blocks: { title: string; items: string[] }[]; icons?: IconName[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {blocks.map((b, i) => (
        <Reveal
          key={b.title}
          delay={(i % 2) * 90}
          className="cava-infocard group flex flex-col gap-6 rounded-2xl border p-8 md:p-10"
          style={{ background: 'var(--cava-bg)', borderColor: 'var(--cava-line)' }}
        >
          <span className="cava-infocard-badge inline-flex h-14 w-14 items-center justify-center rounded-2xl">
            {icons?.[i] && <Icon name={icons[i]} size={26} />}
          </span>
          <h2 className="text-[clamp(1.4rem,3vw,2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {b.title}
          </h2>
          <ul className="flex flex-col gap-3">
            {b.items.map((it) => (
              <li key={it} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                {it}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
