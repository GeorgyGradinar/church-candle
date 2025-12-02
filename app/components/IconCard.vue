<template>
  <article class="icon-card" :class="`icon-card--${theme}`">
    <div class="icon-visual" aria-hidden="true">
      <img
        v-if="icon.image && icon.image.length > 0 && icon.image[0]"
        :src="`${baseUrl}${icon.image[0].url}`"
        :alt="icon.title"
      >
      <span v-else>Икона</span>
    </div>
    <h3>{{ icon.title }}</h3>
    <p>Сейчас горит {{ totalCandlesCount }} свеч{{ candlesWord }}</p>

    <div v-if="userCandles.length > 0 && isCandleBurning" class="user-candles">
      <div class="user-candles-header">
        <Candle class="candle-component" />
        <div class="user-candles-info">
          <span class="user-candles-text">Ваша свеча горит</span>
          <span v-if="userCandles[0].name" class="candle-name">{{ userCandles[0].name }}</span>
          <span v-else class="candle-name anonymous">Анонимно</span>
        </div>
      </div>
    </div>

    <div class="candle-form">
      <label>
        {{ nameLabel }}
        <input
          v-model="formState.name"
          :disabled="formState.anonymous"
          :class="{ disabled: formState.anonymous }"
          type="text"
          :placeholder="placeholder"
        >
      </label>
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="formState.anonymous"
        >
        <span>Оставить анонимно</span>
      </label>
      <button 
        type="button" 
        @click="handleSubmit" 
        class="submit-candle-btn"
        :disabled="isCandleBurning"
        :class="{ disabled: isCandleBurning }"
      >
        <span v-if="!isCandleBurning">Установить свечу</span>
        <span v-else class="timer-text">
          Свеча горит... {{ remainingTimeText }}
        </span>
      </button>
    </div>
  </article>
</template>

<script setup>
import { reactive, computed, ref, onMounted, onUnmounted, watch } from "vue";
import { storeToRefs } from "pinia";
import candlesRequests from "~/mixins/requests/candles";
import { useAuthStore } from "~/stores/mainStore.js";
import { useLivingIconsStore } from "~/stores/livingIconsStore.js";
import { useReposeIconsStore } from "~/stores/reposeIconsStore.js";
import Candle from "~/components/candle.vue";

const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
  baseUrl: {
    type: String,
    default: 'https://strapi.botinex.ru',
  },
  candlesCount: {
    type: Number,
    required: true,
  },
  nameLabel: {
    type: String,
    default: 'Имя молящегося',
  },
  placeholder: {
    type: String,
    default: 'Например: раба Божия Анна',
  },
  theme: {
    type: String,
    default: 'living',
    validator: (value) => ['living', 'repose'].includes(value),
  },
});

const emit = defineEmits(['candle-submitted']);

const { createCandle } = candlesRequests();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const livingIconsStore = useLivingIconsStore();
const reposeIconsStore = useReposeIconsStore();
const { candlesLiving } = storeToRefs(livingIconsStore);
const { candlesRepose } = storeToRefs(reposeIconsStore);

const formState = reactive({
  name: "",
  anonymous: false,
});

// Вычисляем общее количество свечей: базовое + из localStorage
const totalCandlesCount = computed(() => {
  const baseCount = props.candlesCount;
  let localStorageCount = 0;
  
  if (props.theme === 'living') {
    localStorageCount = livingIconsStore.getCandlesCountByIconId(props.icon.id);
  } else {
    localStorageCount = reposeIconsStore.getCandlesCountByIconId(props.icon.id);
  }
  
  return baseCount + localStorageCount;
});

const candlesWord = computed(() => {
  const count = totalCandlesCount.value;
  if (count === 1) return "а";
  if (count >= 2 && count <= 4) return "и";
  return "ей";
});

// Получаем свечи пользователя для этой иконы (только одну - самую свежую)
const userCandles = computed(() => {
  let candles = [];
  
  if (props.theme === 'living') {
    candles = livingIconsStore.candlesLiving.filter(
      candle => candle.iconId === props.icon.id
    );
  } else {
    candles = reposeIconsStore.candlesRepose.filter(
      candle => candle.iconId === props.icon.id
    );
  }
  
  // Сортируем по времени и возвращаем только самую свежую (или пустой массив)
  if (candles.length > 0) {
    const sorted = candles.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    // Возвращаем только самую свежую свечу
    return [sorted[0]];
  }
  
  return [];
});

