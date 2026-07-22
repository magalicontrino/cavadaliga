/*
 * LE SURLIGNEUR — « mets les mots de l'aéroport en surligné comme ça, et tout
 * pareil pour les mots clés sur le site ».
 *
 * Mag l'a demandé en SELECTIONNANT du texte a l'ecran : le rose plein qu'elle
 * montrait est notre `::selection`, pas un style de la page. Repris tel quel il
 * ne tiendrait pas — mesure, le rose plein #e6296f ne porte le blanc qu'a 4,28
 * et l'encre qu'a 3,21, quand il en faut 4,5. Un surlignage permanent a ce
 * niveau-la rendrait ses propres mots clefs moins lisibles que le reste du
 * paragraphe, ce qui est exactement l'inverse du but.
 *
 * Le meme rose a 22 % donne 9,56 avec l'encre. C'est un vrai surligneur : la
 * couleur se voit d'un coup d'œil sur la page, et le mot dessous se lit mieux
 * qu'avant — puisqu'il passe du gris de la ligne a l'encre pleine.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POURQUOI UN MARQUEUR DANS LE TEXTE, ET PAS UNE LISTE DE MOTS
 *
 * La tentation etait de tenir une liste — « aéroport », « casque », « caution »
 * — et de surligner partout ou ces mots tombent. C'est ce qu'il ne faut surtout
 * pas faire : « aéroport » apparait des dizaines de fois, et le surligner
 * partout revient a ne surligner nulle part. Pire, la liste serait FRANÇAISE,
 * donc muette en italien et en anglais.
 *
 * Le marqueur vit donc DANS la phrase, langue par langue : `[[à la sortie de
 * l'aéroport]]`. C'est celui qui ecrit la phrase qui decide de ce qui compte
 * dedans, une fois, a l'endroit ou ça compte.
 * ─────────────────────────────────────────────────────────────────────────
 */
import React from 'react';

/** `[[...]]` — deux crochets, parce qu'aucun texte du site n'en contient. */
const MARQUEUR = /\[\[(.+?)\]\]/g;

/**
 * Rend une chaine en surlignant ce qui est entre `[[ ]]`.
 *
 * Une chaine SANS marqueur ressort telle quelle, sans le moindre element en
 * plus : c'est ce qui permet de brancher ce rendu partout sans avoir a trier
 * les phrases marquees des autres.
 */
export function surligne(texte: string): React.ReactNode {
  if (!texte.includes('[[')) return texte;

  const bouts: React.ReactNode[] = [];
  let curseur = 0;
  let m: RegExpExecArray | null;
  MARQUEUR.lastIndex = 0;
  while ((m = MARQUEUR.exec(texte)) !== null) {
    if (m.index > curseur) bouts.push(texte.slice(curseur, m.index));
    // `[[label>>cible]]` devient un LIEN, `[[texte]]` reste un surlignage. On
    // reste dans le meme marqueur : celui qui ecrit la phrase decide, dedans,
    // ce qui compte — un mot clef ou un renvoi vers une autre section (#ancre)
    // ou un lien externe (http).
    const sep = m[1].indexOf('>>');
    if (sep !== -1) {
      const label = m[1].slice(0, sep);
      const cible = m[1].slice(sep + 2);
      const interne = cible.startsWith('#');
      bouts.push(
        <a
          key={`${m.index}`}
          href={cible}
          {...(interne ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          className="cava-navlink"
          style={{ color: 'var(--cava-pink)', fontWeight: 600 }}
        >
          {label}
        </a>,
      );
    } else {
      bouts.push(
        <mark key={`${m.index}`} className="cava-cle">
          {m[1]}
        </mark>,
      );
    }
    curseur = m.index + m[0].length;
  }
  if (curseur < texte.length) bouts.push(texte.slice(curseur));
  return bouts;
}

/**
 * LE TEXTE NU — pour tout ce qui ressort de sa page.
 *
 * Les phrases de `i18n` ne servent pas qu'a la page qui les affiche : « Demander »
 * les rend telles quelles dans le chat, et le quiz y pioche l'extrait qui
 * justifie sa reponse. Ces deux-la afficheraient les crochets EN CLAIR — et
 * pire, la coupure du chat compte les signes, marqueurs compris, et pourrait
 * trancher un `[[` en deux.
 *
 * C'est le genre de degat qu'on ne voit qu'en production, parce qu'il ne casse
 * rien : ça compile, ça s'affiche, c'est juste faux. Le marqueur se retire donc
 * a la source, la ou le texte quitte sa page.
 */
export const sansMarques = (texte: string) =>
  texte.replace(/\[\[(.+?)\]\]/g, (_, inner: string) => {
    // Un lien `[[label>>cible]]` ne laisse que son label : le chat et le quiz
    // reprennent le texte, pas la destination.
    const sep = inner.indexOf('>>');
    return sep !== -1 ? inner.slice(0, sep) : inner;
  });

/**
 * La meme chose en composant, pour les endroits ou l'on rend une liste.
 *
 * `<mark>` PLUTOT QU'UN `<span>` : un lecteur d'ecran annonce le premier comme
 * une mise en evidence, et ne dit rien du second. Le surlignage cesserait
 * d'exister pour qui n'y voit pas — alors que c'est justement le lecteur qui a
 * le plus besoin qu'on lui designe l'essentiel.
 */
export default function Surligne({ texte }: { texte: string }) {
  return <>{surligne(texte)}</>;
}
