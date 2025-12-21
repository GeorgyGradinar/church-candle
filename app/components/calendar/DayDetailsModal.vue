<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <button @click="$emit('close')" class="close-btn">✕</button>
        
        <div v-if="selectedDate" class="day-details">
          <div class="modal-header">
            <h2 class="modal-title">{{ formattedDate }}</h2>
            <NuxtLink 
              :to="dayPageUrl" 
              class="view-page-btn"
              @click="$emit('close')"
            >
              Открыть страницу дня →
            </NuxtLink>
          </div>
          
          <div v-if="events.length > 0" class="events-details">
            <article
              v-for="event in events"
              :key="event.id"
              class="event-detail-card"
            >
              <div class="event-detail-header">
                <h3>{{ event.title }}</h3>
                <span :class="['event-type-badge', `badge-${event.type}`]">
                  {{ getEventTypeName(event.type) }}
                </span>
              </div>
              
              <div v-if="event.description" class="event-detail-description">
                <h4>Описание:</h4>
                <p>{{ event.description }}</p>
              </div>

              <div v-if="event.troparion" class="event-troparion">
                <h4>Тропарь:</h4>
                <p class="troparion-text">{{ event.troparion }}</p>
              </div>

              <div class="event-actions">
                <button @click="$emit('light-candle', event)" class="candle-btn">
                  🕯️ Поставить свечу
                </button>
              </div>
            </article>
          </div>

          <div v-else class="no-events-message">
            <p>В этот день нет особых церковных событий в календаре.</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { monthNames, fullDayNames, categories } from '~/configs/orthodoxCalendarData.js';

const props = defineProps<{
  show: boolean;
  selectedDate: any;
  events: any[];
}>();

defineEmits<{
  close: [];
  'light-candle': [event: any];
}>();

const formattedDate = computed(() => {
  if (!props.selectedDate) return '';
  const date = new Date(props.selectedDate.year, props.selectedDate.month - 1, props.selectedDate.day);
  const dayOfWeek = fullDayNames[date.getDay()];
  return `${dayOfWeek}, ${props.selectedDate.day} ${monthNames[props.selectedDate.month - 1]} ${props.selectedDate.year}`;
});

const dayPageUrl = computed(() => {
  if (!props.selectedDate) return '';
  const dateString = `${props.selectedDate.year}-${String(props.selectedDate.month).padStart(2, '0')}-${String(props.selectedDate.day).padStart(2, '0')}`;
  return `/calendar/${dateString}`;
});

function getEventTypeName(type: string): string {
  const category = categories.find(c => c.id === type);
  return category ? category.name : type;
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #f1f5f9;
    color: #475569;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-right: 3rem;
  }

  .modal-title {
    font-size: 1.75rem;
    color: #0f172a;
    margin: 0;
    flex: 1;
  }

  .view-page-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #0ea5e9;
    border-radius: 8px;
    background: #fff;
    color: #0ea5e9;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background: #0ea5e9;
      color: #fff;
    }
  }

  .events-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .event-detail-card {
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      background: #fafafa;

      .event-detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;

        h3 {
          margin: 0;
          color: #0f172a;
          font-size: 1.35rem;
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

      .event-detail-description,
      .event-troparion {
        margin-bottom: 1.25rem;

        h4 {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
        }

        p {
          color: #475569;
          line-height: 1.7;
          margin: 0;
        }

        .troparion-text {
          font-style: italic;
          background: #fff;
          padding: 1rem;
          border-radius: 12px;
          border-left: 4px solid #0ea5e9;
        }
      }

      .event-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.25rem;

        .candle-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #0ea5e9;
          border-radius: 12px;
          background: #fff;
          color: #0ea5e9;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;

          &:hover {
            background: #0ea5e9;
            color: #fff;
          }
        }
      }
    }
  }

  .no-events-message {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-content {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: scale(0.9);
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;

    .modal-header {
      flex-direction: column;
      gap: 1rem;
      padding-right: 0;
    }

    .modal-title {
      font-size: 1.35rem;
    }

    .view-page-btn {
      width: 100%;
      justify-content: center;
    }

    .events-details .event-detail-card {
      padding: 1.25rem;

      .event-detail-header {
        flex-direction: column;
        gap: 0.5rem;

        h3 {
          font-size: 1.15rem;
        }

        .event-type-badge {
          align-self: flex-start;
        }
      }
    }
  }
}
</style>

