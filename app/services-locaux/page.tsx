'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import PageHeader from '../PageHeader';
import Icon, { type IconName } from '../Icon';
import LocalMap from '../LocalMap';
import { useI18n } from '../i18n';

// « Nos adresses » — page unique du local : carte illustrée, producteurs &
// artisans responsables (chocolat, huile, agrumes, plantes) et marchés.
const CAT_ICONS: IconName[] = ['cone', 'droplet', 'citrus', 'leaf'];
const MAP_QUERY = 'Cava d’Aliga, Scicli';

export default function NosAdresses() {
  const { t } = useI18n();
  const s = t.pages['services-locaux'];
  const p = t.localPage;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

  return (
    <main>
      <Nav current="/services-locaux" />

      <PageHeader title={s.title} intro={s.intro} />

      {/* Carte illustrée (SVG maison) — sans cadre, se fond dans la page */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <Reveal>
          <LocalMap houseLabel={t.regionHere} />
        </Reveal>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cava-navlink mt-4 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.14em]"
          style={{ color: 'var(--cava-muted)' }}
        >
          <Icon name="pin" size={16} /> {p.mapLabel} <span aria-hidden>↗</span>
        </a>
      </section>

      {/* Producteurs & artisans — cartes avec picto + liens (Maps + Instagram) */}
      <section className="mx-auto max-w-[110rem] px-5 pt-10 md:px-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.categories.map((c, i) => (
            <Reveal
              key={c.title}
              delay={(i % 3) * 90}
              className="flex flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ background: 'var(--cava-bg)', borderColor: 'var(--cava-line)' }}
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
              >
                <Icon name={CAT_ICONS[i] ?? 'bag'} size={24} />
              </span>
              <h2 className="text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.1]" style={{ fontWeight: 600 }}>
                {c.title}
              </h2>
              <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {c.desc}
              </p>

              {c.spots.length > 0 && (
                <ul className="mt-1 flex flex-col gap-3">
                  {c.spots.map((sp) => (
                    <li key={sp.url} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <a
                        href={sp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cava-navlink inline-flex items-start gap-2 text-[15px] leading-[1.4]"
                      >
                        <span className="mt-0.5 shrink-0" style={{ color: 'var(--cava-pink)' }}>
                          <Icon name="pin" size={16} />
                        </span>
                        <span>
                          {sp.label} <span aria-hidden>↗</span>
                        </span>
                      </a>
                      {sp.instagram && (
                        <a
                          href={sp.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cava-navlink inline-flex items-center gap-1.5 text-[13px]"
                          style={{ color: 'var(--cava-muted)' }}
                        >
                          <Icon name="instagram" size={16} /> Instagram
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}

          {/* Marchés — carte élargie (2 colonnes), à droite de « Plantes » */}
          <Reveal
            className="flex flex-col gap-4 rounded-2xl border p-8 sm:col-span-2 md:p-10 lg:col-span-2"
            style={{ background: 'var(--cava-bg)', borderColor: 'var(--cava-line)' }}
          >
            <div className="flex items-center gap-4">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-ink)' }}
              >
                <Icon name="bag" size={24} />
              </span>
              <h2 className="text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.1]" style={{ fontWeight: 600 }}>
                {p.markets.title}
              </h2>
            </div>
            <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
              {p.markets.desc}
            </p>
            <ul className="mt-1 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {p.markets.list.map((m) => (
                <li key={m.url}>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cava-navlink inline-flex items-start gap-2 text-[15px] leading-[1.5]"
                  >
                    <span className="mt-0.5 shrink-0" style={{ color: 'var(--cava-pink)' }}>
                      <Icon name="pin" size={16} />
                    </span>
                    <span>
                      {m.label} <span aria-hidden>↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Reveal
        className="mx-auto max-w-[110rem] px-5 pb-24 pt-8 text-[14px] italic md:px-10"
        style={{ color: 'var(--cava-muted)' }}
      >
        {p.note}
      </Reveal>

      <Footer />
    </main>
  );
}
