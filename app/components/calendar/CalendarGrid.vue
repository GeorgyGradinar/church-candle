<template>
  <div class="calendar-grid">
    <!-- Заголовки дней недели -->
    <div
      v-for="dayName in dayNames"
      :key="dayName"
      class="calendar-day-header"
    >
      {{ dayName }}
    </div>

    <!-- Дни месяца -->
    <CalendarDay
      v-for="day in calendarDays"
      :key="`${day.month}-${day.day}`"
      :day="day"
      :is-selected="isSelectedDate(day)"
      @select="$emit('select-date', day)"
    />
  </div>
</template>

<script setup lang="ts">
import { dayNames } from '~/configs/orthodoxCalendarData.js';
import CalendarDay from './CalendarDay.vue';

const props = defineProps<{
  calendarDays: any[];
  selectedDate: any;
}>();

defineEmits<{
  'select-date': [day: any];
}>();

function isSelectedDate(day: any): boolean {
  if (!props.selectedDate) return false;
  return (
    day.day === props.selectedDate.day &&
    day.month === props.selectedDate.month &&
    day.year === props.selectedDate.year
  );
}
</script>

<style scoped lang="scss">
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;

  .calendar-day-header {
    text-align: center;
    font-weight: 600;
    color: #64748b;
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .calendar-grid {
    gap: 0.35rem;
  }
}
</style>

