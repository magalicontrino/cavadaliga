import type { Lang } from './localData';

// ────────────────────────────────────────────────────────────────────────
// Culture audio & visuelle — ce coin de Sicile vu par les écrans et les oreilles.
// Source unique pour la page « Sons & images » (/culture).
// Textes visibles dans les 3 langues (fr · it · en). Noms propres = identiques.
// ────────────────────────────────────────────────────────────────────────

// Playlist Spotify partagée de la famille. Vide → la page affiche l'état
// « à venir » (jamais de faux lien).
// Sans les paramètres de partage (?si=, ?pt=) : ce sont des jetons de suivi
// liés au compte qui l'a partagée, inutiles pour ouvrir la playlist.
export const SPOTIFY_PLAYLIST_ID = '3v1EySOwK41rahT6rVThni';
export const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;
// Lecteur intégré (iframe), en version compacte : le grand format prend 420 px
// de noir sur la page. Spotify n'offre pas de thème clair, on limite donc la
// surface sombre. La playlist entière reste accessible via le bouton.
export const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?theme=0`;
export const SPOTIFY_EMBED_HEIGHT = 152;

// Recherche Spotify : URL toujours valide, pas d'identifiant d'artiste à deviner.
const spotify = (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}`;

export type Artist = {
  id: string;
  name: string;
  from: string; // ville d'origine — même dans les 3 langues
  url: string;
  blurb: Record<Lang, string>;
};

export const ARTISTS: Artist[] = [
  {
    id: 'balistreri',
    name: 'Rosa Balistreri',
    from: 'Licata',
    url: spotify('Rosa Balistreri'),
    blurb: {
      fr: 'La voix du chant populaire sicilien (1927-1990). Rugueuse, dramatique, bouleversante — la Sicile d’avant les cartes postales.',
      it: 'La voce del canto popolare siciliano (1927-1990). Ruvida, drammatica, struggente — la Sicilia prima delle cartoline.',
      en: 'The voice of Sicilian folk song (1927-1990). Raw, dramatic, heart-wrenching — Sicily before the postcards.',
    },
  },
  {
    id: 'battiato',
    name: 'Franco Battiato',
    from: 'Catania',
    url: spotify('Franco Battiato'),
    blurb: {
      fr: 'Le grand maître catanais. Pop mystique et méditerranéenne — parfait pour les routes de campagne au coucher du soleil.',
      it: 'Il grande maestro catanese. Pop mistico e mediterraneo — perfetto per le strade di campagna al tramonto.',
      en: 'The great Catanese master. Mystic Mediterranean pop — perfect for country roads at sunset.',
    },
  },
  {
    id: 'consoli',
    name: 'Carmen Consoli',
    from: 'Catania',
    url: spotify('Carmen Consoli'),
    blurb: {
      fr: '« La cantantessa ». Guitare et accent sicilien assumé, entre douceur et colère.',
      it: '« La cantantessa ». Chitarra e accento siciliano rivendicato, tra dolcezza e rabbia.',
      en: '“La cantantessa”. Guitar and an unapologetic Sicilian accent, between tenderness and anger.',
    },
  },
  {
    id: 'colapesce-dimartino',
    name: 'Colapesce Dimartino',
    from: 'Solarino & Palermo',
    url: spotify('Colapesce Dimartino'),
    blurb: {
      fr: 'Le duo sicilien d’aujourd’hui. Pop solaire et mélancolique — la B.O. évidente d’un été ici.',
      it: 'Il duo siciliano di oggi. Pop solare e malinconico — la colonna sonora ovvia di un’estate qui.',
      en: 'Today’s Sicilian duo. Sunny, melancholy pop — the obvious soundtrack to a summer here.',
    },
  },
  {
    id: 'sellerio',
    name: 'Olivia Sellerio',
    from: 'Palermo',
    url: spotify('Olivia Sellerio'),
    blurb: {
      fr: 'La voix des chansons du Commissaire Montalbano. À écouter après avoir vu Scicli à l’écran.',
      it: 'La voce delle canzoni del Commissario Montalbano. Da ascoltare dopo aver visto Scicli sullo schermo.',
      en: 'The voice behind the Commissario Montalbano songs. Listen after seeing Scicli on screen.',
    },
  },
  {
    id: 'scollo',
    name: 'Etta Scollo',
    from: 'Catania',
    url: spotify('Etta Scollo'),
    blurb: {
      fr: 'Elle reprend et prolonge le répertoire sicilien, notamment celui de Rosa Balistreri.',
      it: 'Riprende e prolunga il repertorio siciliano, in particolare quello di Rosa Balistreri.',
      en: 'She revisits and extends the Sicilian repertoire, Rosa Balistreri’s in particular.',
    },
  },
];

