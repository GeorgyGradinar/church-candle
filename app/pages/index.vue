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
  </section>
</template>

<script setup lang="ts">
import UpcomingEvents from '~/components/UpcomingEvents.vue';
import ActionCards from '~/components/ActionCards.vue';

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

useHead({
  title: 'Место тихой молитвы - Дом свечи',
  meta: [
    {
      name: 'description',
      content: 'Ваш маленький свет в большой молитве. Подайте записки о здравии и упокоении, зажгите свечу, узнайте о церковных праздниках и читайте православные молитвы.'
    },
    {
      name: 'keywords',
      content: 'молитва, свеча, церковь, записки о здравии, записки об упокоении, православные молитвы, церковный календарь, поминовение'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Место тихой молитвы - Дом свечи'
    },
    {
      property: 'og:description',
      content: 'Ваш маленький свет в большой молитве. Подайте записки, зажгите свечу, узнайте о церковных праздниках.'
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
      content: 'Место тихой молитвы - Дом свечи'
    },
    {
      name: 'twitter:description',
      content: 'Ваш маленький свет в большой молитве. Подайте записки, зажгите свечу, узнайте о церковных праздниках.'
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
        name: 'Дом свечи',
        description: 'Место тихой молитвы. Подайте записки о здравии и упокоении, зажгите свечу, узнайте о церковных праздниках.',
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


