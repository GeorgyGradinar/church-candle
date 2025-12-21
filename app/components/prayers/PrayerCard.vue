<template>
  <article class="prayer-card">
    <div class="prayer-header">
      <h3>{{ prayer.title || prayer.Title || 'Без названия' }}</h3>
      <span
          v-if="prayer.section"
          class="prayer-category"
      >
        {{ prayer.section }}
      </span>
    </div>

    <div class="prayer-content">
      <div class="prayer-text" v-html="formatPrayerText(getPrayerText(prayer))"></div>
    </div>

    <div class="prayer-actions">
      <button
          @click="goToPrayer"
          class="expand-btn"
      >
        Читать полностью
      </button>
    </div>

    <div v-if="getPrayerNote(prayer)" class="prayer-note">
      <small>{{ getPrayerNote(prayer) }}</small>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  prayer: any;
}>();

function formatPrayerText(text: string): string {
  if (!text) return '';

  return text
      .split(/[.!?]\s+/)
      .filter(s => s.trim().length > 0)
      .map((sentence, index, array) => {
        const trimmed = sentence.trim();
        if (index < array.length - 1 && !trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?')) {
          return trimmed + '.';
        }
        return trimmed;
      })
      .join('<br><br>');
}

function getPrayerText(prayer: any): string {
  return prayer.text || prayer.Text || prayer.content || '';
}

function getPrayerNote(prayer: any): string {
  return prayer.note || prayer.Note || prayer.description || '';
}

function goToPrayer() {
  const slug = props.prayer.slug || String(props.prayer.id);
  if (slug) {
    navigateTo(`/prayers/${ slug }`);
  }
}
</script>

<style scoped lang="scss">
.prayer-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #cbd5f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .prayer-header {
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

    .prayer-category {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: #f1f5f9;
      color: #64748b;
      font-size: 0.8rem;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;

      &:hover {
        background: #e0f2fe;
        color: #0369a1;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .prayer-content {
    margin-bottom: 1rem;

    .prayer-text {
      color: #475569;
      line-height: 1.8;
      font-size: 1rem;
      max-height: 200px;
      overflow: hidden;
      transition: max-height 0.3s ease;

      :deep(br) {
        margin-bottom: 0.5rem;
      }
    }
  }

  .prayer-actions {
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

  .prayer-note {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f5f9;

    small {
      color: #64748b;
      font-style: italic;
    }
  }
}

@media (max-width: 640px) {
  .prayer-card {
    padding: 1.25rem;

    .prayer-header {
      flex-direction: column;
      gap: 0.5rem;

      .prayer-category {
        align-self: flex-start;
      }
    }

    .prayer-actions {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }
}
</style>

