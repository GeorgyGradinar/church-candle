<template>
  <section class="page-shell">
    <div v-if="loading" class="loading">
      <p>Загрузка молитвы...</p>
    </div>

    <div v-else-if="prayer" class="prayer-detail">
      <!-- Хлебные крошки -->
      <Breadcrumbs
        :items="[
          { label: 'Главная', href: '/' },
          { label: 'Молитвы', href: '/prayers' }
        ]"
        :current="prayer?.title || 'Молитва'"
      />

      <button @click="goBack" class="back-btn">
        ← Назад к списку молитв
      </button>

      <header class="prayer-header">
        <h1>{{ prayer?.title || '' }}</h1>
        <span v-if="prayer.section" class="prayer-category">
          {{ prayer.section }}
        </span>
      </header>

      <div class="prayer-content">
        <div class="prayer-text" v-html="formatPrayerText(getPrayerText(prayer))"></div>
      </div>

      <div v-if="getPrayerNote(prayer)" class="prayer-note">
        <small>{{ getPrayerNote(prayer) }}</small>
      </div>
    </div>

    <div v-else class="no-results">
      <p>Молитва не найдена.</p>
      <button @click="goBack" class="back-btn">
        ← Назад к списку молитв
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watchEffect } from "vue";
import { HEADER_PARAMETERS, STRAPI_TOKEN } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";
import Breadcrumbs from "~/components/Breadcrumbs.vue";

const route = useRoute();
const slug = route.params.slug as string;

// Функция загрузки молитвы
async function fetchPrayer(slugValue: string) {
  const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content, HEADER_PARAMETERS.authorization];
  const headersConfig = getHeaders("GET", header, STRAPI_TOKEN);
  const { redirect, ...fetchOptions } = headersConfig;
  
  // Проверяем, является ли slug числом (fallback на id)
  const isNumeric = !isNaN(Number(slugValue));
  
  let url: string;
  if (isNumeric) {
    // Если slug - это число, используем прямой запрос по id
    url = `https://strapi.botinex.ru/api/prayers/${slugValue}?populate[populate]=*&locale=ru`;
    
    const response = await $fetch<{
      data?: {
        id?: number;
        attributes?: any;
      };
    }>(
      url,
      fetchOptions as any
    );

    if (response?.data) {
      const item = response.data;
      if (item) {
        const prayerData = item.attributes || item;
        return {
          id: prayerData.id || item.id,
          slug: prayerData.slug || slugValue,
          title: prayerData.title || prayerData.Title,
          text: prayerData.text || prayerData.Text || prayerData.content || '',
          note: prayerData.note || prayerData.Note || prayerData.description || '',
          section: prayerData.section?.data?.attributes?.title || prayerData.section?.title || ''
        };
      }
    }
  } else {
    // Используем фильтр по slug
    url = `https://strapi.botinex.ru/api/prayers?filters[slug][$eq]=${encodeURIComponent(slugValue)}&populate[populate]=*&locale=ru`;
    
    let response = await $fetch<{
      data?: Array<{
        id?: number;
        attributes?: any;
      }>;
    }>(
      url,
      fetchOptions as any
    );

    // Если не найдено по slug, пробуем найти по id (если slug был сгенерирован из id)
    if (!response?.data || response.data.length === 0) {
      if (!isNaN(Number(slugValue))) {
        url = `https://strapi.botinex.ru/api/prayers/${slugValue}?populate[populate]=*&locale=ru`;
        const singleResponse = await $fetch<{
          data?: {
            id?: number;
            attributes?: any;
          };
        }>(
          url,
          fetchOptions as any
        );
        
        if (singleResponse?.data) {
          const item = singleResponse.data;
          if (item) {
            const prayerData = item.attributes || item;
            return {
              id: prayerData.id || item.id,
              slug: prayerData.slug || slugValue,
              title: prayerData.title || prayerData.Title,
              text: prayerData.text || prayerData.Text || prayerData.content || '',
              note: prayerData.note || prayerData.Note || prayerData.description || '',
              section: prayerData.section?.data?.attributes?.title || prayerData.section?.title || ''
            };
          }
        }
      }
      return null;
    }

    if (response?.data && response.data.length > 0) {
      const item = response.data[0];
      if (item) {
        const prayerData = item.attributes || item;
        return {
          id: prayerData.id || item.id,
          slug: prayerData.slug || slugValue,
          title: prayerData.title || prayerData.Title,
          text: prayerData.text || prayerData.Text || prayerData.content || '',
          note: prayerData.note || prayerData.Note || prayerData.description || '',
          section: prayerData.section?.data?.attributes?.title || prayerData.section?.title || ''
        };
      }
    }
  }
  
  return null;
}

