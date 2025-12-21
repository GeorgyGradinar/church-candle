<template>
  <section class="page-shell">
    <div v-if="loading" class="loading">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goToCalendar" class="back-btn">
        ← Вернуться к календарю
      </button>
    </div>

    <div v-else class="day-detail">
      <!-- Хлебные крошки -->
      <Breadcrumbs
        :items="[
          { label: 'Главная', href: '/' },
          { label: 'Календарь', href: '/calendar' }
        ]"
        :current="formattedDate"
      />

      <!-- Навигация между днями -->
      <div class="day-navigation">
        <NuxtLink
          v-if="previousDayUrl"
          :to="previousDayUrl"
          class="nav-btn prev-btn"
        >
          ← Предыдущий день
        </NuxtLink>
        <span v-else class="nav-btn prev-btn disabled">
          ← Предыдущий день
        </span>
        <button @click="goToCalendar" class="back-btn">
          Вернуться к календарю
        </button>
        <NuxtLink
          v-if="nextDayUrl"
          :to="nextDayUrl"
          class="nav-btn next-btn"
        >
          Следующий день →
        </NuxtLink>
        <span v-else class="nav-btn next-btn disabled">
          Следующий день →
        </span>
      </div>

      <!-- Заголовок с датой -->
      <header class="day-header">
        <h1>{{ formattedDate }}</h1>
        <p v-if="dayOfWeek" class="day-of-week">{{ dayOfWeek }}</p>
      </header>

      <!-- Список событий дня -->
      <div v-if="events.length > 0" class="events-list">
        <article
          v-for="event in events"
          :key="event.id"
          class="event-card"
        >
          <div class="event-header">
            <h2>{{ event.title }}</h2>
            <span :class="['event-type-badge', `badge-${event.type}`]">
              {{ getEventTypeName(event.type) }}
            </span>
          </div>

          <div v-if="event.description" class="event-description">
            <h3>Описание:</h3>
            <p>{{ event.description }}</p>
          </div>

          <div v-if="event.troparion" class="event-troparion">
            <h3>Тропарь:</h3>
            <p class="troparion-text">{{ event.troparion }}</p>
          </div>

          <div class="event-actions">
            <button @click="lightCandle(event)" class="candle-btn">
              🕯️ Поставить свечу
            </button>
          </div>
        </article>
      </div>

      <div v-else class="no-events">
        <p>В этот день нет особых церковных событий в календаре.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  monthNames,
  fullDayNames,
  categories,
  getEventsByDate,
} from '~/configs/orthodoxCalendarData.js';
import Breadcrumbs from '~/components/Breadcrumbs.vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

// Парсинг даты из URL
const dateParam = route.params.date as string;
const loading = ref(false);
const error = ref<string | null>(null);

// Парсинг даты
let parsedDate: { year: number; month: number; day: number } | null = null;

try {
  const [year, month, day] = dateParam.split('-').map(Number);

  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error('Неверный формат даты');
  }

  // Валидация даты
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error('Неверная дата');
  }

  // Проверка диапазона года (1900-2100)
  if (year < 1900 || year > 2100) {
    throw new Error('Год вне допустимого диапазона');
  }

  parsedDate = { year, month, day };
} catch (e) {
  error.value = 'Неверный формат даты. Используйте формат YYYY-MM-DD';
  parsedDate = null;
}

// Получение событий дня
const events = computed(() => {
  if (!parsedDate) return [];
  return getEventsByDate(parsedDate.month, parsedDate.day, parsedDate.year);
});

// Форматирование даты для отображения
const formattedDate = computed(() => {
  if (!parsedDate) return '';
  const date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day);
  const dayOfWeekName = fullDayNames[date.getDay()];
  return `${parsedDate.day} ${monthNames[parsedDate.month - 1]} ${parsedDate.year}`;
});

const dayOfWeek = computed(() => {
  if (!parsedDate) return '';
  const date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day);
  return fullDayNames[date.getDay()];
});

