import { ref } from "vue";
import { defineStore } from "pinia";

export const useIconsStore = defineStore("iconsStore", () => {
  const icons = ref([]);

  function setIcons(data) {
    icons.value = data;
  }

  function clearIcons() {
    icons.value = [];
  }

  return {
    icons,
    setIcons,
    clearIcons,
  };
});

