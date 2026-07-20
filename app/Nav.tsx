'use client';

import { useEffect, useState } from 'react';
import { NAV, SITE, withBase } from './data';
import Icon, { type IconName } from './Icon';
import PersoLink from './PersoLink';
import { useI18n, LangSwitcher } from './i18n';

/**
 * Nav — header du site : logo rond (carte de Scopa), sélecteur de langue,
 * bouton menu rond noir → menu plein écran. Libellés via i18n.
 */
export default function Nav({ current }: { current?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  // A-t-on quitte le haut de page ? Sert a poser un fond sous la barre.
  const [pose, setPose] = useState(false);
  // Descend-on ? Alors la barre s'efface, et revient des qu'on remonte.
  const [efface, setEfface] = useState(false);

  /**
   * La barre suit le doigt plutot que de rester plantee.
   *
   * Fixe et toujours visible, elle mangerait une bande de hauteur sur chaque
   * ecran de telephone. Fixe et masquee en descendant, elle ne coute rien quand
   * on lit — et revient au premier geste vers le haut, sans avoir a remonter
   * toute la page.
   *
   * Le seuil de 8 px evite qu'un tremblement de doigt la fasse clignoter, et
   * les 140 px laissent le haut de page tranquille : on ne masque pas une barre
   * qu'on vient a peine de quitter.
   */
  useEffect(() => {
    let precedent = window.scrollY;
    const auDefilement = () => {
      const y = window.scrollY;
      setPose(y > 24);
      if (y > 140 && y > precedent + 8) setEfface(true);
      else if (y < precedent - 8) setEfface(false);
      precedent = y;
    };
    auDefilement();
    window.addEventListener('scroll', auDefilement, { passive: true });
    return () => window.removeEventListener('scroll', auDefilement);
  }, []);

  /*
   * Les memes raccourcis que le pied de page — la casa, le calendrier, les
   * poubelles, sons & images, le quiz, l'italien. Les epaisseurs de trait sont
   * celles de la barre du haut : deux rangees du meme site ne doivent pas se
   * dessiner differemment.
   */
  const RACCOURCIS: { href: string; label: string; icon: IconName; trait?: number }[] = [
    { href: withBase('/appartement'), label: t.apartment.label, icon: 'window', trait: 1.25 },
    { href: withBase('/calendrier'), label: t.stayPage.title, icon: 'calendar' },
    { href: withBase('/poubelles'), label: t.wastePage.title, icon: 'trash', trait: 1.7 },
    { href: `${withBase('/la-region')}#sons`, label: t.culturePage.title, icon: 'vinyl' },
    { href: `${withBase('/la-region')}#quiz`, label: t.quizPage.title, icon: 'hourglass' },
    // L'italien n'est plus dans le menu (Mag) — ni en grand lien plus haut, ni
    // en picto ici. Il reste atteignable par le pied de page et par « La
    // region » : la page n'est pas orpheline, elle a seulement quitte le menu.
  ];

  // Menu ouvert : la barre reste. L'overlay est un enfant de <header> — masquer
  // le parent l'emporterait avec lui, et le menu s'ouvrirait hors de l'ecran.
  const cache = efface && !open;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    // `pointer-events-none` sur l'entete : escamotee, la barre laisse derriere
    // elle une bande vide qui, sans cela, avalerait les clics du contenu.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/*
        La translation vit ICI, sur un conteneur interieur, et surtout PAS sur
        <header> — piege CSS coriace : un element transforme devient le
        referentiel de ses descendants `fixed`. L'overlay du menu, enfant de
        l'entete, cessait donc de couvrir l'ecran pour se replier sur la hauteur
        de la barre. Mesure au banc : 88 px au lieu de 812. La translation
        posee ici, l'overlay reste sibling et retrouve le viewport.
      */}
      {/*
        Menu ouvert : la barre s'efface D'UN COUP, sans transition.
        L'overlay redessine deja le logo, les langues et un bouton rond a
        l'emplacement exact du hamburger — les laisser tous les deux peints
        superposait le ✕ sur le disque noir, et laissait voir les pictos au
        travers tant que le fondu n'etait pas fini.

        Pire, la barre finissait son glissement pendant ce temps : tapee alors
        qu'elle remontait, elle partait de -68 px pour rejoindre 20 px en
        300 ms, quand le ✕ etait deja pose. Mesure au banc : jusqu'a 88 px
        d'ecart entre les deux boutons, d'ou l'impression de deux menus mal
        alignes. Invisible, elle peut finir sa course sans que ca se voie.
      */}
      <div
        className={`pointer-events-auto relative transition-transform duration-300 motion-reduce:transition-none ${
          cache ? '-translate-y-full' : 'translate-y-0'
        } ${open ? 'invisible' : 'visible'}`}
      >
      {/*
        Le voile givre est LA TOUT LE TEMPS, et c'est le point.
        Il n'apparaissait d'abord qu'apres 24 px de defilement : au repos, sur
        une page qui s'ouvre par une photo, les pictos roses se perdaient dans
        l'image. Or ce voile est de la couleur du fond du site — sur le creme
        il ne se voit pas, et par-dessus une photo il se revele en bande
        givree. Permanent, il ne coute donc rien la ou il ne sert pas.

        L'opacite reste moderee : c'est le flou qui fait le travail de
        lisibilite, pas l'opacite. Un voile opaque poserait un bandeau franc en
        travers du hero.

        Seul le filet du bas suit le defilement : trace des le haut de page, il
        barrerait le hero d'un trait sans raison.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border-b backdrop-blur-xl transition-colors duration-300 motion-reduce:transition-none"
        style={{
          background: 'rgba(252,250,251,0.7)',
          borderColor: pose && !open ? 'var(--cava-line)' : 'transparent',
        }}
      />
      {/* Les deux côtés portent la même largeur (flex-1) : le sélecteur de langue
          reste centré sur la page quel que soit le nombre de boutons à droite. */}
      <div className="relative mx-auto flex max-w-[110rem] items-center px-5 py-5 md:px-10">
        {/* Logo rond (carte de Scopa) */}
        <div className="flex flex-1 justify-start">
          <a href={withBase('/')} aria-label={SITE.name} className="block h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-full ring-1 ring-black/10 transition-transform duration-300 hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase('/deco/logo-scopa.jpg')} alt={SITE.name} className="h-full w-full object-cover" />
          </a>
        </div>

        {/* Sélecteur de langue IT · FR · EN — nulle part sur telephone.
            Coince entre le logo et trois boutons ronds, il n'avait plus la
            place ; sous la rangee, il encombrait. Or il vit deja dans le menu,
            qui est a un doigt, et desormais dans le pied de page. Sur grand
            ecran, il garde le centre. */}
        <div className="hidden md:block">
          <LangSwitcher />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          {/* L'appartement — en tete des raccourcis : c'est la maison, le point
              de depart de tout le reste. Sa page se construit encore ; le picto
              y mene deja, sur toutes les pages. */}
          <a
            href={withBase('/appartement')}
            aria-label={t.apartment.label}
            aria-current={current === '/appartement' ? 'page' : undefined}
            title={t.apartment.label}
            className="cava-vinyllink flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="window" size={24} strokeWidth={1.25} />
          </a>

          {/* Le calendrier des sejours. C'est le SEUL chemin vers /calendrier
              avec la vignette de l'accueil : la page n'est pas au menu, et
              repond pourtant a la question qu'on se pose le plus souvent en
              famille — « la maison est libre quand ? ». */}
          <a
            href={withBase('/calendrier')}
            aria-label={t.stayPage.title}
            aria-current={current === '/calendrier' ? 'page' : undefined}
            title={t.stayPage.title}
            className="cava-vinyllink flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="calendar" size={24} />
          </a>

          {/* Les poubelles. « Qu'est-ce qu'on sort ce soir ? » se demande une
              fois par jour, souvent tard : ca vaut un geste, pas trois. */}
          <a
            href={withBase('/poubelles')}
            aria-label={t.wastePage.title}
            aria-current={current === '/poubelles' ? 'page' : undefined}
            title={t.wastePage.title}
            className="cava-vinyllink flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="trash" size={24} strokeWidth={1.7} />
          </a>

          {/* Culture — sons & images (vinyle), à gauche du menu */}
          <a
            href={`${withBase('/la-region')}#sons`}
            aria-label={t.culturePage.title}
            title={t.culturePage.title}
            className="cava-vinyllink flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="vinyl" size={24} />
          </a>

          {/* Bouton menu rond noir → overlay plein écran */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105"
            style={{ background: 'var(--cava-ink)' }}
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-[2px] w-6 rounded-full" style={{ background: 'var(--cava-bg)' }} />
              <span className="block h-[2px] w-6 rounded-full" style={{ background: 'var(--cava-bg)' }} />
              <span className="block h-[2px] w-6 rounded-full" style={{ background: 'var(--cava-bg)' }} />
            </span>
          </button>
        </div>
      </div>

      </div>

      {/* Overlay plein écran — hors du conteneur translate (voir plus haut). */}
      {/*
        Le fondu est court a l'ouverture, long a la fermeture — volontairement.
        A l'aller, tant qu'il dure, la page d'accueil se lit EN TRANSPARENCE
        derriere les mots du menu : le titre du hero, le bouton « Nous ecrire »
        et les photos se melaient aux libelles. 500 ms suffisaient largement a
        le remarquer ; 180 ms se lisent comme un basculement franc.
        Au retour, rien ne gene derriere : le menu peut s'evaporer tranquillement.
      */}
      <div
        className={`pointer-events-auto fixed inset-0 z-[60] flex flex-col transition-[opacity,visibility] motion-reduce:transition-none ${
          open ? 'visible opacity-100 duration-[180ms]' : 'invisible opacity-0 duration-500'
        }`}
        style={{ background: 'var(--cava-bg)', color: 'var(--cava-ink)' }}
      >
        <div className="mx-auto flex w-full max-w-[110rem] items-center justify-between px-5 py-5 md:px-10">
          <a href={withBase('/')} onClick={() => setOpen(false)} aria-label={SITE.name} className="block h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase('/deco/logo-scopa.jpg')} alt={SITE.name} className="h-full w-full object-cover" />
          </a>
          <div className="flex items-center gap-6">
            <LangSwitcher />
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full ring-1 ring-black/15 text-[18px] transition-transform duration-300 hover:scale-105"
            >
              ✕
            </button>
          </div>
        </div>
        <nav
          className="mx-auto flex w-full max-w-[110rem] flex-1 flex-col justify-center overflow-y-auto border-t px-5 md:px-10"
          style={{ borderColor: 'var(--cava-line)' }}
        >
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={withBase(item.href)}
              onClick={() => setOpen(false)}
              aria-current={current === item.href ? 'page' : undefined}
              className="cava-footlink group flex items-center justify-between border-b py-[1.1vh] aria-[current=page]:opacity-45"
              style={{ borderColor: 'var(--cava-line)' }}
            >
              <span
                className="text-[clamp(1.6rem,5.6vh,3.6rem)] uppercase leading-[1.02] tracking-[-0.02em]"
                style={{ fontWeight: 900 }}
              >
                {t.nav[item.href]}
              </span>
              <span className="cava-footlink-arrow text-[clamp(1.1rem,3vw,2rem)]" aria-hidden>
                ↗
              </span>
            </a>
          ))}
          {/*
            LE COURS D'ITALIEN A QUITTE LE MENU (Mag : « retire l'italien du
            menu »). Il y etait ajoute a la main, sous la boucle sur NAV, parce
            qu'il n'appartient pas a NAV — NAV nourrit aussi l'accueil, le pied
            de page et la 404, et on ne le voulait qu'ici.

            LA PAGE N'EST PAS SUPPRIMEE ET N'EST PAS ORPHELINE : le picto du
            pied de page y mene toujours, « La region » y renvoie depuis ses
            chansons, et « Demander » l'indexe. Retirer une entree de menu n'est
            pas retirer une page — si c'est la page qu'on veut enlever, il
            faudra couper ces trois-la aussi.
          */}
        </nav>

        {/* Bas du menu : les raccourcis, puis le copyright (même style que le
            pied de page). Mag les veut ici aussi — le menu est plein écran,
            c'est le seul endroit où les six tiennent sans se battre pour la
            place, contrairement à la barre du haut où le cinquième poussait
            déjà le bouton hors de l'écran. */}
        <div
          className="mx-auto flex w-full max-w-[110rem] flex-col gap-4 px-5 pb-8 pt-5 text-[12px] md:px-10"
          style={{ color: 'var(--cava-muted)' }}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            {RACCOURCIS.map((r) => (
              <a
                key={r.href}
                href={r.href}
                onClick={() => setOpen(false)}
                aria-label={r.label}
                title={r.label}
                className="cava-vinyllink flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
              >
                <Icon name={r.icon} size={22} strokeWidth={r.trait} />
              </a>
            ))}
          </div>
          <PersoLink />
        </div>
      </div>
    </header>
  );
}
