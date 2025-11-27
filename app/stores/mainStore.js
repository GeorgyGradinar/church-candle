import { ref } from "vue";
import { defineStore } from "pinia";
import storage from "~/mixins/localStorage.js";
import { CANDLE_USER_KEY } from "~/configs/localStorageKeys.js";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);
  const { setLocalStorage } = storage();

  function clearUserStore() {
    user.value = null;
  }

  function setUser(data) {
    user.value = data;
    setLocalStorage(CANDLE_USER_KEY, data);
  }

  return {
    user,
    setUser,
    clearUserStore,
  };
});

