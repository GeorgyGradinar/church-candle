<template>
  <section class="page-shell">
    <div class="hero">
      <h1>Место тихой молитвы</h1>
      <p>Ваш маленький свет в большой молитве</p>
    </div>
    
    <div class="actions-wrapper">
      <ActionCards />
    </div>
    
    <UpcomingEvents :limit="3" />
  </section>
</template>

<script setup lang="ts">
import UpcomingEvents from '~/components/UpcomingEvents.vue';
import ActionCards from '~/components/ActionCards.vue';
</script>

<style scoped>
.page-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.hero h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 0.75rem;
  color: #0f172a;
}

.hero p {
  color: #475569;
  line-height: 1.6;
}

.actions-wrapper {
  margin-bottom: 3rem;
}
</style>


