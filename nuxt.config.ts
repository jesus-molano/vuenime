// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt 4 compatibility mode
  future: {
    compatibilityVersion: 4,
  },

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: 'build',
  },

  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-security',
  ],

  // Security configuration
  security: {
    headers: {
      // Allow embedding YouTube videos for trailers
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'https:', 'data:', 'blob:'],
        'media-src': ["'self'", 'https://www.youtube.com', 'https://youtube.com'],
        'frame-src': ["'self'", 'https://www.youtube.com', 'https://youtube.com'],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:', 'blob:'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'connect-src': ["'self'", 'https:'],
        'worker-src': ["'self'", 'blob:'],
      },
      xFrameOptions: 'SAMEORIGIN',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
      },
    },
    // Disable rate limiting (handled by Jikan API proxy)
    rateLimiter: false,
    // Allow requests to external APIs
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000, // 2MB
      maxUploadFileRequestInBytes: 8000000, // 8MB
    },
  },

  // Supabase configuration - auth is optional, no forced redirects
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/',
      callback: '/confirm',
    },
    types: '~~/shared/types/database.ts',
  },

  // Image optimization - use 'none' provider for external CDN images
  image: {
    provider: 'none', // Don't proxy external images, serve directly from CDN
    domains: ['cdn.myanimelist.net'],
    quality: 100,
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // Icon configuration - bundle icons instead of fetching
  icon: {
    clientBundle: {
      scan: true, // Scan components for icons and bundle them
    },
  },

  // Nuxt UI configuration
  colorMode: {
    preference: 'system',
    fallback: 'dark',
  },

  // i18n configuration
  i18n: {
    langDir: 'locales',
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español' },
      { code: 'ja', language: 'ja-JP', file: 'ja.json', name: '日本語' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root',
    },
  },

  // View Transitions API and prefetch configuration
  experimental: {
    viewTransition: true,
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: { visibility: false, interaction: true }, // Prefetch on hover/focus like Next.js
      },
    },
  },

  // Runtime config for environment variables
  runtimeConfig: {
    jikanApiUrl: process.env.NUXT_JIKAN_API_URL || 'https://api.jikan.moe/v4',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  // App configuration
  app: {
    // Desactivar transiciones Vue clásicas para evitar conflictos con View Transitions API
    pageTransition: false,
    layoutTransition: false,
    head: {
      title: 'VueNime - Discover Your Next Anime',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Discover and track your favorite anime with VueNime' },
        { name: 'theme-color', content: '#191724' },
        // Open Graph
        { property: 'og:site_name', content: 'VueNime' },
        { property: 'og:type', content: 'website' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@vuenime' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Route rules for ISR (Vercel deployment)
  // Security headers are handled by nuxt-security module
  routeRules: {
    '/': { prerender: true },
    '/anime/**': {
      isr: 3600, // Revalidate hourly
      headers: {
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
    '/api/jikan/**': {
      cache: { maxAge: 600, staleMaxAge: 3600 },
      headers: {
        'cache-control': 's-maxage=600, stale-while-revalidate',
      },
    },
  },

  // Nitro configuration
  nitro: {
    compressPublicAssets: true,
  },

  // Vite configuration - proper code splitting
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vue core - separate chunk for framework
            if (id.includes('node_modules/@vue') || id.includes('node_modules/vue')) {
              return 'vue-vendor'
            }
            // Vue Router
            if (id.includes('node_modules/vue-router')) {
              return 'vue-router'
            }
            // Reka UI - base primitives for Nuxt UI
            if (id.includes('node_modules/reka-ui') || id.includes('node_modules/@reka-ui')) {
              return 'ui-primitives'
            }
            // Supabase client
            if (id.includes('node_modules/@supabase')) {
              return 'supabase'
            }
            // i18n
            if (id.includes('node_modules/vue-i18n') || id.includes('node_modules/@intlify')) {
              return 'i18n'
            }
            // State management
            if (id.includes('node_modules/pinia')) {
              return 'pinia'
            }
            // Validation
            if (id.includes('node_modules/zod')) {
              return 'zod'
            }
          },
        },
      },
    },
  },
})
