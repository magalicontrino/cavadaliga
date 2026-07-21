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
  lieux: [
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
