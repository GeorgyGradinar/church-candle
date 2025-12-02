<template>
  <div class="list-view">
    <div class="month-selector">
      <label for="month-select">Выберите месяц:</label>
      <select
        id="month-select"
        :value="selectedMonth"
        @change="$emit('update:selectedMonth', parseInt($event.target.value))"
        class="month-select"
      >
        <option v-for="(name, index) in monthNames" :key="index" :value="index + 1">
          {{ name }}
        </option>
      </select>
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
import { monthNames } from '~/configs/orthodoxCalendarData.js';
import EventCard from './EventCard.vue';

defineProps<{
  events: any[];
  selectedMonth: number;
}>();

defineEmits<{
  'update:selectedMonth': [value: number];
  'select-event': [event: any];
}>();
</script>

<style scoped lang="scss">
.list-view {
  .month-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;

    label {
      font-weight: 600;
      color: #0f172a;
    }

    .month-select {
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5f5;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      background: #fff;
      cursor: pointer;
      min-width: 200px;

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
</style>

