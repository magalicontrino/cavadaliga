'use client';

/**
 * Les glyphes PLEINS du cours d'italien.
 *
 * Un jeu a part, et pas huit entrees de plus dans `Icon`. Tout le site parle
 * une langue de TRAIT FIN — `Icon` pose `fill="none"` et dessine en
 * `currentColor` au trait. Ceux-ci sont des APLATS : silhouette pleine, aucun
 * contour, forme lue d'un bloc. Melanger les deux dans le meme composant
 * obligerait chaque appel a savoir lequel il demande, et le premier oubli
 * ferait une icone vide.
 *
 * Mag les a montres sur un modele — fleche, marque-page, calques, guillemets,
 * disque : plats, conceptuels, sans detail. Le principe est celui-la : a cette
 * taille (44 px), ce n'est pas le dessin qu'on lit mais la MASSE. Un trait fin
 * grossi huit fois devient maigre ; un aplat, lui, tient.
 *
 * Les trois temps forment expres une famille : le passe REVIENT (fleche
 * courbe vers l'arriere), le present EST (le soleil, l'instant), le futur
 * AVANCE (double triangle). On les distingue de loin, sans les lire.
 */
export type GlypheName =
  | 'sons'
  | 'bulles'
  | 'soleil'
  | 'retour'
  | 'avance'
  | 'disque'
  | 'cible'
  | 'depart';

const FORMES: Record<GlypheName, React.ReactNode> = {
  // LES SONS — quatre barres d'egale largeur, de hauteurs differentes. C'est le
  // dessin universel du son, et il ne represente aucun objet : exactement ce
  // qu'on veut pour la prononciation, qui n'en est pas un.
  sons: (
    <>
      <rect x="2.5" y="9" width="3.6" height="6" rx="1.8" />
      <rect x="8.3" y="4.5" width="3.6" height="15" rx="1.8" />
      <rect x="14.1" y="7" width="3.6" height="10" rx="1.8" />
      <rect x="19.9" y="10.5" width="3.6" height="3" rx="1.5" />
    </>
  ),
  // PARLER — deux bulles qui se chevauchent. Une seule dirait « un message » ;
  // deux disent l'echange, et c'est de ça qu'il s'agit : des phrases pour
  // repondre a quelqu'un.
  bulles: (
    <>
      <path d="M9.6 2.5h-5A3.1 3.1 0 0 0 1.5 5.6v5a3.1 3.1 0 0 0 3.1 3.1v3.1l3.4-3.1h1.6a3.1 3.1 0 0 0 3.1-3.1v-5A3.1 3.1 0 0 0 9.6 2.5z" />
      <path d="M19.4 8h-4.2v2.6a4.7 4.7 0 0 1-4.7 4.7h-.9v1.3a3.1 3.1 0 0 0 3.1 3.1h2.6l3.4 3.1v-3.1a3.1 3.1 0 0 0 3.1-3.1v-5.5A3.1 3.1 0 0 0 19.4 8z" />
    </>
  ),
  // LE PRESENT — le soleil, c'est-a-dire AUJOURD'HUI.
  //
  // Les rayons sont huit capsules identiques tournees autour du centre. Ma
  // premiere version les taillait en pointe, chacune dessinee a la main : a
  // 110 px les quatre diagonales se lisaient comme des eclats DETACHES du
  // disque, et l'ensemble virait a l'etoile d'explosion. Huit formes egales,
  // posees par rotation, ne peuvent pas diverger.
  soleil: (
    <>
      <circle cx="12" cy="12" r="5.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="10.9" y="0.8" width="2.2" height="4" rx="1.1" transform={`rotate(${a} 12 12)`} />
      ))}
    </>
  ),
  // LE PASSE — une fleche qui REVIENT : trois quarts de cercle et une pointe
  // ramenee vers la gauche. C'est le signe du « retour en arriere », et le
  // passe compose ne dit rien d'autre.
  retour: (
    <>
      <path d="M12 3.2a8.8 8.8 0 1 1-8.5 11h3.9A5 5 0 1 0 12 7v3.4L6.2 5.6 12 .8z" />
    </>
  ),
  // LE FUTUR — le double triangle de l'avance rapide. Rien ne dit « ce qui
  // vient » plus vite que ça, et le dessin est deja un aplat par nature.
  avance: (
    <>
      <path d="M2 5.4l8.4 6.6L2 18.6z" />
      <path d="M12.4 5.4L20.8 12l-8.4 6.6z" />
    </>
  ),
  // LES CHANSONS — le disque, troue en son centre. Le meme objet que sur le
  // modele de Mag, et le seul qui designe une chanson sans passer par une note
  // de musique, qui dirait « solfege ».
  disque: (
    <>
      <path
        d="M12 1.2A10.8 10.8 0 1 0 22.8 12 10.8 10.8 0 0 0 12 1.2zm0 13a2.2 2.2 0 1 1 2.2-2.2 2.2 2.2 0 0 1-2.2 2.2z"
        fillRule="evenodd"
      />
    </>
  ),
  // S'ENTRAINER — la cible. Un anneau plein et un point au centre : on vise, on
  // touche ou on rate. C'est exactement ce que fait le quiz.
  cible: (
    <>
      <path
        d="M12 1.2A10.8 10.8 0 1 0 22.8 12 10.8 10.8 0 0 0 12 1.2zm0 17.2A6.4 6.4 0 1 1 18.4 12 6.4 6.4 0 0 1 12 18.4z"
        fillRule="evenodd"
      />
      <circle cx="12" cy="12" r="3.1" />
    </>
  ),
  // CONTINUER AILLEURS — la fleche qui sort du cadre, en diagonale. C'est le
  // signe convenu du lien qui emmene hors du site, et Mag l'avait justement
  // pointe sur son modele.
  depart: (
    <path d="M6.4 2.6h13.4a1.6 1.6 0 0 1 1.6 1.6v13.4h-4.2V9.8L6.1 20.8 3.2 17.9 14.2 6.8H6.4z" />
  ),
};

export default function GlyphePlein({
  name,
  size = 44,
  className = '',
}: {
  name: GlypheName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
    >
      {FORMES[name]}
    </svg>
  );
}
