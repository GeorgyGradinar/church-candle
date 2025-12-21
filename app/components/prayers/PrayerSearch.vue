<template>
  <div class="search-section">
    <div class="search-input-wrapper">
      <input
          :value="modelValue"
          @input="handleInput"
          type="text"
          placeholder="Поиск по молитвам..."
          class="search-input"
      >
      <button
          v-if="modelValue"
          @click="handleClear"
          class="search-clear"
          type="button"
          aria-label="Очистить поиск"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'clear': [];
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function handleClear() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<style scoped lang="scss">
.search-section {
  margin-bottom: 2rem;

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: 0.85rem 1rem;
    padding-right: 2.5rem;
    border: 1px solid #cbd5f5;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #0ea5e9;
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  .search-clear {
    position: absolute;
    right: 0.75rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: #64748b;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 0;
    border-radius: 50%;

    &:hover {
      color: #0ea5e9;
      background: #f1f5f9;
    }

    &:active {
      transform: scale(0.9);
    }
  }
}
</style>

