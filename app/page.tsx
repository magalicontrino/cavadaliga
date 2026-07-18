'use client';

import Nav from './Nav';
import Hero from './Hero';
import Reveal from './Reveal';
import PhotoRotator from './PhotoRotator';
import Footer from './Footer';
import CtaBadge from './CtaBadge';
import Gallery from './Gallery';
import Weather from './Weather';
import { NAV, GALLERY_STRIP } from './data';
import { useI18n } from './i18n';

export default function CavaHome() {
  const { t } = useI18n();
  return (
    <main>
      <Nav current="/" />
      <Hero />

      {/* ---------- Intro (style éditorial « we are ») ---------- */}
      <section className="mx-auto max-w-[110rem] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <Weather />
        </Reveal>
        <Reveal as="p" delay={140} className="mt-8 max-w-[42ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
          {t.intro}
        </Reveal>
        <Reveal delay={220} className="mt-14">
          {/* Cava d'Aliga et le coucher de soleil se relaient ici, toutes les
              10 secondes, en fondu. Le coucher n'a plus de bande a lui en bas
              de page : il vaut mieux une image qu'on regarde qu'une image
              qu'on depasse. */}
          <PhotoRotator
            images={['/picture-sicile/cava-daliga.jpg', '/picture-sicile/coucher-soleil.jpg']}
            alts={[t.cavaAlt, t.sunsetAlt]}
            tone="sand"
            className="aspect-[16/10] w-full rounded-2xl md:aspect-[2.2/1]"
          />
        </Reveal>
      </section>

      {/* ---------- Les rubriques (CTA à badge rotatif) ----------
          Une CTA par page du menu, dans le même ordre : le visiteur retrouve
          la même séquence partout. Les titres viennent de t.ctaTitles, aligné
          sur NAV. Le badge alterne de côté d'une section à l'autre. */}
      {/* La casa ouvre la serie, en dehors de NAV : elle a quitte le menu mais
          garde sa vignette ici — c'est le sujet du site. Son titre vient donc
          de t.apartment, plus de t.ctaTitles qui ne couvre que le menu. */}
      <CtaBadge
        href="/appartement"
        title={t.apartment.ctaTitle}
        circleId="cava-c-appartement"
      />

      {NAV.map((item, i) => (
        <CtaBadge
          key={item.href}
          href={item.href}
          title={t.ctaTitles[item.href]}
          circleId={`cava-c-${item.href.slice(1)}`}
          // La casa occupe la premiere place : l'alternance repart d'elle.
          flip={i % 2 === 0}
        />
      ))}

      {/* Le calendrier des sejours, hors NAV comme La casa : la page n'est pas
          au menu, cette vignette et le picto de la barre y menent seuls.
          Huitieme de la serie, donc a gauche — l'alternance continue. */}
      <CtaBadge
        href="/calendrier"
        title={t.stayPage.title}
        circleId="cava-c-calendrier"
        flip
      />

      {/* ---------- Galerie : bandeau d'images défilant ---------- */}
      <section className="py-24 md:py-28">
        <Gallery images={GALLERY_STRIP} />
      </section>

      {/* Contact et Instagram ne sont plus ici : le footer les porte sur toutes
          les pages, accueil compris. Ils s'affichaient deux fois de suite, dans
          la même typo, à quelques centimètres d'écart. */}

      <Footer />
    </main>
  );
}
