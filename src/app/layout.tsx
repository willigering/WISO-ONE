import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import './globals.css';
export const metadata: Metadata = {
  title: 'WISO//ONE — Wirtschaft verstehen. Prüfung bestehen.',
  description:
    'Dein persönlicher WISO-Lernraum für Fachinformatiker. Interaktive Marktformen, Kaufmannseigenschaft, Falltraining und Prüfungssimulation.',
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
