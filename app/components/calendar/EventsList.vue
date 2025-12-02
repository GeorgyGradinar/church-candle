<template>
  <div class="list-view">
    <div class="navigation-wrapper">
      <button @click="previousMonth" class="nav-arrow-btn" :disabled="!canGoPrevious">
        ← Предыдущий
      </button>
      
      <div class="selectors-wrapper">
        <div class="month-selector">
          <label for="month-select">Месяц:</label>
          <select
            id="month-select"
            :value="selectedMonth"
            @change="onMonthChange"
            class="month-select"
          >
            <option v-for="(name, index) in monthNames" :key="index" :value="index + 1">
              {{ name }}
            </option>
          </select>
        </div>
        
        <div class="year-selector">
          <label for="year-select">Год:</label>
          <select
            id="year-select"
            :value="selectedYear"
            @change="onYearChange"
            class="year-select"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      
      <button @click="nextMonth" class="nav-arrow-btn" :disabled="!canGoNext">
        Следующий →
      </button>
    </div>

    <div class="events-list">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        @select="$emit('select-event', event)"
      />
    </div>

    <div v-if="events.length === 0" class="no-results">
      <p>События не найдены. Попробуйте изменить критерии поиска.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { monthNames } from '~/configs/orthodoxCalendarData.js';
import EventCard from './EventCard.vue';

const props = defineProps<{
  events: any[];
  selectedMonth: number;
  selectedYear: number;
}>();

const emit = defineEmits<{
  'update:selectedMonth': [value: number];
  'update:selectedYear': [value: number];
  'select-event': [event: any];
}>();

// Генерируем список будущих годов (текущий + 10 лет вперед)
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 10; i++) {
    years.push(currentYear + i);
  }
  return years;
});

// Проверка возможности навигации
const canGoPrevious = computed(() => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  // Нельзя идти назад, если мы в текущем месяце
  if (props.selectedYear === currentYear && props.selectedMonth <= currentMonth) {
    return false;
  }
  
  // Нельзя идти назад, если мы в прошлом (не должно быть, но проверяем)
  if (props.selectedYear < currentYear) {
    return false;
  }
  
  return true;
});

const canGoNext = computed(() => {
  const maxYear = new Date().getFullYear() + 10;
  
  // Нельзя идти вперед дальше максимального года
  if (props.selectedYear >= maxYear && props.selectedMonth >= 12) {
    return false;
  }
  
  return true;
});

// Обработчики изменения селектов
function onMonthChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:selectedMonth', parseInt(target.value));
}

function onYearChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:selectedYear', parseInt(target.value));
}

// Навигация по месяцам
function previousMonth() {
  if (!canGoPrevious.value) return;
  
  if (props.selectedMonth === 1) {
    // Переход на декабрь предыдущего года
    emit('update:selectedMonth', 12);
    emit('update:selectedYear', props.selectedYear - 1);
  } else {
    // Просто уменьшаем месяц
    emit('update:selectedMonth', props.selectedMonth - 1);
  }
}

function nextMonth() {
  if (!canGoNext.value) return;
  
  if (props.selectedMonth === 12) {
    // Переход на январь следующего года
    emit('update:selectedMonth', 1);
    emit('update:selectedYear', props.selectedYear + 1);
  } else {
    // Просто увеличиваем месяц
    emit('update:selectedMonth', props.selectedMonth + 1);
  }
}
</script>

<style scoped lang="scss">
.list-view {
  .navigation-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .nav-arrow-btn {
    padding: 0.75rem 1.25rem;
    border: 1px solid #cbd5f5;
    border-radius: 12px;
    background: #fff;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;

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

  .selectors-wrapper {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    flex: 1;
  }

  .month-selector,
  .year-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    label {
      font-weight: 600;
      color: #0f172a;
      white-space: nowrap;
    }

    .month-select,
    .year-select {
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5f5;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      background: #fff;
      cursor: pointer;
      min-width: 160px;

      &:focus {
        outline: none;
        border-color: #0ea5e9;
      }
    }
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .no-results {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
  }
}

@media (max-width: 768px) {
  .list-view {
    .navigation-wrapper {
      flex-direction: column;
    }

    .nav-arrow-btn {
      width: 100%;
    }

    .selectors-wrapper {
      width: 100%;
      flex-direction: column;
      gap: 1rem;
    }

    .month-selector,
    .year-selector {
      flex-direction: column;
      align-items: stretch;

      .month-select,
      .year-select {
        width: 100%;
      }
    }
  }
}
</style>

