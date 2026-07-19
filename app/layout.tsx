import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import { LanguageProvider } from './i18n';
import Assistant from './Assistant';

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
