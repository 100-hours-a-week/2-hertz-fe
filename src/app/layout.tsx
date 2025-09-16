import '@app/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import OptimizedClientLayout from '@/components/layout/OptimizedClientLayout';
import Providers from './providers';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const ServiceWorkerRegister = dynamic(() => import('@components/ServiceWorkerRegister'), {
  loading: () => null,
});

const DynamicToaster = dynamic(() => import('@/components/common/DynamicToaster'), {
  loading: () => null,
});

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  preload: true,
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
      <head>
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link rel="preload" href="/images/bg.avif" as="image" />
        <link rel="preload" href="/icons/logo-blue.png" as="image" />
        <link rel="preload" href="/images/tuny1.avif" as="image" />
        <link rel="preload" href="/images/tuny2.avif" as="image" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="//www.googletagmanager.com" crossOrigin="" />
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WQJ56TG4');
          `}
        </Script>
      </head>
      <body
        className={`${pretendard.variable} font-pretendard flex min-h-screen touch-manipulation flex-col items-center overscroll-none`}
        style={{
          backgroundImage: `url('/images/bg.avif'), url('/images/bg.webp'), url('/images/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WQJ56TG4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <OptimizedClientLayout>
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-white">
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </OptimizedClientLayout>
        </Providers>
        <DynamicToaster />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