// ── Arts visuels ──────────────────────────────────────────────────────
// Scicli n'est pas qu'un décor de série : c'est un vrai foyer de peinture.
// Même forme que SCREENS pour un rendu identique.
export const ARTS: Screen[] = [
  {
    id: 'guccione',
    title: 'Piero Guccione',
    year: '1935 – 2018',
    kind: { fr: 'Peintre', it: 'Pittore', en: 'Painter' },
    url: 'https://it.wikipedia.org/wiki/Piero_Guccione',
    placeLabel: 'Palazzo Spadaro, Scicli',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Palazzo+Spadaro+Scicli',
    blurb: {
      fr: 'Né à Scicli, revenu s’installer entre Scicli et Modica en 1979. Il a passé sa vie à peindre cette mer — la nôtre, celle qu’on voit depuis la maison. Un des grands peintres italiens du XXᵉ siècle.',
      it: 'Nato a Scicli, tornato a vivere tra Scicli e Modica nel 1979. Ha passato la vita a dipingere questo mare — il nostro, quello che si vede da casa. Uno dei grandi pittori italiani del Novecento.',
      en: 'Born in Scicli, he moved back to the countryside between Scicli and Modica in 1979. He spent his life painting this sea — ours, the one you see from the house. One of Italy’s great 20th-century painters.',
    },
  },
  {
    id: 'gruppo-scicli',
    title: 'Il Gruppo di Scicli',
    year: '1970 →',
    kind: { fr: 'Collectif de peintres', it: 'Collettivo di pittori', en: 'Painters’ collective' },
    url: 'http://www.ilgruppodiscicli.it',
    placeLabel: 'Palazzo Spadaro, Scicli',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Palazzo+Spadaro+Scicli',
    blurb: {
      fr: 'Autour de Guccione et de son ami Franco Sarnari, tout un groupe de peintres et sculpteurs s’est formé à Scicli : Sonia Alvarez, Carmelo Candiano, Franco Polizzi, Giuseppe Puglisi… Guttuso lui-même en a reconnu la valeur.',
      it: 'Intorno a Guccione e all’amico Franco Sarnari si è formato a Scicli un intero gruppo di pittori e scultori: Sonia Alvarez, Carmelo Candiano, Franco Polizzi, Giuseppe Puglisi… Guttuso stesso ne riconobbe il valore.',
      en: 'Around Guccione and his friend Franco Sarnari, a whole group of painters and sculptors formed in Scicli: Sonia Alvarez, Carmelo Candiano, Franco Polizzi, Giuseppe Puglisi… Guttuso himself recognised its worth.',
    },
  },
  {
    id: 'palazzo-spadaro',
    title: 'Palazzo Spadaro',
    year: 'Scicli',
    kind: { fr: 'À voir', it: 'Da vedere', en: 'To visit' },
    url: 'https://www.google.com/maps/search/?api=1&query=Palazzo+Spadaro+Scicli',
    placeLabel: 'Scicli, 8 km',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Palazzo+Spadaro+Scicli',
    blurb: {
      fr: 'La pinacothèque municipale, dans un palais baroque. C’est là qu’on voit les toiles du Gruppo di Scicli — Guccione, Sarnari, Polizzi. À 8 km de la maison.',
      it: 'La pinacoteca comunale, dentro un palazzo barocco. Qui si vedono le tele del Gruppo di Scicli — Guccione, Sarnari, Polizzi. A 8 km da casa.',
      en: 'The municipal picture gallery, inside a baroque palace. This is where you see the Gruppo di Scicli canvases — Guccione, Sarnari, Polizzi. 8 km from the house.',
    },
  },
  {
    id: 'macc',
    title: 'MACC — Museo di Arte Contemporanea',
    year: 'Piazza Busacca, Scicli',
    kind: { fr: 'À voir', it: 'Da vedere', en: 'To visit' },
    url: 'https://www.google.com/maps/search/?api=1&query=MACC+Museo+Arte+Contemporanea+Carmine+Scicli',
    placeLabel: 'Ex-convento del Carmine',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=MACC+Museo+Arte+Contemporanea+Carmine+Scicli',
    blurb: {
      fr: 'L’art contemporain dans l’ancien couvent du Carmine, Piazza Busacca. Expositions temporaires — vérifiez le programme avant d’y aller.',
      it: 'L’arte contemporanea nell’ex convento del Carmine, Piazza Busacca. Mostre temporanee — controllate il programma prima di andare.',
      en: 'Contemporary art in the former Carmine convent, Piazza Busacca. Temporary exhibitions — check the programme before you go.',
    },
  },
];

