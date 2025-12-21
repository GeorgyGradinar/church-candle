<template>
  <section class="page-shell">
    <header>
      <p class="eyebrow">Молитвослов</p>
      <h1>Молитвы</h1>
      <p>
        Здесь собраны основные православные молитвы для ежедневного чтения и молитвенной жизни.
      </p>
    </header>

    <PrayerSearch
        v-model="searchQuery"
        @clear="clearSearch"
        @update:model-value="handleSearch"
    />

    <div v-if="searchQuery" class="search-filter">
      <span class="search-filter-text">Поиск: "{{ searchQuery }}"</span>
      <button
          @click="clearSearch"
          class="search-filter-clear"
          type="button"
      >
        Очистить фильтр
      </button>
    </div>

    <PrayerCategories v-if="!searchQuery" />

    <PrayersList
        ref="prayersListRef"
        :prayers="displayedPrayers"
        :loading="loading"
        :loading-more="loadingMore"
        :has-more="hasMore"
        :has-search-query="!!searchQuery"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { HEADER_PARAMETERS, STRAPI_TOKEN } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";
import PrayerSearch from "~/components/prayers/PrayerSearch.vue";
import PrayerCategories from "~/components/prayers/PrayerCategories.vue";
import PrayersList from "~/components/prayers/PrayersList.vue";

const route = useRoute();
const router = useRouter();

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

const prayersListRef = ref<InstanceType<typeof PrayersList> | null>(null);

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
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 10;

// Инициализируем searchQuery из URL сразу при создании компонента
function getSearchFromUrl(): string {
  const search = route.query.search;
  if (search && typeof search === 'string') {
    try {
      return decodeURIComponent(search);
    } catch {
      return search;
    }
  }
  return '';
}

const searchQuery = ref(getSearchFromUrl());

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let observer: IntersectionObserver | null = null;

// Загрузка молитв из API (только для поиска)
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

  // Обновляем URL с query параметром
  if (searchQuery.value.trim()) {
    router.push({
      path: route.path,
      query: { search: searchQuery.value.trim() }
    });
  } else {
    router.push({
      path: route.path,
      query: {}
    });
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
  if (!prayersListRef.value?.observerTarget) return;

  // Отключаем предыдущий observer, если он существует
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value && !loadingMore.value && !loading.value && searchQuery.value) {
            loadMorePrayers();
          }
        });
      },
      {
        rootMargin: '100px'
      }
  );

  observer.observe(prayersListRef.value.observerTarget);
}


// Отслеживаем изменения поискового запроса
watch(searchQuery, (newValue) => {
  // При поиске отключаем observer
  if (observer && newValue) {
    observer.disconnect();
  } else if (!newValue && prayersListRef.value?.observerTarget) {
    // При очистке поиска включаем observer обратно
    setTimeout(() => {
      setupObserver();
    }, 500);
  }
});

function clearSearch() {
  searchQuery.value = '';
  router.push({
    path: route.path,
    query: {}
  });
  displayedPrayers.value = [];
  currentPage.value = 1;
  if (observer) {
    observer.disconnect();
  }
}

onMounted(() => {
  console.log(route.query)
  // Проверяем наличие поискового запроса в URL
  const searchFromUrl = route.query.search as string | undefined;

  console.log(searchFromUrl)

  if (searchFromUrl) {
    try {
      const decoded = decodeURIComponent(searchFromUrl);
      searchQuery.value = decoded;
      // Загружаем результаты поиска
      loadPrayers(1, decoded);
      setTimeout(() => {
        setupObserver();
      }, 500);
    } catch {
      // Если декодирование не удалось, используем исходное значение
      searchQuery.value = searchFromUrl;
      loadPrayers(1, searchFromUrl);
      setTimeout(() => {
        setupObserver();
      }, 500);
    }
  }
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

  .search-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem 1rem;
    background: #f1f5f9;
    border-radius: 8px;

    .search-filter-text {
      color: #475569;
      font-size: 0.9rem;
    }

    .search-filter-clear {
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5f5;
      border-radius: 6px;
      background: #fff;
      color: #475569;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #0ea5e9;
        color: #0ea5e9;
      }
    }
  }

}

@media (max-width: 640px) {
  .page-shell {
    padding: 2rem 1rem 3rem;

    header h1 {
      font-size: 1.5rem;
    }
  }
}
</style>


