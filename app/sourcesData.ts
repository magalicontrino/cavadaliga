/**
 * LES SOURCES DES SECTIONS EXPLICATIVES.
 *
 * Mag : « mets toujours tes sources en lien discret sur les sections
 * explicatives ». C'est la bonne demande : une page qui affirme qu'une vipere
 * vit ici, qu'une amende coute 41 €, ou qu'un jeu date des annees 1970 doit
 * pouvoir dire d'ou elle le tient. Sinon le lecteur n'a que notre parole, et
 * personne ne peut corriger ce qu'il ne peut pas verifier.
 *
 * ELLES NE VIVENT PAS DANS `i18n`, et c'est voulu : une adresse web n'a pas de
 * traduction. Les recopier dans les trois dictionnaires, ce serait trois
 * occasions de laisser mourir un lien sans s'en apercevoir. Seul le mot
 * « Sources » est traduit, une fois, dans `i18n`.
 *
 * LA REGLE D'HONNETETE : on n'inscrit ici que ce qu'on a REELLEMENT consulte.
 * Une section ecrite de memoire n'a pas de source, et n'en invente pas — mieux
 * vaut un blanc qu'un lien qui donne l'air d'avoir verifie.
 */
export type Source = { label: string; url: string };

export const SOURCES: Record<string, Source[]> = {
  /*
   * PREPARER LE VOYAGE. Mag : « mets les sources ou tu as vu les infos ».
   *
   * ON NE CITE QUE CE QU'ON A OUVERT, et ça a coute une phrase. J'avais ecrit
   * que l'Intercity Notte est « le dernier train d'Europe » a monter sur un
   * ferry : en cherchant la source, je n'ai trouve que des blogs de voyage —
   * ni Wikipedia, ni Interrail, ni ferrovie.it ne le disent. La phrase est
   * partie. Le reste est verifie page par page, et ferrovie.it est le seul a
   * decrire le convoi coupe en sections a Messine.
   *
   * Les liens de SERVICE ne sont pas repetes ici : Trenitalia, GNV, Goldcar,
   * les articles du code de la route sont deja des pastilles dans leur section.
   * Une source n'est pas un raccourci, c'est ce qui prouve une affirmation.
   */
  /*
   * LE VIN. Le consorzio est l'autorite : c'est lui qui publie le disciplinare,
   * et c'est de la que viennent les 50-70 % de nero d'avola, les 30-50 % de
   * frappato et la date de la DOCG — septembre 2005, apres une DOC de 1973.
   *
   * Pour « l'unique DOCG de Sicile », le consorzio ne le dit pas : il ne parle
   * que de la sienne. Le lien de Quattrocalici s'appelle « toutes les DOCG de
   * la region Sicile » et n'en liste qu'une — c'est au lecteur de le constater,
   * ce qui vaut mieux que ma parole.
   */
  /*
   * LA GENETIQUE — le seul endroit du site ou les sources sont des ARTICLES
   * SCIENTIFIQUES, et ou elles ne se contentent pas d'appuyer le texte : elles
   * se contredisent. Di Gaetano donne les 37 %, Tofanelli previent sept ans
   * plus tard, dans la meme revue, que compter comme ça peut tromper. Les deux
   * sont cites, dans cet ordre, parce que c'est l'ordre dans lequel il faut les
   * lire — et parce qu'une source qui nuance la precedente vaut mieux qu'une
   * source qui la confirme.
   */
  genes: [
    { label: 'Di Gaetano et al., 2009 — European Journal of Human Genetics (les 37 %, les 6 %, l’ancêtre à 2 380 ans)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2985948/' },
    { label: 'Tofanelli et al., 2016 — European Journal of Human Genetics (la mise en garde sur ce calcul)', url: 'https://pubmed.ncbi.nlm.nih.gov/26173964/' },
    { label: 'Ringbauer et al., 2025 — Nature (les Puniques, presque aucun ancêtre levantin)', url: 'https://www.nature.com/articles/s41586-025-08913-3' },
  ],
  alcools: [
    { label: 'Le disciplinare du Cerasuolo di Vittoria — le Consorzio (cépages, DOCG 2005)', url: 'https://www.cerasuolovittoria.it/il-disciplinare/?lang=en' },
    { label: 'Les DOCG de la région Sicile — Quattrocalici', url: 'https://www.quattrocalici.it/denominazioni/cerasuolo-di-vittoria-docg/' },
  ],
  /*
   * L'ETNA. L'INGV surveille le volcan jour et nuit : c'est la source. Le
   * libelle dit ce qu'elle couvre — la taille, l'activite, l'altitude — et pas
   * l'histoire des neviere, qui attend encore la sienne. Un lien pose sous une
   * section n'a pas le droit de laisser croire qu'il la couvre entiere.
   */
  etna: [
    { label: 'L’Etna — INGV, Osservatorio Etneo (taille, activité, altitude)', url: 'https://www.ct.ingv.it/etna/' },
  ],
  avion: [
    { label: 'Rejoindre Scicli — I Love Scicli (temps de route depuis Catane)', url: 'https://www.ilovescicli.it/raggiungere-scicli/' },
  ],
  voiture: [
    { label: 'Dormir à bord d’un ferry : pont, fauteuils, cabines — Traghetti.com', url: 'https://www.traghetti.com/blog/come-dormire-a-bordo-di-un-traghetto/' },
  ],
  /*
   * L'EXPLOITANT AVANT L'ENCYCLOPEDIE — Mag : « Wikipedia c'est bien, mais pour
   * les transports mieux vaut la ligne officielle ». Elle a raison : un horaire
   * ou une regle de billetterie change, et seul l'exploitant met sa page a jour
   * le jour ou ça change.
   *
   * Trenitalia passe donc en tete partout ou il couvre le fait. Wikipedia ne
   * reste QUE la ou aucune page officielle ne dit la chose : verifie, la page
   * Intercity de Trenitalia ne parle pas du tout de la traversee en ferry, et
   * ni l'aeroport de Catane ni l'AMT ne publient les 700 m ni la cadence de la
   * navette. Les retirer pour la forme laisserait ces chiffres sans rien.
   */
  train: [
    { label: 'Intercity Notte — Trenitalia (liaisons Sicile, couchettes et voitures-lits)', url: 'https://www.trenitalia.com/it/intercity-notte.html' },
    { label: 'L’embarquement à Villa San Giovanni et les sections — Ferrovie.it', url: 'https://www.ferrovie.it/portale/articoli/11926' },
    { label: 'Traghettamento dans le détroit de Messine — Wikipedia', url: 'https://it.wikipedia.org/wiki/Traghettamento_nello_stretto_di_Messina' },
  ],
  'depuis-laeroport': [
    { label: 'Fontanarossa Airlink — Trenitalia (le billet navette + train)', url: 'https://www.trenitalia.com/it/regionale/collegamenti-regionale/fontanarossa-airlink.html' },
    { label: 'Gare de l’aéroport — Wikipedia (700 m, navette AMT, faute de page officielle)', url: 'https://it.wikipedia.org/wiki/Stazione_di_Catania_Aeroporto_Fontanarossa' },
  ],

  /*
   * Les us et coutumes. Mag : « c'est des souvenirs, moi, de vacances, mais
   * pour les coutumes officielles je prefere que tu fasses l'effort de
   * rechercher et de croiser des sources ».
   *
   * Elle avait raison de le demander, et le croisement a nuance ses deux
   * phrases. Le monokini n'est pas interdit — la Cassation l'a tranche en
   * 2000 — mais il ne se fait pas ici : c'est un usage, pas une regle, et
   * l'ecrire comme une regle aurait ete faux. Et « on vit en maillot » ne vaut
   * qu'ici : plusieurs communes SICILIENNES verbalisent 25 a 150 € pour un
   * maillot en centre-ville.
   *
   * Aucun arrete de ce genre n'a ete trouve pour Scicli — d'ou le « a notre
   * connaissance » dans le texte, qui n'est pas une precaution de style.
   */
  coutumes: [
    { label: 'Topless en spiaggia : ce que dit la loi — Supereva', url: 'https://www.supereva.it/topless-spiaggia-legale-cosa-dice-legge-99920' },
    { label: 'Costume et torse nu interdits en Sicile : Favignana, Marettimo, Levanzo — Sicilia News', url: 'https://www.sicilianews.it/costume-e-torso-nudo-vietato-in-piazza-anche-in-sicilia-ecco-dove/' },
    { label: 'San Vito Lo Capo interdit le maillot hors des plages — Corriere di Sciacca', url: 'https://www.corrieredisciacca.it/a-san-vito-lo-capo-e-vietato-camminare-in-costume-da-bagno-o-a-torso-nudo/' },
  ],

  /*
   * La scopa. Le barème de la primiera est verifie a part : c'est le seul
   * point du jeu ou une erreur se verrait en jouant, et l'ecrire de memoire
   * n'etait pas acceptable. Le 7 vaut 21, le roi seulement 10.
   */
  scopa: [
    { label: 'Scopa (gioco) — Wikipedia', url: 'https://it.wikipedia.org/wiki/Scopa_(gioco)' },
    { label: 'Come si calcola la primiera a scopa — ilGiocatoreOnline', url: 'https://www.ilgiocatoreonline.it/come-si-calcola-la-primiera-a-scopa.html' },
  ],

  /*
   * Les huit legendes. La page de HitSicily les donne toutes ; celle de Cola
   * Pesce a ete verifiee a part, parce que c'est la seule qui porte une date
   * (attestee des le XIIe siecle) et surtout parce que ses trois colonnes sont
   * les trois caps de la Trinacria — un rapprochement qu'il fallait verifier
   * avant de l'ecrire.
   */
  legendes: [
    { label: 'Les légendes les plus fascinantes de la Sicile — HitSicily', url: 'https://www.hitsicily.com/fr/redaction/a-la-decouverte-des-legendes-les-plus-fascinantes-de-la-sicile-un-voyage-entre-le-mythe-et-le-mystere-de-palerme-a-syracuse/' },
    { label: 'Cola Pesce — Wikipedia', url: 'https://it.wikipedia.org/wiki/Cola_Pesce' },
  ],

  /*
   * Les deux symboles. La legende des teste di moro et l'histoire de la
   * Trinacria ont ete lues avant d'ecrire ; la page italienne de Wikipedia sur
   * les teste di moro N'EXISTE PAS a l'adresse attendue (404), d'ou la source
   * de VisitSicily, qui est l'office de tourisme regional.
   */
  symboles: [
    { label: 'Trinacria — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Trinacria' },
    { label: 'L’histoire des têtes des Maures — VisitSicily', url: 'https://www.visitsicily.info/fr/lhistoire-des-tetes-des-maures/' },
    { label: 'Caltagirone et sa céramique — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Caltagirone' },
  ],

  /*
   * Valguarnera, juillet 1943. LA SOURCE EST CITEE BIEN QUE JE N'AIE PAS PU
   * L'OUVRIR : le serveur du ministere canadien renvoie 403 a toute lecture
   * automatique. C'est Mag qui a ouvert la page et m'en a recopie le texte
   * integral — noms de regiments, dates, deroule heure par heure. La section
   * en vient mot pour mot.
   *
   * On l'inscrit donc, mais en sachant ce qu'on fait : la regle est de ne citer
   * que ce qu'on a lu, et ici c'est Mag qui l'a lu. Le lien reste le bon endroit
   * ou verifier, et l'histoire officielle de Nicholson est la source de la
   * source.
   */
  valguarnera: [
    { label: 'Valguarnera, honneur de bataille — Défense nationale (Canada)', url: 'https://www.canada.ca/fr/ministere-defense-nationale/services/histoire-militaire/histoire-patrimoine/honneurs-bataille-distinctions-honorifiques/valguarnera.html' },
    { label: 'G.W.L. Nicholson, « Les Canadiens en Italie », histoire officielle, vol. II, 1960, p. 104', url: 'https://www.canada.ca/fr/ministere-defense-nationale/services/histoire-militaire/histoire-patrimoine/publications-officielles.html' },
  ],

  /*
   * La pastasciutta antifasciste. Mag a envoye la page du spectacle de Floriane
   * Facchini — elle raconte le projet, PAS la recette ni l'histoire, et elle est
   * citee pour ce qu'elle est. Les faits (les sept prenoms, les dates, la
   * journee du 25 juillet, la phrase d'Alcide) viennent des deux pages
   * verifiees ; la reference du livre vient de son editeur, pas du vendeur.
   *
   * Deux sources ont ete ECARTEES faute de pouvoir les ouvrir : le site de
   * l'Istituto Cervi et la page du ministere canadien refusent la lecture
   * automatique (erreur 403). On ne les inscrit pas : la regle est de ne citer
   * que ce qu'on a vraiment lu.
   */
  pastasciutta: [
    { label: 'Fratelli Cervi — Wikipedia', url: 'https://it.wikipedia.org/wiki/Fratelli_Cervi' },
    { label: 'Pastasciutta antifascista — Wikipedia', url: 'https://it.wikipedia.org/wiki/Pastasciutta_antifascista' },
    { label: 'Federico Attardo, « I sette fratelli Cervi » — BeccoGiallo', url: 'https://www.beccogiallo.it/negozio/biografie/i-sette-fratelli-cervi/' },
    { label: 'Alcide Cervi, « I miei sette figli » — Einaudi', url: 'https://www.einaudi.it/catalogo-libri/storia/storia-contemporanea/i-miei-sette-figli-alcide-cervi-9788806221157/' },
    { label: 'La pastasciutta antifasciste de Casa Cervi — Floriane Facchini', url: 'https://www.florianefacchini.com/creations/la-pastasciutta-antifascista-de-casa-cervi' },
  ],

  /*
   * Les jeux de plage. Mag a envoye elle-meme l'article sur la balle au
   * tambourin ; les quatre autres viennent de la verification faite avant
   * d'ecrire la section — le nom italien du jeu, le reglement des bocce sur
   * sable, la partie de Donnalucata, et la toupie sicilienne.
   */
  sports: [
    { label: 'Balle au tambourin — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Balle_au_tambourin' },
    { label: 'Tennis da spiaggia — Wikipedia', url: 'https://it.wikipedia.org/wiki/Tennis_da_spiaggia' },
    { label: 'Beach Bocce — Federazione Italiana Bocce', url: 'https://www.federbocce.it/beach.html' },
    // Mag : « la petanque ce sont des boules en bois ». Verifie : le bois est
    // bien l'etat d'origine, et l'acier n'arrive qu'en 1927.
    { label: 'Boule de pétanque (argile, pierre, bois, puis acier) — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Boule_de_p%C3%A9tanque' },
    { label: 'Les boules sur la plage de Donnalucata — Ragusanews', url: 'https://www.ragusanews.com/attualita-giocare-a-bocce-in-spiaggia-incontro-dove-si-raccontano-gli-anni-184035/' },
    { label: 'A strummula, la toupie sicilienne — ilSicilia', url: 'https://ilsicilia.it/a-strummula-u-tuppettu-un-antico-gioco-da-riscoprire/' },
  ],

  /*
   * Les lieux. Mag a envoye le texte sur Punta Corvo ; la verification a
   * ajoute ce qu'il ne disait pas — que le « vieux phare » est en fait la casa
   * del finanziere, l'ancien poste de douane, et que « a spaccazza » est cette
   * fissure ou l'on ne passe qu'un par un.
   */
  /*
   * Le Val di Noto. LES DEUX LIENS UNESCO SONT CITES SANS QUE J'AIE PU LES
   * OUVRIR : whc.unesco.org renvoie 403 a toute lecture automatique, dans les
   * deux langues. Ce sont pourtant LES references officielles, et Mag les
   * demandait explicitement. Les faits — les huit villes, l'annee, le numero de
   * bien, la magnitude — viennent donc de Wikipedia, et les liens restent le
   * bon endroit ou verifier.
   */
  lieux: [
    { label: 'Villes du baroque tardif du Val di Noto — UNESCO, bien nº 1024', url: 'https://whc.unesco.org/fr/list/1024/' },
    { label: 'Syracuse et la nécropole rupestre de Pantalica — UNESCO, bien nº 1200', url: 'https://whc.unesco.org/fr/list/1200/' },
    { label: 'Val di Noto — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Val_di_Noto' },
    { label: 'Punta Corvo et Costa di Carro — Visit Vigata', url: 'https://www.visitvigata.com/punta-corvo-costa-di-carro/' },
    { label: 'Cava d’Aliga — Visit Vigata', url: 'https://www.visitvigata.com/cava-d-aliga/' },
  ],

  /*
   * La faune. Mag croyait qu'il n'y avait ni serpents ni scorpions ; c'est
   * faux, et sur une morsure de vipere une fausse reassurance coute cher. La
   * section dit ce qui vit la — voila ou on l'a lu.
   */
  faune: [
    // Les deux liens vers l'espece precise renvoyaient 404 — mesure faite avant
    // publication. Ce sont les pages du GENRE qui portent l'information : la
    // sous-espece hugyi y est donnee comme « typique de l'Italie meridionale »,
    // et l'aire « s'etend jusqu'a la Sicile, absente de la seule Sardaigne ».
    { label: 'Vipera aspis (sous-espèce hugyi) — Wikipedia', url: 'https://it.wikipedia.org/wiki/Vipera_aspis' },
    { label: 'Euscorpius (dont E. sicanus, Sicile) — Wikipedia', url: 'https://en.wikipedia.org/wiki/Euscorpius' },
  ],
};
