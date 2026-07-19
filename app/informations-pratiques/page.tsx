'use client';

import { useEffect, useState } from 'react';
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

type Key = 'tout' | 'adresse' | 'arrivee' | 'bouger' | 'parking' | 'argent' | 'bestioles' | 'urgences' | 'dechets' | 'depart';

/** Les sections atteignables par un lien « #… ». « tout » n'en est pas une. */
const SECTIONS: Key[] = ['adresse', 'arrivee', 'bouger', 'parking', 'argent', 'bestioles', 'urgences', 'dechets', 'depart'];


export default function InformationsPratiques() {
  const { t } = useI18n();
  const p = t.pages['informations-pratiques'];
  const a = t.arrivee;
  const f = t.infoFilter;
  const c = t.casaPeek;

  // On arrive sur « Adresse » : le bouton allumé correspond à ce qu'on voit.
  // Avec « Tout » par défaut, cliquer « Adresse » ne changeait rien à l'écran.
  const [filter, setFilter] = useState<Key>('adresse');

  /**
   * On peut arriver ICI, sur une section precise, par « #urgences » ou
   * « #depart ».
   *
   * La page n'affiche qu'une section a la fois : une ancre seule aurait vise
   * un titre que le filtre tenait cache, et le navigateur n'aurait rien
   * trouve ou l'aurait fait defiler dans le vide. Le fragment choisit donc
   * D'ABORD le bouton, et le defilement suit une fois la section posee.
   *
   * C'est « Demander » qui s'en sert : ses reponses sont coupees court et
   * renvoient a l'endroit exact d'ou vient le texte.
   */
  const [cible, setCible] = useState<Key | null>(null);
  useEffect(() => {
    const cle = window.location.hash.slice(1) as Key;
    if (!cle || !SECTIONS.includes(cle)) return;
    setFilter(cle);
    setClicks((c) => c + 1);
    setCible(cle);
  }, []);

  /*
   * Le defilement attend que la section EXISTE.
   *
   * Il partait d'abord dans le meme elan que le choix du filtre, au frame
   * suivant : trop tot. React n'avait pas encore pose la section, getElementById
   * rendait null, et la page restait en haut — mesure au banc, scrollY a 0 pour
   * une section a 505 px. En passant par un effet qui suit `filter`, on ne vise
   * qu'une fois la section rendue.
   */
  useEffect(() => {
    if (!cible || filter !== cible) return;
    // `instant` : on arrive d'ailleurs, voir app/ancre.ts.
    document.getElementById(cible)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    setCible(null);
  }, [cible, filter]);
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
    { key: 'parking', label: f.parking, icon: 'car' },
    { key: 'argent', label: f.money, icon: 'bag' },
    { key: 'bestioles', label: f.fauna, icon: 'leaf' },
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
      <section id="adresse" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-10 pt-12 md:px-10">
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
        <section id="arrivee" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-8 pt-12 md:px-10">
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

      {show('bouger') && (
        <div id="bouger" className="scroll-mt-24">
          <Transports />
        </div>
      )}
      {/* Se garer : les couleurs au sol. Mag l'a demande apres avoir vu que le
          site n'en disait rien — et c'est la premiere chose qu'on affronte en
          arrivant avec une voiture de location. */}
      {show('parking') && (
        <section id="parking" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-8 pt-12 md:px-10">
          <Reveal className="mb-8 flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="car" size={16} /> {t.parkingPage.eyebrow}
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              {t.parkingPage.title}
            </h2>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
              {t.parkingPage.intro}
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
            {t.parkingPage.facts.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8" style={{ background: 'var(--cava-bg)' }}>
                {/* La pastille EST l'information : on montre la couleur des
                    lignes, pas un dessin de voiture repete cinq fois. Le blanc
                    porte un filet, sans quoi il disparaitrait sur le fond. */}
                <span
                  aria-hidden
                  className="h-10 w-10 shrink-0 rounded-full"
                  style={{ background: f.couleur, border: `1px solid ${f.bord ?? f.couleur}` }}
                />
                <h3 className="text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
                  {f.title}
                </h3>
                <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                  {f.text}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6 max-w-[68ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {t.parkingPage.note}
          </Reveal>

          {/* Le gardien : pas une couleur au sol, une coutume. Mag y tient —
              c'est la situation qui surprend le plus quelqu'un qui debarque,
              et savoir a quoi s'en tenir vaut mieux que de le decouvrir la
              portiere a la main. D'ou l'encadre, a part des pastilles. */}
          <Reveal className="mt-8 rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--cava-line)' }}>
            <h3 className="mb-3 flex items-center gap-2 text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.2]" style={{ fontWeight: 600 }}>
              <Icon name="info" size={18} /> {t.parkingPage.gardien.title}
            </h3>
            <p className="max-w-[68ch] text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
              {t.parkingPage.gardien.text}
            </p>
          </Reveal>
        </section>
      )}

      {/* Retirer de l'argent. Mag ne savait pas s'il y avait un distributeur a
          Donnalucata ; verification faite, il y en a deux — la banque et la
          poste. On les donne tous les deux exprès : un appareil en panne un
          dimanche d'aout ne doit bloquer personne. */}
      {show('argent') && (
        <section id="argent" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-8 pt-12 md:px-10">
          <Reveal className="mb-8 flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="bag" size={16} /> {t.cashPage.eyebrow}
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              {t.cashPage.title}
            </h2>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
              {t.cashPage.intro}
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: 'var(--cava-line)' }}>
            {t.cashPage.spots.map((x, i) => (
              <Reveal key={x.title} delay={i * 80} className="flex flex-col gap-3 p-8" style={{ background: 'var(--cava-bg)' }}>
                <h3 className="text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.25]" style={{ fontWeight: 600 }}>
                  {x.title}
                </h3>
                <p className="text-[14px] uppercase tracking-[0.1em]" style={{ color: 'var(--cava-pink)', fontWeight: 600 }}>
                  {x.where}
                </p>
                <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                  {x.text}
                </p>
                <a href={x.url} target="_blank" rel="noreferrer" className="cava-pill mt-2 self-start px-5 py-2.5 text-[13px]">
                  {x.label} ↗
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6 max-w-[68ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {t.cashPage.note}
          </Reveal>
        </section>
      )}

      {/* Les bestioles et la proprete. Mag : « pas forcement evident pour les
          nordistes » — c'est exactement le point. Les regles d'abord, parce
          que ce sont elles qui servent tous les jours ; les animaux ensuite,
          parce qu'ils rassurent une fois qu'on sait quoi faire. */}
      {show('bestioles') && (
        <section id="bestioles" className="mx-auto max-w-[110rem] scroll-mt-24 px-5 pb-8 pt-12 md:px-10">
          <Reveal className="mb-8 flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
              <Icon name="leaf" size={16} /> {t.faunaPage.eyebrow}
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
              {t.faunaPage.title}
            </h2>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.75]" style={{ color: 'var(--cava-muted)' }}>
              {t.faunaPage.intro}
            </p>
          </Reveal>

          <Reveal className="mb-10 rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--cava-line)' }}>
            <h3 className="mb-4 text-[13px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
              {t.faunaPage.rulesTitle}
            </h3>
            <ul className="flex flex-col gap-3">
              {t.faunaPage.rules.map((r) => (
                <li key={r} className="flex gap-3 text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--cava-pink)' }} />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mb-5 text-[13px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
            {t.faunaPage.factsTitle}
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: 'var(--cava-line)' }}>
            {t.faunaPage.facts.map((x, i) => (
              <Reveal key={x.title} delay={(i % 3) * 80} className="flex flex-col gap-4 p-8" style={{ background: 'var(--cava-bg)' }}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: 'var(--cava-line)' }}>
                  <Icon name={x.icon as IconName} size={20} />
                </span>
                <h3 className="text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.25]" style={{ fontWeight: 600 }}>
                  {x.title}
                </h3>
                <p className="text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
                  {x.text}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6 max-w-[68ch] text-[14px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {t.faunaPage.note}
          </Reveal>
        </section>
      )}

      {show('urgences') && (
        <div id="urgences" className="scroll-mt-24">
          <Emergencies />
        </div>
      )}
      {show('dechets') && (
        <div id="dechets" className="scroll-mt-24">
          <WasteSchedule />
        </div>
      )}
      {show('depart') && (
        <div id="depart" className="scroll-mt-24">
          <DepartChecklist />
        </div>
      )}

      {/* Un rappel de la casa, hors filtres : on est ici pour se reperer, et
          revoir les pieces aide. Les douze photos y passent en defilant, ce qui
          les montre toutes sans allonger une page deja longue ; le lien mene a
          La casa, ou elles sont rangees piece par piece. */}
      <section className="mx-auto max-w-[110rem] px-5 pb-8 pt-16 md:px-10">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="window" size={16} strokeWidth={1.25} /> {c.eyebrow}
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