// Навигация между днями
function formatDateForUrl(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getPreviousDay() {
  if (!parsedDate) return null;
  const date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day);
  date.setDate(date.getDate() - 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function getNextDay() {
  if (!parsedDate) return null;
  const date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day);
  date.setDate(date.getDate() + 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

const previousDayUrl = computed(() => {
  const prev = getPreviousDay();
  if (!prev) return null;
  return `/calendar/${formatDateForUrl(prev.year, prev.month, prev.day)}`;
});

const nextDayUrl = computed(() => {
  const next = getNextDay();
  if (!next) return null;
  return `/calendar/${formatDateForUrl(next.year, next.month, next.day)}`;
});

function goToCalendar() {
  router.back();
}

function getEventTypeName(type: string): string {
  const category = categories.find(c => c.id === type);
  return category ? category.name : type;
}

function lightCandle(event: any) {
  const candleType = event.type === 'saint' ? 'living' : 'living';
  router.push({
    path: `/${candleType}`,
    query: {
      saint: event.title,
      date: `${event.day}.${event.month}`,
    },
  });
}

// SEO мета-теги
watchEffect(() => {
  if (!parsedDate || error.value) return;

  const dateStr = formattedDate.value;
  const eventsList = events.value;

  // Формируем описание из событий
  let description = `Православный календарь на ${dateStr}. `;
  if (eventsList.length > 0) {
    const eventTitles = eventsList.map(e => e.title).join(', ');
    description += `События дня: ${eventTitles}.`;
  } else {
    description += 'Церковные праздники и дни памяти святых.';
  }

  // Формируем ключевые слова
  const keywords = [
    'православный календарь',
    dateStr,
    parsedDate.year.toString(),
    monthNames[parsedDate.month - 1]?.toLowerCase() || '',
  ];
  if (eventsList.length > 0) {
    eventsList.forEach(e => {
      keywords.push(e.title.toLowerCase());
    });
  }

  const pageUrl = `${siteUrl}/calendar/${dateParam}`;

  useHead({
    title: `${dateStr} - Православный календарь`,
    meta: [
      {
        name: 'description',
        content: description.length > 160 ? description.substring(0, 157) + '...' : description,
      },
      {
        name: 'keywords',
        content: keywords.join(', '),
      },
      // Open Graph
      {
        property: 'og:title',
        content: `${dateStr} - Православный календарь`,
      },
      {
        property: 'og:description',
        content: description.length > 200 ? description.substring(0, 197) + '...' : description,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: pageUrl,
      },
      {
        property: 'og:locale',
        content: 'ru_RU',
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: `${dateStr} - Православный календарь`,
      },
      {
        name: 'twitter:description',
        content: description.length > 200 ? description.substring(0, 197) + '...' : description,
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: pageUrl,
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${dateStr} - Православный календарь`,
          description: description,
          datePublished: `${parsedDate.year}-${String(parsedDate.month).padStart(2, '0')}-${String(parsedDate.day).padStart(2, '0')}`,
          dateModified: `${parsedDate.year}-${String(parsedDate.month).padStart(2, '0')}-${String(parsedDate.day).padStart(2, '0')}`,
          author: {
            '@type': 'Organization',
            name: 'Дом свечи',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Дом свечи',
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl,
          },
          about: eventsList.length > 0 ? eventsList.map(event => ({
            '@type': 'Event',
            name: event.title,
            description: event.description || '',
            eventType: event.type,
          })) : {
            '@type': 'Thing',
            name: 'Православный календарь',
          },
        }),
      },
    ],
  });
});
</script>

<style scoped lang="scss">
.page-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.loading,
.error {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.error {
  color: #dc2626;
}

.day-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.nav-btn,
.back-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  background: #fff;
  color: #0ea5e9;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;

  &:hover:not(:disabled):not(.disabled) {
    background: #0ea5e9;
    color: #fff;
  }

  &:disabled,
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.back-btn {
  border-color: #64748b;
  color: #64748b;

  &:hover {
    background: #64748b;
    color: #fff;
  }
}

.day-header {
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.5rem;
    color: #0f172a;
    margin: 0 0 0.5rem 0;
  }

  .day-of-week {
    font-size: 1.25rem;
    color: #64748b;
    margin: 0;
  }
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.event-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  background: #fafafa;

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;

    h2 {
      margin: 0;
      color: #0f172a;
      font-size: 1.75rem;
      flex: 1;
    }

    .event-type-badge {
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;

      &.badge-great_feast,
      &.badge-twelve_feast {
        background: #fef3c7;
        color: #92400e;
      }

      &.badge-saint {
        background: #dbeafe;
        color: #1e40af;
      }

      &.badge-fast {
        background: #f3e8ff;
        color: #6b21a8;
      }

      &.badge-commemoration {
        background: #f1f5f9;
        color: #475569;
      }

      &.badge-special {
        background: #d1fae5;
        color: #065f46;
      }
    }
  }

  .event-description,
  .event-troparion {
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1rem;
      color: #64748b;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.875rem;
      font-weight: 600;
    }

    p {
      color: #475569;
      line-height: 1.8;
      margin: 0;
    }

    .troparion-text {
      font-style: italic;
      background: #fff;
      padding: 1.25rem;
      border-radius: 12px;
      border-left: 4px solid #0ea5e9;
    }
  }

  .event-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;

    .candle-btn {
      padding: 0.875rem 1.75rem;
      border: 2px solid #0ea5e9;
      border-radius: 12px;
      background: #fff;
      color: #0ea5e9;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        background: #0ea5e9;
        color: #fff;
      }
    }
  }
}

.no-events {
  text-align: center;
  padding: 4rem 1rem;
  color: #64748b;
  font-size: 1.125rem;
}

@media (max-width: 1024px) {
  .page-shell {
    padding: 2.5rem 1rem 3.5rem;
  }
}

@media (max-width: 768px) {
  .page-shell {
    padding: 2rem 0.75rem 3rem;
  }

  .day-navigation {
    flex-direction: column;
    align-items: stretch;

    .nav-btn,
    .back-btn {
      width: 100%;
      text-align: center;
    }
  }

  .day-header {
    h1 {
      font-size: 2rem;
    }

    .day-of-week {
      font-size: 1.125rem;
    }
  }

  .event-card {
    padding: 1.5rem;

    .event-header {
      flex-direction: column;
      gap: 0.75rem;

      h2 {
        font-size: 1.5rem;
      }

      .event-type-badge {
        align-self: flex-start;
      }
    }
  }
}

@media (max-width: 480px) {
  .page-shell {
    padding: 1.5rem 0.5rem 2.5rem;
  }

  .day-header {
    h1 {
      font-size: 1.75rem;
    }
  }

  .event-card {
    padding: 1.25rem;

    .event-header h2 {
      font-size: 1.25rem;
    }
  }
}
</style>

