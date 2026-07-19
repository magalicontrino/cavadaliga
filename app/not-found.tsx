'use client';

import Nav from './Nav';
import Footer from './Footer';
import Reveal from './Reveal';
import Icon from './Icon';
import { NAV, withBase } from './data';
import { useI18n } from './i18n';

/**
 * La page 404.
 *
 * C'etait la seule page du site qui ne parlait ni francais ni italien : sans
 * `not-found`, Next sert la sienne — « This page could not be found », en
 * anglais, hors charte, et surtout sans un seul lien de retour. On y arrivait
 * et on n'en repartait plus.
 *
 * Elle fait trois choses, dans cet ordre : dire ou l'on est, ne culpabiliser
 * personne (« ce n'est pas votre faute »), et rouvrir le chemin — l'accueil en
 * grand, et toutes les pages a la suite. La bulle « Demander » est posee par
 * le gabarit, elle est donc la aussi : c'est souvent le plus court chemin vers
 * ce qu'on cherchait vraiment.
 *
 * L'export statique en fait un `404.html`, que GitHub Pages sert de lui-meme
 * pour toute adresse inconnue.
 */

/*
 * Les « 404 » en filigrane.
 *
 * Position en pourcentage, jamais en pixels : ils doivent se disperser pareil
 * sur un telephone et sur un grand ecran. Ils sont purement decoratifs, donc
 * `aria-hidden` — une liseuse d'ecran qui annoncerait onze fois « 404 » avant
 * le texte rendrait la page pire que celle de Next.
 */
const FILIGRANES = [
  { top: '4%', left: '6%', size: '1.6rem', o: 0.09 },
  { top: '9%', left: '47%', size: '2.4rem', o: 0.07 },
  { top: '15%', left: '86%', size: '1.4rem', o: 0.1 },
  { top: '31%', left: '18%', size: '3rem', o: 0.05 },
  { top: '38%', left: '72%', size: '1.8rem', o: 0.08 },
  { top: '52%', left: '3%', size: '2rem', o: 0.07 },
  { top: '58%', left: '58%', size: '1.3rem', o: 0.09 },
  { top: '69%', left: '31%', size: '2.6rem', o: 0.05 },
  { top: '77%', left: '89%', size: '1.7rem', o: 0.08 },
  { top: '88%', left: '12%', size: '1.5rem', o: 0.09 },
  { top: '93%', left: '64%', size: '2.2rem', o: 0.06 },
];

export default function NotFound() {
  const { t } = useI18n();
  const p = t.notFoundPage;

  return (
    <main>
      <Nav />

      <section className="relative mx-auto min-h-[80vh] max-w-[110rem] overflow-hidden px-5 pb-24 pt-[18vh] md:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
          {FILIGRANES.map((f, i) => (
            <span
              key={i}
              className="absolute uppercase leading-none tracking-[-0.02em]"
              style={{
                top: f.top,
                left: f.left,
                fontSize: f.size,
                fontWeight: 900,
                color: 'var(--cava-ink)',
                opacity: f.o,
              }}
            >
              404
            </span>
          ))}
        </div>

        {/* `relative` : le contenu repasse AU-DESSUS des filigranes, qui sont
            en `absolute` dans le meme bloc. Sans lui, le texte passait dessous
            et les grands filigranes le voilaient. */}
        <div className="relative flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3">
            <span
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--cava-pink)' }}
            >
              <Icon name="compass" size={16} /> {p.eyebrow}
            </span>

            <p
              className="leading-[0.82] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(5.5rem,26vw,18rem)', fontWeight: 900, color: 'var(--cava-pink)' }}
            >
              404
            </p>
          </Reveal>

          <Reveal
            as="h1"
            className="max-w-[16ch] text-[clamp(1.9rem,6vw,4rem)] uppercase leading-[0.98] tracking-[-0.02em]"
            style={{ fontWeight: 900 }}
          >
            {p.title}
          </Reveal>

          <Reveal className="max-w-[60ch] text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {p.text}
          </Reveal>

          {/* La definition, en petit et en gras, comme une note de bas de
              page : elle explique le nombre a qui se le demande, sans jamais
              passer devant le chemin de retour. */}
          <Reveal
            className="max-w-[52ch] border-l-2 pl-4 text-[13px] leading-[1.55]"
            style={{ borderColor: 'var(--cava-pink)', color: 'var(--cava-ink)', fontWeight: 600 }}
          >
            {p.definition}
          </Reveal>

          <Reveal>
            <a href={withBase('/')} className="cava-pill inline-flex w-fit items-center gap-2 px-6 py-3 text-[15px]">
              <Icon name="home" size={16} /> {p.home}
            </a>
          </Reveal>

          <Reveal className="mt-4 flex flex-col gap-4 border-t pt-8" style={{ borderColor: 'var(--cava-line)' }}>
            <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
              {p.elsewhere}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={withBase(item.href)}
                  className="rounded-full px-4 py-2.5 text-[14px] transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none"
                  style={{ border: '1px solid var(--cava-ink)', color: 'var(--cava-ink)', fontWeight: 600 }}
                >
                  {t.nav[item.href]}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
