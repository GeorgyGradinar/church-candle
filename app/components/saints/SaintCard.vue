<template>
  <article class="saint-card">
    <div class="saint-header">
      <h3>{{ saint.name || 'Без имени' }}</h3>
      <span
          v-if="saint.sanctityType"
          class="saint-type"
      >
        {{ saint.sanctityType }}
      </span>
    </div>

    <div class="saint-info">
      <div v-if="saint.memoryDay" class="memory-day">
        <strong>День памяти:</strong> {{ saint.memoryDay }}
      </div>
      <div v-if="saint.century" class="century">
        <strong>Век:</strong> {{ saint.century }}
      </div>
    </div>

    <div class="saint-content">
      <p class="saint-description">{{ saint.shortDescription }}</p>
    </div>

    <div class="saint-actions">
      <button
          @click="goToSaint"
          class="expand-btn"
      >
        Читать житие
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  saint: any;
}>();

function goToSaint() {
  const slug = props.saint.slug || String(props.saint.id);
  if (slug) {
    navigateTo(`/saints/${slug}`);
  }
}
</script>

<style scoped lang="scss">
.saint-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #cbd5f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .saint-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;

    h3 {
      margin: 0;
      color: #0f172a;
      font-size: 1.25rem;
      flex: 1;
    }

    .saint-type {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: #f1f5f9;
      color: #64748b;
      font-size: 0.8rem;
      white-space: nowrap;
    }
  }

  .saint-info {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #64748b;

    .memory-day,
    .century {
      strong {
        color: #475569;
      }
    }
  }

  .saint-content {
    margin-bottom: 1rem;

    .saint-description {
      color: #475569;
      line-height: 1.8;
      font-size: 1rem;
    }
  }

  .saint-actions {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5f5;
      border-radius: 8px;
      background: #fff;
      color: #475569;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;

      &:hover {
        border-color: #0ea5e9;
        color: #0ea5e9;
      }
    }
  }
}

@media (max-width: 640px) {
  .saint-card {
    padding: 1.25rem;

    .saint-header {
      flex-direction: column;
      gap: 0.5rem;

      .saint-type {
        align-self: flex-start;
      }
    }

    .saint-actions {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }
}
</style>

