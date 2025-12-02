<template>
  <div
    @click="day.isCurrentMonth && $emit('select', day)"
    :class="[
      'calendar-day',
      {
        'other-month': !day.isCurrentMonth,
        'today': day.isToday,
        'selected': isSelected,
        'has-events': day.events.length > 0
      }
    ]"
  >
    <div class="day-number">{{ day.day }}</div>
    <div v-if="day.events.length > 0" class="day-events">
      <div
        v-for="(event, index) in day.events.slice(0, 2)"
        :key="event.id"
        :class="['event-dot', `event-type-${event.type}`]"
        :title="event.title"
      >
        <span class="event-title-short">{{ event.title }}</span>
      </div>
      <div v-if="day.events.length > 2" class="more-events">
        +{{ day.events.length - 2 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  day: any;
  isSelected: boolean;
}>();

defineEmits<{
  select: [day: any];
}>();
</script>

<style scoped lang="scss">
.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #0ea5e9;
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
    transform: translateY(-2px);
  }

  &.other-month {
    opacity: 0.4;
    pointer-events: none;
  }

  &.today {
    border-color: #0ea5e9;
    border-width: 2px;
    background: #f0f9ff;

    .day-number {
      color: #0ea5e9;
      font-weight: 700;
    }
  }

  &.selected {
    background: #e0f2fe;
    border-color: #0369a1;
  }

  &.has-events {
    border-color: #cbd5f5;
  }

  .day-number {
    font-weight: 600;
    font-size: 0.95rem;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }

  .day-events {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    overflow: hidden;

    .event-dot {
      font-size: 0.7rem;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .event-title-short {
        font-size: 0.65rem;
        line-height: 1.2;
      }

      &.event-type-great_feast,
      &.event-type-twelve_feast {
        background: #fef3c7;
        color: #92400e;
      }

      &.event-type-saint {
        background: #dbeafe;
        color: #1e40af;
      }

      &.event-type-fast {
        background: #f3e8ff;
        color: #6b21a8;
      }

      &.event-type-commemoration {
        background: #f1f5f9;
        color: #475569;
      }

      &.event-type-special {
        background: #d1fae5;
        color: #065f46;
      }
    }

    .more-events {
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 600;
      padding: 0.15rem 0;
    }
  }
}

@media (max-width: 768px) {
  .calendar-day {
    padding: 0.35rem;

    .day-number {
      font-size: 0.85rem;
    }

    .day-events {
      .event-dot {
        height: 4px;
        padding: 0;
        border-radius: 2px;

        .event-title-short {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .calendar-day {
    .day-events .event-dot .event-title-short {
      display: none;
    }
  }
}
</style>