// Таймер для отслеживания времени горения свечи
const remainingTime = ref(0);
const timerInterval = ref(null);
const CANDLE_BURN_TIME = 60 * 1000; // 1 минута в миллисекундах

// Получаем время последней установленной свечи (самая свежая)
const lastCandleTime = computed(() => {
  if (props.theme === 'living') {
    return livingIconsStore.getLastCandleTimeByIconId(props.icon.id);
  } else {
    return reposeIconsStore.getLastCandleTimeByIconId(props.icon.id);
  }
});

// Проверяем, есть ли хотя бы одна горящая свеча
const isCandleBurning = computed(() => {
  const candles = userCandles.value;
  if (candles.length === 0) return false;
  
  const now = Date.now();
  // Проверяем все свечи - если хотя бы одна еще горит, блокируем
  return candles.some(candle => {
    if (!candle.createdAt) return false;
    const candleTime = new Date(candle.createdAt).getTime();
    const elapsed = now - candleTime;
    return elapsed < CANDLE_BURN_TIME;
  });
});

// Вычисляем оставшееся время для самой свежей свечи
const remainingTimeText = computed(() => {
  if (!lastCandleTime.value) return '';
  const elapsed = Date.now() - lastCandleTime.value;
  const remaining = Math.max(0, CANDLE_BURN_TIME - elapsed);
  const seconds = Math.ceil(remaining / 1000);
  return `${seconds} сек`;
});

// Обновляем таймер
const updateTimer = () => {
  const candles = userCandles.value;
  
  if (candles.length === 0 || !lastCandleTime.value) {
    remainingTime.value = 0;
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
    return;
  }
  
  const elapsed = Date.now() - lastCandleTime.value;
  remainingTime.value = Math.max(0, CANDLE_BURN_TIME - elapsed);
  
  // Если свеча догорела, удаляем её
  if (remainingTime.value <= 0) {
    if (props.theme === 'living') {
      livingIconsStore.removeCandlesByIconId(props.icon.id);
    } else {
      reposeIconsStore.removeCandlesByIconId(props.icon.id);
    }
    
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }
};

// Запускаем таймер
watch([lastCandleTime, isCandleBurning], () => {
  if (isCandleBurning.value) {
    updateTimer();
    if (!timerInterval.value) {
      timerInterval.value = setInterval(updateTimer, 1000);
    }
  } else {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }
}, { immediate: true });

onMounted(() => {
  // Очищаем догоревшие свечи при загрузке
  const candles = userCandles.value;
  if (candles.length > 0) {
    const now = Date.now();
    const hasActiveCandles = candles.some(candle => {
      if (!candle.createdAt) return false;
      const candleTime = new Date(candle.createdAt).getTime();
      const elapsed = now - candleTime;
      return elapsed < CANDLE_BURN_TIME;
    });
    
    // Если нет активных свечей, удаляем все
    if (!hasActiveCandles) {
      if (props.theme === 'living') {
        livingIconsStore.removeCandlesByIconId(props.icon.id);
      } else {
        reposeIconsStore.removeCandlesByIconId(props.icon.id);
      }
    }
  }
  
  if (isCandleBurning.value) {
    updateTimer();
    timerInterval.value = setInterval(updateTimer, 1000);
  }
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});

