'use client';

import Reveal from './Reveal';
import Icon from './Icon';
import { useI18n } from './i18n';
import AskMag from './AskMag';
import { SITE } from './data';
import { TRANSPORTS, EMERGENCIES, PHARMACY, GAS } from './practicalData';

/** Se déplacer + urgences. Tous les liens sont cliquables, numéros compris. */
export default function GettingAround() {
  const { t, lang } = useI18n();
  const m = t.movePage;

  return (
    <>
      {/* Se déplacer */}
      <section className="mx-auto max-w-[110rem] px-5 pt-8 md:px-10">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="compass" size={16} /> {m.eyebrow}
          </span>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {m.title}
          </h2>
          <p className="max-w-[62ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {m.intro}
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {TRANSPORTS.map((tr, i) => (
            <Reveal key={tr.id} delay={(i % 3) * 70}>
              <div
                className="cava-listcard flex h-full flex-col gap-3 rounded-2xl border p-8"
                style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
              >
                <span
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
                >
                  <Icon name={tr.icon} size={28} />
                </span>
                <h3 className="mt-1 text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                  {tr.name}
                </h3>
                <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                  {tr.blurb[lang]}
                </p>
                <div className="mt-auto flex flex-wrap gap-3 pt-3">
                  <a
                    href={tr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                  >
                    <Icon name="map" size={15} /> {tr.insecure ? 'Site (http)' : 'Site'} <span aria-hidden>↗</span>
                  </a>
                  {tr.appUrl && (
                    <a
                      href={tr.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                    >
                      <Icon name="phone" size={15} /> {m.appLabel} <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Urgences */}
      <section className="mx-auto max-w-[110rem] px-5 pt-20 md:px-10">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.22em]" style={{ color: 'var(--cava-pink)' }}>
            <Icon name="phone" size={16} /> {m.urgencyEyebrow}
          </span>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]" style={{ fontWeight: 500 }}>
            {m.urgencyTitle}
          </h2>
          <p className="max-w-[62ch] text-[15px] leading-[1.7]" style={{ color: 'var(--cava-muted)' }}>
            {m.urgencyIntro}
          </p>
        </Reveal>

        {/* Le 112, en grand : c'est le seul numéro à retenir */}
        <Reveal
          className="flex flex-col gap-6 rounded-3xl border p-8 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ borderColor: 'var(--cava-pink)', background: 'rgba(230,41,111,0.05)' }}
        >
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--cava-pink)', fontWeight: 700 }}>
              {m.nueLabel}
            </p>
            <a
              href="tel:112"
              className="mt-1 block text-[clamp(3rem,10vw,5.5rem)] leading-[1] tracking-[-0.03em] transition hover:opacity-70"
              style={{ fontWeight: 900 }}
            >
              112
            </a>
          </div>
          <p className="max-w-[34ch] text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
            {m.nueNote}
          </p>
        </Reveal>

        {/* Les autres, toujours joignables */}
        <Reveal className="mt-6 text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
          {m.alsoLabel}
        </Reveal>
        <div className="mt-3 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'var(--cava-line)' }}>
          {EMERGENCIES.map((e) => (
            <a
              key={e.number}
              href={`tel:${e.number}`}
              className="cava-checkrow flex items-baseline gap-3 p-6"
              style={{ background: 'var(--cava-bg)' }}
            >
              <span className="text-[26px] leading-none" style={{ fontWeight: 900 }}>
                {e.number}
              </span>
              <span className="text-[13.5px]" style={{ color: 'var(--cava-muted)' }}>
                {e.label[lang]}
              </span>
            </a>
          ))}
        </div>

        {/* Contacts du village */}
        <Reveal className="mt-10 text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--cava-muted)' }}>
          {m.localTitle}
        </Reveal>

        <div className="mt-3 grid gap-6 lg:grid-cols-2">
          {/* Le gaz — Mormina, dans le village */}
          <Reveal>
            <div
              className="cava-listcard flex h-full flex-col gap-3 rounded-2xl border p-8"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
                >
                  <Icon name="droplet" size={28} />
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
                  style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
                >
                  <Icon name="home" size={13} /> {m.gasWalk}
                </span>
              </div>
              <h3 className="mt-1 text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                {GAS.name}
              </h3>
              <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-muted)' }}>
                {GAS.street}
              </p>
              <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {m.gasDesc}
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-3">
                <a href={`tel:${GAS.mobileTel}`} className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="phone" size={15} /> {GAS.mobile}
                </a>
                <a href={`tel:${GAS.phoneTel}`} className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]">
                  <Icon name="phone" size={15} /> {GAS.phone}
                </a>
                <a
                  href={GAS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cava-pill inline-flex items-center gap-2 px-4 py-2 text-[13px]"
                >
                  <Icon name="pin" size={15} /> Maps <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* La pharmacie du village */}
          <Reveal>
            <div
              className="cava-listcard flex h-full flex-col gap-3 rounded-2xl border p-8"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
                >
                  <Icon name="droplet" size={28} />
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
                  style={{ background: 'rgba(230,41,111,0.09)', color: 'var(--cava-pink)', fontWeight: 700 }}
                >
                  <Icon name="home" size={13} /> {m.pharmacyWalk}
                </span>
              </div>
              <h3 className="mt-1 text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                {PHARMACY.name}
              </h3>
              <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--cava-muted)' }}>
                {PHARMACY.street}
              </p>
              <p className="text-[14.5px]" style={{ fontWeight: 600 }}>
                {PHARMACY.hours[lang]}
              </p>
              <p className="text-[12.5px] italic leading-[1.5]" style={{ color: 'var(--cava-muted)' }}>
                {m.hoursNote}
              </p>
              <a
                href={PHARMACY.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cava-pill mt-auto inline-flex w-fit items-center gap-2 px-4 py-2 pt-2 text-[13px]"
              >
                <Icon name="pin" size={15} /> Google Maps <span aria-hidden>↗</span>
              </a>
            </div>
          </Reveal>

          {/* La garde */}
          <Reveal delay={70}>
            <div
              className="cava-listcard flex h-full flex-col gap-3 rounded-2xl border p-8"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name="phone" size={28} />
              </span>
              <h3 className="mt-1 text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                {m.dutyTitle}
              </h3>
              <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {m.dutyDesc}
              </p>
              <a
                href={PHARMACY.dutyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cava-pill mt-auto inline-flex w-fit items-center gap-2 px-4 py-2 pt-2 text-[13px]"
              >
                <Icon name="search" size={15} /> {m.dutyCta} <span aria-hidden>↗</span>
              </a>
            </div>
          </Reveal>

          {/* Le plombier : le numéro n'est pas public, il passe par Mag */}
          <Reveal delay={140}>
            <div
              className="cava-listcard flex h-full flex-col gap-3 rounded-2xl border p-8"
              style={{ borderColor: 'var(--cava-line)', background: 'var(--cava-bg)' }}
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ border: '1px solid var(--cava-line)', color: 'var(--cava-pink)' }}
              >
                <Icon name="droplet" size={28} />
              </span>
              <h3 className="mt-1 text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.15]" style={{ fontWeight: 600 }}>
                {m.plumberTitle}
              </h3>
              <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {m.plumberDesc}
              </p>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(`${t.askMag.subject} — ${m.plumberTitle}`)}`}
                className="cava-pill mt-auto inline-flex w-fit items-center gap-2 px-4 py-2 pt-2 text-[13px]"
              >
                <Icon name="phone" size={15} /> {t.askMag.cta}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Ce qu'on n'a pas : on donne quelqu'un à qui écrire */}
        <Reveal className="mt-6">
          <AskMag what={m.localToCome} />
        </Reveal>
      </section>
    </>
  );
}
