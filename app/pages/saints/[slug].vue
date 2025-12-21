<template>
  <section class="page-shell">
    <div v-if="loading" class="loading">
      <p>Загрузка жития святого...</p>
    </div>

    <div v-else-if="saint" class="saint-detail">
      <Breadcrumbs
        :items="[
          { label: 'Главная', href: '/' },
          { label: 'Святые', href: '/saints' }
        ]"
        :current="saint?.name || 'Святой'"
      />

      <button @click="goBack" class="back-btn">
        ← Назад к списку святых
      </button>

      <header class="saint-header">
        <h1>{{ saint?.name || '' }}</h1>
        <div class="saint-meta">
          <span v-if="saint.sanctityType" class="saint-type">
            {{ saint.sanctityType }}
          </span>
          <div v-if="saint.memoryDay" class="memory-day-wrapper">
            <span class="memory-day-label">День памяти:</span>
            <template v-if="memoryDates && memoryDates.length > 0">
              <template v-for="(date, index) in memoryDates" :key="index">
                <NuxtLink
                    :to="`/calendar/${formatDateForUrl(date.year, date.month, date.day)}`"
                    class="memory-day-link"
                >
                  {{ date.day }} {{ getMonthName(date.month) }}
                </NuxtLink>
                <span v-if="index < memoryDates.length - 1" class="memory-day-separator">, </span>
              </template>
            </template>
            <span v-else class="memory-day-text">{{ saint.memoryDay }}</span>
          </div>
        </div>
      </header>

      <div v-if="saint.century" class="saint-info">
        <p><strong>Век:</strong> {{ saint.century }}</p>
      </div>

      <div class="saint-content">
        <div class="saint-life" v-html="formatText(saint.fullLife)"></div>
      </div>
    </div>

    <div v-else class="no-results">
      <p>Святой не найден.</p>
      <button @click="goBack" class="back-btn">
        ← Назад к списку святых
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watchEffect, computed } from "vue";
import { saintsData } from "~/configs/saintsData.js";
import { monthNames } from "~/configs/orthodoxCalendarData.js";
import Breadcrumbs from "~/components/Breadcrumbs.vue";

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;

function fetchSaint(slugValue: string) {
  const saint = saintsData.find(s => s.slug === slugValue);
  return Promise.resolve(saint || null);
}

function parseMemoryDay(memoryDay: string | undefined): Array<{ day: number; month: number; year: number }> | null {
  if (!memoryDay) return null;

  const currentYear = new Date().getFullYear();
  const monthMap: Record<string, number> = {
    'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4,
    'мая': 5, 'июня': 6, 'июля': 7, 'августа': 8,
    'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
  };

  const dates: Array<{ day: number; month: number; year: number }> = [];
  
  const regex = /(\d+)\s+([а-яё]+)/gi;
  let match;
  
  while ((match = regex.exec(memoryDay)) !== null) {
    if (match[1] && match[2]) {
      const day = parseInt(match[1], 10);
      const monthName = match[2].toLowerCase();
      const month = monthMap[monthName];

      if (month && day >= 1 && day <= 31) {
        dates.push({ day, month, year: currentYear });
      }
    }
  }

  return dates.length > 0 ? dates : null;
}

function formatDateForUrl(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getMonthName(month: number): string {
  const index = month - 1;
  return (index >= 0 && index < monthNames.length) ? (monthNames[index] ?? '') : '';
}

const { data: saint, pending: loading } = await useAsyncData(
  `saint-${slug}`,
  () => fetchSaint(slug),
  {
    server: true,
    default: () => null
  }
);

const memoryDates = computed(() => {
  if (!saint.value?.memoryDay) return null;
  return parseMemoryDay(saint.value.memoryDay);
});

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

watchEffect(() => {
  if (saint.value) {
    const saintName = saint.value.name || 'Святой';
    const saintDescription = saint.value.shortDescription || 'Житие православного святого';
    const saintUrl = `${siteUrl}/saints/${saint.value.slug || slug}`;

    useHead({
      title: `${saintName} - Жития святых`,
      meta: [
        {
          name: 'description',
          content: saintDescription
        },
        {
          name: 'keywords',
          content: `житие святого, ${saintName}, православные святые, ${saint.value.sanctityType || ''}, православие`
        },
        {
          property: 'og:title',
          content: saintName
        },
        {
          property: 'og:description',
          content: saintDescription
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          property: 'og:url',
          content: saintUrl
        },
        {
          property: 'og:locale',
          content: 'ru_RU'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:title',
          content: saintName
        },
        {
          name: 'twitter:description',
          content: saintDescription
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: saintUrl
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: saintName,
            description: saintDescription,
            url: saintUrl,
            inLanguage: 'ru-RU',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Слово веры',
              url: siteUrl
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': saintUrl
            }
          })
        }
      ]
    });
  } else {
    useHead({
      title: 'Святой - Жития святых',
      meta: [
        {
          name: 'description',
          content: 'Житие православного святого.'
        },
        {
          property: 'og:title',
          content: 'Святой - Жития святых'
        },
        {
          property: 'og:description',
          content: 'Житие православного святого.'
        },
        {
          property: 'og:url',
          content: `${siteUrl}/saints/${slug}`
        }
      ]
    });
  }
});

function formatText(text: string): string {
  if (!text) return '';
  
  return text
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0)
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
}

function goBack() {
  navigateTo('/saints');
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

  .saint-detail {
    .saint-header {
      margin-bottom: 2rem;

      h1 {
        margin: 0 0 1rem 0;
        color: #0f172a;
        font-size: 2rem;
      }

      .saint-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;

        .saint-type {
          padding: 0.5rem 1rem;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .memory-day-wrapper {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0;
          color: #475569;
          font-size: 0.95rem;

          .memory-day-label {
            color: #475569;
            margin-right: 0.5rem;
          }

          .memory-day-link {
            color: #0ea5e9;
            font-size: 0.95rem;
            text-decoration: none;
            transition: all 0.2s ease;

            &:hover {
              color: #0369a1;
              text-decoration: underline;
            }
          }

          .memory-day-separator {
            color: #475569;
          }

          .memory-day-text {
            color: #475569;
          }
        }
      }
    }

    .saint-info {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      color: #475569;
      font-size: 0.95rem;

      p {
        margin: 0;
      }
    }

    .saint-content {
      margin-bottom: 2rem;

      .saint-life {
        color: #475569;
        line-height: 2;
        font-size: 1.1rem;

        :deep(p) {
          margin-bottom: 1.5rem;
        }

        :deep(p:last-child) {
          margin-bottom: 0;
        }
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

    .saint-detail {
      .saint-header {
        h1 {
          font-size: 1.5rem;
        }

        .saint-meta {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .saint-content {
        .saint-life {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>

