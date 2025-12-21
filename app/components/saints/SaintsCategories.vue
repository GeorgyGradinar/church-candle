<template>
  <div class="categories-section">
    <h2>Лики святости</h2>
    <div class="categories-grid">
      <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          :class="['category-card', { active: selectedCategory === category.id }]"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  'category-selected': [categoryId: string | null];
}>();

const selectedCategory = ref<string | null>(null);

const categories = [
  { id: 'prepodobnye', name: 'Преподобные' },
  { id: 'svyatiteli', name: 'Святители' },
  { id: 'mucheniki', name: 'Мученики' },
  { id: 'ravnoapostolnye', name: 'Равноапостольные' },
  { id: 'blagovernye', name: 'Благоверные' },
  { id: 'pravednye', name: 'Праведные' },
  { id: 'blazhennye', name: 'Блаженные' }
];

function selectCategory(categoryId: string) {
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null;
    emit('category-selected', null);
  } else {
    selectedCategory.value = categoryId;
    emit('category-selected', categoryId);
  }
}
</script>

<style scoped lang="scss">
.categories-section {
  margin-bottom: 2.5rem;

  h2 {
    font-size: 1.5rem;
    color: #0f172a;
    margin-bottom: 1.5rem;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;

    .category-card {
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #fff;
      color: #475569;
      font-size: 0.95rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;

      &:hover {
        border-color: #0ea5e9;
        color: #0ea5e9;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
      }

      &.active {
        background: #0ea5e9;
        border-color: #0ea5e9;
        color: #fff;
      }
    }
  }
}

@media (max-width: 640px) {
  .categories-section {
    h2 {
      font-size: 1.25rem;
    }

    .categories-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;

      .category-card {
        padding: 1rem;
        font-size: 0.9rem;
        min-height: 50px;
      }
    }
  }
}
</style>

