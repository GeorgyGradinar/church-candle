<template>
  <article
    @click="$emit('select', event)"
    class="event-card"
  >
    <div class="event-date">
      <div class="date-day">{{ event.day }}</div>
      <div class="date-month">{{ monthName }}</div>
    </div>
    <div class="event-content">
      <div class="event-header">
        <h3>{{ event.title }}</h3>
        <span :class="['event-type-badge', `badge-${event.type}`]">
          {{ typeName }}
        </span>
      </div>
      <p v-if="event.description" class="event-description">
        {{ truncateText(event.description, 120) }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { monthNames, categories } from '~/configs/orthodoxCalendarData.js';

const props = defineProps<{
  event: any;
}>();

defineEmits<{
  select: [event: any];
}>();

const monthName = computed(() => monthNames[props.event.month - 1]);

const typeName = computed(() => {
  const category = categories.find(c => c.id === props.event.type);
  return category ? category.name : props.event.type;
});

function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
</script>

<style scoped lang="scss">
.event-card {
  display: flex;
  gap: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }

  .event-date {
    flex-shrink: 0;
    text-align: center;
    padding: 0.75rem 1rem;
    background: #f0f9ff;
    border-radius: 12px;
    min-width: 80px;

    .date-day {
      font-size: 2rem;
      font-weight: 700;
      color: #0369a1;
      line-height: 1;
    }

    .date-month {
      font-size: 0.85rem;
      color: #64748b;
      margin-top: 0.25rem;
    }
  }

  .event-content {
    flex: 1;

    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.75rem;

      h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1.25rem;
      }

      .event-type-badge {
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;

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
    }

    .event-description {
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }
  }
}

@media (max-width: 768px) {
  .event-card {
    flex-direction: column;
    gap: 1rem;

    .event-date {
      width: 100%;
    }

    .event-content .event-header {
      flex-direction: column;
      gap: 0.5rem;

      .event-type-badge {
        align-self: flex-start;
      }
    }
  }
}
</style>

