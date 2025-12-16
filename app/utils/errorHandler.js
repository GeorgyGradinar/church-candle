import { useAuthStore } from "~/stores/mainStore.js";
import { useIconsStore } from "~/stores/iconsStore.js";
import storage from "~/mixins/localStorage.js";
import { CANDLE_USER_KEY } from "~/configs/localStorageKeys.js";

export function handle401Error(error) {
  // Проверяем, что это ошибка 401
  // $fetch может возвращать ошибки в разных форматах
  const statusCode = error?.statusCode || error?.status || error?.response?.status || error?.data?.status;
  
  if (statusCode === 401) {
    const authStore = useAuthStore();
    const iconsStore = useIconsStore();
    const { removeLocalStorage } = storage();

    // Очищаем все сторы
    authStore.clearUserStore();
    iconsStore.clearIcons();

    // Очищаем localStorage
    removeLocalStorage(CANDLE_USER_KEY);
  }
}

