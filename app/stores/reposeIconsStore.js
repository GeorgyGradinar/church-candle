import { ref } from "vue";
import { defineStore } from "pinia";
import storage from "~/mixins/localStorage.js";
import { CANDLES_REPOSE_KEY } from "~/configs/localStorageKeys.js";

export const useReposeIconsStore = defineStore("reposeIconsStore", () => {
  const iconsRepose = ref(null);
  const candlesRepose = ref([]);
  const { setLocalStorage, getLocalStorage } = storage();
  const CANDLE_BURN_TIME = 60 * 1000; // 1 минута в миллисекундах

  function setIconsForRepose(data) {
    iconsRepose.value = data;
    // После установки икон добавляем свечи из localStorage
    if (candlesRepose.value && candlesRepose.value.length > 0) {
      // Удаляем догоревшие свечи перед добавлением в иконы
      removeExpiredCandles();
      addCandlesToIcons();
    }
  }

  function addCandle(candle) {
    const newCandle = {
      ...candle,
      id: Date.now().toString(), // временный ID для localStorage
      createdAt: new Date().toISOString(),
    };
    candlesRepose.value.push(newCandle);
    setLocalStorage(CANDLES_REPOSE_KEY, candlesRepose.value);
    // Обновляем свечи в данных икон
    addCandlesToIcons();
  }

  function isCandleExpired(candle) {
    if (!candle || !candle.createdAt) return true;
    const candleTime = new Date(candle.createdAt).getTime();
    const elapsed = Date.now() - candleTime;
    return elapsed >= CANDLE_BURN_TIME;
  }

  function removeExpiredCandles() {
    const now = Date.now();
    const beforeCount = candlesRepose.value.length;
    candlesRepose.value = candlesRepose.value.filter(candle => {
      if (!candle.createdAt) return false;
      const candleTime = new Date(candle.createdAt).getTime();
      const elapsed = now - candleTime;
      return elapsed < CANDLE_BURN_TIME;
    });

    // Если были удалены догоревшие свечи, обновляем localStorage
    if (candlesRepose.value.length !== beforeCount) {
      setLocalStorage(CANDLES_REPOSE_KEY, candlesRepose.value);
    }
  }

  function loadCandlesFromStorage() {
    const savedCandles = getLocalStorage(CANDLES_REPOSE_KEY);
    if (savedCandles && Array.isArray(savedCandles)) {
      candlesRepose.value = savedCandles;
      // Удаляем догоревшие свечи перед добавлением в иконы
      removeExpiredCandles();
      // Добавляем свечи в данные конкретных икон
      addCandlesToIcons();
    } else {
      candlesRepose.value = [];
    }
  }

  function addCandlesToIcons() {
    if (!iconsRepose.value || !Array.isArray(iconsRepose.value)) {
      return;
    }

    // Для каждой иконы находим соответствующую свечу и присваиваем её по ключу candle
    iconsRepose.value = iconsRepose.value.map(icon => {
      // Находим свечу для этой иконы по iconId (проверяем и id и documentId)
      const iconId = icon.id || icon.documentId;
      const iconCandles = candlesRepose.value.filter(
        candle => candle.iconId === iconId && !isCandleExpired(candle)
      );

      // Выбираем самую свежую свечу (сортируем по createdAt)
      let candle = null;
      if (iconCandles.length > 0) {
        const sorted = iconCandles.sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA; // самая свежая первая
        });
        candle = sorted[0];
      }

      // Присваиваем свечу по ключу candle в объекте иконы
      return {
        ...icon,
        candle: candle
      };
    });
  }

  function getCandlesCountByIconId(iconId) {
    return candlesRepose.value.filter(candle => candle.iconId === iconId).length;
  }

  function getLastCandleTimeByIconId(iconId) {
    const candles = candlesRepose.value.filter(candle => candle.iconId === iconId);
    if (candles.length === 0) return null;

    const lastCandle = candles.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.createdAt).getTime();
      const timeB = new Date(b.createdAt || b.createdAt).getTime();
      return timeB - timeA;
    })[0];

    return lastCandle?.createdAt ? new Date(lastCandle.createdAt).getTime() : null;
  }

  function removeCandlesByIconId(iconId) {
    // Удаляем свечи из массива через поиск индекса и splice
    const index = candlesRepose.value.findIndex(candle => candle.iconId === iconId);
    if (index !== -1) candlesRepose.value.splice(index, 1);

    // Сохраняем изменения в localStorage
    setLocalStorage(CANDLES_REPOSE_KEY, candlesRepose.value);

    // Если у иконы свеча совпадала с удаляемой, сбрасываем candle у этой иконы
    const iconIndex = iconsRepose.value.findIndex(icon => icon.id === iconId);
    if (iconIndex !== -1) iconsRepose.value[iconIndex].candle = null;
  }

  function clearCandles() {
    candlesRepose.value = [];
    setLocalStorage(CANDLES_REPOSE_KEY, []);
  }

  return {
    iconsRepose,
    candlesRepose,
    setIconsForRepose,
    addCandle,
    loadCandlesFromStorage,
    addCandlesToIcons,
    removeExpiredCandles,
    isCandleExpired,
    getCandlesCountByIconId,
    getLastCandleTimeByIconId,
    removeCandlesByIconId,
    clearCandles,
  };
});
