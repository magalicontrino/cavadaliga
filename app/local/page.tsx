'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import { useI18n } from '../i18n';

// Page « Local » — répertoire des producteurs et artisans responsables du
// sud-est de la Sicile (huile d'olive, agrumes, épices, chocolat, plantes…).
// Les catégories sont un cadre ; on y ajoutera les adresses au fil des trouvailles.
export default function Local() {
  const { t } = useI18n();
  const p = t.localPage;

  return (
    <main>
      <Nav current="/local" />

      <PageHeader title={p.title} intro={p.intro} />

      <section className="mx-auto max-w-[110rem] px-5 pb-8 md:px-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.categories.map((c, i) => (
            <Reveal
              key={c.title}
              delay={(i % 3) * 90}
              className="flex flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ background: 'var(--cava-bg)', borderColor: 'var(--cava-line)' }}
            >
              <span className="font-mono text-[12px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.1]" style={{ fontWeight: 600 }}>
                {c.title}
              </h2>
              <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {c.desc}
              </p>

              {c.spots.length > 0 && (
                <ul className="mt-1 flex flex-col gap-3">
                  {c.spots.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cava-navlink inline-flex items-start gap-2 text-[15px] leading-[1.4]"
                      >
                        <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                        <span>
                          {s.label} <span aria-hidden>↗</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-[14px] italic" style={{ color: 'var(--cava-muted)' }}>
          {p.note}
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
