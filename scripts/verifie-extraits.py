# -*- coding: utf-8 -*-
"""
Verifie la condition EXACTE qui decide si le quiz trouve un extrait, pour les
themes des pages pratiques.

Le piege : dans app/i18n.tsx, chaque cle apparait QUATRE fois — une pour la
declaration de type, puis une par langue. Chercher « la premiere » tombe sur le
type, qui ne contient aucun texte : tout ressortait alors comme muet.
"""
import io, re, unicodedata

def nettoie(x):
    x = unicodedata.normalize('NFD', x.lower())
    return ''.join(c for c in x if unicodedata.category(c) != 'Mn')

src = io.open('app/i18n.tsx', encoding='utf-8').read()
lignes = src.split('\n')

bornes = []
for m in ["title: 'Vous connaissez la région ?'", "title: 'Conoscete la regione?'", "title: 'How well do you know the region?'"]:
    bornes.append(next(i for i, l in enumerate(lignes) if m in l))
bornes.append(len(lignes))

def blocs_de(cle):
    """
    Tous les litteraux `cle: {...}` OU `cle: [...]` du fichier, dans l'ordre.

    Les deux formes sont necessaires : les pages sont des objets (`cleanPage: {`)
    mais « Les lieux » est un tableau (`regionPlaces: [`). Ne gerer que l'objet
    laissait cinq questions sur Punta Corvo hors du controle — sans que rien ne
    le signale, puisqu'une cle absente ne leve pas d'erreur.
    """
    out, depuis = [], 0
    while True:
        cands = [src.find(cle + ': ' + o, depuis) for o in ('{', '[')]
        cands = [c for c in cands if c >= 0]
        if not cands:
            return out
        j = min(cands)
        ouvrant = j + len(cle) + 2
        prof = 0
        for i in range(ouvrant, len(src)):
            if src[i] in '{[': prof += 1
            elif src[i] in '}]':
                prof -= 1
                if prof == 0:
                    out.append(src[j:i + 1]); depuis = i + 1; break
        else:
            return out

SOURCES = {
    'arrivee': ['arrivee'], 'depart': ['depart'], 'parking': ['parkingPage'],
    'argent': ['cashPage'], 'bestioles': ['cleanPage'], 'voyage': ['prepare'],
    'dechets': ['wastePage'],
    'sports': ['sportsPage'],
    'coutumes': ['tastePage'],
    # Le recit de Salva : un tableau de paragraphes, pas un objet.
    'recit': ['storyText'],
    # « L'italien » : voir ITALIEN plus bas. Sa source n'est pas dans i18n.
    'italien': [],
    'specialites': ['specialtiesPage'],
    'alcools': ['drinksPage'],
    'cafe': ['coffeePage'],
    'etna': ['etnaPage'],
    'arabe': ['arabPage'],
    'genes': ['genesPage'],
    'histoire': ['historyPage'],
    'faune': ['faunaPage'],
    'livres': ['booksPage'],
    # « Les lieux » : un tableau, pas un objet — voir blocs_de().
    'lieux': ['placesIntro', 'regionPlaces', 'unescoNote'],
    'pastasciutta': ['pastaPage'],
    'valguarnera': ['valguarneraPage'],
    'symboles': ['symbolsPage'],
    'legendes': ['legendsPage'],
    'scopa': ['scopaPage'],
    # « L'arbre » : voir ARBRE plus bas. Sa source n'est pas dans i18n.
    'arbre': [],
}

