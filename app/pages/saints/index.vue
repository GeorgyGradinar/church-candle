<template>
  <section class="page-shell">
    <header>
      <p class="eyebrow">Жития святых</p>
      <h1>Святые</h1>
      <p>
        Здесь собраны жития православных святых - великих подвижников, мучеников, святителей и других угодников Божиих.
      </p>
    </header>

    <SaintsSearch
        v-model="searchQuery"
        @clear="clearSearch"
        @update:model-value="handleSearch"
    />

    <div v-if="searchQuery || selectedCategory" class="search-filter">
      <span class="search-filter-text">
        <span v-if="searchQuery">Поиск: "{{ searchQuery }}"</span>
        <span v-if="searchQuery && selectedCategory"> • </span>
        <span v-if="selectedCategory">Категория: {{ getCategoryName(selectedCategory) }}</span>
      </span>
      <button
          @click="clearFilters"
          class="search-filter-clear"
          type="button"
      >
        Очистить фильтры
      </button>
    </div>

    <SaintsCategories
        v-if="!searchQuery && !selectedCategory"
        @category-selected="handleCategorySelect"
    />

    <SaintsList
        ref="saintsListRef"
        :saints="displayedSaints"
        :loading="loading"
        :loading-more="loadingMore"
        :has-more="hasMore"
        :has-search-query="!!searchQuery || !!selectedCategory"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { saintsData } from "~/configs/saintsData.js";
import SaintsSearch from "~/components/saints/SaintsSearch.vue";
import SaintsCategories from "~/components/saints/SaintsCategories.vue";
import SaintsList from "~/components/saints/SaintsList.vue";

const route = useRoute();
const router = useRouter();

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

const saintsListRef = ref<InstanceType<typeof SaintsList> | null>(null);

useHead({
  title: 'Жития святых - Православные святые',
  meta: [
    {
      name: 'description',
      content: 'Здесь собраны жития православных святых - великих подвижников, мучеников, святителей и других угодников Божиих.'
    },
    {
      name: 'keywords',
      content: 'жития святых, православные святые, преподобные, святители, мученики, равноапостольные, благоверные, православие'
    },
    {
      property: 'og:title',
      content: 'Жития святых - Православные святые'
    },
    {
      property: 'og:description',
      content: 'Здесь собраны жития православных святых - великих подвижников, мучеников, святителей и других угодников Божиих.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/saints`
    },
    {
      property: 'og:locale',
      content: 'ru_RU'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Жития святых - Православные святые'
    },
    {
      name: 'twitter:description',
      content: 'Здесь собраны жития православных святых - великих подвижников, мучеников, святителей и других угодников Божиих.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/saints`
    }
  ]
});

const loading = ref(false);
const loadingMore = ref(false);
const displayedSaints = ref<any[]>([]);
const hasMore = ref(false);
const currentPage = ref(1);
const pageSize = 10;

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

function getCategoryFromUrl(): string | null {
  const category = route.query.category;
  if (category && typeof category === 'string') {
    return category;
  }
  return null;
}

const searchQuery = ref(getSearchFromUrl());
const selectedCategory = ref<string | null>(getCategoryFromUrl());

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let observer: IntersectionObserver | null = null;

const allSaints = computed(() => {
  return saintsData;
});

const filteredSaints = computed(() => {
  let filtered = [...allSaints.value];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(saint =>
      saint.name.toLowerCase().includes(query) ||
      saint.shortDescription.toLowerCase().includes(query) ||
      (saint.sanctityType && saint.sanctityType.toLowerCase().includes(query))
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(saint => saint.category === selectedCategory.value);
  }

  return filtered;
});

function loadSaints(page: number = 1) {
  if (loading.value && page === 1) return;
  if (loadingMore.value && page > 1) return;

  if (page === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  setTimeout(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredSaints.value.slice(start, end);

    if (page === 1) {
      displayedSaints.value = pageData;
    } else {
      displayedSaints.value.push(...pageData);
    }

    hasMore.value = end < filteredSaints.value.length;
    currentPage.value = page;

    loading.value = false;
    loadingMore.value = false;
  }, 300);
}

function loadMoreSaints() {
  if (loadingMore.value || !hasMore.value) return;
  const nextPage = currentPage.value + 1;
  loadSaints(nextPage);
}

function handleSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  if (searchQuery.value.trim()) {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        search: searchQuery.value.trim()
      }
    });
  } else {
    const query: any = { ...route.query };
    delete query.search;
    router.push({
      path: route.path,
      query
    });
  }

  currentPage.value = 1;
  displayedSaints.value = [];

  searchTimeout = setTimeout(() => {
    loadSaints(1);
    if (saintsListRef.value?.observerTarget) {
      setTimeout(() => {
        setupObserver();
      }, 100);
    }
  }, 300);
}

function handleCategorySelect(categoryId: string | null) {
  selectedCategory.value = categoryId;

  if (categoryId) {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        category: categoryId
      }
    });
  } else {
    const query: any = { ...route.query };
    delete query.category;
    router.push({
      path: route.path,
      query
    });
  }

  currentPage.value = 1;
  displayedSaints.value = [];
  loadSaints(1);
}

function getCategoryName(categoryId: string | null): string {
  if (!categoryId) return '';
  const categories: Record<string, string> = {
    prepodobnye: 'Преподобные',
    svyatiteli: 'Святители',
    mucheniki: 'Мученики',
    ravnoapostolnye: 'Равноапостольные',
    blagovernye: 'Благоверные',
    pravednye: 'Праведные',
    blazhennye: 'Блаженные'
  };
  return categories[categoryId] || categoryId;
}

function clearSearch() {
  searchQuery.value = '';
  const query: any = { ...route.query };
  delete query.search;
  router.push({
    path: route.path,
    query
  });
  displayedSaints.value = [];
  currentPage.value = 1;
  loadSaints(1);
}

function clearFilters() {
  searchQuery.value = '';
  selectedCategory.value = null;
  router.push({
    path: route.path,
    query: {}
  });
  displayedSaints.value = [];
  currentPage.value = 1;
  if (observer) {
    observer.disconnect();
  }
  loadSaints(1);
}

function setupObserver() {
  if (!saintsListRef.value?.observerTarget) return;

  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore.value && !loadingMore.value && !loading.value && (searchQuery.value || selectedCategory.value)) {
          loadMoreSaints();
        }
      });
    },
    {
      rootMargin: '100px'
    }
  );

  observer.observe(saintsListRef.value.observerTarget);
}

watch([searchQuery, selectedCategory], () => {
  if (observer && (searchQuery.value || selectedCategory.value)) {
    observer.disconnect();
  } else if (!searchQuery.value && !selectedCategory.value && saintsListRef.value?.observerTarget) {
    setTimeout(() => {
      setupObserver();
    }, 500);
  }
});

onMounted(() => {
  loadSaints(1);
  if (searchQuery.value || selectedCategory.value) {
    setTimeout(() => {
      setupObserver();
    }, 500);
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