// Загрузка данных через useAsyncData для SSR
const { data: prayer, pending: loading, error } = await useAsyncData(
  `prayer-${slug}`,
  () => fetchPrayer(slug),
  {
    server: true,
    default: () => null
  }
);

// SEO мета-теги
const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

watchEffect(() => {
  if (prayer.value) {
    const prayerTitle = prayer.value.title || 'Молитва';
    const prayerText = prayer.value.text || prayer.value.Text || prayer.value.content || '';
    const prayerDescription = prayerText.length > 160 
      ? prayerText.substring(0, 157) + '...' 
      : prayerText || 'Православная молитва для ежедневного чтения';
    const prayerUrl = `${siteUrl}/prayers/${prayer.value.slug || slug}`;

    useHead({
      title: `${prayerTitle} - Православные молитвы`,
      meta: [
        {
          name: 'description',
          content: prayerDescription
        },
        {
          name: 'keywords',
          content: `православная молитва, ${prayerTitle}, молитвослов, церковные молитвы, православие`
        },
        // Open Graph
        {
          property: 'og:title',
          content: prayerTitle
        },
        {
          property: 'og:description',
          content: prayerDescription
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          property: 'og:url',
          content: prayerUrl
        },
        {
          property: 'og:locale',
          content: 'ru_RU'
        },
        // Twitter Card
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:title',
          content: prayerTitle
        },
        {
          name: 'twitter:description',
          content: prayerDescription
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: prayerUrl
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: prayerTitle,
            description: prayerDescription,
            url: prayerUrl,
            inLanguage: 'ru-RU',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Дом свечи',
              url: siteUrl
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': prayerUrl
            }
          })
        }
      ]
    });
  } else {
    // SEO по умолчанию, если молитва не загружена
    useHead({
      title: 'Молитва - Православные молитвы',
      meta: [
        {
          name: 'description',
          content: 'Православная молитва для ежедневного чтения и молитвенной жизни.'
        },
        {
          property: 'og:title',
          content: 'Молитва - Православные молитвы'
        },
        {
          property: 'og:description',
          content: 'Православная молитва для ежедневного чтения и молитвенной жизни.'
        },
        {
          property: 'og:url',
          content: `${siteUrl}/prayers/${slug}`
        }
      ]
    });
  }
});

function formatPrayerText(text: string): string {
  if (!text) return '';
  
  // Разделяем текст на предложения и форматируем
  return text
    .split(/[.!?]\s+/)
    .filter(s => s.trim().length > 0)
    .map((sentence, index, array) => {
      const trimmed = sentence.trim();
      if (index < array.length - 1 && !trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?')) {
        return trimmed + '.';
      }
      return trimmed;
    })
    .join('<br><br>');
}

function getPrayerText(prayer: any): string {
  return prayer?.text || prayer?.Text || prayer?.content || '';
}

function getPrayerNote(prayer: any): string {
  return prayer?.note || prayer?.Note || prayer?.description || '';
}

function goBack() {
  navigateTo('/prayers');
}

</script>

<style scoped lang="scss">
.page-shell {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;

  .loading {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
  }

  .back-btn {
    margin-bottom: 2rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid #cbd5f5;
    border-radius: 12px;
    background: #fff;
    color: #475569;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #0ea5e9;
      color: #0ea5e9;
      background: #f0f9ff;
    }
  }

  .prayer-detail {
    .prayer-header {
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;

      h1 {
        margin: 0;
        color: #0f172a;
        font-size: 2rem;
        flex: 1;
      }

      .prayer-category {
        padding: 0.5rem 1rem;
        border-radius: 999px;
        background: #f1f5f9;
        color: #64748b;
        font-size: 0.9rem;
        white-space: nowrap;
      }
    }

    .prayer-content {
      margin-bottom: 2rem;

      .prayer-text {
        color: #475569;
        line-height: 2;
        font-size: 1.1rem;

        :deep(br) {
          margin-bottom: 0.75rem;
        }
      }
    }

    .prayer-note {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #f1f5f9;

      small {
        color: #64748b;
        font-style: italic;
        font-size: 0.95rem;
      }
    }
  }

  .no-results {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;

    .back-btn {
      margin-top: 1.5rem;
    }
  }
}

@media (max-width: 640px) {
  .page-shell {
    padding: 2rem 1rem 3rem;

    .prayer-detail {
      .prayer-header {
        flex-direction: column;
        gap: 1rem;

        h1 {
          font-size: 1.5rem;
        }

        .prayer-category {
          align-self: flex-start;
        }
      }

      .prayer-content {
        .prayer-text {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>

