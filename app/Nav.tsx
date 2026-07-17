'use client';

import { useEffect, useState } from 'react';
import { NAV, SITE, withBase } from './data';
import Icon from './Icon';
import PersoLink from './PersoLink';
import { useI18n, LangSwitcher } from './i18n';

/**
 * Nav — header du site : logo rond (carte de Scopa), sélecteur de langue,
 * bouton menu rond noir → menu plein écran. Libellés via i18n.
 */
export default function Nav({ current }: { current?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Les deux côtés portent la même largeur (flex-1) : le sélecteur de langue
          reste centré sur la page quel que soit le nombre de boutons à droite. */}
      <div className="mx-auto flex max-w-[110rem] items-center px-5 py-5 md:px-10">
        {/* Logo rond (carte de Scopa) */}
        <div className="flex flex-1 justify-start">
          <a href={withBase('/')} aria-label={SITE.name} className="block h-14 w-14 overflow-hidden rounded-full ring-1 ring-black/10 transition-transform duration-300 hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase('/deco/logo-scopa.jpg')} alt={SITE.name} className="h-full w-full object-cover" />
          </a>
        </div>

        {/* Sélecteur de langue IT · FR · EN */}
        <LangSwitcher />

        <div className="flex flex-1 items-center justify-end gap-3">
          {/* Le calendrier, a gauche du vinyle. Il etait deja dans le menu, mais
              il fallait l'ouvrir pour le trouver : c'est la question qu'on se
              pose le plus souvent en famille — « la maison est libre quand ? ».
              Meme habit que le vinyle : ces deux-la sont des raccourcis, pas des
              pages de plus. */}
          <a
            href={withBase('/evenements')}
            aria-label={t.calendarPage.title}
            aria-current={current === '/evenements' ? 'page' : undefined}
            title={t.calendarPage.title}
            className="cava-vinyllink flex h-14 w-14 items-center justify-center rounded-full aria-[current=page]:opacity-45"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="calendar" size={24} />
          </a>

          {/* Culture — sons & images (vinyle), à gauche du menu */}
          <a
            href={`${withBase('/la-region')}#sons`}
            aria-label={t.culturePage.title}
            title={t.culturePage.title}
            className="cava-vinyllink flex h-14 w-14 items-center justify-center rounded-full aria-[current=page]:opacity-45"
            style={{ background: 'rgba(230,41,111,0.12)', color: 'var(--cava-pink)' }}
          >
            <Icon name="vinyl" size={26} />
          </a>

          {/* Bouton menu rond noir → overlay plein écran */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105"
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

      {/* Overlay plein écran */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col transition-[opacity,visibility] duration-500 ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        style={{ background: 'var(--cava-bg)', color: 'var(--cava-ink)' }}
      >
        <div className="mx-auto flex w-full max-w-[110rem] items-center justify-between px-5 py-5 md:px-10">
          <a href={withBase('/')} onClick={() => setOpen(false)} aria-label={SITE.name} className="block h-14 w-14 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase('/deco/logo-scopa.jpg')} alt={SITE.name} className="h-full w-full object-cover" />
          </a>
          <div className="flex items-center gap-6">
            <LangSwitcher />
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-black/15 text-[18px] transition-transform duration-300 hover:scale-105"
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
        </nav>

        {/* Bas du menu : copyright (même style que le footer) */}
        <div
          className="mx-auto flex w-full max-w-[110rem] px-5 pb-8 pt-5 text-[12px] md:px-10"
          style={{ color: 'var(--cava-muted)' }}
        >
          <PersoLink />
        </div>
      </div>
    </header>
  );
}
