'use client';

import { useEffect, useState } from 'react';
import { NAV, SITE, withBase } from './data';
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
      <div className="mx-auto flex max-w-[110rem] items-center justify-between px-5 py-5 md:px-10">
        {/* Logo rond (carte de Scopa) */}
        <a href={withBase('/')} aria-label={SITE.name} className="block h-14 w-14 overflow-hidden rounded-full ring-1 ring-black/10 transition-transform duration-300 hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBase('/deco/logo-scopa.jpg')} alt={SITE.name} className="h-full w-full object-cover" />
        </a>

        {/* Sélecteur de langue IT · FR · EN */}
        <LangSwitcher />

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

      {/* Overlay plein écran */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col transition-[opacity,visibility] duration-500 ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        style={{ background: 'var(--cava-ink)', color: 'var(--cava-bg)' }}
      >
        <div className="mx-auto flex w-full max-w-[110rem] items-center justify-between px-5 py-5 md:px-10">
          <a href={withBase('/')} onClick={() => setOpen(false)} aria-label={SITE.name} className="block h-14 w-14 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase('/deco/logo-scopa.jpg')} alt={SITE.name} className="h-full w-full object-cover" />
          </a>
          <div className="flex items-center gap-6">
            <LangSwitcher tone="light" />
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-white/25 text-[18px]"
            >
              ✕
            </button>
          </div>
        </div>
        <nav className="mx-auto flex w-full max-w-[110rem] flex-1 flex-col justify-center gap-0 overflow-y-auto px-5 md:px-10">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href.startsWith('#') ? item.href : withBase(item.href)}
              onClick={() => setOpen(false)}
              aria-current={current === item.href ? 'page' : undefined}
              className="border-b py-[1.4vh] text-[clamp(1.5rem,5.2vh,3.4rem)] leading-[1.1] transition-transform duration-300 hover:translate-x-2 aria-[current=page]:opacity-60"
              style={{
                borderColor: 'rgba(255,255,255,0.14)',
                fontWeight: 300,
                transitionDelay: open ? `${i * 40}ms` : '0ms',
              }}
            >
              {t.nav[i]}
            </a>
          ))}
        </nav>
        <a href={`mailto:${SITE.email}`} className="mx-auto w-full max-w-[110rem] px-5 pb-8 pt-4 text-[14px] opacity-80 md:px-10">
          {t.writeUs}
        </a>
      </div>
    </header>
  );
}
