<template>
  <div v-if="upcomingEvents.length > 0" class="upcoming-events">
    <div class="events-header">
      <h2>📅 Ближайшие праздники</h2>
      <NuxtLink to="/calendar" class="view-all-link">Смотреть календарь →</NuxtLink>
    </div>
    <div class="events-grid">
      <NuxtLink
        v-for="event in upcomingEvents.slice(0, limit)"
        :key="event.id"
        to="/calendar"
        class="event-preview"
      >
        <div class="event-date">
          <div class="date-day">{{ event.day }}</div>
          <div class="date-month">{{ getMonthName(event.month) }}</div>
        </div>
        <div class="event-info">
          <h4>{{ event.title }}</h4>
          <span :class="['event-badge', `badge-${event.type}`]">
            {{ getEventTypeName(event.type) }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { orthodoxCalendar, monthNames, categories } from '~/configs/orthodoxCalendarData.js';

const props = withDefaults(defineProps<{
  limit?: number;
}>(), {
  limit: 3
});

// Получаем ближайшие события
const upcomingEvents = computed(() => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // Фильтруем события, которые еще не прошли в этом месяце
  const futureEvents = orthodoxCalendar.filter(event => {
    if (event.month === currentMonth) {
      return event.day >= currentDay;
    }
    if (event.month > currentMonth) {
      return true;
    }
    return false;
  });

  // Сортируем по дате
  return futureEvents
    .sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
});

function getMonthName(month: number): string {
  return monthNames[month - 1].substring(0, 3);
}

function getEventTypeName(type: string): string {
  const category = categories.find(c => c.id === type);
  return category ? category.name : type;
}
</script>

<style scoped lang="scss">
.upcoming-events {
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 20px;
  border: 1px solid #bae6fd;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.events-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
}

.view-all-link {
  color: #0369a1;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: #075985;
    text-decoration: underline;
  }
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.event-preview {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e0f2fe;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0ea5e9;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
    transform: translateY(-2px);
  }
}

.event-date {
  flex-shrink: 0;
  text-align: center;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 12px;
  min-width: 60px;
  height: min-content;
}

.date-day {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0369a1;
  line-height: 1;
}

.date-month {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
  text-transform: uppercase;
}

.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-info h4 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  line-height: 1.3;
}

.event-badge {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  align-self: flex-start;

  &.badge-great_feast,
  &.badge-twelve_feast {
    background: #fef3c7;
    color: #92400e;
  }

  &.badge-saint {
    background: #dbeafe;
    color: #1e40af;
  }

  &.badge-fast {
    background: #f3e8ff;
    color: #6b21a8;
  }

  &.badge-commemoration {
    background: #f1f5f9;
    color: #475569;
  }

  &.badge-special {
    background: #d1fae5;
    color: #065f46;
  }
}

@media (max-width: 768px) {
  .upcoming-events {
    padding: 1.5rem;
  }

  .events-header {
    flex-direction: column;
    align-items: flex-start;

    h2 {
      font-size: 1.25rem;
    }
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .event-preview {
    padding: 1rem;
  }
}
</style>

