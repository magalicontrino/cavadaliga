import type { Lang } from './localData';

// ────────────────────────────────────────────────────────────────────────
// Culture audio & visuelle — ce coin de Sicile vu par les écrans et les oreilles.
// Source unique pour la page « Sons & images » (/culture).
// Textes visibles dans les 3 langues (fr · it · en). Noms propres = identiques.
// ────────────────────────────────────────────────────────────────────────

// Playlist Spotify partagée de la famille. Vide tant que le lien n'est pas
// fourni → la page affiche l'état « à venir » (jamais de faux lien).
export const SPOTIFY_PLAYLIST_URL = '';

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
