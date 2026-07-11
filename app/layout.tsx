import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import { LanguageProvider } from './i18n';

export const metadata: Metadata = {
  title: "Cava d'Aliga — un village du sud-est de la Sicile",
  description:
    "Location d'un appartement de plain-pied à Cava d'Aliga, hameau marin de Scicli, province de Raguse. Informations pratiques, services locaux, région et transports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <div className="cava-root min-h-screen">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
