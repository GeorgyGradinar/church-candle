<template>
  <div>
    <div v-if="loading && prayers.length === 0" class="loading">
      <p>Загрузка молитв...</p>
    </div>

    <div v-else-if="prayers.length > 0" class="prayers-list">
      <PrayerCard
          v-for="prayer in prayers"
          :key="prayer.id"
          :prayer="prayer"
      />
    </div>

    <div v-if="loadingMore" class="loading-more">
      <p>Загрузка...</p>
    </div>

    <div v-if="!hasMore && prayers.length > 0" class="end-message">
      <p>Все молитвы загружены</p>
    </div>

    <div v-if="!loading && prayers.length === 0 && hasSearchQuery" class="no-results">
      <p>Молитвы не найдены. Попробуйте изменить критерии поиска.</p>
    </div>

    <div v-if="hasSearchQuery" ref="observerTarget" class="observer-target"></div>
  </div>
</template>

<script setup lang="ts">
import PrayerCard from './PrayerCard.vue';

defineProps<{
  prayers: any[];
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
.prayers-list {
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