# ─────────────────────────────────────────────────────────────────────────
# L'ARBRE ETAIT LE SEUL THEME HORS CONTROLE, et je m'en suis apercu en le
# cassant presque.
#
# En renommant « Flore Wasson » en « Flore Marie Wasson » dans l'arbre, j'ai
# rendu caduque la reponse de deux questions du quiz — et le test a repondu
# « 0 sans extrait », parce qu'il ne regardait que les pages pratiques. Le
# controle disait vrai sur ce qu'il couvrait, et rien sur le reste.
#
# La difficulte est que la source du theme `arbre` n'est PAS dans i18n.tsx :
# les prenoms et les noms sont des donnees, ecrites en clair dans
# FamilyTree.tsx (« Augustin Viseux & Flore Marie Wasson »).
#
# ON NE PREND QUE LES `name:` ET LES `subtitle:`, ET LA RAISON EST UNE ERREUR
# QUE J'AI FAITE ICI MEME. Ma premiere version prenait le fichier ENTIER, en
# me disant qu'un controle trop large valait mieux que rien. Verification :
# j'ai fausse la date de mort d'Augustin dans les donnees, de 1899 a 1897 — le
# test n'a rien vu. Le commentaire que je venais d'ecrire trois lignes plus
# haut disait « Augustin (1853-1899) », et le test y trouvait son compte. Il
# se validait sur ma propre prose au lieu de valider la page.
#
# Un controle qui ne peut pas echouer ne prouve rien. On ne garde donc que ce
# qui est REELLEMENT AFFICHE : les libelles des cartes de l'arbre.
#
# Il n'est pas traduit non plus : les noms de famille s'ecrivent pareil dans
# les trois langues. La meme source sert donc aux trois passes.
# ─────────────────────────────────────────────────────────────────────────
_ft = io.open('app/FamilyTree.tsx', encoding='utf-8').read()
# ─────────────────────────────────────────────────────────────────────────
# LE COURS D'ITALIEN ETAIT LE PLUS GROS TROU DU CONTROLE : 171 questions, soit
# plus du quart du quiz, sans aucune verification. Comme l'arbre, sa source
# n'est pas dans i18n — les phrases, les prononciations et les notes vivent
# dans italienData.ts.
#
# LES COMMENTAIRES SONT RETIRES AVANT LECTURE, et c'est la leçon deja payee sur
# l'arbre : un controle qui lit les commentaires finit par se valider sur la
# prose du developpeur au lieu de la page. On enleve donc /* */ et // avant
# d'extraire quoi que ce soit.
#
# Le fichier n'est pas traduit par langue au sens de i18n : chaque entree porte
# ses trois versions cote a cote. La meme source sert donc aux trois passes.
# ─────────────────────────────────────────────────────────────────────────
_it_src = io.open('app/italienData.ts', encoding='utf-8').read()
_it_src = re.sub(r'/\*.*?\*/', ' ', _it_src, flags=re.S)
_it_src = re.sub(r'^\s*//.*$', ' ', _it_src, flags=re.M)
ITALIEN = nettoie(' '.join(re.findall(r"'((?:[^'\\]|\\.)*)'", _it_src)))

ARBRE = nettoie(' '.join(
    re.findall(r"\b(?:name|subtitle): '((?:[^'\\]|\\.)*)'", _ft)
    + re.findall(r"\bsubtitle: `([^`]*)`", _ft)
))
# Pour chaque cle : [type, fr, it, en] -> on garde les trois derniers.
TEXTES = {}
for cles in SOURCES.values():
    for c in cles:
        b = blocs_de(c)
        if len(b) < 3:
            # Une simple chaine (`placesIntro: '...'`) n'a ni { ni [ : on la
            # prend telle quelle, ses trois versions dans l'ordre du fichier.
            import re as _re
            b = _re.findall(r"\b%s:\s*'((?:[^'\\]|\\.)*)'" % c, src)
        TEXTES[c] = b[-3:] if len(b) >= 3 else b

