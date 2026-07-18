'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal, { RevealNow } from '../Reveal';
import PageHeader from '../PageHeader';
import Icon, { type IconName } from '../Icon';
import FilterChip from '../FilterChip';
import OpIcon, { type OpIconName } from '../OpIcon';
import { Transports, Emergencies } from '../GettingAround';
import WasteSchedule from '../WasteSchedule';
import DepartChecklist from '../DepartChecklist';
import Gallery from '../Gallery';
import { withBase, APPART_ALBUM } from '../data';
import { useI18n } from '../i18n';

type Key = 'tout' | 'adresse' | 'arrivee' | 'bouger' | 'urgences' | 'dechets' | 'depart';


export default function InformationsPratiques() {
  const { t } = useI18n();
  const p = t.pages['informations-pratiques'];
  const a = t.arrivee;
  const f = t.infoFilter;
  const c = t.casaPeek;

  // On arrive sur « Adresse » : le bouton allumé correspond à ce qu'on voit.
  // Avec « Tout » par défaut, cliquer « Adresse » ne changeait rien à l'écran.
  const [filter, setFilter] = useState<Key>('adresse');
  // Incrementé à chaque choix : dit aux Reveal en dessous de se montrer d'un coup.
  const [clicks, setClicks] = useState(0);
  const choose = (k: Key) => {
    setFilter(k);
    setClicks((c) => c + 1);
  };
  // « Tout » montre l'enchaînement complet ; sinon on isole une seule section.
  const show = (k: Key) => filter === 'tout' || filter === k;

  // Les sections d'abord ; « Tout voir » ferme la marche, en retrait.
  const filters: { key: Key; label: string; icon: IconName }[] = [
    { key: 'adresse', label: f.address, icon: 'pin' },
    { key: 'arrivee', label: f.arrival, icon: 'key' },
    { key: 'bouger', label: f.move, icon: 'compass' },
    { key: 'urgences', label: f.urgent, icon: 'phone' },
    { key: 'dechets', label: f.waste, icon: 'trash' },
    { key: 'depart', label: f.leaving, icon: 'home' },
  ];

  return (
    <RevealNow.Provider value={clicks}>
    <main>
      <Nav current="/informations-pratiques" />

      <PageHeader title={p.title} intro={p.intro} />

      {/* Le tri : la page est longue, on choisit ce qu'on cherche */}
      <section className="mx-auto max-w-[110rem] px-5 pt-4 md:px-10">
        <Reveal className="cava-swipe -mx-5 -my-4 flex gap-2.5 overflow-x-auto px-5 py-4 md:-mx-10 md:px-10">
          {filters.map((x) => {
            const on = filter === x.key;
            return (
              <FilterChip key={x.key} label={x.label} icon={x.icon} active={on} onClick={() => choose(x.key)} />
            );
          })}
          <FilterChip label={f.all} icon="map" active={filter === 'tout'} onClick={() => choose('tout')} subtle />
        </Reveal>
      </section>

      {/* L'adresse : ce qu'on vient chercher, donc en tête et affichée par
          défaut. Filtrable comme les autres : haute de 800 px, elle repoussait
          sinon tout contenu cliqué sous la ligne de flottaison. */}
      {show('adresse') && (
      <section className="mx-auto max-w-[110rem] px-5 pb-10 pt-12 md:px-10">
        <Reveal
          className="flex flex-col gap-8 rounded-3xl border p-8 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
        >
          <div>
            <span
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--cava-pink)' }}
            >
              <Icon name="pin" size={16} /> {a.addressLabel}
            </span>
            <address className="mt-4 not-italic">
              {a.address.map((line, i) => (
                <div
                  key={line}
                  className="text-[clamp(1.4rem,3.2vw,2.2rem)] uppercase leading-[1.12] tracking-[-0.02em]"
                  style={{ fontWeight: i === 0 ? 900 : 500, color: i === 0 ? 'var(--cava-ink)' : 'var(--cava-muted)' }}
                >
                  {line}
                </div>
              ))}
            </address>
          </div>

          <a
            href={a.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-3 self-start rounded-full px-7 py-4 text-[15px] transition hover:opacity-85 md:self-auto"
            style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
          >
            <Icon name="pin" size={20} /> {a.mapsLabel} <span aria-hidden>↗</span>
          </a>
        </Reveal>
      </section>
      )}

      {/* Arrivée : le guide des premières heures */}
      {show('arrivee') && (
        <section className="mx-auto max-w-[110rem] px-5 pb-8 pt-12 md:px-10">
          <Reveal className="mb-8 flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="key" size={16} /> {a.eyebrow}
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              {a.title}
            </h2>
          </Reveal>

          <Reveal className="mb-5 text-[13px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
            {a.operationTitle}
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
            {a.operation.map((g, i) => (
              <Reveal
                key={g.title}
                delay={(i % 2) * 90}
                className="flex flex-col gap-4 p-8 md:p-10"
                style={{ background: 'var(--cava-bg)' }}
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden className="leading-none" style={{ color: 'var(--cava-pink)' }}>
                    <OpIcon name={g.icon as OpIconName} size={26} />
                  </span>
                  <h3 className="text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
                    {g.title}
                  </h3>
                </div>
                {g.items && g.items.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                        <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {show('bouger') && <Transports />}
      {show('urgences') && <Emergencies />}
      {show('dechets') && <WasteSchedule />}
      {show('depart') && <DepartChecklist />}

      {/* Un rappel de la casa, hors filtres : on est ici pour se reperer, et
          revoir les pieces aide. Les douze photos y passent en defilant, ce qui
          les montre toutes sans allonger une page deja longue ; le lien mene a
          La casa, ou elles sont rangees piece par piece. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-8 pt-16 md:px-10">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="window" size={16} strokeWidth={1.7} /> {c.eyebrow}
          </span>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {c.title}
          </h2>
        </Reveal>

        <Reveal className="-mx-5 md:-mx-10">
          <Gallery images={APPART_ALBUM} alts={t.apartment.captions} />
        </Reveal>

        <Reveal className="mt-8">
          <a
            href={withBase('/appartement')}
            className="cava-footlink group flex items-center justify-between border-b border-t py-4 md:py-5"
          >
            <span className="text-[clamp(1.1rem,2.2vw,1.5rem)]" style={{ fontWeight: 500 }}>
              {c.link}
            </span>
            <span className="cava-footlink-arrow text-[clamp(1.1rem,3vw,2rem)]" aria-hidden>
              ↗
            </span>
          </a>
        </Reveal>
      </section>

      <div className="pb-16" />
      <Footer />
    </main>
    </RevealNow.Provider>
  );
}
