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
