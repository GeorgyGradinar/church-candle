<template>
  <div>
    <div v-if="loading && saints.length === 0" class="loading">
      <p>Загрузка святых...</p>
    </div>

    <div v-else-if="saints.length > 0" class="saints-list">
      <SaintCard
          v-for="saint in saints"
          :key="saint.id"
          :saint="saint"
      />
    </div>

    <div v-if="loadingMore" class="loading-more">
      <p>Загрузка...</p>
    </div>

    <div v-if="!hasMore && saints.length > 0" class="end-message">
      <p>Все святые загружены</p>
    </div>

    <div v-if="!loading && saints.length === 0 && hasSearchQuery" class="no-results">
      <p>Святые не найдены. Попробуйте изменить критерии поиска.</p>
    </div>

    <div v-if="hasSearchQuery" ref="observerTarget" class="observer-target"></div>
  </div>
</template>

<script setup lang="ts">
import SaintCard from './SaintCard.vue';

defineProps<{
  saints: any[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  hasSearchQuery: boolean;
}>();

const observerTarget = ref<HTMLElement | null>(null);

defineExpose({
  observerTarget
});
</script>

<style scoped lang="scss">
.saints-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
</style>

