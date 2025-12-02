<template>
  <div class="view-switcher">
    <button
      @click="$emit('update:viewMode', 'calendar')"
      :class="['view-btn', { active: viewMode === 'calendar' }]"
    >
      📅 Календарь
    </button>
    <button
      @click="$emit('update:viewMode', 'list')"
      :class="['view-btn', { active: viewMode === 'list' }]"
    >
      📋 Список
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  viewMode: 'calendar' | 'list';
}>();

defineEmits<{
  'update:viewMode': [value: 'calendar' | 'list'];
}>();
</script>

<style scoped lang="scss">
.view-switcher {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;

  .view-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid #cbd5f5;
    border-radius: 12px;
    background: #fff;
    color: #475569;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;

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

@media (max-width: 768px) {
  .view-switcher .view-btn {
    font-size: 0.9rem;
    padding: 0.65rem 1.25rem;
  }
}
</style>

