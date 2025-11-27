// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      SITE_URL: process.env.NUXT_SITE_URL,
    },
  },

  modules: ['nuxt-svgo', '@pinia/nuxt'],
})