total = 0
total_faibles = 0
for k, langue in enumerate(('fr', 'it', 'en')):
    zone = '\n'.join(lignes[bornes[k]:bornes[k + 1]])
    qs = re.findall(r"\{ q: '((?:[^'\\]|\\.)*)', choix: \[([^\]]+)\], bonne: (\d+), ancre: '([a-z]+)'", zone)
    muettes, faibles = [], []
    concernees = 0
    for q, choix, bonne, ancre in qs:
        if ancre not in SOURCES:
            continue
        concernees += 1
        if ancre == 'arbre':
            texte = ARBRE
        elif ancre == 'italien':
            texte = ITALIEN
        else:
            texte = nettoie(' '.join(TEXTES[c][k] for c in SOURCES[ancre]))
        opts = re.findall(r"'((?:[^'\\]|\\.)*)'", choix)
        rep = opts[int(bonne)].replace("\\'", "'")
        mots = [w for w in re.split(r"[^a-z0-9‘’']+", nettoie(rep)) if w]
        cles = [w for w in mots if len(w) >= 4 or w.isdigit()] or [w for w in mots if len(w) >= 2]
        if not any(c in texte for c in cles):
            muettes.append((ancre, q[:52], rep[:45]))
        else:
            # ─────────────────────────────────────────────────────────────
            # LA CLE PRINCIPALE — un second controle, plus severe, et il est
            # ne d'un faux positif que j'ai failli expedier.
            #
            # En retirant du site le paragraphe qui nommait la sortie
            # « Ispica-Pozzallo », j'ai laisse la question du quiz qui la
            # demande. Le controle a repondu « 0 sans extrait » : la reponse
            # etait « Ispica-Pozzallo, puis la route de la côte », et « route »
            # comme « cote » se trouvent encore vingt fois dans la page. Il
            # validait sur les mots creux de la reponse.
            #
            # Un extrait tire de « la route de la cote » pour une question sur
            # la SORTIE d'autoroute n'est pas un extrait, c'est une phrase prise
            # au hasard qui contient le meme mot.
            #
            # ON NE CONTROLE QUE LES NOMS PROPRES ET LES NOMBRES, et le
            # premier essai explique pourquoi. J'avais exige le mot LE PLUS
            # LONG de la reponse : 46 alertes, presque toutes legitimes —
            # « refrigerant » quand la page dit « refroidir », « grandmother »
            # quand elle dit « nonna ». Une reponse est une reformulation, pas
            # une citation. Un controle qui crie 46 fois pour rien, on apprend
            # a l'ignorer, et il devient pire qu'absent.
            #
            # Un NOM PROPRE et un NOMBRE, eux, ne se reformulent pas. Si la
            # reponse dit « Ispica-Pozzallo » ou « 130 km », la page doit
            # l'ecrire tel quel — sinon la reponse ne s'y trouve plus.
            # ─────────────────────────────────────────────────────────────
            # ─────────────────────────────────────────────────────────
            # QUEL MOT DOIT SE TROUVER MOT POUR MOT
            #
            # Deux essais rates avant celui-ci, et ils valent d'etre dits.
            #
            # 1) « le mot le plus long de la reponse » : 46 alertes, presque
            #    toutes legitimes — « refrigerant » quand la page dit
            #    « refroidir », « grandmother » quand elle dit « nonna ». Une
            #    reponse est une reformulation, pas une citation.
            # 2) « toute majuscule sauf en debut de reponse » : zero alerte,
            #    mais elle ne voyait PAS le cas qui l'avait fait naitre —
            #    « Ispica-Pozzallo » ouvre sa reponse. Verifie en remettant la
            #    question morte : le controle repondait 0.
            #
            # Ce qui marche : une majuscule EN COURS DE PHRASE est un nom propre
            # (rien d'autre ne se capitalise la), et le PREMIER mot n'en est un
            # que si sa forme le trahit — un trait d'union ou une majuscule
            # interne. « Ispica-Pozzallo » passe, « Environ » et « Circa » non.
            #
            # Un nom propre et un nombre ne se reformulent pas : si la reponse
            # les nomme, la page doit les ecrire tels quels.
            # ─────────────────────────────────────────────────────────────
            mots_rep = re.findall(r"[\w\u00C0-\u00ff-]+", rep)
            propres = []
            for rang, mot in enumerate(mots_rep):
                if not re.match(r'^[A-ZÉÈÀ]', mot) or len(mot) < 4:
                    continue
                forme_de_nom = '-' in mot or re.search(r'[a-zà-ÿ][A-ZÉÈÀ]', mot)
                if rang == 0 and not forme_de_nom:
                    continue
                propres.append(mot)
            nombres = re.findall(r'\b(\d{2,})', rep)
            for mot in propres + nombres:
                if nettoie(mot) not in texte:
                    faibles.append((ancre, q[:52], mot))
    total += len(muettes)
    print(f'{langue} : {concernees} questions couvertes, {len(muettes)} sans extrait'
          + (f', {len(faibles)} a cle principale absente' if faibles else ''))
    for x in muettes:
        print('     -', x[0], '|', x[1], '=>', x[2])
    for x in faibles:
        print('     ? cle absente :', x[0], '|', x[1], '=> mot attendu :', x[2])
    total_faibles += len(faibles)
print('TOTAL muettes :', total, '| a cle principale absente :', total_faibles)