// ── Parler avec les mains ─────────────────────────────────────────────
// Le « Supplemento al dizionario italiano » de Bruno Munari (1958) : cinquante
// gestes italiens photographiés et légendés en quatre langues. Munari l'a fait
// explicitement POUR les étrangers de passage en Italie — c'est-à-dire pour
// nous. Le livre est toujours édité chez Corraini.
//
// Les photos du livre ne sont pas reprises ici : elles sont sous droits. Les
// gestes, eux, appartiennent à tout le monde — on les décrit avec nos mots.
export const MUNARI_BOOK = 'https://corraini.com/it/supplemento-al-dizionario-italiano.html';
export const MUNARI_WIKI = 'https://it.wikipedia.org/wiki/Bruno_Munari';
export const DE_JORIO_WIKI = 'https://it.wikipedia.org/wiki/Andrea_de_Jorio';

export type Gesture = { id: string; name: string; how: Record<Lang, string>; means: Record<Lang, string> };

export const GESTURES: Gesture[] = [
  {
    id: 'che-vuoi',
    name: 'Ma che vuoi?',
    how: {
      fr: 'Les cinq doigts pincés en bouton, la main qui monte et descend au poignet.',
      it: 'Le cinque dita unite a pigna, la mano che sale e scende dal polso.',
      en: 'All five fingertips pinched together, the hand rocking up and down at the wrist.',
    },
    means: {
      fr: 'Le geste italien par excellence. « Mais qu’est-ce que tu racontes ? » — de l’étonnement à l’exaspération, tout dépend de la vitesse.',
      it: 'Il gesto italiano per eccellenza. « Ma che stai dicendo? » — dallo stupore all’esasperazione, dipende tutto dalla velocità.',
      en: 'The Italian gesture. “What on earth are you on about?” — from surprise to exasperation, it all depends on the speed.',
    },
  },
  {
    id: 'non-me-ne-importa',
    name: 'Non me ne importa',
    how: {
      fr: 'Le dos des doigts sous le menton, poussé vers l’avant d’un coup sec.',
      it: 'Il dorso delle dita sotto il mento, spinto in avanti di scatto.',
      en: 'The back of the fingers under the chin, flicked forward.',
    },
    means: {
      fr: 'Je m’en moque. À manier avec précaution : c’est franc.',
      it: 'Non mi interessa. Da usare con prudenza: è schietto.',
      en: 'I don’t care. Handle with care — it is blunt.',
    },
  },
  {
    id: 'insisto',
    name: 'Insisto',
    how: {
      fr: 'L’index frappe la paume ouverte de l’autre main, sec et répété.',
      it: 'L’indice batte sul palmo aperto dell’altra mano, secco e ripetuto.',
      en: 'The index finger jabs the open palm of the other hand, sharply and repeatedly.',
    },
    means: {
      fr: 'J’insiste, et je ne lâcherai pas. Le rythme fait tout.',
      it: 'Insisto, e non mollo. È il ritmo a dire tutto.',
      en: 'I insist, and I am not letting go. The rhythm says everything.',
    },
  },
  {
    id: 'che-peso',
    name: 'Che peso!',
    how: {
      fr: 'L’index tapote lentement l’estomac, comme un poids qui pèse là.',
      it: 'L’indice batte lentamente sullo stomaco, come un peso che grava lì.',
      en: 'The index finger taps slowly on the stomach, like a weight sitting there.',
    },
    means: {
      fr: 'Quelle corvée. Quelqu’un — ou quelque chose — devient lourd à supporter.',
      it: 'Che noia. Qualcuno — o qualcosa — diventa pesante da sopportare.',
      en: 'What a bore. Someone — or something — is becoming hard to bear.',
    },
  },
  {
    id: 'leggere',
    name: 'Leggere',
    how: {
      fr: 'L’index court sur la paume ouverte de l’autre main, ligne après ligne.',
      it: 'L’indice scorre sul palmo aperto dell’altra mano, riga dopo riga.',
      en: 'The index finger runs across the open palm, line after line.',
    },
    means: {
      fr: 'Lire. La paume est la page — un geste qu’on comprend sans un mot.',
      it: 'Leggere. Il palmo è la pagina — un gesto che si capisce senza parole.',
      en: 'To read. The palm is the page — you understand it without a word.',
    },
  },
  {
    id: 'rubare',
    name: 'Rubare',
    how: {
      fr: 'La main ouverte se referme lentement, un doigt après l’autre, pouce tendu.',
      it: 'La mano aperta si chiude lentamente, un dito alla volta, pollice teso.',
      en: 'The open hand closes slowly, one finger at a time, thumb left out.',
    },
    means: {
      fr: 'Voler. Munari note que le mouvement ressemble à celui d’un joueur de harpe.',
      it: 'Rubare. Munari nota che il movimento somiglia a quello di un suonatore d’arpa.',
      en: 'To steal. Munari notes the movement resembles that of a harp player.',
    },
  },
];

