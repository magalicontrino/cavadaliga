import type { Metadata, Viewport } from 'next';
import './globals.css';
import './theme.css';
import { LanguageProvider } from './i18n';
import Assistant from './Assistant';

/**
 * Le viewport, avec `interactiveWidget: 'resizes-content'`.
 *
 * C'est LE reglage qui rend le chat utilisable au clavier sur telephone, et il
 * manquait. Sans lui, quand le clavier virtuel monte, le viewport de mise en
 * page ne bouge pas : une boite `fixed` ancree en bas reste plantee derriere
 * le clavier, et `100vh`/`bottom-0` visent une hauteur qui n'existe plus a
 * l'ecran. Je compensais ca a la main en JS — un bricolage que je n'ai jamais
 * pu verifier contre un vrai clavier.
 *
 * `resizes-content` demande au navigateur de RETRECIR la page quand le clavier
 * apparait (iOS 16+, Chrome Android). Du coup `dvh` et `fixed bottom` suivent
 * tout seuls : la boite se pose au-dessus du clavier sans une ligne de JS. La
 * gestion manuelle reste en repli pour les vieux iOS, ou elle ne fait rien des
 * que le navigateur s'en charge.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: "Cava d'Aliga — un village du sud-est de la Sicile",
  // Ce texte est ce que montrent Google et les apercus de partage. Il disait
  // « Location d'un appartement » : le site n'annonce rien, ne loue rien et
  // n'affiche aucun prix — c'est la maison de famille et son mode d'emploi pour
  // ceux qu'on y accueille. Le premier mot qu'on lit ne doit pas mentir.
  description:
    "La maison de famille à Cava d'Aliga, hameau marin de Scicli, province de Raguse. Infos pratiques, nos adresses, la région et le voyage — pour ceux qu'on y accueille.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <div className="cava-root min-h-screen">
            {children}
            {/* « Demander » vit ici, hors des pages : la question se pose
                d'ou qu'on soit, et sur place c'est souvent la seule chose
                qu'on veut faire. */}
            <Assistant />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
