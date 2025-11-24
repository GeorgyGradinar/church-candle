<template>
  <div class="input-block">
    <p class="base-text">{{ title }}</p>
    <div class="wrapper-input">
      <input v-model="data"
             class="input"
             :placeholder="placeholder"
             :type="typeOfInput"
             :class="{'error': error}"
             :disabled="isDisable"
             @input="validation.$touch"
             @blur="validation.$touch"
             maxlength="50">

      <div class="wrapper-eyes" v-if="type === 'password'">
        <PASSWORD_SHOW v-if="typeOfInput === 'password'" filled @click="typeOfInput = 'text'" />
        <CARD_VIEW filled v-else @click="typeOfInput = 'password'" />
      </div>

      <p class="error-message" :class="{'show-error': error}">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import CARD_VIEW from "../../../public/images/svg/auth/password-hide.svg";
import PASSWORD_SHOW from "../../../public/images/svg/auth/password-show.svg";

const props = defineProps({
  title: String,
  placeholder: String,
  validation: Object,
  type: String,
  error: String,
  isDisable: Boolean
});

const data = defineModel("data");

let typeOfInput = ref('text');

onMounted(() => {
  typeOfInput.value = props.type;
});
</script>

<style scoped lang="scss">
.input-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 15px;

  .wrapper-input {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 46px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    border-radius: 8px;

    input {
      width: 100%;
      font-size: 16px;
      font-weight: 200;
      padding: 12px 24px;
      border-radius: 8px;
      transition: all 0.2s;

      &:focus {
        outline: none;
      }

      &.error {
        border: 1px solid red;
      }
    }

    .wrapper-eyes {
      position: absolute;
      right: 15px;

      :deep(svg) {
        cursor: pointer;
        width: 25px;
        height: 25px;
      }
    }

    .error-message {
      position: absolute;
      top: 80%;
      left: 0;
      color: red;
      font-size: 13px;
      font-weight: 300;
      opacity: 0;
      transition: all 0.2s;

      &.show-error {
        top: 100%;
        opacity: 1;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .wrapper-input {
    input {
      font-size: 14px;
      padding: 10px 11px;
    }

    .wrapper-eyes {
      :deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    .error-message {
      font-size: 11px;
    }
  }
}
</style>