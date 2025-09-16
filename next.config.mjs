/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1년 캐시
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
  },
  // 성능 최적화 설정
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // React 컴파일러 최적화
    reactRemoveProperties:
      process.env.NODE_ENV === 'production' ? { properties: ['^data-testid$'] } : false,
  },
  // 번들 크기 제한
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // HTTP/2 및 성능 최적화
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // JavaScript 압축 최적화
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)());
      return config;
    },
  }),
  experimental: {
    optimizePackageImports: [
      '@tanstack/react-query',
      'framer-motion',
      'react-hot-toast',
      'lucide-react',
      'react-icons',
      'react-dom',
      'axios',
      'socket.io-client',
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    // 번들 최적화
    optimizeCss: false, // CSS 최적화 비활성화로 JS 우선순위
  },
  // 서버 외부 패키지 최적화
  serverExternalPackages: ['sharp', 'bufferutil', 'utf-8-validate'],
  // Bundle 분석 최적화
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
      };

      // 프로덕션에서 번들 크기 최적화
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 2,
            maxAsyncRequests: 3,
            minSize: 30000,
            maxSize: 200000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 3,
            maxInitialRequests: 2,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
              },
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                priority: 20,
                enforce: true,
                maxSize: 100000,
              },
              next: {
                test: /[\\/]node_modules[\\/]next[\\/]/,
                name: 'next',
                chunks: 'all',
                priority: 18,
                maxSize: 150000,
              },
              icons: {
                test: /[\\/]node_modules[\\/]react-icons[\\/]/,
                name: 'react-icons',
                chunks: 'async',
                priority: 12,
                minSize: 0,
              },
              motion: {
                test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                name: 'framer-motion',
                chunks: 'async',
                priority: 11,
                minSize: 0,
              },
              query: {
                test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
                name: 'react-query',
                chunks: 'async',
                priority: 15,
                maxSize: 80000,
              },
              utils: {
                test: /[\\/]node_modules[\\/](axios|socket\.io-client|dayjs|immer)[\\/]/,
                name: 'utils',
                chunks: 'async',
                priority: 14,
                maxSize: 60000,
              },
              common: {
                name: 'common',
                minChunks: 3,
                chunks: 'all',
                priority: 5,
                enforce: true,
                maxSize: 100000,
              },
              large: {
                test: /[\\/]node_modules[\\/](framer-motion|react-icons|lucide-react)[\\/]/,
                name: 'large-libs',
                chunks: 'async',
                priority: 8,
                maxSize: 150000,
              },
            },
          },
        };
      }
    }
    return config;
  },
};

export default nextConfig;
