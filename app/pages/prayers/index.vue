<template>
  <section class="page-shell">
    <header>
      <p class="eyebrow">Молитвослов</p>
      <h1>Молитвы</h1>
      <p>
        Здесь собраны основные православные молитвы для ежедневного чтения и молитвенной жизни.
      </p>
    </header>

    <div class="search-section">
      <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Поиск по молитвам..."
          class="search-input"
      >
    </div>

    <div v-if="loading && displayedPrayers.length === 0" class="loading">
      <p>Загрузка молитв...</p>
    </div>

    <div v-else class="prayers-list">
      <article
          v-for="prayer in displayedPrayers"
          :key="prayer.id"
          class="prayer-card"
      >
        <div class="prayer-header">
          <h3>{{ prayer.title || prayer.Title || 'Без названия' }}</h3>
          <span
              v-if="prayer.section"
              class="prayer-category"
          >
            {{ prayer.section }}
          </span>
        </div>

        <div class="prayer-content">
          <div class="prayer-text" v-html="formatPrayerText(getPrayerText(prayer))"></div>
        </div>

        <div class="prayer-actions">
          <button
              @click="goToPrayer(prayer)"
              class="expand-btn"
          >
            Читать полностью
          </button>
        </div>

        <div v-if="getPrayerNote(prayer)" class="prayer-note">
          <small>{{ getPrayerNote(prayer) }}</small>
        </div>
      </article>
    </div>

    <div v-if="loadingMore" class="loading-more">
      <p>Загрузка...</p>
    </div>

    <div v-if="!hasMore && displayedPrayers.length > 0" class="end-message">
      <p>Все молитвы загружены</p>
    </div>

    <div v-if="!loading && displayedPrayers.length === 0" class="no-results">
      <p>{{ searchQuery ? 'Молитвы не найдены. Попробуйте изменить критерии поиска.' : 'Молитвы не найдены.' }}</p>
    </div>

    <div v-if="!searchQuery" ref="observerTarget" class="observer-target"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { HEADER_PARAMETERS, STRAPI_TOKEN } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

useHead({
  title: 'Православные молитвы - Молитвослов',
  meta: [
    {
      name: 'description',
      content: 'Здесь собраны основные православные молитвы для ежедневного чтения и молитвенной жизни. Найдите нужную молитву и читайте её онлайн.'
    },
    {
      name: 'keywords',
      content: 'православные молитвы, молитвослов, молитвы на русском, утренние молитвы, вечерние молитвы, молитвы святым, церковные молитвы, православие'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Православные молитвы - Молитвослов'
    },
    {
      property: 'og:description',
      content: 'Здесь собраны основные православные молитвы для ежедневного чтения и молитвенной жизни.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/prayers`
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
      content: 'Православные молитвы - Молитвослов'
    },
    {
      name: 'twitter:description',
      content: 'Здесь собраны основные православные молитвы для ежедневного чтения и молитвенной жизни.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/prayers`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Православные молитвы',
        description: 'Здесь собраны основные православные молитвы для ежедневного чтения и молитвенной жизни.',
        url: `${siteUrl}/prayers`,
        inLanguage: 'ru-RU',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Дом свечи',
          url: siteUrl
        },
        about: {
          '@type': 'Thing',
          name: 'Православные молитвы',
          description: 'Молитвослов с православными молитвами для ежедневного чтения'
        }
      })
    }
  ]
});

const loading = ref(false);
const loadingMore = ref(false);
const displayedPrayers = ref<any[]>([]);
const observerTarget = ref<HTMLElement | null>(null);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let observer: IntersectionObserver | null = null;

// Загрузка молитв из API
async function loadPrayers(page: number = 1, search: string = "") {
  if (loading.value && page === 1) return;
  if (loadingMore.value && page > 1) return;

  if (page === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content, HEADER_PARAMETERS.authorization];
    const headersConfig = getHeaders("GET", header, STRAPI_TOKEN);
    const { redirect, ...fetchOptions } = headersConfig;

    // Формируем URL с фильтрами поиска
    let url = `https://strapi.botinex.ru/api/prayers?populate[populate]=*&locale=ru&pagination[page]=${ page }&pagination[pageSize]=${ pageSize }`;

    if (search.trim()) {
      url += `&filters[title][$containsi]=${ encodeURIComponent(search.trim()) }`;
    }

    const response = await $fetch<{
      data?: Array<{
        id?: number;
        attributes?: any;
      }>;
      meta?: {
        pagination?: {
          page?: number;
          pageSize?: number;
          pageCount?: number;
          total?: number;
        };
      };
    }>(
        url,
        fetchOptions as any
    );

    // Обрабатываем ответ Strapi
    if (response?.data && Array.isArray(response.data)) {
      const prayers: any[] = [];

      response.data.forEach((item: any) => {
        const prayerData = item.attributes || item;
        // Генерируем slug из title, если его нет
        let slug = prayerData.slug || '';
        if (!slug && prayerData.title) {
          slug = prayerData.title
              .toLowerCase()
              .replace(/[^a-zа-яё0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
        }
        prayers.push({
          id: prayerData.id || item.id,
          slug: slug || String(prayerData.id || item.id),
          title: prayerData.title || prayerData.Title,
          text: prayerData.text || prayerData.Text || prayerData.content || '',
          note: prayerData.note || prayerData.Note || prayerData.description || '',
          section: prayerData.section?.data?.attributes?.title || prayerData.section?.title || ''
        });
      });

      if (page === 1) {
        displayedPrayers.value = prayers;
      } else {
        displayedPrayers.value.push(...prayers);
      }

      // Проверяем, есть ли еще страницы
      const pagination = response.meta?.pagination;
      if (pagination) {
        hasMore.value = (pagination.page || 1) < (pagination.pageCount || 1);
        currentPage.value = pagination.page || page;
      } else {
        hasMore.value = prayers.length === pageSize;
      }
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Ошибка загрузки молитв:', error);
    hasMore.value = false;
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

// Загрузка следующей порции молитв
function loadMorePrayers() {
  if (loadingMore.value || !hasMore.value) return;

  const nextPage = currentPage.value + 1;
  loadPrayers(nextPage, searchQuery.value);
}

// Обработка поиска
function handleSearch() {
  // Очищаем предыдущий таймаут
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Сбрасываем страницу и загруженные данные
  currentPage.value = 1;
  displayedPrayers.value = [];

  // Задержка перед поиском (debounce)
  searchTimeout = setTimeout(() => {
    loadPrayers(1, searchQuery.value);
  }, 500);
}

// Настройка Intersection Observer для infinite scroll
function setupObserver() {
  if (!observerTarget.value) return;

  // Отключаем предыдущий observer, если он существует
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value && !loadingMore.value && !loading.value && !searchQuery.value) {
            loadMorePrayers();
          }
        });
      },
      {
        rootMargin: '100px'
      }
  );

  observer.observe(observerTarget.value);
}

