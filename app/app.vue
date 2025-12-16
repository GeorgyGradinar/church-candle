<template>
  <div class="layout-wrapper">
    <TheHeader />
    <main class="main-content">
      <NuxtPage />
    </main>
    <TheFooter />
  </div>
</template>
<script setup lang="ts">
import authRequests from "~/mixins/requests/auth";
import TheHeader from "~/components/TheHeader.vue";
import TheFooter from "~/components/TheFooter.vue";

const {initStore} = authRequests();

onBeforeMount(() => {
  initStore();
})
</script>
<style scoped lang="scss">
  .layout-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main-content {
    flex: 1;
  }
  </style>