// ── Photographes ──────────────────────────────────────────────────────
export const PHOTOS: Screen[] = [
  {
    id: 'giuseppe-leone',
    title: 'Giuseppe Leone',
    year: '1936 – 2024',
    kind: { fr: 'Photographe', it: 'Fotografo', en: 'Photographer' },
    url: 'https://it.wikipedia.org/wiki/Giuseppe_Leone_(fotografo)',
    placeLabel: 'Ragusa',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Ragusa+Ibla',
    blurb: {
      fr: 'Né et mort à Ragusa, il n’a jamais quitté son atelier alors que les autres partaient : « le Sicilien des pierres ». Soixante-dix ans à photographier les Iblei — nos paysages, nos pierres, nos fêtes. Personne n’a mieux regardé ce coin-ci.',
      it: 'Nato e morto a Ragusa, non ha mai lasciato il suo studio mentre gli altri partivano: « il siciliano delle pietre ». Settant’anni a fotografare gli Iblei — i nostri paesaggi, le nostre pietre, le nostre feste. Nessuno ha guardato meglio questo angolo.',
      en: 'Born and died in Ragusa, he never left his studio while the others moved away: “the Sicilian of the stones”. Seventy years photographing the Iblei — our landscapes, our stones, our festivals. Nobody looked at this corner better.',
    },
  },
  {
    id: 'scianna',
    title: 'Ferdinando Scianna',
    year: '1943 →',
    kind: { fr: 'Photographe', it: 'Fotografo', en: 'Photographer' },
    url: 'https://it.wikipedia.org/wiki/Ferdinando_Scianna',
    placeLabel: 'Bagheria',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Bagheria+Sicilia',
    blurb: {
      fr: 'Le premier Italien entré chez Magnum, présenté par Cartier-Bresson en personne. Il revient sans cesse photographier les visages et les fêtes de son île. Pas d’ici précisément, mais on ne comprend pas la Sicile en images sans lui.',
      it: 'Il primo italiano entrato alla Magnum, presentato da Cartier-Bresson in persona. Torna di continuo a fotografare i volti e le feste della sua isola. Non è di qui, ma la Sicilia in immagini non si capisce senza di lui.',
      en: 'The first Italian to join Magnum, introduced by Cartier-Bresson himself. He keeps returning to photograph the faces and festivals of his island. Not from right here, but you cannot understand Sicily in pictures without him.',
    },
  },
];

export type Screen = {
  id: string;
  title: string;
  year: string;
  kind: Record<Lang, string>;
  url: string; // fiche de référence
  placeLabel: string; // lieu de tournage près de nous
  placeUrl: string; // Google Maps
  blurb: Record<Lang, string>;
};

