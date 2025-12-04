import { ref } from "vue";
import { defineStore } from "pinia";
import storage from "~/mixins/localStorage.js";
import { CANDLES_LIVING_KEY } from "~/configs/localStorageKeys.js";

export const useLivingIconsStore = defineStore("livingIconsStore", () => {
  const iconsLiving = ref(null);
  const candlesLiving = ref([]);
  const { setLocalStorage, getLocalStorage } = storage();
  const CANDLE_BURN_TIME = 60 * 1000; // 1 минута в миллисекундах

  function setIconsForLiving(data) {
    iconsLiving.value = data;
    // После установки икон добавляем свечи из localStorage
    if (candlesLiving.value && candlesLiving.value.length > 0) {
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
    candlesLiving.value.push(newCandle);
    setLocalStorage(CANDLES_LIVING_KEY, candlesLiving.value);
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
    const beforeCount = candlesLiving.value.length;
    candlesLiving.value = candlesLiving.value.filter(candle => {
      if (!candle.createdAt) return false;
      const candleTime = new Date(candle.createdAt).getTime();
      const elapsed = now - candleTime;
      return elapsed < CANDLE_BURN_TIME;
    });

    // Если были удалены догоревшие свечи, обновляем localStorage
    if (candlesLiving.value.length !== beforeCount) {
      setLocalStorage(CANDLES_LIVING_KEY, candlesLiving.value);
    }
  }

  function loadCandlesFromStorage() {
    const savedCandles = getLocalStorage(CANDLES_LIVING_KEY);
    if (savedCandles && Array.isArray(savedCandles)) {
      candlesLiving.value = savedCandles;
      // Удаляем догоревшие свечи перед добавлением в иконы
      removeExpiredCandles();
      // Добавляем свечи в данные конкретных икон
      addCandlesToIcons();
    } else {
      candlesLiving.value = [];
    }
  }

  function addCandlesToIcons() {
    if (!iconsLiving.value || !Array.isArray(iconsLiving.value)) {
      return;
    }

    // Для каждой иконы находим соответствующую свечу и присваиваем её по ключу candle
    iconsLiving.value = iconsLiving.value.map(icon => {
      // Находим свечу для этой иконы по iconId (проверяем и id и documentId)
      const iconId = icon.id || icon.documentId;
      const iconCandles = candlesLiving.value.filter(
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
    return candlesLiving.value.filter(candle => candle.iconId === iconId).length;
  }

  function getLastCandleTimeByIconId(iconId) {
    const candles = candlesLiving.value.filter(candle => candle.iconId === iconId);
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
    const index = candlesLiving.value.findIndex(candle => candle.iconId === iconId);
    if (index !== -1) candlesLiving.value.splice(index, 1);

    // Сохраняем изменения в localStorage
    setLocalStorage(CANDLES_LIVING_KEY, candlesLiving.value);

    // Удаляем свечу из данных иконы
    iconsLiving.value = iconsLiving.value.map(icon => {
      if (icon.id === iconId) {
        return {
          ...icon,
          candle: null
        };
      }
      return icon;
    });
  }

  function removeCandleByIconAndCandleId(iconId, candleId) {
    // Удаляем только конкретную свечу по её candleId и iconId
    const index = candlesLiving.value.findIndex(candle => candle.id === candleId);
    if (index !== -1) candlesLiving.value.splice(index, 1);

    // Сохраняем изменения в localStorage
    setLocalStorage(CANDLES_LIVING_KEY, candlesLiving.value);

    // Если у иконы свеча совпадала с удаляемой, сбрасываем candle у этой иконы
    const iconIndex = iconsLiving.value.findIndex(icon => icon.id === iconId);
    if (iconIndex !== -1) iconsLiving.value[iconIndex].candle = null;
  }

  function clearCandles() {
    candlesLiving.value = [];
    setLocalStorage(CANDLES_LIVING_KEY, []);
  }

  return {
    iconsLiving,
    candlesLiving,
    setIconsForLiving,
    addCandle,
    loadCandlesFromStorage,
    addCandlesToIcons,
    removeExpiredCandles,
    isCandleExpired,
    getCandlesCountByIconId,
    getLastCandleTimeByIconId,
    removeCandlesByIconId,
    removeCandleByIconAndCandleId,
    clearCandles,
  };
});
