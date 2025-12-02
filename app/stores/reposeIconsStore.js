import { ref } from "vue";
import { defineStore } from "pinia";
import storage from "~/mixins/localStorage.js";
import { CANDLES_REPOSE_KEY } from "~/configs/localStorageKeys.js";

export const useReposeIconsStore = defineStore("reposeIconsStore", () => {
  const iconsRepose = ref(null);
  const candlesRepose = ref([]);
  const { setLocalStorage, getLocalStorage } = storage();

  function setIconsForRepose(data) {
    iconsRepose.value = data;
  }

  function addCandle(candle) {
    candlesRepose.value.push({
      ...candle,
      id: Date.now().toString(), // временный ID для localStorage
      createdAt: new Date().toISOString(),
    });
    setLocalStorage(CANDLES_REPOSE_KEY, candlesRepose.value);
  }

  function loadCandlesFromStorage() {
    const savedCandles = getLocalStorage(CANDLES_REPOSE_KEY);
    if (savedCandles && Array.isArray(savedCandles)) {
      candlesRepose.value = savedCandles;
    } else {
      candlesRepose.value = [];
    }
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
    candlesRepose.value = candlesRepose.value.filter(
      candle => candle.iconId !== iconId
    );
    setLocalStorage(CANDLES_REPOSE_KEY, candlesRepose.value);
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
    getCandlesCountByIconId,
    getLastCandleTimeByIconId,
    removeCandlesByIconId,
    clearCandles,
  };
});
