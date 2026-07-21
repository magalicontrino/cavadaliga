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
    # « Les lieux » : un tableau, pas un objet — voir blocs_de().
    'lieux': ['placesIntro', 'regionPlaces'],
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
for k, langue in enumerate(('fr', 'it', 'en')):
    zone = '\n'.join(lignes[bornes[k]:bornes[k + 1]])
    qs = re.findall(r"\{ q: '((?:[^'\\]|\\.)*)', choix: \[([^\]]+)\], bonne: (\d+), ancre: '([a-z]+)'", zone)
    muettes = []
    concernees = 0
    for q, choix, bonne, ancre in qs:
        if ancre not in SOURCES:
            continue
        concernees += 1
        texte = ARBRE if ancre == 'arbre' else nettoie(' '.join(TEXTES[c][k] for c in SOURCES[ancre]))
        opts = re.findall(r"'((?:[^'\\]|\\.)*)'", choix)
        rep = opts[int(bonne)].replace("\\'", "'")
        mots = [w for w in re.split(r"[^a-z0-9‘’']+", nettoie(rep)) if w]
        cles = [w for w in mots if len(w) >= 4 or w.isdigit()] or [w for w in mots if len(w) >= 2]
        if not any(c in texte for c in cles):
            muettes.append((ancre, q[:52], rep[:45]))
    total += len(muettes)
    print(f'{langue} : {concernees} questions couvertes, {len(muettes)} sans extrait')
    for x in muettes:
        print('     -', x[0], '|', x[1], '=>', x[2])
print('TOTAL muettes :', total)
