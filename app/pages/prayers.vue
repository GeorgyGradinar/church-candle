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
        type="text"
        placeholder="Поиск по тексту молитвы..."
        class="search-input"
      >
      
      <div class="categories">
        <button
          v-for="(category, index) in categories"
          :key="index"
          @click="selectedCategory = category.id"
          :class="['category-btn', { active: selectedCategory === category.id }]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <div class="prayers-list">
      <article
        v-for="prayer in filteredPrayers"
        :key="prayer.id"
        class="prayer-card"
      >
        <div class="prayer-header">
          <h3>{{ prayer.title }}</h3>
          <span 
            class="prayer-category" 
            @click="selectCategory(prayer.category)"
          >
            {{ getCategoryName(prayer.category) }}
          </span>
        </div>
        
        <div class="prayer-content" :class="{ expanded: expandedPrayers.includes(prayer.id) || !isLongPrayer(prayer) }">
          <div class="prayer-text" v-html="formatPrayerText(prayer.text)"></div>
        </div>

        <div v-if="isLongPrayer(prayer)" class="prayer-actions">
          <button
            @click="toggleExpand(prayer.id)"
            class="expand-btn"
          >
            {{ expandedPrayers.includes(prayer.id) ? 'Свернуть' : 'Развернуть' }}
          </button>
        </div>

        <div v-if="prayer.note" class="prayer-note">
          <small>{{ prayer.note }}</small>
        </div>
      </article>
    </div>

    <div v-if="filteredPrayers.length === 0" class="no-results">
      <p>Молитвы не найдены. Попробуйте изменить критерии поиска.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { categories, prayersData } from "~/configs/prayersData.js";

const searchQuery = ref("");
const selectedCategory = ref<string | null>(null);
const expandedPrayers = ref<number[]>([]);

const prayers = ref(prayersData);

const filteredPrayers = computed(() => {
  let result = prayers.value;

  // Фильтр по категории
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value);
  }

  // Поиск по тексту
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.text.toLowerCase().includes(query) ||
      (p.note && p.note.toLowerCase().includes(query))
    );
  }

  return result;
});

function getCategoryName(categoryId: string) {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : "";
}

function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId;
}

function isLongPrayer(prayer: any): boolean {
  // Считаем молитву длинной, если текст больше 300 символов
  return prayer.text.length > 300;
}

function toggleExpand(prayerId: number) {
  const index = expandedPrayers.value.indexOf(prayerId);
  if (index > -1) {
    expandedPrayers.value.splice(index, 1);
  } else {
    expandedPrayers.value.push(prayerId);
  }
}

function formatPrayerText(text: string): string {
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
      margin-bottom: 1rem;
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

      &.expanded .prayer-text {
        max-height: none;
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

