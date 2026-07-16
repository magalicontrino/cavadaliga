'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal, { RevealNow } from '../Reveal';
import Carousel from '../Carousel';
import PageHeader from '../PageHeader';
import Icon, { type IconName } from '../Icon';
import FilterChip from '../FilterChip';
import { useI18n } from '../i18n';

// Lieux autour de Cava d'Aliga (ordre = i18n regionPlaces / regionHighlights).
// images[] = photos du lieu (carrousel, sans lightbox). Ajouter d'autres photos
// dans le tableau au fil du temps. Vide → visuel provisoire « photo à venir ».
// unesco:true = badge « Patrimoine mondial UNESCO ». Noms propres = mêmes 3 langues.
const PLACES = [
  { images: ['/picture-sicile/cava-daliga.jpg', '/picture-sicile/cava-daliga-c.jpg'], label: 'Cava d’Aliga', tone: 'sand', km: 0, unesco: false },
  { images: ['/picture-sicile/scicli.jpg', '/picture-sicile/scicli-b.jpg'], label: 'Scicli', tone: 'sand', km: 8, unesco: true },
  { images: ['/picture-sicile/bruca.jpg'], label: 'Bruca', tone: 'sand', km: 4, unesco: false },
  { images: ['/picture-sicile/sampieri.jpg'], label: 'Sampieri', tone: 'sand', km: 5, unesco: false },
  { images: ['/picture-sicile/punta-pisciotto.jpg'], label: 'Punta Pisciotto', tone: 'sand', km: 6, unesco: false },
  { images: [], label: 'Marina di Ragusa', tone: 'pink', km: 13, unesco: false },
  { images: [], label: 'Modica', tone: 'terra', km: 20, unesco: true },
  { images: [], label: 'Raguse', tone: 'ink', km: 28, unesco: true },
  { images: [], label: 'Noto', tone: 'pink', km: 55, unesco: true },
  { images: [], label: 'Syracuse', tone: 'terra', km: 85, unesco: true },
] as const;

type Key = 'tout' | 'lieux' | 'coutumes' | 'arabe';

export default function LaRegion() {
  const { t } = useI18n();
  const p = t.pages['la-region'];
  const rf = t.regionFilter;

  // On arrive sur « Les lieux » : le bouton allumé correspond à ce qu'on voit.
  // Avec « Tout » par défaut, cliquer « Les lieux » ne changeait rien à l'écran —
  // les deux commencent par la même section, et le clic semblait échouer.
  const [filter, setFilter] = useState<Key>('lieux');
  // Incrementé à chaque choix : dit aux Reveal en dessous de se montrer d'un coup.
  const [clicks, setClicks] = useState(0);
  const choose = (k: Key) => {
    setFilter(k);
    setClicks((c) => c + 1);
  };
  // « Tout » enchaîne les trois ; sinon on isole une seule section.
  const show = (k: Key) => filter === 'tout' || filter === k;

  // Les sections d'abord ; « Tout voir » ferme la marche, en retrait : c'est une
  // commande (tout enchaîner), pas une catégorie de plus.
  const filters: { key: Key; label: string; icon: IconName }[] = [
    { key: 'lieux', label: rf.places, icon: 'pin' },
    { key: 'coutumes', label: rf.customs, icon: 'cone' },
    { key: 'arabe', label: rf.arab, icon: 'landmark' },
  ];

  return (
    <RevealNow.Provider value={clicks}>
    <main>
      <Nav current="/la-region" />

      <PageHeader title={p.title} intro={p.intro} />

      {/* Le tri : la page est longue, on choisit ce qu'on cherche */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <Reveal className="flex flex-wrap gap-2.5">
          {filters.map((x) => {
            const on = filter === x.key;
            return (
              <FilterChip key={x.key} label={x.label} icon={x.icon} active={on} onClick={() => choose(x.key)} />
            );
          })}
          <FilterChip label={rf.all} icon="map" active={filter === 'tout'} onClick={() => choose('tout')} subtle />
        </Reveal>
      </section>

      {/* Les lieux autour de nous — fiches éditoriales alternées + lightbox */}
      {show('lieux') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-12 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="pin" size={16} /> {t.regionFilter.places}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.placesTitle}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.placesIntro}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-28">
          {PLACES.map((place, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={place.label} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                {/* Carrousel de photos (sans lightbox) */}
                <div className={flip ? 'md:order-2' : ''}>
                  <Carousel
                    images={place.images}
                    alt={place.label}
                    tone={place.tone}
                    label={`${place.label} — photo à venir`}
                  />
                </div>

                {/* Fiche : numéro + (badge UNESCO) + nom + histoire */}
                <div className={flip ? 'md:order-1' : ''}>
                  <span className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                    {String(i + 1).padStart(2, '0')} / {String(PLACES.length).padStart(2, '0')}
                    <span style={{ color: 'var(--cava-muted)' }}> · {place.km === 0 ? t.regionHere : `≈ ${place.km} km`}</span>
                  </span>
                  {place.unesco && (
                    <div className="mt-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
                        style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                      >
                        <span aria-hidden>★</span> {t.unescoLabel}
                      </span>
                    </div>
                  )}
                  <h3
                    className="mt-3 text-[clamp(2rem,5vw,3.4rem)] uppercase leading-[0.98] tracking-[-0.02em]"
                    style={{ fontWeight: 900 }}
                  >
                    {place.label}
                  </h3>
                  <p
                    className="mt-6 max-w-[48ch] border-l-2 pl-5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]"
                    style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}
                  >
                    {t.regionPlaces[i]}
                  </p>

                  {t.regionHighlights[i] && t.regionHighlights[i].length > 0 && (
                    <ul className="mt-7 flex max-w-[48ch] flex-col gap-3">
                      {t.regionHighlights[i].map((h) => (
                        <li key={h} className="flex gap-3 text-[15px] leading-[1.5]" style={{ color: 'var(--cava-ink)' }}>
                          <span className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
      )}

      {/* Us et coutumes — granita, arancina, passeggiata */}
      {show('coutumes') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="cone" size={16} /> {t.tastePage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.tastePage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.tastePage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
          {t.tastePage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={28} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.35rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/* La Sicile arabe — l'histoire qui explique ce qu'on a sous les yeux */}
      {show('arabe') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="landmark" size={16} /> {t.arabPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.arabPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.arabPage.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.arabPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name={f.icon as IconName} size={24} />
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.4rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {f.text}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="mt-8 max-w-[68ch] border-l-2 pl-5 text-[15px] italic leading-[1.7]"
          style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}
        >
          {t.arabPage.note}
        </Reveal>

        {/* Pour aller plus loin — @iosonolibero, « Musica e Sicilia Araba » */}
        <Reveal
          className="mt-8 flex flex-col gap-4 rounded-2xl border p-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'var(--cava-line)' }}
        >
          <div className="max-w-[58ch]">
            <p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
              {t.arabPage.moreTitle}
            </p>
            <p className="mt-2 text-[15px] leading-[1.65]" style={{ color: 'var(--cava-muted)' }}>
              {t.arabPage.moreDesc}
            </p>
          </div>
          <a
            href="https://www.instagram.com/iosonolibero/"
            target="_blank"
            rel="noopener noreferrer"
            className="cava-pill inline-flex w-fit shrink-0 items-center gap-2 px-5 py-2.5 text-[13px]"
          >
            <Icon name="instagram" size={15} /> @iosonolibero <span aria-hidden>↗</span>
          </a>
        </Reveal>
      </section>
      )}

      <div className="pb-24" />

      <Footer />
    </main>
    </RevealNow.Provider>
  );
}
