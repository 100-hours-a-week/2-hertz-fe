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
  themeColor: '#ffffff',
  viewport:
    'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover',
  icons: {
    icon: '/icons/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} font-pretendard flex h-[calc(screen-32px)] min-h-screen touch-manipulation flex-col items-center overscroll-none bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat`}
      >
        <Providers>
          <ClientLayoutContent>
            <div className="mx-auto flex h-[calc(screen-32px)] w-full max-w-md flex-col bg-white">
              {children}
            </div>
          </ClientLayoutContent>
        </Providers>
        <Toaster />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