export const SCREENS: Screen[] = [
  {
    id: 'montalbano',
    title: 'Il Commissario Montalbano',
    year: '1999 – 2021',
    kind: { fr: 'Série', it: 'Serie', en: 'Series' },
    url: 'https://it.wikipedia.org/wiki/Il_commissario_Montalbano',
    placeLabel: 'Municipio di Scicli',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Municipio+di+Scicli',
    blurb: {
      fr: 'La Vigàta de Camilleri, c’est ici : la mairie de Scicli joue le commissariat, la maison de Montalbano est à Punta Secca, et le port de Donnalucata revient sans arrêt. On reconnaît nos rues à chaque épisode.',
      it: 'La Vigàta di Camilleri è qui: il municipio di Scicli fa da commissariato, la casa di Montalbano è a Punta Secca e il porto di Donnalucata torna di continuo. Riconosciamo le nostre strade a ogni episodio.',
      en: 'Camilleri’s Vigàta is right here: Scicli’s town hall plays the police station, Montalbano’s house is at Punta Secca, and Donnalucata’s harbour keeps coming back. You recognise our streets in every episode.',
    },
  },
  {
    id: 'giovane-montalbano',
    title: 'Il Giovane Montalbano',
    year: '2012 – 2015',
    kind: { fr: 'Série', it: 'Serie', en: 'Series' },
    url: 'https://it.wikipedia.org/wiki/Il_giovane_Montalbano',
    placeLabel: 'Punta Secca',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Punta+Secca+Santa+Croce+Camerina',
    blurb: {
      fr: 'La préquelle : le commissaire jeune, dans les mêmes décors — Scicli, Punta Secca, Ragusa Ibla, Noto. Une bonne porte d’entrée avant la série mère.',
      it: 'Il prequel: il commissario da giovane, negli stessi luoghi — Scicli, Punta Secca, Ragusa Ibla, Noto. Una buona porta d’ingresso prima della serie madre.',
      en: 'The prequel: a young Montalbano, in the same settings — Scicli, Punta Secca, Ragusa Ibla, Noto. A good way in before the main series.',
    },
  },
  {
    id: 'fornace-penna',
    title: 'La Mànnara — Fornace Penna',
    year: 'Sampieri',
    kind: { fr: 'Lieu de tournage', it: 'Luogo delle riprese', en: 'Filming location' },
    url: 'https://it.wikipedia.org/wiki/Fornace_Penna',
    placeLabel: 'Fornace Penna, Sampieri',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Fornace+Penna+Sampieri',
    blurb: {
      fr: 'La grande briqueterie en ruine sur la plage de Sampieri, à 5 km : « la Mànnara » dans Montalbano. Le critique Vittorio Sgarbi l’a appelée une basilique laïque au bord de la mer. À voir au coucher du soleil.',
      it: 'La grande fornace in rovina sulla spiaggia di Sampieri, a 5 km: « la Mànnara » in Montalbano. Il critico Vittorio Sgarbi l’ha definita una basilica laica in riva al mare. Da vedere al tramonto.',
      en: 'The huge ruined brickworks on Sampieri beach, 5 km away: “la Mànnara” in Montalbano. Critic Vittorio Sgarbi called it a secular basilica by the sea. Best at sunset.',
    },
  },
  {
    id: 'divorzio',
    title: 'Divorzio all’italiana',
    year: '1961',
    kind: { fr: 'Film', it: 'Film', en: 'Film' },
    url: 'https://it.wikipedia.org/wiki/Divorzio_all%27italiana',
    placeLabel: 'Duomo di San Giorgio, Ragusa Ibla',
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=Duomo+di+San+Giorgio+Ragusa+Ibla',
    blurb: {
      fr: 'Le classique de Pietro Germi avec Marcello Mastroianni, tourné à Ispica et dans le Duomo de Ragusa Ibla. La Sicile en noir et blanc, féroce et drôle.',
      it: 'Il classico di Pietro Germi con Marcello Mastroianni, girato a Ispica e nel Duomo di Ragusa Ibla. La Sicilia in bianco e nero, feroce e divertente.',
      en: 'Pietro Germi’s classic with Marcello Mastroianni, shot in Ispica and inside Ragusa Ibla’s Duomo. Sicily in black and white, fierce and funny.',
    },
  },
];
