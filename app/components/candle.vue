<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useLivingIconsStore } from "~/stores/livingIconsStore.js";
import { useReposeIconsStore } from "~/stores/reposeIconsStore.js";

const props = defineProps({
  candle: {
    type: Object,
    default: null,
  },
  theme: {
    type: String,
    default: 'living',
  },
  iconId: {
    type: [String, Number],
    default: null,
  },
});

const livingIconsStore = useLivingIconsStore();
const reposeIconsStore = useReposeIconsStore();

const maxHeightFlame = -380;
const minHeightFlame = -100;

const maxTopWax = -360;
const minTopWax = -90;
const maxHeightWax = 307;
const minHeightWax = 40;

const maxTopWick = -255;
const minTopWick = 14;

let currentTopFlame = ref(maxHeightFlame);
let currentTopWax = ref(maxTopWax);
let currentHeightWax = ref(maxHeightWax);
let currentTopWick = ref(maxTopWick);

const remainingSeconds = ref(0);
const timerInterval = ref(null);
const CANDLE_BURN_TIME = 60 * 500; // 1 минута в миллисекундах

// Обновляем таймер каждую секунду
const updateTimer = () => {
  remainingSeconds.value = 0;

  const now = Date.now();
  const candleTime = new Date(props.candle.createdAt).getTime();
  const elapsed = now - candleTime;
  const remaining = Math.max(0, CANDLE_BURN_TIME - elapsed);
  remainingSeconds.value = Math.ceil(remaining / 1000);

  // Вычисляем процент оставшегося времени (100% = maxHeightFlame, 0% = minHeightFlame)
  const remainingPercent = (remaining / CANDLE_BURN_TIME) * 100;

  // Вычисляем высоту пламени на основе процента оставшегося времени
  // maxHeightFlame (-380) = 100%, minHeightFlame (-100) = 0%
  const heightDifferenceFlame = maxHeightFlame - minHeightFlame;
  const candleHeightFlame = minHeightFlame + (heightDifferenceFlame * (remainingPercent / 100));
  currentTopFlame.value = candleHeightFlame;

  // Вычисляем top и height воска на основе процента оставшегося времени
  // maxTopWax (-360) = 100%, minTopWax (-90) = 0%
  // maxHeightWax (307) = 100%, minHeightWax (40) = 0%
  const topDifferenceWax = maxTopWax - minTopWax;
  const heightDifferenceWax = maxHeightWax - minHeightWax;
  const candleTopWax = minTopWax + (topDifferenceWax * (remainingPercent / 100));
  const candleHeightWax = minHeightWax + (heightDifferenceWax * (remainingPercent / 100));
  currentTopWax.value = candleTopWax;
  currentHeightWax.value = candleHeightWax;

  // Вычисляем top фитиля на основе процента оставшегося времени
  // maxTopWick (-255) = 100%, minTopWick (14) = 0%
  const topDifferenceWick = maxTopWick - minTopWick;
  const candleTopWick = minTopWick + (topDifferenceWick * (remainingPercent / 100));
  currentTopWick.value = candleTopWick;

  // Выводим в консоль
  console.log(`Осталось времени: ${ remainingPercent.toFixed(2) }%, Высота пламени: ${ candleHeightFlame.toFixed(2) }px, Top воска: ${ candleTopWax.toFixed(2) }px, Высота воска: ${ candleHeightWax.toFixed(2) }px, Top фитиля: ${ candleTopWick.toFixed(2) }px`);

  // Если свеча догорела, удаляем её
  if (remainingSeconds.value <= 0) {
    remainingSeconds.value = 0;
    const iconId = props.iconId;
    const candleId = props.candle.id;
    if (props.theme === 'living') {
      console.log('living')
      livingIconsStore.removeCandleByIconAndCandleId(iconId, candleId);
    } else {
      console.log('reposeIconsStore')
      reposeIconsStore.removeCandlesByIconId(iconId, candleId);
    }
  }
};