// Отслеживаем изменения поискового запроса
watch(searchQuery, (newValue) => {
  // При поиске отключаем observer
  if (observer && newValue) {
    observer.disconnect();
  } else if (!newValue && observerTarget.value) {
    // При очистке поиска загружаем все молитвы и включаем observer обратно
    currentPage.value = 1;
    displayedPrayers.value = [];
    loadPrayers(1);
    setTimeout(() => {
      setupObserver();
    }, 500);
  }
});

function isLongPrayer(prayer: any): boolean {
  const text = getPrayerText(prayer);
  return !!(text && text.length > 300);
}

function goToPrayer(prayer: any) {
  // Используем slug, если есть, иначе используем id как fallback
  const slug = prayer.slug || String(prayer.id);
  if (slug) {
    navigateTo(`/prayers/${ slug }`);
  }
}

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
  return prayer.text || prayer.Text || prayer.content || '';
}

function getPrayerNote(prayer: any): string {
  return prayer.note || prayer.Note || prayer.description || '';
}

onMounted(() => {
  // Загружаем первую страницу
  loadPrayers(1);

  // Настраиваем observer после загрузки данных
  setTimeout(() => {
    setupObserver();
  }, 500);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<style scoped lang="scss">
.page-shell {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;

  header {
    margin-bottom: 2.5rem;

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      font-size: 0.8rem;
      margin-bottom: 0.75rem;
    }

    h1 {
      margin-bottom: 0.5rem;
      color: #0f172a;
      font-size: 2rem;
    }

    p {
      color: #475569;
      line-height: 1.5;
    }
  }

  .search-section {
    margin-bottom: 2rem;

    .search-input {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 1px solid #cbd5f5;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: #0ea5e9;
      }

      &::placeholder {
        color: #94a3b8;
      }
    }

    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .category-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #cbd5f5;
        border-radius: 999px;
        background: #fff;
        color: #475569;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: #0ea5e9;
          color: #0ea5e9;
        }

        &.active {
          background: #0ea5e9;
          border-color: #0ea5e9;
          color: #fff;
        }
      }
    }
  }

  .prayers-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .prayer-card {
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 1.5rem;
    background-color: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: #cbd5f5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .prayer-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;

      h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1.25rem;
        flex: 1;
      }

      .prayer-category {
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        background: #f1f5f9;
        color: #64748b;
        font-size: 0.8rem;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;

        &:hover {
          background: #e0f2fe;
          color: #0369a1;
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }

    .prayer-content {
      margin-bottom: 1rem;

      .prayer-text {
        color: #475569;
        line-height: 1.8;
        font-size: 1rem;
        max-height: 200px;
        overflow: hidden;
        transition: max-height 0.3s ease;

        :deep(br) {
          margin-bottom: 0.5rem;
        }
      }
    }

    .prayer-actions {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.5rem;

      button {
        padding: 0.5rem 1rem;
        border: 1px solid #cbd5f5;
        border-radius: 8px;
        background: #fff;
        color: #475569;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;

        &:hover {
          border-color: #0ea5e9;
          color: #0ea5e9;
        }
      }
    }

    .prayer-note {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;

      small {
        color: #64748b;
        font-style: italic;
      }
    }
  }

  .no-results {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
  }

  .loading,
  .loading-more {
    text-align: center;
    padding: 2rem 1rem;
    color: #64748b;
  }

  .end-message {
    text-align: center;
    padding: 2rem 1rem;
    color: #94a3b8;
    font-size: 0.9rem;
  }

  .observer-target {
    height: 1px;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .page-shell {
    padding: 2rem 1rem 3rem;

    header h1 {
      font-size: 1.5rem;
    }

    .search-section {
      .categories {
        .category-btn {
          font-size: 0.85rem;
          padding: 0.45rem 0.85rem;
        }
      }
    }

    .prayer-card {
      padding: 1.25rem;

      .prayer-header {
        flex-direction: column;
        gap: 0.5rem;

        .prayer-category {
          align-self: flex-start;
        }
      }

      .prayer-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  }
}
</style>


