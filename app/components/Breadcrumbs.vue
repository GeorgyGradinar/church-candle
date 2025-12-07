<template>
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <a 
      v-for="(item, index) in items" 
      :key="index"
      :href="item.href"
      class="breadcrumb-item"
    >
      {{ item.label }}
    </a>
    <span 
      v-if="current"
      class="breadcrumb-current"
    >
      {{ current }}
    </span>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string;
  href: string;
}

interface Props {
  items: BreadcrumbItem[];
  current?: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.breadcrumbs {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;

  .breadcrumb-item {
    color: #0ea5e9;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #0369a1;
      text-decoration: underline;
    }

    &::after {
      content: '/';
      margin-left: 0.5rem;
      color: #94a3b8;
      user-select: none;
    }
  }

  .breadcrumb-current {
    color: #475569;
    font-weight: 500;
  }
}
</style>

