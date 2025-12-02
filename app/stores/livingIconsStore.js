import { ref } from "vue";
import { defineStore } from "pinia";
import storage from "~/mixins/localStorage.js";
import { CANDLES_LIVING_KEY } from "~/configs/localStorageKeys.js";

export const useLivingIconsStore = defineStore("livingIconsStore", () => {
  const iconsLiving = ref(null);
  const candlesLiving = ref([]);
  const { setLocalStorage, getLocalStorage } = storage();

  function setIconsForLiving(data) {
    iconsLiving.value = data;
  }

  function addCandle(candle) {
    candlesLiving.value.push({
      ...candle,
      id: Date.now().toString(), // временный ID для localStorage
      createdAt: new Date().toISOString(),
    });
    setLocalStorage(CANDLES_LIVING_KEY, candlesLiving.value);
  }

  function loadCandlesFromStorage() {
    const savedCandles = getLocalStorage(CANDLES_LIVING_KEY);
    if (savedCandles && Array.isArray(savedCandles)) {
      candlesLiving.value = savedCandles;
    } else {
      candlesLiving.value = [];
    }
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
    candlesLiving.value = candlesLiving.value.filter(
      candle => candle.iconId !== iconId
    );
    setLocalStorage(CANDLES_LIVING_KEY, candlesLiving.value);
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
    getCandlesCountByIconId,
    getLastCandleTimeByIconId,
    removeCandlesByIconId,
    clearCandles,
  };
});
