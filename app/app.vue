<template>
  <NuxtLayout>
    <TheHeader />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import TheHeader from "~/components/TheHeader.vue";
import authRequests from "~/mixins/requests/auth";

const {initStore} = authRequests();

onBeforeMount(() => {
  initStore();
})
</script>