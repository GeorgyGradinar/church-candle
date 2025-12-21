<template>
  <section class="page-shell">
    <Breadcrumbs
      :items="[
        { label: 'Главная', href: '/' },
        { label: 'Молитвы', href: '/prayers' }
      ]"
      :current="categoryName || 'Раздел молитв'"
    />

    <button @click="goBack" class="back-btn">
      ← Назад к разделам
    </button>

    <header>
      <p class="eyebrow">Молитвослов</p>
      <h1>{{ categoryName || 'Молитвы' }}</h1>
    </header>

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
      <p>Молитвы не найдены.</p>
    </div>

    <div v-if="!loading" ref="observerTarget" class="observer-target"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { HEADER_PARAMETERS, STRAPI_TOKEN } from "~/configs/config.js";
import getHeaders from "~/mixins/createHeaders.js";
import Breadcrumbs from "~/components/Breadcrumbs.vue";

const route = useRoute();
const router = useRouter();
// Получаем английский slug из URL
const categorySlug = route.params.category as string;

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

const categories = [
  { id: 'tolkovye-molitvoslovy', name: 'Толковые молитвословы' },
  { id: 'glavnye-molitvy', name: 'Главные молитвы' },
  { id: 'ko-presvyatoj-bogoroditse', name: 'Ко Пресвятой Богородице' },
  { id: 'molitvy-v-prodolzhenie-dnya', name: 'Молитвы в продолжение дня' },
  { id: 'psaltir', name: 'Псалтирь' },
  { id: 'kanony-i-molitvy-dlya-podgotovki-k-tainstvam', name: 'Каноны и молитвы для подготовки к Таинствам Покаяния и Святого Причащения' },
  { id: 'molitvy-velikogo-posta', name: 'Молитвы Великого поста' },
  { id: 'molitvy-pashi', name: 'Молитвы Пасхи' },
  { id: 'fragmenty-tserkovnyh-bogosluzhenij', name: 'Фрагменты церковных богослужений' },
  { id: 'molitvy-na-raznye-sluchai-zhizni', name: 'МОЛИТВЫ НА РАЗНЫЕ СЛУЧАИ ЖИЗНИ' },
  { id: 'smert-i-pominovenie-usopshih', name: 'Смерть и поминовение усопших' },
  { id: 'molitvy-raznye', name: 'Молитвы разные' },
  { id: 'kanony', name: 'Каноны' },
  { id: 'akafisty', name: 'Акафисты' },
  { id: 'molitvy-angelam', name: 'Молитвы Ангелам' },
  { id: 'molitvy-ko-svyatym', name: 'Молитвы ко святым' },
  { id: 'tropari-kondaki-i-velichaniya', name: 'Тропари, кондаки и величания' },
  { id: 'prokimny-i-alliluiarii', name: 'Прокимны и аллилуиарии' },
  { id: 'apokrificheskie-molitvy', name: 'Апокрифические молитвы' },
  { id: 'tserkovnoslavyanskij-shrift', name: 'Церковнославянский шрифт' }
];

// Находим категорию по slug и получаем русское название
const category = computed(() => categories.find(c => c.id === categorySlug));
const categoryName = computed(() => category.value?.name || '');
const categoryNameForApi = computed(() => category.value?.name || '');

useHead({
  title: `${categoryName.value || 'Молитвы'} - Молитвослов`,
  meta: [
    {
      name: 'description',
      content: `Православные молитвы из раздела "${categoryName.value || 'Молитвы'}" для ежедневного чтения и молитвенной жизни.`
    },
    {
      name: 'keywords',
      content: `православные молитвы, ${categoryName.value}, молитвослов, церковные молитвы, православие`
    },
    {
      property: 'og:title',
      content: `${categoryName.value || 'Молитвы'} - Молитвослов`
    },
    {
      property: 'og:description',
      content: `Православные молитвы из раздела "${categoryName.value || 'Молитвы'}"`
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/prayers/category/${categorySlug}`
    },
    {
      property: 'og:locale',
      content: 'ru_RU'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/prayers/category/${categorySlug}`
    }
  ]
});

const loadingMore = ref(false);
const observerTarget = ref<HTMLElement | null>(null);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 10;
let observer: IntersectionObserver | null = null;

async function fetchPrayers(page: number = 1) {
  const header = [HEADER_PARAMETERS.accept, HEADER_PARAMETERS.content, HEADER_PARAMETERS.authorization];
  const headersConfig = getHeaders("GET", header, STRAPI_TOKEN);
  const { redirect, ...fetchOptions } = headersConfig;

  const url = `https://strapi.botinex.ru/api/prayers?populate[populate]=*&locale=ru&pagination[page]=${ page }&pagination[pageSize]=${ pageSize }&filters[category][$eq]=${ encodeURIComponent(categoryNameForApi.value) }`;

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

  if (response?.data && Array.isArray(response.data)) {
    const prayers: any[] = [];

    response.data.forEach((item: any) => {
      const prayerData = item.attributes || item;
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

    const pagination = response.meta?.pagination;
    const paginationInfo = {
      hasMore: pagination ? (pagination.page || 1) < (pagination.pageCount || 1) : prayers.length === pageSize,
      currentPage: pagination?.page || page
    };

    return { prayers, paginationInfo };
  }

  return { prayers: [], paginationInfo: { hasMore: false, currentPage: page } };
}

const { data: initialData, pending: loading } = await useAsyncData(
  `prayers-category-${categorySlug}`,
  () => fetchPrayers(1),
  {
    server: true,
    default: () => ({ prayers: [], paginationInfo: { hasMore: false, currentPage: 1 } })
  }
);

const displayedPrayers = ref<any[]>(initialData.value?.prayers || []);
if (initialData.value?.paginationInfo) {
  hasMore.value = initialData.value.paginationInfo.hasMore;
  currentPage.value = initialData.value.paginationInfo.currentPage;
}

async function loadPrayers(page: number = 1) {
  if (loadingMore.value && page > 1) return;

  if (page > 1) {
    loadingMore.value = true;
  }

  try {
    const { prayers, paginationInfo } = await fetchPrayers(page);

    if (page === 1) {
      displayedPrayers.value = prayers;
    } else {
      displayedPrayers.value.push(...prayers);
    }

    hasMore.value = paginationInfo.hasMore;
    currentPage.value = paginationInfo.currentPage;
  } catch (error) {
    console.error('Ошибка загрузки молитв:', error);
    hasMore.value = false;
  } finally {
    loadingMore.value = false;
  }
}

function loadMorePrayers() {
  if (loadingMore.value || !hasMore.value) return;
  const nextPage = currentPage.value + 1;
  loadPrayers(nextPage);
}

function setupObserver() {
  if (!observerTarget.value) return;

  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value && !loadingMore.value && !loading.value) {
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

function goToPrayer(prayer: any) {
  const slug = prayer.slug || String(prayer.id);
  if (slug) {
    navigateTo(`/prayers/${ slug }`);
  }
}

function goBack() {
  navigateTo('/prayers');
}

function formatPrayerText(text: string): string {
  if (!text) return '';

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
  setTimeout(() => {
    setupObserver();
  }, 500);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped lang="scss">
.page-shell {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;

  .back-btn {
    margin-bottom: 1.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5f5;
    border-radius: 8px;
    background: #fff;
    color: #475569;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #0ea5e9;
      color: #0ea5e9;
    }
  }

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

