import ServiceWorkerRegister from '@components/ServiceWorkerRegister';
import '@app/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';
import ClientLayoutContent from '@/components/layout/ClientLayoutContent';
import Providers from './providers';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '튜닝',
  description: '조직 기반 소셜 매칭 서비스',
  manifest: '/manifest.webmanifest',
  themeColor: '#000000',
  viewport:
    'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=auto',
  icons: {
    icon: '/icons/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} font-pretendard flex min-h-screen flex-col items-center`}
      >
        <Providers>
          <ClientLayoutContent>{children}</ClientLayoutContent>
        </Providers>
        <Toaster />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
