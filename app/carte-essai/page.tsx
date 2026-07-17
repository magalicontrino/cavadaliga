'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import Reveal from '../Reveal';
import Icon from '../Icon';
import FilterChip from '../FilterChip';
import { CATS, LOCAL_PLACES, type CatKey } from '../localData';
import { COORDS } from './coords';
import { useI18n } from '../i18n';

/**
 * MAQUETTE, hors du menu et hors de NAV : elle ne fait pas partie du site.
 * Elle existe pour répondre à une question — « peut-on avoir un vrai fond de
 * carte, à nous ? » — et pour que Mag compare avant de trancher.
 *
 * MapLibre n'est chargé que si on ouvre cette page (ssr: false, import
 * dynamique) : le poids reste ici et ne touche pas les huit autres pages.
 */
const MapLibreMap = dynamic(() => import('./MapLibreMap'), { ssr: false });

export default function CarteEssai() {
  const { t, lang } = useI18n();
  const tl = t.localPage;
  const [filter, setFilter] = useState<'tout' | 'responsable' | CatKey>('tout');

  const CATS_ORDER: CatKey[] = ['chocolat', 'huile', 'marche', 'plantes', 'resto', 'supermarche', 'plage'];
  const sansPosition = LOCAL_PLACES.filter((p) => !COORDS[p.id]);

  return (
    <main>
      <Nav current="/carte-essai" />

      <section className="mx-auto max-w-[110rem] px-5 pt-10 md:px-10">
        <Reveal
          className="mb-6 flex items-start gap-3 rounded-2xl border border-dashed p-5 text-[13.5px] leading-[1.6]"
          style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-muted)' }}
        >
          <span className="mt-[3px] shrink-0" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="info" size={16} />
          </span>
          <p className="max-w-[80ch]">
            <strong style={{ color: 'var(--cava-ink)' }}>Maquette — pas une page du site.</strong> Elle n’est ni dans le
            menu ni dans le pied de page. La même région que notre poster dessiné, mais en vraie carte : on zoome à
            l’infini, les rues existent, et les adresses sont à leur position réelle et non approchée. À comparer avec la
            carte de <a className="cava-link" href="/services-locaux">Nos adresses</a>, puis à garder ou à jeter.
          </p>
        </Reveal>

        <Reveal as="h1" className="text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.95] tracking-[-0.03em]" style={{ fontWeight: 900 }}>
          La même région,
          <br />
          en vraie carte
        </Reveal>

        <Reveal as="p" className="mt-5 max-w-[70ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
          Le fond de carte est à nous : mer rose, terre crème, nos pictos. Rien n’est acheté, rien n’est loué — les
          données tiennent dans un seul fichier de 5 Mo posé dans le site, que le navigateur grignote par morceaux selon
          l’endroit qu’on regarde.
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap gap-2.5">
          <FilterChip label="Responsable & local" icon="leaf" active={filter === 'responsable'} onClick={() => setFilter('responsable')} />
          {CATS_ORDER.map((k) => (
            <FilterChip key={k} label={CATS[k].label[lang]} icon={CATS[k].icon} active={filter === k} onClick={() => setFilter(k)} />
          ))}
          <FilterChip label="Tout voir" icon="map" active={filter === 'tout'} onClick={() => setFilter('tout')} subtle />
        </Reveal>

        <Reveal className="mt-6">
          <MapLibreMap lang={lang} filter={filter} labels={{ map: tl.mapLabel, badge: tl.badge, here: t.regionHere, close: tl.closeLabel }} />
        </Reveal>

        {/* Ce que la maquette ne sait pas faire — autant le dire ici. */}
        <Reveal className="mt-6 grid gap-4 text-[13.5px] leading-[1.6] sm:grid-cols-3" style={{ color: 'var(--cava-muted)' }}>
          <p className="rounded-xl border p-5" style={{ borderColor: 'var(--cava-line)' }}>
            <strong style={{ color: 'var(--cava-ink)' }}>Ce que ça règle.</strong> Les épingles tombent où sont
            vraiment les lieux. Plus besoin de <span className="font-mono text-[12px]">geo.ts</span> ni de sa
            pondération sur onze repères — et plus de repère faux qui traîne.
          </p>
          <p className="rounded-xl border p-5" style={{ borderColor: 'var(--cava-line)' }}>
            <strong style={{ color: 'var(--cava-ink)' }}>Ce que ça coûte.</strong> ~210 Ko de JavaScript et 5 Mo de
            tuiles, contre un SVG aujourd’hui. Chargés seulement ici. Et le poster dessiné disparaît : une vraie carte
            ne peut pas être un dessin.
          </p>
          <p className="rounded-xl border p-5" style={{ borderColor: 'var(--cava-line)' }}>
            <strong style={{ color: 'var(--cava-ink)' }}>Ce qui manque.</strong>{' '}
            {sansPosition.length === 0
              ? 'Tous les lieux ont une position réelle.'
              : `${sansPosition.length} lieu sur ${LOCAL_PLACES.length} n’a pas de position réelle (${sansPosition
                  .map((p) => p.name)
                  .join(', ')}) : absent d’OpenStreetMap. À demander plutôt qu’à inventer.`}
          </p>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
