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
    typeCheck: true, 
  },

  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/i18n',
  ],

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

  // View Transitions API for cinematic page transitions
  experimental: {
    viewTransition: true,
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
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      style: [
        {
          // Critical CSS to prevent FOUC - hide body until Vue hydrates
          innerHTML: `html{background:#191724}body{opacity:0}.hydrated body{opacity:1;transition:opacity 0.15s ease-out}`,
        },
      ],
    },
  },

  // Route rules for ISR (Vercel deployment)
  routeRules: {
    '/': { prerender: true },
    '/anime/**': { isr: 3600 }, // Revalidate hourly
    '/api/jikan/**': {
      cache: { maxAge: 600 }, // 10 minute edge cache
      headers: { 'cache-control': 's-maxage=600, stale-while-revalidate' },
    },
  },

  // Nitro configuration
  nitro: {
    compressPublicAssets: true,
  },
})
