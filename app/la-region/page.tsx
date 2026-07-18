'use client';

import { useEffect, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal, { RevealNow } from '../Reveal';
import Carousel from '../Carousel';
import PageHeader from '../PageHeader';
import Photo from '../Photo';
import Icon, { type IconName } from '../Icon';
import FilterChip from '../FilterChip';
import { useI18n } from '../i18n';
import { withBase } from '../data';
import WorkGrid from '../WorkGrid';
import { ARTISTS, ARTS, SCULPTURES, PHOTOS, SCREENS, SPOTIFY_EMBED_HEIGHT, SPOTIFY_EMBED_URL, SPOTIFY_PLAYLIST_URL, MUNARI_BOOK, MUNARI_DESIGN_BOOK, MUNARI_WIKI, DE_JORIO_WIKI } from '../cultureData';

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

// « Sons & images » n'est plus une page : ses sept sections vivent ici. La
// region, c'est aussi ce qu'on en a chante, filme, peint et photographie — une
// page de moins dans le menu, et le meme geste pour tout parcourir.
type Section = 'lieux' | 'coutumes' | 'etna' | 'arabe' | 'playlist' | 'ecrans' | 'peinture' | 'sculpture' | 'photo' | 'mains' | 'chansons';
type Key = 'tout' | 'sons' | Section;

// « Sons & images » n'est pas une section : c'est un GROUPE. Un bouton pour les
// sept d'un coup — sinon la page perdait ce qu'elle etait, et il fallait sept
// clics pour retrouver l'ancienne. Les sept restent la, un a un, pour qui
// cherche precisement la peinture ou les ecrans.
const SONS: Section[] = ['playlist', 'ecrans', 'peinture', 'sculpture', 'photo', 'mains', 'chansons'];

export default function LaRegion() {
  const { t, lang } = useI18n();
  const p = t.pages['la-region'];
  const rf = t.regionFilter;
  const c = t.culturePage;
  const cf = t.cultureFilter;

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
  const show = (k: Section) => filter === 'tout' || filter === k || (filter === 'sons' && SONS.includes(k));

  // Le vinyle du bandeau vise « #sons » : il promet l'ancienne page, il doit la
  // rendre entiere — les sept sections, pas la seule playlist. Sans ca il
  // deposait sur « Les lieux », le tri par defaut, et le picto mentait. Une
  // seule fois, a l'arrivee : ensuite on trie a la main.
  useEffect(() => {
    if (window.location.hash !== '#sons') return;
    setFilter('sons');
    setClicks((c) => c + 1);
  }, []);

  // Les sections d'abord ; « Tout voir » ferme la marche, en retrait : c'est une
  // commande (tout enchaîner), pas une catégorie de plus.
  const filters: { key: Key; label: string; icon: IconName }[] = [
    { key: 'lieux', label: rf.places, icon: 'pin' },
    { key: 'coutumes', label: rf.customs, icon: 'cone' },
    { key: 'etna', label: rf.etna, icon: 'volcano' },
    { key: 'arabe', label: rf.arab, icon: 'landmark' },
    { key: 'sons', label: rf.sounds, icon: 'vinyl' },
    { key: 'playlist', label: cf.playlist, icon: 'spotify' },
    { key: 'ecrans', label: cf.screens, icon: 'film' },
    { key: 'peinture', label: cf.painting, icon: 'brush' },
    { key: 'sculpture', label: cf.sculpture, icon: 'landmark' },
    { key: 'photo', label: cf.photo, icon: 'camera' },
    { key: 'mains', label: cf.hands, icon: 'compass' },
    { key: 'chansons', label: cf.songs, icon: 'vinyl' },
  ];

  return (
    <RevealNow.Provider value={clicks}>
    <main>
      <Nav current="/la-region" />

      <PageHeader title={p.title} intro={p.intro} />

      {/* Le tri : la page est longue, on choisit ce qu'on cherche */}
      <section className="mx-auto max-w-[110rem] px-5 md:px-10">
        <Reveal className="cava-swipe -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10">
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

      {/* L'Etna — juste apres les coutumes, et ce n'est pas un hasard : la
          granita dont on vient de parler descend de la neige de cette
          montagne-la. Les deux sections se repondent. */}
      {show('etna') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-16 md:px-10">
        <Reveal className="flex flex-col gap-3 border-t pt-8" style={{ borderColor: 'var(--cava-ink)' }}>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="volcano" size={16} /> {t.etnaPage.eyebrow}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
            {t.etnaPage.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
            {t.etnaPage.intro}
          </p>
        </Reveal>

        {/* Les deux photos de Mag. Tant qu'elles ne sont pas deposees dans
            /public/picture-sicile/, Photo affiche son aplat de repli plutot
            qu'une image cassee. */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {['/picture-sicile/etna-01.jpg', '/picture-sicile/etna-02.jpg'].map((src, i) => (
            <Reveal key={src} delay={i * 90}>
              <Photo
                src={src}
                alt={t.etnaPage.photoAlt}
                tone={i === 0 ? 'ink' : 'terra'}
                label={`${t.etnaPage.photoAlt} — à venir`}
                className="aspect-[4/3] w-full rounded-2xl"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
          {t.etnaPage.facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80} className="flex flex-col gap-4 p-8 md:p-10" style={{ background: 'var(--cava-bg)' }}>
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

        {/* Deux liens verifies vivants : le parc (site UNESCO officiel) et le
            detail des domaines skiables, pour qui veut vraiment y monter. */}
        <Reveal className="mt-8 flex flex-wrap gap-3">
          {[
            { url: 'https://www.unescoparcoetna.it/', label: t.etnaPage.linkPark, icon: 'volcano' as IconName },
            { url: 'https://www.skiresort.info/ski-resorts/parco-delletna/', label: t.etnaPage.linkSki, icon: 'compass' as IconName },
          ].map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-[14px] transition hover:opacity-85"
              style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)', fontWeight: 600 }}
            >
              <Icon name={l.icon} size={18} /> {l.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </Reveal>
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

      {show('playlist') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-12 md:px-10">
        <Reveal
          className="relative overflow-hidden rounded-3xl border p-8 md:p-10"
          style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
        >
          {/* Vinyle décoratif */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 opacity-[0.06]"
            style={{ color: 'var(--cava-pink)' }}
          >
            <Icon name="vinyl" size={220} />
          </span>

          {/* Le lecteur monte à côté du texte : il ne fait que 152px de haut,
              il n'a pas besoin d'attendre la fin du paragraphe pour exister. */}
          <div className="relative grid gap-6 md:gap-10 lg:grid-cols-[1fr_minmax(300px,440px)] lg:items-center">
            <div className="max-w-[56ch]">
              <span
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--cava-pink)' }}
              >
                <Icon name="vinyl" size={16} /> {c.eyebrow}
              </span>
              <h2 className="mt-2 text-[clamp(1.4rem,2.8vw,2rem)] uppercase leading-[1.05] tracking-[-0.02em]" style={{ fontWeight: 900 }}>
                {cf.playlist}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {c.playlistDesc}
              </p>
              <div className="mt-5">
                {SPOTIFY_PLAYLIST_URL ? (
                  <a
                    href={SPOTIFY_PLAYLIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[14px] transition hover:opacity-85"
                    style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                  >
                    <Icon name="spotify" size={19} /> {c.playlistCta} <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-2.5 rounded-full border border-dashed px-6 py-3 text-[14px] italic"
                    style={{ borderColor: 'var(--cava-line)', color: 'var(--cava-muted)' }}
                  >
                    <Icon name="spotify" size={19} /> {c.playlistSoon}
                  </span>
                )}
              </div>
            </div>

            {SPOTIFY_PLAYLIST_URL && (
              <div className="overflow-hidden rounded-xl">
                <iframe
                  src={SPOTIFY_EMBED_URL}
                  title={cf.playlist}
                  width="100%"
                  height={SPOTIFY_EMBED_HEIGHT}
                  frameBorder="0"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ border: 0, display: 'block' }}
                />
              </div>
            )}
          </div>
        </Reveal>
      </section>
      )}

      {/* À l'écran — films & séries tournés ici */}
      {show('ecrans') && <WorkGrid title={cf.screens} intro={c.screensIntro} items={SCREENS} icon="film" lang={lang} more={c.moreLabel} />}

      {/* Peint ici — Guccione & le Gruppo di Scicli */}
      {show('peinture') && <WorkGrid title={cf.painting} intro={c.artsIntro} items={ARTS} icon="brush" lang={lang} more={c.moreLabel} />}

      {/* Sculpté ici — Sasha Vinci. A sa propre section : « Peint ici » ne parle
          que de peinture, et son texte le dit. */}
      {show('sculpture') && <WorkGrid title={cf.sculpture} intro={c.sculptureIntro} items={SCULPTURES} icon="landmark" lang={lang} more={c.moreLabel} />}

      {/* Photographié ici — Giuseppe Leone & Scianna */}
      {show('photo') && <WorkGrid title={cf.photo} intro={c.photosIntro} items={PHOTOS} icon="camera" lang={lang} more={c.moreLabel} />}

      {/* Designer — Munari, son dictionnaire de gestes et son livre sur le design */}
      {show('mains') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-ink)' }}
        >
          {cf.hands}
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-[68ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          {c.handsIntro}
        </Reveal>

        {/* Deux cartes, un livre chacune : sa couverture en tête, son lien en
            pied. Les couvertures ne sont pas à nous — crédit éditeur sous
            chaque image, et rien du contenu des livres n'est repris. */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div
              className="flex h-full flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <figure className="flex flex-col gap-2">
                <img
                  src={withBase('/livres/speak-italian.jpg')}
                  alt={c.handsCoverAlt}
                  width={1103}
                  height={1500}
                  loading="lazy"
                  className="block h-auto w-[180px] rounded-lg"
                />
                <figcaption className="max-w-[34ch] text-[11.5px] leading-[1.45]" style={{ color: 'var(--cava-muted)' }}>
                  {c.handsCoverCredit}
                </figcaption>
              </figure>
              <h3 className="text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.12]" style={{ fontWeight: 600 }}>
                Bruno Munari
              </h3>
              <p className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                1907 – 1998
              </p>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {c.handsWho}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={MUNARI_BOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-[13.5px] transition hover:opacity-85"
                  style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                >
                  <Icon name="search" size={15} /> {c.handsBookCta} <span aria-hidden>↗</span>
                </a>
                <a href={MUNARI_WIKI} target="_blank" rel="noopener noreferrer" className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="info" size={15} /> {c.moreLabel} <span aria-hidden>↗</span>
                </a>
                <a href={DE_JORIO_WIKI} target="_blank" rel="noopener noreferrer" className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="info" size={15} /> Andrea de Jorio, 1832 <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Design as Art — son livre le plus lu, celui qui explique le reste */}
          <Reveal delay={70}>
            <div
              className="flex h-full flex-col gap-4 rounded-2xl border p-8 md:p-10"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <figure className="flex flex-col gap-2">
                <img
                  src={withBase('/livres/design-as-art.webp')}
                  alt={c.handsCover2Alt}
                  width={304}
                  height={500}
                  loading="lazy"
                  className="block h-auto w-[180px] rounded-lg"
                />
                <figcaption className="max-w-[34ch] text-[11.5px] leading-[1.45]" style={{ color: 'var(--cava-muted)' }}>
                  {c.handsCover2Credit}
                </figcaption>
              </figure>
              <h3 className="text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.12]" style={{ fontWeight: 600 }}>
                {c.handsBook2Title}
              </h3>
              <p className="font-mono text-[13px] tracking-[0.1em]" style={{ color: 'var(--cava-pink)' }}>
                1966
              </p>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                {c.handsBook2Desc}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={MUNARI_DESIGN_BOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-[13.5px] transition hover:opacity-85"
                  style={{ background: 'var(--cava-pink)', color: '#fff', fontWeight: 700 }}
                >
                  <Icon name="search" size={15} /> {c.handsBook2Cta} <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6 flex items-start gap-3 text-[13px] italic leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
          <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="info" size={14} />
          </span>
          <p className="max-w-[70ch]">{c.handsPhotoNote}</p>
        </Reveal>
      </section>
      )}

      {/* Chansons & histoires de Sicile — mini-liste, tout en bas */}
      {show('chansons') && (
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
        <Reveal
          as="h2"
          className="border-t pt-8 text-[clamp(1.4rem,2.6vw,1.9rem)] uppercase leading-[1.05] tracking-[-0.02em]"
          style={{ fontWeight: 900, borderColor: 'var(--cava-line)' }}
        >
          {cf.songs}
        </Reveal>
        <Reveal as="p" className="mt-2 max-w-[60ch] text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
          {c.artistsIntro}
        </Reveal>

        <Reveal as="ul" className="mt-6 max-w-[70rem]">
          {ARTISTS.map((a) => (
            <li key={a.id}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cava-songrow group flex items-baseline gap-3 border-b py-3.5"
                style={{ borderColor: 'var(--cava-line)' }}
              >
                <span aria-hidden className="shrink-0 self-center" style={{ color: 'var(--cava-pink)' }}>
                  <Icon name="vinyl" size={15} />
                </span>
                {/* Le nom se tronque plutôt que de pousser la ligne : tout en
                    shrink-0, « Colapesce Dimartino · SOLARINO & PALERMO »
                    debordait l'ecran sur telephone. */}
                <span className="min-w-0 truncate text-[15px]" style={{ fontWeight: 600 }}>
                  {a.name}
                </span>
                <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.14em] sm:inline" style={{ color: 'var(--cava-muted)' }}>
                  {a.from}
                </span>
                <span
                  className="hidden flex-1 truncate text-[13px] md:block"
                  style={{ color: 'var(--cava-muted)' }}
                >
                  {a.blurb[lang]}
                </span>
                <span
                  className="cava-songrow-cta ml-auto shrink-0 self-center md:ml-0"
                  style={{ color: 'var(--cava-pink)' }}
                >
                  <Icon name="spotify" size={17} />
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </section>
      )}

      <Reveal className="mx-auto max-w-[110rem] px-5 pb-24 pt-10 text-[14px] italic md:px-10" style={{ color: 'var(--cava-muted)' }}>
        {c.note}
      </Reveal>

      <div className="pb-24" />

      <Footer />
    </main>
    </RevealNow.Provider>
  );
}
