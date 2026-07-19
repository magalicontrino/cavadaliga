'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { SITE, withBase } from './data';
import { useI18n } from './i18n';
import { chercher, construireIndex, type Fiche, type Reponse } from './demander';

/**
 * Les couleurs des exemples — celles que Mag a choisies pour l'arbre.
 *
 * Elle voulait la boite « plus ludique, avec de la couleur ». Plutot que
 * d'inventer une palette de plus, on reprend le jaune, le turquoise et le rose
 * de l'arbre genealogique : ils sont deja les siens, et deja valides. Toutes
 * portent l'encre du site tres au-dessus du seuil de lisibilite — c'est
 * d'ailleurs pour ca qu'elle les avait retenus la-bas.
 */
const GAIES = ['#ffd452', '#5fdede', '#f06a9b', '#c8e6a0'];

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
  /** La fiche mise en avant, quand on en choisit une autre dans « Aussi ». */
  const [choisie, setChoisie] = useState<string | null>(null);
  const champ = useRef<HTMLInputElement>(null);
  const panneau = useRef<HTMLDivElement>(null);
  /** La zone qui defile : l'entete et le champ, eux, ne bougent pas. */
  const corps = useRef<HTMLDivElement>(null);

  const index = useMemo<Fiche[]>(() => construireIndex(t, lang), [t, lang]);

  /*
   * On cherche A LA FRAPPE, sans attendre qu'on valide.
   *
   * Il fallait avant appuyer sur Entree : Mag a tape « pain » et rien n'a
   * bouge en dessous. Elle avait raison — l'index est deja la, en memoire, il
   * n'y a ni reseau ni attente a justifier. Chercher a chaque lettre ne coute
   * donc rien, et la reponse se forme pendant qu'on ecrit.
   *
   * Deux lettres au minimum : en dessous, « o » ou « du » remontent la moitie
   * du site et le resultat clignote a chaque touche.
   */
  const question = q.trim();
  const resultats = useMemo<Reponse[]>(
    () => (question.length >= 2 ? chercher(question, index) : []),
    [question, index],
  );

  const enAvant = resultats.find((r) => r.fiche.id === choisie) ?? resultats[0];
  const autres = resultats.filter((r) => r.fiche.id !== enAvant?.fiche.id);

  /*
   * « Je ne trouve pas » attend qu'on ait fini d'ecrire.
   *
   * Les reponses, elles, arrivent des la premiere lettre utile. Mais l'aveu
   * non : en tapant « pain », le mot passe par « pai », qui ne correspond a
   * rien — et la boite annoncait qu'elle ne trouvait pas, alors que la main
   * etait encore sur le clavier. Elle se trompait doublement : ce n'etait pas
   * la question, et ce n'etait pas fini.
   *
   * Une demi-seconde de silence, et seulement alors elle repond qu'elle
   * ne sait pas.
   */
  const [pause, setPause] = useState(false);
  useEffect(() => {
    setPause(false);
    const t = window.setTimeout(() => setPause(true), 500);
    return () => window.clearTimeout(t);
  }, [question]);

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
    setChoisie(null);
    // Une nouvelle reponse arrive tout en haut : on y remonte, sinon elle
    // s'ecrit sous le pli et on croit qu'il ne s'est rien passe.
    requestAnimationFrame(() => corps.current?.scrollTo({ top: 0 }));
  };

  const vider = () => {
    setQ('');
    setChoisie(null);
    champ.current?.focus();
  };

  const sujet = encodeURIComponent(question ? `${t.askMag.subject} — ${question}` : t.askMag.subject);

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
        {/* Le robot — l'idee vient de Mag. Il dit « ca repond tout seul »
            mieux qu'une bulle de parole, qui promettait quelqu'un au bout. */}
        <Icon name="robot" size={27} strokeWidth={1.5} />
      </button>

      {/*
        PAS DE VOILE derriere le panneau — Mag : « le fond en fade, c'est non ».
        Il assombrissait toute la page pour un champ de recherche, alors que la
        boite se referme d'un geste. On garde une zone de sortie invisible :
        toucher a cote referme, sans que rien ne s'obscurcisse.
      */}
      {ouvert && <div aria-hidden onClick={() => setOuvert(false)} className="fixed inset-0 z-30 md:hidden" />}

      <div
        ref={panneau}
        role="dialog"
        aria-modal="false"
        aria-label={a.title}
        className={`fixed z-40 flex flex-col overflow-hidden rounded-[28px] shadow-2xl ${
          ouvert
            ? 'cava-demander-ouvert visible opacity-100'
            : 'invisible translate-y-3 opacity-0 transition-[opacity,transform] duration-300 motion-reduce:transition-none'
        } inset-x-3 bottom-24 h-[clamp(24rem,62vh,34rem)] max-h-[calc(100dvh-12rem)] md:inset-x-auto md:bottom-28 md:left-8 md:h-[clamp(24rem,58vh,34rem)] md:w-[27rem]`}
        // Blanc franc, et surtout PAS --cava-card : cette variable vaut #2e2d2d,
        // c'est la carte SOMBRE du site. Le panneau sortait noir sur noir.
        //
        // UNE HAUTEUR BORNEE DES DEUX COTES — jamais moins de 24 rem, jamais
        // plus de 34 rem, et au plus 62 % de l'ecran entre les deux.
        //
        // Le `max-h` en calc() passe avant le plancher, et c'est voulu : sur un
        // ecran de 560 px, les 24 rem faisaient remonter la boite SOUS la barre
        // du haut, qui est au-dessus d'elle (z-50 contre z-40) et lui mangeait
        // son titre. Mesure au banc : bord haut a 80 px pour une barre qui en
        // fait 88. La place disponible l'emporte donc sur la hauteur souhaitee
        // — mieux vaut une boite un peu courte qu'une boite decapitee. Sur un
        // telephone ordinaire, ce plafond ne se declenche jamais.
        //
        // Elle a d'abord epouse son contenu. C'etait juste, mais ca bougeait :
        // la boite grandissait a la premiere reponse, rapetissait quand on
        // effaçait, sautait d'une question a l'autre. Une boite qui change de
        // taille sous le doigt, on ne sait plus ou viser.
        //
        // La flaque blanche que ces bornes avaient causee la premiere fois ne
        // revient pas, parce que ce n'est plus la boite qui s'etire : c'est le
        // CONTENU qui defile dedans (voir le bloc `flex-1 overflow-y-auto` plus
        // bas). L'entete et le champ restent en place, la reponse glisse
        // dessous. Rien ne pousse plus les bords.
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
          className="flex shrink-0 items-center justify-between gap-3 px-6 py-4"
          style={{ background: 'linear-gradient(135deg,#d81f66,#9c1246)', color: '#fff' }}
        >
          {/*
            PAS DE TITRE ECRIT — Mag l'a retire. « Une question ? » nommait ce
            que la boite montre deja : un champ de recherche et des exemples.
            Le robot le dit mieux, et sans mot.
            
            Il reste dans `aria-label` sur la boite : ce qui devient evident a
            l'oeil ne l'est pas pour qui navigue au lecteur d'ecran, et une
            fenetre sans nom ne s'annonce pas.
          */}
          <span aria-hidden className="flex items-center">
            <Icon name="robot" size={40} strokeWidth={1.4} />
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label={a.close}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] leading-none"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
            >
              ✕
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // La reponse s'ecrit deja a la frappe : valider ne relance rien, ca
            // RANGE le clavier. Sur telephone il couvre la moitie de l'ecran,
            // et la reponse se lisait derriere.
            champ.current?.blur();
            requestAnimationFrame(() => corps.current?.scrollTo({ top: 0 }));
          }}
          className="shrink-0 px-6 pb-4 pt-5"
          style={{ background: '#fff' }}
        >
          <div
            className="flex items-center gap-2 rounded-full py-2.5 pl-5 pr-2"
            style={{ border: '2px solid var(--cava-pink)', background: 'rgba(230,41,111,0.05)' }}
          >
            <input
              ref={champ}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={a.placeholder}
              aria-label={a.title}
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
            />
            {q && (
              <button
                type="button"
                onClick={vider}
                aria-label={a.clear}
                className="shrink-0 px-1 text-[15px] leading-none"
                style={{ color: 'var(--cava-muted)' }}
              >
                ✕
              </button>
            )}
            {/*
              La fleche. Mag : « ce n'est pas evident, il faudrait une fleche ».
              La loupe a gauche disait « on cherche » sans dire QUE FAIRE ; un
              bouton plein a droite se touche. Il ne declenche plus la
              recherche — elle a lieu a la frappe — mais il range le clavier, ce
              qui est justement le geste qui manquait.
            */}
            <button
              type="submit"
              aria-label={a.send}
              title={a.send}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 motion-reduce:transition-none"
              style={{ background: 'var(--cava-pink)', color: '#fff' }}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h13" />
                <path d="m12.5 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </form>

        <div
          ref={corps}
          /*
           * Sans question, le contenu se CENTRE dans la hauteur libre.
           *
           * La boite a une taille fixe : les exemples se collaient en haut et
           * laissaient 135 px de blanc dessous — « pas equilibre ». Centres,
           * les memes 135 px se partagent de part et d'autre et ne se lisent
           * plus comme un oubli. Des qu'une reponse arrive, on repasse en
           * haut : une reponse se lit du debut, elle ne flotte pas.
           */
          className={`flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-6 pb-7 ${
            question ? 'justify-start' : 'justify-center'
          }`}
        >
          {/* Rien de tape encore : on montre par ou commencer. Un champ vide
              sans exemple ne dit pas ce qu'on a le droit de demander. */}
          {!question && (
            <div className="flex flex-wrap gap-2.5">
              {a.suggestions.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => chercherMaintenant(s)}
                  className="rounded-full px-4 py-2.5 text-[13px] transition-transform duration-200 hover:scale-[1.05] motion-reduce:transition-none"
                  style={{
                    background: GAIES[i % GAIES.length],
                    color: 'var(--cava-ink)',
                    fontWeight: 600,
                    // Le filet d'encre : c'est lui qui les rattache aux pastilles
                    // du site plutot que d'en faire des etiquettes de plus.
                    border: '1px solid var(--cava-ink)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {enAvant && <Carte fiche={enAvant.fiche} sourceLabel={a.sourceLabel} />}

          {autres.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--cava-pink-fonce)', fontWeight: 700 }}>
                {a.alsoTitle}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {autres.map((r) => (
                  <button
                    key={r.fiche.id}
                    type="button"
                    onClick={() => setChoisie(r.fiche.id)}
                    className="rounded-full px-4 py-2.5 text-[13px] transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none"
                    style={{ background: '#fff', color: 'var(--cava-ink)', fontWeight: 600, border: '1px solid var(--cava-ink)' }}
                  >
                    {r.fiche.titre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* On a cherche et on n'a rien. On le dit, et on donne quelqu'un a
              qui ecrire — c'est exactement ce que fait deja AskMag ailleurs. */}
          {question.length >= 3 && pause && !enAvant && (
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

/**
 * On COUPE les reponses longues.
 *
 * La check-list de depart fait dix lignes, les poubelles en font treize : la
 * boite se remplissait d'un mur de texte qu'on ne lit pas dans une bulle. On
 * en montre le debut, on pose trois points, et le lien reprend la lecture a
 * l'endroit exact — la page ET sa section.
 *
 * Deux limites plutot qu'une : trois lignes, mais aussi 260 signes. Une seule
 * ligne peut etre un paragraphe entier (la note sur les bacs du soir en fait
 * 200 a elle seule) — compter les lignes ne dit rien de ce qu'on voit.
 */
const MAX_LIGNES = 3;
const MAX_SIGNES = 260;

function couper(lignes: string[]): { visibles: string[]; coupe: boolean } {
  const visibles: string[] = [];
  let total = 0;
  for (const l of lignes) {
    if (visibles.length >= MAX_LIGNES || total >= MAX_SIGNES) return { visibles, coupe: true };
    if (total + l.length > MAX_SIGNES) {
      // On coupe au dernier espace : un mot tranche en deux se lit mal.
      const reste = MAX_SIGNES - total;
      const bout = l.slice(0, reste);
      const espace = bout.lastIndexOf(' ');
      visibles.push((espace > 40 ? bout.slice(0, espace) : bout).trimEnd());
      return { visibles, coupe: true };
    }
    visibles.push(l);
    total += l.length;
  }
  return { visibles, coupe: false };
}

/** Une reponse : le texte de Mag, ses liens, et la page d'ou il sort. */
function Carte({ fiche, sourceLabel }: { fiche: Fiche; sourceLabel: string }) {
  const { visibles, coupe } = couper(fiche.lignes);
  return (
    // Le filet rose sur le flanc gauche : il donne un bord franc a la reponse
    // et la separe des suggestions, sans ajouter une bordure complete qui
    // aurait enferme le texte.
    <div
      className="flex flex-col gap-4 rounded-2xl p-5 pl-[22px]"
      style={{ background: 'rgba(230,41,111,0.06)', borderLeft: '4px solid var(--cava-pink)' }}
    >
      <h3 className="text-[17px] leading-tight" style={{ fontWeight: 800, color: 'var(--cava-pink-fonce)' }}>
        {fiche.titre}
      </h3>
      <div className="flex flex-col gap-2">
        {visibles.map((l, i) => (
          <p key={i} className="text-[13.5px] leading-[1.75]">
            {l}
            {coupe && i === visibles.length - 1 && <span aria-hidden> …</span>}
          </p>
        ))}
      </div>
      {fiche.liens && fiche.liens.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
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
        className={`inline-flex w-fit items-center gap-1.5 underline-offset-4 ${
          coupe ? 'rounded-full px-4 py-2 text-[12.5px] no-underline' : 'text-[12px] underline'
        }`}
        style={
          coupe
            ? { background: 'var(--cava-pink-fonce)', color: '#fff', fontWeight: 600 }
            : { color: 'var(--cava-pink-fonce, var(--cava-pink))' }
        }
      >
        {sourceLabel} →
      </a>
    </div>
  );
}