onMounted(() => {
  updateTimer();
  timerInterval.value = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<template>
  <div v-if="candle && candle.createdAt" class="candle">
    <div class="flame" :style="{ top: `${currentTopFlame}px` }">
      <div class="shadows"></div>
      <div class="top"></div>
      <div class="middle"></div>
      <div class="bottom"></div>
    </div>
    <div class="wick" :style="{ top: `${currentTopWick}px` }"></div>
    <div class="wax" :style="{ top: `${currentTopWax}px`, height: `${currentHeightWax}px` }"></div>
  </div>
</template>

<style scoped lang="scss">
$flame-height: 150px;
$wick-height: 50px;
$orange: #ff6a00;
$orange-yellow: #ff9224;
$dark: #2c2b39;
$blue-dark: #30537d;
$blue-light: #76daff;
$yellow: #fbf348;
$yellow-grey: #58523a;

.candle {
  width: 34px;
  margin: -150px auto 0 auto;
  position: relative;
  height: 80%;
  align-self: flex-end;
  animation: blink .1s infinite;
  z-index: 100;
}

.wick {
  position: absolute;
  width: 6px;
  height: $wick-height;
  background: #23161a;
  top: -255px;
  left: 50%;
  transform: translateX(-50%) skewX(2deg);
  transition: top 1s;
  //animation: decreaseHeightWick 60s linear;
  border-radius: 10%;
  box-shadow: 0 0 2px 0px black;

  &:before {
    content: '';
    position: absolute;
    width: 0;
    left: 50%;
    height: 10px;
    box-shadow: 0 -14px 10px 8px white,
    0 -10px 10px 8px rgba(255, 215, 0, 0.7), //gold
    0 -3px 10px 8px rgba(255, 106, 0, 0.7), //orange
    0 6px 3px 4px black;
  }

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0px;
    height: 0px;
    box-shadow: 0 5px 2px 3px gold,
    0 20px 2px 14px gold,
    0 -6px 4px 5px rgba(98, 33, 27, 0.8), //dark orange
    0 0px 1px 4px rgba(255, 106, 0, 0.7), //orange
    0 0px 3px 4px $orange,
    0 5px 3px 4px gold;
  }
}

.flame {
  width: 20px;
  height: $flame-height;
  top: -380px;
  margin: 0px auto;
  position: relative;
  animation: move 3s infinite, move-left 3s infinite;
  transition: top 1s;
  //animation: move 3s infinite, move-left 3s infinite, decreaseHeightFlame 60s linear;
  transform-origin: 50% 90%;

  .top {
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: white;
    border-top-left-radius: 500%;
    border-bottom-left-radius: 50px;
    border-top-right-radius: 500%;
    border-bottom-right-radius: 50px;
    transform: skewY(-10deg);
    box-shadow: 0 0px 0px 3px white,
    0 -20px 1px 4px white,
    0 -25px 2px 3px gold,
    0 -30px 5px 4px $orange, //top
    0 0px 150px 10px $orange, //global
    0 -10px 2px 4px white,
    0 -5px 3px 3px white;
    animation: flame-up 4s infinite;
  }

  .shadows {
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 5px 20px 15px gold,
    0 0px 100px 20px $orange,
    0 15px 50px 15px $orange,
    5px 30px 5px 13px $orange,
    5px 50px 5px 13px $orange,
    0 75px 50px 30px black;
  }

  .bottom {
    transform: scale(0.9);
    position: absolute;
    bottom: 6px;
    left: 9px;
    width: 1px;
    height: 8px;
    border-radius: 1%;
    background: $dark;
    box-shadow: 0 6px 10px 12px rgba(60, 76, 125, 0.3), //dark blue
    0 0px 4px 8px $dark,
    0 -12px 10px 8px rgba(255, 106, 0, 0.5), //orange
    0 5px 7px 12px $dark,
    0 -3px 10px 12px $dark,
    5px -10px 10px 5px red,
    0 -15px 10px 10px gold,
    5px -25px 10px 5px gold,
    0 2px 5px 10px $blue-dark,
    0 -2px 2px 14px $blue-light,
    0 2px 10px 12px $blue-light;
  }
}

.wax {
  position: relative;
  top: -360px;
  width: 100%;
  height: 307px;
  background: $orange-yellow;
  background: -moz-linear-gradient(top, $orange-yellow 0px, $orange-yellow 20px, $yellow-grey 50px); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, $orange-yellow 0px, $orange-yellow 20px, $yellow-grey 50px); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, $orange-yellow 0px, $orange-yellow 20px, $yellow-grey 50px); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff9224', endColorstr='#58523a', GradientType=0); /* IE6-9 */
  //animation: decreaseHeight 60s linear;
  transition: top 1s, height 1s;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: inset 0 7px 12px -2px $yellow,
  inset 0 9px 57px -3px rgba(255, 0, 0, 0.4),
  inset 0 -5px 8px 2px black,
  0 0 3px 0px $orange;
}

@keyframes move {
  0% {
    transform: skewX(2deg) skewY(5deg)
  }
  50% {
    transform: skewX(-2deg) skewY(-0deg)
  }
  100% {
    transform: skewX(2deg) skewY(5deg)
  }
}

@keyframes move-left {
  50% {
    transform: skewX(3deg);
  }
}

@keyframes flame-up {
  50% {
    box-shadow: 0 0px 0px 3px white,
    0 -38px 1px 2px white,
    0 -41px 2px 3px gold,
    0 -50px 5px 4px $orange, //orange top
    0 0px 150px 10px $orange, //orange global
    0 -10px 2px 4px white,
    0 -5px 3px 3px white;
  }
}

@keyframes blink {
  50% {
    opacity: 0.95;
  }
}

@keyframes decreaseHeight {
  0% {
    top: -360px;
    height: 307px;
  }
  100% {
    top: -90px;
    height: 40px;
  }
}

@keyframes decreaseHeightFlame {
  0% {
    top: -380px;
  }
  100% {
    top: -100px;
  }
}

@keyframes decreaseHeightWick {
  0% {
    top: -255px;
  }
  100% {
    top: 14px;
  }
}
</style>