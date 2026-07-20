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
    """Tous les litteraux `cle: {...}` du fichier, dans l'ordre."""
    out, depuis = [], 0
    while True:
        j = src.find(cle + ': {', depuis)
        if j < 0:
            return out
        prof = 0
        for i in range(src.index('{', j), len(src)):
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
}
# Pour chaque cle : [type, fr, it, en] -> on garde les trois derniers.
TEXTES = {}
for cles in SOURCES.values():
    for c in cles:
        b = blocs_de(c)
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
        texte = nettoie(' '.join(TEXTES[c][k] for c in SOURCES[ancre]))
        opts = re.findall(r"'((?:[^'\\]|\\.)*)'", choix)
        rep = opts[int(bonne)].replace("\\'", "'")
        mots = [w for w in re.split(r"[^a-z0-9‘’']+", nettoie(rep)) if w]
        cles = [w for w in mots if len(w) >= 4 or w.isdigit()] or [w for w in mots if len(w) >= 2]
        if not any(c in texte for c in cles):
            muettes.append((ancre, q[:52], rep[:45]))
    total += len(muettes)
    print(f'{langue} : {concernees} questions pratiques, {len(muettes)} sans extrait')
    for x in muettes:
        print('     -', x[0], '|', x[1], '=>', x[2])
print('TOTAL muettes :', total)
