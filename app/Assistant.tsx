'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { SITE, withBase } from './data';
import { useI18n } from './i18n';
import { chercher, construireIndex, proposer, type Fiche, type Proposition, type Reponse } from './demander';

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
  /**
   * La fiche demandee par une pastille de proposition.
   *
   * Cliquer « Gaz » doit montrer Gaz, meme si taper « Gaz » aurait donne autre
   * chose : on a designe une fiche, pas lance une recherche. Toute frappe
   * l'oublie — a partir du moment ou l'on ecrit, c'est la recherche qui
   * commande a nouveau.
   */
  const [epinglee, setEpinglee] = useState<string | null>(null);
  const champ = useRef<HTMLInputElement>(null);
  const panneau = useRef<HTMLDivElement>(null);
  /** La zone de contenu. Elle ne defile plus — voir le commentaire de la
   *  coupe des reponses : Mag n'en veut pas d'ascenseur. */
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
    // Trois pistes au plus : la reponse, et deux autres. Au-dela, la rangee
    // « Aussi » passait sur deux lignes et poussait la fiche hors de la boite,
    // qui ne defile plus.
    () => (question.length >= 2 ? chercher(question, index, 3) : []),
    [question, index],
  );

  const ficheEpinglee = epinglee ? index.find((f) => f.id === epinglee) : undefined;
  const enAvant = ficheEpinglee
    ? { fiche: ficheEpinglee, score: 0 }
    : (resultats.find((r) => r.fiche.id === choisie) ?? resultats[0]);
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
  /*
   * De combien le clavier mange l'ecran, en pixels.
   *
   * Le champ est passe EN BAS, comme dans toutes les messageries — c'est la
   * que le pouce le trouve. Mais c'est aussi exactement la que le clavier se
   * leve : une boite `fixed` ne recule pas devant lui, parce que le viewport
   * de mise en page, lui, ne retrecit pas. Le champ se serait retrouve
   * dessous, invisible au moment precis ou l'on tape.
   *
   * C'EST DESORMAIS UN REPLI. Depuis qu'on declare `interactive-widget:
   * resizes-content` (voir layout.tsx), la page retrecit d'elle-meme quand le
   * clavier monte, et `dvh` + `fixed bottom` suffisent. `window.innerHeight`
   * retrecit alors AVEC elle, donc `innerHeight - vv.height` tombe a ~0 : le
   * calcul ci-dessous rend 0 et ne fait rien. Sur les vieux navigateurs (iOS
   * 15 et avant) qui ignorent le mot-clef, la page ne bouge pas, la difference
   * vaut la hauteur du clavier, et la boite remonte a la main.
   *
   * `visualViewport` reste le seul a savoir ce qui est vu. Le seuil de 120 px
   * evite de confondre le clavier avec la barre d'adresse qui se retracte au
   * defilement — elle fait quelques dizaines de pixels, un clavier des
   * centaines.
   */
  const [clavier, setClavier] = useState(0);
  /**
   * Un simple compteur qui s'incremente a CHAQUE changement de taille visible.
   *
   * Il ne sert qu'a re-declencher le resserrement du contenu (voir plus bas).
   * Sans lui, le contenu ne se remesurait qu'au changement de question ou de
   * `clavier` — or sur navigateur moderne, quand le clavier monte, c'est la
   * PAGE qui retrecit (interactive-widget), `clavier` reste a 0, et la boite
   * plus courte gardait un contenu trop grand : coupe par le bas. Un coup
   * d'oeil de plus a chaque resize regle ca.
   */
  const [taille, setTaille] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const suivre = () => {
      const cache = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setClavier(cache > 120 ? Math.round(cache) : 0);
      setTaille((n) => n + 1);
    };
    suivre();
    vv.addEventListener('resize', suivre);
    vv.addEventListener('scroll', suivre);
    return () => {
      vv.removeEventListener('resize', suivre);
      vv.removeEventListener('scroll', suivre);
    };
  }, []);

  /*
   * Le contenu SE SERRE jusqu'a tenir. Mag ne veut pas d'ascenseur dans la
   * boite : « les points suffisent, et renvoient au bon endroit ».
   *
   * Couper a l'aveugle ne pouvait pas marcher. J'ai commence par reduire les
   * reponses a deux lignes — et mesure ensuite que neuf questions sur seize
   * debordaient encore, la pire de 146 px. C'est normal : la place disponible
   * depend de la taille de l'ecran, et le cout d'une fiche depend de ce
   * qu'elle porte (un lieu a deux boutons de lien, une check-list n'en a
   * aucun). Aucune valeur fixe ne pouvait convenir aux deux.
   *
   * La boite mesure donc ce qui depasse et se serre d'un cran, jusqu'a quatre :
   *   0 — deux lignes, les autres pistes, les liens
   *   1 — une seule ligne
   *   2 — sans les autres pistes
   *   3 — sans les liens : le debut de la reponse et le bouton vers la page
   *   4 — sans le texte du tout : le titre de la fiche et le bouton. Sur un
   *       ecran de 600 px il ne reste que 211 px de contenu, et meme le cran 3
   *       depassait de 16 px. Un titre et un chemin, c'est peu, mais c'est
   *       juste — et ca vaut mieux qu'une reponse coupee par le bord.
   *
   * En `useLayoutEffect`, donc avant que l'ecran ne soit peint : on ne voit
   * jamais l'etat trop grand, seulement le bon.
   */
  const [serrer, setSerrer] = useState(0);
  /**
   * Vrai quand MEME LE CRAN LE PLUS SERRE deborde encore.
   *
   * Mag ne veut pas d'ascenseur, et il n'y en a pas — sauf ici. Sur un tres
   * petit ecran clavier leve, il ne reste parfois que 127 px de contenu, et le
   * cran 4 (titre + bouton) en demande 180. Ce qui se fait couper, alors,
   * c'est le BOUTON qui mene a la page : la seule porte de sortie de la
   * reponse. Entre clipper cette porte et laisser glisser le contenu, on
   * laisse glisser. Ca n'arrive que la, et c'est mieux que de perdre le lien.
   */
  const [deborde, setDeborde] = useState(false);
  /** La question a laquelle le cran courant se rapporte. */
  const serrePour = useRef('');
  /*
   * UN SEUL effet, sans liste de dependances, et c'est deliberе.
   *
   * Il y en avait deux : l'un remettait le cran a zero quand la question
   * changeait, l'autre mesurait et resserrait. Ils se marchaient dessus. Dans
   * le meme rendu, la remise a zero n'avait pas encore pris effet quand la
   * mesure lisait le DOM : celle-ci jugeait donc l'ANCIENNE mise en page, la
   * declarait bonne, et on restait coince trop large. Le defaut ne se voyait
   * qu'en ENCHAINANT deux questions — en repartant d'un champ vide, tout allait
   * bien, ce qui l'a rendu long a trouver.
   *
   * Ici, remise a zero et mesure se suivent dans le meme fil : on ne mesure
   * jamais une mise en page qui ne correspond pas au cran affiche.
   */
  useLayoutEffect(() => {
    const c = corps.current;
    if (!c) return;
    const cle = `${question}|${choisie ?? ''}|${epinglee ?? ''}|${clavier}|${taille}`;
    if (serrePour.current !== cle) {
      serrePour.current = cle;
      /*
       * On ne sort QUE s'il y a vraiment eu remise a zero.
       *
       * On sortait dans tous les cas — et quand le cran valait deja zero,
       * setSerrer(0) ne declenchait aucun rendu : la mesure ne se faisait
       * donc qu'au reveil suivant, cinq cents millisecondes plus tard, le
       * temps que « pause » bascule. Mesure au banc : dix pixels debordaient
       * pendant tout ce temps, puis rentraient dans l'ordre. Ici, on
       * enchaine dans la meme passe.
       */
      if (deborde) setDeborde(false);
      if (serrer !== 0) {
        setSerrer(0);
        return;
      }
    }
    const trop = c.scrollHeight > c.clientHeight + 1;
    if (serrer < 4 && trop) {
      setSerrer((n) => n + 1);
      return;
    }
    // Au bout des crans : on constate, et on laisse glisser si besoin.
    if (deborde !== trop) setDeborde(trop);
  });

  const [pause, setPause] = useState(false);
  useEffect(() => {
    setPause(false);
    const t = window.setTimeout(() => setPause(true), 500);
    return () => window.clearTimeout(t);
  }, [question]);

  const bulle = useRef<HTMLButtonElement>(null);

  /*
   * Ouvert : le doigt va au champ, Echap referme, et un clic DEHORS aussi.
   *
   * Sans le focus, il faut viser une deuxieme fois pour taper. Sans Echap, on
   * est piege sur un clavier. Et sans le clic dehors, la boite ne se fermait
   * qu'au telephone : une zone de sortie plein ecran y suffit, mais sur grand
   * ecran la boite est un petit panneau de coin — un voile plein ecran
   * bloquerait toute la page derriere elle. On ecoute donc le clic partout, et
   * on ne ferme que s'il tombe hors de la boite ET hors de la bulle (sinon le
   * clic qui OUVRE refermerait aussitot).
   */
  useEffect(() => {
    if (!ouvert) return;
    champ.current?.focus();
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false);
    };
    const auClic = (e: PointerEvent) => {
      const c = e.target as Node;
      if (!panneau.current?.contains(c) && !bulle.current?.contains(c)) setOuvert(false);
    };
    window.addEventListener('keydown', auClavier);
    // `pointerdown`, pas `click` : ferme des l'appui, avant qu'un clic sur un
    // lien de la page ne parte. Differe d'un cran pour ne pas attraper le
    // pointerdown qui vient d'ouvrir la boite.
    const t = window.setTimeout(() => document.addEventListener('pointerdown', auClic), 0);
    return () => {
      window.removeEventListener('keydown', auClavier);
      window.clearTimeout(t);
      document.removeEventListener('pointerdown', auClic);
    };
  }, [ouvert]);

  const chercherMaintenant = (texte: string, id?: string) => {
    setQ(texte);
    setChoisie(null);
    setEpinglee(id || null);
    // Une nouvelle reponse arrive tout en haut : on y remonte, sinon elle
    // s'ecrit sous le pli et on croit qu'il ne s'est rien passe.
    requestAnimationFrame(() => corps.current?.scrollTo({ top: 0 }));
  };

  const vider = () => {
    setQ('');
    setChoisie(null);
    setEpinglee(null);
    // On remet aussi la MISE EN PAGE a zero : sans ca, la boite pouvait rester
    // resserree — entete tasse, robot maigre — apres une longue reponse.
    setSerrer(0);
    setDeborde(false);
    corps.current?.scrollTo({ top: 0 });
    champ.current?.focus();
  };

  /**
   * Les pastilles : les exemples de Mag quand le champ est vide, et sinon des
   * propositions tirees de l'index, qui suivent la frappe lettre par lettre.
   */
  /** Ce que l'index sait proposer sur ce qu'on tape. Vide = aucune piste. */
  const pistes = useMemo(() => (question ? proposer(question, index) : []), [question, index]);

  /*
   * IL Y A TOUJOURS DES PASTILLES — Mag : « fais-le pour chaque frappe, pour
   * "zt" aussi par exemple ».
   *
   * Quand l'index ne sait rien proposer, on remet ses huit exemples plutot que
   * de laisser le vide. Une lettre tapee de travers n'est pas une impasse :
   * c'est le moment ou l'on a le plus besoin qu'on vous montre par ou aller.
   */
  const propositions = useMemo<Proposition[]>(
    // Les exemples de Mag SEULEMENT quand le champ est vide. Des qu'on tape,
    // les pastilles suivent la frappe — et si rien ne commence par ces
    // lettres, on le dit. Mag : « meme avec une lettre ca devrait ecrire ca,
    // mais on va plutot proposer des pastilles selon le debut des resultats
    // possibles ». Remettre les huit exemples devant une frappe qui ne donne
    // rien, c'etait faire croire qu'il ne s'etait rien passe.
    () => (question ? pistes : a.suggestions.map((label) => ({ id: '', label }))),
    [question, pistes, a.suggestions],
  );

  /*
   * Trois etats, et un seul a la fois :
   *   une reponse                          → la fiche, et les autres pistes
   *   pas de reponse, mais des pistes       → les propositions
   *   ni l'une ni les autres, apres un temps → l'aveu
   *
   * L'aveu ne sort donc QUE si rien du tout ne correspond, meme de loin. Tant
   * qu'une pastille peut etre proposee, elle vaut mieux que « je ne trouve
   * pas » : elle donne une porte, la ou l'aveu ferme.
   * L'aveu remplace les propositions au lieu de s'ajouter : la boite ne defile
   * plus, les deux ensemble ne tiendraient pas.
   */
  /*
   * L'aveu sort des la premiere lettre, si aucune pastille ne peut sortir.
   *
   * La regle etait plus prudente : deux mots, ou six lettres, pour ne pas
   * decourager une frappe en cours. Mag l'a corrigee, et elle a raison — les
   * pastilles suivent maintenant le DEBUT de ce qu'on tape, donc tant qu'une
   * seule fiche du site commence par ces lettres, elle apparait. S'il n'y en a
   * aucune, il n'y en aura pas davantage a la lettre suivante : autant le dire
   * tout de suite plutot que de laisser croire qu'on cherche encore.
   */
  const montrerRefus = pause && !enAvant && !pistes.length && question.length > 0;

  const sujet = encodeURIComponent(question ? `${t.askMag.subject} — ${question}` : t.askMag.subject);

  return (
    <>
      {/*
        La bulle. z-[70] : AU-DESSUS de la barre du haut (z-50) et du menu
        plein ecran (z-60) — Mag : « le chat doit etre a un niveau de couche
        superieur que le menu ». Elle l'a vu sur sa capture, la rangee de
        pictos passait par-dessus l'entete de la boite.

        A DROITE, ou Mag la veut — et c'est aussi la que tout le monde a appris
        a la chercher. Elle y avait ete refusee une premiere fois parce qu'elle
        recouvrait le « © OpenStreetMap » de la carte, mention que la licence
        des donnees veut lisible. C'est l'attribution qui a bouge : elle est
        passee en bas a GAUCHE de la carte, ou rien ne la gene. Deplacer une
        mention coute moins que deplacer le bouton principal du site.

        ELLE S'EFFACE QUAND LA BOITE EST OUVERTE. Mag : « ca nous fait perdre
        de la place de laisser visible le bouton du chat ». Elle ne sert plus a
        rien a ce moment-la — le ✕ ferme, et toucher a cote aussi — et elle
        occupait justement le coin ou la place est la plus rare, clavier leve.
        Effacee, la boite descend de 80 px et gagne autant de hauteur utile.
      */}
      <button
        ref={bulle}
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-label={a.label}
        aria-expanded={ouvert}
        title={a.label}
        className={`cava-demander-bulle fixed bottom-5 right-5 z-[70] flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-[transform,opacity] duration-300 motion-reduce:transition-none md:bottom-8 md:right-8 ${
          ouvert ? 'pointer-events-none scale-75 opacity-0' : 'hover:scale-105'
        }`}
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
        Toucher a cote referme quand meme, mais par l'ecouteur `pointerdown`
        ci-dessus, pas par un voile : rien ne s'obscurcit, et ca marche aussi
        sur grand ecran, ou un voile plein ecran aurait bloque la page.
      */}

      <div
        ref={panneau}
        role="dialog"
        aria-modal="false"
        aria-label={a.title}
        className={`fixed z-[70] flex flex-col overflow-hidden rounded-[28px] shadow-2xl ${
          ouvert
            ? 'cava-demander-ouvert visible opacity-100'
            : 'invisible translate-y-3 opacity-0 transition-[opacity,transform] duration-300 motion-reduce:transition-none'
        } inset-x-3 bottom-4 h-[clamp(24rem,62dvh,34rem)] max-h-[calc(100dvh-4rem)] md:inset-x-auto md:bottom-6 md:right-8 md:h-[clamp(24rem,58dvh,34rem)] md:w-[27rem]`}
        // Blanc franc, et surtout PAS --cava-card : cette variable vaut #2e2d2d,
        // c'est la carte SOMBRE du site. Le panneau sortait noir sur noir.
        //
        // UNE HAUTEUR BORNEE DES DEUX COTES — jamais moins de 24 rem, jamais
        // plus de 34 rem, et au plus 62 % de l'ecran entre les deux.
        //
        // Le `max-h` en calc() passe avant le plancher : la place disponible
        // l'emporte sur la hauteur souhaitee. Il ne reserve plus que 4 rem —
        // il en gardait 7 pour passer SOUS la barre du haut, qui la decapitait.
        // Depuis que la boite est au-dessus d'elle (z-[70]), cette reserve n'a
        // plus lieu d'etre : 48 px rendus, la ou ils comptent le plus.
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
        style={{
          background: '#fff',
          boxShadow: '0 24px 60px rgba(46,45,45,0.28)',
          // REPLI pour les vieux navigateurs qui n'ont pas `interactive-widget`
          // (iOS 15 et anterieurs). Sur iOS 16+/Chrome, la page retrecit deja
          // toute seule : `clavier` y vaut 0 (voir l'effet plus haut), et cette
          // ligne ne fait rien. Sur les anciens, elle remonte la boite au-dessus
          // du clavier. Les deux ne se cumulent donc jamais.
          ...(clavier ? { bottom: clavier + 16, maxHeight: `calc(100dvh - ${clavier + 64}px)` } : null),
        }}
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
          {/* Le decor cede avant le contenu : quand la boite est a l'etroit
              (clavier leve sur un petit ecran), l'entete se resserre et le
              robot maigrit. Ce sont des pixels qui ne portent aucune reponse. */}
          <span aria-hidden className="flex items-center">
            <Icon name="robot" size={serrer >= 2 ? 28 : 40} strokeWidth={1.4} />
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
           *
           * Le centrage suit CE QUI EST AFFICHE, pas le champ de saisie. Il
           * suivait le champ : les memes pastilles etaient centrees a vide et
           * collees en haut des la premiere lettre — elles sautaient sous le
           * doigt alors que rien d'autre n'avait change. Tant que ce sont les
           * propositions qu'on voit, elles restent au milieu.
           */
          // `pt-6` : le corps n'avait AUCUNE marge haute. Les exemples, centres,
          // ne le montraient pas — mais des qu'une reponse arrivait, elle se
          // collait sous l'aplat rose de l'entete, et l'aveu « je ne trouve
          // pas » y touchait aussi.
          data-serrer={serrer}
          className={`flex flex-1 flex-col justify-start gap-4 px-6 ${
            serrer >= 2 ? 'pb-4 pt-4' : 'pb-7 pt-6'
          } ${deborde ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'}`}
        >
          {/* Rien de tape encore : on montre par ou commencer. Un champ vide
              sans exemple ne dit pas ce qu'on a le droit de demander. */}
          {/*
            LES PROPOSITIONS RESTENT PENDANT LA FRAPPE.
            
            Elles disparaissaient des la premiere lettre : entre « u » et
            « un », la boite etait vide — on tapait dans le noir. Elles se
            montrent donc tant qu'aucune reponse n'est trouvee, et se
            RESSERRENT sur ce qu'on ecrit : taper « p » ne laisse que
            « Poubelles ce soir ? », « Une pizza ? » et « Du pain ? ».
            
            Si plus rien ne colle, on remet la liste entiere plutot que rien :
            une piste vaut mieux qu'un vide, meme si ce n'est pas celle qu'on
            cherchait.
          */}
          {!enAvant && !montrerRefus && (
            /*
             * `my-auto` — et surtout PAS `justify-center` sur le conteneur.
             *
             * Mag l'a vu sur son telephone, clavier leve : les pastilles
             * etaient coupees EN HAUT ET EN BAS. C'est la signature d'un
             * contenu centre trop grand pour sa boite — il deborde des deux
             * cotes a la fois. Pire, ca rendait ma mesure aveugle :
             * `scrollHeight` n'attrape pas un debordement symetrique, donc le
             * resserrement ne se declenchait jamais.
             *
             * Une marge automatique, elle, absorbe la place libre quand il y en
             * a — les pastilles restent centrees — et tombe a zero quand il n'y
             * en a plus. Le contenu repart alors du haut et ne deborde que par
             * le bas, la ou la mesure le voit et peut agir.
             */
            <div className="my-auto flex flex-wrap gap-2.5">
              {/*
                MOINS DE PASTILLES quand la place manque. Les crans ne
                touchaient que la fiche de reponse : les huit pastilles
                restaient, et quatre a six se faisaient couper clavier leve.
                Elles suivent maintenant le meme resserrement — jamais moins de
                deux, pour qu'il reste toujours quelque chose a toucher.
              */}
              {propositions.slice(0, [8, 6, 4, 3, 2][serrer] ?? 2).map((s, i) => {
                // Deux sortes de pastilles : celles qui ouvrent une fiche ici
                // meme, et celles qui menent au bon rayon de « Nos adresses ».
                // Les secondes portent une fleche — on quitte la boite.
                const style = {
                  background: GAIES[i % GAIES.length],
                  color: 'var(--cava-ink)',
                  fontWeight: 600,
                  // Le filet d'encre : c'est lui qui les rattache aux pastilles
                  // du site plutot que d'en faire des etiquettes de plus.
                  border: '1px solid var(--cava-ink)',
                } as const;
                const classe =
                  'rounded-full px-4 py-2.5 text-[13px] transition-transform duration-200 hover:scale-[1.05] motion-reduce:transition-none';
                return s.href ? (
                  <a key={s.href} href={withBase(s.href)} className={classe} style={style}>
                    {s.label} →
                  </a>
                ) : (
                  <button
                    key={s.id || s.label}
                    type="button"
                    onClick={() => chercherMaintenant(s.label, s.id)}
                    className={classe}
                    style={style}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}

          {enAvant && (
            <Carte
              fiche={enAvant.fiche}
              sourceLabel={a.sourceLabel}
              maxLignes={serrer >= 4 ? 0 : serrer >= 1 ? 1 : 2}
              maxSignes={SIGNES_PAR_CRAN[Math.min(serrer, SIGNES_PAR_CRAN.length - 1)]}
              avecLiens={serrer < 3}
            />
          )}

          {autres.length > 0 && serrer < 2 && (
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
          {montrerRefus && (
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed p-4" style={{ borderColor: 'var(--cava-line)' }}>
              <p className="text-[14px]" style={{ fontWeight: 600 }}>
                {a.noneTitle}
              </p>
              {/* L'explication tombe aussi quand la place manque : sur un
                  petit ecran, elle seule faisait deborder l'aveu. Le titre et
                  le bouton disent l'essentiel — je ne trouve pas, ecrivez-lui. */}
              {serrer < 2 && (
                <p className="text-[13px] leading-[1.6]" style={{ color: 'var(--cava-muted)' }}>
                  {a.noneText}
                </p>
              )}
              <a href={`mailto:${SITE.email}?subject=${sujet}`} className="cava-pill inline-flex w-fit items-center gap-2 px-4 py-2 text-[13px]">
                <Icon name="phone" size={14} /> {t.askMag.cta}
              </a>
            </div>
          )}
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
          autoComplete="off"
          className={`shrink-0 px-6 ${serrer >= 2 ? 'pb-3 pt-3' : 'pb-5 pt-4'}`}
          style={{ background: '#fff', borderTop: '1px solid var(--cava-line)' }}
        >
          <div
            className="flex items-center gap-2 rounded-full py-2.5 pl-5 pr-2"
            style={{ border: '2px solid var(--cava-pink)', background: 'rgba(230,41,111,0.05)' }}
          >
            {/*
              CE N'EST PAS UN CHAMP DE MOT DE PASSE, et il faut le crier.

              Les gestionnaires de mots de passe devinent au flair : un champ
              texte, seul dans un formulaire, dont l'invite contient « password
              du wifi »… et ils proposent de generer un mot de passe par-dessus
              la boite. Mag l'a vu en italien, ou l'invite commence justement
              par « La password del wifi ».

              `autocomplete="off"` seul ne suffit pas — ils l'ignorent souvent.
              On ajoute donc les marqueurs propres a chacun (1Password,
              LastPass, Dashlane), et `type="search"`, qui est de toute façon
              ce que ce champ EST.
            */}
            <input
              ref={champ}
              /*
               * `text`, et PAS `search` — bien que ce champ en soit un.
               *
               * `type="search"` fait apparaitre la croix NATIVE de Chrome, a
               * cote de la notre. Deux croix, dont une qui vide l'affichage
               * sans prevenir React : le champ etant controle, React
               * reaffichait aussitot l'ancienne valeur, et le texte semblait
               * revenir tout seul. C'est ce que Mag a vu — « quand je retire
               * ce que j'ai ecrit, ca ne revient pas a 0 ».
               *
               * On peut masquer cette croix en CSS, mais je n'ai pas su le
               * VERIFIER depuis mon banc, qui ne lit pas ces pseudo-elements.
               * Supprimer la cause vaut mieux que masquer un symptome qu'on ne
               * sait pas mesurer : sans `type="search"`, la croix n'existe pas.
               *
               * Les gestionnaires de mots de passe restent tenus a distance
               * par les attributs ci-dessous, qui sont de toute façon le vrai
               * mecanisme — `type` n'y a jamais ete pour grand-chose.
               */
              type="text"
              inputMode="search"
              name="demander"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setEpinglee(null);
              }}
              placeholder={a.placeholder}
              aria-label={a.title}
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none [&::-webkit-search-cancel-button]:appearance-none"
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
 * Deux limites plutot qu'une : deux lignes, mais aussi 170 signes. Une seule
 * ligne peut etre un paragraphe entier (la note sur les bacs du soir en fait
 * 200 a elle seule) — compter les lignes ne dit rien de ce qu'on voit.
 *
 * Ces valeurs ont ete resserrees quand Mag a demande qu'il n'y ait PLUS
 * D'ASCENSEUR dans la boite : « les points suffisent, et renvoient au bon
 * endroit ». Une reponse doit donc tenir entiere dans la place disponible —
 * elles sont calees sur la plus petite boite, pas sur la plus grande.
 */
/**
 * Combien de SIGNES on garde a chaque cran, et pas seulement combien de lignes.
 *
 * Compter les lignes du tableau ne suffisait pas : une « ligne » de 170 signes
 * se replie en cinq lignes a l'ecran dans une boite etroite. Passer de deux
 * entrees a une ne faisait donc presque rien gagner en hauteur, et la boite
 * debordait toujours. C'est le nombre de signes qui commande la hauteur reelle.
 */
const SIGNES_PAR_CRAN = [170, 110, 80, 60, 0];

function couper(lignes: string[], maxLignes: number, maxSignes: number): { visibles: string[]; coupe: boolean } {
  const visibles: string[] = [];
  let total = 0;
  for (const l of lignes) {
    if (visibles.length >= maxLignes || total >= maxSignes) return { visibles, coupe: true };
    if (total + l.length > maxSignes) {
      // On coupe au dernier espace : un mot tranche en deux se lit mal.
      const reste = maxSignes - total;
      const bout = l.slice(0, reste);
      const espace = bout.lastIndexOf(' ');
      const morceau = (espace > 25 ? bout.slice(0, espace) : bout).trimEnd();
      /*
       * Un morceau vide ne devient PAS une ligne.
       *
       * Quand le budget etait deja epuise par la ligne precedente, on poussait
       * une chaine vide — et les trois points s'affichaient seuls sur leur
       * ligne, sous « Cava d'Aliga · Randonnee · Plage & loisirs ». Mag l'a vu.
       * Sans cette ligne fantome, les points se collent a la fin du texte
       * precedent, ce qui est leur place.
       */
      if (morceau) visibles.push(morceau);
      return { visibles, coupe: true };
    }
    visibles.push(l);
    total += l.length;
  }
  return { visibles, coupe: false };
}

/** Une reponse : le texte de Mag, ses liens, et la page d'ou il sort. */
function Carte({
  fiche,
  sourceLabel,
  maxLignes,
  maxSignes,
  avecLiens,
}: {
  fiche: Fiche;
  sourceLabel: string;
  maxLignes: number;
  maxSignes: number;
  avecLiens: boolean;
}) {
  const { visibles, coupe } = couper(fiche.lignes, maxLignes, maxSignes);
  // Coupee d'une façon ou d'une autre, la fiche doit inviter a lire la suite.
  const incomplet = coupe || !avecLiens || visibles.length < fiche.lignes.length;
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
      {avecLiens && fiche.liens && fiche.liens.length > 0 && (
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
          incomplet ? 'rounded-full px-4 py-2 text-[12.5px] no-underline' : 'text-[12px] underline'
        }`}
        style={
          incomplet
            ? { background: 'var(--cava-pink-fonce)', color: '#fff', fontWeight: 600 }
            : { color: 'var(--cava-pink-fonce, var(--cava-pink))' }
        }
      >
        {sourceLabel} →
      </a>
    </div>
  );
}
