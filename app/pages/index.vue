<template>
  <section class="page-shell">
    <div class="hero">
      <h1>Место тихой молитвы</h1>
      <p>Ваш маленький свет в большой молитве</p>
    </div>

    <div class="actions-wrapper">
      <ActionCards />
    </div>

    <UpcomingEvents :limit="3" />
    <TextForMainPage />
  </section>
</template>

<script setup lang="ts">
import UpcomingEvents from '~/components/UpcomingEvents.vue';
import ActionCards from '~/components/ActionCards.vue';
import TextForMainPage from '~/components/index/TextForMainPage.vue';

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

useHead({
  title: 'Православные молитвы, свечи и церковный календарь — духовная информация',
  meta: [
    {
      name: 'description',
      content: 'Молитвы за здравие и за упокой, постановка свечи, православный календарь праздников и памятных дней. Спокойный и уважительный духовный ресурс.'
    },
    {
      name: 'keywords',
      content: 'молитва, свеча, церковь, записки о здравии, записки об упокоении, православные молитвы, церковный календарь, поминовение'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Православные молитвы, свечи и церковный календарь — духовная информация'
    },
    {
      property: 'og:description',
      content: 'Молитвы за здравие и за упокой, постановка свечи, православный календарь праздников и памятных дней. Спокойный и уважительный духовный ресурс.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: siteUrl
    },
    {
      property: 'og:locale',
      content: 'ru_RU'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Православные молитвы, свечи и церковный календарь — духовная информация'
    },
    {
      name: 'twitter:description',
      content: 'Молитвы за здравие и за упокой, постановка свечи онлайн, православный календарь праздников и памятных дней. Спокойный и уважительный духовный ресурс.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: siteUrl
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Слово веры',
        description: 'Молитвы за здравие и за упокой, постановка свечи онлайн, православный календарь праздников и памятных дней. Спокойный и уважительный духовный ресурс.',
        url: siteUrl,
        inLanguage: 'ru-RU',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/prayers?search={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
});
</script>

<style scoped>
.page-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.hero h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 0.75rem;
  color: #0f172a;
}

.hero p {
  color: #475569;
  line-height: 1.6;
}

.actions-wrapper {
  margin-bottom: 3rem;
}
</style>


