import type { Metadata, Viewport } from 'next';
import './globals.css';
import RegisterSW from '@/components/RegisterSW';

export const metadata: Metadata = {
  title: 'GEKKO FIT — трекер тренировок',
  description: 'Трекер тренировок с системой XP, рангами и streak-множителем. Леопардовый геккон ждёт вашего прогресса.',
  icons: [{ rel: 'icon', url: '/logo.jpg' }],
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'GEKKO FIT' },
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}