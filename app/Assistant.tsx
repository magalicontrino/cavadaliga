'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { SITE, withBase } from './data';
import { useI18n } from './i18n';
import { chercher, construireIndex, type Fiche, type Reponse } from './demander';

/**
 * « Demander » — la bulle qui cherche dans le site.
 *
 * Elle ne parle a aucune IA et n'a besoin d'aucun serveur : le site est
 * exporte en fichiers, une clef d'API y serait lisible par tout le monde. Elle
 * retrouve donc un texte de Mag et le rend tel quel, avec le lien vers sa
 * page. Voir app/demander.ts pour le moteur.
 *
 * L'index se reconstruit quand la langue change — les fiches portent le texte
 * de la langue lue, et une reponse en francais sous un site en italien serait
 * pire que pas de reponse.
 */
export default function Assistant() {
  const { t, lang } = useI18n();
  const a = t.assistant;
  const [ouvert, setOuvert] = useState(false);
  const [q, setQ] = useState('');
  /** La question REELLEMENT cherchee — pas celle en train d'etre tapee. */
  const [pose, setPose] = useState('');
  /** La fiche mise en avant, quand on en choisit une autre dans « Aussi ». */
  const [choisie, setChoisie] = useState<string | null>(null);
  const champ = useRef<HTMLInputElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  const index = useMemo<Fiche[]>(() => construireIndex(t, lang), [t, lang]);
  const resultats = useMemo<Reponse[]>(() => (pose ? chercher(pose, index) : []), [pose, index]);

  const enAvant = resultats.find((r) => r.fiche.id === choisie) ?? resultats[0];
  const autres = resultats.filter((r) => r.fiche.id !== enAvant?.fiche.id);

  // Ouvert : le doigt va au champ, et Echap referme. Sans le premier, il faut
  // viser une deuxieme fois pour taper ; sans le second, on est piege sur un
  // clavier.
  useEffect(() => {
    if (!ouvert) return;
    champ.current?.focus();
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false);
    };
    window.addEventListener('keydown', auClavier);
    return () => window.removeEventListener('keydown', auClavier);
  }, [ouvert]);

  const chercherMaintenant = (texte: string) => {
    setQ(texte);
    setPose(texte);
    setChoisie(null);
    // Une nouvelle reponse arrive tout en haut : on y remonte, sinon elle
    // s'ecrit sous le pli et on croit qu'il ne s'est rien passe.
    requestAnimationFrame(() => panneau.current?.scrollTo({ top: 0 }));
  };

  const vider = () => {
    setQ('');
    setPose('');
    setChoisie(null);
    champ.current?.focus();
  };

  const sujet = encodeURIComponent(pose ? `${t.askMag.subject} — ${pose}` : t.askMag.subject);

  return (
    <>
      {/*
        La bulle. z-40 : sous la barre du haut (z-50) et sous le menu plein
        ecran (z-60), qui doivent tous deux pouvoir la couvrir.

        A GAUCHE, et ce n'est pas un gout : posee a droite, elle recouvrait le
        « © OpenStreetMap » de la carte. Cette mention n'est pas decorative, la
        licence des donnees impose qu'elle reste lisible — et sur une carte
        elle se met par convention en bas a droite. Le coin gauche, lui, ne doit
        rien a personne.
      */}
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-label={a.label}
        aria-expanded={ouvert}
        title={a.label}
        className="cava-demander-bulle fixed bottom-5 left-5 z-40 flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-transform duration-300 hover:scale-105 motion-reduce:transition-none md:bottom-8 md:left-8"
        style={{
          background: 'linear-gradient(135deg,#ff5c9a,#d81f66)',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(216,31,102,0.45)',
        }}
      >
        <Icon name={ouvert ? 'search' : 'chat'} size={26} strokeWidth={1.6} />
      </button>

      {/* Le voile — seulement sur telephone, ou le panneau occupe l'ecran.
          Sur grand ecran le panneau est une carte de coin : voiler la page
          entiere pour un champ de recherche serait disproportionne. */}
      <div
        aria-hidden
        onClick={() => setOuvert(false)}
        className={`fixed inset-0 z-40 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          ouvert ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'rgba(46,45,45,0.35)' }}
      />

      <div
        ref={panneau}
        role="dialog"
        aria-modal="false"
        aria-label={a.title}
        className={`fixed z-40 flex flex-col overflow-y-auto overscroll-contain rounded-[28px] shadow-2xl ${
          ouvert
            ? 'cava-demander-ouvert visible opacity-100'
            : 'invisible translate-y-3 opacity-0 transition-[opacity,transform] duration-300 motion-reduce:transition-none'
        } inset-x-3 bottom-24 max-h-[72vh] md:inset-x-auto md:bottom-28 md:left-8 md:max-h-[min(34rem,72vh)] md:w-[27rem]`}
        // Blanc franc, et surtout PAS --cava-card : cette variable vaut #2e2d2d,
        // c'est la carte SOMBRE du site. Le panneau sortait noir sur noir.
        style={{ background: '#fff', boxShadow: '0 24px 60px rgba(46,45,45,0.28)' }}
      >
        {/*
          L'entete est un aplat de couleur, et c'est ce qui reveille le tout :
          blanc sur blanc, le panneau etait terne. Le degrade s'arrete a
          #d81f66 du cote clair — pas au rose de marque #e6296f, qui ne porte
          le blanc qu'a 4,3:1, sous le seuil de lisibilite. Ici, le texte blanc
          tient 4,9:1 au point le plus clair et 6,3:1 au plus fonce.
        */}
        <div
          className="sticky top-0 z-20 px-6 pb-5 pt-6"
          style={{ background: 'linear-gradient(135deg,#d81f66,#9c1246)', color: '#fff' }}
        >
          <div className="flex items-start justify-between gap-4">
            <h2
              className="text-[clamp(1.5rem,6vw,1.9rem)] uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontWeight: 900 }}
            >
              {a.title}
            </h2>
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label={a.close}
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] leading-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
            >
              ✕
            </button>
          </div>
          {/* La promesse est ecrite, pas sous-entendue : le visiteur doit
              savoir qu'il lit Mag et non une machine qui parle. */}
          <p className="mt-2 max-w-[46ch] text-[12.5px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {a.promise}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            chercherMaintenant(q);
          }}
          className="px-5 pb-3 pt-4"
          style={{ background: '#fff' }}
        >
          <div
            className="flex items-center gap-2.5 rounded-full px-4 py-2.5"
            style={{ border: '2px solid var(--cava-pink)', background: 'rgba(230,41,111,0.05)' }}
          >
            <span style={{ color: 'var(--cava-pink-fonce)' }}>
              <Icon name="search" size={17} />
            </span>
            <input
              ref={champ}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={a.placeholder}
              aria-label={a.title}
              className="min-w-0 flex-1 bg-transparent text-[14.5px] outline-none"
            />
            {q && (
              <button type="button" onClick={vider} aria-label={a.clear} style={{ color: 'var(--cava-muted)' }}>
                ✕
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-4 px-5 pb-6">
          {/* Rien de tape encore : on montre par ou commencer. Un champ vide
              sans exemple ne dit pas ce qu'on a le droit de demander. */}
          {!pose && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-pink-fonce)', fontWeight: 700 }}>
                {a.suggestionsTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {a.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => chercherMaintenant(s)}
                    className="rounded-full px-3.5 py-2 text-[12.5px] transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none"
                    style={{ background: 'rgba(230,41,111,0.1)', color: 'var(--cava-pink-fonce)', fontWeight: 600 }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {enAvant && <Carte fiche={enAvant.fiche} sourceLabel={a.sourceLabel} />}

          {autres.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-pink-fonce)', fontWeight: 700 }}>
                {a.alsoTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {autres.map((r) => (
                  <button
                    key={r.fiche.id}
                    type="button"
                    onClick={() => setChoisie(r.fiche.id)}
                    className="rounded-full px-3.5 py-2 text-[12.5px] transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none"
                    style={{ background: 'rgba(230,41,111,0.1)', color: 'var(--cava-pink-fonce)', fontWeight: 600 }}
                  >
                    {r.fiche.titre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* On a cherche et on n'a rien. On le dit, et on donne quelqu'un a
              qui ecrire — c'est exactement ce que fait deja AskMag ailleurs. */}
          {pose && !enAvant && (
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed p-4" style={{ borderColor: 'var(--cava-line)' }}>
              <p className="text-[14px]" style={{ fontWeight: 600 }}>
                {a.noneTitle}
              </p>
              <p className="text-[13px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                {a.noneText}
              </p>
              <a href={`mailto:${SITE.email}?subject=${sujet}`} className="cava-pill inline-flex w-fit items-center gap-2 px-4 py-2 text-[13px]">
                <Icon name="phone" size={14} /> {t.askMag.cta}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** Une reponse : le texte de Mag, ses liens, et la page d'ou il sort. */
function Carte({ fiche, sourceLabel }: { fiche: Fiche; sourceLabel: string }) {
  return (
    // Le filet rose sur le flanc gauche : il donne un bord franc a la reponse
    // et la separe des suggestions, sans ajouter une bordure complete qui
    // aurait enferme le texte.
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 pl-[18px]"
      style={{ background: 'rgba(230,41,111,0.06)', borderLeft: '4px solid var(--cava-pink)' }}
    >
      <h3 className="text-[17px] leading-tight" style={{ fontWeight: 800, color: 'var(--cava-pink-fonce)' }}>
        {fiche.titre}
      </h3>
      <div className="flex flex-col gap-2">
        {fiche.lignes.map((l, i) => (
          <p key={i} className="text-[13.5px] leading-[1.65]">
            {l}
          </p>
        ))}
      </div>
      {fiche.liens && fiche.liens.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fiche.liens.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none"
              style={{ background: 'var(--cava-ink)', color: '#fff', fontWeight: 600 }}
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
      {/* D'ou ca vient. C'est ce qui rend la reponse verifiable : on peut
          toujours aller lire la phrase dans son contexte. */}
      <a
        href={withBase(fiche.page)}
        className="inline-flex w-fit items-center gap-1 text-[12px] underline underline-offset-4"
        style={{ color: 'var(--cava-pink-fonce, var(--cava-pink))' }}
      >
        {sourceLabel} →
      </a>
    </div>
  );
}
