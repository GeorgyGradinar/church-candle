// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    "~/assets/main.css",
    'vuetify/lib/styles/main.sass',
  ],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      SITE_URL: process.env.NUXT_SITE_URL,
    },
  },

  modules: ['nuxt-svgo', '@pinia/nuxt'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s | Дом свечи',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})