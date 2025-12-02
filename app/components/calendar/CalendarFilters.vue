<template>
  <div class="filters-section">
    <div class="categories">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="$emit('update:selectedCategory', category.id)"
        :class="['category-btn', { active: props.selectedCategory === category.id }]"
      >
        <span class="category-icon">{{ category.icon }}</span>
        {{ category.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categories } from '~/configs/orthodoxCalendarData.js';

const props = defineProps<{
  selectedCategory: string | null;
}>();

defineEmits<{
  'update:selectedCategory': [value: string | null];
}>();
</script>

<style scoped lang="scss">
.filters-section {
  margin-bottom: 2rem;

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;

    .category-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5f5;
      border-radius: 999px;
      background: #fff;
      color: #475569;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.35rem;

      .category-icon {
        font-size: 1rem;
      }

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
</style>

