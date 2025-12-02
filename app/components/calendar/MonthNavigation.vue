<template>
  <div class="month-navigation-wrapper">
    <div class="month-navigation">
      <button @click="$emit('previous')" class="nav-btn" :disabled="!canGoPrevious">
        ← Предыдущий
      </button>
      <h2 class="current-month">{{ monthName }} {{ year }}</h2>
      <button @click="$emit('next')" class="nav-btn">
        Следующий →
      </button>
    </div>

    <button @click="$emit('today')" class="today-btn">
      Сегодня
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  monthName: string;
  year: number;
  month: number;
}>();

defineEmits<{
  previous: [];
  next: [];
  today: [];
}>();

// Проверка возможности перехода назад
const canGoPrevious = computed(() => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  
  // Нельзя идти назад, если выбранный месяц раньше или равен текущему
  if (props.year < currentYear) {
    return false;
  }
  
  if (props.year === currentYear && props.month <= currentMonth) {
    return false;
  }
  
  return true;
});
</script>

<style scoped lang="scss">
.month-navigation-wrapper {
  .month-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;

    .nav-btn {
      padding: 0.75rem 1.25rem;
      border: 1px solid #cbd5f5;
      border-radius: 12px;
      background: #fff;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;

      &:hover:not(:disabled) {
        border-color: #0ea5e9;
        color: #0ea5e9;
        background: #f0f9ff;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .current-month {
      font-size: 1.5rem;
      color: #0f172a;
      margin: 0;
      text-align: center;
      flex: 1;
    }
  }

  .today-btn {
    display: block;
    margin: 0 auto 1.5rem;
    padding: 0.6rem 1.25rem;
    border: 2px solid #0ea5e9;
    border-radius: 12px;
    background: #fff;
    color: #0ea5e9;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      background: #0ea5e9;
      color: #fff;
    }
  }
}

@media (max-width: 768px) {
  .month-navigation-wrapper {
    .month-navigation {
      flex-direction: column;
      gap: 0.75rem;

      .current-month {
        font-size: 1.25rem;
      }

      .nav-btn {
        width: 100%;
      }
    }
  }
}
</style>