const handleSubmit = async () => {
  // Проверяем, не горит ли уже свеча
  if (isCandleBurning.value) {
    alert(`Пожалуйста, подождите. Свеча еще горит. Осталось: ${remainingTimeText.value}`);
    return;
  }

  // Проверяем, есть ли уже свеча для этой иконы
  // Можно поставить только одну свечу на одну икону
  if (userCandles.value.length > 0) {
    // Проверяем, есть ли активные (горящие) свечи
    const now = Date.now();
    const activeCandles = userCandles.value.filter(candle => {
      if (!candle.createdAt) return false;
      const candleTime = new Date(candle.createdAt).getTime();
      const elapsed = now - candleTime;
      return elapsed < CANDLE_BURN_TIME;
    });
    
    // Если есть активные свечи - блокируем
    if (activeCandles.length > 0) {
      alert(`Пожалуйста, подождите. Свеча еще горит. Осталось: ${remainingTimeText.value}`);
      return;
    }
    
    // Если свеча догорела, удаляем её и позволяем поставить новую (только одну)
    if (props.theme === 'living') {
      livingIconsStore.removeCandlesByIconId(props.icon.id);
    } else {
      reposeIconsStore.removeCandlesByIconId(props.icon.id);
    }
  }

  if (!formState.anonymous && !formState.name) {
    alert('Пожалуйста, введите имя или выберите анонимно');
    return;
  }

  const candleData = {
    iconId: props.icon.id,
    type: "medium",
  };

  // Отправляем имя только если не анонимно
  if (!formState.anonymous && formState.name) {
    candleData.name = formState.name;
  }

  // Проверяем, залогинен ли пользователь
  if (user.value && user.value.accessToken) {
    // Если залогинен - отправляем на бэк
    try {
      const response = await createCandle(candleData);

      if (response) {
        // Сохраняем время установки для залогиненных пользователей
        const candleWithTime = {
          ...candleData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        if (props.theme === 'living') {
          livingIconsStore.addCandle(candleWithTime);
        } else {
          reposeIconsStore.addCandle(candleWithTime);
        }
        
        alert('Свеча успешно установлена');
        formState.name = '';
        formState.anonymous = false;
        emit('candle-submitted', props.icon.id);
        
        // Запускаем таймер
        updateTimer();
        if (!timerInterval.value) {
          timerInterval.value = setInterval(updateTimer, 1000);
        }
      }
    } catch (error) {
      console.error('Error creating candle:', error);
      alert('Ошибка при установке свечи');
    }
  } else {
    // Если не залогинен - сохраняем в localStorage и стор
    if (props.theme === 'living') {
      livingIconsStore.addCandle(candleData);
    } else {
      reposeIconsStore.addCandle(candleData);
    }
    
    alert('Свеча успешно установлена');
    formState.name = '';
    formState.anonymous = false;
    emit('candle-submitted', props.icon.id);
    
    // Запускаем таймер
    updateTimer();
    if (!timerInterval.value) {
      timerInterval.value = setInterval(updateTimer, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
.icon-card {
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
    gap: 1.25rem;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  // Living theme
  &--living {
    border: 1px solid #e8e0d4;
    background: linear-gradient(to bottom, #fefcf9, #faf8f4);

    .icon-visual {
      border: 2px solid #e8e0d4;
      color: #a0907a;
      background: linear-gradient(145deg, #faf8f4, #f5f1ea);
    }

    h3 {
      color: #2c2416;
    }

    p {
      color: #6b5d47;
    }

    .candle-form {
      label {
        color: #3d3325;
      }

      input[type="text"] {
        border: 1.5px solid #d4c9b8;

        &:focus {
          border-color: #b8a082;
          box-shadow: 0 0 0 3px rgba(184, 160, 130, 0.1);
        }

        &.disabled {
          background: #f5f1ea;
          border-color: #e8e0d4;
          color: #a0907a;
        }
      }

      .checkbox {
        color: #5a4a3a;

        input[type="checkbox"] {
          accent-color: #b8a082;
        }
      }

      .submit-candle-btn {
        background: linear-gradient(135deg, #c9a961, #b8964f);
        box-shadow: 0 2px 4px rgba(184, 150, 79, 0.2);

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #b8964f, #a8853d);
          box-shadow: 0 4px 8px rgba(184, 150, 79, 0.3);
        }

        &:disabled {
          background: linear-gradient(135deg, #a89682, #9a8d7a);
          cursor: not-allowed;
          opacity: 0.7;
        }
      }
    }
  }

  // Repose theme
  &--repose {
    border: 1px solid #d8d0c4;
    background: linear-gradient(to bottom, #f8f6f2, #f3f0eb);

    .icon-visual {
      border: 2px solid #d8d0c4;
      color: #9a8d7a;
      background: linear-gradient(145deg, #f3f0eb, #ede8e0);

      img {
        filter: brightness(0.95);
      }
    }

    h3 {
      color: #2a241c;
    }

    p {
      color: #6b5f52;
    }

    .candle-form {
      label {
        color: #3a3228;
      }

      input[type="text"] {
        border: 1.5px solid #c8beb0;
        color: #2a241c;

        &:focus {
          border-color: #a89682;
          box-shadow: 0 0 0 3px rgba(168, 150, 130, 0.1);
        }

        &.disabled {
          background: #f3f0eb;
          border-color: #d8d0c4;
          color: #9a8d7a;
        }
      }

      .checkbox {
        color: #5a4f45;

        input[type="checkbox"] {
          accent-color: #a89682;
        }
      }

      .submit-candle-btn {
        background: linear-gradient(135deg, #8b6f5a, #7a5f4a);
        box-shadow: 0 2px 4px rgba(122, 95, 74, 0.2);

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #7a5f4a, #6a4f3a);
          box-shadow: 0 4px 8px rgba(122, 95, 74, 0.3);
        }

        &:disabled {
          background: linear-gradient(135deg, #7a6b5a, #6a5f4a);
          cursor: not-allowed;
          opacity: 0.7;
        }
      }
    }
  }

  .icon-visual {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    overflow: hidden;
    position: relative;

    @media (min-width: 768px) {
      border-radius: 16px;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
      position: relative;
      z-index: 1;
    }

    span {
      padding: 1rem;
      position: relative;
      z-index: 1;
    }
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  p {
    font-size: 0.9rem;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 0.95rem;
    }
  }

  .user-candles {
    margin-top: 0.5rem;
    padding: 0.75rem;
    border-radius: 8px;
    background: rgba(184, 160, 130, 0.08);
    border: 1px solid rgba(184, 160, 130, 0.2);
    text-align: left;

    @media (min-width: 768px) {
      padding: 1rem;
      border-radius: 10px;
    }

    .user-candles-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.85rem;
      font-weight: 500;

      @media (min-width: 768px) {
        font-size: 0.9rem;
      }

      .candle-component {
        flex-shrink: 0;
        width: 34px;
        height: 80px;
      }

      .user-candles-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex: 1;

        .user-candles-text {
          color: #5a4a3a;
          font-weight: 500;
        }

        .candle-name {
          font-size: 0.8rem;
          color: #5a4a3a;

          @media (min-width: 768px) {
            font-size: 0.85rem;
          }

          &.anonymous {
            font-style: italic;
            color: #8b7355;
          }
        }
      }
    }
  }

  &--repose {
    .user-candles {
      background: rgba(168, 150, 130, 0.08);
      border-color: rgba(168, 150, 130, 0.2);

      .user-candles-header {
        .user-candles-info {
          .user-candles-text {
            color: #5a4f45;
          }

          .candle-name {
            color: #5a4f45;

            &.anonymous {
              color: #7a6b5a;
            }
          }
        }
      }
    }
  }


  .candle-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
    text-align: left;

    label {
      font-size: 0.875rem;
      font-weight: 500;

      @media (min-width: 768px) {
        font-size: 0.9rem;
      }
    }

    input[type="text"] {
      width: 100%;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      background: #fff;
      font-family: inherit;

      @media (min-width: 768px) {
        padding: 0.85rem 1.15rem;
        font-size: 0.95rem;
      }

      &:focus {
        outline: none;
      }

      &.disabled {
        cursor: not-allowed;
      }
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      cursor: pointer;
      user-select: none;

      @media (min-width: 768px) {
        font-size: 0.9rem;
      }

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }

      .submit-candle-btn {
        margin-top: 0.25rem;
        padding: 0.875rem 1.5rem;
        border-radius: 8px;
        border: none;
        color: #fff;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        @media (min-width: 768px) {
          padding: 1rem 1.75rem;
          font-size: 0.95rem;
        }

        &:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .timer-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
  }
}
</style>
